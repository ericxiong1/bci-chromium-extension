
const dataDevices = new DataDevices()

dataDevices.load($i)
//Pair button 
const button = document.createElement('button');
button.innerHTML = 'Connect'
button.style.zIndex = '1000';
button.style.position = 'fixed';
button.style.top = '0'
button.style.left = '0'
button.style.background = 'white'
button.style.borderRadius = '10%'
button.style.color = 'black';


//Toggle Dynamic button
const button1 = document.createElement('button');
button1.innerHTML = 'Toggle'
button1.style.zIndex = '1000';
button1.style.position = 'fixed';
button1.style.top = '0'
button1.style.left = '70px'
button1.style.background = 'white'
button1.style.borderRadius = '10%'
button1.style.color = 'black';

document.body.appendChild(button);
document.body.appendChild(button1);

//screen dimmer div
const lightsOff = document.createElement('div');
lightsOff.style.width = '10000px'
lightsOff.style.height = '10000px'
lightsOff.style.position = 'absolute'
lightsOff.style.left = '0'
lightsOff.style.right = '0'
lightsOff.style.top= '0'
lightsOff.style.bottom = '0'
lightsOff.style.opacity = '0'
lightsOff.style.backgroundColor = 'black'
lightsOff.style.zIndex = '999'
lightsOff.style.pointerEvents = 'none'
document.body.appendChild(lightsOff)

//onclick listeners
button.onclick = () => {

    dataDevices.getUserDevice({
        label: 'muse', // declare which device you want to connect to (e.g. 'device', 'ganglion', 'muse')
    }).then(device => {
        button.innerHTML = 'Paired!'
        console.log(device.stream)
        device.stream.tracks.forEach(ontrack)
        device.stream.onaddtrack = (e) => ontrack(e.track)
    })

}
button1.onclick = () => {
    if (button1.innerHTML=='Toggle'){
        button1.innerHTML = 'Dynamic'
    }
    else{
        button1.innerHTML = 'Toggle'
    }

}
