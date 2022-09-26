import { CountdownCircleTimer } from 'react-countdown-circle-timer';

interface TimerProps {
  duration: number;
  onTimeEnd: () => void;
}

export function Timer({ duration, onTimeEnd }: TimerProps) {
  return (
    <div>
      <CountdownCircleTimer
        duration={duration}
        size={120}
        isPlaying
        onComplete={onTimeEnd}
        colors={['#008000', '#FFFF00', '#FF0000']}
        colorsTime={[0.99 * duration, 0.66 * duration, 0.33 * duration, 0]} >
        {
          ({ color, remainingTime }) => (
            <span style={{ color }}
              >{remainingTime}</span>
        )}
      </CountdownCircleTimer>
    </div>
  );
}
