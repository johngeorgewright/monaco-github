chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable()
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            css: ['.CodeMirror'],
            pageUrl: { hostEquals: 'github.com', pathContains: '/edit/' },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ])
  })
})
