import React, { useState } from 'react';
import Camera from './Camera';
import { HorizontalJoystickSlider } from './Joystick';


import './ControlComponent.css';




// define the ControlComponentProps interface
interface CameraControlComponentProps {
    camera: Camera;
    updateCamera: (newCamera: Camera) => void;

}



function CameraControlComponent({ camera, updateCamera }: CameraControlComponentProps) {


    const [projectionMode, setProjectionMode] = useState(camera.usePerspective ? 'perspective' : 'orthographic');
    const [renderMode, setRenderMode] = useState(camera.renderSolid ? 'solid' : 'wireframe');


    function moveCameraForward(delta: number) {
        camera.moveForward(delta);
        updateCamera(camera);
    }

    function rollCamera(delta: number) {
        camera.rollCamera(delta);
        updateCamera(camera);
    }

    function upDown(delta: number) {
        camera.lookUp(delta);
        updateCamera(camera);
    }

    function rightLeft(delta: number) {
        camera.lookRight(delta);
        updateCamera(camera);
    }

    function updateFieldOfView(delta: number) {
        camera.changeFieldOfView(delta);
        updateCamera(camera);
    }

    function updateProjectionMode(mode: string) {
        if (mode === 'perspective') {
            camera.setProjection(true);
        } else {
            camera.setProjection(false);
        }
        setProjectionMode(mode); // to update the button color
        updateCamera(camera);

    }

    function updateRenderMode(mode: string) {
        if (mode === 'solid') {
            camera.setRenderSolid(true);
        } else {
            camera.setRenderSolid(false);
        }
        setRenderMode(mode); // to update the button color
        updateCamera(camera);

    }

    function resetCamera() {
        camera.resetCamera();
        updateCamera(camera);
    }



    function makePerspectiveControls() {
        return (
            <tr>
                <td>
                    Projection mode
                </td>
                <td style={{ textAlign: 'right' }}>
                    <button
                        onClick={() => updateProjectionMode('perspective')}
                        style={{
                            backgroundColor: projectionMode === 'perspective' ? 'blue' : 'gray',
                        }}>perspective</button>
                </td>
                <td>
                    <button
                        onClick={() => updateProjectionMode('orthographic')}
                        style={{
                            backgroundColor: projectionMode === 'orthographic' ? 'blue' : 'gray',
                        }}>orthographic</button>
                </td>

            </tr>
        );
    }

    function makeRenderModeControls() {
        return (
            <tr>
                <td>
                    Render mode
                </td>
                <td style={{ textAlign: 'right' }}>
                    <button
                        onClick={() => updateRenderMode('solid')}
                        style={{
                            backgroundColor: renderMode === 'solid' ? 'blue' : 'gray',
                        }}>solid</button>
                </td>
                <td>
                    <button
                        onClick={() => updateRenderMode('wireframe')}
                        style={{
                            backgroundColor: renderMode === 'wireframe' ? 'blue' : 'gray',
                        }}>wireframe</button>
                </td>

            </tr>
        );
    }



    function makeCameraControls() {
        const sliderWidth = 300;
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            Move Camera
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            <button onClick={() => moveCameraForward(-.1)}>Backward </button>
                        </td>
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => moveCameraForward(delta)}
                                scale={2}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => moveCameraForward(.1)}>Forward</button>

                        </td>
                    </tr>

                    <tr>
                        <td>
                            Roll Camera
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            <button onClick={() => rollCamera(-1)}>Left</button>
                        </td>
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => rollCamera(delta)}
                                scale={25}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => rollCamera(1)}>Right</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Look
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            <button onClick={() => upDown(-1)}>Down</button>
                        </td>
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => upDown(delta)}
                                scale={15}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => upDown(1)}>Up</button>

                        </td>
                    </tr>
                    <tr>
                        <td >
                            Look
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            <button onClick={() => rightLeft(-1)}>Left</button>
                        </td>
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => rightLeft(delta)}
                                scale={50}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => rightLeft(1)}>Right</button>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            Field of View
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            <button onClick={() => updateFieldOfView(-1)}>Decrease</button>
                        </td>
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => updateFieldOfView(delta)}
                                scale={50}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => updateFieldOfView(1)}>Increase</button>

                        </td>
                    </tr>



                    {makePerspectiveControls()}
                    {makeRenderModeControls()}

                    <tr>
                        <td>
                            Reset
                        </td>

                        <td style={{ textAlign: 'right' }}>
                            <button onClick={resetCamera}>Reset</button>
                        </td>
                    </tr>

                </tbody>
            </table>
        );
    }


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th className="leftAlign">

                            <hr className="lineWidth" />
                            {makeCameraControls()}
                            <hr className="lineWidth" />

                        </th>


                    </tr>

                </thead>
            </table>
        </div>


    );
}

// export the ControlComponent
export default CameraControlComponent;