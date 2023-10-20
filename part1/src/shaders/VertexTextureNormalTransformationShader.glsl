#version 300 es
/**
 * Vertex shader for the 5310 Graphics course.
 * 
 * This shader applies a full transformation to the vertex position.
 * It also passes the texture coordinate through.
 * It also passes the normal through.
 */

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