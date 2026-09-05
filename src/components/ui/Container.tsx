import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: 'default' | 'narrow' | 'wide';
};

export function Container({ children, className, maxWidth = 'default' }: ContainerProps) {
  const maxW = {
    default: 'max-w-content',
    narrow: 'max-w-4xl',
    wide: 'max-w-[1600px]',
  }[maxWidth];

  return (
    <div className={cn(maxW, 'container-px mx-auto', className)}>
      {children}
    </div>
  );
}
