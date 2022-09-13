import { ButtonProps } from './type';

export function Button({ icon, children, ...props }: ButtonProps) {
  return (
    <button {...props}>
      {icon && <img src={icon.src} width={icon.size} height={icon.size} />}
      {children}
    </button>
  );
}
