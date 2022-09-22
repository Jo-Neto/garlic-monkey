export type CanvasSizes = {
  width: number | undefined;
  height: number | undefined;
};

export interface WhiteBoardProps {
  proportion: number;
  socket: WebSocket;
  nick: string;
}
