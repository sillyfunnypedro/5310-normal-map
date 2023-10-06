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

/**
 * Vertex shader for the 5310 Graphics course.
 * 
 * This shader applies a full transformation to the vertex position.
 */
const vertexFullTransformationShader =
    `#version 300 es
    in vec3 position;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    void main() {
        gl_Position =   projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    
    }
`

/**
 * Vertex shader for the 5310 Graphics course.
 * 
 * This shader applies a rotation to the vertex position.
 */
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

/**
 * Vertex shader for the 5310 Graphics course.
 * 
 * This shader applies a rotation to the vertex position.
 * It also passes the texture coordinate through.
 */
const vertexTextureShader =
    `#version 300 es
    layout(location=0)in vec3 position;
    layout(location=1)in vec2 textureCoord;

    out vec2 textureCoordOut;

    void main() {
        gl_Position =   vec4(position, 1.0);
        textureCoordOut = textureCoord;
    }
`

/**
 * Vertex shader for the 5310 Graphics course.
 * 
 * This shader applies a rotation to the vertex position.
 * It also passes the texture coordinate through.
  */
const vertexTextureRotationShader =
    `#version 300 es
    layout(location=0) in vec3 position;
    layout(location=1) in vec2 textureCoord;

    uniform mat4 modelMatrix;

    out vec2 textureCoordOut;

    void main() {
        gl_Position =   modelMatrix * vec4(position, 1.0);
        textureCoordOut = textureCoord;
    }
`

/**
 * Vertex shader for the 5310 Graphics course.
 * 
 * This shader applies a full transformation to the vertex position.
 * It also passes the texture coordinate through.
 */
const vertexTextureFullTransformationShader =
    `#version 300 es
    layout(location=0) in vec3 position;
    layout(location=1) in vec2 textureCoord;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    out vec2 textureCoordOut;

    void main() {
        gl_Position =   projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        textureCoordOut = textureCoord;
    }
`

/**
 * Vertex shader for the 5310 Graphics course.
 * 
 * This shader applies a full transformation to the vertex position.
 * It also passes the texture coordinate through.
 * It also passes the normal through.
 */
const vertexTextureNormalFullTransformationShader =
    `#version 300 es
    layout(location=0) in vec3 position;
    layout(location=1) in vec2 textureCoord;
    layout(location=2) in vec3 normal;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    out vec2 textureCoordOut;
    out vec3 normalOut;
    
    void main() {
        gl_Position =   projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        
        textureCoordOut = textureCoord;
        normalOut = normal;
    }
`

const vertexShaderMap = new Map<string, string>();
vertexShaderMap.set('vertexShader', vertexShader);
vertexShaderMap.set('vertexFullTransformationShader', vertexFullTransformationShader);
vertexShaderMap.set('vertexShaderRotation', vertexRotationShader);
vertexShaderMap.set('vertexTextureShader', vertexTextureShader);
vertexShaderMap.set('vertexTextureRotationShader', vertexTextureRotationShader);
vertexShaderMap.set('vertexTextureFullTransformationShader', vertexTextureFullTransformationShader);
vertexShaderMap.set('vertexTextureNormalFullTransformationShader', vertexTextureNormalFullTransformationShader);
export default vertexShaderMap;