import React, { useState } from 'react';
import Chatbot from '../components/Chatbot/Chatbot';
import DashboardSidebar from '../components/DashboardSidebar';
import { useTranslation } from 'react-i18next';

const ChatbotPage: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">{t('chatbot.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('chatbot.description')}
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-blue-200 dark:border-blue-900">
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage; 