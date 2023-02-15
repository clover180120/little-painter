import { Toolkit } from "./types";
import { AppImpl } from "./app";
var app = new AppImpl(document.getElementById('canvas'));
var tools = [
    {
        node: document.getElementById('rectangle'),
        listeners: {
            click: function () {
                if (app.state.currentToolkit !== Toolkit.RECTANGLE) {
                    app.unregisterEventListeners(app.state.currentToolkit);
                }
                app.registerEventListeners(Toolkit.RECTANGLE);
                app.state.currentToolkit = Toolkit.RECTANGLE;
            },
        },
    },
    {
        node: document.querySelector('.toolbar'),
        listeners: {
            click: function (e) {
                var toolbarItems = document.querySelectorAll('.toolbar-item');
                toolbarItems.forEach(function (i) { return i.classList.remove('active'); });
                var target = e.target;
                target.classList.add('active');
            },
        },
    },
    {
        node: document.getElementById('ellipse'),
        listeners: {
            click: function () {
                if (app.state.currentToolkit !== Toolkit.ELLIPSE) {
                    app.unregisterEventListeners(app.state.currentToolkit);
                }
                app.registerEventListeners(Toolkit.ELLIPSE);
                app.state.currentToolkit = Toolkit.ELLIPSE;
            },
        },
    },
    {
        node: document.getElementById('select'),
        listeners: {
            click: function () {
                if (app.state.currentToolkit !== Toolkit.SELECT) {
                    app.unregisterEventListeners(app.state.currentToolkit);
                }
                app.registerEventListeners(Toolkit.SELECT);
                app.state.currentToolkit = Toolkit.SELECT;
            },
        },
    },
    {
        node: document.getElementById('association'),
        listeners: {
            click: function () {
                if (app.state.currentToolkit !== Toolkit.ASSOCIATION) {
                    app.unregisterEventListeners(app.state.currentToolkit);
                }
                app.registerEventListeners(Toolkit.ASSOCIATION);
                app.state.currentToolkit = Toolkit.ASSOCIATION;
            },
        },
    },
    {
        node: document.getElementById('generalization'),
        listeners: {
            click: function () {
                if (app.state.currentToolkit !== Toolkit.GENERALIZATION) {
                    app.unregisterEventListeners(app.state.currentToolkit);
                }
                app.registerEventListeners(Toolkit.GENERALIZATION);
                app.state.currentToolkit = Toolkit.GENERALIZATION;
            },
        },
    },
    {
        node: document.getElementById('composition'),
        listeners: {
            click: function () {
                if (app.state.currentToolkit !== Toolkit.COMPOSITION) {
                    app.unregisterEventListeners(app.state.currentToolkit);
                }
                app.registerEventListeners(Toolkit.COMPOSITION);
                app.state.currentToolkit = Toolkit.COMPOSITION;
            },
        },
    },
];
tools.forEach(function (nodeObj) {
    Object.entries(nodeObj.listeners).forEach(function (_a) {
        var _b;
        var key = _a[0], value = _a[1];
        (_b = nodeObj.node) === null || _b === void 0 ? void 0 : _b.addEventListener(key, value);
    });
});
