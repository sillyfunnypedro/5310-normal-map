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
// add a normal sampler here that matches the glCanvas texture set up for normals.
uniform vec3 lightColors[1];
uniform vec3 lightsUniform[1];
int lightCount = 1;

out vec4 color;

vec4 blinnPhongShader(vec3 normal,
        vec3 surfaceToLightDirection,
        vec3 viewDirection,
        vec4 lightColor,
        vec4 surfaceColor,
        float shininess,
        float Kd,
        float Ka,
        float Ks) {
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
        vec4 blinnColor = ambient + (lightIntensity * surfaceColor * lightColor) + (specularIntensity * lightColor);
        return blinnColor/(Ka+Kd+Ks);
        
        }


void main() {
    // flip the y coordinate since all of our images are upside down.
    vec2 textureCoord = vec2(textureCoordOut.x, 1.0 - textureCoordOut.y);
    vec4 textureColor = texture(textureSampler, textureCoord);

    // get the normal from the normal map.
    //TODO add the normal sampler here.
    vec3 normalVector = normalOut;//TODO get rid of this when you add the normal map.
    // Compute the TBN matrix here.

    // Use the differential operators dFdx and dFdy to compute the tangent and bitangent vectors.
  

    // construct the TBN matrix
    
    normalVector = normalize(normalVector * 2.0 - 1.0);
    //normalVector = normalize(TBN * normalVector);// 

    // calculate the lighting for all the lights
    color = vec4(lightsUniform[0], 1);
    color = vec4(0.0, 0.0, 0.0, 1.0);
    for (int i = 0; i < lightCount; i++) {
        vec3 lightPosition = lightsUniform[i];
        vec3 lightDirection = normalize(lightPosition - fragPositionOut);
        vec4 lightColor = vec4(lightColors[i], 1.0);
        color += blinnPhongShader(normalVector,
        lightDirection,
        viewDirectionOut,
        lightColor,
        textureColor,
        100.0,
        0.8,
        0.2,
        2.0);
        
    }
    color = color / float(lightCount);

    


}
