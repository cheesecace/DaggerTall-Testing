function part(figure, name) {
  return figure.getObjectByName(name);
}

export function poseVoxelHumanoid(figure, state, elapsedSeconds = 0, speed = 1) {
  const leftArm = part(figure, 'leftArm');
  const rightArm = part(figure, 'rightArm');
  const leftLeg = part(figure, 'leftLeg');
  const rightLeg = part(figure, 'rightLeg');
  const torso = part(figure, 'torso');
  const head = part(figure, 'head');
  if (!leftArm || !rightArm || !leftLeg || !rightLeg || !torso || !head) return;

  if (state === 'sleep') {
    figure.rotation.z = Math.PI / 2;
    [leftArm, rightArm, leftLeg, rightLeg].forEach((limb) => { limb.rotation.x = 0; });
    return;
  }

  figure.rotation.z = 0;
  if (state === 'walk') {
    const stride = Math.sin(elapsedSeconds * 7 * speed) * 0.62;
    leftArm.rotation.x = stride;
    rightArm.rotation.x = -stride;
    leftLeg.rotation.x = -stride * 0.72;
    rightLeg.rotation.x = stride * 0.72;
    torso.rotation.z = Math.sin(elapsedSeconds * 14 * speed) * 0.025;
    head.position.y = 2.75 + Math.abs(Math.sin(elapsedSeconds * 7 * speed)) * 0.045;
    return;
  }

  leftArm.rotation.x = 0;
  rightArm.rotation.x = 0;
  leftLeg.rotation.x = 0;
  rightLeg.rotation.x = 0;
  torso.rotation.z = 0;
  head.position.y = 2.75 + Math.sin(elapsedSeconds * 1.8) * 0.012;
}
