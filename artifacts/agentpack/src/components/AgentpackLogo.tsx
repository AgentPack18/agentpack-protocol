interface LogoProps {
  className?: string;
  size?: number;
}

export function AgentpackLogo({ className = "", size = 36 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-grad-a" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="logo-grad-b" x1="36" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer hexagonal ring */}
      <path
        d="M18 2 L32 10 L32 26 L18 34 L4 26 L4 10 Z"
        stroke="url(#logo-grad-a)"
        strokeWidth="1.5"
        fill="url(#logo-grad-b)"
        strokeLinejoin="round"
      />

      {/* Inner circuit node pattern */}
      {/* Center core */}
      <circle cx="18" cy="18" r="4.5" fill="url(#logo-grad-a)" filter="url(#logo-glow)" />

      {/* Radial arms */}
      <line x1="18" y1="13.5" x2="18" y2="8" stroke="url(#logo-grad-a)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="18" y1="22.5" x2="18" y2="28" stroke="url(#logo-grad-a)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13.5" y1="18" x2="8" y2="18" stroke="url(#logo-grad-a)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="22.5" y1="18" x2="28" y2="18" stroke="url(#logo-grad-a)" strokeWidth="1.2" strokeLinecap="round" />

      {/* Diagonal arms (45 degrees) */}
      <line x1="21.2" y1="14.8" x2="25" y2="11" stroke="url(#logo-grad-a)" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="14.8" y1="21.2" x2="11" y2="25" stroke="url(#logo-grad-a)" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="14.8" y1="14.8" x2="11" y2="11" stroke="url(#logo-grad-a)" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="21.2" y1="21.2" x2="25" y2="25" stroke="url(#logo-grad-a)" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />

      {/* End node dots */}
      <circle cx="18" cy="8" r="1.5" fill="#6366f1" />
      <circle cx="18" cy="28" r="1.5" fill="#06b6d4" />
      <circle cx="8" cy="18" r="1.5" fill="#3b82f6" />
      <circle cx="28" cy="18" r="1.5" fill="#38bdf8" />
      <circle cx="25" cy="11" r="1" fill="#a78bfa" />
      <circle cx="11" cy="25" r="1" fill="#a78bfa" />
      <circle cx="11" cy="11" r="1" fill="#a78bfa" />
      <circle cx="25" cy="25" r="1" fill="#a78bfa" />
    </svg>
  );
}
