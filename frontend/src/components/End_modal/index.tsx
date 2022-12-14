interface ChatProps {
    endModal?: boolean;
    setEndModal: any;
    sender: any;
    socket: WebSocket | undefined;
    setScreen: any;
    kickerCount: number;
}
export function EndModal({ endModal, setEndModal, sender, socket, setScreen, kickerCount }: ChatProps) {
    return (
        <div className={`w-[100vw] absolute h-[100vh] ${endModal ? 'flex' : 'hidden'}  items-center justify-center `}>
            <div className={`mb-20 border-[4px] border-white flex-col bg-cyan-300 items-center drop-shadow-customShadow duration-100 flex justify-center w-[700px] pl-4 pr-[40px] h-[400px] z-50 rounded-2xl`} >
                <span className="font-semibold text-[80px] !text-white defaultSpan"
                  >Fim de jogo!!</span>
                <div className="flex mt-[100px] gap-4">
                    <button
                      onClick={() => {
                        sender(true);
                        setEndModal(false);
                      }}
                      className="flex flex-row justify-center items-center bg-white w-[10rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105" >
                      <img 
                        className='mr-1' 
                        src={'/assets/icons/Resetar.png'} 
                        width={22} 
                        height={22} />
                      <span
                        >Jogar novamente</span>
                    </button>
                    <button
                        onClick={() => {
                            setEndModal(false);
                            socket?.close(1000);
                            setScreen(0);
                        }}
                        className="flex ml-8 flex-row justify-center items-center bg-white w-[10rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105">
                        <img 
                          className='mr-1' 
                          src={'/assets/icons/Desfazer.png'} 
                          width={22} 
                          height={22} />
                      <span
                        >Voltar ao inicio</span> 
                    </button>
                  </div>
                  <span className="font-semibold text-[23px] !text-white defaultSpan mt-12">{kickerCount} segundos para ser kickado, se decide a?? irm??o!</span>
            </div>
        </div>
    );
}
