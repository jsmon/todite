import firebase from 'firebase';

if (firebase.apps.length === 0) {
    firebase.initializeApp({
        apiKey: 'AIzaSyDJrRVhuLd0PoVz_HSOyOIH6idxe0oA88U',
        authDomain: 'todolist-90355.firebaseapp.com',
        projectId: 'todolist-90355',
        storageBucket: 'todolist-90355.appspot.com',
        messagingSenderId: '1067039421794',
        appId: '1:1067039421794:web:82c8c80c5c75043995a83b'
    });
}

export default firebase;
