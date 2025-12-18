'use client'

import { useState } from 'react'

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  industry: string
  companySize: string
  website: string
  score: number
  insights: string
  source: string
}

export default function Home() {
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [keywords, setKeywords] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry,
          location,
          companySize,
          keywords,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate leads')
      }

      const data = await response.json()
      setLeads(data.leads)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Company', 'Email', 'Phone', 'Industry', 'Company Size', 'Website', 'Score', 'Insights', 'Source'],
      ...leads.map(lead => [
        lead.name,
        lead.company,
        lead.email,
        lead.phone,
        lead.industry,
        lead.companySize,
        lead.website,
        lead.score.toString(),
        lead.insights,
        lead.source,
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${Date.now()}.csv`
    a.click()
  }

  const avgScore = leads.length > 0
    ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)
    : 0

  const highQualityLeads = leads.filter(lead => lead.score >= 80).length

  return (
    <div className="container">
      <div className="header">
        <h1>AI Lead Generation Agent</h1>
        <p>Discover and qualify high-value leads with artificial intelligence</p>
      </div>

      <div className="main-card">
        <form onSubmit={handleGenerate}>
          <div className="form-section">
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Lead Criteria</h2>

            <div className="form-group">
              <label htmlFor="industry">Target Industry</label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              >
                <option value="">Select an industry</option>
                <option value="technology">Technology & Software</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance & Banking</option>
                <option value="retail">Retail & E-commerce</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="real-estate">Real Estate</option>
                <option value="education">Education</option>
                <option value="hospitality">Hospitality</option>
                <option value="consulting">Consulting</option>
                <option value="marketing">Marketing & Advertising</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="e.g., San Francisco, CA or United States"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="companySize">Company Size</label>
              <select
                id="companySize"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                required
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001+">1001+ employees</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="keywords">Keywords (optional)</label>
              <textarea
                id="keywords"
                placeholder="Enter specific keywords, technologies, or criteria to target (e.g., AI, machine learning, cloud services)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Generating Leads...' : 'Generate Leads'}
          </button>
        </form>

        {error && (
          <div className="error">
            {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="main-card loading">
          <div className="spinner"></div>
          <p>AI is analyzing and generating qualified leads...</p>
        </div>
      )}

      {leads.length > 0 && (
        <div className="main-card">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{leads.length}</h3>
              <p>Total Leads</p>
            </div>
            <div className="stat-card">
              <h3>{highQualityLeads}</h3>
              <p>High Quality</p>
            </div>
            <div className="stat-card">
              <h3>{avgScore}</h3>
              <p>Avg Score</p>
            </div>
          </div>

          <div className="results-section">
            <div className="results-header">
              <h2>Generated Leads</h2>
              <button onClick={handleExport} className="export-button">
                Export to CSV
              </button>
            </div>

            {leads.map((lead) => (
              <div key={lead.id} className="lead-card">
                <div className="lead-header">
                  <div className="lead-title">
                    <h3>{lead.name}</h3>
                    <p>{lead.company}</p>
                  </div>
                  <div className="score-badge">
                    Score: {lead.score}
                  </div>
                </div>

                <div className="lead-details">
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{lead.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{lead.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Industry</span>
                    <span className="detail-value">{lead.industry}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Company Size</span>
                    <span className="detail-value">{lead.companySize}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Website</span>
                    <span className="detail-value">
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                        {lead.website}
                      </a>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Source</span>
                    <span className="detail-value">{lead.source}</span>
                  </div>
                </div>

                <div className="lead-insights">
                  <h4>AI Insights</h4>
                  <p>{lead.insights}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
