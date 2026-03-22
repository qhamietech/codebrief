import { useState } from 'react'
import { analyseRepo } from './codebrief'

const C = {
  bg: '#0a0a12',
  surface: '#0f172a',
  surface2: '#1e293b',
  border: '#1e3a5f',
  border2: '#2d5a8e',
  cyan: '#38bdf8',
  cyanDim: '#0ea5e9',
  cyanGlow: 'rgba(56,189,248,0.15)',
  cyanGlow2: 'rgba(56,189,248,0.08)',
  text: '#f1f5f9',
  textMid: '#94a3b8',
  textDim: '#475569',
  green: '#4ade80',
  greenBg: '#052e16',
  greenBorder: '#166534',
  red: '#f87171',
  redBg: '#1c0a0a',
  redBorder: '#7f1d1d',
}

function App() {
  const [repoUrl, setRepoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const SAMPLE_OUTPUT = `**WHAT THIS PROJECT DOES**
PawSOS is a mobile emergency response app that connects pet owners in crisis with nearby volunteer rescuers in real time. When a pet is injured or in danger, the owner sends an SOS and trained volunteers are notified instantly with live GPS location. It is built for communities where animals suffer because help arrives too late.

**THE MAIN FILES AND WHAT THEY DO**
- App.js: The entry point that controls which screen the user sees based on whether they are logged in or not.
- firebaseConfig.js: Connects the app to the Firebase database and authentication system.
- SOSScreen.js: The emergency button screen where a pet owner triggers an alert and shares their live location.
- ResponderDashboard.js: The screen volunteers see showing all active emergencies near them on a map.
- TriageScreen.js: Guides the pet owner through emergency first aid steps while help is on the way.
- AuthScreen.js: Handles login and registration for both pet owners and volunteers.

**HOW IT ALL CONNECTS**
When a user opens the app they either log in as a pet owner or register as a volunteer. If an emergency happens the owner taps SOS which writes to the Firebase database instantly. Every volunteer within range sees the alert appear on their dashboard in real time without refreshing. The volunteer accepts the case, their location is shared with the owner, and the triage screen activates to guide the owner through first aid until help arrives.

**WHAT YOU WOULD TELL A DEVELOPER**
- Firebase Firestore real-time listeners power the live sync between owner and responder — understanding onSnapshot is essential before touching this code.
- The app uses role-based access control with three tiers: pet owner, student volunteer, and qualified vet — each sees a completely different interface.
- Push notifications are handled through Expo Notifications and require careful permission handling on both Android and iOS before they work reliably.`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const explanation = await analyseRepo(repoUrl)
      setResult(explanation)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSample = () => {
    setResult(SAMPLE_OUTPUT)
    setError(null)
    setRepoUrl('https://github.com/qhamietech/PawSOS')
    setTimeout(() => window.scrollTo({ top: 500, behavior: 'smooth' }), 100)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    const text = `I just used Codebrief to understand a GitHub repo in plain English. This is wild. Try it: https://codebrief-ten.vercel.app`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
    setShared(true)
    setTimeout(() => setShared(false), 3000)
  }

  const formatResult = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={i} style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: C.cyan,
            margin: '1.5rem 0 0.5rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            {line.replace(/\*\*/g, '')}
          </h3>
        )
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={i} style={{
            display: 'flex',
            gap: '10px',
            margin: '0.4rem 0',
            color: C.textMid,
            lineHeight: '1.7',
            fontSize: '0.9rem'
          }}>
            <span style={{ color: C.cyanDim, flexShrink: 0, marginTop: '2px' }}>{'>'}</span>
            <span>{line.replace(/^[-•]\s/, '')}</span>
          </div>
        )
      }
      if (line.trim() === '') return <div key={i} style={{ height: '0.4rem' }} />
      return (
        <p key={i} style={{
          color: C.textMid,
          lineHeight: '1.8',
          margin: '0.3rem 0',
          fontSize: '0.9rem'
        }}>
          {line}
        </p>
      )
    })
  }

  const Footer = () => (
    <div style={{
      marginTop: '3rem',
      paddingTop: '1.5rem',
      borderTop: `1px solid ${C.surface2}`,
      textAlign: 'center',
      fontSize: '0.78rem',
      color: C.textDim
    }}>
      {'Built by '}
      <a href="https://github.com/qhamietech" target="_blank" rel="noreferrer" style={{ color: C.cyan, textDecoration: 'none' }}>Qhamisa Tobie</a>
      {' - a 22-year-old developer from the Eastern Cape, South Africa'}
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: C.bg,
      color: C.text,
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4rem 2rem 6rem'
    }}>
      <div style={{ width: '100%', maxWidth: '680px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: C.cyanGlow2,
            border: `1px solid ${C.border}`,
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '11px',
            color: C.cyan,
            marginBottom: '2rem',
            letterSpacing: '0.08em'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: C.cyan,
              display: 'inline-block',
              animation: 'blink 2s ease-in-out infinite'
            }}/>
            FREE BETA
          </div>

          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: '800',
            marginBottom: '0.75rem',
            letterSpacing: '-0.04em',
            lineHeight: '1.05',
            background: `linear-gradient(135deg, ${C.text} 0%, ${C.cyan} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your AI built it.
            <br />Now understand it.
          </h1>

          <p style={{
            fontSize: '1rem',
            color: C.textMid,
            lineHeight: '1.7',
            maxWidth: '460px',
            margin: '0 auto 1.75rem'
          }}>
            Paste any public GitHub repo and get a plain English breakdown of every file, every connection, and everything a developer needs to know.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            {['Works on any public repo', 'Powered by Gemini AI', 'Free to use'].map((t, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                color: C.textDim
              }}>
                <span style={{ color: C.cyan, fontSize: '10px' }}>{'✓'}</span>
                {t}
              </div>
            ))}
          </div>

          <button
            onClick={handleSample}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${C.border}`,
              borderRadius: '20px',
              color: C.textMid,
              padding: '6px 18px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = C.cyan
              e.currentTarget.style.color = C.cyan
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.border
              e.currentTarget.style.color = C.textMid
            }}
          >
            {'✦ See a sample output'}
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              style={{
                padding: '1rem 1.25rem',
                fontSize: '0.95rem',
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '10px',
                color: C.text,
                outline: 'none',
                width: '100%',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace'
              }}
              onFocus={e => e.target.style.borderColor = C.cyan}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !repoUrl.trim()}
            style={{
              padding: '1rem',
              fontSize: '0.95rem',
              fontWeight: '700',
              backgroundColor: loading || !repoUrl.trim() ? C.surface : C.cyan,
              color: loading || !repoUrl.trim() ? C.textDim : '#000000',
              border: 'none',
              borderRadius: '10px',
              cursor: loading || !repoUrl.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.02em'
            }}
          >
            {loading ? 'Reading your codebase...' : 'Explain This Repo →'}
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: C.textDim
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '1.5rem'
            }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: C.cyanDim,
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
                }}/>
              ))}
            </div>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.4rem', color: C.textMid }}>
              Reading your codebase...
            </div>
            <div style={{ fontSize: '0.8rem', color: C.textDim }}>
              This takes 10 to 30 seconds depending on repo size
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: C.redBg,
            border: `1px solid ${C.redBorder}`,
            borderRadius: '10px',
            padding: '1.25rem',
            color: C.red,
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '14px',
            padding: '1.75rem',
            marginTop: '1rem',
            boxShadow: `0 0 40px ${C.cyanGlow2}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: `1px solid ${C.surface2}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: C.cyan
                }}/>
                <span style={{
                  fontSize: '0.75rem',
                  color: C.cyan,
                  letterSpacing: '0.1em',
                  fontWeight: '600'
                }}>
                  CODEBRIEF ANALYSIS
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleShare}
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${C.border}`,
                    borderRadius: '6px',
                    color: shared ? C.cyan : C.textDim,
                    padding: '4px 12px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {shared ? 'Opening Twitter...' : 'Share →'}
                </button>
                <button
                  onClick={handleCopy}
                  style={{
                    backgroundColor: copied ? C.greenBg : 'transparent',
                    border: `1px solid ${copied ? C.greenBorder : C.border}`,
                    borderRadius: '6px',
                    color: copied ? C.green : C.textDim,
                    padding: '4px 12px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>
            {formatResult(result)}
          </div>
        )}

        <Footer />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        ::placeholder { color: #334155; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}

export default App