function preparePlaylists() {
    let cardsData = [
        {
            albumArt: "https://i.scdn.co/image/ab67706f000000023f838d01f5a9e3a5ff14638c",
            albumTitle: "Today's Top Hits",
            albumDesc: "Nicki Minaj is on top of the hottest 50!"
        },
        {
            albumArt: "https://i.scdn.co/image/ab67706f00000002ec94bf1083be30463d4b731d",
            albumTitle: "Chillhop",
            albumDesc: "Blissed out beats and head nodding grooves - Relax, study and vibe."
        },
        {
            albumArt: "https://i.scdn.co/image/ab67706f00000002bdeb1c317ac2dd10f2397e4c",
            albumTitle: "Jazz in the Background",
            albumDesc: "Soft instrumental Jazz for all your activities."
        },
        {
            albumArt: "https://i.scdn.co/image/ab67706f00000002d8fe1c03afc22a01d5109233",
            albumTitle: "Calming Acoustic",
            albumDesc: "Keep calm with instrumental acoustic tracks."
        },
        {
            albumArt: "https://i.scdn.co/image/ab67706f000000021c9bfca9b2fd2f546a30f751",
            albumTitle: "Big on the internet",
            albumDesc: "iykyk"
        },
        {
            albumArt: "https://i.scdn.co/image/ab67706f0000000254473de875fea0fd19d39037",
            albumTitle: "lofi beats",
            albumDesc: "chill beats, lofi vibes, new tracks every week..."
        },
        {
            albumArt: "https://i.scdn.co/image/ab67706f00000002ae6f51a8f53fbe34e627baac",
            albumTitle: "All Out 2000s",
            albumDesc: "The biggest songs of the 2000s. Cover: Lady Gaga."
        },
        {
            albumArt: "https://i.scdn.co/image/ab67706f00000002c1811d50fbd4df02ea3b06a3",
            albumTitle: "Peaceful Guitar",
            albumDesc: "Unwind to these calm classical guitar pieces."
        },
        {
            albumArt: "https://i.scdn.co/image/ab67706f00000002dec17246891b5b4eb97bdb0d",
            albumTitle: "Chillout Lounge",
            albumDesc: "Just lean back and enjoy relaxed beats."
        },
        {
            albumArt: "https://i.scdn.co/image/ab67706f00000002c33d2bfb97b1e0b94f701a96",
            albumTitle: "RapCaviar",
            albumDesc: "Music from Juice WRLD, Central Cee and JID."
        },
    ]
    
    let container = document.querySelector("#main .cards");
    
    function createCard(data) {
        // data is an object with properties - albumArt, albumTitle, albumDesc
    
        let html = `<div class="card-container flex-col even-col rounded pointer">
            <img src=${data.albumArt} alt="" class="rounded">
            <p class="white-text bold">${data.albumTitle}</p>
            <p>${data.albumDesc}</p>
        </div>`;
    
        container.innerHTML += html;
    }
    
    cardsData.forEach(data => {
        createCard(data);
    });  
}

const songs = new Array();

async function fetchSongs() {
    const host = "127.0.0.1";
    const port = 5500;
    const directory = "songs";
    try {
        let res = await fetch(`http://${host}:${port}/${directory}/`);
        var res2 = await res.text();    // Gives response as plain HTML-CSS-JS text
    } catch (error) {
        console.log(error);
    }

    // Converting text to HTML
    let div = document.createElement("div");
    div.innerHTML = res2;

    let entities = div.querySelectorAll("li a");
    entities.forEach(element => {
        (element.href.endsWith(".mp3"))?songs.push(element.href):false;
    });
}

async function prepareLib() {
    await fetchSongs();
    songs.forEach(song => {
        let entity = song.split("songs/")[1].replaceAll("%20"," ");
        let songName = entity.split("-")[0];
        let artist = entity.split("-")[1].replace(".mp3","");

        let html = `<li class="flex gap-3 pointer">
            <img src="./resources/music.svg" alt="" class="invert-2">
            <div>
                <p>${songName}</p>
                <p>-${artist}</p>
            </div>
        </li>`;

        document.querySelector("#library .songs ul").innerHTML += html;
    });
}

const currentSong = new Audio();
const songQueue = new Array();
let prev = curr = next = -1;    // initially

