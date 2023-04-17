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
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
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
  //Instantiates the names for the validate input function
  const initialInvestmentElement = document.getElementById("initial_investment");
  const yearsElement = document.getElementById("years");
  const inflationRateElement = document.getElementById("inflation_rate");

  // Instantiates the values for the validate input function
  const initialInvestment = parseFloat(initialInvestmentElement.value);
  const years = parseFloat(yearsElement.value);
  const inflationRate = parseFloat(inflationRateElement.value);

  //Instantiates the validate input function for each of the inputs
  const validInitialInvestment = validateInput(initialInvestmentElement, initialInvestment, 0, 999999999);
  const validYears = validateInput(yearsElement, years, 0, 50);
  const validInflationRate = validateInput(inflationRateElement, inflationRate, -30, 30);

  if (!validInitialInvestment || !validYears ||!validInflationRate) {
    return;
  }

  return [initialInvestment, years, inflationRate];
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

document.getElementById("initial_investment").addEventListener("input", updateRealValueAndAreaChart);
document.getElementById("years").addEventListener("input", updateRealValueAndAreaChart);
document.getElementById("inflation_rate").addEventListener("input", updateRealValueAndAreaChart);

// Initialize the real value and area chart on page load
updateRealValueAndAreaChart();
