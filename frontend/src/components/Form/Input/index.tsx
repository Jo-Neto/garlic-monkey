import { twMerge } from 'tailwind-merge';
import { InputProps } from './type';

export function Input({ className, errors, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      <input
        className={twMerge(
          'w-52 h-14 bg-white drop-shadow-lg shadow-gray-500',
          'opacity-50 rounded-md border-solid border-2 border-white',
          className,
        )}
        {...props}
      />
      <span>{errors?.message}</span>
    </div>
  );
}
