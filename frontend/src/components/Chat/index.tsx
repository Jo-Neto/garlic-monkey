interface ChatProps {
  user: string;
  msg: string;
}
export function Chat({user, msg}: ChatProps) {
  return (
    <div className='flex flex-col m-[0.5rem] items-end'>
      {user && (
        <div className="h-[1.75rem] px-[1rem] flex flex-col rounded-tr-[60rem] rounded-tl-full bg-white/25 rounded-r-md items-center justify-center">
          <span className="text-white text-xl font-black uppercase">{user}</span>
        </div>)
      }
      <div className="p-1 min-w-full flex flex-col rounded-x-full bg-white/25 rounded-l-md items-center justify-center">
        <span className='bg-[#000000]/50 text-sm w-full text-white p-1 rounded'>{msg}</span>
      </div>
    </div>
  );
}
