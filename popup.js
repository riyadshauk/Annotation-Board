chrome.storage.sync.get('note-current-index', (idxObj) => {
  console.log('idxObj:', idxObj);
  const numNotes = idxObj['note-current-index'] + 1;
  const clearButton = document.createElement('input');
  clearButton.setAttribute('class', 'clear');
  clearButton.setAttribute('type', 'button');
  clearButton.setAttribute('action', 'submit');
  clearButton.setAttribute('value', '((Clear Board –– cannot be undone!))');
  document.body.appendChild(clearButton);

  clearButton.addEventListener('click', () => {
    let oldStorage;
    chrome.storage.sync.get(null, (items) => {
      var allKeys = Object.keys(items);
      console.log('all storage:', items);
      oldStorage = items;
      chrome.storage.sync.clear(() => {
        const oldStorageObj = {};
        oldStorageObj.clearedStorage = oldStorage;
        chrome.storage.sync.set(clearedStorage);
      })
    });
  });

  const undoClearButton = document.createElement('input');
  undoClearButton.setAttribute('class', 'undoClear');
  undoClearButton.setAttribute('type', 'button');
  undoClearButton.setAttribute('action', 'submit');
  undoClearButton.setAttribute('value', '((Undo Last Clear))');
  document.body.appendChild(undoClearButton);

  undoClearButton.addEventListener('click', () => {
    console.log('@todo: get data from old-notecontainer{i} and old-annotation{i}, then set those');
    chrome.storage.sync.get('clearedStorage', (items) => {
      console.log('clearedStorage items:', items);
      Array.from(items).forEach(e => {
        console.log('item previousl cleared:', e);
        chrome.storage.sync.set(e)
      });
    });
  });

  for (let i = 0; i < numNotes; i++) {
    chrome.storage.sync.get(`notecontainer${i}`, (noteContainerObj) => {
      const unwrappedContainerKey = 'notecontainer' + i;
      const unwrappedContainer = noteContainerObj[unwrappedContainerKey];
      const noteKey = 'note' + i;
      const note = unwrappedContainer[noteKey];
      const noteUrlKey = 'note-url' + i;
      const noteUrl = unwrappedContainer[noteUrlKey];
      const noteTimeKey = 'note-time' + i;
      const noteTime = unwrappedContainer[noteTimeKey];
      const noteNameKey = 'note-name' + i;
      const noteName = unwrappedContainer[noteNameKey];

      const annotationInputElement = document.createElement('input');
      annotationInputElement.setAttribute('class', 'annotation-input');
      annotationInputElement.setAttribute('id', `annotation-input${i}`);
      annotationInputElement.setAttribute('type', 'text');
      annotationInputElement.setAttribute('placeholder', 'Add annotation here...');

      const formElement = document.createElement('form');
      formElement.setAttribute('id', `form${i}`);
      formElement.appendChild(annotationInputElement);

      const inputButton = document.createElement('input');
      inputButton.setAttribute('class', 'button');
      inputButton.setAttribute('type', 'button');
      inputButton.setAttribute('id', `button${i}`);
      inputButton.setAttribute('value', 'Add note! : D');

      const noteContainer = document.createElement('div');
      noteContainer.setAttribute('class', 'noteContainer');
      noteContainer.innerHTML = `
          <div class="note"> <strong>${noteName}</strong>: ${note}</div>
          <div class="url"><strong>url:</strong> <a href="${noteUrl}">${noteUrl}</a></div>
          <div class="timestamp"><strong>timestamp:</strong> ${noteTime}</div>
        `;
    
      formElement.appendChild(inputButton);

      noteContainer.appendChild(formElement);

      document.body.appendChild(noteContainer);

      document.getElementById(`form${i}`).addEventListener('submit', (evt) => {
        evt.preventDefault();
        document.getElementById(`button${i}`).click();
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

      inputButton.addEventListener('click', function(evt) {
        annotation = this.previousSibling.value;
        this.previousSibling.value = '';
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
            const noteContainer = document.getElementById(buttonKey).parentElement.parentElement;
            const renderedAnnotations = noteContainer.getElementsByClassName('annotation');
            Array.from(renderedAnnotations).forEach(e => e.remove());
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