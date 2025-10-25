export interface Executor {
  id: string;
  name: string;
  contacts: string;
  comments: string;
}

export interface User {
  name: string;
  initials: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isActive?: boolean;
}
