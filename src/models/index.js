const OBJLoader = require('three-obj-loader');
const MTLLoader = require('three-mtl-loader');
import * as three from "three";
OBJLoader(three);
let mtlLoader = new MTLLoader();
let modelsSrc = [{ name: "tree", path: "models/Tree1.obj", mtl: "models/Tree1.mtl", mesh: null }];
let models = {};
export function load(loadingManager) {
  modelsSrc.forEach(model => {
    let objLoader = new three.OBJLoader(loadingManager);
    mtlLoader.load(model.mtl, function (matl) {
      matl.preload();

      objLoader.setMaterials(matl);
      objLoader.load(model.path, function (mesh) {
        mesh.traverse(function (node) {
          if (node instanceof three.Mesh) {
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