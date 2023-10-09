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
        console.log("moveCameraForward" + delta)
        updateCamera(camera);
    }

    function rollCamera(delta: number) {
        camera.rollCamera(delta);
        updateCamera(camera);
        console.log("rollCamera")
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
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => moveCameraForward(delta)}
                                scale={2}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => moveCameraForward(1)}>Move Forward</button>
                            <button onClick={() => moveCameraForward(-1)}>Move Backward</button>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            Roll Camera
                        </td>
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => rollCamera(delta)}
                                scale={25}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => rollCamera(1)}>Roll Right</button>
                            <button onClick={() => rollCamera(-1)}>Roll Left</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Look Up
                        </td>
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => upDown(delta)}
                                scale={15}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => upDown(1)}>Look Up</button>
                            <button onClick={() => upDown(-1)}>Look Down</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Look Right
                        </td>
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => rightLeft(delta)}
                                scale={50}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => rightLeft(1)}>Look Right</button>
                            <button onClick={() => rightLeft(-1)}>Look Left</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Field of View
                        </td>
                        <td>
                            <HorizontalJoystickSlider onDelta={(delta: number) => camera.changeFieldOfView(delta)}
                                scale={50}
                                width={sliderWidth} />
                        </td>
                        <td>
                            <button onClick={() => camera.changeFieldOfView(1)}>Increase</button>
                            <button onClick={() => camera.changeFieldOfView(-1)}>Decrease</button>
                        </td>
                    </tr>
                    <tr>
                        Reset
                    </tr>
                    <tr>
                        <td>
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