import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { GamePage } from '../../layout/GamePage';

export function Home() {
  return (
    <GamePage>
      <div className="animate-wiggle">
        <img
          src="/assets/images/logo.png"
          width={250}
          height={227}
          alt="Garlic Monkey logo"
        />
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col items-center w-[38rem] h-fit gap-5 opacity-50 border-2 border-opacity-50 rounded-[0.625rem]">
          <span>ESCOLHA UM NICKNAME</span>
          <Input />
          <span>ESCREVA O CODIGO DA SALA OU CRIE A SUA</span>
          <div className="flex flex-row">
            <Input />
            <Button icon={{ src: '/assets/icons/go.png', size: 22 }} />
          </div>
          <Button icon={{ src: '/assets/icons/go.png', size: 22 }}>
            CRIAR SALA
          </Button>
        </div>
        <div className="flex flex-col items-center"></div>
      </div>
    </GamePage>
  );
}
