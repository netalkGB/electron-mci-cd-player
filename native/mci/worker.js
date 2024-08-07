const {parentPort} = require('worker_threads');
const mci = require('./build/Release/mci')
parentPort.on('message', async ({action, args}) => {
  switch (action) {
    case 'openCd':
      if (!mci.openCd()) {
        parentPort.postMessage({resultType: 'openCd', result: false});
        return;
      }
      parentPort.postMessage({resultType: 'openCd', result: true});
      break;
    case 'getTrackCount':
      const trackCount = mci.getTrackCount();
      parentPort.postMessage({resultType: 'getTrackCount', result: trackCount});
      break;
    case 'closeCd':
      mci.closeCd();
      parentPort.postMessage({resultType: 'closeCd', result: true});
      break;
    default:
      parentPort.postMessage({resultType: 'unknown'});
      break;
  }
});
