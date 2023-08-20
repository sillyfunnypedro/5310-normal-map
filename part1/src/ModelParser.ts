import { ObjectGL } from "./Models"


/**
 * 
 * @param model in wavefront .obj format
 */
export function parseModel(model: string): ObjectGL {
    let vertices: number[] = [];
    let indices: number[] = [];

    let lines: string[] = model.split("\n");
    for (let line of lines) {
        let tokens: string[] = line.split(" ");
        if (tokens[0] === "v") {
            vertices.push(parseFloat(tokens[1]));
            vertices.push(parseFloat(tokens[2]));
            vertices.push(parseFloat(tokens[3]));
        } else if (tokens[0] === "f") {
            indices.push(parseInt(tokens[1]) - 1);
            indices.push(parseInt(tokens[2]) - 1);
            indices.push(parseInt(tokens[3]) - 1);
        }
    }

    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
}
