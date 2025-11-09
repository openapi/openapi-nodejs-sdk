const { Client } = require('../dist/index.js');

async function main() {
    try {
        // Initialize the client with your access token
        const client = new Client('your_access_token');

        console.log('Making GET request with parameters...');
        
        // Make a GET request with parameters
        const params = {
            denominazione: 'altravia',
            provincia: 'RM',
            codice_ateco: '6201'
        };

        const getResult = await client.get(
            'https://test.imprese.openapi.it/advance',
            params
        );

        console.log('GET Response:', getResult);

        console.log('Making POST request with JSON payload...');

        // Make a POST request with JSON payload
        const payload = {
            limit: 10,
            query: {
                country_code: 'IT'
            }
        };

        const postResult = await client.post(
            'https://test.postontarget.com/fields/country',
            payload
        );

        console.log('POST Response:', postResult);

        console.log('Testing other HTTP methods...');

        // Test PUT request
        const putResult = await client.put(
            'https://test.api.example.com/update/1',
            { name: 'Updated Name' }
        );
        console.log('PUT Response:', putResult);

        // Test PATCH request
        const patchResult = await client.patch(
            'https://test.api.example.com/patch/1',
            { status: 'active' }
        );
        console.log('PATCH Response:', patchResult);

        // Test DELETE request
        const deleteResult = await client.delete('https://test.api.example.com/delete/1');
        console.log('DELETE Response:', deleteResult);

        // Test generic request method
        const genericResult = await client.request(
            'POST',
            'https://test.api.example.com/custom',
            { data: 'test' }
        );
        console.log('Generic Request Response:', genericResult);

        console.log('API calls example completed successfully!');
    } catch (error) {
        console.error('Error in API calls example:', error.message);
    }
}

main();