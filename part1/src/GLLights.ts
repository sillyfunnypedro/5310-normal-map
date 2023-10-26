/**
 * A class for storing the light data for a scene
 */

export class GLPointLight {
    position: number[] = [0, 0, 0];
    color: number[] = [0.5, 0.5, 0.5];


    constructor(position: number[],
        color: number[]) {
        this.position = position;
        this.color = color;
    }

}

export class GLLights {
    private _pointLights: Array<GLPointLight> = [];

    get pointLights(): Array<GLPointLight> {
        return this._pointLights;
    }

    getPositionsFloat32(): Float32Array {
        let positions: number[] = [];
        for (let light of this._pointLights) {
            positions.push(light.position[0]);
            positions.push(light.position[1]);
            positions.push(light.position[2]);
        }
        return new Float32Array(positions);
    }

    getColorsFloat32(): Float32Array {
        let colors: number[] = [];
        for (let light of this._pointLights) {
            colors.push(light.color[0]);
            colors.push(light.color[1]);
            colors.push(light.color[2]);
        }
        return new Float32Array(colors);
    }


    addPointLight(light: GLPointLight): void {
        this._pointLights.push(light);
    }
}

