import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBOOTIcrqTBf_rR2vCFCKctxTfzfbWLNig",
    authDomain: "absorber5.firebaseapp.com",
    databaseURL: "https://absorber5.firebaseio.com",
    projectId: "absorber5",
    storageBucket: "absorber5.appspot.com",
    messagingSenderId: "475063218887",
    appId: "1:475063218887:web:00aa330b54c223fdd644e2",
    measurementId: "G-DN11HDSJH2"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

auth.languageCode = "de";

export function getUser() {
    return auth.currentUser;
}

export function getDisplayName() {
    return getUser().displayName;
}

export function updateProfile(value) {
    return new Promise((resolve, reject) => {
        getUser().updateProfile(value).then(function () {
            resolve("Profilupdate erfolgreich")
        }).catch(function (e) {
            reject("Fehler beim Profilupdate", e.message)
        });
    });
}

export async function setDataBase(collection, id, value) {
    return new Promise((resolve, reject) => {
        try {
            value.savetime = new Date();
            db.collection(collection).doc(id).set(value).then(function () {
                resolve("Datenbank übertragung erfolgreich");
            });
        } catch (e) {
            reject("Datenbank Fehler:", e.message);
        }
    });
}

export async function getDataBasebyName(collection, id) {
    return new Promise((resolve, reject) => {
        id = id.toLowerCase();
        db.collection(collection).where('name', '>=', id).where('name', '<=', id + '\uf8ff').limit(5).get().then(function (e) {
            if (e.empty) {
                reject('No matching documents.');
            }
            resolve(e)
        });
    });
}

export async function getDataBasebyId(collection, id) {
    return new Promise((resolve, reject) => {
        db.collection(collection).doc(id).get().then(function (e) {
            if (e.exists) {
                resolve(e);
            } else {
                reject('No matching documents.');
            }
        });
    });
}

export async function getAllDataBase(collection, id) {
    return new Promise((resolve, reject) => {
        db.collection(collection).orderBy(id, "desc").limit(10).get().then(function (e) {
            if (e.empty) {
                reject('No matching documents.');
            }
            resolve(e)
        });
    });
}


export function signInWithGoogle() {
    return new Promise((resolve, reject) => {
        auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
            .then(() => {
                return firebase.auth().getRedirectResult();
            })
            .then(function (result) {
                resolve(result)
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

export function signOut() {
    return new Promise((resolve, reject) => {
        auth.signOut().then(function () {
            resolve()
        }).catch(function (error) {
            reject(error)
        });
    });
}

export function linkWithGoogle() {
    return new Promise((resolve, reject) => {
        getUser().linkWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(function (result) {
                resolve(result)
            })
            .catch(function (error) {
                reject(error)
            });
    });
}

export function singInAnonymous() {
    return new Promise((resolve, reject) => {
        auth.signInAnonymously()
            .then(() => {
                resolve()
            })
            .catch(function (error) {
                reject(error)
            });
    });
}

export function setListender(callback) {
    auth.onAuthStateChanged(() => {
        callback();
    });
}
