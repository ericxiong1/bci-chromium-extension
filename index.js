// --------- Step 0: Import and initialize the datastreams-api library ---------
import * as datastreams from 'https://cdn.jsdelivr.net/npm/datastreams-api/dist/index.esm.js'
const dataDevices = new datastreams.DataDevices()

// --------- Step 1: Define your device information ---------
import customDevice from './src/device.js'

// --------- Step 2: Declare track handlers ---------
import * as handlers from './src/handlers.js'

// --------- Step 3: Load your device(s) ---------
import ganglion from "https://cdn.jsdelivr.net/npm/@brainsatplay/ganglion@0.0.2/dist/index.esm.js"
import muse from "https://cdn.jsdelivr.net/npm/@brainsatplay/muse@0.0.1/dist/index.esm.js"
dataDevices.load(ganglion)
dataDevices.load(muse)
dataDevices.load(customDevice)

// --------- Step 4: Start data acquisition on button click ---------
const button = document.querySelector('button')
const body = document.querySelector('body')
button.onclick = () => {

    dataDevices.getUserDevice({
        label: 'muse', // declare which device you want to connect to (e.g. 'device', 'ganglion', 'muse')
    }).then(device => {
        console.log(device.stream)
        device.stream.tracks.forEach(handlers.ontrack)
        device.stream.onaddtrack = (e) => handlers.ontrack(e.track)
    })

}
