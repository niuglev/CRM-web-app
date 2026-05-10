import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Переводы
const resources = {
    en: {
        translation: {
            searchPlaceholder: "Find a client or order...",
            searchAriaLabel: "Search clients and orders",
            openMenu: "Open menu",
            closeMenu: "Close menu",
            header_search_input: "Search clients or something else...",
            addClientTitle: "Add client",
            editClientTitle: "Edit client",
            nameLabel: "Name",
            namePlaceholder: "Enter client name",
            contactsLabel: "Contacts",
            contactsPlaceholder: "Phone, email, messenger etc.",
            commentsLabel: "Comments",
            commentsPlaceholder: "Additional information about the client",
            addClient: "Add client",
            saveChanges: "Save changes",
            contactsRequired: "Contacts field is required",
            contactsTooShort: "Contact is too short (minimum 3 characters)",
            invalidContact: "Please enter a valid contact (phone, email, messenger etc.)",
            addExecutorTitle: "Add executor",
            editExecutorTitle: "Edit executor",
            executorNameLabel: "Name",
            executorNamePlaceholder: "Enter executor name",
            executorContactsLabel: "Contacts",
            executorContactsPlaceholder: "Phone, email, messenger etc.",
            executorCommentsLabel: "Comments",
            executorCommentsPlaceholder: "Additional information about the executor",
            addExecutor: "Add executor",
            saveExecutorChanges: "Save changes",
            executorContactsRequired: "Contacts field is required",
            newOrderTitle: "New order",
            editOrderTitle: "Edit order",
            newClient: "New client",
            existingClient: "Existing client",
            client: "Client",
            selectClient: "Select client",
            clientName: "Client name",
            clientNamePlaceholder: "Enter client name",
            clientContacts: "Client contacts",
            clientContactsPlaceholder: "Phone or email",
            newExecutor: "New executor",
            existingExecutor: "Existing executor",
            executor: "Executor",
            selectExecutor: "Select executor",
            executorName: "Executor name",
            executorNamePlaceholderOptional: "Executor name (optional)",
            executorContacts: "Executor contacts",
            executorContactsPlaceholderOptional: "Phone or email (optional)",
            address: "Address",
            addressPlaceholder: "Address",
            date: "Date",
            time: "Time",
            orderDescription: "Order description",
            orderDescriptionPlaceholder: "Enter order description",
            addOrder: "Add order",
            saveOrderChanges: "Save changes",
            unassigned: "Unassigned",
            nav: {
                clients: "Clients",
                executors: "Executors",
                orders: "Orders",
                statistics: "Statistics",
                settings: "Settings",
                adminUsers: "User Management",
                tableSettings: "Table Settings",
                finance: "Finance"
            },
            admin: {
                userFallback: "User",
                logs: {
                    fetchUsersFailed: "Failed to fetch users for admin view"
                },
                userManagement: {
                    title: "User Management",
                    subtitleAll: "Managers and executors",
                    subtitleExecutors: "Executors",
                    emptyAll: "No personnel found",
                    filters: {
                        all: "All",
                        managers: "Managers",
                        executors: "Executors"
                    },
                    table: {
                        name: "NAME",
                        role: "ROLE",
                        email: "EMAIL",
                        emailOrContacts: "EMAIL / CONTACTS",
                        contacts: "CONTACTS",
                        rate: "COMMISSION RATE",
                        actions: "ACTIONS"
                    },
                    roles: {
                        manager: "Manager",
                        executor: "Executor"
                    },
                    form: {
                        name: "Name",
                        email: "Email",
                        contacts: "Contacts",
                        rate: "Commission rate, %"
                    },
                    managers: {
                        title: "Managers",
                        add: "Add Manager",
                        empty: "No managers yet",
                        addModalTitle: "Add Manager",
                        editModalTitle: "Edit Manager"
                    },
                    executors: {
                        title: "Executors",
                        add: "Add Executor",
                        empty: "No executors yet",
                        addModalTitle: "Add Executor",
                        editModalTitle: "Edit Executor"
                    }
                },
                tableSettings: {
                    title: "Table Settings",
                    resetButton: "Reset my settings",
                    options: {
                        showEmail: "Show Email in tables",
                        showContacts: "Show contacts in tables",
                        compactMode: "Compact table mode",
                        stickyHeader: "Sticky table header"
                    }
                },
                finance: {
                    title: "Finance",
                    cards: {
                        revenue: "Revenue this month",
                        managersPayout: "Manager payouts",
                        executorsPayout: "Executor payouts"
                    },
                    hint: "Administrative calculation section. Final formulas and backend integration come next."
                }
            },
            clients: {
                title: "Clients",
                searchPlaceholder: "Search clients...",
                addButton: "Client",
                corporate: "CORPORATE",
                private: "PRIVATE",
                table: {
                    nameId: "NAME ID",
                    contacts: "CONTACTS",
                    comments: "COMMENTS",
                    actions: "ACTIONS"
                },
                noClients: "No clients found",
                mobileSearchPlaceholder: "Search...",
                contactsLabel: "Contacts",
                commentsLabel: "Comments"
            },
            common: {
                edit: "Edit",
                view: "View",
                delete: "Delete",
                back: "Back",
                loading: "Loading..."
            },
            executors: {
                title: "Executors",
                searchPlaceholder: "Search executors...",
                addButton: "Add executor",
                corporate: "CORPORATE",
                private: "PRIVATE",
                table: {
                    name: "NAME",
                    contacts: "CONTACTS",
                    comments: "COMMENTS",
                    actions: "ACTIONS"
                },
                noExecutors: "No executors found",
                mobileSearchPlaceholder: "Search...",
                contactsLabel: "Contacts",
                commentsLabel: "Comments",
                idLabel: "ID:"
            },
            orders: {
                title: "Orders",
                searchPlaceholder: "Find a client or order...",
                addButton: "Order",
                table: {
                    orderNumber: "ORDER NUMBER",
                    dateTime: "DATE / TIME",
                    customer: "CUSTOMER",
                    description: "ORDER DESCRIPTION",
                    address: "ADDRESS",
                    executor: "EXECUTOR",
                    actions: "ACTIONS"
                },
                noOrders: "No orders found"
            },
            header: {
                profile: "Profile"
            },
            profile: {
                title: "Profile",
                name: "Name",
                defaultName: "User",
                uploadAvatar: "Upload avatar",
                notSpecified: "Not specified",
                changePassword: "Change password",
                logout: "Log out"
            },
            changePassword: {
                title: "Change password",
                old: "Current password",
                new: "New password",
                confirm: "Confirm",
                submit: "Save",
                passwordsDoNotMatch: "Passwords do not match",
                cancel: "Cancel"
            }
        }
    },
    ru: {
        translation: {
            searchPlaceholder: "Найдите клиента или заказ...",
            searchAriaLabel: "Поиск клиентов и заказов",
            openMenu: "Открыть меню",
            closeMenu: "Закрыть меню",
            header_search_input: "Поиск клиентов и заказов",
            addClientTitle: "Добавить клиента",
            editClientTitle: "Редактировать клиента",
            nameLabel: "Имя",
            namePlaceholder: "Введите имя клиента",
            contactsLabel: "Контакты",
            contactsPlaceholder: "Телефон, email, мессенджер и т.д.",
            commentsLabel: "Комментарии",
            commentsPlaceholder: "Дополнительная информация о клиенте",
            addClient: "Добавить клиента",
            saveChanges: "Сохранить изменения",
            contactsRequired: "Поле контактов обязательно для заполнения",
            contactsTooShort: "Контакт слишком короткий (минимум 3 символа)",
            invalidContact: "Введите корректный контакт (телефон, email, мессенджер и т.д.)",
            addExecutorTitle: "Добавить исполнителя",
            editExecutorTitle: "Редактировать исполнителя",
            executorNameLabel: "Имя",
            executorNamePlaceholder: "Введите имя исполнителя",
            executorContactsLabel: "Контакты",
            executorContactsPlaceholder: "Телефон, email, мессенджер и т.д.",
            executorCommentsLabel: "Комментарии",
            executorCommentsPlaceholder: "Дополнительная информация об исполнителе",
            addExecutor: "Добавить исполнителя",
            saveExecutorChanges: "Сохранить изменения",
            executorContactsRequired: "Поле контактов обязательно для заполнения",
            newOrderTitle: "Новый заказ",
            editOrderTitle: "Редактировать заказ",
            newClient: "Новый клиент",
            existingClient: "Существующий клиент",
            client: "Клиент",
            selectClient: "Выберите клиента",
            clientName: "Имя клиента",
            clientNamePlaceholder: "Введите имя клиента",
            clientContacts: "Контакты клиента",
            clientContactsPlaceholder: "Телефон или email",
            newExecutor: "Новый исполнитель",
            existingExecutor: "Существующий исполнитель",
            executor: "Исполнитель",
            selectExecutor: "Выберите исполнителя",
            executorName: "Имя исполнителя",
            executorNamePlaceholderOptional: "Имя исполнителя (необязательно)",
            executorContacts: "Контакты исполнителя",
            executorContactsPlaceholderOptional: "Телефон или email (необязательно)",
            address: "Адрес",
            addressPlaceholder: "Адрес",
            date: "Дата",
            time: "Время",
            orderDescription: "Описание заказа",
            orderDescriptionPlaceholder: "Введите описание заказа",
            addOrder: "Добавить заказ",
            saveOrderChanges: "Сохранить изменения",
            unassigned: "Не назначен",
            nav: {
                clients: "Клиенты",
                executors: "Исполнители",
                orders: "Заказы",
                statistics: "Статистика",
                settings: "Настройки",
                adminUsers: "Управление пользователями",
                tableSettings: "Настройки таблиц",
                finance: "Финансы"
            },
            admin: {
                userFallback: "Пользователь",
                logs: {
                    fetchUsersFailed: "Не удалось получить пользователей для админ-раздела"
                },
                userManagement: {
                    title: "Управление пользователями",
                    subtitleAll: "Менеджеры и исполнители",
                    subtitleExecutors: "Исполнители",
                    emptyAll: "Персонал не найден",
                    filters: {
                        all: "Все",
                        managers: "Менеджеры",
                        executors: "Исполнители"
                    },
                    table: {
                        name: "ИМЯ",
                        role: "РОЛЬ",
                        email: "EMAIL",
                        emailOrContacts: "EMAIL / КОНТАКТЫ",
                        contacts: "КОНТАКТЫ",
                        rate: "ПРОЦЕНТНАЯ СТАВКА",
                        actions: "ДЕЙСТВИЯ"
                    },
                    roles: {
                        manager: "Менеджер",
                        executor: "Исполнитель"
                    },
                    form: {
                        name: "Имя",
                        email: "Email",
                        contacts: "Контакты",
                        rate: "Процентная ставка, %"
                    },
                    managers: {
                        title: "Менеджеры",
                        add: "Добавить менеджера",
                        empty: "Менеджеры пока не добавлены",
                        addModalTitle: "Добавить менеджера",
                        editModalTitle: "Редактировать менеджера"
                    },
                    executors: {
                        title: "Исполнители",
                        add: "Добавить исполнителя",
                        empty: "Исполнители пока не добавлены",
                        addModalTitle: "Добавить исполнителя",
                        editModalTitle: "Редактировать исполнителя"
                    }
                },
                tableSettings: {
                    title: "Настройки таблиц",
                    resetButton: "Сбросить мои настройки",
                    options: {
                        showEmail: "Показывать Email в таблицах",
                        showContacts: "Показывать контакты в таблицах",
                        compactMode: "Компактный режим таблиц",
                        stickyHeader: "Фиксировать заголовок таблиц"
                    }
                },
                finance: {
                    title: "Финансы",
                    cards: {
                        revenue: "Доход за месяц",
                        managersPayout: "Выплаты менеджерам",
                        executorsPayout: "Выплаты исполнителям"
                    },
                    hint: "Раздел для административных расчетов. Финальные формулы и интеграция с бэком подключаются следующим этапом."
                }
            },
            clients: {
                title: "Клиенты",
                searchPlaceholder: "Поиск клиентов...",
                addButton: "Клиент",
                corporate: "КОРПОРАТИВНЫЙ",
                private: "ЧАСТНЫЙ",
                table: {
                    nameId: "ИМЯ ID",
                    contacts: "КОНТАКТЫ",
                    comments: "КОММЕНТАРИИ",
                    actions: "ДЕЙСТВИЯ"
                },
                noClients: "Клиенты не найдены",
                mobileSearchPlaceholder: "Поиск...",
                contactsLabel: "Контакты",
                commentsLabel: "Комментарии"
            },
            common: {
                edit: "Редактировать",
                view: "Просмотр",
                delete: "Удалить",
                back: "Назад",
                loading: "Загрузка..."
            },
            executors: {
                title: "Исполнители",
                searchPlaceholder: "Поиск исполнителей...",
                addButton: "Добавить исполнителя",
                corporate: "КОРПОРАТИВНЫЙ",
                private: "ЧАСТНЫЙ",
                table: {
                    name: "ИМЯ",
                    contacts: "КОНТАКТЫ",
                    comments: "КОММЕНТАРИИ",
                    actions: "ДЕЙСТВИЯ"
                },
                noExecutors: "Исполнители не найдены",
                mobileSearchPlaceholder: "Поиск...",
                contactsLabel: "Контакты",
                commentsLabel: "Комментарии",
                idLabel: "ID:"
            },
            orders: {
                title: "Заказы",
                searchPlaceholder: "Найдите клиента или заказ...",
                addButton: "Заказ",
                table: {
                    orderNumber: "Номер заказа",
                    dateTime: "Дата / Время",
                    customer: "Заказчик",
                    description: "Описание заказа",
                    address: "Адрес",
                    executor: "Исполнитель",
                    actions: "Действия"
                },
                noOrders: "Заказы не найдены"
            },
            header: {
                profile: "Профиль"
            },
            profile: {
                title: "Профиль",
                name: "Имя",
                defaultName: "Пользователь",
                uploadAvatar: "Загрузить аватар",
                notSpecified: "Не указано",
                changePassword: "Сменить пароль",
                logout: "Выйти"
            },
            changePassword: {
                title: "Смена пароля",
                old: "Текущий пароль",
                new: "Новый пароль",
                confirm: "Подтверждение",
                submit: "Сохранить",
                passwordsDoNotMatch: "Пароли не совпадают",
                cancel: "Отмена"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'ru',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;