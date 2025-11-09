const { OauthClient, Client } = require('../dist/index.js');

// Mock environment variables for testing
process.env.OPENAPI_USERNAME = process.env.OPENAPI_USERNAME || 'test_user';
process.env.API_KEY = process.env.API_KEY || 'test_api_key';
process.env.TEST_TOKEN = process.env.TEST_TOKEN || 'test_token';

describe('Minimal SDK Tests', () => {
    describe('OauthClient', () => {
        test('should create OauthClient instance', () => {
            const oauthClient = new OauthClient('username', 'apikey', true);
            expect(oauthClient).toBeInstanceOf(OauthClient);
        });

        test('should create OauthClient with production environment', () => {
            const oauthClient = new OauthClient('username', 'apikey', false);
            expect(oauthClient).toBeInstanceOf(OauthClient);
        });

        test('should have all required methods', () => {
            const oauthClient = new OauthClient('username', 'apikey', true);
            expect(typeof oauthClient.createToken).toBe('function');
            expect(typeof oauthClient.getTokens).toBe('function');
            expect(typeof oauthClient.deleteToken).toBe('function');
            expect(typeof oauthClient.getCounters).toBe('function');
            expect(typeof oauthClient.getScopes).toBe('function');
        });

        // Note: These tests would require actual API credentials to work
        // They are skipped by default but can be enabled for integration testing
        test.skip('should create token with scopes', async () => {
            const oauthClient = new OauthClient(
                process.env.OPENAPI_USERNAME, 
                process.env.API_KEY, 
                true
            );
            
            const scopes = ['GET:test.imprese.openapi.it/advance'];
            const result = await oauthClient.createToken(scopes, 3600);
            
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });

    describe('Client', () => {
        let client;

        beforeEach(() => {
            client = new Client('test_token');
        });

        test('should create Client instance', () => {
            expect(client).toBeInstanceOf(Client);
        });

        test('should have all HTTP method functions', () => {
            expect(typeof client.request).toBe('function');
            expect(typeof client.get).toBe('function');
            expect(typeof client.post).toBe('function');
            expect(typeof client.put).toBe('function');
            expect(typeof client.delete).toBe('function');
            expect(typeof client.patch).toBe('function');
        });

        // Mock axios for testing HTTP methods without making real requests
        test('should call request method correctly for GET', async () => {
            const mockRequest = jest.fn().mockResolvedValue({ data: { success: true } });
            client.client = { request: mockRequest };

            const result = await client.get('https://test.example.com/api', { param: 'value' });

            expect(mockRequest).toHaveBeenCalledWith({
                method: 'GET',
                url: 'https://test.example.com/api',
                params: { param: 'value' }
            });
            expect(result).toEqual({ success: true });
        });

        test('should call request method correctly for POST', async () => {
            const mockRequest = jest.fn().mockResolvedValue({ data: { id: 1 } });
            client.client = { request: mockRequest };

            const payload = { name: 'test' };
            const result = await client.post('https://test.example.com/api', payload);

            expect(mockRequest).toHaveBeenCalledWith({
                method: 'POST',
                url: 'https://test.example.com/api',
                data: payload
            });
            expect(result).toEqual({ id: 1 });
        });

        test('should call request method correctly for PUT', async () => {
            const mockRequest = jest.fn().mockResolvedValue({ data: { updated: true } });
            client.client = { request: mockRequest };

            const payload = { name: 'updated' };
            const result = await client.put('https://test.example.com/api/1', payload);

            expect(mockRequest).toHaveBeenCalledWith({
                method: 'PUT',
                url: 'https://test.example.com/api/1',
                data: payload
            });
            expect(result).toEqual({ updated: true });
        });

        test('should call request method correctly for DELETE', async () => {
            const mockRequest = jest.fn().mockResolvedValue({ data: { deleted: true } });
            client.client = { request: mockRequest };

            const result = await client.delete('https://test.example.com/api/1');

            expect(mockRequest).toHaveBeenCalledWith({
                method: 'DELETE',
                url: 'https://test.example.com/api/1'
            });
            expect(result).toEqual({ deleted: true });
        });

        test('should call request method correctly for PATCH', async () => {
            const mockRequest = jest.fn().mockResolvedValue({ data: { patched: true } });
            client.client = { request: mockRequest };

            const payload = { status: 'active' };
            const result = await client.patch('https://test.example.com/api/1', payload);

            expect(mockRequest).toHaveBeenCalledWith({
                method: 'PATCH',
                url: 'https://test.example.com/api/1',
                data: payload
            });
            expect(result).toEqual({ patched: true });
        });

        test('should call generic request method correctly', async () => {
            const mockRequest = jest.fn().mockResolvedValue({ data: { custom: true } });
            client.client = { request: mockRequest };

            const payload = { data: 'test' };
            const params = { filter: 'active' };
            const config = { timeout: 5000 };
            
            const result = await client.request('POST', 'https://test.example.com/custom', payload, params, config);

            expect(mockRequest).toHaveBeenCalledWith({
                method: 'POST',
                url: 'https://test.example.com/custom',
                data: payload,
                params: params,
                timeout: 5000
            });
            expect(result).toEqual({ custom: true });
        });
    });

    describe('Module exports', () => {
        test('should export OauthClient and Client classes', () => {
            const module = require('../dist/index.js');
            expect(module.OauthClient).toBe(OauthClient);
            expect(module.Client).toBe(Client);
        });

        test('should have default export', () => {
            const module = require('../dist/index.js');
            expect(module.default).toBeDefined();
            expect(module.default.OauthClient).toBe(OauthClient);
            expect(module.default.Client).toBe(Client);
        });
    });
});