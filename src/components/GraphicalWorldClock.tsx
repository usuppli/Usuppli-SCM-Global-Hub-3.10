
import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

interface CityConfig {
  id: string;
  label: string;
  timezone: string;
}

const AVAILABLE_CITIES: CityConfig[] = [
  { id: 'lax', label: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { id: 'atl', label: 'Atlanta', timezone: 'America/New_York' },
  { id: 'lon', label: 'London', timezone: 'Europe/London' },
  { id: 'jnb', label: 'South Africa', timezone: 'Africa/Johannesburg' },
  { id: 'bom', label: 'Mumbai', timezone: 'Asia/Kolkata' },
  { id: 'sha', label: 'Shanghai', timezone: 'Asia/Shanghai' },
  { id: 'tyo', label: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: 'syd', label: 'Sydney', timezone: 'Australia/Sydney' },
];

const DEFAULT_CITIES = ['lax', 'atl', 'lon', 'sha'];

interface Props {
  theme?: 'dark' | 'light';
  isAbsolute?: boolean; 
  className?: string;
}

type WidgetPosition = 'left' | 'center' | 'right';

const GraphicalWorldClock: React.FC<Props> = ({ theme: propTheme, isAbsolute = false, className = '' }) => {
  const { theme: systemTheme } = useTheme();
  const theme = propTheme || systemTheme;
  const isDarkTheme = theme === 'dark';

  const [time, setTime] = useState(new Date());
  const [activeCityIds, setActiveCityIds] = useState<string[]>([]);
  const [position, setPosition] = useState<WidgetPosition>('right');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedCities = localStorage.getItem('usuppli_clock_prefs');
    if (savedCities) setActiveCityIds(JSON.parse(savedCities));
    else setActiveCityIds(DEFAULT_CITIES);

    const savedPos = localStorage.getItem('usuppli_clock_pos');
    if (savedPos) setPosition(savedPos as WidgetPosition);

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleCity = (id: string) => {
    const updated = activeCityIds.includes(id)
      ? activeCityIds.filter(cid => cid !== id)
      : [...activeCityIds, id];
    setActiveCityIds(updated);
    localStorage.setItem('usuppli_clock_prefs', JSON.stringify(updated));
  };

  const moveCity = (index: number, direction: 'left' | 'right') => {
    const newOrder = [...activeCityIds];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setActiveCityIds(newOrder);
    localStorage.setItem('usuppli_clock_prefs', JSON.stringify(newOrder));
  };

  const changePosition = (pos: WidgetPosition) => {
    setPosition(pos);
    localStorage.setItem('usuppli_clock_pos', pos);
  };

  const getContainerClass = () => {
      if (isAbsolute) {
          if (position === 'left') return 'absolute top-4 left-4';
          if (position === 'center') return 'absolute top-4 left-1/2 -translate-x-1/2';
          return 'absolute top-4 right-4';
      } else {
          if (position === 'left') return 'flex justify-start mb-4';
          if (position === 'center') return 'flex justify-center mb-4';
          return 'flex justify-end mb-4';
      }
  };

  const renderClockFace = (city: CityConfig, index: number) => {
    const cityTimeStr = new Date().toLocaleString("en-US", { timeZone: city.timezone });
    const cityDate = new Date(cityTimeStr);
    
    const seconds = cityDate.getSeconds();
    const minutes = cityDate.getMinutes();
    const hours = cityDate.getHours();

    const secondAngle = seconds * 6;
    const minuteAngle = minutes * 6 + seconds * 0.1;
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;

    const isDay = hours >= 6 && hours < 18;
    
    const faceColor = isDay 
        ? (isDarkTheme ? 'fill-slate-800' : 'fill-white') 
        : (isDarkTheme ? 'fill-indigo-950' : 'fill-slate-100');
    
    const borderColor = isDarkTheme ? 'stroke-slate-600' : 'stroke-slate-400'; 
    const handColor = isDarkTheme ? 'stroke-slate-100' : 'stroke-slate-900';
    const accentColor = 'stroke-red-500'; 
    
    // THEME SPECIFIC TEXT COLORS
    const cityTextColor = isDarkTheme ? 'text-blue-400' : 'text-blue-600';
    const timeTextColor = isDarkTheme ? 'text-white' : 'text-slate-900';
    const labelTextColor = isDarkTheme ? 'text-slate-400' : 'text-slate-500';

    return (
      <div key={city.id} className="relative flex flex-col items-center gap-2 group transition-all">
        <div className="absolute top-0 bottom-8 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-1 pointer-events-none">
            <button 
                onClick={(e) => { e.stopPropagation(); moveCity(index, 'left'); }}
                className={`w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 pointer-events-auto shadow-sm transform transition-transform hover:scale-110 ${index === 0 ? 'invisible' : ''}`}
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); moveCity(index, 'right'); }}
                className={`w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-blue-600 pointer-events-auto shadow-sm transform transition-transform hover:scale-110 ${index === activeCityIds.length - 1 ? 'invisible' : ''}`}
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
            </button>
        </div>

        <div className={`relative w-14 h-14 group-hover:scale-105 transition-transform duration-300 ${!isDarkTheme ? 'drop-shadow-md' : ''}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" className={`${faceColor} ${borderColor} stroke-2`} />
            {[0, 90, 180, 270].map(deg => (
              <line key={deg} x1="50" y1="10" x2="50" y2="18" transform={`rotate(${deg} 50 50)`} className={`${handColor} stroke-[3] opacity-30`} />
            ))}
            <line x1="50" y1="50" x2="50" y2="25" transform={`rotate(${hourAngle} 50 50)`} className={`${handColor} stroke-[4] stroke-linecap-round`} />
            <line x1="50" y1="50" x2="50" y2="15" transform={`rotate(${minuteAngle} 50 50)`} className={`${handColor} stroke-[3] stroke-linecap-round`} />
            <line x1="50" y1="50" x2="50" y2="10" transform={`rotate(${secondAngle} 50 50)`} className={`${accentColor} stroke-[1.5]`} />
            <circle cx="50" cy="50" r="3" className={`${accentColor} fill-current`} />
          </svg>
        </div>

        <div className="text-center leading-tight">
           <div className={`text-[10px] uppercase tracking-wider font-bold ${cityTextColor}`}>{city.label.substring(0,3)}</div>
           <div className={`text-[10px] font-mono font-black ${timeTextColor}`}>
              {cityDate.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: false })}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`transition-all duration-500 ease-out z-30 p-5 rounded-[2rem] border ${isDarkTheme ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} ${getContainerClass()} ${className}`}>
       <div className="flex items-center gap-6 overflow-x-auto py-1 px-1 no-scrollbar">
          {activeCityIds.map((id, index) => {
             const city = AVAILABLE_CITIES.find(c => c.id === id);
             return city ? renderClockFace(city, index) : null;
          })}
          
          <button 
             onClick={() => setIsEditing(true)}
             className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isDarkTheme ? 'border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300' : 'border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-sm'}`}
             title="Configure Clocks"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          </button>
       </div>

       {isEditing && (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 border dark:border-slate-800">
               <div className="bg-[#003d5b] dark:bg-slate-950 p-6 text-white flex justify-between items-center">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Clock Configuration</h3>
                  <button onClick={() => setIsEditing(false)} className="hover:text-red-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
               </div>
               
               <div className="p-8 space-y-6">
                  <div>
                      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Widget Alignment</label>
                      <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-800">
                          {(['left', 'center', 'right'] as WidgetPosition[]).map(pos => (
                              <button 
                                key={pos}
                                onClick={() => changePosition(pos)}
                                className={`py-2 text-xs font-bold capitalize rounded-lg transition-all ${position === pos ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                              >
                                {pos}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Visible Locations</label>
                    <div className="max-h-56 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {AVAILABLE_CITIES.map(city => (
                            <label key={city.id} className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                                activeCityIds.includes(city.id) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}>
                                <span className={`text-sm font-bold ${activeCityIds.includes(city.id) ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>{city.label}</span>
                                <input 
                                    type="checkbox" 
                                    className="accent-blue-600 w-4 h-4 rounded"
                                    checked={activeCityIds.includes(city.id)}
                                    onChange={() => toggleCity(city.id)}
                                />
                            </label>
                        ))}
                    </div>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-right">
                  <button onClick={() => setIsEditing(false)} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg transition-all text-xs uppercase tracking-widest">
                     Apply Changes
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default GraphicalWorldClock;
