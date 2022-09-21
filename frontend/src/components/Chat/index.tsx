interface ChatProps {
  user: string;
  msg: string;
}
export function Chat({user, msg}: ChatProps) {
  return (
    <div className='flex flex-col m-[1rem] items-end'>
      {user && (
        <div className="h-[2.2rem] w-[8rem] flex flex-col rounded-tr-[60rem] rounded-tl-full bg-white/25 rounded-r-md items-center justify-center">
          <span className="text-white text-xl font-black">{user}</span>
        </div>)
      }
      <div className="p-2 flex flex-col rounded-x-full bg-white/25 rounded-l-md items-center justify-center">
        <span className='bg-[#000000]/50 w-full pl-3 text-white p-1 rounded'>{msg}</span>
      </div>
    </div>
  );
}
