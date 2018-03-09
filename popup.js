let theNum = 0;
chrome.storage.sync.get('note-current-index', (idxObj) => {
  console.log('idxObj:', idxObj);
  const numNotes = idxObj['note-current-index'];
  theNum = numNotes;
  for (let i = 0; i < numNotes; i++) {
    chrome.storage.sync.get(`notecontainer${i}`, (noteContainerObj) => {
      console.log('noteContainerObj:', noteContainerObj);
      const unwrappedContainerKey = 'notecontainer' + i;
      const unwrappedContainer = noteContainerObj[unwrappedContainerKey];
      console.log('unwrappedContainer:', unwrappedContainer);
      const noteKey = 'note' + i;
      const note = unwrappedContainer[noteKey];
      const noteUrlKey = 'note-url' + i;
      const noteUrl = unwrappedContainer[noteUrlKey];
      console.log(`in popup.js, ${noteKey}: ${note}`);
      console.log(`in popup.js, ${noteUrlKey}: ${noteUrl}`);
      console.log('i:', i);
      // const key = `note${i}`;
      const markup = `
        <div class=noteContainer>
          <div class="note"> ${noteKey}: ${note}</div>
          <div class="url">url: <a href=${noteUrl}>${noteUrl}</a></div>
          <div class="timestamp">time</div>
          <div class="annotation" id='annotation${i}'></div>
          <form class="hello-world">
            <input type="text" placeholder="Add annotation here...">
            <input type="button" id="button${i}" value="clickme">
          </form>
        </div> 
      `;
      document.body.innerHTML += markup;
      const el = document.getElementById(`button${i}`);

      console.log(`el for annotation${i}: ${el}`);

      // const f = () => console.log(`button corresponding to annotation${i} clicked`);

      // el.addEventListener('click', f);

      // const onclickCallback = () => console.log(`button${i} was clicked`);
      console.log(`element ${i}: ${e}`);
      if (el.addEventListener) {
        el.addEventListener("submit", function(evt) {
            evt.preventDefault();
            // window.history.back();
        }, false);
      }

      const annotation = document.getElementById('annotation' + i).value
      console.log('annotation area:', annotation);
    });
  }

  

});

document.querySelectorAll('.button').forEach(el => el.addEventListener('click', () => console.log('button clicked!')));