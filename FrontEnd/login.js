/* jshint esversion: 8 */
// Activer (true) ou désactiver (false) les logs développeur
const DEBUG = true;
/* script d'authentification avec mail et mdp*/

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    if (DEBUG) console.log("Token présent (login.html) :", token);
  }

  const form = document.querySelector(".login-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Récupère les champs
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("authToken", data.token);
          if (DEBUG) console.log("Token stocké :", data.token); // affiché une seule fois
          window.location.href = "index.html";
        } else {
          document.querySelector(".error-message").textContent =
            "Identifiant ou mot de passe invalide.";
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
      }
    });
  }
});
