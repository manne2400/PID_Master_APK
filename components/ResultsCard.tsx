import React from 'react';
import { PIDResult, TuningMethod } from '../types';

interface Props {
    results: PIDResult;
    method: TuningMethod;
}

const ResultsCard: React.FC<Props> = ({ results, method }) => {
    const format = (n: number) => n.toFixed(3);

    return (
        <div className="bg-primary text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-secondary opacity-10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10">
                <h2 className="text-lg font-medium opacity-90 mb-6 border-b border-white/20 pb-2">
                    Anbefalede Indstillinger ({method})
                </h2>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                        <div className="text-xs uppercase tracking-wider opacity-70 mb-1">P-Bånd</div>
                        <div className="text-2xl font-bold">{format(results.Kp)}</div>
                        <div className="text-[10px] opacity-60">Kp</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                        <div className="text-xs uppercase tracking-wider opacity-70 mb-1">I-Tid</div>
                        <div className="text-2xl font-bold">{format(results.Ti)}</div>
                        <div className="text-[10px] opacity-60">Sekunder</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                        <div className="text-xs uppercase tracking-wider opacity-70 mb-1">D-Tid</div>
                        <div className="text-2xl font-bold">{format(results.Td)}</div>
                        <div className="text-[10px] opacity-60">Sekunder</div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-xs opacity-70">
                    <span>Ki: {format(results.Ki || 0)}</span>
                    <span>Kd: {format(results.Kd || 0)}</span>
                </div>
            </div>
        </div>
    );
};

export default ResultsCard;