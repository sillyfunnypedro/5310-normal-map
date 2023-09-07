/** 
 * @module Camera
 * @description
 * Camera class
 * @class Camera
 * @export Camera
 * 
 * @requires gl-matrix
 */

import { mat4, vec3 } from 'gl-matrix';

class Camera {

    private static instance: Camera;
    private viewMatrix: mat4;
    private projectionMatrix: mat4;
    private eyePosition: vec3;
    private lookAt: vec3;
    private upVector: vec3;

    private constructor() {
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.eyePosition = vec3.create();
        this.lookAt = vec3.create();
        this.upVector = vec3.create();
    }

    public static getInstance(): Camera {
        if (!Camera.instance) {
            Camera.instance = new Camera();
        }
        return Camera.instance;
    }

    public setViewMatrix(viewMatrix: mat4): void {
        this.viewMatrix = viewMatrix;
    }

    public getViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public setProjectionMatrix(projectionMatrix: mat4): void {
        this.projectionMatrix = projectionMatrix;
    }

    public getProjectionMatrix(): mat4 {
        return this.projectionMatrix;
    }

    public setEyePosition(eyePosition: vec3): void {
        this.eyePosition = eyePosition;
    }

    public getEyePosition(): vec3 {
        return this.eyePosition;
    }

    public setLookAt(lookAt: vec3): void {
        this.lookAt = lookAt;
    }

    public getLookAt(): vec3 {
        return this.lookAt;
    }

    public setUpVector(upVector: vec3): void {
        this.upVector = upVector;
    }

    public getUpVector(): vec3 {
        return this.upVector;
    }

    public updateViewMatrix(): void {
        mat4.lookAt(this.viewMatrix, this.eyePosition, this.lookAt, this.upVector);
    }

    public updateProjectionMatrix(): void {
        mat4.perspective(this.projectionMatrix, 45, 1, 0.1, 100);
    }

    public updateCamera(): void {
        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }

}

export default Camera;