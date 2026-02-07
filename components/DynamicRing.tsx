
import React from 'react';

interface Props {
  rotation: { x: number; y: number; z: number };
  scale: number;
  position: { x: number; y: number };
}

export const DynamicRing: React.FC<Props> = ({ rotation, scale, position }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div 
        className="absolute w-full h-full flex items-center justify-center transition-all duration-[2000ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          transform: `translate(${position.x}vw, ${position.y}vh) scale(${scale})`,
        }}
      >
        <div 
          className="relative w-[400px] h-[400px]"
          style={{
            perspective: '2000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Main Ring Group */}
          <div 
            className="absolute inset-0 transition-transform duration-[2000ms] ease-out"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 3D Band thickness: Nested layers for volume */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  border: '18px solid transparent',
                  background: 'linear-gradient(45deg, #71717a, #f4f4f5, #a1a1aa, #ffffff, #71717a) border-box',
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'destination-out',
                  maskComposite: 'exclude',
                  transform: `translateZ(${i * 2 - 6}px)`,
                  opacity: 0.15 + (i * 0.05),
                }}
              />
            ))}

            {/* Top Shine Polish */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '18px solid transparent',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4), transparent, rgba(255,255,255,0.2)) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'destination-out',
                maskComposite: 'exclude',
                transform: 'translateZ(7px)',
                opacity: 0.6,
              }}
            />

            {/* Solitaire Diamond Setting */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-16 h-16"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'translateZ(15px) rotateX(-20deg)',
              }}
            >
              {/* Prongs (Setting) */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-1 h-10 bg-slate-300 rounded-full transform rotate-[45deg] origin-center opacity-40"></div>
                 <div className="w-1 h-10 bg-slate-300 rounded-full transform rotate-[-45deg] origin-center opacity-40"></div>
              </div>

              {/* Realistic Diamond with Facet Simulation */}
              <div 
                className="absolute inset-0"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Crown (Top) */}
                <div 
                  className="absolute inset-0 bg-white shadow-[0_0_50px_rgba(255,255,255,0.6)]"
                  style={{
                    clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
                    background: 'conic-gradient(from 0deg at 50% 50%, #fff, #e2e8f0, #fff, #cbd5e1, #fff, #94a3b8, #fff)',
                    opacity: 0.9,
                    transform: 'translateZ(8px)',
                  }}
                >
                   {/* Spectral Sparkle */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(165,180,252,0.4),transparent_70%)] animate-pulse"></div>
                </div>

                {/* Pavilion (Body/Depth) */}
                <div 
                  className="absolute inset-2"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)',
                    background: 'linear-gradient(to bottom, #cbd5e1, #1e293b)',
                    transform: 'translateZ(0px) rotateX(10deg)',
                    opacity: 0.5,
                  }}
                />

                {/* Inner Refraction Layers */}
                <div 
                  className="absolute inset-4 blur-[1px]"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)',
                    background: 'linear-gradient(45deg, #fff, transparent, #fff)',
                    transform: 'translateZ(4px)',
                    opacity: 0.4,
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Environmental Glow */}
          <div
            className="absolute inset-[-40%] rounded-full transition-transform duration-[3000ms] ease-out pointer-events-none"
            style={{
              transform: `rotateX(${rotation.y}deg) rotateY(${rotation.z}deg) rotateZ(${rotation.x}deg)`,
              background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)',
              opacity: 0.3,
            }}
          />
        </div>
      </div>
    </div>
  );
};
