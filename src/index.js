import * as three from "three";
import * as models from "./models";
import "./index.css";

let scene = new three.Scene();
let camera = new three.PerspectiveCamera(90, 1000 / 800, 0.1, 100);
camera.position.y += 0.2;
let box = new three.Mesh(
  new three.BoxGeometry(0.5, 0.5, 0.5),
  new three.MeshBasicMaterial({ color: 'blue' }),
);
let clock = new three.Clock();
box.position.set(0, 0, 5);
camera.lookAt(box.position);
scene.add(box);
let loadingManager = new three.LoadingManager();
let meshes = {};
let renderer = new three.WebGLRenderer();

loadingManager.onLoad = function () {
  console.log("loaded all resources", models.models);
  let ambientLight = new three.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  let light = new three.PointLight(0xffffff, 0.9, 18);
  light.position.set(5,5,-10);
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  scene.add(light);

  meshes['tree1'] = models.models.tree.mesh.clone();
  meshes['tree2'] = models.models.tree.mesh.clone();
  meshes['tree3'] = models.models.tree.mesh.clone();
  meshes['tree1'].position.set(-1, 0, 5);
  meshes['tree2'].position.set(-2, 0, 5);
  meshes['tree3'].position.set(-3, 0, 5);
  meshes['tree3'].rotation.set(0, Math.PI / 2.2, 0);
  scene.add(meshes["tree1"]);
  scene.add(meshes["tree2"]);
  scene.add(meshes["tree3"]);

  renderer.setSize(1000, 800);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = three.BasicShadowMap;
  document.body.appendChild(renderer.domElement);
  animate();
};
models.load(loadingManager);

function animate(){
  requestAnimationFrame(animate);
  let delta = clock.getDelta();
  renderer.render(scene, camera);
}