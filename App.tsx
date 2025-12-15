import React, { useState, useCallback } from 'react';
import { Activity, Sliders, Cpu, Info, Save, ChevronRight, HelpCircle, AlertTriangle } from 'lucide-react';
import { TuningMethod, ProcessParams, PIDResult } from './types';
import { calculatePID, simulateStepResponse } from './services/pidMath';
import { getAIAdvice } from './services/geminiService';
import StepResponseChart from './components/StepResponseChart';
import ResultsCard from './components/ResultsCard';
import InputSlider from './components/InputSlider';

export default function App() {
  const [params, setParams] = useState<ProcessParams>({
    gain: 1.5,
    timeConstant: 10,
    deadTime: 2
  });
  
  const [method, setMethod] = useState<TuningMethod>(TuningMethod.CohenCoon);
  const [results, setResults] = useState<PIDResult | null>(null);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');
  
  // UI State
  const [showHelp, setShowHelp] = useState(false);
  
  // AI State
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  const handleCalculate = useCallback(async () => {
    // 1. Calculate Math
    const pid = calculatePID(params, method);
    setResults(pid);

    // 2. Run Simulation
    const simData = simulateStepResponse(params, pid);
    setSimulationData(simData);
    
    // 3. Move to results tab
    setActiveTab('results');

    // 4. Get AI Advice (Optional enhancement)
    setLoadingAi(true);
    setAiAdvice("");
    try {
        const advice = await getAIAdvice(params, pid, method);
        setAiAdvice(advice);
    } catch (e) {
        console.error("AI Error", e);
        setAiAdvice("Kunne ikke hente AI-rådgivning på nuværende tidspunkt.");
    } finally {
        setLoadingAi(false);
    }

  }, [params, method]);

  return (
    <div className="min-h-screen bg-surface text-dark pb-20 font-sans">
      {/* Header */}
      <header className="bg-primary text-white p-6 rounded-b-[2rem] shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PID Mester</h1>
            <p className="text-secondary text-sm opacity-90">CTS / BMS Tuner</p>
          </div>
          <Activity className="text-secondary w-8 h-8" />
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Navigation Tabs (Mobile Style) */}
        <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
          <button 
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'input' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Data Input
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'results' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Resultater
          </button>
        </div>

        {activeTab === 'input' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
                    <Sliders className="w-5 h-5" />
                    System Parametre
                  </h2>
                  <button 
                    onClick={() => setShowHelp(!showHelp)}
                    className={`p-2 rounded-full transition-colors ${showHelp ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-blue-100'}`}
                    aria-label="Hjælp til parametre"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
              </div>

              {/* Help Section */}
              {showHelp && (
                  <div className="bg-blue-50/80 p-5 rounded-2xl mb-6 text-sm border border-blue-100 animate-fadeIn overflow-hidden">
                      <h3 className="font-bold text-primary mb-3 text-base">Guide til CTS / BMS</h3>
                      
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-r-lg">
                        <div className="flex items-start gap-2">
                           <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                           <div>
                             <p className="text-yellow-800 font-bold text-xs">Kan du ikke slå regulatoren fra?</p>
                             <p className="text-yellow-700 text-[11px] leading-tight mt-1">
                               At sætte P,I,D til 0 stopper beregningen, men det er bedre at bruge <strong>Tvangsstyring / Override</strong> på selve udgangen (ventilen/spjældet). Lås den på en fast procent (f.eks. 40%).
                             </p>
                           </div>
                        </div>
                      </div>

                      <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">Sådan finder du tallene:</h4>
                      
                      <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-5 font-medium bg-white/50 p-3 rounded-lg border border-white/60 text-xs">
                          <li>Lås ventilen fast på f.eks. <strong>40%</strong> (Tvangsstyring).</li>
                          <li>Vent til temperaturen/trykket er helt stabilt (flad kurve).</li>
                          <li>Ændr tvangsstyringen til f.eks. <strong>50%</strong> (Et spring på 10%).</li>
                          <li>Aflæs kurven på din trend-log.</li>
                      </ol>

                      <div className="space-y-4 border-t border-blue-200/50 pt-2">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-primary shadow-sm text-xs shrink-0">Kp</span>
                                  <span className="font-bold text-gray-800">Procesforstærkning</span>
                              </div>
                              <div className="bg-white/60 p-2 rounded text-xs text-gray-600 ml-8">
                                  <p className="mb-1">Hvor mange grader flyttede temperaturen sig pr. % ventil?</p>
                                  <p className="italic text-gray-500 border-t border-gray-200 pt-1 mt-1">
                                      Eksempel: Ventilen åbnede 10% mere.<br/>
                                      Temperaturen steg 5 grader.<br/>
                                      Kp = 5 / 10 = <strong>0.5</strong>
                                  </p>
                              </div>
                          </div>

                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-primary shadow-sm text-xs shrink-0">θ</span>
                                  <span className="font-bold text-gray-800">Dødtid (Sekunder)</span>
                              </div>
                              <p className="text-gray-600 text-xs ml-8 leading-relaxed">
                                  Hvor mange sekunder gik der fra du ændrede ventilen på computeren, til du kunne se temperaturen begyndte at flytte sig på kurven?
                              </p>
                          </div>

                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-primary shadow-sm text-xs shrink-0">τ</span>
                                  <span className="font-bold text-gray-800">Tidskonstant (Sekunder)</span>
                              </div>
                              <p className="text-gray-600 text-xs ml-8 leading-relaxed">
                                  Hvor hurtigt reagerer føleren? Tiden fra den startede med at stige, til den nåede ca. 63% af slut-temperaturen.
                              </p>
                          </div>
                      </div>
                  </div>
              )}
              
              <InputSlider 
                label="Procesforstærkning (Kp)" 
                value={params.gain} 
                min={0.1} max={10} step={0.1}
                unit=""
                onChange={(v) => setParams(p => ({...p, gain: v}))} 
              />
              
              <InputSlider 
                label="Tidskonstant (τ)" 
                value={params.timeConstant} 
                min={1} max={300} step={1}
                unit="sek"
                onChange={(v) => setParams(p => ({...p, timeConstant: v}))} 
              />
              
              <InputSlider 
                label="Dødtid (θ)" 
                value={params.deadTime} 
                min={1} max={120} step={1}
                unit="sek"
                onChange={(v) => setParams(p => ({...p, deadTime: v}))} 
              />
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="flex items-center gap-2 text-lg font-bold mb-4 text-primary">
                <Cpu className="w-5 h-5" />
                Tuning Metode
              </h2>
              <div className="space-y-3">
                {[
                  { id: TuningMethod.CohenCoon, label: 'Cohen-Coon', desc: 'God til systemer med lang dødtid' },
                  { id: TuningMethod.ZieglerNichols, label: 'Ziegler-Nichols', desc: 'Aggressiv respons, standard metode' },
                  { id: TuningMethod.IMC, label: 'Lambda (IMC)', desc: 'Konservativ og robust (Anbefalet til CTS)' },
                ].map((m) => (
                  <div 
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${method === m.id ? 'border-primary bg-blue-50/50' : 'border-transparent bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${method === m.id ? 'text-primary' : 'text-gray-700'}`}>{m.label}</span>
                      {method === m.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-accent hover:bg-[#d68565] text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Beregn PID
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {activeTab === 'results' && results && (
          <div className="space-y-6 animate-fadeIn">
            
            <ResultsCard results={results} method={method} />

            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-700 mb-4 ml-2">Simuleret Step Response</h3>
               <div className="h-64 w-full">
                 <StepResponseChart data={simulationData} />
               </div>
               <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Setpunkt</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div> Procesværdi</div>
               </div>
            </div>

            {/* AI Advisor Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl shadow-sm border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                   <Info className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-indigo-900">AI Ekspert Analyse</h3>
              </div>
              
              {loadingAi ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                  <div className="h-4 bg-indigo-200 rounded w-full"></div>
                  <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="text-sm text-indigo-800 leading-relaxed whitespace-pre-line">
                  {aiAdvice || "Forbindelse til AI kunne ikke oprettes. Prøv igen senere."}
                </div>
              )}
            </div>
            
             <button 
              onClick={() => setActiveTab('input')}
              className="w-full bg-white text-gray-500 font-medium py-3 px-6 rounded-2xl border border-gray-200"
            >
              Juster Parametre
            </button>
          </div>
        )}
        
        {activeTab === 'results' && !results && (
          <div className="text-center py-20 text-gray-400">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Indtast data og tryk beregn</p>
          </div>
        )}

      </main>
    </div>
  );
}