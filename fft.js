//import {createRequire} from 'node:module'
//const require = createRequire(import.meta.url);
import fft from 'fft-js'
import { util as fftUtil} from 'fft-js';
//var fft = require('fft-js').fft,
  //  fftUtil = require('fft-js').util



function fourier(signal) {
    var phasors= fft(signal);

    var frequencies = fftUtil.fftFreq(phasors, 256), // Sample rate and coef is just used for length, and frequency step
        magnitudes = fftUtil.fftMag(phasors); 
    
    var both = frequencies.map(function (f, ix) {
        return {frequency: f, magnitude: magnitudes[ix]};
    });
    let alphaBin = 0;
    let betaBin = 0;
    for (let i = 7; i<14; i++){
        alphaBin += both[i].magnitude
    }
    for (let i = 13; i<33; i++){
        betaBin += both[i].magnitude
    }
    return [alphaBin,betaBin]
}
export default fourier