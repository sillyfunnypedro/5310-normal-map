#version 300 es
// A simple texture shader that just puts a texture on the objec.
// This is the default shader for objects that have a texture.
precision mediump float;
in vec2 textureCoordOut;
uniform sampler2D textureSampler;
out vec4 color;

void main() {
    vec2 textureCoord = vec2(textureCoordOut.x, 1.0 - textureCoordOut.y);
    color = texture(textureSampler, textureCoord);
}
