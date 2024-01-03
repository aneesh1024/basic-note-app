const input = document.querySelector(".input");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesContainer = document.querySelector(".notes_container");
let deleteBtn = document.querySelectorAll(".close-btn");
let notes = document.querySelectorAll(".note-section");
const closeView = document.querySelector(".close-view");
const noteView = document.querySelector(".note-view");

const notesList = JSON.parse(localStorage.getItem("notes")) || [];
let maxId = Number(localStorage.getItem("maxId"));
let noteViewData = {
  title: "",
  content: "",
  date: "",
};

titleInput.addEventListener("focusin", () => {
  contentInput.style.display = "block";
});

document.addEventListener("click", (e) => {
  if (!input.contains(e.target)) {
    if (titleInput.value !== "" && contentInput.value !== "") {
      const title = titleInput.value;
      const content = contentInput.value;
      const noteObject = {
        id: Number(maxId) + 1,
        title: title,
        content: content,
        date: new Date().toLocaleDateString("en-us", {
          dateStyle: "medium",
        }),
      };
      addNote(noteObject);
      titleInput.value = "";
      contentInput.value = "";
    }
    contentInput.style.display = "none";
  }
});

closeView.addEventListener("click", () => {
  noteView.classList.add("hidden");
});

const addNote = (data) => {
  notesList.push(data);
  localStorage.setItem("notes", JSON.stringify(notesList));
  localStorage.setItem("maxId", Number(maxId) + 1);
  maxId += 1;
  getNotes();
};

const deleteNote = (id) => {
  let index;
  for (let i = 0; i < notesList.length; i++) {
    if (notesList[i].id === id) {
      index = i;
    }
  }
  notesList.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notesList));
  getNotes();
};

const getNotes = () => {
  notesContainer.innerHTML = `
    ${notesList
      .map((note) => {
        return `
            <div class="note">
                <div class="note-section">
                <div>
                <p>${note.title}</p>
                <small>${note.date}</small>
                </div>
                <p>${
                  note.content.length > 80
                    ? note.content.slice(0, 80) + "..."
                    : note.content
                }</p></div>
                <div class="close-btn" data-id="${note.id}">
                    <svg width="20" height="20" fill="#333333" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                    </svg>
                </div>
            </div>
        `;
      })
      .join("")}
`;
  deleteBtn = document.querySelectorAll(".close-btn");
  notes = document.querySelectorAll(".note-section");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      deleteNote(Number(btn.dataset.id));
    });
  });
  notes.forEach((note) => {
    note.addEventListener("click", (e) => {
      const title = note.children[0].children[0].innerHTML;
      const date = note.children[0].children[1].innerHTML;
      const content = note.children[1].innerHTML;

      closeView.addEventListener("click", () => {
        noteView.classList.add("hidden");
      });

      noteView.children[0].innerHTML = `
            <p>${title}</p>
            <small>${date}</small>
            <p>${content}</p>`;
      noteView.classList.remove("hidden");
    });
  });
};
getNotes();
