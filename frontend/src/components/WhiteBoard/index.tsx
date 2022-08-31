import CanvasDraw from 'react-canvas-draw';
import { WhiteBoardProps, Sizes } from './types';

export function WhiteBoard({
  radius,
  color,
  size,
}: WhiteBoardProps): JSX.Element {
  return (
    <div>
      <CanvasDraw
        loadTimeOffset={10}
        hideGrid={true}
        hideInterface={true}
        lazyRadius={radius}
        brushRadius={radius}
        brushColor={color}
        canvasHeight={Sizes[size].height}
        canvasWidth={Sizes[size].width}
      />
    </div>
  );
}
