export function EnvelopeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M2.66671 2.66669H13.3334C14.0667 2.66669 14.6667 3.26669 14.6667 4.00002V12C14.6667 12.7334 14.0667 13.3334 13.3334 13.3334H2.66671C1.93337 13.3334 1.33337 12.7334 1.33337 12V4.00002C1.33337 3.26669 1.93337 2.66669 2.66671 2.66669Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6667 4L8.00004 8.66667L1.33337 4"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
