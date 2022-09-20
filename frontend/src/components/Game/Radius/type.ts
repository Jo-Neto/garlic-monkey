export type ColorObj = { name: string; hex: string };

export interface RadiusProps {
  radius: number[];
  callback: (arg: number) => void;
  selectedRadius: number;
  selectedColor: ColorObj;
}