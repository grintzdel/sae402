window.Tetris = window.Tetris || {};

class Utils {
    // Clone un vecteur
    static cloneVector(v) {
        return { x: v.x, y: v.y, z: v.z };
    }

    // Arrondit les coordonnées d'un vecteur à l'entier le plus proche
    static roundVector(v) {
        v.x = Math.round(v.x);
        v.y = Math.round(v.y);
        v.z = Math.round(v.z);
    }
}

class Block {
    // Définition des formes possibles pour les blocs
static shapes = [
    // Forme en L
    [ 
        {x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 1, y: 1, z: 0},
        {x: 1, y: 2, z: 0}
    ],
    // Forme en ligne 
    [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 0, y: 2, z: 0},
    ],
    // Forme en carré
    [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 1, y: 1, z: 0}
    ],
    // Forme en T
    [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 0, y: 2, z: 0},
        {x: 1, y: 1, z: 0}
    ],
    // Forme en Z
    [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 1, y: 1, z: 0},
        {x: 1, y: 2, z: 0}
    ]
];


    static position = {};


    // Génère un nouveau bloc dans le jeu et rajoute les shaders
    static generate() {

        Tetris.shaders = [];

        Tetris.shaders.push(new THREE.ShaderMaterial({
            uniforms: {
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
                `,
            fragmentShader: `
                void main() {
                    float color = 0.0;
                
                    color += sin( gl_FragCoord.x * cos( 10.0/15.0 ) * 80.0 );
                    color += sin( gl_FragCoord.y * sin( 8.0/10.0 ) * 40.0 );
                    color += sin( gl_FragCoord.x * sin( 3.0/5.0 ) * 10.0 );
                
                    color *= sin( 5.0/10.0 ) * 0.5;
                
                    gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + 2.0/3.0 ) * 0.75 ), 1.0 );
                }
                `
        }));

        Tetris.shaders.push(new THREE.ShaderMaterial({
            uniforms: {
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
                `,
            fragmentShader: `
                void main() {
                    float color = 3.2;
                
                    color += cos( gl_FragCoord.x * sin( 2.0/15.0 ) * 20.0 );
                    color += cos( gl_FragCoord.y * cos( 8.0/10.0 ) * 40.0 );
                    color += sin( gl_FragCoord.x * cos( 3.0/5.0 ) * 10.0 );
                
                    color *= sin( 5.0/10.0 ) * 0.5;
                
                    gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + 2.0/3.0 ) * 0.75 ), 1.0 );
                }
                `
        }));

        Tetris.shaders.push(new THREE.ShaderMaterial({
            uniforms: {
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
                `,
            fragmentShader: `
                void main() {
                    float color = 6.3;
                
                    color += cos( gl_FragCoord.x * sin( 2.0/15.0 ) * 20.0 );
                    color += cos( gl_FragCoord.y * cos( 8.0/10.0 ) * 40.0 );
                    color += sin( gl_FragCoord.x * sin( 4.0/5.0 ) * 10.0 );
                    color *= sin( 7.0/10.0 ) * 0.5;
                
                    gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + 2.0/3.0 ) * 0.75 ), 1.0 );
                }
                `
        }));

        Tetris.shaders.push(new THREE.ShaderMaterial({
            uniforms: {
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
                `,
            fragmentShader: `
                void main() {
                    float color = 7.3;
                   
                    color *= cos( gl_FragCoord.x * sin( 2.0/15.0 ) * 20.0 );
                    color *= cos( gl_FragCoord.y * cos( 8.0/10.0 ) * 40.0 );
                    color += sin( 5.0/10.0 ) * 0.5;
                
                    gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + 2.0/3.0 ) * 0.75 ), 1.0 );
                }
                `
        }));


     // Crée une géométrie de cube pour le bloc avec la taille définie
const geometry = new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize);

// Sélectionne aléatoirement un type de bloc parmi les formes disponibles
const type = Math.floor(Math.random() * Tetris.Block.shapes.length);
this.blockType = type; // Définit le type de bloc pour le bloc actuel
Tetris.Block.shape = Tetris.Block.shapes[type].map(vec => Utils.cloneVector(vec)); // Copie la forme du bloc sélectionné

// Crée les sous-blocs qui composent le bloc principal
for (let i = 1; i < Tetris.Block.shape.length; i++) {
    const tmpGeometry = new THREE.Mesh(new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize));
    // Positionne chaque sous-bloc selon les coordonnées de la forme du bloc
    tmpGeometry.position.x = Tetris.blockSize * Tetris.Block.shape[i].x;
    tmpGeometry.position.y = Tetris.blockSize * Tetris.Block.shape[i].y;
    THREE.GeometryUtils.merge(geometry, tmpGeometry); // Fusionne les sous-blocs dans la géométrie principale
}

// Sélectionne aléatoirement un shader pour le bloc parmi les shaders disponibles
let randomShader = Tetris.shaders[Math.floor(Math.random() * Tetris.shaders.length)];

// Crée le mesh du bloc en utilisant la géométrie avec les matériaux spécifiés
Tetris.Block.mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
    new THREE.MeshBasicMaterial({ color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true }), // Matériau de base pour le fil de fer
    randomShader // Matériau shader aléatoire
]);


        /// initial position
