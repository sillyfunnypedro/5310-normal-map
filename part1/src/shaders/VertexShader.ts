/** shaders for the 5310 Graphics course. */


/**
 * Vertex shader for the 5310 Graphics course.
 *  This is a very simple shader that just passes the vertex position through.
 * */
export const vertexShader =
    `#version 300 es
    in vec3 position;

    void main() {
        gl_Position =   vec4(position, 1.0f);
    }
`
export const vertexTextureShader =
    `#version 300 es
    in vec3 position;
    in vec2 textureCoord;

    out vec2 textureCoordOut;

    void main() {
        gl_Position =   vec4(position, 1.0f);
        textureCoordOut = textureCoord;
    }
`


    ;