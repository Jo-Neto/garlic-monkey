import { twMerge } from 'tailwind-merge';

interface ColorsProps {
  colors: { name: string; hex: string }[];
  callback: (arg: string) => void;
}

export function Colors({ colors, callback }: ColorsProps) {
  return (
    <div className="grid grid-flow-row grid-cols-3 w-24 h-fit">
      {colors.map(({ name, hex }) => (
        <div
          key={name}
          className={twMerge('w-5 h-5 m-1')}
          style={{
            backgroundColor: hex,
          }}
          onClick={() => callback(hex)}
        ></div>
      ))}
    </div>
  );
}
