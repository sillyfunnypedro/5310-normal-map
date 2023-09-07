import { objectFileMap } from './ObjectFileMap';
import React, { useState } from 'react';
import LocalServerStatus from './LocalServerStatus';
import './ControlComponent.css';

/** two buttons for the first part of the assignment */


// define the ControlComponentProps interface
interface ControlComponentProps {

    // the current object and mode
    renderObject: string;
    renderMode: string;
    projectionMode: string;

    // the callback functions to update the object and mode
    updateRenderObject: (newObject: string) => void;
    updateRenderMode: (newMode: string) => void;
    updateProjectionMode: (newMode: string) => void;
    updateTranslate: (x: number, y: number) => void;
    updateRotate: (x: number, y: number, z: number) => void;
}


// define the ControlComponent
function ControlComponent({ renderObject, renderMode, projectionMode, updateRenderObject, updateRenderMode, updateProjectionMode, updateTranslate, updateRotate }: ControlComponentProps) {

    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [rotateZ, setRotateZ] = useState(0);



    function handleSlideChangeRotX(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setRotateX(parseInt(value));
        updateRotate(rotateX, rotateY, rotateZ);
    }

    function handleSlideChangeRotY(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setRotateY(parseInt(value));
        updateRotate(rotateX, rotateY, rotateZ);
    }

    function handleSlideChangeRotZ(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setRotateZ(parseInt(value));
        updateRotate(rotateX, rotateY, rotateZ);
    }
    function handleSliderChangeX(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setTranslateX(parseInt(value));
        updateTranslate(translateX, translateY);
    }
    function handleSliderChangeY(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setTranslateY(parseInt(value));
        updateTranslate(translateX, translateY);
    }

    function resetAllSliders() {
        setTranslateX(0);
        setTranslateY(0);
        updateTranslate(0, 0);
        setRotateX(0);
        setRotateY(0);
        setRotateZ(0);
        updateRotate(0, 0, 0);
    }

    /**
     * 
     * @param string[]
     * 
     * @returns HTML component with as many buttons as there are strings in the array
     */
    function makeModeButtons(title: string, strings: string[], value: string, callback: (arg: string) => void) {
        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">
                                {title}
                            </th>
                            <th className="rightAlign">
                                {strings.map((string) => (
                                    <button
                                        key={string}
                                        onClick={() => callback(string)}
                                        style={{
                                            backgroundColor: value === string ? 'green' : 'gray',
                                        }}
                                    >
                                        {string}
                                    </button>
                                ))}
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }

    function makeTranslateSliders() {
        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">
                                Translate
                            </th>
                            <th className="rightAlign">
                                <label htmlFor="myRangeX">X:</label>
                                <input name="x" type="range" min="-50" max="50"
                                    value={translateX} className="slider"
                                    onChange={handleSliderChangeX} id="myRangeX"></input>
                                <br />
                                <label htmlFor="myRangeY">Y:</label>
                                <input name="x" type="range" min="-50" max="50"
                                    value={translateY} className="slider"
                                    onChange={handleSliderChangeY} id="myRangeY"></input>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }


    function makeRotationSliders() {
        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">Rotate</th>
                            <th className="rightAlign">
                                <label htmlFor="rotateX">X:</label>
                                <input name="rotz" type="range" min="0" max="360"
                                    value={rotateX} className="slider"
                                    onChange={handleSlideChangeRotX} id="rotateX"></input>
                                <br />
                                <label htmlFor="rotateY">Y:</label>
                                <input name="rotz" type="range" min="0" max="360"
                                    value={rotateY} className="slider"
                                    onChange={handleSlideChangeRotY} id="rotateY"></input>
                                <br />
                                <label htmlFor="rotateZ">Z:</label>
                                <input name="rotz" type="range" min="0" max="360"
                                    value={rotateZ} className="slider"
                                    onChange={handleSlideChangeRotZ} id="rotate"></input>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }
    /**
     * 
     * @param string[]
     * 
     * @returns HTML component with as many buttons as there are strings in the array
     */
    function makeObjectButtons(title: string, value: string, callback: (model: string) => void) {
        const strings = Array.from(objectFileMap.keys());
        let buttonCount = 0;
        // put three buttons on a row
        function makeRow() {
            buttonCount += 1;
            if (buttonCount % 7 === 0) {
                return <br />;
            }
        }

        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">{title}</th>
                            <th className="rightAlign">
                                {strings.map((string) => (
                                    <React.Fragment key={string}>
                                        <button
                                            key={string}
                                            onClick={() => callback(string)}
                                            style={{
                                                backgroundColor: value === string ? 'blue' : 'gray',
                                            }}
                                        >
                                            {string}
                                        </button>
                                        {makeRow()}
                                    </React.Fragment>

                                ))}

                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }

    function makeControlButtons() {
        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">
                                Control
                            </th>
                            <th className="rightAlign">
                                <button onClick={resetAllSliders}>Reset</button>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }


    // make a panel with two rows of buttons.
    // the first row has two buttons, one for the triangle and one for the square
    // the second row has one button for solid and one button for wireframe
    // return the html component that contains the buttons


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th className="leftAlign">
                            <hr className="lineWidth" />
                            <LocalServerStatus />
                            <hr className="lineWidth" />
                            {makeObjectButtons("Objects:", renderObject, updateRenderObject)}
                            <hr className="lineWidth" />

                            {makeModeButtons("Render mode:", ["solid", "wireframe"], renderMode, updateRenderMode)}
                            <hr className="lineWidth" />

                            {makeModeButtons("Projection mode:", ["perspective", "orthographic"], projectionMode, updateProjectionMode)}
                            <hr className="lineWidth" />
                        </th>
                        <th className="rightAlign">
                            <hr className="lineWidth" />
                            {makeTranslateSliders()}
                            <hr className="lineWidth" />
                            {makeRotationSliders()}
                            <hr className="lineWidth" />
                            {makeControlButtons()}
                            <hr className="lineWidth" />
                        </th>
                    </tr>

                </thead>
            </table>
        </div>


    );
}

// export the ControlComponent
export default ControlComponent;