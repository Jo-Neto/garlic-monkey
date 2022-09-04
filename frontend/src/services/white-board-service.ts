import wretch from 'wretch';
import { DRAWINGS_URL } from '../constants/api-urls';

interface CanvasData {
  height: number;
  width: number;
  backgroundColor: string;
  lines: {
    points: { x: number; y: number }[];
    brushColor: string;
    brushRadius: number;
  }[];
}

export function sendCanvasDrawn(
  draw: CanvasData,
  room: string,
  apiKey: string,
) {
  wretch(DRAWINGS_URL)
    .auth(apiKey)
    .post({ draw, room })
    .json((response) => response);
}

export function recieveCanvasDrawn(
  draw: CanvasData,
  room: string,
  apiKey: string,
) {
  wretch(DRAWINGS_URL)
    .auth(apiKey)
    .post({ draw, room })
    .json((response) => response);
}

export const WhiteBoardServices = {
  sendCanvasDrawn,
  recieveCanvasDrawn,
};
