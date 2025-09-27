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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5CUsu%C3%A1rio%5Ccodespace%5Ccrohnnected%5Ccrohnnected_front%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CUsu%C3%A1rio%5Ccodespace%5Ccrohnnected%5Ccrohnnected_front&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5CUsu%C3%A1rio%5Ccodespace%5Ccrohnnected%5Ccrohnnected_front%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CUsu%C3%A1rio%5Ccodespace%5Ccrohnnected%5Ccrohnnected_front&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Usu_rio_codespace_crohnnected_crohnnected_front_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Usuário\\\\codespace\\\\crohnnected\\\\crohnnected_front\\\\app\\\\api\\\\auth\\\\[...nextauth]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Usu_rio_codespace_crohnnected_crohnnected_front_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNVc3UlQzMlQTFyaW8lNUNjb2Rlc3BhY2UlNUNjcm9obm5lY3RlZCU1Q2Nyb2hubmVjdGVkX2Zyb250JTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNVc3UlQzMlQTFyaW8lNUNjb2Rlc3BhY2UlNUNjcm9obm5lY3RlZCU1Q2Nyb2hubmVjdGVkX2Zyb250JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNzRDtBQUNuSTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC8/ZjQ5YSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxVc3XDoXJpb1xcXFxjb2Rlc3BhY2VcXFxcY3JvaG5uZWN0ZWRcXFxcY3JvaG5uZWN0ZWRfZnJvbnRcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXFsuLi5uZXh0YXV0aF1cXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcVXN1w6FyaW9cXFxcY29kZXNwYWNlXFxcXGNyb2hubmVjdGVkXFxcXGNyb2hubmVjdGVkX2Zyb250XFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxbLi4ubmV4dGF1dGhdXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5CUsu%C3%A1rio%5Ccodespace%5Ccrohnnected%5Ccrohnnected_front%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CUsu%C3%A1rio%5Ccodespace%5Ccrohnnected%5Ccrohnnected_front&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNnQztBQUNRO0FBRXhDLE1BQU1FLFVBQVVGLGdEQUFRQSxDQUFDQyxrREFBV0E7QUFFTSIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC8uL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzP2M4YTQiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCBOZXh0QXV0aCBmcm9tICduZXh0LWF1dGgnXHJcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aCdcclxuXHJcbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aChhdXRoT3B0aW9ucylcclxuXHJcbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfVxyXG4iXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJhdXRoT3B0aW9ucyIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   checkRateLimit: () => (/* binding */ checkRateLimit),\n/* harmony export */   generateAccessToken: () => (/* binding */ generateAccessToken),\n/* harmony export */   generateRefreshToken: () => (/* binding */ generateRefreshToken),\n/* harmony export */   getRateLimitKey: () => (/* binding */ getRateLimitKey),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken),\n/* harmony export */   withAuth: () => (/* binding */ withAuth)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @next-auth/prisma-adapter */ \"(rsc)/./node_modules/@next-auth/prisma-adapter/dist/index.js\");\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var argon2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! argon2 */ \"argon2\");\n/* harmony import */ var argon2__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(argon2__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nconst authOptions = {\n    adapter: (0,_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_1__.PrismaAdapter)(_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma),\n    session: {\n        strategy: \"jwt\"\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    return null;\n                }\n                const user = await _prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    },\n                    include: {\n                        patientProfile: true,\n                        doctorProfile: true\n                    }\n                });\n                if (!user) {\n                    return null;\n                }\n                const isValidPassword = await (0,argon2__WEBPACK_IMPORTED_MODULE_3__.verify)(user.passwordHash, credentials.password);\n                if (!isValidPassword) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    email: user.email,\n                    name: user.name,\n                    role: user.role,\n                    profile: user.patientProfile || user.doctorProfile || null\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.role = user.role;\n                token.profile = user.profile;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token) {\n                session.user.id = token.sub;\n                session.user.role = token.role;\n                session.user.profile = token.profile;\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/login\",\n        newUser: \"/register\"\n    }\n};\n// Additional auth utility functions for Session 1 API routes\nasync function hashPassword(password) {\n    return (0,argon2__WEBPACK_IMPORTED_MODULE_3__.hash)(password);\n}\nasync function verifyPassword(password, hashedPassword) {\n    return (0,argon2__WEBPACK_IMPORTED_MODULE_3__.verify)(hashedPassword, password);\n}\nfunction generateAccessToken(payload) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_5___default().sign(payload, process.env.NEXTAUTH_SECRET, {\n        expiresIn: \"1h\"\n    });\n}\nfunction generateRefreshToken(payload) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_5___default().sign(payload, process.env.NEXTAUTH_SECRET, {\n        expiresIn: \"7d\"\n    });\n}\nfunction verifyToken(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_5___default().verify(token, process.env.NEXTAUTH_SECRET);\n    } catch  {\n        return null;\n    }\n}\n// Rate limiting functions (basic implementation)\nconst rateLimitMap = new Map();\nasync function checkRateLimit(key, maxRequests = 5, windowMs = 15 * 60 * 1000) {\n    const now = Date.now();\n    const record = rateLimitMap.get(key);\n    if (!record || now > record.resetTime) {\n        rateLimitMap.set(key, {\n            count: 1,\n            resetTime: now + windowMs\n        });\n        return true;\n    }\n    if (record.count >= maxRequests) {\n        return false;\n    }\n    record.count++;\n    return true;\n}\nfunction getRateLimitKey(req, prefix) {\n    const ip = req.headers.get(\"x-forwarded-for\") || req.headers.get(\"x-real-ip\") || \"unknown\";\n    return `${prefix}:${ip}`;\n}\n// Auth wrapper for API routes (compatible with Session 1 signature)\nfunction withAuth(handler, allowedRoles) {\n    return async (req, context)=>{\n        try {\n            const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_4__.getServerSession)(authOptions);\n            if (!session || !session.user) {\n                return Response.json({\n                    success: false,\n                    error: \"Unauthorized\"\n                }, {\n                    status: 401\n                });\n            }\n            if (allowedRoles && !allowedRoles.includes(session.user.role)) {\n                return Response.json({\n                    success: false,\n                    error: \"Forbidden\"\n                }, {\n                    status: 403\n                });\n            }\n            // Convert session user to the expected User format\n            const user = {\n                id: session.user.id,\n                email: session.user.email,\n                name: session.user.name,\n                role: session.user.role,\n                profile: session.user.profile\n            };\n            return handler(req, user, context);\n        } catch (error) {\n            console.error(\"Auth wrapper error:\", error);\n            return Response.json({\n                success: false,\n                error: \"Internal server error\"\n            }, {\n                status: 500\n            });\n        }\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxPQUFPMEMsU0FBU0MsSUFBSSxDQUFDO29CQUFFQyxTQUFTO29CQUFPQyxPQUFPO2dCQUFZLEdBQUc7b0JBQUVDLFFBQVE7Z0JBQUk7WUFDN0U7WUFFQSxtREFBbUQ7WUFDbkQsTUFBTXZELE9BQU87Z0JBQ1hRLElBQUlsQixRQUFRVSxJQUFJLENBQUNRLEVBQUU7Z0JBQ25CYixPQUFPTCxRQUFRVSxJQUFJLENBQUNMLEtBQUs7Z0JBQ3pCRixNQUFNSCxRQUFRVSxJQUFJLENBQUNQLElBQUk7Z0JBQ3ZCZ0IsTUFBTW5CLFFBQVFVLElBQUksQ0FBQ1MsSUFBSTtnQkFDdkJDLFNBQVNwQixRQUFRVSxJQUFJLENBQUNVLE9BQU87WUFDL0I7WUFFQSxPQUFPc0MsUUFBUUwsS0FBSzNDLE1BQU1rRDtRQUM1QixFQUFFLE9BQU9JLE9BQU87WUFDZEcsUUFBUUgsS0FBSyxDQUFDLHVCQUF1QkE7WUFDckMsT0FBT0gsU0FBU0MsSUFBSSxDQUFDO2dCQUFFQyxTQUFTO2dCQUFPQyxPQUFPO1lBQXdCLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUN6RjtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAvLi9saWIvYXV0aC50cz9iZjdlIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tIFwibmV4dC1hdXRoXCJcclxuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSBcIm5leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHNcIlxyXG5pbXBvcnQgeyBQcmlzbWFBZGFwdGVyIH0gZnJvbSBcIkBuZXh0LWF1dGgvcHJpc21hLWFkYXB0ZXJcIlxyXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tIFwiLi9wcmlzbWFcIlxyXG5pbXBvcnQgeyB2ZXJpZnksIGhhc2ggfSBmcm9tIFwiYXJnb24yXCJcclxuaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiXHJcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tIFwibmV4dC1hdXRoXCJcclxuaW1wb3J0IHsgVXNlclJvbGUgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIlxyXG5pbXBvcnQgand0IGZyb20gXCJqc29ud2VidG9rZW5cIlxyXG5cclxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XHJcbiAgYWRhcHRlcjogUHJpc21hQWRhcHRlcihwcmlzbWEpLFxyXG4gIHNlc3Npb246IHtcclxuICAgIHN0cmF0ZWd5OiBcImp3dFwiLFxyXG4gIH0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcclxuICAgICAgbmFtZTogXCJjcmVkZW50aWFsc1wiLFxyXG4gICAgICBjcmVkZW50aWFsczoge1xyXG4gICAgICAgIGVtYWlsOiB7IGxhYmVsOiBcIkVtYWlsXCIsIHR5cGU6IFwiZW1haWxcIiB9LFxyXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiBcIlBhc3N3b3JkXCIsIHR5cGU6IFwicGFzc3dvcmRcIiB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xyXG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcclxuICAgICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XHJcbiAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICBlbWFpbDogY3JlZGVudGlhbHMuZW1haWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBpbmNsdWRlOiB7XHJcbiAgICAgICAgICAgIHBhdGllbnRQcm9maWxlOiB0cnVlLFxyXG4gICAgICAgICAgICBkb2N0b3JQcm9maWxlOiB0cnVlLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmICghdXNlcikge1xyXG4gICAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGlzVmFsaWRQYXNzd29yZCA9IGF3YWl0IHZlcmlmeSh1c2VyLnBhc3N3b3JkSGFzaCwgY3JlZGVudGlhbHMucGFzc3dvcmQpXHJcblxyXG4gICAgICAgIGlmICghaXNWYWxpZFBhc3N3b3JkKSB7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlkOiB1c2VyLmlkLFxyXG4gICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgICBuYW1lOiB1c2VyLm5hbWUsXHJcbiAgICAgICAgICByb2xlOiB1c2VyLnJvbGUsXHJcbiAgICAgICAgICBwcm9maWxlOiB1c2VyLnBhdGllbnRQcm9maWxlIHx8IHVzZXIuZG9jdG9yUHJvZmlsZSB8fCBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgY2FsbGJhY2tzOiB7XHJcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XHJcbiAgICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgdG9rZW4ucm9sZSA9IHVzZXIucm9sZVxyXG4gICAgICAgIHRva2VuLnByb2ZpbGUgPSB1c2VyLnByb2ZpbGVcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdG9rZW5cclxuICAgIH0sXHJcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xyXG4gICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICBzZXNzaW9uLnVzZXIuaWQgPSB0b2tlbi5zdWIhXHJcbiAgICAgICAgc2Vzc2lvbi51c2VyLnJvbGUgPSB0b2tlbi5yb2xlIGFzIGFueVxyXG4gICAgICAgIHNlc3Npb24udXNlci5wcm9maWxlID0gdG9rZW4ucHJvZmlsZSBhcyBhbnlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2Vzc2lvblxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGFnZXM6IHtcclxuICAgIHNpZ25JbjogXCIvbG9naW5cIixcclxuICAgIG5ld1VzZXI6IFwiL3JlZ2lzdGVyXCJcclxuICB9XHJcbn1cclxuXHJcbi8vIEFkZGl0aW9uYWwgYXV0aCB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgU2Vzc2lvbiAxIEFQSSByb3V0ZXNcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhc2hQYXNzd29yZChwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICByZXR1cm4gaGFzaChwYXNzd29yZClcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeVBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcsIGhhc2hlZFBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICByZXR1cm4gdmVyaWZ5KGhhc2hlZFBhc3N3b3JkLCBwYXNzd29yZClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlQWNjZXNzVG9rZW4ocGF5bG9hZDogYW55KTogc3RyaW5nIHtcclxuICByZXR1cm4gand0LnNpZ24ocGF5bG9hZCwgcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVUISwgeyBleHBpcmVzSW46ICcxaCcgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUmVmcmVzaFRva2VuKHBheWxvYWQ6IGFueSk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGp3dC5zaWduKHBheWxvYWQsIHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCEsIHsgZXhwaXJlc0luOiAnN2QnIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlUb2tlbih0b2tlbjogc3RyaW5nKTogYW55IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGp3dC52ZXJpZnkodG9rZW4sIHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCEpXHJcbiAgfSBjYXRjaCB7XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH1cclxufVxyXG5cclxuLy8gUmF0ZSBsaW1pdGluZyBmdW5jdGlvbnMgKGJhc2ljIGltcGxlbWVudGF0aW9uKVxyXG5jb25zdCByYXRlTGltaXRNYXAgPSBuZXcgTWFwPHN0cmluZywgeyBjb3VudDogbnVtYmVyOyByZXNldFRpbWU6IG51bWJlciB9PigpXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tSYXRlTGltaXQoa2V5OiBzdHJpbmcsIG1heFJlcXVlc3RzID0gNSwgd2luZG93TXMgPSAxNSAqIDYwICogMTAwMCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gIGNvbnN0IG5vdyA9IERhdGUubm93KClcclxuICBjb25zdCByZWNvcmQgPSByYXRlTGltaXRNYXAuZ2V0KGtleSlcclxuXHJcbiAgaWYgKCFyZWNvcmQgfHwgbm93ID4gcmVjb3JkLnJlc2V0VGltZSkge1xyXG4gICAgcmF0ZUxpbWl0TWFwLnNldChrZXksIHsgY291bnQ6IDEsIHJlc2V0VGltZTogbm93ICsgd2luZG93TXMgfSlcclxuICAgIHJldHVybiB0cnVlXHJcbiAgfVxyXG5cclxuICBpZiAocmVjb3JkLmNvdW50ID49IG1heFJlcXVlc3RzKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHJlY29yZC5jb3VudCsrXHJcbiAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhdGVMaW1pdEtleShyZXE6IE5leHRSZXF1ZXN0LCBwcmVmaXg6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgaXAgPSByZXEuaGVhZGVycy5nZXQoJ3gtZm9yd2FyZGVkLWZvcicpIHx8IHJlcS5oZWFkZXJzLmdldCgneC1yZWFsLWlwJykgfHwgJ3Vua25vd24nXHJcbiAgcmV0dXJuIGAke3ByZWZpeH06JHtpcH1gXHJcbn1cclxuXHJcbi8vIEF1dGggd3JhcHBlciBmb3IgQVBJIHJvdXRlcyAoY29tcGF0aWJsZSB3aXRoIFNlc3Npb24gMSBzaWduYXR1cmUpXHJcbmV4cG9ydCBmdW5jdGlvbiB3aXRoQXV0aChoYW5kbGVyOiAocmVxOiBOZXh0UmVxdWVzdCwgdXNlcjogYW55LCBjb250ZXh0PzogYW55KSA9PiBQcm9taXNlPFJlc3BvbnNlPiwgYWxsb3dlZFJvbGVzPzogVXNlclJvbGVbXSkge1xyXG4gIHJldHVybiBhc3luYyAocmVxOiBOZXh0UmVxdWVzdCwgY29udGV4dD86IGFueSkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpXHJcbiAgICAgIFxyXG4gICAgICBpZiAoIXNlc3Npb24gfHwgIXNlc3Npb24udXNlcikge1xyXG4gICAgICAgIHJldHVybiBSZXNwb25zZS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChhbGxvd2VkUm9sZXMgJiYgIWFsbG93ZWRSb2xlcy5pbmNsdWRlcyhzZXNzaW9uLnVzZXIucm9sZSkpIHtcclxuICAgICAgICByZXR1cm4gUmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0ZvcmJpZGRlbicgfSwgeyBzdGF0dXM6IDQwMyB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDb252ZXJ0IHNlc3Npb24gdXNlciB0byB0aGUgZXhwZWN0ZWQgVXNlciBmb3JtYXRcclxuICAgICAgY29uc3QgdXNlciA9IHtcclxuICAgICAgICBpZDogc2Vzc2lvbi51c2VyLmlkLFxyXG4gICAgICAgIGVtYWlsOiBzZXNzaW9uLnVzZXIuZW1haWwsXHJcbiAgICAgICAgbmFtZTogc2Vzc2lvbi51c2VyLm5hbWUsXHJcbiAgICAgICAgcm9sZTogc2Vzc2lvbi51c2VyLnJvbGUsXHJcbiAgICAgICAgcHJvZmlsZTogc2Vzc2lvbi51c2VyLnByb2ZpbGVcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGhhbmRsZXIocmVxLCB1c2VyLCBjb250ZXh0KVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignQXV0aCB3cmFwcGVyIGVycm9yOicsIGVycm9yKVxyXG4gICAgICByZXR1cm4gUmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSwgeyBzdGF0dXM6IDUwMCB9KVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiQ3JlZGVudGlhbHNQcm92aWRlciIsIlByaXNtYUFkYXB0ZXIiLCJwcmlzbWEiLCJ2ZXJpZnkiLCJoYXNoIiwiZ2V0U2VydmVyU2Vzc2lvbiIsImp3dCIsImF1dGhPcHRpb25zIiwiYWRhcHRlciIsInNlc3Npb24iLCJzdHJhdGVneSIsInByb3ZpZGVycyIsIm5hbWUiLCJjcmVkZW50aWFscyIsImVtYWlsIiwibGFiZWwiLCJ0eXBlIiwicGFzc3dvcmQiLCJhdXRob3JpemUiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaW5jbHVkZSIsInBhdGllbnRQcm9maWxlIiwiZG9jdG9yUHJvZmlsZSIsImlzVmFsaWRQYXNzd29yZCIsInBhc3N3b3JkSGFzaCIsImlkIiwicm9sZSIsInByb2ZpbGUiLCJjYWxsYmFja3MiLCJ0b2tlbiIsInN1YiIsInBhZ2VzIiwic2lnbkluIiwibmV3VXNlciIsImhhc2hQYXNzd29yZCIsInZlcmlmeVBhc3N3b3JkIiwiaGFzaGVkUGFzc3dvcmQiLCJnZW5lcmF0ZUFjY2Vzc1Rva2VuIiwicGF5bG9hZCIsInNpZ24iLCJwcm9jZXNzIiwiZW52IiwiTkVYVEFVVEhfU0VDUkVUIiwiZXhwaXJlc0luIiwiZ2VuZXJhdGVSZWZyZXNoVG9rZW4iLCJ2ZXJpZnlUb2tlbiIsInJhdGVMaW1pdE1hcCIsIk1hcCIsImNoZWNrUmF0ZUxpbWl0Iiwia2V5IiwibWF4UmVxdWVzdHMiLCJ3aW5kb3dNcyIsIm5vdyIsIkRhdGUiLCJyZWNvcmQiLCJnZXQiLCJyZXNldFRpbWUiLCJzZXQiLCJjb3VudCIsImdldFJhdGVMaW1pdEtleSIsInJlcSIsInByZWZpeCIsImlwIiwiaGVhZGVycyIsIndpdGhBdXRoIiwiaGFuZGxlciIsImFsbG93ZWRSb2xlcyIsImNvbnRleHQiLCJSZXNwb25zZSIsImpzb24iLCJzdWNjZXNzIiwiZXJyb3IiLCJzdGF0dXMiLCJpbmNsdWRlcyIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: [\n        \"query\"\n    ]\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUM2QztBQUU3QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxDQUFDO0lBQy9ESSxLQUFLO1FBQUM7S0FBUTtBQUNoQixHQUFFO0FBRUYsSUFBSUMsSUFBeUIsRUFBY0osZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXBwLy4vbGliL3ByaXNtYS50cz85ODIyIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcclxuXHJcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XHJcbiAgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWRcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHByaXNtYSA9IGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPz8gbmV3IFByaXNtYUNsaWVudCh7XHJcbiAgbG9nOiBbJ3F1ZXJ5J10sXHJcbn0pXHJcblxyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYVxyXG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsVGhpcyIsInByaXNtYSIsImxvZyIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/semver","vendor-chunks/oauth","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/@next-auth","vendor-chunks/preact-render-to-string","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/@panva","vendor-chunks/oidc-token-hash","vendor-chunks/ms","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5CUsu%C3%A1rio%5Ccodespace%5Ccrohnnected%5Ccrohnnected_front%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CUsu%C3%A1rio%5Ccodespace%5Ccrohnnected%5Ccrohnnected_front&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();