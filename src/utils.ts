import { App } from './app';
import { Shape } from "./shapes";

const compareZIndex = (a: number | undefined, b: number | undefined) => {
  return (b as number) - (a as number)
}

export const findSelectedShape = (
  x: number,
  y: number,
  shapeList: Shape[],
): Shape | null => {
  let shapeIndex = [...shapeList]
    .sort((a, b) => compareZIndex(a.zIndex, b.zIndex))
    .findIndex(
      (shape) => {
        return shape.isShapeSelected(x, y);
      }
    );
  if (shapeIndex === -1) {
    return null;
  }
  shapeIndex = shapeList.length - shapeIndex - 1;
  return shapeList[shapeIndex]
};

export const disableAllSelectedShape = (
  shapeList: Shape[]
) => {
  shapeList.forEach((shape) => {
    shape.selected = false;
  })
};

export const getRectProps = (e: MouseEvent, app: App) => {
  const mouseX = e.pageX - app.canvasRect.left;
  const mouseY = e.pageY - app.canvasRect.top;
  const width = Math.abs(mouseX - app.state.startX);
  const height = Math.abs(mouseY - app.state.startY);
  const isRight = mouseX >= app.state.startX;
  const isBottom = mouseY > app.state.startY;
  return { mouseX, mouseY, width, height, isRight, isBottom }
}

export const getEllipseProps = (e: MouseEvent, app: App) => {
  const mouseX = e.pageX - app.canvasRect.left;
  const mouseY = e.pageY - app.canvasRect.top;
  const width = Math.abs(mouseX - app.state.startX);
  const height = Math.abs(mouseY - app.state.startY);
  const centerX = mouseX + width / 2;
  const centerY = mouseY + height / 2;
  const isRight = mouseX >= app.state.startX;
  const isBottom = mouseY > app.state.startY;
  return { mouseX, mouseY, width, height, centerX, centerY, isRight, isBottom }
}

export const findOverlay = (shape: Shape, shapeList: Shape[]): Shape | null => {
  for (const otherShape of shapeList) {
    if (!otherShape.selected) {
      const isOverlapping = !((shape.startX + shape.width) < otherShape.startX
        || shape.startX > (otherShape.startX + otherShape.width)
        || (shape.startY + shape.height) < otherShape.startY
        || shape.startY > (otherShape.startY + otherShape.height));
      if (isOverlapping) return otherShape;
    }
  }
  return null;
}
