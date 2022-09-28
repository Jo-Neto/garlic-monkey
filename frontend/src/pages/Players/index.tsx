import { Button } from '../../components/Form/Button';
import { PlayerIcon } from '../../components/PlayerIcon';
import { Chat } from '../../components/Chat';
import { GamePage } from '../../layout/GamePage';
import {useState, useContext} from 'react';
import { Player } from '../../components/Player';
import { Input } from '../../components/Form/Input';
import ReactScrollableFeed from 'react-scrollable-feed';

const players:  { nick: string, photo: string }[] = [
  {nick: "Teste",photo: ""}
]



interface Props {
  room: string;
  timer: any;
  UserContext: any;
  nick: string;
  players: { nick: string; photo: string }[];
  chatMessages: { user: string; msg: string }[];
}

export function LinePage({room, timer, UserContext, nick, players, chatMessages} : Props) {
  const socket = useContext<WebSocket>(UserContext);
  const [message, setMessage] = useState('');

  return (
    <GamePage className='flex'>
      <div className="flex flex-row justify-between align-middle items-center mb-10 w-[50rem]" >
        <img
          className="top-5"
          src="/assets/images/logo.png"
          width={150}
          height={116}
          alt="Garlic Monkey logo" />
        <div className="flex flex-col text-center">
          <span className="defaultSpan uppercase"
            >Codigo de sala</span>
          <span className="defaultSpan uppercase"
            >{room}</span>
        </div>
        <div className='flex flex-col items-center'>
          <span className='defaultSpan !text-white'
            >Tempo</span>
          <span className='defaultSpan text-[60px] mt-3'
            >{timer}</span>
        </div>
      </div>
      <div className="flex flex-row h-[20rem] w-[45rem] justify-between mb-2 ">
        <div className="flex flex-col w-[14rem] border-solid border-2 border-white/[0.75] bg-gradient-to-b from-black/25 to-black/50 rounded-l-[1rem]" >
          <div className="flex flex-col items-center">
            <span className="defaultSpan uppercase mt-[1rem]"
              >JOGADORES</span>
            <div className="flex flex-col gap-2 mt-[1rem]">
              <Player players={players}></Player>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between border-solid border-2 p-2 border-white/[0.75] rounded-r-md w-[30rem] bg-gradient-to-r from-black/[12%] to-black/25">
          <ReactScrollableFeed className="chatBox flex flex-col overflow-scroll overflow-x-hidden">
            {
              chatMessages.map((el, index) => {
                if (el.user === nick) return <Chat chatUser={true} user={el?.user} msg={el?.msg} key={index} />;
                return <Chat chatUser={false} user={el?.user} msg={el?.msg} key={index} />;
              })
            }
          </ReactScrollableFeed>
          <form onSubmit={(e) => e.preventDefault()} className="inputs flex flex-row ml-2 w-[30rem]">
            <Input
              className="w-[27rem] h-[2rem] normal-case"
              value={message}
              onChange={(e) => setMessage(e.target.value)} />
            <Button
              className="ml-1"
              icon={{ src: '/assets/icons/go.png', size: 22 }}
              onClick={() => {
                socket?.send(
                  JSON.stringify({
                    msgType: 'chatNew',
                    msgContent: message,
                  }),
                );
              }} />
          </form>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-row justify-center items-center bg-white w-[10rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105 mr-10">
          <span
            className="defaultSpan !w-[200px] text-center"
            onClick={() => {
              socket?.send(
                JSON.stringify({
                  msgType: 'participationStatus',
                  msgContent: true,
                }),
              );
              setMessage('');
            }}
              >QUERO JOGAR!</span>
        </div>
        <div className="flex flex-row justify-center items-center bg-white w-[10rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105">
          <span
            className="defaultSpan"
            onClick={() => {
              socket?.send(
                JSON.stringify({
                  msgType: 'participationStatus',
                  msgContent: false,
                }),
              );
              setMessage('');
            }}
            >SÓ CHAT!</span>
          <Button
            className="ml-[0.5rem]"
            icon={{ src: '/assets/icons/go.png', size: 22 }} />
        </div>
      </div>
    </GamePage>
  );
}
