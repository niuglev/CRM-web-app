export interface Executor {
  id: string;
  name: string;
  contacts: string;
  comments: string;
}

export interface Client {
  id: string;
  name: string;
  contacts: string;
  comments: string;
}

export interface Order {
  id: string;
  date: string;
  time: string;
  customerName: string;
  customerId: string;
  description: string;
  address: string;
  executorName: string;
  executorId: string;
}

export interface User {
  id?: string;
  name: string;
  initials: string;
  avatarUrl?: string | null;
  isSuperuser?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isActive?: boolean;
}

