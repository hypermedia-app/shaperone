export const nextid: () => string = (() => {
  let current = 0
  return () => {
    current += 1
    return `object ${current}`
  }
})()
