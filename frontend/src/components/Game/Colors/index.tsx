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
        'border-y-[0.3rem] border-l-[0.3rem]  border-select-brown/[0.5] rounded-l-xl',
        'bg-select-brown bg-opacity-25',
      )}>
      <span className='defaultSpan mb-[1rem] mt-[1rem]'>{title}</span>
      <div
        className={twMerge(
          'grid grid-flow-row grid-cols-3 w-fit h-fit mb-[1rem]',
          'xlg:grid-cols-1 xlg:h-full xlg:overflow-y-scroll',
        )}
      >
        {colors.map(({ name, hex }) => (
          <div
            key={name}
            className={twMerge(
              'w-6 h-6 m-[0.4rem] rounded-full cursor-pointer border-black border-[0.08rem] drop-shadow-colorsShadow',
              selectedColor.hex === hex
                ? 'scale-125 duration-100'
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
          'w-[6.5rem] h-14 rounded-b-xl drop-shadow-colorsShadow mb-[0.5rem]',
          'border-[0.1rem] border-solid border-black',
        )}
        style={{ backgroundColor: selectedColor.hex }}
      ></div>
    </div>
  );
}
