import axios from 'axios';
import React, { useState } from 'react';

export function StatusDisplay(): JSX.Element {
    const [timeStamp, setTimeStamp] = useState<string | undefined>(undefined);

    function refreshStatus(): void {
        console.log("todo refresh status");
        setTimeStamp("not implemented");
        axios.get("http://localhost:3001/status", {headers: {token: "token-123"}}).then(
            response => {
                console.log(response);
                const data = response.data;
                setTimeStamp(data.time)
            }
        ).catch(error => console.error(error));
    }

    return (
        <div>
            <p>{timeStamp ?? "Click to load status timestamp"}</p>
            <button onClick={refreshStatus}>Fetch status</button>
        </div>
    )
}
