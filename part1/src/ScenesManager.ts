import SceneData from "./SceneData";
import ObjFileLoader from "./ObjFileLoader";
import ModelGL from "./ModelGL";
import Camera from "./Camera";
import { vec3 } from "gl-matrix";


// ********************************************************************************************
// Instead of writing a scene parser we will use this for the course.
// here we can set up scenes that can be displayed in our WebGL viewer.
// ********************************************************************************************

class ScenesManager {
    private _scenes: Map<string, SceneData> = new Map<string, SceneData>();
    private _objLoader = ObjFileLoader.getInstance();

    private static _instance: ScenesManager;

    private constructor() {
        // do nothing
    }

    public static getInstance(): ScenesManager {
        if (!ScenesManager._instance) {
            ScenesManager._instance = new ScenesManager();

        }
        return ScenesManager._instance;
    }



    getAvailableScenes(): string[] {
        return Array.from(this._scenes.keys());
    }

    getScene(sceneName: string): SceneData | undefined {
        return this._scenes.get(sceneName);
    }

    async addScene(sceneName: string): Promise<SceneData|undefined>  {
        const model: ModelGL | undefined = await this._objLoader.getModel(sceneName);

        if (model === undefined) {
            console.log(`could not load ${sceneName}`);
            return;
        }

        const newScene = new SceneData();
        newScene.model = model;

        const newCamera = new Camera();
        newScene.camera = newCamera;

        this._scenes.set(sceneName, newScene);
        return newScene;
    }

    async makeBasicTriangleScene() {
        const sceneName = "tri-plain";
        let newScene = await this.addScene(sceneName);

        if (newScene === undefined) {
            return;
        }
        newScene.camera?.setEyePosition(vec3.fromValues(0, 0, 5));
        
    }


}