import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ExecutorsPage from './ExecutorsPage';
import { dataApi } from '../api/services';
import { authApi } from '../api/auth';

// Mock the APIs
vi.mock('../api/services', () => ({
  dataApi: {
    getClients: vi.fn(),
    getExecutors: vi.fn(),
    getOrders: vi.fn(),
    addClient: vi.fn(),
  }
}));

vi.mock('../api/auth', () => ({
  authApi: {
    getMe: vi.fn(),
  }
}));

// Mock useMobile hook to simulate desktop environment
vi.mock('../hooks/useMobile', () => ({
  default: () => false
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('ExecutorsPage Component (Clients Table)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Default mock implementations
    (authApi.getMe as any).mockResolvedValue({ full_name: 'Test User' });
    (dataApi.getClients as any).mockResolvedValue([]);
    (dataApi.getExecutors as any).mockResolvedValue([]);
    (dataApi.getOrders as any).mockResolvedValue([]);
  });

  it('adds a new client successfully and displays it in the table', async () => {
    const newClientBackendResponse = {
      id: 123,
      first_name: 'Test',
      last_name: 'Client',
      email: 'test@example.com',
      phone: '1234567890',
      notes: ''
    };
    (dataApi.addClient as any).mockResolvedValueOnce(newClientBackendResponse);

    render(<ExecutorsPage />);

    // Wait for initial fetch
    await waitFor(() => {
      expect(dataApi.getClients).toHaveBeenCalled();
    });

    // Switch to clients tab (default is executors, but clicking 'nav.clients' switches it)
    fireEvent.click(screen.getByText('nav.clients'));

    // Wait for the Clients title to appear
    await waitFor(() => {
      expect(screen.getByText('clients.title')).toBeInTheDocument();
    });

    // Click "Add client" button
    const addButton = screen.getByRole('button', { name: /clients.addButton/i });
    fireEvent.click(addButton);

    // Modal should appear
    await waitFor(() => {
      expect(screen.getByLabelText(/nameLabel/i)).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/nameLabel/i), { target: { value: 'Test Client' } });
    fireEvent.change(screen.getByLabelText(/contactsLabel/i), { target: { value: 'test@example.com' } });

    // Submit
    const saveButton = screen.getByRole('button', { name: 'addClient' });
    fireEvent.click(saveButton);

    // Verify API called
    await waitFor(() => {
      expect(dataApi.addClient).toHaveBeenCalledWith({
        name: 'Test Client',
        contacts: 'test@example.com',
        comments: ''
      });
    });

    // Verify the newly constructed client name 'Test Client' appears in the document
    await waitFor(() => {
      expect(screen.getByText('Test Client')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });
});
