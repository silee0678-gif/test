import React, { useState, useMemo } from 'react';
import type { Crosswalk } from './types';
import { CROSSWALKS_DATA } from './constants';
import TimerDisplay from './components/TimerDisplay';
import AdminPanel from './components/AdminPanel';
import Map from './components/Map';
import { CogIcon } from './components/icons';
import { useSignalTimer } from './hooks/useSignalTimer';

const App: React.FC = () => {
  const [selectedCrosswalkId, setSelectedCrosswalkId] = useState<number>(CROSSWALKS_DATA[0].id);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const selectedCrosswalk = useMemo(() => {
    return CROSSWALKS_DATA.find(cw => cw.id === selectedCrosswalkId) || CROSSWALKS_DATA[0];
  }, [selectedCrosswalkId]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-white">대구교대 신호등 타이머</h1>
            <p className="text-sm text-gray-400">DNUE Signal Timer</p>
        </div>
        <button 
            onClick={() => setIsAdminPanelOpen(true)}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="Admin Panel"
        >
          <CogIcon className="w-6 h-6" />
        </button>
      </header>
      
      <main className="w-full max-w-md flex-grow">
        <div className="mb-8">
            <TimerDisplay key={selectedCrosswalk.id} crosswalk={selectedCrosswalk} />
        </div>
        
        <Map 
            crosswalks={CROSSWALKS_DATA}
            selectedCrosswalkId={selectedCrosswalkId}
            onSelectCrosswalk={setSelectedCrosswalkId}
        />

        <div>
          <h2 className="text-lg font-semibold mb-3 text-center text-gray-300">횡단보도 선택</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CROSSWALKS_DATA.map((cw) => (
              <CrosswalkCard
                key={cw.id}
                crosswalk={cw}
                isSelected={cw.id === selectedCrosswalkId}
                onClick={() => setSelectedCrosswalkId(cw.id)}
              />
            ))}
          </div>
        </div>
      </main>

      {isAdminPanelOpen && <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />}
      
      <footer className="w-full max-w-md text-center text-gray-500 text-xs mt-8">
        <p>본 타이머는 시뮬레이션 데이터 기반이며 실제 신호와 오차가 있을 수 있습니다.</p>
        <p>&copy; 2024. All rights reserved.</p>
      </footer>
    </div>
  );
};

interface CrosswalkCardProps {
  crosswalk: Crosswalk;
  isSelected: boolean;
  onClick: () => void;
}

const CrosswalkCard: React.FC<CrosswalkCardProps> = ({ crosswalk, isSelected, onClick }) => {
    const status = useSignalTimer(crosswalk);

    const statusColor = status.isCurrentlyGreen ? 'border-green-500' : 'border-red-500';
    const selectedClasses = isSelected ? 'bg-dnue-light-blue border-dnue-light-blue ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-400' : `bg-gray-800 border-gray-700 hover:border-dnue-light-blue`;

    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${selectedClasses}`}
        >
            <div className="flex justify-between items-start">
                <span className="font-bold">{crosswalk.name}</span>
                <div className={`w-3 h-3 rounded-full mt-1 ${status.isCurrentlyGreen ? 'bg-green-400 animate-pulse-green' : 'bg-red-400'}`}></div>
            </div>
            <div className="text-sm text-gray-400 mt-2">
                {status.isCurrentlyGreen 
                    ? <span className="text-green-400">건널 수 있음 ({status.greenTimeLeft}초 남음)</span> 
                    : <span className="text-red-400">{status.secondsUntilNextGreen}초 후 녹색불</span>
                }
            </div>
        </button>
    );
};


export default App;
