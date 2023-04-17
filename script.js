// The actual inflation calculation
function calculateRealValue(initialInvestment, years, inflationRate) {
  return initialInvestment * Math.pow(1 - inflationRate / 100, years);
}

// Create the area chart
function createAreaChart() {
  const ctx = document.getElementById("area-chart").getContext("2d");

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Real Value",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          tension: 0.2,
          pointStyle: 'circle', // Change point style
          pointRadius: 5,
          pointHoverRadius: 6,
          pointHitRadius: 10,
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          pointBorderColor: "rgba(75, 192, 192, 1)"
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Inflation Calculator',
          font: {
            size: 18,
            weight: 'bold',
          },
          padding: 10
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0,0,0,0.7)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 12 },
          displayColors: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1
          },
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1
          },
        }
      },
    },
  });

  return chart;
}

// Validate the input of the calculation, much improved
function validateInput(inputElement, value, min, max) {
  if (isNaN(value) || value < min || value > max) {
    inputElement.style.backgroundColor = "#B00020";
    inputElement.style.color = "white";
    return false;
  } else {
    inputElement.style.backgroundColor = "white";
    inputElement.style.color = "black";
    return true;
  }
}

function instanceInpute() {
  const elements = {
    initialInvestment: document.getElementById("initial_investment"),
    years: document.getElementById("years"),
    inflationRate: document.getElementById("inflation_rate"),
  };

  const values = {
    initialInvestment: parseFloat(elements.initialInvestment.value),
    years: parseFloat(elements.years.value),
    inflationRate: parseFloat(elements.inflationRate.value),
  };

  const validInputs = {
    initialInvestment: validateInput(elements.initialInvestment, values.initialInvestment, 0, 999999999),
    years: validateInput(elements.years, values.years, 0, 50),
    inflationRate: validateInput(elements.inflationRate, values.inflationRate, -30, 30),
  };

  if (!validInputs.initialInvestment || !validInputs.years || !validInputs.inflationRate) {
    return;
  }

  return [values.initialInvestment, values.years, values.inflationRate];
}

function realValue(initialInvestment, years, inflationRate) {
  const realValue = calculateRealValue(initialInvestment, years, inflationRate);
  document.getElementById("real_value").textContent = realValue.toFixed(2);

  //Turn the real value into an array?
  const realValuePerYear = Array.from({ length: years + 1 }, (_, i) => {
    return calculateRealValue(initialInvestment, i, inflationRate).toFixed(2);
  });

  updateAreaChart(areaChart, years, realValuePerYear);
}

function updateAreaChart(chart, years, realValuePerYear) {
  chart.data.labels = Array.from({ length: years + 1 }, (_, i) => i);
  chart.data.datasets[0].data = realValuePerYear;
  chart.update();
}

function updateRealValueAndAreaChart() {
  const [initialInvestment, years, inflationRate] = instanceInpute();

  realValue(initialInvestment, years, inflationRate);
}

const areaChart = createAreaChart();

function addInputEventListener(elementId, callback) {
  document.getElementById(elementId).addEventListener("input", callback);
}

addInputEventListener("initial_investment", updateRealValueAndAreaChart);
addInputEventListener("years", updateRealValueAndAreaChart);
addInputEventListener("inflation_rate", updateRealValueAndAreaChart);

// Initialize the real value and area chart on page load
updateRealValueAndAreaChart();
