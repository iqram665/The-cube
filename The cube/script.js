// Global game engine context and initialization
class Game {
    constructor() {
        this.scene = new THREE.Scene();
        
        // camera setup
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(6, 6, 8);

        // renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        // lighting (so that the cube's edges are clearly visible)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(10, 20, 15);
        this.scene.add(dirLight);

        // Mouse controls for rotating the cube
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.world = { scene: this.scene };
    }
}

// The exact class Cube logic in the screenshot
class Cube {
    constructor(game) {
        this.game = game; //

        // Exact geometry configuration parameters in the screenshot
        this.geometry = {
            pieceCornerRadius: 0.12,    //
            edgeCornerRoundness: 0.15, //
            edgeScale: 0.82,            //
            edgeDepth: 0.01             //
        }; //

        // The exact 3D holder and animator node chain in the screenshot
        this.holder = new THREE.Object3D();   //
        this.object = new THREE.Object3D();   //
        this.animator = new THREE.Object3D(); //

        this.holder.add(this.animator);       //
        this.animator.add(this.object);       //

        this.game.world.scene.add(this.holder); //

        this.initCubePieces();
    }

    //Generate a 3x3x3 Rubik's Cube grid with 27 separate small cubes
    initCubePieces() {
        // The standard 6 colors of the Rubis Cube
        const colors = [
            0xb71c1c, // Right side - Red
            0x0d47a1, // Left side - Blue
            0x1b5e20, // Up side - Green
            0xe65100, // Down side - Orange
            0xffeb3b, // Front side - Yellow
            0xffffff  // Back side - White
        ];

        // Black inner body material for the core of the cube pieces
        const coreMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });

        // Colorful sticker material array for each face of the cube pieces
        const faceMaterials = colors.map(color => new THREE.MeshLambertMaterial({ color: color }));

        const pieceSize = 0.95; // Size of each cube piece
        const pGeo = new THREE.BoxGeometry(pieceSize, pieceSize, pieceSize);

        // 3x3x3 loop generator
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    
                    // Material indexing mapping
                    const materials = [
                        x === 1 ? faceMaterials[0] : coreMaterial,
                        x === -1 ? faceMaterials[1] : coreMaterial,
                        y === 1 ? faceMaterials[2] : coreMaterial,
                        y === -1 ? faceMaterials[3] : coreMaterial,
                        z === 1 ? faceMaterials[4] : coreMaterial,
                        z === -1 ? faceMaterials[5] : coreMaterial
                    ];

                    const mesh = new THREE.Mesh(pGeo, materials);
                    // Position each small cube in its correct coordinate position
                    mesh.position.set(x, y, z);
                    
                    this.object.add(mesh);
                }
            }
        }

        // Rotate the cube to the isometric view as shown in the screenshot
        this.object.rotation.x = 0.45;
        this.object.rotation.y = 0.75;
    }

    update() {
        // Motion effect to make the cube slightly auto-rotate (optional)
        this.animator.rotation.y += 0.003;
    }
}

// Initialization and render loop
const game = new Game();
const rubiksCube = new Cube(game);

function animate() {
    requestAnimationFrame(animate);
    
    // Controls and object state update
    game.controls.update();
    rubiksCube.update();
    
    game.renderer.render(game.scene, game.camera);
}

// Window size change event to adjust canvas in real-time
window.addEventListener('resize', () => {
    game.camera.aspect = window.innerWidth / window.innerHeight;
    game.camera.updateProjectionMatrix();
    game.renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize the 3D world
animate();