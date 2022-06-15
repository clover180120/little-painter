import { App } from "./app";
import { AssociationLine, CompositionLine, GeneralizationLine, Line } from './lines';
import { RectShape, EllipseShape, Shape } from './shapes';
import { Toolkit } from './types';
import {
  findSelectedShape,
  disableAllSelectedShape,
  getRectProps,
  getEllipseProps,
  findOverlay,
  findSelectedShapes,
} from "./utils";

type SelectedEvents = {
  onMousedown: (e: MouseEvent, app: App) => void;
  onMousemove: (e: MouseEvent, app: App) => void;
  onMouseup: (e: MouseEvent, app: App) => void;
};
type RectangleEvents = {
  onMousedown: (e: MouseEvent, app: App) => void;
  onMouseup: (e: MouseEvent, app: App) => void;
  onMousemove: (e: MouseEvent, app: App) => void;
};

type EllipseEvents = {
  onMousedown: (e: MouseEvent, app: App) => void;
  onMouseup: (e: MouseEvent, app: App) => void;
  onMousemove: (e: MouseEvent, app: App) => void;
};

type LineEvents = {
  onMousedown: (e: MouseEvent, app: App) => void;
  onMouseup: (e: MouseEvent, app: App) => void;
  onMousemove: (e: MouseEvent, app: App) => void;
};

type AssociationEvents = LineEvents

type GeneralizationEvents = LineEvents

type CompositionEvents = LineEvents

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

const clearCanvas = (app: App) => {
  const { ctx, canvasRect } = app
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
};

const selectedShapeMouseDown = (e: MouseEvent, app: App) => {
  const mouseX = e.pageX - app.canvasRect.left;
  const mouseY = e.pageY - app.canvasRect.top;
  const shape = findSelectedShape(
    mouseX,
    mouseY,
    app.state.shapeList,
  );
  disableAllSelectedShape(app.state.shapeList);
  if (shape !== null) {
    shape.selected = true;
    app.state.isDragging = true;
    app.state.shapeList.forEach((shape) => {
      if (shape.selected) {
        shape.selectedStartX = mouseX;
        shape.selectedStartY = mouseY;
      }
    });
    clearCanvas(app);
    drawAll(app.state.shapeList, app.state.lineList);
    app.state.isSelectingMultiShape = false;
  }
}

const drawShapeLineMouseUp = (e: MouseEvent, app: App, toolkit: Toolkit) => {
  app.state.isDragging = false;
  const endX = e.pageX - app.canvasRect.left;
  const endY = e.pageY - app.canvasRect.top;
  app.state.shapeList.forEach((shape) => {
    if (shape.selected) {
      const fromShape = Object.assign(Object.create(Object.getPrototypeOf(shape)), shape);
      const offsetX = endX - fromShape.selectedStartX;
      const offsetY = endY - fromShape.selectedStartY;
      fromShape.startX += offsetX;
      fromShape.startY += offsetY;
      fromShape.selectedShape = fromShape.calcPointsPosition(fromShape.startX, fromShape.startY);
      const toShape = findOverlay(fromShape, app.state.shapeList);
      if (toShape && app.ctx) {
        switch (toolkit) {
          case Toolkit.ASSOCIATION:
            const associationLine = new AssociationLine(shape, toShape, app.ctx);
            app.state.lineList.push(associationLine);
            break;
          case Toolkit.GENERALIZATION:
            const generalizationLine = new GeneralizationLine(shape, toShape, app.ctx);
            app.state.lineList.push(generalizationLine);
            break;
          case Toolkit.COMPOSITION:
            const compositionLine = new CompositionLine(shape, toShape, app.ctx);
            app.state.lineList.push(compositionLine);
            break;
          default:
            break;
        }
      }
    }
  })
  clearCanvas(app);
  drawAll(app.state.shapeList, app.state.lineList);
}

const getLineEventsByToolkit = (toolkit: Toolkit): LineEvents => ({
  onMousedown: (e, app) => selectedShapeMouseDown(e, app),
  onMouseup: (e, app) => drawShapeLineMouseUp(e, app, toolkit),
  onMousemove: (e, app) => {}
})

