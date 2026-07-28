import React from 'react';

export const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050816]">
      {/* Primary Emerald Aurora Orb */}
      <div className="absolute top-[-10%] left-[-5%] w-[45rem] h-[45rem] rounded-full bg-emerald-500/10 blur-[130px] animate-aurora-1" />
      
      {/* Secondary Cyan Aurora Orb */}
      <div className="absolute top-[30%] right-[-10%] w-[50rem] h-[50rem] rounded-full bg-cyan-500/10 blur-[150px] animate-aurora-2" />
      
      {/* Gold Accent Orb */}
      <div className="absolute bottom-[-10%] left-[20%] w-[40rem] h-[40rem] rounded-full bg-amber-500/05 blur-[140px] animate-aurora-1" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />
    </div>
  );
};
