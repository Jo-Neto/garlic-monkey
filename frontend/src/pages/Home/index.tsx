//TODO: colocar som
//TODO: auto scroll no chat
//TODO: tirar os console logs do navegador
//TODO: desbagunçar código

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Buttons } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { GamePage } from '../../layout/GamePage';
import { Chat } from '../../components/Chat';
import { Final } from '../../components/final';
import { Alert } from '../../components/alert';
import { EndModal } from '../../components/End_modal';
import { Player } from '../../components/Player';

/////////////////////////////////////////////// White Board imports //
import CanvasDraw from 'react-canvas-draw';
import ReactScrollableFeed from 'react-scrollable-feed';
import { Actions } from '../../components/Game/Actions';
import { Colors } from '../../components/Game/Colors';
import { ColorObj } from '../../components/Game/Colors/type';
import { Radius } from '../../components/Game/Radius';
import { CanvasSizes } from '../../components/Game/WhiteBoard/types';
///////////////////////////////////////////////

export function Home() {
  const [players, setPlayers] = useState<{ nick: string; photo: string }[]>([]);
  const [inputData, setInputData] = useState('');
  const [nick, setNick] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [randomPhraseOrUrl, setRandomPhraseOrUrl] = useState('');
  const [chatMessages, setChatMessages] = useState<{ user: string; msg: string }[]>([]);
  const [finalScreen, setfinalScreen] = useState<{ type: string; owner: string; data: string }[]>([]);
  const [finalPlayer, setFinalPlayer] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', description: '' })
  const [screen, setScreen] = useState<Number>(0);
  const [socket, setSocket] = useState<WebSocket>();
  const [timer, setTimer] = useState<any>(60);
  const [disable, setDisable] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [waiterRound, setwaiterRound] = useState<number>(1);
  const [kicker, setKicker] = useState<number>(60);

  let trueTime: number = 60;
  let timerId: number = 0;
  
  function sender(bool: boolean) {
    setScreen(1);
    socket?.send(
      JSON.stringify({
        msgType: 'participationStatus',
        msgContent: bool,
      }));
  }

  function timerFn() {
    setTimer(trueTime);
    if (trueTime === 0) {
      clearInterval(timerId);
      setTimer(0);
    } else
      trueTime--;
  }

  let isScreenDescription = false; 
  function screenSetter(whichScreen: number) {
    isScreenDescription = !isScreenDescription;
    setScreen(whichScreen);
  }

  const testingNull = (type: string, phrase: string) => {
    let aux: string = phrase;
    if (type == "phrase") {
      if (phrase) aux = phrase;
    } else if (type == "URL") {
      if (aux.substring(0, 10) == "data:image") {
        aux = phrase
      } else {
        aux = "/assets/images/escreva.png";
      }
    }
    return aux;
  }

  let isWaiting: boolean = false;
  let waiterCounter: number = 1;

  function waitingManager(isWaiter: boolean) {
    isWaiting = isWaiter;
  }

  function waitingCountManager(reset: boolean) {
    if (reset)
      waiterCounter = 0;
    waiterCounter++;
    setwaiterRound(waiterCounter);
  }

  let kickerCounter: number = 60;
  let kickerCounterID: number = 0;
  function kickerTimer(): void {
    if (kickerCounter === 0) {
      clearInterval(kickerCounterID);
      kickerCounter = 60;
    } else 
      kickerCounter--;
    setKicker(kickerCounter);
  }



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                    SOCKET LOGIC BEGINNING                        |
  //+------------------------------------------------------------------+  

  const onMessage = useCallback((message: any) => {
    const data = JSON.parse(message?.data);
    if (!Object.hasOwn(data, 'msgType')) return;/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //+------------------------------------------------------------------+
    //|                           LINE LOGIC                             |
    //+------------------------------------------------------------------+
    if (data.msgType === 'playerUpdate') {
      if (data.msgContent.updateType === 'in' && data.msgContent.isOnGame !== null) {
        setPlayers((prevPlayers) => [
          ...prevPlayers,
          { nick: data.msgContent.nick, photo: '' },
        ]);
      }
      if (data.msgContent.updateType === 'out' || data.msgContent.isOnGame === null) {
        setPlayers((prevPlayers) =>
          prevPlayers.filter((el) => {
            if (el.nick !== data.msgContent.nick) return el;
          }),
        );
      }
    }
    else if (data.msgType === 'playerRow') {

      screenSetter(1);
      let activePlayers = data.msgContent.activeNick.filter(function (el: any) {
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
        trueTime = 59;  //MARKUP: description timer
        timerFn();
        if (timerId)
          clearInterval(timerId);
        timerId = setInterval(timerFn, 1000);
      } else if (data.msgContent.msgContent === 'timerStop') {
        clearInterval(timerId);
        trueTime = 60;  //MARKUP: description timer
        timerFn();
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //+------------------------------------------------------------------+
    //|                            GAME LOGIC                            |
    //+------------------------------------------------------------------+
    else if (data.msgType === 'gameUpdate') {
      if (data.msgContent.update === 'gameStart') {
        timerResetter(true);
        if (data.msgContent.type === 'activePlayer') {
          waitingManager(false);
          setScreen(2);
        } else {
          waitingManager(true);
          setScreen(6);
        }
      }

      else if (data.msgContent.update === 'roundInfo' || data.msgContent.data === null) {
        if (isWaiting) {
          waitingCountManager(false);
          return;
        }
        if (!data.msgContent.data) {
          setRandomPhraseOrUrl("Desenho Livre");
        } else {
          setRandomPhraseOrUrl(data.msgContent.data.data);
        }
        setDisable(false);
        timerResetter();
      }

      function timerResetter(firstCall = false) {
        if (timerId) {
          clearInterval(timerId);
          timerId = 0;
          trueTime = 0;
        }
        if (!isScreenDescription) {
          if (firstCall) {
            trueTime = 20;  //MARKUP: first description timer
          }
          else {
            trueTime = 60; //MARKUP: drawing timer
          }
          timerFn();
          timerId = setInterval(timerFn, 1000);
          screenSetter(3);
        } else if (isScreenDescription) {
          trueTime = 20; //MARKUP: description timer
          timerFn();
          timerId = setInterval(timerFn, 1000);
          screenSetter(4);
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //+------------------------------------------------------------------+
    //|                         END GAME LOGIC                           |
    //+------------------------------------------------------------------+

    else if (data.msgType === 'finalData') {
      setScreen(5);
      if (data.msgContent) {
        if (data.msgContent.update === 'requireNewParticipationStatus') {
          kickerCounter--;
          kickerCounterID = setInterval(() => { kickerTimer(); }, 1000);
          waitingManager(true);
          setEndModal(true);
          trueTime = 60;
          timerFn();
          setPlayers([]);
          waitingCountManager(true);
          isScreenDescription = false; 
          setDisable(false);
        }
        else {
          setFinalPlayer(data.msgContent[0]?.owner || '');
          setfinalScreen(data.msgContent || []);
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //+------------------------------------------------------------------+
    //|                       BACK-END REPORTS                           |
    //+------------------------------------------------------------------+
    else if (data.msgType === 'participationFeedback') {
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (data.msgType === 'devReport') {
      console.log('WARNING, RECEIVED DEV REPORT FROM BACK-END, DATA BELOW: ');
    } else {
      console.log('ERROR: -->>>  invalid socket data received, data below:');
    }
  }, []);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                  SOCKET FUNCTIONS INITIALIZER                    |
  //+------------------------------------------------------------------+
  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', onMessage);

      return () => {
        socket.removeEventListener('message', onMessage);
      };
    }
  }, [socket, onMessage]);
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
    // const newWidth = actualWidth && actualWidth * 0.7;
    // const newHeight = newWidth && newWidth * (1 / (16 / 9));
    const newWidth = 600 // actualWidth && actualWidth * 0.7;
    const newHeight = 400 // newWidth && newWidth * (1 / (16 / 9));
    const size = { width: newWidth, height: newHeight };
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
    let link = await parseToURL();
    setDisable(true);
    socket?.send(
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
        <Alert setShowAlert={setShowAlert} showAlert={showAlert} alertMessage={alertMessage} />
        <div className="animate-wiggle mb-[1rem]">
          <img
            src="/assets/images/logo.png"
            width={250}
            height={227}
            alt="Garlic Monkey logo" />
        </div>
        <div className="flex flex-colum items-center">
          <div className="flex flex-row">
            <form
              onSubmit={(e) => {
                e.preventDefault(); 
                
                if ( nick.length >= 10 ){
                  setAlertMessage({ title: 'Nickname com mais de 10 caracteres', description: 'Não foi possível entrar no jogo' });
                  setShowAlert(true);
                } else {
                  let a: WebSocket;
                  try {
                    
                    a = new WebSocket(`wss://66.135.2.21:9999`, [room, nick]);
                  } catch (e) {
                    setAlertMessage({ title: 'Nickname e/ou sala inválido(s)', description: 'Não pode usar caracteres especiais' });
                    setShowAlert(true);
                    return;
                  }
                  //+------------------------------------------------------------------+
                  //|                     SOCKET CLOSE EVENT                           |
                  //+------------------------------------------------------------------+
                  a.onclose = (event) => {
                    if (event.code === 1001) {
                      setScreen(0);
                      setAlertMessage({ title: 'Voce foi kickado', description: 'Voce não decidiu se jogava ou não!' });
                      setShowAlert(true);
                    } else if (event.code === 1002 || event.code === 1003) {
                      setScreen(0);
                      setAlertMessage({ title: 'Nickname inválido', description: 'Não pode usar caracteres especiais' });
                      setShowAlert(true);
                    } else if (event.code === 1013) {
                      setScreen(0);
                      setAlertMessage({ title: 'Partida em andamento', description: 'Não foi possível entrar no jogo' });
                      setShowAlert(true);
                    } else if (event.code === 4003) {
                      setScreen(0);
                      setShowAlert(true);
                      setAlertMessage({ title: 'Nickname existente', description: 'Já existe player com o mesmo nome' });
                      setShowAlert(true)
                    }
                  };
                  //////////////////////////////////////////////////////////////////////////////
                  //////////////////////////////////////////////////////////////////////////////
                  //////////////////////////////////////////////////////////////////////////////
                  setSocket(a);
                  setScreen(1);
                  
                }
              }}
              className="flex flex-col items-center w-[30rem] h-fit gap-5 rounded-[0.625rem]" >
              <span className="defaultSpan"
              >ESCOLHA UM APELIDO</span>
              <Input
                className="normal-case"
                value={nick}
                onChange={(e) => setNick(e.target.value)} />
              <span className="defaultSpan"
              >ESCREVA O CODIGO DA SALA OU CRIE A SUA</span>
              <div className="flex flex-row">
                <Input
                  value={room}
                  onChange={(e) => setRoom(e.target.value)} />
              </div>
              <Buttons
                type="submit"
                icon={{ src: '/assets/icons/go.png', size: 22 }}
                children={<span>ENTRAR</span>} />
            </form>
            <div className="flex flex-col items-center"></div>
          </div>
          <div className="text-justify flex flex-col bg-gradient-to-r from-white/[12%] to-white/25 
          justify-ce w-[15rem] border-solid border-2 border-white/[0.50] rounded-1 p-[1.5rem]">
            <p className="defaultSpan mb-[1rem] uppercase text-center"
              >Como Jogar</p>
            <p className="text-[0.75rem]"
              >1. Aguarde de 4~6 jogadores entrarem na sala.</p>
            <p className="text-[0.75rem]"
              >2. Escreva uma frase para os jogadores desenharem</p>
            <p className="text-[0.75rem]"
              >3. Desenhe a frase de outro jogador.</p>
            <p className="text-[0.75rem]"
              >4. Descreva da melhor forma o desenho que você receber.</p>
            <p className="text-[0.75rem]"
              >5. Repita esse processo até o final do jogo.</p>
          </div>
        </div>
      </GamePage>
    ); //TODO , melhorar o ux do tutorial, dar mais destaque visual, talvez outras coisas???
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                           LINE PAGE                              |
  //+------------------------------------------------------------------+
  else if (screen === 1) {
    return (
      <GamePage className="flex">
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
                  setMessage('');
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
          <div 
          className="flex flex-row justify-center items-center bg-white w-[10rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105"
            onClick={() => {
              socket?.send(
                JSON.stringify({
                  msgType: 'participationStatus',
                  msgContent: false,
                }),
              );
              setMessage('');
            }}
          >
            <span
              className='defaultSpan'>SÓ CHAT!</span>
            <Button
              className="ml-[0.5rem]"
              icon={{ src: '/assets/icons/go.png', size: 22 }} />
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
        <div className='flex flex-col items-end w-[50rem]'>
          <div className='flex flex-col justify-center items-center'>
            <span className='defaultSpan !text-white'
              >Tempo</span>
            <span className='defaultSpan text-[60px] mt-3'
              >{timer}</span>
          </div>
        </div>
        <div className="animate-wiggle mb-[1rem]">
          <img
            src="/assets/images/bigLogo.png"
            width={390}
            height={300}
            alt="Garlic Monkey logo" />
        </div>
        <span className="defaultSpan mb-5 text-3xl"
          >ESCREVA UMA FRASE ENGRAÇADA</span>
        <form
          className='mb-10'
          onSubmit={e => {
            e.preventDefault();
            socket?.send(
              JSON.stringify({
                msgType: 'newData',
                msgContent: inputData,
              }));
            setInputData("")
            setDisable(true);
          }} >
          <fieldset
            disabled={disable}
            className="flex flex-row" >
            <Input
              className="w-[30rem] h-11 mr-2"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)} />
            <Buttons
              type={"submit"}
              className="h-10"
              icon={{ src: '/assets/icons/go.png', size: 22 }}
              children={
                <span className="defaultSpan">PRONTO</span>
              } />
          </fieldset>
        </form>
      </GamePage>
    );
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                     GAME PAGE - DRAWING                          |
  //+------------------------------------------------------------------+
  else if (screen === 3) {
    return ( //TODO , melhorar o ux do "desenhe a frase", deixar mais claro pro player o que ele tem que fazer, destacar, explicar melhor, etc
      <GamePage>
        <div className='flex justify-around items-center w-full'>
          <div className='h-5 flex flex-col items-center'>
            <p
              >Desenhe essa frase bizonha:</p>
            <span
              >{testingNull("phrase", randomPhraseOrUrl)}</span>
          </div>
        </div>
        <div className='flex justify-end items-center w-[50rem]'>
          <div className='flex flex-col items-center'>
            <span className='defaultSpan !text-white'
              >Tempo</span>
            <span className='defaultSpan text-[60px] mt-3'
              >{timer}</span>
          </div>
        </div>
        <div
          ref={ContainerRef}
          className="flex flex-col items-center w-full max-w-7xl h-fit" >
          <div className="flex flex-row items-center justify-between">
            <Colors
              title="CORES"
              colors={COLORS}
              callback={setSelectedColor}
              selectedColor={selectedColor} />
            <div className="shadow-md border-8 border-[#3F1802] rounded-md mb-2">
              <CanvasDraw
                disabled={disable}
                ref={WhiteBoardRef}
                brushColor={addTransparency(selectedColor.hex)}
                loadTimeOffset={2}
                hideGrid={true}
                hideInterface={true}
                lazyRadius={5}
                brushRadius={selectedRadius}
                canvasHeight={canvasSize.height}
                canvasWidth={canvasSize.width}
                enablePanAndZoom />
            </div>
            <Radius
              radius={SIZES}
              callback={setSelectedRadius}
              selectedRadius={selectedRadius}
              selectedColor={selectedColor} />
          </div>
          <div className="flex flex-row ">
            <Actions
              functions={[
                { name: 'Resetar', callback: () => resetCanvas() },
                { name: 'Desfazer', callback: () => undo() },
                { name: 'Enviar', callback: () => sendToBack() },
                //{ name: 'Salvar', callback: () => print() },
              ]} />
            <input
              className="cursor-pointer"
              type="range"
              min={0}
              max={100}
              step={1}
              value={gradient}
              onChange={(e) => setGradient(Number(e.target.value))} />
          </div>
        </div>
        <div
          className="flex flex-row"
          ></div>
      </GamePage>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                GAME PAGE - DESCRIPTION WITH IMAGE                |
  //+------------------------------------------------------------------+
  else if (screen === 4) {  //TODO , melhorar o ux do "escreva uma frase", deixar mais claro pro player o que ele tem que fazer, destacar, explicar melhor, etc
    return (
      <GamePage>
      <div className='flex flex-col items-end w-[50rem]'>
        <div className='flex flex-col justify-center items-center'>
          <span className='defaultSpan !text-white'
            >Tempo</span>
          <span className='defaultSpan text-[60px] mt-3'
            >{timer}</span>
        </div>
      </div>
        <div className="mb-[1rem] shadow-md border-8 border-[#3F1802] rounded-md">
          <img
            className='bg-white'
            src={testingNull("URL", randomPhraseOrUrl)}
            width={canvasSize.width}
            height={canvasSize.height}
            alt="Garlic Monkey logo" />
        </div>
        <span className="defaultSpan mb-5 uppercase text-3xl"
          >descreva essa tentativa de desenho</span>
        <form
          onSubmit={e => {
            e.preventDefault();
            socket?.send(
              JSON.stringify({
                msgType: 'newData',
                msgContent: inputData,
              }));
            setInputData("")
            setDisable(true);
          }} >
          <fieldset
            disabled={disable}
            className="flex flex-row" >
            <Input
              className="w-[30rem] h-11 mr-2"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)} />
            <Buttons
              type={"submit"}
              className="h-10"
              icon={{ src: '/assets/icons/go.png', size: 22 }}
              children={<span className="defaultSpan">PRONTO</span>} />
          </fieldset>
        </form>
      </GamePage>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                       GAME PAGE - END MODAL                      |
  //+------------------------------------------------------------------+
  else if (screen === 5) {
    return (
      <GamePage>
        <EndModal endModal={endModal} sender={sender} setEndModal={setEndModal} socket={socket} setScreen={setScreen} kickerCount = {kicker} />
        <div className="flex flex-row justify-center align-middle items-center mb-10">
          <img
            className="top-5"
            src="/assets/images/logo.png"
            width={150}
            height={116}
            alt="Garlic Monkey logo" />
        </div>
        <div className="flex flex-row h-[22rem] w-[45rem] justify-between">
          <div className="flex flex-col w-[14rem] border-solid border-2 border-white/[0.75] bg-gradient-to-b from-black/25 to-black/50 rounded-l-[1rem]" >
            <div className="flex flex-col items-center">
              <span className="defaultSpan uppercase mt-[1rem]"
                >JOGADORES</span>
              <div className="flex flex-col gap-2 mt-[1rem]">
                <Player players={players} finalPlayer={finalPlayer}></Player>
              </div>
            </div>
          </div>
          <div className="border-solid border-2 p-2 border-white/[0.75] rounded-r-md w-[30rem] bg-gradient-to-r from-black/[12%] to-black/25 flex flex-col">
            <div className="h-full chatBox overflow-scroll overflow-x-hidden">
              {
                finalScreen.map((el, index) => {
                  if (el?.type === 'desc') return <Final img={false} owner={el?.owner} data={el?.data} key={index} />;
                  return <Final img={true} owner={el?.owner} data={el?.data} key={index} />;
                })
              }
            </div>
          </div>
        </div>
      </GamePage>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //+------------------------------------------------------------------+
  //|                           SPECTATOR PAGE                         |
  //+------------------------------------------------------------------+

  else if (screen === 6) {
    return (
      <GamePage>
        <div className='mr-[100px] flex flex-col justify-center items-end w-[50rem]'>
          <div className='flex flex-col items-center'>
            <span className='defaultSpan !text-white'
              >Rodada</span>
            <span className='defaultSpan text-[60px] mt-3'
              >{waiterRound}</span>
          </div>
        </div>
        <div className="animate-wiggle mb-[2.5rem]">
          <img
            src="/assets/images/bigLogo.png"
            width={390}
            height={300}
            alt="Garlic Monkey logo" />
        </div>
        <span className="defaultSpan mb-[100px] text-[50px]"
          >Partida em andamento</span>
      </GamePage>
    )
  }
}
