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
    private cache: Map<string, string> = new Map();

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
     * @memberof ObjFileLoader
     * @method load
     * @public
     * */
    public async loadIntoCache(path: string) {
        if (this.cache.has(path)) {
            console.log('xxxxxx. already loaded');
            return this.cache.get(path)!;
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
                console.log('sdjkfsdkjfhsdfkjhsdfj');
                console.log(data);
                this.cache.set(path, data);
            }
            )
            .catch((error) => {
                console.log(error);
                this.cache.set(path, '');
            }
            );
    }


    public getFile(path: string): string {
        if (this.cache.has(path)) {

            return this.cache.get(path)!;
        }
        return '';
    }
}

export default ObjFileLoader;