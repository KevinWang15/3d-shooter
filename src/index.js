import * as THREE from "three";
import * as models from "./models";
import setUpEnvironment, { meshes } from "./methods/setUpEnvironment";
import "./index.css";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, 1000 / 800, 0.1, 100);
let loadingManager = new THREE.LoadingManager();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(1000, 800);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
models.load(loadingManager).then(function () {
  setUpEnvironment(scene);
  document.body.appendChild(renderer.domElement);
  camera.lookAt(meshes["tree1"].position);
  camera.position.y += 2;
  renderer.domElement.onclick = () => {
    renderer.domElement.requestPointerLock()
  };
  updateCameraAndGun({ movementX: 0, movementY: 0 });
  animate();
});

document.addEventListener('mousemove', (e) => {
  updateCameraAndGun(e);
});

let prevTime = performance.now();
function animate(){
  requestAnimationFrame(animate);
  let time = performance.now();
  let delta = ( time - prevTime ) / 1000;
  prevTime = time;
  renderer.render(scene, camera);
}

function updateCameraAndGun(event) {
  camera.rotation.y += event.movementX * 0.002;
  if (meshes.gun) {
    let time = Date.now() * 0.0005;
    meshes.gun.position.set(
      camera.position.x - Math.sin(camera.rotation.y + Math.PI / 6) * 0.75,
      camera.position.y - 0.5 + Math.sin(time * 4 + camera.position.x + camera.position.z) * 0.05,
      camera.position.z + Math.cos(camera.rotation.y + Math.PI / 6) * 0.75,
    );

    meshes.gun.rotation.set(
      camera.rotation.x,
      camera.rotation.y - Math.PI,
      camera.rotation.z,
    );
  }
};