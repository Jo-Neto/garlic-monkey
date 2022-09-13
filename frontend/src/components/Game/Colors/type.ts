export type ColorObj = { name: string; hex: string };

export interface ColorsProps {
  title: string;
  colors: ColorObj[];
  callback: (arg: ColorObj) => void;
  selectedColor: ColorObj;
}
