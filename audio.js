import { Circle } from './draw.js';
import { Modulator, Carrier } from './oscillator.js'

// Audio Context
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

var volume = audioCtx.createGain();
volume.gain.value = 0.4;
volume.connect(audioCtx.destination);

export { audioCtx };


// Canvas context and canvas size
const firstCanvas = document.getElementById('canvas__first');
let ctxFirstCanvas = firstCanvas.getContext('2d');
firstCanvas.width = document.body.clientWidth - 160;


//Scheduler
let tempo = 60.0;

const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

let currentNote = 0;
let nextNoteTime = 0.0; // when the next note is due.

function nextNote() {
    const secondsPerBeat = 60.0 / tempo;

    nextNoteTime += secondsPerBeat; // Add beat length to last beat time
    // Advance the beat number, wrap to zero
    currentNote++;
    if (currentNote === 4) {
            currentNote = 0;
    }
}

const notesInQueue = [];
let circles = [];


function scheduleNote(beatNumber, time) {

    // push the note on the queue, even if we're not playing.
    notesInQueue.push({ note: beatNumber, time: time });
    // Take the note playing (last note in the array)
    let lastNote = notesInQueue[notesInQueue.length - 1];

   // console.table(circles);

    if (lastNote.note === 0 || lastNote.note === 3) {

        var modulator1 = new Modulator("sine", 110, 300);
        var carrier1 = new Carrier("sine", 440);
        modulator1.gain.connect(carrier1.osc.frequency);
        carrier1.gain.connect(volume);
        circles.forEach(circle => circle.changeVel(0.5*(Math.random() - 0.5), 0.5*(Math.random() - 0.5)));
        circles.push(new Circle(document.getElementById('canvas__first').width / 2, document.getElementById('canvas__first').height / 2, 15, "rgb(15, 152, 10)"));
    
        
        
    }

    if (lastNote.note === 1 || lastNote.note === 2) {

        var modulator2 = new Modulator("sine", 110, 10);
        var carrier2 = new Carrier("sine", 220);
        modulator2.gain.connect(carrier2.osc.frequency);
        carrier2.gain.connect(volume);
        circles.forEach(circle => circle.changeVel(0.5*(Math.random() - 0.5), 0.5*(Math.random() - 0.5)));
        circles.push(new Circle(document.getElementById('canvas__first').width / 2, document.getElementById('canvas__first').height / 2, 15, "rgb(155, 102, 102)"));
       

    }

}

let drawAnimate;
function draw() {
    ctxFirstCanvas.clearRect(0, 0, document.getElementById('canvas__first').width, document.getElementById('canvas__first').height);
    circles.forEach(circle => circle.draw(ctxFirstCanvas));
    drawAnimate = requestAnimationFrame(draw);
}




 
let timerID;
function scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime ) {
        scheduleNote(currentNote, nextNoteTime);
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
}

//Toggle with scroll and two lines
const playScroll = () => {
    if (document.querySelector('.line__move').offsetTop + document.querySelector('.line__move').clientHeight === document.querySelector('.block').clientHeight) {
        window.removeEventListener('scroll', playScroll)

        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        currentNote = 0;
        nextNoteTime = audioCtx.currentTime;
        drawAnimate = requestAnimationFrame(draw);
        scheduler(); // kick off scheduling
        
        window.addEventListener('scroll', pauseScroll);
    }
}

const pauseScroll = () => {
    if (document.querySelector('.line__move').offsetTop + document.querySelector('.line__move').clientHeight < document.querySelector('.block').clientHeight) {
        window.removeEventListener('scroll', pauseScroll)

        window.clearTimeout(timerID);
        cancelAnimationFrame(drawAnimate);
        window.addEventListener('scroll', playScroll);
    }
}

window.addEventListener('scroll', playScroll);
