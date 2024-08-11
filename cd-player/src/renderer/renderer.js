const formatMilliseconds = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
  
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = Math.floor(milliseconds / 10).toString().padStart(2, '0');
  
    return `${minutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

const state = {
    playing: false,
    pause: false
}

document.addEventListener('DOMContentLoaded', async () => {
    await window.mci.openCd()

    document.querySelector('#play').addEventListener('click', async () => {
        try {
            await window.mci.play(1)
            state.playing = true
            pause = false
        } catch(e) {
            console.error(e)
        }
    })

    document.querySelector('#stop').addEventListener('click', async () => {
        try {
            await window.mci.stop()
            state.playing = false
            pause = false
        } catch(e) {
            console.error(e)
        }
    })

    document.querySelector('#pause').addEventListener('click', async () => {
        try {
            if (state.pause) {
                await window.mci.resume()
                state.pause = false
            } else {
                await window.mci.pause()
                state.pause = true
            }
        } catch(e) {
            console.error(e)
        }
    })

    document.querySelector('#next').addEventListener('click', async () => {
        try {
            const currentTrack = await window.mci.getCurrentTrackNumber()
            if (currentTrack >= await window.mci.getTrackCount()) {
                return
            }
            await window.mci.play(currentTrack + 1)
            state.playing = true
            pause = false
        } catch(e) {
            console.error(e)
        }
    })

    document.querySelector('#previous').addEventListener('click', async () => {
        try {
            const currentTrack = await window.mci.getCurrentTrackNumber()
            if (currentTrack <= 1) {
                return
            }
            await window.mci.play(currentTrack - 1)
            state.playing = true
            pause = false
        } catch(e) {
            console.error(e)
        }
    })

    setInterval(async () => {
        try {
            const position = await window.mci.getCurrentPosition()
            if (state.playing) {
                document.querySelector('#position').innerText = formatMilliseconds(position)
                document.querySelector('#duration').innerText = formatMilliseconds(await window.mci.getTrackLength(await window.mci.getCurrentTrackNumber()))
            }
            document.querySelector('#track').innerText = await window.mci.getCurrentTrackNumber()
            document.querySelector('#total-track').innerText = await window.mci.getTrackCount()
        } catch(e) {
            console.error(e)
        }
    }, 16)

});