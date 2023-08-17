export type ObjectGL = {
    vertices: Float32Array,
    indices: Uint16Array
}


export function getHexagon(): ObjectGL {

    // create a buffer for the hexagon's positions
    // The way that you need to lay out the data is indicated in the comment
    let hexagonVertices: Float32Array = new Float32Array([
        // X, Y, Z, R, G, B
        0.0, .5, 0.0, 1.0, 0.0, 0.0, // top
        -0.5, -0.5, 0.0, 0.0, 1.0, 0.0, // bottom left
        0.5, -0.5, 0.0, 0.0, 0.0, 1.0, // bottom right
    ]);

    // create a buffer for the hexagon's indices
    let hexagonIndices: Uint16Array = new Uint16Array([
        0, 1, 2,

    ]);

    return { vertices: hexagonVertices, indices: hexagonIndices };
}

export function getRectangle(): ObjectGL {
    // six triangles to make a rectangle that is 1.5 units wide and 0.5 units tall
    let rectangleVertices: Float32Array = new Float32Array([
        // X, Y, Z, R, G, B
        0.0, .5, 0.0, 1.0, 0.0, 0.0, // top
        -0.5, -0.5, 0.0, 0.0, 1.0, 0.0, // bottom left
        0.5, -0.5, 0.0, 0.0, 0.0, 1.0, // bot

    ]);

    let rectangleIndices: Uint16Array = new Uint16Array([
        0, 1, 2,
    ]);

    return { vertices: rectangleVertices, indices: rectangleIndices };
}
