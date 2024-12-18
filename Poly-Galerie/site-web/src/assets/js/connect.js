import SERVER_URL, { HTTP_STATUS } from './consts.js';
import { updateName } from "./header.js";

const accountForm = document.getElementById('account-form');
const messageField = document.getElementById('message-field');

/**
 * Affiche un message dans le champ de message
 * @param {string} message message à afficher
 */
function writeToLog(message) {
    const messageElement = document.createElement('p');
    messageElement.innerText = message;
    messageField.innerHTML = '';
    messageField.appendChild(messageElement);
}

/**
 * Met à jour l'interface en fonction de l'état de la connexion.
 * 
 * Fonction déjà implémentée pour vous.
 */
function updateInteface() {
    const username = sessionStorage.getItem('user');
    updateName(username);
    const connectionInfo = sessionStorage.getItem('token'); 
    const accountSection = document.getElementById('account-section');
    accountSection.style.display = connectionInfo ? 'none' : 'block';
    if (connectionInfo) {
        return writeToLog('Vous êtes déjà connectés');
    }
    else {
        writeToLog('Vous n\'êtes pas connectés');
    }
}

window.addEventListener('load', () => {
    updateInteface();
});

/**
 * Gère la soumission du formulaire de connexion
 * @param {Event} e événement de soumission
 * 
 * TODO : bloquer le comportement par défaut du formulaire.
 * 
 * TODO : en fonction de l'état de la case à cocher, appeler la fonction de création de compte ou de connexion.
 */
accountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = accountForm.username.value;
    const password = accountForm.password.value;
    const isCreatingAccount = accountForm["create-check"].checked;

    console.log("Nom:", username);
    console.log("Mot de passe:", password);
    console.log("Créer un compte:", isCreatingAccount);

    if (isCreatingAccount) {
        await createAccount(username, password);
    } else {
        await logIn(username, password);
    }
});

/**
 * Envoie une requête de connexion au serveur.
 * 
 * En cas de succès, récupère un jeton d'authentification dans l'entête "X-Auth-Token". 
 * Le jeton et le nom d'utilisateur sont sauvegardés pour la session seulement.
 * 
 * Le nom d'utilisateur est affiché en haut de la page et l'utilisateur est redirigé vers la page d'accueil.
 * 
 * En cas d'échec, affiche un message d'erreur.
 * 
 * @param {string} username nom d'utilisateur
 * @param {string} password mot de passe
 * 
 * TODO : envoyer la requête de connexion au serveur et gérer la réponse
 */
async function logIn(username, password) {
    try {
        const response = await fetch(`${SERVER_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        console.log(response);
        if (response.status === HTTP_STATUS.SUCCESS) {
            const token = await response.json(); // the token is an object , i need it to be a string
            console.log("token: ", token); 
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', username);
            updateInteface();
            window.location.href = 'index.html';
        } else {
            writeToLog(`Invalid login data`);
        }
    } catch (error) {
        console.error('Erreur réseau lors de la connexion');
    }
}

/**
 * Envoie une requête de création de compte au serveur.
 * 
 * En cas de succèss, récupère un jeton d'authentification dans l'entête "X-Auth-Token".
 * Un message de confirmation "Création de jeton réussie pour <nom utilisateur>)" est affiché.
 * 
 * Le jeton et le nom d'utilisateur sont sauvegardés pour la session seulement.
 * 
 * En cas d'échec, un message d'erreur d'erreur est affiché.
 * 
 * @param {string} username nom d'utilisateur 
 * @param {string} password mot de passe
 * 
 * TODO : envoyer la requête de création de compte au serveur et gérer la réponse
 */
async function createAccount(username, password) {
    try {
        const response = await fetch(`${SERVER_URL}/api/auth/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.status === HTTP_STATUS.CREATED) {
            const token = await response.json();
            console.log("token: ", token); 
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', username);
            writeToLog(`Création de jeton réussi pour ${username}`);
            window.location.href = 'index.html';
        } else {
            writeToLog(`User already exists`);
        }
    } catch (error) {
        //console.error('Erreur réseau lors de la création du compte');
    }
}