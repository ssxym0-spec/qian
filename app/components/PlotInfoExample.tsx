/**
 * PlotInfo 组件使用示例
 * 
 * 这个文件展示了如何使用 PlotInfo 组件
 * 以及如何传递正确的数据结构
 */

import PlotInfo from './PlotInfo';

export default function PlotInfoExample() {
  // 示例数据：模拟从后端接收的地块信息数据
  const samplePlotData = {
    info_list: [
      {
        label: "地块编号",
        value: "A001",
        icon: "tag"
      },
      {
        label: "位置",
        value: "云南省西双版纳",
        icon: "location"
      },
      {
        label: "茶树品种",
        value: "大叶种古树茶",
        icon: "leaf"
      },
      {
        label: "面积",
        value: "15亩",
        icon: "maximize"
      },
      {
        label: "海拔",
        value: "850米",
        icon: "mountain"
      },
      {
        label: "土壤类型",
        value: "红壤",
        icon: "layers"
      },
      {
        label: "日照时长",
        value: "6-8小时/天",
        icon: "sun"
      },
      {
        label: "年降雨量",
        value: "1200-1600mm",
        icon: "cloud-rain"
      },
      {
        label: "管理人",
        value: "李师傅",
        icon: "user"
      },
      {
        label: "未知图标测试",
        value: "这会显示默认图标",
        icon: "unknown-icon-name"
      }
    ]
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">PlotInfo 组件示例</h1>
      
      <div className="max-w-2xl mx-auto">
        {/* 使用 PlotInfo 组件 */}
        <PlotInfo plotData={samplePlotData} />
      </div>

      {/* 展示空数据情况 */}
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4">空数据示例：</h2>
        <PlotInfo plotData={null} />
      </div>
    </div>
  );
}
