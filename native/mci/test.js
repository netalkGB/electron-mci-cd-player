const addon = require('./build/Release/addon');

console.log( addon.hello() );
console.log( addon.echo("ok") );

addon.openCd()
console.log(addon.getTrackCount())
addon.closeCd()