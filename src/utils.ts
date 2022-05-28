import { ICanvas } from './canvas';
import { Ellipse, Rect } from "./types";
import { RectSelection, EllipseSelection } from "./types";

export const calcRectPorts = (
  startX: number,
  startY: number,
  rectWidth: number,
  rectHeight: number,
  isRight: boolean,
  isBottom: boolean
): RectSelection => {
  const width = isRight ? rectWidth : -rectWidth;
  const height = isBottom ? rectHeight : -rectHeight;
  return {
    top: {
      x: startX + width / 2,
      y: startY,
    },
    bottom: {
      x: startX + width / 2,
      y: startY + height,
    },
    left: {
      x: startX,
      y: startY + height / 2,
    },
    right: {
      x: startX + width,
      y: startY + height / 2,
    },
  };
};
export const calcEllipsePorts = (
  centerX: number,
  centerY: number,
  width: number,
  height: number
): EllipseSelection => {
  return {
    top: {
      x: centerX,
      y: centerY - height,
    },
    bottom: {
      x: centerX,
      y: centerY + height,
    },
    left: {
      x: centerX - width,
      y: centerY,
    },
    right: {
      x: centerX + width,
      y: centerY,
    },
  };
};

export const findSelectedShape = (
  x: number,
  y: number,
  rectList: Rect[],
  ellipseList: Ellipse[],
): Rect | Ellipse | null => {
  const rectIndex = rectList.findIndex(
    (rect) =>
      x >= rect.startX &&
      x <= rect.startX + rect.width &&
      y >= rect.startY &&
      y <= rect.startY + rect.height
  );

  if (rectIndex !== -1) {
    return rectList[rectIndex];
  }

  const ellipseIndex = ellipseList.findIndex(
    (ellipse) =>
      x >= ellipse.startX &&
      x <= ellipse.startX + ellipse.width &&
      y >= ellipse.startY &&
      y <= ellipse.startY + ellipse.height
  );

  if (ellipseIndex !== -1) {
    return ellipseList[ellipseIndex];
  }

  return null;
};

export const disableAllSelectedShape = (
  rectList: Rect[],
  ellipseList: Ellipse[],
) => {
  rectList.forEach((rect) => {
    rect.selected = false;
  });
  ellipseList.forEach((ellipse) => {
    ellipse.selected = false;
  });
};

export const getRectProps = (e: MouseEvent, canvas: ICanvas) => {
  const mouseX = e.pageX - canvas.canvasRect.left;
  const mouseY = e.pageY - canvas.canvasRect.top;
  const width = Math.abs(mouseX - canvas.state.startX);
  const height = Math.abs(mouseY - canvas.state.startY);
  const isRight = mouseX >= canvas.state.startX;
  const isBottom = mouseY > canvas.state.startY;
  return { mouseX, mouseY, width, height, isRight, isBottom }
}

export const getEllipseProps = (e: MouseEvent, canvas: ICanvas) => {
  const mouseX = e.pageX - canvas.canvasRect.left;
  const mouseY = e.pageY - canvas.canvasRect.top;
  const width = Math.abs(mouseX - canvas.state.startX);
  const height = Math.abs(mouseY - canvas.state.startY);
  const centerX = mouseX + width / 2;
  const centerY = mouseY + height / 2;
  const isRight = mouseX >= canvas.state.startX;
  const isBottom = mouseY > canvas.state.startY;
  return { mouseX, mouseY, width, height, centerX, centerY, isRight, isBottom }
}
