import React from 'react';

interface Props {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    onChange: (val: number) => void;
}

const InputSlider: React.FC<Props> = ({ label, value, min, max, step, unit, onChange }) => {
    return (
        <div className="mb-5">
            <div className="flex justify-between items-end mb-2">
                <label className="text-sm font-medium text-gray-600">{label}</label>
                <span className="text-primary font-bold bg-blue-50 px-2 py-1 rounded-md min-w-[3rem] text-center text-sm">
                    {value} {unit}
                </span>
            </div>
            <input 
                type="range" 
                min={min} 
                max={max} 
                step={step} 
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
             <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

export default InputSlider;