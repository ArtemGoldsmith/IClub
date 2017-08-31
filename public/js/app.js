/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "29337debf11778e46684"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(Object.defineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(Object.defineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "js/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	console.log('app.js has loaded!');

	;(function($) {
	  "use strict";

	  // modules
	  var fullPage = __webpack_require__(2);
	  var owlCarousel = __webpack_require__(3);
	  var chartjs = __webpack_require__(4);
	  var tableFilter = __webpack_require__(5);
	  var isotopeGallery = __webpack_require__(6);

	  // document ready functions
	  $(document).ready(function() {

	    // fullPage();
	    owlCarousel();
	    chartjs('chart-bitcoin', [40, 42, 43, 39, 30, 41, 20, 27, 35, 38, 42, 28]);
	    chartjs('chart-ethereum', [30, 30, 43, 39, 42, 30, 30, 43, 20, 35, 42, 28]);
	    chartjs('chart-litecoin', [20, 30, 42, 30, 42, 39, 35, 30, 28, 30, 43, 43]);
	    chartjs('chart-xem', [43, 42, 35, 42, 43, 30, 20, 30, 30, 28, 39, 30]);
	    chartjs('chart-xmr', [42, 20, 43, 39, 30, 30, 43, 30, 30, 28, 42, 35]);
	    tableFilter();

	  }); // end of document ready


	  // window load functions
	  $(window).on('load', function() {
	    isotopeGallery();
	    $('html,body').animate({ scrollTop: 0 }, 200);
	  }); // end of window load

	  $(document).on('click', '#leftMenu .close', function(e) {
	    e.preventDefault();
	    $('.main-wrapper').removeClass('slide-left');
	    $('#leftMenu').removeClass('opened');
	  });

	  $(document).on('click', '#menu-button', function(e) {
	    e.preventDefault();
	    $('.main-wrapper').addClass('slide-left');
	    $('#leftMenu').addClass('opened');
	  });

	  $(document).on('click', '.tab-panels ul li a', function(e) {
	    e.preventDefault();
	    $(this).parent('li').siblings('li').removeClass('active');
	    $(this).parent('li').addClass('active');
	    $(this).closest('ul').next('.tabs').children('.tab').removeClass('active');
	    $('#' + $(this).data('type')).addClass('active');
	  });

	  $(document).on('click', '.toggler-button', function(e) {
	    e.preventDefault();
	    $(this).siblings('.toggle-content').toggleClass('active');
	    $(this).text(function(i, text) {
	      return text === "See Details" ? "Close Details" : "See Details";
	    });
	  });

	  $('form.contact-form').validator().submit(function (e) {
	    if ( !e.isDefaultPrevented() ) {
	      e.preventDefault();
	      console.log('success');
	    }
	  });

	  // $('#blog-gallery .blog-info').on('click', '.button', function(e) {
	  //   e.preventDefault();
	  // });

	  $(document).on('click', '.blog-categories .categories li a', function(e) {
	    e.preventDefault();

	    if ( $(this).data('category') === 'search' ) {
	      $('.section-wrapper').addClass('blurred');
	      $('header').addClass('search');
	    }

	  });

	  $(document).on('click', 'header .search-field .close-search a', function(e) {
	    e.preventDefault();

	    $('.section-wrapper').removeClass('blurred');
	    $('header').removeClass('search');
	  });

	  $(document).on('click', 'header .search-field .microphone a', function(e) {
	    e.preventDefault();
	    recordAction();
	  });

	  var blogScrollPos = 0,
	      loadBlogContent = true;
	  $(window).scroll(function(e) {
	    console.log('scrolltop', $(this).scrollTop(), 'posts end', blogScrollPos);
	    blogScrollPos = $('#blog-gallery').height() - 250;
	    if ( $(this).scrollTop() >= blogScrollPos && loadBlogContent ) {
	      blogScrollPos = 0;
	      loadBlogContent = false;
	      var href = $('.loading-text a').attr('href');
	      e.preventDefault();
	      setTimeout(function() {
	        var scrollPos = $(this).scrollTop();
	        loadContentSearch(href);
	        $('html, body').animate({ scrollTop: scrollPos }, 300);
	      }, 1000);
	      setTimeout(function() {
	        loadBlogContent = true;
	      }, 2000);
	    }
	  });

	  // Ajax setup
	  $.ajaxSetup({
	    cache: false
	  });

	  function loadContentSearch(url) {
	    $.ajax({
	      url: url,
	      type: 'GET',
	      beforeSend: function() {
	      },
	      success: function(data) {
	        if ( typeof url !== undefined ) {
	          $('#blog-gallery').append(data).hide().fadeIn(200);
	          isotopeGallery('destroy');
	          isotopeGallery();
	        }
	      },
	      error: function(jqXHR, textStatus, errorThrown) {
	        alert(textStatus + ': ' + errorThrown + ' please, try again later');
	      }
	    });
	  }

	  function resetVoice() {
	    working = false;
	  }

	  function recordAction() {
	    if (working) {
	      speech.stop();
	      resetVoice();
	    } else {
	      working = true;
	      document.getElementById("warning").style.display = "none";
	      speech.start();
	    }
	  }

	  $('#searchInput').on('input', function() {
	    var text = $(this).val();
	    if ( text !== localStorage['transcript'] ) {
	      localStorage['transcript'] = text;
	      final_transcript = text;
	      interim_transcript = text;
	    }
	  });

	  function formatVoice(s) {
	    return s.replace(/\n/g, '<br>');
	  }

	  function capitalizeVoice(s) {
	    return s.replace(/\S/, function(m) {
	      return m.toUpperCase();
	    });
	  }

	  function initializeVoice() {
	    speech = new webkitSpeechRecognition();
	    speech.continuous = true;
	    speech.maxAlternatives = 5;
	    speech.interimResults = true;
	    speech.lang = "en-US";
	    speech.onend = resetVoice;
	  }

	  var working, speech, final_transcript = "";

	  if (!('webkitSpeechRecognition' in window)) {
	    $('header .search-field .microphone').hide();
	  } else {

	    localStorage['transcript'] = localStorage['transcript'] || "";
	    document.getElementById("searchInput").value = localStorage['transcript'];
	    final_transcript = localStorage['transcript'];

	    setInterval(function() {
	      var text = document.getElementById("searchInput").value;
	      if (text !== localStorage['transcript']) {
	        localStorage['transcript'] = text;
	      }
	    }, 5000);

	    initializeVoice();
	    resetVoice();

	    speech.onerror = function(e) {
	      var msg = e.error + " error";
	      if (e.error === 'no-speech') {
	        msg =
	          "No speech was detected. Please turn on the microphone and try again.";
	      } else if (e.error === 'audio-capture') {
	        msg =
	          "Please ensure that your microphone is connected to the computer and turned on.";
	      } else if (e.error === 'not-allowed') {
	        msg =
	          "Cannot access your microphone. Please go to chrome://settings/contentExceptions#media-stream and allow Microphone access to this website.";
	      }
	      document.getElementById("warning").innerHTML = "<p>" + msg + "</p>";
	      setTimeout(function() {
	        document.getElementById("warning").innerHTML = "";
	      }, 5000);
	    };

	    var interim_transcript = '';
	    speech.onresult = function(e) {
	      interim_transcript = '';
	      final_transcript = '';
	      if (typeof(e.results) === 'undefined') {
	        reset();
	        return;
	      }
	      for (var i = e.resultIndex; i < e.results.length; ++i) {
	        var val = e.results[i][0].transcript;
	        if (e.results[i].isFinal) {
	          final_transcript += " " + val;
	        } else {
	          interim_transcript += " " + val;
	        }
	      }
	      document.getElementById("searchInput").value = formatVoice(interim_transcript);
	    };

	    speech.onend = function(e) {
	      document.getElementById("searchInput").value = formatVoice(capitalizeVoice(final_transcript));
	    };
	  }

	  $('#sidebar-navigation ul li').on('click', 'a', function(e) {
	    e.preventDefault();

	    $(this).parent('li').siblings().children('a').removeClass('active');
	    $(this).addClass('active');
	  });

	  var isAnimating = false,
	      newLocation = '',
	      firstLoad = false;

	  //trigger smooth transition from the actual page to the new one
	  $('.main-wrapper').on('click', 'a[data-type="page-transition"]', function(e) {
	    e.preventDefault();
	    $('html,body').animate({ scrollTop: 0 }, 200);
	    //detect which page has been selected
	    var newPage = $(this).attr('href');
	    //if the page is not already being animated - trigger animation
	    if ( !isAnimating ) changePage(newPage, true);
	    firstLoad = true;
	  });

	  //detect the 'popstate' event - e.g. user clicking the back button
	  $(window).on('popstate', function() {
	    if ( firstLoad ) {
	      /*
	      Safari emits a popstate event on page load - check if firstLoad is true before animating
	      if it's false - the page has just been loaded
	      */
	      var newPageArray = location.pathname.split('/'),
	        //this is the url of the page to be loaded
	        newPage = newPageArray[newPageArray.length - 1];

	      if ( !isAnimating  &&  newLocation !== newPage ) changePage (newPage, false);
	    }
	    firstLoad = true;
	  });

	  function changePage(url, bool) {
	    isAnimating = true;
	    // trigger page animation
	    $('body').addClass('page-is-changing');
	    $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
	      loadNewContent(url, bool);
	      newLocation = url;
	      $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
	    });
	    //if browser doesn't support CSS transitions
	    if( !transitionsSupported() ) {
	      loadNewContent(url, bool);
	      newLocation = url;
	    }
	  }

	  function loadNewContent(url, bool) {
	    url = ('' === url) ? 'index.html' : url;
	    var newSection = url.replace('.html', '');
	    var section = $('<div class="submain-wrapper" data-page="' + newSection + '"></div>');

	    // $('.main-wrapper .section-wrapper').removeAttr('class').addClass('section-wrapper ' + newSection);
	    // $('header').removeAttr('data-page').attr('data-page', newSection);
	    // $('body').removeAttr('data-page').attr('data-page', newSection);
	    // $('aside').removeAttr('data-page').attr('data-page', newSection);
	    section.load(url + ' .submain-wrapper > *', function() {

	      // load new content and replace .section-wrapper content with the new one
	      $('.main-wrapper').append(section);
	      var submainWrapper = $('.submain-wrapper');
	      submainWrapper.eq(0).addClass('slide-down');
	      submainWrapper.eq(1).addClass('slide-up');

	      // move section
	      var submainHeight = $('.submain-wrapper.slide-down').height();
	      $('.submain-wrapper.slide-up').css({
	        transform: 'translateY(-' + submainHeight + 'px)'
	      });
	      setTimeout(function() {
	        submainWrapper.eq(0).remove();
	        $('.submain-wrapper.slide-up').removeClass('slide-up');
	        submainWrapper.removeAttr('style');
	      }, 500);

	      // if browser doesn't support CSS transitions - don't wait for the end of transitions
	      var delay = ( transitionsSupported() ) ? 1200 : 0;
	      setTimeout(function() {
	        // wait for the end of the transition on the loading bar before revealing the new content
	        ( section.hasClass('cd-about') ) ? $('body').addClass('cd-about') : $('body').removeClass('cd-about');
	        $('body').removeClass('page-is-changing');
	        $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
	          isAnimating = false;
	          $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
	        });

	        if( !transitionsSupported() ) isAnimating = false;
	      }, delay);

	      if( url !== window.location && bool ) {
	        //add the new page to the window.history
	        //if the new page was triggered by a 'popstate' event, don't add it
	        window.history.pushState({ path: url }, '', url);
	      }

	      // reinit js for new page
	      // console.log('reinit js');
	      owlCarousel();
	      setTimeout(function() {
	        chartjs('chart-bitcoin', [40, 42, 43, 39, 30, 41, 20, 27, 35, 38, 42, 28]);
	        chartjs('chart-ethereum', [30, 30, 43, 39, 42, 30, 30, 43, 20, 35, 42, 28]);
	        chartjs('chart-litecoin', [20, 30, 42, 30, 42, 39, 35, 30, 28, 30, 43, 43]);
	        chartjs('chart-xem', [43, 42, 35, 42, 43, 30, 20, 30, 30, 28, 39, 30]);
	        chartjs('chart-xmr', [42, 20, 43, 39, 30, 30, 43, 30, 30, 28, 42, 35]);
	        // console.log('loading charts');
	      }, 1000);
	      tableFilter();
	      isotopeGallery('destroy');
	      isotopeGallery();
	      $('form.contact-form').validator().submit(function (e) {
	        if ( !e.isDefaultPrevented() ) {
	          e.preventDefault();
	          console.log('success');
	        }
	      });
	    });
	  }

	  function transitionsSupported() {
	    return $('html').hasClass('csstransitions');
	  }


	})(jQuery);

