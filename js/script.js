import WaveSurfer from './wavesurfer.esm.js';
import lyrics from './lyrics.js';


const wavesurfer = WaveSurfer.create({
    container: '#waves-container',
    waveColor: '#020202',
    progressColor: '#89c9ff',
    url: 'assets/audios/Imane\'s pop song.mp3',
});

const CLASSES = {
    buttonPlaying: "gift-card__audio-container__play-button--playing",
    buttonPaused: "gift-card__audio-container__play-button--paused",
}

const giftCard = document.querySelector("[data-gift-card]");
const audioBackground = document.querySelector("[data-audio-background]");
const playButton = document.querySelector("[data-play-audio-btn]");
const boxBody = document.querySelector("[data-box-body]");
const currentLyric = document.querySelector("[data-current-lyric]");
const fullLyricsButton = document.querySelector("[data-full-lyrics-btn]");
const playlistButton = document.querySelector("[data-playlist-btn]");

const clickTheGiftElement = document.querySelector("[data-click-the-gift]");

const fullLyricsDialog = document.querySelector("[data-full-lyrics-dialog]");
const playlistDialog = document.querySelector("[data-playlist-dialog]");
const dialogCloseCrosses = document.querySelectorAll("[data-dialog-close-cross]");

const playedTimeElement = document.querySelector("[data-played-time]");
const maxPlayTimeElement = document.querySelector("[data-duration-time]");



window.addEventListener('click', e => {
    const audioEffectsArr = ["happy-birthday-to-you-made-by-me.mp3", "happy-birthday-voiced.mp3", "happy-birthday.mp3"];
    let i = 0;
    audioBackground.play();
    // playAllAudios();

    audioBackground.addEventListener("ended", e => {
        if (i === 0) {
            setTimer();
            boxBody.addEventListener('click', e => {
                clickTheGiftElement.remove();
                changeBackgroundAudioSrc('assets/audios/effects/trumpet.m4a');
                audioBackground.play();
                i = Infinity;
                Draw();
                e.currentTarget.classList.add('opened');
                setTimeout(() => {
                    boxBody.parentElement.remove();
                }, 5000);
                giftCard.classList.remove("d-none");
            }, { once: true });
        }

        if (i === Infinity) return
        if (i >= audioEffectsArr.length) {
            clickTheGiftElement.classList.remove('d-none');
            return;
        }
        changeBackgroundAudioSrc(`assets/audios/effects/${audioEffectsArr[i]}`);
        audioBackground.play();
        i++;
    })
}, { once: true })

async function playAllAudios() {
    const audios = Array.from(document.querySelectorAll("[data-audio-background]")).filter(p => p !== audioBackground);
    for (let audio of audios) {
        await wait(600);
        audio.play();
    }
}

playButton?.addEventListener('click', e => {

    if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
        playButton.classList.add(CLASSES.buttonPaused);
        playButton.classList.remove(CLASSES.buttonPlaying);
    }
    else {
        wavesurfer.play();
        playButton.classList.add(CLASSES.buttonPlaying);
        playButton.classList.remove(CLASSES.buttonPaused);
    }

});

function changePlayButtonUI() {
    if (!wavesurfer.isPlaying()) {
        playButton.classList.add(CLASSES.buttonPaused);
        playButton.classList.remove(CLASSES.buttonPlaying);
    }
    else {
        playButton.classList.add(CLASSES.buttonPlaying);
        playButton.classList.remove(CLASSES.buttonPaused);
    }
}


wavesurfer.on('timeupdate', time => {
    setTimer();
    const lyricIndex = syncLyrics(time);
    if (lyricIndex == null) return currentLyric.textContent = "";
    currentLyric.textContent = lyrics[lyricIndex].text;
});

function showCard() {

}

function wait(ms) {
    return new Promise(res => {
        setTimeout(() => res(), ms);
    })
}

function syncLyrics(time) {
    const times = [];
    for (let lyric of lyrics) {
        const score = time - lyric.time;
        if (score >= 0)
            times.push(score);

    }
    const closest = Math.min(...times);
    if (times.length === 0) return;
    return times.indexOf(closest);
}

function changeBackgroundAudioSrc(src) {
    audioBackground.firstElementChild.src = src;
    audioBackground.currentTime = 0;
    audioBackground.load();
}


fullLyricsButton.addEventListener('click', e => {
    e.preventDefault();
    fullLyricsDialog.showModal();
    stopAllAudios();
});
fullLyricsDialog.onclick = e => {
    if (e.target === fullLyricsDialog) fullLyricsDialog.close();
}

playlistDialog.onclick = e => {
    if (e.target === playlistDialog) playlistDialog.close();
}

playlistButton.addEventListener('click', e => {
    e.preventDefault();
    playlistDialog.showModal();
    stopAllAudios();
});

dialogCloseCrosses.forEach(ele => {
    ele.onclick = e => {
        e.currentTarget.parentElement.close();
        stopAllAudios();
    }
});

function stopAllAudios() {
    document.querySelectorAll('audio').forEach(el => el.pause());
    wavesurfer.pause();
    playButton.classList.add(CLASSES.buttonPaused);
    playButton.classList.remove(CLASSES.buttonPlaying);
}

function setTimer() {
    const currentTimeMinutes = Math.floor(wavesurfer.getCurrentTime() / 60);
    const currentTimeSeconds = Math.floor(wavesurfer.getCurrentTime() % 60).toString().padStart(2, '0');
    const durationTimeMinutes = Math.floor(wavesurfer.getDuration() / 60);
    const durationTimeSeconds = Math.floor(wavesurfer.getDuration() % 60).toString().padStart(2, '0');
    playedTimeElement.textContent = `${currentTimeMinutes}:${currentTimeSeconds}`;
    maxPlayTimeElement.textContent = `${durationTimeMinutes}:${durationTimeSeconds}`;
    changePlayButtonUI();
}
