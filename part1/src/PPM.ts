/** @file PPM.ts
 *  @brief Class for working with PPM images
 *  
 *  Class for working with P3 PPM images specifically.
 * 
 *  @bug No known bugs.
 * 
 */


class PPM {
    private _width: number = 0;
    private _height: number = 0;
    private _maxColorValue: number = 0;
    // define the data as 8 bit unsigned integers (bytes)
    private _data: Uint8Array = new Uint8Array(0);



    public loadFileFromString(fileContents: string): void {
        let lines: string[] = fileContents.split('\n');
        let lineIndex: number = 0;
        let line: string = lines[lineIndex++];
        if (line !== 'P3') {
            throw new Error('Invalid PPM file: plain RAW file should begin with P3');
        }

        // parse the file into an array of numbers.
        let numbers: number[] = [];
        while (lineIndex < lines.length) {
            // remove the trailing comment
            let commentIndex: number = lines[lineIndex].indexOf('#');
            if (commentIndex !== -1) {
                lines[lineIndex] = lines[lineIndex].substring(0, commentIndex);
            }
            // split the line into numbers
            let lineNumbers: string[] = lines[lineIndex].split(' ');
            for (let i = 0; i < lineNumbers.length; i++) {
                if (lineNumbers[i] !== '') {
                    numbers.push(parseInt(lineNumbers[i]));
                }
            }
            lineIndex++;

        }

        this._width = numbers[0];
        this._height = numbers[1];

        this._maxColorValue = numbers[2];

        // there should be 3 * width * height numbers after the first 3.
        if (this._width * this._height * 3 + 3 !== numbers.length) {
            throw new Error('Invalid PPM file: not enough color values');
        }

        // create the data array
        this._data = new Uint8Array(this._width * this._height * 3);
        for (let i = 0; i < this._width * this._height * 3; i++) {
            this._data[i] = numbers[i + 3]; 
        }
            }

    /**
     * 
     * @param alpha - Whether or not to include the alpha channel
     * @returns either a Uint8Array(3 * width * height) or Uint8Array(4 * width * height) depending on alpha
     * 
     * @example
     * 
     * // returns
     * // Uint8Array(3 * 372 * 338)
     * // Uint8Array(4 * 372 * 338)
     * 
     */

    getImageData(alpha: boolean = true): Uint8Array {
        if (alpha) {
            let data: Uint8Array = new Uint8Array(this._width * this._height * 4);
            for (let i = 0; i < this._width * this._height; i++) {
                data[i * 4] = this._data[i * 3];
                data[i * 4 + 1] = this._data[i * 3 + 1];
                data[i * 4 + 2] = this._data[i * 3 + 2];
                data[i * 4 + 3] = 255;
            }
            return data;
        }
        return this._data;
    }

    /**
     * 
     * @returns A string representation of the PPM
     * 
     * @example
     * 
     * // returns
     * // P3
     * // 372 338
     * // 255
     * // 255 255 255 255 255 255 255 255 255 255 255 255 255 255 ...
     */
    stringPPM(): string {
        let ppmString: string = '';
        ppmString += 'P3\n';
        ppmString += this._width + ' ' + this._height + '\n';
        ppmString += this._maxColorValue + '\n';
        for (let i = 0; i < this._width * this._height * 3; i++) {
            ppmString += this._data[i] + ' ';
        }
        return ppmString;
    }


    /**
     * Darken halves (integer division by 2) each of the red, green
     * and blue color components of all of the pixels
     * in the PPM. Note that no values may be less than
     * 0 in a ppm.
     */
    darken(): void {
        for (let i = 0; i < this._width * this._height * 3; i++) {
            // convert the value to a integer between 0 and 255
            let value: number = this._data[i];
            if (value < 0) {
                value = 0;
            }
            this._data[i] = Math.floor(value / 2);
        }
    }

    /**
     * Lighten doubles (integer multiply by 2) each of the red, green
     * and blue color components of all of the pixels
     * in the PPM. Note that no values may be greater than
     * 255 in a ppm.
     */
    lighten(): void {
        for (let i = 0; i < this._width * this._height * 3; i++) {
            // convert the value to a integer between 0 and 255
            let value: number = this._data[i];
            value *= 2;
            if (value > 255) {
                value = 255;
            }
            this._data[i] = value;
        }
    }

    /**
     * gets a pixel and returns R,G,B value 
     * 
     * @param x - The x-coordinate of the pixel
     * @param y - The y-coordinate of the pixel
     * 
     */
    getPixel(x: number, y: number): [number, number, number] {
        // get the location of the pixel
        let index: number = (y * this._width + x) * 3;
        // get the valuse of the pixel
        const red: number = this._data[index];
        const green: number = this._data[index + 1];
        const blue: number = this._data[index + 2];

        // return the value of the pixel
        return [red, green, blue];
    }

    /**
     * Sets a pixel to a specific R,G,B value 
     * Note: You do not *have* to use setPixel in your implementation, but
     *       it may be useful to implement.
     * @param x - The x-coordinate of the pixel
     * @param y - The y-coordinate of the pixel
     * @param R - The red component of the pixel
     * @param G - The green component of the pixel
     * @param B - The blue component of the pixel
     */

    setPixel(x: number, y: number, R: number, G: number, B: number): void {
        // get the location of the pixel
        let index: number = (y * this._width + x) * 3;
        // set the value of the pixel
        this._data[index] = R;
        this._data[index + 1] = G;
        this._data[index + 2] = B;
    }

    public get width(): number {
        return this._width;
    }

    public set width(width: number) {
        this._width = width;
    }

    public get height(): number {
        return this._height;
    }

    public set height(height: number) {
        this._height = height;
    }

    public get maxColorValue(): number {
        return this._maxColorValue;
    }

    public set maxColorValue(maxColorValue: number) {
        this._maxColorValue = maxColorValue;
    }

    public get data(): Uint8Array {
        return this._data;
    }

    public set data(data: Uint8Array) {
        this._data = data;
    }
}
export default PPM;