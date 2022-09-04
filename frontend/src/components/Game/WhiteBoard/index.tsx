/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Actions } from '../Actions';
import { Colors } from '../Colors';
import { ColorObj } from '../Colors/type';
import { Radius } from '../Radius';
import { WhiteBoardProps, CanvasSizes } from './types';

const COLORS = [
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
];

const SIZES = [10, 20, 30, 40, 50];

export function WhiteBoard({ proportion }: WhiteBoardProps): JSX.Element {
  const [canvasSize, setCanvasSize] = useState<CanvasSizes>({
    width: 500,
    height: 500,
  });
  const [selectedColor, setSelectedColor] = useState<ColorObj>(COLORS[1]);
  const [bgColor, setbgColor] = useState<ColorObj>(COLORS[0]);
  const [selectedRadius, setSelectedRadius] = useState<number>(10);
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
    const dataUrl = WhiteBoardRef.current?.getDataURL('svg', false, bgColor);
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
      className="flex flex-col items-center w-full max-w-7xl h-full"
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <Colors
            title="Pincél"
            colors={COLORS}
            callback={setSelectedColor}
            selectedColor={selectedColor}
          />
          <Colors
            title="Cor de fundo"
            colors={COLORS}
            callback={setbgColor}
            selectedColor={bgColor}
          />
        </div>
        <CanvasDraw
          ref={WhiteBoardRef}
          brushColor={addTransparency(selectedColor.hex)}
          backgroundColor={bgColor.hex}
          loadTimeOffset={2}
          hideGrid={true}
          hideInterface={true}
          lazyRadius={5}
          brushRadius={selectedRadius}
          canvasHeight={canvasSize.height}
          canvasWidth={canvasSize.width}
          enablePanAndZoom
        />
        <Radius
          radius={SIZES}
          callback={setSelectedRadius}
          selectedRadius={selectedRadius}
        />
      </div>
      <div className="flex flex-row ">
        <Actions
          functions={[
            { name: 'Reset', callback: () => resetCanvas() },
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
