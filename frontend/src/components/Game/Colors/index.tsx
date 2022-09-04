import { twMerge } from 'tailwind-merge';
import { ColorObj } from './type';

interface ColorsProps {
  title: string;
  colors: ColorObj[];
  callback: (arg: ColorObj) => void;
  selectedColor: ColorObj;
}

export function Colors({
  title,
  colors,
  callback,
  selectedColor,
}: ColorsProps) {
  return (
    <div className="flex flex-col items-center xlg:h-40">
      <div>{title}</div>
      <div
        className="grid grid-flow-row grid-cols-3 w-fit h-fit
                    xlg:grid-cols-1 xlg:h-full xlg:overflow-y-scroll"
      >
        {colors.map(({ name, hex }) => (
          <div
            key={name}
            className={twMerge(
              'w-5 h-5 m-1 rounded-md cursor-pointer',
              selectedColor.hex === hex
                ? 'border-2 border-spacing-2 border-zinc-700 shadow-md shadow-gray-500'
                : '',
            )}
            style={{
              backgroundColor: hex,
            }}
            onClick={() => callback({ name, hex })}
          ></div>
        ))}
      </div>
    </div>
  );
}
