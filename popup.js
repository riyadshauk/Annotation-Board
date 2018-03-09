// @todo get annotating working properly

let theNum = 0;
chrome.storage.sync.get('note-current-index', (idxObj) => {
  console.log('idxObj:', idxObj);
  const numNotes = idxObj['note-current-index'] + 1;
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

      // <form id="form${i}">
      //   <input class="annotation-input" type="text" placeholder="Add annotation here...">
      // </form>
      const formElement = document.createElement('form');
      formElement.innerHTML = '<input class="annotation-input" type="text" placeholder="Add annotation here...">';

      // <input class="button" type="button" id="button${i}" value="clickme">
      const inputButton = document.createElement('input');
      inputButton.setAttribute('class', 'button');
      inputButton.setAttribute('type', 'button');
      inputButton.setAttribute('id', `button${i}`);
      inputButton.setAttribute('value', 'Add note! : D');

      const noteContainer = document.createElement('div');
      noteContainer.setAttribute('class', 'noteContainer');
      noteContainer.innerHTML = `
          <div class="note"> <strong>${noteKey}</strong>: ${note}</div>
          <div class="url"><strong>url:</strong> <a=${noteUrl}>${noteUrl}</a></div>
          <div class="timestamp"><strong>timestamp:</strong> {Coming soon, in version 2.0! insert time here}</div>
        `;
    
      formElement.appendChild(inputButton);

      noteContainer.appendChild(formElement);

      document.body.appendChild(noteContainer);

      let annotation = '';

      inputButton.addEventListener('click', function() {
        console.log(`button${i} clicked, this: ${this}`);
        console.log('this', this);
        // console.log('this.parentElement', this.parentElement);
        annotation = this.previousSibling.value;
        console.log(`The user typed the following annotation: ${annotation}`);
        const annotationElement = document.createElement('div');
        annotationElement.setAttribute('class', 'annotation');
        annotationElement.innerText = annotation;
        // this.parentElement.parentElement.appendChild(annotationElement);
        const annotationKey = 'annotation' + i;
        chrome.storage.sync.get(annotationKey, (annotationsObj) => { // @todo annotating
          console.log('getting annotations from chrome storage before setting new annotation');
          const annotations = annotationsObj[annotationKey] ? JSON.parse(annotationsObj[annotationKey]) : [];
          annotations.push(annotation);
          const stringifiedAnnotations = JSON.stringify(annotations);
          chrome.storage.sync.set({annotationKey: stringifiedAnnotations}, () => {
            console.log(`updated annotations Array`);
            console.log('i:', i);
          });
        });
      });

      chrome.storage.sync.get(`annotation${i}`, (annotationsObj) => { // @todo fix up annotating here
        console.log('getting annotations from chrome storage...')
        const annotationKey = `annotation${i}`;
        if (!annotationsObj[annotationKey]) return;
        const annotations = JSON.parse(annotationsObj[annotationKey]);
        annotations.forEach((annotationText) => {
          const annotationElement = document.createElement('div');
          annotationElement.setAttribute('class', 'annotation');
          annotationElement.innerText = annotationText;
          const annotationDiv = document.getElementById(`annotation${i}`);
          console.log('annotationDiv:', annotationDiv);
          document.getElementById(`annotation${i}`).parentElement.parentElement.appendChild(annotationElement);
        });
      });

    });
  
  }
});

