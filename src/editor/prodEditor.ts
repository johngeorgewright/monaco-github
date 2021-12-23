import type { Editor } from 'codemirror'
import { editor, Uri } from 'monaco-editor'
import { setDiagnosticsOptions } from 'monaco-yaml'
import { dirname, extname, isAbsolute, resolve as resolvePath } from 'path'
import '../types/Window'

export default async function prodEditor(editorElement: HTMLElement) {
  window.MonacoEnvironment = {
    getWorker(_moduleId, label) {
      switch (label) {
        case 'css':
        case 'less':
        case 'scss':
          return new Worker(chrome.runtime.getURL('css.worker.js'))
        case 'handlebars':
        case 'html':
        case 'razor':
          return new Worker(chrome.runtime.getURL('html.worker.js'))
        case 'json':
          return new Worker(chrome.runtime.getURL('json.worker.js'))
        case 'javascript':
        case 'typescript':
          return new Worker(chrome.runtime.getURL('ts.worker.js'))
        case 'yaml':
          return new Worker(chrome.runtime.getURL('yaml.worker.js'))
        default:
          return new Worker(chrome.runtime.getURL('editor.worker.js'))
      }
    },
  }

  const [tab] = await chrome.tabs.query({ active: true })
  if (!tab?.id) return

  const uri = Uri.parse(tab.url || '://')
  const contents = await getPageValue(tab.id)
  const schemaInfo = /ya?ml$/.test(extname(uri.path))
    ? await getSchema(contents, uri)
    : undefined

  setDiagnosticsOptions({
    enableSchemaRequest: false,
    hover: true,
    completion: true,
    validate: true,
    format: true,
    schemas: schemaInfo
      ? [
          {
            uri: schemaInfo.path,
            fileMatch: ['*'],
            schema: schemaInfo.schema,
          },
        ]
      : [],
  })

  editor.create(editorElement, {
    model: editor.createModel(contents, undefined, uri),
  })

  document.getElementById('save')?.addEventListener('click', async () => {
    const value = editor.getModel(uri)?.getValue()
    try {
      if (value) await setPageValue(tab.id!, value)
      window.close()
    } catch (error) {
      alert('There was an error trying to save the document.')
    }
  })

  document.getElementById('cancel')?.addEventListener('click', () => {
    window.close()
  })
}

async function getSchema(yaml: string, currentURI: Uri) {
  const matches = /#\s*yaml-language-server:\s*\$schema\s*=\s*(.+)$/m.exec(yaml)
  if (!matches) return
  let [, path] = matches
  if (!isAbsolute(path)) path = resolvePath(dirname(currentURI.path), path)
  try {
    const response = await fetch(
      Uri.from({
        ...currentURI,
        path: path.replace('/edit/', '/raw/'),
      }).toString()
    )
    return {
      schema: await response.json(),
      path,
    }
  } catch (error) {
    return
  }
}

function getPageValue(tabId: number) {
  return new Promise<string>((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        world: 'MAIN',
        func: () =>
          (
            document.querySelector('.CodeMirror') as CodeMirrorElement
          )?.CodeMirror?.getValue() || '',
      },
      ([{ result: editorValue }]) => {
        resolve(editorValue)
      }
    )
  })
}

function setPageValue(tabId: number, value: string) {
  return new Promise<void>((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        world: 'MAIN',
        args: [value],
        func: (value) =>
          (
            document.querySelector('.CodeMirror') as CodeMirrorElement
          )?.CodeMirror?.setValue(value),
      },
      () => resolve()
    )
  })
}

interface CodeMirrorElement extends HTMLDivElement {
  CodeMirror?: Editor
}
