import { Suspense } from 'react';
import ScenariosPageContent from './components/ScenariosPageContent';
import './scenarios.css';

// 强制动态渲染，避免预渲染时的 Suspense 问题
export const dynamic = 'force-dynamic';

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

