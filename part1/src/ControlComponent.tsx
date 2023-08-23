import { objectFileMap } from './ObjectFileMap';

/** two buttons for the first part of the assignment */


// define the ControlComponentProps interface
interface ControlComponentProps {

    // the current object and mode
    renderObject: string;
    renderMode: string;

    // the callback functions to update the object and mode
    updateRenderObject: (newObject: string, newFile: string) => void;
    updateRenderMode: (newMode: string) => void;
}



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


/**
 * 
 * @param string[]
 * 
 * @returns HTML component with as many buttons as there are strings in the array
 */
function makeObjectButtons(value: string, callback: (model: string, file: string) => void) {
    const strings = Array.from(objectFileMap.keys());
    return (
        <div>
            {strings.map((string) => (
                <button
                    key={string}
                    onClick={() => callback(string, objectFileMap.get(string) as string)}
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
// define the ControlComponent
function ControlComponent({ renderObject, renderMode, updateRenderObject, updateRenderMode }: ControlComponentProps) {

    // make a panel with two rows of buttons.
    // the first row has two buttons, one for the triangle and one for the square
    // the second row has one button for solid and one button for wireframe
    // return the html component that contains the buttons


    return (
        <div>
            {makeObjectButtons(renderObject, updateRenderObject)}
            {makeModeButtons(["solid", "wireframe"], renderMode, updateRenderMode)}
        </div>


    );
}

// export the ControlComponent
export default ControlComponent;