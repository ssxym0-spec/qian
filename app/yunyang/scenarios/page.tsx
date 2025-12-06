'use client';

import React, { Suspense } from 'react';
import ScenariosPageContent from './components/ScenariosPageContent';
import './scenarios.css';

const ScenariosPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="scenarios-container">
          <div className="scenarios-grid">
            <div className="loading">加载中...</div>
          </div>
        </div>
      }
    >
      <ScenariosPageContent />
    </Suspense>
  );
};

export default ScenariosPage;

