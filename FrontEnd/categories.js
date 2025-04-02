function fetchWorks() {
    fetch("http://localhost:5678/api/works")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des travaux.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Données récupérées :", data);
            allWorks = data; // Stocker les travaux pour les filtres
            displayWorks(data); // Afficher les travaux
            generateFilters(data); // Générer les filtres
        })
        .catch(error => console.error("Erreur :", error));
}
// Fonction pour afficher dynamiquement les travaux dans la galerie
function displayWorks(works) {
    const gallery = document.querySelector(".gallery"); // Sélectionne la galerie
    if (!gallery) {
        console.error("Élément .gallery non trouvé dans le DOM !");
        return;
    }

    gallery.innerHTML = ""; // Nettoie la galerie avant d'ajouter les projets

    console.log("Affichage des travaux..."); // Vérification

    works.forEach(work => {
        console.log("Ajout du projet :", work.title, "URL:", work.imageUrl); //images, titre et image url venant de API backend get/api/works

        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const caption = document.createElement("figcaption");
        caption.textContent = work.title;

        // Ajouter les éléments à la galerie
        figure.appendChild(img);
        figure.appendChild(caption);
        gallery.appendChild(figure);
    });

    console.log("Tous les travaux ont été ajoutés!");
}
// Fonction pour générer dynamiquement les boutons de filtre
function generateFilters(works) {
    const token = localStorage.getItem("authToken"); // si user connecté, token stocké
    if (token) return; // Si connecté, filtres non affichés, suite code non exécuté
    const filtersContainer = document.createElement("div");
    filtersContainer.classList.add("filters");

    // Ajouter le bouton "Tous" par défaut
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filter-btn", "active");
    allButton.setAttribute("data-category", "all");
    filtersContainer.appendChild(allButton);

    // Récupérer les catégories uniques
    const categories = new Set();
    works.forEach(work => categories.add(work.category.name));
   /* works.forEach(work => {
        const categoryName = work.category.name === "Appartements" ? "Studio" : work.category.name;
        categories.add(categoryName);
    }); */

    // Créer les boutons de catégories
    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.classList.add("filter-btn");
        button.setAttribute("data-category", category);
        filtersContainer.appendChild(button);
    });

    // Insérer les filtres avant la galerie
    const portfolioSection = document.getElementById("portfolio");
    portfolioSection.insertBefore(filtersContainer, portfolioSection.querySelector(".gallery"));

    addFilterEventListeners();
}

// Fonction pour filtrer les travaux
function filterWorks(category) {
    if (category === "all") {
        displayWorks(allWorks); // Affiche tous les travaux
    } else {
        const filteredWorks = allWorks.filter(work => work.category.name === category);
        displayWorks(filteredWorks);
    }
}

// Ajoute des événements aux boutons de filtre
function addFilterEventListeners() {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Retirer la classe active des autres boutons
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Filtrer les travaux en fonction de la catégorie sélectionnée
            const category = button.getAttribute("data-category");
            filterWorks(category);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("authToken"); //Vérifier si l'user est connecté
    if (token) {
        console.log("L'utilisateur est connecté : affichage du mode admin"); // token stocké dans localstorage, on ajoute le bandeau noir et le bouton "modifier"
   
        // Création du bandeau noir en haut de page
   const adminBanner = document.createElement("div"); //creation variable adminbanner avec nouvel element div pour icone crayon et texte mode edition
   adminBanner.classList.add("admin-banner"); //Création classe CSS banniere admin
   adminBanner.innerHTML = `
    <i class="fa-regular fa-pen-to-square"></i>
    <span>Mode édition</span>
`;
   // Insertion du bandeau en haut du <body> avec la méthode prepend
   document.body.prepend(adminBanner);

   // Changer "login" en "logout" dans la barre de navigation de la page d'accueil après connection de l'utilisateur
const loginLink = document.querySelector('nav ul li a[href="login.html"]'); // cherche lien login dans le fichier login.html
if (loginLink) {

    // Création d’un nouveau lien logout
    const logoutLink = loginLink.cloneNode(true); //copie du lien login
    logoutLink.textContent = "logout"; //Changement texte login en logout
    logoutLink.href = "#"; // désactivation du lien login

    logoutLink.addEventListener("click", (event) => { //clic sur logout
        event.preventDefault(); //empeche comportement par defaut
        localStorage.removeItem("authToken"); //supprime token
        window.location.reload(); //recharge la page
    });

    // Remplace l'ancien lien login par nouveau lien logout
    loginLink.parentElement.replaceChild(logoutLink, loginLink);
}

// Ajout dynamique du bouton “modifier” à côté du titre “Mes Projets”
const mesProjetsTitre = document.querySelector('#portfolio h2'); // Sélectionne le titre “Mes Projets dans portfolio”

if (mesProjetsTitre) {
    const portfolioHeader = document.createElement('div'); //crée un nouvel element <span> qui va contenir l'icone et modifier
    portfolioHeader.classList.add('portfolio-header'); // ajout classe pour style css

    // On déplace le h2
    const titreClone = mesProjetsTitre.cloneNode(true);

    // On remplace le titre temporairement
    mesProjetsTitre.replaceWith(portfolioHeader);

    // Création du bouton
    const modifierBtn = document.createElement('button');
    modifierBtn.classList.add('modifier-btn');
    modifierBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';

    // On ajoute le titre et le bouton dans l'entete mes projets
    portfolioHeader.appendChild(titreClone);
    portfolioHeader.appendChild(modifierBtn);
}

    }

    fetchWorks(); // Appel de la fonction Fetchworks
});