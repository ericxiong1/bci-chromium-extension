import fourier from '../compile.js'
const dataDiv = document.getElementById('data')
const time = document.getElementById('time')
const body = document.querySelector('html')
let startTime = null
let tracks = {}
let lastFire = -2
let tp9Array = [0,0,0,0];
let tp10Array = [0,0,0,0];
let af7Array = [0,0,0,0];
let af8Array = [0,0,0,0];
let ABarray = [0,0]
let channelCount = 0;

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
    if (channelCount == 40){
        channelCount = 0
        console.log(ABarray[1]/ABarray[0])
        ABarray = [0,0]
    }
    if (label==='AF7'){
        //for (let i=0;i<12;i++){
          //  sum += data[i]
        //}
        if (af7Array.length < 256){
            for (let i = 0; i<12; i++){
                af7Array.push(parseInt(data[i]));
            }
        }
        else{
            //console.log(af7Array)
            console.log('AF7')
            //[ABarray[0],ABarray[1]] =+ fourier(af7Array)
            channelCount++
            let[a,b] = fourier(af7Array)
            ABarray[0] += a
            ABarray[1] += b
            af7Array = [0,0,0,0];

        }
        for (let i = 0; i<12;i++){
            if (data[i]>300){
                //console.log('RAISE')

                if ((lastFire+0.5) < (timestamp[0] - startTime)/1000){
                    body.style.backgroundColor = "#" + Math.floor(Math.random()*16777215).toString(16)
                }
                lastFire = ((timestamp[0] - startTime)/1000)
                break
            }
        }

    }
    if (label==='AF8'){
        if (af8Array.length < 256){
            for (let i = 0; i<12; i++){
                af8Array.push(parseInt(data[i]));
            }
        }
        else{
            //console.log(af8Array)
            console.log('AF8')
            let[a,b] = fourier(af8Array)
            ABarray[0] += a
            ABarray[1] += b
            //[ABarray[0],ABarray[1]] =+ fourier(af8Array)
            channelCount++
            af8Array = [0,0,0,0];
        }
        for (let i = 0; i<12;i++){
            if (data[i]>300){
                //console.log('RAISE')
    
                if ((lastFire+0.5) < (timestamp[0] - startTime)/1000){
                    body.style.backgroundColor = "#" + Math.floor(Math.random()*16777215).toString(16)
                }
                lastFire = ((timestamp[0] - startTime)/1000)
            }
        }
    }
    if (label==='TP9'){
        if (tp9Array.length < 256){
            for (let i = 0; i<12; i++){
                tp9Array.push(parseInt(data[i]));
            }
        }
        else{
            //console.log(tp9Array)
            console.log('TP9')
            //[ABarray[0],ABarray[1]] =+ fourier(tp9Array)
            channelCount++
            let[a,b] = fourier(tp9Array)
            ABarray[0] += a
            ABarray[1] += b
            tp9Array = [0,0,0,0];
        }
    }
    if (label==='TP10'){
        if (tp10Array.length < 256){
            for (let i = 0; i<12; i++){
                tp10Array.push(parseInt(data[i]));
            }
        }
        else{
            //console.log(tp10Array)
            console.log('TP10')
            let [a,b] = fourier(tp10Array)
            ABarray[0] += a
            ABarray[1] += b
            channelCount++
            tp10Array = [0,0,0,0];
        }
    }
    //console.log(JSON.stringify(data));
    tracks[label].innerHTML = `<h3>${track.contentHint}</h3>${data}`    
}

export const ontrack = (track) =>  track.subscribe((data, timestamp) => ondata(track, data, timestamp))