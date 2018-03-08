const getSelectionText = () => { // https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
  let text = "";
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
  }
  return text;
};

chrome.contextMenus.create({
  contexts: ['all'],
  title: 'Add selection to notes...',
  onclick: (info, tab) => {
    console.log('in background.js running getSelectionText:', getSelectionText());
    chrome.tabs.sendMessage(tab.id, 'addnote');
  }
});

const updatePopupHtml = () => undefined; // @todo link to popup.js somehow..?

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    console.log('in background.js -- a change detected in storage sync.');
    console.log('changes:', changes);
    const keys = Object.keys(changes);
    console.log('in background.js keys:', keys);
    keys.forEach(k => k !== 'note-current-index' ? updatePopupHtml(changes[k].newValue) : undefined);
  }
});