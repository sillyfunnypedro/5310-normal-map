import fs from 'fs';
import FilePPM from './FilePPM';


// get the current directory
let cwd: string = process.cwd();
let testPath: string = cwd + '/media/test';
let input_test: string = cwd + '/media/duck_original.ppm';

beforeAll(() => {
    // make sure the part4/media/test directory exists 
    // get the current 
    if (!fs.existsSync(testPath)) {
        fs.mkdirSync(testPath);
    } else {
        // delete all of the files in the directory
        const files: string[] = fs.readdirSync(testPath);
        for (const file of files) {
            fs.unlinkSync(testPath + '/' + file);
        }
    }

});




// The file in part4/media/ppm.ppm 
// is a PPM P3 file with the following contents:
// P3
// 372 338

describe('PPM', () => {
    test('constructor', () => {
        const ppm = new FilePPM(input_test);
        expect(ppm).toBeDefined();
        const width = ppm.width;
        expect(width).toBe(372);
        const height = ppm.height;
        expect(height).toBe(338);
        const maxColorValue = ppm.maxColorValue;
        expect(maxColorValue).toBe(255);

    });



    test('savePPM', () => {
        const outputFile = testPath + '/duck.ppm';
        const ppm = new FilePPM(input_test);
        ppm.savePPM(outputFile);
        setTimeout(() => {
            expect(fs.existsSync(outputFile)).toBe(true);
            const ppm2 = new FilePPM(outputFile);
            expect(ppm2).toBeDefined();
            expect(ppm2.width).toBe(372);
            expect(ppm2.height).toBe(338);
            expect(ppm2.maxColorValue).toBe(255);
        }, 500); // wait half a second for the file to be written

    });

    test('darken', () => {
        const ppm = new FilePPM(input_test);
        const [red, green, blue] = ppm.getPixel(0, 0);
        ppm.darken();
        const outputFile = testPath + '/duck_darken.ppm';
        ppm.savePPM(outputFile);
        setTimeout(() => {
            expect(fs.existsSync(outputFile)).toBe(true);
            const ppm2 = new FilePPM(outputFile);

            expect(ppm2).toBeDefined();
            expect(ppm2.width).toBe(372);
            expect(ppm2.height).toBe(338);
            expect(ppm2.maxColorValue).toBe(255);

            const [red2, green2, blue2] = ppm2.getPixel(0, 0);
            expect(red2).toBe(Math.floor(red / 2));
            expect(green2).toBe(Math.floor(green / 2));
            expect(blue2).toBe(Math.floor(blue / 2));
        }, 500); // wait half a second for the file to be written
    });

    test('lighten', () => {
        const ppm = new FilePPM(input_test);
        const [red, green, blue] = ppm.getPixel(0, 0);
        ppm.lighten();
        const outputFile = testPath + '/duck_lighten.ppm';
        ppm.savePPM(outputFile);
        setTimeout(() => {
            expect(fs.existsSync(outputFile)).toBe(true);
            const ppm2 = new FilePPM(outputFile);

            expect(ppm2).toBeDefined();
            expect(ppm2.width).toBe(372);
            expect(ppm2.height).toBe(338);
            expect(ppm2.maxColorValue).toBe(255);

            const [red2, green2, blue2] = ppm2.getPixel(0, 0);
            const expectedRed2 = red * 2 > 255 ? 255 : red * 2;
            const expectedGreen2 = green * 2 > 255 ? 255 : green * 2;
            const expectedBlue2 = blue * 2 > 255 ? 255 : blue * 2;
            expect(red2).toBe(expectedRed2);
            expect(green2).toBe(expectedGreen2);
            expect(blue2).toBe(expectedBlue2);
        }, 500); // wait half a second for the file to be written
    });
});
