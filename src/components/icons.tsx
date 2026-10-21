import React from 'react';
import Image from 'next/image';

interface VisionAILogoProps {
  className?: string;
  [key: string]: any;
}

export const VisionAILogo = ({ className = 'h-7 w-7', ...props }: VisionAILogoProps) => (
  <span
    className={`inline-flex items-center justify-center rounded-full bg-white overflow-hidden shrink-0 aspect-square shadow-xs ring-1 ring-indigo-500/15 dark:ring-purple-500/30 ${className}`}
    {...props}
  >
    <Image
      src="/assets/aistudio/Vision_AI_Sora_logo_61952a5b.webp"
      alt="VisionAI"
      width={64}
      height={64}
      loading="eager"
      referrerPolicy="no-referrer"
      className="h-full w-full object-contain scale-110"
    />
  </span>
);
