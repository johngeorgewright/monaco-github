import { editor } from 'monaco-editor'
import '../types/Window'

export default function devEditor(editorElement: HTMLElement) {
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
  editor.create(editorElement, {
    language: 'yaml',
    value: '',
  })
}
