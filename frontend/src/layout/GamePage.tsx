import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type GamePageProps = {
  children: ReactNode;
  className?: string;
};

export function GamePage({ children, className }: GamePageProps) {
  return (
    <div
      className={twMerge(
        'w-full h-full flex items-center justify-center',
        'bg-[url("/assets/images/background.png")] bg-center bg-cover',
      )}
    >
      <div
        className={twMerge(
          'flex flex-col items-center justify-center w-[64rem] h-[45rem]',
          'shadow-md shadow-gray-600 rounded-[3.125rem]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
