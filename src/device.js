// Note: A complete template device can be found at https://github.com/brainsatplay/device
// or imported from "https://cdn.jsdelivr.net/npm/@brainsatplay/device@0.0.3/dist/index.esm.js"

let looping = false
let freqs = [1,4,8]
const customDevice = {
    label: 'custom',
    onconnect: (device) => {

        looping = true

        // Declare an animation loop
        const animate = (callback) => {
            if (looping){

                // Generate sine data inside the loop
                const t = Date.now() / 1000 
                let channels = []
                freqs.forEach(f => {
                    const y = Math.sin((2 * f * Math.PI) * t)
                    channels.push(y)
                })

                // Pass new data to the ondata callback for your device
                callback(channels)
                setTimeout(() => animate(callback), 1000/60)
            }
        }

        animate(device.ondata)
        
    },
    ondisconnect: async (device) => looping = false,
    ondata: (channels) => {
        return channels
    },
    protocols: []
}

export default customDevice