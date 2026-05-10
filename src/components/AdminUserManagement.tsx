import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';
import './AdminUserManagement.scss';

type Manager = {
  id: string;
  name: string;
  email: string;
  rate: number;
};

type ExecutorAdmin = {
  id: string;
  name: string;
  contacts: string;
  rate: number;
};

type PersonnelRole = 'manager' | 'executor';
type EditTarget = { type: PersonnelRole; id: string } | null;
type PersonnelFilter = 'all' | PersonnelRole;

type PersonnelRow = {
  id: string;
  role: PersonnelRole;
  name: string;
  contact: string;
  rate: number;
};

type BackendUser = {
  id: number;
  full_name?: string;
  username?: string;
  email?: string;
  user_metadata?: {
    commission_rate?: number;
  };
};

const MANAGERS_STORAGE_KEY = 'crm_admin_managers';
const EXECUTORS_STORAGE_KEY = 'crm_admin_executors';
const FALLBACK_EXECUTORS_STORAGE_KEY = 'crm_executors';

const emptyManager = { name: '', email: '', rate: 0 };
const emptyExecutor = { name: '', contacts: '', rate: 0 };

interface AdminUserManagementProps {
  isSuperuser: boolean;
  showEmail?: boolean;
  showContacts?: boolean;
  compactMode?: boolean;
  stickyHeader?: boolean;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({
  isSuperuser,
  showEmail = true,
  showContacts = true,
  compactMode = false,
  stickyHeader = true,
}) => {
  const { t } = useTranslation();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [executors, setExecutors] = useState<ExecutorAdmin[]>([]);
  const [managerForm, setManagerForm] = useState(emptyManager);
  const [executorForm, setExecutorForm] = useState(emptyExecutor);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalRole, setModalRole] = useState<PersonnelRole>('executor');
  const [activeFilter, setActiveFilter] = useState<PersonnelFilter>('all');

