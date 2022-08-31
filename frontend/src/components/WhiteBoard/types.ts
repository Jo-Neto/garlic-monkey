export const Sizes = {
  '4/3': { width: 400, height: 300 },
  '16/8': { width: 1600, height: 800 },
  '16/9': { width: 1600, height: 900 },
};

export interface WhiteBoardProps {
  radius: number;
  color: string;
  size: keyof typeof Sizes;
}
