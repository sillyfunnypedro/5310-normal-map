import ModelGL from './ModelGL';
import { objectFileMap } from './ObjectFileMap';

/**
 * ObjFileLoader.ts
 * @description ObjFileLoader class
 * @class ObjFileLoader
 * @export ObjFileLoader
 * 
 * Will load a file from a given path and return the contents of that file.
 * It will cache the file contents so that if the same file is requested
 * multiple times, it will only be loaded once.
 */

class ObjFileLoader {
    private URLPrefix: string = 'http://localhost:8080/objects/';
    private modelCache: Map<string, ModelGL> = new Map();

    private static instance: ObjFileLoader;

    private constructor() {
        // do nothing
    }

    public static getInstance(): ObjFileLoader {
        if (!ObjFileLoader.instance) {
            ObjFileLoader.instance = new ObjFileLoader();
        }
        return ObjFileLoader.instance;
    }
    /**
     * Load a file from a given path, and store it in the cache
     * the function does not return anything.
     * @param {string} path
     * Call back function to indicate model is ready
     * @param {Function} callback
     * @param 
     * @memberof ObjFileLoader
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
                const model = new ModelGL();
                model.parseModel(data);
                this.modelCache.set(path, model);
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
     * @param {string} ObjectName
     * @returns ModelGL | undefined
     * @memberof ObjFileLoader
     * @method getModel
     * @public
     * */
    public getModel(ObjectName: string): ModelGL | undefined {
        const path = objectFileMap.get(ObjectName)!;
        if (this.modelCache.has(path)) {
            return this.modelCache.get(path);
        }
        return undefined;
    }

}

export default ObjFileLoader;