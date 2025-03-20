// Fonction pour récupérer les travaux depuis l'API et les afficher dynamiquement
function fetchWorks() {
    fetch("http://localhost:5678/api/works") // Récupération des travaux depuis l'API
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des travaux.");
        }
        return response.json();
      })
      .then(data => {
        console.log("Données récupérées :", data); // Vérification dans la console
        displayWorks(data); // Appel de la fonction pour afficher les projets
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

// Mise à jour de fetchWorks pour appeler generateFilters()
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
    /* script d'authentification avec mail et mdp*/
    document.addEventListener("DOMContentLoaded", () => {
        const loginForm = document.querySelector(".login-form");
    
        if (loginForm) {
            loginForm.addEventListener("submit", async (event) => {
                event.preventDefault(); // Empêche le rechargement de la page
    
                // Récupération des valeurs des champs
                const email = document.querySelector("#email").value;
                const password = document.querySelector("#password").value;
    
                try {
                    // Requête POST pour envoyer les identifiants à l'API
                    const response = await fetch("http://localhost:5678/api/users/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email, password })
                    });
    
                    const data = await response.json();
    
                    if (response.ok) {
                        console.log("Connexion réussie :", data);
    
                        // Stocker le token d'authentification dans le localStorage
                        localStorage.setItem("authToken", data.token);
    
                        // Vérifier stockage du token
                        console.log("Token stocké :", localStorage.getItem("authToken"));
    
                        // Redirection vers la page d'accueil après connexion
                        window.location.href = "index.html";
                    } else {
                        // Afficher un message d'erreur si identifiants incorrects
                        displayErrorMessage("Identifiants incorrects. Veuillez réessayer.");
                    }
                } catch (error) {
                    console.error("Erreur lors de la connexion :", error);
                    displayErrorMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
                }
            });
        }
    });
    
    // Fonction pour afficher un message d'erreur
    function displayErrorMessage(message) {
        let errorMessage = document.querySelector(".error-message");
    
        if (!errorMessage) {
            errorMessage = document.createElement("p");
            errorMessage.classList.add("error-message");
            document.querySelector(".login-form").appendChild(errorMessage);
        }
    
        errorMessage.textContent = message;
        errorMessage.style.color = "red";
        errorMessage.style.textAlign = "center";
        errorMessage.style.marginTop = "10px";
    }

// Fonction pour afficher un message d'erreur
function displayErrorMessage(message) {
    let errorMessage = document.querySelector(".error-message");

    if (!errorMessage) {
        errorMessage = document.createElement("p");
        errorMessage.classList.add("error-message");
        document.querySelector(".login-form").appendChild(errorMessage);
    }

    errorMessage.textContent = message;
    errorMessage.style.color = "red";
    errorMessage.style.textAlign = "center";
    errorMessage.style.marginTop = "10px";
}