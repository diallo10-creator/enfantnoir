import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2024-09-19T20:00:00+00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center space-x-4 md:space-x-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px] animate-pulse-glow">
            <div className="text-2xl md:text-4xl font-display font-bold text-gradient-orange">
              {value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">
              {unit === 'days' ? 'Jours' : 
               unit === 'hours' ? 'Heures' : 
               unit === 'minutes' ? 'Min' : 'Sec'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};