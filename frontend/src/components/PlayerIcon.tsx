interface PlayerIconProps {
  foco?: boolean;
  nick: string;
  photo: string;
  player_id: number;
}

export function PlayerIcon({ nick, photo, player_id, foco }: PlayerIconProps) {
  return (
    <div className={`h-[2.2rem] w-[12rem] flex flex-row rounded-l-full bg-white/50 rounded-r-md items-center ${foco && '!bg-black'}`} id={String(player_id)}>
      <div className="mx-1">
        <img className="bg-white rounded-full" src={'/assets/icons/user.png'} width={40} height={40} />
      </div>
      <span className="text-white text-xl font-black">{nick}</span>
    </div>
  );
}
