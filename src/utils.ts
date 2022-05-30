import { ICanvas } from './canvas';
import { Ellipse, Rect } from "./types";
import { RectSelection, EllipseSelection } from "./types";

export const calcRectPorts = (
  startX: number,
  startY: number,
  rectWidth: number,
  rectHeight: number,
): RectSelection => {
  return {
    top: {
      x: startX + rectWidth / 2,
      y: startY,
    },
    bottom: {
      x: startX + rectWidth / 2,
      y: startY + rectHeight,
    },
    left: {
      x: startX,
      y: startY + rectHeight / 2,
    },
    right: {
      x: startX + rectWidth,
      y: startY + rectHeight / 2,
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

const compareZIndex = (a: number | undefined, b: number | undefined) => {
  return (b as number) - (a as number)
}

export const findSelectedShape = (
  x: number,
  y: number,
  rectList: Rect[],
  ellipseList: Ellipse[],
  ctx: CanvasRenderingContext2D | null,
): Rect | Ellipse | null => {
  const rectIndex = rectList.sort((a, b) => compareZIndex(a.zIndex, b.zIndex)).findIndex(
    (rect) => {
      if (ctx?.isPointInPath(rect.node as Path2D, x, y)) {
        switch (true) {
          // IV 象限
          case (rect.width >= 0 && rect.height >= 0):
            return (x >= rect.startX && x <= rect.startX + rect.width && y >= rect.startY && y <= rect.startY + rect.height)
          // I 象限
          case (rect.width >= 0 && rect.height <= 0):
            return (x >= rect.startX && x <= rect.startX + rect.width && y <= rect.startY && y >= rect.startY + rect.height)
          // II 象限
          case (rect.width <= 0 && rect.height <= 0):
            return (x <= rect.startX && x >= rect.startX + rect.width && y <= rect.startY && y >= rect.startY + rect.height)
          // III 象限
          case (rect.width <= 0 && rect.height >= 0):
            return (x <= rect.startX && x >= rect.startX + rect.width && y >= rect.startY && y <= rect.startY + rect.height)
          default:
            return false
        }
      };
    }
  );

  
  const ellipseIndex = ellipseList.sort((a, b) => compareZIndex(a.zIndex, b.zIndex)).findIndex(
    (ellipse) => {
      if (x >= ellipse.startX - ellipse.width && x <= ellipse.startX + ellipse.width) {
        if (y >= ellipse.startY - ellipse.height && y <= ellipse.startY + ellipse.height) {
          if (ctx?.isPointInPath(ellipse.node as Path2D, x, y)) return true;
        }
      }
      return false;
    }
  );
  if (rectIndex !== -1 && ellipseIndex !== -1) {
    const topRect = rectList[rectIndex];
    const topEllipse = ellipseList[ellipseIndex];
    return (topRect.zIndex as number) > (topEllipse.zIndex as number) ? topRect : topEllipse
  }

  if (rectIndex !== -1) {
    return rectList[rectIndex];
  }
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
