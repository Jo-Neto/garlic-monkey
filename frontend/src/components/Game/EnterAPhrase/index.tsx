import { GamePage } from '../../../layout/GamePage';
import { Button } from '../../Form/Button';
import { Input } from '../../Form/Input';

export function EnterAPhrase() {
  return (
    <GamePage>
      <img
        src="/assets/images/logo.png"
        alt="Garlic Monkey logo"
        width={387}
        height={301}
      />
      <span className="font-black text-4xl">ESCREVA UMA FRASE</span>
      <div className="flex flex-row">
        <Input className="w-[28.5rem]" />
        <Button icon={{ src: '/assets/icons/go.png', size: 22 }}>PRONTO</Button>
      </div>
    </GamePage>
  );
}
