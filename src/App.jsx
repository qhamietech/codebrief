import { useState } from 'react'
import { analyseRepo } from './codebrief'

const C = {
  bg: 'transparent',
  surface: 'rgba(255,255,255,0.85)',
  surface2: 'rgba(255,255,255,0.6)',
  border: 'rgba(0,0,0,0.12)',
  border2: 'rgba(0,0,0,0.2)',
  accent: '#18181b',
  accentHover: '#3f3f46',
  text: '#09090b',
  textMid: '#3f3f46',
  textDim: '#71717a',
  green: '#15803d',
  greenBg: 'rgba(21,128,61,0.1)',
  greenBorder: 'rgba(21,128,61,0.3)',
  red: '#b91c1c',
  redBg: 'rgba(185,28,28,0.08)',
  redBorder: 'rgba(185,28,28,0.25)',
}

function App() {
  const [repoUrl, setRepoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

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

  const handleEmailSubmit = async (e) => {
  e.preventDefault()
  if (!email.trim()) return
  try {
    await fetch('https://formspree.io/f/mojkzooo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    setEmailSent(true)
  } catch {
    setEmailSent(true)
  }
}

  const formatResult = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={i} style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            color: C.accent,
            margin: '1.5rem 0 0.5rem',
            letterSpacing: '0.12em',
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
            fontSize: '0.88rem'
          }}>
            <span style={{ color: C.textDim, flexShrink: 0 }}>{'—'}</span>
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
          fontSize: '0.88rem'
        }}>
          {line}
        </p>
      )
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4rem 2rem 6rem'
    }}>

      {/* Background image with blur */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(6px)',
        transform: 'scale(1.05)',
        zIndex: 0
      }}/>

      {/* Overlay to soften the image further */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.45)',
        zIndex: 1
      }}/>

      {/* Content */}
      <div style={{ width: '100%', maxWidth: '680px', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '11px',
            color: C.textDim,
            marginBottom: '1.75rem',
            letterSpacing: '0.1em',
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'inline-block',
              animation: 'blink 2s ease-in-out infinite'
            }}/>
            FREE BETA
          </div>

          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '0.75rem',
            letterSpacing: '-0.04em',
            lineHeight: '1.05',
            color: C.text
          }}>
            Your AI built it.
            <br />Now understand it.
          </h1>

          <p style={{
            fontSize: '1rem',
            color: C.textMid,
            lineHeight: '1.75',
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
            marginBottom: '1.75rem'
          }}>
            {['Works on any public repo', 'Powered by Gemini AI', 'Free to use'].map((t, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                color: C.textDim
              }}>
                <span style={{ color: '#22c55e', fontSize: '11px' }}>{'✓'}</span>
                {t}
              </div>
            ))}
          </div>

          <button
            onClick={handleSample}
            style={{
              backgroundColor: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: '20px',
              color: C.textMid,
              padding: '6px 18px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(8px)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)'
              e.currentTarget.style.color = C.text
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)'
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
          <input
            type="text"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            style={{
              padding: '1rem 1.25rem',
              fontSize: '0.9rem',
              backgroundColor: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: '10px',
              color: C.text,
              outline: 'none',
              width: '100%',
              transition: 'border-color 0.2s, background-color 0.2s',
              fontFamily: 'monospace',
              backdropFilter: 'blur(8px)'
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(0,0,0,0.35)'
              e.target.style.backgroundColor = 'rgba(255,255,255,0.98)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(0,0,0,0.12)'
              e.target.style.backgroundColor = 'rgba(255,255,255,0.85)'
            }}
          />
          <button
            type="submit"
            disabled={loading || !repoUrl.trim()}
            style={{
              padding: '1rem',
              fontSize: '0.95rem',
              fontWeight: '700',
              backgroundColor: loading || !repoUrl.trim() ? 'rgba(255,255,255,0.5)' : C.accent,
              color: loading || !repoUrl.trim() ? C.textDim : '#ffffff',
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
                  backgroundColor: C.accent,
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
            fontSize: '0.9rem',
            backdropFilter: 'blur(8px)'
          }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '14px',
            padding: '1.75rem',
            marginTop: '1rem',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e'
                }}/>
                <span style={{
                  fontSize: '0.7rem',
                  color: C.textDim,
                  letterSpacing: '0.12em',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  Codebrief Analysis
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleShare}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: '6px',
                    color: shared ? C.accent : C.textDim,
                    padding: '4px 12px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {shared ? 'Opening...' : 'Share →'}
                </button>
                <button
                  onClick={handleCopy}
                  style={{
                    backgroundColor: copied ? C.greenBg : 'transparent',
                    border: `1px solid ${copied ? C.greenBorder : 'rgba(0,0,0,0.12)'}`,
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

        {/* Pro Teaser */}
        <div style={{
          marginTop: '3rem',
          backgroundColor: 'rgba(255,255,255,0.75)',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '14px',
          padding: '1.75rem',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(0,0,0,0.06)',
            borderRadius: '12px',
            padding: '3px 10px',
            fontSize: '10px',
            fontWeight: '700',
            color: C.textDim,
            letterSpacing: '0.1em',
            marginBottom: '0.75rem'
          }}>
            COMING SOON
          </div>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: C.text,
            marginBottom: '0.5rem'
          }}>
            Codebrief Pro
          </h3>
          <p style={{
            fontSize: '0.85rem',
            color: C.textMid,
            lineHeight: '1.7',
            marginBottom: '1.25rem'
          }}>
            The free tier explains your codebase. Pro goes deeper.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[
              'Downloadable PDF report — share with investors, clients, or developers',
              'Visual file map — see how every file connects to every other file',
              'What to build next — AI suggests the 3 most impactful improvements',
              'Private repo support — analyse repos that are not public'
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                fontSize: '0.83rem',
                color: C.textMid
              }}>
                <span style={{ color: '#22c55e', flexShrink: 0, marginTop: '1px' }}>{'✓'}</span>
                {item}
              </div>
            ))}
          </div>
          {!emailSent ? (
            <form onSubmit={handleEmailSubmit} style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <input
                type="email"
                placeholder="Enter your email to get early access"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '0.65rem 1rem',
                  fontSize: '0.85rem',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '8px',
                  color: C.text,
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  backgroundColor: C.accent,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Notify me
              </button>
            </form>
          ) : (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: C.greenBg,
              border: `1px solid ${C.greenBorder}`,
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: C.green
            }}>
              {'You are on the list. We will email you when Pro launches.'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '2.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: C.textDim
        }}>
          {'Built by '}
          <a href="https://github.com/qhamietech" target="_blank" rel="noreferrer" style={{ color: C.accent, textDecoration: 'none', fontWeight: '500' }}>Qhamisa Tobie</a>
          {' - a 22-year-old developer from the Eastern Cape, South Africa'}
        </div>

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
        input::placeholder { color: #a1a1aa; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}

export default App