class Stats {
    constructor() {
        // Variables locales
        this.startTime = Date.now();
        this.prevTime = this.startTime;
        this.frames = 0;
        this.msMin = Infinity;
        this.msMax = 0;
        this.fpsMin = Infinity;
        this.fpsMax = 0;

        // Création de l'élément div pour contenir les statistiques
        this.domElement = document.createElement("div");
        this.domElement.style.cursor = "pointer";
        this.domElement.style.width = "80px";
        this.domElement.style.opacity = "0.9";
        this.domElement.style.zIndex = "10001";

        this.domElement.addEventListener("click", () => {
            this.toggleMode();
        });

        // Création de l'élément pour afficher les FPS
        this.fpsDiv = document.createElement("div");
        this.fpsDiv.style.textAlign = "left";
        this.fpsDiv.style.lineHeight = "1.2em";
        this.domElement.appendChild(this.fpsDiv);

        // Création de l'élément pour afficher les MS
        this.msDiv = document.createElement("div");
        this.msDiv.style.textAlign = "left";
        this.msDiv.style.lineHeight = "1.2em";
        this.msDiv.style.display = "none";
        this.domElement.appendChild(this.msDiv);

        // Initialisation de la boucle de rendu
        this.update();
    }

    toggleMode() {
        this.msDiv.style.display = this.msDiv.style.display === "none" ? "block" : "none";
        this.fpsDiv.style.display = this.fpsDiv.style.display === "none" ? "block" : "none";
    }

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
