import React from 'react';
import { 
  Tag, 
  MapPin, 
  Leaf, 
  Maximize, 
  Mountain, 
  Layers, 
  Sun, 
  CloudRain, 
  User, 
  HelpCircle 
} from 'lucide-react';

// 定义图标映射类型
type IconMappingType = {
  [key: string]: {
    component: React.ComponentType<{ className?: string }>;
    color: string;
  };
};

// 创建图标-颜色映射字典（保留用于向后兼容旧数据）
const iconMapping: IconMappingType = {
  'tag': { component: Tag, color: 'text-gray-500' },
  'location': { component: MapPin, color: 'text-blue-500' },
  'leaf': { component: Leaf, color: 'text-teal-500' },
  'maximize': { component: Maximize, color: 'text-orange-500' },
  'mountain': { component: Mountain, color: 'text-green-600' },
  'layers': { component: Layers, color: 'text-amber-700' },
  'sun': { component: Sun, color: 'text-yellow-500' },
  'cloud-rain': { component: CloudRain, color: 'text-sky-500' },
  'user': { component: User, color: 'text-indigo-500' },
  'default': { component: HelpCircle, color: 'text-gray-400' } // 默认备用图标
};

// 定义数据类型
interface InfoItem {
  label: string;
  value: string;
  icon: string;
  sub_value?: string; // 添加副值字段
}

interface PlotData {
  info_list: InfoItem[];
}

interface PlotInfoProps {
  plotData: PlotData | null;
}

/**
 * 检查字符串是否是emoji
 * 通过检查是否不在旧的图标名称映射中来判断
 */
function isEmoji(icon: string): boolean {
  // 如果图标在旧的映射表中，说明是旧的图标名称
  // 否则认为是emoji或其他文本
  return !iconMapping[icon];
}

export default function PlotInfo({ plotData }: PlotInfoProps) {
  // 如果没有数据，显示提示信息
  if (!plotData || !plotData.info_list || plotData.info_list.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        暂无地块信息
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">地块信息</h3>
      <ul className="space-y-3">
        {plotData.info_list.map((item, index) => {
          // 判断是emoji还是旧的图标名称
          const isEmojiIcon = isEmoji(item.icon);

          return (
            <li 
              key={index} 
              className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="flex items-center">
                {/* 根据图标类型选择渲染方式 */}
                {isEmojiIcon ? (
                  // 直接显示emoji图标
                  <span className="text-2xl mr-3" style={{ minWidth: '24px' }}>
                    {item.icon}
                  </span>
                ) : (
                  // 使用旧的图标组件（向后兼容）
                  (() => {
                    const iconConfig = iconMapping[item.icon] || iconMapping['default'];
                    const IconComponent = iconConfig.component;
                    const colorClass = iconConfig.color;
                    return <IconComponent className={`w-5 h-5 mr-3 ${colorClass}`} />;
                  })()
                )}
                <span className="text-gray-700 font-medium">{item.label}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-900 font-semibold">{item.value}</span>
                {item.sub_value && (
                  <span className="text-gray-500 text-sm ml-1">({item.sub_value})</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
