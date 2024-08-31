const mci = require('./build/Release/mci')

const driveLetters = mci.getDriveLetters()
console.log(driveLetters)

for(let letter of driveLetters) {
  console.log(`${letter}: ${mci.isCdInserted(letter)}`)
}

if (!mci.openCd(driveLetters[0])) {
  console.log("Failed to open CD")
  process.exit(-1)
}

const formatMilliseconds = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedMilliseconds = Math.floor(milliseconds / 10).toString().padStart(2, '0');

  return `${minutes}:${formattedSeconds}.${formattedMilliseconds}`;
}


const trackCount = mci.getTrackCount()
console.log(trackCount)
let trackList = [];
for (let i = 0; i < trackCount; i++) {
  trackList = [...trackList, {track: i + 1, length: mci.getTrackLength(i + 1)}]
}

for(let track of trackList) {
  console.log(`Track ${track.track} - ${formatMilliseconds(track.length)}`)
}

process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdin.on('data', (input) => {
  const str = input.trim()
  if (str.length >= 2) {
    if (str === 'ct') {
      console.log(mci.getCurrentTrackNumber())
    } else if (str === 'cp') {
      console.log(`${formatMilliseconds(mci.getCurrentPosition())}`)
    } else if (str[0] === 'p') {
      mci.play(parseInt(str.slice(1)))
    }
  }
  if (str.length === 1) {
    switch (str[0]) {
      case 's':
        mci.stop()
        break
      case 'q':
        mci.stop()
        mci.closeCd()
        process.exit(0)
        break
      case 'p':
        mci.pause()
        break
      case 'r':
        mci.resume()
        break
      case 'l':
        console.log(formatMilliseconds(mci.getTrackLength(mci.getCurrentTrackNumber())))
        break
      case 'e':
        mci.ejectCd();
        mci.closeCd();
        break
    }
  }
})


