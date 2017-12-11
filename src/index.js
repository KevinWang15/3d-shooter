import * as three from "three";
import * as models from "./models";
import "./index.css";

let scene = new three.Scene();
let camera = new three.PerspectiveCamera(90, 1000 / 800, 0.1, 100);
camera.position.y += 0.2;
let clock = new three.Clock();
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

  let meshFloor = new three.Mesh(
    new three.PlaneGeometry(20, 20, 10, 10),
    new three.MeshPhongMaterial({ color: 0xffffff }),
  );
  meshFloor.rotation.x -= Math.PI / 2;
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);

  meshes['tree1'] = models.models.tree.mesh.clone();
  meshes['tree2'] = models.models.tree.mesh.clone();
  meshes['tree3'] = models.models.tree.mesh.clone();
  meshes['tree1'].position.set(0, 0, 5);
  meshes['tree2'].position.set(5, 0, 8);
  meshes['tree3'].position.set(-5, 0, 8);
  meshes['tree3'].rotation.set(0, Math.PI / 2.2, 0);
  scene.add(meshes["tree1"]);
  scene.add(meshes["tree2"]);
  scene.add(meshes["tree3"]);
  camera.lookAt(meshes["tree1"].position);

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