// adapted from https://github.com/mrdoob/three.js/blob/master/examples/js/controls/PointerLockControls.js
/**
 * @author mrdoob / http://mrdoob.com/
 */

import * as THREE from "three";

export default function PointerLockControls ( camera ) {
  let scope = this;
  camera.rotation.set( 0, 0, 0 );
  let pitchObject = new THREE.Object3D();
  pitchObject.add( camera );
  let yawObject = new THREE.Object3D();
  yawObject.position.y = 10;
  yawObject.add( pitchObject );

  let PI_2 = Math.PI / 2;

  let onMouseMove = function ( event ) {
    if ( scope.enabled === false ) return;
    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    console.log(movementY);

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x += movementY * 0.002;
    pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
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