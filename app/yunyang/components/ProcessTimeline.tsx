'use client';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ProcessTimelineProps {
  steps: Step[];
}

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6 md:space-y-8">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* 连接线 - 不在最后一个步骤显示，链接到图标中心 */}
            {index < steps.length - 1 && (
              <div className="absolute left-[23px] top-16 bottom-0 w-0.5 bg-stone-200 md:left-[31px]" />
            )}

            {/* 步骤卡片 */}
            <div className="flex gap-4 md:gap-6">
              {/* 图标 */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#C5A572] text-white flex items-center justify-center text-2xl md:text-3xl shadow-lg relative z-10">
                  {step.icon}
                </div>
              </div>

              {/* 内容 */}
              <div className="flex-1 pb-6">
                <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-2">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-stone-600 leading-relaxed text-sm md:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

