import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIsEtztFW25VfFl_Vlvzm587YncKYdEak",
    authDomain: "test-donnees-37f54.firebaseapp.com",
    projectId: "test-donnees-37f54",
    storageBucket: "test-donnees-37f54.appspot.com",
    messagingSenderId: "37998569682",
    appId: "1:37998569682:web:998134965c0a36504ca50b",
    measurementId: "G-27MQ57ZH59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Update UI based on authentication state
function updateUI(user) {
    if (user) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('fileSection').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'block'; // Show logout button
        listFiles();  // List files when user is logged in
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('fileSection').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none'; // Hide logout button
    }
}

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
    updateUI(user);
});

// Login function
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            console.error(error);
            alert('Login failed: ' + error.message);
        });
});

// Logout function
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).catch((error) => {
        console.error(error);
        alert('Logout failed: ' + error.message);
    });
});

// Upload file function
document.getElementById('uploadBtn').addEventListener('click', () => {
    const file = document.getElementById('file').files[0];
    if (!file) {
        alert('No file selected.');
        return;
    }
    const storageRef = ref(storage, 'documents/' + file.name);
    uploadBytes(storageRef, file)
        .then(() => {
            alert('File uploaded successfully!');
            document.getElementById('file').value = '';  // Reset file input
            listFiles();  // Update file list after upload
        })
        .catch((error) => {
            console.error(error);
            alert('Upload failed: ' + error.message);
        });
});

// List files function
function listFiles() {
    const listRef = ref(storage, 'documents/');
    listAll(listRef)
        .then((res) => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';  // Clear the current list
            res.items.forEach((itemRef) => {
                getDownloadURL(itemRef).then((url) => {
                    const li = document.createElement('li');
                    li.className = 'file-item';
                    li.innerHTML = `
                        <span class="file-name">${itemRef.name}</span>
                        <div class="actions hidden-on-small">
                            <button onclick="window.open('${url}', '_blank')"><i class="fas fa-download"></i></button>
                            <button onclick="deleteFile('${itemRef.fullPath}')"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        <div class="hidden-on-large">
                            <button onclick="toggleMenu(this)"><i class="fas fa-ellipsis-v"></i></button>
                            <div class="file-menu">
                                <button onclick="window.open('${url}', '_blank')">Download</button>
                                <button onclick="deleteFile('${itemRef.fullPath}')">Delete</button>
                            </div>
                        </div>
                    `;
                    fileList.appendChild(li);
                });
            });
        })
        .catch((error) => {
            console.error(error);
            alert('Failed to list files: ' + error.message);
        });
}

// Delete file function
window.deleteFile = (fullPath) => {
    const fileRef = ref(storage, fullPath);
    deleteObject(fileRef)
        .then(() => {
            alert('File deleted successfully!');
            listFiles();  // Update file list after deletion
        })
        .catch((error) => {
            console.error(error);
            alert('Delete failed: ' + error.message);
        });
}

// Toggle file menu on small screens
window.toggleMenu = (button) => {
    const menu = button.nextElementSibling;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Add event listener for clicks outside the menu to close it
document.addEventListener('click', (event) => {
    const openMenu = document.querySelector('.file-menu[style="display: block;"]');
    if (openMenu && !openMenu.contains(event.target) && !openMenu.previousElementSibling.contains(event.target)) {
        openMenu.style.display = 'none';
    }
});
