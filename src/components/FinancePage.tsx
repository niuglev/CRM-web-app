import React from 'react';
import { useTranslation } from 'react-i18next';
import './FinancePage.scss';

const FinancePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="finance-page">
      <h2>{t('admin.finance.title')}</h2>
      <div className="finance-page__cards">
        <div className="finance-page__card">
          <span>{t('admin.finance.cards.revenue')}</span>
          <strong>0 ₽</strong>
        </div>
        <div className="finance-page__card">
          <span>{t('admin.finance.cards.managersPayout')}</span>
          <strong>0 ₽</strong>
        </div>
        <div className="finance-page__card">
          <span>{t('admin.finance.cards.executorsPayout')}</span>
          <strong>0 ₽</strong>
        </div>
      </div>
    </section>
  );
};

export default FinancePage;
