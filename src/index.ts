import * as monaco from 'monaco-editor'
import { setDiagnosticsOptions } from 'monaco-yaml'

setDiagnosticsOptions({
  enableSchemaRequest: true,
  hover: true,
  completion: true,
  validate: true,
  format: true,
  schemas: [],
})

monaco.editor.create(document.body, {
  language: 'yaml',
  model: monaco.editor.createModel(
    `# yaml-language-server: $schema=./abe.ads.schema.json
  - name: abe.ads
    payload:
      - ua: .*
        iframe: |
          display: none;
        html: |
          <html>
          <head>
          <script>window.top.DM.later("bundle",function(){window.top.DM.molFeAdblockerDialog.init();var count=0;function check(){var bodyChildren=window.top.document.body.children;for(var i=bodyChildren.length-1;i>=0;i--){var bc=bodyChildren[i];if(bc.tagName==="DIV"){var divChildren=bc.getElementsByTagName("DIV");for(var j=0;j<divChildren.length;j++){var dv=divChildren[j];if(dv.textContent&&dv.textContent.indexOf&&dv.textContent.indexOf("using an ad blocker")!==-1){if(!window.getComputedStyle||window.getComputedStyle(dv).display!=="none"){window.top.postMessage("__abe_ad_visible","*")}return}}}}if(count++<10){setTimeout(function(){check()},1e3)}}check()});</script>
          <body></body>
          </html>`,
    'yaml',
    monaco.Uri.parse('a://b/foo.yaml')
  ),
})
