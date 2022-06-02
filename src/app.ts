import { Toolkit } from "./types";
import { rectangleEvents, ellipseEvents, selectedEvents } from "./events";
import { Shape } from "./shapes";

type State = {
  startX: number;
  startY: number;
  selectedPointX?: number;
  selectedPointY?: number;
  isDrawing: boolean;
  isDragging: boolean;
  shapeList: Shape[];
  currentToolkit: Toolkit | undefined;
  zIndex: number;
};

export interface App {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  canvasRect: DOMRect;
  state: State;
  popZIndex: () => number;
  registerEventListeners: (toolkit: Toolkit, canvas: App) => void;
  unregisterEventListeners: (
    toolkit: Toolkit | undefined,
    canvas: App
  ) => void;
}

class AppImpl implements App {
  canvas: HTMLCanvasElement;
  state: State;
  ctx: CanvasRenderingContext2D | null;
  canvasRect: DOMRect;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.state = {
      startX: 0,
      startY: 0,
      selectedPointX: 0,
      selectedPointY: 0,
      isDrawing: false,
      isDragging: false,
      shapeList: [],
      currentToolkit: undefined,
      zIndex: 0,
    };
    if (this.ctx) {
      this.ctx.lineJoin = 'round';
      this.ctx.lineWidth = 1;
    }
  }

  private rectangleOnMousedown = (e: MouseEvent) => {
    rectangleEvents.onMousedown(e, this);
  };
  private rectangleOnMouseup = (e: MouseEvent) => {
    rectangleEvents.onMouseup(e, this);
  };
  private rectangleOnMousemove = (e: MouseEvent) => {
    rectangleEvents.onMousemove(e, this);
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
  private selectOnMousemove = (e: MouseEvent) => {
    selectedEvents.onMousemove(e, this);
  };
  private selectOnMouseup = (e: MouseEvent) => {
    selectedEvents.onMouseup(e, this);
  };
  private selectOnMousedown = (e: MouseEvent) => {
    selectedEvents.onMousedown(e, this);
  };

  popZIndex(): number {
    return this.state.zIndex++;
  }

  registerEventListeners(toolkit: Toolkit, canvas: App) {
    switch (toolkit) {
      case Toolkit.RECTANGLE:
        this.canvas.addEventListener('mousedown', this.rectangleOnMousedown);
        this.canvas.addEventListener('mouseup', this.rectangleOnMouseup);
        this.canvas.addEventListener('mousemove', this.rectangleOnMousemove);
        break;
      case Toolkit.ELLIPSE:
        this.canvas.addEventListener('mousedown', this.ellipseOnMousedown);
        this.canvas.addEventListener('mouseup', this.ellipseOnMouseup);
        this.canvas.addEventListener('mousemove', this.ellipseOnMousemove);
        break;
      case Toolkit.SELECT:
        this.canvas.addEventListener('mousedown', this.selectOnMousedown);
        this.canvas.addEventListener('mouseup', this.selectOnMouseup);
        this.canvas.addEventListener('mousemove', this.selectOnMousemove);
        break;

      default:
        break;
    }
  }

  unregisterEventListeners(toolkit: Toolkit | undefined, canvas: App) {
    switch (toolkit) {
      case Toolkit.RECTANGLE:
        this.canvas.removeEventListener('mousedown', this.rectangleOnMousedown);
        this.canvas.removeEventListener('mouseup', this.rectangleOnMouseup);
        this.canvas.removeEventListener('mousemove', this.rectangleOnMousemove);
        break;
      case Toolkit.ELLIPSE:
        this.canvas.removeEventListener('mousedown', this.ellipseOnMousedown);
        this.canvas.removeEventListener('mouseup', this.ellipseOnMouseup);
        this.canvas.removeEventListener('mousemove', this.ellipseOnMousemove);
        break;
      case Toolkit.SELECT:
        this.canvas.removeEventListener('mousedown', this.selectOnMousedown);
        this.canvas.removeEventListener('mouseup', this.selectOnMouseup);
        this.canvas.removeEventListener('mousemove', this.selectOnMousemove);
        break;

      default:
        break;
    }
  }
}

export { AppImpl };
