import React, { useRef, useEffect } from 'react';
import fragmentShaderMap from './shaders/FragmentShader'
import vertexShaderMap from './shaders/VertexShader'

import ModelGL from './ModelGL';
import PPMFileLoader from './PPMFileLoader';
import PPM from './PPM';

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
    width: number;
    height: number;
    model: ModelGL | null;
    renderMode: string;
}


function CanvasGL({ width, height, model, renderMode }: CanvasGLProps) {

    const [shouldRender, setShouldRender] = React.useState(false);

    useEffect(() => {
        setShouldRender(true);
    }, [model]);

    if (!model) {
        console.log('The model is null');
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!shouldRender || !model) {
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {

            // ******************************************************
            // get the WebGL context
            // ******************************************************
            const gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
            if (!gl) {
                console.error('WebGL2 not supported');
                return;
            }
            const glslVersion = (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).SHADING_LANGUAGE_VERSION);
            console.log(`GLSL version supported: ${glslVersion}`);
            console.log((gl as WebGLRenderingContext).VERSION);

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
            //
            // create a vertex shader
            //
            // ******************************************************
            const vertexShaderProgram = gl.createShader(gl.VERTEX_SHADER);
            if (!vertexShaderProgram) {
                throw new Error('Failed to create vertex shader');
            }


            // get the vertex shader source code from the shader map use the simplest one by default
            let vertexShader = vertexShaderMap.get("vertexShader") as string;
            if (useTextureShader) {
                vertexShader = vertexShaderMap.get("vertexTextureShader") as string;
            }

            console.log('using shader:\n' + vertexShader);


            // attach the shader source code to the vertex shader
            gl.shaderSource(vertexShaderProgram, vertexShader);

            // compile the vertex shader
            gl.compileShader(vertexShaderProgram);

            // check if the vertex shader compiled successfully
            const vertexShaderCompiled = gl.getShaderParameter(vertexShaderProgram, gl.COMPILE_STATUS);
            if (!vertexShaderCompiled) {
                console.error('Failed to compile vertex shader');
                return;
            }


            // ******************************************************
            //
            // create a fragment shader
            //
            // ******************************************************
            const fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
            if (!fragmentShaderObject) {
                throw new Error('Failed to create fragment shader');
            }





            // get the fragment shader source code from the shader map use the simplest one by default
            let fragmentShader = fragmentShaderMap.get("fragmentShader") as string;


            if (useTextureShader) {
                fragmentShader = fragmentShaderMap.get("fragmentTextureShader") as string;
            }

            console.log('using shader:\n' + fragmentShader);

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

            // create a shader program
            const shaderProgram = gl.createProgram();
            if (!shaderProgram) {
                throw new Error('Failed to create shader program');
            }

            /**
             * set up the texture for the model
             */

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


            // create a buffer for the indices and bind the index buffer
            const positionBuffer = gl.createBuffer();


            // bind the index buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            gl.bufferData(gl.ARRAY_BUFFER, model.packedVertexBuffer, gl.STATIC_DRAW);




            const indexBuffer = gl.createBuffer();
            // bind the index buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


            // pass the triangle's indices to the index buffer
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.vertexiIndices, gl.STATIC_DRAW);

            //
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.packedVertexBuffer), gl.STATIC_DRAW);


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


                const ppmIMG = PPMFileLoader.getInstance().loadIntoCache(model.material!.map_Kd!);

                ppmIMG.then((ppmFile) => {
                    if (ppmFile === undefined) {
                        throw new Error("ppmFile is undefined");
                    }
                    // load the texture data into the texture
                    if (ppmFile.data === undefined) {
                        throw new Error("ppmFile.data is undefined");
                    }

                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, ppmFile.width, ppmFile.height, 0, gl.RGB, gl.UNSIGNED_BYTE, ppmFile.data);
                });

            }

            // Clear the whole canvas
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


            // Clear the canvas to a purple color
            gl.clearColor(.6, .2, .6, 1);
            //gl.clear(gl.COLOR_BUFFER_BIT);

            // calculate the square that fits in the canvas make that the viewport
            let squareSize = gl.canvas.width;
            if (gl.canvas.width > gl.canvas.height) {
                squareSize = gl.canvas.height;
            }

            // calculate the offset for the square  
            const xOffset = (gl.canvas.width - squareSize) / 2;
            const yOffset = (gl.canvas.height - squareSize) / 2;


            gl.viewport(xOffset, yOffset, squareSize, squareSize);



            if (renderMode === "wireframe") {
                // Draw the triangles as wireframe using gl.LINE_LOOP
                for (let i = 0; i < model.numTriangles!; i++) {
                    const index = i * 3;
                    gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, index * 2);
                }
                //gl.drawElements(gl.LINE_LOOP, renderModelGL.indices.length, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawElements(gl.TRIANGLES, model.vertexiIndices.length, gl.UNSIGNED_SHORT, 0);
            }


            gl.flush();
            gl.finish();

        }
    }, [shouldRender, model, width, height, renderMode]);

    return <canvas ref={canvasRef} width={width} height={height} />;
}

export default CanvasGL;
