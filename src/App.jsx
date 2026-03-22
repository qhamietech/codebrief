import { useState } from 'react'
import { analyseRepo } from './codebrief'

function App() {
  const [repoUrl, setRepoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

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
            <span style={{ color: '#555', flexShrink: 0 }}>—</span>
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
            margin: '0 auto'
          }}>
            Paste a public GitHub repo. Get a plain English explanation of everything inside it — instantly.
          </p>
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
              fontSize: '0.9rem',
              marginBottom: '0.5rem'
            }}>
              Fetching files and analysing with AI...
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
                onClick={() => navigator.clipboard.writeText(result)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: '#888',
                  padding: '4px 12px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Copy
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
              <span style={{ color: '#333' }}>✓</span> {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App