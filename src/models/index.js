const OBJLoader = require('three-obj-loader');
const MTLLoader = require('three-mtl-loader');
import * as THREE from "three";
OBJLoader(THREE);
let mtlLoader = new MTLLoader();
let modelsSrc = [
  { name: "tree", path: "models/tree.obj", mtl: "models/tree.mtl", mesh: null, type: "obj" },
  { name: "male", path: "models/male.json", mesh: null, type: "json" },
  { name: "ak", path: "models/ak.json", mesh: null, type: "json" },
];
let models = {};
export function load(loadingManager) {
  let loadPromises = [];

  modelsSrc.forEach(model => {
    loadPromises.push(new Promise(res => {
      if (model.type === 'obj') {
        let objLoader = new THREE.OBJLoader(loadingManager);
        mtlLoader.setTexturePath('models/');
        mtlLoader.load(model.mtl, function (matl) {
          matl.preload();
          objLoader.setMaterials(matl);
          objLoader.load(model.path, function (mesh) {
            models[model.name] = mesh ;
            res();
          });
        });
      } else if (model.type === 'json') {
        let loader = new THREE.ObjectLoader(loadingManager);
        loader.load(model.path, function (obj) {
          models[model.name] = obj;
          res();
        });
      }
    }));
  });

  return Promise.all(loadPromises);
}

export { models };