const addon = require('./build/Release/addon');

console.log( addon.hello() );
console.log( addon.echo("ok") );
