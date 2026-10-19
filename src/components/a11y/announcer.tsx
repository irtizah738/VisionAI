"use client";

import React from 'react';

export function announce(message: string, assertive = false): void {
  if (typeof document === 'undefined') return;
  const element = document.getElementById('a11y-announcer');
  if (element) {
    element.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    element.textContent = message;
  }
}

export function Announcer({ message }: { message?: string }) {
  return (
    <div
      id="a11y-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

export default Announcer;