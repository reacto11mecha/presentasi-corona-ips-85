const slide = new WebSlides();

const typeChart = {
  bar: {
    loader: document.querySelector(".loader#bar"),
    canvas: document.querySelector("canvas#barProvinsi"),
  },
};

let Chart1 = null;
let Chart2 = null;

fetch("https://api.kawalcorona.com/indonesia/provinsi/")
  .then((res) => res.json())
  .then((result) => {
    let sembuh = [];
    let positif = [];
    let meninggal = [];

    let labels = [];

    const { loader, canvas } = typeChart.bar;

    result.forEach((res) => {
      const data = res.attributes;

      positif.push(data.Kasus_Posi);
      sembuh.push(data.Kasus_Semb);
      meninggal.push(data.Kasus_Meni);

      labels.push(data.Provinsi);
    });

    loader.remove();

    myChartBar = new Chart(canvas, {
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
  .catch((err) => {});
