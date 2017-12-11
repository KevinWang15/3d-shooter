// adapted from https://github.com/mrdoob/three.js/blob/master/examples/js/controls/PointerLockControls.js
/**
 * @author mrdoob / http://mrdoob.com/
 */

import * as THREE from "three";
import { meshes } from "../methods/setUpEnvironment";

export default function PointerLockControls ( camera ) {
  let scope = this;

  let onMouseMove = function ( event ) {
    if ( scope.enabled === false ) return;
    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    camera.rotation.y += movementX * 0.002;
    camera.rotation.x += movementY * 0.002;
    if (meshes.ak) {
      let time = Date.now() * 0.0005;
      meshes.ak.position.set(
        camera.position.x - Math.sin(camera.rotation.y + Math.PI / 6) * 0.75,
        camera.position.y - 0.5 + Math.sin(time * 4 + camera.position.x + camera.position.z) * 0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI / 6) * 0.75,
      );

      meshes.ak.rotation.set(
        camera.rotation.x,
        camera.rotation.y - Math.PI,
        camera.rotation.z,
      );
    }
  };

  document.addEventListener( 'mousemove', onMouseMove, false );
  this.enabled = true;
  this.getObject = function () {
    return camera;
  };
};