//*--------------------------------------------------------
//*     Title: WebGL Tutorial 01 - Setup and Triangle
//*     Web Address: https://www.youtube.com/watch?v=kB0ZVUrI4Aw
//*     Last Accessed: 02/01/2020
//*--------------------------------------------------------
import Camera from './Camera';
import ModelGL from './ModelGL';
import PPMFileLoader from './PPMFileLoader';
import fragmentShaderMap from './shaders/FragmentShader'
import vertexShaderMap from './shaders/VertexShader'
import { mat4 } from 'gl-matrix';


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

const sceneData = new SceneData();

// Set up the canvas and WebGL context so that our rendering loop can draw on it
// We store the gl context in the sceneData object so that we can access it later
export const setupCanvas = function () {
    var canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
    if (!canvas) {
        alert('Canvas not found');
        return;
    }

    // Get the WebGL context NOte we need WebGL2 for this application
    var gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
        alert('WebGL not supported');
        return;
    }

    sceneData.width = canvas.width;
    sceneData.height = canvas.height;

    // Store the WebGLRenderingContext on the sceneData object
    sceneData.glContext = gl;

    // Set up the viewport


    // Set the clear color to be purple
    gl.clearColor(1.0, 0.0, 1.0, 1.0);
    // Clear the color buffer with clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

}


export function updateSceneData(model: ModelGL | null, camera: Camera | null): void {

    sceneData.camera = camera;
    sceneData.model = model;
    if (model !== null && camera !== null) {
        renderLoop();
    }
}

function compileProgram(gl: WebGLRenderingContext): WebGLProgram | null {
    if (!sceneData.model) {
        return null;
    }

    if (sceneData.model.renderingProgram !== null) {
        return sceneData.model.renderingProgram;
    }
    if (!sceneData.camera) {
        return null;
    }

    if (!gl) {
        return null;
    }


    const vertexShaderName = sceneData.model.vertexShaderName;
    const fragmentShaderName = sceneData.model.fragmentShaderName;

    console.log("Compiling " + vertexShaderName + " and " + fragmentShaderName);

    // ******************************************************
    // Create the vertex shader program
    // ******************************************************   
    const vertexShaderProgram = gl.createShader(gl.VERTEX_SHADER);

    if (!vertexShaderProgram) {
        throw new Error('Failed to create vertex shader');
    }

    // get the vertex shader source code from the shader map
    const vertexShader = vertexShaderMap.get(vertexShaderName) as string;

    // Now that we have the code let's compile it compile it
    // attach the shader source code to the vertex shader
    gl.shaderSource(vertexShaderProgram, vertexShader);

    // compile the vertex shader
    gl.compileShader(vertexShaderProgram);

    // check if the vertex shader compiled successfully
    const vertexShaderCompiled = gl.getShaderParameter(vertexShaderProgram, gl.COMPILE_STATUS);
    if (!vertexShaderCompiled) {
        console.log(vertexShader)
        console.log('tried to compile ' + vertexShaderName);
        console.log(gl.getShaderInfoLog(vertexShaderProgram));
        console.error('Failed to compile vertex shader');
        return null;
    }

    // ******************************************************
    // create the fragment shader
    // ******************************************************
    const fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShaderObject) {
        throw new Error('Failed to create fragment shader');
    }

    // get the fragment shader source code from the shader map 
    const fragmentShader = fragmentShaderMap.get(fragmentShaderName) as string;

    // attach the shader source code to the fragment shader
    gl.shaderSource(fragmentShaderObject, fragmentShader);

    // compile the fragment shader
    gl.compileShader(fragmentShaderObject);

    // check if the fragment shader compiled successfully
    const fragmentShaderCompiled = gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS);
    if (!fragmentShaderCompiled) {
        console.log(fragmentShader);
        console.log('tried to compile ' + fragmentShaderName);
        console.log(gl.getShaderInfoLog(fragmentShaderObject));
        console.error('Failed to compile fragment shader');
        return null;
    }

    // ******************************************************
    // create a shader program
    // ******************************************************
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
        throw new Error('Failed to create shader program');
    }

    // attach the vertex shader to the shader program
    gl.attachShader(shaderProgram, vertexShaderProgram);

    // attach the fragment shader to the shader program
    gl.attachShader(shaderProgram, fragmentShaderObject);

    // link all attached shaders
    gl.linkProgram(shaderProgram);

    // check if the shader program linked successfully
    const shaderProgramLinked = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!shaderProgramLinked) {
        console.error('Failed to link shader program');
        return null;
    }
    // cache the shader program
    sceneData.model.renderingProgram = shaderProgram;
    return shaderProgram;
}

