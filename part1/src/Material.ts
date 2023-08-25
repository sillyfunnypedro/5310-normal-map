/**
 * Material class
 * @class Material
 * 
 * 
 * 
 * @example
 * # Blender MTL File: 'None'
    # Material Count: 1

    newmtl blinn1SG
    Ns 0.000000
    Ka 0.100000 0.100000 0.100000
    Kd 0.000000 0.000000 0.000000
    Ks 0.000000 0.000000 0.000000
    Ke 0.000000 0.000000 0.000000
    Ni 1.500000
    d 1.000000
    illum 2
    map_Kd windmill_diffuse.ppm
    map_Bump windmill_normal.ppm
    map_Ks windmill_spec.ppm
 */

export class Material {
    name: string = '';
    Ns: number = 0;
    Ka: number[] = [];
    Kd: number[] = [];
    Ks: number[] = [];
    Ke: number[] = [];
    Ni: number = 0;
    d: number = 0;
    illum: number = 0;
    map_Kd: string = '';
    map_Bump: string = '';
    map_Ks: string = '';

    constructor() {
        this.name = '';
        this.Ns = 0;
        this.Ka = [];
        this.Kd = [];
        this.Ks = [];
        this.Ke = [];
        this.Ni = 0;
        this.d = 0;
        this.illum = 0;
        this.map_Kd = '';
        this.map_Bump = '';
        this.map_Ks = '';
    }


    parseMaterial(material: string): void {
        let lines: string[] = material.split("\n");
        for (let line of lines) {
            // strip off any leading white space
            line = line.trim();
            let tokens: string[] = line.split(" ");
            if (tokens[0] === "newmtl") {
                this.name = tokens[1];
            } else if (tokens[0] === "Ns") {
                this.Ns = parseFloat(tokens[1]);
            } else if (tokens[0] === "Ka") {
                this.Ka = [parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])];
            } else if (tokens[0] === "Kd") {
                this.Kd = [parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])];
            } else if (tokens[0] === "Ks") {
                this.Ks = [parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])];
            } else if (tokens[0] === "Ke") {
                this.Ke = [parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])];
            } else if (tokens[0] === "Ni") {
                this.Ni = parseFloat(tokens[1]);
            } else if (tokens[0] === "d") {
                this.d = parseFloat(tokens[1]);
            } else if (tokens[0] === "illum") {
                this.illum = parseFloat(tokens[1]);
            } else if (tokens[0] === "map_Kd") {
                this.map_Kd = tokens[1];
            } else if (tokens[0] === "map_Bump") {
                this.map_Bump = tokens[1];
            } else if (tokens[0] === "map_Ks") {
                this.map_Ks = tokens[1];
            }
        }
    }
}

