#version 300 es
/**
 * Vertex shader for the 5310 Graphics course.
 *  This is a very simple shader that just passes the vertex position through.
 * */

in vec3 position;

void main() {
    gl_Position =   vec4(position, 1.0);
}