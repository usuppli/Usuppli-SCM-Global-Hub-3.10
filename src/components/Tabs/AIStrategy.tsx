
// src/components/Tabs/AIStrategy.tsx (THE CORRECT VERSION)
import React from 'react';
import SCMAIStrategist from '../SCMAIStrategist';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

const AIStrategy: React.FC<Props> = ({ lang }) => {
  return (
    <div className="h-full animate-in fade-in">
      <SCMAIStrategist lang={lang} />
    </div>
  );
};

export default AIStrategy;