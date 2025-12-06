'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ScenarioCard from '../../components/ScenarioCard';
import ScenarioModal from '../../components/ScenarioModal';
import { Scenario, PlanType } from '../../types/scenario';

const ScenariosPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [planType, setPlanType] = useState<PlanType>('private');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取场景数据
  const fetchScenarios = async (type: PlanType) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/adoption-plans/${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch scenarios');
      }
      
      const data = await response.json();
      return data.scenario_applications || [];
    } catch (error) {
      console.error('获取场景数据失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化页面
  useEffect(() => {
    const type = (searchParams.get('type') as PlanType) || 'private';
    setPlanType(type);

    fetchScenarios(type)
      .then(setScenarios)
      .catch((err) => {
        setError('加载场景数据失败，请刷新页面重试');
        console.error(err);
      });
  }, [searchParams]);

  // 打开详情弹窗
  const handleViewDetail = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setIsModalOpen(true);
  };

  // 关闭详情弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedScenario(null), 300); // 等待动画结束
  };

  // 页面标题
  const pageTitle = planType === 'private' ? '私人定制场景' : '企业领养场景';
  const pageSubtitle = planType === 'private' 
    ? '为您量身定制的茶园认养方案' 
    : '为企业打造的专属茶园领养方案';

  return (
    <>
      {/* 页面头部 */}
      <header className="page-header">
        <h1 className="page-title">{pageTitle}</h1>
        <p className="page-subtitle">{pageSubtitle}</p>
      </header>

      {/* 场景容器 */}
      <div className="scenarios-container">
        <div className="scenarios-grid">
          {isLoading && (
            <div className="loading">加载中...</div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          {!isLoading && !error && scenarios.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <div className="empty-state-text">暂无场景数据</div>
            </div>
          )}

          {!isLoading && !error && scenarios.length > 0 && scenarios.map((scenario, index) => (
            <ScenarioCard
              key={index}
              scenario={scenario}
              type={planType}
              index={index}
              onClick={() => handleViewDetail(scenario)}
            />
          ))}
        </div>
      </div>

      {/* 详情弹窗 */}
      <ScenarioModal
        scenario={selectedScenario}
        type={planType}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ScenariosPageContent;

