import Material from "./Material";

/**
 *  @class VertexAccumulator
 *  @description VertexAccumulator class
 * 
 * Uses the strings in the Wavefront obj file to record whether or not
 * a vertex has been recorded.  It only stores the string that represents the
 * vertex in the face line of the obj file.
 * 
 * It also records the data of the first vertex it is given and then 
 * checks other vertices to ensure the same data is being stored per
 * vertex.
 */
class VertexAccumulator {
    private _vertices: string[] = [];
    private _expectedFormat: string[] = []


    constructor() {
        this._vertices = [];

    }

    /**
     * 
     * @param vertex 
     * 
     * Check to see if the vertex is of the expected format
     */
    private checkVertexFormat(vertex: string) {

        const tokens: string[] = vertex.split('/');

        if (tokens.length === 2) {
            throw new Error("A vertex in a face must be of format v or v/t or v//n or v/t/n");

        }
        // the vertexTokens array will have 1 or 3
        if (tokens.length > 3) {
            throw new Error("A vertex in a face must be of format v or v/t or v//n or v/t/n");
        }

        // if this is the first vertex store its format
        if (this._expectedFormat.length === 0) {

            if (tokens.length === 1) {
                this._expectedFormat = ['+'] // expect one value
            } else {
                const expectVertex = '+'
                let expectTexture = ''
                let expectNormal = ''
                if (tokens[1] !== '') {
                    expectTexture = '+'
                }
                if (tokens[2] !== '') {
                    expectNormal = '+'
                }
                this._expectedFormat = [expectVertex, expectTexture, expectNormal]
            }
        }

        if (tokens.length !== this._expectedFormat.length) {
            throw new Error("Inconsistent Vertex Format")
        }

        for (let i = 0; i < tokens.length; i++) {
            const expected = this._expectedFormat[i].length;
            const found = tokens[i].length === 0 ? 0 : 1;
            if (expected !== found) {
                throw new Error("Inconsistent Vertex Format")
            }

        }



    }


    // add a vertex to the list of vertices
    // if the vertex is already in the list, return the index of the vertex
    // otherwise, add the vertex to the list and return the index of the vertex
    // the first return value indicates whether the vertex was added or not
    addVertex(vertex: string): [boolean, number] {
        this.checkVertexFormat(vertex);
        if (this._vertices.indexOf(vertex) === -1) {
            this._vertices.push(vertex);
            return [true, this._vertices.length - 1]
        }

        return [false, this._vertices.indexOf(vertex)];
    }

}


/**
 * ModelGL.ts
 * @description ModelGL class
 * @class ModelGL
 * 
 * This class will parse a model in wavefront .obj format
 * 
 * @property {Float32Array} packedVertexBuffer - the packed vertices of the model
 * @property {Uint16Array} vertexIndices - the indices of the model one per vertex found in the face data
 */
class ModelGL {
    packedVertexBuffer: Float32Array;
    vertexiIndices: Uint16Array;
    numVertices: number;
    numTriangles: number;
    materialFile?: string;
    material?: Material;
    modelPath: string = '';
    vertexShader: string = '';
    fragmentShader: string = '';



    textures: Map<string, string> = new Map<string, string>();

    private _packedIndices: number[] = []
    private _packedBuffer: number[] = [];
    private _vertices: number[] = [];
    private _textureCoordinates: number[] = [];
    private _normals: number[] = [];

    private _vertexAccumulator: VertexAccumulator = new VertexAccumulator();


    constructor() {
        this.packedVertexBuffer = new Float32Array();
        this.vertexiIndices = new Uint16Array();
        this.materialFile = "";
        this.numVertices = 0;
        this.numTriangles = 0;
        this._packedIndices = [];
        this._packedBuffer = [];

    }

    /**
     * The data that the CanvasGL renderer will use to set up the draw call(s) for the model
     */

    public get vertexStride(): number {
        // three floats for the position
        let stride = 3;
        // two floats for the texture coordinates
        if (this._textureCoordinates.length > 0) {
            stride += 2;
        }
        // three floats for the normal
        if (this._normals.length > 0) {
            stride += 3;
        }

        return stride * Float32Array.BYTES_PER_ELEMENT;
    }

    public get vertexOffset(): number {
        return 0;
    }

    public get textureOffset(): number {
        return 3 * Float32Array.BYTES_PER_ELEMENT;
    }

