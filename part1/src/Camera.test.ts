import Camera from './Camera';
import { mat4, vec3 } from 'gl-matrix';

describe('Camera', () => {
    let camera: Camera;

    beforeEach(() => {
        camera = Camera.getInstance();
    });

    it('should create a new instance of Camera', () => {
        expect(camera).toBeInstanceOf(Camera);
    });

    it('should set and get the view matrix', () => {
        const viewMatrix = mat4.create();
        camera.setViewMatrix(viewMatrix);
        expect(camera.getViewMatrix()).toEqual(viewMatrix);
    });

    it('should set and get the projection matrix', () => {
        const projectionMatrix = mat4.create();
        camera.setProjectionMatrix(projectionMatrix);
        expect(camera.getProjectionMatrix()).toEqual(projectionMatrix);
    });

    it('should set and get the eye position', () => {
        const eyePosition = vec3.create();
        camera.setEyePosition(eyePosition);
        expect(camera.getEyePosition()).toEqual(eyePosition);
    });

    it('should set and get the look at position', () => {
        const lookAt = vec3.create();
        camera.setLookAt(lookAt);
        expect(camera.getLookAt()).toEqual(lookAt);
    });

    it('should set and get the up vector', () => {
        const upVector = vec3.create();
        camera.setUpVector(upVector);
        expect(camera.getUpVector()).toEqual(upVector);
    });

    it('should update the view matrix', () => {
        const eyePosition = vec3.fromValues(0, 0, 1);
        const lookAt = vec3.fromValues(0, 0, 0);
        const upVector = vec3.fromValues(0, 1, 0);
        camera.setEyePosition(eyePosition);
        camera.setLookAt(lookAt);
        camera.setUpVector(upVector);
        camera.updateViewMatrix();
        expect(camera.getViewMatrix()).toEqual(mat4.lookAt(mat4.create(), eyePosition, lookAt, upVector));
    });

    it('should update the projection matrix', () => {
        camera.updateProjectionMatrix();
        expect(camera.getProjectionMatrix()).toEqual(mat4.perspective(mat4.create(), 45, 1, 0.1, 100));
    });

    it('should update the camera', () => {
        const eyePosition = vec3.fromValues(0, 0, 1);
        const lookAt = vec3.fromValues(0, 0, 0);
        const upVector = vec3.fromValues(0, 1, 0);
        camera.setEyePosition(eyePosition);
        camera.setLookAt(lookAt);
        camera.setUpVector(upVector);
        camera.updateCamera();
        expect(camera.getViewMatrix()).toEqual(mat4.lookAt(mat4.create(), eyePosition, lookAt, upVector));
        expect(camera.getProjectionMatrix()).toEqual(mat4.perspective(mat4.create(), 45, 1, 0.1, 100));
    });
});

export { };