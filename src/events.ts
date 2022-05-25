import { Ellipse, ICanvas, Rect } from "./canvas";
import {
  calcRectPorts,
  calcEllipsePorts,
  findSelectedShape,
  disableAllSelectedShape,
} from "./utils";

type GlobalEvents = {
  drawAll: (
    rectList: Rect[],
    ellipseList: Ellipse[],
    ctx: CanvasRenderingContext2D | null
  ) => void;
  drawPoints: (
    rectList: Rect[],
    ellipseList: Ellipse[],
    ctx: CanvasRenderingContext2D | null
  ) => void;
};
type SelectedEvents = {
  onMousedown: (e: MouseEvent, canvas: ICanvas) => void;
};
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

const selectedEvents: SelectedEvents = {
  onMousedown: (e, canvas) => {
    const ctx = canvas.canvas.getContext('2d');
    const rect = canvas.canvas.getBoundingClientRect();
    const mouseX = e.pageX - rect.left;
    const mouseY = e.pageY - rect.top;
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
    ctx?.clearRect(0, 0, rect.width, rect.height);
    globalEvents.drawAll(canvas.state.rectList, canvas.state.ellipseList, ctx);
    globalEvents.drawPoints(
      canvas.state.rectList,
      canvas.state.ellipseList,
      ctx
    );
  },
};

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
  drawPoints: (rectList, ellipseList, ctx) => {
    if (ctx) {
      ctx.lineJoin = 'round';

      // rect
      rectList.forEach((rect) => {
        if (rect.selected) {
          Object.values(rect.selectedShape).map(({ x, y }) => {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#3a3a3a';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.stroke();
          });
        }
      });

      // ellipse
      ellipseList.forEach((ellipse) => {
        if (ellipse.selected) {
          Object.values(ellipse.selectedShape).map(({ x, y }) => {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#3a3a3a';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.stroke();
          });
        }
      });
    }
  },
};
const rectangleEvents: RectangleEvents = {
  onClick: (e, canvas) => {},
  onMousedown: (e, canvas) => {
    const rect = canvas.canvas.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    canvas.state.startX = startX;
    canvas.state.startY = startY;
    canvas.state.isDrawing = true;
  },
  onMouseup: (e, canvas) => {
    const ctx = canvas.canvas.getContext('2d');
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
    globalEvents.drawPoints(
      canvas.state.rectList,
      canvas.state.ellipseList,
      ctx
    );
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDrawing) return;
    const rect = canvas.canvas.getBoundingClientRect();
    const mouseX = e.pageX - rect.left;
    const mouseY = e.pageY - rect.top;
    const ctx = canvas.canvas.getContext('2d');
    if (canvas.state.startX && canvas.state.startY && ctx) {
      const width = Math.abs(mouseX - canvas.state.startX);
      const height = Math.abs(mouseY - canvas.state.startY);
      const isRight = mouseX >= canvas.state.startX;
      const isBottom = mouseY > canvas.state.startY;
      ctx?.clearRect(0, 0, rect.width, rect.height);
      ctx.lineWidth = 3;
      ctx?.beginPath();
      ctx?.rect(
        canvas.state.startX,
        canvas.state.startY,
        isRight ? width : -width,
        isBottom ? height : -height
      );
      ctx?.stroke();
      ctx?.save();
      globalEvents.drawAll(
        canvas.state.rectList,
        canvas.state.ellipseList,
        ctx
      );
    }
  },
};

const ellipseEvents: EllipseEvents = {
  onClick: (e, canvas) => {},
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
    const ctx = canvas.canvas.getContext('2d');
    const rect = canvas.canvas.getBoundingClientRect();
    const endX = e.pageX - rect.left;
    const endY = e.pageY - rect.top;
    const width = Math.abs(endX - canvas.state.startX);
    const height = Math.abs(endY - canvas.state.startY);
    const isRight = endX >= canvas.state.startX;
    const isBottom = endY > canvas.state.startY;
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
    globalEvents.drawPoints(
      canvas.state.rectList,
      canvas.state.ellipseList,
      ctx
    );
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDrawing) return;
    const rect = canvas.canvas.getBoundingClientRect();
    const mouseX = e.pageX - rect.left;
    const mouseY = e.pageY - rect.top;
    const ctx = canvas.canvas.getContext('2d');
    if (canvas.state.startX && canvas.state.startY && ctx) {
      const width = Math.abs(mouseX - canvas.state.startX);
      const height = Math.abs(mouseY - canvas.state.startY);
      const centerX = canvas.state.startX + width / 2;
      const centerY = canvas.state.startY + height / 2;
      ctx?.clearRect(0, 0, rect.width, rect.height);
      ctx.lineWidth = 3;
      ctx?.beginPath();
      ctx?.ellipse(centerX, centerY, width, height, 0, 0, 2 * Math.PI, false);
      ctx?.stroke();
      ctx?.save();
      globalEvents.drawAll(
        canvas.state.rectList,
        canvas.state.ellipseList,
        ctx
      );
    }
  },
};

export { rectangleEvents, ellipseEvents, selectedEvents };
