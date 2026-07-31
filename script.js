// Woordenteller
const textarea = document.getElementById("lyrics");
const words = document.getElementById("words");

textarea.addEventListener("input", () => {

    if (textarea.value.trim() === "") {
        words.innerText = 0;
    } else {
        words.innerText = textarea.value.trim().split(/\s+/).length;
    }

});


// Inspiratiewoorden
const inspiratie = [
    "fire",
    "queen",
    "shine",
    "dream",
    "dance",
    "power",
    "light",
    "night",
    "flow",
    "energy",
    "star",
    "stage"
];


function randomWord(){

    document.getElementById("word").innerText =
    inspiratie[Math.floor(Math.random()*inspiratie.length)];

}


// Rap score
function checkRap(){

    let text = textarea.value.trim();

    if(text === ""){
        document.getElementById("score").innerText =
        "Schrijf eerst een rap.";
        return;
    }


    let score = 0;

    let aantalWoorden = text.split(/\s+/).length;
    let regels = text.split("\n").length;


    if(aantalWoorden > 30)
        score += 30;

    if(aantalWoorden > 60)
        score += 20;


    score += Math.min(regels * 5, 30);


    let rijm =
    (text.match(/[aeiou]{2,}/gi) || []).length;


    score += Math.min(rijm * 2,20);


    document.getElementById("score").innerText =
    "⭐ Score: " + score + "/100";

}


// Beat
let audioContext;
let playing = false;


document.getElementById("beatBtn").onclick = () => {

    if(!audioContext){
        audioContext =
        new AudioContext();
    }


    playing = !playing;


    if(playing){

        beat();
        beatBtn.innerText = "Stop Beat";

    }else{

        beatBtn.innerText = "Start Beat";

    }

};



function beat(){

    if(!playing) return;


    let oscillator =
    audioContext.createOscillator();

    let gain =
    audioContext.createGain();


    oscillator.frequency.value = 120;
    gain.gain.value = 0.08;


    oscillator.connect(gain);
    gain.connect(audioContext.destination);


    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);


    setTimeout(beat,500);

}



// Stemopname
let mediaRecorder;
let chunks = [];


const recordBtn =
document.getElementById("recordBtn");

const stopBtn =
document.getElementById("stopBtn");

const audio =
document.getElementById("audio");

const download =
document.getElementById("download");



recordBtn.onclick = async () => {


    const stream =
    await navigator.mediaDevices.getUserMedia({
        audio:true
    });


    mediaRecorder =
    new MediaRecorder(stream);


    chunks=[];


    mediaRecorder.ondataavailable =
    e => chunks.push(e.data);



    mediaRecorder.onstop = () => {


        const blob =
        new Blob(chunks,{
            type:"audio/webm"
        });


        const url =
        URL.createObjectURL(blob);


        audio.src=url;

        download.href=url;

        download.style.display="inline";

    };


    mediaRecorder.start();


    recordBtn.disabled=true;

    stopBtn.disabled=false;

};



stopBtn.onclick = () => {

    mediaRecorder.stop();

    recordBtn.disabled=false;

    stopBtn.disabled=true;

};



// Karaoke
let karaokeTimer;
let currentLine=0;
let lines=[];
let bpm=90;



function updateBPM(){

    bpm =
    Number(document.getElementById("bpm").value);


    document.getElementById("bpmValue")
    .innerText=bpm;

}



function startKaraoke(){


    clearInterval(karaokeTimer);


    lines =
    document.getElementById("karaokeLyrics")
    .value
    .split("\n")
    .filter(line=>line.trim()!=="");


    currentLine=0;


    showLine();



    karaokeTimer=setInterval(()=>{


        currentLine++;


        if(currentLine>=lines.length){

            clearInterval(karaokeTimer);

            document.getElementById("karaoke")
            .innerHTML="🎉 Klaar!";

            return;

        }


        showLine();


    },(60/bpm)*4000);


}



function showLine(){


    let html="";


    lines.forEach((line,index)=>{


        if(index===currentLine){

            html +=
            "<span style='color:#ff4fa2;font-size:30px;'>▶ "
            + line +
            "</span><br>";

        }else{

            html +=
            "<span style='opacity:0.4;'>"
            + line +
            "</span><br>";

        }


    });


    document.getElementById("karaoke")
    .innerHTML=html;


}



function pauseKaraoke(){

    clearInterval(karaokeTimer);

}