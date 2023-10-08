import React, { useRef, useEffect } from 'react';
import fragmentShaderMap from './shaders/FragmentShader'
import vertexShaderMap from './shaders/VertexShader'

import ModelGL from './ModelGL';
import PPMFileLoader from './PPMFileLoader';
import { mat4, vec3 } from 'gl-matrix';
import Camera from './Camera';

export { };
/**
 * @module CanvasGL
 * 
 * @description
 *              This returns a WebGL canvas element.
 *             It is used to render the 3D scene.
 *              It has props for the width and height of the canvas.
 */



interface CanvasGLProps {
    key: string;
    width: number;
    height: number;
    model: ModelGL | null;

    renderMode: string;
    projectionMode: string;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    translateX: number;
    translateY: number;
    translateZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    camera: Camera;
    cameraDistance: number;
    renderFrame: number;
}


function CanvasGL({ width, height, model, renderMode, projectionMode,
    rotateX, rotateY, rotateZ,
    translateX, translateY, translateZ,
    scaleX, scaleY, scaleZ, cameraDistance, camera, renderFrame }: CanvasGLProps) {

    const [shouldRender, setShouldRender] = React.useState(false);

    useEffect(() => {
        setShouldRender(true);
    }, [model]);

    if (!model) {
        console.log('The model is null');

    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // make this rerender 30 times a second



    useEffect(() => {
        if (!shouldRender || !model) {
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            //setShouldRender(false);
            // ******************************************************
            // get the WebGL context
            // ******************************************************
            const gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
            if (!gl) {
                console.error('WebGL2 not supported');
                return;
            }
            const glslVersion = (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).SHADING_LANGUAGE_VERSION);




            // ******************************************************
            // decide whether or not to use the texture shader
            // ******************************************************
            let useTextureShader = true;

            if (model.material === undefined) {
                useTextureShader = false;
            }

            if (model.material!.map_Kd === "") {
                useTextureShader = false;
            }

            if (model.vertexStride < 5) {
                useTextureShader = false;
            }

            // ******************************************************
            // Create the vertex shader program
            // ******************************************************
            const vertexShaderProgram = gl.createShader(gl.VERTEX_SHADER);
            if (!vertexShaderProgram) {
                throw new Error('Failed to create vertex shader');
            }



            let vertexShaderName = "vertexFullTransformationShader";



            if (useTextureShader) {

                vertexShaderName = "vertexTextureFullTransformationShader";
                // check to see if there are normals defined
                if (model.vertexStride === 8 * 4) {
                    vertexShaderName = "vertexTextureNormalFullTransformationShader";
                }

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
                return;
            }



            // ******************************************************
            // create a fragment shader
            // ******************************************************
            const fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
            if (!fragmentShaderObject) {
                throw new Error('Failed to create fragment shader');
            }

            // get the fragment shader source code from the shader map use the simplest one by default
            let fragmentShader = fragmentShaderMap.get("fragmentShader") as string;

            if (useTextureShader) {
                fragmentShader = fragmentShaderMap.get("fragmentTextureShader") as string;
                if (vertexShaderName === "vertexTextureNormalFullTransformationShader") {
                    fragmentShader = fragmentShaderMap.get("fragmentTextureNormalShader") as string;
                    console.log("using fragmentTextureNormalShader")
                }

            }

            // attach the shader source code to the fragment shader
            gl.shaderSource(fragmentShaderObject, fragmentShader);

            // compile the fragment shader
            gl.compileShader(fragmentShaderObject);

            // check if the fragment shader compiled successfully
            const fragmentShaderCompiled = gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS);
            if (!fragmentShaderCompiled) {
                console.error('Failed to compile fragment shader');
                return;
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

            if (useTextureShader) {
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
                const texture = gl.createTexture();
                if (!texture) {
                    throw new Error('Failed to create texture');
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

            if (vertexShaderName === "vertexTextureNormalFullTransformationShader") {
                // get the normal attribute location
                const normalLocation = gl.getAttribLocation(shaderProgram, 'normal');

                // enable the normal attribute

                gl.enableVertexAttribArray(normalLocation);

                // tell the normal attribute how to get data out of the normal buffer
                gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, model.vertexStride, model.normalOffset);
            }

            if (vertexShaderName === "vertexTextureFullTransformationShader"
                || vertexShaderName === "vertexFullTransformationShader" ||
                vertexShaderName === "vertexTextureNormalFullTransformationShader") {


                camera.setViewPortWidth(width);
                camera.setViewPortHeight(height);
                camera.setFieldOfView(90);

                //camera.setEyePosition(vec3.fromValues(0, 0, cameraDistance));
                if (projectionMode === "orthographic") {
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
            console.log(` vertexShader name = ${vertexShaderName} fragmentShader name = ${fragmentShader} `);


            const modelMatrix = mat4.create();  // create a matrix to hold the model matrix


            mat4.translate(modelMatrix, modelMatrix, [translateX, translateY, translateZ]);


            mat4.rotateZ(modelMatrix, modelMatrix, rotateZ * Math.PI / 180);
            mat4.rotateY(modelMatrix, modelMatrix, rotateY * Math.PI / 180);
            mat4.rotateX(modelMatrix, modelMatrix, rotateX * Math.PI / 180);


            mat4.scale(modelMatrix, modelMatrix, [scaleX, scaleY, scaleZ]);



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
            // gl.clearColor(.6, .2, .6, 1);
            // gl.clear(gl.COLOR_BUFFER_BIT);

            if (projectionMode === "orthographic") {
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
            if (renderMode === "wireframe") {
                // Draw the triangles as wireframe using gl.LINE_LOOP
                for (let i = 0; i < model.numTriangles!; i++) {
                    const index = i * 3;
                    gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, index * 2);
                }

            } else {

                gl.drawElements(gl.TRIANGLES, model.vertexiIndices.length, gl.UNSIGNED_SHORT, 0);
            }


            gl.flush();
            gl.finish();

        }
    }, [shouldRender, model, width, height, renderMode, projectionMode, cameraDistance,
        rotateX, rotateY, rotateZ,
        translateX, translateY, translateZ,
        scaleX, scaleY, scaleZ, camera, renderFrame]);

    return (<canvas ref={canvasRef} width={width} height={height} />);
}

export default CanvasGL;
