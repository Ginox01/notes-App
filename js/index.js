// GETS THE ELEMENTS OF THE DOM +++

const searchInput = document.getElementById("search");
const wrapNotes = document.getElementById("wrap-notes");
const notes = Array.from(document.querySelectorAll("#wrap-notes > div"));
const btnVolume = document.getElementById("btn-volume");
const btnTrash = document.getElementById("btn-trash");
const btnOpenEditor = document.getElementById("btn-open-edit");


const editPage = document.getElementById("editor");
const editTitle = document.getElementById("edit-title");
const editContent = document.getElementById("content");
const btnEditClose = document.getElementById("btn-edit-close");
const btnSaveNewNote = document.getElementById("btn-save-new-note");

let startDrag = 0;
let endDrag = 0;

// GETS THE EVENT LISTNER +++

btnOpenEditor.addEventListener("click",openEditor);
btnEditClose.addEventListener("click",closeEditor);
btnVolume.addEventListener("click",changeVolume);
searchInput.addEventListener("keyup",searchNotes);
btnSaveNewNote.addEventListener("click",createNewNote);
notes.forEach(nota => {
    nota.addEventListener("dragstart",dragStartEvent);
    nota.addEventListener("dragend",dragEndEvent)
})
wrapNotes.addEventListener("dragover",dragOverEvent);
btnTrash.addEventListener("dragover",trashOverEvent);
btnTrash.addEventListener("dragleave",trashDragLeaveEvent);
btnTrash.addEventListener("drop",trashDropEvent)

// +++ FUNCTIONS +++


function openEditor(){
    editPage.classList.replace("close","open")
};

function closeEditor(){
    editPage.classList.replace("open","close")
}

function changeVolume(){
    if(btnVolume.classList.contains("attivo")){
        btnVolume.className = "fas fa-volume-mute";
        btnVolume.style.color = "black"
    }else {
        btnVolume.className = "fas fa-volume-up attivo";
        btnVolume.style.color = "gold"
    }
}

function searchNotes(e){
    let userInput = e.target.value;
    let allNotes = document.querySelectorAll("#wrap-notes > div");
    allNotes.forEach(nota => {
        if(nota.textContent.includes(userInput)){
            nota.classList.replace("hide","show")
        }else {
            nota.classList.replace("show","hide")
        }
    })
}

function createNewNote(){
    let newTitle = editTitle.value;
    let newContent = editContent.value;

    if(newTitle.length == 0) return alert("Inserisci il titolo");

    const newNote = createNewNoteNode(newTitle,newContent);

    
    

    editTitle.value = "";
    editContent.value = "";
    

    closeEditor()
    

}

function createNewNoteNode(title,content){
    const newNote = document.createElement("div");
    newNote.setAttribute("id",`note-${Date.now()}`);
    newNote.setAttribute("class","nota show");
    newNote.setAttribute("draggable","true");
    newNote.setAttribute("data-drag","false");
    newNote.addEventListener("dragstart",dragStartEvent);
    newNote.addEventListener("dragend",dragEndEvent)

    let icon = document.createElement("i");
    icon.setAttribute("class","fas fa-arrows-alt");

    let titleNote = document.createElement("p");
    titleNote.appendChild(document.createTextNode(title));

    let contentNote = document.createElement("p");
    contentNote.appendChild(document.createTextNode(content));


    newNote.append(icon,titleNote,contentNote);


    wrapNotes.appendChild(newNote);
}


function dragStartEvent(e){
     e.target.dataset.drag = true
}

function dragEndEvent(e){
    e.target.dataset.drag = false
}

function dragOverEvent(e){
    let noteInDrag = document.querySelector("div[data-drag=true]");
    let notetoSost = getThesostitue(e);
    
    if(noteInDrag == notetoSost) return

    noteInDragNext = noteInDrag.nextElementSibling;
    notetoSostNext = notetoSost.nextElementSibling;


    replace(noteInDrag,notetoSost,noteInDragNext,notetoSostNext);
    replace(notetoSost,noteInDrag,notetoSostNext,noteInDragNext)

    
}

function getThesostitue({clientX , clientY}){
    let sost = 1e10;
    let dist = 1e10;

    let allTheNotes = document.querySelectorAll("#wrap-notes > div");

    allTheNotes.forEach(nota => {
        let pos = nota.getBoundingClientRect();
        let moveX = Math.abs(clientX-pos.x);
        let moveY = Math.abs(clientY-pos.y);
        let minDist = Math.hypot(moveX,moveY)
        if(dist>minDist){
            sost = nota;
            dist = minDist
        }
    })
    return sost
}


function replace(note,sost,noteNext,sostNext){
    if(!sostNext){
        wrapNotes.appendChild(note)
    }else{
        wrapNotes.insertBefore(note,sostNext)
    }
}

function trashOverEvent(e){
    e.preventDefault()
    btnTrash.style.color = "red"
}


function trashDragLeaveEvent(){
    btnTrash.style.color = "black"
}

function trashDropEvent(e){
    e.preventDefault()
    let notaInDrag = document.querySelector("div[data-drag=true]");
    let index = notes.indexOf(notaInDrag)
    wrapNotes.removeChild(notaInDrag);
    notes.splice(index,1);
    btnTrash.style.color = "black"
}