import Material from "./Material";
import { mat4 } from "gl-matrix";


/**
 * ModelGL.ts
 * @description ModelGL class
 * @class ModelGL
 * 
 * Container for the model data.
 * 
 * @property {Float32Array} packedVertexBuffer - the packed vertices of the model
 * @property {Uint16Array} vertexIndices - the indices of the model one per vertex found in the face data
 */
class ModelGL {
    packedVertexBuffer: Float32Array = new Float32Array();
    vertexIndices: Uint16Array = new Uint16Array();
    numVertices: number = 0;
    numTriangles: number = 0;
    materialFile?: string = undefined;
    material?: Material = undefined;
    modelPath: string = '';
    shaderName: string = '';



    // the parameters for the model transformation
    rotateX: number = 0;
    rotateY: number = 0;
    rotateZ: number = 0;
    scaleX: number = 1;
    scaleY: number = 1;
    scaleZ: number = 1;
    translateX: number = 0;
    translateY: number = 0;
    translateZ: number = 0;

    textures: Map<string, string> = new Map<string, string>();


    renderingProgram: WebGLProgram | null = null;


    public get hasDiffuseMap(): boolean {
        if (this.material === undefined) {
            return false;
        }

        if (this.material.map_Kd !== '') {
            return true;
        }
        return false;
    }
    diffuseTexture: WebGLTexture | null = null;
    // make it simpler to determine what maps to use for the model

    public get hasNormalMap(): boolean {
        if (this.material == undefined) {
            return false;
        }

        if (this.material.map_Bump === undefined) {
            return false;
        }

        if (this.material.map_Bump !== '') {
            return true;
        }
        return false;
    }
    normalTexture: WebGLTexture | null = null;

    hasSpecularMap: boolean = false;
    specularTexture: WebGLTexture | null = null;

    vertexStride: number = 0;
    vertexOffset: number = 0;
    textureOffset: number = 0;
    normalOffset: number = 0;

    getShaderCoreName(): string {
        let shaderName = '';
        if (this.textureOffset > 0) {
            shaderName += 'Texture';
        }
        if (this.normalOffset > 0) {
            shaderName += 'Normal';
        }
        if (this.hasNormalMap) {
            shaderName += 'NormalMap';
        }
        return shaderName;
    }

    getVertexShaderName(): string {
        // every vertex shader starts with vertex and ends with shader
        let shaderName = 'vertex';
        shaderName += this.getShaderCoreName();
        shaderName += 'Shader';
        return shaderName;
    }

    getFragmentShaderName(): string {
        // every fragment shader starts with fragment and ends with shader
        let shaderName = 'fragment';
        shaderName += this.getShaderCoreName();
        shaderName += 'Shader';
        return shaderName;
    }


    // each model has its own transforms now, we will provide a computed
    // model matrix to the renderer
    getModelMatrix(): mat4 {
        let modelMatrix: mat4 = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [this.translateX, this.translateY, this.translateZ]);
        mat4.rotateX(modelMatrix, modelMatrix, this.rotateX / 180 * Math.PI);
        mat4.rotateY(modelMatrix, modelMatrix, this.rotateY / 180 * Math.PI);
        mat4.rotateZ(modelMatrix, modelMatrix, this.rotateZ / 180 * Math.PI);
        mat4.scale(modelMatrix, modelMatrix, [this.scaleX, this.scaleY, this.scaleZ]);
        return modelMatrix;
    }

}

export default ModelGL;
