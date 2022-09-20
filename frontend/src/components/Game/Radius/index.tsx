import { twMerge } from 'tailwind-merge';
import { RadiusProps } from './type';

export function Radius({
  radius,
  callback,
  selectedRadius,
  selectedColor,
}: RadiusProps): JSX.Element {
  return (
    <div className={twMerge(
      'flex flex-col items-center h-fit gap-2 px-2 py-3',
      'border-y-[0.3rem] border-r-[0.3rem]  border-select-brown/[0.5] rounded-r-xl',
      'bg-select-brown bg-opacity-25',
    )}>
      {radius.map((radio) => (  
        <div
          key={radio}
          className={twMerge(
            'flex items-center justify-center cursor-pointer',
            selectedRadius === radio ? 'border-gray-800 scale-125 duration-100' : '',
          )}
          onClick={() => callback(radio)}
        >
          <div
            className={twMerge(
              'rounded-full m-[0.4rem] cursor-pointer border-black border-[0.08rem] drop-shadow-colorsShadow',
              selectedRadius === radio ? 'bg-gray-800 scale-125 duration-100' : '',
            )}
            style={{
              backgroundColor: selectedColor.hex,
              width: `${radio + 5}px`,
              height: `${radio + 5}px`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
}