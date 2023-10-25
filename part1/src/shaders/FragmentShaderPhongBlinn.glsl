#version 300 es
    precision highp float;
    in vec2 textureCoordOut;
    in vec3 normalOut;
    in vec3 fragOutPosition;
    in vec3 viewDirection;

    uniform float shaderParameter;
    uniform float shininess;
    uniform float Ks;
    uniform float Kd;
    uniform float Ka;
    

    out vec4 color;

    vec4 phongShader(vec3 normal, 
        vec3 surfaceToLightDirection, 
        vec3 viewDirection, 
        vec4 lightColor, 
        vec4 surfaceColor, 
        float Kd, 
        float Ka, 
        float Ks) {
        // phong lighting for light one

        // calculate the diffuse intensity
        float lightIntensity = dot(normal, surfaceToLightDirection);
        lightIntensity = clamp(lightIntensity, 0.0, 1.0);


        // calculate the specular intensity
        // calculate the light reflected vector
        vec3 lightReflection = reflect(-surfaceToLightDirection, normal);
        lightReflection = normalize(lightReflection);

        // calculate the cosine of the angle between the light reflection vector and the view direction
        float specularIntensity = dot(lightReflection, viewDirection);

        // when angle between the viewer and the light reflection vector is greater than 90 degrees, the specular intensity is 0
        specularIntensity = clamp(specularIntensity, 0.0, 1.0);  
       

        specularIntensity = pow(specularIntensity, shininess);

        

        // calculate the final specular intensity
        specularIntensity = specularIntensity * Ks;
        
        // calculate the final diffuse intensity
        lightIntensity = lightIntensity * Kd;

        // calculate the final ambient intensity
        vec4 ambient = lightColor * surfaceColor * Ka;  

        // calculate the final light
        vec4 phongColor = ambient + (lightIntensity * surfaceColor) + specularIntensity * lightColor;
        return phongColor/(Ka+Kd+Ks);
        
    }

    vec4 blinnPhongShader(vec3 normal,
        vec3 surfaceToLightDirection,
        vec3 viewDirection,
        vec4 lightColor,
        vec4 surfaceColor,
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


        vec3 phongLightPosition = vec3(5.0, 2.0, 5.0);
        vec3 blinnLightPosition = vec3(-5.0, 2.0, -5.0);
        vec3 phongSurfaceToLightDirection = normalize(phongLightPosition - fragOutPosition);
        vec3 blinnSurfaceToLightDirection = normalize(blinnLightPosition - fragOutPosition);
        

        vec3 normal = normalize(normalOut);
        
        vec4 phongLightColor = vec4(0.0039, 0.8078, 0.0549, 1.0);
        vec4 blinnLightColor = vec4(1.0, 1.0, 0.0, 1.0);


        vec4 surfaceColor = vec4(1.0, 1.0, 1.0, 1.0);


        // phong lighting for light one

        vec4 blinnColor = blinnPhongShader(normal,
            blinnSurfaceToLightDirection,
            viewDirection,
            blinnLightColor,
            surfaceColor, Kd, Ka, Ks, shininess);

        vec4 phongColor = phongShader(normal, 
            phongSurfaceToLightDirection, 
            viewDirection, 
            phongLightColor, 
            surfaceColor, Kd, Ka, Ks);
        
        

        color = (shaderParameter * phongColor + (1.0-shaderParameter)*blinnColor) ;
    }







