#version 300 es
/**
 * A shader that uses a texture
 * It also uses a normal map
 * 
 *  */

precision highp float;
in vec2 textureCoordOut;
in vec3 normalOut;
in vec3 fragPositionOut;
in vec3 viewDirectionOut;
uniform sampler2D textureSampler;
uniform sampler2D normalSampler;

out vec4 color;

vec4 blinnPhongShader(vec3 normal,
        vec3 surfaceToLightDirection,
        vec3 viewDirection,
        vec4 lightColor,
        vec4 surfaceColor,
        float shininess,
        float Kd,
        float Ka,
        float Ks, float shine) {
        // phong lighting for light one

        // calculate the diffuse intensity
        float lightIntensity = dot(normal, surfaceToLightDirection);
        lightIntensity = clamp(lightIntensity, 0.0, 1.0);


        // calculate the specular intensity
        // calculate the halfway vector
        vec3 halfVector = normalize(surfaceToLightDirection + viewDirection);

        // calculate the cosine of the angle between the half vector and the normal
        float specularIntensity = dot(normal, halfVector);

        // raise the specular intensity to the power of the shine
        specularIntensity = pow(specularIntensity, shininess);

        // clamp the specular intensity to between 0 and 1
        specularIntensity = clamp(specularIntensity, 0.0, 1.0);

        // calculate the final specular intensity
        specularIntensity = specularIntensity * Ks;

        // calculate the final diffuse intensity
        lightIntensity = lightIntensity * Kd;

        // calculate the final ambient intensity
        vec4 ambient = lightColor * surfaceColor * Ka;

        // calculate the final light
        vec4 blinnColor = ambient + (lightIntensity * surfaceColor) + (specularIntensity * lightColor);
        return blinnColor/(Ka+Kd+Ks);
        
        }



void main() {
    vec3 normal = normalize(normalOut);
    vec3 lightPosition = vec3(5,2,5);

    vec3 lightDirection = normalize(lightPosition - fragPositionOut);

    vec4 lightColor = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 surfaceColor = vec4(1.0, 1.0, 1.0, 1.0);

    


    
    vec2 textureCoord = vec2(textureCoordOut.x, 1.0 - textureCoordOut.y);
    vec4 textureColor = texture(textureSampler, textureCoord);

    vec3 normalVector = texture(normalSampler, textureCoord).rgb;
   
    color = blinnPhongShader(normalVector, 
    lightDirection, 
    viewDirectionOut,
    lightColor, 
    textureColor, 1.0, 0.5, 0.1, 1.0, 40.0);

    


}
