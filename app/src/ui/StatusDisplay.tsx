import axios from 'axios';
import React, { useState } from 'react';
import { apiGet } from '../api/requests';
import {serverStatusEndpoint, ServerStatusResponse,} from 'busybody-core';

const end = serverStatusEndpoint;

export function StatusDisplay(): JSX.Element {
    const [timeStamp, setTimeStamp] = useState<string | undefined>(undefined);

    function refreshStatus(): void {
        apiGet(serverStatusEndpoint, {}).then(
            response => {
                console.log(response);
                setTimeStamp(response.time);
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
