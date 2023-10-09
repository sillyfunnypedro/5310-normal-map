import React, { useState, useRef } from 'react';
import Camera from './Camera';
import { VerticalJoystickSlider, HorizontalJoystickSlider, JoystickSlider } from './Joystick';


import './ControlComponent.css';

/** two buttons for the first part of the assignment */


// define the ControlComponentProps interface
interface CameraControlComponentProps {
    camera: Camera;
    updateCamera: (newCamera: Camera) => void;

}

interface ButtonWithHoldProps {
    title: string;
    onTick: (delta: number) => void;
    delta: number
    holdInterval?: number;
}




function CameraControlComponent({ camera, updateCamera }: CameraControlComponentProps) {


    const [cameraDistance, setCameraDistance] = useState(1);


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





    function makeCameraSliders() {
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
                            <button onClick={() => camera.changeFieldOfView(-1)}>Decrease</button>
                        </td>
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => camera.changeFieldOfView(delta)}
                                scale={50}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => camera.changeFieldOfView(1)}>Increase</button>

                        </td>
                    </tr>
                    <tr>
                        <td>
                            Reset
                        </td>

                        <td style={{ textAlign: 'right' }}>
                            <button onClick={() => camera.resetCamera()}>Reset</button>
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

                            <hr className="lineWidth" />
                            {makeCameraSliders()}
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