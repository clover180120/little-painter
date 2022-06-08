import { Toolkit } from "./types";
import { rectangleEvents, ellipseEvents, selectedEvents, associationEvents, generalizationEvents, compositionEvents } from "./events";
import { Line, Shape } from "./shapes";

type State = {
  startX: number;
  startY: number;
  selectedPointX?: number;
  selectedPointY?: number;
  isDrawing: boolean;
  isDragging: boolean;
  shapeList: Shape[];
  lineList: Line[];
  currentToolkit: Toolkit | undefined;
  zIndex: number;
};

export interface App {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  canvasRect: DOMRect;
  state: State;
  popZIndex: () => number;
  registerEventListeners: (toolkit: Toolkit, app: App) => void;
  unregisterEventListeners: (
    toolkit: Toolkit | undefined,
    app: App
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
      lineList: [],
      currentToolkit: undefined,
      zIndex: 0,
    };
    if (this.ctx) {
      this.ctx.lineJoin = 'round';
      this.ctx.lineWidth = 1;
    }
    let dropdown = document.getElementById('dropdown-btn');
    let dropdownContent = document.querySelector('.dropdown-content');
    let dropdownName = document.getElementById('dropdown-name');
    let dialog: any = document.getElementById('dialog');
    let submit = document.getElementById('submit');
    let closeDialog = document.getElementById('close-dialog');

    dropdown?.addEventListener('click', () => {
      dropdownContent?.classList.toggle('show');
    });
    const state = {
      isDialogOpened: false,
    }
    dropdownName?.addEventListener('click', () => {
      this.state.shapeList.forEach((shape) => {
        if (shape.selected) {
          state.isDialogOpened = true;
          if (state.isDialogOpened) {
            dropdownContent?.classList.remove('show');
            dialog?.showModal();
          }
        }
      })
    })
    submit?.addEventListener('click', () => {
      let inputDOM = document.getElementById('name') as HTMLInputElement | null;
      let inputValue = inputDOM?.value;
      if (inputValue) {
        dialog?.close();
        this.state.shapeList.forEach((shape) => {
          if (shape.selected) {
            shape.name = inputValue;
          }
        })
      }
      if (inputDOM) {
        inputDOM.value = '';
      }
      this.state.shapeList.forEach((shape) => {
        if (shape.name) {
          shape.draw();
          shape.drawPoints();
          shape.fillText();
        }
      })
    })
    closeDialog?.addEventListener('click', () => {
      dialog?.close();
    })
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
  private associationOnMousemove = (e: MouseEvent) => {
    associationEvents.onMousemove(e, this);
  };
  private associationOnMouseup = (e: MouseEvent) => {
    associationEvents.onMouseup(e, this);
  };
  private associationOnMousedown = (e: MouseEvent) => {
    associationEvents.onMousedown(e, this);
  };
  private generalizationOnMousemove = (e: MouseEvent) => {
    generalizationEvents.onMousemove(e, this);
  };
  private generalizationOnMouseup = (e: MouseEvent) => {
    generalizationEvents.onMouseup(e, this);
  };
  private generalizationOnMousedown = (e: MouseEvent) => {
    generalizationEvents.onMousedown(e, this);
  };
  private compositionOnMousemove = (e: MouseEvent) => {
    compositionEvents.onMousemove(e, this);
  };
  private compositionOnMouseup = (e: MouseEvent) => {
    compositionEvents.onMouseup(e, this);
  };
  private compositionOnMousedown = (e: MouseEvent) => {
    compositionEvents.onMousedown(e, this);
  };

  popZIndex(): number {
    return this.state.zIndex++;
  }

  registerEventListeners(toolkit: Toolkit) {
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
      case Toolkit.ASSOCIATION:
        this.canvas.addEventListener('mousedown', this.associationOnMousedown);
        this.canvas.addEventListener('mouseup', this.associationOnMouseup);
        this.canvas.addEventListener('mousemove', this.associationOnMousemove);
        break;
      case Toolkit.GENERALIZATION:
        this.canvas.addEventListener('mousedown', this.generalizationOnMousedown);
        this.canvas.addEventListener('mouseup', this.generalizationOnMouseup);
        this.canvas.addEventListener('mousemove', this.generalizationOnMousemove);
        break;
      case Toolkit.COMPOSITION:
        this.canvas.addEventListener('mousedown', this.compositionOnMousedown);
        this.canvas.addEventListener('mouseup', this.compositionOnMouseup);
        this.canvas.addEventListener('mousemove', this.compositionOnMousemove);
        break;
      default:
        break;
    }
  }

  unregisterEventListeners(toolkit: Toolkit | undefined) {
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
      case Toolkit.ASSOCIATION:
        this.canvas.removeEventListener('mousedown', this.associationOnMousedown);
        this.canvas.removeEventListener('mouseup', this.associationOnMouseup);
        this.canvas.removeEventListener('mousemove', this.associationOnMousemove);
        break;
      case Toolkit.GENERALIZATION:
        this.canvas.removeEventListener('mousedown', this.generalizationOnMousedown);
        this.canvas.removeEventListener('mouseup', this.generalizationOnMouseup);
        this.canvas.removeEventListener('mousemove', this.generalizationOnMousemove);
        break;
      case Toolkit.COMPOSITION:
        this.canvas.removeEventListener('mousedown', this.compositionOnMousedown);
        this.canvas.removeEventListener('mouseup', this.compositionOnMouseup);
        this.canvas.removeEventListener('mousemove', this.compositionOnMousemove);
        break;
      default:
        break;
    }
  }
}

export { AppImpl };
