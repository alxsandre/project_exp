import { audioCtx } from './audio.js'


//Oscilattors
export class Modulator {
  constructor(type, freq, gain) {
    this.osc = audioCtx.createOscillator();
    this.gain = audioCtx.createGain();
    this.gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 2
    );
    this.osc.type = type;
    this.osc.frequency.value = freq;
    this.gain.gain.value = gain;
    this.osc.connect(this.gain);
    this.osc.start();
  }
}

export class Carrier {
  constructor(type, freq) {
    this.osc = audioCtx.createOscillator();
    this.osc.type = type;
    this.osc.frequency.value = freq;
    this.osc.start();
    this.osc.stop(audioCtx.currentTime + 2);

    this.gain = audioCtx.createGain();
    this.gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 1
    );

    this.osc.connect(this.gain);
  }
}


/*
let pulseTime = 1;
let attackTime = 0.2;
let releaseTime = 0.3;

//Oscillator
export function playPulse(time) {
    let osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 880;
    //Gain
    const amp = audioCtx.createGain();
    //amp.gain.setValueAtTime(1, audioCtx.currentTime);
    amp.gain.linearRampToValueAtTime(1, time + attackTime);
    amp.gain.linearRampToValueAtTime(0, time + releaseTime);

    //Connection
    osc.connect(amp).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + pulseTime);
};


export function playCycle(time) {
    let osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 640;
    //Gain
    const amp = audioCtx.createGain();
    //amp.gain.setValueAtTime(1, audioCtx.currentTime);
    amp.gain.linearRampToValueAtTime(1, time + attackTime);
    amp.gain.linearRampToValueAtTime(0, time + releaseTime);

    //Connection
    osc.connect(amp).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + pulseTime);
}
*/