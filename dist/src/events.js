import { AssociationLine, CompositionLine, GeneralizationLine } from './lines';
import { RectShape, EllipseShape } from './shapes';
import { Toolkit } from './types';
import { findSelectedShape, disableAllSelectedShape, getRectProps, getEllipseProps, findOverlay, findSelectedShapes, } from "./utils";
var drawAllShapes = function (shapeList) {
    shapeList.forEach(function (shape) {
        shape.draw();
        shape.drawPoints();
        shape.fillText();
    });
};
var drawAllLines = function (lineList) {
    lineList.forEach(function (line) {
        line.drawLine();
    });
};
var drawAll = function (shapeList, lineList) {
    drawAllShapes(shapeList);
    drawAllLines(lineList);
};
var clearCanvas = function (app) {
    var ctx = app.ctx, canvasRect = app.canvasRect;
    if (!ctx)
        return;
    ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
};
var drawShapeLineMouseDown = function (e, app) {
    var mouseX = e.pageX - app.canvasRect.left;
    var mouseY = e.pageY - app.canvasRect.top;
    var shape = findSelectedShape(mouseX, mouseY, app.state.shapeList);
    disableAllSelectedShape(app.state.shapeList);
    if (shape !== null) {
        shape.selected = true;
        app.state.isDragging = true;
        app.state.shapeList.forEach(function (shape) {
            if (shape.selected) {
                shape.selectedStartX = mouseX;
                shape.selectedStartY = mouseY;
            }
        });
        clearCanvas(app);
        drawAll(app.state.shapeList, app.state.lineList);
        app.state.isSelectingMultiShape = false;
    }
};
var drawShapeLineMouseUp = function (e, app, toolkit) {
    app.state.isDragging = false;
    var endX = e.pageX - app.canvasRect.left;
    var endY = e.pageY - app.canvasRect.top;
    app.state.shapeList.forEach(function (shape) {
        if (shape.selected) {
            var fromShape = Object.assign(Object.create(Object.getPrototypeOf(shape)), shape);
            var offsetX = endX - fromShape.selectedStartX;
            var offsetY = endY - fromShape.selectedStartY;
            fromShape.startX += offsetX;
            fromShape.startY += offsetY;
            fromShape.selectedShape = fromShape.calcPointsPosition(fromShape.startX, fromShape.startY);
            var toShape = findOverlay(fromShape, app.state.shapeList);
            if (toShape && app.ctx) {
                switch (toolkit) {
                    case Toolkit.ASSOCIATION:
                        var associationLine = new AssociationLine(shape, toShape, app.ctx);
                        app.state.lineList.push(associationLine);
                        break;
                    case Toolkit.GENERALIZATION:
                        var generalizationLine = new GeneralizationLine(shape, toShape, app.ctx);
                        app.state.lineList.push(generalizationLine);
                        break;
                    case Toolkit.COMPOSITION:
                        var compositionLine = new CompositionLine(shape, toShape, app.ctx);
                        app.state.lineList.push(compositionLine);
                        break;
                    default:
                        break;
                }
            }
        }
    });
    clearCanvas(app);
    drawAll(app.state.shapeList, app.state.lineList);
};
var getLineEventsByToolkit = function (toolkit) { return ({
    onMousedown: function (e, app) { return drawShapeLineMouseDown(e, app); },
    onMouseup: function (e, app) { return drawShapeLineMouseUp(e, app, toolkit); },
    onMousemove: function (e, app) { }
}); };
var associationEvents = getLineEventsByToolkit(Toolkit.ASSOCIATION);
var generalizationEvents = getLineEventsByToolkit(Toolkit.GENERALIZATION);
var compositionEvents = getLineEventsByToolkit(Toolkit.COMPOSITION);
var selectedEvents = {
    onMousedown: function (e, app) {
        var mouseX = e.pageX - app.canvasRect.left;
        var mouseY = e.pageY - app.canvasRect.top;
        var shape = findSelectedShape(mouseX, mouseY, app.state.shapeList);
        disableAllSelectedShape(app.state.shapeList);
        if (shape !== null) {
            // 有選中物件
            shape.selected = true;
            app.state.isDragging = true;
            app.state.shapeList.forEach(function (shape) {
                if (shape.selected) {
                    shape.selectedStartX = mouseX;
                    shape.selectedStartY = mouseY;
                }
            });
            clearCanvas(app);
            drawAll(app.state.shapeList, app.state.lineList);
            app.state.isSelectingMultiShape = false;
        }
        else {
            // 沒選中物件，點選匡選範圍
            var _a = getRectProps(e, app), mouseX_1 = _a.mouseX, mouseY_1 = _a.mouseY;
            app.state.startX = mouseX_1;
            app.state.startY = mouseY_1;
            app.state.isDrawing = true;
            app.state.isSelectingMultiShape = true;
        }
    },
    onMouseup: function (e, app) {
        var endX = e.pageX - app.canvasRect.left;
        var endY = e.pageY - app.canvasRect.top;
        // 拖曳單一物件後放開
        if (!app.state.isSelectingMultiShape) {
            app.state.isDragging = false;
            app.state.shapeList.forEach(function (shape) {
                if (shape.selected) {
                    var offsetX = endX - shape.selectedStartX;
                    var offsetY = endY - shape.selectedStartY;
                    shape.startX += offsetX;
                    shape.startY += offsetY;
                    shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
                }
            });
        }
        // 匡選範圍後放開
        if (app.state.isSelectingMultiShape) {
            app.state.isDrawing = false;
            app.state.shapeList.forEach(function (shape) {
                var isAnyShapeInSelection = findSelectedShapes(shape, app, endX, endY);
                if (isAnyShapeInSelection) {
                    shape.selected = true;
                }
                if (shape.selected) {
                    shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
                }
            });
        }
        clearCanvas(app);
        drawAll(app.state.shapeList, app.state.lineList);
    },
    onMousemove: function (e, app) {
        // 拖曳單一物件
        if (!app.state.isSelectingMultiShape) {
            if (!app.state.isDragging)
                return;
            app.state.shapeList.forEach(function (shape) {
                if (shape.selected) {
                    var endX = e.pageX - app.canvasRect.left;
                    var endY = e.pageY - app.canvasRect.top;
                    var offsetX = endX - shape.selectedStartX;
                    var offsetY = endY - shape.selectedStartY;
                    shape.startX += offsetX;
                    shape.startY += offsetY;
                    shape.selectedStartX += offsetX;
                    shape.selectedStartY += offsetY;
                    shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
                }
            });
            clearCanvas(app);
            drawAll(app.state.shapeList, app.state.lineList);
        }
        // 正在匡選範圍
        if (!app.state.isDrawing || !app.state.isSelectingMultiShape || !app.state.startX || !app.state.startY || !app.ctx)
            return;
        clearCanvas(app);
        var _a = getRectProps(e, app), width = _a.width, height = _a.height, isRight = _a.isRight, isBottom = _a.isBottom;
        var shape = new RectShape(app.ctx, app.state.startX, app.state.startY, 0, 0, isRight ? width : -width, isBottom ? height : -height, false, app.popZIndex());
        shape.draw();
        drawAll(app.state.shapeList, app.state.lineList);
    }
};
var rectangleEvents = {
    onMousedown: function (e, app) {
        disableAllSelectedShape(app.state.shapeList);
        var _a = getRectProps(e, app), mouseX = _a.mouseX, mouseY = _a.mouseY;
        app.state.startX = mouseX;
        app.state.startY = mouseY;
        app.state.isDrawing = true;
    },
    onMouseup: function (e, app) {
        app.state.isDrawing = false;
        var _a = getRectProps(e, app), width = _a.width, height = _a.height, isRight = _a.isRight, isBottom = _a.isBottom;
        var shape = new RectShape(app.ctx, app.state.startX, app.state.startY, 0, 0, isRight ? width : -width, isBottom ? height : -height, false, app.popZIndex());
        shape.calcPointsPosition(app.state.startX, app.state.startY);
        shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
        app.state.shapeList.push(shape);
        drawAll(app.state.shapeList, app.state.lineList);
    },
    onMousemove: function (e, app) {
        if (!app.state.isDrawing)
            return;
        if (app.state.startX && app.state.startY && app.ctx) {
            clearCanvas(app);
            var _a = getRectProps(e, app), width = _a.width, height = _a.height, isRight = _a.isRight, isBottom = _a.isBottom;
            var shape = new RectShape(app.ctx, app.state.startX, app.state.startY, 0, 0, isRight ? width : -width, isBottom ? height : -height, false, app.popZIndex());
            shape.draw();
            drawAll(app.state.shapeList, app.state.lineList);
        }
    },
};
var ellipseEvents = {
    onMousedown: function (e, app) {
        disableAllSelectedShape(app.state.shapeList);
        var _a = getEllipseProps(e, app), mouseX = _a.mouseX, mouseY = _a.mouseY;
        app.state.startX = mouseX;
        app.state.startY = mouseY;
        app.state.isDrawing = true;
    },
    onMouseup: function (e, app) {
        app.state.isDrawing = false;
        var _a = getEllipseProps(e, app), centerX = _a.centerX, centerY = _a.centerY, width = _a.width, height = _a.height;
        var shape = new EllipseShape(app.ctx, app.state.startX, app.state.startY, 0, 0, width, height, centerX, centerY, false, app.popZIndex());
        shape.selectedShape = shape.calcPointsPosition(shape.startX, shape.startY);
        app.state.shapeList.push(shape);
        drawAll(app.state.shapeList, app.state.lineList);
    },
    onMousemove: function (e, app) {
        if (!app.state.isDrawing)
            return;
        var _a = getEllipseProps(e, app), width = _a.width, height = _a.height, centerX = _a.centerX, centerY = _a.centerY;
        if (app.state.startX && app.state.startY && app.ctx) {
            clearCanvas(app);
            var shape = new EllipseShape(app.ctx, app.state.startX, app.state.startY, 0, 0, width, height, centerX, centerY, false, app.popZIndex());
            shape.draw();
            drawAll(app.state.shapeList, app.state.lineList);
        }
    },
};
export { rectangleEvents, ellipseEvents, selectedEvents, associationEvents, generalizationEvents, compositionEvents };
