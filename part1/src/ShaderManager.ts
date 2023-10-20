import vertexShader from './shaders/VertexShader.glsl';
import fragmentShader from './shaders/FragmentShader.glsl';

// Make sure this runs at the beginning of your program so that the 
// async fetches can complete before you need the data.

const shaderTestMap = new Map<string, string>();


function loadShader(shaderName: string, shaderSource: string) {
    fetch(shaderSource)
        .then(response => response.text())
        .then(data => {
            shaderTestMap.set(shaderName, data);
        })
        .catch(error => {
            console.log(error);
        })
    shaderTestMap.set(shaderName, shaderSource);
}



export function cacheShaders() {
    loadShader('vertexShader', vertexShader);
    loadShader('fragmentShader', fragmentShader);
}

export default shaderTestMap;