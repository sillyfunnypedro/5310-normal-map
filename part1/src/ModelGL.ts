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



class ModelGL {
    vertices: Float32Array;
    textureCoordinates: Float32Array;

    vertexiIndices: Uint16Array;
    textureIndices: Uint16Array;
    materialLibrary?: string;
    numVertices?: number;
    numIndices?: number;
    numTriangles?: number;

    private tmpIndices: number[] = []
    private tmpTextureIndices: number[] = []


    constructor() {
        this.vertices = new Float32Array();
        this.textureCoordinates = new Float32Array();
        this.vertexiIndices = new Uint16Array();
        this.textureIndices = new Uint16Array();
        this.materialLibrary = "";
        this.numVertices = 0;
        this.numIndices = 0;
        this.numTriangles = 0;
        this.tmpIndices = [];
        this.tmpTextureIndices = [];

    }

    /**
     * Parse a model in wavefront .obj format
     */
    parseModel(model: string): void {
        let tmpVertices: number[] = [];
        let tmpTextureCoordinates: number[] = [];
        console.log('starting to parse');
        let lines: string[] = model.split("\n");
        for (let line of lines) {
            // strip off any leading white space
            line = line.trim();
            let tokens: string[] = line.split(" ");
            if (tokens[0] === "v") {
                tmpVertices.push(parseFloat(tokens[1]));
                tmpVertices.push(parseFloat(tokens[2]));
                tmpVertices.push(parseFloat(tokens[3]));
            } else if (tokens[0] === "f") {
                this.parseFace(line);
            } else if (tokens[0] === "vt") {
                tmpTextureCoordinates.push(parseFloat(tokens[1]));
                tmpTextureCoordinates.push(parseFloat(tokens[2]));
            } else if (tokens[0] === "vn") {
                // TODO: handle normals
            } else if (tokens[0] === "mtllib") {
                this.materialLibrary = tokens[1];
            } else if (tokens[0] === "usemtl") {
                // TODO: handle material
            }
        }

        this.vertices = new Float32Array(tmpVertices);
        this.textureCoordinates = new Float32Array(tmpTextureCoordinates);
        this.vertexiIndices = new Uint16Array(this.tmpIndices);
        this.textureIndices = new Uint16Array(this.tmpTextureIndices);

        this.numVertices = tmpVertices.length / 3;
        this.numIndices = this.tmpIndices.length;
        this.numTriangles = this.tmpIndices.length / 3;
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
            // see if the vertex is specified as v or v/t/n

            let vertex: string = tokens[i + 1];
            let vertexTokens: string[] = vertex.split("/");

            if (vertexTokens.length > 3) {
                throw new Error("A vertex can only be specified as v, v/t, or v/t/n");
            }

            // The first value is the vertex index
            this.tmpIndices.push(parseInt(vertexTokens[0]) - 1);

            if (vertexTokens.length >= 2) {
                this.tmpTextureIndices.push(parseInt(vertexTokens[1]) - 1);
            }
            if (vertexTokens.length === 3) {
                // TODO: handle normal index

            }
        }
    }
}

export default ModelGL;
