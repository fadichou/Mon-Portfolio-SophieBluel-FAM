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
        console.log("Ajout du projet :", work.title, "URL:", work.imageUrl); // Vérifier les images

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

    console.log("Tous les travaux ont été ajoutés !");
}
// Fonction pour générer dynamiquement les boutons de filtre
function generateFilters(works) {
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
// Appel de la fonction Fetchworks
document.addEventListener("DOMContentLoaded", () => {
    fetchWorks();
});
