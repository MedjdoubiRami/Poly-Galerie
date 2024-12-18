import SERVER_URL, { HTTP_STATUS } from './consts.js';

/**
 * Metadonnées d'une image
 * @typedef {Object} ImageData
 * @property {string} name nom de l'image
 * @property {string} id identifiant 
 * @property {string} url url de l'image sur le serveur
 */


/**
 * Récupère les images de la galerie depuis le serveur. Transmet le jeton d'authentification
 * pour les images privées.
 * 
 * TODO : récupérer les images depuis le serveur et les afficher dans la galerie
 */
 async function getGalleryImages() {
    const token = sessionStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    console.log("inside gallery.js, Token : ", token); 
    try {
        const response = await fetch(`${SERVER_URL}/api/images/`, {
            method: 'GET',
            headers: headers
        });

        if (response.status === HTTP_STATUS.SUCCESS) { // erreur ici, la reponse est 404 et non 200 (success) 
            const images = await response.json();
            console.log("images: ", images);
            displayImages(images);
        } else {
            console.error("Erreur lors de la récupération des images : ", response.status);
            alert("Erreur lors de la récupération des images de la galerie.");
        }
    } catch (error) {
        console.error("Erreur de réseau :", error);
    }
}

/**
 * Affiche les images dans la galerie
 * @param {Array<ImageData>} images images à afficher
 */
function displayImages(images) {
    const gallery = document.getElementById('gallery-display');
    gallery.innerHTML = '';
    images.forEach(image => buildImage(image, gallery));
}

/**
 * Construit l'élément HTML pour une image et l'ajoute au parent
 * @param {ImageData} image métadonnées de l'image 
 * @param {HTMLDivElement} galleryContainer objet HTML parent de la galerie
 * 
 * TODO : Ajouter un lien vers la page de l'image dans le format suivant : image.html?id=ID
 * 
 * TODO : Récupérer l'image depuis le serveur avec l'url
 */
function buildImage(image, galleryContainer) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('flex-container-column', 'flex-center-align');
    const imageName = document.createElement('p');
    imageName.textContent = image.name;
    imageContainer.appendChild(imageName);

    const imageLink = document.createElement('a');
    // TODO : Ajouter un lien vers la page de l'image
    imageLink.href = `image.html?id=${image.id}`;
    imageContainer.appendChild(imageLink);

    // TODO : Récupérer l'image depuis le serveur
    const img = document.createElement('img');
    img.classList.add('gallery-image');
    img.src = `${SERVER_URL}/api/images/static/${image.url}`;
    img.alt = image.name;
    imageLink.appendChild(img);

    galleryContainer.appendChild(imageContainer);
}

document.getElementById('image-upload-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    await uploadImage();
});

/**
 * Envoie une image au serveur pour l'ajouter à la galerie.
 * 
 * Si l'image est ajoutée avec succès, recharge les images de la galerie.
 * 
 * Si l'utilisateur n'est pas connecté ou le jeton n'est pas validé par le serveur, affiche un message d'erreur.
 * 
 * Utilise un objet FormData pour envoyer l'image et le nom de l'image
 * 
 * TODO : Envoyer l'image au serveur et gérer la réponse
 */
async function uploadImage() {
    const token = sessionStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const formData = new FormData();
    const fileInput = document.getElementById('img-file');
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch(`${SERVER_URL}/api/images`, {
            method: 'PUT',
            headers: headers,
            body: formData
        });

        if (response.ok) {
            alert("Image téléchargée avec succès !");
            getGalleryImages();
        } 
        else if(response.status === HTTP_STATUS.UNAUTHORIZED){
            alert("Vous devez vous connecter");
        }
        else {
            const errorMessage = await response.text();
            console.error("Erreur lors du téléchargement de l'image :", errorMessage);
            alert("Erreur lors du téléchargement de l'image.");
        }
    } catch (error) {
        console.error("Erreur de réseau lors du téléchargement de l'image :", error);
    }
}

getGalleryImages();
