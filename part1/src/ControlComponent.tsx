import { objectFileMap } from './ObjectFileMap';
import { useState } from 'react';
import './ControlComponent.css';

/** two buttons for the first part of the assignment */


// define the ControlComponentProps interface
interface ControlComponentProps {

    // the current object and mode
    renderObject: string;
    renderMode: string;

    // the callback functions to update the object and mode
    updateRenderObject: (newObject: string) => void;
    updateRenderMode: (newMode: string) => void;
    updateTranslate: (x: number, y: number) => void;
}


// define the ControlComponent
function ControlComponent({ renderObject, renderMode, updateRenderObject, updateRenderMode, updateTranslate }: ControlComponentProps) {

    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    /**
     * 
     * @param string[]
     * 
     * @returns HTML component with as many buttons as there are strings in the array
     */
    function makeModeButtons(strings: string[], value: string, callback: (arg: string) => void) {
        return (
            <div>
                {strings.map((string) => (
                    <button
                        key={string}
                        onClick={() => callback(string)}
                        style={{
                            backgroundColor: value === string ? 'red' : 'white',
                        }}
                    >
                        {string}
                    </button>
                ))}
            </div>
        );
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

    function makeTranslateSliders() {
        return (
            <div>
                x
                <input name="x" type="range" min="-50" max="50" value={translateX} className="slider" onChange={handleSliderChangeX} id="myRangeX"></input>
                <br />y
                <input name="x" type="range" min="-50" max="50" value={translateY} className="slider" onChange={handleSliderChangeY} id="myRangeY"></input>
            </div>
        );
    }

    /**
     * 
     * @param string[]
     * 
     * @returns HTML component with as many buttons as there are strings in the array
     */
    function makeObjectButtons(value: string, callback: (model: string) => void) {
        const strings = Array.from(objectFileMap.keys());
        return (
            <div>
                {strings.map((string) => (
                    <button
                        key={string}
                        onClick={() => callback(string)}
                        style={{
                            backgroundColor: value === string ? 'red' : 'white',
                        }}
                    >
                        {string}
                    </button>
                ))}
            </div>
        );
    }



    // make a panel with two rows of buttons.
    // the first row has two buttons, one for the triangle and one for the square
    // the second row has one button for solid and one button for wireframe
    // return the html component that contains the buttons


    return (
        <div>
            Select an object:
            {makeObjectButtons(renderObject, updateRenderObject)}
            Select a render mode:
            {makeModeButtons(["solid", "wireframe"], renderMode, updateRenderMode)}
            Move the object:
            {makeTranslateSliders()}
        </div>


    );
}

// export the ControlComponent
export default ControlComponent;