#version 300 es
/**
 * Vertex shader for the 5310 Graphics course.
 * 
 * This shader applies a full transformation to the vertex position.
 * It computes the normal transformation matrix and applies it to the normal.
 * It also passes the texture coordinate through.
 * It also passes the normal through.
 * It also passes the fragOutPosition through.
 */

layout(location=0) in vec3 position;
layout(location=1) in vec2 textureCoord;
layout(location=2) in vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

out vec2 textureCoordOut;
out vec3 normalOut;
out vec3 fragOutPosition;

void main() {
    gl_Position =   projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    // calculate the fragOutPosition
    fragOutPosition = vec3(modelMatrix * vec4(position, 1.0));

    // calculate the normalMatrix
    mat3 normalMatrix = transpose(inverse(mat3(modelMatrix)));
    normalOut = normalize(normalMatrix * normal);
    
    textureCoordOut = textureCoord;
}