import * as datastreams from './datastreams/index.import.js'
const dataDevices = new datastreams.DataDevices()
import muse from "./muse/index.import.js"
import * as handlers from './src/handlers.import.js'
dataDevices.load(muse)
const button = document.querySelector('button')
//pair button listener
button.onclick = () => {

    dataDevices.getUserDevice({
        label: 'muse', // declare which device you want to connect to (e.g. 'device', 'ganglion', 'muse')
    }).then(device => {
        document.querySelector(".button1").innerText = "Device Paired";
        const counter = document.createElement('h2');
        counter.innerText = 'Action counter: 0';
        document.querySelector('#main').appendChild(counter);


        console.log(device.stream)
        device.stream.tracks.forEach(handlers.ontrack)
        device.stream.onaddtrack = (e) => handlers.ontrack(e.track)
    })

}