function playFromLib() {
    let songList = document.querySelectorAll("#library .songs li div");
    songList.forEach(element => {
        element.addEventListener("click",()=>{
            let songName = element.getElementsByTagName("p")[0].innerText;
            let artistName = element.getElementsByTagName("p")[1].innerText;
            let url = `../songs/${songName}${artistName}.mp3`;
            songQueue.push(url);
            prev = curr;
            curr = songQueue.length - 1;
            currentSong.src = songQueue[curr];
            currentSong.play();
            document.querySelector("#play-pause").src = "./resources/pause.svg";
            
            let entity = currentSong.src.split("songs/")[1].replaceAll("%20"," ");
            let sName = entity.split("-")[0];
            let artist = entity.split("-")[1].replace(".mp3","");
            document.querySelector("#player .song-name").innerHTML = `${sName}<br>${artist}`;
        })
    });
}

let playbackControl = document.querySelector("#play-pause");
function playPauseHelper() {
    if (curr>=0 && currentSong.paused){
        currentSong.play();
        playbackControl.src = "./resources/pause.svg";
    }
    else{
        if (curr<0) alert("First play a song from library");
        currentSong.pause();
        playbackControl.src = "./resources/play.svg";
    }
}

function playPause() {
    playbackControl.addEventListener("click",playPauseHelper);
}

function prevSongHelper() {
    if (prev >= 0 && prev < songQueue.length){
        next = curr;
        curr = prev;
        prev--;
        currentSong.src = songQueue[curr];
        currentSong.play();
        
        let entity = currentSong.src.split("songs/")[1].replaceAll("%20"," ");
        let sName = entity.split("-")[0];
        let artist = entity.split("-")[1].replace(".mp3","");
        document.querySelector("#player .song-name").innerHTML = `${sName}<br><br>${artist}`;
    }
    else{
        currentSong.src = songQueue[curr];
        currentSong.play();
    }
    document.querySelector("#play-pause").src = "./resources/pause.svg";
}

function previousSong() {
    let button = document.querySelector("#previous");
    button.addEventListener("click",prevSongHelper);
}

function nextSongHelper() {
    if (next >= 0 && next < songQueue.length){
        prev = curr;
        curr = next;
        next++;
        currentSong.src = songQueue[curr];
        currentSong.play();
        
        let entity = currentSong.src.split("songs/")[1].replaceAll("%20"," ");
        let sName = entity.split("-")[0];
        let artist = entity.split("-")[1].replace(".mp3","");
        document.querySelector("#player .song-name").innerHTML = `${sName}<br><br>${artist}`;
        document.querySelector("#play-pause").src = "./resources/pause.svg";
    }
    else alert("No more songs in queue");
}

function nextSong() {
    let button = document.querySelector("#next");
    button.addEventListener("click",nextSongHelper);
}

function playBack() {
    playPause();
    previousSong();
    nextSong();
}

function formatTime(seconds) {
    seconds = Math.max(0, seconds);
    let minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    let formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
  
    return formattedMinutes + ':' + formattedSeconds;
}
function moveThumb() {
    currentSong.addEventListener("timeupdate",e => {
        let time = formatTime(Math.floor(currentSong.currentTime));
        let duration = formatTime(Math.floor(currentSong.duration));
        document.querySelector("#player .timestamp").innerHTML = `${time} | ${duration}`;

        document.querySelector("#player .thumb").style.left = `${(currentSong.currentTime/currentSong.duration)*100}%`;

        if (currentSong.currentTime == currentSong.duration){
            nextSongHelper();
        }
    })
}

function syncSeekbar() {
    document.querySelector("#player .seekbar").addEventListener("click",e => {
        let offset = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        
        document.querySelector("#player .thumb").style.left = `${offset}%`;
        currentSong.currentTime = (offset/100)*currentSong.duration;
    })
}

function syncVolumeRocker() {
    document.querySelector("#volume-rocker").addEventListener("change",e => {
        currentSong.volume = e.target.value/100;
    })
}

function playPauseUsingKeyboard() {
    window.addEventListener("keydown",e => {
        if (e.key === 'k')
            playPauseHelper();
    })
}

async function main() {
    preparePlaylists();
    await prepareLib();
    playFromLib();
    playBack();
    moveThumb();
    syncSeekbar();
    syncVolumeRocker();
    playPauseUsingKeyboard();
}

main();