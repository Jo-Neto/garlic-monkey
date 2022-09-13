interface PlayerIconProps {
  nick: string;
  photo: string;
}

export function PlayerIcon({ nick, photo }: PlayerIconProps) {
  return (
    <div className="flex flex-row rounded-l-full rounded-r-md">
      <div className="mx-3">
        <img src={photo || '/assets/icons/user.png'} width={45} height={45} />
      </div>
      <span className="text-white text-xl font-black">{nick}</span>
    </div>
  );
}
