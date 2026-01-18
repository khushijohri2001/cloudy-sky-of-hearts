import * as THREE from 'three';
import { GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color("#fdeeda");


const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth/ window.innerHeight,
  0.1,
  1000
);


const textureLoader = new THREE.TextureLoader();
const heartTexture1 = textureLoader.load("assets/pink_heart_1.png")
const heartTexture2 = textureLoader.load("assets/pink_heart_2.png")
const heartTexture3 = textureLoader.load("assets/pink_heart_3.png")

heartTexture1.colorSpace = THREE.SRGBColorSpace;
heartTexture2.colorSpace = THREE.SRGBColorSpace;
heartTexture3.colorSpace = THREE.SRGBColorSpace;


const textures = [
  heartTexture1,
  heartTexture2,
  heartTexture3
]


const skyNormalTexture = textureLoader.load("assets/textures_2/curly_teddy_natural_nor_gl_1k.jpg");
const skyColorTexture = textureLoader.load("assets/textures_2/curly_teddy_natural_diff_1k.jpg");
const skyRoughnessTexture = textureLoader.load("assets/textures_2/curly_teddy_natural_rough_1k.jpg");

skyColorTexture.colorSpace = THREE.SRGBColorSpace;

// Sky
const sphereGeometry = new THREE.SphereGeometry(32, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: '#feebd4',
  normalMap: skyNormalTexture,
  roughnessMap: skyRoughnessTexture,
  roughness: 0.7,
  metalness: 0,
  side: THREE.BackSide,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);


// Heart Particles
const heartsGroup = new THREE.Group();
scene.add(heartsGroup);

const pointCount = 2400;
const pointCountPerGroup = pointCount / textures.length;


for(let i = 0; i< textures.length; i++){
  const pointGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(pointCountPerGroup * 3);

for(let i =0; i < pointCountPerGroup * 3; i++){
  positions[i] = (Math.random() -  0.5) * 30;
}

pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));


const pointsMaterial = new THREE.PointsMaterial({ 
  size: 0.8, 
  sizeAttenuation: true,
  map: textures[i],
  transparent: true,
  // alphaTest: 0.001
  // depthTest: false
  depthWrite: false,
 });


const points = new THREE.Points(pointGeometry, pointsMaterial);
heartsGroup.add(points);

}

// Lighting
const lights = new THREE.Group();

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
lights.add(ambientLight);

// Top
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 30, 0);
lights.add(directionalLight);

// Bottom
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(0, -30, 0);
lights.add(directionalLight2);

// Back
const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight3.position.set(0, 0, -30);
lights.add(directionalLight3);

// Front
const directionalLight4 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight4.position.set(0, 0, 30);
lights.add(directionalLight4);

// Center
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(0, 0, 0);
lights.add(pointLight);

scene.add(lights);


// Adding 3D Models
const gltfLoader = new GLTFLoader();

const cloudModels = new THREE.Group();

gltfLoader.load('assets/models/stylized_clouds.glb', (model) => {
  model.scene.scale.set(0.5, 0.5, 0.5);
  model.scene.position.set(-8, -5, 0);
  model.scene.rotation.y = -Math.PI / 4;
  cloudModels.add(model.scene);
})

gltfLoader.load('assets/models/stylized_clouds.glb', (model) => {
  model.scene.scale.setScalar(0.4);
  model.scene.position.set(-20, 4, -15);
  model.scene.rotation.y = Math.PI / 2;
  cloudModels.add(model.scene);
})

gltfLoader.load('assets/models/stylized_clouds.glb', (model) => {
  model.scene.scale.setScalar(1);
  model.scene.position.set(20, 13, -10);
  cloudModels.add(model.scene);
})

gltfLoader.load('assets/models/stylized_clouds.glb', (model) => {
  model.scene.scale.setScalar(0.8);
  model.scene.position.set(18, -4, -7);
  model.scene.rotation.y = Math.PI * 0.1;
  cloudModels.add(model.scene);
})

gltfLoader.load('assets/models/stylized_clouds.glb', (model) => {
  model.scene.scale.setScalar(1.2);
  model.scene.position.set(-12, -12, 7);
  model.scene.rotation.y = Math.PI * 0.1;
  cloudModels.add(model.scene);
})
gltfLoader.load('assets/models/stylized_clouds.glb', (model) => {
  model.scene.scale.setScalar(0.7);
  model.scene.position.set(12, 12, 8);
  model.scene.rotation.y = Math.PI /4;
  cloudModels.add(model.scene);
})

scene.add(cloudModels);

camera.position.z = 5;

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

scene.environment = new THREE.PMREMGenerator(renderer)
  .fromScene(new THREE.Scene())
  .texture;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

console.log(scene);

const clock = new THREE.Clock();


function animate(){
  requestAnimationFrame(animate);
  controls.update();
  heartsGroup.scale.y += Math.sin(clock.getElapsedTime()) * 0.002;
  heartsGroup.scale.x += Math.sin(clock.getElapsedTime()) * 0.002;
  cloudModels.position.y += Math.cos(clock.getElapsedTime()) * 0.004;

  renderer.render(scene, camera);
}

animate();