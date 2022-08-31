export const Sizes = {
  '4/3': { width: 800, height: 600 },
  '16/8': { width: 800, height: 400 },
  '16/9': { width: 800, height: 45000 },
};

export interface WhiteBoardProps {
  radius: number;
  color: string;
  size: keyof typeof Sizes;
}
