function OverallOEE(URL, sURL, company, plant, line, R_url, user1) {
    this.URL = URL;
    this.sURL = sURL;
    this.company = company;
    this.plant = plant;
    this.line = line;
    this.R_url = R_url;
    this.user1 = user1;

    CardformationOEE();
}

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(button => {
        button.addEventListener("click", () => {
            tabs.forEach(btn => btn.classList.remove("active"));
            contents.forEach(content => content.style.display = "none");

            button.classList.add("active");
            const tabId = button.getAttribute("data-tab");
            document.getElementById(tabId).style.display = "block";
        });
    });
});


// Plugin to draw OEE text in the center of the doughnut
const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
        if (chart.config.type !== 'doughnut') return;

        const { ctx, width, height } = chart;
        const oee = chart.config.data.datasets[0].data[0] || 0;
        const text = oee + '%';
        const fontSize = (height / 114).toFixed(2) + 'em sans-serif';

        ctx.save();
        ctx.font = fontSize;
        ctx.fillStyle = '#000';
        ctx.textBaseline = 'middle';

        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.restore();
    }
};
function getCardColorClass(Machine_Status) {
    switch (Machine_Status) {
        case "0":
            return "card-red";
        case "1":
            return "card-green";
        case "2":
        case "3":
            return "card-yellow";
        default:
            return "card";
    }
}
function radialProgress(selector, labelText, size = 80, thickness = 8) {
    const parent = d3.select(selector);
    parent.select('svg').remove();

    const svg = parent.append('svg')
        .attr('width', size)
        .attr('height', size);

    const outerRadius = size * 0.45;
    let value = 0;

    const arc = d3.arc()
        .startAngle(0)
        .innerRadius(outerRadius - thickness)
        .outerRadius(outerRadius);

    svg.append('path')
        .attr('class', 'progress-bar-bg')
        .attr('stroke', '#8080800f')         // light grey outline
        .attr('stroke-width', 0.1)          // adjust thickness as needed
        .attr('fill', 'none')             // ensure only outline is visible
        .attr('transform', `translate(${size / 2},${size / 2})`)
        .attr('d', arc.endAngle(Math.PI * 2)());


    const fg = svg.append('path')
        .attr('class', 'progress-bar')
        .attr('transform', `translate(${size / 2},${size / 2})`);

    const marker = svg.append('circle')
        .attr('class', 'progress-marker')
        .attr('r', thickness / 2)
        .attr('transform', `translate(${size / 2},${size / 2 - outerRadius + thickness / 2})`);

    const percentText = svg.append('text')
        .attr('class', 'progress-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.1em')
        .attr('x', size / 2)
        .attr('y', size / 2)
        .text('0%');

    const label = svg.append('text')
        .attr('class', 'progress-label1')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.2em')
        .attr('x', size / 2)
        .attr('y', size / 2)
        .text(labelText);

    return {
        update(newVal) {
            const start = value, end = newVal;
            const startA = Math.PI * start / 50;
            const diff = Math.PI * end / 50 - startA;
            const startDeg = startA / Math.PI * 180;
            const diffDeg = diff / Math.PI * 180;
            const duration = 1500;

            fg.transition().duration(duration)
                .attrTween('d', () => t => {
                    arc.endAngle(startA + diff * t);
                    return arc();
                });

            marker.transition().duration(duration)
                .attrTween('transform', () => t => {
                    const cur = startDeg + diffDeg * t;
                    return `translate(${size / 2},${size / 2}) rotate(${cur}) translate(0,-${outerRadius - thickness / 2})`;
                });

            percentText.transition().duration(duration)
                .tween('text', () => {
                    const i = d3.interpolateNumber(start, end);
                    return t => percentText.text(`${Math.round(i(t))}%`);
                });

            value = end;
        }
    };
}

function CardformationOEE() {
    const URL = this.sURL, user1 = this.user1;
    const myData = {
        CompanyCode: this.company,
        PlantCode: this.plant,
        LineCode: this.line
    };

    $.ajax({
        type: "POST",
        url: URL + "api/OverallOEE/GetOverallOEEStatus",
        headers: { Authorization: "Bearer " + user1 },
        data: myData,
        dataType: "json",
        success: function (response) {
            if (response.status !== "Success" ||
                !Array.isArray(response.data) ||
                !Array.isArray(response.data[0]) ||
                response.data[0].length === 0 ||
                !Array.isArray(response.data[1])) {
                $('#cards-container').html('<p>No data available</p>');
                return;
            }
            console.log(response);
            const machines = response.data[0];
            const statsArray = response.data[1];
            const statsMap = {};

            statsArray.forEach(stat => {
                const code = (stat.Machine_code || '').toString().trim();
                if (code) statsMap[code] = stat;
            });

            let cardsHtml = '';
            const chartsToRender = [];

            machines.forEach(machine => {
                const assetID = (machine.AssetID || '').toString().trim();
                const assetName = machine.AssetName || 'Unnamed Machine';
                const stat = statsMap[assetID];

                let variant = '', cardBody = '';
                if (stat) {
                    variant = stat.Variant || '';
                    const OK = stat.ok != null ? stat.ok : 'N/A';
                    const NOK = stat.nok != null ? stat.nok : 'N/A';
                    const OEE = stat.OEE != null ? stat.OEE : null;
                    const A = stat.Avail != null ? stat.Avail : 0;
                    const P = stat.perf != null ? stat.perf : 0;
                    const Q = stat.Qual != null ? stat.Qual : 0;
                    const svgId = `oee-svg-${assetID}`;

                    cardBody = `
            <div class="card-OK">OK: ${OK}</div>
            <div class="card-NOK">NOK: ${NOK}</div>`;

                    if (OEE !== null) {
                        cardBody += `
              <div class="card-oee">
                <div id="${svgId}" class="oee-svg"></div>
              </div>`;
                        chartsToRender.push({ svgId, OEE });
                    }

                    cardBody += `<div class="card-apq-progress">
            ${['A', 'P', 'Q'].map(k => {
                        const val = k === 'A' ? A : k === 'P' ? P : Q;
                        return `
                <div class="apq-item">
                  <label>${k}:</label>
                  <div class="progress">
                    <div class="progress-bar bg-success" style="width:${val}%;">
                      ${val}%
                    </div>
                  </div>
                </div>`;
                    }).join('')}
          </div>`;
                } else {
                    cardBody = `<div class="no-data">No data available</div>`;
                }

                cardsHtml += `
          <div class="card cards" id="card-${assetID}">
            <div class="card-title">
              ${assetName} 
              <span class="variant-label">${variant}</span>
            </div>
            ${cardBody}
          </div>`;
            });

            $('#cards-container').html(cardsHtml);
           

            // Apply status color classes based on Machine_Status
            machines.forEach(machine => {
                const assetID = (machine.AssetID || '').toString().trim();
                const stat = statsMap[assetID];
                if (stat) {
                    const statusClass = getCardColorClass(stat.Machine_Status);
                    $(`#card-${assetID}`).addClass(statusClass);
                }
            });
            


            // Initialize OEE charts
            chartsToRender.forEach(({ svgId, OEE }) => {
                radialProgress(`#${svgId}`, 'OEE').update(OEE);
            });
        },
        error: function (xhr, status, error) {
            console.error("API Error:", error);
            $('#cards-container').html('<p>Error fetching data</p>');
        }
    });
}




