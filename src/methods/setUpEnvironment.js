import * as THREE from "three";
import * as models from "../models";

let meshes = {};

export default function setUpEnvironment(scene) {
  let ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);
  let light = new THREE.PointLight(0xffff00, 10, 50, 3);
  light.position.set(20, 20, -20);
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 200;
  scene.add(light);

  let meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200, 10, 10),
    new THREE.MeshPhysicalMaterial({ color: 0x44ff00 }),
  );
  meshFloor.rotation.x -= Math.PI / 2;
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);

  meshes['tree1'] = models.models.tree.clone();
  meshes['tree2'] = models.models.tree.clone();
  meshes['tree3'] = models.models.tree.clone();
  meshes['tree1'].position.set(0, 0, 5);
  meshes['tree2'].position.set(5, 0, 8);
  meshes['tree3'].position.set(-5, 0, 8);
  meshes['tree3'].rotation.set(0, Math.PI / 2.2, 0);
  scene.add(meshes["tree1"]);
  scene.add(meshes["tree2"]);
  scene.add(meshes["tree3"]);

  meshes['male1'] = models.models.male.clone();
  meshes['male1'].scale.set(.015,.015,.015);
  meshes['male1'].position.set(0, 0, 3);
  scene.add(meshes["male1"]);

}

export { meshes };