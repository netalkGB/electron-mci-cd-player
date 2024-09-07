export const formatMilliseconds = (ms:number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = ms % 1000

  const formattedSeconds = seconds.toString().padStart(2, '0')
  const formattedMilliseconds = Math.floor(milliseconds / 10).toString().padStart(2, '0')

  return `${minutes}:${formattedSeconds}.${formattedMilliseconds}`
}
