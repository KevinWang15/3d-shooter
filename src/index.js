import PointerLockControls from "./lib/PointerLockControls";
import * as THREE from "three";
import * as models from "./models";
import setUpEnvironment, { meshes } from "./methods/setUpEnvironment";
import "./index.css";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, 1000 / 800, 0.1, 100);
let controls = new PointerLockControls(camera);
let loadingManager = new THREE.LoadingManager();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(1000, 800);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
models.load(loadingManager).then(function () {
  console.log("setup",models.models);
  setUpEnvironment(scene);
  document.body.appendChild(renderer.domElement);
  scene.add(controls.getObject());
  camera.lookAt(meshes["tree1"].position);
  renderer.domElement.onclick = () => {
    renderer.domElement.requestPointerLock()
  };
  animate();
});

let prevTime = performance.now();
function animate(){
  requestAnimationFrame(animate);
  let time = performance.now();
  let delta = ( time - prevTime ) / 1000;
  prevTime = time;
  renderer.render(scene, camera);
}