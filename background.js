const getSelectionText = () => { // https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
  let text = "";
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
  }
  return text;
};

if (chrome.contextMenus) {
  chrome.contextMenus.create({
    contexts: ['all'],
    title: 'Add selection to notes...',
    onclick: (info, tab) => {
      console.log('in background.js running getSelectionText:', getSelectionText());
      chrome.tabs.sendMessage(tab.id, 'addnote');
    }
  });
}