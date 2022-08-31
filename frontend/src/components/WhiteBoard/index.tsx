/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Actions } from './Actions';
import { Colors } from './Colors';
import { Radius } from './Radius';
import { WhiteBoardProps, Sizes } from './types';

export function WhiteBoard({ size }: WhiteBoardProps): JSX.Element {
  const [selectedColor, setSelectedColor] = useState<string>('silver');
  const [selectedSize, setSelectedRadius] = useState<number>(10);
  const [gradient, setGradient] = useState<number>(100);

  const WhiteBoardRef = useRef<CanvasDraw>(null);
  const WBRef = WhiteBoardRef.current;

  function undo() {
    WBRef?.undo();
  }

  function print() {
    const data = WBRef?.getSaveData();
    console.log(data);
  }

  function parseToURL() {
    // @ts-ignore: Unreachable code error
    const dataUrl = WBRef?.getDataURL('svg', false, '0xffffff');
    console.log(dataUrl);
  }

  function addTransparency(value: string): string {
    const decimalValue = Math.round((gradient * 255) / 100);
    let hexValue;
    if (gradient < 7) {
      hexValue = '0' + decimalValue.toString(16).toUpperCase();
    } else {
      hexValue = decimalValue.toString(16).toUpperCase();
    }
    return value + hexValue;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row ">
        <Colors
          colors={[
            { name: 'white', hex: '#FFFFFF' },
            { name: 'silver', hex: '#C0C0C0' },
            { name: 'gray', hex: '#808080' },
            { name: 'black', hex: '#000000' },
            { name: 'red', hex: '#FF0000' },
            { name: 'brown', hex: '#800000' },
            { name: 'yellow', hex: '#FFFF00' },
            { name: 'olive', hex: '#808000' },
            { name: 'lime', hex: '#00FF00' },
            { name: 'green', hex: '#008000' },
            { name: 'aqua', hex: '#00FFFF' },
            { name: 'teal', hex: '#008080' },
            { name: 'blue', hex: '#0000FF' },
            { name: 'navy', hex: '#000080' },
            { name: 'fuchsia', hex: '#FF00FF' },
            { name: 'purple', hex: '#800080' },
          ]}
          callback={setSelectedColor}
        />
        <CanvasDraw
          ref={WhiteBoardRef}
          loadTimeOffset={2}
          hideGrid={true}
          hideInterface={true}
          lazyRadius={5}
          brushRadius={selectedSize}
          brushColor={addTransparency(selectedColor)}
          canvasHeight={Sizes[size].height}
          canvasWidth={Sizes[size].width}
        />
        <Radius radius={[5, 10, 15, 20, 25]} callback={setSelectedRadius} />
      </div>
      <div className="flex flex-row ">
        <Actions
          functions={[
            { name: 'Desfazer', callback: () => undo() },
            {
              name: 'Imprimir',
              callback: () => print(),
            },
            {
              name: 'Em URL',
              callback: () => parseToURL(),
            },
          ]}
        />
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={gradient}
          onChange={(e) => setGradient(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
