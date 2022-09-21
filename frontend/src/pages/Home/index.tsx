import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { GamePage } from '../../layout/GamePage';
import { Players } from '../Players/index';
import { Chat } from '../../components/Chat';
import { PlayerIcon } from '../../components/PlayerIcon';
import { Player } from '../../components/Player';

export function Home() {
  const [players, setPlayers] = useState<{ nick: string, photo: string }[]>([]);


  const [nick, setNick] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ user: string, msg: string }[]>([]);
  const [screen, setScreen] = useState(0);
  const [socket, setSocket] = useState<WebSocket>();

  const [timer, setTimer] = useState<any>(30);
  let trueTime = 30;
  let timerId = 0;
  function timerFn(){
    console.log("timerFn called");
    setTimer(trueTime);
    if (trueTime === 0) {
      console.log(timerId);
      clearInterval(timerId)
      setTimer(0);
    } else {
      setTimer(trueTime);
      trueTime--;
    }
  }

  const onMessage = useCallback((message: any) => {

    const data = JSON.parse(message?.data);
    console.log(data);

    if (!Object.hasOwn(data, 'msgType')) {
      return;
    }
    if (data.msgType === 'playerUpdate') {
      if (data.msgContent.updateType === 'in') {
        setPlayers(prevPlayers => [...prevPlayers, { nick: data.msgContent.nick, photo: "" }]);
        //console.log(players);
      }
      if (data.msgContent.updateType === 'out') {
        setPlayers(prevPlayers => prevPlayers.filter(el => { if (el.nick !== data.msgContent.nick) return el }));
        //console.log(players);
      }
    } else if (data.msgType === 'playerRow') {
      //console.log(data.msgContent);

      let activePlayers = data.msgContent.activeNick.filter(function (el: any) {
        //console.log(el)
        if (el !== null) return el
      });

      activePlayers = activePlayers.map(function (el: any) {
        return { nick: el, photo: "" }
      })
      setPlayers(activePlayers);
    } else if (data.msgType === 'chatUpdate') {
      setChatMessages(prevMessage => [...prevMessage, { user: data.msgContent.nick, msg: data.msgContent.msgContent }])
    } 
    
    else if (data.msgType === 'gameUpdate') {
      if (data.msgContent.msgContent === 'timerStart') {
        trueTime = 30;
        timerId = setInterval(timerFn, 1000);
      } else if (data.msgContent.msgContent === 'timerStop') {
        console.log(timerId);
        clearInterval(timerId)
        setTimer(30);
      }
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
            >{room}</span>
          </div>
          <div
            className="text-[80px] bold"
          >
            {timer}
          </div>
        </div>
        <div className="flex flex-row h-[20rem] w-[45rem] justify-between">
          <div className="flex flex-col w-[14rem] border-solid border-2 border-white/[0.75] bg-black/50 rounded-l-[1rem]">
            <div className="flex flex-col items-center">
              <span className="defaultSpan uppercase mt-[0.5rem]"
              >JOGADORES 1</span>
              <div className='flex flex-col gap-2 mt-[1rem]'>
                <Player players={players}></Player>
              </div>
            </div>
          </div>
          <div className="border-8 border-select-brown rounded-md w-[30rem] bg-black/25">
            <div className='chatBox'>
              {
                chatMessages.map(el => {
                  return <Chat user={el.user} msg={el.msg} />
                })
              }
            </div>
            <Input className='ml-[2.2rem]' value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button
              onClick={() => {
                socket.send(JSON.stringify({
                  'msgType': 'chatNew',
                  'msgContent': message
                }));
              }}
              icon={{ src: '/assets/icons/go.png', size: 22 }} />
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
              icon={{ src: '/assets/icons/go.png', size: 22 }} />
          </div>
        </div>
      </GamePage>
    )
  }
}
