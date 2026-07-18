import * as THREE from 'three';
import { WORLD_HUMANOID_EYE_HEIGHT } from '../render/voxel.js';

const PLAYER_COLLIDER_HALF_HEIGHT = 0.95;
const CONTROLLER_GROUND_OFFSET = 0.025;

export class FirstPersonController {
  constructor({ camera, canvas, rapier }) {
    this.camera = camera;
    this.canvas = canvas;
    this.rapier = rapier;
    this.keys = new Set();
    this.yaw = 0;
    this.pitch = 0;
    this.verticalVelocity = 0;
    this.speed = 5.2;

    canvas.addEventListener('click', () => {
      if (document.pointerLockElement !== canvas) canvas.requestPointerLock();
    });
    document.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement !== canvas) return;
      this.yaw -= event.movementX * 0.0022;
      this.pitch = THREE.MathUtils.clamp(this.pitch - event.movementY * 0.0022, -1.45, 1.45);
    });
    window.addEventListener('keydown', (event) => this.keys.add(event.code));
    window.addEventListener('keyup', (event) => this.keys.delete(event.code));
  }

  attachWorld(physicsWorld, anchor) {
    this.physicsWorld = physicsWorld;
    this.body = physicsWorld.createRigidBody(
      this.rapier.RigidBodyDesc.kinematicPositionBased().setTranslation(...anchor),
    );
    this.collider = physicsWorld.createCollider(
      this.rapier.ColliderDesc.cuboid(0.38, PLAYER_COLLIDER_HALF_HEIGHT, 0.38),
      this.body,
    );
    this.characterController = physicsWorld.createCharacterController(CONTROLLER_GROUND_OFFSET);
    this.characterController.enableAutostep(0.35, 0.18, true);
    this.characterController.enableSnapToGround(0.25);
    this.characterController.setMaxSlopeClimbAngle(45 * Math.PI / 180);
    this.verticalVelocity = 0;
    this.syncCamera();
  }

  update(deltaTime) {
    if (!this.physicsWorld || !this.body) return;
    const input = new THREE.Vector3(
      Number(this.keys.has('KeyD')) - Number(this.keys.has('KeyA')),
      0,
      Number(this.keys.has('KeyS')) - Number(this.keys.has('KeyW')),
    );
    if (input.lengthSq() > 0) input.normalize();
    input.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    const sprint = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
    const moveSpeed = sprint ? this.speed * 1.65 : this.speed;

    this.verticalVelocity -= 28 * deltaTime;
    const desired = {
      x: input.x * moveSpeed * deltaTime,
      y: this.verticalVelocity * deltaTime,
      z: input.z * moveSpeed * deltaTime,
    };
    this.characterController.computeColliderMovement(this.collider, desired);
    const corrected = this.characterController.computedMovement();
    const current = this.body.translation();
    this.body.setNextKinematicTranslation({
      x: current.x + corrected.x,
      y: current.y + corrected.y,
      z: current.z + corrected.z,
    });
    if (this.characterController.computedGrounded() && this.verticalVelocity < 0) this.verticalVelocity = -1;
    this.physicsWorld.step();
    this.syncCamera();
  }

  syncCamera() {
    const position = this.body.translation();
    const eyeOffset = WORLD_HUMANOID_EYE_HEIGHT - PLAYER_COLLIDER_HALF_HEIGHT - CONTROLLER_GROUND_OFFSET;
    this.camera.position.set(position.x, position.y + eyeOffset, position.z);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.set(this.pitch, this.yaw, 0);
  }
}