import 'core-js/stable'
import 'regenerator-runtime'
import './editor.scss'
import prodEditor from './prodEditor'
import devEditor from './devEditor'

createEditor().catch(console.error)

async function createEditor() {
  const editorElement = document.querySelector('main')
  if (!editorElement) return

  if (isProd()) {
    await prodEditor(editorElement)
  } else {
    devEditor(editorElement)
  }
}

function isProd() {
  return !!window.chrome?.tabs
}
