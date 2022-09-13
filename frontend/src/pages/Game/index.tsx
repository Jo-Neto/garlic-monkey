import { WhiteBoard } from '../../components/Game/WhiteBoard';
import { GamePage } from '../../layout/GamePage';

export function Game() {
  return (
    <GamePage>
      <WhiteBoard proportion={16 / 9} />
    </GamePage>
  );
}
