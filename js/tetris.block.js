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
        [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 1, y: 1, z: 0 },
            { x: 1, y: 2, z: 0 }
        ],
        [
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: 2, z: 0 },
        ],
        [
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 1, y: 1, z: 0 }
        ],
        [
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: 2, z: 0 },
            { x: 1, y: 1, z: 0 }
        ],
        [
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 1, y: 1, z: 0 },
            { x: 1, y: 2, z: 0 }
        ]
    ];

    static position = {};

    // Génère un nouveau bloc dans le jeu
    static generate() {
        const geometry = new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize);
        const type = Math.floor(Math.random() * Tetris.Block.shapes.length);
        this.blockType = type;
        Tetris.Block.shape = Tetris.Block.shapes[type].map(vec => Utils.cloneVector(vec));

        for (let i = 1; i < Tetris.Block.shape.length; i++) {
            const tmpGeometry = new THREE.Mesh(new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize));
            tmpGeometry.position.x = Tetris.blockSize * Tetris.Block.shape[i].x;
            tmpGeometry.position.y = Tetris.blockSize * Tetris.Block.shape[i].y;
            THREE.GeometryUtils.merge(geometry, tmpGeometry);
        }

        Tetris.Block.mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
            new THREE.MeshBasicMaterial({ color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true }),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        ]);

        // initial position
        Tetris.Block.position = { x: Math.floor(Tetris.boundingBoxConfig.splitX / 2) - 1, y: Math.floor(Tetris.boundingBoxConfig.splitY / 2) - 1, z: 15 };

        if (Tetris.Board.testCollision(true) === Tetris.Board.COLLISION.GROUND) {
            Tetris.gameOver = true;
            Tetris.pointsDOM.innerHTML = "GAME OVER";
            Tetris.sounds["gameover"].play();
            Cufon.replace('#points');
        }

        Tetris.Block.mesh.position.x = (Tetris.Block.position.x - Tetris.boundingBoxConfig.splitX / 2) * Tetris.blockSize / 2;
        Tetris.Block.mesh.position.y = (Tetris.Block.position.y - Tetris.boundingBoxConfig.splitY / 2) * Tetris.blockSize / 2;
        Tetris.Block.mesh.position.z = (Tetris.Block.position.z - Tetris.boundingBoxConfig.splitZ / 2) * Tetris.blockSize + Tetris.blockSize / 2;
        Tetris.Block.mesh.rotation = { x: 0, y: 0, z: 0 };
        Tetris.Block.mesh.overdraw = true;

        Tetris.scene.add(Tetris.Block.mesh);
    }

    // Fait tourner le bloc actuel
    static rotate(x, y, z) {
        Tetris.Block.mesh.rotation.x += x * Math.PI / 180;
        Tetris.Block.mesh.rotation.y += y * Math.PI / 180;
        Tetris.Block.mesh.rotation.z += z * Math.PI / 180;

        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.setRotationFromEuler(Tetris.Block.mesh.rotation);

        for (let i = 0; i < Tetris.Block.shape.length; i++) {
            Tetris.Block.shape[i] = rotationMatrix.multiplyVector3(Utils.cloneVector(Tetris.Block.shapes[this.blockType][i]));
            Utils.roundVector(Tetris.Block.shape[i]);
        }

        if (Tetris.Board.testCollision(false) === Tetris.Board.COLLISION.WALL) {
            Tetris.Block.rotate(-x, -y, -z); // laziness FTW
        }
    }

    // Déplace le bloc actuel
    static move(x, y, z) {
        Tetris.Block.mesh.position.x += x * Tetris.blockSize;
        Tetris.Block.position.x += x;

        Tetris.Block.mesh.position.y += y * Tetris.blockSize;
        Tetris.Block.position.y += y;

        Tetris.Block.mesh.position.z += z * Tetris.blockSize;
        Tetris.Block.position.z += z;

        const collision = Tetris.Board.testCollision((z != 0));

        if (collision === Tetris.Board.COLLISION.WALL) {
            Tetris.Block.move(-x, -y, 0); // laziness FTW
        }
        if (collision === Tetris.Board.COLLISION.GROUND) {
            Tetris.Block.hitBottom();
            Tetris.sounds["collision"].play();
            Tetris.Board.checkCompleted();
        } else {
            Tetris.sounds["move"].play();
        }
    }

    // rend immobile le bloc actuel
    static petrify() {
        const shape = Tetris.Block.shape;
        for (let i = 0; i < shape.length; i++) {
            Tetris.addStaticBlock(Tetris.Block.position.x + shape[i].x, Tetris.Block.position.y + shape[i].y, Tetris.Block.position.z + shape[i].z);
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