    public get normalOffset(): number {
        let offset = 3 * Float32Array.BYTES_PER_ELEMENT;
        if (this._textureCoordinates.length > 0) {
            offset = 5 * Float32Array.BYTES_PER_ELEMENT;
        }
        return offset;
    }



    /**
     * Parse a model in wavefront .obj format
     */
    parseModel(model: string, modelPath: string): void {
        this.modelPath = modelPath;
        console.log(`modelPath: ${this.modelPath}`)
        // split the model into lines
        let lines: string[] = model.split("\n");
        for (let line of lines) {
            // strip off any leading white space
            line = line.trim();
            let tokens: string[] = line.split(" ");
            if (tokens[0] === "v") {
                this._vertices.push(parseFloat(tokens[1]));
                this._vertices.push(parseFloat(tokens[2]));
                this._vertices.push(parseFloat(tokens[3]));
            } else if (tokens[0] === "f") {
                this.parseFace(line);
            } else if (tokens[0] === "vt") {
                this._textureCoordinates.push(parseFloat(tokens[1]));
                this._textureCoordinates.push(parseFloat(tokens[2]));
            } else if (tokens[0] === "vn") {
                this._normals.push(parseFloat(tokens[1]));
                this._normals.push(parseFloat(tokens[2]));
                this._normals.push(parseFloat(tokens[3]));
            } else if (tokens[0] === "mtllib") {
                this.materialFile = tokens[1];
                console.log("Material file: " + this.materialFile);
            } else if (tokens[0] === "usemtl") {
                // TODO: handle material
            }
        }

        // now that we have parsed the file, we need to 
        // build the vertex buffer and index buffer

        this.packedVertexBuffer = new Float32Array(this._packedBuffer);
        this.vertexiIndices = new Uint16Array(this._packedIndices);
        this.numVertices = this._packedIndices.length;
        this.numTriangles = this._packedIndices.length / 3;
    }

    /** 
     * parse face
     * @param {string} face
     * @returns Uint16Array
     * @memberof ModelGL
     * @method parseFace
     * @private
     * 
     * store the indices in this.tmpIndices so they can be converted to int16 later
     * */
    private parseFace(face: string) {
        let tokens: string[] = face.split(" ");
        let numVertices = tokens.length - 1;
        if (numVertices < 3) {
            throw new Error("A face must have at least 3 vertices");
        }
        if (numVertices > 3) {
            console.log("WARNING: more than three vertices.");
            console.log(face);
        }

        for (let i = 0; i < numVertices; i++) {
            const vertex = tokens[i + 1];
            const [needToAdd, vertexOutIndex] = this._vertexAccumulator.addVertex(vertex);

            this._packedIndices.push(vertexOutIndex);
            if (!needToAdd) {
                continue;
            }


            // The current vertex was not found and thus we will need to add this vertex to the vertex buffer
            // we parse the vertex coordinates, and texture coordinates, and normal coordinates
            // This code presumes that all the vertices in the model have the same number of coordinates
            let vertexTokens: string[] = vertex.split("/");


            // get the vertex values
            const vertexIndex = parseInt(vertexTokens[0]) - 1;
            const vertexOffset = vertexIndex * 3;
            const x = this._vertices[vertexOffset];
            const y = this._vertices[vertexOffset + 1];
            const z = this._vertices[vertexOffset + 2];

            this._packedBuffer.push(x);
            this._packedBuffer.push(y);
            this._packedBuffer.push(z);

            // if there is only a vertex value then we are done
            if (vertexTokens.length === 1) {
                continue;
            }

            if (vertexTokens[1] !== "") {
                if (this._textureCoordinates.length === 0) {
                    throw new Error("There are no texture coordinates defined");
                }
                const textureIndex = parseInt(vertexTokens[1]) - 1;
                const textureOffset = textureIndex * 2;
                const u = this._textureCoordinates[textureOffset];
                const v = this._textureCoordinates[textureOffset + 1];

                this._packedBuffer.push(u);
                this._packedBuffer.push(v);
            }
            if (vertexTokens[2] !== "") {
                if (this._normals.length === 0) {
                    throw new Error("There are no normals defined");
                }
                const normalIndex = parseInt(vertexTokens[2]) - 1;
                const normalOffset = normalIndex * 3;
                const nx = this._normals[normalOffset];
                const ny = this._normals[normalOffset + 1];
                const nz = this._normals[normalOffset + 2];

                this._packedBuffer.push(nx);
                this._packedBuffer.push(ny);
                this._packedBuffer.push(nz);

            }





        }
    }
}

export default ModelGL;
