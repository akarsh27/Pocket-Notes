document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const addNoteBtn = document.getElementById('add-note-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const notesContainer = document.getElementById('notes-container');
    const modal = document.getElementById('note-modal');
    const editModal = document.getElementById('edit-modal');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const updateNoteBtn = document.getElementById('update-note-btn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const noteTitleInput = document.getElementById('note-title-input');
    const noteContentInput = document.getElementById('note-content-input');
    const editTitleInput = document.getElementById('edit-note-title');
    const editContentInput = document.getElementById('edit-note-content');
    const searchBar = document.getElementById('search-bar'); // Search bar element

    // State
    let notes = [];
    let editingNoteId = null;

    // Load notes from local storage on page load
    loadNotesFromLocalStorage();

    // Modal Handling
    function openModal(modal) {
        modal.style.display = 'flex';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        noteTitleInput.value = '';
        noteContentInput.value = '';
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            closeModal(modal);
            closeModal(editModal);
        });
    });

    // Dark Mode Toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
    });

    // Save a new note
    saveNoteBtn.addEventListener('click', function () {
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (title && content) {
            const note = {
                id: Date.now(),
                title,
                content
            };

            notes.push(note);
            saveNotesToLocalStorage();
            renderNotes(notes);  // Always render the full notes array
            closeModal(modal);
        }
    });

    // Update an existing note
    updateNoteBtn.addEventListener('click', function () {
        const updatedTitle = editTitleInput.value.trim();
        const updatedContent = editContentInput.value.trim();

        if (updatedTitle && updatedContent) {
            notes = notes.map(note => {
                if (note.id === editingNoteId) {
                    return { ...note, title: updatedTitle, content: updatedContent };
                }
                return note;
            });

            saveNotesToLocalStorage();
            renderNotes(notes);
            closeModal(editModal);
        }
    });

    // Render notes
    function renderNotes(filteredNotes = notes) {
        notesContainer.innerHTML = ''; // Clear current notes
        if (filteredNotes.length === 0) {
            notesContainer.innerHTML = `<p>No notes found.</p>`;
        } else {
            filteredNotes.forEach(note => {
                const noteCard = document.createElement('div');
                noteCard.classList.add('note-card');
                noteCard.innerHTML = `
                    <h3 class="note-title">${note.title}</h3>
                    <p class="note-content">${note.content}</p>
                    <div class="note-actions">
                        <div class="dropdown">
                            <button class="dropdown-toggle">⋮</button>
                            <div class="dropdown-menu">
                                <button class="edit-btn">Edit</button>
                                <button class="delete-btn">Delete</button>
                            </div>
                        </div>
                    </div>
                `;

                // Edit Note
                noteCard.querySelector('.edit-btn').addEventListener('click', function () {
                    editingNoteId = note.id;
                    editTitleInput.value = note.title;
                    editContentInput.value = note.content;
                    openModal(editModal);
                });

                // Delete Note
                noteCard.querySelector('.delete-btn').addEventListener('click', function () {
                    notes = notes.filter(n => n.id !== note.id);
                    saveNotesToLocalStorage();
                    renderNotes(notes);
                });

                // Dropdown Toggle Functionality
                const dropdownToggle = noteCard.querySelector('.dropdown-toggle');
                const dropdownMenu = noteCard.querySelector('.dropdown-menu');

                dropdownToggle.addEventListener('click', function (event) {
                    event.stopPropagation(); // Prevent click from closing immediately
                    dropdownMenu.classList.toggle('show');
                });

                document.addEventListener('click', function () {
                    // Close any open dropdown when clicking outside
                    if (dropdownMenu.classList.contains('show')) {
                        dropdownMenu.classList.remove('show');
                    }
                });

                notesContainer.appendChild(noteCard);
            });
        }
    }

    // Search functionality - filter notes based on search term
    searchBar.addEventListener('input', function (event) {
        const searchTerm = event.target.value.toLowerCase();
        filterNotes(searchTerm);
    });

    function filterNotes(searchTerm) {
        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );
        renderNotes(filteredNotes); // Render filtered notes
    }

    // Save notes to local storage
    function saveNotesToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Load notes from local storage
    function loadNotesFromLocalStorage() {
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
            notes = JSON.parse(storedNotes);
            renderNotes(notes);  // Render notes after loading from local storage
        }
    }

    // Add new note button click event
    addNoteBtn.addEventListener('click', function () {
        openModal(modal);
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            closeModal(modal);
            closeModal(editModal);
        }
    });
});
