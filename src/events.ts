import { App } from "./app";
import { RectShape, EllipseShape, Shape } from './shapes';
import {
  findSelectedShape,
  disableAllSelectedShape,
  getRectProps,
  getEllipseProps,
} from "./utils";

type SelectedEvents = {
  onMousedown: (e: MouseEvent, canvas: App) => void;
  onMousemove: (e: MouseEvent, canvas: App) => void;
  onMouseup: (e: MouseEvent, canvas: App) => void;
};
type RectangleEvents = {
  onMousedown: (e: MouseEvent, canvas: App) => void;
  onMouseup: (e: MouseEvent, canvas: App) => void;
  onMousemove: (e: MouseEvent, canvas: App) => void;
};

type EllipseEvents = {
  onMousedown: (e: MouseEvent, canvas: App) => void;
  onMouseup: (e: MouseEvent, canvas: App) => void;
  onMousemove: (e: MouseEvent, canvas: App) => void;
};

const drawAll = (shapeList: Shape[]) => {
 shapeList.forEach((shape) => {
   shape.draw();
   shape.drawPoints();
   shape.fillText();
  })
};

const clearCanvas = (canvas: App) => {
  const { ctx, canvasRect } = canvas
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
};

const selectedEvents: SelectedEvents = {
  onMousedown: (e, canvas) => {
    canvas.state.isDragging = true;
    const mouseX = e.pageX - canvas.canvasRect.left;
    const mouseY = e.pageY - canvas.canvasRect.top;
    const shape = findSelectedShape(
      mouseX,
      mouseY,
      canvas.state.shapeList,
    );
    disableAllSelectedShape(canvas.state.shapeList);
    if (shape !== null) {
      shape.selected = true;
    }
    canvas.state.shapeList.forEach((shape) => {
      if (shape.selected) {
        shape.selectedStartX = mouseX;
        shape.selectedStartY = mouseY;
      }
    });
    clearCanvas(canvas);
    drawAll(canvas.state.shapeList);
  },

  onMouseup: (e, canvas) => {
    canvas.state.isDragging = false;
    const endX = e.pageX - canvas.canvasRect.left;
    const endY = e.pageY - canvas.canvasRect.top;
    canvas.state.shapeList.forEach((shape) => {
      if (shape.selected) {
        const offsetX = endX - shape.selectedStartX;
        const offsetY = endY - shape.selectedStartY;
        shape.startX += offsetX;
        shape.startY += offsetY;
        shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
      }
    })
    clearCanvas(canvas);
    drawAll(canvas.state.shapeList);
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDragging) return;
  },
};

  
const rectangleEvents: RectangleEvents = {
  onMousedown: (e, canvas) => {
    disableAllSelectedShape(canvas.state.shapeList);
    const { mouseX, mouseY } = getRectProps(e, canvas);
    canvas.state.startX = mouseX;
    canvas.state.startY = mouseY;
    canvas.state.isDrawing = true;
  },
  onMouseup: (e, canvas) => {
    canvas.state.isDrawing = false;
    const { width, height, isRight, isBottom } = getRectProps(e, canvas);
    const shape = new RectShape(
      canvas.ctx as CanvasRenderingContext2D,
      canvas.state.startX,
      canvas.state.startY,
      0,
      0,
      isRight ? width : -width,
      isBottom ? height : -height,
      false,
      canvas.popZIndex(),
    )
    shape.calcPointsPosition(
      canvas.state.startX,
      canvas.state.startY
    )
    canvas.state.shapeList.push(shape);
    drawAll(canvas.state.shapeList);
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDrawing) return;
    if (canvas.state.startX && canvas.state.startY && canvas.ctx) {
      clearCanvas(canvas);
      const { width, height, isRight, isBottom } = getRectProps(e, canvas);
      const shape = new RectShape(
        canvas.ctx as CanvasRenderingContext2D,
        canvas.state.startX,
        canvas.state.startY,
        0,
        0,
        isRight ? width : -width,
        isBottom ? height : -height,
        false,
        canvas.popZIndex(),
      );
      shape.draw();
      drawAll(canvas.state.shapeList);
    }
  },
};

const ellipseEvents: EllipseEvents = {
  onMousedown: (e, canvas) => {
    disableAllSelectedShape(canvas.state.shapeList);
    const { mouseX, mouseY } = getEllipseProps(e, canvas);
    canvas.state.startX = mouseX;
    canvas.state.startY = mouseY;
    canvas.state.isDrawing = true;
  },
  onMouseup: (e, canvas) => {
    canvas.state.isDrawing = false;
    const { centerX, centerY, width, height } = getEllipseProps(e, canvas);
    const shape = new EllipseShape(
      canvas.ctx as CanvasRenderingContext2D,
      canvas.state.startX,
      canvas.state.startY,
      0,
      0,
      width,
      height,
      centerX,
      centerY,
      false,
      canvas.popZIndex(),
    )
    canvas.state.shapeList.push(shape);
    drawAll(canvas.state.shapeList);
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDrawing) return;
    const { width, height, centerX, centerY } = getEllipseProps(e, canvas);
    if (canvas.state.startX && canvas.state.startY && canvas.ctx) {
      clearCanvas(canvas);
      const shape = new EllipseShape(
        canvas.ctx as CanvasRenderingContext2D,
        canvas.state.startX,
        canvas.state.startY,
        0,
        0,
        width,
        height,
        centerX,
        centerY,
        false,
        canvas.popZIndex(),
      )
      shape.draw();
      drawAll(
        canvas.state.shapeList
      );
    }
  },
};

export { rectangleEvents, ellipseEvents, selectedEvents };
