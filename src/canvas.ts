import { Toolkit } from "./constant";
import { rectangleEvents, ellipseEvents } from "./events";

type Rect = {
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  width: number,
  height: number,
}
type Ellipse = {
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
}
type State = {
  startX: number,
  startY: number,
  isDrawing: boolean,
  endX: number,
  endY: number,
  rectList: Rect[],
  ellipseList: Ellipse[],
  currentToolkit: Toolkit | undefined
}

export interface ICanvas {
  canvas: HTMLCanvasElement;
  state: State;
  registerEventListeners: (toolkit: Toolkit) => void;
  unregisterEventListeners: (toolkit: Toolkit) => void;
}

class Canvas implements ICanvas {
  canvas: HTMLCanvasElement;
  state: State;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.state = {
      startX: 0,
      startY: 0,
      isDrawing: false,
      endX: 0,
      endY: 0,
      rectList: [],
      ellipseList: [],
      currentToolkit: undefined,
    };
  }

  registerEventListeners(toolkit: Toolkit) {
    switch (toolkit) {
      case Toolkit.RECTANGLE:
        this.canvas.addEventListener('click', (e) => rectangleEvents.onClick(e, this))
        this.canvas.addEventListener('mousedown', (e) => rectangleEvents.onMousedown(e, this))
        this.canvas.addEventListener('mouseup', (e) => rectangleEvents.onMouseup(e, this))
        this.canvas.addEventListener('mousemove', (e) => rectangleEvents.onMousemove(e, this))
        break;
      case Toolkit.ELLIPSE:
        this.canvas.addEventListener('click', (e) => ellipseEvents.onClick(e, this))
        this.canvas.addEventListener('mousedown', (e) => ellipseEvents.onMousedown(e, this))
        this.canvas.addEventListener('mouseup', (e) => ellipseEvents.onMouseup(e, this))
        this.canvas.addEventListener('mousemove', (e) => ellipseEvents.onMousemove(e, this))
        break;
    
      default:
        break;
    }
  };

  unregisterEventListeners(toolkit: Toolkit) {
    switch (toolkit) {
      case Toolkit.RECTANGLE:
        this.canvas.removeEventListener('click', (e) => rectangleEvents.onClick(e, this))
        this.canvas.removeEventListener('mousedown', (e) => rectangleEvents.onMousedown(e, this))
        this.canvas.removeEventListener('mouseup', (e) => rectangleEvents.onMouseup(e, this))
        this.canvas.removeEventListener('mousemove', (e) => rectangleEvents.onMousemove(e, this))
        break;
      case Toolkit.ELLIPSE:
        this.canvas.removeEventListener('click', (e) => ellipseEvents.onClick(e, this))
        this.canvas.removeEventListener('mousedown', (e) => ellipseEvents.onMousedown(e, this))
        this.canvas.removeEventListener('mouseup', (e) => ellipseEvents.onMouseup(e, this))
        this.canvas.removeEventListener('mousemove', (e) => ellipseEvents.onMousemove(e, this))
        break;
    
      default:
        break;
    }
  }
}

export default Canvas;
