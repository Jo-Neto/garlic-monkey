import { useState, useEffect } from "react";

interface ChatProps {
  owner: string;
  data: string;
  img: boolean;
}
export function Final({ owner, data, img }: ChatProps) {
  const [itemsEnd, setItemsEnd] = useState("items-start");
  const [rounded, setRounded] = useState("rounded-tl-[200rem] rounded-tr-full pl-2");
  const [roundedLast, setRoundedLast] = useState("rounded-r-md");
  const [textColor, settextColor] = useState("text-brown");
  
  if (!data) data = "vazio"

  useEffect(() => {
    if (!img) {
      setItemsEnd('items-end');
      setRounded('rounded-tr-[200rem] rounded-tl-full pl-4');
      setRoundedLast("rounded-l-md")
      settextColor("text-[#fff]");
    }
  })

  const testingNull = (type: string, phrase: string) => {
    let aux = phrase;
    if (type == "URL") {
      if (aux.substring(0, 10) == "data:image") {
        aux = phrase
      } else {
        aux = "/assets/images/escreva.png";
      }
    }
    return aux;
  }

  return (
    <div className={`flex flex-col m-[0.5rem] ${itemsEnd}`}>
      { owner && (
        <div className={`h-[1.5rem] px-[1rem] pt-1 flex flex-col ${rounded} bg-white/25 items-center justify-center`}>
          <span className={`${textColor} text-sm font-black`}
            >{owner}</span>
        </div>)
      }
      <div className={`p-1 min-w-full flex flex-col bg-white/25 ${roundedLast} items-center justify-center`}>
        <span className='bg-[#000000]/50 text-sm w-full text-white p-1 rounded'
        >{
          img ? 
            <img
              className="top-5"
              src={testingNull("URL", data)}
              width={350}
              height={200}
              alt="Garlic Monkey logo"
            /> : data
        }</span>
      </div>
    </div>
  );
}
