import ModelGL from './ModelGL';
import { objectFileMap } from './ObjectFileMap';
import Material from './Material';

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
    // this is where you would put the URL to your server
    private URLPrefix: string = 'http://localhost:8080/objects/';
    private modelCache: Map<string, ModelGL> = new Map();

    private static instance: ObjFileLoader;

    /** because this class caches the models we only want one copy
    * of the class. This is a singleton pattern
    */
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
     * 
     * @returns Promise<ModelGL>
     * @public
     * */
    public async getModel(object: string): Promise<ModelGL | undefined> {
        const objectFilePath = objectFileMap.get(object)!;
        if (this.modelCache.has(objectFilePath)) {
            console.log(`${objectFilePath} already loaded`);
            let model = this.modelCache.get(objectFilePath);
            return model;
        }
        console.log('loading into cache');
        const fullPath = this.URLPrefix + objectFilePath;
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
                model.parseModel(data, objectFilePath);
                this.modelCache.set(objectFilePath, model);

                // now load the material file into the model
                let populatedModel = this.loadMaterialIntoModel(model);
                populatedModel.then((model) => {
                    return model;
                });
            }
            )
            .catch((error) => {
                console.log(error);
            }
            );
    }


    /**
     * Load the material file from the model
     * the function does not return anything. it simply copies the material into the Model
     * @param {string} path
     * Call back function to indicate model is ready
     * @param {Function} callback
     * @param 
     * @memberof MaterialFileLoader
     * @method load
     * @returns Promise<Material|undefined>
     * @public
     * */
    private async loadMaterialIntoModel(model: ModelGL): Promise<ModelGL> {

        const modelFullPath = model.modelPath;
        console.log(`modelFullPath: ${modelFullPath}`)
        const material = model.materialFile;

        // If the model does not have a material then we are done.
        if (material === "") {
            return model;
        }

        // If the model has a material, but it is already loaded, then we are done.
        if (model.material !== undefined) {
            return model;
        }

        // If the model has a material, but it is not loaded, then load it.
        if (model.material === undefined) {
            // get the path to the material file
            const modelDirectory = modelFullPath.substring(0, modelFullPath.lastIndexOf('/'));
            console.log(`modelDirectory: ${modelDirectory}`);
            const materialPath = this.URLPrefix + modelDirectory + '/' + material;
            console.log(materialPath);

            await fetch(materialPath)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response;
                }).then((response => response.text()))
                .then((data) => {
                    const material = new Material();
                    material.loadMaterialFromString(data);
                    model.material = material;
                    return model;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        return model
    }


}

export default ObjFileLoader;