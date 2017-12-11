const OBJLoader = require('three-obj-loader');
const MTLLoader = require('three-mtl-loader');
import * as THREE from "three";
OBJLoader(THREE);
let mtlLoader = new MTLLoader();
let modelsSrc = [{ name: "tree", path: "models/tree.obj", mtl: "models/tree.mtl", mesh: null }];
let models = {};
export function load(loadingManager) {
  modelsSrc.forEach(model => {
    let objLoader = new THREE.OBJLoader(loadingManager);
    mtlLoader.load(model.mtl, function (matl) {
      matl.preload();

      objLoader.setMaterials(matl);
      objLoader.load(model.path, function (mesh) {
        mesh.traverse(function (node) {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        models[model.name] = { mesh };
      });
    });
  });
}

export { models };