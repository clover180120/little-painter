import { Toolkit } from "./constant";
import { rectangleEvents, ellipseEvents, selectedEvents } from "./events";
import { EllipseSelection, RectSelection } from "./types";

export type Rect = {
  startX: number;
  startY: number;
  width: number;
  height: number;
  selected: boolean;
  selectedShape: RectSelection;
};
export type Ellipse = {
  startX: number;
  startY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  selected: boolean;
  selectedShape: EllipseSelection;
};
type State = {
  startX: number;
  startY: number;
  isDrawing: boolean;
  rectList: Rect[];
  ellipseList: Ellipse[];
  currentToolkit: Toolkit | undefined;
};

export interface ICanvas {
  canvas: HTMLCanvasElement;
  state: State;
  registerEventListeners: (toolkit: Toolkit, canvas: ICanvas) => void;
  unregisterEventListeners: (
    toolkit: Toolkit | undefined,
    canvas: ICanvas
  ) => void;
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
      rectList: [],
      ellipseList: [],
      currentToolkit: undefined,
    };
  }

  private rectangleOnClick = (e: MouseEvent) => {
    rectangleEvents.onClick(e, this);
  };
  private rectangleOnMousedown = (e: MouseEvent) => {
    rectangleEvents.onMousedown(e, this);
  };
  private rectangleOnMouseup = (e: MouseEvent) => {
    rectangleEvents.onMouseup(e, this);
  };
  private rectangleOnMousemove = (e: MouseEvent) => {
    rectangleEvents.onMousemove(e, this);
  };
  private ellipseOnClick = (e: MouseEvent) => {
    ellipseEvents.onClick(e, this);
  };
  private ellipseOnMousedown = (e: MouseEvent) => {
    ellipseEvents.onMousedown(e, this);
  };
  private ellipseOnMouseup = (e: MouseEvent) => {
    ellipseEvents.onMouseup(e, this);
  };
  private ellipseOnMousemove = (e: MouseEvent) => {
    ellipseEvents.onMousemove(e, this);
  };
  private selectOnClick = (e: MouseEvent) => {
    selectedEvents.onMousedown(e, this);
  };

  registerEventListeners(toolkit: Toolkit, canvas: ICanvas) {
    switch (toolkit) {
      case Toolkit.RECTANGLE:
        this.canvas.addEventListener('click', this.rectangleOnClick);
        this.canvas.addEventListener('mousedown', this.rectangleOnMousedown);
        this.canvas.addEventListener('mouseup', this.rectangleOnMouseup);
        this.canvas.addEventListener('mousemove', this.rectangleOnMousemove);
        break;
      case Toolkit.ELLIPSE:
        this.canvas.addEventListener('click', this.ellipseOnClick);
        this.canvas.addEventListener('mousedown', this.ellipseOnMousedown);
        this.canvas.addEventListener('mouseup', this.ellipseOnMouseup);
        this.canvas.addEventListener('mousemove', this.ellipseOnMousemove);
        break;
      case Toolkit.SELECT:
        this.canvas.addEventListener('click', this.selectOnClick);
        break;

      default:
        break;
    }
  }

  unregisterEventListeners(toolkit: Toolkit | undefined, canvas: ICanvas) {
    switch (toolkit) {
      case Toolkit.RECTANGLE:
        this.canvas.removeEventListener('click', this.rectangleOnClick);
        this.canvas.removeEventListener('mousedown', this.rectangleOnMousedown);
        this.canvas.removeEventListener('mouseup', this.rectangleOnMouseup);
        this.canvas.removeEventListener('mousemove', this.rectangleOnMousemove);
        break;
      case Toolkit.ELLIPSE:
        this.canvas.removeEventListener('click', this.ellipseOnClick);
        this.canvas.removeEventListener('mousedown', this.ellipseOnMousedown);
        this.canvas.removeEventListener('mouseup', this.ellipseOnMouseup);
        this.canvas.removeEventListener('mousemove', this.ellipseOnMousemove);
        break;
      case Toolkit.SELECT:
        this.canvas.removeEventListener('click', this.selectOnClick);
        break;

      default:
        break;
    }
  }
}

export default Canvas;
