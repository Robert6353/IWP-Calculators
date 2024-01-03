let finance = new Finance();

//comment
function calculateRealValue(initialInvestment, years, growthRate, compoundingFrequency) {
  let investmentValue;
  if (compoundingFrequency === 'monthly') {
      investmentValue = finance.CI(growthRate, 12, initialInvestment, years);
  } else {
      investmentValue = finance.CI(growthRate, 1, initialInvestment, years);
  }

  let totalInterest = investmentValue - initialInvestment;

  return {
      investmentValue: investmentValue,
      totalInterest: totalInterest
  };
}

function createAreaChart() {
  const ctx = document.getElementById("area-chart").getContext("2d");

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Investment Value",
          data: [], // This will be filled with investmentValue data
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          tension: 0.2,
          pointStyle: 'circle', // Change point style
          pointRadius: 5,
        },
        {
          label: "Total Interest",
          data: [], // This will be filled with totalInterest data
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
          tension: 0.2,
          pointStyle: 'circle', // Change point style
          pointRadius: 5,
        },
        {
          label: "Balance",
          data: [], // This will be filled with initial investment data
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
          tension: 0.2,
          pointStyle: 'circle', // Change point style
          pointRadius: 5,
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Investment Growth Calculator',
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
    growthRate: document.getElementById("growth_rate"),
    compoundingFrequency: document.getElementById("compounding_frequency"),
  };

  const values = {
    initialInvestment: parseFloat(elements.initialInvestment.value),
    years: parseFloat(elements.years.value),
    growthRate: parseFloat(elements.growthRate.value),
    compoundingFrequency: elements.compoundingFrequency.value,
  };

  const validInputs = {
    initialInvestment: validateInput(elements.initialInvestment, values.initialInvestment, 0, 999999999),
    years: validateInput(elements.years, values.years, 0, 50),
    growthRate: validateInput(elements.growthRate, values.growthRate, -30, 30),
  };

  if (!validInputs.initialInvestment || !validInputs.years || !validInputs.growthRate) {
    return;
  }

  return [values.initialInvestment, values.years, values.growthRate, values.compoundingFrequency];
}

function realValue(initialInvestment, years, growthRate, compoundingFrequency) {
  // ... rest of the function

  const valuesPerYear = Array.from({ length: years + 1 }, (_, i) => {
    const yearlyResult = calculateRealValue(initialInvestment, i, growthRate, compoundingFrequency);
    return {
      investmentValue: yearlyResult.investmentValue.toFixed(2),
      totalInterest: yearlyResult.totalInterest.toFixed(2),
      balance: initialInvestment.toFixed(2), // Add initial investment to the data
    };
  });

  updateAreaChart(areaChart, years, valuesPerYear);
}

function updateAreaChart(chart, years, valuesPerYear) {
  chart.data.labels = Array.from({ length: years + 1 }, (_, i) => i);
  chart.data.datasets[0].data = valuesPerYear.map(value => value.investmentValue);
  chart.data.datasets[1].data = valuesPerYear.map(value => value.totalInterest);
  chart.data.datasets[2].data = valuesPerYear.map(value => value.balance); // Add initial investment data to the new dataset
  chart.update();
}

function updateRealValueAndAreaChart() {
  const [initialInvestment, years, growthRate, compoundingFrequency] = instanceInpute();

  realValue(initialInvestment, years, growthRate, compoundingFrequency);
}

const areaChart = createAreaChart();

function addInputEventListener(elementId, callback) {
  document.getElementById(elementId).addEventListener("input", callback);
}

addInputEventListener("initial_investment", updateRealValueAndAreaChart);
addInputEventListener("years", updateRealValueAndAreaChart);
addInputEventListener("growth_rate", updateRealValueAndAreaChart);
addInputEventListener("compounding_frequency", updateRealValueAndAreaChart);

// Initialize the real value and area chart on page load
updateRealValueAndAreaChart();
