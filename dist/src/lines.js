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
var Line = /** @class */ (function () {
    function Line(fromShape, toShape, ctx) {
        this.fromShape = fromShape;
        this.toShape = toShape;
        this.ctx = ctx;
    }
    Line.prototype.findConnectionPort = function () {
        if (this.fromShape.selectedShape && this.toShape.selectedShape) {
            var minDistance = Number.MAX_VALUE;
            var connectionPorts = {
                from: { x: 0, y: 0 },
                to: { x: 0, y: 0 },
            };
            for (var _i = 0, _a = Object.values(this.fromShape.selectedShape); _i < _a.length; _i++) {
                var fromPoint = _a[_i];
                for (var _b = 0, _c = Object.values(this.toShape.selectedShape); _b < _c.length; _b++) {
                    var toPoint = _c[_b];
                    var xDiff = fromPoint.x - toPoint.x;
                    var yDiff = fromPoint.y - toPoint.y;
                    var dist = Math.sqrt((Math.pow(xDiff, 2) + Math.pow(yDiff, 2)));
                    if (dist < minDistance) {
                        minDistance = dist;
                        connectionPorts.from = fromPoint;
                        connectionPorts.to = toPoint;
                    }
                }
            }
            return connectionPorts;
        }
        return null;
    };
    ;
    return Line;
}());
export { Line };
var AssociationLine = /** @class */ (function (_super) {
    __extends(AssociationLine, _super);
    function AssociationLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssociationLine.prototype.drawLine = function () {
        var connectionPorts = this.findConnectionPort();
        if (connectionPorts) {
            this.ctx.beginPath();
            this.ctx.moveTo(connectionPorts.from.x, connectionPorts.from.y);
            this.ctx.lineTo(connectionPorts.to.x, connectionPorts.to.y);
            this.ctx.stroke();
        }
    };
    return AssociationLine;
}(Line));
export { AssociationLine };
var GeneralizationLine = /** @class */ (function (_super) {
    __extends(GeneralizationLine, _super);
    function GeneralizationLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GeneralizationLine.prototype.drawLine = function () {
        var connectionPorts = this.findConnectionPort();
        if (connectionPorts) {
            var adx = connectionPorts.to.x - connectionPorts.from.x;
            var ady = connectionPorts.to.y - connectionPorts.from.y;
            var middleX = adx * 0.9 + connectionPorts.from.x;
            var middleY = ady * 0.9 + connectionPorts.from.y;
            var tdx = connectionPorts.to.x - middleX;
            var tdy = connectionPorts.to.y - middleY;
            this.ctx.beginPath();
            this.ctx.moveTo(connectionPorts.from.x, connectionPorts.from.y);
            this.ctx.lineTo(middleX, middleY);
            this.ctx.moveTo(middleX + 0.5 * tdy, middleY - 0.5 * tdx);
            this.ctx.lineTo(middleX - 0.5 * tdy, middleY + 0.5 * tdx);
            this.ctx.lineTo(connectionPorts.to.x, connectionPorts.to.y);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    };
    return GeneralizationLine;
}(Line));
export { GeneralizationLine };
var CompositionLine = /** @class */ (function (_super) {
    __extends(CompositionLine, _super);
    function CompositionLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CompositionLine.prototype.drawLine = function () {
        var connectionPorts = this.findConnectionPort();
        if (connectionPorts) {
            var adx = connectionPorts.to.x - connectionPorts.from.x;
            var ady = connectionPorts.to.y - connectionPorts.from.y;
            var middleStartX = adx * 0.9 + connectionPorts.from.x;
            var middleStartY = ady * 0.9 + connectionPorts.from.y;
            var middleX = adx * 0.95 + connectionPorts.from.x;
            var middleY = ady * 0.95 + connectionPorts.from.y;
            var tdx = connectionPorts.to.x - middleX;
            var tdy = connectionPorts.to.y - middleY;
            this.ctx.beginPath();
            this.ctx.moveTo(connectionPorts.from.x, connectionPorts.from.y);
            this.ctx.lineTo(middleStartX, middleStartY);
            this.ctx.lineTo(middleX + 0.5 * tdy, middleY - 0.5 * tdx);
            this.ctx.lineTo(connectionPorts.to.x, connectionPorts.to.y);
            this.ctx.lineTo(middleX - 0.5 * tdy, middleY + 0.5 * tdx);
            this.ctx.lineTo(middleStartX, middleStartY);
            this.ctx.stroke();
        }
    };
    return CompositionLine;
}(Line));
export { CompositionLine };
