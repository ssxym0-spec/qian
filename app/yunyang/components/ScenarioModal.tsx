'use client';

import React, { useEffect } from 'react';
import { Scenario, PlanType } from '../types/scenario';

interface ScenarioModalProps {
  scenario: Scenario | null;
  type: PlanType;
  isOpen: boolean;
  onClose: () => void;
}

const ScenarioModal: React.FC<ScenarioModalProps> = ({ scenario, type, isOpen, onClose }) => {
  // 处理ESC键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!scenario) return null;

  const handleContactUs = () => {
    alert(`感谢您对"${scenario.title}"的关注！\n请联系我们了解更多详情...`);
    // TODO: 集成实际的联系方式或客服系统
  };

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`}>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content scenario-modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="scenario-detail-content">
          <div className={`scenario-detail scenario-detail-${type}`}>
            {/* 头部 */}
            <div className="detail-header">
              <div className="detail-icon">{scenario.icon || '🎯'}</div>
              <h2 className="detail-title">{scenario.title || '未命名场景'}</h2>
            </div>

            {/* 背景图片 */}
            {scenario.background_image && (
              <div className="detail-image">
                <img src={scenario.background_image} alt={scenario.title} />
              </div>
            )}

            {/* 痛点分析 */}
            {scenario.pain_point && (
              <div className="detail-section pain-point-section">
                <h3>💭 用户痛点</h3>
                <div className="pain-point-box">{scenario.pain_point}</div>
              </div>
            )}

            {/* 解决方案 */}
            {scenario.solution && (
              <div className="detail-section solution-section">
                <h3>💡 定制方案</h3>
                <div className="solution-box">{scenario.solution}</div>
              </div>
            )}

            {/* 核心价值 */}
            {scenario.core_values && scenario.core_values.length > 0 && (
              <div className="detail-section values-section">
                <h3>✨ 核心价值</h3>
                <div className="values-detail-grid">
                  {scenario.core_values.map((value, idx) => (
                    <div key={idx} className="value-detail-card">
                      <div className="value-detail-icon">{value.icon}</div>
                      <div className="value-detail-content">
                        <h4>{value.title}</h4>
                        {value.description && <p>{value.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 行动按钮 */}
            <div className="detail-actions">
              <button className="btn-action btn-primary" onClick={handleContactUs}>
                立即咨询
              </button>
              <button className="btn-action btn-secondary" onClick={onClose}>
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioModal;

