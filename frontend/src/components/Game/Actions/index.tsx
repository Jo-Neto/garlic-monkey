import { twMerge } from 'tailwind-merge';

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
            'w-fit p-3 m-1 rounded-md bg-select-gray cursor-pointer',
          )}
          onClick={() => callback()}
        >
          {name}
        </div>
      ))}
    </div>
  );
}
