import * as three from "three";
import "./index.css";

let scene = new three.Scene();
let camera = new three.PerspectiveCamera(90, 1000 / 800, 0.1, 100);
let box = new three.Mesh(
  new three.BoxGeometry(0.5, 0.5, 0.5),
  new three.MeshBasicMaterial({ color: 'blue' }),
);
let clock = new three.Clock();
box.position.set(0, 0, 5);
camera.lookAt(box.position);
scene.add(box);

let renderer = new three.WebGLRenderer();
renderer.setSize(1000, 800);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.BasicShadowMap;
document.body.appendChild(renderer.domElement);
animate();
function animate(){
  requestAnimationFrame(animate);
  let delta = clock.getDelta();
  renderer.render(scene, camera);
}