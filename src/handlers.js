const dataDiv = document.getElementById('data')
const time = document.getElementById('time')
const body = document.querySelector('html')
let startTime = null
let tracks = {}
let lastFire = -2

export const ondata = (track, data, timestamp) => {

    // track time elapsed
    if (!startTime) startTime = timestamp[0]

    // insert a new paragraph tag into the id='data' element for each track
    const label = track.contentHint
    if (!tracks[label]) {
        tracks[label] = document.createElement('p')
        dataDiv.appendChild(tracks[label])
    }

    // update the id='time' readout
    time.innerText = `${((timestamp[0] - startTime)/1000).toFixed(2)}s`

    // update the text content of this track's paragraph
    let sum = 0;
    for (let i = 0; i<12;i++){
        sum =+ data[i]
    }
    if (label==='TP10'){
        if (sum>300){
            console.log('RAISE')
            if ((lastFire+1) < (timestamp[0] - startTime)/1000){
                body.style.backgroundColor = "#" + Math.floor(Math.random()*16777215).toString(16)
            }
            lastFire = ((timestamp[0] - startTime)/1000)
        }
    }
    //console.log(JSON.stringify(data));
    tracks[label].innerHTML = `<h3>${track.contentHint}</h3>${sum}`    
}

export const ontrack = (track) =>  setTimeout(track.subscribe((data, timestamp) => ondata(track, data, timestamp)),5000)