var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var compareZIndex = function (a, b) {
    return b - a;
};
export var findSelectedShape = function (x, y, shapeList) {
    var shapeIndex = __spreadArray([], shapeList, true).sort(function (a, b) { return compareZIndex(a.zIndex, b.zIndex); })
        .findIndex(function (shape) {
        return shape.isShapeSelected(x, y);
    });
    if (shapeIndex === -1) {
        return null;
    }
    shapeIndex = shapeList.length - shapeIndex - 1;
    return shapeList[shapeIndex];
};
export var disableAllSelectedShape = function (shapeList) {
    shapeList.forEach(function (shape) {
        shape.selected = false;
    });
};
export var getRectProps = function (e, app) {
    var mouseX = e.pageX - app.canvasRect.left;
    var mouseY = e.pageY - app.canvasRect.top;
    var width = Math.abs(mouseX - app.state.startX);
    var height = Math.abs(mouseY - app.state.startY);
    var isRight = mouseX >= app.state.startX;
    var isBottom = mouseY > app.state.startY;
    return { mouseX: mouseX, mouseY: mouseY, width: width, height: height, isRight: isRight, isBottom: isBottom };
};
export var getEllipseProps = function (e, app) {
    var mouseX = e.pageX - app.canvasRect.left;
    var mouseY = e.pageY - app.canvasRect.top;
    var width = Math.abs(mouseX - app.state.startX);
    var height = Math.abs(mouseY - app.state.startY);
    var centerX = mouseX + width / 2;
    var centerY = mouseY + height / 2;
    var isRight = mouseX >= app.state.startX;
    var isBottom = mouseY > app.state.startY;
    return { mouseX: mouseX, mouseY: mouseY, width: width, height: height, centerX: centerX, centerY: centerY, isRight: isRight, isBottom: isBottom };
};
export var findOverlay = function (shape, shapeList) {
    for (var _i = 0, shapeList_1 = shapeList; _i < shapeList_1.length; _i++) {
        var otherShape = shapeList_1[_i];
        if (!otherShape.selected) {
            var isOverlapping = !((shape.startX + shape.width) < otherShape.startX
                || shape.startX > (otherShape.startX + otherShape.width)
                || (shape.startY + shape.height) < otherShape.startY
                || shape.startY > (otherShape.startY + otherShape.height));
            if (isOverlapping)
                return otherShape;
        }
    }
    return null;
};
export var findSelectedShapes = function (shape, app, endX, endY) {
    var startX = shape.startX, startY = shape.startY, width = shape.width, height = shape.height;
    var minX = Math.min(endX, app.state.startX);
    var maxX = Math.max(endX, app.state.startX);
    var minY = Math.min(endY, app.state.startY);
    var maxY = Math.max(endY, app.state.startY);
    return startX > minX
        && startX + width < maxX
        && startY > minY
        && startY + height < maxY;
};
