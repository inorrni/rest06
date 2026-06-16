import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../hooks/useAuth'
import { signInWithKakao } from '../lib/auth'
import { sendChatMessage } from '../lib/chat'
import { IconChat, IconSend, IconClose, IconKakao } from './icons'

export default function ChatWidget() {
  const { t } = useLang()
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // 첫 오픈 + 로그인 시 인사말 1회
  useEffect(() => {
    if (open && user && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: t(
            '안녕하세요! 서울 자율주행버스 도우미예요. 노선·이용 방법·운행 시간 등 무엇이든 물어보세요.',
            "Hi! I'm the Seoul Autonomous Bus assistant. Ask me about routes, how to ride, hours, and more.",
          ),
        },
      ])
    }
  }, [open, user, messages.length, t])

  // 새 메시지/타이핑 시 스크롤 하단 고정
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, busy])

  // 패널 열릴 때 입력창 포커스
  useEffect(() => {
    if (open && user) inputRef.current?.focus()
  }, [open, user])

  async function handleSend(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    setError('')
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      // 시스템 메시지는 서버에서 붙이므로 user/assistant만 전송
      const history = next.filter((m) => m.role === 'user' || m.role === 'assistant')
      const { reply } = await sendChatMessage(history)
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (loading) return null

  return (
    <>
      <button
        className="chat-launcher"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('채팅 도우미 열기', 'Open chat assistant')}
        aria-expanded={open}
      >
        {open ? <IconClose /> : <IconChat />}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label={t('채팅 도우미', 'Chat assistant')}>
          <div className="chat-head">
            <div className="chat-title">
              <span className="chat-dot" />
              {t('자율주행버스 도우미', 'Bus assistant')}
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label={t('닫기', 'Close')}>
              <IconClose />
            </button>
          </div>

          {!user ? (
            <div className="chat-gate">
              <p>{t('채팅은 로그인 후 이용할 수 있어요.', 'Please log in to use the chat.')}</p>
              <button className="btn btn-kakao" onClick={() => signInWithKakao().catch((e) => setError(e.message))}>
                <IconKakao />
                {t('카카오 로그인', 'Kakao login')}
              </button>
              {error && <p className="chat-err">{error}</p>}
            </div>
          ) : (
            <>
              <div className="chat-list" ref={listRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`chat-msg ${m.role}`}>
                    <div className="chat-bubble">{m.content}</div>
                  </div>
                ))}
                {busy && (
                  <div className="chat-msg assistant">
                    <div className="chat-bubble chat-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                {error && <p className="chat-err">{error}</p>}
              </div>

              <form className="chat-input" onSubmit={handleSend}>
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={t('메시지를 입력하세요…', 'Type a message…')}
                  disabled={busy}
                />
                <button type="submit" className="chat-send" disabled={busy || !input.trim()} aria-label={t('보내기', 'Send')}>
                  <IconSend />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}
