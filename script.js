let finance = new Finance();

function calculateRealValue(initialInvestment, monthlyContribution, years, growthRate, compoundingFrequency) {
  let investmentValue;
  let totalInterest;
  let investmentValueText;
  let totalInterestText;
  
  if (compoundingFrequency === 'monthly') {
    let months = years * 12;
    let monthlyInt = growthRate / 12 / 100;
  
    let startInt = initialInvestment * Math.pow(1 + monthlyInt, months);
    let contributions = monthlyContribution * ((Math.pow(1 + monthlyInt, months) - 1) / monthlyInt);
  
    investmentValue = startInt + contributions;
    totalInterest = investmentValue - initialInvestment - (monthlyContribution * months);
  } else {
    let annualInt = growthRate / 100;
    let annualContribution = monthlyContribution * 12;
  
    let startInt = initialInvestment * Math.pow(1 + annualInt, years);
    let contributions = annualContribution * ((Math.pow(1 + annualInt, years) - 1) / annualInt);
  
    investmentValue = startInt + contributions;
    totalInterest = investmentValue - initialInvestment - (annualContribution * years);
  }

  investmentValueText = investmentValue.toFixed(2);
  totalInterestText = totalInterest.toFixed(2);

  // Select the div where you want to display the investment value
  let realValueElement = document.getElementById('real_value');
  let totalInterestElement = document.getElementById('total_interest');

  // Update the divs with the investment value and total interest
  realValueElement.textContent = investmentValueText;
  totalInterestElement.textContent = totalInterestText;

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

function generateTable(valuesPerYear) {
  // Get the div where the table will be displayed
  let tableDiv = document.getElementById('details_table');

  // Create the table
  let table = document.createElement('table');

  // Create the table header
  let thead = document.createElement('thead');
  let headerRow = document.createElement('tr');
  let headers = ['Years', 'Future Value', 'Total Contributions', 'Total Interest'];
  for (let header of headers) {
    let th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create the table body
  let tbody = document.createElement('tbody');
  for (let i = 0; i < valuesPerYear.length; i++) {
    let row = document.createElement('tr');

    // Get the values for this year
    let futureValue = valuesPerYear[i].investmentValue;
    let totalContributions = valuesPerYear[i].balance;
    let totalInterest = valuesPerYear[i].totalInterest;

    // Add the values to the row
    let values = [i, futureValue, totalContributions, totalInterest];
    for (let value of values) {
      let td = document.createElement('td');
      td.textContent = value;
      row.appendChild(td);
    }

    tbody.appendChild(row);
  }
  table.appendChild(tbody);

  // Add the table to the div
  tableDiv.appendChild(table);
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
    monthlyContribution: document.getElementById("monthly_contribution"),
    years: document.getElementById("years"),
    growthRate: document.getElementById("growth_rate"),
    compoundingFrequency: document.getElementById("compounding_frequency"),
  };

  const values = {
    initialInvestment: parseFloat(elements.initialInvestment.value),
    monthlyContribution: parseFloat(elements.monthlyContribution.value),
    years: parseFloat(elements.years.value),
    growthRate: parseFloat(elements.growthRate.value),
    compoundingFrequency: elements.compoundingFrequency.value,
  };

  const validInputs = {
    initialInvestment: validateInput(elements.initialInvestment, values.initialInvestment, 0, 999999999),
    monthlyContribution: validateInput(elements.monthlyContribution, values.monthlyContribution, 0, 999999999),
    years: validateInput(elements.years, values.years, 0, 50),
    growthRate: validateInput(elements.growthRate, values.growthRate, -30, 30),
  };

  if (!validInputs.initialInvestment || !validInputs.monthlyContribution || !validInputs.years || !validInputs.growthRate) {
    return;
  }

  return [values.initialInvestment, values.monthlyContribution, values.years, values.growthRate, values.compoundingFrequency];
}

function realValue(initialInvestment, monthlyContribution, years, growthRate, compoundingFrequency) {
  const valuesPerYear = Array.from({ length: years + 1 }, (_, i) => {
    const yearlyResult = calculateRealValue(initialInvestment, monthlyContribution, i, growthRate, compoundingFrequency);
    return {
      investmentValue: yearlyResult.investmentValue.toFixed(2),
      totalInterest: yearlyResult.totalInterest.toFixed(2),
      balance: initialInvestment.toFixed(2), // Add initial investment to the data
    };
  });

  // Generate the details table
  generateTable(valuesPerYear);

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
  const [initialInvestment, monthly_contribution, years, growthRate, compoundingFrequency] = instanceInpute();

  realValue(initialInvestment, monthly_contribution, years, growthRate, compoundingFrequency);
}

const areaChart = createAreaChart();

function addInputEventListener(elementId, callback) {
  document.getElementById(elementId).addEventListener("input", callback);
}

addInputEventListener("initial_investment", updateRealValueAndAreaChart);
addInputEventListener("monthly_contribution", updateRealValueAndAreaChart);
addInputEventListener("years", updateRealValueAndAreaChart);
addInputEventListener("growth_rate", updateRealValueAndAreaChart);
addInputEventListener("compounding_frequency", updateRealValueAndAreaChart);

// Initialize the real value and area chart on page load
updateRealValueAndAreaChart();
