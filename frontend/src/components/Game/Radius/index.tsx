import { twMerge } from 'tailwind-merge';

interface RadiusProps {
  radius: number[];
  callback: (arg: number) => void;
  selectedRadius: number;
}

export function Radius({
  radius,
  callback,
  selectedRadius,
}: RadiusProps): JSX.Element {
  const outlineSize = Math.max(...radius) + 10;

  return (
    <div className="flex flex-col items-center gap-2 w-24 h-fit">
      {radius.map((radio) => (
        <div
          key={radio}
          className={twMerge(
            'flex items-center justify-center cursor-pointer',
            'border-2 border-solid border-select-gray rounded-full',
            selectedRadius === radio ? 'border-gray-600' : '',
          )}
          style={{
            width: `${outlineSize}px`,
            height: `${outlineSize}px`,
          }}
          onClick={() => callback(radio)}
        >
          <div
            className={twMerge(
              'bg-select-gray rounded-full',
              selectedRadius === radio ? 'bg-gray-600' : '',
            )}
            style={{
              width: `${radio}px`,
              height: `${radio}px`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
}
