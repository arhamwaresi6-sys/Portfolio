export function BrandMark({ className = "", size = 24 }) {
  const height = Math.round(size * (48 / 42));

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 42 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`brand-mark ${className}`.trim()}
    >
      <path
        d="M21 0L22.1089 20.2315C22.1536 21.0354 23.0188 21.5299 23.7418 21.1641L42 11.999L24.8507 23.0654C24.1683 23.5036 24.1683 24.4924 24.8507 24.9346L42 36.001L23.7418 26.8359C23.0147 26.4701 22.1536 26.9646 22.1089 27.7685L21 48L19.8911 27.7685C19.8464 26.9646 18.9812 26.4701 18.2582 26.8359L0 35.997L17.1493 24.9306C17.8317 24.4924 17.8317 23.5036 17.1493 23.0614L0 11.999L18.2582 21.1641C18.9853 21.5299 19.8464 21.0354 19.8911 20.2315L21 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
