import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ExecutorsTable from './ExecutorsTable';
import type { Executor } from '../types';
import './ExecutorsPage.scss';

const ExecutorsPage: React.FC = () => {
  // Моковые данные исполнителей
  const executors: Executor[] = [
    {
      id: '005',
      name: 'Имя Фамилия',
      contacts: '(29) 123-4567',
      comments: 'Компания 1. Связной Имя Фамилия - вредный чувак'
    },
    {
      id: '001',
      name: 'Имя Фамилия',
      contacts: 'wa(391) 123-4567',
      comments: 'Компания 1. Связной Имя Фамилия - вредный чувак'
    },
    {
      id: '002',
      name: 'Имя Фамилия',
      contacts: 'imya@mail.ru',
      comments: 'Компания 1. Связной Имя Фамилия - вредный чувак'
    },
    {
      id: '003',
      name: 'Имя Фамилия',
      contacts: 'lg.user01',
      comments: 'Компания 1. Связной Имя Фамилия - вредный чувак'
    },
    {
      id: '004',
      name: 'Имя Фамилия',
      contacts: '(29) 123-4567',
      comments: 'Компания 1. Связной Имя Фамилия - вредный чувак'
    }
  ];

  const handleEditExecutor = (executor: Executor) => {
    console.log('Редактировать исполнителя:', executor);
    // Здесь будет логика редактирования
  };

  const handleViewExecutor = (executor: Executor) => {
    console.log('Просмотр исполнителя:', executor);
    // Здесь будет логика просмотра
  };

  return (
    <div className="executors-page">
      <Header userName="Имя Фамилия" userInitials="ИФ" />
      <div className="executors-page__layout">
        <Sidebar activeItem="executors" />
        <main className="executors-page__main">
          <ExecutorsTable 
            executors={executors}
            onEdit={handleEditExecutor}
            onView={handleViewExecutor}
          />
        </main>
      </div>
      <div className="executors-page__decoration">
        <div className="executors-page__circles">
          <div className="executors-page__circle executors-page__circle--1"></div>
          <div className="executors-page__circle executors-page__circle--2"></div>
          <div className="executors-page__circle executors-page__circle--3"></div>
        </div>
      </div>
    </div>
  );
};

export default ExecutorsPage;
