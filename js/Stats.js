
class Stats {
    constructor() {
        // Variables locales
        this.startTime = Date.now(); // Temps de départ pour le calcul des FPS
        this.prevTime = this.startTime; // Temps précédent pour le calcul du delta time
        this.frames = 0; // Nombre de frames
        this.msMin = Infinity; // Minimum de temps par frame en millisecondes
        this.msMax = 0; // Maximum de temps par frame en millisecondes
        this.fpsMin = Infinity; // Minimum de FPS
        this.fpsMax = 0; // Max de FPS

        // Création de l'élément div pour contenir les statistiques et dedans je donne des styles 
        this.domElement = document.createElement("div"); 
        this.domElement.style.cursor = "pointer"; 
        this.domElement.style.width = "80px"; 
        this.domElement.style.opacity = "0.9"; 
        this.domElement.style.zIndex = "10001"; 

        this.domElement.addEventListener("click", () => {
            // Lorsqu'on clique sur l'élément, bascule entre l'affichage des FPS et des MS / jai fais les 2 modes et il marche mtn
            this.toggleMode();
        });

        // Création de l'élément pour afficher les FPS et je rtefais le style ici
        this.fpsDiv = document.createElement("div");
        this.fpsDiv.style.textAlign = "left"; 
        this.fpsDiv.style.lineHeight = "1.2em"; 
        this.domElement.appendChild(this.fpsDiv);

        // Création de l'élément pour afficher les MS / recréation du style
        this.msDiv = document.createElement("div");
        this.msDiv.style.textAlign = "left"; 
        this.msDiv.style.lineHeight = "1.2em"; 
        this.msDiv.style.display = "none"; 
        this.domElement.appendChild(this.msDiv);

        // Initialisation de la boucle de rendu
        this.update();
    }

    // bascule entre les deux modes
    toggleMode() {
        this.msDiv.style.display = this.msDiv.style.display === "none" ? "block" : "none"; // la c'est MS
        this.fpsDiv.style.display = this.fpsDiv.style.display === "none" ? "block" : "none"; // la c fps 
    }

    // Met à jour les statistiques à chaque frame
    update() {
        // Mise à jour du temps écoulé depuis la dernière mise à jour
        const time = Date.now();
        const deltaTime = time - this.prevTime;
        this.prevTime = time;

        // Calcul des FPS 
        this.frames++;
        if (time > this.startTime + 1000) {
            const fps = Math.round((this.frames * 1000) / (time - this.startTime));
            this.frames = 0;
            this.fpsMin = Math.min(this.fpsMin, fps);
            this.fpsMax = Math.max(this.fpsMax, fps);
            this.fpsDiv.textContent = `${fps} FPS (${this.fpsMin}-${this.fpsMax})`;
            this.startTime = time;
        }

        // Calcul des MS
        this.msMin = Math.min(this.msMin, deltaTime);
        this.msMax = Math.max(this.msMax, deltaTime);
        this.msDiv.textContent = `${deltaTime} MS (${this.msMin}-${this.msMax})`;

        // Réappel de la fonction update pour la prochaine frame
        requestAnimationFrame(() => this.update());
    }
}

// Création de l'instance de Stats
const stats = new Stats();

// Ajout de l'élément à la page
document.body.appendChild(stats.domElement);
