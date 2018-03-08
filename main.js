const getSelectionText = () => { // https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
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
    const selection = getSelectionText();
    console.log('selection:', selection);
    // document.getElementById('app-content').innerHTML = 'hello';
    console.log('document:', document);

    // chrome.storage.sync.set({'note': selection}, () => {
    //   console.log(`updated note-current-index to ${currentIdx}`);
    //   console.log('currentIdx:', currentIdx);
    // });    

    chrome.storage.sync.get("note-current-index", (idxObj) => {
      const currentIdx = typeof idxObj['note-current-index'] === 'number' ? idxObj['note-current-index'] + 1 : 0;
      const keyString = `note${currentIdx}`;
      console.log('in main.js, getting "note-current-index" from storage. currentIdx:', currentIdx);
      const o = {};
      o[keyString] = selection;
      chrome.storage.sync.set(o, () => {
        console.log(`selection, "${selection}", saved to chrome.storage with key of ${keyString}`);
        chrome.storage.sync.set({"note-current-index": currentIdx}, () => {
          console.log(`updated note-current-index to ${currentIdx}`);
          console.log('currentIdx:', currentIdx);
        });
      });
    });
  }
});
