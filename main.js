// Import initialized app from config
import app from "./firebase-config.js";

// Firebase Auth & Database
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
  remove,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Initialize services
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

//  DOM Elements
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

// Save bookmark
bookmarkForm.addEventListener("submit", (e) => {
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

    set(newBookmarkRef, { title, url })
      .then(() => {
        bookmarkTitleInput.value = "";
        bookmarkUrlInput.value = "";
      })
      .catch((error) => {
        alert("Failed to save bookmark: " + error.message);
      });
  } else {
    alert("You must be logged in to save bookmarks.");
  }
});

//  Signup
signupButton.addEventListener("click", (e) => {
  e.preventDefault();
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showLoggedInView(userCredential.user);
    })
    .catch((error) => {
      alert(error.message);
    });
});

//  Login
loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showLoggedInView(userCredential.user);
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

//  Logout
logoutButton.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      showLoggedOutView();
      loginEmailInput.value = "";
      loginPasswordInput.value = "";
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
    });
});

// Toggle Forms
document.addEventListener("DOMContentLoaded", () => {
  const showLoginLink = document.getElementById("show-login");
  const showSignupLink = document.getElementById("show-signup");
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      signupForm.style.display = "none";
      loginForm.style.display = "block";
    });
  }

  if (showSignupLink) {
    showSignupLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.style.display = "none";
      signupForm.style.display = "block";
    });
  }
});

// Google Sign In
function handleGoogleSignIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      showLoggedInView(result.user);
    })
    .catch((error) => {
      if (error.code !== "auth/cancelled-popup-request") {
        alert("Google Sign-in failed: " + error.message);
      }
    });
}

googleLoginButton?.addEventListener("click", (e) => {
  e.preventDefault();
  handleGoogleSignIn();
});

googleSignupButton?.addEventListener("click", (e) => {
  e.preventDefault();
  handleGoogleSignIn();
});

//  Listen to auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView(user);
  } else {
    showLoggedOutView();
  }
});

//  Show Logged-In View
function showLoggedInView(user) {
  document.getElementById("logged-out-view").style.display = "none";
  document.getElementById("logged-in-view").style.display = "block";

  const userBookmarksRef = ref(db, `bookmarks/${user.uid}`);

  onValue(userBookmarksRef, (snapshot) => {
    bookmarkList.innerHTML = "";

    if (!snapshot.exists()) {
      emptyState.style.display = "block";
      bookmarkCount.textContent = "0";
      return;
    }

    emptyState.style.display = "none";
    let count = 0;

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
      deleteBtn.classList.add("delete-btn");
      deleteBtn.title = "Delete Bookmark";

      deleteBtn.addEventListener("click", () => {
        const bookmarkToDeleteRef = ref(db, `bookmarks/${user.uid}/${bookmarkId}`);
        remove(bookmarkToDeleteRef).catch((error) => {
          alert("Failed to delete: " + error.message);
        });
      });

      li.appendChild(link);
      li.appendChild(deleteBtn);
      bookmarkList.appendChild(li);
    });

    bookmarkCount.textContent = count.toString();
  });
}

//  Show Logged-Out View
function showLoggedOutView() {
  document.getElementById("logged-out-view").style.display = "block";
  document.getElementById("logged-in-view").style.display = "none";
}
