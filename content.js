// @todo ifttt.com for google drive integration?

const getSelectionText2 = () => { // https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
  let text = "";
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
  }
  return text;
};

chrome.runtime.onMessage.addListener((message) => {
  if (message === 'addnote') {
    console.log('"addnote" event/message fired. Attempting to add note. (@todo)');
    const selection = getSelectionText2();
    console.log('selection:', selection);
    console.log('document:', document);   

    chrome.storage.sync.get("note-current-index", (idxObj) => {
      const currentIdx = typeof idxObj['note-current-index'] === 'number' ? idxObj['note-current-index'] + 1 : 0;
      const keyString = `note${currentIdx}`;
      const urlString = `note-url${currentIdx}`
      const noteTimeKey = `note-time${currentIdx}`;
      const noteNameKey = `note-name${currentIdx}`;
      console.log('in main.js, getting "note-current-index" from storage. currentIdx:', currentIdx);
      const o = {};
      o[keyString] = selection;
      o[urlString] = window.location.href;
      o[noteTimeKey] = Date();
      const maxLen = 30;
      o[noteNameKey] = document.title.length > 15 ? document.title.replace(/\s*$/,'').substring(0, maxLen - 1) + '...' : document.title.replace(/\s*$/,'');
      objWrapper = {};
      const objWrapperKey = 'notecontainer' + currentIdx;
      console.log('objWrapperKey:', objWrapperKey);
      objWrapper[objWrapperKey] = o;
      console.log("o after setting key and url", o);
      chrome.storage.sync.set(objWrapper, () => {
        console.log(`selection, "${selection}", saved to chrome.storage with key of ${keyString}`);
        chrome.storage.sync.set({"note-current-index": currentIdx}, () => {
          console.log(`updated note-current-index to ${currentIdx}`);
          console.log('currentIdx:', currentIdx);
        });
      });
    });
  }
});
