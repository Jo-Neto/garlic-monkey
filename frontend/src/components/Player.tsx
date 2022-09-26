import { PlayerIcon } from './PlayerIcon';

interface PlayerProps {
    finalPlayer?: string;
    players: {
      nick: string;
      photo: string;
    }[]
}

export function Player( {players, finalPlayer}: PlayerProps ) {
  return (
    <div className='flex flex-col gap-2'>
      {
        players.map((element, index) => {
          return <PlayerIcon 
          nick={element.nick} 
          photo={element.photo} 
          player_id={index} 
          key={index} 
                foco={element.nick === finalPlayer ? true : false }/>
        })
      }
    </div>
  );
}
  