"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "argon2":
/*!*************************!*\
  !*** external "argon2" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("argon2");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Ctccv2%5Ccrohnnected_mvp_session_3%5Capp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Ctccv2%5Ccrohnnected_mvp_session_3%5Capp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Ctccv2%5Ccrohnnected_mvp_session_3%5Capp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Ctccv2%5Ccrohnnected_mvp_session_3%5Capp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_tccv2_crohnnected_mvp_session_3_app_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"C:\\\\tccv2\\\\crohnnected_mvp_session_3\\\\app\\\\app\\\\api\\\\auth\\\\[...nextauth]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_tccv2_crohnnected_mvp_session_3_app_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDdGNjdjIlNUNjcm9obm5lY3RlZF9tdnBfc2Vzc2lvbl8zJTVDYXBwJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDdGNjdjIlNUNjcm9obm5lY3RlZF9tdnBfc2Vzc2lvbl8zJTVDYXBwJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNrQztBQUMvRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC8/YmMzZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFx0Y2N2MlxcXFxjcm9obm5lY3RlZF9tdnBfc2Vzc2lvbl8zXFxcXGFwcFxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcWy4uLm5leHRhdXRoXVxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFx0Y2N2MlxcXFxjcm9obm5lY3RlZF9tdnBfc2Vzc2lvbl8zXFxcXGFwcFxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcWy4uLm5leHRhdXRoXVxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Ctccv2%5Ccrohnnected_mvp_session_3%5Capp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Ctccv2%5Ccrohnnected_mvp_session_3%5Capp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNnQztBQUNRO0FBRXhDLE1BQU1FLFVBQVVGLGdEQUFRQSxDQUFDQyxrREFBV0E7QUFFTSIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC8uL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzP2M4YTQiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgTmV4dEF1dGggZnJvbSAnbmV4dC1hdXRoJ1xuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tICdAL2xpYi9hdXRoJ1xuXG5jb25zdCBoYW5kbGVyID0gTmV4dEF1dGgoYXV0aE9wdGlvbnMpXG5cbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfVxuIl0sIm5hbWVzIjpbIk5leHRBdXRoIiwiYXV0aE9wdGlvbnMiLCJoYW5kbGVyIiwiR0VUIiwiUE9TVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   checkRateLimit: () => (/* binding */ checkRateLimit),\n/* harmony export */   generateAccessToken: () => (/* binding */ generateAccessToken),\n/* harmony export */   generateRefreshToken: () => (/* binding */ generateRefreshToken),\n/* harmony export */   getRateLimitKey: () => (/* binding */ getRateLimitKey),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken),\n/* harmony export */   withAuth: () => (/* binding */ withAuth)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @next-auth/prisma-adapter */ \"(rsc)/./node_modules/@next-auth/prisma-adapter/dist/index.js\");\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var argon2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! argon2 */ \"argon2\");\n/* harmony import */ var argon2__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(argon2__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nconst authOptions = {\n    adapter: (0,_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_1__.PrismaAdapter)(_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma),\n    session: {\n        strategy: \"jwt\"\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    return null;\n                }\n                const user = await _prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    },\n                    include: {\n                        patientProfile: true,\n                        doctorProfile: true\n                    }\n                });\n                if (!user) {\n                    return null;\n                }\n                const isValidPassword = await (0,argon2__WEBPACK_IMPORTED_MODULE_3__.verify)(user.passwordHash, credentials.password);\n                if (!isValidPassword) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    email: user.email,\n                    name: user.name,\n                    role: user.role,\n                    profile: user.patientProfile || user.doctorProfile || null\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.role = user.role;\n                token.profile = user.profile;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token) {\n                session.user.id = token.sub;\n                session.user.role = token.role;\n                session.user.profile = token.profile;\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/login\",\n        newUser: \"/register\"\n    }\n};\n// Additional auth utility functions for Session 1 API routes\nasync function hashPassword(password) {\n    return (0,argon2__WEBPACK_IMPORTED_MODULE_3__.hash)(password);\n}\nasync function verifyPassword(password, hashedPassword) {\n    return (0,argon2__WEBPACK_IMPORTED_MODULE_3__.verify)(hashedPassword, password);\n}\nfunction generateAccessToken(payload) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_5___default().sign(payload, process.env.NEXTAUTH_SECRET, {\n        expiresIn: \"1h\"\n    });\n}\nfunction generateRefreshToken(payload) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_5___default().sign(payload, process.env.NEXTAUTH_SECRET, {\n        expiresIn: \"7d\"\n    });\n}\nfunction verifyToken(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_5___default().verify(token, process.env.NEXTAUTH_SECRET);\n    } catch  {\n        return null;\n    }\n}\n// Rate limiting functions (basic implementation)\nconst rateLimitMap = new Map();\nasync function checkRateLimit(key, maxRequests = 5, windowMs = 15 * 60 * 1000) {\n    const now = Date.now();\n    const record = rateLimitMap.get(key);\n    if (!record || now > record.resetTime) {\n        rateLimitMap.set(key, {\n            count: 1,\n            resetTime: now + windowMs\n        });\n        return true;\n    }\n    if (record.count >= maxRequests) {\n        return false;\n    }\n    record.count++;\n    return true;\n}\nfunction getRateLimitKey(req, prefix) {\n    const ip = req.headers.get(\"x-forwarded-for\") || req.headers.get(\"x-real-ip\") || \"unknown\";\n    return `${prefix}:${ip}`;\n}\n// Auth wrapper for API routes (compatible with Session 1 signature)\nfunction withAuth(handler, allowedRoles) {\n    return async (req, context)=>{\n        try {\n            const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_4__.getServerSession)(authOptions);\n            if (!session || !session.user) {\n                return Response.json({\n                    success: false,\n                    error: \"Unauthorized\"\n                }, {\n                    status: 401\n                });\n            }\n            if (allowedRoles && !allowedRoles.includes(session.user.role)) {\n                return Response.json({\n                    success: false,\n                    error: \"Forbidden\"\n                }, {\n                    status: 403\n                });\n            }\n            // Convert session user to the expected User format\n            const user = {\n                id: session.user.id,\n                email: session.user.email,\n                name: session.user.name,\n                role: session.user.role,\n                profile: session.user.profile\n            };\n            return handler(req, user, context);\n        } catch (error) {\n            console.error(\"Auth wrapper error:\", error);\n            return Response.json({\n                success: false,\n                error: \"Internal server error\"\n            }, {\n                status: 500\n            });\n        }\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxPQUFPMEMsU0FBU0MsSUFBSSxDQUFDO29CQUFFQyxTQUFTO29CQUFPQyxPQUFPO2dCQUFZLEdBQUc7b0JBQUVDLFFBQVE7Z0JBQUk7WUFDN0U7WUFFQSxtREFBbUQ7WUFDbkQsTUFBTXZELE9BQU87Z0JBQ1hRLElBQUlsQixRQUFRVSxJQUFJLENBQUNRLEVBQUU7Z0JBQ25CYixPQUFPTCxRQUFRVSxJQUFJLENBQUNMLEtBQUs7Z0JBQ3pCRixNQUFNSCxRQUFRVSxJQUFJLENBQUNQLElBQUk7Z0JBQ3ZCZ0IsTUFBTW5CLFFBQVFVLElBQUksQ0FBQ1MsSUFBSTtnQkFDdkJDLFNBQVNwQixRQUFRVSxJQUFJLENBQUNVLE9BQU87WUFDL0I7WUFFQSxPQUFPc0MsUUFBUUwsS0FBSzNDLE1BQU1rRDtRQUM1QixFQUFFLE9BQU9JLE9BQU87WUFDZEcsUUFBUUgsS0FBSyxDQUFDLHVCQUF1QkE7WUFDckMsT0FBT0gsU0FBU0MsSUFBSSxDQUFDO2dCQUFFQyxTQUFTO2dCQUFPQyxPQUFPO1lBQXdCLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUN6RjtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAvLi9saWIvYXV0aC50cz9iZjdlIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSBcIm5leHQtYXV0aFwiXG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFsc1wiXG5pbXBvcnQgeyBQcmlzbWFBZGFwdGVyIH0gZnJvbSBcIkBuZXh0LWF1dGgvcHJpc21hLWFkYXB0ZXJcIlxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIi4vcHJpc21hXCJcbmltcG9ydCB7IHZlcmlmeSwgaGFzaCB9IGZyb20gXCJhcmdvbjJcIlxuaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSBcIm5leHQtYXV0aFwiXG5pbXBvcnQgeyBVc2VyUm9sZSB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiXG5pbXBvcnQgand0IGZyb20gXCJqc29ud2VidG9rZW5cIlxuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgYWRhcHRlcjogUHJpc21hQWRhcHRlcihwcmlzbWEpLFxuICBzZXNzaW9uOiB7XG4gICAgc3RyYXRlZ3k6IFwiand0XCIsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xuICAgICAgbmFtZTogXCJjcmVkZW50aWFsc1wiLFxuICAgICAgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgZW1haWw6IHsgbGFiZWw6IFwiRW1haWxcIiwgdHlwZTogXCJlbWFpbFwiIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiBcIlBhc3N3b3JkXCIsIHR5cGU6IFwicGFzc3dvcmRcIiB9XG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICBlbWFpbDogY3JlZGVudGlhbHMuZW1haWxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgICAgIHBhdGllbnRQcm9maWxlOiB0cnVlLFxuICAgICAgICAgICAgZG9jdG9yUHJvZmlsZTogdHJ1ZSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzVmFsaWRQYXNzd29yZCA9IGF3YWl0IHZlcmlmeSh1c2VyLnBhc3N3b3JkSGFzaCwgY3JlZGVudGlhbHMucGFzc3dvcmQpXG5cbiAgICAgICAgaWYgKCFpc1ZhbGlkUGFzc3dvcmQpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICBuYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgICAgcm9sZTogdXNlci5yb2xlLFxuICAgICAgICAgIHByb2ZpbGU6IHVzZXIucGF0aWVudFByb2ZpbGUgfHwgdXNlci5kb2N0b3JQcm9maWxlIHx8IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIF0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyIH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLnJvbGUgPSB1c2VyLnJvbGVcbiAgICAgICAgdG9rZW4ucHJvZmlsZSA9IHVzZXIucHJvZmlsZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VuXG4gICAgfSxcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xuICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgIHNlc3Npb24udXNlci5pZCA9IHRva2VuLnN1YiFcbiAgICAgICAgc2Vzc2lvbi51c2VyLnJvbGUgPSB0b2tlbi5yb2xlIGFzIGFueVxuICAgICAgICBzZXNzaW9uLnVzZXIucHJvZmlsZSA9IHRva2VuLnByb2ZpbGUgYXMgYW55XG4gICAgICB9XG4gICAgICByZXR1cm4gc2Vzc2lvblxuICAgIH1cbiAgfSxcbiAgcGFnZXM6IHtcbiAgICBzaWduSW46IFwiL2xvZ2luXCIsXG4gICAgbmV3VXNlcjogXCIvcmVnaXN0ZXJcIlxuICB9XG59XG5cbi8vIEFkZGl0aW9uYWwgYXV0aCB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgU2Vzc2lvbiAxIEFQSSByb3V0ZXNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYXNoUGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIHJldHVybiBoYXNoKHBhc3N3b3JkKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZ5UGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZywgaGFzaGVkUGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gdmVyaWZ5KGhhc2hlZFBhc3N3b3JkLCBwYXNzd29yZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlQWNjZXNzVG9rZW4ocGF5bG9hZDogYW55KTogc3RyaW5nIHtcbiAgcmV0dXJuIGp3dC5zaWduKHBheWxvYWQsIHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCEsIHsgZXhwaXJlc0luOiAnMWgnIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVJlZnJlc2hUb2tlbihwYXlsb2FkOiBhbnkpOiBzdHJpbmcge1xuICByZXR1cm4gand0LnNpZ24ocGF5bG9hZCwgcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVUISwgeyBleHBpcmVzSW46ICc3ZCcgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeVRva2VuKHRva2VuOiBzdHJpbmcpOiBhbnkge1xuICB0cnkge1xuICAgIHJldHVybiBqd3QudmVyaWZ5KHRva2VuLCBwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQhKVxuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbi8vIFJhdGUgbGltaXRpbmcgZnVuY3Rpb25zIChiYXNpYyBpbXBsZW1lbnRhdGlvbilcbmNvbnN0IHJhdGVMaW1pdE1hcCA9IG5ldyBNYXA8c3RyaW5nLCB7IGNvdW50OiBudW1iZXI7IHJlc2V0VGltZTogbnVtYmVyIH0+KClcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNoZWNrUmF0ZUxpbWl0KGtleTogc3RyaW5nLCBtYXhSZXF1ZXN0cyA9IDUsIHdpbmRvd01zID0gMTUgKiA2MCAqIDEwMDApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxuICBjb25zdCByZWNvcmQgPSByYXRlTGltaXRNYXAuZ2V0KGtleSlcblxuICBpZiAoIXJlY29yZCB8fCBub3cgPiByZWNvcmQucmVzZXRUaW1lKSB7XG4gICAgcmF0ZUxpbWl0TWFwLnNldChrZXksIHsgY291bnQ6IDEsIHJlc2V0VGltZTogbm93ICsgd2luZG93TXMgfSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKHJlY29yZC5jb3VudCA+PSBtYXhSZXF1ZXN0cykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmVjb3JkLmNvdW50KytcbiAgcmV0dXJuIHRydWVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhdGVMaW1pdEtleShyZXE6IE5leHRSZXF1ZXN0LCBwcmVmaXg6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGlwID0gcmVxLmhlYWRlcnMuZ2V0KCd4LWZvcndhcmRlZC1mb3InKSB8fCByZXEuaGVhZGVycy5nZXQoJ3gtcmVhbC1pcCcpIHx8ICd1bmtub3duJ1xuICByZXR1cm4gYCR7cHJlZml4fToke2lwfWBcbn1cblxuLy8gQXV0aCB3cmFwcGVyIGZvciBBUEkgcm91dGVzIChjb21wYXRpYmxlIHdpdGggU2Vzc2lvbiAxIHNpZ25hdHVyZSlcbmV4cG9ydCBmdW5jdGlvbiB3aXRoQXV0aChoYW5kbGVyOiAocmVxOiBOZXh0UmVxdWVzdCwgdXNlcjogYW55LCBjb250ZXh0PzogYW55KSA9PiBQcm9taXNlPFJlc3BvbnNlPiwgYWxsb3dlZFJvbGVzPzogVXNlclJvbGVbXSkge1xuICByZXR1cm4gYXN5bmMgKHJlcTogTmV4dFJlcXVlc3QsIGNvbnRleHQ/OiBhbnkpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpXG4gICAgICBcbiAgICAgIGlmICghc2Vzc2lvbiB8fCAhc2Vzc2lvbi51c2VyKSB7XG4gICAgICAgIHJldHVybiBSZXNwb25zZS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pXG4gICAgICB9XG5cbiAgICAgIGlmIChhbGxvd2VkUm9sZXMgJiYgIWFsbG93ZWRSb2xlcy5pbmNsdWRlcyhzZXNzaW9uLnVzZXIucm9sZSkpIHtcbiAgICAgICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdGb3JiaWRkZW4nIH0sIHsgc3RhdHVzOiA0MDMgfSlcbiAgICAgIH1cblxuICAgICAgLy8gQ29udmVydCBzZXNzaW9uIHVzZXIgdG8gdGhlIGV4cGVjdGVkIFVzZXIgZm9ybWF0XG4gICAgICBjb25zdCB1c2VyID0ge1xuICAgICAgICBpZDogc2Vzc2lvbi51c2VyLmlkLFxuICAgICAgICBlbWFpbDogc2Vzc2lvbi51c2VyLmVtYWlsLFxuICAgICAgICBuYW1lOiBzZXNzaW9uLnVzZXIubmFtZSxcbiAgICAgICAgcm9sZTogc2Vzc2lvbi51c2VyLnJvbGUsXG4gICAgICAgIHByb2ZpbGU6IHNlc3Npb24udXNlci5wcm9maWxlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoYW5kbGVyKHJlcSwgdXNlciwgY29udGV4dClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignQXV0aCB3cmFwcGVyIGVycm9yOicsIGVycm9yKVxuICAgICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InIH0sIHsgc3RhdHVzOiA1MDAgfSlcbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJDcmVkZW50aWFsc1Byb3ZpZGVyIiwiUHJpc21hQWRhcHRlciIsInByaXNtYSIsInZlcmlmeSIsImhhc2giLCJnZXRTZXJ2ZXJTZXNzaW9uIiwiand0IiwiYXV0aE9wdGlvbnMiLCJhZGFwdGVyIiwic2Vzc2lvbiIsInN0cmF0ZWd5IiwicHJvdmlkZXJzIiwibmFtZSIsImNyZWRlbnRpYWxzIiwiZW1haWwiLCJsYWJlbCIsInR5cGUiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpbmNsdWRlIiwicGF0aWVudFByb2ZpbGUiLCJkb2N0b3JQcm9maWxlIiwiaXNWYWxpZFBhc3N3b3JkIiwicGFzc3dvcmRIYXNoIiwiaWQiLCJyb2xlIiwicHJvZmlsZSIsImNhbGxiYWNrcyIsInRva2VuIiwic3ViIiwicGFnZXMiLCJzaWduSW4iLCJuZXdVc2VyIiwiaGFzaFBhc3N3b3JkIiwidmVyaWZ5UGFzc3dvcmQiLCJoYXNoZWRQYXNzd29yZCIsImdlbmVyYXRlQWNjZXNzVG9rZW4iLCJwYXlsb2FkIiwic2lnbiIsInByb2Nlc3MiLCJlbnYiLCJORVhUQVVUSF9TRUNSRVQiLCJleHBpcmVzSW4iLCJnZW5lcmF0ZVJlZnJlc2hUb2tlbiIsInZlcmlmeVRva2VuIiwicmF0ZUxpbWl0TWFwIiwiTWFwIiwiY2hlY2tSYXRlTGltaXQiLCJrZXkiLCJtYXhSZXF1ZXN0cyIsIndpbmRvd01zIiwibm93IiwiRGF0ZSIsInJlY29yZCIsImdldCIsInJlc2V0VGltZSIsInNldCIsImNvdW50IiwiZ2V0UmF0ZUxpbWl0S2V5IiwicmVxIiwicHJlZml4IiwiaXAiLCJoZWFkZXJzIiwid2l0aEF1dGgiLCJoYW5kbGVyIiwiYWxsb3dlZFJvbGVzIiwiY29udGV4dCIsIlJlc3BvbnNlIiwianNvbiIsInN1Y2Nlc3MiLCJlcnJvciIsInN0YXR1cyIsImluY2x1ZGVzIiwiY29uc29sZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: [\n        \"query\"\n    ]\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUM2QztBQUU3QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxDQUFDO0lBQy9ESSxLQUFLO1FBQUM7S0FBUTtBQUNoQixHQUFFO0FBRUYsSUFBSUMsSUFBeUIsRUFBY0osZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXBwLy4vbGliL3ByaXNtYS50cz85ODIyIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XG4gIHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoe1xuICBsb2c6IFsncXVlcnknXSxcbn0pXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hXG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsVGhpcyIsInByaXNtYSIsImxvZyIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/semver","vendor-chunks/openid-client","vendor-chunks/uuid","vendor-chunks/jsonwebtoken","vendor-chunks/oauth","vendor-chunks/jws","vendor-chunks/@panva","vendor-chunks/preact-render-to-string","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/safe-buffer","vendor-chunks/preact","vendor-chunks/oidc-token-hash","vendor-chunks/object-hash","vendor-chunks/ms","vendor-chunks/lodash.once","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isinteger","vendor-chunks/lodash.isboolean","vendor-chunks/lodash.includes","vendor-chunks/jwa","vendor-chunks/buffer-equal-constant-time","vendor-chunks/@next-auth"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Ctccv2%5Ccrohnnected_mvp_session_3%5Capp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Ctccv2%5Ccrohnnected_mvp_session_3%5Capp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();