import { useState, useEffect } from 'react';



/**
 * A component that displays the status of the local server.
 * 
 * This component uses the fetch API to request the status from the local server.
 * 
 * The fetch API is asynchronous, so we use the useEffect hook to call the fetch API
 */
const LocalServerStatus = () => {
    // use the useState hook to create a state variable for the status
    // and a function to set the status
    // set the initial state to 'offline'
    const [status, setStatus] = useState('offline');

    // define a function to update the status
    function updateStatus() {
        // use the fetch API to request the status from the local server
        // the fetch API returns a promise, so we use the then method to
        // specify what to do when the promise is resolved
        fetch('http://localhost:8080/')
            .then((data) => {
                if (data.status === 200) {
                    setStatus('online');
                }
            })
            .catch((error) => {
                // if there is an error, we set the status to 'offline'
                // and add the error message to the status
                setStatus('offline');
            });
    }


    useEffect(() => {
        const interval = setInterval(() => {
            updateStatus();
        }, 500);
    }, []);

    // return the status
    return <div>Local server status: {status}</div>;
}

export default LocalServerStatus;


// const LocalServerStatus = () => {
//     const [status, setStatus] = useState('offline');

//     function updateStatus() {
//         fetch('http://localhost:8080/status.json', { mode: 'no-cors' })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log(data);
//                 setStatus(data.status);
//             })
//             .catch((error) => {
//                 setStatus('offline' + error);
//             });
//     }

//     useEffect(() => {
//         const interval = setInterval(() => {
//             updateStatus();
//             console.log("dkfdlfssf");
//         }, 500);
//         return () => clearInterval(interval);
//     }, []);




//     return <div>Local server status: {status}</div>;
// };

// export default LocalServerStatus;