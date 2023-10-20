#version 300 es

    layout(location=0) in vec3 position;
    layout(location=1) in vec2 textureCoord;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 eyePosition;
    uniform float shaderParameter;


    out vec2 textureCoordOut;
    out vec3 normalOut;
    out vec3 fragOutPosition;
    out vec3 viewDirection;
    
    void main() {
        gl_Position =   projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        
        vec3 surfaceWorldPosition = vec3(modelMatrix * vec4(position, 1.0));

        textureCoordOut = textureCoord;

        // calculate the matrix to transform the normal
        mat3 normalMatrix = transpose(inverse(mat3(modelMatrix)));
        normalOut =  normalMatrix * vec3(0.0, 1.0, 0.0);
        fragOutPosition = vec3(surfaceWorldPosition.xyz);

        viewDirection = normalize(eyePosition - surfaceWorldPosition );
    }