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
    packedVertexBuffer: Float32Array;
    vertexiIndices: Uint16Array;
    numVertices: number;
    numTriangles: number;
    materialLibrary?: string;

    private _packedIndices: number[] = []
    private _packedBuffer: number[] = [];
    private _vertices: number[] = [];
    private _textureCoordinates: number[] = [];
    private _normals: number[] = [];

    private _vertexAccumulator: VertexAccumulator = new VertexAccumulator();


    constructor() {
        this.packedVertexBuffer = new Float32Array();
        this.vertexiIndices = new Uint16Array();
        this.materialLibrary = "";
        this.numVertices = 0;
        this.numTriangles = 0;
        this._packedIndices = [];
        this._packedBuffer = [];

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

        this.packedVertexBuffer = new Float32Array(this._packedBuffer);
        this.vertexiIndices = new Uint16Array(this._packedIndices);
        this.numVertices = this._packedIndices.length;
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
            const [needToAdd, vertexOutIndex] = this._vertexAccumulator.addVertex(vertex);

            this._packedIndices.push(vertexOutIndex);
            if (!needToAdd) {
                continue;
            }


            // The current vertex was not found and thus we will need to add this vertex to the vertex buffer
            // we parse the vertex coordinates, and texture coordinates, and normal coordinates
            // This code presumes that all the vertices in the model have the same number of coordinates
            let vertexTokens: string[] = vertex.split("/");

            if (vertexTokens.length === 2) {
                throw new Error("A vertex in a face must be of format v or v/t or v//n or v/t/n");

            }
            // the vertexTokens array will have 1 or 3
            if (vertexTokens.length > 3) {
                throw new Error("A vertex in a face must be of format v or v/t or v//n or v/t/n");
            }
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
            if (vertexTokens.length == 1) {
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
