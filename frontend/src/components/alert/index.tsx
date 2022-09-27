interface ChatProps {
  setShowAlert?: any;
  showAlert: boolean;
  alertMessage: any;
}
export function Alert({ setShowAlert, showAlert, alertMessage }: ChatProps) {

  return (
    <div
      onClick={() => setShowAlert(false)}
      className={`absolute border-[2px] border-white top-2 bg-[#0056DF] items-start drop-shadow-customShadow duration-100 ${showAlert ? 'flex' : 'hidden'} justify-between w-[500px] pl-4 pr-[40px] items-center  h-[80px] z-50 rounded-lg`}>
      <div className=" flex flex-col">
        <span className="font-semibold text-lg text-white"
          >{alertMessage.title}</span>
        <p className="text-sm font-normal text-[#E5EFFF] mt-[-4px]"
          >{alertMessage.description}</p>
      </div>
      <button className="text-white"
        >X</button>
    </div>
  );
}
