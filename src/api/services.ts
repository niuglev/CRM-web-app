import { apiClient } from './client';
import type { Executor, Client, Order } from '../types';

export const dataApi = {
    // Executors (Users backend endpoint)
    getExecutors: async () => {
        // Only superusers can get all users in this CRM backend, based on users.py
        // Assuming the current logged-in user has rights, or we handle the 403 error.
        const response = await apiClient.get('/users?skip=0&limit=100');
        // Map backend user to frontend Executor type
        return response.data.map((user: any): Executor => ({
            id: user.id.toString(),
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Без имени',
            contacts: user.email,
            comments: user.phone || ''
        }));
    },

    // Clients (Contacts backend endpoint)
    getClients: async () => {
        const response = await apiClient.get('/contacts?skip=0&limit=100');
        // API returns { items: [...], total: ... }
        return response.data.items.map((contact: any): Client => ({
            id: contact.id.toString(),
            name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Без имени',
            contacts: contact.email || contact.phone || '',
            comments: contact.position || contact.comments || ''
        }));
    },

    getOrders: async () => {
        const response = await apiClient.get('/deals?skip=0&limit=100');
        return response.data.items.map((deal: any): Order => {
            const dealDate = deal.expected_close_date ? new Date(deal.expected_close_date) : new Date();

            // Extract address and customer name from description if available
            let parsedAddress = '';
            let parsedCustomerName = deal.contact_id ? `Контакт #${deal.contact_id}` : 'Неизвестно';
            if (deal.description) {
                const lines = deal.description.split('\n');
                for (const line of lines) {
                    if (line.startsWith('Адрес: ')) {
                        parsedAddress = line.replace('Адрес: ', '');
                    }
                    if (line.startsWith('Имя клиента: ') && !deal.contact_id) {
                        parsedCustomerName = line.replace('Имя клиента: ', '');
                    }
                }
            }

            return {
                id: deal.id.toString(),
                date: dealDate.toLocaleDateString(),
                time: deal.expected_close_date ? dealDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '12:00',
                customerName: parsedCustomerName,
                customerId: deal.contact_id?.toString() || '',
                description: deal.title || '',
                address: parsedAddress,
                executorName: `ID: ${deal.owner_id}`,
                executorId: deal.owner_id?.toString() || ''
            };
        });
    },

    // ADD Mocks binding for POST requests
    addClient: async (clientData: any) => {
        const response = await apiClient.post('/contacts', {
            first_name: clientData.name?.split(' ')[0] || clientData.name,
            last_name: clientData.name?.split(' ')[1] || '',
            email: clientData.contacts.includes('@') ? clientData.contacts : undefined,
            phone: !clientData.contacts.includes('@') ? clientData.contacts : undefined,
        });
        return response.data;
    },

    addOrder: async (orderData: any) => {
        let expected_close_date = null;
        if (orderData.date) {
            // orderData.date is "DD/MM/YYYY"
            const parts = orderData.date.split('/');
            if (parts.length === 3) {
                expected_close_date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T${orderData.time || '12:00'}:00`).toISOString();
            }
        }

        const response = await apiClient.post('/deals', {
            title: orderData.description || 'Новый заказ',
            status: 'Новая',
            contact_id: parseInt(orderData.customerId) || null,
            expected_close_date: expected_close_date,
            description: `Адрес: ${orderData.address || 'Не указан'}\nИмя клиента: ${orderData.customerName || 'Неизвестно'}`
        });
        return response.data;
    }
};
