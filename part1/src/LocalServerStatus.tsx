import { useState, useEffect } from 'react';
import './ControlComponent.css'
import './LocalServerStatus.css'
import { ServerURLPrefix, GitHubPrefix, LocalServerPrefix, SelectLocalServer } from './ServerURL';


function statusDiv(status: string) {
    if (status === 'online') {
        return (<td className="rightAlign"><div className="ok">{status}</div></td>)
    } else {
        return (<td className="rightAlign"><div className="warning">WARNING:{status}:WARNING</div></td>)
    }
}
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
    const [localServer, setLocalServer] = useState("");

    // define a function to update the status
    function updateStatus() {
        if (ServerURLPrefix() === GitHubPrefix) {
            return;
        }

        // use the fetch API to request the status from the local server
        // the fetch API returns a promise, so we use the then method to
        // specify what to do when the promise is resolved
        fetch(ServerURLPrefix())
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

    function updateDataServer(useLocal: boolean) {

        SelectLocalServer(useLocal);

        setLocalServer(ServerURLPrefix());
    }
    useEffect(() => {
        setLocalServer(ServerURLPrefix());
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            updateStatus();
        }, 500);
    }, []);

    if (ServerURLPrefix() === GitHubPrefix) {
        return (
            <table className="tableWidth">
                <tbody>
                    <tr>
                        <td className="leftAlign">Using GitHub</td>
                        <td>
                            <button onClick={() => updateDataServer(true)}>Use Local Server</button>
                        </td>
                        <td className="rightAlign"><div className="ok">online</div></td>
                    </tr>
                </tbody>
            </table>
        )
    }
    // return the status
    //<div className="warning">WARNING SERVER: {status}</div>;
    return (
        <table className="tableWidth">
            <tbody>
                <tr>
                    <td className="leftAlign">Local server status</td>
                    <td>

                        <button onClick={() => updateDataServer(false)}>Use GitHub</button>
                    </td>
                    {statusDiv(status)}
                </tr>
            </tbody>
        </table>
    )
}

export default LocalServerStatus;

