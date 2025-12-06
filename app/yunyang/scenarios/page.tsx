import { Suspense } from 'react';
import ScenariosPageContent from './components/ScenariosPageContent';
import './scenarios.css';

export default function ScenariosPage() {
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
}

