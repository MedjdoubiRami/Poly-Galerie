import SERVER_URL, { HTTP_STATUS } from './consts.js';

const imgElement = document.getElementById('image');
const imgName = document.getElementById('image-name');
const privateCheck = document.getElementById('private-input');
const deleteButton = document.getElementById('delete-btn');
const qString = window.location.search;
const urlP = new URLSearchParams(qString);
let imgId = urlP.get('id');

privateCheck.addEventListener('change', async () => {
    await changePrivacy(imgId);
});

deleteButton.addEventListener('click', async () => {
    await deleteImage(imgId);
});

/**
 * Charge une image en fonction de l'id de l'URL de la page.
 * 
 * Met à jour l'image, le nom de l'image et son état privé/public dans la page.
 * Si l'image n'existe pas, affiche "Image non trouvée" comme nom d'image et ajoute la classe "error-element" au nom de l'image.
 * 
 * TODO : Implémenter la logique de chargement de l'image et la gestion de la réponse serveur.
 * 
 * Astuce : voir l'objet URLSearchParams pour récupérer les paramètres de l'URL.
 */
async function loadImage() {
    const token = sessionStorage.getItem('token');
        if (!imgId) {
            imgName.textContent = "Image pas trouvée";
            imgName.classList.add("error-element");
            return;
        }
        try {
            const response = await fetch(`${SERVER_URL}/api/images/${imgId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const imgData = await response.json();
            imgName.textContent = imgData.name;
            console.log(`Le nom est ${imgData.name}`);
            imgName.classList.remove("error-element");
            imgElement.src = `${SERVER_URL}/api/images/static/${imgData.url}`;
            privateCheck.checked = imgData.private;
            console.log(token);
        } catch (error) {
            imgName.textContent = "Erreur de chargement";
            imgName.classList.add("error-element");
        }
}

/**
 * Supprime une image en fonction de son identifiant.
 * 
 * Si la suppression réussit, redirige l'utilisateur vers la page d'accueil.
 * 
 * Si l'utilisateur n'est pas connecté ou le jeton n'est pas validé par le serveur, affiche un message d'erreur.
 * Si l'image n'existe pas, affiche "Échec de suppression : Image non trouvée".
 * 
 * TODO : Implémenter la logique de suppression de l'image et la gestion de la réponse serveur.
 * 
 * Astuce : assurez-vous de gérer les différents codes de statut de la réponse.
 * @param {string} imageId identifiant de l'image
 */
async function deleteImage(imageId) {
    const token = sessionStorage.getItem('token');
    if (!imageId) {
        displayWarning("Veuillez vous connecter");
        return;
    }
    try {
        const response = await fetch(`${SERVER_URL}/api/images/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === HTTP_STATUS.UNAUTHORIZED) {
            displayWarning("Utilisateur non connecté");
            return;
        }

        if (response.status === HTTP_STATUS.NOT_FOUND) {
            displayWarning("Image pas trouvée");
            return;
        }
        if (response.ok) {
            window.location.href = "./index.html";
        } else {
            console.error("Error deleting image:", response.status);
            displayWarning("Erreur de suppression");
        }
    } catch (error) {
        console.error("Error deleting image:", error);
        displayWarning("Erreur de suppression");
    }
}

/**
 * Envoie une requête pour changer l'état privé/public d'une image.
 * 
 * Si la requête réussit, recharge l'image.
 * 
 * Si l'utilisateur n'est pas connecté ou le jeton n'est pas validé par le serveur, affiche un message d'erreur.
 * 
 * TODO : Implémenter la logique de changement de l'état de l'image et la gestion de la réponse serveur.
 * 
 * @param {string} imageId identifiant de l'image 
 */
async function changePrivacy(imageId) {
    const token = sessionStorage.getItem('token');
    if (!token) {
        displayWarning("Veuillez vous connecter");
        privateCheck.checked = false;
        return;
    }
    const response = await fetch(`${SERVER_URL}/api/images/privacy/${imageId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ private: privateCheck.checked })
    });

    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        displayWarning("Utilisateur non connecté");
        return;
    }

    if (!response.ok) {
        displayWarning("Erreur de mise à jour");
        return;
    }

    await loadImage();

}

/**
 * Affiche une alerte avec un message.
 * @param {string} message message à afficher
 */
function displayWarning(message) {
    window.alert(message);
}

loadImage();