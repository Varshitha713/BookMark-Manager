// Importing Firebase core + auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Firebase configuration
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const signupEmailInput = document.getElementById("signup-email");
const signupPasswordInput = document.getElementById("signup-password");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");

const signupButton = document.getElementById("signup");
const loginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const googleLoginButton = document.getElementById("google-login");
const googleSignupButton = document.getElementById("google-signup");

const bookmarkForm = document.getElementById("bookmark-form");
const bookmarkList = document.getElementById("bookmark-list");
const bookmarkTitleInput = document.getElementById("bookmark-title");
const bookmarkUrlInput = document.getElementById("bookmark-url");

const emptyState = document.getElementById("empty-state");
const bookmarkCount = document.getElementById("bookmark-count");

// Save bookmarks
bookmarkForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = bookmarkTitleInput.value.trim();
  const url = bookmarkUrlInput.value.trim();

  if (title === "" || url === "") {
    alert("Please enter both title and URL");
    return;
  }

  const user = auth.currentUser;
  if (user) {
    const userBookmarksRef = ref(db, `bookmarks/${user.uid}`);
    const newBookmarkRef = push(userBookmarksRef);

    set(newBookmarkRef, {
      title: title,
      url: url
    });

    bookmarkTitleInput.value = "";
    bookmarkUrlInput.value = "";
  } else {
    alert("You must be logged in to save bookmarks.");
  }
});

// Signup
signupButton.addEventListener("click", function (e) {
  e.preventDefault();
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed up:", user.email);
      showLoggedInView(user);
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Login
loginButton.addEventListener("click", function (e) {
  e.preventDefault();
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Logged in:", user.email);
      showLoggedInView(user);
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// Logout
logoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      console.log("User logged out.");
      showLoggedOutView();
      loginEmailInput.value = "";
      loginPasswordInput.value = "";
      loginEmailInput.focus();
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
    });
});

// Switch Forms
document.addEventListener("DOMContentLoaded", function () {
  const showLoginLink = document.getElementById("show-login");
  const showSignupLink = document.getElementById("show-signup");
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  if (showLoginLink) {
    showLoginLink.addEventListener("click", function (e) {
      e.preventDefault();
      signupForm.style.display = "none";
      loginForm.style.display = "block";
    });
  }

  if (showSignupLink) {
    showSignupLink.addEventListener("click", function (e) {
      e.preventDefault();
      loginForm.style.display = "none";
      signupForm.style.display = "block";
    });
  }
});

// Auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView(user);
  } else {
    showLoggedOutView();
  }
});

function handleGoogleSignIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Signed in with Google:", user.email);
      showLoggedInView(user);
    })
    .catch((error) => {
      if (error.code !== "auth/cancelled-popup-request") {
        alert("Google Sign-in failed: " + error.message);
      } else {
        console.warn("Google Sign-in popup canceled by another request.");
      }
    });
}
const googleLogin = document.getElementById("google-login");
if (googleLogin) {
  googleLogin.addEventListener("click", (e) => {
    e.preventDefault();
    handleGoogleSignIn();
  });
}

const googleSignup = document.getElementById("google-signup");
if (googleSignup) {
  googleSignup.addEventListener("click", (e) => {
    e.preventDefault();
    handleGoogleSignIn();
  });
}


// Logged-in view
function showLoggedInView(user) {
  document.getElementById("logged-out-view").style.display = "none";
  document.getElementById("logged-in-view").style.display = "block";

  const userBookmarksRef = ref(db, `bookmarks/${user.uid}`);
  //fetching data from firebase
  onValue(userBookmarksRef, (snapshot) => {
    bookmarkList.innerHTML = "";

    if (!snapshot.exists()) {
        emptyState.style.display = "block";
        bookmarkCount.textContent = "0";
        return;
      }
    let count = 0;
  emptyState.style.display = "none"; // Hide when we have bookmarks

    snapshot.forEach((childSnapshot) => {
      count++;
      const bookmark = childSnapshot.val();
      const bookmarkId = childSnapshot.key;

      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = bookmark.url.startsWith("http") ? bookmark.url : `https://${bookmark.url}`;
      link.textContent = bookmark.title;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.style.border = "none";
      deleteBtn.style.background = "transparent";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.fontSize = "1.2rem";
      deleteBtn.title = "Delete Bookmark";

      deleteBtn.addEventListener("click", () => {
        const bookmarkToDeleteRef = ref(db, `bookmarks/${user.uid}/${bookmarkId}`);
        remove(bookmarkToDeleteRef);
      });

      li.appendChild(link);
      li.appendChild(deleteBtn);
      bookmarkList.appendChild(li);
    });
    bookmarkCount.textContent = count.toString(); // Update count badge
  });
}

// Logged-out view
function showLoggedOutView() {
  document.getElementById("logged-out-view").style.display = "block";
  document.getElementById("logged-in-view").style.display = "none";
}
