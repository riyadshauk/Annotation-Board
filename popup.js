chrome.storage.sync.get('note-current-index', (idxObj) => {
  const numNotes = idxObj['note-current-index'];
  for (let i = 0; i < numNotes; i++) {
    chrome.storage.sync.get(`note${i}`, (noteObj) => {
      console.log('noteObj:', noteObj);
      console.log('i:', i);
      document.getElementsByTagName('body')[0].textContent += `note${i}: `;
      document.getElementsByTagName('body')[0].textContent += noteObj[`note${i}`];
      document.getElementsByTagName('body')[0].textContent += '\n\n'

      // const key = `note${i}`;

      // const node = document.createElement('div');
      // const t = docucment.createTextNode(`${key}: ${noteObj[key]}`);
      // node.appendChild(t);
      // document.getElementById('app-content').appendChild(node);
    });
  }
});