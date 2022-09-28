import { Button } from '../../components/Form/Button';
import { PlayerIcon } from '../../components/PlayerIcon';
import { Chat } from '../../components/Chat';
import { GamePage } from '../../layout/GamePage';

const players:  { nick: string, photo: string }[] = [
  {nick: "Teste",photo: ""}
]

const chatMessages = [
  {user: "Gustavo", msg: "Lorem sahuhsuahsuhaushauhsusahushuah ssasgyagsyagsgaysgysagsy sausguagsyags adsdy"}
]

export function Players(socket: WebSocket) {
  return (
    <GamePage className='flex  justify-between'>
      <div className='flex flex-row justify-between align-middle items-center  w-[90%]'>
        <div className='flex flex-row justify-center items-center bg-white w-[7rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105'>
          <Button 
            className='mr-[0.5rem]' 
            icon={{ src: '/assets/icons/goFlip.png', size: 22 }}/>
          <span className="defaultSpan"
            >VOLTAR</span> 
        </div>
        <img
          className="top-5"
          src="/assets/images/logo.png"
          width={150}
          height={116}
          alt="Garlic Monkey logo" />
        <div className='flex flex-col text-center' >
          <span className="defaultSpan uppercase"
            >Codigo de sala</span>
          <span className="defaultSpan uppercase"
            >6565</span>
        </div>
      </div>
      <div className="flex flex-row h-[20rem] w-[45rem] justify-between">
        <div className="flex flex-col w-[14rem] border-solid border-2 border-white/[0.75] bg-black/50 rounded-l-[1rem]">   
          <div className="flex flex-col items-center">
            <span className="defaultSpan uppercase mt-[0.5rem]"
              >JOGADORES 1</span>
            <div className='flex flex-col gap-2 mt-[1rem]'>
              { 
                players.map( (element, index) => {
                  return <PlayerIcon nick={element?.nick} photo={element?.photo} />
                })
              }
            </div>  
          </div>
        </div>
        <div className="border-8 border-select-brown rounded-md w-[30rem] bg-black/25">
          <div className='chatBox'>
            { 
              chatMessages.map( (el, index) => {
                return <Chat user={el?.user} msg={el?.msg} key={index} />
              })
            }
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className='flex flex-row justify-center items-center bg-white w-[7rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105 mr-10'>
          <span className="defaultSpan"
            >PRONTO</span> 
        </div>
        <div className='flex flex-row justify-center items-center bg-white w-[10rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105'>
          <span className="defaultSpan"
            >INICIAR JOGO</span> 
          <Button 
            className='ml-[0.5rem]' 
            icon={{ src: '/assets/icons/go.png', size: 22 }}/>
        </div>
      </div>
    </GamePage>
  );
}
