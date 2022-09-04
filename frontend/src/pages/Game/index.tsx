import { WhiteBoard } from '../../components/Game/WhiteBoard';
import { Chat } from '../../components/Game/Chat';

export function Game() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[90vw] flex items-center justify-center">
        <WhiteBoard proportion={16 / 9} />
      </div>
      <Chat className="absolute right-0 bottom-0" />
    </div>
  );
}
