import { twMerge } from 'tailwind-merge';

interface ColorsProps {
  colors: string[];
  callback: (arg: string) => void;
}

const allColors = {
  white: '#FFFFFF',
  silver: '#C0C0C0',
  gray: '#808080',
  black: '#000000',
  red: '#FF0000',
  brown: '#800000',
  yellow: '#FFFF00',
  olive: '#808000',
  lime: '#00FF00',
  green: '#008000',
  aqua: '#00FFFF',
  teal: '#008080',
  blue: '#0000FF',
  navy: '#000080',
  fuchsia: '#FF00FF',
  purple: '#800080',
};

export function Colors({ colors, callback }: ColorsProps) {
  return (
    <div className="grid grid-flow-row grid-cols-3 w-24 h-fit">
      {colors.map((color) => (
        <div
          key={color}
          className={twMerge('w-5 h-5 m-1', `bg-select-${color}`)}
          onClick={() => callback(allColors[color as keyof typeof allColors])}
        ></div>
      ))}
    </div>
  );
}
