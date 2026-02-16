'use client';

import { useState } from 'react';

interface LogoProps {
  className?: string;
  height?: number;
  /** Ruta del logo. Por defecto /logo.png. Si usas SVG, usa /logo.svg */
  src?: string;
}


export function LogoGrande({ className, height = 700, src = '/logoGrande.svg' }: LogoProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span className={`font-bold text-xl ${className}`} style={{ color: 'inherit' }}>
        taskFlow
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="taskFlow"
      height={height}
      width="auto"
      className={className}
      onError={() => setError(true)}
    />
  );
} 
export function Logo({ className, height = 40, src = '/t.png' }: LogoProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span className={`font-bold text-xl ${className}`} style={{ color: 'inherit' }}>
        taskFlow
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="taskFlow"
      height={height}
      width="auto"
      className={className}
      onError={() => setError(true)}
    />
  );
}
