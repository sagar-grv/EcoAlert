
const axios = require('axios');
require('dotenv').config(); // Ensure dotenv is used to load the API key if run directly

const serverUrl = 'https://stitch.googleapis.com/mcp';
const apiKey = process.env.STITCH_API_KEY; // Removed exposed key AQ.Ab8RN6IDgHB275T60dbaXHWbeCP8p7Yn39kUkqXlc8tcupYuxQ

async function callStitch(method, params = {}) {
    try {
        const response = await axios.post(serverUrl, {
            jsonrpc: '2.0',
            method,
            params,
            id: Date.now()
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey
            }
        });

        if (response.data.error) {
            console.error('MCP Error:', response.data.error);
            return null;
        }
        return response.data.result;
    } catch (error) {
        console.error('Network Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
        return null;
    }
}

async function main() {
    const command = process.argv[2];
    const paramsStr = process.argv[3] || '{}';
    let params;
    try {
        params = JSON.parse(paramsStr);
    } catch (e) {
        console.error('Invalid JSON params:', paramsStr);
        process.exit(1);
    }

    if (!command) {
        console.log('Available Commands: list_tools, call_tool');
        return;
    }

    console.log(`Calling MCP method: ${command} with params:`, params);
    const result = await callStitch(command, params);
    if (result) {
        console.log('Result:');
        console.log(JSON.stringify(result, null, 2));
    } else {
        console.error('No result returned.');
        process.exit(1);
    }
}

main();
