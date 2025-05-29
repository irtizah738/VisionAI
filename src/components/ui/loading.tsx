import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
  fullScreen?: boolean;
  text?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const variantMap = {
  default: 'text-gray-600',
  primary: 'text-primary',
  secondary: 'text-secondary',
};

export function Loading({
  size = 'md',
  variant = 'default',
  fullScreen = false,
  text,
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 
        className={cn(
          'animate-spin',
          sizeMap[size],
          variantMap[variant]
        )} 
      />
      {text && (
        <p className={cn(
          'text-sm font-medium',
          variantMap[variant]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}

export function LoadingOverlay({ text }: { text?: string }) {
  return <Loading fullScreen text={text} />;
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn('animate-spin', className)} />
  );
} 