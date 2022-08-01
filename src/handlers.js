//THIS IS THE HANDLER FILE THAT IS RUN FROM THE CONTENT SCRIPT. IT CANNOT IMPORT MODULES
//SO ALL SCRIPTS MUST BE RUN AT THE SAME TIME
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
let toggled = 0
const ondata = (track, data, timestamp) => {
    
      // The body of this function will be executed as a content script inside the
      // current page
    
    // track time elapsed
    if (!startTime) startTime = timestamp[0]

    // insert a new paragraph tag into the id='data' element for each track
    const label = track.contentHint

    // update the text content of this track's paragraph


    //every five seconds (20 channel counts) the alpha beta ratio is calculated and distributed to
    //extension to adjust the brightness (if on dynamic mode)
    if (channelCount == 20){
        channelCount = 0

        //if you would like to configure the threshold to make it more responsive 
        //to you, change 0.35

        if (button1.innerHTML == 'Dynamic' && ABarray[0]/ABarray[1] >0.35){
            lightsOff.style.opacity = (ABarray[0]/ABarray[1])
        }
        else{
            lightsOff.style.opacity = 0;
        }
        ABarray = [0,0]
    }
    //listens for label and adds EEG data to label bins.
    //when bins have 256 points (1 second of data) the FFT is performed 
    //and frequencies sorted into the alpha/beta bins
    if (label==='AF7'){
        if (af7Array.length < 256){
            for (let i = 0; i<12; i++){
                af7Array.push(parseInt(data[i]));
            }
        }
        else{
            channelCount++
            let[a,b] = fourier(af7Array)
            ABarray[0] += a
            ABarray[1] += b
            af7Array = [0,0,0,0];
            
        }
        for (let i = 0; i<12;i++){
            if (data[i]>300 && button1.innerHTML =='Toggle' ){
                //if you would like to change how dark the screen gets, change opacity
                if ((lastFire+0.5) < (timestamp[0] - startTime)/1000){
                    if(toggled == 0){
                        lightsOff.style.opacity = 0.6
                        toggled = 1
                    }
                    else {
                        lightsOff.style.opacity = 0
                        toggled = 0
                    }
                }
                lastFire = ((timestamp[0] - startTime)/1000)
                break
            }
        }

    }
    //NOTE: forehead raise data is only collected from the AF7/AF8 channels
    //to increase accuracy
    if (label==='AF8'){
        if (af8Array.length < 256){
            for (let i = 0; i<12; i++){
                af8Array.push(parseInt(data[i]));
            }
        }
        else{
            let[a,b] = fourier(af8Array)
            ABarray[0] += a
            ABarray[1] += b
            channelCount++
            af8Array = [0,0,0,0];
        }
        for (let i = 0; i<12;i++){
                //if the toggle hasn't fired in the last 0.5 seconds, change the opacity of tab
            if (data[i]>300&& button1.innerHTML =='Toggle'){
                if ((lastFire+0.5) < (timestamp[0] - startTime)/1000){
                    if(toggled == 0){
                        lightsOff.style.opacity = 0.6
                        toggled = 1
                    }
                    else {
                        lightsOff.style.opacity = 0
                        toggled = 0
                    }
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
            let [a,b] = fourier(tp10Array)
            ABarray[0] += a
            ABarray[1] += b
            channelCount++
            tp10Array = [0,0,0,0];
        }
    }
}
const ontrack = (track) =>  track.subscribe((data, timestamp) => ondata(track, data, timestamp))