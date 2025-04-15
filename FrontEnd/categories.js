// function fetchWorks() {
//     fetch("http://localhost:5678/api/works")
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Erreur lors de la récupération des travaux.");
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log("Données récupérées :", data);
//             allWorks = data; // Stocker les travaux pour les filtres
//             displayWorks(data); // Afficher les travaux sur la page d'acceuil
//             afficherWorksModalep1(data);  // Afficher les travaux à la page1 de la modale
//             generateFilters(data); // Générer les filtres
//         })
//         .catch(error => console.error("Erreur :", error));
// }
// Fonction pour afficher dynamiquement les travaux dans la galerie
function displayWorks(projets) {
    const gallery = document.querySelector(".gallery"); // Sélectionne la galerie
    if (!gallery) {
        console.error("Élément .gallery non trouvé dans le DOM !");
        return;
    }
    gallery.innerHTML = ""; // Nettoie la galerie avant d'ajouter les projets

    console.log("Affichage des travaux..."); // Vérification

    projets.forEach(projet => {
        console.log("Ajout du projet :", projet.title, "URL:", projet.imageUrl); //images, titre et image url venant de API backend get/api/works

        const figure = document.createElement("figure");
        figure.setAttribute("data-id", projet.id);

        const img = document.createElement("img");
        img.src = projet.imageUrl;
        img.alt = projet.title;

        const caption = document.createElement("figcaption");
        caption.textContent = projet.title;

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

// Ajout des événements aux boutons de filtre
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
    fetchWorks(); // Appel de la fonction Fetchworks
    let modifierBtn; // declaration variable vide
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
    //const modifierBtn = document.createElement('button');
    modifierBtn = document.createElement('button');
    modifierBtn.classList.add('modifier-btn');
    modifierBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';

    // On ajoute le titre et le bouton dans l'entete mes projets
    portfolioHeader.appendChild(titreClone);
    portfolioHeader.appendChild(modifierBtn);
}

// Gestion ouverture et fermeture de la modale
const modal = document.querySelector(".modal"); // la modale
const closeBtn = document.querySelector(".close-modal"); // la croix de fermeture

// Ouvrir la premiere page de la modale
    modifierBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");

// Ouvrir la deuxième page de la modale
const page1 = document.querySelector('.gallery-modal-page1');
const page2 = document.querySelector('.form-modal-page2');
const btnToForm = document.querySelector('.form-btn-open');
const returnBtn = document.querySelector('.return-gallery');

if (btnToForm && page1 && page2) {
    btnToForm.addEventListener('click', () => { // on clique sur le btn Ajouter une photo
        page1.classList.add('hidden'); // alors on masque la page1
        page2.classList.remove('hidden'); // et on arrive sur la page2
    });
}
if (returnBtn && page1 && page2) {
    returnBtn.addEventListener('click', () => { // on clique sur le btn retour
        page2.classList.add('hidden'); // on masque la page2
        page1.classList.remove('hidden'); // et on revient sur la page1
    });
}

});

// Fermer la modale via la croix
if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
}

// Fermer la modale en cliquant hors de la modale
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});

// Fermer la modale en cliquant sur la touche Esc
window.addEventListener("keydown", (e) => { // lorsqu'on appuie sur la touche Esc
    console.log("Touche appuyée :", e.key);
    if (e.key === "Escape") {
        modal.classList.add("hidden");
    }
});
}
// éléments de la boîte de confirmation
const popup = document.querySelector(".confirmation-suppression");
const btnConfirmer = document.querySelector(".btn-confirmer");
const btnAnnuler = document.querySelector(".btn-annuler");

let projetASupprimer = null;
let elementDOMaRetirer = null;

function afficherPopupSuppression(idProjet, elementDOM) {
  popup.classList.remove("hidden");
  projetASupprimer = idProjet;
  elementDOMaRetirer = elementDOM;
}

btnAnnuler.addEventListener("click", () => {
  popup.classList.add("hidden");
});

btnConfirmer.addEventListener("click", () => {
  supprimerProjet(projetASupprimer, elementDOMaRetirer);
  popup.classList.add("hidden");
});

    function afficherWorksModalep1(works) {
        const page1Modale = document.querySelector(".projets-modale-page1");
        if (!page1Modale) {
            console.error("Zone .projets-modale-page1 introuvable !");
            return;
        }
    
        page1Modale.innerHTML = ""; // Vider la zone à chaque ouverture
    
        works.forEach(projet => {
            // Créer l’élément figure
            const ProjetPhoto = document.createElement("figure");
            ProjetPhoto.classList.add("vignette-modale");
    
            // Image
            const image = document.createElement("img");
            image.src = projet.imageUrl;
            image.alt = projet.title;
            image.classList.add("image-vignette");
    
            // Icône poubelle
            const iconePoubelle = document.createElement("i");
            iconePoubelle.classList.add("fa-solid", "fa-trash-can", "icone-supprimer");
            iconePoubelle.dataset.id = projet.id;
            // Ajouter l'écouteur d'événement au clic
    iconePoubelle.addEventListener("click", () => {
        afficherPopupSuppression(projet.id, ProjetPhoto);
      });
    
            // Ajout dans figure
            ProjetPhoto.appendChild(image);
            ProjetPhoto.appendChild(iconePoubelle);
    
            // Ajout dans la zone
            page1Modale.appendChild(ProjetPhoto);
        });
    }
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
                displayWorks(data); // Afficher les travaux sur la page d'acceuil
                afficherWorksModalep1(data);  // Afficher les travaux à la page1 de la modale
                generateFilters(data); // Générer les filtres
            })
            .catch(error => console.error("Erreur :", error));
    }

    //fetchWorks();
    // Suppression photo de la modale
    function supprimerProjet(id, elementDOM) {
        const token = localStorage.getItem("authToken");
      
        fetch(`http://localhost:5678/api/works/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            if (response.ok) {
              // Supprimer l’élément du DOM
              elementDOM.remove();
              // Supprimer aussi la vignette sur la page d’accueil
            const vignetteAccueil = document.querySelector(`[data-id='${id}']`);
            if (vignetteAccueil) {
            vignetteAccueil.remove();
            }
            } else {
              alert("La suppression a échoué.");
            }
          })
          .catch(error => {
            console.error("Erreur lors de la suppression :", error);
          });
      }
});