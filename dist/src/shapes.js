var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Shape = /** @class */ (function () {
    function Shape(startX, startY, selectedStartX, selectedStartY, width, height, zIndex, selected, selectedShape, name) {
        this.startX = startX;
        this.startY = startY;
        this.selectedStartX = selectedStartX;
        this.selectedStartY = selectedStartY;
        this.width = width;
        this.height = height;
        this.zIndex = zIndex;
        this.selected = selected;
        this.selectedShape = selectedShape;
        this.name = name;
    }
    return Shape;
}());
export { Shape };
;
var RectShape = /** @class */ (function (_super) {
    __extends(RectShape, _super);
    function RectShape(ctx, startX, startY, selectedStartX, selectedStartY, width, height, selected, zIndex, selectedShape, name) {
        var _this = _super.call(this, startX, startY, selectedStartX, selectedStartY, width, height, zIndex, selected) || this;
        _this.ctx = ctx;
        _this.selectedShape = selectedShape;
        _this.name = name;
        return _this;
    }
    ;
    RectShape.prototype.isShapeSelected = function (x, y) {
        var node = new Path2D();
        node.rect(this.startX, this.startY, this.width, this.height);
        return this.ctx.isPointInPath(node, x, y);
    };
    ;
    RectShape.prototype.draw = function () {
        if (!this.ctx)
            return;
        this.ctx.beginPath();
        this.ctx.rect(this.startX, this.startY, this.width, this.height);
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillRect(this.startX, this.startY, this.width, this.height);
        this.ctx.stroke();
        this.ctx.save();
    };
    ;
    RectShape.prototype.drawPoints = function () {
        var _this = this;
        if (this.selected && this.selectedShape) {
            Object.values(this.selectedShape).map(function (_a) {
                var x = _a.x, y = _a.y;
                if (!_this.ctx)
                    return;
                _this.ctx.beginPath();
                _this.ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
                _this.ctx.fillStyle = '#3a3a3a';
                _this.ctx.fill();
                _this.ctx.stroke();
            });
        }
    };
    ;
    RectShape.prototype.calcPointsPosition = function (x, y) {
        return {
            top: {
                x: x + this.width / 2,
                y: y,
            },
            bottom: {
                x: x + this.width / 2,
                y: y + this.height,
            },
            left: {
                x: x,
                y: y + this.height / 2,
            },
            right: {
                x: x + this.width,
                y: y + this.height / 2,
            },
        };
    };
    RectShape.prototype.fillText = function () {
        if (this.name) {
            this.ctx.fillStyle = '#3a3a3a';
            this.ctx.font = "20px Arial";
            this.ctx.fillText(this.name, (this.startX + this.width / 2) - (this.name.length * 4), this.startY + this.height / 2);
        }
    };
    return RectShape;
}(Shape));
export { RectShape };
;
var EllipseShape = /** @class */ (function (_super) {
    __extends(EllipseShape, _super);
    function EllipseShape(ctx, startX, startY, selectedStartX, selectedStartY, width, height, centerX, centerY, selected, zIndex, selectedShape, name) {
        var _this = _super.call(this, startX, startY, selectedStartX, selectedStartY, width, height, zIndex, selected) || this;
        _this.ctx = ctx;
        _this.centerX = centerX;
        _this.centerY = centerY;
        _this.selectedShape = selectedShape;
        _this.name = name;
        return _this;
    }
    ;
    EllipseShape.prototype.isShapeSelected = function (x, y) {
        var node = new Path2D();
        node.ellipse(this.startX, this.startY, this.width, this.height, 0, 0, 2 * Math.PI);
        return this.ctx.isPointInPath(node, x, y);
    };
    ;
    EllipseShape.prototype.draw = function () {
        if (!this.ctx)
            return;
        this.ctx.beginPath();
        this.ctx.ellipse(this.startX, this.startY, this.width, this.height, 0, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = '#FFF';
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.save();
    };
    ;
    EllipseShape.prototype.drawPoints = function () {
        var _this = this;
        if (this.selected && this.selectedShape) {
            Object.values(this.selectedShape).map(function (_a) {
                var x = _a.x, y = _a.y;
                if (!_this.ctx)
                    return;
                _this.ctx.beginPath();
                _this.ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
                _this.ctx.fillStyle = '#3a3a3a';
                _this.ctx.fill();
                _this.ctx.stroke();
            });
        }
    };
    ;
    EllipseShape.prototype.calcPointsPosition = function (x, y) {
        return {
            top: {
                x: x,
                y: y - this.height,
            },
            bottom: {
                x: x,
                y: y + this.height,
            },
            left: {
                x: x - this.width,
                y: y,
            },
            right: {
                x: x + this.width,
                y: y,
            },
        };
    };
    EllipseShape.prototype.fillText = function () {
        if (this.name) {
            this.ctx.fillStyle = '#3a3a3a';
            this.ctx.font = "20px Arial";
            this.ctx.fillText(this.name, this.startX - this.name.length * 4, this.startY);
        }
    };
    return EllipseShape;
}(Shape));
export { EllipseShape };
