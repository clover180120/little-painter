import { ICanvas } from "./canvas";
import { Rect, Ellipse } from './types';
import {
  calcRectPorts,
  calcEllipsePorts,
  findSelectedShape,
  disableAllSelectedShape,
  getRectProps,
  getEllipseProps,
} from "./utils";

type SelectedEvents = {
  onMousedown: (e: MouseEvent, canvas: ICanvas) => void;
  onMousemove: (e: MouseEvent, canvas: ICanvas) => void;
  onMouseup: (e: MouseEvent, canvas: ICanvas) => void;
};
type RectangleEvents = {
  onMousedown: (e: MouseEvent, canvas: ICanvas) => void;
  onMouseup: (e: MouseEvent, canvas: ICanvas) => void;
  onMousemove: (e: MouseEvent, canvas: ICanvas) => void;
};

type EllipseEvents = {
  onMousedown: (e: MouseEvent, canvas: ICanvas) => void;
  onMouseup: (e: MouseEvent, canvas: ICanvas) => void;
  onMousemove: (e: MouseEvent, canvas: ICanvas) => void;
};

const drawShapes = (rectList: Rect[], ellipseList: Ellipse[], ctx: CanvasRenderingContext2D | null) => {
  rectList.forEach((rect) => {
    drawRect(rect, ctx)
  });
  ellipseList.forEach((ellipse) => {
    drawEllipse(ellipse, ctx);
  });
};

const drawPoints = (rectList: Rect[], ellipseList: Ellipse[], ctx: CanvasRenderingContext2D | null) => {
  if (!ctx) return;
  // rect
  rectList.forEach((rect) => {
    if (rect.selected && rect.selectedShape) {
      Object.values(rect.selectedShape).map(({ x, y }) => {
        drawPoint(x, y, ctx);
      });
    }
  });

  // ellipse
  ellipseList.forEach((ellipse) => {
    if (ellipse.selected && ellipse.selectedShape) {
      Object.values(ellipse.selectedShape).map(({ x, y }) => {
        drawPoint(x, y, ctx);
      });
    }
  });
};

const drawPoint = (x: number, y: number, ctx: CanvasRenderingContext2D | null) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#3a3a3a';
  ctx.fill();
  ctx.stroke();
};

const drawAll = (rectList: Rect[], ellipseList: Ellipse[], ctx: CanvasRenderingContext2D | null) => {
  drawShapes(rectList, ellipseList, ctx)
  drawPoints(rectList, ellipseList, ctx)
};

const drawRect = (rect: Rect, ctx: CanvasRenderingContext2D | null) => {
  if (!ctx) return;
  ctx.beginPath();
  rect.node?.rect(
    rect.startX,
    rect.startY,
    rect.width,
    rect.height,
  );
  ctx.fillStyle = '#FFF';
  ctx.rect(
    rect.startX,
    rect.startY,
    rect.width,
    rect.height,
  );
  ctx.stroke();
  ctx.fillRect(
    rect.startX,
    rect.startY,
    rect.width,
    rect.height,
  );
  ctx.save();
}
const drawEllipse = (ellipse: Ellipse, ctx: CanvasRenderingContext2D | null) => {
  if (!ctx) return;
  ctx.beginPath();
  ellipse.node?.ellipse(
    ellipse.startX,
    ellipse.startY,
    ellipse.width,
    ellipse.height,
    0,
    0,
    2 * Math.PI,
    false
  );
  ctx.fillStyle = '#FFF';
  ctx.ellipse(
    ellipse.startX,
    ellipse.startY,
    ellipse.width,
    ellipse.height,
    0,
    0,
    2 * Math.PI,
    false
  );
  ctx.fill();
  ctx.stroke();
  ctx.save();
};

const clearCanvas = (canvas: ICanvas) => {
  const { ctx, canvasRect } = canvas
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
};

