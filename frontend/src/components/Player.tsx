import { PlayerIcon } from './PlayerIcon';

interface PlayerProps {
    players: {
      nick: string;
      photo: string;
    }[]
}

export function Player( {players}: PlayerProps ) {
    return (
        <div className='flex flex-col gap-2'>
            {
                players.map((element, index) => {
                return <PlayerIcon nick={element.nick} photo={element.photo} player_id={index} />
                })
            }
        </div>
    );
}
  