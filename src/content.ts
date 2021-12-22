import { Editor } from 'codemirror'

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message === 'getEditorValue') sendResponse(getEditorValue())
})

function getEditorValue() {
  const codeMirrorEl = document.querySelector('.CodeMirror') as CodeMirrorEl
  if (!codeMirrorEl) return ''
  return codeMirrorEl.CodeMirror?.getValue()
}

interface CodeMirrorEl extends HTMLDivElement {
  CodeMirror?: Editor
}