const associationEvents: AssociationEvents = getLineEventsByToolkit(Toolkit.ASSOCIATION);
const generalizationEvents: GeneralizationEvents = getLineEventsByToolkit(Toolkit.GENERALIZATION);
const compositionEvents: CompositionEvents = getLineEventsByToolkit(Toolkit.COMPOSITION);
const selectedEvents: SelectedEvents = {
  onMousedown: (e, app) => {
    const mouseX = e.pageX - app.canvasRect.left;
    const mouseY = e.pageY - app.canvasRect.top;
    const shape = findSelectedShape(
      mouseX,
      mouseY,
      app.state.shapeList,
    );
    disableAllSelectedShape(app.state.shapeList);
    if (shape !== null) {
      // 有選中物件
      shape.selected = true;
      app.state.isDragging = true;
      app.state.shapeList.forEach((shape) => {
        if (shape.selected) {
          shape.selectedStartX = mouseX;
          shape.selectedStartY = mouseY;
        }
      });
      clearCanvas(app);
      drawAll(app.state.shapeList, app.state.lineList);
      app.state.isSelectingMultiShape = false;
    } else {
      // 沒選中物件，點選匡選範圍
      const { mouseX, mouseY } = getRectProps(e, app);
      app.state.startX = mouseX;
      app.state.startY = mouseY;
      app.state.isDrawing = true;
      app.state.isSelectingMultiShape = true;
    }
  },
  onMouseup: (e, app) => {
    const endX = e.pageX - app.canvasRect.left;
    const endY = e.pageY - app.canvasRect.top;
    // 拖曳單一物件後放開
    if (!app.state.isSelectingMultiShape) {
      app.state.isDragging = false;
      app.state.shapeList.forEach((shape) => {
        if (shape.selected) {
          const offsetX = endX - shape.selectedStartX;
          const offsetY = endY - shape.selectedStartY;
          shape.startX += offsetX;
          shape.startY += offsetY;
          shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
        }
      })
    }
    // 匡選範圍後放開
    if (app.state.isSelectingMultiShape) {
      app.state.isDrawing = false;
      app.state.shapeList.forEach((shape) => {
        const isAnyShapeInSelection = findSelectedShapes(shape, app, endX, endY);
        if (isAnyShapeInSelection) {
          shape.selected = true;
        }
        if (shape.selected) {
          shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
        }
      })
    }

    clearCanvas(app);
    drawAll(app.state.shapeList, app.state.lineList);
  },
  onMousemove: (e, app) => {
    // 拖曳單一物件
    if (!app.state.isSelectingMultiShape) {
      if (!app.state.isDragging) return;
      app.state.shapeList.forEach((shape) => {
        if (shape.selected) {
          const endX = e.pageX - app.canvasRect.left;
          const endY = e.pageY - app.canvasRect.top;
          const offsetX = endX - shape.selectedStartX;
          const offsetY = endY - shape.selectedStartY;
          shape.startX += offsetX;
          shape.startY += offsetY;
          shape.selectedStartX += offsetX;
          shape.selectedStartY += offsetY;
          shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
        }
      })
      clearCanvas(app);
      drawAll(app.state.shapeList, app.state.lineList);
    }

    // 正在匡選範圍
    if (!app.state.isDrawing || !app.state.isSelectingMultiShape || !app.state.startX || !app.state.startY || !app.ctx) return;
    clearCanvas(app);
    const { width, height, isRight, isBottom } = getRectProps(e, app);
    const shape = new RectShape(
      app.ctx as CanvasRenderingContext2D,
      app.state.startX,
      app.state.startY,
      0,
      0,
      isRight ? width : -width,
      isBottom ? height : -height,
      false,
      app.popZIndex(),
    );
    shape.draw();
    drawAll(app.state.shapeList, app.state.lineList);
  }
};

const rectangleEvents: RectangleEvents = {
  onMousedown: (e, app) => {
    disableAllSelectedShape(app.state.shapeList);
    const { mouseX, mouseY } = getRectProps(e, app);
    app.state.startX = mouseX;
    app.state.startY = mouseY;
    app.state.isDrawing = true;
  },
  onMouseup: (e, app) => {
    app.state.isDrawing = false;
    const { width, height, isRight, isBottom } = getRectProps(e, app);
    const shape = new RectShape(
      app.ctx as CanvasRenderingContext2D,
      app.state.startX,
      app.state.startY,
      0,
      0,
      isRight ? width : -width,
      isBottom ? height : -height,
      false,
      app.popZIndex(),
    )
    shape.calcPointsPosition(
      app.state.startX,
      app.state.startY
    )
    shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
    app.state.shapeList.push(shape);
    drawAll(app.state.shapeList, app.state.lineList);
  },
  onMousemove: (e, app) => {
    if (!app.state.isDrawing) return;
    if (app.state.startX && app.state.startY && app.ctx) {
      clearCanvas(app);
      const { width, height, isRight, isBottom } = getRectProps(e, app);
      const shape = new RectShape(
        app.ctx as CanvasRenderingContext2D,
        app.state.startX,
        app.state.startY,
        0,
        0,
        isRight ? width : -width,
        isBottom ? height : -height,
        false,
        app.popZIndex(),
      );
      shape.draw();
      drawAll(app.state.shapeList, app.state.lineList);
    }
  },
};

const ellipseEvents: EllipseEvents = {
  onMousedown: (e, app) => {
    disableAllSelectedShape(app.state.shapeList);
    const { mouseX, mouseY } = getEllipseProps(e, app);
    app.state.startX = mouseX;
    app.state.startY = mouseY;
    app.state.isDrawing = true;
  },
  onMouseup: (e, app) => {
    app.state.isDrawing = false;
    const { centerX, centerY, width, height } = getEllipseProps(e, app);
    const shape = new EllipseShape(
      app.ctx as CanvasRenderingContext2D,
      app.state.startX,
      app.state.startY,
      0,
      0,
      width,
      height,
      centerX,
      centerY,
      false,
      app.popZIndex(),
    );
    shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
    app.state.shapeList.push(shape);
    drawAll(app.state.shapeList, app.state.lineList);
  },
  onMousemove: (e, app) => {
    if (!app.state.isDrawing) return;
    const { width, height, centerX, centerY } = getEllipseProps(e, app);
    if (app.state.startX && app.state.startY && app.ctx) {
      clearCanvas(app);
      const shape = new EllipseShape(
        app.ctx as CanvasRenderingContext2D,
        app.state.startX,
        app.state.startY,
        0,
        0,
        width,
        height,
        centerX,
        centerY,
        false,
        app.popZIndex(),
      )
      shape.draw();
      drawAll(
        app.state.shapeList, app.state.lineList
      );
    }
  },
};

export { rectangleEvents, ellipseEvents, selectedEvents, associationEvents, generalizationEvents, compositionEvents };
