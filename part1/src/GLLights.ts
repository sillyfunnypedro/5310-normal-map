/**
 * A class for storing the light data for a scene
 */

export class GLPointLight {
    position: number[] = [0, 0, 0];
    // the shading equation for a point light is:
    // I = Ia + Id + Is
    // where Ia is the ambient light intensity
    // Id is the diffuse light intensity
    // Is is the specular light intensity

    // the ambient intensity is a constant for the light
    ambientIntensity: number = 0.3;

    // the diffuse intensity is a constant for the light
    diffuseIntensity: number = 0.4;

    // the specular intensity is a constant for the light
    specularIntensity: number = 0.3;

    // each component of the light has a color
    // the ambient color is a constant for the light
    // the diffuse color is a constant for the light
    // the specular color is a constant for the light
    ambientColor: number[] = [0.5, 0.5, 0.5];
    diffuseColor: number[] = [0.5, 0.5, 0.5];
    specularColor: number[] = [0.5, 0.5, 0.5];



}

export class GLLights {
    private _pointLights: Array<GLPointLight> = [];
}

