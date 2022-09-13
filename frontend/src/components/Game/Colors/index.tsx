import { twMerge } from 'tailwind-merge';
import { ColorsProps } from './type';

export function Colors({
  title,
  colors,
  callback,
  selectedColor,
}: ColorsProps) {
  return (
    <div
      className={twMerge(
        'flex flex-col items-center h-fit px-2 py-3',
        'border-8 border-select-brown rounded-l-xl',
        'bg-select-brown bg-opacity-25',
      )}
    >
      <div>{title}</div>
      <div
        className={twMerge(
          'grid grid-flow-row grid-cols-3 w-fit h-fit',
          'xlg:grid-cols-1 xlg:h-full xlg:overflow-y-scroll',
        )}
      >
        {colors.map(({ name, hex }) => (
          <div
            key={name}
            className={twMerge(
              'w-5 h-5 m-1 rounded-full cursor-pointer border-black',
              selectedColor.hex === hex
                ? 'border-2 border-spacing-2 shadow-md shadow-gray-500'
                : '',
            )}
            style={{
              backgroundColor: hex,
            }}
            onClick={() => callback({ name, hex })}
          ></div>
        ))}
      </div>
      <div
        className={twMerge(
          'w-32 h-14 rounded-b-xl shadow-md shadow-gray-500',
          'border-2 border-solid border-black',
        )}
        style={{ backgroundColor: selectedColor.hex }}
      ></div>
    </div>
  );
}
