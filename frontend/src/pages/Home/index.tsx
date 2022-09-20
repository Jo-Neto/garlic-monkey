import { useState } from 'react';
import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { GamePage } from '../../layout/GamePage';
import { WaitRoom } from '../Players/index';

export function Home() {
  const [nick, setNick] = useState('');
  const [room, setRoom] = useState('');
  const [screen, setScreen] = useState(0);
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
                  onClick={() => { setScreen(0);/*socket = new WebSocket("wss://localhost:9999",[room, nick]);*/ }}
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
    return (<WaitRoom></WaitRoom>)
  }
}
