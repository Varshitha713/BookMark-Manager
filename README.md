# 📚 Bookmark Manager

A clean, simple, and responsive web application for managing your favorite website bookmarks. Built with **HTML, CSS, and JavaScript**, and powered by **Firebase** for authentication and real-time data storage.

## ✨ Live Demo

🔗 **[Visit the live application here](https://your-bookmark-manager.netlify.app/)**

## 📸 Application Preview

![Bookmark Manager Screenshot](https://github.com/user-attachments/assets/ed155339-287c-4066-814a-bf816bf513f0)
![Bookmark Manager Screenshot](https://github.com/user-attachments/assets/c56349db-b9dc-4c4e-bc6c-d9f932efb4eb)



*A clean and intuitive interface for managing your bookmarks with Firebase authentication*

## 🚀 Core Features

- 🔐 **Secure User Authentication:**
  - Sign up and log in using a traditional email and password
  - Seamless sign-in with a Google account

- 🔖 **Comprehensive Bookmark Management:**
  - Easily add new bookmarks with a custom title and URL
  - View all your saved bookmarks in a clean, organized list
  - Delete bookmarks that are no longer needed with a single click

- ☁️ **Real-time Cloud Synchronization:**
  - All bookmarks are securely stored in the Firebase Firestore Database
  - Access your bookmarks from any device, anywhere, simply by logging in

- 📱 **Fully Responsive Design:**
  - The user interface is designed to be intuitive and functional on both desktop and mobile devices

## 🛠️ Technologies & Tools

- **Frontend:** Vanilla HTML, CSS, and JavaScript (Vanilla)
- **Backend & Database:** Firebase Firestore
- **Authentication:** Firebase Authentication (Email/Password & Google Sign-in)

## 🧑‍💻 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have a modern web browser and a code editor of your choice (like VS Code with the Live Server extension for the best development experience).

### Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/bookmark-manager.git
   cd bookmark-manager
   ```

2. **Set up Your Firebase Project**

   - Navigate to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
   
   - **Enable Authentication:**
     - In the Firebase Console, go to **Authentication > Sign-in method**
     - Enable the **Email/Password** and **Google** sign-in providers
   
   - **Set up Firestore Database:**
     - Go to **Build > Firestore Database**
     - Create a new database and select the region that is closest to your users
     - Update the database security rules to ensure only authenticated users can read and write data:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/bookmarks/{bookmarkId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

   - **Get Your Firebase Configuration:**
     - In your project settings (**Project Settings > General > Your apps**), register a new web app
     - Copy the `firebaseConfig` object
     - Create a file named `firebase-config.js` in the root of the project and paste your configuration into it:

   ```javascript
   // Your web app's Firebase configuration
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   
   export default firebaseConfig;
   ```

3. **Run the Application**

   - **Option 1:** Open the `index.html` file directly in your web browser
   - **Option 2 (Recommended):** Use the **Live Server** extension in Visual Studio Code to automatically reload the application on changes



## 🚀 Usage

1. **Authentication:**
   - Sign up with email and password or use Google Sign-in
   - Your session will be maintained across browser sessions

2. **Adding Bookmarks:**
   - Enter a title and URL in the input fields
   - Click "Add Bookmark" to save it to your collection

3. **Managing Bookmarks:**
   - View all your bookmarks in the main dashboard
   - Click the delete button to remove unwanted bookmarks
   - All changes sync automatically across your devices

## 🔧 Configuration

Make sure to update the `firebase-config.js` file with your actual Firebase project credentials. Never commit this file with real credentials to a public repository.

## 🤔 Project Motivation

This project was developed as a practical exercise to deepen my understanding of Firebase Authentication and Firestore. The goal was to build a simple, fast, and cloud-connected bookmarking tool that I would personally use, emphasizing a clean user experience and a minimalistic technology stack. 🌱

## 🎯 Future Enhancements

- 🏷️ Tag system for organizing bookmarks
- 🔍 Search and filter functionality
- 📊 Import/export bookmarks
- 🎨 Customizable themes
- 📱 Progressive Web App (PWA) features

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.



⭐ **If you found this project helpful, please consider giving it a star!** ⭐
