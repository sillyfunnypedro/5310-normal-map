import React, { useRef, useEffect } from 'react';
import { fragmentShader } from './shaders/FragmentShader'
import { vertexShader } from './shaders/VertexShader'

import ModelGL from './ModelGL';

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


function CanvasGL({ width, height, model: renderModelGL, renderMode }: CanvasGLProps) {

    const [shouldRender, setShouldRender] = React.useState(false);

    useEffect(() => {
        setShouldRender(true);
    }, [renderModelGL]);

    if (!renderModelGL) {
        console.log('The model is null');
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!shouldRender || !renderModelGL) {
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
            if (!gl) {
                console.error('WebGL2 not supported');
                return;
            }
            const glslVersion = (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).SHADING_LANGUAGE_VERSION);
            console.log(`GLSL version supported: ${glslVersion}`);
            console.log((gl as WebGLRenderingContext).VERSION);

            // see import at the top of this file
            // the shaders are in ../shaders
            // the vertex shader is in ../shaders/VertexShader.ts
            // the fragment shader is in ../shaders/FragmentShader.ts


            // create a vertex shader
            const vertexShaderProgram = gl.createShader(gl.VERTEX_SHADER);
            if (!vertexShaderProgram) {
                throw new Error('Failed to create vertex shader');
            }

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

            // create a fragment shader
            const fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
            if (!fragmentShaderObject) {
                throw new Error('Failed to create fragment shader');
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

            // create a shader program
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


            // create a buffer for the indices and bind the index buffer
            const positionBuffer = gl.createBuffer();


            // bind the index buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            gl.bufferData(gl.ARRAY_BUFFER, renderModelGL.vertices, gl.STATIC_DRAW);




            const indexBuffer = gl.createBuffer();
            // bind the index buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


            // pass the triangle's indices to the index buffer
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, renderModelGL.indices, gl.STATIC_DRAW);

            //
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(renderModelGL.vertices), gl.STATIC_DRAW);


            // get the position attribute location
            const positionLocation = gl.getAttribLocation(shaderProgram, 'position');

            // enable the position attribute
            gl.enableVertexAttribArray(positionLocation);



            // tell the position attribute how to get data out of the position buffer
            // the position attribute is a vec3 (3 values per vertex) and then there are three
            // colors per vertex
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);



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
                for (let i = 0; i < renderModelGL.numTriangles!; i++) {
                    const index = i * 3;
                    gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, index * 2);
                }
                //gl.drawElements(gl.LINE_LOOP, renderModelGL.indices.length, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawElements(gl.TRIANGLES, renderModelGL.indices.length, gl.UNSIGNED_SHORT, 0);
            }


            gl.flush();
            gl.finish();

        }
    }, [shouldRender, renderModelGL, width, height, renderMode]);

    return <canvas ref={canvasRef} width={width} height={height} />;
}

export default CanvasGL;
