// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

// Login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert("Logged in!");
        })
        .catch(error => {
            console.error(error);
        });
}

// Sign up function
function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert("Signed up!");
        })
        .catch(error => {
            console.error(error);
        });
}

// Upload file function
function uploadFile() {
    const file = document.getElementById('file').files[0];
    const storageRef = ref(storage, 'documents/' + file.name);
    uploadBytes(storageRef, file).then(snapshot => {
        alert("File uploaded!");
    }).catch(error => {
        console.error(error);
    });
}

// Download file function
function downloadFile() {
    const fileName = document.getElementById('fileName').value;
    const storageRef = ref(storage, 'documents/' + fileName);
    getDownloadURL(storageRef).then(url => {
        window.open(url, '_blank');
    }).catch(error => {
        console.error(error);
    });
}

// Expose the functions to the global scope for use in the HTML
window.login = login;
window.signup = signup;
window.uploadFile = uploadFile;
window.downloadFile = downloadFile;
