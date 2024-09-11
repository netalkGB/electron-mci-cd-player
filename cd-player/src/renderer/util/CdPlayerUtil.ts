export const formatMilliseconds = (ms: number) => {
  const roundedTotalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(roundedTotalSeconds / 60)
  const seconds = roundedTotalSeconds % 60

  const formattedSeconds = seconds.toString().padStart(2, '0')

  return `${minutes}:${formattedSeconds}`
}

export const roundToThousand = (num: number) => (Math.round(num / 1000) * 1000)
