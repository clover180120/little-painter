import { App } from "./app";
import { RectShape, EllipseShape, Shape, Line, AssociationLine } from './shapes';
import {
  findSelectedShape,
  disableAllSelectedShape,
  getRectProps,
  getEllipseProps,
  findOverlay,
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

type AssociationEvents = {
  onMousedown: (e: MouseEvent, canvas: App) => void;
  onMouseup: (e: MouseEvent, canvas: App) => void;
  onMousemove: (e: MouseEvent, canvas: App) => void;
};

type GeneralizationEvents = {
  onMousedown: (e: MouseEvent, canvas: App) => void;
  onMouseup: (e: MouseEvent, canvas: App) => void;
  onMousemove: (e: MouseEvent, canvas: App) => void;
};

type CompositionEvents = {
  onMousedown: (e: MouseEvent, canvas: App) => void;
  onMouseup: (e: MouseEvent, canvas: App) => void;
  onMousemove: (e: MouseEvent, canvas: App) => void;
};

const drawAllShapes = (shapeList: Shape[]) => {
 shapeList.forEach((shape) => {
   shape.draw();
   shape.drawPoints();
   shape.fillText();
  })
};

const drawAllLines = (lineList: Line[]) => {
 lineList.forEach((line) => {
   line.drawLine();
  })
};

const drawAll = (shapeList: Shape[], lineList: Line[]) => {
  drawAllShapes(shapeList);
  drawAllLines(lineList);
}

const clearCanvas = (canvas: App) => {
  const { ctx, canvasRect } = canvas
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
};

const associationEvents: AssociationEvents = {
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
    drawAll(canvas.state.shapeList, canvas.state.lineList);
  },

  onMouseup: (e, canvas) => {
    canvas.state.isDragging = false;
    const endX = e.pageX - canvas.canvasRect.left;
    const endY = e.pageY - canvas.canvasRect.top;
    canvas.state.shapeList.forEach((shape) => {
      if (shape.selected) {
        const fromShape = Object.assign(Object.create(Object.getPrototypeOf(shape)), shape);
        const offsetX = endX - fromShape.selectedStartX;
        const offsetY = endY - fromShape.selectedStartY;
        fromShape.startX += offsetX;
        fromShape.startY += offsetY;
        fromShape.selectedShape = fromShape.calcPointsPosition(fromShape.startX, fromShape.startY);
        const toShape = findOverlay(fromShape, canvas.state.shapeList);
        if (toShape && canvas.ctx) {
          const line = new AssociationLine(shape, toShape, canvas.ctx);
          canvas.state.lineList.push(line);
        }
      }
    })
    clearCanvas(canvas);
    drawAll(canvas.state.shapeList, canvas.state.lineList);
  },
  onMousemove: (e, canvas) => {
    if (!canvas.state.isDragging) return;
  },
}
const generalizationEvents: GeneralizationEvents = {
  onMousedown: (e, canvas) => {
  
  },
  onMousemove: (e, canvas) => {
  
  },
  onMouseup: (e, canvas) => {
  
  }
}
const compositionEvents: CompositionEvents = {
  onMousedown: (e, canvas) => {
  
  },
  onMousemove: (e, canvas) => {
  
  },
  onMouseup: (e, canvas) => {
  
  }
}

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
    drawAll(canvas.state.shapeList, canvas.state.lineList);
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
    drawAll(canvas.state.shapeList, canvas.state.lineList);
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
    shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
    canvas.state.shapeList.push(shape);
    drawAll(canvas.state.shapeList, canvas.state.lineList);
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
      drawAll(canvas.state.shapeList, canvas.state.lineList);
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
    drawAll(canvas.state.shapeList, canvas.state.lineList);
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
        canvas.state.shapeList, canvas.state.lineList
      );
    }
  },
};

export { rectangleEvents, ellipseEvents, selectedEvents, associationEvents, generalizationEvents, compositionEvents };
