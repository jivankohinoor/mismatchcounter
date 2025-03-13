import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';

const WeeklyStats = () => {
  const { counters } = useData();
  
  const stats = useMemo(() => {
    // Create an array of the past 7 days (including today)
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    // Calculate total increments for each day
    const dailyIncrements = days.map(day => {
      let count = 0;
      counters.forEach(counter => {
        if (counter.events) {
          const incrementEvents = counter.events.filter(
            event => event.type === 'increment' && event.date.startsWith(day)
          );
          count += incrementEvents.length;
        }
      });
      return { 
        date: day, 
        count,
        display: new Date(day).toLocaleDateString('en-US', { weekday: 'short' })
      };
    });
    
    // Calculate streaks (consecutive days with no increments)
    let streak = 0;
    for (const day of dailyIncrements) {
      if (day.count === 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return {
      dailyIncrements: dailyIncrements.reverse(),
      streak
    };
  }, [counters]);
  
  return (
    <div className="weekly-stats">
      <h3>Weekly Overview</h3>
      <div className="stats-container">
        <div className="streak-info">
          <span className="streak-count">{stats.streak}</span>
          <span className="streak-label">Day{stats.streak !== 1 ? 's' : ''} Streak</span>
        </div>
        
        <div className="daily-chart">
          {stats.dailyIncrements.map((day) => (
            <div key={day.date} className="chart-day">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${Math.min(day.count * 10, 100)}%`,
                  backgroundColor: day.count > 0 ? '#ff6b6b' : '#4caf50'
                }}
                title={`${day.count} mistake${day.count !== 1 ? 's' : ''} on ${day.date}`}
              ></div>
              <div className="chart-label">{day.display}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyStats; 