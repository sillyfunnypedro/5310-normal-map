import ModelGL from './ModelGL';
import { objectFileMap } from './ObjectFileMap';
import Material from './Material';
import PPMFileLoader from './PPMFileLoader';

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

        /**
         * If the model is not in the cache, then load it.
         */
        console.log('loading into cache');
        const fullPath = this.URLPrefix + objectFilePath;
        console.log(fullPath);


        try {
            const response = await fetch(fullPath)

            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                console.log('response was ok');
            }

            const data = await response.text();


            let model = new ModelGL();
            model.parseModel(data, objectFilePath);
            this.modelCache.set(objectFilePath, model);

            // now load the material file into the model
            model = await this.loadMaterialIntoModel(model);

            if (model.material !== undefined) {
                model = await this.loadTextures(model);
                return model;
            }


            return model;
        } catch (error) {
            console.log(error);
        }

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
        const materialFile = model.materialFile;

        // If the model does not have a material then we are done.
        if (materialFile === "") {
            return model;
        }

        // If the model has a material, but it is already loaded, then we are done.
        if (model.material !== undefined) {
            return model;
        }


        // get the path to the material file
        const modelDirectory = modelFullPath.substring(0, modelFullPath.lastIndexOf('/'));
        console.log(`modelDirectory: ${modelDirectory}`);
        const materialPath = this.URLPrefix + modelDirectory + '/' + materialFile;
        console.log(materialPath);

        try {

            const response = await fetch(materialPath)

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();

            const material = new Material();
            material.loadMaterialFromString(data);
            model.material = material;
        } catch (error) {
            console.log(error);
        }
        return model

    }

    private async loadTextures(model: ModelGL): Promise<ModelGL> {
        const modelPath = model.modelPath;
        // check to see what textures need to be loaded
        if (model.material === undefined) {
            console.log('no material');
            return model;
        }
        let loaders = [];

        if (model.material.map_Kd === undefined || model.material.map_Kd === '') {
            console.log('no diffuse texture');
        } else {

            const diffuseTextureName = model.material.map_Kd;
            const diffuseTextureLoader = this.loadTexture(model, diffuseTextureName, "map_Kd");
            console.log('diffuseTextureLoader: ' + diffuseTextureName);
            loaders.push(diffuseTextureLoader);
        }

        if (model.material.map_Bump === undefined || model.material.map_Bump === '') {
            console.log('no normal texture');
        } else {
            const normalTextureName = model.material.map_Bump;
            const normalTextureLoader = this.loadTexture(model, normalTextureName, "map_Bump");
            console.log('normalTextureLoader: ' + normalTextureName)
            loaders.push(normalTextureLoader);
        }

        if (model.material.map_Ks === undefined || model.material.map_Ks === '') {
            console.log('no specular texture');
        } else {
            const specularTextureName = model.material.map_Ks;
            const specularTextureLoader = this.loadTexture(model, specularTextureName, "map_Ks");
            console.log('specularTextureLoader: ' + specularTextureName)
            loaders.push(specularTextureLoader);
        }

        if (loaders.length === 0) {
            console.log('no textures to load');
            return model;
        }

        const models = await Promise.all(loaders)

        return models[0];
    }



    private async loadTexture(model: ModelGL, textureName: string, textureType: string): Promise<ModelGL> {
        const ppmFileLoader = PPMFileLoader.getInstance();
        const modelPath = model.modelPath;


        console.log(`loadiing texture name: ${textureName}`);

        // get the path to the directory that contains the model
        const modelDirectory = modelPath.substring(0, modelPath.lastIndexOf('/'));
        const texturePath = `${modelDirectory}/${textureName}`;

        const ppmFile = await ppmFileLoader.loadIntoCache(texturePath);

        if (model.material !== undefined) {
            model.textures.set(textureType, texturePath);
        } else {
            throw new Error('model.material is undefined');
        }
        return model;

    }





}

export default ObjFileLoader;