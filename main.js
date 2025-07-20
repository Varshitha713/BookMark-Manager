// ✅ Import Firebase core modules directly
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


const firebaseConfig = {
  apiKey: "AIzaSyD_tavIYrLPkzoGNBWsEYrBY-NBNpfu42M",
  authDomain: "bookmark-manager-21132.firebaseapp.com",
  projectId: "bookmark-manager-21132",
  storageBucket: "bookmark-manager-21132.appspot.com",
  messagingSenderId: "415304340102",
  appId: "1:415304340102:web:0b4f57c5e60befc3747707",
  databaseURL: "https://bookmark-manager-21132-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase ONCE here
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

//  Your same logic below...

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

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView(user);
  } else {
    showLoggedOutView();
  }
});

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

function showLoggedOutView() {
  document.getElementById("logged-out-view").style.display = "block";
  document.getElementById("logged-in-view").style.display = "none";
}
