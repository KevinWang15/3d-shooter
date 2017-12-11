import * as THREE from "three";
import * as models from "./models";
import setUpEnvironment, { meshes } from "./methods/setUpEnvironment";
import "./index.css";

let keydown = {};
let speed = { x: 0.1, y: 0 };
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
document.addEventListener('keydown', (e) => {
  keydown[e.keyCode] = true;
});
document.addEventListener('keyup', (e) => {
  keydown[e.keyCode] = false;
});

let prevTime = performance.now();
function animate(){
  requestAnimationFrame(animate);
  let time = performance.now();
  let delta = ( time - prevTime ) / 1000;
  prevTime = time;
  renderer.render(scene, camera);
  updateCameraAndGun({ movementX: 0, movementY: 0 });

  if (keydown[87]) { //w
    camera.position.x -= Math.sin(camera.rotation.y) * speed.x;
    camera.position.z -= -Math.cos(camera.rotation.y) * speed.x;
  }
  if (keydown[83]) { //s
    camera.position.x -= Math.sin(camera.rotation.y) * -speed.x;
    camera.position.z -= -Math.cos(camera.rotation.y) * -speed.x;
  }
  if (keydown[65]) { // a
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * speed.x;
    camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * speed.x;
  }
  if (keydown[68]) { // d
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * -speed.x;
    camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * -speed.x;
  }
  if (keydown[87] || keydown[83] || keydown[65] || keydown[68]) {
    updateCameraAndGun()
  }
}

function updateCameraAndGun(event = { movementX: 0, movementY: 0 }) {
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