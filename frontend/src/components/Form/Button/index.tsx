import { ButtonProps } from './type';

export function Button({ icon, children, ...props }: ButtonProps) {
  return (
    <button {...props}>
      {icon && <img src={icon.src} width={icon.size} height={icon.size} />}
      {children}
    </button>
  );
}

export function Buttons({ icon, children, type}: ButtonProps) {
  return (
    <button type={type}>
      <div className="flex flex-row justify-center items-center bg-white w-[10rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105">
        {children}
        {icon && <img className='ml-1' src={icon.src} width={icon.size} height={icon.size} />}
      </div>
    </button>
  );
}
