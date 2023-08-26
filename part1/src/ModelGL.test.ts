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
            expect(model.vertexBuffer).toEqual(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]));
            expect(model.vertexiIndices).toEqual(new Uint16Array([0, 1, 2]));
            expect(model.numVertices).toBe(3);
            expect(model.numIndices).toBe(3);
            expect(model.numTriangles).toBe(1);
        });

        it('should throw an error for a face with less than 3 vertices', () => {
            const modelData = `
        v 0.0 0.0 0.0
        v 1.0 0.0 0.0
        f 1 2
      `;
            expect(() => model.parseModel(modelData)).toThrowError('A face must have at least 3 vertices');
        });

        it('should throw an error for a vertex in a face with more than 3 values', () => {
            const modelData = `
        v 0.0 0.0 0.0
        v 1.0 0.0 0.0
        v 1.0 1.0 0.0
        f 1/2/3/4 2/3/4 3/4/5
      `;

            expect(() => model.parseModel(modelData)).toThrowError('A vertex can only be specified as v, v/t, or v/t/n');
        });



        it('it should parse the mtllib file', () => {
            const modelData = `
        mtllib square.mtl
        v 0.0 0.0 0.0
        v 1.0 0.0 0.0
        v 1.0 1.0 0.0
        v 0.0 1.0 0.0 
        vt 0.0 0.0
        vt 1.0 0.0
        vt 1.0 1.0
        vt 0.0 1.0
        f 1/1/1 2/2/2 3/3/3 
        f 1/1/1 3/3/3 4/4/4
      `;
            model.parseModel(modelData);
            expect(model.materialLibrary).toBe('square.mtl');
        });

        it('it should interleave the vertex and texture and normal values', () => {
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
            expect(model.vertexBuffer).toEqual(new Float32Array([11, 11, 0, 0, 0, 12, 11, 0, 1, 0, 12, 12, 0, 1, 1]));
            expect(model.vertexiIndices).toEqual(new Uint16Array([0, 1, 2]));
        });


    });

    export { }