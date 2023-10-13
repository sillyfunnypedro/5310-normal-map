import Material from './Material';
import ModelGL from './ModelGL';
import { ServerURLPrefix } from './ServerURL';


/**
 * MaterialFileLoader.ts
    * @description MaterialFileLoader class
    * @class MaterialFileLoader
 */

class MaterialFileLoader {
    // this is where you would put the URL to your server
    private URLPrefix: string = ServerURLPrefix();





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
    public async loadIntoModel(model: ModelGL): Promise<ModelGL> {

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

export default MaterialFileLoader;