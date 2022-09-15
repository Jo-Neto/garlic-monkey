import { twMerge } from 'tailwind-merge';
import { InputProps } from './type';

export function Input({ className, errors, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      <input
        className={twMerge(
          'w-48 h-12 uppercase bg-[#3F1802]/50 text-white	drop-shadow-lg shadow-gray-500',
          'text-center rounded-md border-solid border-2 border-white',
          className,
        )}
        {...props}
      />
      <span>{errors?.message}</span>
    </div>
  );
}