  useEffect(() => {
    const savedManagers = localStorage.getItem(MANAGERS_STORAGE_KEY);
    const savedExecutors = localStorage.getItem(EXECUTORS_STORAGE_KEY);
    if (savedManagers) setManagers(JSON.parse(savedManagers));
    if (savedExecutors) {
      setExecutors(JSON.parse(savedExecutors));
    } else {
      const fallbackExecutors = localStorage.getItem(FALLBACK_EXECUTORS_STORAGE_KEY);
      if (fallbackExecutors) {
        const parsed = JSON.parse(fallbackExecutors) as Array<{ id: string; name: string; contacts: string }>;
        setExecutors(parsed.map((item) => ({ ...item, rate: 0 })));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MANAGERS_STORAGE_KEY, JSON.stringify(managers));
  }, [managers]);

  useEffect(() => {
    localStorage.setItem(EXECUTORS_STORAGE_KEY, JSON.stringify(executors));
  }, [executors]);

  useEffect(() => {
    const fetchUsersForView = async () => {
      if (managers.length > 0) return;
      try {
        const response = await apiClient.get('/users?skip=0&limit=100');
        const users = response.data as BackendUser[];
        const mapped: Manager[] = users.map((u) => ({
          id: u.id.toString(),
          name: u.full_name || u.username || `${t('admin.userFallback')} #${u.id}`,
          email: u.email || '',
          rate: Number(u.user_metadata?.commission_rate || 0),
        }));
        setManagers(mapped);
      } catch (error) {
        console.warn(t('admin.logs.fetchUsersFailed'), error);
      }
    };
    fetchUsersForView();
  }, [managers.length, t]);

  const isEditingManager = useMemo(() => editTarget?.type === 'manager' && showModal, [editTarget, showModal]);
  const isEditingExecutor = useMemo(() => editTarget?.type === 'executor' && showModal, [editTarget, showModal]);

  const rows = useMemo<PersonnelRow[]>(
    () => [
      ...(isSuperuser
        ? managers.map((m) => ({
            id: m.id,
            role: 'manager' as const,
            name: m.name,
            contact: m.email,
            rate: m.rate,
          }))
        : []),
      ...executors.map((e) => ({
        id: e.id,
        role: 'executor' as const,
        name: e.name,
        contact: e.contacts,
        rate: e.rate,
      })),
    ],
    [executors, isSuperuser, managers]
  );

  const filteredRows = useMemo(() => {
    if (!isSuperuser || activeFilter === 'all') return rows;
    return rows.filter((row) => row.role === activeFilter);
  }, [activeFilter, isSuperuser, rows]);

  const showContactColumn = isSuperuser ? (showEmail || showContacts) : showContacts;

  const openAddModal = (role: PersonnelRole) => {
    setEditTarget(null);
    setModalRole(role);
    setManagerForm(emptyManager);
    setExecutorForm(emptyExecutor);
    setShowModal(true);
  };

  const openEditManagerModal = (manager: Manager) => {
    setEditTarget({ type: 'manager', id: manager.id });
    setModalRole('manager');
    setManagerForm({ name: manager.name, email: manager.email, rate: manager.rate });
    setShowModal(true);
  };

  const openEditExecutorModal = (executor: ExecutorAdmin) => {
    setEditTarget({ type: 'executor', id: executor.id });
    setModalRole('executor');
    setExecutorForm({ name: executor.name, contacts: executor.contacts, rate: executor.rate });
    setShowModal(true);
  };

  const saveManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingManager && editTarget?.type === 'manager') {
      setManagers((prev) =>
        prev.map((m) => (m.id === editTarget.id ? { ...m, ...managerForm, rate: Number(managerForm.rate) } : m))
      );
    } else {
      setManagers((prev) => [
        ...prev,
        { id: `manager-${Date.now()}`, ...managerForm, rate: Number(managerForm.rate) },
      ]);
    }
    setShowModal(false);
    setEditTarget(null);
    setManagerForm(emptyManager);
  };

  const saveExecutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingExecutor && editTarget?.type === 'executor') {
      setExecutors((prev) =>
        prev.map((ex) => (ex.id === editTarget.id ? { ...ex, ...executorForm, rate: Number(executorForm.rate) } : ex))
      );
    } else {
      setExecutors((prev) => [
        ...prev,
        { id: `executor-${Date.now()}`, ...executorForm, rate: Number(executorForm.rate) },
      ]);
    }
    setShowModal(false);
    setEditTarget(null);
    setExecutorForm(emptyExecutor);
  };

  return (
    <section className={`admin-users-page ${compactMode ? 'admin-users-page--compact' : ''} ${stickyHeader ? 'admin-users-page--sticky-header' : ''}`}>
      <div className="admin-users-page__header">
        <h2 className="admin-users-page__title">{t('admin.userManagement.title')}</h2>
      </div>

      <div className="admin-users-page__block">
        <div className="admin-users-page__block-header">
          <h3>{isSuperuser ? t('admin.userManagement.subtitleAll') : t('admin.userManagement.subtitleExecutors')}</h3>
          <div className="admin-users-page__header-actions">
            {isSuperuser && (
              <button type="button" onClick={() => openAddModal('manager')}>
                <FiPlus /> {t('admin.userManagement.managers.add')}
              </button>
            )}
            <button type="button" onClick={() => openAddModal('executor')}>
              <FiPlus /> {t('admin.userManagement.executors.add')}
            </button>
          </div>
        </div>
        {isSuperuser && (
          <div className="admin-users-page__filters">
            <button
              type="button"
              className={`admin-users-page__filter ${activeFilter === 'all' ? 'admin-users-page__filter--active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              {t('admin.userManagement.filters.all')}
            </button>
            <button
              type="button"
              className={`admin-users-page__filter ${activeFilter === 'manager' ? 'admin-users-page__filter--active' : ''}`}
              onClick={() => setActiveFilter('manager')}
            >
              {t('admin.userManagement.filters.managers')}
            </button>
            <button
              type="button"
              className={`admin-users-page__filter ${activeFilter === 'executor' ? 'admin-users-page__filter--active' : ''}`}
              onClick={() => setActiveFilter('executor')}
            >
              {t('admin.userManagement.filters.executors')}
            </button>
          </div>
        )}
        <table className="admin-users-page__table">
          <thead>
            <tr>
              <th>{t('admin.userManagement.table.name')}</th>
              {isSuperuser && <th>{t('admin.userManagement.table.role')}</th>}
              {showContactColumn && (
                <th>{isSuperuser ? t('admin.userManagement.table.emailOrContacts') : t('admin.userManagement.table.contacts')}</th>
              )}
              <th>{t('admin.userManagement.table.rate')}</th>
              <th>{t('admin.userManagement.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={isSuperuser ? (showContactColumn ? 5 : 4) : (showContactColumn ? 4 : 3)} className="admin-users-page__empty">
                  {isSuperuser ? t('admin.userManagement.emptyAll') : t('admin.userManagement.executors.empty')}
                </td>
              </tr>
            )}
            {filteredRows.map((row) => (
              <tr key={`${row.role}-${row.id}`}>
                <td>{row.name}</td>
                {isSuperuser && <td>{t(`admin.userManagement.roles.${row.role}`)}</td>}
                {showContactColumn && (
                  <td>
                    {row.role === 'manager' && !showEmail ? '—' : row.role === 'executor' && !showContacts ? '—' : row.contact}
                  </td>
                )}
                <td>{row.rate}%</td>
                <td className="admin-users-page__actions">
                  <button
                    onClick={() =>
                      row.role === 'manager'
                        ? openEditManagerModal({ id: row.id, name: row.name, email: row.contact, rate: row.rate })
                        : openEditExecutorModal({ id: row.id, name: row.name, contacts: row.contact, rate: row.rate })
                    }
                    title={t('common.edit')}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() =>
                      row.role === 'manager'
                        ? setManagers((prev) => prev.filter((m) => m.id !== row.id))
                        : setExecutors((prev) => prev.filter((e) => e.id !== row.id))
                    }
                    title={t('common.delete')}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-users-page__modal-backdrop">
          <div className="admin-users-page__modal">
            <h4>
              {modalRole === 'manager'
                ? isEditingManager
                  ? t('admin.userManagement.managers.editModalTitle')
                  : t('admin.userManagement.managers.addModalTitle')
                : isEditingExecutor
                  ? t('admin.userManagement.executors.editModalTitle')
                  : t('admin.userManagement.executors.addModalTitle')}
            </h4>
            {isSuperuser && !editTarget && (
              <select
                className="admin-users-page__role-select"
                value={modalRole}
                onChange={(e) => setModalRole(e.target.value as PersonnelRole)}
              >
                <option value="manager">{t('admin.userManagement.roles.manager')}</option>
                <option value="executor">{t('admin.userManagement.roles.executor')}</option>
              </select>
            )}

            {modalRole === 'manager' ? (
              <form onSubmit={saveManager}>
                <input
                  value={managerForm.name}
                  onChange={(e) => setManagerForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={t('admin.userManagement.form.name')}
                  required
                />
                <input
                  type="email"
                  value={managerForm.email}
                  onChange={(e) => setManagerForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder={t('admin.userManagement.form.email')}
                  required
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={managerForm.rate}
                  onChange={(e) => setManagerForm((prev) => ({ ...prev, rate: Number(e.target.value) }))}
                  placeholder={t('admin.userManagement.form.rate')}
                  required
                />
                <div className="admin-users-page__modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
                  <button type="submit">{t('common.save')}</button>
                </div>
              </form>
            ) : (
              <form onSubmit={saveExecutor}>
                <input
                  value={executorForm.name}
                  onChange={(e) => setExecutorForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={t('admin.userManagement.form.name')}
                  required
                />
                <input
                  value={executorForm.contacts}
                  onChange={(e) => setExecutorForm((prev) => ({ ...prev, contacts: e.target.value }))}
                  placeholder={t('admin.userManagement.form.contacts')}
                  required
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={executorForm.rate}
                  onChange={(e) => setExecutorForm((prev) => ({ ...prev, rate: Number(e.target.value) }))}
                  placeholder={t('admin.userManagement.form.rate')}
                  required
                />
                <div className="admin-users-page__modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
                  <button type="submit">{t('common.save')}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminUserManagement;
