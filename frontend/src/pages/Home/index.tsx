import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { GamePage } from '../../layout/GamePage';
import { Players } from '../Players/index';
import { PlayerIcon } from '../../components/PlayerIcon';

export function Home() {

  const players: { nick: string, photo: string }[] = []

  const [nick, setNick] = useState('');
  const [room, setRoom] = useState('');
  const [screen, setScreen] = useState(0);
  const [socket, setSocket] = useState<WebSocket>();


  const onMessage = useCallback((message: any) => {
    const data = JSON.parse(message?.data);
    if (!Object.hasOwn(data, 'msgType')) {
      return;
    }
    console.log(data);
    if (data.msgType === 'playerUpdate') {
      players.push({
        nick: data.msgContent.nick, photo: ""
      })
      console.log(players);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", onMessage);

      return () => {
        socket.removeEventListener("message", onMessage);
      };
    }
  }, [socket, onMessage, players]);


  if (screen === 0) {
    return (
      <GamePage>
        <div className="animate-wiggle mb-[1rem]">
          <img
            src="/assets/images/logo.png"
            width={250}
            height={227}
            alt="Garlic Monkey logo"
          />
        </div>
        <div className='flex flex-colum items-center'>
          <div className="flex flex-row">
            <div className="flex flex-col items-center w-[30rem] h-fit gap-5 rounded-[0.625rem]">
              <span className='defaultSpan'
              >ESCOLHA UM NICKNAME</span>
              <Input value={nick} onChange={(e) => setNick(e.target.value)} />
              <span className='defaultSpan'
              >ESCREVA O CODIGO DA SALA OU CRIE A SUA</span>
              <div className="flex flex-row">
                <Input className='ml-[2.2rem]' value={room} onChange={(e) => setRoom(e.target.value)} />
              </div>
              <div className='flex flex-row justify-center items-center bg-white w-[10rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105'>
                <Button
                  className='mr-[1rem]'
                  onClick={() => {
                    let a = new WebSocket("wss://localhost:9999", [room, nick]);
                    setSocket(a);
                    setScreen(1);
                  }}
                  icon={{ src: '/assets/icons/go.png', size: 22 }} />
                ENTRAR
              </div>
            </div>
            <div className="flex flex-col items-center"></div>
          </div>
          <div className='text-center flex flex-col items-center w-[15rem] border-solid border-2 border-black/[0.75] rounded-[0.25rem] p-[1.5rem]'>
            <p className="defaultSpan mb-[1rem] uppercase"
            >Como Jogar</p>
            <span className='text-[0.75rem]'
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia esse tempore dolorum quis voluptas. Eligendi repellendus voluptatibus facilis doloremque maxime. Dolores quae vero dolor quo nesciunt optio excepturi nemo doloremque?
            </span>
          </div>
        </div>
      </GamePage>
    );
  } else if (screen === 1) {
    return (
      <GamePage className='flex  justify-between'>
        <div className='flex flex-row justify-between align-middle items-center  w-[90%]'>
          <img
            className="top-5"
            src="/assets/images/logo.png"
            width={150}
            height={116}
            alt="Garlic Monkey logo"
          />
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
                  players.map(element => {
                    return <PlayerIcon nick={element.nick} photo={element.photo} />
                  })
                }
              </div>
            </div>
          </div>
          <div className="border-8 border-select-brown rounded-md w-[30rem]">
            chat
          </div>
        </div>
        <div className="flex flex-row">
          <div className='flex flex-row justify-center items-center bg-white w-[7rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105 mr-10'
            onClick={() => {
              socket.send(JSON.stringify({
                'msgType': 'participationStatus',
                'msgContent': true
              }));
            }}
          >
            <span className="defaultSpan"
            >JOGAR!</span>
          </div>
          <div className='flex flex-row justify-center items-center bg-white w-[10rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105'
            onClick={() => {
              socket.send(JSON.stringify({
                'msgType': 'participationStatus',
                'msgContent': false
              }));
            }}
          >
            <span className="defaultSpan"
            >SÓ CHAT!</span>
          </div>
        </div>
      </GamePage>)
  }
}
