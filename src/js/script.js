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

const slide = new WebSlides();

const typeChart = {
  bar: {
    loader: document.querySelector(".loader#bar"),
    canvas: document.querySelector("canvas#barProvinsi"),
    container: document.querySelector(".wrap#barContainer"),
  },
  pie: {
    loader: document.querySelector(".loader#pie"),
    canvas: document.querySelector("canvas#pieIndonesia"),
    container: document.querySelector(".wrap#pieContainer"),
  },
};

let Chart1 = null;
let Chart2 = null;

fetch("https://indonesia-covid-19.mathdro.id/api/provinsi/")
  .then((res) => res.json())
  .then(({ data: result }) => {
    let sembuh = [];
    let positif = [];
    let meninggal = [];

    let labels = [];

    const { loader, canvas } = typeChart.bar;

    result.forEach((data) => {
      positif.push(data.kasusPosi);
      sembuh.push(data.kasusSemb);
      meninggal.push(data.kasusMeni);

      labels.push(data.provinsi);
    });

    loader.remove();

    Chart1 = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Positif",
            data: positif,
            backgroundColor: "#ffc107",
          },
          {
            label: "Sembuh",
            data: sembuh,
            backgroundColor: "#28a745",
          },
          {
            label: "Meninggal",
            data: meninggal,
            backgroundColor: "#dc3545",
          },
        ],
      },
    });
  })
  .catch((err) => errorHandlerFetchChart(typeChart.bar, err));

fetch("https://indonesia-covid-19.mathdro.id/api/")
  .then((res) => res.json())
  .then((data) => {
    let { jumlahKasus, meninggal, sembuh } = data;

    const { canvas, loader } = typeChart.pie;

    loader.remove();

    Chart2 = new Chart(canvas, {
      type: "pie",
      data: {
        datasets: [
          {
            backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
            data: [sembuh, jumlahKasus, meninggal],
          },
        ],
        labels: ["Sembuh", "Positif", "Meninggal"],
      },
    });

    return data;
  })
  .then(({ jumlahKasus, meninggal, sembuh }) => {
    const container = document.querySelector(".content-center#angkaCorona");

    const h2 = document.createElement("h2");
    h2.innerText = "Indonesia";

    const hr = document.createElement("hr");

    const h4pertama = document.createElement("h4");
    h4pertama.innerHTML = `<span>Jumlah Positif : <span class="ubuntu-bold">${jumlahKasus}</span></span> | <span class="roboto">Sembuh : <span class="roboto-bold">${sembuh}</span></span>`;

    const h4dua = document.createElement("h4");
    h4dua.classList.add("osans");
    h4dua.innerHTML = `Meninggal : <span class="osans-bold">${meninggal}</span>`;

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

    errorHandlerFetchChart(typeChart.pie, error);
  });
