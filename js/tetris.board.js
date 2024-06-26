// Définition des constantes pour les collisions et les champs du plateau
window.Tetris = window.Tetris || {};
Tetris.Board = {};

// Types de collisions possibles
Tetris.Board.COLLISION = {NONE:0, WALL:1, GROUND:2};
Object.freeze(Tetris.Board.COLLISION); // Assure que les valeurs ne peuvent pas être modifiées

// États possibles des cellules du plateau
Tetris.Board.FIELD = {EMPTY:0, ACTIVE:1, PETRIFIED:2};
Object.freeze(Tetris.Board.FIELD); // Assure que les valeurs ne peuvent pas être modifiées

Tetris.Board.fields = []; // Initialisation du tableau représentant le plateau

// Fonction d'initialisation du plateau
Tetris.Board.init = function (_x, _y, _z) {
    // Boucle pour parcourir la dimension x
    for (let x = 0; x < _x; x++) {
        Tetris.Board.fields[x] = [];
        // Boucle pour parcourir la dimension y
        for (let y = 0; y < _y; y++) {
            Tetris.Board.fields[x][y] = [];
            // Boucle pour parcourir la dimension z
            for (let z = 0; z < _z; z++) {
                Tetris.Board.fields[x][y][z] = Tetris.Board.FIELD.EMPTY; // Remplissage du plateau avec des cellules vides
            }
        }
    }
};

// Fonction de test de collision des pièces avec le plateau
Tetris.Board.testCollision = function (ground_check) {
    let x, y, z, i;

    let fields = Tetris.Board.fields;
    let posx = Tetris.Block.position.x, posy = Tetris.Block.position.y, posz = Tetris.Block.position.z, shape = Tetris.Block.shape;

    // Boucle pour itérer à travers chaque forme de la pièce
    for (i = 0; i < shape.length; i++) {
        // Vérification des conditions de collision
        if ((shape[i].x + posx) < 0 || (shape[i].y + posy) < 0 || (shape[i].x + posx) >= fields.length || (shape[i].y + posy) >= fields[0].length) {
            return Tetris.Board.COLLISION.WALL; // Collision avec un mur
        }

        // Vérification de collision avec des cellules pétrifiées ou le sol
        if (fields[shape[i].x + posx][shape[i].y + posy][shape[i].z + posz - 1] === Tetris.Board.FIELD.PETRIFIED) {
            return ground_check ? Tetris.Board.COLLISION.GROUND : Tetris.Board.COLLISION.WALL; // Collision avec une pièce pétrifiée
        }

        if((shape[i].z + posz) <= 0) {
            return Tetris.Board.COLLISION.GROUND; // Collision avec le sol
        }
    }
};

// Fonction de vérification des lignes complétées sur le plateau
Tetris.Board.checkCompleted = function() {
    let x, y, z, x2, y2, z2, fields = Tetris.Board.fields;
    let rebuild = false;

    let sum, expected = fields[0].length * fields.length, bonus = 0;

    // Boucle pour itérer à travers chaque couche z
    for(z = 0; z < fields[0][0].length; z++) {
        sum = 0;
        // Boucle pour itérer à travers chaque ligne y
        for(y = 0; y < fields[0].length; y++) {
            // Boucle pour itérer à travers chaque colonne x
            for(x = 0; x < fields.length; x++) {
                if(fields[x][y][z] === Tetris.Board.FIELD.PETRIFIED) sum++; // Compte les cellules pétrifiées
            }
        }

        // Vérification si la ligne est complète
        if(sum == expected) {
            bonus += 1 + bonus; // Calcule le bonus pour les lignes complétées (1, 3, 7, 15...)

            // Suppression de la ligne complétée
            // Boucle pour itérer à travers chaque ligne y
            for(y2 = 0; y2 < fields[0].length; y2++) {
                // Boucle pour itérer à travers chaque colonne x
                for(x2 = 0; x2 < fields.length; x2++) {
                    // Boucle pour décaler les cellules vers le bas
                    for(z2 = z; z2 < fields[0][0].length - 1; z2++) {
                        Tetris.Board.fields[x2][y2][z2] = fields[x2][y2][z2 + 1];
                    }
                    Tetris.Board.fields[x2][y2][fields[0][0].length - 1] = Tetris.Board.FIELD.EMPTY;
                }
            }
            rebuild = true;
            z--;
        }
    }
    if(bonus) {
        Tetris.addPoints(1000 * bonus); // Ajout des points pour les lignes complétées
    }
    if(rebuild) {
        // Réorganisation des blocs pétrifiés
        // Boucle pour itérer à travers chaque couche z
        for(let z = 0; z < fields[0][0].length - 1; z++) {
            // Boucle pour itérer à travers chaque ligne y
            for(let y = 0; y < fields[0].length; y++) {
                // Boucle pour itérer à travers chaque colonne x
                for(let x = 0; x < fields.length; x++) {
                    // Vérification et ajout de blocs statiques pour les cellules pétrifiées
                    if(fields[x][y][z] === Tetris.Board.FIELD.PETRIFIED && !Tetris.staticBlocks[x][y][z]) {
                        Tetris.addStaticBlock(x,y,z);
                    }
                    // Suppression des blocs statiques inutiles
                    if(fields[x][y][z] == Tetris.Board.FIELD.EMPTY && Tetris.staticBlocks[x][y][z]) {
                        Tetris.scene.removeObject(Tetris.staticBlocks[x][y][z]);
                        Tetris.staticBlocks[x][y][z] = undefined;
                    }
                }
            }
        }
    }
};
