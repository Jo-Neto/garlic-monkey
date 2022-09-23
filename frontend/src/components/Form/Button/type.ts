import { ReactNode } from 'react';

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon?: {type?: string; src?: string; size?: number; node?: ReactNode };
};
