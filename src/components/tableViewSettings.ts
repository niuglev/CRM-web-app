export interface TableViewSettings {
  showEmail: boolean;
  showContacts: boolean;
  compactMode: boolean;
  stickyHeader: boolean;
}

export type StoredTableSetting = {
  id: string;
  titleKey: string;
  enabled: boolean;
};

export const defaultTableViewSettings: TableViewSettings = {
  showEmail: true,
  showContacts: true,
  compactMode: false,
  stickyHeader: true,
};

export const mapSettingsToView = (settings: StoredTableSetting[]): TableViewSettings => ({
  showEmail: settings.find((s) => s.id === 'show_email')?.enabled ?? defaultTableViewSettings.showEmail,
  showContacts: settings.find((s) => s.id === 'show_contacts')?.enabled ?? defaultTableViewSettings.showContacts,
  compactMode: settings.find((s) => s.id === 'compact_mode')?.enabled ?? defaultTableViewSettings.compactMode,
  stickyHeader: settings.find((s) => s.id === 'sticky_header')?.enabled ?? defaultTableViewSettings.stickyHeader,
});
