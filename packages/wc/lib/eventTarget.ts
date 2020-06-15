export async function ensureEventTarget() {
  return new Promise(resolve => {
    try {
      // eslint-disable-next-line no-new
      new EventTarget()
    } catch {
      const script = document.createElement('script')
      script.setAttribute('src', 'https://unpkg.com/@ungap/event-target@0.1.0/min.js')
      script.onload = resolve
      document.head.appendChild(script)
      return
    }
    resolve()
  })
}
