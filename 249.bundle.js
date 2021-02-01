(self["webpackChunkppt_ips_coronavirus_85"] = self["webpackChunkppt_ips_coronavirus_85"] || []).push([[249],{

/***/ 249:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "errorHandlerFetchChart": () => /* binding */ errorHandlerFetchChart
/* harmony export */ });
function errorHandlerFetchChart(type, error) {
  const { loader, canvas, container: mainContent } = type;
  canvas.remove();

  const container = document.createElement("div");
  container.classList.add("content-center");

  const h2 = document.createElement("h2");
  h2.classList.add("osans-bold");
  h2.innerHTML = "Mohon Maaf";

  const h3 = document.createElement("h3");
  h3.classList.add("osans");
  h3.innerHTML = "Bagan Tidak Bisa Ditampilkan";

  const p = document.createElement("p");
  p.classList.add("osans");
  p.innerHTML = `Ada kesalahan dalam menampilkan bagan | Error : <span style="color: red;">${error}</span>`;

  container.appendChild(h2);
  container.appendChild(h3);
  container.appendChild(p);

  loader.remove();
  mainContent.appendChild(container);
}


/***/ })

}]);