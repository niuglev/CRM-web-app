import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultTableViewSettings, mapSettingsToView, type TableViewSettings, type StoredTableSetting } from './tableViewSettings';
import './TableSettingsPage.scss';

type TableSetting = StoredTableSetting;
type TableSettingDefinition = {
  id: string;
  titleKey: string;
};

const STORAGE_KEY_PREFIX = 'crm_table_settings';

const defaultSettingsSchema: TableSettingDefinition[] = [
  { id: 'show_email', titleKey: 'admin.tableSettings.options.showEmail' },
  { id: 'show_contacts', titleKey: 'admin.tableSettings.options.showContacts' },
  { id: 'compact_mode', titleKey: 'admin.tableSettings.options.compactMode' },
  { id: 'sticky_header', titleKey: 'admin.tableSettings.options.stickyHeader' },
];

const defaultSettings: TableSetting[] = defaultSettingsSchema.map((setting) => ({
  ...setting,
  enabled:
    setting.id === 'show_email'
      ? defaultTableViewSettings.showEmail
      : setting.id === 'show_contacts'
        ? defaultTableViewSettings.showContacts
        : setting.id === 'compact_mode'
          ? defaultTableViewSettings.compactMode
          : defaultTableViewSettings.stickyHeader,
}));

interface TableSettingsPageProps {
  userId: string;
  onSettingsChange?: (settings: TableViewSettings) => void;
}

const cloneDefaultSettings = (): TableSetting[] => defaultSettings.map((setting) => ({ ...setting }));

const TableSettingsPage: React.FC<TableSettingsPageProps> = ({ userId, onSettingsChange }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<TableSetting[]>(cloneDefaultSettings());
  const storageKey = `${STORAGE_KEY_PREFIX}_${userId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setSettings(JSON.parse(saved));
    else setSettings(cloneDefaultSettings());
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
    onSettingsChange?.(mapSettingsToView(settings));
  }, [onSettingsChange, settings, storageKey]);

  return (
    <section className="table-settings-page">
      <h2>{t('admin.tableSettings.title')}</h2>
      <div className="table-settings-page__list">
        {settings.map((setting) => (
          <label key={setting.id} className="table-settings-page__item">
            <span>{t(setting.titleKey)}</span>
            <input
              type="checkbox"
              checked={setting.enabled}
              onChange={() =>
                setSettings((prev) =>
                  prev.map((s) => (s.id === setting.id ? { ...s, enabled: !s.enabled } : s))
                )
              }
            />
          </label>
        ))}
      </div>
      <div className="table-settings-page__actions">
        <button
          type="button"
          className="table-settings-page__reset-btn"
          onClick={() => setSettings(cloneDefaultSettings())}
        >
          {t('admin.tableSettings.resetButton')}
        </button>
      </div>
    </section>
  );
};

export default TableSettingsPage;
