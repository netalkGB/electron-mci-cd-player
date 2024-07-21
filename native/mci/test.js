const mci = require('./build/Release/mci');

let openCdRetval = mci.openCd()
console.log('openCdRetval', openCdRetval)
console.log(mci.getTrackCount())
let closeCdRetval = mci.closeCd()
console.log('closeCdRetval', closeCdRetval)