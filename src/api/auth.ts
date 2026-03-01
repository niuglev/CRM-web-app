import { apiClient } from './client';

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export const authApi = {
    login: async (email: string, password: string): Promise<TokenResponse> => {
        const formData = new URLSearchParams();
        formData.append('username', email); // backend expects 'username' for email
        formData.append('password', password);

        const response = await apiClient.post<TokenResponse>('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    },

    register: async (email: string, password: string, username: string, fullName: string) => {
        const response = await apiClient.post('/auth/register', {
            email,
            password,
            username,
            full_name: fullName
        });
        return response.data;
    },

    getMe: async () => {
        const response = await apiClient.get('/users/me');
        return response.data;
    }
};
