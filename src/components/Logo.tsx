interface LogoProps {
  size?: number;
  showText?: boolean;
}

export default function Logo({ size = 40, showText = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          
          <circle cx="50" cy="50" r="42" fill="url(#modernGradient)" opacity="0.15"/>
          
          <path 
            d="M 30 40 L 50 25 L 70 40 L 70 60 L 50 75 L 30 60 Z" 
            stroke="url(#modernGradient)" 
            strokeWidth="3" 
            fill="none"
          />
          
          <circle cx="50" cy="50" r="10" fill="url(#modernGradient)"/>
          
          <path d="M 50 50 L 50 25" stroke="url(#modernGradient)" strokeWidth="2.5" opacity="0.7"/>
          <path d="M 50 50 L 70 40" stroke="url(#modernGradient)" strokeWidth="2.5" opacity="0.7"/>
          <path d="M 50 50 L 70 60" stroke="url(#modernGradient)" strokeWidth="2.5" opacity="0.7"/>
          <path d="M 50 50 L 30 60" stroke="url(#modernGradient)" strokeWidth="2.5" opacity="0.7"/>
          <path d="M 50 50 L 30 40" stroke="url(#modernGradient)" strokeWidth="2.5" opacity="0.7"/>
          
          <circle cx="50" cy="25" r="5" fill="#6366f1"/>
          <circle cx="70" cy="40" r="5" fill="#a855f7"/>
          <circle cx="70" cy="60" r="5" fill="#ec4899"/>
          <circle cx="30" cy="60" r="5" fill="#a855f7"/>
          <circle cx="30" cy="40" r="5" fill="#6366f1"/>
        </svg>
      </div>
      {showText && (
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Богдан ИИ
          </h1>
          <p className="text-xs text-gray-400">Умный помощник</p>
        </div>
      )}
    </div>
  );
}