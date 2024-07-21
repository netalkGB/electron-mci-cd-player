const mci = require('./build/Release/mci');

mci.openCd()
console.log(mci.getTrackCount())
mci.closeCd()