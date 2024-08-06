const mci = require('./build/Release/mci')

if (!mci.openCd()) {
  console.log("Failed to open CD")
  process.exit(-1)
}
const trackCount = mci.getTrackCount()
console.log(trackCount)
mci.closeCd()
process.exit(0)
