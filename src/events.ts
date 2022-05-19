import { ICanvas } from './canvas';

type RectangleEvents = {
  onClick: (e: MouseEvent, canvas: ICanvas) => void;
  onMousedown: (e: MouseEvent, canvas: ICanvas) => void;
  onMouseup: (e: MouseEvent, canvas: ICanvas) => void;
  onMousemove: (e: MouseEvent, canvas: ICanvas) => void;
}

type EllipseEvents = {
  onClick: (e: MouseEvent, canvas: ICanvas) => void;
  onMousedown: (e: MouseEvent, canvas: ICanvas) => void;
  onMouseup: (e: MouseEvent, canvas: ICanvas) => void;
  onMousemove: (e: MouseEvent, canvas: ICanvas) => void;
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
    const width = Math.abs(canvas.state.endX - canvas.state.startX);
    const height = Math.abs(canvas.state.endY - canvas.state.startY);
    const isRight = canvas.state.endX >= canvas.state.startX;
    const isBottom = canvas.state.endY > canvas.state.startY;
    canvas.state.rectList.push({
      startX: canvas.state.startX,
      startY: canvas.state.startY,
      endX: canvas.state.endX,
      endY: canvas.state.endY,
      width: isRight ? width : -width,
      height: isBottom ? height : -height
    });
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDrawing) return;
    const rect = canvas.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const ctx = canvas.canvas.getContext('2d');
    if (canvas.state.startX && canvas.state.startY) {
      ctx?.beginPath();
      const width = Math.abs(mouseX - canvas.state.startX);
      const height = Math.abs(mouseY - canvas.state.startY);
      const isRight = canvas.state.endX >= canvas.state.startX;
      const isBottom = canvas.state.endY > canvas.state.startY;
      canvas.state.endX = mouseX;
      canvas.state.endY = mouseY;
      ctx?.clearRect(0, 0, rect.width, rect.height);
      ctx?.rect(canvas.state.startX, canvas.state.startY, isRight ? width : -width, isBottom ? height : -height);
      ctx?.stroke();
      ctx?.save();
    }
    canvas.state.rectList.forEach(rect => {
      ctx?.beginPath();
      ctx?.rect(rect.startX, rect.startY, rect.width, rect.height);
      ctx?.stroke();
      ctx?.save();
    })
  },
}

const ellipseEvents: EllipseEvents = {
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
    const width = Math.abs(canvas.state.endX - canvas.state.startX);
    const height = Math.abs(canvas.state.endY - canvas.state.startY);
    const isRight = canvas.state.endX >= canvas.state.startX;
    const isBottom = canvas.state.endY > canvas.state.startY;
    canvas.state.ellipseList.push({
      startX: canvas.state.startX,
      startY: canvas.state.startY,
      endX: canvas.state.endX,
      endY: canvas.state.endY,
      width: isRight ? width : width,
      height: isBottom ? height : height,
      centerX: (canvas.state.startX + width) / 2,
      centerY: (canvas.state.startY + height) / 2,
    });
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDrawing) return;
    const rect = canvas.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const ctx = canvas.canvas.getContext('2d');
    if (canvas.state.startX && canvas.state.startY) {
      ctx?.beginPath();
      const width = Math.abs(mouseX - canvas.state.startX);
      const height = Math.abs(mouseY - canvas.state.startY);
      const centerX = (mouseX - canvas.state.startX) / 2;
      const centerY = (mouseY - canvas.state.startY) / 2;
      canvas.state.endX = mouseX;
      canvas.state.endY = mouseY;
      ctx?.clearRect(0, 0, rect.width, rect.height);
      ctx?.ellipse(centerX, centerY, width, height, 0, 0, 2 * Math.PI, false);
      ctx?.stroke();
      ctx?.save();
    }
    canvas.state.ellipseList.forEach(ellipse => {
      ctx?.beginPath();
      ctx?.ellipse(ellipse.centerX, ellipse.centerY, ellipse.width, ellipse.height, 0, 0, 2 * Math.PI, false);
      ctx?.stroke();
      ctx?.save();
    })
  },
}

export { rectangleEvents, ellipseEvents }
