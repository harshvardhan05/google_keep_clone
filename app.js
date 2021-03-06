class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    this.title = "";
    this.text = "";
    this.id = "";

    this.$main = document.querySelector(".main")
    this.$form = document.querySelector("#form");
    this.$notes = document.querySelector("#notes");
    this.$placeholder = document.querySelector("#placeholder");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.$noteText = document.querySelector("#note-text");
    this.$formButtons = document.querySelector("#form-buttons");
    this.$formCloseButtton = document.querySelector("#form-close-button")
    this.$modal = document.querySelector(".modal")
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalCloseButton = document.querySelector('.modal-close-buttton');
    this.$colorTooltip = document.querySelector('#color-tooltip')

    this.renderNotes();
    this.addEventListeners();
  }

  addEventListeners() {

    document.body.addEventListener("click", event => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    document.body.addEventListener('mouseover', event => {
      this.openTooltip(event);
    })

    document.body.addEventListener('mouseout', event => {
      this.closeTooltip(event);
    })

    this.$colorTooltip.addEventListener('mouseover', function() {
      this.style.display = 'flex';
    })

    this.$colorTooltip.addEventListener('mouseout', function() {
      this.style.display = 'none';
    })

    this.$colorTooltip.addEventListener('click', event => {
      const color = event.target.dataset.color;
      if(color){
        this.editNoteColor(color);
      }
    })

    this.$form.addEventListener("submit", event => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;
      if (hasNote) {
        //add note
        this.addNote({ title, text });
      }
    });

    this.$formCloseButtton.addEventListener("click", event => {
      event.stopPropagation();
      this.closeForm();
    });

    this.$modalCloseButton.addEventListener("click", event => {
      this.closeModal(event);
    });
  }
 
  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);
    
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text

    if (isFormClicked) {
      this.openForm();
    } else if(hasNote) {
      this.addNote ({ title, text })
    } else {
      this.closeForm();
    }
  }

  
  openForm() {
    this.$form.classList.add("form-open");
    this.$noteTitle.style.display = "block";
    this.$formButtons.style.display = "block";
  }
  
  closeForm() {
    this.$form.classList.remove("form-open");
    this.$noteTitle.style.display = "none";
    this.$formButtons.style.display = "none";
    this.$noteTitle.value = "";
    this.$noteText.value = "";
  }
  
  openModal(event) {
    if(event.target.matches('.toolbar-delete')) return;
    if (event.target.closest(".note")){
      this.$modal.classList.toggle("open-modal");
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  closeModal(event) {
      this.editNote();
      this.$modal.classList.toggle("open-modal");
  }

  openTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    // this.id = event.target.nextElementSibling.dataset.id;
    // this.id = event.target.previousElementSibling.dataset.id;
    this.id = event.target.dataset.id;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left + window.scrollX;
    // console.log(horizontal)
    const vertical =  window.scrollY - 20;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = 'flex';
  }

  closeTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.$colorTooltip.style.display = 'none';
  }

  addNote({ title, text }) {
    const newNote = {
      title,
      text,
      color: "white",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };
    this.notes = [...this.notes, newNote];
    this.renderNotes();
    this.closeForm();
    
  }

  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map(note => 
      note.id === Number(this.id) ? {...note, title, text} : note
    );
    this.renderNotes();
  }

  editNoteColor(color) {
    this.notes = this.notes.map(note => 
      note.id === Number(this.id) ? {...note, color} : note
    );
    this.renderNotes();
  }

  selectNote(event) {
    const $selectedNote  = event.target.closest(".note");
    // console.log($selectedNote)
    if(!$selectedNote) return;
    // console.log($selectedNote.children);
    const [ $noteTitle, $noteText ] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id  = $selectedNote.dataset.id;
  }

  deleteNote(event) {
    event.stopPropagation();
    if(!event.target.matches('.toolbar-delete')) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter(note => note.id !== Number(id))
    this.renderNotes();
  }

  renderNotes() {
    this.saveNotes();
    this.displayNotes();
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes))
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? "none" : "flex";
    this.$notes.innerHTML = this.notes.map(note => `
      <div class="note" style="background:${note.color};" data-id="${note.id}">
        <div class="${note.title && 'note-title'}">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
          <div class="toolbar">
          <img class="toolbar-color" src="https://icon.now.sh/palette" data-id='${note.id}'>
          <img class="toolbar-delete" src="https://icon.now.sh/delete" data-id='${note.id}'>
          </div>
        </div>
      </div>
    `).join("");
  }
}

new App();
