import React, { useState, useRef } from 'react';
import Camera from './Camera';

import './ControlComponent.css';

/** two buttons for the first part of the assignment */


// define the ControlComponentProps interface
interface CameraControlComponentProps {

    updateCamera: (newCamera: Camera) => void;

}

interface ButtonWithHoldProps {
    title: string;
    onTick: (delta: number) => void;
    delta: number
    holdInterval?: number;
}


function ButtonWithHold({ title, onTick, delta, holdInterval = 10 }: ButtonWithHoldProps) {
    const [count, setCount] = useState(0);
    const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
    const handleMouseDownRef = useRef<() => void>(() => { });

    function command() {
        setCount(count + 1);
        console.log("count: " + count);
        onTick(delta);
    }

    function handleMouseDown() {
        command();
        handleMouseDownRef.current = () => {
            handleMouseDown();
        };
        const timeout = setTimeout(handleMouseDownRef.current, holdInterval);
        setHoldTimer(timeout);
    }

    function handleMouseUp() {
        console.log('Mouse Up')
        clearTimeout(holdTimer as NodeJS.Timeout);
        setHoldTimer(null);
        handleMouseDownRef.current = () => { };
        onTick(0); // force an update
    }


    return (
        <button onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>{title}</button>
    );
}


function CameraControlComponent({ updateCamera }: CameraControlComponentProps) {

    const [camera, setCamera] = useState(new Camera());
    const [cameraDistance, setCameraDistance] = useState(1);


    function moveCameraForward(delta: number) {
        camera.moveForward(delta);
        updateCamera(camera);
    }

    function rollCamera(delta: number) {
        camera.rollCamera(delta);
        updateCamera(camera);
        console.log("rollCamera")
    }




    function makeCameraSliders() {
        return (
            <div>
                <p>Move Camera:</p>
                <ButtonWithHold title="Forward" onTick={moveCameraForward} delta={0.1} />
                <ButtonWithHold title="Backward" onTick={moveCameraForward} delta={-0.1} />
                <p>Roll Cammera</p>

                <ButtonWithHold title="Roll Right" onTick={rollCamera} delta={0.1} />
                <ButtonWithHold title="Roll Left" onTick={rollCamera} delta={-0.1} />

            </div>
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