import { twMerge } from 'tailwind-merge';

interface RadiusProps {
  radius: number[];
  callback: (arg: number) => void;
}

export function Radius({ radius, callback }: RadiusProps): JSX.Element {
  const outlineSize = Math.max(...radius) + 10;

  return (
    <div className="flex flex-col items-center w-24 h-fit">
      {radius.map((radio) => (
        <div
          key={radio}
          className={twMerge(
            'flex items-center justify-center',
            'border-2 border-solid border-select-gray rounded-full w-radius',
          )}
          style={{
            width: `${outlineSize}px`,
            height: `${outlineSize}px`,
          }}
          onClick={() => callback(radio)}
        >
          <div
            className={twMerge('bg-select-gray rounded-full w-radius')}
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
