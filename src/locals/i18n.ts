import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Переводы
const resources = {
    en: {
        translation: {
            searchPlaceholder: "Find a client or order...",
            searchAriaLabel: "Search clients and orders",
            notificationsWithCount: "Notifications ({{count}} new)",
            systemUpdated: "The system has been updated",
            openMenu: "Open menu",
            closeMenu: "Close menu",
            systemReload: "System Reload",
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
                settings: "Settings"
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
                back: "Back"
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
            notificationsWithCount: "Уведомления ({{count}} новых)",
            systemUpdated: "Система была обновлена",
            openMenu: "Открыть меню",
            closeMenu: "Закрыть меню",
            systemReload: "Система была обновлена",
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
                settings: "Настройки"
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
                back: "Назад"
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