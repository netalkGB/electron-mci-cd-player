const {Worker} = require('worker_threads');
let worker

const removeListener = (listener) => {
  worker.removeListener('message', listener);
}

module.exports.openCd = () => {
  worker = new Worker('./src/main/cdpWorker.js')
  worker.setMaxListeners(1024);

  return new Promise((resolve, reject) => {
    const listener = ({resultType, error, result}) => {
      if (resultType !== 'openCd') {
        return
      }
      removeListener(listener)
      resolve(result)
    }
    worker.on('message', listener);
    worker.postMessage({action: 'openCd'});
  })
}

module.exports.getTrackCount = () => (
  new Promise((resolve, reject) => {
    const listener = ({resultType, error, result}) => {
      if (resultType !== 'getTrackCount') {
        return
      }
      removeListener(listener)
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    }
    worker.on('message', listener);
    worker.postMessage({action: 'getTrackCount'});
  })
)

module.exports.closeCd = () => (
  new Promise((resolve, reject) => {
    const listener = ({resultType, error, result}) => {
      if (resultType !== 'closeCd') {
        return
      }
      removeListener(listener)
      resolve(result)
      worker.terminate()
    }
    worker.on('message', listener);
    worker.postMessage({action: 'closeCd'});
  })
)

module.exports.play = (trackNum) => (
  new Promise((resolve, reject) => {
    const listener = ({resultType, error, result}) => {
      if (resultType !== 'play') {
        return
      }
      removeListener(listener)
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    }
    worker.on('message', listener);
    worker.postMessage({action: 'play', args: [trackNum]});
  })
)

module.exports.stop = () => (
  new Promise((resolve, reject) => {
    const listener = ({resultType, error, result}) => {
      if (resultType !== 'stop') {
        return
      }
      removeListener(listener)
      resolve(result)
    }
    worker.on('message', listener);
    worker.postMessage({action: 'stop'});
  })
)

module.exports.pause = () => (
  new Promise((resolve, reject) => {
    const listener = ({resultType, error, result}) => {
      if (resultType !== 'pause') {
        return
      }
      removeListener(listener)
      resolve(result)
    }
    worker.on('message', listener);
    worker.postMessage({action: 'pause'});
  })
)

module.exports.resume = () => (
  new Promise((resolve, reject) => {
    const listener = ({resultType, error, result}) => {
      if (resultType !== 'resume') {
        return
      }
      removeListener(listener)
      resolve(result)
    }
    worker.on('message', listener);
    worker.postMessage({action: 'resume'});
  })
)

module.exports.getCurrentTrackNumber = () => (
  new Promise((resolve, reject) => {
    const listener = ({resultType, error, result}) => {
      if (resultType !== 'getCurrentTrackNumber') {
        return
      }
      removeListener(listener)
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    }
    worker.on('message', listener);
    worker.postMessage({action: 'getCurrentTrackNumber'});
  })
)

module.exports.getTrackLength = (track) => (
  new Promise((resolve, reject) => {
    const listener = ({resultType, error, result}) => {
      if (resultType !== 'getTrackLength') {
        return
      }
      removeListener(listener)
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    }
    worker.on('message', listener);
    worker.postMessage({action: 'getTrackLength', args: [track]});
  })
)

module.exports.getCurrentPosition = () => (
  new Promise((resolve, reject) => {
    const listener = ({resultType, error, result}) => {
      if (resultType !== 'getCurrentPosition') {
        return
      }
      removeListener(listener)
      if (error !== null) {
        reject(error)
        return
      }
      resolve(result)
    }
    worker.once('message', listener);
    worker.postMessage({action: 'getCurrentPosition'});
  })
)

module.exports.worker = worker