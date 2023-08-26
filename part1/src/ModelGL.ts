/**
 * ModelGL.ts
 * @description ModelGL interface
 * @interface ModelGL
 * @export ModelGL
 * @property {Float32Array} vertices
 * @property {Float32Array} textureCoordinates
 * @property {Uint16Array} vertexiIndices
 * @property {Uint16Array} textureIndices
 * @property {number} [numVertices]
 * @property {number} [numIndices]
 * @property {number} [numTriangles]
 * @property {string} [materialLibrary]
 */

class VertexAccumulator {
    private vertices: string[] = [];

    constructor() {
        this.vertices = [];

    }

    // add a vertex to the list of vertices
    // if the vertex is already in the list, return the index of the vertex
    // otherwise, add the vertex to the list and return the index of the vertex
    // the first return value indicates whether the vertex was added or not
    addVertex(vertex: string): [boolean, number] {
        if (this.vertices.indexOf(vertex) === -1) {
            this.vertices.push(vertex);
            return [true, this.vertices.length - 1]
        }
        return [false, this.vertices.indexOf(vertex)];
    }

}


/**
 * ModelGL.ts
 * @description ModelGL class
 * @class ModelGL
 * 
 * This class will parse a model in wavefront .obj format
 * 
 * @property {Float32Array} vertices - the packed vertices of the model
 * @property {Uint16Array} indices - the indices of the model one per vertex found in the face data
 */
class ModelGL {
    vertexBuffer: Float32Array;
    indices: Uint16Array;



    textureCoordinates: Float32Array;

    vertexiIndices: Uint16Array;
    textureIndices: Uint16Array;
    materialLibrary?: string;
    numVertices?: number;
    numIndices?: number;
    numTriangles: number;

    private _packedIndices: number[] = []
    private _vertices: number[] = [];
    private _textureCoordinates: number[] = [];
    private _normals: number[] = [];

    private _vertexAccumulator: VertexAccumulator = new VertexAccumulator();


    constructor() {
        this.vertexBuffer = new Float32Array();
        this.indices = new Uint16Array();
        this.textureCoordinates = new Float32Array();
        this.vertexiIndices = new Uint16Array();
        this.textureIndices = new Uint16Array();
        this.materialLibrary = "";
        this.numVertices = 0;
        this.numIndices = 0;
        this.numTriangles = 0;
        this._packedIndices = [];

    }

    /**
     * Parse a model in wavefront .obj format
     */
    parseModel(model: string): void {

        console.log('starting to parse');
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
                this.materialLibrary = tokens[1];
            } else if (tokens[0] === "usemtl") {
                // TODO: handle material
            }
        }

        // now that we have parsed the file, we need to 
        // build the vertex buffer and index buffer

        this.vertexBuffer = new Float32Array(this._vertices);
        this.vertexiIndices = new Uint16Array(this._packedIndices);


        this.numVertices = this.indices.length;
        this.numIndices = this._packedIndices.length;
        this.numTriangles = this._packedIndices.length / 3;
        console.log('done parsing');
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
            const [needToAdd, vertexIndex] = this._vertexAccumulator.addVertex(vertex);

            this._packedIndices.push(vertexIndex);
            if (!needToAdd) {
                continue;
            }

            let vertexTokens: string[] = vertex.split("/");

            if (vertexTokens.length > 3) {
                throw new Error("A vertex can only be specified as v, v/t, or v/t/n");
            }

            // The first value is the vertex index
            this._packedIndices.push(parseInt(vertexTokens[0]) - 1);
            // get the vertex values
            const x = this.vertexBuffer[parseInt(vertexTokens[0]) * 3];
            const y = this.vertexBuffer[parseInt(vertexTokens[0]) * 3 + 1];
            const z = this.vertexBuffer[parseInt(vertexTokens[0]) * 3 + 2];

            this._vertices.push(x);
            this._vertices.push(y);
            this._vertices.push(z);

            // if there is only a vertex value then we are done
            if (vertexTokens.length == 1) {
                continue;
            }

            if (vertexTokens[1] !== "") {
                const u = this.textureCoordinates[parseInt(vertexTokens[1]) * 2];
                const v = this.textureCoordinates[parseInt(vertexTokens[1]) * 2 + 1];

                this._vertices.push(u);
                this._vertices.push(v);
            }
            if (vertexTokens[2] !== "") {
                const nx = this._normals[parseInt(vertexTokens[2]) * 3];
                const ny = this._normals[parseInt(vertexTokens[2]) * 3 + 1];
                const nz = this._normals[parseInt(vertexTokens[2]) * 3 + 2];

                this._vertices.push(nx);
                this._vertices.push(ny);
                this._vertices.push(nz);

            }





        }
    }
}

export default ModelGL;
