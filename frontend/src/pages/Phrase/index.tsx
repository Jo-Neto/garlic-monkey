import { GamePage } from '../../layout/GamePage';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';

export function Phrase() {
  return (
  <GamePage>
    <div className="animate-wiggle mb-[1rem]">
      <img
        src="/assets/images/bigLogo.png"
        width={390}
        height={300}
        alt="Garlic Monkey logo" />
    </div>
    <span className="defaultSpan mb-5 text-3xl"
      >ESCREVA UMA FRASE</span>
    <div className='flex flex-row'>
      <Input className='w-[30rem] mr-3'></Input>
      <div className='flex flex-row justify-center items-center bg-white w-[8rem] h-[2.5rem] rounded-[0.25rem] drop-shadow-customShadow duration-100 hover:cursor-pointer hover:scale-105'>
        <span className='defaultSpan'
          >PRONTO</span>
        <Button
          className='ml-[1rem]'
          icon={{ src: '/assets/icons/go.png', size: 22 }} />
      </div>  
    </div>

    
  </GamePage>
)}