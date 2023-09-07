/** shaders for the 5310 Graphics course. */


/**
 * Vertex shader for the 5310 Graphics course.
 *  This is a very simple shader that just passes the vertex position through.
 * */
const vertexShader =
    `#version 300 es
    in vec3 position;

    void main() {
        gl_Position =   vec4(position, 1.0);
    }
`

const vertexRotationShader =
    `#version 300 es
    in vec3 position;
    in vec2 textureCoord;

    uniform mat4 modelMatrix;

    out vec2 textureCoordOut;

    void main() {
        gl_Position =   modelMatrix * vec4(position, 1.0);
        textureCoordOut = textureCoord;
    }
`
const vertexTextureShader =
    `#version 300 es
    in vec3 position;
    in vec2 textureCoord;

    out vec2 textureCoordOut;

    void main() {
        gl_Position =   vec4(position, 1.0);
        textureCoordOut = textureCoord;
    }
`

const vertexTextureRotationShader =
    `#version 300 es
    in vec3 position;
    in vec2 textureCoord;

    uniform mat4 modelMatrix;

    out vec2 textureCoordOut;

    void main() {
        gl_Position =   modelMatrix * vec4(position, 1.0);
        textureCoordOut = textureCoord;
    }
`


const vertexTextureFullTransformationShader =
    `#version 300 es
    in vec3 position;
    in vec2 textureCoord;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    out vec2 textureCoordOut;

    void main() {
        gl_Position =   projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        textureCoordOut = textureCoord;
    }
`
const vertexShaderMap = new Map<string, string>();
vertexShaderMap.set('vertexShader', vertexShader);
vertexShaderMap.set('vertexShaderRotation', vertexRotationShader);
vertexShaderMap.set('vertexTextureShader', vertexTextureShader);
vertexShaderMap.set('vertexTextureRotationShader', vertexTextureRotationShader);
vertexShaderMap.set('vertexTextureFullTransformationShader', vertexTextureFullTransformationShader);
export default vertexShaderMap;