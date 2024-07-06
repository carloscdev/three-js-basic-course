import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

// Crea el renderizador
const renderer = new THREE.WebGLRenderer({antialias: true});

// Establece el tamaño del renderizador
renderer.setSize(window.innerWidth, window.innerHeight);

// Renderiza en el DOM
document.body.appendChild(renderer.domElement);

// Crea la escena
const scene = new THREE.Scene();

// Crea la cámara
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Establece el color de fondo
renderer.setClearColor(0xA3A3A3);

// Crea el control de órbita
const orbit = new OrbitControls(camera, renderer.domElement);

// Establece la posición de la cámara
camera.position.set(6, 6, 6);
// Actualiza el control de órbita en cada frame
orbit.update();

// Crea la grilla en la escena
const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

// Crea una instancia de la clase GLTFLoader para cargar modelos
const gltfLoader = new GLTFLoader();

// Crea una instancia de la clase RGBELoader para cargar mapas de entorno
const rgbeLoader = new RGBELoader();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

let myModel;

rgbeLoader.load('./assets/map.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    gltfLoader.load('./assets/scene.gltf', function(gltf) {
        const model = gltf.scene;

        // Calcular el Bounding Box del modelo
        const bbox = new THREE.Box3().setFromObject(model);

        // Calcular la altura del modelo y el offset necesario
        const height = bbox.max.y - bbox.min.y;
        const offsetY = height / 65 - bbox.min.y;

        // Ajustar la posición del modelo
        model.position.y += offsetY;

        scene.add(model);
        myModel = model;
    });
});

function animate(time) {
    // rotate the model
    if (myModel) {
        myModel.rotation.y = time / 1000;
    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});