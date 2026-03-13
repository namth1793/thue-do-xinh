// Floating Zalo & Facebook buttons — fixed bottom-right corner
// TODO: Cập nhật ZALO_PHONE và FACEBOOK_URL theo thông tin thực tế của bạn

const ZALO_PHONE = '0931686897';
const FACEBOOK_URL = 'https://www.facebook.com/phanhoamc';

export default function SocialFloat() {
  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3 items-center">
      {/* Zalo */}
      <a
        href={`https://zalo.me/${ZALO_PHONE}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat Zalo"
        className="group relative flex items-center justify-center w-13 h-13"
      >
        {/* Pulse ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40 animate-ping" />
        <span className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-white transition-transform duration-200 group-hover:scale-110">
          {/* Zalo SVG logo */}
          <svg viewBox="0 0 48 48" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#0068FF"/>
            <text
              x="50%"
              y="54%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
              fontSize="18"
              fill="white"
              letterSpacing="-1"
            >Zalo</text>
          </svg>
        </span>
        {/* Tooltip */}
        <span className="absolute right-14 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat Zalo
        </span>
      </a>

      {/* Facebook */}
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Facebook"
        className="group relative flex items-center justify-center w-13 h-13"
      >
        {/* Pulse ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-40 animate-ping [animation-delay:0.4s]" />
        <span className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-white transition-transform duration-200 group-hover:scale-110">
          {/* Facebook SVG logo */}
          <svg viewBox="0 0 48 48" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#1877F2"/>
            <path
              d="M32 8h-4c-3.314 0-6 2.686-6 6v4h-4v6h4v16h6V24h4l1-6h-5v-4c0-.552.448-1 1-1h4V8z"
              fill="white"
            />
          </svg>
        </span>
        {/* Tooltip */}
        <span className="absolute right-14 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Facebook
        </span>
      </a>
    </div>
  );
}
