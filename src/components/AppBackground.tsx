'use client';

export default function AppBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#0f2f4f] via-[#2b6cb0] to-[#0f2f4f] bg-size-[100%_100%]" />

      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,243,255,0.25)_0%,transparent_70%)] opacity-30"
        style={{
          backgroundPosition: 'center',
          backgroundSize: '150% 150%',
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="network-grid" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="100" cy="100" r="1" fill="white" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#network-grid)" />
        
        <circle cx="15%" cy="20%" r="4" fill="white" opacity="0.12" />
        <circle cx="25%" cy="35%" r="4" fill="white" opacity="0.12" />
        <circle cx="40%" cy="25%" r="4" fill="white" opacity="0.12" />
        <circle cx="55%" cy="40%" r="4" fill="white" opacity="0.12" />
        <circle cx="70%" cy="30%" r="4" fill="white" opacity="0.12" />
        <circle cx="85%" cy="45%" r="4" fill="white" opacity="0.12" />
        <circle cx="20%" cy="60%" r="4" fill="white" opacity="0.12" />
        <circle cx="35%" cy="70%" r="4" fill="white" opacity="0.12" />
        <circle cx="60%" cy="65%" r="4" fill="white" opacity="0.12" />
        <circle cx="75%" cy="75%" r="4" fill="white" opacity="0.12" />
        <circle cx="90%" cy="65%" r="4" fill="white" opacity="0.12" />
        <circle cx="10%" cy="50%" r="4" fill="white" opacity="0.12" />
        <circle cx="45%" cy="80%" r="4" fill="white" opacity="0.12" />
        <circle cx="65%" cy="15%" r="4" fill="white" opacity="0.12" />
        <circle cx="30%" cy="10%" r="4" fill="white" opacity="0.12" />
        
        <line x1="15%" y1="20%" x2="25%" y2="35%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="25%" y1="35%" x2="40%" y2="25%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="40%" y1="25%" x2="55%" y2="40%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="55%" y1="40%" x2="70%" y2="30%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="70%" y1="30%" x2="85%" y2="45%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="20%" y1="60%" x2="35%" y2="70%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="35%" y1="70%" x2="60%" y2="65%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="60%" y1="65%" x2="75%" y2="75%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="75%" y1="75%" x2="90%" y2="65%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="15%" y1="20%" x2="20%" y2="60%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="25%" y1="35%" x2="30%" y2="10%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="40%" y1="25%" x2="65%" y2="15%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="55%" y1="40%" x2="60%" y2="65%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="10%" y1="50%" x2="20%" y2="60%" stroke="white" strokeWidth="1" opacity="0.08" />
        <line x1="35%" y1="70%" x2="45%" y2="80%" stroke="white" strokeWidth="1" opacity="0.08" />
        
        <circle cx="20%" cy="27.5%" r="1.5" fill="white" opacity="0.06" />
        <circle cx="32.5%" cy="30%" r="1.5" fill="white" opacity="0.06" />
        <circle cx="47.5%" cy="32.5%" r="1.5" fill="white" opacity="0.06" />
        <circle cx="62.5%" cy="35%" r="1.5" fill="white" opacity="0.06" />
        <circle cx="27.5%" cy="67.5%" r="1.5" fill="white" opacity="0.06" />
        <circle cx="67.5%" cy="70%" r="1.5" fill="white" opacity="0.06" />
      </svg>

      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute top-[8%] left-[5%] font-mono text-white text-sm" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>
          192.168.1.1
        </div>
        <div className="absolute top-[12%] right-[8%] font-mono text-white text-sm" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>
          172.16.0.23
        </div>
        <div className="absolute bottom-[10%] left-[6%] font-mono text-white text-sm" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>
          10.0.0.1
        </div>
        <div className="absolute bottom-[15%] right-[7%] font-mono text-white text-sm" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>
          172.18.11.13
        </div>
        <div className="absolute top-[50%] left-[3%] font-mono text-white text-sm" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>
          192.168.8.1
        </div>
        <div className="absolute top-[65%] right-[4%] font-mono text-white text-sm" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>
          10.10.10.1
        </div>

        <svg className="absolute top-[25%] left-[30%] w-16 h-16" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 16C12 12.6863 14.6863 10 18 10C19.5913 10 21.0214 10.6314 22 11.6585C23.0172 10.6748 24.4828 10 26 10C29.3137 10 32 12.6863 32 16C33.3807 16 34.6307 16.3232 35.5355 17.1924C36.4404 16.3232 37.6904 16 39.0711 16C42.3848 16 45.0711 18.6863 45.0711 22C45.0711 25.3137 42.3848 28 39.0711 28H18C14.6863 28 12 25.3137 12 22C12 18.6863 14.6863 16 18 16C18.3492 16 18.6889 16.0237 19.0176 16.0686C19.6525 14.8387 20.7368 14 22 14C23.6569 14 25 15.3431 25 17C25 17.3508 24.9763 17.6889 24.9314 18.0176C26.1613 18.6525 27 19.7368 27 21C27 22.6569 25.6569 24 24 24H18C14.6863 24 12 21.3137 12 18C12 14.6863 14.6863 12 18 12C19.5913 12 21.0214 12.6314 22 13.6585C23.0172 12.6748 24.4828 12 26 12C29.3137 12 32 14.6863 32 18Z"
            fill="white"
          />
        </svg>
        <svg className="absolute top-[60%] right-[35%] w-20 h-14" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 16C12 12.6863 14.6863 10 18 10C19.5913 10 21.0214 10.6314 22 11.6585C23.0172 10.6748 24.4828 10 26 10C29.3137 10 32 12.6863 32 16C33.3807 16 34.6307 16.3232 35.5355 17.1924C36.4404 16.3232 37.6904 16 39.0711 16C42.3848 16 45.0711 18.6863 45.0711 22C45.0711 25.3137 42.3848 28 39.0711 28H18C14.6863 28 12 25.3137 12 22C12 18.6863 14.6863 16 18 16C18.3492 16 18.6889 16.0237 19.0176 16.0686C19.6525 14.8387 20.7368 14 22 14C23.6569 14 25 15.3431 25 17C25 17.3508 24.9763 17.6889 24.9314 18.0176C26.1613 18.6525 27 19.7368 27 21C27 22.6569 25.6569 24 24 24H18C14.6863 24 12 21.3137 12 18C12 14.6863 14.6863 12 18 12C19.5913 12 21.0214 12.6314 22 13.6585C23.0172 12.6748 24.4828 12 26 12C29.3137 12 32 14.6863 32 18Z"
            fill="white"
          />
        </svg>

        <div className="absolute bottom-[20%] left-[15%] w-6 h-12 bg-white opacity-30 rounded-sm">
          <div className="absolute top-1 left-1 right-1 h-1 bg-white opacity-50 rounded"></div>
          <div className="absolute top-3 left-1 right-1 h-1 bg-white opacity-50 rounded"></div>
          <div className="absolute top-5 left-1 right-1 h-1 bg-white opacity-50 rounded"></div>
          <div className="absolute top-7 left-1 right-1 h-1 bg-white opacity-50 rounded"></div>
        </div>
        <div className="absolute top-[30%] right-[18%] w-6 h-12 bg-white opacity-30 rounded-sm">
          <div className="absolute top-1 left-1 right-1 h-1 bg-white opacity-50 rounded"></div>
          <div className="absolute top-3 left-1 right-1 h-1 bg-white opacity-50 rounded"></div>
          <div className="absolute top-5 left-1 right-1 h-1 bg-white opacity-50 rounded"></div>
          <div className="absolute top-7 left-1 right-1 h-1 bg-white opacity-50 rounded"></div>
        </div>
        <div className="absolute top-[70%] right-[12%] w-5 h-10 bg-white opacity-25 rounded-sm">
          <div className="absolute top-1 left-1 right-1 h-0.5 bg-white opacity-50 rounded"></div>
          <div className="absolute top-2.5 left-1 right-1 h-0.5 bg-white opacity-50 rounded"></div>
          <div className="absolute top-4 left-1 right-1 h-0.5 bg-white opacity-50 rounded"></div>
          <div className="absolute top-5.5 left-1 right-1 h-0.5 bg-white opacity-50 rounded"></div>
        </div>
      </div>
    </div>
  );
}

