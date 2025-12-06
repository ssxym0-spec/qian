'use client';

import React from 'react';
import { Scenario, PlanType } from '../types/scenario';

interface ScenarioCardProps {
  scenario: Scenario;
  type: PlanType;
  index: number;
  onClick: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, type, index, onClick }) => {
  return (
    <div
      className={`scenario-card scenario-card-${type}`}
      data-index={index}
      onClick={onClick}
    >
      <div className="scenario-card-inner">
        {/* 背景图片 */}
        {scenario.background_image && (
          <div
            className="scenario-bg"
            style={{ backgroundImage: `url('${scenario.background_image}')` }}
          />
        )}

        {/* 内容区域 */}
        <div className="scenario-content">
          {/* 图标和标题 */}
          <div className="scenario-header">
            <span className="scenario-icon">{scenario.icon || '🎯'}</span>
            <h3 className="scenario-title">{scenario.title || '未命名场景'}</h3>
          </div>

          {/* 痛点 */}
          {scenario.pain_point && (
            <div className="scenario-pain-point">
              <span className="label">💭 痛点</span>
              <p>{scenario.pain_point}</p>
            </div>
          )}

          {/* 方案 */}
          {scenario.solution && (
            <div className="scenario-solution">
              <span className="label">💡 方案</span>
              <p>{scenario.solution}</p>
            </div>
          )}

          {/* 核心价值 */}
          {scenario.core_values && scenario.core_values.length > 0 && (
            <div className="scenario-values">
              <span className="label">✨ 核心价值</span>
              <div className="values-grid">
                {scenario.core_values.map((value, idx) => (
                  <div key={idx} className="value-tag">
                    <span className="value-icon">{value.icon}</span>
                    <span className="value-title">{value.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 查看详情按钮 */}
          <button
            className="btn-view-detail"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            查看详情 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;

