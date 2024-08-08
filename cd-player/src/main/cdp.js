const {Worker} = require('worker_threads');
let worker

module.exports.openCd = () => {
    worker = new Worker('./src/main/cdpWorker.js');worker.setMaxListeners(1024);
    return new Promise((resolve, reject) => {
      worker.once('message', ({resultType, error, result}) => {
        if (resultType !== 'openCd') {
          return
        }
        resolve(result)
      });
      worker.postMessage({action: 'openCd'});
    })
}

module.exports.getTrackCount = () => (
  new Promise((resolve, reject) => {
    worker.once('message', ({resultType, error, result}) => {
      if (resultType !== 'getTrackCount') {
        return
      }
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    });
    worker.postMessage({action: 'getTrackCount'});
  })
)

module.exports.closeCd = () => (
  new Promise((resolve, reject) => {
    worker.once('message', ({resultType, error, result}) => {
      if (resultType !== 'closeCd') {
        return
      }
      resolve(result)
      worker.terminate()
    });
    worker.postMessage({action: 'closeCd'});
  })
)

module.exports.play = (trackNum) => (
  new Promise((resolve, reject) => {
    worker.once('message', ({resultType, error, result}) => {
      if (resultType !== 'play') {
        return
      }
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    });
    worker.postMessage({action: 'play', args: [trackNum]});
  })
)

module.exports.stop = () => (
  new Promise((resolve, reject) => {
    worker.once('message', ({resultType, error, result}) => {
      if (resultType !== 'stop') {
        return
      }
      resolve(result)
    });
    worker.postMessage({action: 'stop'});
  })
)

module.exports.pause = () => (
  new Promise((resolve, reject) => {
    worker.once('message', ({resultType, error, result}) => {
      if (resultType !== 'pause') {
        return
      }
      resolve(result)
    });
    worker.postMessage({action: 'pause'});
  })
)

module.exports.resume = () => (
  new Promise((resolve, reject) => {
    worker.once('message', ({resultType, error, result}) => {
      if (resultType !== 'resume') {
        return
      }
      resolve(result)
    });
    worker.postMessage({action: 'resume'});
  })
)

module.exports.getCurrentTrackNumber = () => (
  new Promise((resolve, reject) => {
    worker.once('message', ({resultType, error, result}) => {
      if (resultType !== 'getCurrentTrackNumber') {
        return
      }
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    });
    worker.postMessage({action: 'getCurrentTrackNumber'});
  })
)

module.exports.getTrackLength = (track) => (
  new Promise((resolve, reject) => {
    worker.once('message', ({resultType, error, result}) => {
      if (resultType !== 'getTrackLength') {
        return
      }
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    });
    worker.postMessage({action: 'getTrackLength', args: [track]});
  })
)

module.exports.getCurrentPosition = () => (
  new Promise((resolve, reject) => {
    worker.once('message', ({resultType, error, result}) => {
      if (resultType !== 'getCurrentPosition') {
        return
      }
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    });
    worker.postMessage({action: 'getCurrentPosition'});
  })
)

module.exports.worker = worker