const selectedEvents: SelectedEvents = {
  onMousedown: (e, canvas) => {
    const mouseX = e.pageX - canvas.canvasRect.left;
    const mouseY = e.pageY - canvas.canvasRect.top;
    const shape = findSelectedShape(
      mouseX,
      mouseY,
      canvas.state.rectList,
      canvas.state.ellipseList,
      canvas.ctx,
    );
    disableAllSelectedShape(canvas.state.rectList, canvas.state.ellipseList);
    if (shape !== null) {
      shape.selected = true;
    }
    canvas.state.rectList.forEach((rect) => {
      if (rect.selected) {
        rect.selectedPointX = mouseX;
        rect.selectedPointY = mouseY;
      }
    });
    canvas.state.ellipseList.forEach((ellipse) => {
      if (ellipse.selected) {
        ellipse.selectedPointX = mouseX;
        ellipse.selectedPointY = mouseY;
      }
    });
    clearCanvas(canvas);
    drawAll(canvas.state.rectList, canvas.state.ellipseList, canvas.ctx);
  },

  onMouseup: (e, canvas) => {
    const endX = e.pageX - canvas.canvasRect.left;
    const endY = e.pageY - canvas.canvasRect.top;
    canvas.state.rectList.forEach((rect) => {
      if (rect.selected && rect.selectedPointX && rect.selectedPointY) {
        const offsetX = endX - rect.selectedPointX;
        const offsetY = endY - rect.selectedPointY;
        rect.startX += offsetX;
        rect.startY += offsetY;
        rect.selectedShape = calcRectPorts(
          rect.startX,
          rect.startY,
          rect.width,
          rect.height,
        );
      };
    });
    canvas.state.ellipseList.forEach((ellipse) => {
      if (ellipse.selected && ellipse.selectedPointX && ellipse.selectedPointY) {
        const offsetX = endX - ellipse.selectedPointX;
        const offsetY = endY - ellipse.selectedPointY;
        ellipse.startX = ellipse.startX + offsetX;
        ellipse.startY = ellipse.startY + offsetY;
        ellipse.selectedShape = calcEllipsePorts(
          ellipse.startX,
          ellipse.startY,
          ellipse.width,
          ellipse.height,
        )
      }
    });
    clearCanvas(canvas);
    drawAll(
      canvas.state.rectList,
      canvas.state.ellipseList,
      canvas.ctx
    );
  },
  onMousemove: (e, canvas) => {
    canvas.state.isDragging = true;
  },
};

  
const rectangleEvents: RectangleEvents = {
  onMousedown: (e, canvas) => {
    disableAllSelectedShape(canvas.state.rectList, canvas.state.ellipseList);
    const { mouseX, mouseY } = getRectProps(e, canvas);
    canvas.state.startX = mouseX;
    canvas.state.startY = mouseY;
    canvas.state.isDrawing = true;
  },
  onMouseup: (e, canvas) => {
    canvas.state.isDrawing = false;
    const { width, height, isRight, isBottom } = getRectProps(e, canvas);
    const node = new Path2D();
    canvas.state.rectList.push({
      startX: canvas.state.startX,
      startY: canvas.state.startY,
      width: isRight ? width : -width,
      height: isBottom ? height : -height,
      selected: false,
      selectedShape: calcRectPorts(
        canvas.state.startX,
        canvas.state.startY,
        isRight ? width : -width,
        isBottom ? height : -height,
      ),
      node,
      zIndex: canvas.popZIndex(),
    });
    drawAll(
      canvas.state.rectList,
      canvas.state.ellipseList,
      canvas.ctx
    );
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDrawing) return;
    if (canvas.state.startX && canvas.state.startY && canvas.ctx) {
      clearCanvas(canvas);
      const { width, height, isRight, isBottom } = getRectProps(e, canvas);
      drawRect({
        width: isRight ? width : -width,
        height: isBottom ? height : -height,
        startX: canvas.state.startX,
        startY: canvas.state.startY,
        selected: false,
        selectedShape: calcRectPorts(
          canvas.state.startX,
          canvas.state.startY,
          isRight ? width : -width,
          isBottom ? height : -height,
        ),
      }, canvas.ctx);
      drawAll(
        canvas.state.rectList,
        canvas.state.ellipseList,
        canvas.ctx
      );
    }
  },
};

const ellipseEvents: EllipseEvents = {
  onMousedown: (e, canvas) => {
    disableAllSelectedShape(canvas.state.rectList, canvas.state.ellipseList);
    const { mouseX, mouseY } = getEllipseProps(e, canvas);
    canvas.state.startX = mouseX;
    canvas.state.startY = mouseY;
    canvas.state.isDrawing = true;
  },
  onMouseup: (e, canvas) => {
    canvas.state.isDrawing = false;
    const { centerX, centerY, width, height } = getEllipseProps(e, canvas);
    const node = new Path2D();
    canvas.state.ellipseList.push({
      startX: canvas.state.startX,
      startY: canvas.state.startY,
      width,
      height,
      centerX,
      centerY,
      selected: false,
      selectedShape: calcEllipsePorts(
        canvas.state.startX,
        canvas.state.startY,
        width,
        height
      ),
      node,
      zIndex: canvas.popZIndex(),
    });
    drawAll(
      canvas.state.rectList,
      canvas.state.ellipseList,
      canvas.ctx
    );
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDrawing) return;
    const { width, height, centerX, centerY } = getEllipseProps(e, canvas);
    if (canvas.state.startX && canvas.state.startY && canvas.ctx) {
      clearCanvas(canvas);
      drawEllipse({
        startX: canvas.state.startX,
        startY: canvas.state.startY,
        centerX,
        centerY,
        width,
        height
      }, canvas.ctx)
      drawAll(
        canvas.state.rectList,
        canvas.state.ellipseList,
        canvas.ctx
      );
    }
  },
};

export { rectangleEvents, ellipseEvents, selectedEvents };
