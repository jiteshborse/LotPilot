import React from 'react';
import { ASSET_CLASSES } from '../../data/asset-classes';
import { AssetClass } from '../../lib/calculations/types';
import {
  DollarSign,
  Sparkles,
  Flame,
  Coins,
  Zap,
  BarChart3,
  TrendingUp,
  Building2,
  Landmark,
  Layers,
  Sliders,
  Settings,
} from 'lucide-react';

interface AssetClassSelectorProps {
  selectedClass: AssetClass;
  onSelect: (assetClass: AssetClass) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  DollarSign: <DollarSign className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
  Flame: <Flame className="w-3.5 h-3.5" />,
  Coins: <Coins className="w-3.5 h-3.5" />,
  Zap: <Zap className="w-3.5 h-3.5" />,
  BarChart3: <BarChart3 className="w-3.5 h-3.5" />,
  TrendingUp: <TrendingUp className="w-3.5 h-3.5" />,
  Building2: <Building2 className="w-3.5 h-3.5" />,
  Landmark: <Landmark className="w-3.5 h-3.5" />,
  Layers: <Layers className="w-3.5 h-3.5" />,
  Sliders: <Sliders className="w-3.5 h-3.5" />,
  Settings: <Settings className="w-3.5 h-3.5" />,
};

export const AssetClassSelector: React.FC<AssetClassSelectorProps> = ({
  selectedClass,
  onSelect,
}) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          1. Select Asset Class
        </label>
        <span className="text-[11px] text-slate-500">
          Specialized calculation rules applied
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
        {ASSET_CLASSES.map((ac) => {
          const isSelected = selectedClass === ac.id;
          return (
            <button
              key={ac.id}
              type="button"
              onClick={() => onSelect(ac.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {ICON_MAP[ac.icon] || <DollarSign className="w-3.5 h-3.5" />}
              <span>{ac.shortName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
