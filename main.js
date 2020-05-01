document.onmousemove = snapNote;
document.onmouseup = placeNote;

let notesCount = 0;
function addNote() {
    notesCount++;

    console.log('click');
    let note = document.createElement('div');
    note.onmousedown = selectNote;
    note.className = 'note';
    
    let titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Title';
    titleInput.className = 'note-title';
    titleInput.value = notesCount;
    note.appendChild(titleInput);

    let textBox = document.createElement('textarea');
    textBox.placeholder = 'Write your note here'
    textBox.className = 'note-content';
    textBox.onkeydown = keyDown;
    note.appendChild(textBox);

    let optionButton = document.createElement('button');

    note.id = 'note' + notesCount;

    document.body.appendChild(note);

    titleInput.focus();
}

let selectedNote = null;
let noteCopy = {};
let offsetX = 0;
let offsetY = 0;
let mouseDidMove = false;
let currentSwap = null;

function selectNote() {
    selectedNote = this;
}

function placeNote(event) {
    if (selectedNote !== null) {
        selectedNote.style.visibility = 'visible';
        checkOverflow(selectedNote.children[1]);
        selectedNote = null;
        
        if (mouseDidMove) {
            noteCopy.remove();
            mouseDidMove = false;
        }

        if (currentSwap !== null) {
            currentSwap.style.visibility = 'visible';
            checkOverflow(currentSwap.children[1]);
            currentSwap = null;
        }
    }
}

function snapNote(event) {
    if (selectedNote !== null) {
        if (!mouseDidMove) {
            selectedNote.style.visibility = 'hidden';

            noteCopy = copyNote(selectedNote);
            noteCopy.style.position = 'fixed';
            document.body.appendChild(noteCopy);

            mouseDidMove = true;
        }
        noteCopy.style.top = (event.clientY - noteCopy.offsetHeight/2) + 'px';
        noteCopy.style.left = (event.clientX - noteCopy.offsetWidth/2) + 'px';

        let notes = document.getElementsByClassName('note');
        for(let i = 0; i < notes.length; i++) {
            
            let rect = notes[i].getBoundingClientRect();
            if (currentSwap === null) {
                if (notes[i].id !== noteCopy.id) {
                    if (event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom) {
                        console.log('Selected: ' + noteCopy.id);
                        console.log('Swap with: ' + notes[i].id);
                        swapNotes(notes[i], selectedNote);
                        currentSwap = notes[i];

                        selectedNote.style.visibility = 'visible';
                        checkOverflow(selectedNote.children[1]);
                        currentSwap.style.visibility = 'hidden';
                    }
                }
            } else {
                if (notes[i].id !== noteCopy.id && notes[i].id !== currentSwap.id) {
                    if (event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom) {
                        currentSwap.style.visibility = 'visible';
                        console.log('Selected: ' + noteCopy.id);
                        console.log('Swap with: ' + notes[i].id);
                        
                        swapNotes(notes[i], currentSwap);
                        currentSwap = notes[i];

                        selectedNote.style.visibility = 'visible';
                        checkOverflow(selectedNote.children[1]);
                        currentSwap.style.visibility = 'hidden';
                    }
                }
            }
        }
    }
}

function swapNotes(note1, note2) {
    let title1 = note1.children[0].value;
    let content1 = note1.children[1].value;
    let id1 = note1.id
    let height1 = note1.children[1].style.height;

    note1.children[0].value = note2.children[0].value;
    note1.children[1].value = note2.children[1].value;
    note1.children[1].style.height = note2.children[1].style.height;
    note1.id = note2.id

    note2.children[0].value = title1;
    note2.children[1].value = content1;
    note2.children[1].style.height = height1;
    note2.id = id1;
}

function copyNote(originalNote) {
    let noteCopy = document.createElement('div');
    noteCopy.className = 'note';
    noteCopy.innerHTML = originalNote.innerHTML;
    noteCopy.children[0].value = originalNote.children[0].value;
    noteCopy.children[1].value = originalNote.children[1].value;
    noteCopy.id = originalNote.id;

    return noteCopy;
}

function keyDown() {
    checkOverflow(this);
}

function checkOverflow(textBox) {
    while (textBox.scrollHeight > textBox.clientHeight) {
        textBox.style.height = (textBox.clientHeight + 18) + 'px';
    }
}