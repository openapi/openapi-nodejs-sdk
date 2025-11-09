const { OauthClient } = require('../dist/index.js');

async function main() {
    try {
        // Initialize the OAuth client for test environment
        const oauthClient = new OauthClient('your_username', 'your_api_key', true);

        // Create a token for a list of scopes
        const scopes = [
            'GET:test.imprese.openapi.it/advance',
            'POST:test.postontarget.com/fields/country',
        ];
        const ttl = 3600; // 1 hour

        console.log('Creating token with scopes:', scopes);
        const result = await oauthClient.createToken(scopes, ttl);

        // Parse the response to get the token
        const response = JSON.parse(result);
        console.log('Generated token:', response.token);

        // Optional: Get all tokens for a specific scope
        const tokens = await oauthClient.getTokens('test.imprese.openapi.it');
        console.log('Existing tokens:', JSON.parse(tokens));

        // Optional: Delete the token when done
        console.log('Deleting token...');
        const deleteResult = await oauthClient.deleteToken(response.token);
        console.log('Delete result:', deleteResult);

        console.log('Token generation example completed successfully!');
    } catch (error) {
        console.error('Error in token generation example:', error.message);
    }
}

main();