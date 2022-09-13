import CanvasDraw from 'react-canvas-draw';
import Select from 'react-select';
import { Button } from '../../components/Form/Button';
import { PlayerIcon } from '../../components/PlayerIcon';
import { GamePage } from '../../layout/GamePage';

const options = [
  { value: 4, label: 4 },
  { value: 6, label: 8 },
  { value: 8, label: 8 },
];

export function Players() {
  return (
    <GamePage>
      <img
        className="absolute left-1/2 top-5"
        src="/assets/images/logo.png"
        width={150}
        height={116}
        alt="Garlic Monkey logo"
      />
      <div className="flex flex-row">
        <div className="flex flex-col">
          <Button icon={{ src: '/assets/icons/back.png', size: 22 }}>
            VOLTAR
          </Button>
          <div className="flex flex-col items-center">
            <span>JOGADORES 1/8</span>
            <Select options={options} />
            <PlayerIcon nick={'Teste'} photo={'default'} />
          </div>
        </div>
        <div className="border-8 border-select-brown rounded-md">
          <CanvasDraw
            brushColor={'#808080'}
            loadTimeOffset={2}
            hideGrid={true}
            hideInterface={true}
            lazyRadius={5}
            brushRadius={5}
            canvasHeight={400}
            canvasWidth={600}
            enablePanAndZoom
          />
        </div>
      </div>
      <div className="flex flex-row">
        <Button icon={{ src: '/assets/icons/go.png', size: 22 }}>
          CONVIDAR
        </Button>
        <Button icon={{ src: '/assets/icons/go.png', size: 22 }}>
          INICIAR JOGO
        </Button>
      </div>
    </GamePage>
  );
}
