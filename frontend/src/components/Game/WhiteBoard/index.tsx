/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Actions } from '../Actions';
import { Colors } from '../Colors';
import { ColorObj } from '../Colors/type';
import { Radius } from '../Radius';
import { WhiteBoardProps, CanvasSizes } from './types';

const COLORS = [
  { name: 'red', hex: '#FF0000' },
  { name: 'blue', hex: '#0000FF' },
  { name: 'yellow', hex: '#FFFF00' },
  { name: 'green', hex: '#008000' },
  { name: 'orange', hex: '#FF7A00' },
  { name: 'cyan', hex: '#00FFF0' },
  { name: 'purple', hex: '#800080' },
  { name: 'pink', hex: '#FF00E5' },
  { name: 'brown', hex: '#800000' },
  { name: 'white', hex: '#FFFFFF' },
  { name: 'gray', hex: '#808080' },
  { name: 'black', hex: '#000000' },
];

const SIZES = [1, 5, 10, 15, 20, 25];

export function WhiteBoard({ proportion }: WhiteBoardProps): JSX.Element {
  const [canvasSize, setCanvasSize] = useState<CanvasSizes>({
    width: 500,
    height: 500,
  });
  const [selectedColor, setSelectedColor] = useState<ColorObj>(COLORS[1]);
  const [selectedRadius, setSelectedRadius] = useState<number>(SIZES[0]);
  const [gradient, setGradient] = useState<number>(100);

  const ContainerRef = useRef<HTMLDivElement>(null);
  const WhiteBoardRef = useRef<CanvasDraw>(null);

  useEffect(() => {
    const actualWidth = ContainerRef.current?.offsetWidth;
    const newWidth = actualWidth && actualWidth * 0.7;
    const newHeight = newWidth && newWidth * (1 / proportion);
    const size = { width: newWidth, height: newHeight };
    console.log(size);
    setCanvasSize(size);
  }, []);

  function undo() {
    WhiteBoardRef.current?.undo();
  }

  function resetCanvas() {
    WhiteBoardRef.current?.clear();
  }

  function print() {
    const data = WhiteBoardRef.current?.getSaveData(); // Its stringied
    const objData = JSON.parse(data || '');
    console.log(objData);
  }

  function parseToURL() {
    // @ts-ignore: Unreachable code error
    const dataUrl = WhiteBoardRef.current?.getDataURL('svg', false, '#FFFFFF');
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
    <div
      ref={ContainerRef}
      className="flex flex-col items-center w-full max-w-7xl h-fit"
    >
      <div className="flex flex-row items-center justify-between">
        <Colors
          title="CORES"
          colors={COLORS}
          callback={setSelectedColor}
          selectedColor={selectedColor}
        />
        <div className="shadow-md border-8 border-[#3F1802] rounded-md">
          <CanvasDraw
            ref={WhiteBoardRef}
            brushColor={addTransparency(selectedColor.hex)}
            loadTimeOffset={2}
            hideGrid={true}
            hideInterface={true}
            lazyRadius={5}
            brushRadius={selectedRadius}
            canvasHeight={canvasSize.height}
            canvasWidth={canvasSize.width}
            enablePanAndZoom
          />
        </div>
        <Radius
          radius={SIZES}
          callback={setSelectedRadius}
          selectedRadius={selectedRadius}
          selectedColor={selectedColor}
        />
      </div>
      <div className="flex flex-row ">
        <Actions
          functions={[
            { name: 'Reset', callback: () => resetCanvas() },
            { name: 'Desfazer', callback: () => undo() },
          ]}
        />
        <input
          className="cursor-pointer"
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
