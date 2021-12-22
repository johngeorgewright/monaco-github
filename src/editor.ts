import 'core-js/stable'
import 'regenerator-runtime'
import type { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema'
import * as monaco from 'monaco-editor'
import { setDiagnosticsOptions } from 'monaco-yaml'
import './editor.scss'
import { Editor } from 'codemirror'

createEditor().catch(console.error)

async function createEditor() {
  const editorElement = document.querySelector('main')
  if (!editorElement) return

  if (window.chrome?.tabs) {
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

    const schemaURL = tab.url
      ?.replace('/edit/', '/raw/')
      .replace(/\.ya?ml$/, '.schema.json')

    setDiagnosticsOptions({
      enableSchemaRequest: false,
      hover: true,
      completion: true,
      validate: true,
      format: true,
      schemas:
        tab.url && schemaURL
          ? [
              {
                uri: './abe.ads.schema.json',
                fileMatch: ['*'],
                schema: await getSchema(schemaURL),
              },
            ]
          : [],
    })

    monaco.editor.create(editorElement, {
      model: monaco.editor.createModel(
        await getPageValue(tab.id),
        undefined,
        monaco.Uri.parse(tab.url || '://')
      ),
    })
  } else {
    window.MonacoEnvironment = {
      getWorkerUrl(_moduleId, label) {
        switch (label) {
          case 'css':
          case 'less':
          case 'scss':
            return './css.worker.js'
          case 'handlebars':
          case 'html':
          case 'razor':
            return './html.worker.js'
          case 'json':
            return './json.worker.js'
          case 'javascript':
          case 'typescript':
            return './ts.worker.js'
          case 'yaml':
            return './yaml.worker.js'
          default:
            return './editor.worker.js'
        }
      },
    }
    monaco.editor.create(editorElement, {
      language: 'yaml',
      value: '',
    })
  }
}

function getSchema(schemaURL: string) {
  return fetch(schemaURL)
    .then(
      (response) => response.json() as JSONSchema4 | JSONSchema6 | JSONSchema7
    )
    .catch(() => ({}))
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

declare global {
  interface Window {
    MonacoEnvironment: monaco.Environment
  }
}

interface CodeMirrorElement extends HTMLDivElement {
  CodeMirror?: Editor
}
