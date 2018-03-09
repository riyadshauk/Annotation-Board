chrome.storage.sync.get('note-current-index', (idxObj) => {
  console.log('idxObj:', idxObj);
  const numNotes = idxObj['note-current-index'] + 1;
  const clearButton = document.createElement('input');
  clearButton.setAttribute('class', 'button');
  clearButton.setAttribute('type', 'button');
  clearButton.setAttribute('action', 'submit');
  clearButton.setAttribute('value', '((Clear Board))');
  document.body.appendChild(clearButton);

  clearButton.addEventListener('click', () => chrome.storage.sync.clear());

  for (let i = 0; i < numNotes; i++) {
    chrome.storage.sync.get(`notecontainer${i}`, (noteContainerObj) => {
      const unwrappedContainerKey = 'notecontainer' + i;
      const unwrappedContainer = noteContainerObj[unwrappedContainerKey];
      const noteKey = 'note' + i;
      const note = unwrappedContainer[noteKey];
      const noteUrlKey = 'note-url' + i;
      const noteUrl = unwrappedContainer[noteUrlKey];

      const annotationInputElement = document.createElement('input');
      annotationInputElement.setAttribute('class', 'annotation-input');
      annotationInputElement.setAttribute('id', `annotation-input${i}`);
      annotationInputElement.setAttribute('type', 'text');
      annotationInputElement.setAttribute('placeholder', 'Add annotation here...');

      const formElement = document.createElement('form');
      formElement.appendChild(annotationInputElement);

      const inputButton = document.createElement('input');
      inputButton.setAttribute('class', 'button');
      inputButton.setAttribute('type', 'button');
      inputButton.setAttribute('id', `button${i}`);
      inputButton.setAttribute('value', 'Add note! : D');

      const noteContainer = document.createElement('div');
      noteContainer.setAttribute('class', 'noteContainer');
      noteContainer.innerHTML = `
          <div class="note"> <strong>${noteKey}</strong>: ${note}</div>
          <div class="url"><strong>url:</strong> <a href="${noteUrl}">${noteUrl}</a></div>
          <div class="timestamp"><strong>timestamp:</strong> {Coming soon, in version 2.0! insert time here}</div>
        `;
    
      formElement.appendChild(inputButton);

      noteContainer.appendChild(formElement);

      document.body.appendChild(noteContainer);

      document.getElementById(`annotation-input${i}`).addEventListener('keyup', (evt) => {
        evt.preventDefault();
        if (evt.keyCode === 13) {
          console.log('Enter pressed.');
          document.getElementById(`button${i}`).click();
        }
      });

      chrome.storage.sync.get(`annotation${i}`, (annotationsObj) => {
        const annotationKey = `annotation${i}`;
        if (!annotationsObj[annotationKey]) return;
        const annotations = annotationsObj[annotationKey];
        annotations.forEach((annotationText) => {
          const annotationElement = document.createElement('div');
          annotationElement.setAttribute('class', 'annotation');
          annotationElement.innerText = annotationText;
          document.getElementById(`button${i}`).parentElement.parentElement.appendChild(annotationElement);
        });
      });

      let annotation = '';

      inputButton.addEventListener('click', function() {
        annotation = this.previousSibling.value;
        const annotationElement = document.createElement('div');
        annotationElement.setAttribute('class', 'annotation');
        annotationElement.innerText = annotation;
        const annotationKey = 'annotation' + i;
        const buttonKey = 'button' + i;
        chrome.storage.sync.get(annotationKey, (annotationsObj) => {
          const annotations = annotationsObj[annotationKey] ? annotationsObj[annotationKey] : [];
          annotations.push(annotation);
          const o = {};
          o[annotationKey] = annotations;
          chrome.storage.sync.set(o, () => {
            annotations.forEach((annotationText) => {
              const annotationElement = document.createElement('div');
              annotationElement.setAttribute('class', 'annotation');
              annotationElement.innerText = annotationText;
              const annotationDiv = document.getElementById(annotationKey);
              document.getElementById(buttonKey).parentElement.parentElement.appendChild(annotationElement);
            });
          });
        });
      });
    });
  }
});