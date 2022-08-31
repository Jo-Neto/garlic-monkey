import { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Colors } from './Colors';
import { Radius } from './Radius';
import { WhiteBoardProps, Sizes } from './types';

export function WhiteBoard({
  radius,
  color,
  size,
}: WhiteBoardProps): JSX.Element {
  const [selectedColor, setSelectedColor] = useState<string>('silver');
  const [selectedSize, setSelectedRadius] = useState<number>(10);

  const WhiteBoardRef = useRef<CanvasDraw>(null);
  console.log(WhiteBoardRef);

  return (
    <div className="flex flex-row ">
      <Colors
        colors={[
          'white',
          'silver',
          'gray',
          'black',
          'red',
          'brown',
          'yellow',
          'olive',
          'lime',
          'green',
          'aqua',
          'teal',
          'blue',
          'navy',
          'fuchsia',
          'purple',
        ]}
        callback={setSelectedColor}
      />
      <CanvasDraw
        ref={WhiteBoardRef}
        loadTimeOffset={10}
        hideGrid={true}
        hideInterface={true}
        lazyRadius={5}
        brushRadius={selectedSize}
        brushColor={selectedColor}
        canvasHeight={Sizes[size].height}
        canvasWidth={Sizes[size].width}
      />
      <Radius radius={[5, 10, 15, 20, 25]} callback={setSelectedRadius} />
    </div>
  );
}
