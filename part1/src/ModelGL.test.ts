import { parse } from 'path';
import ModelGL from './ModelGL';

describe('ModelGL', () => {
    let model: ModelGL;

    beforeEach(() => {
        model = new ModelGL();
    });

    describe('parseModel', () => {
        it('should parse a model with vertices and faces', () => {
            const modelData =
                `
            v 0.0 0.0 0.0
            v 1.0 0.0 0.0
            v 0.0 1.0 0.0
            f 1 2 3
          `;
            model.parseModel(modelData);
            expect(model.packedVertexBuffer).toEqual(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]));
            expect(model.vertexiIndices).toEqual(new Uint16Array([0, 1, 2]));
            expect(model.numVertices).toBe(3);
            expect(model.numTriangles).toBe(1);
        });

        it('should parse a model with vertices and faces with format v//', () => {
            const modelData =
                `
            v 0.0 0.0 0.0
            v 1.0 0.0 0.0
            v 0.0 1.0 0.0
            f 1// 2// 3//
          `;
            model.parseModel(modelData);
            expect(model.packedVertexBuffer).toEqual(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]));
            expect(model.vertexiIndices).toEqual(new Uint16Array([0, 1, 2]));
            expect(model.numVertices).toBe(3);
            expect(model.numTriangles).toBe(1);
        });

        it('Single should be followed by single', () => {
            const modelData = `
                    v 0.0 0.0 0.0
                    v 1.0 0.0 0.0
                    v 1.0 1.0 0.0
                    vt 1.0 0.5
                    vn 0.0 1.0 0.5

                    f 1 1/1/1 1
            `;
            expect(() => model.parseModel(modelData)).toThrowError("Inconsistent Vertex Format");
        });

        it('vertex/normal/ should be followed by the same', () => {
            const modelData = `
                v 0.0 0.0 0.0
                v 1.0 0.0 0.0
                v 1.0 1.0 0.0
                vt 1.0 0.5
                vn 0.0 1.0 0.5

                f 1/1/ 1 1
            `;
            expect(() => model.parseModel(modelData)).toThrowError('Inconsistent Vertex Format');
        });

        it('vertex//normal should be followed by the same', () => {
            const modelData = `
                v 0.0 0.0 0.0
                v 1.0 0.0 0.0
                v 1.0 1.0 0.0
                vt 1.0 0.5
                vn 0.0 1.0 0.5

                f 1//1 1 1
            `;
            expect(() => model.parseModel(modelData)).toThrowError('Inconsistent Vertex Format');
        });

        it('vertex/texture/normal should be followed by the same', () => {
            const modelData = `
                v 0.0 0.0 0.0
                v 1.0 0.0 0.0
                v 1.0 1.0 0.0
                vt 1.0 0.5
                vn 0.0 1.0 0.5

                f 1/1/1 1/1/1 1//1
            `;
            expect(() => model.parseModel(modelData)).toThrowError('Inconsistent Vertex Format');
        });




        it('should throw an error for a vertex in a face with only one /', () => {
            const modelData = `
                    v 0.0 0.0 0.0
                    v 1.0 0.0 0.0
                    v 0.0 1.0 0.0
                    f 1/2 2/2/3 2/3/3
                `;
            expect(() => model.parseModel(modelData)).toThrowError("A vertex in a face must be of format v or v/t or v//n or v/t/n");
        });

        it('should throw an error for a vertex in a face with more than 3 values', () => {
            const modelData = `
            v 0.0 0.0 0.0
            v 1.0 0.0 0.0
            v 1.0 1.0 0.0
            f 1/2/3/4 2/3/4 3/4/5
          `;
            expect(() => model.parseModel(modelData)).toThrowError("A vertex in a face must be of format v or v/t or v//n or v/t/n");
        });

        it('should throw an error for a vertex with a texture reference if not texture is defined', () => {
            const modelData = `
            v 0.0 0.0 0.0
            v 1.0 0.0 0.0
            v 1.0 1.0 0.0
            f 1/2/ 2/2/ 3/3/
          `;

            expect(() => model.parseModel(modelData)).toThrowError("There are no texture coordinates defined");
        });

        it('should throw an error for a vertex with a normal reference if no normals are defined', () => {
            const modelData = `
            v 0.0 0.0 0.0
            v 1.0 0.0 0.0
            v 1.0 1.0 0.0
            f 1//2 2//2 3//3
          `;

            expect(() => model.parseModel(modelData)).toThrowError("There are no normals defined");
        });



        it('it should parse the mtllib file', () => {
            const modelData = `
            mtllib square.mtl
            v 14 14 1
            v 15 14 1
            v 15 15 1
            v 14 15 1
            vt 0.0 0.0
            vt 1.0 0.0
            vt 1.0 1.0
            vt 0.0 1.0
            f 1 2 3
            f 1 3 4
          `;
            model.parseModel(modelData);
            expect(model.materialLibrary).toBe('square.mtl');
        });

        it('should interleave the vertex and texture', () => {
            const modelData = `
                mtllib square.mtl
                v 11 11 0
                v 12 11 0
                v 12 12 0
                vt 0.0 0.0
                vt 1.0 0.0
                vt 1.0 1.0
                vt 0.0 1.0
                f 1/1/ 2/2/ 3/3/ 

              `;
            model.parseModel(modelData);
            expect(model.packedVertexBuffer).toEqual(new Float32Array(
                [
                    11, 11, 0, 0, 0, // vertex 1 index 0
                    12, 11, 0, 1, 0, // vertex 2 index 1
                    12, 12, 0, 1, 1  // vertex 3 index 2
                ]
            ));
            expect(model.vertexiIndices).toEqual(new Uint16Array([0, 1, 2]));
        });

        it('should reuse a packed vertex', () => {
            const modelData = `
            mtllib square.mtl
            v 11 11 0
            v 12 11 0
            v 12 12 0
            v 11 12 0
            vt 0.0 0.0
            vt 1.0 0.0
            vt 1.0 1.0
            vt 0.0 1.0
            vt 1 0
            f 1/1/ 2/2/ 3/3/ 
            f 1/1/ 3/3/ 4/4/

          `;
            model.parseModel(modelData);
            expect(model.packedVertexBuffer).toEqual(new Float32Array(
                [
                    11, 11, 0, 0, 0, // vertex 1 index 0
                    12, 11, 0, 1, 0, // vertex 2 index 1
                    12, 12, 0, 1, 1, // vertex 3 index 2
                    11, 12, 0, 0, 1, // vertex 4 index 3
                ]));
            expect(model.vertexiIndices).toEqual(new Uint16Array([0, 1, 2, 0, 2, 3]));
        });

        it('should have 6 vertices', () => {
            const modelData = `
                mtllib square.mtl
                v 11 11 0
                v 12 11 0
                v 12 12 0
                v 11 12 0
                vt 0.0 0.0
                vt 1.0 0.0
                vt 1.0 1.0
                vt 0.0 1.0
                vt 1 0
                f 1/1/ 2/2/ 3/3/ 
                f 1/2/ 3/2/ 4/4/

              `;
            model.parseModel(modelData);
            expect(model.packedVertexBuffer).toEqual(new Float32Array(
                [
                    11, 11, 0, 0, 0, // vertex 1 index 0
                    12, 11, 0, 1, 0, // vertex 2 index 1
                    12, 12, 0, 1, 1, // vertex 3 index 2
                    11, 11, 0, 1, 0, // vertex 4 index 3
                    12, 12, 0, 1, 0, // vertex 5 index 4
                    11, 12, 0, 0, 1, // vertex 6 index 5
                ]));
            expect(model.vertexiIndices).toEqual(new Uint16Array([0, 1, 2, 3, 4, 5]));
        });


    });

    it('should have 4 vertices with textures and normal', () => {
        const modelData = `
                mtllib square.mtl
                v 11 11 0
                v 12 11 0
                v 12 12 0
                v 11 12 0
                vt 0.0 0.0
                vt 1.0 0.0
                vt 1.0 1.0
                vt 0.0 1.0
                vt 1 0
                vn 0.1 0.1 0.1
                vn 0.2 0.2 0.2
                vn 0.3 0.3 0.3
                vn 0.4 0.4 0.4
                f 1/1/1 2/2/2 3/3/3 
                f 1/1/1 3/3/3 4/4/4

              `;
        model.parseModel(modelData);
        expect(model.packedVertexBuffer).toEqual(new Float32Array(
            [
                11, 11, 0, 0, 0, 0.1, 0.1, 0.1, // vertex 1 index 0
                12, 11, 0, 1, 0, 0.2, 0.2, 0.2, // vertex 2 index 1
                12, 12, 0, 1, 1, 0.3, 0.3, 0.3, // vertex 3 index 2
                11, 12, 0, 0, 1, 0.4, 0.4, 0.4  // vertex 4 index 3
            ]));
        expect(model.vertexiIndices).toEqual(new Uint16Array([0, 1, 2, 0, 2, 3]));
    });


});




export { }