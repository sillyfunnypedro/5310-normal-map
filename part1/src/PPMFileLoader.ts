import PPM from './PPM';
import { objectFileMap } from './ObjectFileMap';

/**
 * PPMFileLoader.ts
    * @description PPMFileLoader class
    * @class PPMFileLoader
 */

class PPMFileLoader {
    // this is where you would put the URL to your server
    private URLPrefix: string = 'http://localhost:8080/objects/';
    private modelCache: Map<string, ModelGL> = new Map();

    private static instance: PPMFileLoader;

    private constructor() {
        // do nothing
    }

    public static getInstance(): PPMFileLoader {
        if (!PPMFileLoader.instance) {
            PPMFileLoader.instance = new PPMFileLoader();
        }
        return PPMFileLoader.instance;
    }
    /**
     * Load a file from a given path, and store it in the cache
     * the function does not return anything.
     * @param {string} path
     * Call back function to indicate model is ready
     * @param {Function} callback
     * @param 
     * @memberof PPMFileLoader
     * @method load
     * @public
     * */
    public async loadIntoCache(objectName: string, callback: Function) {
        const path = objectFileMap.get(objectName)!;
        if (this.modelCache.has(path)) {
            console.log(`${path} already loaded`);
            callback();
            return;
        }
        console.log('loading into cache');
        const fullPath = this.URLPrefix + path;
        console.log(fullPath);
        await fetch(fullPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response;
            }
            )
            .then((response => response.text()))
            .then((data) => {
                const image = new PPM();
                image.loadFileFromString(data);
                this.modelCache.set(path, image);
                callback();
            }
            )
            .catch((error) => {
                console.log(error);
            }
            );
    }

    /**
     * Get a model from the cache
     * @param {string} ImageName
     * @returns ModelGL | undefined
     * @memberof ObjFileLoader
     * @method getModel
     * @public
     * */
    public getImage(ImageName: string): PPM | undefined {
        const path = objectFileMap.get(ImageName)!;
        if (this.modelCache.has(path)) {
            return this.modelCache.get(path);
        }
        return undefined;
    }

}

export default PPMFileLoader;