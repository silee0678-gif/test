import React from 'react';
import type { Crosswalk } from '../types';
import { useSignalTimer } from '../hooks/useSignalTimer';
import { WalkIcon, DontWalkIcon } from './icons';

interface TimerDisplayProps {
  crosswalk: Crosswalk;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ crosswalk }) => {
  const { secondsUntilNextGreen, isCurrentlyGreen, greenTimeLeft, nextGreenTime } = useSignalTimer(crosswalk);

  const indicatorColor = isCurrentlyGreen ? 'bg-green-500' : 'bg-red-500';
  const indicatorText = isCurrentlyGreen ? '건너세요' : '기다리세요';

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 flex flex-col items-center relative transition-all duration-300">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${indicatorColor}`}>
        {isCurrentlyGreen ? (
          <WalkIcon className="w-16 h-16 text-white" />
        ) : (
          <DontWalkIcon className="w-16 h-16 text-white" />
        )}
      </div>

      <h2 className={`text-2xl font-bold mb-2 ${isCurrentlyGreen ? 'text-green-400' : 'text-red-400'}`}>{indicatorText}</h2>
      
      {isCurrentlyGreen ? (
        <p className="text-gray-300 text-lg">남은 시간: <span className="font-bold text-white">{greenTimeLeft}</span>초</p>
      ) : (
        <p className="text-gray-400 text-lg">다음 녹색불까지</p>
      )}
      
      {!isCurrentlyGreen && (
        <>
            <div className="text-8xl font-mono font-bold text-white my-2">
              {secondsUntilNextGreen}
            </div>
            <p className="text-gray-400 text-sm -mt-2 mb-2">
                (예상 시간: {nextGreenTime.toLocaleTimeString('ko-KR', { hour12: false })})
            </p>
        </>
      )}

      <div className="w-full h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
        <div className={`h-full ${indicatorColor} transition-all duration-1000 ease-linear`} style={{ width: isCurrentlyGreen ? `${(greenTimeLeft / crosswalk.pedestrianGreenSeconds) * 100}%` : `${( (crosswalk.pedestrianRedSeconds - secondsUntilNextGreen) / crosswalk.pedestrianRedSeconds) * 100}%`}}></div>
      </div>
    </div>
  );
};

export default TimerDisplay;