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

export const getRectProps = (e: MouseEvent, canvas: App) => {
  const mouseX = e.pageX - canvas.canvasRect.left;
  const mouseY = e.pageY - canvas.canvasRect.top;
  const width = Math.abs(mouseX - canvas.state.startX);
  const height = Math.abs(mouseY - canvas.state.startY);
  const isRight = mouseX >= canvas.state.startX;
  const isBottom = mouseY > canvas.state.startY;
  return { mouseX, mouseY, width, height, isRight, isBottom }
}

export const getEllipseProps = (e: MouseEvent, canvas: App) => {
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
