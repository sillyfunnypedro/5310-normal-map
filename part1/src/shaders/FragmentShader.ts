

/**
 * A basic constant color fragment shader
 * */
const fragmentShader =
    `#version 300 es
    precision mediump float;
    out vec4 color;
    void main() {
        color = vec4(1.0, 0.0, 0.1, 1);
    }
    `;




/**
 * A shader that uses a texture
 * 
 */
const fragmentTextureShader =
    `#version 300 es
    precision mediump float;
    in vec2 textureCoordOut;
    uniform sampler2D textureSampler;
    out vec4 color;
    void main() {
        color = texture(textureSampler, textureCoordOut);
    }
    `;



const fragmentShaderMap = new Map<string, string>();
fragmentShaderMap.set('fragmentShader', fragmentShader);
fragmentShaderMap.set('fragmentTextureShader', fragmentTextureShader);
export default fragmentShaderMap;