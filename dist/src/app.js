import { Toolkit } from "./types";
import { rectangleEvents, ellipseEvents, selectedEvents, associationEvents, generalizationEvents, compositionEvents } from "./events";
var AppImpl = /** @class */ (function () {
    function AppImpl(canvas) {
        var _this = this;
        this.rectangleOnMousedown = function (e) {
            rectangleEvents.onMousedown(e, _this);
        };
        this.rectangleOnMouseup = function (e) {
            rectangleEvents.onMouseup(e, _this);
        };
        this.rectangleOnMousemove = function (e) {
            rectangleEvents.onMousemove(e, _this);
        };
        this.ellipseOnMousedown = function (e) {
            ellipseEvents.onMousedown(e, _this);
        };
        this.ellipseOnMouseup = function (e) {
            ellipseEvents.onMouseup(e, _this);
        };
        this.ellipseOnMousemove = function (e) {
            ellipseEvents.onMousemove(e, _this);
        };
        this.selectOnMousemove = function (e) {
            selectedEvents.onMousemove(e, _this);
        };
        this.selectOnMouseup = function (e) {
            selectedEvents.onMouseup(e, _this);
        };
        this.selectOnMousedown = function (e) {
            selectedEvents.onMousedown(e, _this);
        };
        this.associationOnMousemove = function (e) {
            associationEvents.onMousemove(e, _this);
        };
        this.associationOnMouseup = function (e) {
            associationEvents.onMouseup(e, _this);
        };
        this.associationOnMousedown = function (e) {
            associationEvents.onMousedown(e, _this);
        };
        this.generalizationOnMousemove = function (e) {
            generalizationEvents.onMousemove(e, _this);
        };
        this.generalizationOnMouseup = function (e) {
            generalizationEvents.onMouseup(e, _this);
        };
        this.generalizationOnMousedown = function (e) {
            generalizationEvents.onMousedown(e, _this);
        };
        this.compositionOnMousemove = function (e) {
            compositionEvents.onMousemove(e, _this);
        };
        this.compositionOnMouseup = function (e) {
            compositionEvents.onMouseup(e, _this);
        };
        this.compositionOnMousedown = function (e) {
            compositionEvents.onMousedown(e, _this);
        };
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvasRect = this.canvas.getBoundingClientRect();
        this.state = {
            startX: 0,
            startY: 0,
            selectedPointX: 0,
            selectedPointY: 0,
            isDrawing: false,
            isDragging: false,
            isSelectingMultiShape: false,
            shapeList: [],
            lineList: [],
            currentToolkit: undefined,
            zIndex: 0,
        };
        if (this.ctx) {
            this.ctx.lineJoin = 'round';
            this.ctx.lineWidth = 1;
        }
        var dropdown = document.getElementById('dropdown-btn');
        var dropdownContent = document.querySelector('.dropdown-content');
        var dropdownName = document.getElementById('dropdown-name');
        var dialog = document.getElementById('dialog');
        var submit = document.getElementById('submit');
        var closeDialog = document.getElementById('close-dialog');
        dropdown === null || dropdown === void 0 ? void 0 : dropdown.addEventListener('click', function () {
            dropdownContent === null || dropdownContent === void 0 ? void 0 : dropdownContent.classList.toggle('show');
        });
        var state = {
            isDialogOpened: false,
        };
        dropdownName === null || dropdownName === void 0 ? void 0 : dropdownName.addEventListener('click', function () {
            _this.state.shapeList.forEach(function (shape) {
                if (shape.selected) {
                    state.isDialogOpened = true;
                    if (state.isDialogOpened) {
                        dropdownContent === null || dropdownContent === void 0 ? void 0 : dropdownContent.classList.remove('show');
                        dialog === null || dialog === void 0 ? void 0 : dialog.showModal();
                    }
                }
            });
        });
        submit === null || submit === void 0 ? void 0 : submit.addEventListener('click', function () {
            var inputDOM = document.getElementById('name');
            var inputValue = inputDOM === null || inputDOM === void 0 ? void 0 : inputDOM.value;
            if (inputValue) {
                dialog === null || dialog === void 0 ? void 0 : dialog.close();
                _this.state.shapeList.forEach(function (shape) {
                    if (shape.selected) {
                        shape.name = inputValue;
                    }
                });
            }
            if (inputDOM) {
                inputDOM.value = '';
            }
            _this.state.shapeList.forEach(function (shape) {
                if (shape.name) {
                    shape.draw();
                    shape.drawPoints();
                    shape.fillText();
                }
            });
        });
        closeDialog === null || closeDialog === void 0 ? void 0 : closeDialog.addEventListener('click', function () {
            dialog === null || dialog === void 0 ? void 0 : dialog.close();
        });
    }
    AppImpl.prototype.popZIndex = function () {
        return this.state.zIndex++;
    };
    AppImpl.prototype.registerEventListeners = function (toolkit) {
        switch (toolkit) {
            case Toolkit.RECTANGLE:
                this.canvas.addEventListener('mousedown', this.rectangleOnMousedown);
                this.canvas.addEventListener('mouseup', this.rectangleOnMouseup);
                this.canvas.addEventListener('mousemove', this.rectangleOnMousemove);
                break;
            case Toolkit.ELLIPSE:
                this.canvas.addEventListener('mousedown', this.ellipseOnMousedown);
                this.canvas.addEventListener('mouseup', this.ellipseOnMouseup);
                this.canvas.addEventListener('mousemove', this.ellipseOnMousemove);
                break;
            case Toolkit.SELECT:
                this.canvas.addEventListener('mousedown', this.selectOnMousedown);
                this.canvas.addEventListener('mouseup', this.selectOnMouseup);
                this.canvas.addEventListener('mousemove', this.selectOnMousemove);
                break;
            case Toolkit.ASSOCIATION:
                this.canvas.addEventListener('mousedown', this.associationOnMousedown);
                this.canvas.addEventListener('mouseup', this.associationOnMouseup);
                this.canvas.addEventListener('mousemove', this.associationOnMousemove);
                break;
            case Toolkit.GENERALIZATION:
                this.canvas.addEventListener('mousedown', this.generalizationOnMousedown);
                this.canvas.addEventListener('mouseup', this.generalizationOnMouseup);
                this.canvas.addEventListener('mousemove', this.generalizationOnMousemove);
                break;
            case Toolkit.COMPOSITION:
                this.canvas.addEventListener('mousedown', this.compositionOnMousedown);
                this.canvas.addEventListener('mouseup', this.compositionOnMouseup);
                this.canvas.addEventListener('mousemove', this.compositionOnMousemove);
                break;
            default:
                break;
        }
    };
    AppImpl.prototype.unregisterEventListeners = function (toolkit) {
        switch (toolkit) {
            case Toolkit.RECTANGLE:
                this.canvas.removeEventListener('mousedown', this.rectangleOnMousedown);
                this.canvas.removeEventListener('mouseup', this.rectangleOnMouseup);
                this.canvas.removeEventListener('mousemove', this.rectangleOnMousemove);
                break;
            case Toolkit.ELLIPSE:
                this.canvas.removeEventListener('mousedown', this.ellipseOnMousedown);
                this.canvas.removeEventListener('mouseup', this.ellipseOnMouseup);
                this.canvas.removeEventListener('mousemove', this.ellipseOnMousemove);
                break;
            case Toolkit.SELECT:
                this.canvas.removeEventListener('mousedown', this.selectOnMousedown);
                this.canvas.removeEventListener('mouseup', this.selectOnMouseup);
                this.canvas.removeEventListener('mousemove', this.selectOnMousemove);
                break;
            case Toolkit.ASSOCIATION:
                this.canvas.removeEventListener('mousedown', this.associationOnMousedown);
                this.canvas.removeEventListener('mouseup', this.associationOnMouseup);
                this.canvas.removeEventListener('mousemove', this.associationOnMousemove);
                break;
            case Toolkit.GENERALIZATION:
                this.canvas.removeEventListener('mousedown', this.generalizationOnMousedown);
                this.canvas.removeEventListener('mouseup', this.generalizationOnMouseup);
                this.canvas.removeEventListener('mousemove', this.generalizationOnMousemove);
                break;
            case Toolkit.COMPOSITION:
                this.canvas.removeEventListener('mousedown', this.compositionOnMousedown);
                this.canvas.removeEventListener('mouseup', this.compositionOnMouseup);
                this.canvas.removeEventListener('mousemove', this.compositionOnMousemove);
                break;
            default:
                break;
        }
    };
    return AppImpl;
}());
export { AppImpl };
