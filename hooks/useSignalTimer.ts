import { useState, useEffect } from 'react';
import type { Crosswalk } from '../types';

export interface SignalStatus {
  secondsUntilNextGreen: number;
  isCurrentlyGreen: boolean;
  greenTimeLeft: number;
  nextGreenTime: Date;
}

export const useSignalTimer = (crosswalk: Crosswalk | null) => {
  const [status, setStatus] = useState<SignalStatus>({
    secondsUntilNextGreen: 0,
    isCurrentlyGreen: false,
    greenTimeLeft: 0,
    nextGreenTime: new Date(),
  });

  useEffect(() => {
    if (!crosswalk) return;

    const calculateStatus = () => {
      const { pedestrianGreenSeconds, pedestrianRedSeconds, referenceTime } = crosswalk;
      const totalCycleSeconds = pedestrianGreenSeconds + pedestrianRedSeconds;
      const totalCycleMillis = totalCycleSeconds * 1000;

      const now = Date.now();
      const timeSinceReference = now - referenceTime;
      const currentCyclePositionMillis = timeSinceReference % totalCycleMillis;
      const currentCyclePositionSeconds = currentCyclePositionMillis / 1000;

      let secondsUntilNextGreen: number;
      let isCurrentlyGreen: boolean;
      let greenTimeLeft = 0;

      if (currentCyclePositionSeconds < pedestrianGreenSeconds) {
        // Currently in green phase
        isCurrentlyGreen = true;
        greenTimeLeft = pedestrianGreenSeconds - currentCyclePositionSeconds;
        // Time until the *start* of the next green cycle
        secondsUntilNextGreen = totalCycleSeconds - currentCyclePositionSeconds;
      } else {
        // Currently in red phase
        isCurrentlyGreen = false;
        // Time until this cycle's green starts
        secondsUntilNextGreen = totalCycleSeconds - currentCyclePositionSeconds;
      }
      
      const flooredSecondsUntilNextGreen = Math.floor(secondsUntilNextGreen);
      const nextGreenTime = new Date(now + (secondsUntilNextGreen * 1000));

      setStatus({
        secondsUntilNextGreen: flooredSecondsUntilNextGreen,
        isCurrentlyGreen,
        greenTimeLeft: Math.floor(greenTimeLeft),
        nextGreenTime,
      });
    };

    calculateStatus(); // Initial calculation
    const intervalId = setInterval(calculateStatus, 1000);

    return () => clearInterval(intervalId);
  }, [crosswalk]);

  return status;
};