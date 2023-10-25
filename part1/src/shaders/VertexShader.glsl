#version 300 es
/**
 * Vertex shader for the 5310 Graphics course.
 * 
 * This shader applies a full transformation to the vertex position.
 */

in vec3 position;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {
    gl_Position =   projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

}
