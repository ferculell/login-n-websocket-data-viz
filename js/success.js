if (!sessionStorage.getItem('authorizedUser')) {

    document.querySelector('.container').innerHTML = `
    <div class="row">
        <div class="col s12 m8 l6 offset-m2 offset-l3">
            <div class="card-panel blue-grey darken-3 center-align z-depth-3">
                <div id="image-logo">
                    <img class="responsive-img" src="images/logo-1.png" alt="Acme Logo">
                </div>
                <div class="row section grey-text text-lighten-2">
                    <div class="input-field col s12">
                        <h4 class="deep-orange-text">Unauthorized access</h4>
                        <h6>You must be logged in.</h6>
                        <h6>You'll be redirected to Login page.</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    setTimeout(() => window.location.href = './index.html', 6000);

} else {

    const rate = document.querySelector('#rate');
    const time = document.querySelector('#time');
    const mySocket = new WebSocket('wss://stream.tradingeconomics.com/?client=guest:guest');

    let dataArray = [];
    const options = {
        chart: {
            foreColor: 'white',
            height: 250,
            type: 'line',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        series: [{
            data: dataArray
        }],
        title: {
            text: 'Dynamic Updating Rate Variation',
            align: 'left'
        },
        tooltip: {
            x: {
                format: 'dd MMM HH:mm:ss',
            }
        },
        markers: {
            size: 0
        },
        xaxis: {
            type: 'datetime',
            range: 100000,
            labels: {
                datetimeUTC: false
            }
        },
        yaxis: {
            range: 0.002
        },
        legend: {
            show: false
        },
    };

    const chart = new ApexCharts(
        document.querySelector("#chart"),
        options
    );

    chart.render();


    mySocket.onopen = (event) => {
        mySocket.send('{"topic": "subscribe", "to": "EURUSD:CUR"}');
    };

    mySocket.onmessage = (event) => {
        let data = JSON.parse(event.data);
        console.log(data);
        if (data.dt) {
            let date = new Date(data.dt);
            rate.innerHTML = `<h4>${data.price}</h4>`;
            time.innerText = date.toLocaleTimeString();

            dataArray.push({
                x: data.dt,
                y: data.price
            });

            if (dataArray.length > 100) {
                dataArray = dataArray.slice(-100);
            }

            chart.updateSeries([{
                data: dataArray
            }]);
        }
    }


    document.querySelector('#logout').onclick = () => {
        sessionStorage.removeItem('authorizedUser');
        window.location.href = './index.html';
    };
}