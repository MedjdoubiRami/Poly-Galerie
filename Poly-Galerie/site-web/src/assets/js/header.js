import SERVER_URL, { HTTP_STATUS } from './consts.js';

const accountBtn = document.getElementById('account-btn');

/**
 * Met à jour le nom affiché dans le haut de la page. Si newName est null, affiche "Anonyme"
 * @param {string | null} newName nouveau nom à afficher.
 */
function updateName(newName) {
    document.getElementById('user-info').innerText = newName || 'Anonyme';
    accountBtn.textContent = newName ? 'Déconnexion' : 'Connexion';
}

/**
 * Met à jour le nom affiché dans le haut de la page en fonction de la présence ou non d'un nom dans le storage.
 * Gère le clic sur le bouton de connexion/déconnexion. 
 *  Si aucun utilisateur n'est connecté, redirige vers la page de connexion.
 *  Si un utilisateur est connecté, fait une demande de déconnexion.
 * TODO : Implémenter la mise à jour du nom d'utilisateur et la gestion du bouton de connexion/déconnexion.
 */
window.addEventListener('load', () => {
    const username = sessionStorage.getItem('user');
    updateName(username)
    accountBtn.addEventListener('click', async () => {
        if (username) {
            console.log("Logging out...");
            await logout();
        } else {
            console.log("Redirecting to login page...");
                window.location.href = '/connect.html';
        }
    });
});

/**
 * Fait une demande de déconnexion au serveur.
 * Supprime le jeton de session et le nom d'utilisateur et recharge la page en cas de succès.
 * TODO : Implémenter la logique de déconnexion.
 */
async function logout() {
    const token = sessionStorage.getItem('token'); 
    if (!token) {
        alert("Vous n'êtes pas connecté.");
        return;
    }
    const response = await fetch(`${SERVER_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.status === HTTP_STATUS.NO_CONTENT) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.reload();
    } else {
        const errorMessage = await response.json();
        console.error('Erreur de déconnexion :', errorMessage.message);
        alert("Erreur lors de la déconnexion.");
    }
}

export { updateName };