function renderLoop(): void {
    let gl = sceneData.glContext;

    let texture: WebGLTexture | null = null;
    if (!gl) {
        return;
    }

    let model = sceneData.model;
    if (!model) {
        return;
    }

    let camera = sceneData.camera;
    if (!camera) {
        return;
    }

    if (sceneData === null) {
        return;
    }

    const width = sceneData.width;
    const height = sceneData.height;

    // ******************************************************
    // Compile the shader program if it has not been compiled yet
    // the compileProgram will store the compiled program in the 
    // current model in sceneData
    // ******************************************************
    const shaderProgram = compileProgram(gl);

    if (!shaderProgram) {
        return;
    }
    // use the shader program
    gl.useProgram(shaderProgram);
    // ******************************************************
    // Phew, we are done with the shaders
    // now we need to set up the buffers
    // ******************************************************


    // create a buffer for Vertex data
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.packedVertexBuffer, gl.STATIC_DRAW);



    // create an index buffer
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.vertexiIndices, gl.STATIC_DRAW);

    // ******************************************************
    // Now we need to figure out where the input data is going to go
    // ******************************************************

    // get the position attribute location
    const positionLocation = gl.getAttribLocation(shaderProgram, 'position');

    // enable the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // tell the position attribute how to get data out of the position buffer
    // the position attribute is a vec3 (3 values per vertex) and then there are three
    // colors per vertex
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, model.vertexStride, 0);

    /** 
     * if we are using a texture then set up the vertex information 
     * */

    if (sceneData!.model!.useTexture) {
        // get the texture coordinate attribute location
        const texCoordLocation = gl.getAttribLocation(shaderProgram, 'textureCoord');
        // check to see if we got the attribute location
        if (texCoordLocation === -1) {
            console.log('Failed to get the storage location of texCoord');
        }

        // enable the texture coordinate attribute
        gl.enableVertexAttribArray(texCoordLocation);

        // tell the texture coordinate attribute how to get data out of the texture coordinate buffer
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, model.vertexStride, model.textureOffset);

        // create a texture
        texture = gl.createTexture();
        if (!texture) {
            console.log('Failed to create the texture object');
            return;
        }

        // create a texture unit
        const textureUnit = gl.TEXTURE0;

        // bind the texture to the texture unit
        gl.activeTexture(textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // set the parameters for the texture
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // set the filtering for the texture
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        const diffuseTextureName = model.textures.get("map_Kd") as string;

        // load the texture data
        // The PPMFileLoader caches the ppm files so if the file has already been loaded
        // so it is ok to just call this here since it will not load the file again
        const ppmIMG = PPMFileLoader.getInstance().loadFile(diffuseTextureName);


        if (ppmIMG === undefined) {
            console.log("ppmFile is undefined");
            return;
        }
        // load the texture data into the texture
        if (ppmIMG.data === undefined) {
            console.log("ppmFile.data is undefined");
            return;
        }

        // set the value of the uniorm sampler to the texture unit
        let textureLocation = gl.getUniformLocation(shaderProgram, 'textureSampler');
        gl.uniform1i(textureLocation, 0);

        // bind the data to the texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, ppmIMG.width, ppmIMG.height, 0, gl.RGB, gl.UNSIGNED_BYTE, ppmIMG.data);
        gl.generateMipmap(gl.TEXTURE_2D);

    }

    if (model.vertexShaderName === "vertexTextureNormalFullTransformationShader") {
        // get the normal attribute location
        const normalLocation = gl.getAttribLocation(shaderProgram, 'normal');

        // enable the normal attribute

        gl.enableVertexAttribArray(normalLocation);

        // tell the normal attribute how to get data out of the normal buffer
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, model.vertexStride, model.normalOffset);
    }

    if (model.vertexShaderName === "vertexTextureFullTransformationShader"
        || model.vertexShaderName === "vertexFullTransformationShader" ||
        model.vertexShaderName === "vertexTextureNormalFullTransformationShader") {
        camera.setViewPortWidth(width);
        camera.setViewPortHeight(height);


        if (sceneData.projectionMode === "orthographic") {
            camera.setOrthographicProjection();
        } else {
            camera.setPerspectiveProjection();
        }


        // get the projection matrix location
        const projectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'projectionMatrix');

        // set the projection matrix
        gl.uniformMatrix4fv(projectionMatrixLocation, false, camera.projectionMatrix);


        // get the view matrix location
        const viewMatrixLocation = gl.getUniformLocation(shaderProgram, 'viewMatrix');

        // set the view matrix
        gl.uniformMatrix4fv(viewMatrixLocation, false, camera.viewMatrix);

    }


    // get the model matrix.
    const modelMatrix = model.getModelMatrix();


    // get the model matrix location
    const rotationMatrixLocation = gl.getUniformLocation(shaderProgram, 'modelMatrix');

    // set the model matrix
    gl.uniformMatrix4fv(rotationMatrixLocation, false, modelMatrix);


    // ******************************************************
    // Ok we are good to go.   Lets make some graphics
    // ****************************************************** 
    // Clear the whole canvas
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


    // Clear the canvas to a purple color
    // let color = (sceneData.frameNumber++ % 255) / 255.0;
    // gl.clearColor(color, .2, .6, 1);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    if (sceneData.projectionMode === "orthographic") {
        // calculate the square that fits in the canvas make that the viewport
        let squareSize = gl.canvas.width;
        if (gl.canvas.width > gl.canvas.height) {
            squareSize = gl.canvas.height;
        }
        // calculate the offset for the square  
        const xOffset = (gl.canvas.width - squareSize) / 2;
        const yOffset = (gl.canvas.height - squareSize) / 2;


        gl.viewport(xOffset, yOffset, squareSize, squareSize);
    } else {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    }

    // enable the z-buffer
    gl.enable(gl.DEPTH_TEST);

    // This is really slow but it is good for debugging.
    if (sceneData.renderMode === "wireframe") {
        // Draw the triangles as wireframe using gl.LINE_LOOP
        for (let i = 0; i < model.numTriangles!; i++) {
            const index = i * 3;
            gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, index * 2);

        }

    } else {

        gl.drawElements(gl.TRIANGLES, model.vertexiIndices.length, gl.UNSIGNED_SHORT, 0);

    }

    gl.deleteTexture(texture);
    gl.flush();
    gl.finish();




    requestAnimationFrame(renderLoop);
}