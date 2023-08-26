/**
 * FilePPM
 * 
 * A class to abstract out file dependency of PPM class.
 * 
 * This class is indended to be called by NodeJS code, not by browser code.
 */
import PPM from './PPM';

import fs from 'fs';

class FilePPM extends PPM {
    constructor(fileName: string = '') {
        super();
        if (fileName !== '') {
            this.loadPPM(fileName);
        }

    }

    /** 
     * Loads a PPM Image from a file.
     * @param fileName - The name of the file to load
     * 
     */
    loadPPM(fileName: string): void {
        try {
            let fileContents: string = fs.readFileSync(fileName, 'utf8');
            this.loadFileFromString(fileContents);
        } catch (err) {
            console.error(`Error loading PPM file: ${err}`);
        }
    }

    /**
     * Saves a PPM Image to a new file.
     * @param outputFileName - The name of the file to save
     */
    savePPM(outputFileName: string): void {
        const fileContents: string = this.stringPPM();
        try {
            // open the file in write mode
            const file: fs.WriteStream = fs.createWriteStream(outputFileName);

            // write the contents and close the file
            file.write(fileContents);

            // close the stream
            file.end();
        } catch (err) {
            console.error(`Error saving PPM file: ${err}`);
        }

    }


}

export default FilePPM;