'use client';

interface Props {
  unit: 'metric' | 'imperial';
  onToggle: () => void;
}

const UnitToggle: React.FC<Props> = ({ unit, onToggle }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-5">
      <label htmlFor="switch-component-on" className="text-white-600 text-sm cursor-pointer">°C</label>
      
      <div className="relative inline-block w-11 h-5">
          <input 
            id="switch-component-on"
            data-testid="unit-toggle-checkbox"
            type="checkbox" 
            checked={unit === 'imperial'}
            onChange={onToggle}
            className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300" 
          />
          <label htmlFor="switch-component-on" className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer">
          </label>
      </div>
      
      <label htmlFor="switch-component-on" className="text-white-600 text-sm cursor-pointer">°F</label>
    </div>
  );
};

export default UnitToggle;
