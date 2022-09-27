import { useState, useEffect, useRef } from "react";

interface ChatProps {
  user: string;
  msg: string;
  chatUser: boolean;
}
export function Chat({user, msg, chatUser}: ChatProps) {
  const [itemsEnd, setItemsEnd] = useState("items-start");
  const [rounded, setRounded] = useState("rounded-tl-[200rem] rounded-tr-full pl-2");
  const [roundedLast, setRoundedLast] = useState("rounded-r-md");
  const [textColor, settextColor] = useState("text-brown");

  useEffect(() => {
    if (chatUser){
      setItemsEnd('items-end');
      setRounded('rounded-tr-[200rem] rounded-tl-full pl-4');
      setRoundedLast("rounded-l-md")
      settextColor("text-[#fff]");
    }
  })

  return (
    <div className={`flex flex-col m-[0.5rem] ${itemsEnd}`}>
      {
        user && (
          <div className={`h-[1.5rem] px-[1rem] pt-1 flex flex-col ${rounded} bg-white/25 items-center justify-center`}>
            <span className={`${textColor} text-sm font-black`}
              >{user}</span>
          </div>
      )}
      <div className={`p-1 min-w-full flex flex-col bg-white/25 ${roundedLast} items-center justify-center`}>
        <span className='bg-[#000000]/50 text-sm w-full text-white p-1 rounded'
          >{msg}</span>
      </div>
    </div>
  );
}
