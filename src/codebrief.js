import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error('Invalid GitHub URL. Please use format: https://github.com/username/repository')
  return { owner: match[1], repo: match[2].replace('.git', '') }
}

async function fetchRepoFiles(owner, repo) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`
  )
  if (!response.ok) {
    if (response.status === 404) throw new Error('Repository not found. Make sure it is public.')
    throw new Error('Could not fetch repository. Please try again.')
  }
  const data = await response.json()
  const files = data.tree
    .filter(f => f.type === 'blob')
    .filter(f => !f.path.includes('node_modules'))
    .filter(f => !f.path.includes('.lock'))
    .filter(f => !f.path.includes('dist/'))
    .filter(f => f.size < 50000)
    .filter(f => {
      const ext = f.path.split('.').pop().toLowerCase()
      return ['js','jsx','ts','tsx','py','html','css','json','md','env.example','prisma'].includes(ext)
    })
    .slice(0, 20)
  return files
}

async function fetchFileContent(owner, repo, path) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    )
    if (!response.ok) return null
    const data = await response.json()
    if (data.encoding === 'base64') {
      return atob(data.content.replace(/\n/g, ''))
    }
    return null
  } catch {
    return null
  }
}

export async function analyseRepo(url) {
  const { owner, repo } = parseGitHubUrl(url)
  const files = await fetchRepoFiles(owner, repo)

  if (files.length === 0) {
    throw new Error('No readable files found in this repository.')
  }

  const fileContents = await Promise.all(
    files.map(async (file) => {
      const content = await fetchFileContent(owner, repo, file.path)
      return { path: file.path, content }
    })
  )

  const validFiles = fileContents.filter(f => f.content)

  const codeContext = validFiles.map(f =>
    `FILE: ${f.path}\n\`\`\`\n${f.content.slice(0, 1500)}\n\`\`\``
  ).join('\n\n')

  const prompt = `You are Codebrief — a tool that explains codebases in plain English for people who are not developers or who received AI-generated code they do not fully understand.

Analyse this codebase and return a structured explanation with exactly these sections:

**WHAT THIS PROJECT DOES**
One clear paragraph explaining what this application does and who it is for. No technical jargon. Write as if explaining to a smart friend who does not code.

**THE MAIN FILES AND WHAT THEY DO**
For each important file, one sentence explaining its job in plain English. Format as a simple list.

**HOW IT ALL CONNECTS**
One paragraph explaining how the pieces work together — what happens when a user opens the app, clicks a button, or submits a form. Plain English only.

**WHAT YOU WOULD TELL A DEVELOPER**
Three bullet points of the most important technical facts someone would need to know to work on or improve this project.

Here is the codebase:

${codeContext}`

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}