import { useState } from 'react'
import { analyseRepo } from './codebrief'

function App() {
  const [repoUrl, setRepoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

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
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatResult = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={i} style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: '#ffffff',
            margin: '1.5rem 0 0.5rem',
            letterSpacing: '0.02em'
          }}>
            {line.replace(/\*\*/g, '')}
          </h3>
        )
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={i} style={{
            display: 'flex',
            gap: '8px',
            margin: '0.3rem 0',
            color: '#aaa',
            lineHeight: '1.7'
          }}>
            <span style={{ color: '#555', flexShrink: 0 }}>{'-'}</span>
            <span>{line.replace(/^[-•]\s/, '')}</span>
          </div>
        )
      }
      if (line.trim() === '') return <div key={i} style={{ height: '0.5rem' }} />
      return (
        <p key={i} style={{
          color: '#aaa',
          lineHeight: '1.8',
          margin: '0.3rem 0'
        }}>
          {line}
        </p>
      )
    })
  }

  const Footer = () => (
    <div style={{
      marginTop: '2rem',
      textAlign: 'center',
      fontSize: '0.8rem',
      color: '#333'
    }}>
     {'Built by '}
    <a href="https://github.com/qhamietech" target="_blank" rel="noreferrer" style={{ color: '#444', textDecoration: 'none' }}>Qhamisa Tobie</a>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4rem 2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '680px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '12px',
            color: '#888',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em'
          }}>
            FREE BETA
          </div>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
            lineHeight: '1'
          }}>
            Codebrief
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            lineHeight: '1.7',
            maxWidth: '480px',
            margin: '0 auto 1.5rem'
          }}>
            Paste a public GitHub repo. Get a plain English explanation of everything inside it — instantly.
          </p>
          <button
            onClick={handleSample}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #2a2a2a',
              borderRadius: '20px',
              color: '#888',
              padding: '6px 16px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = '#444'
              e.target.style.color = '#aaa'
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = '#2a2a2a'
              e.target.style.color = '#888'
            }}
          >
            {'✦ See a sample output'}
          </button>
        </div>

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
              fontSize: '1rem',
              backgroundColor: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '10px',
              color: '#ffffff',
              outline: 'none',
              width: '100%',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#444'}
            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
          />
          <button
            type="submit"
            disabled={loading || !repoUrl.trim()}
            style={{
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: '600',
              backgroundColor: loading || !repoUrl.trim() ? '#1a1a1a' : '#ffffff',
              color: loading || !repoUrl.trim() ? '#444' : '#000000',
              border: '1px solid',
              borderColor: loading || !repoUrl.trim() ? '#2a2a2a' : '#ffffff',
              borderRadius: '10px',
              cursor: loading || !repoUrl.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Reading your codebase...' : 'Explain This Repo →'}
          </button>
        </form>

        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#555'
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
                  backgroundColor: '#333',
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
                }}/>
              ))}
            </div>
            <div style={{
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
              color: '#666'
            }}>
              Reading your codebase...
            </div>
            <div style={{ fontSize: '0.8rem', color: '#444' }}>
              This takes 10 to 30 seconds depending on repo size
            </div>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#1a0a0a',
            border: '1px solid #3a1a1a',
            borderRadius: '10px',
            padding: '1.25rem',
            color: '#ff6b6b',
            fontSize: '0.95rem'
          }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{
            backgroundColor: '#111',
            border: '1px solid #222',
            borderRadius: '12px',
            padding: '2rem',
            marginTop: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #222'
            }}>
              <span style={{
                fontSize: '0.85rem',
                color: '#555',
                letterSpacing: '0.05em'
              }}>
                CODEBRIEF ANALYSIS
              </span>
              <button
                onClick={handleCopy}
                style={{
                  backgroundColor: copied ? '#1a3a1a' : 'transparent',
                  border: `1px solid ${copied ? '#2a5a2a' : '#333'}`,
                  borderRadius: '6px',
                  color: copied ? '#4ade80' : '#888',
                  padding: '4px 12px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            {formatResult(result)}
          </div>
        )}

        <div style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid #1a1a1a',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          {['Paste any public GitHub URL', 'AI reads every file', 'Plain English in seconds'].map((item, i) => (
            <div key={i} style={{
              fontSize: '0.85rem',
              color: '#444',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ color: '#333' }}>{'✓'}</span> {item}
            </div>
          ))}
        </div>

        <Footer />

      </div>
    </div>
  )
}

export default App