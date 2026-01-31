const firebaseConfig = {
    apiKey: "AIzaSyBmJ0meJhhRNILdqAxa9bTmine8f825ZMw",
    authDomain: "vixentradas.firebaseapp.com",
    projectId: "vixentradas",
    storageBucket: "vixentradas.firebasestorage.app",
    messagingSenderId: "28128903208",
    appId: "1:28128903208:web:fc8b0ce109d817652c751d"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Hacer db global
window.db = firebase.firestore();

console.log('Firebase inicializado correctamente');
