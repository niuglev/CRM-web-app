import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from './logger';

describe('Frontend Logger Utility', () => {
    const originalFetch = globalThis.fetch;
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Mock fetch
        fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ status: 'success' })
        });
        globalThis.fetch = fetchMock as unknown as typeof fetch;

        // Mock localStorage
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'access_token') return 'mock-token-123';
            return null;
        });

        // Mock console methods to avoid cluttering test output
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
        vi.restoreAllMocks();
    });

    it('should send POST request with correct payload for info logs', async () => {
        await logger.info('Test info message', { additional: 'data' });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, options] = fetchMock.mock.calls[0];

        expect(url).toContain('/frontend-logs');
        expect(options.method).toBe('POST');
        expect(options.keepalive).toBe(true);
        expect(options.headers['Authorization']).toBe('Bearer mock-token-123');
        expect(options.headers['Content-Type']).toBe('application/json');

        const body = JSON.parse(options.body);
        expect(body.level).toBe('info');
        expect(body.message).toBe('Test info message');
        expect(body.context).toEqual({ additional: 'data' });
        expect(body.url).toBeDefined();
        expect(body.userAgent).toBeDefined();
        expect(body.timestamp).toBeDefined();
    });

    it('should correctly format error logs', async () => {
        await logger.error('Test error message');

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [, options] = fetchMock.mock.calls[0];

        const body = JSON.parse(options.body);
        expect(body.level).toBe('error');
        expect(body.message).toBe('Test error message');
    });

    it('should not fail if fetch fails', async () => {
        fetchMock.mockRejectedValueOnce(new Error('Network error'));

        // This should not throw an exception that crashes the app
        await expect(logger.warn('Test network fail')).resolves.not.toThrow();

        // Should have logged to console.error that it failed
        expect(console.error).toHaveBeenCalledWith('Failed to send log to backend:', expect.any(Error));
    });
});
