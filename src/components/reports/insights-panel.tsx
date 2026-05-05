// components/reports/insights-panel.tsx
import { Lightbulb } from 'lucide-react';

interface Props {
  insights: string[];
}

export function InsightsPanel({ insights }: Props) {
  if (insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-l from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
      <div className="flex items-start gap-3">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-3">תובנות אוטומטיות</h3>
          <ul className="space-y-2">
            {insights.map((insight, i) => (
              <li 
                key={i}
                className="text-sm text-gray-800 bg-white/60 backdrop-blur-sm p-3 rounded-lg"
              >
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
