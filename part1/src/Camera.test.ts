import Camera from './Camera';
import { mat4, vec3, vec4 } from 'gl-matrix';

describe('Camera', () => {
    let camera: Camera;

    beforeEach(() => {
        camera = new Camera();
    });

    it('should create a new instance of Camera', () => {
        expect(camera).toBeInstanceOf(Camera);
    });

    it('should set and get the eye position', () => {
        const eyePosition = vec3.fromValues(5, 5, 5);
        camera.setEyePosition(eyePosition);
        expect(camera.eyePosition).toEqual(eyePosition);
    });

    it('should set and get the look at position', () => {
        const lookAt = vec3.fromValues(2, 1, 0);
        camera.setLookAt(lookAt);
        expect(camera.lookAt).toEqual(lookAt);
    });

    it('should set and get the up vector', () => {
        const upVector = vec3.fromValues(0, 1, 0);
        camera.setUpVector(upVector);
        expect(camera.upVector).toEqual(upVector);
    });

    it('should update the view matrix', () => {
        const eyePosition = vec3.fromValues(0, 0, 4);
        const lookAt = vec3.fromValues(0, 0, 3);
        const upVector = vec3.fromValues(0, 1, 0);
        camera.setEyePosition(eyePosition);
        camera.setLookAt(lookAt);
        camera.setUpVector(upVector);
        camera.updateViewMatrix();
        let column1 = vec4.fromValues(1, 0, 0, 0);
        let column2 = vec4.fromValues(0, 1, 0, 0);
        let column3 = vec4.fromValues(0, 0, 1, 0);
        let column4 = vec4.fromValues(-0, -0, -4, 1);

        let expectedMatrix = mat4.fromValues(
            column1[0], column1[1], column1[2], column1[3],
            column2[0], column2[1], column2[2], column2[3],
            column3[0], column3[1], column3[2], column3[3],
            column4[0], column4[1], column4[2], column4[3]
        );
        expect(camera.viewMatrix).toEqual(expectedMatrix);
    });

    it('should update the projection matrix', () => {
        camera.updateProjectionMatrix();
        let foundMatrix = camera.projectionMatrix;
        expect(camera.projectionMatrix).toEqual(mat4.perspective(mat4.create(), 45 / 180.0 * Math.PI, 1, 0.1, 100));
    });

    it('should update the camera', () => {
        const eyePosition = vec3.fromValues(0, 0, 1);
        const lookAt = vec3.fromValues(0, 0, 0);
        const upVector = vec3.fromValues(0, 1, 0);
        camera.setEyePosition(eyePosition);
        camera.setLookAt(lookAt);
        camera.setUpVector(upVector);
        camera.updateCamera();
        expect(camera.viewMatrix).toEqual(mat4.lookAt(mat4.create(), eyePosition, lookAt, upVector));
        expect(camera.projectionMatrix).toEqual(mat4.perspective(mat4.create(), 45 / 180.0 * Math.PI, 1, 0.1, 100));
    });

    it('should set the aspect ratio', () => {
        camera.setAspectRatio(2);
        expect(camera.aspectRatio).toEqual(2);
    });

    it('should set the field of view', () => {
        camera.setFieldOfView(90);
        expect(camera.fieldOfView).toEqual(90);
    });

    it('should set the near plane', () => {
        camera.setNearPlane(0.5);
        expect(camera.nearPlane).toEqual(0.5);
    });

    it('should set the far plane', () => {
        camera.setFarPlane(100);
        expect(camera.farPlane).toEqual(100);
    });

    it('should update the upVector when i look up by 90 degrees', () => {
        const eyePosition = vec3.fromValues(0, 0, 5);
        const lookAt = vec3.fromValues(0, 0, 0);
        const upVector = vec3.fromValues(0, 1, 0);
        camera.setEyePosition(eyePosition);
        camera.setLookAt(lookAt);
        camera.setUpVector(upVector);
        camera.updateCamera();
        camera.lookUp(90);
        const foundUpVector = camera.upVector;
        const truncatedUpVector = vec3.fromValues(Math.round(foundUpVector[0]), Math.round(foundUpVector[1]), Math.round(foundUpVector[2]));
        expect(truncatedUpVector).toEqual(vec3.fromValues(0, 0, 1));
    });

    it('should update the upVector when i look up by 45 degrees', () => {
        const eyePosition = vec3.fromValues(0, 0, 5);
        const lookAt = vec3.fromValues(0, 0, 0);
        const upVector = vec3.fromValues(0, 1, 0);
        camera.setEyePosition(eyePosition);
        camera.setLookAt(lookAt);
        camera.setUpVector(upVector);
        camera.updateCamera();
        camera.lookUp(45);
        const foundUpVector = camera.upVector;
        const expectedUpVector = vec3.fromValues(0, 0.7071067811865475, 0.7071067811865475);
        expect(foundUpVector).toEqual(expectedUpVector);

    });

    it('should update the upVector when i rotate the camera by 90 degrees', () => {
        const eyePosition = vec3.fromValues(0, 0, 5);
        const lookAt = vec3.fromValues(0, 0, 0);
        const upVector = vec3.fromValues(0, 1, 0);
        camera.setEyePosition(eyePosition);
        camera.setLookAt(lookAt);
        camera.setUpVector(upVector);
        camera.updateCamera();
        camera.rollCamera(90);
        const foundUpVector = camera.upVector;
        const truncatedUpVector = vec3.fromValues(Math.round(foundUpVector[0]), Math.round(foundUpVector[1]), Math.round(foundUpVector[2]));
        const expectedUpVector = vec3.fromValues(1, 0, 0);
        expect(truncatedUpVector).toEqual(expectedUpVector);
    });

    it('should update the upVector when i rotate the camera by 45 degrees', () => {
        const eyePosition = vec3.fromValues(0, 0, 5);
        const lookAt = vec3.fromValues(0, 0, 0);
        const upVector = vec3.fromValues(0, 1, 0);
        camera.setEyePosition(eyePosition);
        camera.setLookAt(lookAt);
        camera.setUpVector(upVector);
        camera.updateCamera();
        camera.rollCamera(45);
        const foundUpVector = camera.upVector;
        const expectedUpVector = vec3.fromValues(0.7071067811865475, 0.7071067811865475, 0);
        expect(foundUpVector).toEqual(expectedUpVector);
    });



});

export { };