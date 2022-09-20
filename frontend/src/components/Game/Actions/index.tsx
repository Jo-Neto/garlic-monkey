import { twMerge } from 'tailwind-merge';
import { Button } from '../../Form/Button';

interface ActionsProps {
  functions: { name: string; callback: () => void }[];
}

export function Actions({ functions }: ActionsProps) {
  return (
    <div className="flex flex-row h-fit w-fit">
      {functions.map(({ name, callback }) => (
        <div
          key={name}
          className={twMerge(
            'flex flex-row justify-center items-center bg-white w-[10rem] h-[2rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105 mr-[1rem]',
          )}
          onClick={() => callback()}
        >
          <Button 
          icon={{ src: `/assets/icons/${name}.png`, size: 30 }} />
          <span className='ml-[0.5rem] uppercase text-[#3F1802]'>{name}</span>
        </div>
      ))}
    </div>
  );
}
