import fourier from '../compile.import.js'
const dataDiv = document.getElementById('data')
const time = document.getElementById('time')
const body = document.querySelector('html')
let startTime = null
let tracks = {}
let lastFire = -2
let tp9Array = [0, 0, 0, 0];
let tp10Array = [0, 0, 0, 0];
let af7Array = [0, 0, 0, 0];
let af8Array = [0, 0, 0, 0];
let ABarray = [0, 0]
let channelCount = 0;

let eyebrowsRaised = 0;
let abRatio = 0;
let dataCount = 0;
let abAverage = 0;

export const ondata = (track, data, timestamp) => {

    if (abRatio != 0) {
        dataCount++;
        abAverage = (abAverage + abRatio) / dataCount;

        if (abRatio > abAverage) {
            tFactor = 1
        } else {
            tFactor = 0.2
        }
    }

    if (startTime == null) {
        var layout = {
            title: 'Beta to Alpha Ratio',
            xaxis: {title: 'Time (s)', showline: true, mirror: 'allticks', ticks: 'inside'},
            yaxis: {title: 'Ratio Magnitude', showline: true, mirror: 'allticks', ticks: 'inside'}  
            }
        function zeros() {
            return 0
        }
        Plotly.newPlot('graph', [{
            y: [1, 2].map(zeros),
            mode: 'lines',
            line: { color: '#80CAF6' }
        }],layout);

        var cnt = 0;

        var interval = setInterval(function () {
            Plotly.extendTraces('graph', {
                y: [[abRatio]]
            }, [0])
            if (cnt === 10) clearInterval(interval);
        }, 2000);


    }

    // track time elapsed
    if (!startTime) startTime = timestamp[0]

    // insert a new paragraph tag into the id='data' element for each track
    const label = track.contentHint
    if (!tracks[label]) {
        tracks[label] = document.createElement('p')
        dataDiv.appendChild(tracks[label])
    }

    // update the id='time' readout
    time.innerText = `${((timestamp[0] - startTime) / 1000).toFixed(2)}s`

    // update the text content of this track's paragraph

    //every two seconds (8 channel counts) the alpha beta ratio is calculated and distributed to
    //the plotting script
    if (channelCount == 8) {
        abRatio = ABarray[1] / ABarray[0]
        channelCount = 0
        console.log(ABarray[1] / ABarray[0])
        ABarray = [0, 0]
    }

    //listens for label and adds EEG data to label bins.
    //when bins have 256 points (1 second of data) the FFT is performed 
    //and frequencies sorted into the alpha/beta bins
    if (label === 'AF7') {
        if (af7Array.length < 256) {
            for (let i = 0; i < 12; i++) {
                af7Array.push(parseInt(data[i]));
            }
        }
        else {
            console.log('AF7')
            channelCount++
            let [a, b] = fourier(af7Array)
            ABarray[0] += a
            ABarray[1] += b
            af7Array = [0, 0, 0, 0];

        }
        for (let i = 0; i < 12; i++) {
            if (data[i] > 300) {
                if ((lastFire + 0.5) < (timestamp[0] - startTime) / 1000) {
                    body.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
                    body.style.color = '#282828';
                    document.querySelector(".button1").style.color = '#282828';

                    eyebrowsRaised += 1;
                    document.querySelector('h2').innerText = "Action counter: " + eyebrowsRaised.toString();
                }
                lastFire = ((timestamp[0] - startTime) / 1000)
                break
            }
        }

    }
    //NOTE: forehead raise data is only collected from the AF7/AF8 channels
    //to increase accuracy
    if (label === 'AF8') {
        if (af8Array.length < 256) {
            for (let i = 0; i < 12; i++) {
                af8Array.push(parseInt(data[i]));
            }
        }
        else {
            let [a, b] = fourier(af8Array)
            ABarray[0] += a
            ABarray[1] += b
            channelCount++
            af8Array = [0, 0, 0, 0];
        }
        //if the toggle hasn't fired in the last 0.5 seconds, change the background color
        for (let i = 0; i < 12; i++) {
            if (data[i] > 300) {

                if ((lastFire + 0.5) < (timestamp[0] - startTime) / 1000) {
                    body.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
                    body.style.color = '#282828';
                    document.querySelector(".button1").style.color = '#282828';

                    eyebrowsRaised += 1;
                    document.querySelector('h2').innerText = "Action counter: " + eyebrowsRaised.toString();
                }
                lastFire = ((timestamp[0] - startTime) / 1000)
            }
        }
    }
    if (label === 'TP9') {
        if (tp9Array.length < 256) {
            for (let i = 0; i < 12; i++) {
                tp9Array.push(parseInt(data[i]));
            }
        }
        else {
            channelCount++
            let [a, b] = fourier(tp9Array)
            ABarray[0] += a
            ABarray[1] += b
            tp9Array = [0, 0, 0, 0];
        }
    }
    if (label === 'TP10') {
        if (tp10Array.length < 256) {
            for (let i = 0; i < 12; i++) {
                tp10Array.push(parseInt(data[i]));
            }
        }
        else {
            let [a, b] = fourier(tp10Array)
            ABarray[0] += a
            ABarray[1] += b
            channelCount++
            tp10Array = [0, 0, 0, 0];
        }
    }
    //updates array data on options page (is normally hidden)
    tracks[label].innerHTML = `<h3>${track.contentHint}</h3>${data}`
}

export const ontrack = (track) => track.subscribe((data, timestamp) => ondata(track, data, timestamp))