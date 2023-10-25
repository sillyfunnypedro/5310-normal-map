
import fragmentShader from './shaders/FragmentShader.glsl';
import fragmentTextureShader from './shaders/FragmentTextureShader.glsl';
import fragmentTextureNormalShader from './shaders/FragmentTextureNormalShader.glsl';
import fragmentTextureNormalNormalMapShader from './shaders/FragmentTextureNormalNormalMapShader.glsl';



import vertexShader from './shaders/VertexShader.glsl';
import vertexTextureShader from './shaders/VertexTextureShader.glsl';
import vertexTextureNormalShader from './shaders/VertexTextureNormalShader.glsl';
import vertexTextureNormalNormalMapShader from './shaders/VertexTextureNormalNormalMapShader.glsl';


// Make sure this runs at the beginning of your program so that the 
// async fetches can complete before you need the data.

const shaderSourceCodeMap = new Map<string, string>();


function loadShader(shaderName: string, shaderSource: string) {
    fetch(shaderSource)
        .then(response => response.text())
        .then(data => {
            console.log('**********************************************************')
            console.log(`loaded ${shaderName}`);
            console.log('*********** Source Code Here *****************************')
            console.log(data);
            console.log('************ End of Source  ******************************')
            shaderSourceCodeMap.set(shaderName, data);
        })
        .catch(error => {
            console.log(error);
        })
    shaderSourceCodeMap.set(shaderName, shaderSource);
}



export function loadAndCacheShaderSource() {
    loadShader('fragmentShader', fragmentShader);
    loadShader('fragmentTextureShader', fragmentTextureShader);
    loadShader('fragmentTextureNormalShader', fragmentTextureNormalShader);
    loadShader('fragmentTextureNormalNormalMapShader', fragmentTextureNormalNormalMapShader);

    loadShader('vertexShader', vertexShader);
    loadShader('vertexTextureShader', vertexTextureShader);
    loadShader('vertexTextureNormalShader', vertexTextureNormalShader);
    loadShader('vertexTextureNormalNormalMapShader', vertexTextureNormalNormalMapShader);

}

export default shaderSourceCodeMap;