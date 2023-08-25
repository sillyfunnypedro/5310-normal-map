import { Material } from './Material';

describe('Material', () => {
    let material: Material;

    beforeEach(() => {
        material = new Material();
    });

    it('should parse material name', () => {
        const materialString = 'newmtl blinn1SG\n';
        material.parseMaterial(materialString);
        expect(material.name).toEqual('blinn1SG');
    });

    it('should parse Ns', () => {
        const materialString = 'Ns 100.0\n';
        material.parseMaterial(materialString);
        expect(material.Ns).toEqual(100.0);
    });

    it('should parse Ka', () => {
        const materialString = 'Ka 0.1 0.2 0.3\n';
        material.parseMaterial(materialString);
        expect(material.Ka).toEqual([0.1, 0.2, 0.3]);
    });

    it('should parse Kd', () => {
        const materialString = 'Kd 0.4 0.5 0.6\n';
        material.parseMaterial(materialString);
        expect(material.Kd).toEqual([0.4, 0.5, 0.6]);
    });

    it('should parse Ks', () => {
        const materialString = 'Ks 0.7 0.8 0.9\n';
        material.parseMaterial(materialString);
        expect(material.Ks).toEqual([0.7, 0.8, 0.9]);
    });

    it('should parse Ke', () => {
        const materialString = 'Ke 0.1 0.2 0.3\n';
        material.parseMaterial(materialString);
        expect(material.Ke).toEqual([0.1, 0.2, 0.3]);
    });

    it('should parse Ni', () => {
        const materialString = 'Ni 1.5\n';
        material.parseMaterial(materialString);
        expect(material.Ni).toEqual(1.5);
    });

    it('should parse d', () => {
        const materialString = 'd 0.5\n';
        material.parseMaterial(materialString);
        expect(material.d).toEqual(0.5);
    });

    it('should parse illum', () => {
        const materialString = 'illum 2\n';
        material.parseMaterial(materialString);
        expect(material.illum).toEqual(2);
    });

    it('should parse map_Kd', () => {
        const materialString = 'map_Kd windmill_diffuse.ppm\n';
        material.parseMaterial(materialString);
        expect(material.map_Kd).toEqual('windmill_diffuse.ppm');
    });

    it('should parse map_Bump', () => {
        const materialString = 'map_Bump windmill_normal.ppm\n';
        material.parseMaterial(materialString);
        expect(material.map_Bump).toEqual('windmill_normal.ppm');
    });

    it('should parse map_Ks', () => {
        const materialString = 'map_Ks windmill_spec.ppm\n';
        material.parseMaterial(materialString);
        expect(material.map_Ks).toEqual('windmill_spec.ppm');
    });
});