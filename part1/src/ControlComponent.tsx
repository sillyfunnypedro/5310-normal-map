// import react and useState
import React, { useState } from 'react';

/** two buttons for the first part of the assignment */


// define the ControlComponentProps interface
interface ControlComponentProps {
    // the current demo
    demo: string;
    // the function to set the demo
    setDemo: (demo: string) => void;
}

// define the ControlComponent
function ControlComponent({ demo, setDemo }: ControlComponentProps) {
    // use the useState hook to create a state variable for the demo
    // and a function to set the demo
    // set the initial state to the first demo
    // const [demo, setDemo] = useState(buttons[0].name);

    // return the buttons
    const rectangle = "rectangle";
    const hexagon = "hexagon";
    return (
        <div>
            <button
                key={rectangle}
                onClick={() => setDemo(rectangle)}
                style={{
                    backgroundColor: demo === rectangle ? 'red' : 'white',
                }}
            >
                {rectangle}
            </button>

            <button
                key={hexagon}
                onClick={() => setDemo(hexagon)}
                style={{
                    backgroundColor: demo === hexagon ? 'red' : 'white',
                }}
            >
                {hexagon}
            </button>

        </div>
    );
}

// export the ControlComponent
export default ControlComponent;