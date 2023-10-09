import Camera from "./Camera";
import ModelGL from "./ModelGL";



class SceneData {
    glContext: WebGLRenderingContext | null = null;
    camera: Camera | null = null;
    model: ModelGL | null = null;
    width: number = 0;
    height: number = 0;



    renderMode: string = "solid";
    projectionMode: string = "perspective";
    translateX: number = 0;
    translateY: number = 0;
    translateZ: number = 0;
    scaleX: number = 1;
    scaleY: number = 1;
    scaleZ: number = 1;
    frameNumber: number = 0;

}

export default SceneData;