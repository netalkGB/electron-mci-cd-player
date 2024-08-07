const {Worker} = require('worker_threads');
const worker = new Worker('./worker.js');
worker.on('message', msg => {
  switch (msg.resultType) {
    case 'openCd':
      if (msg.result) {
        worker.postMessage({action: 'getTrackCount'});
      }
      break;
    case 'getTrackCount':
      console.log('Track count:', msg.result);
      worker.postMessage({action: 'closeCd'});
      break;
    case 'closeCd':
      process.exit(0);
      break;
  }
});

worker.postMessage({action: 'openCd'});
