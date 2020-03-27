(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/_classes/async-data-source.ts":
/*!***********************************************!*\
  !*** ./src/app/_classes/async-data-source.ts ***!
  \***********************************************/
/*! exports provided: AsyncDataSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncDataSource", function() { return AsyncDataSource; });
/* harmony import */ var _async_processor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./async-processor */ "./src/app/_classes/async-processor.ts");


class AsyncDataSource {
    constructor(search) {
        this.search = search;
        this.callback = undefined;
        this.processor = new _async_processor__WEBPACK_IMPORTED_MODULE_0__["AsyncProcessor"]();
        this.processor.maxRetryCount = _async_processor__WEBPACK_IMPORTED_MODULE_0__["AsyncProcessor"].RETRY_NO_LIMIT;
        this.processor.process = (key) => { return search(); };
        this.processor.progress = (key, data, result) => {
            if (!this.callback) {
                return;
            }
            if (result === _async_processor__WEBPACK_IMPORTED_MODULE_0__["AsyncProcessorResult"].SUCCESS) {
                this.callback(data);
            }
            else if (result === _async_processor__WEBPACK_IMPORTED_MODULE_0__["AsyncProcessorResult"].FAILED) {
                // this will only be called if the source's creator sets the
                // maxRetryCount to some finite number, at which point, they are
                // expecting to get an 'undefined' result on failure.
                this.callback(undefined);
            }
        };
    }
    refresh() { this.processor.processKeys([""]); }
    cancel() { this.processor.cancel(); }
}


/***/ }),

/***/ "./src/app/_classes/async-processor.ts":
/*!*********************************************!*\
  !*** ./src/app/_classes/async-processor.ts ***!
  \*********************************************/
/*! exports provided: AsyncProcessorResult, AsyncProcessor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncProcessorResult", function() { return AsyncProcessorResult; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncProcessor", function() { return AsyncProcessor; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");

var AsyncProcessorResult;
(function (AsyncProcessorResult) {
    AsyncProcessorResult[AsyncProcessorResult["SUCCESS"] = 0] = "SUCCESS";
    AsyncProcessorResult[AsyncProcessorResult["FAILED"] = 1] = "FAILED";
    AsyncProcessorResult[AsyncProcessorResult["FAILED_WILL_RETRY"] = 2] = "FAILED_WILL_RETRY";
    AsyncProcessorResult[AsyncProcessorResult["CANCELED"] = 3] = "CANCELED";
})(AsyncProcessorResult || (AsyncProcessorResult = {}));
class AsyncProcessor {
    constructor() {
        this.enabled = true;
        this.working = false;
        this.maxRetryCount = 0;
        this.retryDelay = 5.0; // seconds
        this.process = undefined;
        this.progress = undefined;
        this.complete = undefined;
        this.processing = undefined;
        this.pending = undefined;
        this.retryCount = 0;
        this.pointer = 0;
        this.result = AsyncProcessorResult.SUCCESS;
    }
    processKeys(keys) {
        if (keys === undefined || !this.enabled) {
            return;
        }
        this.pending = keys;
        if (this.processing !== undefined) {
            return;
        }
        this.working = true;
        this.processing = this.pending;
        this.pending = undefined;
        this.next();
    }
    next() {
        if (this.processing.length == 0 || this.processing.length <= this.pointer) {
            let result = this.result;
            this.result = AsyncProcessorResult.SUCCESS;
            this.pointer = 0;
            this.processing = undefined;
            this.working = false;
            if (this.complete) {
                this.complete(result);
            }
            this.processKeys(this.pending);
            return;
        }
        if (this.process) {
            this.process(this.processing[this.pointer]).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["first"])()).subscribe(result => {
                this.completion(result, true);
            }, error => {
                this.completion(undefined, false);
            });
        }
        else {
            this.completion(undefined, true);
        }
    }
    completion(data, success) {
        if (this.result == AsyncProcessorResult.CANCELED) {
            this.next();
        }
        else if (success) {
            if (this.progress) {
                this.progress(this.processing[this.pointer], data, AsyncProcessorResult.SUCCESS);
            }
            this.retryCount = 0;
            this.pointer++;
            this.next();
        }
        else if (this.maxRetryCount == AsyncProcessor.RETRY_NO_LIMIT || this.retryCount < this.maxRetryCount) {
            if (this.progress) {
                this.progress(this.processing[this.pointer], undefined, AsyncProcessorResult.FAILED_WILL_RETRY);
            }
            this.retryCount++;
            setTimeout(() => { this.next(); }, this.retryDelay * 1000);
        }
        else {
            if (this.progress) {
                this.progress(this.processing[this.pointer], undefined, AsyncProcessorResult.FAILED);
            }
            this.result = AsyncProcessorResult.FAILED;
            this.retryCount = 0;
            this.pointer++;
            this.next();
        }
    }
    cancel() {
        if (!this.processing || this.processing.length == 0) {
            return;
        }
        this.processing = [];
        this.result = AsyncProcessorResult.CANCELED;
    }
}
AsyncProcessor.RETRY_NO_LIMIT = -1;


/***/ }),

/***/ "./src/app/_classes/history.ts":
/*!*************************************!*\
  !*** ./src/app/_classes/history.ts ***!
  \*************************************/
/*! exports provided: HistoryEntry, History */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HistoryEntry", function() { return HistoryEntry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "History", function() { return History; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");


let HISTORY_ENTRY_ID = 0;
class HistoryEntry {
    constructor(url) {
        this.url = url;
        this.variables = {};
        this.id = HISTORY_ENTRY_ID++;
    }
}
class History {
    constructor(router) {
        this.router = router;
        this.history = [];
        this.index = -1;
        this.entrySubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.changeEmitted$ = this.entrySubject.asObservable();
        this.router.events.subscribe((event) => {
            if (!(event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_0__["NavigationEnd"])) {
                return;
            }
            console.log("Navigated To: " + this.router.url);
            this.navigatedTo(this.router.url);
        });
        History._instance = this;
    }
    static sharedInstance() {
        return History._instance;
    }
    navigatedTo(url) {
        let previous = this.history[this.index] && this.history[this.index].url;
        if (previous === url || url.indexOf('sign-in') >= 0 || url.indexOf('forgot-password') >= 0) {
            return;
        }
        this.index++;
        this.history.length = this.index;
        let entry = new HistoryEntry(url);
        this.history.push(entry);
        this.entrySubject.next(entry);
    }
    get currentHistoryEntry() {
        return this.index >= 0 ? this.history[this.index] : undefined;
    }
    get historyEntries() {
        return this.history;
    }
    canGoBack() {
        return this.index > 0;
    }
    goBack() {
        if (!this.canGoBack()) {
            return;
        }
        this.index--;
        if (this.history[this.index].url.indexOf('concept/external') > -1) {
            this.index--;
        }
        this.router.navigateByUrl(this.history[this.index].url);
        this.entrySubject.next(this.currentHistoryEntry);
    }
    canGoForward() {
        return this.index < (this.history.length - 1);
    }
    goForward() {
        if (!this.canGoForward()) {
            return;
        }
        this.index++;
        this.router.navigateByUrl(this.history[this.index].url);
        this.entrySubject.next(this.currentHistoryEntry);
    }
    shutdown() {
        this.history = [];
        this.index = -1;
    }
}


/***/ }),

/***/ "./src/app/_classes/manager.ts":
/*!*************************************!*\
  !*** ./src/app/_classes/manager.ts ***!
  \*************************************/
/*! exports provided: Manager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Manager", function() { return Manager; });
/* harmony import */ var _async_data_source__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./async-data-source */ "./src/app/_classes/async-data-source.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");



const NOT_ENABLED = { id: 'not-enabled' };
class Manager {
    constructor() {
        this.enabled = false;
        this.refreshInterval = 300000; // milliseconds
        this.lastRefreshTime = 0;
        this.update$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
    }
    refresh(force = false) {
        if (!this.enabled) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        }
        if (!force) {
            if ((Date.now() - this.lastRefreshTime) < this.refreshInterval) {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
            }
            if (this.currentSubject) {
                return this.currentSubject;
            }
        }
        this.nextSubject = this.nextSubject || new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        if (this.currentSubject) {
            return this.nextSubject;
        }
        this.currentSubject = this.nextSubject || new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.nextSubject = undefined;
        this.source = new _async_data_source__WEBPACK_IMPORTED_MODULE_0__["AsyncDataSource"](() => {
            if (!this.enabled) {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(NOT_ENABLED);
            }
            return this.fetchData();
        });
        this.source.callback = (data) => {
            this.source.callback = undefined;
            this.source = undefined;
            if (data === NOT_ENABLED) {
                this.currentSubject.error(data);
                this.currentSubject = undefined;
                return;
            }
            this.setData(data);
            this.lastRefreshTime = Date.now();
            this.currentSubject.next(true);
            this.currentSubject.complete();
            this.currentSubject = undefined;
            this.update$.next();
            if (this.nextSubject) {
                this.refresh(true);
            }
        };
        this.source.refresh();
        return this.currentSubject;
    }
    cancel() {
        if (!this.source || !this.currentSubject) {
            return;
        }
        this.source.callback = undefined;
        this.source = undefined;
        this.currentSubject.next(false);
        this.currentSubject.complete();
        this.currentSubject = undefined;
        if (this.nextSubject) {
            this.nextSubject.next(false);
            this.nextSubject.complete();
            this.nextSubject = undefined;
        }
    }
    reset() {
        this.lastRefreshTime = 0;
    }
}


/***/ }),

/***/ "./src/app/_classes/utility.ts":
/*!*************************************!*\
  !*** ./src/app/_classes/utility.ts ***!
  \*************************************/
/*! exports provided: Utility */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Utility", function() { return Utility; });
var Utility;
(function (Utility) {
    function ArraysAreEqual(a, b) {
        let A = a || [];
        let B = b || [];
        return A.length === B.length && !A.find((o, index) => o !== B[index]);
    }
    Utility.ArraysAreEqual = ArraysAreEqual;
    function RemoveDuplicatesFromArray(array, disallowed = undefined) {
        let duplicates = {};
        if (disallowed) {
            disallowed.forEach(o => duplicates[o] = true);
        }
        return array.filter(o => {
            if (duplicates[o]) {
                return false;
            }
            duplicates[o] = true;
            return true;
        });
    }
    Utility.RemoveDuplicatesFromArray = RemoveDuplicatesFromArray;
    function StatusToText(status) {
        switch (status) {
            case 0: return 'Uploading';
            case 1: return 'Uploaded';
            case 2: return 'Processing';
            case 3: return 'Available';
            case 4: return 'Error';
            case 5: return 'Deleted By User';
            case 6: return 'Deleted';
            case -1: return 'Custom';
            default: return 'Unknown';
        }
    }
    Utility.StatusToText = StatusToText;
    function StatusToClass(status) {
        switch (status) {
            case 0: return 'media-status-default';
            case 1: return 'media-status-info';
            case 2: return 'media-status-info';
            case 3: return 'media-status-success';
            case 4: return 'media-status-error';
            case 5: return 'media-status-error';
            case 6: return 'media-status-error';
            case -1: return 'media-status-success';
            default: return 'media-status-default';
        }
    }
    Utility.StatusToClass = StatusToClass;
    function StatusToIcon(status) {
        switch (status) {
            case 0: return 'exclamation-triangle';
            case 1: return 'info-circle';
            case 2: return 'info-circle';
            case 3: return 'check-circle';
            case 4: return 'exclamation-circle';
            case 5: return 'exclamation-circle';
            case 6: return 'exclamation-circle';
            case -1: return 'check-circle';
            default: return 'question-circle';
        }
    }
    Utility.StatusToIcon = StatusToIcon;
})(Utility || (Utility = {}));


/***/ }),

/***/ "./src/app/_common/action-icon/action-icon.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/_common/action-icon/action-icon.component.ts ***!
  \**************************************************************/
/*! exports provided: ActionIconComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionIconComponent", function() { return ActionIconComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");



const _c0 = function (a1) { return ["fad", a1]; };
class ActionIconComponent {
    constructor() {
        this.active = false;
        this.disabled = false;
    }
}
ActionIconComponent.ɵfac = function ActionIconComponent_Factory(t) { return new (t || ActionIconComponent)(); };
ActionIconComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ActionIconComponent, selectors: [["app-action-icon"]], inputs: { icon: "icon", title: "title", active: "active", disabled: "disabled" }, decls: 2, vars: 8, consts: [[1, "action-icon"], [3, "icon"]], template: function ActionIconComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "fa-icon", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", ctx.active)("disabled", ctx.disabled);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("title", ctx.title);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](6, _c0, ctx.icon));
    } }, directives: [_fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_1__["FaIconComponent"]], styles: [".action-icon[_ngcontent-%COMP%] {\n  cursor: pointer;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 10rem;\n}\n.action-icon[_ngcontent-%COMP%]:hover {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.action-icon.active[_ngcontent-%COMP%] {\n  color: #333333;\n  background-color: rgba(51, 190, 255, 0.2);\n}\n.action-icon.disabled[_ngcontent-%COMP%] {\n  cursor: default;\n}\n.action-icon.disabled[_ngcontent-%COMP%]:hover {\n  background-color: transparent;\n}\n.action-icon[_ngcontent-%COMP%]   fa-icon[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL19jb21tb24vYWN0aW9uLWljb24vYWN0aW9uLWljb24uY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL19jb21tb24vYWN0aW9uLWljb24vYWN0aW9uLWljb24uY29tcG9uZW50LnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX3ZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0ksZUFBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSx3QkFBQTtVQUFBLHVCQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxvQkFBQTtBQ0RKO0FER0k7RUFDSSxxQ0FBQTtBQ0RSO0FESUk7RUFDSSxjRVpNO0VGYU4seUNBQUE7QUNGUjtBREtJO0VBQ0ksZUFBQTtBQ0hSO0FES1E7RUFDSSw2QkFBQTtBQ0haO0FET0k7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtBQ0xSIiwiZmlsZSI6InNyYy9hcHAvX2NvbW1vbi9hY3Rpb24taWNvbi9hY3Rpb24taWNvbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uL3Njc3MvdmFyaWFibGVzJztcblxuLmFjdGlvbi1pY29uIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIHdpZHRoOiAzNHB4O1xuICAgIGhlaWdodDogMzRweDtcbiAgICBib3JkZXItcmFkaXVzOiAxMHJlbTtcblxuICAgICY6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMDUpO1xuICAgIH1cblxuICAgICYuYWN0aXZlIHtcbiAgICAgICAgY29sb3I6ICR0aGVtZS1ibGFjaztcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnRpemUoJHRoZW1lLXByaW1hcnksIDAuOCk7XG4gICAgfVxuXG4gICAgJi5kaXNhYmxlZCB7XG4gICAgICAgIGN1cnNvcjogZGVmYXVsdDtcblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmEtaWNvbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIH1cbn0iLCIuYWN0aW9uLWljb24ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB3aWR0aDogMzRweDtcbiAgaGVpZ2h0OiAzNHB4O1xuICBib3JkZXItcmFkaXVzOiAxMHJlbTtcbn1cbi5hY3Rpb24taWNvbjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4wNSk7XG59XG4uYWN0aW9uLWljb24uYWN0aXZlIHtcbiAgY29sb3I6ICMzMzMzMzM7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoNTEsIDE5MCwgMjU1LCAwLjIpO1xufVxuLmFjdGlvbi1pY29uLmRpc2FibGVkIHtcbiAgY3Vyc29yOiBkZWZhdWx0O1xufVxuLmFjdGlvbi1pY29uLmRpc2FibGVkOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG4uYWN0aW9uLWljb24gZmEtaWNvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufSIsIi8vIGh0dHBzOi8vY29sb3JodW50LmNvL3BhbGV0dGUvMTU3MTE4XG5cbi8vIENvbG9yc1xuJHRoZW1lLXdoaXRlOiAjRkZGRkZGO1xuJHRoZW1lLWJsYWNrOiAjMzMzMzMzO1xuJHRoZW1lLWdyYXktZGFyazogcmVkO1xuJHRoZW1lLWdyYXk6ICM4YThhOGE7XG4kdGhlbWUtZ3JheS1saWdodDogI2U2ZTZlNjtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXI6ICNmNWY1ZjU7XG4kdGhlbWUtZ3JheS1saWdodGVzdDogI2ZkZmRmZDtcbiR0aGVtZS1ncmF5LWJvcmRlcjogJHRoZW1lLWdyYXktbGlnaHQ7XG5cbiR0aGVtZS1wcmltYXJ5OiAjMzNiZWZmO1xuXG4kdGhlbWUtc3VjY2VzczogIzQyQzc1RDtcbiR0aGVtZS1kYW5nZXI6ICNGQTNFMzk7XG4kdGhlbWUtd2FybmluZzogI0ZGQzIwMDtcblxuLy8gRm9udHMgYW5kIFRleHRcbiRmb250LWZhbWlseTogcHJveGltYS1ub3ZhLCBcIkhlbHZldGljYSBOZXVlXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG5cbiRmb250LXNpemUtc21hbGw6IDAuODc1cmVtO1xuJGZvbnQtc2l6ZS1tZWRpdW06IDFyZW07XG4kZm9udC1zaXplLWxhcmdlOiAxLjVyZW07XG5cbi8vIExheW91dFxuJGJvcmRlci1yYWRpdXM6IDRweDtcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ActionIconComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-action-icon',
                template: `
        <div class="action-icon" [attr.title]="title" [class.active]="active" [class.disabled]="disabled">
            <fa-icon [icon]="['fad', icon]"></fa-icon>
        </div>
    `,
                styleUrls: ['./action-icon.component.scss'],
            }]
    }], null, { icon: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], title: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], active: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], disabled: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/_common/autofocus/autofocus.directive.ts":
/*!**********************************************************!*\
  !*** ./src/app/_common/autofocus/autofocus.directive.ts ***!
  \**********************************************************/
/*! exports provided: AutofocusDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AutofocusDirective", function() { return AutofocusDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


class AutofocusDirective {
    constructor(el) {
        this.el = el;
    }
    set autofocus(condition) {
        this._autofocus = (condition !== false);
    }
    ngOnInit() {
        if (this._autofocus || typeof this._autofocus === "undefined") {
            setTimeout(() => { this.el.nativeElement.focus(); });
        }
    }
}
AutofocusDirective.ɵfac = function AutofocusDirective_Factory(t) { return new (t || AutofocusDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])); };
AutofocusDirective.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({ type: AutofocusDirective, selectors: [["", "autofocus", ""]], inputs: { autofocus: "autofocus" } });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AutofocusDirective, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"],
        args: [{
                selector: '[autofocus]'
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]; }, { autofocus: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/_common/blank/blank.component.ts":
/*!**************************************************!*\
  !*** ./src/app/_common/blank/blank.component.ts ***!
  \**************************************************/
/*! exports provided: BlankComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BlankComponent", function() { return BlankComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


class BlankComponent {
}
BlankComponent.ɵfac = function BlankComponent_Factory(t) { return new (t || BlankComponent)(); };
BlankComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: BlankComponent, selectors: [["app-blank"]], decls: 0, vars: 0, template: function BlankComponent_Template(rf, ctx) { }, encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](BlankComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-blank',
                template: ``,
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/_common/copy-box/copy-box.component.ts":
/*!********************************************************!*\
  !*** ./src/app/_common/copy-box/copy-box.component.ts ***!
  \********************************************************/
/*! exports provided: CopyBoxComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CopyBoxComponent", function() { return CopyBoxComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_clipboard_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/clipboard.service */ "./src/app/_services/clipboard.service.ts");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");








const _c0 = function () { return ["fad", "clipboard"]; };
class CopyBoxComponent {
    constructor(clipboard, notifications) {
        this.clipboard = clipboard;
        this.notifications = notifications;
    }
    onCopy() {
        this.clipboard.write(this.text);
        this.notifications.success('Success', 'Copied to clipboard.', { timeOut: 5000 });
    }
}
CopyBoxComponent.ɵfac = function CopyBoxComponent_Factory(t) { return new (t || CopyBoxComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_clipboard_service__WEBPACK_IMPORTED_MODULE_1__["ClipboardService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_2__["NotificationsService"])); };
CopyBoxComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: CopyBoxComponent, selectors: [["app-copy-box"]], inputs: { text: "text" }, decls: 5, vars: 3, consts: [[1, "copy-box-container"], ["type", "text", "readonly", "", 3, "ngModel"], [1, "button", "secondary", 3, "click"], [3, "icon"]], template: function CopyBoxComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "input", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CopyBoxComponent_Template_button_click_2_listener() { return ctx.onCopy(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "fa-icon", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Copy ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.text);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](2, _c0));
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgModel"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_4__["FaIconComponent"]], styles: [".copy-box-container[_ngcontent-%COMP%] {\n  position: relative;\n}\n.copy-box-container[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 4px;\n  right: 4px;\n  z-index: 1;\n  padding: 10px 20px;\n}\ninput[_ngcontent-%COMP%] {\n  cursor: text;\n  background-color: #fdfdfd;\n  padding-right: 106px;\n  margin: 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL19jb21tb24vY29weS1ib3gvY29weS1ib3guY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL19jb21tb24vY29weS1ib3gvY29weS1ib3guY29tcG9uZW50LnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX3ZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0VBQ0ksa0JBQUE7QUNGSjtBRElJO0VBQ0ksa0JBQUE7RUFBb0IsUUFBQTtFQUFVLFVBQUE7RUFDOUIsVUFBQTtFQUNBLGtCQUFBO0FDQVI7QURJQTtFQUNJLFlBQUE7RUFDQSx5QkVOa0I7RUZPbEIsb0JBQUE7RUFDQSxTQUFBO0FDREoiLCJmaWxlIjoic3JjL2FwcC9fY29tbW9uL2NvcHktYm94L2NvcHktYm94LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnLi4vLi4vLi4vc2Nzcy92YXJpYWJsZXMnO1xuQGltcG9ydCAnLi4vLi4vLi4vc2Nzcy9taXhpbnMnO1xuXG4uY29weS1ib3gtY29udGFpbmVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgICAuYnV0dG9uIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDRweDsgcmlnaHQ6IDRweDtcbiAgICAgICAgei1pbmRleDogMTtcbiAgICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xuICAgIH1cbn1cblxuaW5wdXQge1xuICAgIGN1cnNvcjogdGV4dDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVzdDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAxMDZweDtcbiAgICBtYXJnaW46IDA7XG59IiwiLmNvcHktYm94LWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi5jb3B5LWJveC1jb250YWluZXIgLmJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA0cHg7XG4gIHJpZ2h0OiA0cHg7XG4gIHotaW5kZXg6IDE7XG4gIHBhZGRpbmc6IDEwcHggMjBweDtcbn1cblxuaW5wdXQge1xuICBjdXJzb3I6IHRleHQ7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZGZkZmQ7XG4gIHBhZGRpbmctcmlnaHQ6IDEwNnB4O1xuICBtYXJnaW46IDA7XG59IiwiLy8gaHR0cHM6Ly9jb2xvcmh1bnQuY28vcGFsZXR0ZS8xNTcxMThcblxuLy8gQ29sb3JzXG4kdGhlbWUtd2hpdGU6ICNGRkZGRkY7XG4kdGhlbWUtYmxhY2s6ICMzMzMzMzM7XG4kdGhlbWUtZ3JheS1kYXJrOiByZWQ7XG4kdGhlbWUtZ3JheTogIzhhOGE4YTtcbiR0aGVtZS1ncmF5LWxpZ2h0OiAjZTZlNmU2O1xuJHRoZW1lLWdyYXktbGlnaHRlcjogI2Y1ZjVmNTtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXN0OiAjZmRmZGZkO1xuJHRoZW1lLWdyYXktYm9yZGVyOiAkdGhlbWUtZ3JheS1saWdodDtcblxuJHRoZW1lLXByaW1hcnk6ICMzM2JlZmY7XG5cbiR0aGVtZS1zdWNjZXNzOiAjNDJDNzVEO1xuJHRoZW1lLWRhbmdlcjogI0ZBM0UzOTtcbiR0aGVtZS13YXJuaW5nOiAjRkZDMjAwO1xuXG4vLyBGb250cyBhbmQgVGV4dFxuJGZvbnQtZmFtaWx5OiBwcm94aW1hLW5vdmEsIFwiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcblxuJGZvbnQtc2l6ZS1zbWFsbDogMC44NzVyZW07XG4kZm9udC1zaXplLW1lZGl1bTogMXJlbTtcbiRmb250LXNpemUtbGFyZ2U6IDEuNXJlbTtcblxuLy8gTGF5b3V0XG4kYm9yZGVyLXJhZGl1czogNHB4O1xuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](CopyBoxComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-copy-box',
                templateUrl: './copy-box.component.html',
                styleUrls: ['./copy-box.component.scss']
            }]
    }], function () { return [{ type: _services_clipboard_service__WEBPACK_IMPORTED_MODULE_1__["ClipboardService"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_2__["NotificationsService"] }]; }, { text: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/_common/download/download.component.ts":
/*!********************************************************!*\
  !*** ./src/app/_common/download/download.component.ts ***!
  \********************************************************/
/*! exports provided: DownloadComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DownloadComponent", function() { return DownloadComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_download_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/download.service */ "./src/app/_services/download.service.ts");






const _c0 = ["anchor"];
class DownloadComponent {
    constructor(download) {
        this.url = undefined;
        download.downloadComponent = this;
    }
}
DownloadComponent.ɵfac = function DownloadComponent_Factory(t) { return new (t || DownloadComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_download_service__WEBPACK_IMPORTED_MODULE_1__["DownloadService"])); };
DownloadComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: DownloadComponent, selectors: [["app-download"]], viewQuery: function DownloadComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.anchor = _t.first);
    } }, decls: 2, vars: 1, consts: [[3, "href"], ["anchor", ""]], template: function DownloadComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "a", 0, 1);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("href", ctx.url, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    } }, styles: ["[_nghost-%COMP%] { visibility: hidden; }"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DownloadComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-download',
                template: `<a #anchor [href]="url"></a>`,
                styles: [`:host { visibility: hidden; }`]
            }]
    }], function () { return [{ type: _services_download_service__WEBPACK_IMPORTED_MODULE_1__["DownloadService"] }]; }, { anchor: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['anchor', { static: true }]
        }] }); })();


/***/ }),

/***/ "./src/app/_common/form-error/form-error.component.ts":
/*!************************************************************!*\
  !*** ./src/app/_common/form-error/form-error.component.ts ***!
  \************************************************************/
/*! exports provided: FormErrorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormErrorComponent", function() { return FormErrorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");




function FormErrorComponent_ul_0_li_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const error_r179 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](error_r179);
} }
function FormErrorComponent_ul_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ul", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormErrorComponent_ul_0_li_1_Template, 2, 1, "li", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r177 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r177.errors());
} }
class FormErrorComponent {
    constructor() {
        this.checkDirty = false;
        this.messages = {};
    }
    shouldShowErrors() {
        return this.control && this.control.errors && (this.control.touched || (this.checkDirty && this.control.dirty));
    }
    errors() {
        return Object.keys(this.control.errors)
            .map(key => this.messages[key] || undefined)
            .filter(text => text);
    }
}
FormErrorComponent.ɵfac = function FormErrorComponent_Factory(t) { return new (t || FormErrorComponent)(); };
FormErrorComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FormErrorComponent, selectors: [["app-form-error"]], inputs: { control: "control", checkDirty: "checkDirty", messages: "messages" }, decls: 1, vars: 1, consts: [["class", "form-errors", 4, "ngIf"], [1, "form-errors"], [4, "ngFor", "ngForOf"]], template: function FormErrorComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, FormErrorComponent_ul_0_Template, 2, 1, "ul", 0);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.shouldShowErrors());
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgForOf"]], styles: [".form-errors[_ngcontent-%COMP%] {\n  color: #FA3E39;\n  list-style: none;\n  margin: 4px 0px 0px 16px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL19jb21tb24vZm9ybS1lcnJvci9mb3JtLWVycm9yLmNvbXBvbmVudC5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL192YXJpYWJsZXMuc2NzcyIsInNyYy9hcHAvX2NvbW1vbi9mb3JtLWVycm9yL2Zvcm0tZXJyb3IuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxjQ1lXO0VEWFgsZ0JBQUE7RUFDQSx3QkFBQTtBRURKIiwiZmlsZSI6InNyYy9hcHAvX2NvbW1vbi9mb3JtLWVycm9yL2Zvcm0tZXJyb3IuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi9zY3NzL3ZhcmlhYmxlcyc7XG5cbi5mb3JtLWVycm9ycyB7XG4gICAgY29sb3I6ICR0aGVtZS1kYW5nZXI7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBtYXJnaW46IDRweCAwcHggMHB4IDE2cHg7XG59XG4iLCIvLyBodHRwczovL2NvbG9yaHVudC5jby9wYWxldHRlLzE1NzExOFxuXG4vLyBDb2xvcnNcbiR0aGVtZS13aGl0ZTogI0ZGRkZGRjtcbiR0aGVtZS1ibGFjazogIzMzMzMzMztcbiR0aGVtZS1ncmF5LWRhcms6IHJlZDtcbiR0aGVtZS1ncmF5OiAjOGE4YThhO1xuJHRoZW1lLWdyYXktbGlnaHQ6ICNlNmU2ZTY7XG4kdGhlbWUtZ3JheS1saWdodGVyOiAjZjVmNWY1O1xuJHRoZW1lLWdyYXktbGlnaHRlc3Q6ICNmZGZkZmQ7XG4kdGhlbWUtZ3JheS1ib3JkZXI6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuXG4kdGhlbWUtcHJpbWFyeTogIzMzYmVmZjtcblxuJHRoZW1lLXN1Y2Nlc3M6ICM0MkM3NUQ7XG4kdGhlbWUtZGFuZ2VyOiAjRkEzRTM5O1xuJHRoZW1lLXdhcm5pbmc6ICNGRkMyMDA7XG5cbi8vIEZvbnRzIGFuZCBUZXh0XG4kZm9udC1mYW1pbHk6IHByb3hpbWEtbm92YSwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuXG4kZm9udC1zaXplLXNtYWxsOiAwLjg3NXJlbTtcbiRmb250LXNpemUtbWVkaXVtOiAxcmVtO1xuJGZvbnQtc2l6ZS1sYXJnZTogMS41cmVtO1xuXG4vLyBMYXlvdXRcbiRib3JkZXItcmFkaXVzOiA0cHg7XG4iLCIuZm9ybS1lcnJvcnMge1xuICBjb2xvcjogI0ZBM0UzOTtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbiAgbWFyZ2luOiA0cHggMHB4IDBweCAxNnB4O1xufSJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormErrorComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-form-error',
                template: `
        <ul class="form-errors" *ngIf="shouldShowErrors()">
            <li *ngFor="let error of errors()">{{ error }}</li>
        </ul>`,
                styleUrls: ['./form-error.component.scss']
            }]
    }], null, { control: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], checkDirty: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], messages: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/_common/guarded-action/guarded-action.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/_common/guarded-action/guarded-action.component.ts ***!
  \********************************************************************/
/*! exports provided: GuardedActionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuardedActionComponent", function() { return GuardedActionComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _common_popover_popover_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common/popover/popover.component */ "./src/app/_common/popover/popover.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");





const _c0 = ["popover"];
const _c1 = ["actionButton"];
function GuardedActionComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const text_r176 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](text_r176);
} }
const _c2 = ["*"];
class GuardedActionComponent {
    constructor(host) {
        this.host = host;
        this.question = '';
        this.additional = [];
        this.action = '';
        this.align = 'left';
        this.confirmed = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    onClick($event) {
        this.popover.target = this.host.nativeElement;
        this.popover.toggle($event, true);
        setTimeout(() => this.actionButton.nativeElement.focus());
    }
}
GuardedActionComponent.ɵfac = function GuardedActionComponent_Factory(t) { return new (t || GuardedActionComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])); };
GuardedActionComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: GuardedActionComponent, selectors: [["app-guarded-action"]], viewQuery: function GuardedActionComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c1, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.popover = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.actionButton = _t.first);
    } }, hostBindings: function GuardedActionComponent_HostBindings(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function GuardedActionComponent_click_HostBindingHandler($event) { return ctx.onClick($event); });
    } }, inputs: { question: "question", additional: "additional", action: "action", align: "align" }, outputs: { confirmed: "confirmed" }, ngContentSelectors: _c2, decls: 15, vars: 7, consts: [[3, "my", "at", "x-offset", "y-offset"], ["popover", ""], [1, "popover-section"], [1, "popover-item"], ["class", "popover-section", 4, "ngFor", "ngForOf"], [1, "button", "secondary", "hollow", "small"], [1, "button", "alert", "small", 3, "click"], ["actionButton", ""]], template: function GuardedActionComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "app-popover", 0, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, GuardedActionComponent_div_7_Template, 3, 1, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "button", 6, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function GuardedActionComponent_Template_button_click_12_listener() { return ctx.confirmed.emit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("my", "top ", ctx.align, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("at", "bottom ", ctx.align, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("x-offset", 0)("y-offset", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.question);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.additional);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.action);
    } }, directives: [_common_popover_popover_component__WEBPACK_IMPORTED_MODULE_1__["PopoverComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"]], styles: [".popover-section[_ngcontent-%COMP%] {\n  width: 240px;\n  padding: 0.5rem 0.5rem;\n}\n.popover-section[_ngcontent-%COMP%]:last-child   .popover-item[_ngcontent-%COMP%] {\n  text-align: right;\n  margin-top: 1rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL19jb21tb24vZ3VhcmRlZC1hY3Rpb24vZ3VhcmRlZC1hY3Rpb24uY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL19jb21tb24vZ3VhcmRlZC1hY3Rpb24vZ3VhcmRlZC1hY3Rpb24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxZQUFBO0VBQ0Esc0JBQUE7QUNESjtBREdJO0VBQ0ksaUJBQUE7RUFDQSxnQkFBQTtBQ0RSIiwiZmlsZSI6InNyYy9hcHAvX2NvbW1vbi9ndWFyZGVkLWFjdGlvbi9ndWFyZGVkLWFjdGlvbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uL3Njc3MvdmFyaWFibGVzJztcblxuLnBvcG92ZXItc2VjdGlvbiB7XG4gICAgd2lkdGg6IDI0MHB4O1xuICAgIHBhZGRpbmc6IDAuNXJlbSAwLjVyZW07XG5cbiAgICAmOmxhc3QtY2hpbGQgLnBvcG92ZXItaXRlbSB7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICAgIH1cbn0iLCIucG9wb3Zlci1zZWN0aW9uIHtcbiAgd2lkdGg6IDI0MHB4O1xuICBwYWRkaW5nOiAwLjVyZW0gMC41cmVtO1xufVxuLnBvcG92ZXItc2VjdGlvbjpsYXN0LWNoaWxkIC5wb3BvdmVyLWl0ZW0ge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbiAgbWFyZ2luLXRvcDogMXJlbTtcbn0iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](GuardedActionComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-guarded-action',
                templateUrl: './guarded-action.component.html',
                styleUrls: ['./guarded-action.component.scss'],
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]; }, { question: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], additional: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], action: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], align: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], confirmed: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], popover: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['popover', { static: true }]
        }], actionButton: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['actionButton', { static: true }]
        }], onClick: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"],
            args: ['click', ['$event']]
        }] }); })();


/***/ }),

/***/ "./src/app/_common/icon/icon.component.ts":
/*!************************************************!*\
  !*** ./src/app/_common/icon/icon.component.ts ***!
  \************************************************/
/*! exports provided: IconComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IconComponent", function() { return IconComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _common_inline_svg_inline_svg_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common/inline-svg/inline-svg.directive */ "./src/app/_common/inline-svg/inline-svg.directive.ts");



class IconComponent {
    constructor() {
        this.size = 28;
    }
    ngOnInit() {
        this.svgResourceUrl = `assets/svg/${this.svg}.svg`;
    }
    ngOnChanges(changes) {
        if (!changes.svg) {
            return;
        }
        this.svgResourceUrl = `assets/svg/${this.svg}.svg`;
    }
}
IconComponent.ɵfac = function IconComponent_Factory(t) { return new (t || IconComponent)(); };
IconComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: IconComponent, selectors: [["app-icon"]], inputs: { svg: "svg", size: "size", height: "height", title: "title" }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]()], decls: 2, vars: 8, consts: [[1, "icon"], [1, "svg", 3, "inlineSVG"]], template: function IconComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", ctx.size, "px")("height", ctx.size, "px");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("title", ctx.title);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("height", ctx.height || ctx.size, "px");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("inlineSVG", ctx.svgResourceUrl);
    } }, directives: [_common_inline_svg_inline_svg_directive__WEBPACK_IMPORTED_MODULE_1__["InlineSVGDirective"]], styles: [".icon[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n  max-height: 100%;\n}\n.icon[_ngcontent-%COMP%]   .svg[_ngcontent-%COMP%] {\n  width: 100%;\n}\n  svg {\n  display: block;\n  max-height: 100%;\n  max-width: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL19jb21tb24vaWNvbi9pY29uLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9fY29tbW9uL2ljb24vaWNvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSx3QkFBQTtVQUFBLHVCQUFBO0VBQ0EsZ0JBQUE7QUNESjtBREdJO0VBQ0ksV0FBQTtBQ0RSO0FES0E7RUFDSSxjQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0FDRkoiLCJmaWxlIjoic3JjL2FwcC9fY29tbW9uL2ljb24vaWNvbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uL3Njc3MvdmFyaWFibGVzJztcblxuLmljb24ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtYXgtaGVpZ2h0OiAxMDAlO1xuXG4gICAgLnN2ZyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn1cblxuOjpuZy1kZWVwIHN2ZyB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgbWF4LWhlaWdodDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG59IiwiLmljb24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbWF4LWhlaWdodDogMTAwJTtcbn1cbi5pY29uIC5zdmcge1xuICB3aWR0aDogMTAwJTtcbn1cblxuOjpuZy1kZWVwIHN2ZyB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBtYXgtaGVpZ2h0OiAxMDAlO1xuICBtYXgtd2lkdGg6IDEwMCU7XG59Il19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](IconComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-icon',
                template: `
        <div class="icon" [attr.title]="title" [style.width.px]="size" [style.height.px]="size">
            <div class="svg" [inlineSVG]="svgResourceUrl" [style.height.px]="height || size"></div>
        </div>
    `,
                styleUrls: ['./icon.component.scss'],
            }]
    }], null, { svg: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], size: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], height: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], title: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/_common/inline-svg/inline-svg.directive.ts":
/*!************************************************************!*\
  !*** ./src/app/_common/inline-svg/inline-svg.directive.ts ***!
  \************************************************************/
/*! exports provided: InlineSVGDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InlineSVGDirective", function() { return InlineSVGDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _svg_cache_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./svg-cache.service */ "./src/app/_common/inline-svg/svg-cache.service.ts");





class InlineSVGDirective {
    constructor(_document /*: HTMLDocument*/, _el, _svgCache) {
        this._document = _document;
        this._el = _el;
        this._svgCache = _svgCache;
        this.replaceContents = true;
        this.prepend = false;
        this.cacheSVG = true;
        this.forceEvalStyles = false;
        this.evalScripts = 'always';
        this.onSVGInserted = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.onSVGFailed = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /** @internal */
        this._supportsSVG = true;
        /** @internal */
        this._ranScripts = {};
    }
    ngOnInit() {
        this._insertSVG();
    }
    ngOnChanges(changes) {
        if (changes['inlineSVG']) {
            this._insertSVG();
        }
    }
    /** @internal */
    _insertSVG() {
        if (!this._supportsSVG) {
            return;
        }
        // Check if the browser supports embed SVGs
        if (!this._checkSVGSupport()) {
            this._fail('Embed SVG not supported by browser');
            this._supportsSVG = false;
            return;
        }
        // Check if a URL was actually passed into the directive
        if (!this.inlineSVG) {
            this._fail('No URL passed to [inlineSVG]');
            return;
        }
        // Support for symbol IDs
        if (this.inlineSVG.charAt(0) === '#' || this.inlineSVG.indexOf('.svg#') > -1) {
            const elSvg = this._document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const elSvgUse = this._document.createElementNS('http://www.w3.org/2000/svg', 'use');
            elSvgUse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.inlineSVG);
            elSvg.appendChild(elSvgUse);
            this._insertEl(elSvg);
            this.onSVGInserted.emit(elSvg);
            return;
        }
        // Get absolute URL, and check if it's actually new
        const absUrl = this._getAbsoluteUrl(this.inlineSVG);
        if (absUrl !== this._absUrl) {
            this._absUrl = absUrl;
            // Fetch SVG via cache mechanism
            this._svgCache.getSVG(this._absUrl, this.cacheSVG)
                .subscribe((svg) => {
                // Insert SVG
                if (svg && this._el.nativeElement) {
                    if (this.removeSVGAttributes) {
                        this._removeAttributes(svg, this.removeSVGAttributes);
                    }
                    this._insertEl(svg);
                    // Script evaluation
                    this._evalScripts(svg, absUrl);
                    // Force evaluation of <style> tags since IE doesn't do it.
                    // Reference: https://github.com/arkon/ng-inline-svg/issues/17
                    if (this.forceEvalStyles) {
                        const styleTags = svg.querySelectorAll('style');
                        Array.prototype.forEach.call(styleTags, tag => tag.textContent += '');
                    }
                    this.onSVGInserted.emit(svg);
                }
            }, (err) => {
                this._fail(err);
            });
        }
    }
    /** @internal */
    _getAbsoluteUrl(url) {
        return url;
        // const base = this._document.createElement('BASE') as HTMLBaseElement;
        // base.href = url;
        //
        // return base.href;
    }
    /** @internal */
    _removeAttributes(svg, attrs) {
        const innerEls = svg.getElementsByTagName('*');
        for (let i = 0; i < innerEls.length; i++) {
            const elAttrs = innerEls[i].attributes;
            for (let j = 0; j < elAttrs.length; j++) {
                if (attrs.indexOf(elAttrs[j].name.toLowerCase()) > -1) {
                    innerEls[i].removeAttribute(elAttrs[j].name);
                }
            }
        }
    }
    /** @internal */
    _insertEl(el) {
        if (this.replaceContents && !this.prepend) {
            this._el.nativeElement.innerHTML = '';
        }
        if (this.prepend) {
            this._el.nativeElement.insertBefore(el, this._el.nativeElement.firstChild);
        }
        else {
            this._el.nativeElement.appendChild(el);
        }
    }
    // Based off code from https://github.com/iconic/SVGInjector
    /** @internal */
    _evalScripts(svg, url) {
        const scripts = svg.querySelectorAll('script');
        const scriptsToEval = [];
        let script, scriptType;
        // Fetch scripts from SVG
        for (let i = 0; i < scripts.length; i++) {
            scriptType = scripts[i].getAttribute('type');
            if (!scriptType || scriptType === 'application/ecmascript' || scriptType === 'application/javascript') {
                script = scripts[i].innerText || scripts[i].textContent;
                scriptsToEval.push(script);
                svg.removeChild(scripts[i]);
            }
        }
        // Run scripts in closure as needed
        if (scriptsToEval.length > 0 && (this.evalScripts === 'always' ||
            (this.evalScripts === 'once' && !this._ranScripts[url]))) {
            for (let i = 0; i < scriptsToEval.length; i++) {
                new Function(scriptsToEval[i])(window);
            }
            this._ranScripts[url] = true;
        }
    }
    /** @internal */
    _checkSVGSupport() {
        return typeof SVGRect !== 'undefined';
    }
    /** @internal */
    _fail(msg) {
        this.onSVGFailed.emit(msg);
        // Insert fallback image, if specified
        if (this.fallbackImgUrl) {
            const elImg = document.createElement('img');
            elImg.src = this.fallbackImgUrl;
            this._insertEl(elImg);
        }
    }
}
InlineSVGDirective.ɵfac = function InlineSVGDirective_Factory(t) { return new (t || InlineSVGDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_svg_cache_service__WEBPACK_IMPORTED_MODULE_2__["SVGCache"])); };
InlineSVGDirective.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({ type: InlineSVGDirective, selectors: [["", "inlineSVG", ""]], inputs: { inlineSVG: "inlineSVG", replaceContents: "replaceContents", prepend: "prepend", cacheSVG: "cacheSVG", removeSVGAttributes: "removeSVGAttributes", forceEvalStyles: "forceEvalStyles", evalScripts: "evalScripts", fallbackImgUrl: "fallbackImgUrl" }, outputs: { onSVGInserted: "onSVGInserted", onSVGFailed: "onSVGFailed" }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([_svg_cache_service__WEBPACK_IMPORTED_MODULE_2__["SVGCache"]]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]()] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](InlineSVGDirective, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"],
        args: [{
                selector: '[inlineSVG]',
                providers: [_svg_cache_service__WEBPACK_IMPORTED_MODULE_2__["SVGCache"]]
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"]]
            }] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }, { type: _svg_cache_service__WEBPACK_IMPORTED_MODULE_2__["SVGCache"] }]; }, { inlineSVG: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], replaceContents: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], prepend: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], cacheSVG: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], removeSVGAttributes: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], forceEvalStyles: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], evalScripts: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], fallbackImgUrl: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], onSVGInserted: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], onSVGFailed: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }] }); })();


/***/ }),

/***/ "./src/app/_common/inline-svg/svg-cache.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/_common/inline-svg/svg-cache.service.ts ***!
  \*********************************************************/
/*! exports provided: SVGCache */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SVGCache", function() { return SVGCache; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");







class SVGCache {
    constructor(_document /*: HTMLDocument */, http) {
        this._document = _document;
        this.http = http;
        if (!SVGCache._cache) {
            SVGCache._cache = new Map();
        }
        if (!SVGCache._inProgressReqs) {
            SVGCache._inProgressReqs = new Map();
        }
    }
    getSVG(url, cache = true) {
        // Return cached copy if it exists
        if (cache && SVGCache._cache.has(url)) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(this._cloneSVG(SVGCache._cache.get(url)));
        }
        // Return existing fetch observable
        if (SVGCache._inProgressReqs.has(url)) {
            return SVGCache._inProgressReqs.get(url);
        }
        // Otherwise, make the HTTP call to fetch
        const req = this.http.get(url, { responseType: 'text' }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])((err) => err), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            SVGCache._inProgressReqs.delete(url);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["share"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])((svgText) => {
            const svgEl = this._svgElementFromString(svgText);
            SVGCache._cache.set(url, svgEl);
            return this._cloneSVG(svgEl);
        }));
        SVGCache._inProgressReqs.set(url, req);
        return req;
    }
    /** @internal */
    _svgElementFromString(str) {
        const div = this._document.createElement('DIV');
        div.innerHTML = str;
        const svg = div.querySelector('svg');
        if (!svg) {
            throw new Error('No SVG found in loaded contents');
        }
        return svg;
    }
    /** @internal */
    _cloneSVG(svg) {
        return svg.cloneNode(true);
    }
}
SVGCache.ɵfac = function SVGCache_Factory(t) { return new (t || SVGCache)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"])); };
SVGCache.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: SVGCache, factory: SVGCache.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SVGCache, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return [{ type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"]]
            }] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"] }]; }, null); })();


/***/ }),

/***/ "./src/app/_common/loading-indicator/loading-indicator.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/_common/loading-indicator/loading-indicator.component.ts ***!
  \**************************************************************************/
/*! exports provided: LoadingIndicatorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadingIndicatorComponent", function() { return LoadingIndicatorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var primeng_progressspinner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! primeng/progressspinner */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-progressspinner.js");



class LoadingIndicatorComponent {
}
LoadingIndicatorComponent.ɵfac = function LoadingIndicatorComponent_Factory(t) { return new (t || LoadingIndicatorComponent)(); };
LoadingIndicatorComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: LoadingIndicatorComponent, selectors: [["app-loading-indicator"]], decls: 2, vars: 2, consts: [[1, "loading-indicator"], ["animationDuration", "2s", 3, "strokeWidth", "fill"]], template: function LoadingIndicatorComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "p-progressSpinner", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("strokeWidth", 6)("fill", "rgba(51, 190, 255, 0.2)");
    } }, directives: [primeng_progressspinner__WEBPACK_IMPORTED_MODULE_1__["ProgressSpinner"]], styles: [".loading-indicator[_ngcontent-%COMP%]     .ui-progress-spinner {\n  display: -webkit-box;\n  display: flex;\n  width: 48px;\n  height: 48px;\n}\n\n@-webkit-keyframes ui-progress-spinner-color {\n  100%, 0% {\n    stroke: #33beff;\n  }\n  40% {\n    stroke: #33beff;\n  }\n  66% {\n    stroke: #33beff;\n  }\n  80%, 90% {\n    stroke: #33beff;\n  }\n}\n\n@keyframes ui-progress-spinner-color {\n  100%, 0% {\n    stroke: #33beff;\n  }\n  40% {\n    stroke: #33beff;\n  }\n  66% {\n    stroke: #33beff;\n  }\n  80%, 90% {\n    stroke: #33beff;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL19jb21tb24vbG9hZGluZy1pbmRpY2F0b3IvbG9hZGluZy1pbmRpY2F0b3IuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL19jb21tb24vbG9hZGluZy1pbmRpY2F0b3IvbG9hZGluZy1pbmRpY2F0b3IuY29tcG9uZW50LnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX3ZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7QUNESjs7QURJQTtFQUNJO0lBQVcsZUVHQztFREhkO0VEQ0U7SUFBTSxlRUVNO0VEQWQ7RURERTtJQUFNLGVFQ007RURHZDtFREhFO0lBQVcsZUFBQTtFQ01iO0FBQ0Y7O0FEWEE7RUFDSTtJQUFXLGVFR0M7RURIZDtFRENFO0lBQU0sZUVFTTtFREFkO0VEREU7SUFBTSxlRUNNO0VER2Q7RURIRTtJQUFXLGVBQUE7RUNNYjtBQUNGIiwiZmlsZSI6InNyYy9hcHAvX2NvbW1vbi9sb2FkaW5nLWluZGljYXRvci9sb2FkaW5nLWluZGljYXRvci5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uL3Njc3MvdmFyaWFibGVzJztcblxuLmxvYWRpbmctaW5kaWNhdG9yIDo6bmctZGVlcCAudWktcHJvZ3Jlc3Mtc3Bpbm5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICB3aWR0aDogNDhweDtcbiAgICBoZWlnaHQ6IDQ4cHg7XG59XG5cbkBrZXlmcmFtZXMgdWktcHJvZ3Jlc3Mtc3Bpbm5lci1jb2xvciB7XG4gICAgMTAwJSwgMCUgeyBzdHJva2U6ICR0aGVtZS1wcmltYXJ5OyB9XG4gICAgNDAlIHsgc3Ryb2tlOiAkdGhlbWUtcHJpbWFyeTsgfVxuICAgIDY2JSB7IHN0cm9rZTogJHRoZW1lLXByaW1hcnk7IH1cbiAgICA4MCUsIDkwJSB7IHN0cm9rZTogJHRoZW1lLXByaW1hcnk7IH1cbn1cbiIsIi5sb2FkaW5nLWluZGljYXRvciA6Om5nLWRlZXAgLnVpLXByb2dyZXNzLXNwaW5uZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogNDhweDtcbiAgaGVpZ2h0OiA0OHB4O1xufVxuXG5Aa2V5ZnJhbWVzIHVpLXByb2dyZXNzLXNwaW5uZXItY29sb3Ige1xuICAxMDAlLCAwJSB7XG4gICAgc3Ryb2tlOiAjMzNiZWZmO1xuICB9XG4gIDQwJSB7XG4gICAgc3Ryb2tlOiAjMzNiZWZmO1xuICB9XG4gIDY2JSB7XG4gICAgc3Ryb2tlOiAjMzNiZWZmO1xuICB9XG4gIDgwJSwgOTAlIHtcbiAgICBzdHJva2U6ICMzM2JlZmY7XG4gIH1cbn0iLCIvLyBodHRwczovL2NvbG9yaHVudC5jby9wYWxldHRlLzE1NzExOFxuXG4vLyBDb2xvcnNcbiR0aGVtZS13aGl0ZTogI0ZGRkZGRjtcbiR0aGVtZS1ibGFjazogIzMzMzMzMztcbiR0aGVtZS1ncmF5LWRhcms6IHJlZDtcbiR0aGVtZS1ncmF5OiAjOGE4YThhO1xuJHRoZW1lLWdyYXktbGlnaHQ6ICNlNmU2ZTY7XG4kdGhlbWUtZ3JheS1saWdodGVyOiAjZjVmNWY1O1xuJHRoZW1lLWdyYXktbGlnaHRlc3Q6ICNmZGZkZmQ7XG4kdGhlbWUtZ3JheS1ib3JkZXI6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuXG4kdGhlbWUtcHJpbWFyeTogIzMzYmVmZjtcblxuJHRoZW1lLXN1Y2Nlc3M6ICM0MkM3NUQ7XG4kdGhlbWUtZGFuZ2VyOiAjRkEzRTM5O1xuJHRoZW1lLXdhcm5pbmc6ICNGRkMyMDA7XG5cbi8vIEZvbnRzIGFuZCBUZXh0XG4kZm9udC1mYW1pbHk6IHByb3hpbWEtbm92YSwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuXG4kZm9udC1zaXplLXNtYWxsOiAwLjg3NXJlbTtcbiRmb250LXNpemUtbWVkaXVtOiAxcmVtO1xuJGZvbnQtc2l6ZS1sYXJnZTogMS41cmVtO1xuXG4vLyBMYXlvdXRcbiRib3JkZXItcmFkaXVzOiA0cHg7XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LoadingIndicatorComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-loading-indicator',
                template: `
    <div class="loading-indicator">
        <p-progressSpinner animationDuration="2s" [strokeWidth]="6" [fill]="'rgba(51, 190, 255, 0.2)'"></p-progressSpinner>
    </div>`,
                styleUrls: ['./loading-indicator.component.scss']
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/_common/popover/popover.component.ts":
/*!******************************************************!*\
  !*** ./src/app/_common/popover/popover.component.ts ***!
  \******************************************************/
/*! exports provided: VisiblePopoverCount, HideAllPopovers, PopoverComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VisiblePopoverCount", function() { return VisiblePopoverCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HideAllPopovers", function() { return HideAllPopovers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PopoverComponent", function() { return PopoverComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");





const _c0 = ["popOverContent"];
function PopoverComponent_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](0, 0, ["*ngIf", "visible$ | async"]);
} }
const _c1 = ["*"];
let _VisiblePopoverCount = 0;
function VisiblePopoverCount() {
    return _VisiblePopoverCount;
}
function HideAllPopovers() {
    document.dispatchEvent(new CustomEvent('hidePopovers'));
}
// based on: https://github.com/meiriko/ng2-pop-over
class PopoverComponent {
    constructor(renderer) {
        this.renderer = renderer;
        this.xOffset = 0;
        this.yOffset = 0;
        this.onClose = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.visible$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](false);
        this.subscriptions = [];
    }
    get visible() { return this.visible$.value; }
    ngOnDestroy() {
        this.subscriptions.forEach(o => o.unsubscribe());
        this.subscriptions = [];
        if (this.visible) {
            _VisiblePopoverCount = Math.max(0, _VisiblePopoverCount - 1);
        }
    }
    ngAfterViewInit() {
        this.renderer.setStyle(this.content.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.content.nativeElement, 'visibility', 'hidden');
        return undefined;
    }
    partsContain(parts, type) {
        return parts.indexOf(type) >= 0;
    }
    computePosition(element, event, myOverride = undefined, atOverride = undefined, xOffsetOverride = undefined, yOffsetOverride = undefined) {
        let elementBounds = element.getBoundingClientRect();
        let elementParts = (myOverride || this.my || '').split(/\s+/);
        let elementOffsetX = this.partsContain(elementParts, 'right') ? elementBounds.width : 0;
        let elementOffsetY = this.partsContain(elementParts, 'bottom') ? elementBounds.height : 0;
        let target = this.target || event.target;
        let targetBounds = target.getBoundingClientRect();
        let targetParts = (atOverride || this.at || '').split(/\s+/);
        let targetX = this.partsContain(targetParts, 'right') ? (targetBounds.left + targetBounds.width) : targetBounds.left;
        let targetY = this.partsContain(targetParts, 'bottom') ? (targetBounds.top + targetBounds.height) : targetBounds.top;
        return [
            targetX - elementOffsetX + (xOffsetOverride || this.xOffset),
            targetY - elementOffsetY + (yOffsetOverride || this.yOffset)
        ];
    }
    show(event, suppressHideAllPopovers = false) {
        if (!suppressHideAllPopovers) {
            HideAllPopovers();
        }
        this.subscriptions.forEach(o => o.unsubscribe());
        this.subscriptions = [];
        let element = this.content.nativeElement;
        this.renderer.setStyle(element, 'visibility', 'inherit');
        if (!this.visible) {
            this.visible$.next(true);
            _VisiblePopoverCount++;
        }
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["timer"])(0).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(() => {
            var [x, y] = this.computePosition(element, event);
            var [myOverride, atOverride] = [String(this.my), String(this.at)];
            var [xOffsetOverride, yOffsetOverride] = [Number(this.xOffset), Number(this.yOffset)];
            let needToReposition = false;
            if (x + element.offsetWidth + 10 > window.innerWidth) {
                console.log("Going to reposition the popup because it's falling off the side of the screen");
                myOverride = myOverride.replace("left", "right");
                atOverride = atOverride.replace("left", "right");
                xOffsetOverride *= -1;
                needToReposition = true;
            }
            if (y + element.offsetHeight + 10 > window.innerHeight) {
                myOverride = myOverride.replace("top", "bottom");
                atOverride = atOverride.replace("bottom", "top");
                yOffsetOverride *= -1;
                if (this.computePosition(element, event, myOverride, atOverride, xOffsetOverride, yOffsetOverride)[1] > 0) {
                    console.log("Going to reposition the popup because it's falling off the bottom of the screen");
                    needToReposition = true;
                }
            }
            if (needToReposition) {
                [x, y] = this.computePosition(element, event, myOverride, atOverride, xOffsetOverride, yOffsetOverride);
            }
            if (y + element.offsetHeight + 10 > window.innerHeight) {
                console.log("Preventing the popup from falling off the bottom of the screen");
                this.renderer.setStyle(element, 'bottom', 0 + 'px');
            }
            this.renderer.setStyle(element, 'top', y + 'px');
            this.renderer.setStyle(element, 'left', x + 'px');
            this.renderer.setStyle(element, 'opacity', '1');
            this.subscriptions.push(Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])(element.ownerDocument, 'click')
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["skipUntil"])(Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["timer"])(0)))
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["filter"])((event) => {
                return !element.contains(event.target) && element.ownerDocument.contains(event.target);
            }))
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1))
                .subscribe((v) => {
                this.hide();
                this.onClose.emit();
            }));
            this.subscriptions.push(Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])(document, 'hidePopovers').subscribe(() => {
                this.hide();
                this.onClose.emit();
            }));
        });
    }
    hide() {
        this.renderer.setStyle(this.content.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.content.nativeElement, 'visibility', 'hidden');
        this.renderer.setStyle(this.content.nativeElement, 'bottom', null);
        if (this.visible) {
            this.visible$.next(false);
            _VisiblePopoverCount = Math.max(0, _VisiblePopoverCount - 1);
        }
    }
    toggle(event, suppressHideAllPopovers = false) {
        this.visible$
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1))
            .subscribe((visible) => {
            visible ? this.hide() : this.show(event, suppressHideAllPopovers);
        });
    }
}
PopoverComponent.ɵfac = function PopoverComponent_Factory(t) { return new (t || PopoverComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"])); };
PopoverComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PopoverComponent, selectors: [["app-popover"]], viewQuery: function PopoverComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.content = _t.first);
    } }, inputs: { my: "my", at: "at", xOffset: ["x-offset", "xOffset"], yOffset: ["y-offset", "yOffset"], contentClass: ["content-class", "contentClass"], target: "target" }, outputs: { onClose: "onClose" }, ngContentSelectors: _c1, decls: 6, vars: 8, consts: [[1, "popover-component", 3, "ngClass"], ["popOverContent", ""], [1, "app-popover-content"], [4, "ngIf"]], template: function PopoverComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, PopoverComponent_4_Template, 1, 0, undefined, 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](5, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("shown", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 4, ctx.visible$));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx.contentClass);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](5, 6, ctx.visible$));
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["NgClass"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["AsyncPipe"]], encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PopoverComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-popover',
                template: `
        <div #popOverContent class="popover-component" [ngClass]="contentClass" [class.shown]="visible$ | async">
            <div class="app-popover-content">
                <ng-content *ngIf="visible$ | async"></ng-content>
            </div>
        </div>
    `,
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"] }]; }, { my: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], at: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], xOffset: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"],
            args: ['x-offset']
        }], yOffset: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"],
            args: ['y-offset']
        }], contentClass: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"],
            args: ['content-class']
        }], target: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], onClose: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], content: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['popOverContent', { static: true }]
        }] }); })();


/***/ }),

/***/ "./src/app/_common/redirect/redirect.component.ts":
/*!********************************************************!*\
  !*** ./src/app/_common/redirect/redirect.component.ts ***!
  \********************************************************/
/*! exports provided: RedirectComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RedirectComponent", function() { return RedirectComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");




class RedirectComponent {
    constructor(router) {
        this.router = router;
    }
    ngOnInit() {
        this.router.navigate(['/media']);
    }
}
RedirectComponent.ɵfac = function RedirectComponent_Factory(t) { return new (t || RedirectComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"])); };
RedirectComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: RedirectComponent, selectors: [["app-redirect"]], decls: 0, vars: 0, template: function RedirectComponent_Template(rf, ctx) { }, encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](RedirectComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-redirect',
                template: ``,
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] }]; }, null); })();


/***/ }),

/***/ "./src/app/_common/safe-html/safe-html.pipe.ts":
/*!*****************************************************!*\
  !*** ./src/app/_common/safe-html/safe-html.pipe.ts ***!
  \*****************************************************/
/*! exports provided: SafeHtmlPipe, SafeResourceUrlPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SafeHtmlPipe", function() { return SafeHtmlPipe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SafeResourceUrlPipe", function() { return SafeResourceUrlPipe; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");




class SafeHtmlPipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(value) {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}
SafeHtmlPipe.ɵfac = function SafeHtmlPipe_Factory(t) { return new (t || SafeHtmlPipe)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["DomSanitizer"])); };
SafeHtmlPipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefinePipe"]({ name: "safeHtml", type: SafeHtmlPipe, pure: true });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](SafeHtmlPipe, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"],
        args: [{
                name: 'safeHtml'
            }]
    }], function () { return [{ type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["DomSanitizer"] }]; }, null); })();
class SafeResourceUrlPipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(value) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
}
SafeResourceUrlPipe.ɵfac = function SafeResourceUrlPipe_Factory(t) { return new (t || SafeResourceUrlPipe)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["DomSanitizer"])); };
SafeResourceUrlPipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefinePipe"]({ name: "safeResourceUrl", type: SafeResourceUrlPipe, pure: true });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](SafeResourceUrlPipe, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"],
        args: [{ name: 'safeResourceUrl' }]
    }], function () { return [{ type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["DomSanitizer"] }]; }, null); })();


/***/ }),

/***/ "./src/app/_common/selection-box/selection-box.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/_common/selection-box/selection-box.component.ts ***!
  \******************************************************************/
/*! exports provided: SelectionBoxComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectionBoxComponent", function() { return SelectionBoxComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");






const _c0 = ["input"];
function SelectionBoxComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "app-action-icon", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SelectionBoxComponent_div_1_Template_app_action_icon_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r26); const item_r24 = ctx.$implicit; const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r25.onRemove(item_r24); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r24 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r24.display);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", "times");
} }
function SelectionBoxComponent_div_5_ng_container_1_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r28.header);
} }
function SelectionBoxComponent_div_5_ng_container_1_ng_template_3_Template(rf, ctx) { }
const _c1 = function (a0) { return { item: a0 }; };
function SelectionBoxComponent_div_5_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, SelectionBoxComponent_div_5_ng_container_1_div_1_Template, 2, 1, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SelectionBoxComponent_div_5_ng_container_1_Template_div_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r34); const item_r28 = ctx.$implicit; const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r33.onSelect(item_r28); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, SelectionBoxComponent_div_5_ng_container_1_ng_template_3_Template, 0, 0, "ng-template", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const item_r28 = ctx.$implicit;
    const index_r29 = ctx.index;
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", item_r28.header && (index_r29 === 0 || ctx_r27.filtered[index_r29 - 1].header !== item_r28.header));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("focus", item_r28 === ctx_r27.focusedItem);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngTemplateOutlet", ctx_r27.itemTemplate || _r22)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](5, _c1, item_r28));
} }
function SelectionBoxComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, SelectionBoxComponent_div_5_ng_container_1_Template, 4, 7, "ng-container", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r21.filtered);
} }
function SelectionBoxComponent_ng_template_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0);
} if (rf & 2) {
    const item_r35 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r35.display);
} }
class SelectionBoxComponent {
    constructor() {
        this.items = [];
        this.max = 0;
        this.placeholder = 'Search...';
        this.search = '';
        this.filtered = [];
        this.focused = false;
        this.selectedItems = [];
        this.values = [];
    }
    writeValue(value) {
        this.values = value || [];
        this.updateFilteredItems();
    }
    registerOnChange(value) { this.onChange = value; }
    registerOnTouched(value) { this.onTouched = value; }
    ngOnInit() { this.updateFilteredItems(); }
    ngOnChanges() { this.updateFilteredItems(); }
    onFocusChange(value) {
        if (value) {
            this.focused = true;
        }
        else {
            setTimeout(() => {
                this.focused = false;
                this.focusedItem = undefined;
                this.search = '';
                this.updateFilteredItems();
            }, 150);
        }
    }
    updateFilteredItems() {
        this.selectedItems = this.values.map(o => this.items.find(i => i.value === o)).filter(o => o);
        const search = (this.search || '').trim().toLowerCase();
        this.filtered = this.items.filter(o => {
            return this.selectedItems.indexOf(o) < 0 &&
                (!search || o.display.toLowerCase().indexOf(search) >= 0);
        });
    }
    onArrowDown() {
        let index = -1;
        if (this.focusedItem) {
            index = this.filtered.indexOf(this.focusedItem);
        }
        if (index >= 0 && index < this.filtered.length - 1) {
            this.focusedItem = this.filtered[index + 1];
        }
        else {
            this.focusedItem = this.filtered.length ? this.filtered[0] : undefined;
        }
    }
    onArrowUp() {
        let index = -1;
        if (this.focusedItem) {
            index = this.filtered.indexOf(this.focusedItem);
        }
        if (index > 0 && index < this.filtered.length) {
            this.focusedItem = this.filtered[index - 1];
        }
        else {
            this.focusedItem = this.filtered.length ? this.filtered[this.filtered.length - 1] : undefined;
        }
    }
    onSelect(item) {
        if (this.filtered.indexOf(item) < 0) {
            return;
        }
        this.selectedItems.push(item);
        this.values = this.selectedItems.map(o => o.value);
        this.onChange(this.values);
        this.input.nativeElement.blur();
    }
    onRemove(item) {
        this.selectedItems = this.selectedItems.filter(o => o !== item);
        this.values = this.selectedItems.map(o => o.value);
        this.onChange(this.values);
        this.updateFilteredItems();
    }
}
SelectionBoxComponent.ɵfac = function SelectionBoxComponent_Factory(t) { return new (t || SelectionBoxComponent)(); };
SelectionBoxComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SelectionBoxComponent, selectors: [["app-selection-box"]], viewQuery: function SelectionBoxComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.input = _t.first);
    } }, inputs: { items: "items", max: "max", placeholder: "placeholder", itemTemplate: "itemTemplate" }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
                provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALUE_ACCESSOR"],
                useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(() => SelectionBoxComponent),
                multi: true
            }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]()], decls: 8, vars: 6, consts: [[1, "selection-box-container"], ["class", "selection-item", 4, "ngFor", "ngForOf"], ["type", "text", 3, "ngModel", "placeholder", "ngModelChange", "focus", "blur", "keydown.arrowdown", "keydown.arrowup", "keydown.enter"], ["input", ""], [1, "autocomplete-position"], ["class", "autocomplete-container", 4, "ngIf"], ["defaultItemTemplate", ""], [1, "selection-item"], [1, "selection-item-display"], [3, "icon", "click"], [1, "autocomplete-container"], [4, "ngFor", "ngForOf"], ["class", "autocomplete-header", 4, "ngIf"], [1, "autocomplete-item", 3, "click"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "autocomplete-header"]], template: function SelectionBoxComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, SelectionBoxComponent_div_1_Template, 4, 2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "input", 2, 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function SelectionBoxComponent_Template_input_ngModelChange_2_listener($event) { return ctx.search = $event; })("ngModelChange", function SelectionBoxComponent_Template_input_ngModelChange_2_listener() { return ctx.updateFilteredItems(); })("focus", function SelectionBoxComponent_Template_input_focus_2_listener() { return ctx.onFocusChange(true); })("blur", function SelectionBoxComponent_Template_input_blur_2_listener() { return ctx.onFocusChange(false); })("keydown.arrowdown", function SelectionBoxComponent_Template_input_keydown_arrowdown_2_listener($event) { $event.preventDefault(); return ctx.onArrowDown(); })("keydown.arrowup", function SelectionBoxComponent_Template_input_keydown_arrowup_2_listener($event) { $event.preventDefault(); return ctx.onArrowUp(); })("keydown.enter", function SelectionBoxComponent_Template_input_keydown_enter_2_listener() { return ctx.onSelect(ctx.focusedItem); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, SelectionBoxComponent_div_5_Template, 2, 1, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, SelectionBoxComponent_ng_template_6_Template, 1, 1, "ng-template", null, 6, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.selectedItems);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("hidden", ctx.selectedItems.length >= ctx.items.length || ctx.max && ctx.selectedItems.length >= ctx.max);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.search)("placeholder", ctx.placeholder);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.focused);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgModel"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_3__["ActionIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgTemplateOutlet"]], styles: [".selection-box-container[_ngcontent-%COMP%] {\n  margin-bottom: 8px;\n}\n.selection-box-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  margin: 0px;\n}\n.selection-box-container[_ngcontent-%COMP%]   input.hidden[_ngcontent-%COMP%] {\n  display: none;\n}\n.selection-item[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  background-color: #fdfdfd;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  height: 47px;\n  padding: 12px 16px;\n  margin-bottom: 4px;\n}\n.selection-item[_ngcontent-%COMP%]   .selection-item-display[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.selection-item[_ngcontent-%COMP%]     .action-icon {\n  margin: -8px -9px -8px 8px;\n}\n.autocomplete-position[_ngcontent-%COMP%] {\n  position: relative;\n}\n.autocomplete-container[_ngcontent-%COMP%] {\n  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  font-size: 1rem;\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  max-height: 300px;\n  padding: 0.25rem;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.autocomplete-container[_ngcontent-%COMP%]   .autocomplete-header[_ngcontent-%COMP%] {\n  font-weight: 700;\n  background-color: #f5f5f5;\n  padding: 4px 16px;\n  margin: 4px -4px;\n}\n.autocomplete-container[_ngcontent-%COMP%]   .autocomplete-header[_ngcontent-%COMP%]:first-child {\n  margin-top: 0;\n}\n.autocomplete-container[_ngcontent-%COMP%]   .autocomplete-item[_ngcontent-%COMP%] {\n  cursor: pointer;\n  border-radius: 4px;\n  padding: 0.25rem;\n}\n.autocomplete-container[_ngcontent-%COMP%]   .autocomplete-item.focus[_ngcontent-%COMP%] {\n  color: #FFFFFF;\n  background-color: #33beff;\n}\n.autocomplete-container[_ngcontent-%COMP%]   .autocomplete-item[_ngcontent-%COMP%]:hover {\n  color: #FFFFFF;\n  background-color: #33beff;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL19jb21tb24vc2VsZWN0aW9uLWJveC9zZWxlY3Rpb24tYm94LmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9fY29tbW9uL3NlbGVjdGlvbi1ib3gvc2VsZWN0aW9uLWJveC5jb21wb25lbnQuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fdmFyaWFibGVzLnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX21peGlucy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0VBQ0ksa0JBQUE7QUNGSjtBRElJO0VBQ0ksV0FBQTtBQ0ZSO0FESVE7RUFDSSxhQUFBO0FDRlo7QURPQTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSx5QkVUa0I7RUZVbEIseUJBQUE7RUFDQSxrQkVNWTtFRkxaLFlBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0FDSko7QURNSTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtBQ0pSO0FET0k7RUFDSSwwQkFBQTtBQ0xSO0FEU0E7RUFDSSxrQkFBQTtBQ05KO0FEUUE7RUdsQ0ksMkNBQUE7RUhvQ0Esa0JBQUE7RUFBb0IsTUFBQTtFQUFRLE9BQUE7RUFBUyxRQUFBO0VBQ3JDLGVFbEJlO0VGbUJmLHlCRXRDVTtFRnVDVix5QkFBQTtFQUNBLGtCRWpCWTtFRmtCWixpQkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtBQ0ZKO0FESUk7RUFDSSxnQkFBQTtFQUNBLHlCRTNDYTtFRjRDYixpQkFBQTtFQUNBLGdCQUFBO0FDRlI7QURJUTtFQUNJLGFBQUE7QUNGWjtBRE1JO0VBQ0ksZUFBQTtFQUNBLGtCRXBDUTtFRnFDUixnQkFBQTtBQ0pSO0FETVE7RUFDSSxjRS9ERTtFRmdFRix5QkV2REk7QURtRGhCO0FET1E7RUFDSSxjRXBFRTtFRnFFRix5QkU1REk7QUR1RGhCIiwiZmlsZSI6InNyYy9hcHAvX2NvbW1vbi9zZWxlY3Rpb24tYm94L3NlbGVjdGlvbi1ib3guY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi9zY3NzL3ZhcmlhYmxlcyc7XG5AaW1wb3J0ICcuLi8uLi8uLi9zY3NzL21peGlucyc7XG5cbi5zZWxlY3Rpb24tYm94LWNvbnRhaW5lciB7XG4gICAgbWFyZ2luLWJvdHRvbTogOHB4O1xuXG4gICAgaW5wdXQge1xuICAgICAgICBtYXJnaW46IDBweDtcblxuICAgICAgICAmLmhpZGRlbiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uc2VsZWN0aW9uLWl0ZW0ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVzdDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAkdGhlbWUtZ3JheS1ib3JkZXI7XG4gICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgaGVpZ2h0OiA0N3B4O1xuICAgIHBhZGRpbmc6IDEycHggMTZweDtcbiAgICBtYXJnaW4tYm90dG9tOiA0cHg7XG5cbiAgICAuc2VsZWN0aW9uLWl0ZW0tZGlzcGxheSB7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIH1cblxuICAgIDo6bmctZGVlcCAuYWN0aW9uLWljb24ge1xuICAgICAgICBtYXJnaW46IC04cHggLTlweCAtOHB4IDhweDtcbiAgICB9XG59XG5cbi5hdXRvY29tcGxldGUtcG9zaXRpb24ge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi5hdXRvY29tcGxldGUtY29udGFpbmVyIHtcbiAgICBAaW5jbHVkZSBzaGFkb3coKTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgcmlnaHQ6IDA7IFxuICAgIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1tZWRpdW07XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLXdoaXRlO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR0aGVtZS1ncmF5LWJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICBtYXgtaGVpZ2h0OiAzMDBweDtcbiAgICBwYWRkaW5nOiAwLjI1cmVtO1xuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xuXG4gICAgLmF1dG9jb21wbGV0ZS1oZWFkZXIge1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVyO1xuICAgICAgICBwYWRkaW5nOiA0cHggMTZweDtcbiAgICAgICAgbWFyZ2luOiA0cHggLTRweDtcblxuICAgICAgICAmOmZpcnN0LWNoaWxkIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuYXV0b2NvbXBsZXRlLWl0ZW0ge1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6ICRib3JkZXItcmFkaXVzO1xuICAgICAgICBwYWRkaW5nOiAwLjI1cmVtO1xuXG4gICAgICAgICYuZm9jdXMge1xuICAgICAgICAgICAgY29sb3I6ICR0aGVtZS13aGl0ZTtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1wcmltYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBjb2xvcjogJHRoZW1lLXdoaXRlO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLXByaW1hcnk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIuc2VsZWN0aW9uLWJveC1jb250YWluZXIge1xuICBtYXJnaW4tYm90dG9tOiA4cHg7XG59XG4uc2VsZWN0aW9uLWJveC1jb250YWluZXIgaW5wdXQge1xuICBtYXJnaW46IDBweDtcbn1cbi5zZWxlY3Rpb24tYm94LWNvbnRhaW5lciBpbnB1dC5oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4uc2VsZWN0aW9uLWl0ZW0ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmRmZGZkO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTZlNmU2O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGhlaWdodDogNDdweDtcbiAgcGFkZGluZzogMTJweCAxNnB4O1xuICBtYXJnaW4tYm90dG9tOiA0cHg7XG59XG4uc2VsZWN0aW9uLWl0ZW0gLnNlbGVjdGlvbi1pdGVtLWRpc3BsYXkge1xuICBmbGV4OiAxIDEgYXV0bztcbn1cbi5zZWxlY3Rpb24taXRlbSA6Om5nLWRlZXAgLmFjdGlvbi1pY29uIHtcbiAgbWFyZ2luOiAtOHB4IC05cHggLThweCA4cHg7XG59XG5cbi5hdXRvY29tcGxldGUtcG9zaXRpb24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5hdXRvY29tcGxldGUtY29udGFpbmVyIHtcbiAgYm94LXNoYWRvdzogMCAxcHggNHB4IDAgcmdiYSgwLCAwLCAwLCAwLjA2KTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBmb250LXNpemU6IDFyZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlNmU2ZTY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgbWF4LWhlaWdodDogMzAwcHg7XG4gIHBhZGRpbmc6IDAuMjVyZW07XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgb3ZlcmZsb3cteTogYXV0bztcbn1cbi5hdXRvY29tcGxldGUtY29udGFpbmVyIC5hdXRvY29tcGxldGUtaGVhZGVyIHtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcbiAgcGFkZGluZzogNHB4IDE2cHg7XG4gIG1hcmdpbjogNHB4IC00cHg7XG59XG4uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuYXV0b2NvbXBsZXRlLWhlYWRlcjpmaXJzdC1jaGlsZCB7XG4gIG1hcmdpbi10b3A6IDA7XG59XG4uYXV0b2NvbXBsZXRlLWNvbnRhaW5lciAuYXV0b2NvbXBsZXRlLWl0ZW0ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgcGFkZGluZzogMC4yNXJlbTtcbn1cbi5hdXRvY29tcGxldGUtY29udGFpbmVyIC5hdXRvY29tcGxldGUtaXRlbS5mb2N1cyB7XG4gIGNvbG9yOiAjRkZGRkZGO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzNiZWZmO1xufVxuLmF1dG9jb21wbGV0ZS1jb250YWluZXIgLmF1dG9jb21wbGV0ZS1pdGVtOmhvdmVyIHtcbiAgY29sb3I6ICNGRkZGRkY7XG4gIGJhY2tncm91bmQtY29sb3I6ICMzM2JlZmY7XG59IiwiLy8gaHR0cHM6Ly9jb2xvcmh1bnQuY28vcGFsZXR0ZS8xNTcxMThcblxuLy8gQ29sb3JzXG4kdGhlbWUtd2hpdGU6ICNGRkZGRkY7XG4kdGhlbWUtYmxhY2s6ICMzMzMzMzM7XG4kdGhlbWUtZ3JheS1kYXJrOiByZWQ7XG4kdGhlbWUtZ3JheTogIzhhOGE4YTtcbiR0aGVtZS1ncmF5LWxpZ2h0OiAjZTZlNmU2O1xuJHRoZW1lLWdyYXktbGlnaHRlcjogI2Y1ZjVmNTtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXN0OiAjZmRmZGZkO1xuJHRoZW1lLWdyYXktYm9yZGVyOiAkdGhlbWUtZ3JheS1saWdodDtcblxuJHRoZW1lLXByaW1hcnk6ICMzM2JlZmY7XG5cbiR0aGVtZS1zdWNjZXNzOiAjNDJDNzVEO1xuJHRoZW1lLWRhbmdlcjogI0ZBM0UzOTtcbiR0aGVtZS13YXJuaW5nOiAjRkZDMjAwO1xuXG4vLyBGb250cyBhbmQgVGV4dFxuJGZvbnQtZmFtaWx5OiBwcm94aW1hLW5vdmEsIFwiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcblxuJGZvbnQtc2l6ZS1zbWFsbDogMC44NzVyZW07XG4kZm9udC1zaXplLW1lZGl1bTogMXJlbTtcbiRmb250LXNpemUtbGFyZ2U6IDEuNXJlbTtcblxuLy8gTGF5b3V0XG4kYm9yZGVyLXJhZGl1czogNHB4O1xuIiwiQGltcG9ydCBcInZhcmlhYmxlc1wiO1xuXG5AbWl4aW4gc2hhZG93KCkge1xuICAgIGJveC1zaGFkb3c6IDAgMXB4IDRweCAwIHJnYmEoMCwgMCwgMCwgMC4wNik7XG59XG5cbkBtaXhpbiBoZWFkZXItZm9udCgpIHtcbiAgICBmb250LXNpemU6IDMycHg7XG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcbn1cblxuQG1peGluIHRpdGxlLWZvbnQoKSB7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG59XG5cbkBtaXhpbiBsYWJlbC1mb250KCkge1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgY29sb3I6ICR0aGVtZS1ncmF5O1xuICAgIG1hcmdpbi1ib3R0b206IDJweDtcbn1cbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SelectionBoxComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-selection-box',
                templateUrl: './selection-box.component.html',
                styleUrls: ['./selection-box.component.scss'],
                providers: [{
                        provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALUE_ACCESSOR"],
                        useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(() => SelectionBoxComponent),
                        multi: true
                    }]
            }]
    }], null, { items: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], max: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], placeholder: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], itemTemplate: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], input: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['input', { static: true }]
        }] }); })();


/***/ }),

/***/ "./src/app/_common/set-title/set-title.directive.ts":
/*!**********************************************************!*\
  !*** ./src/app/_common/set-title/set-title.directive.ts ***!
  \**********************************************************/
/*! exports provided: SetTitleDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetTitleDirective", function() { return SetTitleDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");





class SetTitleDirective {
    constructor(_title) {
        this._title = _title;
    }
    ngOnChanges() { this.updateTitle(); }
    updateTitle() {
        this._title.setTitle(this.title ? `${this.title} | HopeStream` : 'HopeStream');
    }
}
SetTitleDirective.ɵfac = function SetTitleDirective_Factory(t) { return new (t || SetTitleDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["Title"])); };
SetTitleDirective.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({ type: SetTitleDirective, selectors: [["", "setTitle", ""]], inputs: { title: ["setTitle", "title"] }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]()] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SetTitleDirective, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"],
        args: [{
                selector: '[setTitle]'
            }]
    }], function () { return [{ type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["Title"] }]; }, { title: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"],
            args: ['setTitle']
        }] }); })();


/***/ }),

/***/ "./src/app/_common/third-parties/facebook.ts":
/*!***************************************************!*\
  !*** ./src/app/_common/third-parties/facebook.ts ***!
  \***************************************************/
/*! exports provided: NETWORK, Facebook */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NETWORK", function() { return NETWORK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Facebook", function() { return Facebook; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _services_app_app_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @services/app/app.api */ "./src/app/_services/app/app.api.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");









const NETWORK = 'facebook';
const FACEBOOK_AUTH_URL = 'https://www.facebook.com/v6.0/dialog/oauth';
const FACEBOOK_API_URL = 'https://www.googleapis.com';
const OAUTH_CLIENT_ID = '1613742305579846';
const OAUTH_CLIENT_SECRET = 'a9417a7250676b953d8b8b40467a90cd';
const REDIRECT_URI_LOCAL = 'http://localhost:8080/#/'; // 'https://www.facebook.com/connect/login_success.html';
const SCOPES = [
    'publish_video'
];
class PendingSubject extends rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"] {
    constructor(request) {
        super();
        this.request = request;
    }
}
class Facebook {
    constructor(http) {
        this.http = http;
        this.loggedIn$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](false);
        this.pending = undefined;
    }
    get accessToken() { return this.credentials && this.credentials.accessToken; }
    userLogin() {
        return this.getAuthCodeLocal().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["mergeMap"])(code => {
            return this.oauthToken({
                'redirect_uri': REDIRECT_URI_LOCAL,
                'code': code,
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(credentials => {
            let account = new _services_app_app_api__WEBPACK_IMPORTED_MODULE_3__["App"].SocialAccount();
            account.network = NETWORK;
            account.accessToken = credentials.accessToken;
            account.refreshToken = credentials.refreshToken;
            return account;
        }));
    }
    getAuthCodeLocal() {
        let result = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        let params = new URLSearchParams();
        params.set('client_id', OAUTH_CLIENT_ID);
        params.set('redirect_uri', REDIRECT_URI_LOCAL);
        params.set('scope', SCOPES.join(' '));
        params.set('response_type', 'code');
        params.set('state', '12345');
        params.set('display', 'popup');
        let url = FACEBOOK_AUTH_URL + '?' + params.toString();
        // center window
        // var left = (screen.width/2)-(w/2);
        // var top = (screen.height/2)-(h/2);
        // return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
        let ref = window.open(url, '_blank', 'width=500,height=500,menubar=no');
        let code = undefined;
        let interval = setInterval(() => {
            try {
                let href = ref.location.href;
                console.log('HREF: ', href);
                if (href.indexOf('?') >= 0 || href.indexOf('localhost') >= 0) {
                    let search = new URLSearchParams(href.split('?')[1]);
                    code = search.get('code');
                    ref.close();
                }
            }
            catch (e) { }
            if (ref.closed) {
                clearInterval(interval);
                if (code) {
                    result.next(code);
                    result.complete();
                }
                else {
                    result.error('Authorization canceled');
                }
            }
        }, 500);
        return result;
    }
    oauthToken(params_) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        let params = new URLSearchParams();
        params.set('client_id', OAUTH_CLIENT_ID);
        params.set('client_secret', OAUTH_CLIENT_SECRET);
        let _params = params_ || {};
        for (let key in _params) {
            params.set(key, _params[key]);
        }
        return this.http.request('POST', 'https://graph.facebook.com/v6.0/oauth/access_token', {
            body: params.toString(),
            headers: headers,
            responseType: 'json',
            observe: 'response',
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(response => {
            const json = response.body;
            return { 'accessToken': json.access_token, 'refreshToken': undefined };
        }));
    }
    userLogout() {
        this.credentials = undefined;
        this.loggedIn$.next(false);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(true).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(() => { }));
    }
    restoreLoggedInUser(account) {
        this.credentials = { accessToken: account.accessToken, refreshToken: account.refreshToken };
        this.loggedIn$.next(true);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(true).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(() => { }));
    }
    userRefresh(token) {
        return this.oauthToken({
            'grant_type': 'refresh_token',
            'refresh_token': token
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(credentials => {
            this.credentials = credentials;
            this.loggedIn$.next(true);
        }));
    }
    request(method, path, params_, headers_, data) {
        let headers = Object.assign({}, (headers_ || {}));
        if (!!data && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
        if (!headers['Accept']) {
            headers['Accept'] = 'application/json';
        }
        let responseType = headers['Accept'] === 'application/octet-stream' ? 'blob' : (headers['Accept'] === 'application/json' ? 'json' : 'text');
        let credentials = this.credentials;
        if (credentials && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${credentials.accessToken}`;
        }
        // Workaround https://github.com/angular/angular/issues/11058
        let params = Object.assign({}, (params_ || {}));
        for (let key in params) {
            if (params[key] === undefined) {
                delete params[key];
            }
            else {
                let array = Array.isArray(params[key]) ? params[key] : [params[key]];
                array = array.map(o => {
                    if (!(o instanceof Date) || !o.getTime()) {
                        return o;
                    }
                    return o.toISOString(); // serialize dates in a specific way
                }).filter(o => o !== undefined);
                if (!array.length) {
                    delete params[key];
                }
                else {
                    params[key] = array.length === 1 ? array[0] : array;
                }
            }
        }
        let url = FACEBOOK_API_URL + path;
        let subject = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        this.http.request(method, url, {
            body: data,
            headers: headers,
            params: params,
            responseType: responseType,
            observe: 'response',
        }).subscribe(response => {
            subject.next(response);
            subject.complete();
        }, response => {
            this.fail(response, { 'method': method, 'path': path, 'params': params_, 'headers': headers_, 'data': data }).subscribe(subject);
        });
        return subject;
    }
    GET(path, params, headers = {}, data = undefined) {
        return this.request('GET', path, params, headers, data);
    }
    POST(path, params, headers = {}, data = undefined) {
        return this.request('POST', path, params, headers, data);
    }
    PUT(path, params, headers = {}, data = undefined) {
        return this.request('PUT', path, params, headers, data);
    }
    DELETE(path, params, headers = {}, data = undefined) {
        return this.request('DELETE', path, params, headers, data);
    }
    fail(response, request) {
        return this.shouldAttemptRequestAgainAfterRefreshing(response, request) || Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["throwError"])(response);
    }
    shouldAttemptRequestAgainAfterRefreshing(response, request) {
        var result = undefined;
        let json = undefined;
        try {
            json = response && (response.error || response.body);
        }
        catch (error) { }
        let error = json && json.error && json.error.message && json.error.message.toLowerCase() || '';
        if (error.indexOf('credentials') >= 0) {
            let subject = new PendingSubject(request);
            result = subject;
            if (!this.pending) {
                this.pending = new Array();
                this.pending.push(subject);
                this.processRefresh();
            }
            else {
                this.pending.push(subject);
            }
        }
        return result;
    }
    processRefresh() {
        let credentials = this.credentials;
        if (!credentials || !credentials.accessToken) {
            this.userLogout();
            this.completeRefresh();
            return;
        }
        if (!!credentials.refreshToken) {
            this.userRefresh(credentials.refreshToken).subscribe(response => {
                this.completeRefresh();
            }, response => {
                this.userLogout();
                this.completeRefresh();
            });
        }
        else {
            this.userLogout();
            this.completeRefresh();
        }
    }
    completeRefresh() {
        let pending = this.pending;
        this.pending = undefined;
        if (!pending) {
            return;
        }
        let credentials = this.credentials;
        for (let subject of pending) {
            if (credentials && credentials.accessToken) {
                let request = subject.request;
                this.request(request.method, request.path, request.params, request.headers, request.data).subscribe(subject);
            }
            else {
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["throwError"])({
                    'statusText': 'Invalid access token.',
                    'status': 401
                }).subscribe(subject);
            }
        }
    }
}
Facebook.ɵfac = function Facebook_Factory(t) { return new (t || Facebook)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"])); };
Facebook.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: Facebook, factory: Facebook.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](Facebook, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"] }]; }, null); })();


/***/ }),

/***/ "./src/app/_common/third-parties/google.ts":
/*!*************************************************!*\
  !*** ./src/app/_common/third-parties/google.ts ***!
  \*************************************************/
/*! exports provided: NETWORK, Google */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NETWORK", function() { return NETWORK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Google", function() { return Google; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _services_app_app_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @services/app/app.api */ "./src/app/_services/app/app.api.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");









const NETWORK = 'youtube';
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_API_URL = 'https://www.googleapis.com';
const OAUTH_CLIENT_ID = '411673316996-iak5hlp5od4pvefhlc9ephasmp9dgo6f.apps.googleusercontent.com';
const OAUTH_CLIENT_SECRET = '2BQeOxl-YIAo-HjLLz-hxorg';
const REDIRECT_URI_LOCAL = 'http://localhost:8080';
const SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube'
];
class PendingSubject extends rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"] {
    constructor(request) {
        super();
        this.request = request;
    }
}
class Google {
    constructor(http) {
        this.http = http;
        this.loggedIn$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](false);
        this.pending = undefined;
    }
    get accessToken() { return this.credentials && this.credentials.accessToken; }
    userLogin() {
        return this.getAuthCodeLocal().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["mergeMap"])(code => {
            return this.oauthToken({
                'grant_type': 'authorization_code',
                'redirect_uri': REDIRECT_URI_LOCAL,
                'code': code,
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(credentials => {
            let account = new _services_app_app_api__WEBPACK_IMPORTED_MODULE_3__["App"].SocialAccount();
            account.network = NETWORK;
            account.accessToken = credentials.accessToken;
            account.refreshToken = credentials.refreshToken;
            return account;
        }));
    }
    getAuthCodeLocal() {
        let result = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        let params = new URLSearchParams();
        params.set('client_id', OAUTH_CLIENT_ID);
        params.set('redirect_uri', REDIRECT_URI_LOCAL);
        params.set('scope', SCOPES.join(' '));
        params.set('response_type', 'code');
        params.set('prompt', 'select_account');
        let url = GOOGLE_AUTH_URL + '?' + params.toString();
        // center window
        // var left = (screen.width/2)-(w/2);
        // var top = (screen.height/2)-(h/2);
        // return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
        let ref = window.open(url, '_blank', 'width=500,height=500,menubar=no');
        let code = undefined;
        let interval = setInterval(() => {
            try {
                let href = ref.location.href;
                if (href.indexOf('?') >= 0) {
                    let search = new URLSearchParams(href.split('?')[1]);
                    code = search.get('code');
                    ref.close();
                }
            }
            catch (e) { }
            if (ref.closed) {
                clearInterval(interval);
                if (code) {
                    result.next(code);
                    result.complete();
                }
                else {
                    result.error('Authorization canceled');
                }
            }
        }, 500);
        return result;
    }
    oauthToken(params_) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        let params = new URLSearchParams();
        params.set('client_id', OAUTH_CLIENT_ID);
        params.set('client_secret', OAUTH_CLIENT_SECRET);
        let _params = params_ || {};
        for (let key in _params) {
            params.set(key, _params[key]);
        }
        return this.http.request('POST', 'https://www.googleapis.com/oauth2/v4/token', {
            body: params.toString(),
            headers: headers,
            responseType: 'json',
            observe: 'response',
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(response => {
            const json = response.body;
            return { 'accessToken': json.access_token, 'refreshToken': json.refresh_token };
        }));
    }
    userLogout() {
        this.credentials = undefined;
        this.loggedIn$.next(false);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(true).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(() => { }));
    }
    restoreLoggedInUser(account) {
        this.credentials = { accessToken: account.accessToken, refreshToken: account.refreshToken };
        this.loggedIn$.next(true);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(true).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(() => { }));
    }
    userRefresh(token) {
        return this.oauthToken({
            'grant_type': 'refresh_token',
            'refresh_token': token
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(credentials => {
            this.credentials = credentials;
            this.loggedIn$.next(true);
        }));
    }
    request(method, path, params_, headers_, data) {
        let headers = Object.assign({}, (headers_ || {}));
        if (!!data && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
        if (!headers['Accept']) {
            headers['Accept'] = 'application/json';
        }
        let responseType = headers['Accept'] === 'application/octet-stream' ? 'blob' : (headers['Accept'] === 'application/json' ? 'json' : 'text');
        let credentials = this.credentials;
        if (credentials && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${credentials.accessToken}`;
        }
        // Workaround https://github.com/angular/angular/issues/11058
        let params = Object.assign({}, (params_ || {}));
        for (let key in params) {
            if (params[key] === undefined) {
                delete params[key];
            }
            else {
                let array = Array.isArray(params[key]) ? params[key] : [params[key]];
                array = array.map(o => {
                    if (!(o instanceof Date) || !o.getTime()) {
                        return o;
                    }
                    return o.toISOString(); // serialize dates in a specific way
                }).filter(o => o !== undefined);
                if (!array.length) {
                    delete params[key];
                }
                else {
                    params[key] = array.length === 1 ? array[0] : array;
                }
            }
        }
        let url = GOOGLE_API_URL + path;
        let subject = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        this.http.request(method, url, {
            body: data,
            headers: headers,
            params: params,
            responseType: responseType,
            observe: 'response',
        }).subscribe(response => {
            subject.next(response);
            subject.complete();
        }, response => {
            this.fail(response, { 'method': method, 'path': path, 'params': params_, 'headers': headers_, 'data': data }).subscribe(subject);
        });
        return subject;
    }
    GET(path, params, headers = {}, data = undefined) {
        return this.request('GET', path, params, headers, data);
    }
    POST(path, params, headers = {}, data = undefined) {
        return this.request('POST', path, params, headers, data);
    }
    PUT(path, params, headers = {}, data = undefined) {
        return this.request('PUT', path, params, headers, data);
    }
    DELETE(path, params, headers = {}, data = undefined) {
        return this.request('DELETE', path, params, headers, data);
    }
    fail(response, request) {
        return this.shouldAttemptRequestAgainAfterRefreshing(response, request) || Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["throwError"])(response);
    }
    shouldAttemptRequestAgainAfterRefreshing(response, request) {
        var result = undefined;
        let json = undefined;
        try {
            json = response && (response.error || response.body);
        }
        catch (error) { }
        let error = json && json.error && json.error.message && json.error.message.toLowerCase() || '';
        if (error.indexOf('credentials') >= 0) {
            let subject = new PendingSubject(request);
            result = subject;
            if (!this.pending) {
                this.pending = new Array();
                this.pending.push(subject);
                this.processRefresh();
            }
            else {
                this.pending.push(subject);
            }
        }
        return result;
    }
    processRefresh() {
        let credentials = this.credentials;
        if (!credentials || !credentials.accessToken) {
            this.userLogout();
            this.completeRefresh();
            return;
        }
        if (!!credentials.refreshToken) {
            this.userRefresh(credentials.refreshToken).subscribe(response => {
                this.completeRefresh();
            }, response => {
                this.userLogout();
                this.completeRefresh();
            });
        }
        else {
            this.userLogout();
            this.completeRefresh();
        }
    }
    completeRefresh() {
        let pending = this.pending;
        this.pending = undefined;
        if (!pending) {
            return;
        }
        let credentials = this.credentials;
        for (let subject of pending) {
            if (credentials && credentials.accessToken) {
                let request = subject.request;
                this.request(request.method, request.path, request.params, request.headers, request.data).subscribe(subject);
            }
            else {
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["throwError"])({
                    'statusText': 'Invalid access token.',
                    'status': 401
                }).subscribe(subject);
            }
        }
    }
}
Google.ɵfac = function Google_Factory(t) { return new (t || Google)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"])); };
Google.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: Google, factory: Google.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](Google, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"] }]; }, null); })();


/***/ }),

/***/ "./src/app/_common/video-player/video-player.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/_common/video-player/video-player.component.ts ***!
  \****************************************************************/
/*! exports provided: VideoPlayerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VideoPlayerComponent", function() { return VideoPlayerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _common_safe_html_safe_html_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @common/safe-html/safe-html.pipe */ "./src/app/_common/safe-html/safe-html.pipe.ts");




function VideoPlayerComponent_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "iframe", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "safeResourceUrl");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r183 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, ctx_r183.url), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeResourceUrl"]);
} }
function VideoPlayerComponent_div_1_div_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r185 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r185.error);
} }
function VideoPlayerComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Video Preview Not Available");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, VideoPlayerComponent_div_1_div_3_Template, 2, 1, "div", 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r184 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r184.error);
} }
class VideoPlayerComponent {
}
VideoPlayerComponent.ɵfac = function VideoPlayerComponent_Factory(t) { return new (t || VideoPlayerComponent)(); };
VideoPlayerComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: VideoPlayerComponent, selectors: [["app-video-player"]], inputs: { url: "url", error: "error" }, decls: 2, vars: 2, consts: [[4, "ngIf"], ["class", "placeholder", 4, "ngIf"], ["width", "560", "height", "349", "frameborder", "0", "allowfullscreen", "", 3, "src"], [1, "placeholder"], [1, "header"]], template: function VideoPlayerComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, VideoPlayerComponent_ng_container_0_Template, 3, 3, "ng-container", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, VideoPlayerComponent_div_1_Template, 4, 1, "div", 1);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.url);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.url);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"]], pipes: [_common_safe_html_safe_html_pipe__WEBPACK_IMPORTED_MODULE_2__["SafeResourceUrlPipe"]], styles: ["[_nghost-%COMP%] {\n  position: relative;\n  display: block;\n  background-color: #f5f5f5;\n  height: 0;\n  padding-bottom: calc((9 / 16) * 100%);\n  overflow: hidden;\n}\n\niframe[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\n.placeholder[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL19jb21tb24vdmlkZW8tcGxheWVyL3ZpZGVvLXBsYXllci5jb21wb25lbnQuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fdmFyaWFibGVzLnNjc3MiLCJzcmMvYXBwL19jb21tb24vdmlkZW8tcGxheWVyL3ZpZGVvLXBsYXllci5jb21wb25lbnQuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fbWl4aW5zLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7RUFDSSxrQkFBQTtFQUNBLGNBQUE7RUFDQSx5QkNFaUI7RUREakIsU0FBQTtFQUNBLHFDQUFBO0VBQ0EsZ0JBQUE7QUVGSjs7QUZLQTtFQUNJLGtCQUFBO0VBQW9CLE1BQUE7RUFBUSxPQUFBO0VBQzVCLFdBQUE7RUFDQSxZQUFBO0FFQUo7O0FGR0E7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsUUFBQTtFQUFVLFNBQUE7RUFBVyxPQUFBO0VBQ2pELG9CQUFBO0VBQUEsYUFBQTtFQUNBLDRCQUFBO0VBQUEsNkJBQUE7VUFBQSxzQkFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSx3QkFBQTtVQUFBLHVCQUFBO0FFSUo7O0FGRkk7RUdiQSxlQUFBO0VBQ0EsZ0JBQUE7QURrQkoiLCJmaWxlIjoic3JjL2FwcC9fY29tbW9uL3ZpZGVvLXBsYXllci92aWRlby1wbGF5ZXIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi9zY3NzL3ZhcmlhYmxlcyc7XG5AaW1wb3J0ICcuLi8uLi8uLi9zY3NzL21peGlucyc7XG5cbjpob3N0IHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLWdyYXktbGlnaHRlcjtcbiAgICBoZWlnaHQ6IDA7XG4gICAgcGFkZGluZy1ib3R0b206IGNhbGMoKDkgLyAxNikgKiAxMDAlKTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG5pZnJhbWUge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyBcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5wbGFjZWhvbGRlciB7XG4gICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IHJpZ2h0OiAwOyBib3R0b206IDA7IGxlZnQ6IDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgICAuaGVhZGVyIHtcbiAgICAgICAgQGluY2x1ZGUgdGl0bGUtZm9udCgpO1xuICAgIH1cbn0iLCIvLyBodHRwczovL2NvbG9yaHVudC5jby9wYWxldHRlLzE1NzExOFxuXG4vLyBDb2xvcnNcbiR0aGVtZS13aGl0ZTogI0ZGRkZGRjtcbiR0aGVtZS1ibGFjazogIzMzMzMzMztcbiR0aGVtZS1ncmF5LWRhcms6IHJlZDtcbiR0aGVtZS1ncmF5OiAjOGE4YThhO1xuJHRoZW1lLWdyYXktbGlnaHQ6ICNlNmU2ZTY7XG4kdGhlbWUtZ3JheS1saWdodGVyOiAjZjVmNWY1O1xuJHRoZW1lLWdyYXktbGlnaHRlc3Q6ICNmZGZkZmQ7XG4kdGhlbWUtZ3JheS1ib3JkZXI6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuXG4kdGhlbWUtcHJpbWFyeTogIzMzYmVmZjtcblxuJHRoZW1lLXN1Y2Nlc3M6ICM0MkM3NUQ7XG4kdGhlbWUtZGFuZ2VyOiAjRkEzRTM5O1xuJHRoZW1lLXdhcm5pbmc6ICNGRkMyMDA7XG5cbi8vIEZvbnRzIGFuZCBUZXh0XG4kZm9udC1mYW1pbHk6IHByb3hpbWEtbm92YSwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuXG4kZm9udC1zaXplLXNtYWxsOiAwLjg3NXJlbTtcbiRmb250LXNpemUtbWVkaXVtOiAxcmVtO1xuJGZvbnQtc2l6ZS1sYXJnZTogMS41cmVtO1xuXG4vLyBMYXlvdXRcbiRib3JkZXItcmFkaXVzOiA0cHg7XG4iLCI6aG9zdCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gIGhlaWdodDogMDtcbiAgcGFkZGluZy1ib3R0b206IGNhbGMoKDkgLyAxNikgKiAxMDAlKTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuaWZyYW1lIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5wbGFjZWhvbGRlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cbi5wbGFjZWhvbGRlciAuaGVhZGVyIHtcbiAgZm9udC1zaXplOiAyNHB4O1xuICBmb250LXdlaWdodDogNzAwO1xufSIsIkBpbXBvcnQgXCJ2YXJpYWJsZXNcIjtcblxuQG1peGluIHNoYWRvdygpIHtcbiAgICBib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xufVxuXG5AbWl4aW4gaGVhZGVyLWZvbnQoKSB7XG4gICAgZm9udC1zaXplOiAzMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XG59XG5cbkBtaXhpbiB0aXRsZS1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xufVxuXG5AbWl4aW4gbGFiZWwtZm9udCgpIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGNvbG9yOiAkdGhlbWUtZ3JheTtcbiAgICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](VideoPlayerComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-video-player',
                template: `
        <ng-container *ngIf="url">
        <iframe [src]="url | safeResourceUrl" width="560" height="349" frameborder="0" allowfullscreen></iframe>
        </ng-container>
        <div class="placeholder" *ngIf="!url">
            <div class="header">Video Preview Not Available</div>
            <div *ngIf="error">{{ error }}</div>
        </div>
    `,
                styleUrls: ['./video-player.component.scss'],
            }]
    }], null, { url: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], error: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/_services/app/app.api.ts":
/*!******************************************!*\
  !*** ./src/app/_services/app/app.api.ts ***!
  \******************************************/
/*! exports provided: AppAPI, App */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppAPI", function() { return AppAPI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "App", function() { return App; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");


class AppAPI {
    constructor(auth) {
        this.auth = auth;
    }
    getCurrentUser() {
        return this.auth.GET('/admin/api/1/users', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return App.User.fromJSON(response.body.users[0]);
        }));
    }
    updateUser(user) {
        return this.auth.PUT(`/admin/api/1/users`, {}, {}, user).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["mergeMap"])(response => {
            return this.getCurrentUser();
        }));
    }
    getCurrentOrganization() {
        return this.auth.GET('/admin/api/1/organizations', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.organizations.map(o => App.Organization.fromJSON(o))[0];
        }));
    }
    getOrganizationSubscriptionInfo(organization) {
        return this.auth.GET(`/admin/api/1/organizations/${organization.id}/subscription`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return App.SubscriptionInfo.fromJSON(response.body);
        }));
    }
    updateOrganizationPaymentInfo(organization, source, plan) {
        return this.auth.PUT(`/admin/api/1/organizations/${organization.id}/payment`, {}, {}, { source: source, plan: plan }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return App.SubscriptionInfo.fromJSON(response.body);
        }));
    }
    deleteOrganizationPaymentInfo(organization) {
        return this.auth.DELETE(`/admin/api/1/organizations/${organization.id}/payment`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return App.SubscriptionInfo.fromJSON(response.body);
        }));
    }
    getOrganizationSocialAccounts(organization) {
        return this.auth.GET(`/admin/api/1/organizations/${organization.id}/social`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.map(o => App.SocialAccount.fromJSON(o));
        }));
    }
    setOrganizationSocialAccount(organization, account) {
        return this.auth.POST(`/admin/api/1/organizations/${organization.id}/social`, {}, {}, account).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return App.SocialAccount.fromJSON(response.body);
        }));
    }
    deleteOrganizationSocialAccount(organization, network) {
        return this.auth.DELETE(`/admin/api/1/organizations/${organization.id}/social`, { network: network }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(() => { }));
    }
    updateOrganization(organization) {
        return this.auth.PUT(`/admin/api/1/organizations/${organization.id}`, {}, {}, organization).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["mergeMap"])(response => {
            return this.getCurrentOrganization();
        }));
    }
    uploadImageForOrganization(organization, image, progress = undefined) {
        return this.auth.UPLOAD(`/admin/api/1/organizations/${organization.id}/image`, image, 'image', progress).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(body => {
            return body.organizations.map(o => App.Organization.fromJSON(o))[0];
        }));
    }
    getAllMedia() {
        return this.auth.GET('/admin/api/1/media', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return (response.body.media || []).map(o => App.Media.fromJSON(o));
        }));
    }
    getMedia(id) {
        return this.auth.GET(`/admin/api/1/media/${id}`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.media.map(o => App.Media.fromJSON(o))[0];
        }));
    }
    createMedia() {
        return this.auth.POST('/admin/api/1/media', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.media.map(o => App.Media.fromJSON(o))[0];
        }));
    }
    updateMedia(media) {
        return this.auth.PUT(`/admin/api/1/media/${media.id}`, {}, {}, media).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["mergeMap"])(response => {
            return this.getMedia(media.id);
        }));
    }
    updateMediaStatus(media, status) {
        let data = { status: status };
        if (status === 1) {
            data.youtubeStatus = media.youtubeStatus ? 'queued' : null;
            data.vimeoStatus = null;
            data.audioStatus = null;
        }
        return this.auth.PUT(`/admin/api/1/media/${media.id}`, {}, {}, data).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["mergeMap"])(response => {
            return this.getMedia(media.id);
        }));
    }
    uploadImageForMedia(media, image, progress = undefined) {
        return this.auth.UPLOAD(`/admin/api/1/media/${media.id}/image`, image, 'image', progress).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(body => {
            return body.media.map(o => App.Media.fromJSON(o))[0];
        }));
    }
    setMediaImageToSeries(media, series) {
        return this.auth.PUT(`/admin/api/1/media/${media.id}/image`, { seriesId: `${series.id}` }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.media.map(o => App.Media.fromJSON(o))[0];
        }));
    }
    setMediaImageToOrganization(media, organization) {
        return this.auth.PUT(`/admin/api/1/media/${media.id}/image`, { organizationId: `${organization.id}` }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.media.map(o => App.Media.fromJSON(o))[0];
        }));
    }
    uploadCaptionFileForMedia(media, captions, progress = undefined) {
        return this.auth.UPLOAD(`/admin/api/1/media/${media.id}/captions`, captions, 'captions', progress).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(() => { }));
    }
    ;
    getUploadPolicyForMedia(media, file) {
        return this.auth.GET(`/admin/api/1/media/${media.id}/upload-policy`, { contentType: file.type }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return App.MediaUploadPolicy.fromJSON(response.body);
        }));
    }
    uploadFileForMedia(media, file, progress = undefined) {
        return this.getUploadPolicyForMedia(media, file).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["mergeMap"])(policy => {
            let form = new FormData();
            form.append('key', policy.key);
            form.append('AWSAccessKeyId', policy.accessKeyId);
            form.append('acl', policy.acl);
            form.append('policy', policy.policy);
            form.append('signature', policy.signature);
            form.append('Content-Type', file.type);
            form.append('file', file, file.name);
            let result = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 204) {
                        result.next(xhr.response && JSON.parse(xhr.response) || {});
                        result.complete();
                    }
                    else {
                        result.error(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = $event => {
                let value = ($event.loaded / $event.total);
                progress && progress(value);
            };
            xhr.open('POST', policy.url, true);
            xhr.send(form);
            return result;
        }));
    }
    deleteMedia(media) {
        return this.auth.DELETE(`/admin/api/1/media/${media.id}`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(() => { }));
    }
    getAllSeries() {
        return this.auth.GET('/admin/api/1/series', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return (response.body.series || []).map(o => App.Series.fromJSON(o));
        }));
    }
    getSeries(id) {
        return this.auth.GET(`/admin/api/1/series/${id}`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.series.map(o => App.Series.fromJSON(o))[0];
        }));
    }
    createSeries() {
        return this.auth.POST('/admin/api/1/series', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.series.map(o => App.Series.fromJSON(o))[0];
        }));
    }
    updateSeries(series) {
        return this.auth.PUT(`/admin/api/1/series/${series.id}`, {}, {}, series).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["mergeMap"])(response => {
            return this.getSeries(series.id);
        }));
    }
    uploadImageForSeries(series, image, progress = undefined) {
        return this.auth.UPLOAD(`/admin/api/1/series/${series.id}/image`, image, 'image', progress).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(body => {
            return body.series.map(o => App.Series.fromJSON(o))[0];
        }));
    }
    deleteSeries(series) {
        return this.auth.DELETE(`/admin/api/1/series/${series.id}`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(() => { }));
    }
    getAllSpeakers() {
        return this.auth.GET('/admin/api/1/speakers', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return (response.body.speakers || []).map(o => App.Speaker.fromJSON(o));
        }));
    }
    getSpeaker(id) {
        return this.auth.GET(`/admin/api/1/speakers/${id}`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.speakers.map(o => App.Speaker.fromJSON(o))[0];
        }));
    }
    createSpeaker() {
        return this.auth.POST('/admin/api/1/speakers', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.speakers.map(o => App.Speaker.fromJSON(o))[0];
        }));
    }
    updateSpeaker(speaker) {
        return this.auth.PUT(`/admin/api/1/speakers/${speaker.id}`, {}, {}, speaker).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["mergeMap"])(response => {
            return this.getSpeaker(speaker.id);
        }));
    }
    uploadImageForSpeaker(speaker, image, progress = undefined) {
        return this.auth.UPLOAD(`/admin/api/1/speakers/${speaker.id}/image`, image, 'image', progress).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(body => {
            return body.speakers.map(o => App.Speaker.fromJSON(o))[0];
        }));
    }
    deleteSpeaker(speaker) {
        return this.auth.DELETE(`/admin/api/1/speakers/${speaker.id}`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(() => { }));
    }
    getAllFeeds() {
        return this.auth.GET('/admin/api/1/feeds', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return (response.body.feeds || []).map(o => App.Feed.fromJSON(o));
        }));
    }
    getFeed(id) {
        return this.auth.GET(`/admin/api/1/feeds/${id}`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.feeds.map(o => App.Feed.fromJSON(o))[0];
        }));
    }
    createFeed() {
        return this.auth.POST('/admin/api/1/feeds', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.feeds.map(o => App.Feed.fromJSON(o))[0];
        }));
    }
    updateFeed(feed) {
        return this.auth.PUT(`/admin/api/1/feeds/${feed.id}`, {}, {}, feed).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["mergeMap"])(response => {
            return this.getFeed(feed.id);
        }));
    }
    uploadImageForFeed(feed, image, progress = undefined) {
        return this.auth.UPLOAD(`/admin/api/1/feeds/${feed.id}/image`, image, 'image', progress).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(() => { }));
    }
    deleteFeed(feed) {
        return this.auth.DELETE(`/admin/api/1/feeds/${feed.id}`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(() => { }));
    }
    getMediaIdsForFeed(feed) {
        return this.auth.GET(`/admin/api/1/feeds/${feed.id}/media`, {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return response.body.ids || [];
        }));
    }
    addMediaIdToFeed(feed, id) {
        return this.auth.PUT(`/admin/api/1/feeds/${feed.id}/media`, { id: `${id}` }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(() => { }));
    }
    removeMediaIdFromFeed(feed, id) {
        return this.auth.DELETE(`/admin/api/1/feeds/${feed.id}/media`, { id: `${id}` }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(() => { }));
    }
    getAllTopics() {
        return this.auth.GET('/admin/api/1/topics', {}).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(response => {
            return (response.body.topics || []).map(o => App.Topic.fromJSON(o));
        }));
    }
}
var App;
(function (App) {
    class User {
        static fromJSON(json) {
            let result = new User();
            Object.assign(result, json);
            return result;
        }
    }
    App.User = User;
    class Organization {
        static fromJSON(json) {
            let result = new Organization();
            Object.assign(result, json);
            return result;
        }
    }
    App.Organization = Organization;
    class Media {
        static fromJSON(json) {
            let result = new Media();
            Object.assign(result, json);
            result.date = json.date && new Date(json.date);
            Media.adjustStatusForThirdParties(result);
            return result;
        }
        static adjustStatusForThirdParties(media) {
            if (media.status === 3) {
                var audio = media.audioStatus;
                var vimeo = media.vimeoStatus;
                var youtube = media.youtubeStatus;
                if (media.type === 1) { // audio
                    if (audio !== 'complete') {
                        media.status = 2;
                    }
                    if (audio === 'error') {
                        media.status = 4;
                    }
                }
                else {
                    if (audio !== 'complete' || vimeo !== 'complete' || (youtube && youtube !== 'complete')) {
                        media.status = 2;
                    }
                    if (audio === 'error' || vimeo === 'error' || youtube === 'error') {
                        media.status = 4;
                    }
                }
            }
        }
    }
    App.Media = Media;
    class MediaUploadPolicy {
        static fromJSON(json) {
            let result = new MediaUploadPolicy();
            Object.assign(result, json);
            return result;
        }
    }
    App.MediaUploadPolicy = MediaUploadPolicy;
    class Series {
        static fromJSON(json) {
            let result = new Series();
            Object.assign(result, json);
            return result;
        }
    }
    App.Series = Series;
    class Speaker {
        static fromJSON(json) {
            let result = new Speaker();
            Object.assign(result, json);
            return result;
        }
    }
    App.Speaker = Speaker;
    class Feed {
        constructor() {
            this.mediaIds = [];
        }
        static fromJSON(json) {
            let result = new Feed();
            Object.assign(result, json);
            return result;
        }
    }
    App.Feed = Feed;
    class Topic {
        static fromJSON(json) {
            let result = new Topic();
            Object.assign(result, json);
            return result;
        }
    }
    App.Topic = Topic;
    class SubscriptionInfo {
        static fromJSON(json) {
            var _a;
            let result = new SubscriptionInfo();
            result.account = json.account ? StripeAccount.fromJSON(json.account) : undefined;
            result.subscription = json.subscription ? StripeSubscription.fromJSON(json.subscription) : undefined;
            result.card = json.card ? StripeCard.fromJSON(json.card) : undefined;
            result.plans = ((_a = json.plans) === null || _a === void 0 ? void 0 : _a.length) ? json.plans.map(o => StripePlan.fromJSON(o)) : undefined;
            return result;
        }
    }
    App.SubscriptionInfo = SubscriptionInfo;
    class StripeAccount {
        static fromJSON(json) {
            let result = new StripeAccount();
            Object.assign(result, json);
            return result;
        }
    }
    App.StripeAccount = StripeAccount;
    class StripeCard {
        static fromJSON(json) {
            let result = new StripeCard();
            Object.assign(result, json);
            return result;
        }
    }
    App.StripeCard = StripeCard;
    class StripeSubscription {
        static fromJSON(json) {
            let result = new StripeSubscription();
            Object.assign(result, json);
            return result;
        }
    }
    App.StripeSubscription = StripeSubscription;
    class StripePlan {
        static fromJSON(json) {
            let result = new StripePlan();
            Object.assign(result, json);
            return result;
        }
    }
    App.StripePlan = StripePlan;
    class SocialAccount {
        static fromJSON(json) {
            let result = new SocialAccount();
            Object.assign(result, json);
            return result;
        }
    }
    App.SocialAccount = SocialAccount;
})(App || (App = {}));


/***/ }),

/***/ "./src/app/_services/app/app.service.ts":
/*!**********************************************!*\
  !*** ./src/app/_services/app/app.service.ts ***!
  \**********************************************/
/*! exports provided: AppService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppService", function() { return AppService; });
/* harmony import */ var _app_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.api */ "./src/app/_services/app/app.api.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _managers_user_manager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./managers/user.manager */ "./src/app/_services/app/managers/user.manager.ts");
/* harmony import */ var _managers_series_manager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./managers/series.manager */ "./src/app/_services/app/managers/series.manager.ts");
/* harmony import */ var _managers_speaker_manager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./managers/speaker.manager */ "./src/app/_services/app/managers/speaker.manager.ts");
/* harmony import */ var _managers_feed_manager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./managers/feed.manager */ "./src/app/_services/app/managers/feed.manager.ts");
/* harmony import */ var _managers_topic_manager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./managers/topic.manager */ "./src/app/_services/app/managers/topic.manager.ts");
/* harmony import */ var _managers_organization_manager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./managers/organization.manager */ "./src/app/_services/app/managers/organization.manager.ts");
/* harmony import */ var hashids__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! hashids */ "./node_modules/hashids/dist/hashids.min.js");
/* harmony import */ var hashids__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(hashids__WEBPACK_IMPORTED_MODULE_11__);















class AppService {
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
        this.hashids = new hashids__WEBPACK_IMPORTED_MODULE_11___default.a('ca8b97bb-de3d-4d22-8716-195354fa1e4c', 11);
        this.allManagers = [];
        this.API = new _app_api__WEBPACK_IMPORTED_MODULE_0__["AppAPI"](auth);
        this.userManager = new _managers_user_manager__WEBPACK_IMPORTED_MODULE_5__["UserManager"](this.API);
        this.organizationManager = new _managers_organization_manager__WEBPACK_IMPORTED_MODULE_10__["OrganizationManager"](this.API);
        this.seriesManager = new _managers_series_manager__WEBPACK_IMPORTED_MODULE_6__["SeriesManager"](this.API);
        this.speakerManager = new _managers_speaker_manager__WEBPACK_IMPORTED_MODULE_7__["SpeakerManager"](this.API);
        this.feedManager = new _managers_feed_manager__WEBPACK_IMPORTED_MODULE_8__["FeedManager"](this.API);
        this.topicManager = new _managers_topic_manager__WEBPACK_IMPORTED_MODULE_9__["TopicManager"](this.API);
        this.allManagers = [
            this.userManager,
            this.organizationManager,
            this.seriesManager,
            this.speakerManager,
            this.feedManager,
            this.topicManager
        ];
    }
    start() {
        this.allManagers.forEach(o => o.enabled = true);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["forkJoin"])(...this.allManagers.map(o => o.refresh()));
    }
    stop() {
        this.allManagers.forEach(manager => {
            manager.enabled = false;
            manager.cancel();
            manager.reset();
        });
    }
}
AppService.ɵfac = function AppService_Factory(t) { return new (t || AppService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"])); };
AppService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: AppService, factory: AppService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](AppService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"]
    }], function () { return [{ type: _auth_service__WEBPACK_IMPORTED_MODULE_1__["AuthService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }]; }, null); })();


/***/ }),

/***/ "./src/app/_services/app/managers/feed.manager.ts":
/*!********************************************************!*\
  !*** ./src/app/_services/app/managers/feed.manager.ts ***!
  \********************************************************/
/*! exports provided: FeedManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeedManager", function() { return FeedManager; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _classes_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @classes/manager */ "./src/app/_classes/manager.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");



class FeedManager extends _classes_manager__WEBPACK_IMPORTED_MODULE_1__["Manager"] {
    constructor(api) {
        super();
        this.api = api;
        this.feeds = [];
        FeedManager.sharedInstance = this;
    }
    fetchData() {
        return this.api.getAllFeeds().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["mergeMap"])(feeds => {
            if (!feeds.length) {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])([]);
            }
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["forkJoin"])(feeds.map(feed => {
                return this.api.getMediaIdsForFeed(feed).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(ids => {
                    feed.mediaIds = ids;
                    return feed;
                }));
            }));
        }));
    }
    setData(data) {
        this.feeds = data;
    }
    reset() {
        super.reset();
        this.feeds = [];
    }
}
FeedManager.sharedInstance = undefined;


/***/ }),

/***/ "./src/app/_services/app/managers/organization.manager.ts":
/*!****************************************************************!*\
  !*** ./src/app/_services/app/managers/organization.manager.ts ***!
  \****************************************************************/
/*! exports provided: OrganizationManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrganizationManager", function() { return OrganizationManager; });
/* harmony import */ var _classes_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @classes/manager */ "./src/app/_classes/manager.ts");

class OrganizationManager extends _classes_manager__WEBPACK_IMPORTED_MODULE_0__["Manager"] {
    constructor(api) {
        super();
        this.api = api;
        OrganizationManager.sharedInstance = this;
    }
    fetchData() {
        return this.api.getCurrentOrganization();
    }
    setData(data) {
        this.organization = data;
    }
    reset() {
        super.reset();
        this.organization = undefined;
    }
}
OrganizationManager.sharedInstance = undefined;


/***/ }),

/***/ "./src/app/_services/app/managers/series.manager.ts":
/*!**********************************************************!*\
  !*** ./src/app/_services/app/managers/series.manager.ts ***!
  \**********************************************************/
/*! exports provided: SeriesManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesManager", function() { return SeriesManager; });
/* harmony import */ var _classes_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @classes/manager */ "./src/app/_classes/manager.ts");

class SeriesManager extends _classes_manager__WEBPACK_IMPORTED_MODULE_0__["Manager"] {
    constructor(api) {
        super();
        this.api = api;
        this.series = [];
        SeriesManager.sharedInstance = this;
    }
    fetchData() {
        return this.api.getAllSeries();
    }
    setData(data) {
        this.series = data;
    }
    reset() {
        super.reset();
        this.series = [];
    }
}
SeriesManager.sharedInstance = undefined;


/***/ }),

/***/ "./src/app/_services/app/managers/speaker.manager.ts":
/*!***********************************************************!*\
  !*** ./src/app/_services/app/managers/speaker.manager.ts ***!
  \***********************************************************/
/*! exports provided: SpeakerManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeakerManager", function() { return SpeakerManager; });
/* harmony import */ var _classes_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @classes/manager */ "./src/app/_classes/manager.ts");

class SpeakerManager extends _classes_manager__WEBPACK_IMPORTED_MODULE_0__["Manager"] {
    constructor(api) {
        super();
        this.api = api;
        this.speakers = [];
        SpeakerManager.sharedInstance = this;
    }
    fetchData() {
        return this.api.getAllSpeakers();
    }
    setData(data) {
        this.speakers = data;
    }
    reset() {
        super.reset();
        this.speakers = [];
    }
}
SpeakerManager.sharedInstance = undefined;


/***/ }),

/***/ "./src/app/_services/app/managers/topic.manager.ts":
/*!*********************************************************!*\
  !*** ./src/app/_services/app/managers/topic.manager.ts ***!
  \*********************************************************/
/*! exports provided: TopicManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TopicManager", function() { return TopicManager; });
/* harmony import */ var _classes_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @classes/manager */ "./src/app/_classes/manager.ts");

class TopicManager extends _classes_manager__WEBPACK_IMPORTED_MODULE_0__["Manager"] {
    constructor(api) {
        super();
        this.api = api;
        this.topics = [];
        TopicManager.sharedInstance = this;
    }
    fetchData() {
        return this.api.getAllTopics();
    }
    setData(data) {
        this.topics = data;
    }
    reset() {
        super.reset();
        this.topics = [];
    }
}
TopicManager.sharedInstance = undefined;


/***/ }),

/***/ "./src/app/_services/app/managers/user.manager.ts":
/*!********************************************************!*\
  !*** ./src/app/_services/app/managers/user.manager.ts ***!
  \********************************************************/
/*! exports provided: UserManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserManager", function() { return UserManager; });
/* harmony import */ var _classes_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @classes/manager */ "./src/app/_classes/manager.ts");

const USER_KEY = 'hopestream.user';
class UserManager extends _classes_manager__WEBPACK_IMPORTED_MODULE_0__["Manager"] {
    constructor(api) {
        super();
        this.api = api;
        this._user = undefined;
        UserManager.sharedInstance = this;
        this._user = this.readUserFromLocalStorage();
    }
    get user() { return this._user; }
    set user(user) {
        if (!!user) {
            this.lastRefreshTime = Date.now();
        }
        this._user = user;
        this.writeUserToLocalStorage();
        this.update$.next();
    }
    fetchData() {
        return this.api.getCurrentUser();
    }
    setData(data) {
        this._user = data;
        this.writeUserToLocalStorage();
    }
    reset() {
        super.reset();
        this.user = undefined;
    }
    readUserFromLocalStorage() {
        return JSON.parse(localStorage.getItem(USER_KEY));
    }
    writeUserToLocalStorage() {
        if (!!this.user) {
            localStorage.setItem(USER_KEY, JSON.stringify(this.user));
        }
        else {
            localStorage.removeItem(USER_KEY);
        }
    }
}
UserManager.sharedInstance = undefined;


/***/ }),

/***/ "./src/app/_services/auth-guard.ts":
/*!*****************************************!*\
  !*** ./src/app/_services/auth-guard.ts ***!
  \*****************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _state_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state.service */ "./src/app/_services/state.service.ts");






class AuthGuard {
    constructor(state, router) {
        this.state = state;
        this.router = router;
    }
    canActivate(route, router) {
        return this.state.updateLoggedInState(router.url);
    }
    canActivateChild(route, router) {
        return this.state.updateLoggedInState(router.url);
    }
}
AuthGuard.ɵfac = function AuthGuard_Factory(t) { return new (t || AuthGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_state_service__WEBPACK_IMPORTED_MODULE_2__["StateService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"])); };
AuthGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AuthGuard, factory: AuthGuard.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AuthGuard, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return [{ type: _state_service__WEBPACK_IMPORTED_MODULE_2__["StateService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] }]; }, null); })();


/***/ }),

/***/ "./src/app/_services/auth.service.ts":
/*!*******************************************!*\
  !*** ./src/app/_services/auth.service.ts ***!
  \*******************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");







const OAUTH_CLIENT_ID = 'hopestream-admin';
const OAUTH_CLIENT_SECRET = 'f085c37a-5d21-4eb4-8b73-355c11d2e60d';
const OAUTH_CLIENT_BASE_64 = btoa(`${OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}`);
class PendingSubject extends rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"] {
    constructor(request) {
        super();
        this.request = request;
    }
}
class AuthService {
    constructor(http) {
        this.http = http;
        this.loggedIn$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](false);
        this.CREDENTIALS_KEY = 'hopestream.credentials';
        this.pending = undefined;
        this.loggedIn$.next(!!this.credentials);
    }
    get accessToken() { return this.credentials && this.credentials.accessToken; }
    get credentials() {
        let credentials = localStorage.getItem(this.CREDENTIALS_KEY);
        if (!credentials) {
            return undefined;
        }
        let result = JSON.parse(credentials);
        return result;
    }
    set credentials(credentials) {
        if (!credentials) {
            localStorage.removeItem(this.CREDENTIALS_KEY);
        }
        else {
            localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(credentials));
        }
    }
    userLogin(username, password) {
        return this.oauthToken({
            'grant_type': 'password',
            'scope': 'admin',
            'password': password,
            'username': username,
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(credentials => {
            this.credentials = credentials;
            this.loggedIn$.next(true);
            return true;
        }));
    }
    userLogout() {
        this.credentials = undefined;
        this.loggedIn$.next(false);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(true);
    }
    userRefresh(token) {
        return this.oauthToken({ 'grant_type': 'refresh_token', 'refresh_token': token })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(credentials => {
            this.credentials = credentials;
            this.loggedIn$.next(true);
            return true;
        }));
    }
    userRegister(name, email, password) {
        return this.getClientCredentialsHeaders().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(headers => {
            let data = {
                name: name,
                email: email.toLowerCase(),
                password: password
            };
            return this.POST('/account/register', {}, headers, data);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(response => { }));
    }
    userForgotPassword(email) {
        return this.getClientCredentialsHeaders().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(headers => {
            let data = { email: email };
            return this.POST('/account/reset-password', {}, headers, data);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(() => { }));
    }
    getClientCredentialsHeaders() {
        return this.oauthToken({ 'grant_type': 'client_credentials' })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(credentials => {
            return { 'Authorization': 'Bearer ' + credentials.accessToken };
        }));
    }
    oauthToken(params) {
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + OAUTH_CLIENT_BASE_64
        };
        let data = Object.keys(params).map(o => `${o}=${encodeURIComponent(params[o])}`).join('&');
        return this.POST('/oauth/token', {}, headers, data).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(response => {
            let data = response.body;
            if (!data.access_token) {
                throw 'Invalid access token';
            }
            return { accessToken: data.access_token, refreshToken: data.refresh_token };
        }));
    }
    request(method, path, params_, headers_, data) {
        let headers = Object.assign({}, (headers_ || {}));
        if (!!data && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
        if (!headers['Accept']) {
            headers['Accept'] = 'application/json';
        }
        let responseType = headers['Accept'] === 'application/octet-stream' ? 'blob' : (headers['Accept'] === 'application/json' ? 'json' : 'text');
        let credentials = this.credentials;
        if (credentials && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${credentials.accessToken}`;
        }
        // Workaround https://github.com/angular/angular/issues/11058
        let params = Object.assign({}, (params_ || {}));
        for (let key in params) {
            if (params[key] === undefined) {
                delete params[key];
            }
            else {
                let array = Array.isArray(params[key]) ? params[key] : [params[key]];
                array = array.map(o => {
                    if (!(o instanceof Date) || !o.getTime()) {
                        return o;
                    }
                    return o.toISOString(); // serialize dates in a specific way
                }).filter(o => o !== undefined);
                if (!array.length) {
                    delete params[key];
                }
                else {
                    params[key] = array.length === 1 ? array[0] : array;
                }
            }
        }
        let url = _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].apiUrl + path;
        let subject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.http.request(method, url, {
            body: data,
            headers: headers,
            params: params,
            responseType: responseType,
            observe: 'response',
        }).subscribe(response => {
            subject.next(response);
            subject.complete();
        }, response => {
            this.fail(response, { 'method': method, 'path': path, 'params': params_, 'headers': headers_, 'data': data }).subscribe(subject);
        });
        return subject;
    }
    GET(path, params, headers = {}, data = undefined) {
        return this.request('GET', path, params, headers, data);
    }
    POST(path, params, headers = {}, data = undefined) {
        return this.request('POST', path, params, headers, data);
    }
    PUT(path, params, headers = {}, data = undefined) {
        return this.request('PUT', path, params, headers, data);
    }
    PATCH(path, params, headers = {}, data = undefined) {
        return this.request('PATCH', path, params, headers, data);
    }
    DELETE(path, params, headers = {}, data = undefined) {
        return this.request('DELETE', path, params, headers, data);
    }
    fail(response, request) {
        return this.shouldAttemptRequestAgainAfterRefreshing(response, request) || Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])(response);
    }
    shouldAttemptRequestAgainAfterRefreshing(response, request) {
        var result = undefined;
        let json = undefined;
        try {
            json = response && (response.error || response.body);
        }
        catch (error) { }
        json = json && json.error || json;
        let error = json && typeof json === 'string' && json.toLowerCase() || '';
        if ((error.indexOf('invalid_token') >= 0 || error.indexOf('unauthorized') >= 0)
            && (!request.params.grant_type || request.params.grant_type !== 'refresh_token')) {
            let subject = new PendingSubject(request);
            result = subject;
            if (!this.pending) {
                this.pending = new Array();
                this.pending.push(subject);
                this.processRefresh();
            }
            else {
                this.pending.push(subject);
            }
        }
        return result;
    }
    processRefresh() {
        let credentials = this.credentials;
        if (!credentials || !credentials.accessToken) {
            this.userLogout();
            this.completeRefresh();
            return;
        }
        if (!!credentials.refreshToken) {
            this.userRefresh(credentials.refreshToken)
                .subscribe(response => {
                this.completeRefresh();
            }, response => {
                this.userLogout();
                this.completeRefresh();
            });
        }
        else {
            this.userLogout();
            this.completeRefresh();
        }
    }
    completeRefresh() {
        let pending = this.pending;
        this.pending = undefined;
        if (!pending) {
            return;
        }
        let credentials = this.credentials;
        for (let subject of pending) {
            if (credentials && credentials.accessToken) {
                let request = subject.request;
                this.request(request.method, request.path, request.params, request.headers, request.data).subscribe(subject);
            }
            else {
                console.error('completeRefresh() Invalid access token');
                Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])({
                    'statusText': 'Invalid access token.',
                    'status': 401
                }).subscribe(subject);
            }
        }
    }
    UPLOAD(path, data, name, progress = undefined) {
        let form = new FormData();
        form.append(name, data, name);
        let result = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 204) {
                    result.next(xhr.response && JSON.parse(xhr.response) || {});
                    result.complete();
                }
                else {
                    result.error(xhr.response);
                }
            }
        };
        xhr.upload.onprogress = $event => {
            let value = ($event.loaded / $event.total);
            progress && progress(value);
        };
        xhr.open('POST', _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].apiUrl + path, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.accessToken);
        xhr.send(form);
        return result;
    }
    stripAPIBaseURL(url) {
        return url.replace(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].apiUrl, '');
    }
}
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"])); };
AuthService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AuthService, factory: AuthService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AuthService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"] }]; }, null); })();


/***/ }),

/***/ "./src/app/_services/clipboard.service.ts":
/*!************************************************!*\
  !*** ./src/app/_services/clipboard.service.ts ***!
  \************************************************/
/*! exports provided: ClipboardService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipboardService", function() { return ClipboardService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");



class ClipboardService {
    write(value) {
        this.target.nativeElement.value = value || '';
        this.target.nativeElement.select();
        document.execCommand('copy');
    }
    read() {
        this.target.nativeElement.select();
        document.execCommand('paste');
        let subject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        setTimeout(() => {
            let value = this.target.nativeElement.value;
            subject.next(value);
            subject.complete();
        }, 100);
        return subject;
    }
}
ClipboardService.ɵfac = function ClipboardService_Factory(t) { return new (t || ClipboardService)(); };
ClipboardService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: ClipboardService, factory: ClipboardService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ClipboardService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], null, null); })();


/***/ }),

/***/ "./src/app/_services/download.service.ts":
/*!***********************************************!*\
  !*** ./src/app/_services/download.service.ts ***!
  \***********************************************/
/*! exports provided: DownloadService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DownloadService", function() { return DownloadService; });
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");





class DownloadService {
    constructor(auth) {
        this.auth = auth;
    }
    downloadFileAtPath(path) {
        this.downloadComponent.url = `${_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].apiUrl}${path}?access_token=${this.auth.accessToken}`;
        setTimeout(() => {
            this.downloadComponent.anchor.nativeElement.click();
        }, 200);
    }
}
DownloadService.ɵfac = function DownloadService_Factory(t) { return new (t || DownloadService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_auth_service__WEBPACK_IMPORTED_MODULE_0__["AuthService"])); };
DownloadService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: DownloadService, factory: DownloadService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DownloadService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"]
    }], function () { return [{ type: _auth_service__WEBPACK_IMPORTED_MODULE_0__["AuthService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/_services/layout.service.ts":
/*!*********************************************!*\
  !*** ./src/app/_services/layout.service.ts ***!
  \*********************************************/
/*! exports provided: LayoutService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutService", function() { return LayoutService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


class LayoutService {
    constructor() {
        this.sidebarOpen = true;
        this.toolbarOpen = false;
        this.toolbarWidth = this.storedToolbarWidth;
        this.shortcutsVisible = false;
        this.TOOLBAR_WIDTH_KEY = 'vyasa.toolbar.width';
    }
    persistToolbarWidth() {
        this.storedToolbarWidth = this.toolbarWidth;
    }
    get storedToolbarWidth() {
        let value = localStorage.getItem(this.TOOLBAR_WIDTH_KEY);
        if (!value) {
            return 480;
        }
        return parseInt(value);
    }
    set storedToolbarWidth(value) {
        if (!value) {
            localStorage.removeItem(this.TOOLBAR_WIDTH_KEY);
        }
        else {
            localStorage.setItem(this.TOOLBAR_WIDTH_KEY, `${value}`);
        }
    }
}
LayoutService.ɵfac = function LayoutService_Factory(t) { return new (t || LayoutService)(); };
LayoutService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: LayoutService, factory: LayoutService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LayoutService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], null, null); })();


/***/ }),

/***/ "./src/app/_services/loading-guard.ts":
/*!********************************************!*\
  !*** ./src/app/_services/loading-guard.ts ***!
  \********************************************/
/*! exports provided: LoadingGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadingGuard", function() { return LoadingGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _state_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state.service */ "./src/app/_services/state.service.ts");






class LoadingGuard {
    constructor(state) {
        this.state = state;
    }
    canActivate() {
        if (!this.state.loading$.getValue()) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(true);
        }
        let subject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        let subscription = this.state.loading$.subscribe(value => {
            if (!value) {
                subject.next(true);
                subject.complete();
                subscription.unsubscribe();
            }
        });
        return subject;
    }
}
LoadingGuard.ɵfac = function LoadingGuard_Factory(t) { return new (t || LoadingGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_state_service__WEBPACK_IMPORTED_MODULE_2__["StateService"])); };
LoadingGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: LoadingGuard, factory: LoadingGuard.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LoadingGuard, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return [{ type: _state_service__WEBPACK_IMPORTED_MODULE_2__["StateService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/_services/state.service.ts":
/*!********************************************!*\
  !*** ./src/app/_services/state.service.ts ***!
  \********************************************/
/*! exports provided: StateService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateService", function() { return StateService; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _classes_async_data_source__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @classes/async-data-source */ "./src/app/_classes/async-data-source.ts");
/* harmony import */ var _classes_history__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @classes/history */ "./src/app/_classes/history.ts");
/* harmony import */ var angulartics2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! angulartics2 */ "./node_modules/angulartics2/__ivy_ngcc__/fesm2015/angulartics2.js");
/* harmony import */ var angulartics2_gst__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! angulartics2/gst */ "./node_modules/angulartics2/__ivy_ngcc__/gst/fesm2015/angulartics2-gst.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @environments/environment */ "./src/environments/environment.ts");















class StateService {
    constructor(app, router, angulartics, google) {
        this.app = app;
        this.router = router;
        this.angulartics = angulartics;
        this.google = google;
        this.loading$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](true);
        this.initialRouteLoaded = false;
        this.dataSource = undefined;
        this.ignoreDataSourceUpdate = false;
        this.angulartics.settings.developerMode = !_environments_environment__WEBPACK_IMPORTED_MODULE_9__["environment"].production;
        // this.google.startTracking();
        this.history = new _classes_history__WEBPACK_IMPORTED_MODULE_6__["History"](router);
        this.app.userManager.update$.subscribe(() => {
            this.updateLoggedInState();
        });
        this.app.auth.loggedIn$.subscribe(loggedIn => {
            this.updateLoggedInState();
        });
        this.router.events.subscribe(event => {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_0__["NavigationEnd"] || event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_0__["NavigationCancel"]) {
                this.redirecting = undefined;
            }
        });
    }
    ngOnDestroy() {
        this.history.shutdown();
    }
    login(usernameOrEmail, password) {
        return this.app.auth.userLogin(usernameOrEmail, password).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])((response) => {
            return this.app.API.getCurrentUser();
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])((user) => {
            this.app.userManager.user = user;
            return user;
        }));
    }
    logout() {
        this.history.shutdown();
        this.app.auth.userLogout();
    }
    isLoggedIn() {
        return this.loggedIn;
    }
    updateLoggedInState(url = undefined) {
        if (url) {
            this.initialRouteLoaded = true;
        }
        this.loggedIn = !!this.app.userManager.user && this.app.auth.loggedIn$.value;
        this.updateDataSource();
        return this.updateVisibleView(url || this.router.url);
    }
    updateVisibleView(url) {
        if (!this.initialRouteLoaded) {
            return true;
        }
        if (this.redirecting) {
            return url === this.redirecting;
        }
        let noauth = ['/sign-in', '/forgot-password'];
        let state = noauth.find(o => url.indexOf(o) === 0) ? 'noauth' : 'auth';
        let redirect = undefined;
        if (this.loggedIn && state === 'noauth') {
            redirect = this.routeToLoadUponAuthenticating || '/media';
            this.routeToLoadUponAuthenticating = undefined;
        }
        else if (!this.loggedIn && state === 'auth') {
            redirect = '/sign-in';
            this.routeToLoadUponAuthenticating = url;
        }
        if (redirect) {
            this.redirecting = redirect;
            let parts = redirect.split('?');
            let queryParams = {};
            if (parts.length > 1) {
                let params = parts[1].split('&');
                params.forEach(o => {
                    let parts = o.split('=');
                    queryParams[parts[0]] = parts[1];
                });
            }
            this.router.navigate([parts[0]], { queryParams });
            return false;
        }
        return true;
    }
    updateDataSource() {
        if (this.ignoreDataSourceUpdate) {
            return;
        }
        if (this.loggedIn && !this.dataSource) {
            // the user is newly logged in.  fetch all the local data needed to
            // run the application.
            this.loading$.next(true);
            this.dataSource = new _classes_async_data_source__WEBPACK_IMPORTED_MODULE_5__["AsyncDataSource"](() => {
                return this.app.start();
            });
            this.dataSource.callback = (result) => {
                if (result) {
                    let user = this.app.userManager.user;
                    // let instance = window.location.hostname.split('.').shift() || 'unknown';
                    // let key = `${instance}_${user.id}`;
                    // this.angulartics.setUsername.next(key);
                    // Sentry.setUser({ id: key, email: user.email, username: key });
                    this.loading$.next(false);
                }
                else {
                    this.logout();
                }
            };
            this.dataSource.processor.maxRetryCount = 3;
            this.dataSource.refresh();
        }
        else if (!this.loggedIn) {
            // the user is newly logged out.  kill all local data and stop
            // refreshing until the user logs in again.
            if (this.dataSource || this.loading$.getValue()) {
                this.ignoreDataSourceUpdate = true;
                // this.angulartics.setUsername.next(undefined);
                // Sentry.configureScope(scope => scope.clear());
                this.app.stop();
                this.ignoreDataSourceUpdate = false;
            }
            if (this.dataSource) {
                this.dataSource.callback = undefined;
                this.dataSource.cancel();
                this.dataSource = undefined;
            }
            if (this.loading$.getValue()) {
                this.loading$.next(false);
            }
        }
    }
}
StateService.ɵfac = function StateService_Factory(t) { return new (t || StateService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_0__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](angulartics2__WEBPACK_IMPORTED_MODULE_7__["Angulartics2"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](angulartics2_gst__WEBPACK_IMPORTED_MODULE_8__["Angulartics2GoogleGlobalSiteTag"])); };
StateService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: StateService, factory: StateService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](StateService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"]
    }], function () { return [{ type: _app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_0__["Router"] }, { type: angulartics2__WEBPACK_IMPORTED_MODULE_7__["Angulartics2"] }, { type: angulartics2_gst__WEBPACK_IMPORTED_MODULE_8__["Angulartics2GoogleGlobalSiteTag"] }]; }, null); })();


/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_state_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/state.service */ "./src/app/_services/state.service.ts");
/* harmony import */ var _services_clipboard_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @services/clipboard.service */ "./src/app/_services/clipboard.service.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _common_download_download_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @common/download/download.component */ "./src/app/_common/download/download.component.ts");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @common/loading-indicator/loading-indicator.component */ "./src/app/_common/loading-indicator/loading-indicator.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");












const _c0 = ["clipboardTarget"];
function AppComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "app-loading-indicator");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function AppComponent_router_outlet_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
} }
class AppComponent {
    constructor(state, clipboard) {
        this.state = state;
        this.clipboard = clipboard;
        this.loading = true;
        this.notificationsOptions = {
            position: ['bottom', 'right'],
            pauseOnHover: true,
            timeOut: 15000,
        };
    }
    ngOnInit() {
        Stripe.setPublishableKey(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].stripeApiKey);
        this.state.loading$.subscribe(value => {
            this.loading = value;
        });
        this.clipboard.target = this.clipboardTarget;
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_state_service__WEBPACK_IMPORTED_MODULE_1__["StateService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_clipboard_service__WEBPACK_IMPORTED_MODULE_2__["ClipboardService"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], viewQuery: function AppComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.clipboardTarget = _t.first);
    } }, decls: 7, vars: 3, consts: [["type", "text", 2, "position", "fixed", "top", "-100px"], ["clipboardTarget", ""], [3, "options"], ["class", "loading-overlay", 4, "ngIf"], [4, "ngIf"], [1, "loading-overlay"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "textarea", 0, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "app-download");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "simple-notifications", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, AppComponent_div_5_Template, 2, 0, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, AppComponent_router_outlet_6_Template, 1, 0, "router-outlet", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", ctx.notificationsOptions);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loading);
    } }, directives: [_common_download_download_component__WEBPACK_IMPORTED_MODULE_4__["DownloadComponent"], angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["SimpleNotificationsComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_7__["LoadingIndicatorComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_8__["RouterOutlet"]], styles: [".loading-overlay[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center;\n  height: 100vh;\n  -webkit-box-align: center;\n          align-items: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtFQUNBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDQ0oiLCJmaWxlIjoic3JjL2FwcC9hcHAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubG9hZGluZy1vdmVybGF5IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbiIsIi5sb2FkaW5nLW92ZXJsYXkge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn0iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.scss']
            }]
    }], function () { return [{ type: _services_state_service__WEBPACK_IMPORTED_MODULE_1__["StateService"] }, { type: _services_clipboard_service__WEBPACK_IMPORTED_MODULE_2__["ClipboardService"] }]; }, { clipboardTarget: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['clipboardTarget', { static: true }]
        }] }); })();


/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: getErrorHandler, AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getErrorHandler", function() { return getErrorHandler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var angulartics2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angulartics2 */ "./node_modules/angulartics2/__ivy_ngcc__/fesm2015/angulartics2.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/animations.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./routing.module */ "./src/app/routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _base_base_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./base/base.component */ "./src/app/base/base.component.ts");
/* harmony import */ var _sign_in_sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./sign-in/sign-in/sign-in.component */ "./src/app/sign-in/sign-in/sign-in.component.ts");
/* harmony import */ var _common_download_download_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @common/download/download.component */ "./src/app/_common/download/download.component.ts");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _services_auth_guard__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @services/auth-guard */ "./src/app/_services/auth-guard.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _services_download_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @services/download.service */ "./src/app/_services/download.service.ts");
/* harmony import */ var _services_loading_guard__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @services/loading-guard */ "./src/app/_services/loading-guard.ts");
/* harmony import */ var _services_state_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @services/state.service */ "./src/app/_services/state.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var _common_set_title_set_title_directive__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @common/set-title/set-title.directive */ "./src/app/_common/set-title/set-title.directive.ts");
/* harmony import */ var primeng_progressspinner__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! primeng/progressspinner */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-progressspinner.js");
/* harmony import */ var _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @common/loading-indicator/loading-indicator.component */ "./src/app/_common/loading-indicator/loading-indicator.component.ts");
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! primeng/dialog */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-dialog.js");
/* harmony import */ var _common_popover_popover_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @common/popover/popover.component */ "./src/app/_common/popover/popover.component.ts");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");
/* harmony import */ var _common_inline_svg_inline_svg_directive__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @common/inline-svg/inline-svg.directive */ "./src/app/_common/inline-svg/inline-svg.directive.ts");
/* harmony import */ var _common_guarded_action_guarded_action_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @common/guarded-action/guarded-action.component */ "./src/app/_common/guarded-action/guarded-action.component.ts");
/* harmony import */ var _common_safe_html_safe_html_pipe__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @common/safe-html/safe-html.pipe */ "./src/app/_common/safe-html/safe-html.pipe.ts");
/* harmony import */ var _services_clipboard_service__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @services/clipboard.service */ "./src/app/_services/clipboard.service.ts");
/* harmony import */ var _common_autofocus_autofocus_directive__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @common/autofocus/autofocus.directive */ "./src/app/_common/autofocus/autofocus.directive.ts");
/* harmony import */ var _common_icon_icon_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @common/icon/icon.component */ "./src/app/_common/icon/icon.component.ts");
/* harmony import */ var _common_form_error_form_error_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @common/form-error/form-error.component */ "./src/app/_common/form-error/form-error.component.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
/* harmony import */ var _services_layout_service__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @services/layout.service */ "./src/app/_services/layout.service.ts");
/* harmony import */ var _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./sidebar/sidebar.component */ "./src/app/sidebar/sidebar.component.ts");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./header/header.component */ "./src/app/header/header.component.ts");
/* harmony import */ var _media_media_list_media_list_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./media/media-list/media-list.component */ "./src/app/media/media-list/media-list.component.ts");
/* harmony import */ var ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ngx-infinite-scroll */ "./node_modules/ngx-infinite-scroll/__ivy_ngcc__/modules/ngx-infinite-scroll.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
/* harmony import */ var _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @fortawesome/pro-duotone-svg-icons */ "./node_modules/@fortawesome/pro-duotone-svg-icons/index.es.js");
/* harmony import */ var _media_media_detail_media_detail_component__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./media/media-detail/media-detail.component */ "./src/app/media/media-detail/media-detail.component.ts");
/* harmony import */ var primeng_calendar__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! primeng/calendar */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-calendar.js");
/* harmony import */ var _common_selection_box_selection_box_component__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! @common/selection-box/selection-box.component */ "./src/app/_common/selection-box/selection-box.component.ts");
/* harmony import */ var _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! @common/copy-box/copy-box.component */ "./src/app/_common/copy-box/copy-box.component.ts");
/* harmony import */ var _common_video_player_video_player_component__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! @common/video-player/video-player.component */ "./src/app/_common/video-player/video-player.component.ts");
/* harmony import */ var _organization_organization_detail_organization_detail_component__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./organization/organization-detail/organization-detail.component */ "./src/app/organization/organization-detail/organization-detail.component.ts");
/* harmony import */ var _series_series_list_series_list_component__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./series/series-list/series-list.component */ "./src/app/series/series-list/series-list.component.ts");
/* harmony import */ var _series_series_detail_series_detail_component__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./series/series-detail/series-detail.component */ "./src/app/series/series-detail/series-detail.component.ts");
/* harmony import */ var _media_reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./media/reusable-media-list/reusable-media-list.component */ "./src/app/media/reusable-media-list/reusable-media-list.component.ts");
/* harmony import */ var _speaker_speaker_list_speaker_list_component__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./speaker/speaker-list/speaker-list.component */ "./src/app/speaker/speaker-list/speaker-list.component.ts");
/* harmony import */ var _speaker_speaker_detail_speaker_detail_component__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./speaker/speaker-detail/speaker-detail.component */ "./src/app/speaker/speaker-detail/speaker-detail.component.ts");
/* harmony import */ var _feed_feed_list_feed_list_component__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./feed/feed-list/feed-list.component */ "./src/app/feed/feed-list/feed-list.component.ts");
/* harmony import */ var _feed_feed_detail_feed_detail_component__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./feed/feed-detail/feed-detail.component */ "./src/app/feed/feed-detail/feed-detail.component.ts");
/* harmony import */ var _media_media_upload_media_upload_component__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./media/media-upload/media-upload.component */ "./src/app/media/media-upload/media-upload.component.ts");
/* harmony import */ var ngx_dropzone__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ngx-dropzone */ "./node_modules/ngx-dropzone/__ivy_ngcc__/fesm2015/ngx-dropzone.js");
/* harmony import */ var _media_media_form_media_form_component__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ./media/media-form/media-form.component */ "./src/app/media/media-form/media-form.component.ts");
/* harmony import */ var _common_redirect_redirect_component__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! @common/redirect/redirect.component */ "./src/app/_common/redirect/redirect.component.ts");
/* harmony import */ var _settings_settings_component__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ./settings/settings.component */ "./src/app/settings/settings.component.ts");
/* harmony import */ var _common_blank_blank_component__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! @common/blank/blank.component */ "./src/app/_common/blank/blank.component.ts");





























































// @Injectable()
// export class SentryErrorHandler implements ErrorHandler {
//     constructor() {
//         Sentry.init({ dsn: 'https://e159fa9ce33548c0aef9ac28c37ace12@sentry.io/1803587', release: environment.version });
//     }
//     handleError(error) {
//         Sentry.captureException(error.originalError || error);
//     }
// }
let providers = [
    _services_app_app_service__WEBPACK_IMPORTED_MODULE_9__["AppService"],
    _services_auth_guard__WEBPACK_IMPORTED_MODULE_10__["AuthGuard"],
    _services_auth_service__WEBPACK_IMPORTED_MODULE_11__["AuthService"],
    _services_clipboard_service__WEBPACK_IMPORTED_MODULE_26__["ClipboardService"],
    _services_download_service__WEBPACK_IMPORTED_MODULE_12__["DownloadService"],
    _services_loading_guard__WEBPACK_IMPORTED_MODULE_13__["LoadingGuard"],
    _services_state_service__WEBPACK_IMPORTED_MODULE_14__["StateService"],
    _services_layout_service__WEBPACK_IMPORTED_MODULE_31__["LayoutService"],
    { provide: _angular_core__WEBPACK_IMPORTED_MODULE_3__["ErrorHandler"], useFactory: getErrorHandler }
];
function getErrorHandler() {
    // if (environment.production) {
    //     return new SentryErrorHandler()
    // }
    return new _angular_core__WEBPACK_IMPORTED_MODULE_3__["ErrorHandler"]();
}
class AppModule {
    constructor(library) {
        library.addIcons(_fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faCheckCircle"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faChevronDown"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faChevronLeft"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faClipboard"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faCloudUpload"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faCog"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faExclamationCircle"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faExclamationTriangle"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faInfoCircle"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faSignOut"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faSort"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faSortDown"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faSortUp"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faTimes"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faTimesCircle"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faTrash"], _fortawesome_pro_duotone_svg_icons__WEBPACK_IMPORTED_MODULE_37__["faQuestionCircle"]);
    }
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_36__["FaIconLibrary"])); }, providers: providers, imports: [[
            angulartics2__WEBPACK_IMPORTED_MODULE_0__["Angulartics2Module"].forRoot(),
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__["BrowserAnimationsModule"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
            primeng_calendar__WEBPACK_IMPORTED_MODULE_39__["CalendarModule"],
            primeng_dialog__WEBPACK_IMPORTED_MODULE_20__["DialogModule"],
            _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_36__["FontAwesomeModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_15__["FormsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_30__["HttpClientJsonpModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_30__["HttpClientModule"],
            ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_35__["InfiniteScrollModule"],
            ngx_dropzone__WEBPACK_IMPORTED_MODULE_52__["NgxDropzoneModule"],
            primeng_progressspinner__WEBPACK_IMPORTED_MODULE_18__["ProgressSpinnerModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_15__["ReactiveFormsModule"],
            _routing_module__WEBPACK_IMPORTED_MODULE_4__["RoutingModule"],
            angular2_notifications__WEBPACK_IMPORTED_MODULE_16__["SimpleNotificationsModule"].forRoot(),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_22__["ActionIconComponent"],
        _app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"],
        _base_base_component__WEBPACK_IMPORTED_MODULE_6__["BaseComponent"],
        _common_download_download_component__WEBPACK_IMPORTED_MODULE_8__["DownloadComponent"],
        _common_guarded_action_guarded_action_component__WEBPACK_IMPORTED_MODULE_24__["GuardedActionComponent"],
        _common_inline_svg_inline_svg_directive__WEBPACK_IMPORTED_MODULE_23__["InlineSVGDirective"],
        _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_19__["LoadingIndicatorComponent"],
        _common_popover_popover_component__WEBPACK_IMPORTED_MODULE_21__["PopoverComponent"],
        _common_safe_html_safe_html_pipe__WEBPACK_IMPORTED_MODULE_25__["SafeHtmlPipe"],
        _common_safe_html_safe_html_pipe__WEBPACK_IMPORTED_MODULE_25__["SafeResourceUrlPipe"],
        _common_set_title_set_title_directive__WEBPACK_IMPORTED_MODULE_17__["SetTitleDirective"],
        _sign_in_sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_7__["SignInComponent"],
        _common_autofocus_autofocus_directive__WEBPACK_IMPORTED_MODULE_27__["AutofocusDirective"],
        _common_icon_icon_component__WEBPACK_IMPORTED_MODULE_28__["IconComponent"],
        _common_form_error_form_error_component__WEBPACK_IMPORTED_MODULE_29__["FormErrorComponent"],
        _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_32__["SidebarComponent"],
        _header_header_component__WEBPACK_IMPORTED_MODULE_33__["HeaderComponent"],
        _media_media_list_media_list_component__WEBPACK_IMPORTED_MODULE_34__["MediaListComponent"],
        _media_media_detail_media_detail_component__WEBPACK_IMPORTED_MODULE_38__["MediaDetailComponent"],
        _common_selection_box_selection_box_component__WEBPACK_IMPORTED_MODULE_40__["SelectionBoxComponent"],
        _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_41__["CopyBoxComponent"],
        _common_video_player_video_player_component__WEBPACK_IMPORTED_MODULE_42__["VideoPlayerComponent"],
        _organization_organization_detail_organization_detail_component__WEBPACK_IMPORTED_MODULE_43__["OrganizationDetailComponent"],
        _series_series_list_series_list_component__WEBPACK_IMPORTED_MODULE_44__["SeriesListComponent"],
        _series_series_detail_series_detail_component__WEBPACK_IMPORTED_MODULE_45__["SeriesDetailComponent"],
        _media_reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_46__["ReusableMediaListComponent"],
        _speaker_speaker_list_speaker_list_component__WEBPACK_IMPORTED_MODULE_47__["SpeakerListComponent"],
        _speaker_speaker_detail_speaker_detail_component__WEBPACK_IMPORTED_MODULE_48__["SpeakerDetailComponent"],
        _feed_feed_list_feed_list_component__WEBPACK_IMPORTED_MODULE_49__["FeedListComponent"],
        _feed_feed_detail_feed_detail_component__WEBPACK_IMPORTED_MODULE_50__["FeedDetailComponent"],
        _media_media_upload_media_upload_component__WEBPACK_IMPORTED_MODULE_51__["MediaUploadComponent"],
        _media_media_form_media_form_component__WEBPACK_IMPORTED_MODULE_53__["MediaFormComponent"],
        _common_redirect_redirect_component__WEBPACK_IMPORTED_MODULE_54__["RedirectComponent"],
        _settings_settings_component__WEBPACK_IMPORTED_MODULE_55__["SettingsComponent"],
        _common_blank_blank_component__WEBPACK_IMPORTED_MODULE_56__["BlankComponent"]], imports: [angulartics2__WEBPACK_IMPORTED_MODULE_0__["Angulartics2Module"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__["BrowserAnimationsModule"],
        _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
        primeng_calendar__WEBPACK_IMPORTED_MODULE_39__["CalendarModule"],
        primeng_dialog__WEBPACK_IMPORTED_MODULE_20__["DialogModule"],
        _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_36__["FontAwesomeModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_15__["FormsModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_30__["HttpClientJsonpModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_30__["HttpClientModule"],
        ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_35__["InfiniteScrollModule"],
        ngx_dropzone__WEBPACK_IMPORTED_MODULE_52__["NgxDropzoneModule"],
        primeng_progressspinner__WEBPACK_IMPORTED_MODULE_18__["ProgressSpinnerModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_15__["ReactiveFormsModule"],
        _routing_module__WEBPACK_IMPORTED_MODULE_4__["RoutingModule"], angular2_notifications__WEBPACK_IMPORTED_MODULE_16__["SimpleNotificationsModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"],
        args: [{
                declarations: [
                    _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_22__["ActionIconComponent"],
                    _app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"],
                    _base_base_component__WEBPACK_IMPORTED_MODULE_6__["BaseComponent"],
                    _common_download_download_component__WEBPACK_IMPORTED_MODULE_8__["DownloadComponent"],
                    _common_guarded_action_guarded_action_component__WEBPACK_IMPORTED_MODULE_24__["GuardedActionComponent"],
                    _common_inline_svg_inline_svg_directive__WEBPACK_IMPORTED_MODULE_23__["InlineSVGDirective"],
                    _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_19__["LoadingIndicatorComponent"],
                    _common_popover_popover_component__WEBPACK_IMPORTED_MODULE_21__["PopoverComponent"],
                    _common_safe_html_safe_html_pipe__WEBPACK_IMPORTED_MODULE_25__["SafeHtmlPipe"],
                    _common_safe_html_safe_html_pipe__WEBPACK_IMPORTED_MODULE_25__["SafeResourceUrlPipe"],
                    _common_set_title_set_title_directive__WEBPACK_IMPORTED_MODULE_17__["SetTitleDirective"],
                    _sign_in_sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_7__["SignInComponent"],
                    _common_autofocus_autofocus_directive__WEBPACK_IMPORTED_MODULE_27__["AutofocusDirective"],
                    _common_icon_icon_component__WEBPACK_IMPORTED_MODULE_28__["IconComponent"],
                    _common_form_error_form_error_component__WEBPACK_IMPORTED_MODULE_29__["FormErrorComponent"],
                    _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_32__["SidebarComponent"],
                    _header_header_component__WEBPACK_IMPORTED_MODULE_33__["HeaderComponent"],
                    _media_media_list_media_list_component__WEBPACK_IMPORTED_MODULE_34__["MediaListComponent"],
                    _media_media_detail_media_detail_component__WEBPACK_IMPORTED_MODULE_38__["MediaDetailComponent"],
                    _common_selection_box_selection_box_component__WEBPACK_IMPORTED_MODULE_40__["SelectionBoxComponent"],
                    _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_41__["CopyBoxComponent"],
                    _common_video_player_video_player_component__WEBPACK_IMPORTED_MODULE_42__["VideoPlayerComponent"],
                    _organization_organization_detail_organization_detail_component__WEBPACK_IMPORTED_MODULE_43__["OrganizationDetailComponent"],
                    _series_series_list_series_list_component__WEBPACK_IMPORTED_MODULE_44__["SeriesListComponent"],
                    _series_series_detail_series_detail_component__WEBPACK_IMPORTED_MODULE_45__["SeriesDetailComponent"],
                    _media_reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_46__["ReusableMediaListComponent"],
                    _speaker_speaker_list_speaker_list_component__WEBPACK_IMPORTED_MODULE_47__["SpeakerListComponent"],
                    _speaker_speaker_detail_speaker_detail_component__WEBPACK_IMPORTED_MODULE_48__["SpeakerDetailComponent"],
                    _feed_feed_list_feed_list_component__WEBPACK_IMPORTED_MODULE_49__["FeedListComponent"],
                    _feed_feed_detail_feed_detail_component__WEBPACK_IMPORTED_MODULE_50__["FeedDetailComponent"],
                    _media_media_upload_media_upload_component__WEBPACK_IMPORTED_MODULE_51__["MediaUploadComponent"],
                    _media_media_form_media_form_component__WEBPACK_IMPORTED_MODULE_53__["MediaFormComponent"],
                    _common_redirect_redirect_component__WEBPACK_IMPORTED_MODULE_54__["RedirectComponent"],
                    _settings_settings_component__WEBPACK_IMPORTED_MODULE_55__["SettingsComponent"],
                    _common_blank_blank_component__WEBPACK_IMPORTED_MODULE_56__["BlankComponent"],
                ],
                imports: [
                    angulartics2__WEBPACK_IMPORTED_MODULE_0__["Angulartics2Module"].forRoot(),
                    _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__["BrowserAnimationsModule"],
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                    primeng_calendar__WEBPACK_IMPORTED_MODULE_39__["CalendarModule"],
                    primeng_dialog__WEBPACK_IMPORTED_MODULE_20__["DialogModule"],
                    _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_36__["FontAwesomeModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_15__["FormsModule"],
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_30__["HttpClientJsonpModule"],
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_30__["HttpClientModule"],
                    ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_35__["InfiniteScrollModule"],
                    ngx_dropzone__WEBPACK_IMPORTED_MODULE_52__["NgxDropzoneModule"],
                    primeng_progressspinner__WEBPACK_IMPORTED_MODULE_18__["ProgressSpinnerModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_15__["ReactiveFormsModule"],
                    _routing_module__WEBPACK_IMPORTED_MODULE_4__["RoutingModule"],
                    angular2_notifications__WEBPACK_IMPORTED_MODULE_16__["SimpleNotificationsModule"].forRoot(),
                ],
                providers: providers,
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]]
            }]
    }], function () { return [{ type: _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_36__["FaIconLibrary"] }]; }, null); })();


/***/ }),

/***/ "./src/app/base/base.component.ts":
/*!****************************************!*\
  !*** ./src/app/base/base.component.ts ***!
  \****************************************/
/*! exports provided: BaseComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseComponent", function() { return BaseComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_state_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/state.service */ "./src/app/_services/state.service.ts");
/* harmony import */ var _services_layout_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @services/layout.service */ "./src/app/_services/layout.service.ts");
/* harmony import */ var _services_app_managers_user_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @services/app/managers/user.manager */ "./src/app/_services/app/managers/user.manager.ts");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../header/header.component */ "./src/app/header/header.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");









class BaseComponent {
    constructor(state, layout) {
        this.state = state;
        this.layout = layout;
    }
    ngOnInit() {
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    get user() {
        return _services_app_managers_user_manager__WEBPACK_IMPORTED_MODULE_3__["UserManager"].sharedInstance.user;
    }
}
BaseComponent.ɵfac = function BaseComponent_Factory(t) { return new (t || BaseComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_state_service__WEBPACK_IMPORTED_MODULE_1__["StateService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_layout_service__WEBPACK_IMPORTED_MODULE_2__["LayoutService"])); };
BaseComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: BaseComponent, selectors: [["app-base"]], decls: 6, vars: 2, consts: [[1, "center-container"], [1, "top-container"], [1, "bottom-container"], [1, "content-container"]], template: function BaseComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "app-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("sidebar-closed", !ctx.layout.sidebarOpen);
    } }, directives: [_header_header_component__WEBPACK_IMPORTED_MODULE_4__["HeaderComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterOutlet"]], styles: ["[_nghost-%COMP%] {\n  width: 100%;\n  min-width: 100%;\n  max-width: 100%;\n  height: 100vh;\n  min-height: 100vh;\n  max-height: 100vh;\n  background-color: #fdfdfd;\n  display: -webkit-box;\n  display: flex;\n  overflow: hidden;\n}\n\n.center-container[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n}\n\n.top-container[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.bottom-container[_ngcontent-%COMP%] {\n  position: relative;\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  background-color: #fdfdfd;\n  padding: 24px 24px 24px 24px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  -webkit-transition: margin-left 0.25s ease-out;\n  transition: margin-left 0.25s ease-out;\n}\n\n.content-container[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto;\n  overflow: hidden;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL2Jhc2UvYmFzZS5jb21wb25lbnQuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fdmFyaWFibGVzLnNjc3MiLCJzcmMvYXBwL2Jhc2UvYmFzZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTtFQUNJLFdBQUE7RUFDQSxlQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGlCQUFBO0VBQ0EseUJDRGtCO0VER2xCLG9CQUFBO0VBQUEsYUFBQTtFQUNBLGdCQUFBO0FFSEo7O0FGTUE7RUFDSSxtQkFBQTtVQUFBLGNBQUE7RUFDQSxvQkFBQTtFQUFBLGFBQUE7RUFDQSw0QkFBQTtFQUFBLDZCQUFBO1VBQUEsc0JBQUE7QUVISjs7QUZNQTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7QUVISjs7QUZNQTtFQUNJLGtCQUFBO0VBQ0EsbUJBQUE7VUFBQSxjQUFBO0VBQ0EseUJDdEJrQjtFRHVCbEIsNEJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsOENBQUE7RUFBQSxzQ0FBQTtBRUhKOztBRk1BO0VBQ0ksZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsZ0JBQUE7QUVISiIsImZpbGUiOiJzcmMvYXBwL2Jhc2UvYmFzZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uL3Njc3MvdmFyaWFibGVzJztcbkBpbXBvcnQgJy4uLy4uL3Njc3MvbWl4aW5zJztcblxuOmhvc3Qge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1pbi13aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgICBtYXgtaGVpZ2h0OiAxMDB2aDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVzdDtcblxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLmNlbnRlci1jb250YWluZXIge1xuICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxuLnRvcC1jb250YWluZXIge1xuICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLmJvdHRvbS1jb250YWluZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBmbGV4OiAxIDEgYXV0bztcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVzdDtcbiAgICBwYWRkaW5nOiAyNHB4IDI0cHggMjRweCAyNHB4O1xuICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgIHRyYW5zaXRpb246IG1hcmdpbi1sZWZ0IDAuMjVzIGVhc2Utb3V0O1xufVxuXG4uY29udGVudC1jb250YWluZXIge1xuICAgIG1heC13aWR0aDogOTAwcHg7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cbiIsIi8vIGh0dHBzOi8vY29sb3JodW50LmNvL3BhbGV0dGUvMTU3MTE4XG5cbi8vIENvbG9yc1xuJHRoZW1lLXdoaXRlOiAjRkZGRkZGO1xuJHRoZW1lLWJsYWNrOiAjMzMzMzMzO1xuJHRoZW1lLWdyYXktZGFyazogcmVkO1xuJHRoZW1lLWdyYXk6ICM4YThhOGE7XG4kdGhlbWUtZ3JheS1saWdodDogI2U2ZTZlNjtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXI6ICNmNWY1ZjU7XG4kdGhlbWUtZ3JheS1saWdodGVzdDogI2ZkZmRmZDtcbiR0aGVtZS1ncmF5LWJvcmRlcjogJHRoZW1lLWdyYXktbGlnaHQ7XG5cbiR0aGVtZS1wcmltYXJ5OiAjMzNiZWZmO1xuXG4kdGhlbWUtc3VjY2VzczogIzQyQzc1RDtcbiR0aGVtZS1kYW5nZXI6ICNGQTNFMzk7XG4kdGhlbWUtd2FybmluZzogI0ZGQzIwMDtcblxuLy8gRm9udHMgYW5kIFRleHRcbiRmb250LWZhbWlseTogcHJveGltYS1ub3ZhLCBcIkhlbHZldGljYSBOZXVlXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG5cbiRmb250LXNpemUtc21hbGw6IDAuODc1cmVtO1xuJGZvbnQtc2l6ZS1tZWRpdW06IDFyZW07XG4kZm9udC1zaXplLWxhcmdlOiAxLjVyZW07XG5cbi8vIExheW91dFxuJGJvcmRlci1yYWRpdXM6IDRweDtcbiIsIjpob3N0IHtcbiAgd2lkdGg6IDEwMCU7XG4gIG1pbi13aWR0aDogMTAwJTtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMHZoO1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgbWF4LWhlaWdodDogMTAwdmg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZGZkZmQ7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbi5jZW50ZXItY29udGFpbmVyIHtcbiAgZmxleDogMSAxIGF1dG87XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG59XG5cbi50b3AtY29udGFpbmVyIHtcbiAgZmxleDogMCAwIGF1dG87XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5ib3R0b20tY29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBmbGV4OiAxIDEgYXV0bztcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZkZmRmZDtcbiAgcGFkZGluZzogMjRweCAyNHB4IDI0cHggMjRweDtcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICB0cmFuc2l0aW9uOiBtYXJnaW4tbGVmdCAwLjI1cyBlYXNlLW91dDtcbn1cblxuLmNvbnRlbnQtY29udGFpbmVyIHtcbiAgbWF4LXdpZHRoOiA5MDBweDtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIG92ZXJmbG93OiBoaWRkZW47XG59Il19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](BaseComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-base',
                templateUrl: './base.component.html',
                styleUrls: ['./base.component.scss']
            }]
    }], function () { return [{ type: _services_state_service__WEBPACK_IMPORTED_MODULE_1__["StateService"] }, { type: _services_layout_service__WEBPACK_IMPORTED_MODULE_2__["LayoutService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/feed/feed-detail/feed-detail.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/feed/feed-detail/feed-detail.component.ts ***!
  \***********************************************************/
/*! exports provided: FeedDetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeedDetailComponent", function() { return FeedDetailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _classes_utility__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @classes/utility */ "./src/app/_classes/utility.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! primeng/dialog */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-dialog.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/api */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-api.js");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");
/* harmony import */ var _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @common/copy-box/copy-box.component */ "./src/app/_common/copy-box/copy-box.component.ts");
/* harmony import */ var _media_reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../media/reusable-media-list/reusable-media-list.component */ "./src/app/media/reusable-media-list/reusable-media-list.component.ts");























const _c0 = function () { return ["fad", "cloud-upload"]; };
function FeedDetailComponent_ng_container_4_ng_container_77_Template(rf, ctx) { if (rf & 1) {
    const _r125 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FeedDetailComponent_ng_container_4_ng_container_77_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r125); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r118 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](69); return _r118.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Upload Image ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
} }
function FeedDetailComponent_ng_container_4_ng_container_78_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Uploading Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r120 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r120.uploading.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", ctx_r120.progress * 100, "%");
} }
function FeedDetailComponent_ng_container_4_img_81_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 45);
} if (rf & 2) {
    const ctx_r121 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r121.imageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function FeedDetailComponent_ng_container_4_div_82_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "No image selected.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
const _c1 = function () { return ["fad", "trash"]; };
function FeedDetailComponent_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    const _r127 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Details");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "form", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Title");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Type");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "select", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "option", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Audio Podcast");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "option", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Video Podcast");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Subtitle");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](28, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](32, "textarea", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "URL");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](38, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "E-mail");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](43, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "Copyright");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](49, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "Category");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](54, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Keywords (comma-separated list, no spaces)");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](58, "textarea", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FeedDetailComponent_ng_container_4_Template_button_click_59_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r127); const ctx_r126 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r126.onSave(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](60, "Save");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](63, "Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "input", 29, 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function FeedDetailComponent_ng_container_4_Template_input_change_68_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r127); const _r118 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](69); const ctx_r128 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); ctx_r128.onImageSelected($event); return _r118.value = null; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](71, "Upload an image for this media.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](73, "Image must be in ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](74, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](75, ".jpg");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](76, " format.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](77, FeedDetailComponent_ng_container_4_ng_container_77_Template, 4, 2, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](78, FeedDetailComponent_ng_container_4_ng_container_78_Template, 7, 3, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](79, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](81, FeedDetailComponent_ng_container_4_img_81_Template, 1, 1, "img", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](82, FeedDetailComponent_ng_container_4_div_82_Template, 2, 0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](84, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](85, "Feed Links");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](86, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](87, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](88, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](89, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](90, "Feed");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](91, "app-copy-box", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](92, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](93, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](94, "Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](95, "app-reusable-media-list", 36, 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](97, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](98, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](99, "Danger Zone");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](100, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](101, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](102, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](103, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](104, "Delete Feed");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](105, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](106, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](107, "Permanently delete this feed.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](108, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](109, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](110, "NOTE:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](111, " This will not delete any media entries that are included in this feed. This will simply delete the feed, and those media records will no longer be associated with this feed.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](112, "button", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FeedDetailComponent_ng_container_4_Template_button_click_112_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r127); const ctx_r129 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r129.deleteDialogVisible = true; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](113, "fa-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](114, "Delete Feed ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r117 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r117.feed.title || "Untitled", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r117.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "title")("placeholder", "Untitled");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "type");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "subtitle")("placeholder", "Weekly messages from HopeStream");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "description")("placeholder", "Give a high-level overview of the content of this series...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "url")("placeholder", "https://hopestream.com");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "email")("placeholder", "marketing@hopestream.com");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "copyright")("placeholder", "Copyright HopeStream 2020");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "category")("placeholder", "Religion & Spirituality");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "keywords")("placeholder", "Hope,Stream,HopeStream,Jesus,Christ,Church,...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx_r117.form || !ctx_r117.form.valid || ctx_r117.saving);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r117.uploading);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r117.uploading);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r117.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r117.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r117.feedUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("media", ctx_r117.media);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](27, _c1));
} }
const _c2 = function () { return ["/feeds"]; };
const _c3 = function () { return ["fad", "chevron-left"]; };
const _c4 = function () { return { width: "480px" }; };
class FeedDetailComponent {
    constructor(app, route, router, notifications, http) {
        this.app = app;
        this.route = route;
        this.router = router;
        this.notifications = notifications;
        this.http = http;
        this.Utility = _classes_utility__WEBPACK_IMPORTED_MODULE_4__["Utility"];
        this.loading = true;
        this.media = [];
        this.saving = false;
        this.deleteDialogVisible = false;
        this.deleting = false;
    }
    ngOnInit() {
        this.form = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroup"]({});
        this.form.addControl('title', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('subtitle', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('type', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('description', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('url', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('email', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('copyright', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('category', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('keywords', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        const id = parseInt(this.route.snapshot.params.id);
        const hash = this.app.hashids.encode(id);
        const imageUrl = `https://hopestream.s3.amazonaws.com/feed/${hash}/thumbnail.jpg?t=${new Date().valueOf()}`;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["forkJoin"])(this.app.API.getFeed(id), this.app.API.getAllMedia(), this.app.API.getMediaIdsForFeed({ id: id }), this.http.get(imageUrl, { responseType: 'blob' }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["of"])(undefined)))).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.loading = false;
        })).subscribe(responses => {
            this.feed = responses[0];
            let mediaIds = {};
            responses[2].forEach(o => mediaIds[o] = true);
            this.media = responses[1].filter(o => mediaIds[o.id]);
            this.form.controls.title.setValue(this.feed.title);
            this.form.controls.subtitle.setValue(this.feed.subtitle);
            this.form.controls.type.setValue(this.feed.type);
            this.form.controls.description.setValue(this.feed.description);
            this.form.controls.url.setValue(this.feed.url);
            this.form.controls.email.setValue(this.feed.email);
            this.form.controls.copyright.setValue(this.feed.copyright);
            this.form.controls.category.setValue(this.feed.category);
            this.form.controls.keywords.setValue(this.feed.keywords);
            this.imageUrl = responses[3] ? imageUrl : undefined;
            this.feedUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_9__["environment"].staticUrl}feed/${hash}/feed.rss`;
        });
    }
    onSave() {
        let feed = { id: this.feed.id };
        feed.title = this.form.controls.title.value;
        feed.subtitle = this.form.controls.subtitle.value || null;
        feed.type = this.form.controls.type.value;
        feed.description = this.form.controls.description.value || null;
        feed.url = this.form.controls.url.value || null;
        feed.email = this.form.controls.email.value || null;
        feed.copyright = this.form.controls.copyright.value || null;
        feed.category = this.form.controls.category.value || null;
        feed.keywords = this.form.controls.keywords.value || null;
        this.saving = true;
        this.app.API.updateFeed(feed).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.saving = false;
        })).subscribe(feed => {
            this.feed = feed;
            this.notifications.success('Success', 'Feed details saved successfully.', { timeOut: 5000 });
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem saving.');
        });
    }
    onImageSelected(event) {
        var _a, _b;
        let file = ((_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length) && event.target.files[0] || undefined;
        if (!file) {
            return;
        }
        this.uploading = file;
        this.progress = 0;
        this.app.API.uploadImageForFeed(this.feed, file, progress => {
            this.progress = progress;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.uploading = undefined;
            this.progress = 1;
        })).subscribe(() => {
            this.notifications.success('Success', 'Feed image updated.', { timeOut: 5000 });
            const hash = this.app.hashids.encode(this.feed.id);
            this.imageUrl = `https://hopestream.s3.amazonaws.com/feed/${hash}/thumbnail.jpg?t=${new Date().valueOf()}`;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem uploading.');
        });
    }
    onDelete() {
        this.deleting = true;
        this.app.API.deleteFeed(this.feed).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.deleting = false;
        })).subscribe(() => {
            this.router.navigate(['/feeds']);
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem deleting.');
        });
    }
}
FeedDetailComponent.ɵfac = function FeedDetailComponent_Factory(t) { return new (t || FeedDetailComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_6__["NotificationsService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_8__["HttpClient"])); };
FeedDetailComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FeedDetailComponent, selectors: [["app-feed-detail"]], decls: 26, vars: 15, consts: [[1, "breadcrumb-container"], [3, "routerLink"], [3, "icon"], [4, "ngIf"], [3, "visible", "modal", "dismissableMask", "draggable", "visibleChange"], [1, "title"], [3, "icon", "click"], [2, "margin-top", "1rem"], [1, "button", "alert", 3, "disabled", "click"], [1, "button", "secondary", "hollow", 3, "click"], [1, "spacer"], [1, "header-container"], [1, "content-section"], [3, "formGroup"], [1, "column-container"], [1, "column"], [1, "input-container"], [1, "label"], ["type", "text", 3, "formControlName", "placeholder"], [3, "formControlName"], ["value", "1"], ["value", "0"], ["rows", "6", 3, "formControlName", "placeholder"], ["rows", "3", 3, "formControlName", "placeholder"], [1, "button", 3, "disabled", "click"], [1, "image-content-container"], [1, "image-content-row"], [1, "image-content-col", "image-content-col-third"], [1, "image-upload-container"], ["type", "file", "accept", "image/jpg,image/jpeg", 2, "display", "none", 3, "change"], ["input", ""], [1, "image-content-col"], [1, "image-container"], [3, "src", 4, "ngIf"], ["class", "image-placeholder", 4, "ngIf"], [3, "text"], [3, "media"], ["mediaList", ""], [1, "content-section", "content-section-danger"], [1, "image-content-col", "image-content-col-half"], [1, "button", "alert", 3, "click"], [1, "button", 3, "click"], [1, "upload-name"], [1, "progress-bar-container"], [1, "progress-bar"], [3, "src"], [1, "image-placeholder"]], template: function FeedDetailComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Back to Feed List ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, FeedDetailComponent_ng_container_4_Template, 115, 28, "ng-container", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p-dialog", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("visibleChange", function FeedDetailComponent_Template_p_dialog_visibleChange_5_listener($event) { return ctx.deleteDialogVisible = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Delete Feed");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "app-action-icon", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FeedDetailComponent_Template_app_action_icon_click_9_listener() { return ctx.deleteDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Permanently delete ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "?");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "NOTE:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, " This will not delete any media entries that are included in this feed. This will simply delete the feed, and those media records will no longer be associated with this feed.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "p-footer");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FeedDetailComponent_Template_button_click_21_listener() { return ctx.onDelete(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Delete");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FeedDetailComponent_Template_button_click_23_listener() { return ctx.deleteDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](12, _c2));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](13, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](14, _c4));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("visible", ctx.deleteDialogVisible)("modal", true)("dismissableMask", true)("draggable", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", "times");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((ctx.feed == null ? null : ctx.feed.title) || "Untitled");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.deleting);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLinkWithHref"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_10__["FaIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], primeng_dialog__WEBPACK_IMPORTED_MODULE_12__["Dialog"], primeng_api__WEBPACK_IMPORTED_MODULE_13__["Header"], _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_14__["ActionIconComponent"], primeng_api__WEBPACK_IMPORTED_MODULE_13__["Footer"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControlName"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["SelectControlValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgSelectOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵangular_packages_forms_forms_x"], _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_15__["CopyBoxComponent"], _media_reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_16__["ReusableMediaListComponent"]], styles: [".breadcrumb-container[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n\n.header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin-bottom: 2.5rem;\n}\n\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n\n.content-section[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  padding: 32px;\n  margin-bottom: 1rem;\n}\n\n.content-section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  line-height: 1;\n  margin-bottom: 1.5rem;\n}\n\n.content-section.content-section-danger[_ngcontent-%COMP%] {\n  background-color: #fffbfb;\n  border-color: #FA3E39;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:first-child) {\n  padding-left: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:last-child) {\n  padding-right: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: baseline;\n          align-items: baseline;\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\nform[_ngcontent-%COMP%]   .label-help-text[_ngcontent-%COMP%] {\n  margin-left: 1rem;\n}\n\nform[_ngcontent-%COMP%]     input {\n  margin-bottom: 0;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #e6e6e6;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #e6e6e6;\n}\n\nform[_ngcontent-%COMP%]   .include-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\nform[_ngcontent-%COMP%]   .topic-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]:not(:last-child) {\n  margin-bottom: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding: 0px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:first-child {\n  margin-left: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:last-child {\n  margin-right: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   app-copy-box[_ngcontent-%COMP%]:not(:last-child) {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-half[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-third[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 33%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .upload-name[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  width: 100%;\n  height: 0.5rem;\n  margin-top: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #33beff;\n  border-radius: 4px;\n  -webkit-transition: width 0.1s linear;\n  transition: width 0.1s linear;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  width: 100%;\n  padding-top: calc((1 / 1) * 100%);\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   .image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\napp-reusable-media-list[_ngcontent-%COMP%]     .scrollable-region {\n  max-height: 500px;\n  overflow: auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL2ZlZWQvZmVlZC1kZXRhaWwvZmVlZC1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL2ZlZWQvZmVlZC1kZXRhaWwvZmVlZC1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX21peGlucy5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTtFQUNJLHFCQUFBO0FDRko7O0FES0E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSw0QkFBQTtFQUFBLDZCQUFBO1VBQUEsc0JBQUE7RUFDQSxxQkFBQTtBQ0ZKOztBRElJO0VFTEEsZUFBQTtFQUNBLGdCQUFBO0FESUo7O0FESUk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDRlI7O0FESVE7RUFDSSxvQkFBQTtBQ0ZaOztBRE9BO0VBQ0kseUJHeEJVO0VIeUJWLHlCQUFBO0VBQ0Esa0JHSFk7RUhJWixhQUFBO0VBQ0EsbUJBQUE7QUNKSjs7QURNSTtFRXJCQSxlQUFBO0VBQ0EsZ0JBQUE7RUZzQkksY0FBQTtFQUNBLHFCQUFBO0FDSFI7O0FETUk7RUFDSSx5QkFBQTtFQUNBLHFCRzFCTztBRnNCZjs7QURTSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtBQ05SOztBRFFRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ05aOztBRFFZO0VBQ0ksb0JBQUE7QUNOaEI7O0FEUVk7RUFDSSxxQkFBQTtBQ05oQjs7QURXSTtFQUNJLG1CQUFBO0FDVFI7O0FEWUk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSwyQkFBQTtVQUFBLHFCQUFBO0VFbkRKLHlCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0NkUztFRGVULGtCQUFBO0FEMENKOztBRFFJO0VBRUksaUJBQUE7QUNQUjs7QURVSTtFQUNJLGdCQUFBO0FDUlI7O0FEV0k7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDVFI7O0FEV1E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EscUJBQUE7VUFBQSx5QkFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtBQ1RaOztBRFdZO0VBQ0kseUJHdkZHO0FGOEVuQjs7QURjSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7QUNaUjs7QURjUTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSxxQkFBQTtVQUFBLHlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0FDWlo7O0FEY1k7RUFDSSx5QkcxR0c7QUY4Rm5COztBRGlCSTtFQUNJLGdCQUFBO0FDZlI7O0FEaUJJO0VBQ0ksZ0JBQUE7QUNmUjs7QURvQkk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7QUNqQlI7O0FEbUJRO0VBQ0kscUJBQUE7QUNqQlo7O0FEb0JRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsZ0JBQUE7QUNsQlo7O0FEb0JZO0VBQ0ksaUJBQUE7QUNsQmhCOztBRG9CWTtFQUNJLGtCQUFBO0FDbEJoQjs7QURxQlk7RUVoSVIseUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQ2RTO0VEZVQsa0JBQUE7QUQ4R0o7O0FEaUJZO0VBQ0ksY0FBQTtFQUNBLG1CQUFBO0FDZmhCOztBRGtCUTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtFQUNBLFVBQUE7QUNoQlo7O0FEa0JRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ2hCWjs7QURtQlE7RUFDSSxnQkFBQTtBQ2pCWjs7QURzQlE7RUFDSSxnQkFBQTtBQ3BCWjs7QURzQlE7RUFDSSxrQkFBQTtBQ3BCWjs7QURzQlE7RUFDSSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EsdUJBQUE7QUNwQlo7O0FEc0JRO0VBQ0ksa0JBQUE7RUFDQSx5Qkc3S1M7RUg4S1Qsa0JHNUpJO0VINkpKLFdBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7QUNwQlo7O0FEc0JRO0VBQ0ksa0JBQUE7RUFBb0IsTUFBQTtFQUFRLE9BQUE7RUFBUyxTQUFBO0VBQ3JDLHlCR2pMSTtFSGtMSixrQkdwS0k7RUhxS0oscUNBQUE7RUFBQSw2QkFBQTtBQ2pCWjs7QURxQkk7RUFDSSxrQkFBQTtFQUNBLHlCRzdMYTtFSDhMYixXQUFBO0VBQ0EsaUNBQUE7QUNuQlI7O0FEcUJRO0VBQ0ksa0JBQUE7RUFBb0IsTUFBQTtFQUFRLFFBQUE7RUFBVSxPQUFBO0FDaEJsRDs7QURtQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsU0FBQTtFQUFXLFFBQUE7RUFBVSxPQUFBO0VBQ2pELG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSx3QkFBQTtVQUFBLHVCQUFBO0FDYlo7O0FEa0JBO0VBQ0ksaUJBQUE7RUFDQSxjQUFBO0FDZkoiLCJmaWxlIjoic3JjL2FwcC9mZWVkL2ZlZWQtZGV0YWlsL2ZlZWQtZGV0YWlsLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcIi4uLy4uLy4uL3Njc3MvdmFyaWFibGVzXCI7XG5AaW1wb3J0IFwiLi4vLi4vLi4vc2Nzcy9taXhpbnNcIjtcblxuLmJyZWFkY3J1bWItY29udGFpbmVyIHtcbiAgICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG59XG5cbi5oZWFkZXItY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgbWFyZ2luLWJvdHRvbTogMi41cmVtO1xuXG4gICAgLnRpdGxlIHtcbiAgICAgICAgQGluY2x1ZGUgaGVhZGVyLWZvbnQoKTtcbiAgICB9XG5cbiAgICAuc3VidGl0bGUge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIC5zdGF0dXMge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAwLjVyZW07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi5jb250ZW50LXNlY3Rpb24ge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS13aGl0ZTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAkdGhlbWUtZ3JheS1ib3JkZXI7XG4gICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgcGFkZGluZzogMzJweDtcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuXG4gICAgLnRpdGxlIHtcbiAgICAgICAgQGluY2x1ZGUgdGl0bGUtZm9udCgpO1xuICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xuICAgIH1cblxuICAgICYuY29udGVudC1zZWN0aW9uLWRhbmdlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0ZW4oJHRoZW1lLWRhbmdlciwgMzklKTtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiAkdGhlbWUtZGFuZ2VyO1xuICAgIH1cbn1cblxuZm9ybSB7XG4gICAgLmNvbHVtbi1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuXG4gICAgICAgIC5jb2x1bW4ge1xuICAgICAgICAgICAgZmxleDogMCAwIGF1dG87XG4gICAgICAgICAgICB3aWR0aDogNTAlO1xuXG4gICAgICAgICAgICAmOm5vdCg6Zmlyc3QtY2hpbGQpIHtcbiAgICAgICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDAuNXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICY6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMC41cmVtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmlucHV0LWNvbnRhaW5lciB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG4gICAgfVxuXG4gICAgLmxhYmVsIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGJhc2VsaW5lO1xuICAgICAgICBAaW5jbHVkZSBsYWJlbC1mb250KCk7XG4gICAgfVxuICAgIC5sYWJlbC1oZWxwLXRleHQge1xuICAgICAgICAvLyBmb250LXNpemU6ICRmb250LXNpemUtc21hbGw7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAxcmVtO1xuICAgIH1cblxuICAgIDo6bmctZGVlcCBpbnB1dCB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgfVxuXG4gICAgLnNlcmllcy1pdGVtLWNvbnRhaW5lciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgLnNlcmllcy1pdGVtLWltYWdlIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB3aWR0aDogMTAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDU2cHg7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG5cbiAgICAgICAgICAgICYucGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLnNwZWFrZXItaXRlbS1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIC5zcGVha2VyLWl0ZW0taW1hZ2Uge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIHdpZHRoOiAxMDBweDtcbiAgICAgICAgICAgIGhlaWdodDogNTZweDtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMXJlbTtcblxuICAgICAgICAgICAgJi5wbGFjZWhvbGRlciB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLWdyYXktbGlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuaW5jbHVkZS1pdGVtLWxhYmVsIHtcbiAgICAgICAgcGFkZGluZzogNHB4IDhweDtcbiAgICB9XG4gICAgLnRvcGljLWl0ZW0tbGFiZWwge1xuICAgICAgICBwYWRkaW5nOiA0cHggOHB4O1xuICAgIH1cbn1cblxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIHtcbiAgICAuaW1hZ2UtY29udGVudC1yb3cge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuXG4gICAgICAgICY6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG4gICAgICAgIH1cblxuICAgICAgICAuaW1hZ2UtY29udGVudC1jb2wge1xuICAgICAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgICAgICBwYWRkaW5nOiAwcHggOHB4O1xuXG4gICAgICAgICAgICAmOmZpcnN0LWNoaWxkIHtcbiAgICAgICAgICAgICAgICBtYXJnaW4tbGVmdDogLThweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICY6bGFzdC1jaGlsZCB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAtOHB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubGFiZWwge1xuICAgICAgICAgICAgICAgIEBpbmNsdWRlIGxhYmVsLWZvbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFwcC1jb3B5LWJveDpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC5pbWFnZS1jb250ZW50LWNvbC1oYWxmIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDUwJTtcbiAgICAgICAgfVxuICAgICAgICAuaW1hZ2UtY29udGVudC1jb2wtdGhpcmQge1xuICAgICAgICAgICAgZmxleDogMCAwIGF1dG87XG4gICAgICAgICAgICB3aWR0aDogMzMlO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRpdGxlIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDJyZW07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciB7XG4gICAgICAgIC5idXR0b24ge1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMXJlbTtcbiAgICAgICAgfVxuICAgICAgICAubGFiZWwge1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMS41cmVtO1xuICAgICAgICB9XG4gICAgICAgIC51cGxvYWQtbmFtZSB7XG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgICB9XG4gICAgICAgIC5wcm9ncmVzcy1iYXItY29udGFpbmVyIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAwLjVyZW07XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAwLjVyZW07XG4gICAgICAgIH1cbiAgICAgICAgLnByb2dyZXNzLWJhciB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgYm90dG9tOiAwO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLXByaW1hcnk7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHdpZHRoIDAuMXMgbGluZWFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmltYWdlLWNvbnRhaW5lciB7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLWdyYXktbGlnaHRlcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHBhZGRpbmctdG9wOiBjYWxjKCgxIC8gMSkgKiAxMDAlKTtcblxuICAgICAgICBpbWcge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IHJpZ2h0OiAwOyBsZWZ0OiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLmltYWdlLXBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBib3R0b206IDA7IHJpZ2h0OiAwOyBsZWZ0OiAwO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuYXBwLXJldXNhYmxlLW1lZGlhLWxpc3QgOjpuZy1kZWVwIC5zY3JvbGxhYmxlLXJlZ2lvbiB7XG4gICAgbWF4LWhlaWdodDogNTAwcHg7XG4gICAgb3ZlcmZsb3c6IGF1dG87XG59IiwiLmJyZWFkY3J1bWItY29udGFpbmVyIHtcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcbn1cbi5oZWFkZXItY29udGFpbmVyIC50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMzJweDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbn1cbi5oZWFkZXItY29udGFpbmVyIC5zdWJ0aXRsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4uaGVhZGVyLWNvbnRhaW5lciAuc3VidGl0bGUgLnN0YXR1cyB7XG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xufVxuXG4uY29udGVudC1zZWN0aW9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgYm9yZGVyOiAxcHggc29saWQgI2U2ZTZlNjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBwYWRkaW5nOiAzMnB4O1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuLmNvbnRlbnQtc2VjdGlvbiAudGl0bGUge1xuICBmb250LXNpemU6IDI0cHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG59XG4uY29udGVudC1zZWN0aW9uLmNvbnRlbnQtc2VjdGlvbi1kYW5nZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmYmZiO1xuICBib3JkZXItY29sb3I6ICNGQTNFMzk7XG59XG5cbmZvcm0gLmNvbHVtbi1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuZm9ybSAuY29sdW1uLWNvbnRhaW5lciAuY29sdW1uIHtcbiAgZmxleDogMCAwIGF1dG87XG4gIHdpZHRoOiA1MCU7XG59XG5mb3JtIC5jb2x1bW4tY29udGFpbmVyIC5jb2x1bW46bm90KDpmaXJzdC1jaGlsZCkge1xuICBwYWRkaW5nLWxlZnQ6IDAuNXJlbTtcbn1cbmZvcm0gLmNvbHVtbi1jb250YWluZXIgLmNvbHVtbjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgcGFkZGluZy1yaWdodDogMC41cmVtO1xufVxuZm9ybSAuaW5wdXQtY29udGFpbmVyIHtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cbmZvcm0gLmxhYmVsIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGJhc2VsaW5lO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGNvbG9yOiAjOGE4YThhO1xuICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG5mb3JtIC5sYWJlbC1oZWxwLXRleHQge1xuICBtYXJnaW4tbGVmdDogMXJlbTtcbn1cbmZvcm0gOjpuZy1kZWVwIGlucHV0IHtcbiAgbWFyZ2luLWJvdHRvbTogMDtcbn1cbmZvcm0gLnNlcmllcy1pdGVtLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5mb3JtIC5zZXJpZXMtaXRlbS1jb250YWluZXIgLnNlcmllcy1pdGVtLWltYWdlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgd2lkdGg6IDEwMHB4O1xuICBoZWlnaHQ6IDU2cHg7XG4gIG1hcmdpbi1yaWdodDogMXJlbTtcbn1cbmZvcm0gLnNlcmllcy1pdGVtLWNvbnRhaW5lciAuc2VyaWVzLWl0ZW0taW1hZ2UucGxhY2Vob2xkZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTZlNmU2O1xufVxuZm9ybSAuc3BlYWtlci1pdGVtLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5mb3JtIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIC5zcGVha2VyLWl0ZW0taW1hZ2Uge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB3aWR0aDogMTAwcHg7XG4gIGhlaWdodDogNTZweDtcbiAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xufVxuZm9ybSAuc3BlYWtlci1pdGVtLWNvbnRhaW5lciAuc3BlYWtlci1pdGVtLWltYWdlLnBsYWNlaG9sZGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2U2ZTZlNjtcbn1cbmZvcm0gLmluY2x1ZGUtaXRlbS1sYWJlbCB7XG4gIHBhZGRpbmc6IDRweCA4cHg7XG59XG5mb3JtIC50b3BpYy1pdGVtLWxhYmVsIHtcbiAgcGFkZGluZzogNHB4IDhweDtcbn1cblxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93Om5vdCg6bGFzdC1jaGlsZCkge1xuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbCB7XG4gIGZsZXg6IDEgMSBhdXRvO1xuICBwYWRkaW5nOiAwcHggOHB4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2w6Zmlyc3QtY2hpbGQge1xuICBtYXJnaW4tbGVmdDogLThweDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sOmxhc3QtY2hpbGQge1xuICBtYXJnaW4tcmlnaHQ6IC04cHg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbCAubGFiZWwge1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGNvbG9yOiAjOGE4YThhO1xuICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbCBhcHAtY29weS1ib3g6bm90KDpsYXN0LWNoaWxkKSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2wtaGFsZiB7XG4gIGZsZXg6IDAgMCBhdXRvO1xuICB3aWR0aDogNTAlO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2wtdGhpcmQge1xuICBmbGV4OiAwIDAgYXV0bztcbiAgd2lkdGg6IDMzJTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLnRpdGxlIHtcbiAgbWFyZ2luLXRvcDogMnJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAuYnV0dG9uIHtcbiAgbWFyZ2luLXRvcDogMXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAubGFiZWwge1xuICBtYXJnaW4tdG9wOiAxLjVyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLXVwbG9hZC1jb250YWluZXIgLnVwbG9hZC1uYW1lIHtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLXVwbG9hZC1jb250YWluZXIgLnByb2dyZXNzLWJhci1jb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMC41cmVtO1xuICBtYXJnaW4tdG9wOiAwLjVyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLXVwbG9hZC1jb250YWluZXIgLnByb2dyZXNzLWJhciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICBib3R0b206IDA7XG4gIGJhY2tncm91bmQtY29sb3I6ICMzM2JlZmY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgdHJhbnNpdGlvbjogd2lkdGggMC4xcyBsaW5lYXI7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcbiAgd2lkdGg6IDEwMCU7XG4gIHBhZGRpbmctdG9wOiBjYWxjKCgxIC8gMSkgKiAxMDAlKTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIGltZyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgbGVmdDogMDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIC5pbWFnZS1wbGFjZWhvbGRlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwO1xuICBsZWZ0OiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuYXBwLXJldXNhYmxlLW1lZGlhLWxpc3QgOjpuZy1kZWVwIC5zY3JvbGxhYmxlLXJlZ2lvbiB7XG4gIG1heC1oZWlnaHQ6IDUwMHB4O1xuICBvdmVyZmxvdzogYXV0bztcbn0iLCJAaW1wb3J0IFwidmFyaWFibGVzXCI7XG5cbkBtaXhpbiBzaGFkb3coKSB7XG4gICAgYm94LXNoYWRvdzogMCAxcHggNHB4IDAgcmdiYSgwLCAwLCAwLCAwLjA2KTtcbn1cblxuQG1peGluIGhlYWRlci1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMzJweDtcbiAgICBmb250LXdlaWdodDogODAwO1xufVxuXG5AbWl4aW4gdGl0bGUtZm9udCgpIHtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cblxuQG1peGluIGxhYmVsLWZvbnQoKSB7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjb2xvcjogJHRoZW1lLWdyYXk7XG4gICAgbWFyZ2luLWJvdHRvbTogMnB4O1xufVxuIiwiLy8gaHR0cHM6Ly9jb2xvcmh1bnQuY28vcGFsZXR0ZS8xNTcxMThcblxuLy8gQ29sb3JzXG4kdGhlbWUtd2hpdGU6ICNGRkZGRkY7XG4kdGhlbWUtYmxhY2s6ICMzMzMzMzM7XG4kdGhlbWUtZ3JheS1kYXJrOiByZWQ7XG4kdGhlbWUtZ3JheTogIzhhOGE4YTtcbiR0aGVtZS1ncmF5LWxpZ2h0OiAjZTZlNmU2O1xuJHRoZW1lLWdyYXktbGlnaHRlcjogI2Y1ZjVmNTtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXN0OiAjZmRmZGZkO1xuJHRoZW1lLWdyYXktYm9yZGVyOiAkdGhlbWUtZ3JheS1saWdodDtcblxuJHRoZW1lLXByaW1hcnk6ICMzM2JlZmY7XG5cbiR0aGVtZS1zdWNjZXNzOiAjNDJDNzVEO1xuJHRoZW1lLWRhbmdlcjogI0ZBM0UzOTtcbiR0aGVtZS13YXJuaW5nOiAjRkZDMjAwO1xuXG4vLyBGb250cyBhbmQgVGV4dFxuJGZvbnQtZmFtaWx5OiBwcm94aW1hLW5vdmEsIFwiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcblxuJGZvbnQtc2l6ZS1zbWFsbDogMC44NzVyZW07XG4kZm9udC1zaXplLW1lZGl1bTogMXJlbTtcbiRmb250LXNpemUtbGFyZ2U6IDEuNXJlbTtcblxuLy8gTGF5b3V0XG4kYm9yZGVyLXJhZGl1czogNHB4O1xuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FeedDetailComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-feed-detail',
                templateUrl: './feed-detail.component.html',
                styleUrls: ['./feed-detail.component.scss']
            }]
    }], function () { return [{ type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_6__["NotificationsService"] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_8__["HttpClient"] }]; }, null); })();


/***/ }),

/***/ "./src/app/feed/feed-list/feed-list.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/feed/feed-list/feed-list.component.ts ***!
  \*******************************************************/
/*! exports provided: FeedListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeedListComponent", function() { return FeedListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _classes_utility__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @classes/utility */ "./src/app/_classes/utility.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-infinite-scroll */ "./node_modules/ngx-infinite-scroll/__ivy_ngcc__/modules/ngx-infinite-scroll.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");
/* harmony import */ var _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @common/loading-indicator/loading-indicator.component */ "./src/app/_common/loading-indicator/loading-indicator.component.ts");















function FeedListComponent_ng_container_8_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r112 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("Showing ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx_r112.entries.length), " ", ctx_r112.entries.length === 1 ? "feed" : "feeds", "");
} }
function FeedListComponent_ng_container_8_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r113 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate3"]("Showing ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 3, ctx_r113.filtered.length), " of ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 5, ctx_r113.entries.length), " ", ctx_r113.entries.length === 1 ? "feed" : "feeds", "");
} }
function FeedListComponent_ng_container_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FeedListComponent_ng_container_8_div_1_Template, 3, 4, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FeedListComponent_ng_container_8_div_2_Template, 4, 7, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r109 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r109.filtered.length === ctx_r109.entries.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r109.filtered.length !== ctx_r109.entries.length);
} }
const _c0 = function (a1) { return ["/feeds", a1]; };
function FeedListComponent_tr_30_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "a", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const entry_r114 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", entry_r114.type, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](4, _c0, entry_r114.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", entry_r114.title, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", entry_r114.subtitle, " ");
} }
function FeedListComponent_div_31_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "No feeds available.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function FeedListComponent_div_31_app_loading_indicator_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-loading-indicator");
} }
function FeedListComponent_div_31_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FeedListComponent_div_31_div_1_Template, 2, 0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FeedListComponent_div_31_app_loading_indicator_2_Template, 1, 0, "app-loading-indicator", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r111 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r111.feeds);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r111.feeds);
} }
class FeedListComponent {
    constructor(locale, app, router, notifications) {
        this.locale = locale;
        this.app = app;
        this.router = router;
        this.notifications = notifications;
        this.Utility = _classes_utility__WEBPACK_IMPORTED_MODULE_2__["Utility"];
        this.entries = [];
        this.filtered = [];
        this.loaded = [];
        this.sort = 'id';
        this.ascending = false;
        this.SortOptions = {
            id: (a, b) => {
                return a.id - b.id;
            },
            type: (a, b) => {
                const A = (a.type || 'zzz').toLowerCase().trim();
                const B = (b.type || 'zzz').toLowerCase().trim();
                return A < B ? -1 : (A > B ? 1 : (a.id - b.id));
            },
            title: (a, b) => {
                const A = (a.title || 'zzz').toLowerCase().trim();
                const B = (b.title || 'zzz').toLowerCase().trim();
                return A < B ? -1 : (A > B ? 1 : (a.id - b.id));
            },
            subtitle: (a, b) => {
                const A = (a.subtitle || 'zzz').toLowerCase().trim();
                const B = (b.subtitle || 'zzz').toLowerCase().trim();
                return A < B ? -1 : (A > B ? 1 : (a.id - b.id));
            },
        };
        this.creating = false;
    }
    ngOnInit() {
        this.app.API.getAllFeeds().subscribe(feeds => {
            this.feeds = feeds;
            this.entries = this.feeds.map(o => {
                let result = {
                    id: o.id,
                    type: o.type ? 'Audio Podcast' : 'Video Podcast',
                    title: o.title || 'Untitled',
                    subtitle: o.subtitle || '',
                };
                result.search = `${result.type}${result.title}${result.subtitle}`.toLowerCase();
                return result;
            });
            this.sort = 'id';
            this.ascending = false;
            this.updateEntries();
        });
    }
    onLoadMoreRows() {
        this.loaded = this.loaded.concat(this.filtered.slice(this.loaded.length, this.loaded.length + 30));
    }
    onSort(sort) {
        if (sort !== this.sort) {
            this.sort = sort;
            this.ascending = true;
        }
        else if (!this.ascending) {
            this.sort = 'id';
            this.ascending = false;
        }
        else {
            this.ascending = false;
        }
        this.updateEntries();
    }
    updateEntries() {
        const search = (this.search || '').toLowerCase();
        const comparator = this.SortOptions[this.sort];
        this.filtered = this.entries.filter(o => !search || o.search.indexOf(search) >= 0).sort(this.ascending ? comparator : (a, b) => -comparator(a, b));
        this.loaded = this.filtered.slice(0, 30);
    }
    onSearchUpdate() {
        this.updateEntries();
    }
    onAddFeed() {
        this.creating = true;
        this.app.API.createFeed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.creating = false;
        })).subscribe(feed => {
            this.router.navigate(['/feeds', feed.id]);
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem creating.');
        });
    }
}
FeedListComponent.ɵfac = function FeedListComponent_Factory(t) { return new (t || FeedListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["NotificationsService"])); };
FeedListComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FeedListComponent, selectors: [["app-feed-list"]], decls: 32, vars: 15, consts: [["infiniteScroll", "", 1, "scrollable-region", 3, "scrollWindow", "infiniteScrollContainer", "fromRoot", "scrolled"], [1, "header-container"], [1, "title"], [1, "button", 3, "disabled", "click"], [1, "content"], [1, "options-container"], [4, "ngIf"], [1, "spacer"], [1, "search"], ["type", "text", 3, "ngModel", "placeholder", "ngModelChange"], [1, "table-container"], [2, "width", "140px"], [1, "header"], [1, "name"], [3, "active", "icon", "click"], [2, "width", "300px"], [4, "ngFor", "ngForOf"], ["class", "loading-container", 4, "ngIf"], ["class", "count", 4, "ngIf"], [1, "count"], [3, "routerLink"], [1, "loading-container"]], template: function FeedListComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("scrolled", function FeedListComponent_Template_div_scrolled_0_listener() { return ctx.onLoadMoreRows(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Feeds");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FeedListComponent_Template_button_click_4_listener() { return ctx.onAddFeed(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Add Feed");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, FeedListComponent_ng_container_8_Template, 3, 2, "ng-container", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function FeedListComponent_Template_input_ngModelChange_11_listener($event) { return ctx.search = $event; })("ngModelChange", function FeedListComponent_Template_input_ngModelChange_11_listener() { return ctx.onSearchUpdate(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "table");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "th", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Type");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "app-action-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FeedListComponent_Template_app_action_icon_click_19_listener() { return ctx.onSort("type"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "th", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Title");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "app-action-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FeedListComponent_Template_app_action_icon_click_24_listener() { return ctx.onSort("title"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "Subtitle");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "app-action-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FeedListComponent_Template_app_action_icon_click_29_listener() { return ctx.onSort("subtitle"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](30, FeedListComponent_tr_30_Template, 8, 6, "tr", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](31, FeedListComponent_div_31_Template, 3, 2, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("scrollWindow", false)("infiniteScrollContainer", ".center-container > .bottom-container")("fromRoot", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.creating);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.filtered.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.search)("placeholder", "Search...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("active", ctx.sort === "type")("icon", ctx.sort !== "type" ? "sort" : ctx.ascending ? "sort-up" : "sort-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("active", ctx.sort === "title")("icon", ctx.sort !== "title" ? "sort" : ctx.ascending ? "sort-up" : "sort-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("active", ctx.sort === "subtitle")("icon", ctx.sort !== "subtitle" ? "sort" : ctx.ascending ? "sort-up" : "sort-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.loaded);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.feeds || !ctx.feeds.length);
    } }, directives: [ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__["InfiniteScrollDirective"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgModel"], _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_9__["ActionIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLinkWithHref"], _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_10__["LoadingIndicatorComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_7__["DecimalPipe"]], styles: [".header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  margin-bottom: 2.5rem;\n}\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.options-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n.options-container[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.options-container[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  width: 320px;\n}\n.table-container[_ngcontent-%COMP%] {\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  overflow: hidden;\n}\ntable[_ngcontent-%COMP%] {\n  table-layout: fixed;\n  border-collapse: collapse;\n  width: 100%;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n  background-color: #FFFFFF;\n  padding: 10px 16px;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon {\n  color: #e6e6e6;\n  margin: -5px 0px -5px 8px;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon:hover {\n  color: #333333;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon.active {\n  color: #333333;\n}\ntable[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n  background-color: #FFFFFF;\n  padding: 20px 16px;\n}\ntable[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid #e6e6e6;\n}\ntable[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(even)   td[_ngcontent-%COMP%] {\n  background-color: #fdfdfd;\n}\n.loading-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n  height: 140px;\n}\n.time[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 300;\n}\n.image-container[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.image-container[_ngcontent-%COMP%]   .image-placeholder[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  padding-top: calc((9 / 16) * 100%);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL2ZlZWQvZmVlZC1saXN0L2ZlZWQtbGlzdC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvZmVlZC9mZWVkLWxpc3QvZmVlZC1saXN0LmNvbXBvbmVudC5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL19taXhpbnMuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EscUJBQUE7QUNGSjtBRElJO0VFREEsZUFBQTtFQUNBLGdCQUFBO0VGRUksbUJBQUE7VUFBQSxjQUFBO0FDRFI7QURLQTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7QUNGSjtBRElJO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0FDRlI7QURLSTtFQUNJLHlCR3BCTTtFSHFCTixZQUFBO0FDSFI7QURPQTtFQUNJLHlCQUFBO0VBQ0Esa0JHSlk7RUhLWixnQkFBQTtBQ0pKO0FET0E7RUFDSSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0EsV0FBQTtBQ0pKO0FETUk7RUFDSSxnQkFBQTtFQUNBLHlCR3RDTTtFSHVDTixrQkFBQTtBQ0pSO0FETVE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDSlo7QURNWTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtBQ0poQjtBRE9ZO0VBQ0ksY0c5Q0c7RUgrQ0gseUJBQUE7QUNMaEI7QURPZ0I7RUFDSSxjR3JETjtBRmdEZDtBRE9nQjtFQUNJLGNHeEROO0FGbURkO0FEV0k7RUFDSSxtQkFBQTtFQUNBLHlCR2pFTTtFSGtFTixrQkFBQTtBQ1RSO0FEWUk7RUFDSSxnQ0FBQTtBQ1ZSO0FEYUk7RUFDSSx5QkdwRWM7QUZ5RHRCO0FEZUE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtFQUNBLGFBQUE7QUNaSjtBRGVBO0VBQ0ksbUJHcEVjO0VIcUVkLGdCQUFBO0FDWko7QURlQTtFQUNJLFdBQUE7QUNaSjtBRGNJO0VBQ0ksV0FBQTtBQ1pSO0FEZUk7RUFDSSxrQkFBQTtFQUNBLHlCRzlGYTtFSCtGYixrQ0FBQTtBQ2JSIiwiZmlsZSI6InNyYy9hcHAvZmVlZC9mZWVkLWxpc3QvZmVlZC1saXN0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcIi4uLy4uLy4uL3Njc3MvdmFyaWFibGVzXCI7XG5AaW1wb3J0IFwiLi4vLi4vLi4vc2Nzcy9taXhpbnNcIjtcblxuLmhlYWRlci1jb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XG5cbiAgICAudGl0bGUge1xuICAgICAgICBAaW5jbHVkZSBoZWFkZXItZm9udCgpO1xuICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICB9XG59XG5cbi5vcHRpb25zLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgLnNwYWNlciB7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIH1cblxuICAgIC5zZWFyY2ggaW5wdXQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgICAgIHdpZHRoOiAzMjBweDtcbiAgICB9XG59XG5cbi50YWJsZS1jb250YWluZXIge1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR0aGVtZS1ncmF5LWJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG50YWJsZSB7XG4gICAgdGFibGUtbGF5b3V0OiBmaXhlZDtcbiAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgdGgge1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMTZweDtcblxuICAgICAgICAuaGVhZGVyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICAgICAubmFtZSB7XG4gICAgICAgICAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIDo6bmctZGVlcCAuYWN0aW9uLWljb24ge1xuICAgICAgICAgICAgICAgIGNvbG9yOiAkdGhlbWUtZ3JheS1saWdodDtcbiAgICAgICAgICAgICAgICBtYXJnaW46IC01cHggMHB4IC01cHggOHB4O1xuXG4gICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAkdGhlbWUtYmxhY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICYuYWN0aXZlIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICR0aGVtZS1ibGFjaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0ZCB7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS13aGl0ZTtcbiAgICAgICAgcGFkZGluZzogMjBweCAxNnB4O1xuICAgIH1cblxuICAgIHRyOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJHRoZW1lLWdyYXktYm9yZGVyO1xuICAgIH1cbiAgICBcbiAgICB0cjpudGgtY2hpbGQoZXZlbikgdGQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVzdDtcbiAgICB9XG59XG5cbi5sb2FkaW5nLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGhlaWdodDogMTQwcHg7XG59XG5cbi50aW1lIHtcbiAgICBmb250LXNpemU6ICRmb250LXNpemUtc21hbGw7XG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcbn1cblxuLmltYWdlLWNvbnRhaW5lciB7XG4gICAgd2lkdGg6IDEwMCU7XG5cbiAgICBpbWcge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAuaW1hZ2UtcGxhY2Vob2xkZXIge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgIHBhZGRpbmctdG9wOiBjYWxjKCg5IC8gMTYpICogMTAwJSk7XG4gICAgfVxufSIsIi5oZWFkZXItY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMi41cmVtO1xufVxuLmhlYWRlci1jb250YWluZXIgLnRpdGxlIHtcbiAgZm9udC1zaXplOiAzMnB4O1xuICBmb250LXdlaWdodDogODAwO1xuICBmbGV4OiAxIDEgYXV0bztcbn1cblxuLm9wdGlvbnMtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbi5vcHRpb25zLWNvbnRhaW5lciAuc3BhY2VyIHtcbiAgZmxleDogMSAxIGF1dG87XG59XG4ub3B0aW9ucy1jb250YWluZXIgLnNlYXJjaCBpbnB1dCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7XG4gIHdpZHRoOiAzMjBweDtcbn1cblxuLnRhYmxlLWNvbnRhaW5lciB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlNmU2ZTY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxudGFibGUge1xuICB0YWJsZS1sYXlvdXQ6IGZpeGVkO1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICB3aWR0aDogMTAwJTtcbn1cbnRhYmxlIHRoIHtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgcGFkZGluZzogMTBweCAxNnB4O1xufVxudGFibGUgdGggLmhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG50YWJsZSB0aCAuaGVhZGVyIC5uYW1lIHtcbiAgZmxleDogMSAxIGF1dG87XG59XG50YWJsZSB0aCAuaGVhZGVyIDo6bmctZGVlcCAuYWN0aW9uLWljb24ge1xuICBjb2xvcjogI2U2ZTZlNjtcbiAgbWFyZ2luOiAtNXB4IDBweCAtNXB4IDhweDtcbn1cbnRhYmxlIHRoIC5oZWFkZXIgOjpuZy1kZWVwIC5hY3Rpb24taWNvbjpob3ZlciB7XG4gIGNvbG9yOiAjMzMzMzMzO1xufVxudGFibGUgdGggLmhlYWRlciA6Om5nLWRlZXAgLmFjdGlvbi1pY29uLmFjdGl2ZSB7XG4gIGNvbG9yOiAjMzMzMzMzO1xufVxudGFibGUgdGQge1xuICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO1xuICBwYWRkaW5nOiAyMHB4IDE2cHg7XG59XG50YWJsZSB0cjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlNmU2ZTY7XG59XG50YWJsZSB0cjpudGgtY2hpbGQoZXZlbikgdGQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmRmZGZkO1xufVxuXG4ubG9hZGluZy1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgaGVpZ2h0OiAxNDBweDtcbn1cblxuLnRpbWUge1xuICBmb250LXNpemU6IDAuODc1cmVtO1xuICBmb250LXdlaWdodDogMzAwO1xufVxuXG4uaW1hZ2UtY29udGFpbmVyIHtcbiAgd2lkdGg6IDEwMCU7XG59XG4uaW1hZ2UtY29udGFpbmVyIGltZyB7XG4gIHdpZHRoOiAxMDAlO1xufVxuLmltYWdlLWNvbnRhaW5lciAuaW1hZ2UtcGxhY2Vob2xkZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gIHBhZGRpbmctdG9wOiBjYWxjKCg5IC8gMTYpICogMTAwJSk7XG59IiwiQGltcG9ydCBcInZhcmlhYmxlc1wiO1xuXG5AbWl4aW4gc2hhZG93KCkge1xuICAgIGJveC1zaGFkb3c6IDAgMXB4IDRweCAwIHJnYmEoMCwgMCwgMCwgMC4wNik7XG59XG5cbkBtaXhpbiBoZWFkZXItZm9udCgpIHtcbiAgICBmb250LXNpemU6IDMycHg7XG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcbn1cblxuQG1peGluIHRpdGxlLWZvbnQoKSB7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG59XG5cbkBtaXhpbiBsYWJlbC1mb250KCkge1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgY29sb3I6ICR0aGVtZS1ncmF5O1xuICAgIG1hcmdpbi1ib3R0b206IDJweDtcbn1cbiIsIi8vIGh0dHBzOi8vY29sb3JodW50LmNvL3BhbGV0dGUvMTU3MTE4XG5cbi8vIENvbG9yc1xuJHRoZW1lLXdoaXRlOiAjRkZGRkZGO1xuJHRoZW1lLWJsYWNrOiAjMzMzMzMzO1xuJHRoZW1lLWdyYXktZGFyazogcmVkO1xuJHRoZW1lLWdyYXk6ICM4YThhOGE7XG4kdGhlbWUtZ3JheS1saWdodDogI2U2ZTZlNjtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXI6ICNmNWY1ZjU7XG4kdGhlbWUtZ3JheS1saWdodGVzdDogI2ZkZmRmZDtcbiR0aGVtZS1ncmF5LWJvcmRlcjogJHRoZW1lLWdyYXktbGlnaHQ7XG5cbiR0aGVtZS1wcmltYXJ5OiAjMzNiZWZmO1xuXG4kdGhlbWUtc3VjY2VzczogIzQyQzc1RDtcbiR0aGVtZS1kYW5nZXI6ICNGQTNFMzk7XG4kdGhlbWUtd2FybmluZzogI0ZGQzIwMDtcblxuLy8gRm9udHMgYW5kIFRleHRcbiRmb250LWZhbWlseTogcHJveGltYS1ub3ZhLCBcIkhlbHZldGljYSBOZXVlXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG5cbiRmb250LXNpemUtc21hbGw6IDAuODc1cmVtO1xuJGZvbnQtc2l6ZS1tZWRpdW06IDFyZW07XG4kZm9udC1zaXplLWxhcmdlOiAxLjVyZW07XG5cbi8vIExheW91dFxuJGJvcmRlci1yYWRpdXM6IDRweDtcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FeedListComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-feed-list',
                templateUrl: './feed-list.component.html',
                styleUrls: ['./feed-list.component.scss']
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"]]
            }] }, { type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["NotificationsService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/header/header.component.ts":
/*!********************************************!*\
  !*** ./src/app/header/header.component.ts ***!
  \********************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _services_state_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @services/state.service */ "./src/app/_services/state.service.ts");
/* harmony import */ var _services_app_managers_user_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @services/app/managers/user.manager */ "./src/app/_services/app/managers/user.manager.ts");
/* harmony import */ var _services_app_managers_organization_manager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @services/app/managers/organization.manager */ "./src/app/_services/app/managers/organization.manager.ts");
/* harmony import */ var _common_popover_popover_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @common/popover/popover.component */ "./src/app/_common/popover/popover.component.ts");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");











const _c0 = function () { return ["/church"]; };
const _c1 = function () { return ["/media"]; };
const _c2 = function () { return ["/series"]; };
const _c3 = function () { return ["/speakers"]; };
const _c4 = function () { return ["/feeds"]; };
const _c5 = function () { return ["fad", "cog"]; };
const _c6 = function () { return ["fad", "sign-out"]; };
class HeaderComponent {
    constructor(router, state) {
        this.router = router;
        this.state = state;
    }
    get user() { return _services_app_managers_user_manager__WEBPACK_IMPORTED_MODULE_3__["UserManager"].sharedInstance.user; }
    get organization() { return _services_app_managers_organization_manager__WEBPACK_IMPORTED_MODULE_4__["OrganizationManager"].sharedInstance.organization; }
    onViewSettings() {
        Object(_common_popover_popover_component__WEBPACK_IMPORTED_MODULE_5__["HideAllPopovers"])();
        this.router.navigate(['/settings']);
    }
    onLogOut() {
        this.state.logout();
    }
}
HeaderComponent.ɵfac = function HeaderComponent_Factory(t) { return new (t || HeaderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_state_service__WEBPACK_IMPORTED_MODULE_2__["StateService"])); };
HeaderComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: HeaderComponent, selectors: [["app-header"]], decls: 33, vars: 30, consts: [[1, "item", "logo"], ["src", "assets/images/hopestream-logo.png"], [1, "item", 3, "routerLink"], [1, "spacer"], [1, "item", 3, "click"], ["popoverTarget", ""], ["my", "top right", "at", "bottom right", 3, "x-offset", "y-offset", "target"], ["popover", ""], [1, "popover-section", "popover-section-with-icons"], [1, "popover-item"], [1, "popover-item", "popover-item-divider"], [1, "popover-item", "popover-item-button", 3, "click"], [1, "popover-item-icon"], [3, "icon"]], template: function HeaderComponent_Template(rf, ctx) { if (rf & 1) {
        const _r182 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Church\n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Media\n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " Series\n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Speakers\n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, " Feeds\n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 4, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HeaderComponent_Template_div_click_13_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r182); const _r181 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](17); return _r181.toggle($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "app-popover", 6, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HeaderComponent_Template_div_click_25_listener() { return ctx.onViewSettings(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "fa-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, " Settings ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HeaderComponent_Template_div_click_29_listener() { return ctx.onLogOut(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](31, "fa-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, " Log Out ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r180 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", ctx.router.url.startsWith("/church"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](23, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", ctx.router.url.startsWith("/media") || ctx.router.url.startsWith("/upload"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](24, _c1));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", ctx.router.url.startsWith("/series"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](25, _c2));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", ctx.router.url.startsWith("/speakers"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](26, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", ctx.router.url.startsWith("/feeds"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](27, _c4));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.organization.name, "\n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("x-offset", 0 - 10)("y-offset", 0 - 8)("target", _r180);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.organization.name);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.user.name);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](28, _c5));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](29, _c6));
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _common_popover_popover_component__WEBPACK_IMPORTED_MODULE_5__["PopoverComponent"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FaIconComponent"]], styles: ["[_nghost-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  display: -webkit-box;\n  display: flex;\n  color: #FFFFFF;\n  background-color: #333333;\n}\n\n.item[_ngcontent-%COMP%] {\n  cursor: pointer;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  font-size: 18px;\n  color: #FFFFFF;\n  height: 60px;\n  padding: 0px 16px;\n}\n\n.item.logo[_ngcontent-%COMP%] {\n  padding: 0;\n}\n\n.item.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  height: 100%;\n  padding: 2px 8px;\n}\n\n.item[_ngcontent-%COMP%]:hover {\n  color: #FFFFFF;\n  background-color: rgba(138, 138, 138, 0.2);\n}\n\n.item.active[_ngcontent-%COMP%] {\n  background-color: #8a8a8a;\n}\n\n.spacer[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n\n.popover-section[_ngcontent-%COMP%] {\n  width: 240px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL2hlYWRlci9oZWFkZXIuY29tcG9uZW50LnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX3ZhcmlhYmxlcy5zY3NzIiwic3JjL2FwcC9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0Esb0JBQUE7RUFBQSxhQUFBO0VBQ0EsY0NGVTtFREdWLHlCQ0ZVO0FDQ2Q7O0FGSUE7RUFDSSxlQUFBO0VBQ0Esb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLGVBQUE7RUFDQSxjQ1hVO0VEWVYsWUFBQTtFQUNBLGlCQUFBO0FFREo7O0FGR0k7RUFDSSxVQUFBO0FFRFI7O0FGRVE7RUFDSSxZQUFBO0VBQ0EsZ0JBQUE7QUVBWjs7QUZJSTtFQUNJLGNDeEJNO0VEeUJOLDBDQUFBO0FFRlI7O0FGS0k7RUFDSSx5QkMxQks7QUN1QmI7O0FGT0E7RUFDSSxtQkFBQTtVQUFBLGNBQUE7QUVKSjs7QUZPQTtFQUNJLFlBQUE7QUVKSiIsImZpbGUiOiJzcmMvYXBwL2hlYWRlci9oZWFkZXIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0IFwiLi4vLi4vc2Nzcy92YXJpYWJsZXNcIjtcblxuOmhvc3Qge1xuICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgY29sb3I6ICR0aGVtZS13aGl0ZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtYmxhY2s7XG59XG5cbi5pdGVtIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICBjb2xvcjogJHRoZW1lLXdoaXRlO1xuICAgIGhlaWdodDogNjBweDtcbiAgICBwYWRkaW5nOiAwcHggMTZweDtcblxuICAgICYubG9nbyB7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICAgIGltZyB7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBwYWRkaW5nOiAycHggOHB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJjpob3ZlciB7XG4gICAgICAgIGNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50aXplKCR0aGVtZS1ncmF5LCAwLjgpO1xuICAgIH1cblxuICAgICYuYWN0aXZlIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLWdyYXk7XG4gICAgfVxufVxuXG4uc3BhY2VyIHtcbiAgICBmbGV4OiAxIDEgYXV0bztcbn1cblxuLnBvcG92ZXItc2VjdGlvbiB7XG4gICAgd2lkdGg6IDI0MHB4O1xufVxuIiwiLy8gaHR0cHM6Ly9jb2xvcmh1bnQuY28vcGFsZXR0ZS8xNTcxMThcblxuLy8gQ29sb3JzXG4kdGhlbWUtd2hpdGU6ICNGRkZGRkY7XG4kdGhlbWUtYmxhY2s6ICMzMzMzMzM7XG4kdGhlbWUtZ3JheS1kYXJrOiByZWQ7XG4kdGhlbWUtZ3JheTogIzhhOGE4YTtcbiR0aGVtZS1ncmF5LWxpZ2h0OiAjZTZlNmU2O1xuJHRoZW1lLWdyYXktbGlnaHRlcjogI2Y1ZjVmNTtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXN0OiAjZmRmZGZkO1xuJHRoZW1lLWdyYXktYm9yZGVyOiAkdGhlbWUtZ3JheS1saWdodDtcblxuJHRoZW1lLXByaW1hcnk6ICMzM2JlZmY7XG5cbiR0aGVtZS1zdWNjZXNzOiAjNDJDNzVEO1xuJHRoZW1lLWRhbmdlcjogI0ZBM0UzOTtcbiR0aGVtZS13YXJuaW5nOiAjRkZDMjAwO1xuXG4vLyBGb250cyBhbmQgVGV4dFxuJGZvbnQtZmFtaWx5OiBwcm94aW1hLW5vdmEsIFwiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcblxuJGZvbnQtc2l6ZS1zbWFsbDogMC44NzVyZW07XG4kZm9udC1zaXplLW1lZGl1bTogMXJlbTtcbiRmb250LXNpemUtbGFyZ2U6IDEuNXJlbTtcblxuLy8gTGF5b3V0XG4kYm9yZGVyLXJhZGl1czogNHB4O1xuIiwiOmhvc3Qge1xuICBmbGV4OiAxIDEgYXV0bztcbiAgZGlzcGxheTogZmxleDtcbiAgY29sb3I6ICNGRkZGRkY7XG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzMzMzM7XG59XG5cbi5pdGVtIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmb250LXNpemU6IDE4cHg7XG4gIGNvbG9yOiAjRkZGRkZGO1xuICBoZWlnaHQ6IDYwcHg7XG4gIHBhZGRpbmc6IDBweCAxNnB4O1xufVxuLml0ZW0ubG9nbyB7XG4gIHBhZGRpbmc6IDA7XG59XG4uaXRlbS5sb2dvIGltZyB7XG4gIGhlaWdodDogMTAwJTtcbiAgcGFkZGluZzogMnB4IDhweDtcbn1cbi5pdGVtOmhvdmVyIHtcbiAgY29sb3I6ICNGRkZGRkY7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTM4LCAxMzgsIDEzOCwgMC4yKTtcbn1cbi5pdGVtLmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICM4YThhOGE7XG59XG5cbi5zcGFjZXIge1xuICBmbGV4OiAxIDEgYXV0bztcbn1cblxuLnBvcG92ZXItc2VjdGlvbiB7XG4gIHdpZHRoOiAyNDBweDtcbn0iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](HeaderComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-header',
                templateUrl: './header.component.html',
                styleUrls: ['./header.component.scss']
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] }, { type: _services_state_service__WEBPACK_IMPORTED_MODULE_2__["StateService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/media/media-detail/media-detail.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/media/media-detail/media-detail.component.ts ***!
  \**************************************************************/
/*! exports provided: MediaDetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaDetailComponent", function() { return MediaDetailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _classes_utility__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @classes/utility */ "./src/app/_classes/utility.ts");
/* harmony import */ var _services_app_managers_series_manager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @services/app/managers/series.manager */ "./src/app/_services/app/managers/series.manager.ts");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! primeng/dialog */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-dialog.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/api */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-api.js");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");
/* harmony import */ var _media_form_media_form_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../media-form/media-form.component */ "./src/app/media/media-form/media-form.component.ts");
/* harmony import */ var _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @common/copy-box/copy-box.component */ "./src/app/_common/copy-box/copy-box.component.ts");
/* harmony import */ var _common_video_player_video_player_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @common/video-player/video-player.component */ "./src/app/_common/video-player/video-player.component.ts");























function MediaDetailComponent_ng_container_4_div_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "app-video-player", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("url", ctx_r37.media.status === 3 ? ctx_r37.videoPlayerUrl : undefined)("error", ctx_r37.media.status === 0 ? "Your media is currently uploading." : ctx_r37.media.status === 4 ? "Please upload your media content again." : "Preview will be available once your media is finished processing.");
} }
function MediaDetailComponent_ng_container_4_div_24_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Video Links");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Video Player");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "app-copy-box", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Video Stream");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "app-copy-box", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Video File (Shareable)");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "app-copy-box", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Video File (Full Resolution)");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "app-copy-box", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r38.videoPlayerUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r38.videoStreamUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r38.videoFileDefaultUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r38.videoFileSourceUrl);
} }
const _c0 = function () { return ["fad", "cloud-upload"]; };
function MediaDetailComponent_ng_container_4_ng_container_48_Template(rf, ctx) { if (rf & 1) {
    const _r44 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "button", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaDetailComponent_ng_container_4_ng_container_48_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r44); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](40); return _r39.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Upload File ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
} }
function MediaDetailComponent_ng_container_4_ng_container_49_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Uploading Caption File");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r41.uploading.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", ctx_r41.progress * 100, "%");
} }
function MediaDetailComponent_ng_container_4_div_50_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Caption Links");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "English");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "app-copy-box", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r42.captionUrl);
} }
const _c1 = function (a1) { return ["fad", a1]; };
const _c2 = function () { return ["fad", "trash"]; };
function MediaDetailComponent_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    const _r46 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "fa-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](11, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](12, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "app-media-form", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("mediaChange", function MediaDetailComponent_ng_container_4_Template_app_media_form_mediaChange_13_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r46); const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r45.onMediaChange($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](18, MediaDetailComponent_ng_container_4_div_18_Template, 4, 2, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Hash Id");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](23, "app-copy-box", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](24, MediaDetailComponent_ng_container_4_div_24_Template, 16, 4, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "Audio Links");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Audio File");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](31, "app-copy-box", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "Captions");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "input", 25, 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function MediaDetailComponent_ng_container_4_Template_input_change_39_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r46); const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](40); const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); ctx_r47.onCaptionFileSelected($event); return _r39.value = null; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "Upload a caption file for this media.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "File must be in ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46, ".vtt");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, " format.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](48, MediaDetailComponent_ng_container_4_ng_container_48_Template, 4, 2, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](49, MediaDetailComponent_ng_container_4_ng_container_49_Template, 7, 3, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](50, MediaDetailComponent_ng_container_4_div_50_Template, 7, 1, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "Danger Zone");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, "Replace Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "Upload a new version of this media. This will replace the content but keep the same unique URLs for the video and audio files.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, "NOTE:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65, " Uploaded media will need to be processed before it is available for streaming and download.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "button", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaDetailComponent_ng_container_4_Template_button_click_66_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r46); const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r48.onReplaceMedia(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](67, "fa-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](68, "Replace Media ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](71, "Delete Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](73, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](74, "Permanently delete this media including all video and audio files.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](75, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](76, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](77, "NOTE:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](78, " This will delete the media record and remove it from all feeds. Video and audio files will be deleted within 24 hours.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](79, "button", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaDetailComponent_ng_container_4_Template_button_click_79_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r46); const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r49.deleteDialogVisible = true; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](80, "fa-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](81, "Delete Media ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"](" ", ctx_r36.series ? (ctx_r36.series.name || "Untitled") + " - " : "", "", ctx_r36.media.name || "Untitled", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"](ctx_r36.Utility.StatusToClass(ctx_r36.media.status));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](25, _c1, ctx_r36.Utility.StatusToIcon(ctx_r36.media.status)));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r36.Utility.StatusToText(ctx_r36.media.status), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](11, 19, ctx_r36.media.date, "mediumDate"), " - ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](12, 22, ctx_r36.media.date, "EEEE h:mm a"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("media", ctx_r36.media);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r36.media.type === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r36.hash);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r36.media.type === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r36.audioFileUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r36.uploading);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r36.uploading);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r36.captionUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](27, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](28, _c2));
} }
const _c3 = function () { return ["/media"]; };
const _c4 = function () { return ["fad", "chevron-left"]; };
const _c5 = function () { return { width: "480px" }; };
class MediaDetailComponent {
    constructor(app, route, router, notifications, http) {
        this.app = app;
        this.route = route;
        this.router = router;
        this.notifications = notifications;
        this.http = http;
        this.Utility = _classes_utility__WEBPACK_IMPORTED_MODULE_4__["Utility"];
        this.loading = true;
        this.deleteDialogVisible = false;
        this.deleting = false;
    }
    ngOnInit() {
        const id = parseInt(this.route.snapshot.params.id);
        const hash = this.app.hashids.encode(id);
        const captionUrl = `https://hopestream.s3.amazonaws.com/media/${hash}/captions-en.vtt?t=${new Date().valueOf()}`;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["forkJoin"])(this.app.API.getMedia(id), this.http.get(captionUrl, { responseType: 'blob' }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["of"])(undefined)))).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.loading = false;
        })).subscribe(responses => {
            this.media = responses[0];
            this.series = this.media.seriesId ? _services_app_managers_series_manager__WEBPACK_IMPORTED_MODULE_5__["SeriesManager"].sharedInstance.series.find(o => o.id === this.media.seriesId) : undefined;
            this.hash = hash;
            this.videoPlayerUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_8__["environment"].playerUrl}?id=${this.hash}`;
            this.videoStreamUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_8__["environment"].staticUrl}media/${this.hash}/master.m3u8`;
            this.videoFileDefaultUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_8__["environment"].staticUrl}media/${this.hash}/video-default.mp4`;
            this.videoFileSourceUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_8__["environment"].staticUrl}media/${this.hash}/video-source.mp4`;
            this.audioFileUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_8__["environment"].staticUrl}media/${this.hash}/audio.mp3`;
            this.captionUrl = responses[1] ? `${_environments_environment__WEBPACK_IMPORTED_MODULE_8__["environment"].staticUrl}media/${this.hash}/captions-en.vtt` : undefined;
        });
    }
    onMediaChange(media) {
        this.media = media;
        this.series = media.seriesId ? _services_app_managers_series_manager__WEBPACK_IMPORTED_MODULE_5__["SeriesManager"].sharedInstance.series.find(o => o.id === media.seriesId) : undefined;
    }
    onReplaceMedia() {
        this.router.navigate(['/upload', this.media.id]);
    }
    onDelete() {
        this.deleting = true;
        this.app.API.deleteMedia(this.media).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.deleting = false;
        })).subscribe(() => {
            this.router.navigate(['/media']);
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem deleting.');
        });
    }
    onCaptionFileSelected(event) {
        var _a, _b;
        let file = ((_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length) && event.target.files[0] || undefined;
        if (!file) {
            return;
        }
        this.uploading = file;
        this.progress = 0;
        this.app.API.uploadCaptionFileForMedia(this.media, file, progress => {
            this.progress = progress;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.uploading = undefined;
            this.progress = 1;
        })).subscribe(() => {
            this.notifications.success('Success', 'Caption file uploaded.', { timeOut: 5000 });
            this.captionUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_8__["environment"].staticUrl}media/${this.hash}/captions-en.vtt`;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem uploading.');
        });
    }
}
MediaDetailComponent.ɵfac = function MediaDetailComponent_Factory(t) { return new (t || MediaDetailComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_6__["NotificationsService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HttpClient"])); };
MediaDetailComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: MediaDetailComponent, selectors: [["app-media-detail"]], decls: 26, vars: 16, consts: [[1, "breadcrumb-container"], [3, "routerLink"], [3, "icon"], [4, "ngIf"], [3, "visible", "modal", "dismissableMask", "draggable", "visibleChange"], [1, "title"], [3, "icon", "click"], [2, "margin-top", "1rem"], [1, "button", "alert", 3, "disabled", "click"], [1, "button", "secondary", "hollow", 3, "click"], [1, "spacer"], [1, "header-container"], [1, "subtitle"], [1, "status"], [1, "date"], [3, "media", "mediaChange"], [1, "content-section"], [1, "image-content-container"], ["class", "image-content-row", 4, "ngIf"], [1, "image-content-row"], [1, "image-content-col"], [1, "label"], [3, "text"], [1, "image-content-col", "image-content-col-third"], [1, "image-upload-container"], ["type", "file", "accept", "text/vtt", 2, "display", "none", 3, "change"], ["input", ""], [1, "content-section", "content-section-danger"], [1, "image-content-col", "image-content-col-half"], [1, "button", 3, "click"], [1, "button", "alert", 3, "click"], [3, "url", "error"], [1, "upload-name"], [1, "progress-bar-container"], [1, "progress-bar"]], template: function MediaDetailComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Back to Media ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, MediaDetailComponent_ng_container_4_Template, 82, 29, "ng-container", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p-dialog", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("visibleChange", function MediaDetailComponent_Template_p_dialog_visibleChange_5_listener($event) { return ctx.deleteDialogVisible = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Delete Media");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "app-action-icon", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaDetailComponent_Template_app_action_icon_click_9_listener() { return ctx.deleteDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Permanently delete ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "?");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "NOTE:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, " This will delete the media record and remove it from all feeds. Video and audio files will be deleted within 24 hours.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "p-footer");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaDetailComponent_Template_button_click_21_listener() { return ctx.onDelete(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Delete");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaDetailComponent_Template_button_click_23_listener() { return ctx.deleteDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](13, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](14, _c4));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](15, _c5));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("visible", ctx.deleteDialogVisible)("modal", true)("dismissableMask", true)("draggable", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", "times");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", ctx.series ? (ctx.series.name || "Untitled") + " - " : "", "", (ctx.media == null ? null : ctx.media.name) || "Untitled", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.deleting);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLinkWithHref"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_10__["FaIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], primeng_dialog__WEBPACK_IMPORTED_MODULE_12__["Dialog"], primeng_api__WEBPACK_IMPORTED_MODULE_13__["Header"], _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_14__["ActionIconComponent"], primeng_api__WEBPACK_IMPORTED_MODULE_13__["Footer"], _media_form_media_form_component__WEBPACK_IMPORTED_MODULE_15__["MediaFormComponent"], _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_16__["CopyBoxComponent"], _common_video_player_video_player_component__WEBPACK_IMPORTED_MODULE_17__["VideoPlayerComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_11__["DatePipe"]], styles: [".breadcrumb-container[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n\n.header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin-bottom: 2.5rem;\n}\n\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n\n.content-section[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  padding: 32px;\n  margin-bottom: 1rem;\n}\n\n.content-section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  line-height: 1;\n  margin-bottom: 1.5rem;\n}\n\n.content-section.content-section-danger[_ngcontent-%COMP%] {\n  background-color: #fffbfb;\n  border-color: #FA3E39;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:first-child) {\n  padding-left: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:last-child) {\n  padding-right: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\nform[_ngcontent-%COMP%]     input {\n  margin-bottom: 0;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #e6e6e6;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #e6e6e6;\n}\n\nform[_ngcontent-%COMP%]   .include-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\nform[_ngcontent-%COMP%]   .topic-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]:not(:last-child) {\n  margin-bottom: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding: 0px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:first-child {\n  margin-left: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:last-child {\n  margin-right: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   app-copy-box[_ngcontent-%COMP%]:not(:last-child) {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-half[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-third[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 33%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .upload-name[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  width: 100%;\n  height: 0.5rem;\n  margin-top: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #33beff;\n  border-radius: 4px;\n  -webkit-transition: width 0.1s linear;\n  transition: width 0.1s linear;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  width: 100%;\n  padding-top: calc((9 / 16) * 100%);\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   .image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-selector[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 0.25rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL21lZGlhL21lZGlhLWRldGFpbC9tZWRpYS1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21lZGlhL21lZGlhLWRldGFpbC9tZWRpYS1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX21peGlucy5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTtFQUNJLHFCQUFBO0FDRko7O0FES0E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSw0QkFBQTtFQUFBLDZCQUFBO1VBQUEsc0JBQUE7RUFDQSxxQkFBQTtBQ0ZKOztBRElJO0VFTEEsZUFBQTtFQUNBLGdCQUFBO0FESUo7O0FESUk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDRlI7O0FESVE7RUFDSSxvQkFBQTtBQ0ZaOztBRE9BO0VBQ0kseUJHeEJVO0VIeUJWLHlCQUFBO0VBQ0Esa0JHSFk7RUhJWixhQUFBO0VBQ0EsbUJBQUE7QUNKSjs7QURNSTtFRXJCQSxlQUFBO0VBQ0EsZ0JBQUE7RUZzQkksY0FBQTtFQUNBLHFCQUFBO0FDSFI7O0FETUk7RUFDSSx5QkFBQTtFQUNBLHFCRzFCTztBRnNCZjs7QURTSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtBQ05SOztBRFFRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ05aOztBRFFZO0VBQ0ksb0JBQUE7QUNOaEI7O0FEUVk7RUFDSSxxQkFBQTtBQ05oQjs7QURXSTtFQUNJLG1CQUFBO0FDVFI7O0FEWUk7RUVqREEseUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQ2RTO0VEZVQsa0JBQUE7QUR3Q0o7O0FEU0k7RUFDSSxnQkFBQTtBQ1BSOztBRFVJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtBQ1JSOztBRFVRO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHFCQUFBO1VBQUEseUJBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7QUNSWjs7QURVWTtFQUNJLHlCR2pGRztBRnlFbkI7O0FEYUk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDWFI7O0FEYVE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EscUJBQUE7VUFBQSx5QkFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtBQ1haOztBRGFZO0VBQ0kseUJHcEdHO0FGeUZuQjs7QURnQkk7RUFDSSxnQkFBQTtBQ2RSOztBRGdCSTtFQUNJLGdCQUFBO0FDZFI7O0FEbUJJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0FDaEJSOztBRGtCUTtFQUNJLHFCQUFBO0FDaEJaOztBRG1CUTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtFQUNBLGdCQUFBO0FDakJaOztBRG1CWTtFQUNJLGlCQUFBO0FDakJoQjs7QURtQlk7RUFDSSxrQkFBQTtBQ2pCaEI7O0FEb0JZO0VFMUhSLHlCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0NkUztFRGVULGtCQUFBO0FEeUdKOztBRGdCWTtFQUNJLGNBQUE7RUFDQSxtQkFBQTtBQ2RoQjs7QURpQlE7RUFDSSxtQkFBQTtVQUFBLGNBQUE7RUFDQSxVQUFBO0FDZlo7O0FEaUJRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ2ZaOztBRGtCUTtFQUNJLGdCQUFBO0FDaEJaOztBRHFCUTtFQUNJLGdCQUFBO0FDbkJaOztBRHFCUTtFQUNJLGtCQUFBO0FDbkJaOztBRHFCUTtFQUNJLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSx1QkFBQTtBQ25CWjs7QURxQlE7RUFDSSxrQkFBQTtFQUNBLHlCR3ZLUztFSHdLVCxrQkd0Skk7RUh1SkosV0FBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtBQ25CWjs7QURxQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsT0FBQTtFQUFTLFNBQUE7RUFDckMseUJHM0tJO0VINEtKLGtCRzlKSTtFSCtKSixxQ0FBQTtFQUFBLDZCQUFBO0FDaEJaOztBRG9CSTtFQUNJLGtCQUFBO0VBQ0EseUJHdkxhO0VId0xiLFdBQUE7RUFDQSxrQ0FBQTtBQ2xCUjs7QURvQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsUUFBQTtFQUFVLE9BQUE7QUNmbEQ7O0FEa0JRO0VBQ0ksa0JBQUE7RUFBb0IsTUFBQTtFQUFRLFNBQUE7RUFBVyxRQUFBO0VBQVUsT0FBQTtFQUNqRCxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtBQ1paOztBRGdCSTtFQUNJLFdBQUE7RUFDQSxtQkFBQTtBQ2RSIiwiZmlsZSI6InNyYy9hcHAvbWVkaWEvbWVkaWEtZGV0YWlsL21lZGlhLWRldGFpbC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgXCIuLi8uLi8uLi9zY3NzL3ZhcmlhYmxlc1wiO1xuQGltcG9ydCBcIi4uLy4uLy4uL3Njc3MvbWl4aW5zXCI7XG5cbi5icmVhZGNydW1iLWNvbnRhaW5lciB7XG4gICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIGhlYWRlci1mb250KCk7XG4gICAgfVxuXG4gICAgLnN1YnRpdGxlIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc3RhdHVzIHtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMC41cmVtO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uY29udGVudC1zZWN0aW9uIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgJHRoZW1lLWdyYXktYm9yZGVyO1xuICAgIGJvcmRlci1yYWRpdXM6ICRib3JkZXItcmFkaXVzO1xuICAgIHBhZGRpbmc6IDMycHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIHRpdGxlLWZvbnQoKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbiAgICB9XG5cbiAgICAmLmNvbnRlbnQtc2VjdGlvbi1kYW5nZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGVuKCR0aGVtZS1kYW5nZXIsIDM5JSk7XG4gICAgICAgIGJvcmRlci1jb2xvcjogJHRoZW1lLWRhbmdlcjtcbiAgICB9XG59XG5cbmZvcm0ge1xuICAgIC5jb2x1bW4tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAuY29sdW1uIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDUwJTtcblxuICAgICAgICAgICAgJjpub3QoOmZpcnN0LWNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAwLjVyZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAmOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDAuNXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5pbnB1dC1jb250YWluZXIge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgIH1cblxuICAgIC5sYWJlbCB7XG4gICAgICAgIEBpbmNsdWRlIGxhYmVsLWZvbnQoKTtcbiAgICB9XG5cbiAgICA6Om5nLWRlZXAgaW5wdXQge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgIH1cblxuICAgIC5zZXJpZXMtaXRlbS1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIC5zZXJpZXMtaXRlbS1pbWFnZSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgd2lkdGg6IDEwMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA1NnB4O1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuXG4gICAgICAgICAgICAmLnBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc3BlYWtlci1pdGVtLWltYWdlIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB3aWR0aDogMTAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDU2cHg7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG5cbiAgICAgICAgICAgICYucGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmluY2x1ZGUtaXRlbS1sYWJlbCB7XG4gICAgICAgIHBhZGRpbmc6IDRweCA4cHg7XG4gICAgfVxuICAgIC50b3BpYy1pdGVtLWxhYmVsIHtcbiAgICAgICAgcGFkZGluZzogNHB4IDhweDtcbiAgICB9XG59XG5cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciB7XG4gICAgLmltYWdlLWNvbnRlbnQtcm93IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAmOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuICAgICAgICB9XG5cbiAgICAgICAgLmltYWdlLWNvbnRlbnQtY29sIHtcbiAgICAgICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICAgICAgcGFkZGluZzogMHB4IDhweDtcblxuICAgICAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IC04cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogLThweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmxhYmVsIHtcbiAgICAgICAgICAgICAgICBAaW5jbHVkZSBsYWJlbC1mb250KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcHAtY29weS1ib3g6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAuaW1hZ2UtY29udGVudC1jb2wtaGFsZiB7XG4gICAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcbiAgICAgICAgICAgIHdpZHRoOiA1MCU7XG4gICAgICAgIH1cbiAgICAgICAgLmltYWdlLWNvbnRlbnQtY29sLXRoaXJkIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDMzJTtcbiAgICAgICAgfVxuXG4gICAgICAgIC50aXRsZSB7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAycmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmltYWdlLXVwbG9hZC1jb250YWluZXIge1xuICAgICAgICAuYnV0dG9uIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgICAgIH1cbiAgICAgICAgLmxhYmVsIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDEuNXJlbTtcbiAgICAgICAgfVxuICAgICAgICAudXBsb2FkLW5hbWUge1xuICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgICAgfVxuICAgICAgICAucHJvZ3Jlc3MtYmFyLWNvbnRhaW5lciB7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVyO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMC41cmVtO1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMC41cmVtO1xuICAgICAgICB9XG4gICAgICAgIC5wcm9ncmVzcy1iYXIge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGJvdHRvbTogMDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1wcmltYXJ5O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAwLjFzIGxpbmVhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5pbWFnZS1jb250YWluZXIge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nLXRvcDogY2FsYygoOSAvIDE2KSAqIDEwMCUpO1xuXG4gICAgICAgIGltZyB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgcmlnaHQ6IDA7IGxlZnQ6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAuaW1hZ2UtcGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGJvdHRvbTogMDsgcmlnaHQ6IDA7IGxlZnQ6IDA7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmltYWdlLXNlbGVjdG9yIC5idXR0b24ge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWFyZ2luLXRvcDogMC4yNXJlbTtcbiAgICB9XG59IiwiLmJyZWFkY3J1bWItY29udGFpbmVyIHtcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcbn1cbi5oZWFkZXItY29udGFpbmVyIC50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMzJweDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbn1cbi5oZWFkZXItY29udGFpbmVyIC5zdWJ0aXRsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4uaGVhZGVyLWNvbnRhaW5lciAuc3VidGl0bGUgLnN0YXR1cyB7XG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xufVxuXG4uY29udGVudC1zZWN0aW9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgYm9yZGVyOiAxcHggc29saWQgI2U2ZTZlNjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBwYWRkaW5nOiAzMnB4O1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuLmNvbnRlbnQtc2VjdGlvbiAudGl0bGUge1xuICBmb250LXNpemU6IDI0cHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG59XG4uY29udGVudC1zZWN0aW9uLmNvbnRlbnQtc2VjdGlvbi1kYW5nZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmYmZiO1xuICBib3JkZXItY29sb3I6ICNGQTNFMzk7XG59XG5cbmZvcm0gLmNvbHVtbi1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuZm9ybSAuY29sdW1uLWNvbnRhaW5lciAuY29sdW1uIHtcbiAgZmxleDogMCAwIGF1dG87XG4gIHdpZHRoOiA1MCU7XG59XG5mb3JtIC5jb2x1bW4tY29udGFpbmVyIC5jb2x1bW46bm90KDpmaXJzdC1jaGlsZCkge1xuICBwYWRkaW5nLWxlZnQ6IDAuNXJlbTtcbn1cbmZvcm0gLmNvbHVtbi1jb250YWluZXIgLmNvbHVtbjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgcGFkZGluZy1yaWdodDogMC41cmVtO1xufVxuZm9ybSAuaW5wdXQtY29udGFpbmVyIHtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cbmZvcm0gLmxhYmVsIHtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBjb2xvcjogIzhhOGE4YTtcbiAgbWFyZ2luLWJvdHRvbTogMnB4O1xufVxuZm9ybSA6Om5nLWRlZXAgaW5wdXQge1xuICBtYXJnaW4tYm90dG9tOiAwO1xufVxuZm9ybSAuc2VyaWVzLWl0ZW0tY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmZvcm0gLnNlcmllcy1pdGVtLWNvbnRhaW5lciAuc2VyaWVzLWl0ZW0taW1hZ2Uge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB3aWR0aDogMTAwcHg7XG4gIGhlaWdodDogNTZweDtcbiAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xufVxuZm9ybSAuc2VyaWVzLWl0ZW0tY29udGFpbmVyIC5zZXJpZXMtaXRlbS1pbWFnZS5wbGFjZWhvbGRlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlNmU2ZTY7XG59XG5mb3JtIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmZvcm0gLnNwZWFrZXItaXRlbS1jb250YWluZXIgLnNwZWFrZXItaXRlbS1pbWFnZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAxMDBweDtcbiAgaGVpZ2h0OiA1NnB4O1xuICBtYXJnaW4tcmlnaHQ6IDFyZW07XG59XG5mb3JtIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIC5zcGVha2VyLWl0ZW0taW1hZ2UucGxhY2Vob2xkZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTZlNmU2O1xufVxuZm9ybSAuaW5jbHVkZS1pdGVtLWxhYmVsIHtcbiAgcGFkZGluZzogNHB4IDhweDtcbn1cbmZvcm0gLnRvcGljLWl0ZW0tbGFiZWwge1xuICBwYWRkaW5nOiA0cHggOHB4O1xufVxuXG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IHtcbiAgZGlzcGxheTogZmxleDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3c6bm90KDpsYXN0LWNoaWxkKSB7XG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sIHtcbiAgZmxleDogMSAxIGF1dG87XG4gIHBhZGRpbmc6IDBweCA4cHg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbDpmaXJzdC1jaGlsZCB7XG4gIG1hcmdpbi1sZWZ0OiAtOHB4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2w6bGFzdC1jaGlsZCB7XG4gIG1hcmdpbi1yaWdodDogLThweDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sIC5sYWJlbCB7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgY29sb3I6ICM4YThhOGE7XG4gIG1hcmdpbi1ib3R0b206IDJweDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sIGFwcC1jb3B5LWJveDpub3QoOmxhc3QtY2hpbGQpIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbC1oYWxmIHtcbiAgZmxleDogMCAwIGF1dG87XG4gIHdpZHRoOiA1MCU7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbC10aGlyZCB7XG4gIGZsZXg6IDAgMCBhdXRvO1xuICB3aWR0aDogMzMlO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAudGl0bGUge1xuICBtYXJnaW4tdG9wOiAycmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5idXR0b24ge1xuICBtYXJnaW4tdG9wOiAxcmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5sYWJlbCB7XG4gIG1hcmdpbi10b3A6IDEuNXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAudXBsb2FkLW5hbWUge1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAucHJvZ3Jlc3MtYmFyLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAwLjVyZW07XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAucHJvZ3Jlc3MtYmFyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzYmVmZjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB0cmFuc2l0aW9uOiB3aWR0aCAwLjFzIGxpbmVhcjtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xuICB3aWR0aDogMTAwJTtcbiAgcGFkZGluZy10b3A6IGNhbGMoKDkgLyAxNikgKiAxMDAlKTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIGltZyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgbGVmdDogMDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIC5pbWFnZS1wbGFjZWhvbGRlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwO1xuICBsZWZ0OiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2Utc2VsZWN0b3IgLmJ1dHRvbiB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xufSIsIkBpbXBvcnQgXCJ2YXJpYWJsZXNcIjtcblxuQG1peGluIHNoYWRvdygpIHtcbiAgICBib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xufVxuXG5AbWl4aW4gaGVhZGVyLWZvbnQoKSB7XG4gICAgZm9udC1zaXplOiAzMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XG59XG5cbkBtaXhpbiB0aXRsZS1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xufVxuXG5AbWl4aW4gbGFiZWwtZm9udCgpIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGNvbG9yOiAkdGhlbWUtZ3JheTtcbiAgICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG4iLCIvLyBodHRwczovL2NvbG9yaHVudC5jby9wYWxldHRlLzE1NzExOFxuXG4vLyBDb2xvcnNcbiR0aGVtZS13aGl0ZTogI0ZGRkZGRjtcbiR0aGVtZS1ibGFjazogIzMzMzMzMztcbiR0aGVtZS1ncmF5LWRhcms6IHJlZDtcbiR0aGVtZS1ncmF5OiAjOGE4YThhO1xuJHRoZW1lLWdyYXktbGlnaHQ6ICNlNmU2ZTY7XG4kdGhlbWUtZ3JheS1saWdodGVyOiAjZjVmNWY1O1xuJHRoZW1lLWdyYXktbGlnaHRlc3Q6ICNmZGZkZmQ7XG4kdGhlbWUtZ3JheS1ib3JkZXI6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuXG4kdGhlbWUtcHJpbWFyeTogIzMzYmVmZjtcblxuJHRoZW1lLXN1Y2Nlc3M6ICM0MkM3NUQ7XG4kdGhlbWUtZGFuZ2VyOiAjRkEzRTM5O1xuJHRoZW1lLXdhcm5pbmc6ICNGRkMyMDA7XG5cbi8vIEZvbnRzIGFuZCBUZXh0XG4kZm9udC1mYW1pbHk6IHByb3hpbWEtbm92YSwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuXG4kZm9udC1zaXplLXNtYWxsOiAwLjg3NXJlbTtcbiRmb250LXNpemUtbWVkaXVtOiAxcmVtO1xuJGZvbnQtc2l6ZS1sYXJnZTogMS41cmVtO1xuXG4vLyBMYXlvdXRcbiRib3JkZXItcmFkaXVzOiA0cHg7XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MediaDetailComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-media-detail',
                templateUrl: './media-detail.component.html',
                styleUrls: ['./media-detail.component.scss']
            }]
    }], function () { return [{ type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_6__["NotificationsService"] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HttpClient"] }]; }, null); })();


/***/ }),

/***/ "./src/app/media/media-form/media-form.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/media/media-form/media-form.component.ts ***!
  \**********************************************************/
/*! exports provided: MediaFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaFormComponent", function() { return MediaFormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _services_app_app_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @services/app/app.api */ "./src/app/_services/app/app.api.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _services_app_managers_series_manager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @services/app/managers/series.manager */ "./src/app/_services/app/managers/series.manager.ts");
/* harmony import */ var _services_app_managers_speaker_manager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @services/app/managers/speaker.manager */ "./src/app/_services/app/managers/speaker.manager.ts");
/* harmony import */ var _services_app_managers_feed_manager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @services/app/managers/feed.manager */ "./src/app/_services/app/managers/feed.manager.ts");
/* harmony import */ var _services_app_managers_topic_manager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @services/app/managers/topic.manager */ "./src/app/_services/app/managers/topic.manager.ts");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _services_app_managers_organization_manager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @services/app/managers/organization.manager */ "./src/app/_services/app/managers/organization.manager.ts");
/* harmony import */ var _common_form_error_form_error_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @common/form-error/form-error.component */ "./src/app/_common/form-error/form-error.component.ts");
/* harmony import */ var primeng_calendar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! primeng/calendar */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-calendar.js");
/* harmony import */ var _common_selection_box_selection_box_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @common/selection-box/selection-box.component */ "./src/app/_common/selection-box/selection-box.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
/* harmony import */ var _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @common/copy-box/copy-box.component */ "./src/app/_common/copy-box/copy-box.component.ts");
























function MediaFormComponent_ng_template_21_img_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 34);
} if (rf & 2) {
    const item_r213 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().item;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", item_r213.data.thumbnailUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function MediaFormComponent_ng_template_21_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, MediaFormComponent_ng_template_21_img_2_Template, 1, 1, "img", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r213 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("placeholder", !item_r213.data.thumbnailUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", item_r213.data.thumbnailUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r213.display);
} }
function MediaFormComponent_ng_template_27_img_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 34);
} if (rf & 2) {
    const item_r216 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().item;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", item_r216.data.thumbnailUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function MediaFormComponent_ng_template_27_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, MediaFormComponent_ng_template_27_img_2_Template, 1, 1, "img", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r216 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("placeholder", !item_r216.data.thumbnailUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", item_r216.data.thumbnailUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r216.display);
} }
function MediaFormComponent_ng_template_34_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r219 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r219.display);
} }
function MediaFormComponent_ng_template_40_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r220 = ctx.item;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r220.display);
} }
const _c0 = function () { return ["fad", "cloud-upload"]; };
function MediaFormComponent_ng_container_64_Template(rf, ctx) { if (rf & 1) {
    const _r222 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "button", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaFormComponent_ng_container_64_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r222); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r206 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](56); return _r206.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Upload Image ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
} }
function MediaFormComponent_ng_container_65_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Uploading Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r208 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r208.uploading.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", ctx_r208.progress * 100, "%");
} }
function MediaFormComponent_img_68_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 34);
} if (rf & 2) {
    const ctx_r209 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r209.imageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function MediaFormComponent_div_69_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "No image selected.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function MediaFormComponent_ng_container_70_div_4_Template(rf, ctx) { if (rf & 1) {
    const _r226 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Series Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "img", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaFormComponent_ng_container_70_div_4_Template_button_click_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r226); const ctx_r225 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r225.onSeriesImageSelected(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Select");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r223 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r223.seriesImageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r223.selectingSeries);
} }
function MediaFormComponent_ng_container_70_div_5_Template(rf, ctx) { if (rf & 1) {
    const _r228 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Church Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "img", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaFormComponent_ng_container_70_div_5_Template_button_click_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r228); const ctx_r227 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r227.onOrganizationImageSelected(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Select");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r224 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r224.organizationImageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r224.selectingOrganization);
} }
function MediaFormComponent_ng_container_70_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "or choose one:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, MediaFormComponent_ng_container_70_div_4_Template, 7, 2, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, MediaFormComponent_ng_container_70_div_5_Template, 7, 2, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r211 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r211.seriesImageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r211.organizationImageUrl);
} }
function MediaFormComponent_div_71_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Image Links");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "app-copy-box", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Thumbnail");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "app-copy-box", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r212 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r212.media.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r212.media.thumbnailUrl);
} }
const _c1 = function () { return { required: "Name is required." }; };
class MediaFormComponent {
    constructor(app, route, notifications) {
        this.app = app;
        this.route = route;
        this.notifications = notifications;
        this.mediaChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.seriesItems = [];
        this.speakerItems = [];
        this.includeItems = [];
        this.topicItems = [];
        this.lastKnownIncludeIds = [];
        this.saving = false;
        this.selectingSeries = false;
        this.selectingOrganization = false;
    }
    ngOnInit() {
        var _a;
        this.form = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroup"]({});
        this.form.addControl('name', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]));
        this.form.addControl('date', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('seriesIds', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('speakerIds', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('includeIds', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('topicIds', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('description', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        let series = _services_app_managers_series_manager__WEBPACK_IMPORTED_MODULE_6__["SeriesManager"].sharedInstance.series;
        let speakers = _services_app_managers_speaker_manager__WEBPACK_IMPORTED_MODULE_7__["SpeakerManager"].sharedInstance.speakers;
        let topics = _services_app_managers_topic_manager__WEBPACK_IMPORTED_MODULE_9__["TopicManager"].sharedInstance.topics;
        this.seriesItems = series.sort((a, b) => {
            let A = (a.name || 'Untitled').trim().toLowerCase();
            let B = (b.name || 'Untitled').trim().toLowerCase();
            return (A < B ? -1 : (A > B ? 1 : 0));
        }).map(o => {
            return {
                display: o.name || 'Untitled',
                value: o.id,
                data: o,
            };
        });
        this.speakerItems = speakers.sort((a, b) => {
            let A = (a.name || 'Untitled').trim().toLowerCase();
            let B = (b.name || 'Untitled').trim().toLowerCase();
            return (A < B ? -1 : (A > B ? 1 : 0));
        }).map(o => {
            return {
                display: o.name || 'Untitled',
                value: o.id,
                data: o,
            };
        });
        let topicsByCategory = {};
        topics.forEach(o => {
            if (!topicsByCategory[o.category]) {
                topicsByCategory[o.category] = [];
            }
            topicsByCategory[o.category].push(o);
        });
        this.topicItems = Object.keys(topicsByCategory).sort((a, b) => {
            let A = a.trim().toLowerCase();
            let B = b.trim().toLowerCase();
            return (A < B ? -1 : (A > B ? 1 : 0));
        }).map(key => {
            return topicsByCategory[key].sort((a, b) => {
                let A = (a.name || '').trim().toLowerCase();
                let B = (b.name || '').trim().toLowerCase();
                return (A < B ? -1 : (A > B ? 1 : 0));
            }).map((o, index) => {
                return {
                    display: o.name,
                    header: o.category,
                    value: o.id,
                    data: o,
                };
            });
        }).flat();
        let feeds = _services_app_managers_feed_manager__WEBPACK_IMPORTED_MODULE_8__["FeedManager"].sharedInstance.feeds.concat();
        feeds = feeds.map(o => { return Object.assign(Object.assign({}, o), { title: `${o.title || 'Untitled'} - ${o.type === 1 ? 'Audio' : 'Video'} Podcast` }); });
        feeds.push({ id: -1, title: 'HopeStream Mobile App' });
        feeds.push({ id: -2, title: 'YouTube' });
        this.includeItems = feeds.sort((a, b) => {
            let A = a.title.trim().toLowerCase();
            let B = b.title.trim().toLowerCase();
            return (A < B ? -1 : (A > B ? 1 : 0));
        }).map(o => {
            return {
                display: o.title,
                value: o.id,
                data: o,
            };
        });
        this.updateLastKnownIncludeIds();
        this.hash = this.app.hashids.encode(this.media.id);
        this.series = this.media.seriesId ? this.seriesItems.find(o => o.value === this.media.seriesId).data : undefined;
        this.form.controls.name.setValue(this.media.name);
        this.form.controls.date.setValue(this.media.date);
        this.form.controls.seriesIds.setValue(this.media.seriesId ? [this.media.seriesId] : undefined);
        this.form.controls.speakerIds.setValue(this.media.speakerIds);
        this.form.controls.includeIds.setValue(this.lastKnownIncludeIds.concat());
        this.form.controls.topicIds.setValue(this.media.topicIds);
        this.form.controls.description.setValue(this.media.description);
        const organization = _services_app_managers_organization_manager__WEBPACK_IMPORTED_MODULE_12__["OrganizationManager"].sharedInstance.organization;
        this.imageUrl = this.media.imageUrl ? `${this.media.imageUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
        this.seriesImageUrl = ((_a = this.series) === null || _a === void 0 ? void 0 : _a.thumbnailUrl) ? `${this.series.thumbnailUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
        this.organizationImageUrl = organization.thumbnailUrl ? `${organization.thumbnailUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
    }
    updateLastKnownIncludeIds() {
        let lastKnownIncludeIds = _services_app_managers_feed_manager__WEBPACK_IMPORTED_MODULE_8__["FeedManager"].sharedInstance.feeds.filter(o => o.mediaIds.indexOf(this.media.id) >= 0).map(o => o.id);
        if (!this.media.hidden) {
            lastKnownIncludeIds.unshift(-1);
        }
        if (this.media.youtubeStatus) {
            lastKnownIncludeIds.unshift(-2);
        }
        this.lastKnownIncludeIds = lastKnownIncludeIds;
    }
    onSave() {
        let series = (this.form.controls.seriesIds.value || []);
        let speakers = (this.form.controls.speakerIds.value || []);
        let topics = (this.form.controls.topicIds.value || []);
        let includes = (this.form.controls.includeIds.value || []);
        // update media
        let media = { id: this.media.id };
        media.name = this.form.controls.name.value;
        media.date = this.form.controls.date.value;
        media.description = this.form.controls.description.value || null;
        media.seriesId = series.length ? series[0] : null;
        media.speakerIds = speakers.length ? speakers : null;
        media.topicIds = topics.length ? topics : null;
        media.hidden = (includes.indexOf(-1) < 0);
        // very carefully determine if the youtube status needs to be updated
        const willIncludeInYouTube = !!includes.filter(o => o === -2).length;
        const didIncludeInYouTube = !!this.lastKnownIncludeIds.filter(o => o === -2).length;
        if (willIncludeInYouTube !== didIncludeInYouTube) {
            media.youtubeStatus = willIncludeInYouTube ? (this.media.youtubeId ? 'complete' : 'queued') : null;
            console.log("YouTube Status Changed: ", willIncludeInYouTube ? (this.media.youtubeId ? 'complete' : 'queued') : null);
        }
        if (willIncludeInYouTube) {
            media.youtubeMetadataUpdate = true;
        }
        // update feeds
        let before = this.lastKnownIncludeIds.filter(o => o >= 0);
        let after = includes.filter(o => o >= 0);
        let remove = before.filter(o => after.indexOf(o) < 0);
        let add = after.filter(o => before.indexOf(o) < 0);
        let updates = remove.map(o => {
            return this.app.API.removeMediaIdFromFeed({ id: o }, this.media.id);
        }).concat(add.map(o => {
            return this.app.API.addMediaIdToFeed({ id: o }, this.media.id);
        }));
        if (!updates.length) {
            updates = [Object(rxjs__WEBPACK_IMPORTED_MODULE_11__["of"])(1).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(() => { }))];
        }
        this.saving = true;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_11__["forkJoin"])(this.app.API.updateMedia(media), updates).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.saving = false;
        })).subscribe(responses => {
            var _a;
            remove.forEach(o => {
                let feed = _services_app_managers_feed_manager__WEBPACK_IMPORTED_MODULE_8__["FeedManager"].sharedInstance.feeds.find(feed => feed.id === o);
                feed.mediaIds = feed.mediaIds.filter(o => o !== this.media.id);
            });
            add.forEach(o => {
                let feed = _services_app_managers_feed_manager__WEBPACK_IMPORTED_MODULE_8__["FeedManager"].sharedInstance.feeds.find(feed => feed.id === o);
                feed.mediaIds.push(this.media.id);
            });
            this.media = responses[0];
            this.series = this.media.seriesId ? this.seriesItems.find(o => o.value === this.media.seriesId).data : undefined;
            this.seriesImageUrl = ((_a = this.series) === null || _a === void 0 ? void 0 : _a.thumbnailUrl) ? `${this.series.thumbnailUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
            this.updateLastKnownIncludeIds();
            this.mediaChange.emit(this.media);
            this.notifications.success('Success', 'Media details saved successfully.', { timeOut: 5000 });
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem saving.');
        });
    }
    onImageSelected(event) {
        var _a, _b;
        let file = ((_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length) && event.target.files[0] || undefined;
        if (!file) {
            return;
        }
        this.uploading = file;
        this.progress = 0;
        this.app.API.uploadImageForMedia(this.media, file, progress => {
            this.progress = progress;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.uploading = undefined;
            this.progress = 1;
        })).subscribe(media => {
            this.notifications.success('Success', 'Media image updated.', { timeOut: 5000 });
            this.media = media;
            this.imageUrl = this.media.imageUrl ? `${this.media.imageUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem uploading.');
        });
    }
    onSeriesImageSelected() {
        this.selectingSeries = true;
        this.app.API.setMediaImageToSeries(this.media, this.series).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.selectingSeries = false;
        })).subscribe(media => {
            this.notifications.success('Success', 'Media image updated.', { timeOut: 5000 });
            this.media = media;
            this.imageUrl = this.media.imageUrl ? `${this.media.imageUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem updating.');
        });
    }
    onOrganizationImageSelected() {
        this.selectingOrganization = true;
        this.app.API.setMediaImageToOrganization(this.media, _services_app_managers_organization_manager__WEBPACK_IMPORTED_MODULE_12__["OrganizationManager"].sharedInstance.organization).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.selectingOrganization = false;
        })).subscribe(media => {
            this.notifications.success('Success', 'Media image updated.', { timeOut: 5000 });
            this.media = media;
            this.imageUrl = this.media.imageUrl ? `${this.media.imageUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem updating.');
        });
    }
}
MediaFormComponent.ɵfac = function MediaFormComponent_Factory(t) { return new (t || MediaFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_10__["NotificationsService"])); };
MediaFormComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: MediaFormComponent, selectors: [["app-media-form"]], inputs: { media: "media" }, outputs: { mediaChange: "mediaChange" }, decls: 72, vars: 38, consts: [[1, "content-section"], [1, "title"], [3, "formGroup"], [1, "column-container"], [1, "column"], [1, "input-container"], [1, "label"], [1, "required"], ["type", "text", 3, "formControlName", "placeholder"], [3, "control", "messages"], [3, "formControlName", "showTime", "hourFormat", "placeholder"], [3, "items", "max", "itemTemplate", "formControlName", "placeholder"], ["seriesItemTemplate", ""], ["speakerItemTemplate", ""], [3, "items", "itemTemplate", "formControlName", "placeholder"], ["includeItemTemplate", ""], ["topicItemTemplate", ""], ["rows", "6", 3, "formControlName", "placeholder"], [1, "button", 3, "disabled", "click"], [1, "image-content-container"], [1, "image-content-row"], [1, "image-content-col", "image-content-col-third"], [1, "image-upload-container"], ["type", "file", "accept", "image/jpg,image/jpeg", 2, "display", "none", 3, "change"], ["input", ""], [4, "ngIf"], [1, "image-content-col"], [1, "image-container"], [3, "src", 4, "ngIf"], ["class", "image-placeholder", 4, "ngIf"], ["class", "image-content-row", 4, "ngIf"], [1, "series-item-container"], [1, "series-item-image"], [1, "series-item-label"], [3, "src"], [1, "speaker-item-container"], [1, "speaker-item-image"], [1, "speaker-item-label"], [1, "include-item-label"], [1, "topic-item-label"], [1, "button", 3, "click"], [3, "icon"], [1, "upload-name"], [1, "progress-bar-container"], [1, "progress-bar"], [1, "image-placeholder"], ["class", "image-content-col image-content-col-third image-selector", 4, "ngIf"], [1, "image-content-col", "image-content-col-third", "image-selector"], [1, "button", "secondary", 3, "disabled", "click"], [3, "text"]], template: function MediaFormComponent_Template(rf, ctx) { if (rf & 1) {
        const _r229 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Details");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "form", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "*");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "app-form-error", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "p-calendar", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Series");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "app-selection-box", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](21, MediaFormComponent_ng_template_21_Template, 5, 4, "ng-template", null, 12, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "Speakers");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](26, "app-selection-box", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](27, MediaFormComponent_ng_template_27_Template, 5, 4, "ng-template", null, 13, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Included In");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](33, "app-selection-box", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](34, MediaFormComponent_ng_template_34_Template, 2, 1, "ng-template", null, 15, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Topics");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](39, "app-selection-box", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](40, MediaFormComponent_ng_template_40_Template, 2, 1, "ng-template", null, 16, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "Description");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](45, "textarea", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "button", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaFormComponent_Template_button_click_46_listener() { return ctx.onSave(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Image");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "input", 23, 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function MediaFormComponent_Template_input_change_55_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r229); const _r206 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](56); ctx.onImageSelected($event); return _r206.value = null; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, "Upload an image for this media.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](60, "Image must be in ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, ".jpg");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](63, " format.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](64, MediaFormComponent_ng_container_64_Template, 4, 2, "ng-container", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](65, MediaFormComponent_ng_container_65_Template, 7, 3, "ng-container", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "div", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "div", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](68, MediaFormComponent_img_68_Template, 1, 1, "img", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](69, MediaFormComponent_div_69_Template, 2, 0, "div", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](70, MediaFormComponent_ng_container_70_Template, 6, 2, "ng-container", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](71, MediaFormComponent_div_71_Template, 10, 2, "div", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r198 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](22);
        const _r200 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](28);
        const _r202 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](35);
        const _r204 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](41);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "name")("placeholder", "Untitled");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("control", ctx.form.controls.name)("messages", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](37, _c1));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "date")("showTime", true)("hourFormat", "12")("placeholder", "dd/MM/yyyy hh:mm a");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("items", ctx.seriesItems)("max", 1)("itemTemplate", _r198)("formControlName", "seriesIds")("placeholder", "Add Series...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("items", ctx.speakerItems)("max", 2)("itemTemplate", _r200)("formControlName", "speakerIds")("placeholder", "Add Speaker...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("items", ctx.includeItems)("itemTemplate", _r202)("formControlName", "includeIds")("placeholder", "Add To...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("items", ctx.topicItems)("max", 3)("itemTemplate", _r204)("formControlName", "topicIds")("placeholder", "Add Topic...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "description")("placeholder", "Give a high-level overview of the content of this media file...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx.form || !ctx.form.valid || ctx.saving);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.uploading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.uploading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.imageUrl);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.imageUrl);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.seriesImageUrl || ctx.organizationImageUrl);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.media.imageUrl);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControlName"], _common_form_error_form_error_component__WEBPACK_IMPORTED_MODULE_13__["FormErrorComponent"], primeng_calendar__WEBPACK_IMPORTED_MODULE_14__["Calendar"], _common_selection_box_selection_box_component__WEBPACK_IMPORTED_MODULE_15__["SelectionBoxComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_16__["NgIf"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_17__["FaIconComponent"], _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_18__["CopyBoxComponent"]], styles: [".breadcrumb-container[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n\n.header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin-bottom: 2.5rem;\n}\n\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n\n.content-section[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  padding: 32px;\n  margin-bottom: 1rem;\n}\n\n.content-section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  line-height: 1;\n  margin-bottom: 1.5rem;\n}\n\n.content-section.content-section-danger[_ngcontent-%COMP%] {\n  background-color: #fffbfb;\n  border-color: #FA3E39;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:first-child) {\n  padding-left: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:last-child) {\n  padding-right: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\nform[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%]   .required[_ngcontent-%COMP%] {\n  display: inline-block;\n  color: #FA3E39;\n  margin-left: 2px;\n}\n\nform[_ngcontent-%COMP%]     input {\n  margin-bottom: 0;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #f5f5f5;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #f5f5f5;\n}\n\nform[_ngcontent-%COMP%]   .include-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\nform[_ngcontent-%COMP%]   .topic-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]:not(:last-child) {\n  margin-bottom: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding: 0px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:first-child {\n  margin-left: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:last-child {\n  margin-right: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   app-copy-box[_ngcontent-%COMP%]:not(:last-child) {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-half[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-third[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 33%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .upload-name[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  width: 100%;\n  height: 0.5rem;\n  margin-top: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #33beff;\n  border-radius: 4px;\n  -webkit-transition: width 0.1s linear;\n  transition: width 0.1s linear;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  width: 100%;\n  padding-top: calc((9 / 16) * 100%);\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   .image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-selector[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 0.25rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL21lZGlhL21lZGlhLWZvcm0vbWVkaWEtZm9ybS5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbWVkaWEvbWVkaWEtZm9ybS9tZWRpYS1mb3JtLmNvbXBvbmVudC5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL19taXhpbnMuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7RUFDSSxxQkFBQTtBQ0ZKOztBREtBO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EsNEJBQUE7RUFBQSw2QkFBQTtVQUFBLHNCQUFBO0VBQ0EscUJBQUE7QUNGSjs7QURJSTtFRUxBLGVBQUE7RUFDQSxnQkFBQTtBRElKOztBRElJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtBQ0ZSOztBRElRO0VBQ0ksb0JBQUE7QUNGWjs7QURPQTtFQUNJLHlCR3hCVTtFSHlCVix5QkFBQTtFQUNBLGtCR0hZO0VISVosYUFBQTtFQUNBLG1CQUFBO0FDSko7O0FETUk7RUVyQkEsZUFBQTtFQUNBLGdCQUFBO0VGc0JJLGNBQUE7RUFDQSxxQkFBQTtBQ0hSOztBRE1JO0VBQ0kseUJBQUE7RUFDQSxxQkcxQk87QUZzQmY7O0FEU0k7RUFDSSxvQkFBQTtFQUFBLGFBQUE7QUNOUjs7QURRUTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtFQUNBLFVBQUE7QUNOWjs7QURRWTtFQUNJLG9CQUFBO0FDTmhCOztBRFFZO0VBQ0kscUJBQUE7QUNOaEI7O0FEV0k7RUFDSSxtQkFBQTtBQ1RSOztBRFlJO0VFakRBLHlCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0NkUztFRGVULGtCQUFBO0FEd0NKOztBRFFRO0VBQ0kscUJBQUE7RUFDQSxjR3hERztFSHlESCxnQkFBQTtBQ05aOztBRFVJO0VBQ0ksZ0JBQUE7QUNSUjs7QURXSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7QUNUUjs7QURXUTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSxxQkFBQTtVQUFBLHlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0FDVFo7O0FEV1k7RUFDSSx5Qkd0Rks7QUY2RXJCOztBRGNJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtBQ1pSOztBRGNRO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHFCQUFBO1VBQUEseUJBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7QUNaWjs7QURjWTtFQUNJLHlCR3pHSztBRjZGckI7O0FEaUJJO0VBQ0ksZ0JBQUE7QUNmUjs7QURpQkk7RUFDSSxnQkFBQTtBQ2ZSOztBRG9CSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtBQ2pCUjs7QURtQlE7RUFDSSxxQkFBQTtBQ2pCWjs7QURvQlE7RUFDSSxtQkFBQTtVQUFBLGNBQUE7RUFDQSxnQkFBQTtBQ2xCWjs7QURvQlk7RUFDSSxpQkFBQTtBQ2xCaEI7O0FEb0JZO0VBQ0ksa0JBQUE7QUNsQmhCOztBRHFCWTtFRWhJUix5QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGNDZFM7RURlVCxrQkFBQTtBRDhHSjs7QURpQlk7RUFDSSxjQUFBO0VBQ0EsbUJBQUE7QUNmaEI7O0FEa0JRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ2hCWjs7QURrQlE7RUFDSSxtQkFBQTtVQUFBLGNBQUE7RUFDQSxVQUFBO0FDaEJaOztBRG1CUTtFQUNJLGdCQUFBO0FDakJaOztBRHNCUTtFQUNJLGdCQUFBO0FDcEJaOztBRHNCUTtFQUNJLGtCQUFBO0FDcEJaOztBRHNCUTtFQUNJLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSx1QkFBQTtBQ3BCWjs7QURzQlE7RUFDSSxrQkFBQTtFQUNBLHlCRzdLUztFSDhLVCxrQkc1Skk7RUg2SkosV0FBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtBQ3BCWjs7QURzQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsT0FBQTtFQUFTLFNBQUE7RUFDckMseUJHakxJO0VIa0xKLGtCR3BLSTtFSHFLSixxQ0FBQTtFQUFBLDZCQUFBO0FDakJaOztBRHFCSTtFQUNJLGtCQUFBO0VBQ0EseUJHN0xhO0VIOExiLFdBQUE7RUFDQSxrQ0FBQTtBQ25CUjs7QURxQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsUUFBQTtFQUFVLE9BQUE7QUNoQmxEOztBRG1CUTtFQUNJLGtCQUFBO0VBQW9CLE1BQUE7RUFBUSxTQUFBO0VBQVcsUUFBQTtFQUFVLE9BQUE7RUFDakQsb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHdCQUFBO1VBQUEsdUJBQUE7QUNiWjs7QURpQkk7RUFDSSxXQUFBO0VBQ0EsbUJBQUE7QUNmUiIsImZpbGUiOiJzcmMvYXBwL21lZGlhL21lZGlhLWZvcm0vbWVkaWEtZm9ybS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgXCIuLi8uLi8uLi9zY3NzL3ZhcmlhYmxlc1wiO1xuQGltcG9ydCBcIi4uLy4uLy4uL3Njc3MvbWl4aW5zXCI7XG5cbi5icmVhZGNydW1iLWNvbnRhaW5lciB7XG4gICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIGhlYWRlci1mb250KCk7XG4gICAgfVxuXG4gICAgLnN1YnRpdGxlIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc3RhdHVzIHtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMC41cmVtO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uY29udGVudC1zZWN0aW9uIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgJHRoZW1lLWdyYXktYm9yZGVyO1xuICAgIGJvcmRlci1yYWRpdXM6ICRib3JkZXItcmFkaXVzO1xuICAgIHBhZGRpbmc6IDMycHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIHRpdGxlLWZvbnQoKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbiAgICB9XG5cbiAgICAmLmNvbnRlbnQtc2VjdGlvbi1kYW5nZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGVuKCR0aGVtZS1kYW5nZXIsIDM5JSk7XG4gICAgICAgIGJvcmRlci1jb2xvcjogJHRoZW1lLWRhbmdlcjtcbiAgICB9XG59XG5cbmZvcm0ge1xuICAgIC5jb2x1bW4tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAuY29sdW1uIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDUwJTtcblxuICAgICAgICAgICAgJjpub3QoOmZpcnN0LWNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAwLjVyZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAmOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDAuNXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5pbnB1dC1jb250YWluZXIge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgIH1cblxuICAgIC5sYWJlbCB7XG4gICAgICAgIEBpbmNsdWRlIGxhYmVsLWZvbnQoKTtcblxuICAgICAgICAucmVxdWlyZWQge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgY29sb3I6ICR0aGVtZS1kYW5nZXI7XG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogMnB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgOjpuZy1kZWVwIGlucHV0IHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICB9XG5cbiAgICAuc2VyaWVzLWl0ZW0tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc2VyaWVzLWl0ZW0taW1hZ2Uge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIHdpZHRoOiAxMDBweDtcbiAgICAgICAgICAgIGhlaWdodDogNTZweDtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMXJlbTtcblxuICAgICAgICAgICAgJi5wbGFjZWhvbGRlciB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLWdyYXktbGlnaHRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc3BlYWtlci1pdGVtLWltYWdlIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB3aWR0aDogMTAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDU2cHg7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG5cbiAgICAgICAgICAgICYucGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuaW5jbHVkZS1pdGVtLWxhYmVsIHtcbiAgICAgICAgcGFkZGluZzogNHB4IDhweDtcbiAgICB9XG4gICAgLnRvcGljLWl0ZW0tbGFiZWwge1xuICAgICAgICBwYWRkaW5nOiA0cHggOHB4O1xuICAgIH1cbn1cblxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIHtcbiAgICAuaW1hZ2UtY29udGVudC1yb3cge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuXG4gICAgICAgICY6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG4gICAgICAgIH1cblxuICAgICAgICAuaW1hZ2UtY29udGVudC1jb2wge1xuICAgICAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgICAgICBwYWRkaW5nOiAwcHggOHB4O1xuXG4gICAgICAgICAgICAmOmZpcnN0LWNoaWxkIHtcbiAgICAgICAgICAgICAgICBtYXJnaW4tbGVmdDogLThweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICY6bGFzdC1jaGlsZCB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAtOHB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubGFiZWwge1xuICAgICAgICAgICAgICAgIEBpbmNsdWRlIGxhYmVsLWZvbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFwcC1jb3B5LWJveDpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC5pbWFnZS1jb250ZW50LWNvbC1oYWxmIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDUwJTtcbiAgICAgICAgfVxuICAgICAgICAuaW1hZ2UtY29udGVudC1jb2wtdGhpcmQge1xuICAgICAgICAgICAgZmxleDogMCAwIGF1dG87XG4gICAgICAgICAgICB3aWR0aDogMzMlO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRpdGxlIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDJyZW07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciB7XG4gICAgICAgIC5idXR0b24ge1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMXJlbTtcbiAgICAgICAgfVxuICAgICAgICAubGFiZWwge1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMS41cmVtO1xuICAgICAgICB9XG4gICAgICAgIC51cGxvYWQtbmFtZSB7XG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgICB9XG4gICAgICAgIC5wcm9ncmVzcy1iYXItY29udGFpbmVyIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAwLjVyZW07XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAwLjVyZW07XG4gICAgICAgIH1cbiAgICAgICAgLnByb2dyZXNzLWJhciB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgYm90dG9tOiAwO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLXByaW1hcnk7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHdpZHRoIDAuMXMgbGluZWFyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmltYWdlLWNvbnRhaW5lciB7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLWdyYXktbGlnaHRlcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHBhZGRpbmctdG9wOiBjYWxjKCg5IC8gMTYpICogMTAwJSk7XG5cbiAgICAgICAgaW1nIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyByaWdodDogMDsgbGVmdDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5pbWFnZS1wbGFjZWhvbGRlciB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgYm90dG9tOiAwOyByaWdodDogMDsgbGVmdDogMDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuaW1hZ2Utc2VsZWN0b3IgLmJ1dHRvbiB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xuICAgIH1cbn0iLCIuYnJlYWRjcnVtYi1jb250YWluZXIge1xuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG59XG5cbi5oZWFkZXItY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgbWFyZ2luLWJvdHRvbTogMi41cmVtO1xufVxuLmhlYWRlci1jb250YWluZXIgLnRpdGxlIHtcbiAgZm9udC1zaXplOiAzMnB4O1xuICBmb250LXdlaWdodDogODAwO1xufVxuLmhlYWRlci1jb250YWluZXIgLnN1YnRpdGxlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbi5oZWFkZXItY29udGFpbmVyIC5zdWJ0aXRsZSAuc3RhdHVzIHtcbiAgbWFyZ2luLXJpZ2h0OiAwLjVyZW07XG59XG5cbi5jb250ZW50LXNlY3Rpb24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTZlNmU2O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBhZGRpbmc6IDMycHg7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG4uY29udGVudC1zZWN0aW9uIC50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDE7XG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbn1cbi5jb250ZW50LXNlY3Rpb24uY29udGVudC1zZWN0aW9uLWRhbmdlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZiZmI7XG4gIGJvcmRlci1jb2xvcjogI0ZBM0UzOTtcbn1cblxuZm9ybSAuY29sdW1uLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5mb3JtIC5jb2x1bW4tY29udGFpbmVyIC5jb2x1bW4ge1xuICBmbGV4OiAwIDAgYXV0bztcbiAgd2lkdGg6IDUwJTtcbn1cbmZvcm0gLmNvbHVtbi1jb250YWluZXIgLmNvbHVtbjpub3QoOmZpcnN0LWNoaWxkKSB7XG4gIHBhZGRpbmctbGVmdDogMC41cmVtO1xufVxuZm9ybSAuY29sdW1uLWNvbnRhaW5lciAuY29sdW1uOm5vdCg6bGFzdC1jaGlsZCkge1xuICBwYWRkaW5nLXJpZ2h0OiAwLjVyZW07XG59XG5mb3JtIC5pbnB1dC1jb250YWluZXIge1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuZm9ybSAubGFiZWwge1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGNvbG9yOiAjOGE4YThhO1xuICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG5mb3JtIC5sYWJlbCAucmVxdWlyZWQge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGNvbG9yOiAjRkEzRTM5O1xuICBtYXJnaW4tbGVmdDogMnB4O1xufVxuZm9ybSA6Om5nLWRlZXAgaW5wdXQge1xuICBtYXJnaW4tYm90dG9tOiAwO1xufVxuZm9ybSAuc2VyaWVzLWl0ZW0tY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmZvcm0gLnNlcmllcy1pdGVtLWNvbnRhaW5lciAuc2VyaWVzLWl0ZW0taW1hZ2Uge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB3aWR0aDogMTAwcHg7XG4gIGhlaWdodDogNTZweDtcbiAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xufVxuZm9ybSAuc2VyaWVzLWl0ZW0tY29udGFpbmVyIC5zZXJpZXMtaXRlbS1pbWFnZS5wbGFjZWhvbGRlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG59XG5mb3JtIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmZvcm0gLnNwZWFrZXItaXRlbS1jb250YWluZXIgLnNwZWFrZXItaXRlbS1pbWFnZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAxMDBweDtcbiAgaGVpZ2h0OiA1NnB4O1xuICBtYXJnaW4tcmlnaHQ6IDFyZW07XG59XG5mb3JtIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIC5zcGVha2VyLWl0ZW0taW1hZ2UucGxhY2Vob2xkZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xufVxuZm9ybSAuaW5jbHVkZS1pdGVtLWxhYmVsIHtcbiAgcGFkZGluZzogNHB4IDhweDtcbn1cbmZvcm0gLnRvcGljLWl0ZW0tbGFiZWwge1xuICBwYWRkaW5nOiA0cHggOHB4O1xufVxuXG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IHtcbiAgZGlzcGxheTogZmxleDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3c6bm90KDpsYXN0LWNoaWxkKSB7XG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sIHtcbiAgZmxleDogMSAxIGF1dG87XG4gIHBhZGRpbmc6IDBweCA4cHg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbDpmaXJzdC1jaGlsZCB7XG4gIG1hcmdpbi1sZWZ0OiAtOHB4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2w6bGFzdC1jaGlsZCB7XG4gIG1hcmdpbi1yaWdodDogLThweDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sIC5sYWJlbCB7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgY29sb3I6ICM4YThhOGE7XG4gIG1hcmdpbi1ib3R0b206IDJweDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sIGFwcC1jb3B5LWJveDpub3QoOmxhc3QtY2hpbGQpIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbC1oYWxmIHtcbiAgZmxleDogMCAwIGF1dG87XG4gIHdpZHRoOiA1MCU7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbC10aGlyZCB7XG4gIGZsZXg6IDAgMCBhdXRvO1xuICB3aWR0aDogMzMlO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAudGl0bGUge1xuICBtYXJnaW4tdG9wOiAycmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5idXR0b24ge1xuICBtYXJnaW4tdG9wOiAxcmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5sYWJlbCB7XG4gIG1hcmdpbi10b3A6IDEuNXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAudXBsb2FkLW5hbWUge1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAucHJvZ3Jlc3MtYmFyLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAwLjVyZW07XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAucHJvZ3Jlc3MtYmFyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzYmVmZjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB0cmFuc2l0aW9uOiB3aWR0aCAwLjFzIGxpbmVhcjtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xuICB3aWR0aDogMTAwJTtcbiAgcGFkZGluZy10b3A6IGNhbGMoKDkgLyAxNikgKiAxMDAlKTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIGltZyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgbGVmdDogMDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIC5pbWFnZS1wbGFjZWhvbGRlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwO1xuICBsZWZ0OiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2Utc2VsZWN0b3IgLmJ1dHRvbiB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xufSIsIkBpbXBvcnQgXCJ2YXJpYWJsZXNcIjtcblxuQG1peGluIHNoYWRvdygpIHtcbiAgICBib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xufVxuXG5AbWl4aW4gaGVhZGVyLWZvbnQoKSB7XG4gICAgZm9udC1zaXplOiAzMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XG59XG5cbkBtaXhpbiB0aXRsZS1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xufVxuXG5AbWl4aW4gbGFiZWwtZm9udCgpIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGNvbG9yOiAkdGhlbWUtZ3JheTtcbiAgICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG4iLCIvLyBodHRwczovL2NvbG9yaHVudC5jby9wYWxldHRlLzE1NzExOFxuXG4vLyBDb2xvcnNcbiR0aGVtZS13aGl0ZTogI0ZGRkZGRjtcbiR0aGVtZS1ibGFjazogIzMzMzMzMztcbiR0aGVtZS1ncmF5LWRhcms6IHJlZDtcbiR0aGVtZS1ncmF5OiAjOGE4YThhO1xuJHRoZW1lLWdyYXktbGlnaHQ6ICNlNmU2ZTY7XG4kdGhlbWUtZ3JheS1saWdodGVyOiAjZjVmNWY1O1xuJHRoZW1lLWdyYXktbGlnaHRlc3Q6ICNmZGZkZmQ7XG4kdGhlbWUtZ3JheS1ib3JkZXI6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuXG4kdGhlbWUtcHJpbWFyeTogIzMzYmVmZjtcblxuJHRoZW1lLXN1Y2Nlc3M6ICM0MkM3NUQ7XG4kdGhlbWUtZGFuZ2VyOiAjRkEzRTM5O1xuJHRoZW1lLXdhcm5pbmc6ICNGRkMyMDA7XG5cbi8vIEZvbnRzIGFuZCBUZXh0XG4kZm9udC1mYW1pbHk6IHByb3hpbWEtbm92YSwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuXG4kZm9udC1zaXplLXNtYWxsOiAwLjg3NXJlbTtcbiRmb250LXNpemUtbWVkaXVtOiAxcmVtO1xuJGZvbnQtc2l6ZS1sYXJnZTogMS41cmVtO1xuXG4vLyBMYXlvdXRcbiRib3JkZXItcmFkaXVzOiA0cHg7XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MediaFormComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-media-form',
                templateUrl: './media-form.component.html',
                styleUrls: ['./media-form.component.scss']
            }]
    }], function () { return [{ type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_10__["NotificationsService"] }]; }, { media: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], mediaChange: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }] }); })();


/***/ }),

/***/ "./src/app/media/media-list/media-list.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/media/media-list/media-list.component.ts ***!
  \**********************************************************/
/*! exports provided: MediaListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaListComponent", function() { return MediaListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-infinite-scroll */ "./node_modules/ngx-infinite-scroll/__ivy_ngcc__/modules/ngx-infinite-scroll.js");
/* harmony import */ var _reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../reusable-media-list/reusable-media-list.component */ "./src/app/media/reusable-media-list/reusable-media-list.component.ts");








class MediaListComponent {
    constructor(app, router) {
        this.app = app;
        this.router = router;
    }
    ngOnInit() {
        this.app.API.getAllMedia().subscribe(media => {
            this.media = media;
        });
    }
    onAddMedia() {
        this.router.navigate(['/upload']);
    }
}
MediaListComponent.ɵfac = function MediaListComponent_Factory(t) { return new (t || MediaListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"])); };
MediaListComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: MediaListComponent, selectors: [["app-media-list"]], decls: 8, vars: 4, consts: [["infiniteScroll", "", 1, "scrollable-region", 3, "scrollWindow", "infiniteScrollContainer", "fromRoot", "scrolled"], [1, "header-container"], [1, "title"], [1, "button", 3, "click"], [3, "media"], ["mediaList", ""]], template: function MediaListComponent_Template(rf, ctx) { if (rf & 1) {
        const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("scrolled", function MediaListComponent_Template_div_scrolled_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18); const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](7); return _r17.onLoadMoreRows(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Media");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaListComponent_Template_button_click_4_listener() { return ctx.onAddMedia(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Add Media");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "app-reusable-media-list", 4, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("scrollWindow", false)("infiniteScrollContainer", ".center-container > .bottom-container")("fromRoot", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("media", ctx.media);
    } }, directives: [ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_3__["InfiniteScrollDirective"], _reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_4__["ReusableMediaListComponent"]], styles: [".header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  margin-bottom: 2.5rem;\n}\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.options-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n.options-container[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.options-container[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  width: 320px;\n}\ntable[_ngcontent-%COMP%] {\n  table-layout: fixed;\n  border-collapse: collapse;\n  width: 100%;\n  border: 1px solid #e6e6e6;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n  background-color: #FFFFFF;\n  padding: 10px 16px;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon {\n  color: #e6e6e6;\n  margin: -5px 0px -5px 8px;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon:hover {\n  color: #333333;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon.active {\n  color: #333333;\n}\ntable[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n  background-color: #FFFFFF;\n  padding: 20px 16px;\n}\ntable[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #e6e6e6;\n}\ntable[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(even)   td[_ngcontent-%COMP%] {\n  background-color: #fdfdfd;\n}\n.time[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 300;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL21lZGlhL21lZGlhLWxpc3QvbWVkaWEtbGlzdC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbWVkaWEvbWVkaWEtbGlzdC9tZWRpYS1saXN0LmNvbXBvbmVudC5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL19taXhpbnMuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EscUJBQUE7QUNGSjtBRElJO0VFREEsZUFBQTtFQUNBLGdCQUFBO0VGRUksbUJBQUE7VUFBQSxjQUFBO0FDRFI7QURLQTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7QUNGSjtBRElJO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0FDRlI7QURLSTtFQUNJLHlCR3BCTTtFSHFCTixZQUFBO0FDSFI7QURPQTtFQUNJLG1CQUFBO0VBQ0EseUJBQUE7RUFDQSxXQUFBO0VBQ0EseUJBQUE7QUNKSjtBRE1JO0VBQ0ksZ0JBQUE7RUFDQSx5QkdqQ007RUhrQ04sa0JBQUE7QUNKUjtBRE1RO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtBQ0paO0FETVk7RUFDSSxtQkFBQTtVQUFBLGNBQUE7QUNKaEI7QURPWTtFQUNJLGNHekNHO0VIMENILHlCQUFBO0FDTGhCO0FET2dCO0VBQ0ksY0doRE47QUYyQ2Q7QURPZ0I7RUFDSSxjR25ETjtBRjhDZDtBRFdJO0VBQ0ksbUJBQUE7RUFDQSx5Qkc1RE07RUg2RE4sa0JBQUE7QUNUUjtBRFlJO0VBQ0ksZ0NBQUE7QUNWUjtBRGFJO0VBQ0kseUJHL0RjO0FGb0R0QjtBRGVBO0VBQ0ksbUJHeERjO0VIeURkLGdCQUFBO0FDWkoiLCJmaWxlIjoic3JjL2FwcC9tZWRpYS9tZWRpYS1saXN0L21lZGlhLWxpc3QuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0IFwiLi4vLi4vLi4vc2Nzcy92YXJpYWJsZXNcIjtcbkBpbXBvcnQgXCIuLi8uLi8uLi9zY3NzL21peGluc1wiO1xuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIGhlYWRlci1mb250KCk7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIH1cbn1cblxuLm9wdGlvbnMtY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAuc3BhY2VyIHtcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgfVxuXG4gICAgLnNlYXJjaCBpbnB1dCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS13aGl0ZTtcbiAgICAgICAgd2lkdGg6IDMyMHB4O1xuICAgIH1cbn1cblxudGFibGUge1xuICAgIHRhYmxlLWxheW91dDogZml4ZWQ7XG4gICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAkdGhlbWUtZ3JheS1ib3JkZXI7XG5cbiAgICB0aCB7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS13aGl0ZTtcbiAgICAgICAgcGFkZGluZzogMTBweCAxNnB4O1xuXG4gICAgICAgIC5oZWFkZXIge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgICAgIC5uYW1lIHtcbiAgICAgICAgICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgOjpuZy1kZWVwIC5hY3Rpb24taWNvbiB7XG4gICAgICAgICAgICAgICAgY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuICAgICAgICAgICAgICAgIG1hcmdpbjogLTVweCAwcHggLTVweCA4cHg7XG5cbiAgICAgICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICR0aGVtZS1ibGFjaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJi5hY3RpdmUge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJHRoZW1lLWJsYWNrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRkIHtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IHRvcDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLXdoaXRlO1xuICAgICAgICBwYWRkaW5nOiAyMHB4IDE2cHg7XG4gICAgfVxuXG4gICAgdHIge1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJHRoZW1lLWdyYXktYm9yZGVyO1xuICAgIH1cbiAgICBcbiAgICB0cjpudGgtY2hpbGQoZXZlbikgdGQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVzdDtcbiAgICB9XG59XG5cbi50aW1lIHtcbiAgICBmb250LXNpemU6ICRmb250LXNpemUtc21hbGw7XG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcbn0iLCIuaGVhZGVyLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcbn1cbi5oZWFkZXItY29udGFpbmVyIC50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMzJweDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgZmxleDogMSAxIGF1dG87XG59XG5cbi5vcHRpb25zLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4ub3B0aW9ucy1jb250YWluZXIgLnNwYWNlciB7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxuLm9wdGlvbnMtY29udGFpbmVyIC5zZWFyY2ggaW5wdXQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO1xuICB3aWR0aDogMzIwcHg7XG59XG5cbnRhYmxlIHtcbiAgdGFibGUtbGF5b3V0OiBmaXhlZDtcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlNmU2ZTY7XG59XG50YWJsZSB0aCB7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGJhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7XG4gIHBhZGRpbmc6IDEwcHggMTZweDtcbn1cbnRhYmxlIHRoIC5oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxudGFibGUgdGggLmhlYWRlciAubmFtZSB7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxudGFibGUgdGggLmhlYWRlciA6Om5nLWRlZXAgLmFjdGlvbi1pY29uIHtcbiAgY29sb3I6ICNlNmU2ZTY7XG4gIG1hcmdpbjogLTVweCAwcHggLTVweCA4cHg7XG59XG50YWJsZSB0aCAuaGVhZGVyIDo6bmctZGVlcCAuYWN0aW9uLWljb246aG92ZXIge1xuICBjb2xvcjogIzMzMzMzMztcbn1cbnRhYmxlIHRoIC5oZWFkZXIgOjpuZy1kZWVwIC5hY3Rpb24taWNvbi5hY3RpdmUge1xuICBjb2xvcjogIzMzMzMzMztcbn1cbnRhYmxlIHRkIHtcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgcGFkZGluZzogMjBweCAxNnB4O1xufVxudGFibGUgdHIge1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2U2ZTZlNjtcbn1cbnRhYmxlIHRyOm50aC1jaGlsZChldmVuKSB0ZCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZGZkZmQ7XG59XG5cbi50aW1lIHtcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgZm9udC13ZWlnaHQ6IDMwMDtcbn0iLCJAaW1wb3J0IFwidmFyaWFibGVzXCI7XG5cbkBtaXhpbiBzaGFkb3coKSB7XG4gICAgYm94LXNoYWRvdzogMCAxcHggNHB4IDAgcmdiYSgwLCAwLCAwLCAwLjA2KTtcbn1cblxuQG1peGluIGhlYWRlci1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMzJweDtcbiAgICBmb250LXdlaWdodDogODAwO1xufVxuXG5AbWl4aW4gdGl0bGUtZm9udCgpIHtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cblxuQG1peGluIGxhYmVsLWZvbnQoKSB7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjb2xvcjogJHRoZW1lLWdyYXk7XG4gICAgbWFyZ2luLWJvdHRvbTogMnB4O1xufVxuIiwiLy8gaHR0cHM6Ly9jb2xvcmh1bnQuY28vcGFsZXR0ZS8xNTcxMThcblxuLy8gQ29sb3JzXG4kdGhlbWUtd2hpdGU6ICNGRkZGRkY7XG4kdGhlbWUtYmxhY2s6ICMzMzMzMzM7XG4kdGhlbWUtZ3JheS1kYXJrOiByZWQ7XG4kdGhlbWUtZ3JheTogIzhhOGE4YTtcbiR0aGVtZS1ncmF5LWxpZ2h0OiAjZTZlNmU2O1xuJHRoZW1lLWdyYXktbGlnaHRlcjogI2Y1ZjVmNTtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXN0OiAjZmRmZGZkO1xuJHRoZW1lLWdyYXktYm9yZGVyOiAkdGhlbWUtZ3JheS1saWdodDtcblxuJHRoZW1lLXByaW1hcnk6ICMzM2JlZmY7XG5cbiR0aGVtZS1zdWNjZXNzOiAjNDJDNzVEO1xuJHRoZW1lLWRhbmdlcjogI0ZBM0UzOTtcbiR0aGVtZS13YXJuaW5nOiAjRkZDMjAwO1xuXG4vLyBGb250cyBhbmQgVGV4dFxuJGZvbnQtZmFtaWx5OiBwcm94aW1hLW5vdmEsIFwiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcblxuJGZvbnQtc2l6ZS1zbWFsbDogMC44NzVyZW07XG4kZm9udC1zaXplLW1lZGl1bTogMXJlbTtcbiRmb250LXNpemUtbGFyZ2U6IDEuNXJlbTtcblxuLy8gTGF5b3V0XG4kYm9yZGVyLXJhZGl1czogNHB4O1xuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MediaListComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-media-list',
                templateUrl: './media-list.component.html',
                styleUrls: ['./media-list.component.scss']
            }]
    }], function () { return [{ type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }]; }, null); })();


/***/ }),

/***/ "./src/app/media/media-upload/media-upload.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/media/media-upload/media-upload.component.ts ***!
  \**************************************************************/
/*! exports provided: MediaUploadComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaUploadComponent", function() { return MediaUploadComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _services_app_managers_series_manager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @services/app/managers/series.manager */ "./src/app/_services/app/managers/series.manager.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var ngx_dropzone__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-dropzone */ "./node_modules/ngx-dropzone/__ivy_ngcc__/fesm2015/ngx-dropzone.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
/* harmony import */ var _media_form_media_form_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../media-form/media-form.component */ "./src/app/media/media-form/media-form.component.ts");













function MediaUploadComponent_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Replace Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " You are uploading a replacement for ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r130 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", ctx_r130.series ? (ctx_r130.series.name || "Untitled") + " - " : "", "", ctx_r130.media ? ctx_r130.media.name || "Untitled" : "", "");
} }
function MediaUploadComponent_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Add Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " You are uploading a new media file. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function MediaUploadComponent_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    const _r137 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "ngx-dropzone", 4, 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function MediaUploadComponent_ng_container_3_Template_ngx_dropzone_change_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r137); const ctx_r136 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r136.onFileSelected($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Select Media File To Upload");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "or drag and drop a media file here");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r132 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r132.uploading)("multiple", false)("accept", ctx_r132.acceptedFileTypes);
} }
const _c0 = function () { return ["fad", "check-circle"]; };
function MediaUploadComponent_div_4_fa_icon_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "fa-icon", 15);
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
} }
const _c1 = function () { return ["fad", "exclamation-circle"]; };
function MediaUploadComponent_div_4_fa_icon_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "fa-icon", 16);
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c1));
} }
function MediaUploadComponent_div_4_ng_container_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Your media file is now uploading...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Please remain on this page until the upload has completed. You may update your media details below.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
const _c2 = function (a1) { return ["/media", a1]; };
function MediaUploadComponent_div_4_ng_container_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Your media file upload is complete!");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "View the ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "a", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "media page");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " to see additional details and status.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r141 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](1, _c2, ctx_r141.media.id));
} }
function MediaUploadComponent_div_4_ng_container_10_Template(rf, ctx) { if (rf & 1) {
    const _r145 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Your media file upload has failed.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Click here to ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "a", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MediaUploadComponent_div_4_ng_container_10_Template_a_click_6_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r145); const ctx_r144 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r144.onRetryUpload(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "retry the upload");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, ".");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function MediaUploadComponent_div_4_div_11_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Uploading Media File");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r146 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r146.uploading.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", ctx_r146.progress * 100, "%");
} }
function MediaUploadComponent_div_4_div_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, MediaUploadComponent_div_4_div_11_ng_container_3_Template, 7, 3, "ng-container", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r143 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r143.uploading);
} }
function MediaUploadComponent_div_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Media Upload ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, MediaUploadComponent_div_4_fa_icon_3_Template, 1, 2, "fa-icon", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, MediaUploadComponent_div_4_fa_icon_4_Template, 1, 2, "fa-icon", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, MediaUploadComponent_div_4_ng_container_8_Template, 6, 0, "ng-container", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, MediaUploadComponent_div_4_ng_container_9_Template, 9, 3, "ng-container", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, MediaUploadComponent_div_4_ng_container_10_Template, 9, 0, "ng-container", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, MediaUploadComponent_div_4_div_11_Template, 4, 1, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r133 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r133.complete);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r133.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r133.complete && !ctx_r133.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r133.complete);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r133.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r133.complete && !ctx_r133.error);
} }
function MediaUploadComponent_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "app-media-form", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r134 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("media", ctx_r134.media);
} }
class MediaUploadComponent {
    constructor(app, route) {
        this.app = app;
        this.route = route;
        this.acceptedFileTypes = '.3g2,.3gp,.4xm,.aac,.ac3,.act,.adf,.adp,.adx,.aea,.afc,.aiff,.alaw,.amr,.anm,.apc,' +
            '.ape,.aqtitle,.asf,.ass,.ast,.au,.avi,.avr,.avs,.bethsoftvid,.bfi,.bin,.bink,.bit,.bmv,.boa,.brstm,' +
            '.c93,.caf,.cavsvideo,.cdg,.cdxl,.concat,.data,.daud,.dfa,.dirac,.dnxhd,.dsicin,.dts,.dtshd,.dv,.dv1394,' +
            '.dxa,.ea,.eac3,.ea_cdata,.epaf,.f32be,.f32le,.f64be,.f64le,.fbdev,.ffm,.ffmetadata,.filmstrip,' +
            '.film_cpk,.flac,.flic,.flv,.frm,.g722,.g723_1,.g729,.gif,.gsm,.gxf,.h261,.h263,.h264,.hevc,.hls,' +
            '.applehttp,.hnm,.ico,.idcin,.idf,.iff,.ilbc,.image2,.image2pipe,.ingenient,.ipmovie,.ircam,.iss,.iv8,' +
            '.ivf,.jacosub,.jv,.latm,.lavfi,.lmlm4,.loas,.lvf,.lxf,.m4a,.m4v,.matroska,.webm,.mgsts,.microdvd,.mj2,' +
            '.mjpeg,.mlp,.mm,.mmf,.mov,.mp3,.mp4,.mpc,.mpc8,.mpeg,.mpegts,.mpegtsraw,.mpegvideo,.mpl2,.mpsub,' +
            '.msnwctcp,.mtv,.mulaw,.mv,.mvi,.mxf,.mxg,.nc,.nistsphere,.nsv,.nut,.nuv,.ogg,.oma,.oss,.paf,.pjs,.pmp,' +
            '.psxstr,.pva,.pvf,.qcp,.r3d,.rawvideo,.realtext,.redspark,.rl2,.rm,.roq,.rpl,.rsd,.rso,.rtp,.rtsp,.s8,' +
            '.s16be,.s16le,.s24be,.s24le,.s32be,.s32le,.sami,.sap,.sbg,.sdp,.shn,.siff,.smjpeg,.smk,.smush,.sol,.sox,' +
            '.spdif,.srt,.subviewer,.subviewer1,.swf,.tak,.tedcaptions,.thp,.tiertexseq,.tmv,.truehd,.tta,.tty,.txd,' +
            '.u8,.u16be,.u16le,.u24be,.u24le,.u32be,.u32le,.v4l2,.vc1,.vc1test,.video4linux2,.vivo,.vmd,.vobsub,.voc,' +
            '.vplayer,.vqf,.w64,.wav,.wc3movie,.webvtt,.wsaud,.wsvqa,.wtv,.wv,.xa,.xbin,.xmv,.xwma,.yop,.yuv4mpegpipe';
        this.shouldShowMediaForm = false;
        this.progress = 0;
        this.complete = false;
        this.error = false;
    }
    ngOnInit() {
        this.mediaId = parseInt(this.route.snapshot.params.id || '0');
        if (this.mediaId) {
            this.app.API.getMedia(this.mediaId).subscribe(media => {
                this.media = media;
                this.series = media.seriesId ? _services_app_managers_series_manager__WEBPACK_IMPORTED_MODULE_5__["SeriesManager"].sharedInstance.series.find(o => o.id === media.seriesId) : undefined;
            });
        }
    }
    onFileSelected(event) {
        var _a;
        console.log(event);
        if (!((_a = event.addedFiles) === null || _a === void 0 ? void 0 : _a.length)) {
            return;
        }
        this.uploading = event.addedFiles[0];
        this.progress = 0;
        this.complete = false;
        this.error = false;
        let createMedia = this.media ? Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(this.media) : (this.mediaId ? this.app.API.getMedia(this.mediaId) : this.app.API.createMedia());
        createMedia.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["mergeMap"])(media => {
            this.media = media;
            this.shouldShowMediaForm = true;
            return this.app.API.uploadFileForMedia(this.media, this.uploading, progress => {
                this.progress = progress;
            });
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["mergeMap"])(() => {
            return this.app.API.updateMediaStatus(this.media, 1);
        })).subscribe(o => {
            this.progress = 1;
            this.complete = true;
        }, error => {
            console.log('Error: ', error);
            this.error = true;
        });
    }
    onRetryUpload() {
        this.uploading = undefined;
        this.progress = 0;
        this.error = false;
        this.complete = false;
    }
}
MediaUploadComponent.ɵfac = function MediaUploadComponent_Factory(t) { return new (t || MediaUploadComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"])); };
MediaUploadComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: MediaUploadComponent, selectors: [["app-media-upload"]], decls: 6, vars: 5, consts: [[1, "header-container"], [4, "ngIf"], ["class", "content-section", 4, "ngIf"], [1, "title"], [3, "disabled", "multiple", "accept", "change"], ["drop", ""], [1, "dropzone-message"], [1, "button"], [1, "content-section"], ["class", "success", 3, "icon", 4, "ngIf"], ["class", "error", 3, "icon", 4, "ngIf"], [1, "image-content-container"], [1, "image-content-row"], [1, "image-content-col"], ["class", "image-content-row", 4, "ngIf"], [1, "success", 3, "icon"], [1, "error", 3, "icon"], [3, "routerLink"], [3, "click"], [1, "image-upload-container"], [1, "label"], [1, "upload-name"], [1, "progress-bar-container"], [1, "progress-bar"], [3, "media"]], template: function MediaUploadComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, MediaUploadComponent_ng_container_1_Template, 8, 2, "ng-container", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, MediaUploadComponent_ng_container_2_Template, 5, 0, "ng-container", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, MediaUploadComponent_ng_container_3_Template, 8, 3, "ng-container", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, MediaUploadComponent_div_4_Template, 12, 6, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, MediaUploadComponent_ng_container_5_Template, 2, 1, "ng-container", 1);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.mediaId);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.mediaId);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.uploading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.uploading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.shouldShowMediaForm);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], ngx_dropzone__WEBPACK_IMPORTED_MODULE_7__["NgxDropzoneComponent"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__["FaIconComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLinkWithHref"], _media_form_media_form_component__WEBPACK_IMPORTED_MODULE_9__["MediaFormComponent"]], styles: [".header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin-bottom: 2.5rem;\n}\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\nngx-dropzone[_ngcontent-%COMP%] {\n  cursor: pointer;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n  font-size: 1rem;\n  color: #333333;\n  background-color: transparent;\n  height: 320px;\n  border: 2px dashed #e6e6e6;\n  border-radius: 4px;\n  margin-bottom: 1rem;\n}\nngx-dropzone.ngx-dz-hovered[_ngcontent-%COMP%] {\n  background-color: #f5f5f5;\n  border: 2px dashed #33beff;\n}\n.dropzone-message[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.content-section[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  padding: 32px;\n  margin-bottom: 1rem;\n}\n.content-section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  line-height: 1;\n  margin-bottom: 1.5rem;\n}\n.content-section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   fa-icon.success[_ngcontent-%COMP%] {\n  color: #42C75D;\n}\n.content-section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]   fa-icon.error[_ngcontent-%COMP%] {\n  color: #FA3E39;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]:not(:last-child) {\n  margin-bottom: 0.5rem;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding: 0px 8px;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:first-child {\n  margin-left: -8px;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:last-child {\n  margin-right: -8px;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .upload-name[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  width: 100%;\n  height: 0.5rem;\n  margin-top: 0.5rem;\n}\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #33beff;\n  border-radius: 4px;\n  -webkit-transition: width 0.1s linear;\n  transition: width 0.1s linear;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL21lZGlhL21lZGlhLXVwbG9hZC9tZWRpYS11cGxvYWQuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21lZGlhL21lZGlhLXVwbG9hZC9tZWRpYS11cGxvYWQuY29tcG9uZW50LnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX21peGlucy5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLDRCQUFBO0VBQUEsNkJBQUE7VUFBQSxzQkFBQTtFQUNBLHFCQUFBO0FDRko7QURJSTtFRURBLGVBQUE7RUFDQSxnQkFBQTtFRkVJLG1CQUFBO1VBQUEsY0FBQTtBQ0RSO0FES0E7RUFDSSxlQUFBO0VBQ0Esb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHdCQUFBO1VBQUEsdUJBQUE7RUFDQSxlR0dlO0VIRmYsY0doQlU7RUhpQlYsNkJBQUE7RUFDQSxhQUFBO0VBQ0EsMEJBQUE7RUFDQSxrQkdFWTtFSERaLG1CQUFBO0FDRko7QURJSTtFQUNJLHlCR3BCYTtFSHFCYiwwQkFBQTtBQ0ZSO0FET0k7RUFDSSxxQkFBQTtBQ0pSO0FEUUE7RUFDSSx5QkdyQ1U7RUhzQ1YseUJBQUE7RUFDQSxrQkdoQlk7RUhpQlosYUFBQTtFQUNBLG1CQUFBO0FDTEo7QURPSTtFRWxDQSxlQUFBO0VBQ0EsZ0JBQUE7RUZtQ0ksY0FBQTtFQUNBLHFCQUFBO0FDSlI7QURNUTtFQUNJLGNHdENJO0FGa0NoQjtBRE1RO0VBQ0ksY0d4Q0c7QUZvQ2Y7QURVSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtBQ1BSO0FEU1E7RUFDSSxxQkFBQTtBQ1BaO0FEVVE7RUFDSSxtQkFBQTtVQUFBLGNBQUE7RUFDQSxnQkFBQTtBQ1JaO0FEVVk7RUFDSSxpQkFBQTtBQ1JoQjtBRFVZO0VBQ0ksa0JBQUE7QUNSaEI7QURXWTtFRTlEUix5QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGNDZFM7RURlVCxrQkFBQTtBRHNESjtBRFNRO0VBQ0ksZ0JBQUE7QUNQWjtBRFlRO0VBQ0ksa0JBQUE7QUNWWjtBRFlRO0VBQ0ksbUJBQUE7RUFDQSxnQkFBQTtFQUNBLHVCQUFBO0FDVlo7QURZUTtFQUNJLGtCQUFBO0VBQ0EseUJHNUZTO0VINkZULGtCRzNFSTtFSDRFSixXQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0FDVlo7QURZUTtFQUNJLGtCQUFBO0VBQW9CLE1BQUE7RUFBUSxPQUFBO0VBQVMsU0FBQTtFQUNyQyx5QkdoR0k7RUhpR0osa0JHbkZJO0VIb0ZKLHFDQUFBO0VBQUEsNkJBQUE7QUNQWiIsImZpbGUiOiJzcmMvYXBwL21lZGlhL21lZGlhLXVwbG9hZC9tZWRpYS11cGxvYWQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0IFwiLi4vLi4vLi4vc2Nzcy92YXJpYWJsZXNcIjtcbkBpbXBvcnQgXCIuLi8uLi8uLi9zY3NzL21peGluc1wiO1xuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIGhlYWRlci1mb250KCk7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIH1cbn1cblxubmd4LWRyb3B6b25lIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1tZWRpdW07XG4gICAgY29sb3I6ICR0aGVtZS1ibGFjaztcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBoZWlnaHQ6IDMyMHB4O1xuICAgIGJvcmRlcjogMnB4IGRhc2hlZCAkdGhlbWUtZ3JheS1saWdodDtcbiAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuXG4gICAgJi5uZ3gtZHotaG92ZXJlZCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgIGJvcmRlcjogMnB4IGRhc2hlZCAkdGhlbWUtcHJpbWFyeTtcbiAgICB9XG59XG5cbi5kcm9wem9uZS1tZXNzYWdlIHtcbiAgICAuYnV0dG9uIHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuICAgIH1cbn1cblxuLmNvbnRlbnQtc2VjdGlvbiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLXdoaXRlO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR0aGVtZS1ncmF5LWJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICBwYWRkaW5nOiAzMnB4O1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG5cbiAgICAudGl0bGUge1xuICAgICAgICBAaW5jbHVkZSB0aXRsZS1mb250KCk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG5cbiAgICAgICAgZmEtaWNvbi5zdWNjZXNzIHtcbiAgICAgICAgICAgIGNvbG9yOiAkdGhlbWUtc3VjY2VzcztcbiAgICAgICAgfVxuICAgICAgICBmYS1pY29uLmVycm9yIHtcbiAgICAgICAgICAgIGNvbG9yOiAkdGhlbWUtZGFuZ2VyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uaW1hZ2UtY29udGVudC1jb250YWluZXIge1xuICAgIC5pbWFnZS1jb250ZW50LXJvdyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG5cbiAgICAgICAgJjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5pbWFnZS1jb250ZW50LWNvbCB7XG4gICAgICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICAgICAgICAgIHBhZGRpbmc6IDBweCA4cHg7XG5cbiAgICAgICAgICAgICY6Zmlyc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAtOHB4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IC04cHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5sYWJlbCB7XG4gICAgICAgICAgICAgICAgQGluY2x1ZGUgbGFiZWwtZm9udCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLnRpdGxlIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDJyZW07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciB7XG4gICAgICAgIC5sYWJlbCB7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAxLjVyZW07XG4gICAgICAgIH1cbiAgICAgICAgLnVwbG9hZC1uYW1lIHtcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgICAgIH1cbiAgICAgICAgLnByb2dyZXNzLWJhci1jb250YWluZXIge1xuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLWdyYXktbGlnaHRlcjtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6ICRib3JkZXItcmFkaXVzO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDAuNXJlbTtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDAuNXJlbTtcbiAgICAgICAgfVxuICAgICAgICAucHJvZ3Jlc3MtYmFyIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyBib3R0b206IDA7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtcHJpbWFyeTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6ICRib3JkZXItcmFkaXVzO1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogd2lkdGggMC4xcyBsaW5lYXI7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLmhlYWRlci1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XG59XG4uaGVhZGVyLWNvbnRhaW5lciAudGl0bGUge1xuICBmb250LXNpemU6IDMycHg7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxuXG5uZ3gtZHJvcHpvbmUge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBmb250LXNpemU6IDFyZW07XG4gIGNvbG9yOiAjMzMzMzMzO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgaGVpZ2h0OiAzMjBweDtcbiAgYm9yZGVyOiAycHggZGFzaGVkICNlNmU2ZTY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cbm5neC1kcm9wem9uZS5uZ3gtZHotaG92ZXJlZCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gIGJvcmRlcjogMnB4IGRhc2hlZCAjMzNiZWZmO1xufVxuXG4uZHJvcHpvbmUtbWVzc2FnZSAuYnV0dG9uIHtcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uY29udGVudC1zZWN0aW9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgYm9yZGVyOiAxcHggc29saWQgI2U2ZTZlNjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBwYWRkaW5nOiAzMnB4O1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuLmNvbnRlbnQtc2VjdGlvbiAudGl0bGUge1xuICBmb250LXNpemU6IDI0cHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG59XG4uY29udGVudC1zZWN0aW9uIC50aXRsZSBmYS1pY29uLnN1Y2Nlc3Mge1xuICBjb2xvcjogIzQyQzc1RDtcbn1cbi5jb250ZW50LXNlY3Rpb24gLnRpdGxlIGZhLWljb24uZXJyb3Ige1xuICBjb2xvcjogI0ZBM0UzOTtcbn1cblxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93Om5vdCg6bGFzdC1jaGlsZCkge1xuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbCB7XG4gIGZsZXg6IDEgMSBhdXRvO1xuICBwYWRkaW5nOiAwcHggOHB4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2w6Zmlyc3QtY2hpbGQge1xuICBtYXJnaW4tbGVmdDogLThweDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sOmxhc3QtY2hpbGQge1xuICBtYXJnaW4tcmlnaHQ6IC04cHg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbCAubGFiZWwge1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGNvbG9yOiAjOGE4YThhO1xuICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC50aXRsZSB7XG4gIG1hcmdpbi10b3A6IDJyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLXVwbG9hZC1jb250YWluZXIgLmxhYmVsIHtcbiAgbWFyZ2luLXRvcDogMS41cmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC51cGxvYWQtbmFtZSB7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5wcm9ncmVzcy1iYXItY29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDAuNXJlbTtcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5wcm9ncmVzcy1iYXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzNiZWZmO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHRyYW5zaXRpb246IHdpZHRoIDAuMXMgbGluZWFyO1xufSIsIkBpbXBvcnQgXCJ2YXJpYWJsZXNcIjtcblxuQG1peGluIHNoYWRvdygpIHtcbiAgICBib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xufVxuXG5AbWl4aW4gaGVhZGVyLWZvbnQoKSB7XG4gICAgZm9udC1zaXplOiAzMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XG59XG5cbkBtaXhpbiB0aXRsZS1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xufVxuXG5AbWl4aW4gbGFiZWwtZm9udCgpIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGNvbG9yOiAkdGhlbWUtZ3JheTtcbiAgICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG4iLCIvLyBodHRwczovL2NvbG9yaHVudC5jby9wYWxldHRlLzE1NzExOFxuXG4vLyBDb2xvcnNcbiR0aGVtZS13aGl0ZTogI0ZGRkZGRjtcbiR0aGVtZS1ibGFjazogIzMzMzMzMztcbiR0aGVtZS1ncmF5LWRhcms6IHJlZDtcbiR0aGVtZS1ncmF5OiAjOGE4YThhO1xuJHRoZW1lLWdyYXktbGlnaHQ6ICNlNmU2ZTY7XG4kdGhlbWUtZ3JheS1saWdodGVyOiAjZjVmNWY1O1xuJHRoZW1lLWdyYXktbGlnaHRlc3Q6ICNmZGZkZmQ7XG4kdGhlbWUtZ3JheS1ib3JkZXI6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuXG4kdGhlbWUtcHJpbWFyeTogIzMzYmVmZjtcblxuJHRoZW1lLXN1Y2Nlc3M6ICM0MkM3NUQ7XG4kdGhlbWUtZGFuZ2VyOiAjRkEzRTM5O1xuJHRoZW1lLXdhcm5pbmc6ICNGRkMyMDA7XG5cbi8vIEZvbnRzIGFuZCBUZXh0XG4kZm9udC1mYW1pbHk6IHByb3hpbWEtbm92YSwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuXG4kZm9udC1zaXplLXNtYWxsOiAwLjg3NXJlbTtcbiRmb250LXNpemUtbWVkaXVtOiAxcmVtO1xuJGZvbnQtc2l6ZS1sYXJnZTogMS41cmVtO1xuXG4vLyBMYXlvdXRcbiRib3JkZXItcmFkaXVzOiA0cHg7XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MediaUploadComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-media-upload',
                templateUrl: './media-upload.component.html',
                styleUrls: ['./media-upload.component.scss']
            }]
    }], function () { return [{ type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"] }]; }, null); })();


/***/ }),

/***/ "./src/app/media/reusable-media-list/reusable-media-list.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/media/reusable-media-list/reusable-media-list.component.ts ***!
  \****************************************************************************/
/*! exports provided: ReusableMediaListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReusableMediaListComponent", function() { return ReusableMediaListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _classes_utility__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @classes/utility */ "./src/app/_classes/utility.ts");
/* harmony import */ var _services_app_managers_series_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @services/app/managers/series.manager */ "./src/app/_services/app/managers/series.manager.ts");
/* harmony import */ var _services_app_managers_speaker_manager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @services/app/managers/speaker.manager */ "./src/app/_services/app/managers/speaker.manager.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-infinite-scroll */ "./node_modules/ngx-infinite-scroll/__ivy_ngcc__/modules/ngx-infinite-scroll.js");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
/* harmony import */ var _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @common/loading-indicator/loading-indicator.component */ "./src/app/_common/loading-indicator/loading-indicator.component.ts");













function ReusableMediaListComponent_ng_container_2_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r189 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("Showing ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx_r189.entries.length), " ", ctx_r189.entries.length === 1 ? "media file" : "media files", "");
} }
function ReusableMediaListComponent_ng_container_2_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r190 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate3"]("Showing ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 3, ctx_r190.filtered.length), " of ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 5, ctx_r190.entries.length), " ", ctx_r190.entries.length === 1 ? "media file" : "media files", "");
} }
function ReusableMediaListComponent_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, ReusableMediaListComponent_ng_container_2_div_1_Template, 3, 4, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, ReusableMediaListComponent_ng_container_2_div_2_Template, 4, 7, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r186 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r186.filtered.length === ctx_r186.entries.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r186.filtered.length !== ctx_r186.entries.length);
} }
function ReusableMediaListComponent_tr_29_ng_container_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const entry_r191 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", entry_r191.series, " - ");
} }
function ReusableMediaListComponent_tr_29_div_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const speaker_r195 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", speaker_r195, " ");
} }
const _c0 = function (a1) { return ["/media", a1]; };
const _c1 = function (a1) { return ["fad", a1]; };
function ReusableMediaListComponent_tr_29_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "a", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, ReusableMediaListComponent_tr_29_ng_container_8_Template, 2, 1, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, ReusableMediaListComponent_tr_29_div_11_Template, 2, 1, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "fa-icon", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const entry_r191 = ctx.$implicit;
    const ctx_r187 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](entry_r191.dateString);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](entry_r191.timeString);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](11, _c0, entry_r191.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", entry_r191.series);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", entry_r191.name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", entry_r191.speakers);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"](ctx_r187.Utility.StatusToClass(entry_r191.status));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](13, _c1, ctx_r187.Utility.StatusToIcon(entry_r191.status)));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", entry_r191.statusString, " ");
} }
function ReusableMediaListComponent_div_30_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "No media available.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function ReusableMediaListComponent_div_30_app_loading_indicator_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-loading-indicator");
} }
function ReusableMediaListComponent_div_30_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, ReusableMediaListComponent_div_30_div_1_Template, 2, 0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, ReusableMediaListComponent_div_30_app_loading_indicator_2_Template, 1, 0, "app-loading-indicator", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r188 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r188.media);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r188.media);
} }
class ReusableMediaListComponent {
    constructor(locale) {
        this.locale = locale;
        this.Utility = _classes_utility__WEBPACK_IMPORTED_MODULE_2__["Utility"];
        this.seriesById = {};
        this.speakerById = {};
        this.entries = [];
        this.filtered = [];
        this.loaded = [];
        this.sort = 'id';
        this.ascending = false;
        this.SortOptions = {
            id: (a, b) => {
                return a.id - b.id;
            },
            date: (a, b) => {
                const A = a.date;
                const B = b.date;
                return A < B ? -1 : (A > B ? 1 : (a.id - b.id));
            },
            name: (a, b) => {
                const A = (a.fullName || 'zzz').toLowerCase().trim();
                const B = (b.fullName || 'zzz').toLowerCase().trim();
                return A < B ? -1 : (A > B ? 1 : (a.id - b.id));
            },
            speakers: (a, b) => {
                const A = a.speakers.length ? a.speakers[0].toLowerCase().trim() : 'zzz';
                const B = b.speakers.length ? b.speakers[0].toLowerCase().trim() : 'zzz';
                return A < B ? -1 : (A > B ? 1 : (a.id - b.id));
            },
            status: (a, b) => {
                const A = a.status;
                const B = b.status;
                return A < B ? -1 : (A > B ? 1 : (a.id - b.id));
            },
        };
        _services_app_managers_series_manager__WEBPACK_IMPORTED_MODULE_3__["SeriesManager"].sharedInstance.series.forEach(o => this.seriesById[o.id] = o);
        _services_app_managers_speaker_manager__WEBPACK_IMPORTED_MODULE_4__["SpeakerManager"].sharedInstance.speakers.forEach(o => this.speakerById[o.id] = o);
    }
    ngOnChanges() {
        this.entries = (this.media || []).map(o => {
            const series = o.seriesId && this.seriesById[o.seriesId] ? this.seriesById[o.seriesId].name : undefined;
            let result = {
                id: o.id,
                date: o.date,
                dateString: Object(_angular_common__WEBPACK_IMPORTED_MODULE_1__["formatDate"])(o.date, 'mediumDate', this.locale),
                timeString: Object(_angular_common__WEBPACK_IMPORTED_MODULE_1__["formatDate"])(o.date, 'EEEE h:mm a', this.locale),
                series: series,
                name: o.name || 'Untitled',
                fullName: `${series ? series + ' - ' : ''}${o.name || 'Untitled'}`,
                speakers: (o.speakerIds || []).map(o => this.speakerById[o].name),
                status: o.status,
                statusString: _classes_utility__WEBPACK_IMPORTED_MODULE_2__["Utility"].StatusToText(o.status),
                statusColor: '#42C75D',
            };
            result.search = `${result.dateString}${result.timeString}${result.fullName}${result.speakers.join()}${result.statusString}`.toLowerCase();
            return result;
        });
        this.sort = 'id';
        this.ascending = false;
        this.updateEntries();
    }
    onLoadMoreRows() {
        this.loaded = this.loaded.concat(this.filtered.slice(this.loaded.length, this.loaded.length + 30));
    }
    onSort(sort) {
        if (sort !== this.sort) {
            this.sort = sort;
            this.ascending = true;
        }
        else if (!this.ascending) {
            this.sort = 'id';
            this.ascending = false;
        }
        else {
            this.ascending = false;
        }
        this.updateEntries();
    }
    updateEntries() {
        const search = (this.search || '').toLowerCase();
        const comparator = this.SortOptions[this.sort];
        this.filtered = this.entries.filter(o => !search || o.search.indexOf(search) >= 0).sort(this.ascending ? comparator : (a, b) => -comparator(a, b));
        this.loaded = this.filtered.slice(0, 30);
    }
    onSearchUpdate() {
        this.updateEntries();
    }
}
ReusableMediaListComponent.ɵfac = function ReusableMediaListComponent_Factory(t) { return new (t || ReusableMediaListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"])); };
ReusableMediaListComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ReusableMediaListComponent, selectors: [["app-reusable-media-list"]], inputs: { media: "media" }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]()], decls: 31, vars: 14, consts: [[1, "content"], [1, "options-container"], [4, "ngIf"], [1, "spacer"], [1, "search"], ["type", "text", 3, "ngModel", "placeholder", "ngModelChange"], ["infiniteScroll", "", 1, "scrollable-region", 3, "scrollWindow", "scrolled"], [2, "width", "160px"], [1, "header"], [1, "name"], [3, "active", "icon", "click"], [2, "width", "200px"], [2, "width", "140px"], [4, "ngFor", "ngForOf"], ["class", "loading-container", 4, "ngIf"], ["class", "count", 4, "ngIf"], [1, "count"], [1, "date"], [1, "time"], [3, "routerLink"], [3, "icon"], [1, "loading-container"]], template: function ReusableMediaListComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, ReusableMediaListComponent_ng_container_2_Template, 3, 2, "ng-container", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function ReusableMediaListComponent_Template_input_ngModelChange_5_listener($event) { return ctx.search = $event; })("ngModelChange", function ReusableMediaListComponent_Template_input_ngModelChange_5_listener() { return ctx.onSearchUpdate(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("scrolled", function ReusableMediaListComponent_Template_div_scrolled_6_listener() { return ctx.onLoadMoreRows(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "table");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "th", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "app-action-icon", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ReusableMediaListComponent_Template_app_action_icon_click_13_listener() { return ctx.onSort("date"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "app-action-icon", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ReusableMediaListComponent_Template_app_action_icon_click_18_listener() { return ctx.onSort("name"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "th", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Speakers");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "app-action-icon", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ReusableMediaListComponent_Template_app_action_icon_click_23_listener() { return ctx.onSort("speakers"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "th", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Status");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "app-action-icon", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ReusableMediaListComponent_Template_app_action_icon_click_28_listener() { return ctx.onSort("status"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](29, ReusableMediaListComponent_tr_29_Template, 16, 15, "tr", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](30, ReusableMediaListComponent_div_30_Template, 3, 2, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.filtered.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.search)("placeholder", "Search...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("scrollWindow", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("active", ctx.sort === "date")("icon", ctx.sort !== "date" ? "sort" : ctx.ascending ? "sort-up" : "sort-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("active", ctx.sort === "name")("icon", ctx.sort !== "name" ? "sort" : ctx.ascending ? "sort-up" : "sort-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("active", ctx.sort === "speakers")("icon", ctx.sort !== "speakers" ? "sort" : ctx.ascending ? "sort-up" : "sort-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("active", ctx.sort === "status")("icon", ctx.sort !== "status" ? "sort" : ctx.ascending ? "sort-up" : "sort-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.loaded);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.media || !ctx.media.length);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgModel"], ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__["InfiniteScrollDirective"], _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_7__["ActionIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_1__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_8__["RouterLinkWithHref"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_9__["FaIconComponent"], _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_10__["LoadingIndicatorComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["DecimalPipe"]], styles: [".header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  margin-bottom: 2.5rem;\n}\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.options-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n.options-container[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.options-container[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  width: 320px;\n}\n.scrollable-region[_ngcontent-%COMP%] {\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  overflow: hidden;\n}\ntable[_ngcontent-%COMP%] {\n  table-layout: fixed;\n  border-collapse: collapse;\n  width: 100%;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n  background-color: #FFFFFF;\n  padding: 10px 16px;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon {\n  color: #e6e6e6;\n  margin: -5px 0px -5px 8px;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon:hover {\n  color: #333333;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon.active {\n  color: #333333;\n}\ntable[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n  background-color: #FFFFFF;\n  padding: 20px 16px;\n}\ntable[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid #e6e6e6;\n}\ntable[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(even)   td[_ngcontent-%COMP%] {\n  background-color: #fdfdfd;\n}\n.loading-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n  height: 140px;\n}\n.time[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 300;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL21lZGlhL3JldXNhYmxlLW1lZGlhLWxpc3QvcmV1c2FibGUtbWVkaWEtbGlzdC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbWVkaWEvcmV1c2FibGUtbWVkaWEtbGlzdC9yZXVzYWJsZS1tZWRpYS1saXN0LmNvbXBvbmVudC5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL19taXhpbnMuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EscUJBQUE7QUNGSjtBRElJO0VFREEsZUFBQTtFQUNBLGdCQUFBO0VGRUksbUJBQUE7VUFBQSxjQUFBO0FDRFI7QURLQTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7QUNGSjtBRElJO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0FDRlI7QURLSTtFQUNJLHlCR3BCTTtFSHFCTixZQUFBO0FDSFI7QURPQTtFQUNJLHlCQUFBO0VBQ0Esa0JHSlk7RUhLWixnQkFBQTtBQ0pKO0FET0E7RUFDSSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0EsV0FBQTtBQ0pKO0FETUk7RUFDSSxnQkFBQTtFQUNBLHlCR3RDTTtFSHVDTixrQkFBQTtBQ0pSO0FETVE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDSlo7QURNWTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtBQ0poQjtBRE9ZO0VBQ0ksY0c5Q0c7RUgrQ0gseUJBQUE7QUNMaEI7QURPZ0I7RUFDSSxjR3JETjtBRmdEZDtBRE9nQjtFQUNJLGNHeEROO0FGbURkO0FEV0k7RUFDSSxtQkFBQTtFQUNBLHlCR2pFTTtFSGtFTixrQkFBQTtBQ1RSO0FEWUk7RUFDSSxnQ0FBQTtBQ1ZSO0FEYUk7RUFDSSx5QkdwRWM7QUZ5RHRCO0FEZUE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtFQUNBLGFBQUE7QUNaSjtBRGVBO0VBQ0ksbUJHcEVjO0VIcUVkLGdCQUFBO0FDWkoiLCJmaWxlIjoic3JjL2FwcC9tZWRpYS9yZXVzYWJsZS1tZWRpYS1saXN0L3JldXNhYmxlLW1lZGlhLWxpc3QuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0IFwiLi4vLi4vLi4vc2Nzcy92YXJpYWJsZXNcIjtcbkBpbXBvcnQgXCIuLi8uLi8uLi9zY3NzL21peGluc1wiO1xuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIGhlYWRlci1mb250KCk7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIH1cbn1cblxuLm9wdGlvbnMtY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAuc3BhY2VyIHtcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgfVxuXG4gICAgLnNlYXJjaCBpbnB1dCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS13aGl0ZTtcbiAgICAgICAgd2lkdGg6IDMyMHB4O1xuICAgIH1cbn1cblxuLnNjcm9sbGFibGUtcmVnaW9uIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAkdGhlbWUtZ3JheS1ib3JkZXI7XG4gICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxudGFibGUge1xuICAgIHRhYmxlLWxheW91dDogZml4ZWQ7XG4gICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgICB3aWR0aDogMTAwJTtcblxuICAgIHRoIHtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLXdoaXRlO1xuICAgICAgICBwYWRkaW5nOiAxMHB4IDE2cHg7XG5cbiAgICAgICAgLmhlYWRlciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAgICAgLm5hbWUge1xuICAgICAgICAgICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICA6Om5nLWRlZXAgLmFjdGlvbi1pY29uIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogJHRoZW1lLWdyYXktbGlnaHQ7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAtNXB4IDBweCAtNXB4IDhweDtcblxuICAgICAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJHRoZW1lLWJsYWNrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAmLmFjdGl2ZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAkdGhlbWUtYmxhY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGQge1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgICAgIHBhZGRpbmc6IDIwcHggMTZweDtcbiAgICB9XG5cbiAgICB0cjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICR0aGVtZS1ncmF5LWJvcmRlcjtcbiAgICB9XG4gICAgXG4gICAgdHI6bnRoLWNoaWxkKGV2ZW4pIHRkIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLWdyYXktbGlnaHRlc3Q7XG4gICAgfVxufVxuXG4ubG9hZGluZy1jb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBoZWlnaHQ6IDE0MHB4O1xufVxuXG4udGltZSB7XG4gICAgZm9udC1zaXplOiAkZm9udC1zaXplLXNtYWxsO1xuICAgIGZvbnQtd2VpZ2h0OiAzMDA7XG59IiwiLmhlYWRlci1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XG59XG4uaGVhZGVyLWNvbnRhaW5lciAudGl0bGUge1xuICBmb250LXNpemU6IDMycHg7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxuXG4ub3B0aW9ucy1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuLm9wdGlvbnMtY29udGFpbmVyIC5zcGFjZXIge1xuICBmbGV4OiAxIDEgYXV0bztcbn1cbi5vcHRpb25zLWNvbnRhaW5lciAuc2VhcmNoIGlucHV0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgd2lkdGg6IDMyMHB4O1xufVxuXG4uc2Nyb2xsYWJsZS1yZWdpb24ge1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTZlNmU2O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbnRhYmxlIHtcbiAgdGFibGUtbGF5b3V0OiBmaXhlZDtcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgd2lkdGg6IDEwMCU7XG59XG50YWJsZSB0aCB7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGJhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7XG4gIHBhZGRpbmc6IDEwcHggMTZweDtcbn1cbnRhYmxlIHRoIC5oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxudGFibGUgdGggLmhlYWRlciAubmFtZSB7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxudGFibGUgdGggLmhlYWRlciA6Om5nLWRlZXAgLmFjdGlvbi1pY29uIHtcbiAgY29sb3I6ICNlNmU2ZTY7XG4gIG1hcmdpbjogLTVweCAwcHggLTVweCA4cHg7XG59XG50YWJsZSB0aCAuaGVhZGVyIDo6bmctZGVlcCAuYWN0aW9uLWljb246aG92ZXIge1xuICBjb2xvcjogIzMzMzMzMztcbn1cbnRhYmxlIHRoIC5oZWFkZXIgOjpuZy1kZWVwIC5hY3Rpb24taWNvbi5hY3RpdmUge1xuICBjb2xvcjogIzMzMzMzMztcbn1cbnRhYmxlIHRkIHtcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgcGFkZGluZzogMjBweCAxNnB4O1xufVxudGFibGUgdHI6bm90KDpsYXN0LWNoaWxkKSB7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTZlNmU2O1xufVxudGFibGUgdHI6bnRoLWNoaWxkKGV2ZW4pIHRkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZkZmRmZDtcbn1cblxuLmxvYWRpbmctY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGhlaWdodDogMTQwcHg7XG59XG5cbi50aW1lIHtcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgZm9udC13ZWlnaHQ6IDMwMDtcbn0iLCJAaW1wb3J0IFwidmFyaWFibGVzXCI7XG5cbkBtaXhpbiBzaGFkb3coKSB7XG4gICAgYm94LXNoYWRvdzogMCAxcHggNHB4IDAgcmdiYSgwLCAwLCAwLCAwLjA2KTtcbn1cblxuQG1peGluIGhlYWRlci1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMzJweDtcbiAgICBmb250LXdlaWdodDogODAwO1xufVxuXG5AbWl4aW4gdGl0bGUtZm9udCgpIHtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cblxuQG1peGluIGxhYmVsLWZvbnQoKSB7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjb2xvcjogJHRoZW1lLWdyYXk7XG4gICAgbWFyZ2luLWJvdHRvbTogMnB4O1xufVxuIiwiLy8gaHR0cHM6Ly9jb2xvcmh1bnQuY28vcGFsZXR0ZS8xNTcxMThcblxuLy8gQ29sb3JzXG4kdGhlbWUtd2hpdGU6ICNGRkZGRkY7XG4kdGhlbWUtYmxhY2s6ICMzMzMzMzM7XG4kdGhlbWUtZ3JheS1kYXJrOiByZWQ7XG4kdGhlbWUtZ3JheTogIzhhOGE4YTtcbiR0aGVtZS1ncmF5LWxpZ2h0OiAjZTZlNmU2O1xuJHRoZW1lLWdyYXktbGlnaHRlcjogI2Y1ZjVmNTtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXN0OiAjZmRmZGZkO1xuJHRoZW1lLWdyYXktYm9yZGVyOiAkdGhlbWUtZ3JheS1saWdodDtcblxuJHRoZW1lLXByaW1hcnk6ICMzM2JlZmY7XG5cbiR0aGVtZS1zdWNjZXNzOiAjNDJDNzVEO1xuJHRoZW1lLWRhbmdlcjogI0ZBM0UzOTtcbiR0aGVtZS13YXJuaW5nOiAjRkZDMjAwO1xuXG4vLyBGb250cyBhbmQgVGV4dFxuJGZvbnQtZmFtaWx5OiBwcm94aW1hLW5vdmEsIFwiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcblxuJGZvbnQtc2l6ZS1zbWFsbDogMC44NzVyZW07XG4kZm9udC1zaXplLW1lZGl1bTogMXJlbTtcbiRmb250LXNpemUtbGFyZ2U6IDEuNXJlbTtcblxuLy8gTGF5b3V0XG4kYm9yZGVyLXJhZGl1czogNHB4O1xuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ReusableMediaListComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-reusable-media-list',
                templateUrl: './reusable-media-list.component.html',
                styleUrls: ['./reusable-media-list.component.scss']
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"]]
            }] }]; }, { media: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/organization/organization-detail/organization-detail.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/organization/organization-detail/organization-detail.component.ts ***!
  \***********************************************************************************/
/*! exports provided: OrganizationDetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrganizationDetailComponent", function() { return OrganizationDetailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var _services_app_managers_organization_manager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @services/app/managers/organization.manager */ "./src/app/_services/app/managers/organization.manager.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
/* harmony import */ var _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @common/copy-box/copy-box.component */ "./src/app/_common/copy-box/copy-box.component.ts");















const _c0 = function () { return ["fad", "cloud-upload"]; };
function OrganizationDetailComponent_ng_container_40_Template(rf, ctx) { if (rf & 1) {
    const _r57 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function OrganizationDetailComponent_ng_container_40_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r57); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r50 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](32); return _r50.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Upload Image ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
} }
function OrganizationDetailComponent_ng_container_41_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Uploading Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r52.uploading.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", ctx_r52.progress * 100, "%");
} }
function OrganizationDetailComponent_img_44_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 28);
} if (rf & 2) {
    const ctx_r53 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r53.imageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function OrganizationDetailComponent_div_45_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "No image selected.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function OrganizationDetailComponent_div_46_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Image Links");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "app-copy-box", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Thumbnail");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "app-copy-box", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r55.organization.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r55.organization.thumbnailUrl);
} }
class OrganizationDetailComponent {
    constructor(app, route, notifications) {
        this.app = app;
        this.route = route;
        this.notifications = notifications;
        this.saving = false;
    }
    ngOnInit() {
        this.organization = _services_app_managers_organization_manager__WEBPACK_IMPORTED_MODULE_6__["OrganizationManager"].sharedInstance.organization;
        this.form = new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroup"]({});
        this.form.addControl('name', new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](this.organization.name));
        this.form.addControl('description', new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](this.organization.description));
        this.form.addControl('url', new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](this.organization.url));
        this.imageUrl = this.organization.imageUrl ? `${this.organization.imageUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
    }
    onSave() {
        let organization = { id: this.organization.id };
        organization.name = this.form.controls.name.value;
        organization.url = this.form.controls.url.value;
        organization.description = this.form.controls.description.value || null;
        this.saving = true;
        this.app.API.updateOrganization(organization).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.saving = false;
        })).subscribe(organization => {
            this.organization = organization;
            this.notifications.success('Success', 'Organization details saved successfully.', { timeOut: 5000 });
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem saving.');
        });
    }
    onImageSelected(event) {
        var _a, _b;
        let file = ((_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length) && event.target.files[0] || undefined;
        if (!file) {
            return;
        }
        this.uploading = file;
        this.progress = 0;
        this.app.API.uploadImageForOrganization(this.organization, file, progress => {
            this.progress = progress;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.uploading = undefined;
            this.progress = 1;
        })).subscribe(organization => {
            this.notifications.success('Success', 'Organization image updated.', { timeOut: 5000 });
            this.organization = this.app.organizationManager.organization = organization;
            this.imageUrl = this.organization.imageUrl ? `${this.organization.imageUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem uploading.');
        });
    }
}
OrganizationDetailComponent.ɵfac = function OrganizationDetailComponent_Factory(t) { return new (t || OrganizationDetailComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["NotificationsService"])); };
OrganizationDetailComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: OrganizationDetailComponent, selectors: [["app-organization-detail"]], decls: 47, vars: 14, consts: [[1, "header-container"], [1, "title"], [1, "content-section"], [3, "formGroup"], [1, "column-container"], [1, "column"], [1, "input-container"], [1, "label"], ["type", "text", 3, "formControlName", "placeholder"], ["rows", "6", 3, "formControlName", "placeholder"], [1, "button", 3, "disabled", "click"], [1, "image-content-container"], [1, "image-content-row"], [1, "image-content-col", "image-content-col-third"], [1, "image-upload-container"], ["type", "file", "accept", "image/jpg,image/jpeg", 2, "display", "none", 3, "change"], ["input", ""], [4, "ngIf"], [1, "image-content-col"], [1, "image-container"], [3, "src", 4, "ngIf"], ["class", "image-placeholder", 4, "ngIf"], ["class", "image-content-row", 4, "ngIf"], [1, "button", 3, "click"], [3, "icon"], [1, "upload-name"], [1, "progress-bar-container"], [1, "progress-bar"], [3, "src"], [1, "image-placeholder"], [3, "text"]], template: function OrganizationDetailComponent_Template(rf, ctx) { if (rf & 1) {
        const _r58 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Details");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "form", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "URL");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Description");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](21, "textarea", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function OrganizationDetailComponent_Template_button_click_22_listener() { return ctx.onSave(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Image");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "input", 15, 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function OrganizationDetailComponent_Template_input_change_31_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r58); const _r50 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](32); ctx.onImageSelected($event); return _r50.value = null; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "Upload an image for this church.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "Image must be in ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, ".jpg");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, " format.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](40, OrganizationDetailComponent_ng_container_40_Template, 4, 2, "ng-container", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](41, OrganizationDetailComponent_ng_container_41_Template, 7, 3, "ng-container", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](44, OrganizationDetailComponent_img_44_Template, 1, 1, "img", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](45, OrganizationDetailComponent_div_45_Template, 2, 0, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](46, OrganizationDetailComponent_div_46_Template, 10, 2, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.organization.name || "Untitled", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "name")("placeholder", "Untitled");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "url")("placeholder", "https://hopestream.com");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "description")("placeholder", "Give a high-level overview of the church...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx.form || !ctx.form.valid || ctx.saving);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.uploading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.uploading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.imageUrl);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.imageUrl);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.organization.imageUrl);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControlName"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__["FaIconComponent"], _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_9__["CopyBoxComponent"]], styles: [".breadcrumb-container[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n\n.header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin-bottom: 2.5rem;\n}\n\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n\n.content-section[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  padding: 32px;\n  margin-bottom: 1rem;\n}\n\n.content-section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  line-height: 1;\n  margin-bottom: 1.5rem;\n}\n\n.content-section.content-section-danger[_ngcontent-%COMP%] {\n  background-color: #fffbfb;\n  border-color: #FA3E39;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:first-child) {\n  padding-left: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:last-child) {\n  padding-right: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\nform[_ngcontent-%COMP%]     input {\n  margin-bottom: 0;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #e6e6e6;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #e6e6e6;\n}\n\nform[_ngcontent-%COMP%]   .include-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\nform[_ngcontent-%COMP%]   .topic-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]:not(:last-child) {\n  margin-bottom: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding: 0px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:first-child {\n  margin-left: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:last-child {\n  margin-right: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   app-copy-box[_ngcontent-%COMP%]:not(:last-child) {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-half[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-third[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 33%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .upload-name[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  width: 100%;\n  height: 0.5rem;\n  margin-top: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #33beff;\n  border-radius: 4px;\n  -webkit-transition: width 0.1s linear;\n  transition: width 0.1s linear;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  width: 100%;\n  padding-top: calc((9 / 16) * 100%);\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   .image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL29yZ2FuaXphdGlvbi9vcmdhbml6YXRpb24tZGV0YWlsL29yZ2FuaXphdGlvbi1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL29yZ2FuaXphdGlvbi9vcmdhbml6YXRpb24tZGV0YWlsL29yZ2FuaXphdGlvbi1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX21peGlucy5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTtFQUNJLHFCQUFBO0FDRko7O0FES0E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSw0QkFBQTtFQUFBLDZCQUFBO1VBQUEsc0JBQUE7RUFDQSxxQkFBQTtBQ0ZKOztBRElJO0VFTEEsZUFBQTtFQUNBLGdCQUFBO0FESUo7O0FESUk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDRlI7O0FESVE7RUFDSSxvQkFBQTtBQ0ZaOztBRE9BO0VBQ0kseUJHeEJVO0VIeUJWLHlCQUFBO0VBQ0Esa0JHSFk7RUhJWixhQUFBO0VBQ0EsbUJBQUE7QUNKSjs7QURNSTtFRXJCQSxlQUFBO0VBQ0EsZ0JBQUE7RUZzQkksY0FBQTtFQUNBLHFCQUFBO0FDSFI7O0FETUk7RUFDSSx5QkFBQTtFQUNBLHFCRzFCTztBRnNCZjs7QURTSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtBQ05SOztBRFFRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ05aOztBRFFZO0VBQ0ksb0JBQUE7QUNOaEI7O0FEUVk7RUFDSSxxQkFBQTtBQ05oQjs7QURXSTtFQUNJLG1CQUFBO0FDVFI7O0FEWUk7RUVqREEseUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQ2RTO0VEZVQsa0JBQUE7QUR3Q0o7O0FEU0k7RUFDSSxnQkFBQTtBQ1BSOztBRFVJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtBQ1JSOztBRFVRO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHFCQUFBO1VBQUEseUJBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7QUNSWjs7QURVWTtFQUNJLHlCR2pGRztBRnlFbkI7O0FEYUk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDWFI7O0FEYVE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EscUJBQUE7VUFBQSx5QkFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtBQ1haOztBRGFZO0VBQ0kseUJHcEdHO0FGeUZuQjs7QURnQkk7RUFDSSxnQkFBQTtBQ2RSOztBRGdCSTtFQUNJLGdCQUFBO0FDZFI7O0FEbUJJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0FDaEJSOztBRGtCUTtFQUNJLHFCQUFBO0FDaEJaOztBRG1CUTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtFQUNBLGdCQUFBO0FDakJaOztBRG1CWTtFQUNJLGlCQUFBO0FDakJoQjs7QURtQlk7RUFDSSxrQkFBQTtBQ2pCaEI7O0FEb0JZO0VFMUhSLHlCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0NkUztFRGVULGtCQUFBO0FEeUdKOztBRGdCWTtFQUNJLGNBQUE7RUFDQSxtQkFBQTtBQ2RoQjs7QURpQlE7RUFDSSxtQkFBQTtVQUFBLGNBQUE7RUFDQSxVQUFBO0FDZlo7O0FEaUJRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ2ZaOztBRGtCUTtFQUNJLGdCQUFBO0FDaEJaOztBRHFCUTtFQUNJLGdCQUFBO0FDbkJaOztBRHFCUTtFQUNJLGtCQUFBO0FDbkJaOztBRHFCUTtFQUNJLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSx1QkFBQTtBQ25CWjs7QURxQlE7RUFDSSxrQkFBQTtFQUNBLHlCR3ZLUztFSHdLVCxrQkd0Skk7RUh1SkosV0FBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtBQ25CWjs7QURxQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsT0FBQTtFQUFTLFNBQUE7RUFDckMseUJHM0tJO0VINEtKLGtCRzlKSTtFSCtKSixxQ0FBQTtFQUFBLDZCQUFBO0FDaEJaOztBRG9CSTtFQUNJLGtCQUFBO0VBQ0EseUJHdkxhO0VId0xiLFdBQUE7RUFDQSxrQ0FBQTtBQ2xCUjs7QURvQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsUUFBQTtFQUFVLE9BQUE7QUNmbEQ7O0FEa0JRO0VBQ0ksa0JBQUE7RUFBb0IsTUFBQTtFQUFRLFNBQUE7RUFBVyxRQUFBO0VBQVUsT0FBQTtFQUNqRCxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtBQ1paIiwiZmlsZSI6InNyYy9hcHAvb3JnYW5pemF0aW9uL29yZ2FuaXphdGlvbi1kZXRhaWwvb3JnYW5pemF0aW9uLWRldGFpbC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgXCIuLi8uLi8uLi9zY3NzL3ZhcmlhYmxlc1wiO1xuQGltcG9ydCBcIi4uLy4uLy4uL3Njc3MvbWl4aW5zXCI7XG5cbi5icmVhZGNydW1iLWNvbnRhaW5lciB7XG4gICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIGhlYWRlci1mb250KCk7XG4gICAgfVxuXG4gICAgLnN1YnRpdGxlIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc3RhdHVzIHtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMC41cmVtO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uY29udGVudC1zZWN0aW9uIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgJHRoZW1lLWdyYXktYm9yZGVyO1xuICAgIGJvcmRlci1yYWRpdXM6ICRib3JkZXItcmFkaXVzO1xuICAgIHBhZGRpbmc6IDMycHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIHRpdGxlLWZvbnQoKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbiAgICB9XG5cbiAgICAmLmNvbnRlbnQtc2VjdGlvbi1kYW5nZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGVuKCR0aGVtZS1kYW5nZXIsIDM5JSk7XG4gICAgICAgIGJvcmRlci1jb2xvcjogJHRoZW1lLWRhbmdlcjtcbiAgICB9XG59XG5cbmZvcm0ge1xuICAgIC5jb2x1bW4tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAuY29sdW1uIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDUwJTtcblxuICAgICAgICAgICAgJjpub3QoOmZpcnN0LWNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAwLjVyZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAmOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDAuNXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5pbnB1dC1jb250YWluZXIge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgIH1cblxuICAgIC5sYWJlbCB7XG4gICAgICAgIEBpbmNsdWRlIGxhYmVsLWZvbnQoKTtcbiAgICB9XG5cbiAgICA6Om5nLWRlZXAgaW5wdXQge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgIH1cblxuICAgIC5zZXJpZXMtaXRlbS1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIC5zZXJpZXMtaXRlbS1pbWFnZSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgd2lkdGg6IDEwMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA1NnB4O1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuXG4gICAgICAgICAgICAmLnBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc3BlYWtlci1pdGVtLWltYWdlIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB3aWR0aDogMTAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDU2cHg7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG5cbiAgICAgICAgICAgICYucGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmluY2x1ZGUtaXRlbS1sYWJlbCB7XG4gICAgICAgIHBhZGRpbmc6IDRweCA4cHg7XG4gICAgfVxuICAgIC50b3BpYy1pdGVtLWxhYmVsIHtcbiAgICAgICAgcGFkZGluZzogNHB4IDhweDtcbiAgICB9XG59XG5cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciB7XG4gICAgLmltYWdlLWNvbnRlbnQtcm93IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAmOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuICAgICAgICB9XG5cbiAgICAgICAgLmltYWdlLWNvbnRlbnQtY29sIHtcbiAgICAgICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICAgICAgcGFkZGluZzogMHB4IDhweDtcblxuICAgICAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IC04cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogLThweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmxhYmVsIHtcbiAgICAgICAgICAgICAgICBAaW5jbHVkZSBsYWJlbC1mb250KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcHAtY29weS1ib3g6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAuaW1hZ2UtY29udGVudC1jb2wtaGFsZiB7XG4gICAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcbiAgICAgICAgICAgIHdpZHRoOiA1MCU7XG4gICAgICAgIH1cbiAgICAgICAgLmltYWdlLWNvbnRlbnQtY29sLXRoaXJkIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDMzJTtcbiAgICAgICAgfVxuXG4gICAgICAgIC50aXRsZSB7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAycmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmltYWdlLXVwbG9hZC1jb250YWluZXIge1xuICAgICAgICAuYnV0dG9uIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgICAgIH1cbiAgICAgICAgLmxhYmVsIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDEuNXJlbTtcbiAgICAgICAgfVxuICAgICAgICAudXBsb2FkLW5hbWUge1xuICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgICAgfVxuICAgICAgICAucHJvZ3Jlc3MtYmFyLWNvbnRhaW5lciB7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVyO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMC41cmVtO1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMC41cmVtO1xuICAgICAgICB9XG4gICAgICAgIC5wcm9ncmVzcy1iYXIge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGJvdHRvbTogMDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1wcmltYXJ5O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAwLjFzIGxpbmVhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5pbWFnZS1jb250YWluZXIge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nLXRvcDogY2FsYygoOSAvIDE2KSAqIDEwMCUpO1xuXG4gICAgICAgIGltZyB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgcmlnaHQ6IDA7IGxlZnQ6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAuaW1hZ2UtcGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGJvdHRvbTogMDsgcmlnaHQ6IDA7IGxlZnQ6IDA7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLmJyZWFkY3J1bWItY29udGFpbmVyIHtcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcbn1cbi5oZWFkZXItY29udGFpbmVyIC50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMzJweDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbn1cbi5oZWFkZXItY29udGFpbmVyIC5zdWJ0aXRsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4uaGVhZGVyLWNvbnRhaW5lciAuc3VidGl0bGUgLnN0YXR1cyB7XG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xufVxuXG4uY29udGVudC1zZWN0aW9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgYm9yZGVyOiAxcHggc29saWQgI2U2ZTZlNjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBwYWRkaW5nOiAzMnB4O1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuLmNvbnRlbnQtc2VjdGlvbiAudGl0bGUge1xuICBmb250LXNpemU6IDI0cHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG59XG4uY29udGVudC1zZWN0aW9uLmNvbnRlbnQtc2VjdGlvbi1kYW5nZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmYmZiO1xuICBib3JkZXItY29sb3I6ICNGQTNFMzk7XG59XG5cbmZvcm0gLmNvbHVtbi1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuZm9ybSAuY29sdW1uLWNvbnRhaW5lciAuY29sdW1uIHtcbiAgZmxleDogMCAwIGF1dG87XG4gIHdpZHRoOiA1MCU7XG59XG5mb3JtIC5jb2x1bW4tY29udGFpbmVyIC5jb2x1bW46bm90KDpmaXJzdC1jaGlsZCkge1xuICBwYWRkaW5nLWxlZnQ6IDAuNXJlbTtcbn1cbmZvcm0gLmNvbHVtbi1jb250YWluZXIgLmNvbHVtbjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgcGFkZGluZy1yaWdodDogMC41cmVtO1xufVxuZm9ybSAuaW5wdXQtY29udGFpbmVyIHtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cbmZvcm0gLmxhYmVsIHtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBjb2xvcjogIzhhOGE4YTtcbiAgbWFyZ2luLWJvdHRvbTogMnB4O1xufVxuZm9ybSA6Om5nLWRlZXAgaW5wdXQge1xuICBtYXJnaW4tYm90dG9tOiAwO1xufVxuZm9ybSAuc2VyaWVzLWl0ZW0tY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmZvcm0gLnNlcmllcy1pdGVtLWNvbnRhaW5lciAuc2VyaWVzLWl0ZW0taW1hZ2Uge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB3aWR0aDogMTAwcHg7XG4gIGhlaWdodDogNTZweDtcbiAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xufVxuZm9ybSAuc2VyaWVzLWl0ZW0tY29udGFpbmVyIC5zZXJpZXMtaXRlbS1pbWFnZS5wbGFjZWhvbGRlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlNmU2ZTY7XG59XG5mb3JtIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmZvcm0gLnNwZWFrZXItaXRlbS1jb250YWluZXIgLnNwZWFrZXItaXRlbS1pbWFnZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAxMDBweDtcbiAgaGVpZ2h0OiA1NnB4O1xuICBtYXJnaW4tcmlnaHQ6IDFyZW07XG59XG5mb3JtIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIC5zcGVha2VyLWl0ZW0taW1hZ2UucGxhY2Vob2xkZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTZlNmU2O1xufVxuZm9ybSAuaW5jbHVkZS1pdGVtLWxhYmVsIHtcbiAgcGFkZGluZzogNHB4IDhweDtcbn1cbmZvcm0gLnRvcGljLWl0ZW0tbGFiZWwge1xuICBwYWRkaW5nOiA0cHggOHB4O1xufVxuXG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IHtcbiAgZGlzcGxheTogZmxleDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3c6bm90KDpsYXN0LWNoaWxkKSB7XG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sIHtcbiAgZmxleDogMSAxIGF1dG87XG4gIHBhZGRpbmc6IDBweCA4cHg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbDpmaXJzdC1jaGlsZCB7XG4gIG1hcmdpbi1sZWZ0OiAtOHB4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2w6bGFzdC1jaGlsZCB7XG4gIG1hcmdpbi1yaWdodDogLThweDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sIC5sYWJlbCB7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgY29sb3I6ICM4YThhOGE7XG4gIG1hcmdpbi1ib3R0b206IDJweDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sIGFwcC1jb3B5LWJveDpub3QoOmxhc3QtY2hpbGQpIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbC1oYWxmIHtcbiAgZmxleDogMCAwIGF1dG87XG4gIHdpZHRoOiA1MCU7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbC10aGlyZCB7XG4gIGZsZXg6IDAgMCBhdXRvO1xuICB3aWR0aDogMzMlO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAudGl0bGUge1xuICBtYXJnaW4tdG9wOiAycmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5idXR0b24ge1xuICBtYXJnaW4tdG9wOiAxcmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5sYWJlbCB7XG4gIG1hcmdpbi10b3A6IDEuNXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAudXBsb2FkLW5hbWUge1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAucHJvZ3Jlc3MtYmFyLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAwLjVyZW07XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtdXBsb2FkLWNvbnRhaW5lciAucHJvZ3Jlc3MtYmFyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzYmVmZjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB0cmFuc2l0aW9uOiB3aWR0aCAwLjFzIGxpbmVhcjtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xuICB3aWR0aDogMTAwJTtcbiAgcGFkZGluZy10b3A6IGNhbGMoKDkgLyAxNikgKiAxMDAlKTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIGltZyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgbGVmdDogMDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGFpbmVyIC5pbWFnZS1wbGFjZWhvbGRlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwO1xuICBsZWZ0OiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn0iLCJAaW1wb3J0IFwidmFyaWFibGVzXCI7XG5cbkBtaXhpbiBzaGFkb3coKSB7XG4gICAgYm94LXNoYWRvdzogMCAxcHggNHB4IDAgcmdiYSgwLCAwLCAwLCAwLjA2KTtcbn1cblxuQG1peGluIGhlYWRlci1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMzJweDtcbiAgICBmb250LXdlaWdodDogODAwO1xufVxuXG5AbWl4aW4gdGl0bGUtZm9udCgpIHtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cblxuQG1peGluIGxhYmVsLWZvbnQoKSB7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjb2xvcjogJHRoZW1lLWdyYXk7XG4gICAgbWFyZ2luLWJvdHRvbTogMnB4O1xufVxuIiwiLy8gaHR0cHM6Ly9jb2xvcmh1bnQuY28vcGFsZXR0ZS8xNTcxMThcblxuLy8gQ29sb3JzXG4kdGhlbWUtd2hpdGU6ICNGRkZGRkY7XG4kdGhlbWUtYmxhY2s6ICMzMzMzMzM7XG4kdGhlbWUtZ3JheS1kYXJrOiByZWQ7XG4kdGhlbWUtZ3JheTogIzhhOGE4YTtcbiR0aGVtZS1ncmF5LWxpZ2h0OiAjZTZlNmU2O1xuJHRoZW1lLWdyYXktbGlnaHRlcjogI2Y1ZjVmNTtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXN0OiAjZmRmZGZkO1xuJHRoZW1lLWdyYXktYm9yZGVyOiAkdGhlbWUtZ3JheS1saWdodDtcblxuJHRoZW1lLXByaW1hcnk6ICMzM2JlZmY7XG5cbiR0aGVtZS1zdWNjZXNzOiAjNDJDNzVEO1xuJHRoZW1lLWRhbmdlcjogI0ZBM0UzOTtcbiR0aGVtZS13YXJuaW5nOiAjRkZDMjAwO1xuXG4vLyBGb250cyBhbmQgVGV4dFxuJGZvbnQtZmFtaWx5OiBwcm94aW1hLW5vdmEsIFwiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcblxuJGZvbnQtc2l6ZS1zbWFsbDogMC44NzVyZW07XG4kZm9udC1zaXplLW1lZGl1bTogMXJlbTtcbiRmb250LXNpemUtbGFyZ2U6IDEuNXJlbTtcblxuLy8gTGF5b3V0XG4kYm9yZGVyLXJhZGl1czogNHB4O1xuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](OrganizationDetailComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-organization-detail',
                templateUrl: './organization-detail.component.html',
                styleUrls: ['./organization-detail.component.scss']
            }]
    }], function () { return [{ type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["NotificationsService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/routing.module.ts":
/*!***********************************!*\
  !*** ./src/app/routing.module.ts ***!
  \***********************************/
/*! exports provided: RoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoutingModule", function() { return RoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _base_base_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base/base.component */ "./src/app/base/base.component.ts");
/* harmony import */ var _services_loading_guard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @services/loading-guard */ "./src/app/_services/loading-guard.ts");
/* harmony import */ var _services_auth_guard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @services/auth-guard */ "./src/app/_services/auth-guard.ts");
/* harmony import */ var _sign_in_sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sign-in/sign-in/sign-in.component */ "./src/app/sign-in/sign-in/sign-in.component.ts");
/* harmony import */ var _media_media_list_media_list_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./media/media-list/media-list.component */ "./src/app/media/media-list/media-list.component.ts");
/* harmony import */ var _media_media_detail_media_detail_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./media/media-detail/media-detail.component */ "./src/app/media/media-detail/media-detail.component.ts");
/* harmony import */ var _organization_organization_detail_organization_detail_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./organization/organization-detail/organization-detail.component */ "./src/app/organization/organization-detail/organization-detail.component.ts");
/* harmony import */ var _series_series_list_series_list_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./series/series-list/series-list.component */ "./src/app/series/series-list/series-list.component.ts");
/* harmony import */ var _series_series_detail_series_detail_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./series/series-detail/series-detail.component */ "./src/app/series/series-detail/series-detail.component.ts");
/* harmony import */ var _speaker_speaker_list_speaker_list_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./speaker/speaker-list/speaker-list.component */ "./src/app/speaker/speaker-list/speaker-list.component.ts");
/* harmony import */ var _speaker_speaker_detail_speaker_detail_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./speaker/speaker-detail/speaker-detail.component */ "./src/app/speaker/speaker-detail/speaker-detail.component.ts");
/* harmony import */ var _feed_feed_list_feed_list_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./feed/feed-list/feed-list.component */ "./src/app/feed/feed-list/feed-list.component.ts");
/* harmony import */ var _feed_feed_detail_feed_detail_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./feed/feed-detail/feed-detail.component */ "./src/app/feed/feed-detail/feed-detail.component.ts");
/* harmony import */ var _media_media_upload_media_upload_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./media/media-upload/media-upload.component */ "./src/app/media/media-upload/media-upload.component.ts");
/* harmony import */ var _common_redirect_redirect_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @common/redirect/redirect.component */ "./src/app/_common/redirect/redirect.component.ts");
/* harmony import */ var _settings_settings_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./settings/settings.component */ "./src/app/settings/settings.component.ts");
/* harmony import */ var _common_blank_blank_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @common/blank/blank.component */ "./src/app/_common/blank/blank.component.ts");





















const routes = [
    {
        path: '', component: _base_base_component__WEBPACK_IMPORTED_MODULE_2__["BaseComponent"], canActivate: [_services_loading_guard__WEBPACK_IMPORTED_MODULE_3__["LoadingGuard"], _services_auth_guard__WEBPACK_IMPORTED_MODULE_4__["AuthGuard"]], canActivateChild: [_services_auth_guard__WEBPACK_IMPORTED_MODULE_4__["AuthGuard"]], children: [
            { path: 'church', component: _organization_organization_detail_organization_detail_component__WEBPACK_IMPORTED_MODULE_8__["OrganizationDetailComponent"] },
            { path: '', component: _common_redirect_redirect_component__WEBPACK_IMPORTED_MODULE_16__["RedirectComponent"] },
            { path: 'media', component: _media_media_list_media_list_component__WEBPACK_IMPORTED_MODULE_6__["MediaListComponent"] },
            { path: 'media/:id', component: _media_media_detail_media_detail_component__WEBPACK_IMPORTED_MODULE_7__["MediaDetailComponent"] },
            { path: 'upload', component: _media_media_upload_media_upload_component__WEBPACK_IMPORTED_MODULE_15__["MediaUploadComponent"] },
            { path: 'upload/:id', component: _media_media_upload_media_upload_component__WEBPACK_IMPORTED_MODULE_15__["MediaUploadComponent"] },
            { path: 'series', component: _series_series_list_series_list_component__WEBPACK_IMPORTED_MODULE_9__["SeriesListComponent"] },
            { path: 'series/:id', component: _series_series_detail_series_detail_component__WEBPACK_IMPORTED_MODULE_10__["SeriesDetailComponent"] },
            { path: 'speakers', component: _speaker_speaker_list_speaker_list_component__WEBPACK_IMPORTED_MODULE_11__["SpeakerListComponent"] },
            { path: 'speakers/:id', component: _speaker_speaker_detail_speaker_detail_component__WEBPACK_IMPORTED_MODULE_12__["SpeakerDetailComponent"] },
            { path: 'feeds', component: _feed_feed_list_feed_list_component__WEBPACK_IMPORTED_MODULE_13__["FeedListComponent"] },
            { path: 'feeds/:id', component: _feed_feed_detail_feed_detail_component__WEBPACK_IMPORTED_MODULE_14__["FeedDetailComponent"] },
            { path: 'settings', component: _settings_settings_component__WEBPACK_IMPORTED_MODULE_17__["SettingsComponent"] },
            { path: 'oauth', component: _common_blank_blank_component__WEBPACK_IMPORTED_MODULE_18__["BlankComponent"] },
        ]
    },
    { path: 'sign-in', canActivate: [_services_auth_guard__WEBPACK_IMPORTED_MODULE_4__["AuthGuard"]], component: _sign_in_sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_5__["SignInComponent"] },
    { path: '**', redirectTo: 'sign-in' },
];
class RoutingModule {
}
RoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: RoutingModule });
RoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function RoutingModule_Factory(t) { return new (t || RoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, { useHash: true })],
        _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](RoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](RoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, { useHash: true })],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/series/series-detail/series-detail.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/series/series-detail/series-detail.component.ts ***!
  \*****************************************************************/
/*! exports provided: SeriesDetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesDetailComponent", function() { return SeriesDetailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _classes_utility__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @classes/utility */ "./src/app/_classes/utility.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/dialog */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-dialog.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/api */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-api.js");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");
/* harmony import */ var _media_reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../media/reusable-media-list/reusable-media-list.component */ "./src/app/media/reusable-media-list/reusable-media-list.component.ts");
/* harmony import */ var _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @common/copy-box/copy-box.component */ "./src/app/_common/copy-box/copy-box.component.ts");




















const _c0 = function () { return ["fad", "cloud-upload"]; };
function SeriesDetailComponent_ng_container_4_ng_container_36_Template(rf, ctx) { if (rf & 1) {
    const _r79 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SeriesDetailComponent_ng_container_4_ng_container_36_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r79); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r71 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](28); return _r71.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Upload Image ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
} }
function SeriesDetailComponent_ng_container_4_ng_container_37_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Uploading Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r73 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r73.uploading.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", ctx_r73.progress * 100, "%");
} }
function SeriesDetailComponent_ng_container_4_img_40_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 41);
} if (rf & 2) {
    const ctx_r74 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r74.imageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function SeriesDetailComponent_ng_container_4_div_41_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "No image selected.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function SeriesDetailComponent_ng_container_4_div_42_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Image Links");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "app-copy-box", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Thumbnail");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "app-copy-box", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r76 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r76.series.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r76.series.thumbnailUrl);
} }
const _c1 = function () { return ["fad", "trash"]; };
function SeriesDetailComponent_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    const _r81 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Details");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "form", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "textarea", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SeriesDetailComponent_ng_container_4_Template_button_click_18_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r81); const ctx_r80 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r80.onSave(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Save");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "input", 25, 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function SeriesDetailComponent_ng_container_4_Template_input_change_27_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r81); const _r71 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](28); const ctx_r82 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); ctx_r82.onImageSelected($event); return _r71.value = null; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Upload an image for this media.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Image must be in ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, ".jpg");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, " format.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](36, SeriesDetailComponent_ng_container_4_ng_container_36_Template, 4, 2, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](37, SeriesDetailComponent_ng_container_4_ng_container_37_Template, 7, 3, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](40, SeriesDetailComponent_ng_container_4_img_40_Template, 1, 1, "img", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](41, SeriesDetailComponent_ng_container_4_div_41_Template, 2, 0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](42, SeriesDetailComponent_ng_container_4_div_42_Template, 10, 2, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](46, "app-reusable-media-list", 32, 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Danger Zone");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55, "Delete Series");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, "Permanently delete this series.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "NOTE:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, " This will not delete any media entries that are included in this series. This will simply delete the series, and those media records will no longer be associated with this series.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "button", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SeriesDetailComponent_ng_container_4_Template_button_click_63_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r81); const ctx_r83 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r83.deleteDialogVisible = true; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](64, "fa-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65, "Delete Series ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r70 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r70.series.name || "Untitled", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r70.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "name")("placeholder", "Untitled");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "description")("placeholder", "Give a high-level overview of the content of this series...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx_r70.form || !ctx_r70.form.valid || ctx_r70.saving);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r70.uploading);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r70.uploading);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r70.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r70.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r70.series.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("media", ctx_r70.media);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](14, _c1));
} }
const _c2 = function () { return ["/series"]; };
const _c3 = function () { return ["fad", "chevron-left"]; };
const _c4 = function () { return { width: "480px" }; };
class SeriesDetailComponent {
    constructor(app, route, router, notifications) {
        this.app = app;
        this.route = route;
        this.router = router;
        this.notifications = notifications;
        this.Utility = _classes_utility__WEBPACK_IMPORTED_MODULE_4__["Utility"];
        this.loading = true;
        this.media = [];
        this.saving = false;
        this.deleteDialogVisible = false;
        this.deleting = false;
    }
    ngOnInit() {
        this.form = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroup"]({});
        this.form.addControl('name', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('description', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        let id = parseInt(this.route.snapshot.params.id);
        Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["forkJoin"])(this.app.API.getSeries(id), this.app.API.getAllMedia()).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.loading = false;
        })).subscribe(responses => {
            this.series = responses[0];
            this.media = responses[1].filter(o => o.seriesId === this.series.id);
            this.form.controls.name.setValue(this.series.name);
            this.form.controls.description.setValue(this.series.description);
            this.imageUrl = this.series.imageUrl ? `${this.series.imageUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
        });
    }
    onSave() {
        let series = { id: this.series.id };
        series.name = this.form.controls.name.value;
        series.description = this.form.controls.description.value || null;
        this.saving = true;
        this.app.API.updateSeries(series).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.saving = false;
        })).subscribe(series => {
            this.series = series;
            this.notifications.success('Success', 'Series details saved successfully.', { timeOut: 5000 });
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem saving.');
        });
    }
    onImageSelected(event) {
        var _a, _b;
        let file = ((_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length) && event.target.files[0] || undefined;
        if (!file) {
            return;
        }
        this.uploading = file;
        this.progress = 0;
        this.app.API.uploadImageForSeries(this.series, file, progress => {
            this.progress = progress;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.uploading = undefined;
            this.progress = 1;
        })).subscribe(series => {
            this.notifications.success('Success', 'Series image updated.', { timeOut: 5000 });
            this.series = series;
            this.imageUrl = this.series.imageUrl ? `${this.series.imageUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem uploading.');
        });
    }
    onDelete() {
        this.deleting = true;
        this.app.API.deleteSeries(this.series).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.deleting = false;
        })).subscribe(() => {
            this.router.navigate(['/series']);
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem deleting.');
        });
    }
}
SeriesDetailComponent.ɵfac = function SeriesDetailComponent_Factory(t) { return new (t || SeriesDetailComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_6__["NotificationsService"])); };
SeriesDetailComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SeriesDetailComponent, selectors: [["app-series-detail"]], decls: 26, vars: 15, consts: [[1, "breadcrumb-container"], [3, "routerLink"], [3, "icon"], [4, "ngIf"], [3, "visible", "modal", "dismissableMask", "draggable", "visibleChange"], [1, "title"], [3, "icon", "click"], [2, "margin-top", "1rem"], [1, "button", "alert", 3, "disabled", "click"], [1, "button", "secondary", "hollow", 3, "click"], [1, "spacer"], [1, "header-container"], [1, "content-section"], [3, "formGroup"], [1, "column-container"], [1, "column"], [1, "input-container"], [1, "label"], ["type", "text", 3, "formControlName", "placeholder"], ["rows", "6", 3, "formControlName", "placeholder"], [1, "button", 3, "disabled", "click"], [1, "image-content-container"], [1, "image-content-row"], [1, "image-content-col", "image-content-col-third"], [1, "image-upload-container"], ["type", "file", "accept", "image/jpg,image/jpeg", 2, "display", "none", 3, "change"], ["input", ""], [1, "image-content-col"], [1, "image-container"], [3, "src", 4, "ngIf"], ["class", "image-placeholder", 4, "ngIf"], ["class", "image-content-row", 4, "ngIf"], [3, "media"], ["mediaList", ""], [1, "content-section", "content-section-danger"], [1, "image-content-col", "image-content-col-half"], [1, "button", "alert", 3, "click"], [1, "button", 3, "click"], [1, "upload-name"], [1, "progress-bar-container"], [1, "progress-bar"], [3, "src"], [1, "image-placeholder"], [3, "text"]], template: function SeriesDetailComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Back to Series List ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, SeriesDetailComponent_ng_container_4_Template, 66, 15, "ng-container", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p-dialog", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("visibleChange", function SeriesDetailComponent_Template_p_dialog_visibleChange_5_listener($event) { return ctx.deleteDialogVisible = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Delete Series");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "app-action-icon", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SeriesDetailComponent_Template_app_action_icon_click_9_listener() { return ctx.deleteDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Permanently delete ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "?");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "NOTE:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, " This will not delete any media entries that are included in this series. This will simply delete the series, and those media records will no longer be associated with this series.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "p-footer");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SeriesDetailComponent_Template_button_click_21_listener() { return ctx.onDelete(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Delete");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SeriesDetailComponent_Template_button_click_23_listener() { return ctx.deleteDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](12, _c2));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](13, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](14, _c4));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("visible", ctx.deleteDialogVisible)("modal", true)("dismissableMask", true)("draggable", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", "times");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((ctx.series == null ? null : ctx.series.name) || "Untitled");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.deleting);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLinkWithHref"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__["FaIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_9__["NgIf"], primeng_dialog__WEBPACK_IMPORTED_MODULE_10__["Dialog"], primeng_api__WEBPACK_IMPORTED_MODULE_11__["Header"], _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_12__["ActionIconComponent"], primeng_api__WEBPACK_IMPORTED_MODULE_11__["Footer"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControlName"], _media_reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_13__["ReusableMediaListComponent"], _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_14__["CopyBoxComponent"]], styles: [".breadcrumb-container[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n\n.header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin-bottom: 2.5rem;\n}\n\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n\n.content-section[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  padding: 32px;\n  margin-bottom: 1rem;\n}\n\n.content-section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  line-height: 1;\n  margin-bottom: 1.5rem;\n}\n\n.content-section.content-section-danger[_ngcontent-%COMP%] {\n  background-color: #fffbfb;\n  border-color: #FA3E39;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:first-child) {\n  padding-left: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:last-child) {\n  padding-right: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\nform[_ngcontent-%COMP%]     input {\n  margin-bottom: 0;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #e6e6e6;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #e6e6e6;\n}\n\nform[_ngcontent-%COMP%]   .include-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\nform[_ngcontent-%COMP%]   .topic-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]:not(:last-child) {\n  margin-bottom: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding: 0px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:first-child {\n  margin-left: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:last-child {\n  margin-right: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   app-copy-box[_ngcontent-%COMP%]:not(:last-child) {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-half[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-third[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 33%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .upload-name[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  width: 100%;\n  height: 0.5rem;\n  margin-top: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #33beff;\n  border-radius: 4px;\n  -webkit-transition: width 0.1s linear;\n  transition: width 0.1s linear;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  width: 100%;\n  padding-top: calc((9 / 16) * 100%);\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   .image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\napp-reusable-media-list[_ngcontent-%COMP%]     .scrollable-region {\n  max-height: 500px;\n  overflow: auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL3Nlcmllcy9zZXJpZXMtZGV0YWlsL3Nlcmllcy1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL3Nlcmllcy9zZXJpZXMtZGV0YWlsL3Nlcmllcy1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX21peGlucy5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTtFQUNJLHFCQUFBO0FDRko7O0FES0E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSw0QkFBQTtFQUFBLDZCQUFBO1VBQUEsc0JBQUE7RUFDQSxxQkFBQTtBQ0ZKOztBRElJO0VFTEEsZUFBQTtFQUNBLGdCQUFBO0FESUo7O0FESUk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDRlI7O0FESVE7RUFDSSxvQkFBQTtBQ0ZaOztBRE9BO0VBQ0kseUJHeEJVO0VIeUJWLHlCQUFBO0VBQ0Esa0JHSFk7RUhJWixhQUFBO0VBQ0EsbUJBQUE7QUNKSjs7QURNSTtFRXJCQSxlQUFBO0VBQ0EsZ0JBQUE7RUZzQkksY0FBQTtFQUNBLHFCQUFBO0FDSFI7O0FETUk7RUFDSSx5QkFBQTtFQUNBLHFCRzFCTztBRnNCZjs7QURTSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtBQ05SOztBRFFRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ05aOztBRFFZO0VBQ0ksb0JBQUE7QUNOaEI7O0FEUVk7RUFDSSxxQkFBQTtBQ05oQjs7QURXSTtFQUNJLG1CQUFBO0FDVFI7O0FEWUk7RUVqREEseUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQ2RTO0VEZVQsa0JBQUE7QUR3Q0o7O0FEU0k7RUFDSSxnQkFBQTtBQ1BSOztBRFVJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtBQ1JSOztBRFVRO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHFCQUFBO1VBQUEseUJBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7QUNSWjs7QURVWTtFQUNJLHlCR2pGRztBRnlFbkI7O0FEYUk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDWFI7O0FEYVE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EscUJBQUE7VUFBQSx5QkFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtBQ1haOztBRGFZO0VBQ0kseUJHcEdHO0FGeUZuQjs7QURnQkk7RUFDSSxnQkFBQTtBQ2RSOztBRGdCSTtFQUNJLGdCQUFBO0FDZFI7O0FEbUJJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0FDaEJSOztBRGtCUTtFQUNJLHFCQUFBO0FDaEJaOztBRG1CUTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtFQUNBLGdCQUFBO0FDakJaOztBRG1CWTtFQUNJLGlCQUFBO0FDakJoQjs7QURtQlk7RUFDSSxrQkFBQTtBQ2pCaEI7O0FEb0JZO0VFMUhSLHlCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0NkUztFRGVULGtCQUFBO0FEeUdKOztBRGdCWTtFQUNJLGNBQUE7RUFDQSxtQkFBQTtBQ2RoQjs7QURpQlE7RUFDSSxtQkFBQTtVQUFBLGNBQUE7RUFDQSxVQUFBO0FDZlo7O0FEaUJRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ2ZaOztBRGtCUTtFQUNJLGdCQUFBO0FDaEJaOztBRHFCUTtFQUNJLGdCQUFBO0FDbkJaOztBRHFCUTtFQUNJLGtCQUFBO0FDbkJaOztBRHFCUTtFQUNJLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSx1QkFBQTtBQ25CWjs7QURxQlE7RUFDSSxrQkFBQTtFQUNBLHlCR3ZLUztFSHdLVCxrQkd0Skk7RUh1SkosV0FBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtBQ25CWjs7QURxQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsT0FBQTtFQUFTLFNBQUE7RUFDckMseUJHM0tJO0VINEtKLGtCRzlKSTtFSCtKSixxQ0FBQTtFQUFBLDZCQUFBO0FDaEJaOztBRG9CSTtFQUNJLGtCQUFBO0VBQ0EseUJHdkxhO0VId0xiLFdBQUE7RUFDQSxrQ0FBQTtBQ2xCUjs7QURvQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsUUFBQTtFQUFVLE9BQUE7QUNmbEQ7O0FEa0JRO0VBQ0ksa0JBQUE7RUFBb0IsTUFBQTtFQUFRLFNBQUE7RUFBVyxRQUFBO0VBQVUsT0FBQTtFQUNqRCxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtBQ1paOztBRGlCQTtFQUNJLGlCQUFBO0VBQ0EsY0FBQTtBQ2RKIiwiZmlsZSI6InNyYy9hcHAvc2VyaWVzL3Nlcmllcy1kZXRhaWwvc2VyaWVzLWRldGFpbC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgXCIuLi8uLi8uLi9zY3NzL3ZhcmlhYmxlc1wiO1xuQGltcG9ydCBcIi4uLy4uLy4uL3Njc3MvbWl4aW5zXCI7XG5cbi5icmVhZGNydW1iLWNvbnRhaW5lciB7XG4gICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIGhlYWRlci1mb250KCk7XG4gICAgfVxuXG4gICAgLnN1YnRpdGxlIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc3RhdHVzIHtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMC41cmVtO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uY29udGVudC1zZWN0aW9uIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgJHRoZW1lLWdyYXktYm9yZGVyO1xuICAgIGJvcmRlci1yYWRpdXM6ICRib3JkZXItcmFkaXVzO1xuICAgIHBhZGRpbmc6IDMycHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIHRpdGxlLWZvbnQoKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbiAgICB9XG5cbiAgICAmLmNvbnRlbnQtc2VjdGlvbi1kYW5nZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGVuKCR0aGVtZS1kYW5nZXIsIDM5JSk7XG4gICAgICAgIGJvcmRlci1jb2xvcjogJHRoZW1lLWRhbmdlcjtcbiAgICB9XG59XG5cbmZvcm0ge1xuICAgIC5jb2x1bW4tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAuY29sdW1uIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDUwJTtcblxuICAgICAgICAgICAgJjpub3QoOmZpcnN0LWNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAwLjVyZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAmOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDAuNXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5pbnB1dC1jb250YWluZXIge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgIH1cblxuICAgIC5sYWJlbCB7XG4gICAgICAgIEBpbmNsdWRlIGxhYmVsLWZvbnQoKTtcbiAgICB9XG5cbiAgICA6Om5nLWRlZXAgaW5wdXQge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgIH1cblxuICAgIC5zZXJpZXMtaXRlbS1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIC5zZXJpZXMtaXRlbS1pbWFnZSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgd2lkdGg6IDEwMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA1NnB4O1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuXG4gICAgICAgICAgICAmLnBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc3BlYWtlci1pdGVtLWltYWdlIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB3aWR0aDogMTAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDU2cHg7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG5cbiAgICAgICAgICAgICYucGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmluY2x1ZGUtaXRlbS1sYWJlbCB7XG4gICAgICAgIHBhZGRpbmc6IDRweCA4cHg7XG4gICAgfVxuICAgIC50b3BpYy1pdGVtLWxhYmVsIHtcbiAgICAgICAgcGFkZGluZzogNHB4IDhweDtcbiAgICB9XG59XG5cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciB7XG4gICAgLmltYWdlLWNvbnRlbnQtcm93IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAmOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuICAgICAgICB9XG5cbiAgICAgICAgLmltYWdlLWNvbnRlbnQtY29sIHtcbiAgICAgICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICAgICAgcGFkZGluZzogMHB4IDhweDtcblxuICAgICAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IC04cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogLThweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmxhYmVsIHtcbiAgICAgICAgICAgICAgICBAaW5jbHVkZSBsYWJlbC1mb250KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcHAtY29weS1ib3g6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAuaW1hZ2UtY29udGVudC1jb2wtaGFsZiB7XG4gICAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcbiAgICAgICAgICAgIHdpZHRoOiA1MCU7XG4gICAgICAgIH1cbiAgICAgICAgLmltYWdlLWNvbnRlbnQtY29sLXRoaXJkIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDMzJTtcbiAgICAgICAgfVxuXG4gICAgICAgIC50aXRsZSB7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAycmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmltYWdlLXVwbG9hZC1jb250YWluZXIge1xuICAgICAgICAuYnV0dG9uIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgICAgIH1cbiAgICAgICAgLmxhYmVsIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDEuNXJlbTtcbiAgICAgICAgfVxuICAgICAgICAudXBsb2FkLW5hbWUge1xuICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgICAgfVxuICAgICAgICAucHJvZ3Jlc3MtYmFyLWNvbnRhaW5lciB7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVyO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMC41cmVtO1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMC41cmVtO1xuICAgICAgICB9XG4gICAgICAgIC5wcm9ncmVzcy1iYXIge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGJvdHRvbTogMDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1wcmltYXJ5O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAwLjFzIGxpbmVhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5pbWFnZS1jb250YWluZXIge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nLXRvcDogY2FsYygoOSAvIDE2KSAqIDEwMCUpO1xuXG4gICAgICAgIGltZyB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgcmlnaHQ6IDA7IGxlZnQ6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAuaW1hZ2UtcGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGJvdHRvbTogMDsgcmlnaHQ6IDA7IGxlZnQ6IDA7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5hcHAtcmV1c2FibGUtbWVkaWEtbGlzdCA6Om5nLWRlZXAgLnNjcm9sbGFibGUtcmVnaW9uIHtcbiAgICBtYXgtaGVpZ2h0OiA1MDBweDtcbiAgICBvdmVyZmxvdzogYXV0bztcbn0iLCIuYnJlYWRjcnVtYi1jb250YWluZXIge1xuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG59XG5cbi5oZWFkZXItY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgbWFyZ2luLWJvdHRvbTogMi41cmVtO1xufVxuLmhlYWRlci1jb250YWluZXIgLnRpdGxlIHtcbiAgZm9udC1zaXplOiAzMnB4O1xuICBmb250LXdlaWdodDogODAwO1xufVxuLmhlYWRlci1jb250YWluZXIgLnN1YnRpdGxlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbi5oZWFkZXItY29udGFpbmVyIC5zdWJ0aXRsZSAuc3RhdHVzIHtcbiAgbWFyZ2luLXJpZ2h0OiAwLjVyZW07XG59XG5cbi5jb250ZW50LXNlY3Rpb24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTZlNmU2O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBhZGRpbmc6IDMycHg7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG4uY29udGVudC1zZWN0aW9uIC50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDE7XG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbn1cbi5jb250ZW50LXNlY3Rpb24uY29udGVudC1zZWN0aW9uLWRhbmdlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZiZmI7XG4gIGJvcmRlci1jb2xvcjogI0ZBM0UzOTtcbn1cblxuZm9ybSAuY29sdW1uLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5mb3JtIC5jb2x1bW4tY29udGFpbmVyIC5jb2x1bW4ge1xuICBmbGV4OiAwIDAgYXV0bztcbiAgd2lkdGg6IDUwJTtcbn1cbmZvcm0gLmNvbHVtbi1jb250YWluZXIgLmNvbHVtbjpub3QoOmZpcnN0LWNoaWxkKSB7XG4gIHBhZGRpbmctbGVmdDogMC41cmVtO1xufVxuZm9ybSAuY29sdW1uLWNvbnRhaW5lciAuY29sdW1uOm5vdCg6bGFzdC1jaGlsZCkge1xuICBwYWRkaW5nLXJpZ2h0OiAwLjVyZW07XG59XG5mb3JtIC5pbnB1dC1jb250YWluZXIge1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuZm9ybSAubGFiZWwge1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGNvbG9yOiAjOGE4YThhO1xuICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG5mb3JtIDo6bmctZGVlcCBpbnB1dCB7XG4gIG1hcmdpbi1ib3R0b206IDA7XG59XG5mb3JtIC5zZXJpZXMtaXRlbS1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuZm9ybSAuc2VyaWVzLWl0ZW0tY29udGFpbmVyIC5zZXJpZXMtaXRlbS1pbWFnZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAxMDBweDtcbiAgaGVpZ2h0OiA1NnB4O1xuICBtYXJnaW4tcmlnaHQ6IDFyZW07XG59XG5mb3JtIC5zZXJpZXMtaXRlbS1jb250YWluZXIgLnNlcmllcy1pdGVtLWltYWdlLnBsYWNlaG9sZGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2U2ZTZlNjtcbn1cbmZvcm0gLnNwZWFrZXItaXRlbS1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuZm9ybSAuc3BlYWtlci1pdGVtLWNvbnRhaW5lciAuc3BlYWtlci1pdGVtLWltYWdlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgd2lkdGg6IDEwMHB4O1xuICBoZWlnaHQ6IDU2cHg7XG4gIG1hcmdpbi1yaWdodDogMXJlbTtcbn1cbmZvcm0gLnNwZWFrZXItaXRlbS1jb250YWluZXIgLnNwZWFrZXItaXRlbS1pbWFnZS5wbGFjZWhvbGRlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlNmU2ZTY7XG59XG5mb3JtIC5pbmNsdWRlLWl0ZW0tbGFiZWwge1xuICBwYWRkaW5nOiA0cHggOHB4O1xufVxuZm9ybSAudG9waWMtaXRlbS1sYWJlbCB7XG4gIHBhZGRpbmc6IDRweCA4cHg7XG59XG5cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdzpub3QoOmxhc3QtY2hpbGQpIHtcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2wge1xuICBmbGV4OiAxIDEgYXV0bztcbiAgcGFkZGluZzogMHB4IDhweDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sOmZpcnN0LWNoaWxkIHtcbiAgbWFyZ2luLWxlZnQ6IC04cHg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbDpsYXN0LWNoaWxkIHtcbiAgbWFyZ2luLXJpZ2h0OiAtOHB4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2wgLmxhYmVsIHtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBjb2xvcjogIzhhOGE4YTtcbiAgbWFyZ2luLWJvdHRvbTogMnB4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2wgYXBwLWNvcHktYm94Om5vdCg6bGFzdC1jaGlsZCkge1xuICBkaXNwbGF5OiBibG9jaztcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sLWhhbGYge1xuICBmbGV4OiAwIDAgYXV0bztcbiAgd2lkdGg6IDUwJTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sLXRoaXJkIHtcbiAgZmxleDogMCAwIGF1dG87XG4gIHdpZHRoOiAzMyU7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC50aXRsZSB7XG4gIG1hcmdpbi10b3A6IDJyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLXVwbG9hZC1jb250YWluZXIgLmJ1dHRvbiB7XG4gIG1hcmdpbi10b3A6IDFyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLXVwbG9hZC1jb250YWluZXIgLmxhYmVsIHtcbiAgbWFyZ2luLXRvcDogMS41cmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC51cGxvYWQtbmFtZSB7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5wcm9ncmVzcy1iYXItY29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDAuNXJlbTtcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5wcm9ncmVzcy1iYXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzNiZWZmO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHRyYW5zaXRpb246IHdpZHRoIDAuMXMgbGluZWFyO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nLXRvcDogY2FsYygoOSAvIDE2KSAqIDEwMCUpO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250YWluZXIgaW1nIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBsZWZ0OiAwO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250YWluZXIgLmltYWdlLXBsYWNlaG9sZGVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGJvdHRvbTogMDtcbiAgcmlnaHQ6IDA7XG4gIGxlZnQ6IDA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG5hcHAtcmV1c2FibGUtbWVkaWEtbGlzdCA6Om5nLWRlZXAgLnNjcm9sbGFibGUtcmVnaW9uIHtcbiAgbWF4LWhlaWdodDogNTAwcHg7XG4gIG92ZXJmbG93OiBhdXRvO1xufSIsIkBpbXBvcnQgXCJ2YXJpYWJsZXNcIjtcblxuQG1peGluIHNoYWRvdygpIHtcbiAgICBib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xufVxuXG5AbWl4aW4gaGVhZGVyLWZvbnQoKSB7XG4gICAgZm9udC1zaXplOiAzMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XG59XG5cbkBtaXhpbiB0aXRsZS1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xufVxuXG5AbWl4aW4gbGFiZWwtZm9udCgpIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGNvbG9yOiAkdGhlbWUtZ3JheTtcbiAgICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG4iLCIvLyBodHRwczovL2NvbG9yaHVudC5jby9wYWxldHRlLzE1NzExOFxuXG4vLyBDb2xvcnNcbiR0aGVtZS13aGl0ZTogI0ZGRkZGRjtcbiR0aGVtZS1ibGFjazogIzMzMzMzMztcbiR0aGVtZS1ncmF5LWRhcms6IHJlZDtcbiR0aGVtZS1ncmF5OiAjOGE4YThhO1xuJHRoZW1lLWdyYXktbGlnaHQ6ICNlNmU2ZTY7XG4kdGhlbWUtZ3JheS1saWdodGVyOiAjZjVmNWY1O1xuJHRoZW1lLWdyYXktbGlnaHRlc3Q6ICNmZGZkZmQ7XG4kdGhlbWUtZ3JheS1ib3JkZXI6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuXG4kdGhlbWUtcHJpbWFyeTogIzMzYmVmZjtcblxuJHRoZW1lLXN1Y2Nlc3M6ICM0MkM3NUQ7XG4kdGhlbWUtZGFuZ2VyOiAjRkEzRTM5O1xuJHRoZW1lLXdhcm5pbmc6ICNGRkMyMDA7XG5cbi8vIEZvbnRzIGFuZCBUZXh0XG4kZm9udC1mYW1pbHk6IHByb3hpbWEtbm92YSwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuXG4kZm9udC1zaXplLXNtYWxsOiAwLjg3NXJlbTtcbiRmb250LXNpemUtbWVkaXVtOiAxcmVtO1xuJGZvbnQtc2l6ZS1sYXJnZTogMS41cmVtO1xuXG4vLyBMYXlvdXRcbiRib3JkZXItcmFkaXVzOiA0cHg7XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SeriesDetailComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-series-detail',
                templateUrl: './series-detail.component.html',
                styleUrls: ['./series-detail.component.scss']
            }]
    }], function () { return [{ type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_6__["NotificationsService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/series/series-list/series-list.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/series/series-list/series-list.component.ts ***!
  \*************************************************************/
/*! exports provided: SeriesListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesListComponent", function() { return SeriesListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _classes_utility__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @classes/utility */ "./src/app/_classes/utility.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-infinite-scroll */ "./node_modules/ngx-infinite-scroll/__ivy_ngcc__/modules/ngx-infinite-scroll.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");
/* harmony import */ var _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @common/loading-indicator/loading-indicator.component */ "./src/app/_common/loading-indicator/loading-indicator.component.ts");















function SeriesListComponent_ng_container_8_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("Showing ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx_r62.entries.length), " ", ctx_r62.entries.length === 1 ? "series" : "series", "");
} }
function SeriesListComponent_ng_container_8_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate3"]("Showing ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 3, ctx_r63.filtered.length), " of ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 5, ctx_r63.entries.length), " ", ctx_r63.entries.length === 1 ? "series" : "series", "");
} }
function SeriesListComponent_ng_container_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, SeriesListComponent_ng_container_8_div_1_Template, 3, 4, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, SeriesListComponent_ng_container_8_div_2_Template, 4, 7, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r59 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r59.filtered.length === ctx_r59.entries.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r59.filtered.length !== ctx_r59.entries.length);
} }
function SeriesListComponent_tr_24_img_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 23);
} if (rf & 2) {
    const entry_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", entry_r64.thumbnailUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function SeriesListComponent_tr_24_div_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "div", 24);
} }
const _c0 = function (a1) { return ["/series", a1]; };
function SeriesListComponent_tr_24_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, SeriesListComponent_tr_24_img_3_Template, 1, 1, "img", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, SeriesListComponent_tr_24_div_4_Template, 1, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "a", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const entry_r64 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", entry_r64.thumbnailUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !entry_r64.thumbnailUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](4, _c0, entry_r64.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", entry_r64.name, " ");
} }
function SeriesListComponent_div_25_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "No series available.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function SeriesListComponent_div_25_app_loading_indicator_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-loading-indicator");
} }
function SeriesListComponent_div_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, SeriesListComponent_div_25_div_1_Template, 2, 0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, SeriesListComponent_div_25_app_loading_indicator_2_Template, 1, 0, "app-loading-indicator", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r61 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r61.series);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r61.series);
} }
class SeriesListComponent {
    constructor(locale, app, router, notifications) {
        this.locale = locale;
        this.app = app;
        this.router = router;
        this.notifications = notifications;
        this.Utility = _classes_utility__WEBPACK_IMPORTED_MODULE_2__["Utility"];
        this.entries = [];
        this.filtered = [];
        this.loaded = [];
        this.sort = 'id';
        this.ascending = false;
        this.SortOptions = {
            id: (a, b) => {
                return a.id - b.id;
            },
            name: (a, b) => {
                const A = (a.name || 'zzz').toLowerCase().trim();
                const B = (b.name || 'zzz').toLowerCase().trim();
                return A < B ? -1 : (A > B ? 1 : (a.id - b.id));
            },
        };
        this.creating = false;
    }
    ngOnInit() {
        this.app.API.getAllSeries().subscribe(series => {
            this.series = series;
            this.entries = this.series.map(o => {
                let result = {
                    id: o.id,
                    name: o.name || 'Untitled',
                    thumbnailUrl: o.thumbnailUrl,
                };
                result.search = `${result.name}`.toLowerCase();
                return result;
            });
            this.sort = 'id';
            this.ascending = false;
            this.updateEntries();
        });
    }
    onLoadMoreRows() {
        this.loaded = this.loaded.concat(this.filtered.slice(this.loaded.length, this.loaded.length + 30));
    }
    onSort(sort) {
        if (sort !== this.sort) {
            this.sort = sort;
            this.ascending = true;
        }
        else if (!this.ascending) {
            this.sort = 'id';
            this.ascending = false;
        }
        else {
            this.ascending = false;
        }
        this.updateEntries();
    }
    updateEntries() {
        const search = (this.search || '').toLowerCase();
        const comparator = this.SortOptions[this.sort];
        this.filtered = this.entries.filter(o => !search || o.search.indexOf(search) >= 0).sort(this.ascending ? comparator : (a, b) => -comparator(a, b));
        this.loaded = this.filtered.slice(0, 30);
    }
    onSearchUpdate() {
        this.updateEntries();
    }
    onAddSeries() {
        this.creating = true;
        this.app.API.createSeries().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.creating = false;
        })).subscribe(series => {
            this.router.navigate(['/series', series.id]);
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem creating.');
        });
    }
}
SeriesListComponent.ɵfac = function SeriesListComponent_Factory(t) { return new (t || SeriesListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["NotificationsService"])); };
SeriesListComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SeriesListComponent, selectors: [["app-series-list"]], decls: 26, vars: 11, consts: [["infiniteScroll", "", 1, "scrollable-region", 3, "scrollWindow", "infiniteScrollContainer", "fromRoot", "scrolled"], [1, "header-container"], [1, "title"], [1, "button", 3, "disabled", "click"], [1, "content"], [1, "options-container"], [4, "ngIf"], [1, "spacer"], [1, "search"], ["type", "text", 3, "ngModel", "placeholder", "ngModelChange"], [1, "table-container"], [2, "width", "140px"], [1, "header"], [1, "name"], [3, "active", "icon", "click"], [4, "ngFor", "ngForOf"], ["class", "loading-container", 4, "ngIf"], ["class", "count", 4, "ngIf"], [1, "count"], [1, "image-container"], [3, "src", 4, "ngIf"], ["class", "image-placeholder", 4, "ngIf"], [3, "routerLink"], [3, "src"], [1, "image-placeholder"], [1, "loading-container"]], template: function SeriesListComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("scrolled", function SeriesListComponent_Template_div_scrolled_0_listener() { return ctx.onLoadMoreRows(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Series");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SeriesListComponent_Template_button_click_4_listener() { return ctx.onAddSeries(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Add Series");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, SeriesListComponent_ng_container_8_Template, 3, 2, "ng-container", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function SeriesListComponent_Template_input_ngModelChange_11_listener($event) { return ctx.search = $event; })("ngModelChange", function SeriesListComponent_Template_input_ngModelChange_11_listener() { return ctx.onSearchUpdate(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "table");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "th", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Image");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "app-action-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SeriesListComponent_Template_app_action_icon_click_23_listener() { return ctx.onSort("name"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](24, SeriesListComponent_tr_24_Template, 8, 6, "tr", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](25, SeriesListComponent_div_25_Template, 3, 2, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("scrollWindow", false)("infiniteScrollContainer", ".center-container > .bottom-container")("fromRoot", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.creating);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.filtered.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.search)("placeholder", "Search...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("active", ctx.sort === "name")("icon", ctx.sort !== "name" ? "sort" : ctx.ascending ? "sort-up" : "sort-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.loaded);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.series || !ctx.series.length);
    } }, directives: [ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__["InfiniteScrollDirective"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgModel"], _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_9__["ActionIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLinkWithHref"], _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_10__["LoadingIndicatorComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_7__["DecimalPipe"]], styles: [".header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  margin-bottom: 2.5rem;\n}\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.options-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n.options-container[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.options-container[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  width: 320px;\n}\n.table-container[_ngcontent-%COMP%] {\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  overflow: hidden;\n}\ntable[_ngcontent-%COMP%] {\n  table-layout: fixed;\n  border-collapse: collapse;\n  width: 100%;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n  background-color: #FFFFFF;\n  padding: 10px 16px;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon {\n  color: #e6e6e6;\n  margin: -5px 0px -5px 8px;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon:hover {\n  color: #333333;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon.active {\n  color: #333333;\n}\ntable[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n  background-color: #FFFFFF;\n  padding: 20px 16px;\n}\ntable[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid #e6e6e6;\n}\ntable[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(even)   td[_ngcontent-%COMP%] {\n  background-color: #fdfdfd;\n}\n.loading-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n  height: 140px;\n}\n.time[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 300;\n}\n.image-container[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.image-container[_ngcontent-%COMP%]   .image-placeholder[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  padding-top: calc((9 / 16) * 100%);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL3Nlcmllcy9zZXJpZXMtbGlzdC9zZXJpZXMtbGlzdC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvc2VyaWVzL3Nlcmllcy1saXN0L3Nlcmllcy1saXN0LmNvbXBvbmVudC5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL19taXhpbnMuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EscUJBQUE7QUNGSjtBRElJO0VFREEsZUFBQTtFQUNBLGdCQUFBO0VGRUksbUJBQUE7VUFBQSxjQUFBO0FDRFI7QURLQTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7QUNGSjtBRElJO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0FDRlI7QURLSTtFQUNJLHlCR3BCTTtFSHFCTixZQUFBO0FDSFI7QURPQTtFQUNJLHlCQUFBO0VBQ0Esa0JHSlk7RUhLWixnQkFBQTtBQ0pKO0FET0E7RUFDSSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0EsV0FBQTtBQ0pKO0FETUk7RUFDSSxnQkFBQTtFQUNBLHlCR3RDTTtFSHVDTixrQkFBQTtBQ0pSO0FETVE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDSlo7QURNWTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtBQ0poQjtBRE9ZO0VBQ0ksY0c5Q0c7RUgrQ0gseUJBQUE7QUNMaEI7QURPZ0I7RUFDSSxjR3JETjtBRmdEZDtBRE9nQjtFQUNJLGNHeEROO0FGbURkO0FEV0k7RUFDSSxtQkFBQTtFQUNBLHlCR2pFTTtFSGtFTixrQkFBQTtBQ1RSO0FEWUk7RUFDSSxnQ0FBQTtBQ1ZSO0FEYUk7RUFDSSx5QkdwRWM7QUZ5RHRCO0FEZUE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtFQUNBLGFBQUE7QUNaSjtBRGVBO0VBQ0ksbUJHcEVjO0VIcUVkLGdCQUFBO0FDWko7QURlQTtFQUNJLFdBQUE7QUNaSjtBRGNJO0VBQ0ksV0FBQTtBQ1pSO0FEZUk7RUFDSSxrQkFBQTtFQUNBLHlCRzlGYTtFSCtGYixrQ0FBQTtBQ2JSIiwiZmlsZSI6InNyYy9hcHAvc2VyaWVzL3Nlcmllcy1saXN0L3Nlcmllcy1saXN0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcIi4uLy4uLy4uL3Njc3MvdmFyaWFibGVzXCI7XG5AaW1wb3J0IFwiLi4vLi4vLi4vc2Nzcy9taXhpbnNcIjtcblxuLmhlYWRlci1jb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XG5cbiAgICAudGl0bGUge1xuICAgICAgICBAaW5jbHVkZSBoZWFkZXItZm9udCgpO1xuICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICB9XG59XG5cbi5vcHRpb25zLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgLnNwYWNlciB7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIH1cblxuICAgIC5zZWFyY2ggaW5wdXQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgICAgIHdpZHRoOiAzMjBweDtcbiAgICB9XG59XG5cbi50YWJsZS1jb250YWluZXIge1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR0aGVtZS1ncmF5LWJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG50YWJsZSB7XG4gICAgdGFibGUtbGF5b3V0OiBmaXhlZDtcbiAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgdGgge1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMTZweDtcblxuICAgICAgICAuaGVhZGVyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICAgICAubmFtZSB7XG4gICAgICAgICAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIDo6bmctZGVlcCAuYWN0aW9uLWljb24ge1xuICAgICAgICAgICAgICAgIGNvbG9yOiAkdGhlbWUtZ3JheS1saWdodDtcbiAgICAgICAgICAgICAgICBtYXJnaW46IC01cHggMHB4IC01cHggOHB4O1xuXG4gICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAkdGhlbWUtYmxhY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICYuYWN0aXZlIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICR0aGVtZS1ibGFjaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0ZCB7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS13aGl0ZTtcbiAgICAgICAgcGFkZGluZzogMjBweCAxNnB4O1xuICAgIH1cblxuICAgIHRyOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJHRoZW1lLWdyYXktYm9yZGVyO1xuICAgIH1cbiAgICBcbiAgICB0cjpudGgtY2hpbGQoZXZlbikgdGQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVzdDtcbiAgICB9XG59XG5cbi5sb2FkaW5nLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGhlaWdodDogMTQwcHg7XG59XG5cbi50aW1lIHtcbiAgICBmb250LXNpemU6ICRmb250LXNpemUtc21hbGw7XG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcbn1cblxuLmltYWdlLWNvbnRhaW5lciB7XG4gICAgd2lkdGg6IDEwMCU7XG5cbiAgICBpbWcge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAuaW1hZ2UtcGxhY2Vob2xkZXIge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgIHBhZGRpbmctdG9wOiBjYWxjKCg5IC8gMTYpICogMTAwJSk7XG4gICAgfVxufSIsIi5oZWFkZXItY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMi41cmVtO1xufVxuLmhlYWRlci1jb250YWluZXIgLnRpdGxlIHtcbiAgZm9udC1zaXplOiAzMnB4O1xuICBmb250LXdlaWdodDogODAwO1xuICBmbGV4OiAxIDEgYXV0bztcbn1cblxuLm9wdGlvbnMtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbi5vcHRpb25zLWNvbnRhaW5lciAuc3BhY2VyIHtcbiAgZmxleDogMSAxIGF1dG87XG59XG4ub3B0aW9ucy1jb250YWluZXIgLnNlYXJjaCBpbnB1dCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7XG4gIHdpZHRoOiAzMjBweDtcbn1cblxuLnRhYmxlLWNvbnRhaW5lciB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlNmU2ZTY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxudGFibGUge1xuICB0YWJsZS1sYXlvdXQ6IGZpeGVkO1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICB3aWR0aDogMTAwJTtcbn1cbnRhYmxlIHRoIHtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgcGFkZGluZzogMTBweCAxNnB4O1xufVxudGFibGUgdGggLmhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG50YWJsZSB0aCAuaGVhZGVyIC5uYW1lIHtcbiAgZmxleDogMSAxIGF1dG87XG59XG50YWJsZSB0aCAuaGVhZGVyIDo6bmctZGVlcCAuYWN0aW9uLWljb24ge1xuICBjb2xvcjogI2U2ZTZlNjtcbiAgbWFyZ2luOiAtNXB4IDBweCAtNXB4IDhweDtcbn1cbnRhYmxlIHRoIC5oZWFkZXIgOjpuZy1kZWVwIC5hY3Rpb24taWNvbjpob3ZlciB7XG4gIGNvbG9yOiAjMzMzMzMzO1xufVxudGFibGUgdGggLmhlYWRlciA6Om5nLWRlZXAgLmFjdGlvbi1pY29uLmFjdGl2ZSB7XG4gIGNvbG9yOiAjMzMzMzMzO1xufVxudGFibGUgdGQge1xuICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO1xuICBwYWRkaW5nOiAyMHB4IDE2cHg7XG59XG50YWJsZSB0cjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlNmU2ZTY7XG59XG50YWJsZSB0cjpudGgtY2hpbGQoZXZlbikgdGQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmRmZGZkO1xufVxuXG4ubG9hZGluZy1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgaGVpZ2h0OiAxNDBweDtcbn1cblxuLnRpbWUge1xuICBmb250LXNpemU6IDAuODc1cmVtO1xuICBmb250LXdlaWdodDogMzAwO1xufVxuXG4uaW1hZ2UtY29udGFpbmVyIHtcbiAgd2lkdGg6IDEwMCU7XG59XG4uaW1hZ2UtY29udGFpbmVyIGltZyB7XG4gIHdpZHRoOiAxMDAlO1xufVxuLmltYWdlLWNvbnRhaW5lciAuaW1hZ2UtcGxhY2Vob2xkZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gIHBhZGRpbmctdG9wOiBjYWxjKCg5IC8gMTYpICogMTAwJSk7XG59IiwiQGltcG9ydCBcInZhcmlhYmxlc1wiO1xuXG5AbWl4aW4gc2hhZG93KCkge1xuICAgIGJveC1zaGFkb3c6IDAgMXB4IDRweCAwIHJnYmEoMCwgMCwgMCwgMC4wNik7XG59XG5cbkBtaXhpbiBoZWFkZXItZm9udCgpIHtcbiAgICBmb250LXNpemU6IDMycHg7XG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcbn1cblxuQG1peGluIHRpdGxlLWZvbnQoKSB7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG59XG5cbkBtaXhpbiBsYWJlbC1mb250KCkge1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgY29sb3I6ICR0aGVtZS1ncmF5O1xuICAgIG1hcmdpbi1ib3R0b206IDJweDtcbn1cbiIsIi8vIGh0dHBzOi8vY29sb3JodW50LmNvL3BhbGV0dGUvMTU3MTE4XG5cbi8vIENvbG9yc1xuJHRoZW1lLXdoaXRlOiAjRkZGRkZGO1xuJHRoZW1lLWJsYWNrOiAjMzMzMzMzO1xuJHRoZW1lLWdyYXktZGFyazogcmVkO1xuJHRoZW1lLWdyYXk6ICM4YThhOGE7XG4kdGhlbWUtZ3JheS1saWdodDogI2U2ZTZlNjtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXI6ICNmNWY1ZjU7XG4kdGhlbWUtZ3JheS1saWdodGVzdDogI2ZkZmRmZDtcbiR0aGVtZS1ncmF5LWJvcmRlcjogJHRoZW1lLWdyYXktbGlnaHQ7XG5cbiR0aGVtZS1wcmltYXJ5OiAjMzNiZWZmO1xuXG4kdGhlbWUtc3VjY2VzczogIzQyQzc1RDtcbiR0aGVtZS1kYW5nZXI6ICNGQTNFMzk7XG4kdGhlbWUtd2FybmluZzogI0ZGQzIwMDtcblxuLy8gRm9udHMgYW5kIFRleHRcbiRmb250LWZhbWlseTogcHJveGltYS1ub3ZhLCBcIkhlbHZldGljYSBOZXVlXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG5cbiRmb250LXNpemUtc21hbGw6IDAuODc1cmVtO1xuJGZvbnQtc2l6ZS1tZWRpdW06IDFyZW07XG4kZm9udC1zaXplLWxhcmdlOiAxLjVyZW07XG5cbi8vIExheW91dFxuJGJvcmRlci1yYWRpdXM6IDRweDtcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SeriesListComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-series-list',
                templateUrl: './series-list.component.html',
                styleUrls: ['./series-list.component.scss']
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"]]
            }] }, { type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["NotificationsService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/settings/settings.component.ts":
/*!************************************************!*\
  !*** ./src/app/settings/settings.component.ts ***!
  \************************************************/
/*! exports provided: SettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsComponent", function() { return SettingsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _services_app_managers_user_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @services/app/managers/user.manager */ "./src/app/_services/app/managers/user.manager.ts");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var _services_app_managers_organization_manager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @services/app/managers/organization.manager */ "./src/app/_services/app/managers/organization.manager.ts");
/* harmony import */ var _common_third_parties_google__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @common/third-parties/google */ "./src/app/_common/third-parties/google.ts");
/* harmony import */ var _common_third_parties_facebook__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @common/third-parties/facebook */ "./src/app/_common/third-parties/facebook.ts");
/* harmony import */ var _common_form_error_form_error_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @common/form-error/form-error.component */ "./src/app/_common/form-error/form-error.component.ts");
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/dialog */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-dialog.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/api */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-api.js");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");



















const _c0 = function () { return ["fad", "check-circle"]; };
function SettingsComponent_ng_container_63_Template(rf, ctx) { if (rf & 1) {
    const _r153 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Connected ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_ng_container_63_Template_button_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r153); const ctx_r152 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r152.onDisconnectYoutube(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Disconnect");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r147 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](2, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r147.loadingYoutube);
} }
const _c1 = function () { return ["fad", "times-circle"]; };
function SettingsComponent_ng_container_64_Template(rf, ctx) { if (rf & 1) {
    const _r155 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Not Connected ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_ng_container_64_Template_button_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r155); const ctx_r154 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r154.onConnectYoutube(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Connect");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r148 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](2, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r148.loadingYoutube);
} }
function SettingsComponent_ng_container_72_Template(rf, ctx) { if (rf & 1) {
    const _r157 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Connected ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_ng_container_72_Template_button_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r157); const ctx_r156 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r156.onDisconnectFacebook(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Disconnect");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r149 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](2, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r149.loadingFacebook);
} }
function SettingsComponent_ng_container_73_Template(rf, ctx) { if (rf & 1) {
    const _r159 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Not Connected ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_ng_container_73_Template_button_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r159); const ctx_r158 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r158.onConnectFacebook(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Connect");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r150 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](2, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r150.loadingFacebook);
} }
function SettingsComponent_ng_container_79_ng_container_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Your account has expired.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function SettingsComponent_ng_container_79_ng_container_8_div_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r162 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("It will expire on ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, ctx_r162.subscription.current_period_end * 1000), ".");
} }
function SettingsComponent_ng_container_79_ng_container_8_div_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r163 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("It will renew on ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, ctx_r163.subscription.current_period_end * 1000), ".");
} }
function SettingsComponent_ng_container_79_ng_container_8_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r166 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_ng_container_79_ng_container_8_button_5_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r166); const ctx_r165 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3); return ctx_r165.cancelDialogVisible = true; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Cancel Subscription");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function SettingsComponent_ng_container_79_ng_container_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Your account is currently active.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, SettingsComponent_ng_container_79_ng_container_8_div_3_Template, 3, 3, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, SettingsComponent_ng_container_79_ng_container_8_div_4_Template, 3, 3, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, SettingsComponent_ng_container_79_ng_container_8_button_5_Template, 2, 0, "button", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r161 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r161.subscription.cancel_at_period_end);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r161.subscription.cancel_at_period_end);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r161.subscription.cancel_at_period_end);
} }
function SettingsComponent_ng_container_79_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](6, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, SettingsComponent_ng_container_79_ng_container_7_Template, 3, 0, "ng-container", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, SettingsComponent_ng_container_79_ng_container_8_Template, 6, 3, "ng-container", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r151 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r151.plan.nickname || "Untitled");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("$", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](6, 4, ctx_r151.plan.amount / 100), " / mo");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r151.subscription == null ? null : ctx_r151.subscription.status) !== "active");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r151.subscription == null ? null : ctx_r151.subscription.status) === "active");
} }
const _c2 = function () { return { required: "Full name is required." }; };
const _c3 = function () { return { width: "480px" }; };
const _c4 = function () { return { minlength: "New password must be 8 characters long." }; };
class SettingsComponent {
    constructor(app, notifications) {
        this.app = app;
        this.notifications = notifications;
        this.savingUserForm = false;
        this.passwordDialogVisible = false;
        this.savingPasswordForm = false;
        this.loadingYoutube = false;
        this.loadingFacebook = false;
        this.savingCardForm = false;
        this.cancelDialogVisible = false;
        this.canceling = false;
    }
    get organization() { return _services_app_managers_organization_manager__WEBPACK_IMPORTED_MODULE_6__["OrganizationManager"].sharedInstance.organization; }
    ngOnInit() {
        this.user = _services_app_managers_user_manager__WEBPACK_IMPORTED_MODULE_2__["UserManager"].sharedInstance.user;
        this.userForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"]({});
        this.userForm.addControl('name', new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.user.name, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
        this.resetPasswordForm();
        this.app.API.getOrganizationSocialAccounts(this.organization).subscribe(accounts => {
            this.youtube = accounts.find(o => o.network === 'youtube');
            this.facebook = accounts.find(o => o.network === 'facebook');
        });
        this.cardForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"]({});
        this.cardForm.addControl('number', new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](undefined, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
        this.cardForm.addControl('month', new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](undefined, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
        this.cardForm.addControl('year', new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](undefined, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
        this.cardForm.addControl('cvc', new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](undefined, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
        this.cardForm.addControl('zip', new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](undefined, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]));
        this.resetCardForm();
        this.app.API.getOrganizationSubscriptionInfo(this.organization).subscribe(info => {
            this.plan = (info.plans || []).find(o => o.id === info.account.planId);
            this.subscription = info.subscription;
            this.card = info.card;
            this.resetCardForm();
        });
    }
    onSaveUserForm() {
        this.savingUserForm = true;
        this.app.API.updateUser({ id: this.user.id, name: this.userForm.controls.name.value.trim() }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.savingUserForm = false;
        })).subscribe(user => {
            this.user = _services_app_managers_user_manager__WEBPACK_IMPORTED_MODULE_2__["UserManager"].sharedInstance.user = user;
            this.notifications.success('Success', 'User profile saved successfully.', { timeOut: 5000 });
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem saving.');
        });
    }
    resetPasswordForm() {
        this.passwordForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroup"]({});
        this.passwordForm.addControl('password', new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](undefined, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(8)]));
        this.passwordForm.addControl('confirm', new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](undefined));
    }
    onShowPasswordDialog() {
        this.resetPasswordForm();
        this.passwordDialogVisible = true;
    }
    onSavePasswordForm() {
        let password = this.passwordForm.controls.password.value.trim();
        let confirm = this.passwordForm.controls.confirm.value.trim();
        if (password !== confirm) {
            this.notifications.error('Error', 'The password fields must match.');
            return;
        }
        this.savingPasswordForm = true;
        this.app.API.updateUser({ id: this.user.id, password: this.passwordForm.controls.password.value.trim() }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.savingPasswordForm = false;
        })).subscribe(user => {
            this.notifications.success('Success', 'Password saved successfully.', { timeOut: 5000 });
            this.passwordDialogVisible = false;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem saving.');
        });
    }
    onConnectYoutube() {
        this.loadingYoutube = true;
        new _common_third_parties_google__WEBPACK_IMPORTED_MODULE_7__["Google"](this.app.auth.http).userLogin().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.loadingYoutube = false;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(account => {
            return this.app.API.setOrganizationSocialAccount(this.organization, account);
        })).subscribe(account => {
            this.notifications.success('Success', 'Connected YouTube successfully.', { timeOut: 5000 });
            this.youtube = account;
        }, error => {
            if (typeof error === 'string' && error.indexOf('cancel')) {
                return;
            }
            this.notifications.error('Error', 'Sorry, there was a problem connecting.');
        });
    }
    onDisconnectYoutube() {
        this.loadingYoutube = true;
        this.app.API.deleteOrganizationSocialAccount(this.organization, 'youtube').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.loadingYoutube = false;
        })).subscribe(() => {
            this.notifications.success('Success', 'Disconnected YouTube successfully.', { timeOut: 5000 });
            this.youtube = undefined;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem disconnecting.');
        });
    }
    onConnectFacebook() {
        this.loadingFacebook = true;
        new _common_third_parties_facebook__WEBPACK_IMPORTED_MODULE_8__["Facebook"](this.app.auth.http).userLogin().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.loadingFacebook = false;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(account => {
            return this.app.API.setOrganizationSocialAccount(this.organization, account);
        })).subscribe(account => {
            this.notifications.success('Success', 'Connected Facebook successfully.', { timeOut: 5000 });
            this.facebook = account;
        }, error => {
            if (typeof error === 'string' && error.indexOf('cancel')) {
                return;
            }
            this.notifications.error('Error', 'Sorry, there was a problem connecting.');
        });
    }
    onDisconnectFacebook() {
        this.loadingFacebook = true;
        this.app.API.deleteOrganizationSocialAccount(this.organization, 'facebook').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.loadingFacebook = false;
        })).subscribe(() => {
            this.notifications.success('Success', 'Disconnected Facebook successfully.', { timeOut: 5000 });
            this.facebook = undefined;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem disconnecting.');
        });
    }
    onUpdatePaymentInfo() {
        let number = this.cardForm.controls.number.value;
        let month = this.cardForm.controls.month.value;
        let year = this.cardForm.controls.year.value;
        let cvc = this.cardForm.controls.cvc.value;
        let zip = this.cardForm.controls.zip.value;
        this.savingCardForm = true;
        Stripe.card.createToken({
            'number': number,
            'exp_month': month,
            'exp_year': year,
            'cvc': cvc,
            'address_zip': zip,
        }, (status, response) => {
            if (!status || status >= 300 || status < 200) {
                this.savingCardForm = false;
                this.notifications.error('Error', 'Sorry, there was a problem updating your payment info.');
                return;
            }
            this.app.API.updateOrganizationPaymentInfo(this.organization, response.id, this.plan.id).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
                this.savingCardForm = false;
            })).subscribe(info => {
                this.notifications.success('Success', 'Payment info updated successfully.', { timeOut: 5000 });
                this.subscription = info.subscription;
                this.card = info.card;
                this.resetCardForm();
            }, error => {
                this.notifications.error('Error', 'Sorry, there was a problem updating your payment info.');
            });
        });
    }
    onCancelSubscription() {
        this.canceling = true;
        this.app.API.deleteOrganizationPaymentInfo(this.organization).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(() => {
            this.canceling = false;
        })).subscribe(info => {
            this.notifications.success('Success', 'Your subscription has been canceled.', { timeOut: 5000 });
            this.subscription = info.subscription;
            this.card = info.card;
            this.resetCardForm();
            this.cancelDialogVisible = false;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem canceling your subscription.');
        });
    }
    resetCardForm() {
        var _a, _b, _c, _d;
        this.cardNumberPlaceholder = ((_a = this.card) === null || _a === void 0 ? void 0 : _a.last4) ? `**** **** **** ${this.card.last4}` : `0000 0000 0000 0000`;
        this.cardMonthPlaceholder = `${((_b = this.card) === null || _b === void 0 ? void 0 : _b.exp_month) || 'MM'}`;
        if (this.cardMonthPlaceholder.length === 1) {
            this.cardMonthPlaceholder = `0${this.cardMonthPlaceholder}`;
        }
        this.cardYearPlaceholder = `${((_c = this.card) === null || _c === void 0 ? void 0 : _c.exp_year) || 'YYYY'}`.substring(2);
        if (this.cardYearPlaceholder.length === 1) {
            this.cardYearPlaceholder = `0${this.cardYearPlaceholder}`;
        }
        this.cardCvcPlaceholder = this.card ? '***' : '000';
        this.cardZipPlaceholder = ((_d = this.card) === null || _d === void 0 ? void 0 : _d.address_zip) || '00000';
        this.cardForm.controls.number.setValue(undefined);
        this.cardForm.controls.month.setValue(undefined);
        this.cardForm.controls.year.setValue(undefined);
        this.cardForm.controls.cvc.setValue(undefined);
        this.cardForm.controls.zip.setValue(undefined);
    }
}
SettingsComponent.ɵfac = function SettingsComponent_Factory(t) { return new (t || SettingsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_3__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["NotificationsService"])); };
SettingsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SettingsComponent, selectors: [["app-settings"]], decls: 119, vars: 53, consts: [[1, "header-container"], [1, "title"], [1, "content-section"], [1, "column-container", "form"], [1, "column"], [3, "formGroup"], [1, "input-container"], [1, "label"], [1, "required"], ["type", "text", 3, "formControlName", "placeholder"], [3, "control", "messages"], ["type", "text", 3, "value", "disabled"], [1, "button", 3, "disabled", "click"], ["type", "password", "value", "********", 3, "disabled"], [1, "button", 3, "click"], [3, "visible", "modal", "dismissableMask", "draggable", "visibleChange"], [3, "icon", "click"], [1, "column", "column-full"], ["type", "password", 3, "formControlName", "placeholder"], [1, "button", "secondary", "hollow", 3, "click"], [1, "spacer"], [1, "column-container"], [1, "column", "account-info"], [1, "account-name"], [1, "account-description"], [1, "account-status"], [4, "ngIf"], [1, "column", "subscription-info"], [1, "credit-card-form"], [1, "row"], [1, "col-4"], [1, "col-2"], [1, "expiration"], [1, "slash"], [1, "col-1"], [1, "button", "alert", 3, "disabled", "click"], [1, "connected", 3, "icon"], [1, "button", "secondary", 3, "disabled", "click"], [3, "icon"], [1, "plan-name"], [1, "plan-cost"], [1, "plan-active", "red"], [1, "plan-active"], ["class", "plan-billing red", 4, "ngIf"], ["class", "plan-billing", 4, "ngIf"], ["class", "button secondary", 3, "click", 4, "ngIf"], [1, "plan-billing", "red"], [1, "plan-billing"], [1, "button", "secondary", 3, "click"]], template: function SettingsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Settings");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "User Profile");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "form", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Full Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "*");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "app-form-error", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "E-mail");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_Template_button_click_20_listener() { return ctx.onSaveUserForm(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Save");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](26, "input", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_Template_button_click_27_listener() { return ctx.onShowPasswordDialog(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "Change Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "p-dialog", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("visibleChange", function SettingsComponent_Template_p_dialog_visibleChange_29_listener($event) { return ctx.passwordDialogVisible = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "p-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Change Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "app-action-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_Template_app_action_icon_click_33_listener() { return ctx.passwordDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "form", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "New Password (8+ Characters)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](40, "input", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](41, "app-form-error", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "Confirm Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](45, "input", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "p-footer");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_Template_button_click_47_listener() { return ctx.onSavePasswordForm(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "Change Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "button", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_Template_button_click_49_listener() { return ctx.passwordDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](51, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, "Third-Party Auth");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "YouTube");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "HopeStream uses the YouTube API to upload videos to YouTube, update YouTube video descriptions, and schedule YouTube Live Streams.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](63, SettingsComponent_ng_container_63_Template, 6, 3, "ng-container", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](64, SettingsComponent_ng_container_64_Template, 6, 3, "ng-container", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](68, "Facebook");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](70, "HopeStream uses the Facebook API to schedule Facebook Live Streams.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](71, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](72, SettingsComponent_ng_container_72_Template, 6, 3, "ng-container", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](73, SettingsComponent_ng_container_73_Template, 6, 3, "ng-container", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](74, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](75, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](76, "Subscription");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](78, "div", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](79, SettingsComponent_ng_container_79_Template, 9, 6, "ng-container", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](81, "form", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](82, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "div", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](84, "div", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](85, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](86, "Card Number");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](87, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](88, "div", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](89, "div", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](91, "Expiration");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](92, "div", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](93, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](94, "div", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](95, "/");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](96, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](97, "div", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](98, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](99, "CVC");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](100, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](101, "div", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](102, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](103, "Postal Code");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](104, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](105, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_Template_button_click_105_listener() { return ctx.onUpdatePaymentInfo(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](106, "Update Payment Info");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](107, "p-dialog", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("visibleChange", function SettingsComponent_Template_p_dialog_visibleChange_107_listener($event) { return ctx.cancelDialogVisible = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](108, "p-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](109, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](110, "Cancel Subscription");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](111, "app-action-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_Template_app_action_icon_click_111_listener() { return ctx.cancelDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](112, " Are you sure you want to cancel your subscription? ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](113, "p-footer");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](114, "button", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_Template_button_click_114_listener() { return ctx.onCancelSubscription(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](115, "Cancel Subscription");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](116, "button", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsComponent_Template_button_click_116_listener() { return ctx.cancelDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](117, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](118, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.userForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "name")("placeholder", "Full Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("control", ctx.userForm.controls.name)("messages", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](49, _c2));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx.user.email)("disabled", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx.userForm || !ctx.userForm.valid || ctx.savingUserForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](50, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("visible", ctx.passwordDialogVisible)("modal", true)("dismissableMask", true)("draggable", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", "times");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.passwordForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "password")("placeholder", "New Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("control", ctx.passwordForm.controls.password)("messages", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](51, _c4));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "confirm")("placeholder", "Confirm Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx.passwordForm || !ctx.passwordForm.valid || ctx.savingPasswordForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.youtube);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.youtube);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.facebook);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.facebook);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.plan);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.cardForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "number")("placeholder", ctx.cardNumberPlaceholder);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "month")("placeholder", ctx.cardMonthPlaceholder);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "year")("placeholder", ctx.cardYearPlaceholder);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "cvc")("placeholder", ctx.cardCvcPlaceholder);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "zip")("placeholder", ctx.cardZipPlaceholder);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !(ctx.cardForm == null ? null : ctx.cardForm.valid) || ctx.savingCardForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](52, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("visible", ctx.cancelDialogVisible)("modal", true)("dismissableMask", true)("draggable", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", "times");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.canceling);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"], _common_form_error_form_error_component__WEBPACK_IMPORTED_MODULE_9__["FormErrorComponent"], primeng_dialog__WEBPACK_IMPORTED_MODULE_10__["Dialog"], primeng_api__WEBPACK_IMPORTED_MODULE_11__["Header"], _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_12__["ActionIconComponent"], primeng_api__WEBPACK_IMPORTED_MODULE_11__["Footer"], _angular_common__WEBPACK_IMPORTED_MODULE_13__["NgIf"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_14__["FaIconComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_13__["DecimalPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_13__["DatePipe"]], styles: [".header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin-bottom: 2.5rem;\n}\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n}\n.content-section[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  padding: 32px;\n  margin-bottom: 1rem;\n}\n.content-section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  line-height: 1;\n  margin-bottom: 1.5rem;\n}\n.content-section.content-section-danger[_ngcontent-%COMP%] {\n  background-color: #fffbfb;\n  border-color: #FA3E39;\n}\n.column-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n.column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n.column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:first-child) {\n  padding-left: 0.5rem;\n}\n.column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:last-child) {\n  padding-right: 0.5rem;\n}\n.column-container[_ngcontent-%COMP%]   .column-full[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.column-container[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.column-container[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n.column-container[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%]   .required[_ngcontent-%COMP%] {\n  display: inline-block;\n  color: #FA3E39;\n  margin-left: 2px;\n}\n.account-info[_ngcontent-%COMP%]   .account-name[_ngcontent-%COMP%] {\n  font-size: 20px;\n}\n.account-info[_ngcontent-%COMP%]   .account-description[_ngcontent-%COMP%] {\n  height: 92px;\n}\n.account-info[_ngcontent-%COMP%]   .account-status[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n.account-info[_ngcontent-%COMP%]   .account-status[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  width: 160px;\n}\n.account-info[_ngcontent-%COMP%]   fa-icon.connected[_ngcontent-%COMP%] {\n  color: #42C75D;\n}\n.subscription-info[_ngcontent-%COMP%] {\n  position: relative;\n}\n.subscription-info[_ngcontent-%COMP%]   .plan-name[_ngcontent-%COMP%] {\n  font-size: 20px;\n}\n.subscription-info[_ngcontent-%COMP%]   .plan-active[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.subscription-info[_ngcontent-%COMP%]   .red[_ngcontent-%COMP%] {\n  color: #FA3E39;\n}\n.subscription-info[_ngcontent-%COMP%]   .button.secondary[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n}\n.credit-card-form[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  margin-bottom: 1rem;\n}\n.credit-card-form[_ngcontent-%COMP%]   .col-1[_ngcontent-%COMP%], .credit-card-form[_ngcontent-%COMP%]   .col-2[_ngcontent-%COMP%], .credit-card-form[_ngcontent-%COMP%]   .col-4[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  width: 25%;\n}\n.credit-card-form[_ngcontent-%COMP%]   .col-1[_ngcontent-%COMP%]:not(:first-child), .credit-card-form[_ngcontent-%COMP%]   .col-2[_ngcontent-%COMP%]:not(:first-child), .credit-card-form[_ngcontent-%COMP%]   .col-4[_ngcontent-%COMP%]:not(:first-child) {\n  padding-left: 0.5rem;\n}\n.credit-card-form[_ngcontent-%COMP%]   .col-2[_ngcontent-%COMP%] {\n  width: 50%;\n}\n.credit-card-form[_ngcontent-%COMP%]   .col-4[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.credit-card-form[_ngcontent-%COMP%]   .expiration[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n.credit-card-form[_ngcontent-%COMP%]   .expiration[_ngcontent-%COMP%]   .slash[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 24px;\n  color: #e6e6e6;\n  margin: 0 0.5rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL3NldHRpbmdzL3NldHRpbmdzLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9zZXR0aW5ncy9zZXR0aW5ncy5jb21wb25lbnQuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fbWl4aW5zLnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX3ZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EsNEJBQUE7RUFBQSw2QkFBQTtVQUFBLHNCQUFBO0VBQ0EscUJBQUE7QUNGSjtBRElJO0VFREEsZUFBQTtFQUNBLGdCQUFBO0FEQUo7QURLQTtFQUNJLHlCR1hVO0VIWVYseUJBQUE7RUFDQSxrQkdVWTtFSFRaLGFBQUE7RUFDQSxtQkFBQTtBQ0ZKO0FESUk7RUVSQSxlQUFBO0VBQ0EsZ0JBQUE7RUZTSSxjQUFBO0VBQ0EscUJBQUE7QUNEUjtBRElJO0VBQ0kseUJBQUE7RUFDQSxxQkdiTztBRldmO0FETUE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7QUNISjtBREtJO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ0hSO0FES1E7RUFDSSxvQkFBQTtBQ0haO0FES1E7RUFDSSxxQkFBQTtBQ0haO0FET0k7RUFDSSxXQUFBO0FDTFI7QURRSTtFQUNJLG1CQUFBO0FDTlI7QURTSTtFRXRDQSx5QkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGNDZFM7RURlVCxrQkFBQTtBRGdDSjtBREtRO0VBQ0kscUJBQUE7RUFDQSxjRzdDRztFSDhDSCxnQkFBQTtBQ0haO0FEVUk7RUFDSSxlQUFBO0FDUFI7QURTSTtFQUNJLFlBQUE7QUNQUjtBRFNJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtBQ1BSO0FEU1E7RUFDSSxZQUFBO0FDUFo7QURXSTtFQUNJLGNHdEVRO0FGNkRoQjtBRGNBO0VBQ0ksa0JBQUE7QUNYSjtBRGFJO0VBQ0ksZUFBQTtBQ1hSO0FEYUk7RUFDSSxnQkFBQTtBQ1hSO0FEYUk7RUFDSSxjR3BGTztBRnlFZjtBRGFJO0VBQ0ksa0JBQUE7RUFBb0IsU0FBQTtFQUFXLE9BQUE7QUNUdkM7QURhSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLG1CQUFBO0FDVlI7QURZSTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLDRCQUFBO0VBQUEsNkJBQUE7VUFBQSxzQkFBQTtFQUNBLFVBQUE7QUNWUjtBRFlRO0VBQ0ksb0JBQUE7QUNWWjtBRGFJO0VBQ0ksVUFBQTtBQ1hSO0FEYUk7RUFDSSxXQUFBO0FDWFI7QURhSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7QUNYUjtBRGFRO0VBQ0ksZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsY0c5SE87RUgrSFAsZ0JBQUE7QUNYWiIsImZpbGUiOiJzcmMvYXBwL3NldHRpbmdzL3NldHRpbmdzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcIi4uLy4uL3Njc3MvdmFyaWFibGVzXCI7XG5AaW1wb3J0IFwiLi4vLi4vc2Nzcy9taXhpbnNcIjtcblxuLmhlYWRlci1jb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XG5cbiAgICAudGl0bGUge1xuICAgICAgICBAaW5jbHVkZSBoZWFkZXItZm9udCgpO1xuICAgIH1cbn1cblxuLmNvbnRlbnQtc2VjdGlvbiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLXdoaXRlO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR0aGVtZS1ncmF5LWJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICBwYWRkaW5nOiAzMnB4O1xuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG5cbiAgICAudGl0bGUge1xuICAgICAgICBAaW5jbHVkZSB0aXRsZS1mb250KCk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XG4gICAgfVxuXG4gICAgJi5jb250ZW50LXNlY3Rpb24tZGFuZ2VyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRlbigkdGhlbWUtZGFuZ2VyLCAzOSUpO1xuICAgICAgICBib3JkZXItY29sb3I6ICR0aGVtZS1kYW5nZXI7XG4gICAgfVxufVxuXG4uY29sdW1uLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcblxuICAgIC5jb2x1bW4ge1xuICAgICAgICBmbGV4OiAwIDAgYXV0bztcbiAgICAgICAgd2lkdGg6IDUwJTtcblxuICAgICAgICAmOm5vdCg6Zmlyc3QtY2hpbGQpIHtcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMC41cmVtO1xuICAgICAgICB9XG4gICAgICAgICY6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBwYWRkaW5nLXJpZ2h0OiAwLjVyZW07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuY29sdW1uLWZ1bGwge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAuaW5wdXQtY29udGFpbmVyIHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgICB9XG5cbiAgICAubGFiZWwge1xuICAgICAgICBAaW5jbHVkZSBsYWJlbC1mb250KCk7XG5cbiAgICAgICAgLnJlcXVpcmVkIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIGNvbG9yOiAkdGhlbWUtZGFuZ2VyO1xuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDJweDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4uYWNjb3VudC1pbmZvIHtcbiAgICAuYWNjb3VudC1uYW1lIHtcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgIH1cbiAgICAuYWNjb3VudC1kZXNjcmlwdGlvbiB7XG4gICAgICAgIGhlaWdodDogOTJweDtcbiAgICB9XG4gICAgLmFjY291bnQtc3RhdHVzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAmID4gZGl2IHtcbiAgICAgICAgICAgIHdpZHRoOiAxNjBweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZhLWljb24uY29ubmVjdGVkIHtcbiAgICAgICAgY29sb3I6ICR0aGVtZS1zdWNjZXNzO1xuICAgIH1cbn1cblxuXG4uc3Vic2NyaXB0aW9uLWluZm8ge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAgIC5wbGFuLW5hbWUge1xuICAgICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgfVxuICAgIC5wbGFuLWFjdGl2ZSB7XG4gICAgICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgfVxuICAgIC5yZWQge1xuICAgICAgICBjb2xvcjogJHRoZW1lLWRhbmdlcjtcbiAgICB9XG4gICAgLmJ1dHRvbi5zZWNvbmRhcnkge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IGJvdHRvbTogMDsgbGVmdDogMDtcbiAgICB9XG59XG4uY3JlZGl0LWNhcmQtZm9ybSB7XG4gICAgLnJvdyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG4gICAgfVxuICAgIC5jb2wtMSwgLmNvbC0yLCAuY29sLTQge1xuICAgICAgICBmbGV4OiAwIDAgYXV0bztcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgd2lkdGg6IDI1JTtcblxuICAgICAgICAmOm5vdCg6Zmlyc3QtY2hpbGQpIHtcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMC41cmVtO1xuICAgICAgICB9XG4gICAgfVxuICAgIC5jb2wtMiB7XG4gICAgICAgIHdpZHRoOiA1MCU7XG4gICAgfVxuICAgIC5jb2wtNCB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbiAgICAuZXhwaXJhdGlvbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgLnNsYXNoIHtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgICAgICBjb2xvcjogJHRoZW1lLWdyYXktbGlnaHQ7XG4gICAgICAgICAgICBtYXJnaW46IDAgMC41cmVtO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLmhlYWRlci1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XG59XG4uaGVhZGVyLWNvbnRhaW5lciAudGl0bGUge1xuICBmb250LXNpemU6IDMycHg7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG59XG5cbi5jb250ZW50LXNlY3Rpb24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTZlNmU2O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBhZGRpbmc6IDMycHg7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG4uY29udGVudC1zZWN0aW9uIC50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDE7XG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbn1cbi5jb250ZW50LXNlY3Rpb24uY29udGVudC1zZWN0aW9uLWRhbmdlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZiZmI7XG4gIGJvcmRlci1jb2xvcjogI0ZBM0UzOTtcbn1cblxuLmNvbHVtbi1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuLmNvbHVtbi1jb250YWluZXIgLmNvbHVtbiB7XG4gIGZsZXg6IDAgMCBhdXRvO1xuICB3aWR0aDogNTAlO1xufVxuLmNvbHVtbi1jb250YWluZXIgLmNvbHVtbjpub3QoOmZpcnN0LWNoaWxkKSB7XG4gIHBhZGRpbmctbGVmdDogMC41cmVtO1xufVxuLmNvbHVtbi1jb250YWluZXIgLmNvbHVtbjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgcGFkZGluZy1yaWdodDogMC41cmVtO1xufVxuLmNvbHVtbi1jb250YWluZXIgLmNvbHVtbi1mdWxsIHtcbiAgd2lkdGg6IDEwMCU7XG59XG4uY29sdW1uLWNvbnRhaW5lciAuaW5wdXQtY29udGFpbmVyIHtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cbi5jb2x1bW4tY29udGFpbmVyIC5sYWJlbCB7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgY29sb3I6ICM4YThhOGE7XG4gIG1hcmdpbi1ib3R0b206IDJweDtcbn1cbi5jb2x1bW4tY29udGFpbmVyIC5sYWJlbCAucmVxdWlyZWQge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGNvbG9yOiAjRkEzRTM5O1xuICBtYXJnaW4tbGVmdDogMnB4O1xufVxuXG4uYWNjb3VudC1pbmZvIC5hY2NvdW50LW5hbWUge1xuICBmb250LXNpemU6IDIwcHg7XG59XG4uYWNjb3VudC1pbmZvIC5hY2NvdW50LWRlc2NyaXB0aW9uIHtcbiAgaGVpZ2h0OiA5MnB4O1xufVxuLmFjY291bnQtaW5mbyAuYWNjb3VudC1zdGF0dXMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuLmFjY291bnQtaW5mbyAuYWNjb3VudC1zdGF0dXMgPiBkaXYge1xuICB3aWR0aDogMTYwcHg7XG59XG4uYWNjb3VudC1pbmZvIGZhLWljb24uY29ubmVjdGVkIHtcbiAgY29sb3I6ICM0MkM3NUQ7XG59XG5cbi5zdWJzY3JpcHRpb24taW5mbyB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi5zdWJzY3JpcHRpb24taW5mbyAucGxhbi1uYW1lIHtcbiAgZm9udC1zaXplOiAyMHB4O1xufVxuLnN1YnNjcmlwdGlvbi1pbmZvIC5wbGFuLWFjdGl2ZSB7XG4gIG1hcmdpbi10b3A6IDFyZW07XG59XG4uc3Vic2NyaXB0aW9uLWluZm8gLnJlZCB7XG4gIGNvbG9yOiAjRkEzRTM5O1xufVxuLnN1YnNjcmlwdGlvbi1pbmZvIC5idXR0b24uc2Vjb25kYXJ5IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG59XG5cbi5jcmVkaXQtY2FyZC1mb3JtIC5yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuLmNyZWRpdC1jYXJkLWZvcm0gLmNvbC0xLCAuY3JlZGl0LWNhcmQtZm9ybSAuY29sLTIsIC5jcmVkaXQtY2FyZC1mb3JtIC5jb2wtNCB7XG4gIGZsZXg6IDAgMCBhdXRvO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB3aWR0aDogMjUlO1xufVxuLmNyZWRpdC1jYXJkLWZvcm0gLmNvbC0xOm5vdCg6Zmlyc3QtY2hpbGQpLCAuY3JlZGl0LWNhcmQtZm9ybSAuY29sLTI6bm90KDpmaXJzdC1jaGlsZCksIC5jcmVkaXQtY2FyZC1mb3JtIC5jb2wtNDpub3QoOmZpcnN0LWNoaWxkKSB7XG4gIHBhZGRpbmctbGVmdDogMC41cmVtO1xufVxuLmNyZWRpdC1jYXJkLWZvcm0gLmNvbC0yIHtcbiAgd2lkdGg6IDUwJTtcbn1cbi5jcmVkaXQtY2FyZC1mb3JtIC5jb2wtNCB7XG4gIHdpZHRoOiAxMDAlO1xufVxuLmNyZWRpdC1jYXJkLWZvcm0gLmV4cGlyYXRpb24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuLmNyZWRpdC1jYXJkLWZvcm0gLmV4cGlyYXRpb24gLnNsYXNoIHtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgZm9udC1zaXplOiAyNHB4O1xuICBjb2xvcjogI2U2ZTZlNjtcbiAgbWFyZ2luOiAwIDAuNXJlbTtcbn0iLCJAaW1wb3J0IFwidmFyaWFibGVzXCI7XG5cbkBtaXhpbiBzaGFkb3coKSB7XG4gICAgYm94LXNoYWRvdzogMCAxcHggNHB4IDAgcmdiYSgwLCAwLCAwLCAwLjA2KTtcbn1cblxuQG1peGluIGhlYWRlci1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMzJweDtcbiAgICBmb250LXdlaWdodDogODAwO1xufVxuXG5AbWl4aW4gdGl0bGUtZm9udCgpIHtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cblxuQG1peGluIGxhYmVsLWZvbnQoKSB7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjb2xvcjogJHRoZW1lLWdyYXk7XG4gICAgbWFyZ2luLWJvdHRvbTogMnB4O1xufVxuIiwiLy8gaHR0cHM6Ly9jb2xvcmh1bnQuY28vcGFsZXR0ZS8xNTcxMThcblxuLy8gQ29sb3JzXG4kdGhlbWUtd2hpdGU6ICNGRkZGRkY7XG4kdGhlbWUtYmxhY2s6ICMzMzMzMzM7XG4kdGhlbWUtZ3JheS1kYXJrOiByZWQ7XG4kdGhlbWUtZ3JheTogIzhhOGE4YTtcbiR0aGVtZS1ncmF5LWxpZ2h0OiAjZTZlNmU2O1xuJHRoZW1lLWdyYXktbGlnaHRlcjogI2Y1ZjVmNTtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXN0OiAjZmRmZGZkO1xuJHRoZW1lLWdyYXktYm9yZGVyOiAkdGhlbWUtZ3JheS1saWdodDtcblxuJHRoZW1lLXByaW1hcnk6ICMzM2JlZmY7XG5cbiR0aGVtZS1zdWNjZXNzOiAjNDJDNzVEO1xuJHRoZW1lLWRhbmdlcjogI0ZBM0UzOTtcbiR0aGVtZS13YXJuaW5nOiAjRkZDMjAwO1xuXG4vLyBGb250cyBhbmQgVGV4dFxuJGZvbnQtZmFtaWx5OiBwcm94aW1hLW5vdmEsIFwiSGVsdmV0aWNhIE5ldWVcIiwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcblxuJGZvbnQtc2l6ZS1zbWFsbDogMC44NzVyZW07XG4kZm9udC1zaXplLW1lZGl1bTogMXJlbTtcbiRmb250LXNpemUtbGFyZ2U6IDEuNXJlbTtcblxuLy8gTGF5b3V0XG4kYm9yZGVyLXJhZGl1czogNHB4O1xuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SettingsComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-settings',
                templateUrl: './settings.component.html',
                styleUrls: ['./settings.component.scss']
            }]
    }], function () { return [{ type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_3__["AppService"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["NotificationsService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/sidebar/sidebar.component.ts":
/*!**********************************************!*\
  !*** ./src/app/sidebar/sidebar.component.ts ***!
  \**********************************************/
/*! exports provided: SidebarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SidebarComponent", function() { return SidebarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


class SidebarComponent {
}
SidebarComponent.ɵfac = function SidebarComponent_Factory(t) { return new (t || SidebarComponent)(); };
SidebarComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SidebarComponent, selectors: [["app-sidebar"]], decls: 1, vars: 0, template: function SidebarComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0, "SIDEBAR!");
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3NpZGViYXIvc2lkZWJhci5jb21wb25lbnQuc2NzcyJ9 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SidebarComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-sidebar',
                templateUrl: 'sidebar.component.html',
                styleUrls: ['sidebar.component.scss']
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/sign-in/sign-in/sign-in.component.ts":
/*!******************************************************!*\
  !*** ./src/app/sign-in/sign-in/sign-in.component.ts ***!
  \******************************************************/
/*! exports provided: SignInComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignInComponent", function() { return SignInComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var _services_state_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @services/state.service */ "./src/app/_services/state.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @services/auth.service */ "./src/app/_services/auth.service.ts");
/* harmony import */ var _common_set_title_set_title_directive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @common/set-title/set-title.directive */ "./src/app/_common/set-title/set-title.directive.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");















function SignInComponent_ng_container_6_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "form", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("submit", function SignInComponent_ng_container_6_Template_form_submit_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7); const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r6.onSignIn(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "input", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "input", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Log in");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "a", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SignInComponent_ng_container_6_Template_a_click_6_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r8.visible = 2; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Forgot password?");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r0.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r0.loading);
} }
function SignInComponent_ng_container_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "We'd love to see your church on HopeStream!");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Please submit a request to ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "a", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "admin@hopestream.com");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " to get started.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function SignInComponent_ng_container_8_Template(rf, ctx) { if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "form", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("submit", function SignInComponent_ng_container_8_Template_form_submit_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r10); const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r9.onResetPassword(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "input", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Reset");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Please enter the e-mail address associated with your account. You will receive an e-mail with instructions to reset your password.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r2.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r2.loading);
} }
function SignInComponent_ng_container_10_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Don't have an account yet?");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "a", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SignInComponent_ng_container_10_Template_a_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r12); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r11.visible = 1; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Sign up");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function SignInComponent_ng_container_11_Template(rf, ctx) { if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Already have an account?");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "a", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SignInComponent_ng_container_11_Template_a_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r14); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r13.visible = 0; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Log in");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function SignInComponent_ng_container_12_Template(rf, ctx) { if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SignInComponent_ng_container_12_Template_a_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r16); const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r15.visible = 0; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Back to login");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
class SignInComponent {
    constructor(state, auth, notifications) {
        this.state = state;
        this.auth = auth;
        this.notifications = notifications;
        this.visible = 0;
        this.loading = false;
        this.form = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroup"]({});
        this.form.addControl('name', new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.form.addControl('email', new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]));
        this.form.addControl('password', new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(8)]));
    }
    onSignIn() {
        this.loading = true;
        this.state.login(this.form.controls['email'].value.trim(), this.form.controls['password'].value).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["finalize"])(() => {
            this.loading = false;
        })).subscribe(user => { }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem logging in');
        });
    }
    onSignUp() {
    }
    onResetPassword() {
        this.loading = true;
        this.auth.userForgotPassword(this.form.controls.email.value.trim()).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["finalize"])(() => {
            this.loading = false;
        })).subscribe(() => {
            this.visible = 0;
            this.notifications.success('Success', 'You will receive an e-mail with instructions to reset your password.', { timeOut: 5000 });
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem logging in');
        });
    }
}
SignInComponent.ɵfac = function SignInComponent_Factory(t) { return new (t || SignInComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_state_service__WEBPACK_IMPORTED_MODULE_4__["StateService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_3__["NotificationsService"])); };
SignInComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SignInComponent, selectors: [["app-sign-in"]], decls: 13, vars: 7, consts: [[1, "container", 3, "setTitle"], [1, "title-container"], ["src", "assets/images/hopestream-logo.png"], [1, "form-container"], [4, "ngIf"], [1, "option-container"], ["novalidate", "", 3, "formGroup", "submit"], ["type", "text", "formControlName", "email", "name", "email", "placeholder", "E-mail"], ["type", "password", "formControlName", "password", "name", "password", "placeholder", "Password"], ["type", "submit", 1, "button", 3, "disabled"], [1, "forgot-password", 3, "click"], ["href", "mailto:admin@hopestream.com"], [1, "reset-text"], [3, "click"]], template: function SignInComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "HopeStream");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, SignInComponent_ng_container_6_Template, 8, 2, "ng-container", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, SignInComponent_ng_container_7_Template, 10, 0, "ng-container", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, SignInComponent_ng_container_8_Template, 7, 2, "ng-container", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, SignInComponent_ng_container_10_Template, 5, 0, "ng-container", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, SignInComponent_ng_container_11_Template, 5, 0, "ng-container", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](12, SignInComponent_ng_container_12_Template, 3, 0, "ng-container", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("setTitle", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.visible === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.visible === 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.visible === 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.visible === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.visible === 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.visible === 2);
    } }, directives: [_common_set_title_set_title_directive__WEBPACK_IMPORTED_MODULE_6__["SetTitleDirective"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControlName"]], styles: ["[_nghost-%COMP%] {\n  position: relative;\n  height: 100vh;\n  background-color: #fdfdfd;\n  background-size: cover;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center;\n  overflow: auto;\n}\n\n.container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin: auto 0rem;\n}\n\n.container[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  width: 350px;\n}\n\n@media only screen and (max-width: 360px) {\n  .container[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n    width: 310px;\n  }\n}\n\n.title-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n  color: #333333;\n  text-align: left;\n  text-transform: uppercase;\n  line-height: 1;\n  font-size: 36px;\n  font-weight: 700;\n  font-family: franklin-gothic-urw, sans-serif;\n  padding: 16px 0px 32px 0px;\n}\n\n.title-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  background-color: #333333;\n  border-radius: 10rem;\n  height: 64px;\n  margin-bottom: 8px;\n}\n\n.form-container[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  padding: 32px 40px;\n}\n\n@media only screen and (max-width: 360px) {\n  .form-container[_ngcontent-%COMP%] {\n    padding: 24px;\n  }\n}\n\n.form-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 0.5rem;\n}\n\n.form-container[_ngcontent-%COMP%]   a.forgot-password[_ngcontent-%COMP%] {\n  display: block;\n  text-align: center;\n  margin-top: 1.5rem;\n}\n\n.option-container[_ngcontent-%COMP%] {\n  text-align: center;\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  padding: 32px 40px;\n  margin: 1rem 0rem;\n}\n\n@media only screen and (max-width: 360px) {\n  .option-container[_ngcontent-%COMP%] {\n    padding: 24px;\n  }\n}\n\n.legal-text[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #8a8a8a;\n  margin-top: 1rem;\n}\n\n.reset-text[_ngcontent-%COMP%] {\n  color: #8a8a8a;\n  margin-top: 1rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL3NpZ24taW4vc2lnbi1pbi9zaWduLWluLmNvbXBvbmVudC5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL192YXJpYWJsZXMuc2NzcyIsInNyYy9hcHAvc2lnbi1pbi9zaWduLWluL3NpZ24taW4uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7RUFDSSxrQkFBQTtFQUNBLGFBQUE7RUFDQSx5QkNHa0I7RURGbEIsc0JBQUE7RUFFQSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx3QkFBQTtVQUFBLHVCQUFBO0VBQ0EsY0FBQTtBRUhKOztBRk1BO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EsNEJBQUE7RUFBQSw2QkFBQTtVQUFBLHNCQUFBO0VBQ0EsaUJBQUE7QUVISjs7QUZLSTtFQUNJLFlBQUE7QUVIUjs7QUZLUTtFQUhKO0lBSVEsWUFBQTtFRUZWO0FBQ0Y7O0FGTUE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSw0QkFBQTtFQUFBLDZCQUFBO1VBQUEsc0JBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtFQUNBLGNDN0JVO0VEOEJWLGdCQUFBO0VBQ0EseUJBQUE7RUFDQSxjQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsNENBQUE7RUFDQSwwQkFBQTtBRUhKOztBRktJO0VBQ0kseUJDdkNNO0VEd0NOLG9CQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0FFSFI7O0FGT0E7RUFDSSx5QkNoRFU7RURpRFYseUJBQUE7RUFDQSxrQkMzQlk7RUQ0Qlosa0JBQUE7QUVKSjs7QUZNSTtFQU5KO0lBT1EsYUFBQTtFRUhOO0FBQ0Y7O0FGS0k7RUFDSSxXQUFBO0VBQ0Esa0JBQUE7QUVIUjs7QUZNSTtFQUNJLGNBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0FFSlI7O0FGUUE7RUFDSSxrQkFBQTtFQUNBLHlCQ3ZFVTtFRHdFVix5QkFBQTtFQUNBLGtCQ2xEWTtFRG1EWixrQkFBQTtFQUNBLGlCQUFBO0FFTEo7O0FGT0k7RUFSSjtJQVNRLGFBQUE7RUVKTjtBQUNGOztBRk9BO0VBQ0ksa0JBQUE7RUFDQSxjQ2pGUztFRGtGVCxnQkFBQTtBRUpKOztBRk9BO0VBQ0ksY0N0RlM7RUR1RlQsZ0JBQUE7QUVKSiIsImZpbGUiOiJzcmMvYXBwL3NpZ24taW4vc2lnbi1pbi9zaWduLWluLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcIi4uLy4uLy4uL3Njc3MvdmFyaWFibGVzXCI7XG5AaW1wb3J0IFwiLi4vLi4vLi4vc2Nzcy9taXhpbnNcIjtcblxuOmhvc3Qge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXN0O1xuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG5cbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG92ZXJmbG93OiBhdXRvO1xufVxuXG4uY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgbWFyZ2luOiBhdXRvIDByZW07XG5cbiAgICAmID4gZGl2IHtcbiAgICAgICAgd2lkdGg6IDM1MHB4O1xuXG4gICAgICAgIEBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogMzYwcHgpIHtcbiAgICAgICAgICAgIHdpZHRoOiAzMTBweDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLnRpdGxlLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgY29sb3I6ICR0aGVtZS1ibGFjaztcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgZm9udC1zaXplOiAzNnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgZm9udC1mYW1pbHk6IGZyYW5rbGluLWdvdGhpYy11cncsIHNhbnMtc2VyaWY7XG4gICAgcGFkZGluZzogMTZweCAwcHggMzJweCAwcHg7XG5cbiAgICBpbWcge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtYmxhY2s7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcmVtO1xuICAgICAgICBoZWlnaHQ6IDY0cHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDhweDtcbiAgICB9XG59XG5cbi5mb3JtLWNvbnRhaW5lciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLXdoaXRlO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR0aGVtZS1ncmF5LWJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICBwYWRkaW5nOiAzMnB4IDQwcHg7XG5cbiAgICBAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDM2MHB4KSB7XG4gICAgICAgIHBhZGRpbmc6IDI0cHg7XG4gICAgfVxuXG4gICAgYnV0dG9uIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG1hcmdpbi10b3A6IDAuNXJlbTtcbiAgICB9XG5cbiAgICBhLmZvcmdvdC1wYXNzd29yZCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIG1hcmdpbi10b3A6IDEuNXJlbTtcbiAgICB9XG59XG5cbi5vcHRpb24tY29udGFpbmVyIHtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHRoZW1lLXdoaXRlO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR0aGVtZS1ncmF5LWJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICBwYWRkaW5nOiAzMnB4IDQwcHg7XG4gICAgbWFyZ2luOiAxcmVtIDByZW07XG5cbiAgICBAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDM2MHB4KSB7XG4gICAgICAgIHBhZGRpbmc6IDI0cHg7XG4gICAgfVxufVxuXG4ubGVnYWwtdGV4dCB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGNvbG9yOiAkdGhlbWUtZ3JheTtcbiAgICBtYXJnaW4tdG9wOiAxcmVtO1xufVxuXG4ucmVzZXQtdGV4dCB7XG4gICAgY29sb3I6ICR0aGVtZS1ncmF5O1xuICAgIG1hcmdpbi10b3A6IDFyZW07XG59XG4iLCIvLyBodHRwczovL2NvbG9yaHVudC5jby9wYWxldHRlLzE1NzExOFxuXG4vLyBDb2xvcnNcbiR0aGVtZS13aGl0ZTogI0ZGRkZGRjtcbiR0aGVtZS1ibGFjazogIzMzMzMzMztcbiR0aGVtZS1ncmF5LWRhcms6IHJlZDtcbiR0aGVtZS1ncmF5OiAjOGE4YThhO1xuJHRoZW1lLWdyYXktbGlnaHQ6ICNlNmU2ZTY7XG4kdGhlbWUtZ3JheS1saWdodGVyOiAjZjVmNWY1O1xuJHRoZW1lLWdyYXktbGlnaHRlc3Q6ICNmZGZkZmQ7XG4kdGhlbWUtZ3JheS1ib3JkZXI6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuXG4kdGhlbWUtcHJpbWFyeTogIzMzYmVmZjtcblxuJHRoZW1lLXN1Y2Nlc3M6ICM0MkM3NUQ7XG4kdGhlbWUtZGFuZ2VyOiAjRkEzRTM5O1xuJHRoZW1lLXdhcm5pbmc6ICNGRkMyMDA7XG5cbi8vIEZvbnRzIGFuZCBUZXh0XG4kZm9udC1mYW1pbHk6IHByb3hpbWEtbm92YSwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuXG4kZm9udC1zaXplLXNtYWxsOiAwLjg3NXJlbTtcbiRmb250LXNpemUtbWVkaXVtOiAxcmVtO1xuJGZvbnQtc2l6ZS1sYXJnZTogMS41cmVtO1xuXG4vLyBMYXlvdXRcbiRib3JkZXItcmFkaXVzOiA0cHg7XG4iLCI6aG9zdCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZkZmRmZDtcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG92ZXJmbG93OiBhdXRvO1xufVxuXG4uY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgbWFyZ2luOiBhdXRvIDByZW07XG59XG4uY29udGFpbmVyID4gZGl2IHtcbiAgd2lkdGg6IDM1MHB4O1xufVxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAzNjBweCkge1xuICAuY29udGFpbmVyID4gZGl2IHtcbiAgICB3aWR0aDogMzEwcHg7XG4gIH1cbn1cblxuLnRpdGxlLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBjb2xvcjogIzMzMzMzMztcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgbGluZS1oZWlnaHQ6IDE7XG4gIGZvbnQtc2l6ZTogMzZweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgZm9udC1mYW1pbHk6IGZyYW5rbGluLWdvdGhpYy11cncsIHNhbnMtc2VyaWY7XG4gIHBhZGRpbmc6IDE2cHggMHB4IDMycHggMHB4O1xufVxuLnRpdGxlLWNvbnRhaW5lciBpbWcge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzMzMzO1xuICBib3JkZXItcmFkaXVzOiAxMHJlbTtcbiAgaGVpZ2h0OiA2NHB4O1xuICBtYXJnaW4tYm90dG9tOiA4cHg7XG59XG5cbi5mb3JtLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlNmU2ZTY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgcGFkZGluZzogMzJweCA0MHB4O1xufVxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAzNjBweCkge1xuICAuZm9ybS1jb250YWluZXIge1xuICAgIHBhZGRpbmc6IDI0cHg7XG4gIH1cbn1cbi5mb3JtLWNvbnRhaW5lciBidXR0b24ge1xuICB3aWR0aDogMTAwJTtcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xufVxuLmZvcm0tY29udGFpbmVyIGEuZm9yZ290LXBhc3N3b3JkIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWFyZ2luLXRvcDogMS41cmVtO1xufVxuXG4ub3B0aW9uLWNvbnRhaW5lciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgYm9yZGVyOiAxcHggc29saWQgI2U2ZTZlNjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBwYWRkaW5nOiAzMnB4IDQwcHg7XG4gIG1hcmdpbjogMXJlbSAwcmVtO1xufVxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAzNjBweCkge1xuICAub3B0aW9uLWNvbnRhaW5lciB7XG4gICAgcGFkZGluZzogMjRweDtcbiAgfVxufVxuXG4ubGVnYWwtdGV4dCB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICM4YThhOGE7XG4gIG1hcmdpbi10b3A6IDFyZW07XG59XG5cbi5yZXNldC10ZXh0IHtcbiAgY29sb3I6ICM4YThhOGE7XG4gIG1hcmdpbi10b3A6IDFyZW07XG59Il19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SignInComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-sign-in',
                templateUrl: './sign-in.component.html',
                styleUrls: ['./sign-in.component.scss']
            }]
    }], function () { return [{ type: _services_state_service__WEBPACK_IMPORTED_MODULE_4__["StateService"] }, { type: _services_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_3__["NotificationsService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/speaker/speaker-detail/speaker-detail.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/speaker/speaker-detail/speaker-detail.component.ts ***!
  \********************************************************************/
/*! exports provided: SpeakerDetailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeakerDetailComponent", function() { return SpeakerDetailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _classes_utility__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @classes/utility */ "./src/app/_classes/utility.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var primeng_dialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/dialog */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-dialog.js");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/api */ "./node_modules/primeng/__ivy_ngcc__/fesm2015/primeng-api.js");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");
/* harmony import */ var _media_reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../media/reusable-media-list/reusable-media-list.component */ "./src/app/media/reusable-media-list/reusable-media-list.component.ts");
/* harmony import */ var _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @common/copy-box/copy-box.component */ "./src/app/_common/copy-box/copy-box.component.ts");




















const _c0 = function () { return ["fad", "cloud-upload"]; };
function SpeakerDetailComponent_ng_container_4_ng_container_36_Template(rf, ctx) { if (rf & 1) {
    const _r104 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SpeakerDetailComponent_ng_container_4_ng_container_36_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r104); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r96 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](28); return _r96.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Upload Image ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
} }
function SpeakerDetailComponent_ng_container_4_ng_container_37_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Uploading Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r98 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r98.uploading.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", ctx_r98.progress * 100, "%");
} }
function SpeakerDetailComponent_ng_container_4_img_40_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 41);
} if (rf & 2) {
    const ctx_r99 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r99.imageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function SpeakerDetailComponent_ng_container_4_div_41_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "No image selected.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function SpeakerDetailComponent_ng_container_4_div_42_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Image Links");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "app-copy-box", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Thumbnail");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "app-copy-box", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r101 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r101.speaker.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("text", ctx_r101.speaker.thumbnailUrl);
} }
const _c1 = function () { return ["fad", "trash"]; };
function SpeakerDetailComponent_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    const _r106 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Details");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "form", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "textarea", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SpeakerDetailComponent_ng_container_4_Template_button_click_18_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r106); const ctx_r105 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r105.onSave(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Save");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Image");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "input", 25, 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function SpeakerDetailComponent_ng_container_4_Template_input_change_27_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r106); const _r96 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](28); const ctx_r107 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); ctx_r107.onImageSelected($event); return _r96.value = null; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Upload an image for this media.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "Image must be in ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, ".jpg");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, " format.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](36, SpeakerDetailComponent_ng_container_4_ng_container_36_Template, 4, 2, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](37, SpeakerDetailComponent_ng_container_4_ng_container_37_Template, 7, 3, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](40, SpeakerDetailComponent_ng_container_4_img_40_Template, 1, 1, "img", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](41, SpeakerDetailComponent_ng_container_4_div_41_Template, 2, 0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](42, SpeakerDetailComponent_ng_container_4_div_42_Template, 10, 2, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](46, "app-reusable-media-list", 32, 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Danger Zone");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55, "Delete Speaker");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, "Permanently delete this speaker.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "NOTE:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, " This will not delete any media entries that are by this speaker. This will simply delete the speaker, and those media records will no longer be associated with this speaker.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "button", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SpeakerDetailComponent_ng_container_4_Template_button_click_63_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r106); const ctx_r108 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r108.deleteDialogVisible = true; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](64, "fa-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65, "Delete Speaker ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r95 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r95.speaker.name || "Untitled", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r95.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "name")("placeholder", "Untitled");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControlName", "description")("placeholder", "Give a high-level overview of the content of this speaker...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx_r95.form || !ctx_r95.form.valid || ctx_r95.saving);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r95.uploading);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r95.uploading);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r95.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r95.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r95.speaker.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("media", ctx_r95.media);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](14, _c1));
} }
const _c2 = function () { return ["/speakers"]; };
const _c3 = function () { return ["fad", "chevron-left"]; };
const _c4 = function () { return { width: "480px" }; };
class SpeakerDetailComponent {
    constructor(app, route, router, notifications) {
        this.app = app;
        this.route = route;
        this.router = router;
        this.notifications = notifications;
        this.Utility = _classes_utility__WEBPACK_IMPORTED_MODULE_4__["Utility"];
        this.loading = true;
        this.media = [];
        this.saving = false;
        this.deleteDialogVisible = false;
        this.deleting = false;
    }
    ngOnInit() {
        this.form = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroup"]({});
        this.form.addControl('name', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        this.form.addControl('description', new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](undefined));
        let id = parseInt(this.route.snapshot.params.id);
        Object(rxjs__WEBPACK_IMPORTED_MODULE_7__["forkJoin"])(this.app.API.getSpeaker(id), this.app.API.getAllMedia()).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.loading = false;
        })).subscribe(responses => {
            this.speaker = responses[0];
            this.media = responses[1].filter(o => (o.speakerIds || []).indexOf(this.speaker.id) >= 0);
            this.form.controls.name.setValue(this.speaker.name);
            this.form.controls.description.setValue(this.speaker.description);
            this.imageUrl = this.speaker.imageUrl ? `${this.speaker.imageUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
        });
    }
    onSave() {
        let speaker = { id: this.speaker.id };
        speaker.name = this.form.controls.name.value;
        speaker.description = this.form.controls.description.value || null;
        this.saving = true;
        this.app.API.updateSpeaker(speaker).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.saving = false;
        })).subscribe(speaker => {
            this.speaker = speaker;
            this.notifications.success('Success', 'Speaker details saved successfully.', { timeOut: 5000 });
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem saving.');
        });
    }
    onImageSelected(event) {
        var _a, _b;
        let file = ((_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length) && event.target.files[0] || undefined;
        if (!file) {
            return;
        }
        this.uploading = file;
        this.progress = 0;
        this.app.API.uploadImageForSpeaker(this.speaker, file, progress => {
            this.progress = progress;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.uploading = undefined;
            this.progress = 1;
        })).subscribe(speaker => {
            this.notifications.success('Success', 'Speaker image updated.', { timeOut: 5000 });
            this.speaker = speaker;
            this.imageUrl = this.speaker.imageUrl ? `${this.speaker.imageUrl.replace('static.hopestream.com', 'hopestream.s3.amazonaws.com')}?t=${new Date().valueOf()}` : undefined;
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem uploading.');
        });
    }
    onDelete() {
        this.deleting = true;
        this.app.API.deleteSpeaker(this.speaker).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.deleting = false;
        })).subscribe(() => {
            this.router.navigate(['/speakers']);
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem deleting.');
        });
    }
}
SpeakerDetailComponent.ɵfac = function SpeakerDetailComponent_Factory(t) { return new (t || SpeakerDetailComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_6__["NotificationsService"])); };
SpeakerDetailComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SpeakerDetailComponent, selectors: [["app-speaker-detail"]], decls: 26, vars: 15, consts: [[1, "breadcrumb-container"], [3, "routerLink"], [3, "icon"], [4, "ngIf"], [3, "visible", "modal", "dismissableMask", "draggable", "visibleChange"], [1, "title"], [3, "icon", "click"], [2, "margin-top", "1rem"], [1, "button", "alert", 3, "disabled", "click"], [1, "button", "secondary", "hollow", 3, "click"], [1, "spacer"], [1, "header-container"], [1, "content-section"], [3, "formGroup"], [1, "column-container"], [1, "column"], [1, "input-container"], [1, "label"], ["type", "text", 3, "formControlName", "placeholder"], ["rows", "6", 3, "formControlName", "placeholder"], [1, "button", 3, "disabled", "click"], [1, "image-content-container"], [1, "image-content-row"], [1, "image-content-col", "image-content-col-third"], [1, "image-upload-container"], ["type", "file", "accept", "image/jpg,image/jpeg", 2, "display", "none", 3, "change"], ["input", ""], [1, "image-content-col"], [1, "image-container"], [3, "src", 4, "ngIf"], ["class", "image-placeholder", 4, "ngIf"], ["class", "image-content-row", 4, "ngIf"], [3, "media"], ["mediaList", ""], [1, "content-section", "content-section-danger"], [1, "image-content-col", "image-content-col-half"], [1, "button", "alert", 3, "click"], [1, "button", 3, "click"], [1, "upload-name"], [1, "progress-bar-container"], [1, "progress-bar"], [3, "src"], [1, "image-placeholder"], [3, "text"]], template: function SpeakerDetailComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "fa-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Back to Speaker List ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, SpeakerDetailComponent_ng_container_4_Template, 66, 15, "ng-container", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p-dialog", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("visibleChange", function SpeakerDetailComponent_Template_p_dialog_visibleChange_5_listener($event) { return ctx.deleteDialogVisible = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Delete Speaker");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "app-action-icon", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SpeakerDetailComponent_Template_app_action_icon_click_9_listener() { return ctx.deleteDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Permanently delete ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "?");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "NOTE:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, " This will not delete any media entries that are by this speaker. This will simply delete the speaker, and those media records will no longer be associated with this speaker.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "p-footer");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SpeakerDetailComponent_Template_button_click_21_listener() { return ctx.onDelete(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Delete");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SpeakerDetailComponent_Template_button_click_23_listener() { return ctx.deleteDialogVisible = false; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](12, _c2));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](13, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](14, _c4));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("visible", ctx.deleteDialogVisible)("modal", true)("dismissableMask", true)("draggable", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", "times");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((ctx.speaker == null ? null : ctx.speaker.name) || "Untitled");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.deleting);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLinkWithHref"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_8__["FaIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_9__["NgIf"], primeng_dialog__WEBPACK_IMPORTED_MODULE_10__["Dialog"], primeng_api__WEBPACK_IMPORTED_MODULE_11__["Header"], _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_12__["ActionIconComponent"], primeng_api__WEBPACK_IMPORTED_MODULE_11__["Footer"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControlName"], _media_reusable_media_list_reusable_media_list_component__WEBPACK_IMPORTED_MODULE_13__["ReusableMediaListComponent"], _common_copy_box_copy_box_component__WEBPACK_IMPORTED_MODULE_14__["CopyBoxComponent"]], styles: [".breadcrumb-container[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n\n.header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin-bottom: 2.5rem;\n}\n\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.header-container[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%] {\n  margin-right: 0.5rem;\n}\n\n.content-section[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  padding: 32px;\n  margin-bottom: 1rem;\n}\n\n.content-section[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  line-height: 1;\n  margin-bottom: 1.5rem;\n}\n\n.content-section.content-section-danger[_ngcontent-%COMP%] {\n  background-color: #fffbfb;\n  border-color: #FA3E39;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:first-child) {\n  padding-left: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .column-container[_ngcontent-%COMP%]   .column[_ngcontent-%COMP%]:not(:last-child) {\n  padding-right: 0.5rem;\n}\n\nform[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\nform[_ngcontent-%COMP%]     input {\n  margin-bottom: 0;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .series-item-container[_ngcontent-%COMP%]   .series-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #e6e6e6;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n          justify-content: flex-end;\n  overflow: hidden;\n  width: 100px;\n  height: 56px;\n  margin-right: 1rem;\n}\n\nform[_ngcontent-%COMP%]   .speaker-item-container[_ngcontent-%COMP%]   .speaker-item-image.placeholder[_ngcontent-%COMP%] {\n  background-color: #e6e6e6;\n}\n\nform[_ngcontent-%COMP%]   .include-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\nform[_ngcontent-%COMP%]   .topic-item-label[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]:not(:last-child) {\n  margin-bottom: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n  padding: 0px 8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:first-child {\n  margin-left: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]:last-child {\n  margin-right: -8px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: 700;\n  color: #8a8a8a;\n  margin-bottom: 2px;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col[_ngcontent-%COMP%]   app-copy-box[_ngcontent-%COMP%]:not(:last-child) {\n  display: block;\n  margin-bottom: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-half[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 50%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .image-content-col-third[_ngcontent-%COMP%] {\n  -webkit-box-flex: 0;\n          flex: 0 0 auto;\n  width: 33%;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-content-row[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .upload-name[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  width: 100%;\n  height: 0.5rem;\n  margin-top: 0.5rem;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-upload-container[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #33beff;\n  border-radius: 4px;\n  -webkit-transition: width 0.1s linear;\n  transition: width 0.1s linear;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  width: 100%;\n  padding-top: calc((9 / 16) * 100%);\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n}\n\n.image-content-container[_ngcontent-%COMP%]   .image-container[_ngcontent-%COMP%]   .image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n\napp-reusable-media-list[_ngcontent-%COMP%]     .scrollable-region {\n  max-height: 500px;\n  overflow: auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL3NwZWFrZXIvc3BlYWtlci1kZXRhaWwvc3BlYWtlci1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL3NwZWFrZXIvc3BlYWtlci1kZXRhaWwvc3BlYWtlci1kZXRhaWwuY29tcG9uZW50LnNjc3MiLCIvVXNlcnMvYWFyb25zY2hlcmJpbmcvRG9jdW1lbnRzL2RldmVsb3BtZW50L2hvcGVzdHJlYW0vaG9wZXN0cmVhbS1hZG1pbi1uZ3gvc3JjL3Njc3MvX21peGlucy5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTtFQUNJLHFCQUFBO0FDRko7O0FES0E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSw0QkFBQTtFQUFBLDZCQUFBO1VBQUEsc0JBQUE7RUFDQSxxQkFBQTtBQ0ZKOztBRElJO0VFTEEsZUFBQTtFQUNBLGdCQUFBO0FESUo7O0FESUk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDRlI7O0FESVE7RUFDSSxvQkFBQTtBQ0ZaOztBRE9BO0VBQ0kseUJHeEJVO0VIeUJWLHlCQUFBO0VBQ0Esa0JHSFk7RUhJWixhQUFBO0VBQ0EsbUJBQUE7QUNKSjs7QURNSTtFRXJCQSxlQUFBO0VBQ0EsZ0JBQUE7RUZzQkksY0FBQTtFQUNBLHFCQUFBO0FDSFI7O0FETUk7RUFDSSx5QkFBQTtFQUNBLHFCRzFCTztBRnNCZjs7QURTSTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtBQ05SOztBRFFRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ05aOztBRFFZO0VBQ0ksb0JBQUE7QUNOaEI7O0FEUVk7RUFDSSxxQkFBQTtBQ05oQjs7QURXSTtFQUNJLG1CQUFBO0FDVFI7O0FEWUk7RUVqREEseUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQ2RTO0VEZVQsa0JBQUE7QUR3Q0o7O0FEU0k7RUFDSSxnQkFBQTtBQ1BSOztBRFVJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtBQ1JSOztBRFVRO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHFCQUFBO1VBQUEseUJBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7QUNSWjs7QURVWTtFQUNJLHlCR2pGRztBRnlFbkI7O0FEYUk7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDWFI7O0FEYVE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EscUJBQUE7VUFBQSx5QkFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtBQ1haOztBRGFZO0VBQ0kseUJHcEdHO0FGeUZuQjs7QURnQkk7RUFDSSxnQkFBQTtBQ2RSOztBRGdCSTtFQUNJLGdCQUFBO0FDZFI7O0FEbUJJO0VBQ0ksb0JBQUE7RUFBQSxhQUFBO0FDaEJSOztBRGtCUTtFQUNJLHFCQUFBO0FDaEJaOztBRG1CUTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtFQUNBLGdCQUFBO0FDakJaOztBRG1CWTtFQUNJLGlCQUFBO0FDakJoQjs7QURtQlk7RUFDSSxrQkFBQTtBQ2pCaEI7O0FEb0JZO0VFMUhSLHlCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0NkUztFRGVULGtCQUFBO0FEeUdKOztBRGdCWTtFQUNJLGNBQUE7RUFDQSxtQkFBQTtBQ2RoQjs7QURpQlE7RUFDSSxtQkFBQTtVQUFBLGNBQUE7RUFDQSxVQUFBO0FDZlo7O0FEaUJRO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0VBQ0EsVUFBQTtBQ2ZaOztBRGtCUTtFQUNJLGdCQUFBO0FDaEJaOztBRHFCUTtFQUNJLGdCQUFBO0FDbkJaOztBRHFCUTtFQUNJLGtCQUFBO0FDbkJaOztBRHFCUTtFQUNJLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSx1QkFBQTtBQ25CWjs7QURxQlE7RUFDSSxrQkFBQTtFQUNBLHlCR3ZLUztFSHdLVCxrQkd0Skk7RUh1SkosV0FBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtBQ25CWjs7QURxQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsT0FBQTtFQUFTLFNBQUE7RUFDckMseUJHM0tJO0VINEtKLGtCRzlKSTtFSCtKSixxQ0FBQTtFQUFBLDZCQUFBO0FDaEJaOztBRG9CSTtFQUNJLGtCQUFBO0VBQ0EseUJHdkxhO0VId0xiLFdBQUE7RUFDQSxrQ0FBQTtBQ2xCUjs7QURvQlE7RUFDSSxrQkFBQTtFQUFvQixNQUFBO0VBQVEsUUFBQTtFQUFVLE9BQUE7QUNmbEQ7O0FEa0JRO0VBQ0ksa0JBQUE7RUFBb0IsTUFBQTtFQUFRLFNBQUE7RUFBVyxRQUFBO0VBQVUsT0FBQTtFQUNqRCxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtBQ1paOztBRGlCQTtFQUNJLGlCQUFBO0VBQ0EsY0FBQTtBQ2RKIiwiZmlsZSI6InNyYy9hcHAvc3BlYWtlci9zcGVha2VyLWRldGFpbC9zcGVha2VyLWRldGFpbC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgXCIuLi8uLi8uLi9zY3NzL3ZhcmlhYmxlc1wiO1xuQGltcG9ydCBcIi4uLy4uLy4uL3Njc3MvbWl4aW5zXCI7XG5cbi5icmVhZGNydW1iLWNvbnRhaW5lciB7XG4gICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uaGVhZGVyLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIG1hcmdpbi1ib3R0b206IDIuNXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIGhlYWRlci1mb250KCk7XG4gICAgfVxuXG4gICAgLnN1YnRpdGxlIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc3RhdHVzIHtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMC41cmVtO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uY29udGVudC1zZWN0aW9uIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgJHRoZW1lLWdyYXktYm9yZGVyO1xuICAgIGJvcmRlci1yYWRpdXM6ICRib3JkZXItcmFkaXVzO1xuICAgIHBhZGRpbmc6IDMycHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcblxuICAgIC50aXRsZSB7XG4gICAgICAgIEBpbmNsdWRlIHRpdGxlLWZvbnQoKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbiAgICB9XG5cbiAgICAmLmNvbnRlbnQtc2VjdGlvbi1kYW5nZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGVuKCR0aGVtZS1kYW5nZXIsIDM5JSk7XG4gICAgICAgIGJvcmRlci1jb2xvcjogJHRoZW1lLWRhbmdlcjtcbiAgICB9XG59XG5cbmZvcm0ge1xuICAgIC5jb2x1bW4tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAuY29sdW1uIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDUwJTtcblxuICAgICAgICAgICAgJjpub3QoOmZpcnN0LWNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAwLjVyZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAmOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDAuNXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5pbnB1dC1jb250YWluZXIge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgIH1cblxuICAgIC5sYWJlbCB7XG4gICAgICAgIEBpbmNsdWRlIGxhYmVsLWZvbnQoKTtcbiAgICB9XG5cbiAgICA6Om5nLWRlZXAgaW5wdXQge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgIH1cblxuICAgIC5zZXJpZXMtaXRlbS1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgIC5zZXJpZXMtaXRlbS1pbWFnZSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgd2lkdGg6IDEwMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA1NnB4O1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuXG4gICAgICAgICAgICAmLnBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5zcGVha2VyLWl0ZW0tY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAuc3BlYWtlci1pdGVtLWltYWdlIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB3aWR0aDogMTAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDU2cHg7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG5cbiAgICAgICAgICAgICYucGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmluY2x1ZGUtaXRlbS1sYWJlbCB7XG4gICAgICAgIHBhZGRpbmc6IDRweCA4cHg7XG4gICAgfVxuICAgIC50b3BpYy1pdGVtLWxhYmVsIHtcbiAgICAgICAgcGFkZGluZzogNHB4IDhweDtcbiAgICB9XG59XG5cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciB7XG4gICAgLmltYWdlLWNvbnRlbnQtcm93IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcblxuICAgICAgICAmOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuICAgICAgICB9XG5cbiAgICAgICAgLmltYWdlLWNvbnRlbnQtY29sIHtcbiAgICAgICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICAgICAgcGFkZGluZzogMHB4IDhweDtcblxuICAgICAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IC04cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogLThweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmxhYmVsIHtcbiAgICAgICAgICAgICAgICBAaW5jbHVkZSBsYWJlbC1mb250KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcHAtY29weS1ib3g6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAuaW1hZ2UtY29udGVudC1jb2wtaGFsZiB7XG4gICAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcbiAgICAgICAgICAgIHdpZHRoOiA1MCU7XG4gICAgICAgIH1cbiAgICAgICAgLmltYWdlLWNvbnRlbnQtY29sLXRoaXJkIHtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICAgICAgd2lkdGg6IDMzJTtcbiAgICAgICAgfVxuXG4gICAgICAgIC50aXRsZSB7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAycmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmltYWdlLXVwbG9hZC1jb250YWluZXIge1xuICAgICAgICAuYnV0dG9uIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgICAgIH1cbiAgICAgICAgLmxhYmVsIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDEuNXJlbTtcbiAgICAgICAgfVxuICAgICAgICAudXBsb2FkLW5hbWUge1xuICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgICAgfVxuICAgICAgICAucHJvZ3Jlc3MtYmFyLWNvbnRhaW5lciB7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVyO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMC41cmVtO1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMC41cmVtO1xuICAgICAgICB9XG4gICAgICAgIC5wcm9ncmVzcy1iYXIge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGJvdHRvbTogMDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1wcmltYXJ5O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogJGJvcmRlci1yYWRpdXM7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAwLjFzIGxpbmVhcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5pbWFnZS1jb250YWluZXIge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nLXRvcDogY2FsYygoOSAvIDE2KSAqIDEwMCUpO1xuXG4gICAgICAgIGltZyB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgcmlnaHQ6IDA7IGxlZnQ6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAuaW1hZ2UtcGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGJvdHRvbTogMDsgcmlnaHQ6IDA7IGxlZnQ6IDA7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5hcHAtcmV1c2FibGUtbWVkaWEtbGlzdCA6Om5nLWRlZXAgLnNjcm9sbGFibGUtcmVnaW9uIHtcbiAgICBtYXgtaGVpZ2h0OiA1MDBweDtcbiAgICBvdmVyZmxvdzogYXV0bztcbn0iLCIuYnJlYWRjcnVtYi1jb250YWluZXIge1xuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG59XG5cbi5oZWFkZXItY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgbWFyZ2luLWJvdHRvbTogMi41cmVtO1xufVxuLmhlYWRlci1jb250YWluZXIgLnRpdGxlIHtcbiAgZm9udC1zaXplOiAzMnB4O1xuICBmb250LXdlaWdodDogODAwO1xufVxuLmhlYWRlci1jb250YWluZXIgLnN1YnRpdGxlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbi5oZWFkZXItY29udGFpbmVyIC5zdWJ0aXRsZSAuc3RhdHVzIHtcbiAgbWFyZ2luLXJpZ2h0OiAwLjVyZW07XG59XG5cbi5jb250ZW50LXNlY3Rpb24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTZlNmU2O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHBhZGRpbmc6IDMycHg7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG4uY29udGVudC1zZWN0aW9uIC50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDE7XG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbn1cbi5jb250ZW50LXNlY3Rpb24uY29udGVudC1zZWN0aW9uLWRhbmdlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZiZmI7XG4gIGJvcmRlci1jb2xvcjogI0ZBM0UzOTtcbn1cblxuZm9ybSAuY29sdW1uLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5mb3JtIC5jb2x1bW4tY29udGFpbmVyIC5jb2x1bW4ge1xuICBmbGV4OiAwIDAgYXV0bztcbiAgd2lkdGg6IDUwJTtcbn1cbmZvcm0gLmNvbHVtbi1jb250YWluZXIgLmNvbHVtbjpub3QoOmZpcnN0LWNoaWxkKSB7XG4gIHBhZGRpbmctbGVmdDogMC41cmVtO1xufVxuZm9ybSAuY29sdW1uLWNvbnRhaW5lciAuY29sdW1uOm5vdCg6bGFzdC1jaGlsZCkge1xuICBwYWRkaW5nLXJpZ2h0OiAwLjVyZW07XG59XG5mb3JtIC5pbnB1dC1jb250YWluZXIge1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuZm9ybSAubGFiZWwge1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGNvbG9yOiAjOGE4YThhO1xuICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG5mb3JtIDo6bmctZGVlcCBpbnB1dCB7XG4gIG1hcmdpbi1ib3R0b206IDA7XG59XG5mb3JtIC5zZXJpZXMtaXRlbS1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuZm9ybSAuc2VyaWVzLWl0ZW0tY29udGFpbmVyIC5zZXJpZXMtaXRlbS1pbWFnZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAxMDBweDtcbiAgaGVpZ2h0OiA1NnB4O1xuICBtYXJnaW4tcmlnaHQ6IDFyZW07XG59XG5mb3JtIC5zZXJpZXMtaXRlbS1jb250YWluZXIgLnNlcmllcy1pdGVtLWltYWdlLnBsYWNlaG9sZGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2U2ZTZlNjtcbn1cbmZvcm0gLnNwZWFrZXItaXRlbS1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuZm9ybSAuc3BlYWtlci1pdGVtLWNvbnRhaW5lciAuc3BlYWtlci1pdGVtLWltYWdlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgd2lkdGg6IDEwMHB4O1xuICBoZWlnaHQ6IDU2cHg7XG4gIG1hcmdpbi1yaWdodDogMXJlbTtcbn1cbmZvcm0gLnNwZWFrZXItaXRlbS1jb250YWluZXIgLnNwZWFrZXItaXRlbS1pbWFnZS5wbGFjZWhvbGRlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlNmU2ZTY7XG59XG5mb3JtIC5pbmNsdWRlLWl0ZW0tbGFiZWwge1xuICBwYWRkaW5nOiA0cHggOHB4O1xufVxuZm9ybSAudG9waWMtaXRlbS1sYWJlbCB7XG4gIHBhZGRpbmc6IDRweCA4cHg7XG59XG5cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdzpub3QoOmxhc3QtY2hpbGQpIHtcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2wge1xuICBmbGV4OiAxIDEgYXV0bztcbiAgcGFkZGluZzogMHB4IDhweDtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sOmZpcnN0LWNoaWxkIHtcbiAgbWFyZ2luLWxlZnQ6IC04cHg7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC5pbWFnZS1jb250ZW50LWNvbDpsYXN0LWNoaWxkIHtcbiAgbWFyZ2luLXJpZ2h0OiAtOHB4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2wgLmxhYmVsIHtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBjb2xvcjogIzhhOGE4YTtcbiAgbWFyZ2luLWJvdHRvbTogMnB4O1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250ZW50LXJvdyAuaW1hZ2UtY29udGVudC1jb2wgYXBwLWNvcHktYm94Om5vdCg6bGFzdC1jaGlsZCkge1xuICBkaXNwbGF5OiBibG9jaztcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sLWhhbGYge1xuICBmbGV4OiAwIDAgYXV0bztcbiAgd2lkdGg6IDUwJTtcbn1cbi5pbWFnZS1jb250ZW50LWNvbnRhaW5lciAuaW1hZ2UtY29udGVudC1yb3cgLmltYWdlLWNvbnRlbnQtY29sLXRoaXJkIHtcbiAgZmxleDogMCAwIGF1dG87XG4gIHdpZHRoOiAzMyU7XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLWNvbnRlbnQtcm93IC50aXRsZSB7XG4gIG1hcmdpbi10b3A6IDJyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLXVwbG9hZC1jb250YWluZXIgLmJ1dHRvbiB7XG4gIG1hcmdpbi10b3A6IDFyZW07XG59XG4uaW1hZ2UtY29udGVudC1jb250YWluZXIgLmltYWdlLXVwbG9hZC1jb250YWluZXIgLmxhYmVsIHtcbiAgbWFyZ2luLXRvcDogMS41cmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC51cGxvYWQtbmFtZSB7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5wcm9ncmVzcy1iYXItY29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDAuNXJlbTtcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS11cGxvYWQtY29udGFpbmVyIC5wcm9ncmVzcy1iYXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzNiZWZmO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIHRyYW5zaXRpb246IHdpZHRoIDAuMXMgbGluZWFyO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nLXRvcDogY2FsYygoOSAvIDE2KSAqIDEwMCUpO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250YWluZXIgaW1nIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBsZWZ0OiAwO1xufVxuLmltYWdlLWNvbnRlbnQtY29udGFpbmVyIC5pbWFnZS1jb250YWluZXIgLmltYWdlLXBsYWNlaG9sZGVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGJvdHRvbTogMDtcbiAgcmlnaHQ6IDA7XG4gIGxlZnQ6IDA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG5hcHAtcmV1c2FibGUtbWVkaWEtbGlzdCA6Om5nLWRlZXAgLnNjcm9sbGFibGUtcmVnaW9uIHtcbiAgbWF4LWhlaWdodDogNTAwcHg7XG4gIG92ZXJmbG93OiBhdXRvO1xufSIsIkBpbXBvcnQgXCJ2YXJpYWJsZXNcIjtcblxuQG1peGluIHNoYWRvdygpIHtcbiAgICBib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xufVxuXG5AbWl4aW4gaGVhZGVyLWZvbnQoKSB7XG4gICAgZm9udC1zaXplOiAzMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XG59XG5cbkBtaXhpbiB0aXRsZS1mb250KCkge1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xufVxuXG5AbWl4aW4gbGFiZWwtZm9udCgpIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGNvbG9yOiAkdGhlbWUtZ3JheTtcbiAgICBtYXJnaW4tYm90dG9tOiAycHg7XG59XG4iLCIvLyBodHRwczovL2NvbG9yaHVudC5jby9wYWxldHRlLzE1NzExOFxuXG4vLyBDb2xvcnNcbiR0aGVtZS13aGl0ZTogI0ZGRkZGRjtcbiR0aGVtZS1ibGFjazogIzMzMzMzMztcbiR0aGVtZS1ncmF5LWRhcms6IHJlZDtcbiR0aGVtZS1ncmF5OiAjOGE4YThhO1xuJHRoZW1lLWdyYXktbGlnaHQ6ICNlNmU2ZTY7XG4kdGhlbWUtZ3JheS1saWdodGVyOiAjZjVmNWY1O1xuJHRoZW1lLWdyYXktbGlnaHRlc3Q6ICNmZGZkZmQ7XG4kdGhlbWUtZ3JheS1ib3JkZXI6ICR0aGVtZS1ncmF5LWxpZ2h0O1xuXG4kdGhlbWUtcHJpbWFyeTogIzMzYmVmZjtcblxuJHRoZW1lLXN1Y2Nlc3M6ICM0MkM3NUQ7XG4kdGhlbWUtZGFuZ2VyOiAjRkEzRTM5O1xuJHRoZW1lLXdhcm5pbmc6ICNGRkMyMDA7XG5cbi8vIEZvbnRzIGFuZCBUZXh0XG4kZm9udC1mYW1pbHk6IHByb3hpbWEtbm92YSwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuXG4kZm9udC1zaXplLXNtYWxsOiAwLjg3NXJlbTtcbiRmb250LXNpemUtbWVkaXVtOiAxcmVtO1xuJGZvbnQtc2l6ZS1sYXJnZTogMS41cmVtO1xuXG4vLyBMYXlvdXRcbiRib3JkZXItcmFkaXVzOiA0cHg7XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SpeakerDetailComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-speaker-detail',
                templateUrl: './speaker-detail.component.html',
                styleUrls: ['./speaker-detail.component.scss']
            }]
    }], function () { return [{ type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_6__["NotificationsService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/speaker/speaker-list/speaker-list.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/speaker/speaker-list/speaker-list.component.ts ***!
  \****************************************************************/
/*! exports provided: SpeakerListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpeakerListComponent", function() { return SpeakerListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services/app/app.service */ "./src/app/_services/app/app.service.ts");
/* harmony import */ var _classes_utility__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @classes/utility */ "./src/app/_classes/utility.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var angular2_notifications__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular2-notifications */ "./node_modules/angular2-notifications/__ivy_ngcc__/fesm2015/angular2-notifications.js");
/* harmony import */ var ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-infinite-scroll */ "./node_modules/ngx-infinite-scroll/__ivy_ngcc__/modules/ngx-infinite-scroll.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @common/action-icon/action-icon.component */ "./src/app/_common/action-icon/action-icon.component.ts");
/* harmony import */ var _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @common/loading-indicator/loading-indicator.component */ "./src/app/_common/loading-indicator/loading-indicator.component.ts");















function SpeakerListComponent_ng_container_8_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r87 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("Showing ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx_r87.entries.length), " ", ctx_r87.entries.length === 1 ? "speaker" : "speakers", "");
} }
function SpeakerListComponent_ng_container_8_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r88 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate3"]("Showing ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 3, ctx_r88.filtered.length), " of ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 5, ctx_r88.entries.length), " ", ctx_r88.entries.length === 1 ? "speaker" : "speakers", "");
} }
function SpeakerListComponent_ng_container_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, SpeakerListComponent_ng_container_8_div_1_Template, 3, 4, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, SpeakerListComponent_ng_container_8_div_2_Template, 4, 7, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r84 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r84.filtered.length === ctx_r84.entries.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r84.filtered.length !== ctx_r84.entries.length);
} }
function SpeakerListComponent_tr_24_img_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 23);
} if (rf & 2) {
    const entry_r89 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", entry_r89.thumbnailUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
} }
function SpeakerListComponent_tr_24_div_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "div", 24);
} }
const _c0 = function (a1) { return ["/speakers", a1]; };
function SpeakerListComponent_tr_24_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, SpeakerListComponent_tr_24_img_3_Template, 1, 1, "img", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, SpeakerListComponent_tr_24_div_4_Template, 1, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "a", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const entry_r89 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", entry_r89.thumbnailUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !entry_r89.thumbnailUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](4, _c0, entry_r89.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", entry_r89.name, " ");
} }
function SpeakerListComponent_div_25_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "No speakers available.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function SpeakerListComponent_div_25_app_loading_indicator_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-loading-indicator");
} }
function SpeakerListComponent_div_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, SpeakerListComponent_div_25_div_1_Template, 2, 0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, SpeakerListComponent_div_25_app_loading_indicator_2_Template, 1, 0, "app-loading-indicator", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r86 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r86.speakers);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r86.speakers);
} }
class SpeakerListComponent {
    constructor(locale, app, router, notifications) {
        this.locale = locale;
        this.app = app;
        this.router = router;
        this.notifications = notifications;
        this.Utility = _classes_utility__WEBPACK_IMPORTED_MODULE_2__["Utility"];
        this.entries = [];
        this.filtered = [];
        this.loaded = [];
        this.sort = 'id';
        this.ascending = false;
        this.SortOptions = {
            id: (a, b) => {
                return a.id - b.id;
            },
            name: (a, b) => {
                const A = (a.name || 'zzz').toLowerCase().trim();
                const B = (b.name || 'zzz').toLowerCase().trim();
                return A < B ? -1 : (A > B ? 1 : (a.id - b.id));
            },
        };
        this.creating = false;
    }
    ngOnInit() {
        this.app.API.getAllSpeakers().subscribe(speakers => {
            this.speakers = speakers;
            this.entries = this.speakers.map(o => {
                let result = {
                    id: o.id,
                    name: o.name || 'Untitled',
                    thumbnailUrl: o.thumbnailUrl,
                };
                result.search = `${result.name}`.toLowerCase();
                return result;
            });
            this.sort = 'name';
            this.ascending = true;
            this.updateEntries();
        });
    }
    onLoadMoreRows() {
        this.loaded = this.loaded.concat(this.filtered.slice(this.loaded.length, this.loaded.length + 30));
    }
    onSort(sort) {
        if (sort !== this.sort) {
            this.sort = sort;
            this.ascending = true;
        }
        else if (!this.ascending) {
            this.sort = 'id';
            this.ascending = false;
        }
        else {
            this.ascending = false;
        }
        this.updateEntries();
    }
    updateEntries() {
        const search = (this.search || '').toLowerCase();
        const comparator = this.SortOptions[this.sort];
        this.filtered = this.entries.filter(o => !search || o.search.indexOf(search) >= 0).sort(this.ascending ? comparator : (a, b) => -comparator(a, b));
        this.loaded = this.filtered.slice(0, 30);
    }
    onSearchUpdate() {
        this.updateEntries();
    }
    onAddSpeaker() {
        this.creating = true;
        this.app.API.createSpeaker().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["finalize"])(() => {
            this.creating = false;
        })).subscribe(speaker => {
            this.router.navigate(['/speakers', speaker.id]);
        }, error => {
            this.notifications.error('Error', 'Sorry, there was a problem creating.');
        });
    }
}
SpeakerListComponent.ɵfac = function SpeakerListComponent_Factory(t) { return new (t || SpeakerListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["NotificationsService"])); };
SpeakerListComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SpeakerListComponent, selectors: [["app-speaker-list"]], decls: 26, vars: 11, consts: [["infiniteScroll", "", 1, "scrollable-region", 3, "scrollWindow", "infiniteScrollContainer", "fromRoot", "scrolled"], [1, "header-container"], [1, "title"], [1, "button", 3, "disabled", "click"], [1, "content"], [1, "options-container"], [4, "ngIf"], [1, "spacer"], [1, "search"], ["type", "text", 3, "ngModel", "placeholder", "ngModelChange"], [1, "table-container"], [2, "width", "140px"], [1, "header"], [1, "name"], [3, "active", "icon", "click"], [4, "ngFor", "ngForOf"], ["class", "loading-container", 4, "ngIf"], ["class", "count", 4, "ngIf"], [1, "count"], [1, "image-container"], [3, "src", 4, "ngIf"], ["class", "image-placeholder", 4, "ngIf"], [3, "routerLink"], [3, "src"], [1, "image-placeholder"], [1, "loading-container"]], template: function SpeakerListComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("scrolled", function SpeakerListComponent_Template_div_scrolled_0_listener() { return ctx.onLoadMoreRows(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Speakers");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SpeakerListComponent_Template_button_click_4_listener() { return ctx.onAddSpeaker(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Add Speaker");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, SpeakerListComponent_ng_container_8_Template, 3, 2, "ng-container", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function SpeakerListComponent_Template_input_ngModelChange_11_listener($event) { return ctx.search = $event; })("ngModelChange", function SpeakerListComponent_Template_input_ngModelChange_11_listener() { return ctx.onSearchUpdate(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "table");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "th", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Image");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "th");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Name");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "app-action-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SpeakerListComponent_Template_app_action_icon_click_23_listener() { return ctx.onSort("name"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](24, SpeakerListComponent_tr_24_Template, 8, 6, "tr", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](25, SpeakerListComponent_div_25_Template, 3, 2, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("scrollWindow", false)("infiniteScrollContainer", ".center-container > .bottom-container")("fromRoot", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.creating);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.filtered.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.search)("placeholder", "Search...");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("active", ctx.sort === "name")("icon", ctx.sort !== "name" ? "sort" : ctx.ascending ? "sort-up" : "sort-down");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.loaded);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.speakers || !ctx.speakers.length);
    } }, directives: [ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__["InfiniteScrollDirective"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgModel"], _common_action_icon_action_icon_component__WEBPACK_IMPORTED_MODULE_9__["ActionIconComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLinkWithHref"], _common_loading_indicator_loading_indicator_component__WEBPACK_IMPORTED_MODULE_10__["LoadingIndicatorComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_7__["DecimalPipe"]], styles: [".header-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  margin-bottom: 2.5rem;\n}\n.header-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 800;\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.options-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n.options-container[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\n.options-container[_ngcontent-%COMP%]   .search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  background-color: #FFFFFF;\n  width: 320px;\n}\n.table-container[_ngcontent-%COMP%] {\n  border: 1px solid #e6e6e6;\n  border-radius: 4px;\n  overflow: hidden;\n}\ntable[_ngcontent-%COMP%] {\n  table-layout: fixed;\n  border-collapse: collapse;\n  width: 100%;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n  background-color: #FFFFFF;\n  padding: 10px 16px;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   .name[_ngcontent-%COMP%] {\n  -webkit-box-flex: 1;\n          flex: 1 1 auto;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon {\n  color: #e6e6e6;\n  margin: -5px 0px -5px 8px;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon:hover {\n  color: #333333;\n}\ntable[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]     .action-icon.active {\n  color: #333333;\n}\ntable[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: top;\n  background-color: #FFFFFF;\n  padding: 20px 16px;\n}\ntable[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:not(:last-child) {\n  border-bottom: 1px solid #e6e6e6;\n}\ntable[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(even)   td[_ngcontent-%COMP%] {\n  background-color: #fdfdfd;\n}\n.loading-container[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n  height: 140px;\n}\n.time[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 300;\n}\n.image-container[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.image-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.image-container[_ngcontent-%COMP%]   .image-placeholder[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #f5f5f5;\n  padding-top: calc((9 / 16) * 100%);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvYXBwL3NwZWFrZXIvc3BlYWtlci1saXN0L3NwZWFrZXItbGlzdC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvc3BlYWtlci9zcGVha2VyLWxpc3Qvc3BlYWtlci1saXN0LmNvbXBvbmVudC5zY3NzIiwiL1VzZXJzL2Fhcm9uc2NoZXJiaW5nL0RvY3VtZW50cy9kZXZlbG9wbWVudC9ob3Blc3RyZWFtL2hvcGVzdHJlYW0tYWRtaW4tbmd4L3NyYy9zY3NzL19taXhpbnMuc2NzcyIsIi9Vc2Vycy9hYXJvbnNjaGVyYmluZy9Eb2N1bWVudHMvZGV2ZWxvcG1lbnQvaG9wZXN0cmVhbS9ob3Blc3RyZWFtLWFkbWluLW5neC9zcmMvc2Nzcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EscUJBQUE7QUNGSjtBRElJO0VFREEsZUFBQTtFQUNBLGdCQUFBO0VGRUksbUJBQUE7VUFBQSxjQUFBO0FDRFI7QURLQTtFQUNJLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7QUNGSjtBRElJO0VBQ0ksbUJBQUE7VUFBQSxjQUFBO0FDRlI7QURLSTtFQUNJLHlCR3BCTTtFSHFCTixZQUFBO0FDSFI7QURPQTtFQUNJLHlCQUFBO0VBQ0Esa0JHSlk7RUhLWixnQkFBQTtBQ0pKO0FET0E7RUFDSSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0EsV0FBQTtBQ0pKO0FETUk7RUFDSSxnQkFBQTtFQUNBLHlCR3RDTTtFSHVDTixrQkFBQTtBQ0pSO0FETVE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FDSlo7QURNWTtFQUNJLG1CQUFBO1VBQUEsY0FBQTtBQ0poQjtBRE9ZO0VBQ0ksY0c5Q0c7RUgrQ0gseUJBQUE7QUNMaEI7QURPZ0I7RUFDSSxjR3JETjtBRmdEZDtBRE9nQjtFQUNJLGNHeEROO0FGbURkO0FEV0k7RUFDSSxtQkFBQTtFQUNBLHlCR2pFTTtFSGtFTixrQkFBQTtBQ1RSO0FEWUk7RUFDSSxnQ0FBQTtBQ1ZSO0FEYUk7RUFDSSx5QkdwRWM7QUZ5RHRCO0FEZUE7RUFDSSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtFQUNBLGFBQUE7QUNaSjtBRGVBO0VBQ0ksbUJHcEVjO0VIcUVkLGdCQUFBO0FDWko7QURlQTtFQUNJLFdBQUE7QUNaSjtBRGNJO0VBQ0ksV0FBQTtBQ1pSO0FEZUk7RUFDSSxrQkFBQTtFQUNBLHlCRzlGYTtFSCtGYixrQ0FBQTtBQ2JSIiwiZmlsZSI6InNyYy9hcHAvc3BlYWtlci9zcGVha2VyLWxpc3Qvc3BlYWtlci1saXN0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcIi4uLy4uLy4uL3Njc3MvdmFyaWFibGVzXCI7XG5AaW1wb3J0IFwiLi4vLi4vLi4vc2Nzcy9taXhpbnNcIjtcblxuLmhlYWRlci1jb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XG5cbiAgICAudGl0bGUge1xuICAgICAgICBAaW5jbHVkZSBoZWFkZXItZm9udCgpO1xuICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICB9XG59XG5cbi5vcHRpb25zLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgLnNwYWNlciB7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIH1cblxuICAgIC5zZWFyY2ggaW5wdXQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgICAgIHdpZHRoOiAzMjBweDtcbiAgICB9XG59XG5cbi50YWJsZS1jb250YWluZXIge1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICR0aGVtZS1ncmF5LWJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG50YWJsZSB7XG4gICAgdGFibGUtbGF5b3V0OiBmaXhlZDtcbiAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgdGgge1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtd2hpdGU7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMTZweDtcblxuICAgICAgICAuaGVhZGVyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICAgICAubmFtZSB7XG4gICAgICAgICAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIDo6bmctZGVlcCAuYWN0aW9uLWljb24ge1xuICAgICAgICAgICAgICAgIGNvbG9yOiAkdGhlbWUtZ3JheS1saWdodDtcbiAgICAgICAgICAgICAgICBtYXJnaW46IC01cHggMHB4IC01cHggOHB4O1xuXG4gICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAkdGhlbWUtYmxhY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICYuYWN0aXZlIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICR0aGVtZS1ibGFjaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0ZCB7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS13aGl0ZTtcbiAgICAgICAgcGFkZGluZzogMjBweCAxNnB4O1xuICAgIH1cblxuICAgIHRyOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJHRoZW1lLWdyYXktYm9yZGVyO1xuICAgIH1cbiAgICBcbiAgICB0cjpudGgtY2hpbGQoZXZlbikgdGQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkdGhlbWUtZ3JheS1saWdodGVzdDtcbiAgICB9XG59XG5cbi5sb2FkaW5nLWNvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGhlaWdodDogMTQwcHg7XG59XG5cbi50aW1lIHtcbiAgICBmb250LXNpemU6ICRmb250LXNpemUtc21hbGw7XG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcbn1cblxuLmltYWdlLWNvbnRhaW5lciB7XG4gICAgd2lkdGg6IDEwMCU7XG5cbiAgICBpbWcge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAuaW1hZ2UtcGxhY2Vob2xkZXIge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR0aGVtZS1ncmF5LWxpZ2h0ZXI7XG4gICAgICAgIHBhZGRpbmctdG9wOiBjYWxjKCg5IC8gMTYpICogMTAwJSk7XG4gICAgfVxufSIsIi5oZWFkZXItY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMi41cmVtO1xufVxuLmhlYWRlci1jb250YWluZXIgLnRpdGxlIHtcbiAgZm9udC1zaXplOiAzMnB4O1xuICBmb250LXdlaWdodDogODAwO1xuICBmbGV4OiAxIDEgYXV0bztcbn1cblxuLm9wdGlvbnMtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbi5vcHRpb25zLWNvbnRhaW5lciAuc3BhY2VyIHtcbiAgZmxleDogMSAxIGF1dG87XG59XG4ub3B0aW9ucy1jb250YWluZXIgLnNlYXJjaCBpbnB1dCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7XG4gIHdpZHRoOiAzMjBweDtcbn1cblxuLnRhYmxlLWNvbnRhaW5lciB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlNmU2ZTY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxudGFibGUge1xuICB0YWJsZS1sYXlvdXQ6IGZpeGVkO1xuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xuICB3aWR0aDogMTAwJTtcbn1cbnRhYmxlIHRoIHtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjtcbiAgcGFkZGluZzogMTBweCAxNnB4O1xufVxudGFibGUgdGggLmhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG50YWJsZSB0aCAuaGVhZGVyIC5uYW1lIHtcbiAgZmxleDogMSAxIGF1dG87XG59XG50YWJsZSB0aCAuaGVhZGVyIDo6bmctZGVlcCAuYWN0aW9uLWljb24ge1xuICBjb2xvcjogI2U2ZTZlNjtcbiAgbWFyZ2luOiAtNXB4IDBweCAtNXB4IDhweDtcbn1cbnRhYmxlIHRoIC5oZWFkZXIgOjpuZy1kZWVwIC5hY3Rpb24taWNvbjpob3ZlciB7XG4gIGNvbG9yOiAjMzMzMzMzO1xufVxudGFibGUgdGggLmhlYWRlciA6Om5nLWRlZXAgLmFjdGlvbi1pY29uLmFjdGl2ZSB7XG4gIGNvbG9yOiAjMzMzMzMzO1xufVxudGFibGUgdGQge1xuICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO1xuICBwYWRkaW5nOiAyMHB4IDE2cHg7XG59XG50YWJsZSB0cjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlNmU2ZTY7XG59XG50YWJsZSB0cjpudGgtY2hpbGQoZXZlbikgdGQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmRmZGZkO1xufVxuXG4ubG9hZGluZy1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgaGVpZ2h0OiAxNDBweDtcbn1cblxuLnRpbWUge1xuICBmb250LXNpemU6IDAuODc1cmVtO1xuICBmb250LXdlaWdodDogMzAwO1xufVxuXG4uaW1hZ2UtY29udGFpbmVyIHtcbiAgd2lkdGg6IDEwMCU7XG59XG4uaW1hZ2UtY29udGFpbmVyIGltZyB7XG4gIHdpZHRoOiAxMDAlO1xufVxuLmltYWdlLWNvbnRhaW5lciAuaW1hZ2UtcGxhY2Vob2xkZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gIHBhZGRpbmctdG9wOiBjYWxjKCg5IC8gMTYpICogMTAwJSk7XG59IiwiQGltcG9ydCBcInZhcmlhYmxlc1wiO1xuXG5AbWl4aW4gc2hhZG93KCkge1xuICAgIGJveC1zaGFkb3c6IDAgMXB4IDRweCAwIHJnYmEoMCwgMCwgMCwgMC4wNik7XG59XG5cbkBtaXhpbiBoZWFkZXItZm9udCgpIHtcbiAgICBmb250LXNpemU6IDMycHg7XG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcbn1cblxuQG1peGluIHRpdGxlLWZvbnQoKSB7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG59XG5cbkBtaXhpbiBsYWJlbC1mb250KCkge1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgY29sb3I6ICR0aGVtZS1ncmF5O1xuICAgIG1hcmdpbi1ib3R0b206IDJweDtcbn1cbiIsIi8vIGh0dHBzOi8vY29sb3JodW50LmNvL3BhbGV0dGUvMTU3MTE4XG5cbi8vIENvbG9yc1xuJHRoZW1lLXdoaXRlOiAjRkZGRkZGO1xuJHRoZW1lLWJsYWNrOiAjMzMzMzMzO1xuJHRoZW1lLWdyYXktZGFyazogcmVkO1xuJHRoZW1lLWdyYXk6ICM4YThhOGE7XG4kdGhlbWUtZ3JheS1saWdodDogI2U2ZTZlNjtcbiR0aGVtZS1ncmF5LWxpZ2h0ZXI6ICNmNWY1ZjU7XG4kdGhlbWUtZ3JheS1saWdodGVzdDogI2ZkZmRmZDtcbiR0aGVtZS1ncmF5LWJvcmRlcjogJHRoZW1lLWdyYXktbGlnaHQ7XG5cbiR0aGVtZS1wcmltYXJ5OiAjMzNiZWZmO1xuXG4kdGhlbWUtc3VjY2VzczogIzQyQzc1RDtcbiR0aGVtZS1kYW5nZXI6ICNGQTNFMzk7XG4kdGhlbWUtd2FybmluZzogI0ZGQzIwMDtcblxuLy8gRm9udHMgYW5kIFRleHRcbiRmb250LWZhbWlseTogcHJveGltYS1ub3ZhLCBcIkhlbHZldGljYSBOZXVlXCIsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG5cbiRmb250LXNpemUtc21hbGw6IDAuODc1cmVtO1xuJGZvbnQtc2l6ZS1tZWRpdW06IDFyZW07XG4kZm9udC1zaXplLWxhcmdlOiAxLjVyZW07XG5cbi8vIExheW91dFxuJGJvcmRlci1yYWRpdXM6IDRweDtcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SpeakerListComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-speaker-list',
                templateUrl: './speaker-list.component.html',
                styleUrls: ['./speaker-list.component.scss']
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["LOCALE_ID"]]
            }] }, { type: _services_app_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }, { type: angular2_notifications__WEBPACK_IMPORTED_MODULE_5__["NotificationsService"] }]; }, null); })();


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false,
    apiUrl: 'https://api.hopestream.com',
    // apiUrl: 'http://localhost:3000',
    staticUrl: 'https://static.hopestream.com/',
    playerUrl: 'https://static.hopestream.com/player.html',
    stripeApiKey: 'pk_live_4c6L6Fy6sbVWH2UgF02yk0Pw00pTGSIXlg'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
if (document.body.childNodes[0].nodeName.toLowerCase() === 'app-root') {
    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
        .catch(err => console.error(err));
}


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/aaronscherbing/Documents/development/hopestream/hopestream-admin-ngx/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map