import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { GamePage } from '../../layout/GamePage';
import { Players } from '../Players/index';
import { Chat } from '../../components/Chat';
import { PlayerIcon } from '../../components/PlayerIcon';
import { Player } from '../../components/Player';
import { WhiteBoard } from '../../components/Game/WhiteBoard';

/////////////////////////////////////////////// White Board imports //
import CanvasDraw from 'react-canvas-draw';
import { Actions } from '../../components/Game/Actions';
import { Colors } from '../../components/Game/Colors';
import { ColorObj } from '../../components/Game/Colors/type';
import { Radius } from '../../components/Game/Radius';
import {
  WhiteBoardProps,
  CanvasSizes,
} from '../../components/Game/WhiteBoard/types';
///////////////////////////////////////////////

export function Home() {
  const [players, setPlayers] = useState<{ nick: string; photo: string }[]>([]);
  const [inputData, setInputData] = useState('');
  const [nick, setNick] = useState('');
  const [room, setRoom] = useState('1');
  const [message, setMessage] = useState('');
  const [randomPhrase, setRandomPhrase] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { user: string; msg: string }[]
  >([]);
  const [screen, setScreen] = useState<Number>(3);
  const [socket, setSocket] = useState<WebSocket>();

  const [timer, setTimer] = useState<any>(15);
  let trueTime = 15;
  let timerID = 0;
  function timerFn() {
    setTimer(trueTime);
    if (trueTime === 0) {
      clearInterval(timerId);
      setTimer(0);
    } else {
      setTimer(trueTime);
      trueTime--;
    }
  }

  let isScreenDescription = false;
  function screenSetter(whichScreen: number) {
    isScreenDescription = !isScreenDescription;
    setScreen(whichScreen);
  }

  const onMessage = useCallback((message: any) => {
    const data = JSON.parse(message?.data);
    console.log(data);

    if (!Object.hasOwn(data, 'msgType')) {
      return;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //+------------------------------------------------------------------+
    //|                           LINE LOGIC                             |
    //+------------------------------------------------------------------+
    if (data.msgType === 'playerUpdate') {
      if (data.msgContent.updateType === 'in') {
        setPlayers((prevPlayers) => [
          ...prevPlayers,
          { nick: data.msgContent.nick, photo: '' },
        ]);
        //console.log(players);
      }
      if (data.msgContent.updateType === 'out') {
        setPlayers((prevPlayers) =>
          prevPlayers.filter((el) => {
            if (el.nick !== data.msgContent.nick) return el;
          }),
        );
        //console.log(players);
      }
    } else if (data.msgType === 'playerRow') {
      //console.log(data.msgContent);

      let activePlayers = data.msgContent.activeNick.filter(function (el: any) {
        //console.log(el)
        if (el !== null) return el;
      });

      activePlayers = activePlayers.map(function (el: any) {
        return { nick: el, photo: '' };
      });
      setPlayers(activePlayers);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //+------------------------------------------------------------------+
    //|                            CHAT LOGIC                            |
    //+------------------------------------------------------------------+
    else if (data.msgType === 'chatUpdate') {
      setChatMessages((prevMessage) => [
        ...prevMessage,
        { user: data.msgContent.nick, msg: data.msgContent.msgContent },
      ]);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //+------------------------------------------------------------------+
    //|                           TIMER LOGIC                            |
    //+------------------------------------------------------------------+
    else if (data.msgType === 'timerUpdate') {
      if (data.msgContent.msgContent === 'timerStart') {
        trueTime = 30;
        timerID = setInterval(timerFn, 1000);
      } else if (data.msgContent.msgContent === 'timerStop') {
        clearInterval(timerId);
        setTimer(15);
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //+------------------------------------------------------------------+
    //|                            GAME LOGIC                            |
    //+------------------------------------------------------------------+
    else if (data.msgType === 'gameUpdate') {
      if (data.msgContent.update === 'gameStart') {
        //condition true when game starting
        setScreen(2);
      } else if (data.msgContent.update === 'roundChange') {
        //condition true when new round begins
        console.log('new round = ' + data.msgContent.newRound); //condition true when new round begins
        if (!isScreenDescription) screenSetter(3);
        else if (isScreenDescription) screenSetter(4);

      } else if (data.msgContent.update === 'roundInfo') {
        console.log('roundInfo below: '); //condition true when received data from previous player
        console.log(data.msgContent);
        setRandomPhrase(data.msgContent.data.data);
      } else if (data.msgContent.update === 'gameEnd') {
        //condition true when game ends
        console.log('game ended, final data below');
        console.log(data.msgContent.finalData); //this object has everything from the whole game of all players
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //+------------------------------------------------------------------+
    //|                       BACK-END REPORTS                           |
    //+------------------------------------------------------------------+
    else if (data.msgType === 'devReport') {
      console.log(
        '===========================================================================================',
      );
      console.log('WARNING, RECEIVED DEV REPORT FROM BACK-END, DATA BELOW: ');
      console.log(data.msgContent.report);
      console.log(
        '===========================================================================================',
      );
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }, []);

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', onMessage);

      return () => {
        socket.removeEventListener('message', onMessage);
      };
    }
  }, [socket, onMessage, players]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                           HOME PAGE                              |
  //+------------------------------------------------------------------+

  ///////////////////////////////////////////////////////////////// White Board Functions //
  const COLORS = [
    { name: 'red', hex: '#FF0000' },
    { name: 'blue', hex: '#0000FF' },
    { name: 'yellow', hex: '#FFFF00' },
    { name: 'green', hex: '#008000' },
    { name: 'orange', hex: '#FF7A00' },
    { name: 'cyan', hex: '#00FFF0' },
    { name: 'purple', hex: '#800080' },
    { name: 'pink', hex: '#FF00E5' },
    { name: 'brown', hex: '#800000' },
    { name: 'white', hex: '#FFFFFF' },
    { name: 'gray', hex: '#808080' },
    { name: 'black', hex: '#000000' },
  ];

  const SIZES = [1, 5, 10, 15, 20, 25];
  const [canvasSize, setCanvasSize] = useState<CanvasSizes>({
    width: 500,
    height: 500,
  });
  const [selectedColor, setSelectedColor] = useState<ColorObj>(COLORS[11]);
  const [selectedRadius, setSelectedRadius] = useState<number>(SIZES[2]);
  const [gradient, setGradient] = useState<number>(100);
  const ContainerRef = useRef<HTMLDivElement>(null);
  const WhiteBoardRef = useRef<CanvasDraw>(null);

  useEffect(() => {
    const actualWidth = ContainerRef.current?.offsetWidth;
    const newWidth = actualWidth && actualWidth * 0.7;
    const newHeight = newWidth && newWidth * (1 / (16 / 9));
    const size = { width: newWidth, height: newHeight };
    console.log(size);
    setCanvasSize(size);
  }, []);

  function undo() {
    WhiteBoardRef.current?.undo();
  }

  function resetCanvas() {
    WhiteBoardRef.current?.clear();
  }

  const parseToURL = () => {
    // @ts-ignore: Unreachable code error
    const dataUrl = WhiteBoardRef.current?.getDataURL('svg', false, '#FFFFFF');
    return dataUrl;
  };

  async function sendToBack() {
    const link = await parseToURL();
    socket.send(
      JSON.stringify({
        msgType: 'newData',
        msgContent: link,
      }),
    );
  }

  function addTransparency(value: string): string {
    const decimalValue = Math.round((gradient * 255) / 100);
    let hexValue;
    if (gradient < 7) {
      hexValue = '0' + decimalValue.toString(16).toUpperCase();
    } else {
      hexValue = decimalValue.toString(16).toUpperCase();
    }
    return value + hexValue;
  }

  ///////////////////////////////////////////////////////////////////////////////////////

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
        <div className="flex flex-colum items-center">
          <div className="flex flex-row">
            <div className="flex flex-col items-center w-[30rem] h-fit gap-5 rounded-[0.625rem]">
              <span className="defaultSpan"
                >ESCOLHA UM NICKNAME</span>
              <Input
                className="normal-case"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
              />
              <span className="defaultSpan"
                >ESCREVA O CODIGO DA SALA OU CRIE A SUA</span>
              <div className="flex flex-row">
                <Input value={room} onChange={(e) => setRoom(e.target.value)} />
              </div>
              <div className="flex flex-row justify-center items-center bg-white w-[10rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105">
                <Button
                  className="mr-[1rem]"
                  onClick={() => {
                    let a = new WebSocket('wss://localhost:9999', [room, nick]);
                    setSocket(a);
                    setScreen(1);
                  }}
                  icon={{ src: '/assets/icons/go.png', size: 22 }}
                />
              <span
                >ENTRAR</span> 
              </div>
            </div>
            <div className="flex flex-col items-center"></div>
          </div>
          <div className="text-center flex flex-col  bg-gradient-to-r from-white/[12%] to-white/25 items-center w-[15rem] border-solid border-2 border-white/[0.50] rounded-1 p-[1.5rem]">
            <p className="defaultSpan mb-[1rem] uppercase"
              >Como Jogar</p>
            <span className="text-[0.75rem]"
              >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia esse tempore dolorum quis voluptas. Eligendi repellendus voluptatibus facilis doloremque maxime. Dolores quae vero dolor quo nesciunt optio excepturi nemo doloremque?</span>
          </div>
        </div>
      </GamePage>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                           LINE PAGE                              |
  //+------------------------------------------------------------------+
  else if (screen === 1) {
    return (
      <GamePage className="flex justify-between">
        <div className="flex flex-row justify-between align-middle items-center  w-[90%]">
          <img
            className="top-5"
            src="/assets/images/logo.png"
            width={150}
            height={116}
            alt="Garlic Monkey logo"
          />
          <div className="flex flex-col text-center">
            <span className="defaultSpan uppercase"
              >Codigo de sala</span>
            <span className="defaultSpan uppercase"
              >{room}</span>
          </div>
          <div className="text-[80px] bold"
            >{timer}</div>
        </div>
        <div className="flex flex-row h-[20rem] w-[45rem] justify-between">
          <div className="flex flex-col w-[14rem] border-solid border-2 border-white/[0.75] bg-gradient-to-b from-black/25 to-black/50 rounded-l-[1rem]">
            <div className="flex flex-col items-center">
              <span className="defaultSpan uppercase mt-[1rem]"
                >JOGADORES 1</span>
              <div className="flex flex-col gap-2 mt-[1rem]">
                <Player players={players}></Player>
              </div>
            </div>
          </div>
          <div className="border-solid border-2 p-2 border-white/[0.75] rounded-r-md w-[30rem] bg-gradient-to-r from-black/[12%] to-black/25 flex flex-col">
            <div className="h-full chatBox overflow-scroll overflow-x-hidden">
              {
                chatMessages.map((el) => {
                  if (el.user === nick)
                    return <Chat chatUser={true} user={el.user} msg={el.msg} />;
                  return <Chat chatUser={false} user={el.user} msg={el.msg} />;
                })
              }
            </div>
            <div className=" inputs flex flex-row ml-2 w-[30rem]">
              <Input
                className="w-[27rem] h-[2rem] normal-case"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                className="ml-1"
                icon={{ src: '/assets/icons/go.png', size: 22 }}
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      msgType: 'chatNew',
                      msgContent: message,
                    }),
                  );
                  setMessage('');
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row justify-center items-center bg-white w-[7rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105 mr-10">
            <span
              className="defaultSpan"
              onClick={() => {
                socket.send(
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
                socket.send(
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
              icon={{ src: '/assets/icons/go.png', size: 22 }}
            />
          </div>
        </div>
      </GamePage>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                 GAME PAGE - DESCRIPTION ONLY                     |
  //+------------------------------------------------------------------+
  else if (screen === 2) {
    return (
      <GamePage>
        <div className="animate-wiggle mb-[1rem]">
          <img
            src="/assets/images/bigLogo.png"
            width={390}
            height={300}
            alt="Garlic Monkey logo"
          />
        </div>
        <span className="defaultSpan mb-5 text-3xl"
          >ESCREVA UMA FRASE</span>
        <div className="flex flex-row">
          <Input
            className="w-[30rem] mr-2"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
          <div
            className="flex flex-row justify-center items-center bg-white w-[8rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105"
            onClick={() => {
              console.log('click received');
              socket.send(
                JSON.stringify({
                  msgType: 'newData',
                  msgContent: inputData,
                }),
              );
              setInputData('');
            }}
          >
            <span className="defaultSpan"
              >PRONTO</span>
            <Button
              className="ml-[1rem]"
              icon={{ src: '/assets/icons/go.png', size: 22 }}
            />
          </div>
        </div>
      </GamePage>
    );
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                     GAME PAGE - DRAWING                          |
  //+------------------------------------------------------------------+
  else if (screen === 3) {
    return (
      <GamePage>
        <p
          >Desenhe essa frase bizonha:</p>
        <span>{randomPhrase}</span>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <div
          ref={ContainerRef}
          className="flex flex-col items-center w-full max-w-7xl h-fit"
        >
          <div className="flex flex-row items-center justify-between">
            <Colors
              title="CORES"
              colors={COLORS}
              callback={setSelectedColor}
              selectedColor={selectedColor}
            />
            <div className="shadow-md border-8 border-[#3F1802] rounded-md">
              <CanvasDraw
                ref={WhiteBoardRef}
                brushColor={addTransparency(selectedColor.hex)}
                loadTimeOffset={2}
                hideGrid={true}
                hideInterface={true}
                lazyRadius={5}
                brushRadius={selectedRadius}
                canvasHeight={canvasSize.height}
                canvasWidth={canvasSize.width}
                enablePanAndZoom
              />
            </div>
            <Radius
              radius={SIZES}
              callback={setSelectedRadius}
              selectedRadius={selectedRadius}
              selectedColor={selectedColor}
            />
          </div>
          <div className="flex flex-row ">
            <Actions
              functions={[
                { name: 'Reset', callback: () => resetCanvas() },
                { name: 'Desfazer', callback: () => undo() },
                { name: 'Send', callback: () => sendToBack() },
                //{ name: 'Salvar', callback: () => print() },
              ]}
            />
            <input
              className="cursor-pointer"
              type="range"
              min={0}
              max={100}
              step={1}
              value={gradient}
              onChange={(e) => setGradient(Number(e.target.value))}
            />
          </div>
        </div>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <div
          className="flex flex-row"
          onClick={() => console.log('click received')}
        ></div>
      </GamePage>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                GAME PAGE - DESCRIPTION WITH IMAGE                |
  //+------------------------------------------------------------------+
  else if (screen === 4) {
    return (
      <GamePage>
        <div className="animate-wiggle mb-[1rem]">
          <img
            src={randomPhrase}
            width={390}
            height={300}
            alt="Garlic Monkey logo"
          />
        </div>
        <span className="defaultSpan mb-5 text-3xl"
          >ESCREVA UMA FRASE</span>
        <div className="flex flex-row">
          <Input
            className="w-[30rem] mr-2"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
          <div
            className="flex flex-row justify-center items-center bg-white w-[8rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105"
            onClick={() => {
              console.log('click received');
              socket.send(
                JSON.stringify({
                  msgType: 'newData',
                  msgContent: inputData,
                }),
              );
            }}
          >
            <span className="defaultSpan"
              >PRONTO</span>
            <Button
              className="ml-[1rem]"
              icon={{ src: '/assets/icons/go.png', size: 22 }}
            />
          </div>
        </div>
      </GamePage>
    );
  }
}
