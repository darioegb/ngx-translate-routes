import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Translate from '@docusaurus/Translate'
import { useColorMode } from '@docusaurus/theme-common'
import styles from './styles.module.css'

const REPO_URL =
  'https://github.com/darioegb/ngx-translate-routes/tree/main/projects/ngx-translate-routes-ssr-showcase'

/** Must match THEME_MESSAGE_TYPE in the showcase's theme.service.ts. */
const THEME_MESSAGE_TYPE = 'ngx-translate-routes-theme'
/** Must match HEIGHT_MESSAGE_TYPE in the showcase's embed-height.ts. */
const HEIGHT_MESSAGE_TYPE = 'ngx-translate-routes-height'

interface LiveDemoProps {
  /** Path of the demo app, relative to the site base URL. */
  path?: string
  height?: number
}

export default function LiveDemo({
  path = 'demo/',
  height = 900,
}: Readonly<LiveDemoProps>): ReactNode {
  const src = useBaseUrl(path)
  const { colorMode } = useColorMode()
  const frame = useRef<HTMLIFrameElement>(null)
  const [frameHeight, setFrameHeight] = useState(height)

  // Keep the embedded showcase in sync with the docs color mode, without reloading it.
  const syncTheme = useCallback(() => {
    frame.current?.contentWindow?.postMessage(
      { type: THEME_MESSAGE_TYPE, theme: colorMode },
      globalThis.location.origin,
    )
  }, [colorMode])

  useEffect(syncTheme, [syncTheme])

  // The showcase reports its content height so the iframe never shows an inner scrollbar.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.source === frame.current?.contentWindow &&
        event.origin === globalThis.location.origin &&
        event.data?.type === HEIGHT_MESSAGE_TYPE &&
        Number.isFinite(event.data.height)
      ) {
        setFrameHeight(event.data.height)
      }
    }
    globalThis.addEventListener('message', onMessage)
    return () => globalThis.removeEventListener('message', onMessage)
  }, [])

  return (
    <div className={styles.wrapper}>
      <iframe
        ref={frame}
        className={styles.frame}
        src={`${src}?embed`}
        title="ngx-translate-routes live demo"
        height={frameHeight}
        loading="lazy"
        onLoad={syncTheme}
      />
      <div className={styles.actions}>
        <a href={src} target="_blank" rel="noreferrer">
          <Translate id="liveDemo.fullscreen">Open in a new tab</Translate>
        </a>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          <Translate id="liveDemo.source">View source on GitHub</Translate>
        </a>
      </div>
    </div>
  )
}
