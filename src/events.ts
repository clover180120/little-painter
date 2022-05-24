import { Ellipse, ICanvas, Rect } from "./canvas";
import {
  calcRectPorts,
  calcEllipsePorts,
  findSelection,
  disableAllSelection,
} from "./utils";

type GlobalEvents = {
  drawAll: (
    rectList: Rect[],
    ellipseList: Ellipse[],
    ctx: CanvasRenderingContext2D | null
  ) => void;
type RectangleEvents = {
  onClick: (e: MouseEvent, canvas: ICanvas) => void;
  onMousedown: (e: MouseEvent, canvas: ICanvas) => void;
  onMouseup: (e: MouseEvent, canvas: ICanvas) => void;
  onMousemove: (e: MouseEvent, canvas: ICanvas) => void;
};

type EllipseEvents = {
  onClick: (e: MouseEvent, canvas: ICanvas) => void;
  onMousedown: (e: MouseEvent, canvas: ICanvas) => void;
  onMouseup: (e: MouseEvent, canvas: ICanvas) => void;
  onMousemove: (e: MouseEvent, canvas: ICanvas) => void;
};
}

const globalEvents: GlobalEvents = {
  drawAll: (rectList, ellipseList, ctx) => {
    rectList.forEach((rect) => {
      ctx?.beginPath();
      ctx?.rect(rect.startX, rect.startY, rect.width, rect.height);
      ctx?.stroke();
      ctx?.save();
    });
    ellipseList.forEach((ellipse) => {
      ctx?.beginPath();
      ctx?.ellipse(
        ellipse.centerX,
        ellipse.centerY,
        ellipse.width,
        ellipse.height,
        0,
        0,
        2 * Math.PI,
        false
      );
      ctx?.stroke();
      ctx?.save();
    });
  },
  }
}

const rectangleEvents: RectangleEvents = {
  onClick: (e, canvas) => {
  },
  onMousedown: (e, canvas) => {
    const rect = canvas.canvas.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    canvas.state.startX = startX;
    canvas.state.startY = startY;
    canvas.state.isDrawing = true;
  },
  onMouseup: (e, canvas) => {
    canvas.state.isDrawing = false;
    const rect = canvas.canvas.getBoundingClientRect();
    const mouseX = e.pageX - rect.left;
    const mouseY = e.pageY - rect.top;
    const width = Math.abs(mouseX - canvas.state.startX);
    const height = Math.abs(mouseY - canvas.state.startY);
    const isRight = mouseX >= canvas.state.startX;
    const isBottom = mouseY > canvas.state.startY;
    canvas.state.rectList.push({
      startX: canvas.state.startX,
      startY: canvas.state.startY,
      width: isRight ? width : -width,
      height: isBottom ? height : -height
    });
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDrawing) return;
    const rect = canvas.canvas.getBoundingClientRect();
    const mouseX = e.pageX - rect.left;
    const mouseY = e.pageY - rect.top;
    const ctx = canvas.canvas.getContext('2d');
    if (canvas.state.startX && canvas.state.startY) {
      const width = Math.abs(mouseX - canvas.state.startX);
      const height = Math.abs(mouseY - canvas.state.startY);
      const isRight = mouseX >= canvas.state.startX;
      const isBottom = mouseY > canvas.state.startY;
      ctx?.clearRect(0, 0, rect.width, rect.height);
      ctx?.beginPath();
      ctx?.rect(canvas.state.startX, canvas.state.startY, isRight ? width : -width, isBottom ? height : -height);
      ctx?.stroke();
      ctx?.save();
      globalEvents.drawAll(canvas.state.rectList, canvas.state.ellipseList, ctx);
    }},
}

const ellipseEvents: EllipseEvents = {
  onClick: (e, canvas) => {
  },
  onMousedown: (e, canvas) => {
    const rect = canvas.canvas.getBoundingClientRect();
    const startX = e.pageX - rect.left;
    const startY = e.pageY - rect.top;
    canvas.state.startX = startX;
    canvas.state.startY = startY;
    canvas.state.isDrawing = true;
  },
  onMouseup: (e, canvas) => {
    canvas.state.isDrawing = false;
    const rect = canvas.canvas.getBoundingClientRect();
    const mouseX = e.pageX - rect.left;
    const mouseY = e.pageY - rect.top;
    const width = Math.abs(mouseX - canvas.state.startX);
    const height = Math.abs(mouseY - canvas.state.startY);
    const isRight = mouseX >= canvas.state.startX;
    const isBottom = mouseY > canvas.state.startY;
    canvas.state.ellipseList.push({
      startX: canvas.state.startX,
      startY: canvas.state.startY,
      width: isRight ? width : width,
      height: isBottom ? height : height,
      centerX: canvas.state.startX + width / 2,
      centerY: canvas.state.startY + height / 2,
    });
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDrawing) return;
    const rect = canvas.canvas.getBoundingClientRect();
    const mouseX = e.pageX - rect.left;
    const mouseY = e.pageY - rect.top;
    const ctx = canvas.canvas.getContext('2d');
    if (canvas.state.startX && canvas.state.startY) {
      const width = Math.abs(mouseX - canvas.state.startX);
      const height = Math.abs(mouseY - canvas.state.startY);
      const centerX = canvas.state.startX + width / 2;
      const centerY = canvas.state.startY + height / 2;
      ctx?.clearRect(0, 0, rect.width, rect.height);
      ctx?.beginPath();
      ctx?.ellipse(centerX, centerY, width, height, 0, 0, 2 * Math.PI, false);
      ctx?.stroke();
      ctx?.save();
      globalEvents.drawAll(canvas.state.rectList, canvas.state.ellipseList, ctx);
    }
  },
}

export { rectangleEvents, ellipseEvents, selectedEvents };
