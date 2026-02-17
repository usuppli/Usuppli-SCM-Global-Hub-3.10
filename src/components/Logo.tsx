
import React from 'react';

interface Props {
  className?: string;       // Allows you to set size (e.g., "h-10") and color (e.g., "text-white")
  variant?: 'full' | 'mark'; // 'full' = Icon + Text, 'mark' = Icon only
}

export const Logo: React.FC<Props> = ({ 
  className = "h-10 w-auto", 
  variant = 'full'
}) => {
  return (
    <svg 
      className={className} 
      // 1. ViewBox Logic: 
      // If 'full', we make it wider (400px) to fit the text. 
      // If 'mark', we crop it to just the icon (108px).
      viewBox={variant === 'full' ? "0 0 380 87.4" : "0 0 108.1 87.4"} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* --- YOUR ICON (The 'U' Mark) --- */}
      
      {/* 1. Main Blue Shape ("U") 
          - fill="currentColor": This allows the parent (Sidebar) to make this White.
      */}
      <path 
        fill="currentColor" 
        d="M96,12.5c-.8-2.2-2.9-3.8-5.4-3.8s-5.7,2.6-5.7,5.7.3,2,.7,2.8h0c2.5,5,3.8,10.6,3.8,16.3,0,20.1-16.4,36.5-36.5,36.5S16.6,53.7,16.6,33.6s1.3-11,3.7-16c.2-.4.4-.7.6-1.1,0,0,0,0,0-.1h0c.2-.6.3-1.2.3-1.8,0-3.2-2.6-5.7-5.7-5.7s-3.5.9-4.5,2.2h0c0,0,0,.2-.2.3-.3.4-.5.8-.6,1.3-3.2,6.5-4.9,13.8-4.9,21.1,0,26.4,21.5,47.8,47.8,47.8s47.8-21.5,47.8-47.8-1.7-14.5-4.9-21Z"
      />

      {/* 2. The Red Dots (Your Brand Accent) 
          - fill="#e3224a": Hardcoded to stay Red even in Dark Mode.
      */}
      <path fill="#e3224a" d="M60.1,37.1c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
      <path fill="#e3224a" d="M79.1,26.5c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,7.1,3.2,7.1,7.1Z"/>
      <path fill="#e3224a" d="M73.3,51.5c0,3.9-3.2,7.1-7.1,7.1s-7.1-3.2-7.1-7.1,3.2-7.1,7.1-7.1,3.2-7.1,7.1Z"/>

      {/* --- THE TEXT (Visible only if variant='full') --- */}
      {variant === 'full' && (
        <text 
          x="125" 
          y="62" 
          fontFamily="sans-serif" 
          fontWeight="bold" 
          fontSize="52" 
          fill="currentColor"
        >
          Usuppli
        </text>
      )}
    </svg>
  );
};