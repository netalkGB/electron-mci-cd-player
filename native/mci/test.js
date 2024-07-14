const mci = require('./build/Release/mci');

console.log( mci.hello() );
console.log( mci.echo("ok") );

mci.openCd()
console.log(mci.getTrackCount())
mci.closeCd()