Tetris.Block.position = { x: Math.floor(Tetris.boundingBoxConfig.splitX / 2) - 1, y: Math.floor(Tetris.boundingBoxConfig.splitY / 2) - 1, z: 15 };

// Vérifie s'il y a collision avec le sol
if (Tetris.Board.testCollision(true) === Tetris.Board.COLLISION.GROUND) {
    Tetris.gameOver = true;
    Tetris.pointsDOM.innerHTML = "GAME OVER";
    Tetris.sounds["gameover"].play();
    Cufon.replace('#points');
}

// Positionne le bloc dans la scène en fonction de sa position et de la taille des blocs
Tetris.Block.mesh.position.x = (Tetris.Block.position.x - Tetris.boundingBoxConfig.splitX / 2) * Tetris.blockSize / 2;
Tetris.Block.mesh.position.y = (Tetris.Block.position.y - Tetris.boundingBoxConfig.splitY / 2) * Tetris.blockSize / 2;
Tetris.Block.mesh.position.z = (Tetris.Block.position.z - Tetris.boundingBoxConfig.splitZ / 2) * Tetris.blockSize + Tetris.blockSize / 2;
Tetris.Block.mesh.rotation = { x: 0, y: 0, z: 0 };
Tetris.Block.mesh.overdraw = true;

// Ajoute le bloc à la scène
Tetris.scene.add(Tetris.Block.mesh);
}

// Fait tourner le bloc actuel
static rotate(x, y, z) {
    Tetris.Block.mesh.rotation.x += x * Math.PI / 180;
    Tetris.Block.mesh.rotation.y += y * Math.PI / 180;
    Tetris.Block.mesh.rotation.z += z * Math.PI / 180;

    // Crée une matrice de rotation
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.setRotationFromEuler(Tetris.Block.mesh.rotation);

    // Met à jour la forme du bloc après rotation en appliquant la matrice de rotation
    for (let i = 0; i < Tetris.Block.shape.length; i++) {
        Tetris.Block.shape[i] = rotationMatrix.multiplyVector3(Utils.cloneVector(Tetris.Block.shapes[this.blockType][i]));
        Utils.roundVector(Tetris.Block.shape[i]);
    }

    // Vérifie s'il y a collision avec le mur et inverse la rotation si nécessaire
    if (Tetris.Board.testCollision(false) === Tetris.Board.COLLISION.WALL) {
        Tetris.Block.rotate(-x, -y, -z); // Réapplique la rotation inverse
    }
}


 // Déplace le bloc actuel dans une direction donnée sur le plateau de jeu
static move(x, y, z) {
    // Met à jour la position du mesh du bloc dans les trois dimensions selon les déplacements
    Tetris.Block.mesh.position.x += x * Tetris.blockSize;
    Tetris.Block.position.x += x;

    Tetris.Block.mesh.position.y += y * Tetris.blockSize;
    Tetris.Block.position.y += y;

    Tetris.Block.mesh.position.z += z * Tetris.blockSize;
    Tetris.Block.position.z += z;

    // Vérifie s'il y a eu une collision après le déplacement
    const collision = Tetris.Board.testCollision((z != 0));

    // Si le déplacement a entraîné une collision avec un mur
    if (collision === Tetris.Board.COLLISION.WALL) {
        // Inverse le mouvement pour revenir à la position précédente
        Tetris.Block.move(-x, -y, 0); // "Laziness FTW" - retourne à la version précédente du mouvement
    }
    // Si le déplacement a entraîné une collision avec le sol
    if (collision === Tetris.Board.COLLISION.GROUND) {
         // son
        Tetris.Block.hitBottom();
       // son
        Tetris.sounds["collision"].play();
        // son
        Tetris.Board.checkCompleted();
    } else {
        // son
        Tetris.sounds["move"].play();
    }
}



    // partie ou je Rend immobile le bloc actuel en le convertissant en bloc statique sur le plateau de jeu
static petrify() {
    // Récupère la forme du bloc actuel
    const shape = Tetris.Block.shape;

    // Parcourt chaque élément de la forme du bloc
    for (let i = 0; i < shape.length; i++) {
        // Ajoute un bloc statique à la position correspondante sur le plateau de jeu
        Tetris.addStaticBlock(Tetris.Block.position.x + shape[i].x, Tetris.Block.position.y + shape[i].y, Tetris.Block.position.z + shape[i].z);
        
        // Marque la position du bloc actuel comme étant pétrifiée sur le plateau de jeu
        Tetris.Board.fields[Tetris.Block.position.x + shape[i].x][Tetris.Block.position.y + shape[i].y][Tetris.Block.position.z + shape[i].z] = Tetris.Board.FIELD.PETRIFIED;
    }
}



    // Gère ce qui se passe lorsque le bloc actuel atteint le bas du plateau de jeu
    static hitBottom() {
        Tetris.Block.petrify();
        Tetris.scene.removeObject(Tetris.Block.mesh);
        Tetris.Block.generate();
    }
}

Tetris.Utils = Utils;
Tetris.Block = Block;
