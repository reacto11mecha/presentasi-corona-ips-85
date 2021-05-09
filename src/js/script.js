import "webslides/static/css/webslides.css";
import "../styles/iconmoon.css";
import "../styles/main.css";

import lazyLoadImage from "./lazyLoadImage";

const images = Array.from(document.querySelectorAll("img[data-src]"));

const observer = new IntersectionObserver(handleIntersection);
images.forEach((img) => observer.observe(img));

function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      lazyLoadImage(entry.target.dataset.src, entry.target);
      observer.unobserve(entry.target);
    }
  });
}

import("webslides").then(async () => {
  const slide = new WebSlides();

  const fl = document.querySelector(".btn-fullscreen");
  fl.addEventListener("click", function () {
    if (slide.initialised) slide.fullscreen();
    this.blur();
  });

  const { Chart, registerables } = await import("chart.js").then((mod) => ({
    Chart: mod.Chart,
    registerables: mod.registerables,
  }));

  Chart.register(...registerables);

  const errorFetch = await import("./errorFetch").then(
    (mod) => mod.errorHandlerFetchChart
  );
  const typeChart = await import("./typeChart").then((mod) => mod.typeChart);

  const observerChart1 = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      const fetcher = await import("./fetcher").then((mod) => mod.fetcher);

      fetcher(
        "https://apicovid19indonesia-v2.vercel.app/api/indonesia/provinsi"
      )
        .then(async (result) => {
          const { loader, canvas } = typeChart.bar;
          loader.remove();

          new Chart(canvas, {
            type: "bar",
            data: {
              labels: result.map((data) => data.provinsi),
              datasets: [
                {
                  label: "Positif",
                  data: result.map((data) => data.kasus),
                  backgroundColor: "#ffc107",
                },
                {
                  label: "Sembuh",
                  data: result.map((data) => data.sembuh),
                  backgroundColor: "#28a745",
                },
                {
                  label: "Meninggal",
                  data: result.map((data) => data.meninggal),
                  backgroundColor: "#dc3545",
                },
              ],
            },
          });
        })
        .catch((err) => errorFetch(typeChart.bar, err));

      observerChart1.unobserve(typeChart.bar.container);
    }
  });
  observerChart1.observe(typeChart.bar.container);

  const observerChart2 = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      const fetcher = await import("./fetcher").then((mod) => mod.fetcher);

      fetcher("https://apicovid19indonesia-v2.vercel.app/api/indonesia/")
        .then(async (data) => {
          let { positif, meninggal, sembuh } = data;
          const { canvas, loader } = typeChart.pie;

          loader.remove();

          new Chart(canvas, {
            type: "pie",
            data: {
              datasets: [
                {
                  backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
                  data: [sembuh, positif, meninggal],
                },
              ],
              labels: ["Sembuh", "Positif", "Meninggal"],
            },
          });

          return data;
        })
        .then(({ positif, meninggal, sembuh }) => {
          const container = document.querySelector(
            ".content-center#angkaCorona"
          );

          const h2 = document.createElement("h2");
          h2.innerText = "Indonesia";

          const hr = document.createElement("hr");

          const h4pertama = document.createElement("h4");
          h4pertama.innerHTML = `<span>Jumlah Positif : <span class="ubuntu-bold">${positif.toLocaleString()}</span> Orang</span> | <span class="roboto">Sembuh : <span class="roboto-bold">${sembuh.toLocaleString()}</span> Orang</span>`;

          const h4dua = document.createElement("h4");
          h4dua.classList.add("osans");
          h4dua.innerHTML = `Meninggal : <span class="osans-bold">${meninggal.toLocaleString()}</span> Orang`;

          container.innerHTML = "";

          container.appendChild(h2);
          container.appendChild(hr);
          container.appendChild(h4pertama);
          container.appendChild(h4dua);
        })
        .catch((error) => {
          const bukanContainer = document.querySelector(
            ".content-center#angkaCorona"
          );

          const h2 = document.createElement("h2");
          h2.classList.add("osans-bold");
          h2.innerHTML = "Mohon Maaf";

          const h3 = document.createElement("h3");
          h3.classList.add("osans");
          h3.innerHTML = "Data Tidak Bisa Ditampilkan";

          const p = document.createElement("p");
          p.classList.add("osans");
          p.innerHTML = `Ada kesalahan dalam menampilkan data | Error : <span style="color: red;">${error}</span>`;

          bukanContainer.innerHTML = "";

          bukanContainer.appendChild(h2);
          bukanContainer.appendChild(h3);
          bukanContainer.appendChild(p);

          errorFetch(typeChart.pie, error);
        });

      observerChart2.unobserve(typeChart.pie.container);
    }
  });
  observerChart2.observe(typeChart.pie.container);
});
