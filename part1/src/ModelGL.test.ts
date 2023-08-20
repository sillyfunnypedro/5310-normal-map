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
            expect(model.vertices).toEqual(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]));
            expect(model.indices).toEqual(new Uint16Array([0, 1, 2]));
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
    });


});

export { }