export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        
        <rect width="100" height="100" rx="20" fill="url(#logoGradient)" />
        
        <circle cx="30" cy="30" r="6" fill="white" opacity="0.9" />
        <circle cx="50" cy="30" r="6" fill="white" opacity="0.9" />
        <circle cx="70" cy="30" r="6" fill="white" opacity="0.9" />
        
        <circle cx="30" cy="50" r="6" fill="white" opacity="0.9" />
        <circle cx="50" cy="50" r="8" fill="white" />
        <circle cx="70" cy="50" r="6" fill="white" opacity="0.9" />
        
        <circle cx="30" cy="70" r="6" fill="white" opacity="0.9" />
        <circle cx="50" cy="70" r="6" fill="white" opacity="0.9" />
        <circle cx="70" cy="70" r="6" fill="white" opacity="0.9" />
        
        <line x1="30" y1="30" x2="50" y2="50" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="50" y1="30" x2="50" y2="50" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="70" y1="30" x2="50" y2="50" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="30" y1="50" x2="50" y2="50" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="50" y1="50" x2="70" y2="50" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="30" y1="70" x2="50" y2="50" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="50" y1="70" x2="50" y2="50" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="70" y1="70" x2="50" y2="50" stroke="white" strokeWidth="2" opacity="0.5" />
        
        <path d="M 35 85 Q 50 80 65 85" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      </svg>
    </div>
  );
}
