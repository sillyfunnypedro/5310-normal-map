/**
 * a container for some shaders.  This is a good place to put shaders that are used in multiple places.
 * 
 * @module shaders
 */

const VertexShaders = {
    "flat": `
        attribute vec4 a_Position;
        uniform mat4 u_ModelMatrix;
        void main() {
            gl_Position = u_ModelMatrix * a_Position;
        }
    `,
    "color": `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        varying vec4 v_Color;
        uniform mat4 u_ModelMatrix;
        void main() {
            gl_Position = u_ModelMatrix * a_Position;
            v_Color = a_Color;
        }
    `,
    "texture": `
        attribute vec4 a_Position;
        attribute vec2 a_TexCoord;
        varying vec2 v_TexCoord;
        uniform mat4 u_ModelMatrix;
        void main() {
            gl_Position = u_ModelMatrix * a_Position;
            v_TexCoord = a_TexCoord;
        }
    `,
};

const FragmentShaders = {
    "flat": `
        precision mediump float;
        uniform vec4 u_FragColor;
        void main() {
            gl_FragColor = u_FragColor;
        }
    `,
    "color": `
        precision mediump float;
        varying vec4 v_Color;
        void main() {
            gl_FragColor = v_Color;
        }
    `,
    "texture": `
        precision mediump float;
        varying vec2 v_TexCoord;
        uniform sampler2D u_Sampler;
        void main() {
            gl_FragColor = texture2D(u_Sampler, v_TexCoord);
        }
    `,
};

export { VertexShaders, FragmentShaders };