// adapted from https://github.com/mrdoob/three.js/blob/master/examples/js/controls/PointerLockControls.js
/**
 * @author mrdoob / http://mrdoob.com/
 */

import * as THREE from "three";
import { meshes } from "../methods/setUpEnvironment";

export default function PointerLockControls ( camera ) {
  let scope = this;
  camera.rotation.set( 0, 0, 0 );
  let pitchObject = new THREE.Object3D();
  pitchObject.add( camera );
  let yawObject = new THREE.Object3D();
  yawObject.position.y = 2;
  yawObject.add( pitchObject );

  let PI_2 = Math.PI / 2;

  let onMouseMove = function ( event ) {
    if ( scope.enabled === false ) return;
    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x += movementY * 0.002;
    pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    // console.log(meshes.ak);
    // meshes.ak.rotation.x = pitchObject.rotation.x;
    // meshes.ak.rotation.y = yawObject.rotation.x;
    if (meshes.ak) {
      setTimeout(() => {
        let time = Date.now() * 0.0005;
        // meshes.ak.position.set(
        //   camera.position.x - Math.sin(camera.rotation.y + Math.PI / 6) * 0.75,
        //   camera.position.y - 0.5 + Math.sin(time * 4 + camera.position.x + camera.position.z) * 0.01,
        //   camera.position.z + Math.cos(camera.rotation.y + Math.PI / 6) * 0.75,
        // );

        let rotation = { x: 0, y: 0, z: 0 };
        let position = { x: 0, y: 0, z: 0 };
        let pointer = camera;
        while (pointer) {
          rotation.x += pointer.rotation.x;
          rotation.y += pointer.rotation.y;
          rotation.z += pointer.rotation.z;
          position.x += pointer.position.x;
          position.y += pointer.position.y;
          position.z += pointer.position.z;
          pointer = pointer.parent;
        }
        meshes.ak.rotation.set(rotation.x + Math.PI, rotation.y, 0);
        meshes.ak.position.set(
          position.x + Math.sin(rotation.y + Math.PI/6) * 2.75,
          position.y - 0.5 + Math.sin(time*4 + position.x + position.z)*0.01,
          position.z + Math.cos(rotation.y + Math.PI/6) * 2.75
        );

      });
    }

  };

  this.dispose = function() {
    document.removeEventListener( 'mousemove', onMouseMove, false );
  };

  document.addEventListener( 'mousemove', onMouseMove, false );
  this.enabled = true;
  this.getObject = function () {
    return yawObject;
  };

  this.getDirection = function() {
    // assumes the camera itself is not rotated
    let direction = new THREE.Vector3( 0, 0, - 1 );
    let rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
    return function( v ) {
      rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
      v.copy( direction ).applyEuler( rotation );
      return v;
    };
  }();
};