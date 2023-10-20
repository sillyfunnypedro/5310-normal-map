
import fragmentShaderBasic from './shaders/FragmentShaderBasic.glsl';
import fragmentTextureShader from './shaders/FragmentTextureShader.glsl';
import fragmentTextureNormalShader from './shaders/FragmentTextureNormalShader.glsl';

import vertexShader from './shaders/VertexShader.glsl';
import vertexTextureShader from './shaders/VertexTextureShader.glsl';
import vertexTransformationShader from './shaders/VertexTransformationShader.glsl';
import vertexTextureTransformationShader from './shaders/VertexTextureTransformationShader.glsl';
import vertexTextureNormalTransformationShader from './shaders/VertexTextureNormalTransformationShader.glsl';


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
    loadShader('fragmentShaderBasic', fragmentShaderBasic);
    loadShader('fragmentTextureShader', fragmentTextureShader);
    loadShader('fragmentTextureNormalShader', fragmentTextureNormalShader);

    loadShader('vertexShader', vertexShader);
    loadShader('vertexTextureShader', vertexTextureShader);
    loadShader('vertexTransformationShader', vertexTransformationShader);
    loadShader('vertexTextureTransformationShader', vertexTextureTransformationShader);
    loadShader('vertexTextureNormalTransformationShader', vertexTextureNormalTransformationShader);

}

export default shaderSourceCodeMap;