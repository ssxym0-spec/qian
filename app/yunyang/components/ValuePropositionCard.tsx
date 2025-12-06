'use client';

interface ValuePropositionCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function ValuePropositionCard({ icon, title, description }: ValuePropositionCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 md:p-8 border-2 border-stone-200 hover:border-stone-300 transition-all duration-300 flex flex-col items-center text-center">
      {/* 图标 */}
      <div className="text-4xl md:text-6xl mb-2 md:mb-4">
        {icon}
      </div>
      
      {/* 标题 */}
      <h3 className="text-base md:text-xl font-bold text-stone-800 mb-2 md:mb-3">
        {title}
      </h3>
      
      {/* 描述 */}
      <p className="text-stone-600 text-xs md:text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}

