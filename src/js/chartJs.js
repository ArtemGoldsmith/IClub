// Module Chart.js
module.exports = function(chartId, data) {
  if ( $('#' + chartId).length ) {
    var ctx = document.getElementById(chartId);
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
          {
            fill: false,
            lineTension: 0,
            backgroundColor: "#FF7801",
            borderColor: "#FF7801",
            borderWidth: 1,
            pointRadius: 0,
            data: data,
            spanGaps: false
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false
          }]
        }
      }
    });
  }
};