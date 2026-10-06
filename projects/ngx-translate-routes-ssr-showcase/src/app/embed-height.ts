/** Message the embedded showcase posts to the docs page so the iframe can fit its content. */
export const HEIGHT_MESSAGE_TYPE = 'ngx-translate-routes-height'

/**
 * Reports the document height to the parent window every time it changes.
 * Returns a function that stops reporting.
 */
export function reportHeightToParent(doc: Document): () => void {
  const win = doc.defaultView
  if (!win || win.parent === win || typeof win.ResizeObserver === 'undefined') {
    return () => undefined
  }

  const observer = new win.ResizeObserver(() => {
    win.parent.postMessage(
      {
        type: HEIGHT_MESSAGE_TYPE,
        height: Math.ceil(doc.body.getBoundingClientRect().height),
      },
      doc.location.origin,
    )
  })
  observer.observe(doc.body)
  return () => observer.disconnect()
}