/***/ },
/* 2 */
/***/ function(module, exports) {

	// Module FullPage.js
	module.exports = function() {
	  // $('#fullpage').fullpage({
	  //   //Navigation
	  //   anchors: ['homepage', 'membership', 'sale-table', 'market-pulse', 'news', 'services', 'team', 'q-and-a', 'contact-us'],
	  //   menu: '#menu-anchor',
	  //   lockAnchors: false,
	  //   navigation: true,
	  //   navigationPosition: 'left',
	  //   navigationTooltips:
	  //     ['Homepage', 'Exclusive Membership', 'Pre-Sale Table',
	  //       'Market Pulse', 'News', 'ICO Placement Services', 'Team'],
	  //   showActiveTooltip: false,
	  //   slidesNavigation: false,
	  //   slidesNavPosition: 'bottom',
	  //
	  //   //Scrolling
	  //   css3: true,
	  //   scrollingSpeed: 700,
	  //   autoScrolling: true,
	  //   fitToSection: true,
	  //   fitToSectionDelay: 1000,
	  //   scrollBar: false,
	  //   // easing: 'easeInOutCubic',
	  //   easingcss3: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
	  //   loopBottom: false,
	  //   loopTop: false,
	  //   loopHorizontal: true,
	  //   continuousVertical: false,
	  //   continuousHorizontal: false,
	  //   scrollHorizontally: false,
	  //   interlockedSlides: false,
	  //   dragAndMove: false,
	  //   offsetSections: false,
	  //   resetSliders: false,
	  //   fadingEffect: false,
	  //   normalScrollElements: '#element1, .element2',
	  //   scrollOverflow: true,
	  //   scrollOverflowOptions: null,
	  //   scrollOverflowReset: false,
	  //   touchSensitivity: 15,
	  //   normalScrollElementTouchThreshold: 5,
	  //   bigSectionsDestination: null,
	  //
	  //   //Accessibility
	  //   keyboardScrolling: true,
	  //   animateAnchor: true,
	  //   recordHistory: true,
	  //
	  //   //Design
	  //   controlArrows: false,
	  //   verticalCentered: true,
	  //   sectionsColor : ['#fff'],
	  //   paddingTop: '3em',
	  //   paddingBottom: '10px',
	  //   fixedElements: '.header, .footer',
	  //   responsiveWidth: 0,
	  //   responsiveHeight: 0,
	  //   responsiveSlides: false,
	  //   parallax: false,
	  //   parallaxOptions: false,
	  //
	  //   //Custom selectors
	  //   sectionSelector: '.section',
	  //   slideSelector: '.slide',
	  //
	  //   lazyLoading: true,
	  //
	  //   //events
	  //   onLeave: function(index, nextIndex, direction) {
	  //     var leavingSection = $(this);
	  //     var header = $('header');
	  //     var sidebar = $('.sidebar');
	  //     // if ($(this)) {
	  //       // $('.section.active').css({
	  //         // 'opacity': '0',
	  //         // 'filter': 'blur(10px)'
	  //       // });
	  //     // }
	  //
	  //     // links back
	  //     $('.sidebar #menu-anchor-back li').addClass('hidden');
	  //     $('.sidebar #menu-anchor-back li[data-slide="' + nextIndex + '"]').removeClass('hidden');
	  //
	  //     // links forward
	  //     $('.sidebar #menu-anchor li').addClass('hidden');
	  //     $('.sidebar #menu-anchor li[data-slide="' + nextIndex + '"]').removeClass('hidden');
	  //
	  //
	  //     // individual section styles resets
	  //     $('header .navbar .navbar-left .page-title').hide();
	  //     header.addClass('bg-white');
	  //     sidebar.removeClass('bg-white');
	  //     $('header .navbar .navbar-left .blog-categories').hide();
	  //     $('header .navbar .navbar-left .blog-filter').hide();
	  //     $('header .navbar .navbar-left .to-news').hide();
	  //     $.fn.fullpage.setAllowScrolling(true, 'up');
	  //     $.fn.fullpage.setAllowScrolling(true, 'down');
	  //     $.fn.fullpage.setAllowScrolling(true, 'left');
	  //     $.fn.fullpage.setAllowScrolling(true, 'right');
	  //     $.fn.fullpage.setKeyboardScrolling(true, 'up');
	  //     $.fn.fullpage.setKeyboardScrolling(true, 'down');
	  //     $.fn.fullpage.setKeyboardScrolling(true, 'left');
	  //     $.fn.fullpage.setKeyboardScrolling(true, 'right');
	  //
	  //     // individual section styles
	  //     if ( nextIndex === 1 ) { // Homepage
	  //     } else if ( nextIndex === 2 ) { // Exclusive Membership
	  //     } else if ( nextIndex === 3 ) { // Pre-Sale Table
	  //     } else if ( nextIndex === 4 ) { // Market Pulse
	  //       $('header .navbar .navbar-left .market-pulse').show();
	  //       $.fn.fullpage.setAllowScrolling(true, 'down');
	  //     } else if ( nextIndex === 5 ) { // News
	  //       header.removeClass('bg-white');
	  //       sidebar.addClass('bg-white');
	  //       $('header .navbar .navbar-left .blog-categories').show();
	  //       $('header .navbar .navbar-left .blog-filter').show();
	  //     } else if ( nextIndex === 5 && slideNumber === 1) { // News - Post Page
	  //       $('header .navbar .navbar-left .to-news').show();
	  //     } else if ( nextIndex === 6 ) { // ICO Placement Services
	  //       header.removeClass('bg-white');
	  //     } else if ( nextIndex === 7 ) { // Team
	  //       $('header .navbar .navbar-left .team').show();
	  //
	  //       // scroll block
	  //       $.fn.fullpage.setAllowScrolling(false, 'down');
	  //       $.fn.fullpage.setKeyboardScrolling(false, 'down');
	  //     } else if ( nextIndex === 8 ) { // Q&A
	  //       $('header .navbar .navbar-left .q-and-a').show();
	  //
	  //       // scroll block
	  //       $.fn.fullpage.setAllowScrolling(false, 'up');
	  //       $.fn.fullpage.setAllowScrolling(false, 'down');
	  //       $.fn.fullpage.setKeyboardScrolling(false, 'up');
	  //       $.fn.fullpage.setKeyboardScrolling(false, 'down');
	  //     } else if ( nextIndex === 9 ) { // Contact Us
	  //       $('header .navbar .navbar-left .contact').show();
	  //
	  //       // scroll block
	  //       $.fn.fullpage.setAllowScrolling(false, 'up');
	  //       $.fn.fullpage.setAllowScrolling(false, 'down');
	  //       $.fn.fullpage.setKeyboardScrolling(false, 'up');
	  //       $.fn.fullpage.setKeyboardScrolling(false, 'down');
	  //     }
	  //   },
	  //   afterLoad: function(anchorLink, index) {
	  //     // $('.section').not('.active').css({
	  //       // 'opacity': '1',
	  //       // 'filter': 'blur(0)'
	  //     // });
	  //     var slideNumber = $('.fp-section.active .fp-slide.active').index();
	  //
	  //     $('header .navbar .navbar-left .to-news').fadeOut(200);
	  //     if ( index === 5 && slideNumber === 1 ) { // News - Post Page
	  //       $('header .navbar .navbar-left .to-news').fadeIn(200);
	  //     }
	  //   },
	  //   afterRender: function(){},
	  //   afterResize: function(){},
	  //   afterResponsive: function(isResponsive){},
	  //   afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
	  //   onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex) {
	  //     var sectionNumber = $('.fp-section.active').index();
	  //     // console.log('section number', sectionNumber, 'slide number', slideIndex);
	  //
	  //     $('header .navbar .navbar-left .to-news').fadeOut(200);
	  //     if ( sectionNumber === 4 && slideIndex === 0 ) { // News - Post Page
	  //       $('header .navbar .navbar-left .to-news').fadeIn(200);
	  //     }
	  //   }
	  // });

	  // function getScroll() {
	  //   console.log(this.y);
	  //   $('#position').text(this.y);
	  // }

	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	// Module Owl Carousel
	module.exports = function() {
	  $('.info-slider').owlCarousel({
	    loop: false,
	    items: 3,
	    nav: true,
	    navText: ["<img src='./images/icons/left-arrow.svg'>","<img src='./images/icons/right-arrow.svg'>"],
	    dots: false
	  });
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	// Module Chart.js
	module.exports = function(chartId, data) {
	  if ( $('#' + chartId).length ) {
	    var ctx = document.getElementById(chartId);
	    var chart = new Chart(ctx, {
	      type: 'line',
	      data: {
	        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	        datasets: [
	          {
	            fill: false,
	            lineTension: 0,
	            backgroundColor: "#FF7801",
	            borderColor: "#FF7801",
	            borderWidth: 1,
	            pointRadius: 0,
	            data: data,
	            spanGaps: false
	          }
	        ]
	      },
	      options: {
	        maintainAspectRatio: false,
	        tooltips: {
	          enabled: false
	        },
	        legend: {
	          display: false
	        },
	        scales: {
	          xAxes: [{
	            display: false
	          }],
	          yAxes: [{
	            display: false
	          }]
	        }
	      }
	    });
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	// Module Table Filter
	module.exports = function() {
	  var filtersConfig = {
	    // instruct TableFilter location to import ressources from
	    base_path: 'https://unpkg.com/tablefilter@latest/dist/tablefilter/',
	    col_1: 'select',
	    col_2: 'select',
	    col_3: 'select',
	    alternate_rows: false,
	    rows_counter: false,
	    btn_reset: false,
	    loader: true,
	    mark_active_columns: false,
	    highlight_keywords: false,
	    no_results_message: false,
	    col_types: [
	      'string', 'string', 'number',
	      'date', 'date', 'number'
	    ],
	    custom_options: {
	      cols: [3],
	      texts: [
	        [
	          '0 - 25 000',
	          '100 000 - 1 500 000'
	        ]
	      ],
	      values: [
	        [
	          '>0 && <=25000',
	          '>100000 && <=1500000'
	        ]
	      ],
	      sorts: [false]
	    },
	    extensions: [{
	      name: 'sort'
	    }]
	  };

	  if ( $('#conservative-table').length ) {
	    var tf1 = new TableFilter('conservative-table', filtersConfig);
	    tf1.init();
	  }
	  if ( $('#moderate-table').length ) {
	    var tf2 = new TableFilter('moderate-table', filtersConfig);
	    tf2.init();
	  }
	  if ( $('#aggressive-table').length ) {
	    var tf3 = new TableFilter('aggressive-table', filtersConfig);
	    tf3.init();
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	// Module Isotope Gallery
	module.exports = function isotopeGallery(destroy) {

	  // init Isotope
	  var $grid = $('#blog-gallery').isotope({
	    layoutMode: 'masonry',
	    itemSelector: '.blog-info'
	  });

	  // filter functions
	  var filterFns = {};

	  // bind filter button click
	  $('.header .blog-filter .filter').on('click', 'a', function() {
	    $(this).parent('li').siblings().removeClass('active');
	    $(this).parent('li').addClass('active');
	    var filterValue = $(this).attr('data-filter');
	    // use filterFn if matches value
	    filterValue = filterFns[filterValue] || filterValue;
	    $grid.isotope({ filter: filterValue });

	  });

	  // change is-checked class on buttons
	  $('.header .blog-filter .filter').each(function(i, buttonGroup) {
	    var $buttonGroup = $(buttonGroup);
	    $buttonGroup.on('click', 'button', function() {
	      $buttonGroup.find('.is-checked').removeClass('is-checked');
	      $(this).addClass('is-checked');
	    });
	  });

	  if ( destroy === 'destroy' ) {
	    $grid.isotope('destroy');
	  }
	};

/***/ }
/******/ ]);