import wretch from 'wretch';
import { CREATE_GAME_URL, JOIN_GAME_URL } from '../constants/api-urls';

export function createGameRoom(
  player: string,
  roomName: string,
  password: string,
  numPlayers: number,
) {
  wretch(CREATE_GAME_URL)
    .post({ player, roomName, password, numPlayers })
    .json((response) => response);
}

export function joinGameRomm(roomName: string, password: string) {
  wretch(JOIN_GAME_URL)
    .post({ roomName, password })
    .json((response) => response);
}

export const SessionServices = {
  createGameRoom,
  joinGameRomm,
};
