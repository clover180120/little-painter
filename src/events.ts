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
  onClick: (e: MouseEvent, canvas: ICanvas) => void;
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

const drawPoint = (x: number, y: number, ctx: CanvasRenderingContext2D | null) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#3a3a3a';
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.stroke();
};

const drawPoints = (rectList: Rect[], ellipseList: Ellipse[], ctx: CanvasRenderingContext2D | null) => {
  if (ctx) {
    ctx.lineJoin = 'round';

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
  }
};

const drawAll = (rectList: Rect[], ellipseList: Ellipse[], ctx: CanvasRenderingContext2D | null) => {
  drawShapes(rectList, ellipseList, ctx)
  drawPoints(rectList, ellipseList, ctx)
};

const drawRect = (rect: Rect, ctx: CanvasRenderingContext2D | null) => {
  if (!ctx) return;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(
    rect.startX,
    rect.startY,
    rect.width,
    rect.height,
  );
  ctx.stroke();
  ctx.save();
}
const drawEllipse = (ellipse: Ellipse, ctx: CanvasRenderingContext2D | null) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.ellipse(ellipse.startX,
    ellipse.startY,
    ellipse.width,
    ellipse.height,
    0,
    0,
    2 * Math.PI,
    false
  );
  ctx.stroke();
  ctx.save();
};

const clearCanvas = (canvas: ICanvas) => {
  const { ctx, canvasRect } = canvas
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
};

const selectedEvents: SelectedEvents = {
  onClick: (e, canvas) => {
    const mouseX = e.pageX - canvas.canvasRect.left;
    const mouseY = e.pageY - canvas.canvasRect.top;
    const shape = findSelectedShape(
      mouseX,
      mouseY,
      canvas.state.rectList,
      canvas.state.ellipseList,
    );
    disableAllSelectedShape(canvas.state.rectList, canvas.state.ellipseList);
    if (shape !== null) {
      shape.selected = true;
    }
    clearCanvas(canvas);
    drawAll(canvas.state.rectList, canvas.state.ellipseList, canvas.ctx);
    drawPoints(
      canvas.state.rectList,
      canvas.state.ellipseList,
      canvas.ctx
    );
  },
  onMousedown: (e, canvas) => {
    const selectedPointX = e.pageX - canvas.canvasRect.left;
    const selectedPointY = e.pageY - canvas.canvasRect.top;
    for (const rect of Array.from(canvas.state.rectList)) {
      if (rect.selected) {
        rect.selectedPointX = selectedPointX;
        rect.selectedPointY = selectedPointY;
      }
    }
    for (const ellipse of Array.from(canvas.state.ellipseList)) {
      if (ellipse.selected) {
        ellipse.selectedPointX = selectedPointX;
        ellipse.selectedPointY = selectedPointY;
      }
    }
  },

  onMouseup: (e, canvas) => {
    canvas.state.isDragging = false;
    const endX = e.pageX - canvas.canvasRect.left;
    const endY = e.pageY - canvas.canvasRect.top;
    canvas.state.rectList.forEach((rect) => {
      if (rect.selected && rect.selectedPointX && rect.selectedPointY) {
        const offsetX = endX - rect.selectedPointX;
        const offsetY = endY - rect.selectedPointY;
        rect.startX = rect.startX + offsetX;
        rect.startY = rect.startY + offsetY;
        const isRight = endX  >= rect.startX;
        const isBottom = endY >= rect.startY;
        rect.selectedShape = calcRectPorts(
          rect.startX,
          rect.startY,
          rect.width,
          rect.height,
          isRight,
          isBottom
        )
      }
    });
    // TODO
    // canvas.state.ellipseList.forEach((ellipse) => {
    //   if (ellipse.selected && ellipse.selectedPointX && ellipse.selectedPointY) {
    //     const offsetX = endX - ellipse.selectedPointX;
    //     const offsetY = endY - ellipse.selectedPointY;
    //     ellipse.startX = ellipse.startX + offsetX;
    //     ellipse.startY = ellipse.startY + offsetY;
    //     ellipse.selectedShape = calcEllipsePorts(
    //       canvas.state.startX,
    //       canvas.state.startY,
    //       ellipse.width,
    //       ellipse.height,
    //     )
    //   }
    // });
    clearCanvas(canvas);
    drawAll(
      canvas.state.rectList,
      canvas.state.ellipseList,
      canvas.ctx
    );
    drawPoints(
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
    const { mouseX, mouseY } = getRectProps(e, canvas);
    canvas.state.startX = mouseX;
    canvas.state.startY = mouseY;
    canvas.state.isDrawing = true;
  },
  onMouseup: (e, canvas) => {
    canvas.state.isDrawing = false;
    const { width, height, isRight, isBottom } = getRectProps(e, canvas);
    canvas.state.rectList.push({
      startX: canvas.state.startX,
      startY: canvas.state.startY,
      width: isRight ? width : -width,
      height: isBottom ? height : -height,
      selected: false,
      selectedShape: calcRectPorts(
        canvas.state.startX,
        canvas.state.startY,
        width,
        height,
        isRight,
        isBottom
      ),
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
          width,
          height,
          isRight,
          isBottom
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
    const { mouseX, mouseY } = getEllipseProps(e, canvas);
    canvas.state.startX = mouseX;
    canvas.state.startY = mouseY;
    canvas.state.isDrawing = true;
  },
  onMouseup: (e, canvas) => {
    canvas.state.isDrawing = false;
    const { width, height, isRight, isBottom } = getEllipseProps(e, canvas);
    canvas.state.ellipseList.push({
      startX: canvas.state.startX,
      startY: canvas.state.startY,
      width: isRight ? width : width,
      height: isBottom ? height : height,
      centerX: canvas.state.startX + width / 2,
      centerY: canvas.state.startY + height / 2,
      selected: false,
      selectedShape: calcEllipsePorts(
        canvas.state.startX + width / 2,
        canvas.state.startY + height / 2,
        width,
        height
      ),
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
      canvas.ctx.lineWidth = 1;
      drawEllipse({
        startX: canvas.state.startX,
        startY: canvas.state.startY,
        centerX,
        centerY,
        width,
        height,
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
