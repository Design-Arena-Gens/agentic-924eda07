import { NextRequest, NextResponse } from 'next/server'

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

const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jennifer', 'Robert', 'Lisa', 'James', 'Amanda', 'William', 'Jessica', 'Richard', 'Michelle', 'Thomas']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson']

const companyPrefixes = ['Tech', 'Digital', 'Cloud', 'Smart', 'Global', 'Prime', 'Elite', 'Next', 'Future', 'Quantum', 'Advanced', 'Innovative', 'Strategic', 'Dynamic', 'Apex']
const companySuffixes = ['Solutions', 'Systems', 'Technologies', 'Innovations', 'Ventures', 'Group', 'Labs', 'Corp', 'Industries', 'Enterprises', 'Partners', 'Dynamics', 'Network', 'Hub', 'Studio']

const industryKeywords: Record<string, string[]> = {
  'technology': ['AI-powered', 'cloud-native', 'SaaS', 'API-first', 'scalable platform', 'machine learning'],
  'healthcare': ['patient care', 'HIPAA compliant', 'telemedicine', 'EHR integration', 'clinical solutions'],
  'finance': ['fintech', 'payment processing', 'risk management', 'compliance', 'blockchain'],
  'retail': ['e-commerce', 'omnichannel', 'customer experience', 'inventory management', 'POS systems'],
  'manufacturing': ['supply chain', 'automation', 'quality control', 'IoT sensors', 'production optimization'],
  'real-estate': ['property management', 'CRM', 'virtual tours', 'listing automation', 'market analytics'],
  'education': ['e-learning', 'LMS', 'student engagement', 'assessment tools', 'virtual classroom'],
  'hospitality': ['booking systems', 'guest experience', 'revenue management', 'property management', 'loyalty programs'],
  'consulting': ['business strategy', 'digital transformation', 'change management', 'performance optimization'],
  'marketing': ['digital campaigns', 'analytics', 'content marketing', 'social media', 'SEO optimization']
}

function generateLead(industry: string, location: string, companySize: string, keywords: string): Lead {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const companyName = `${companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)]} ${companySuffixes[Math.floor(Math.random() * companySuffixes.length)]}`

  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyName.toLowerCase().replace(/\s+/g, '')}.com`
  const phone = `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
  const website = `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`

  const score = Math.floor(Math.random() * 30) + 70

  const keywordList = industryKeywords[industry] || []
  const selectedKeywords = keywordList.slice(0, 2 + Math.floor(Math.random() * 2))

  const insights = generateInsights(companyName, industry, selectedKeywords, keywords, score)

  const sources = ['LinkedIn Search', 'Company Database', 'Industry Directory', 'Web Scraping', 'Professional Network', 'Trade Shows']
  const source = sources[Math.floor(Math.random() * sources.length)]

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${firstName} ${lastName}`,
    company: companyName,
    email,
    phone,
    industry: industry.charAt(0).toUpperCase() + industry.slice(1).replace('-', ' '),
    companySize,
    website,
    score,
    insights,
    source
  }
}

function generateInsights(company: string, industry: string, keywords: string[], userKeywords: string, score: number): string {
  const insights = []

  if (score >= 90) {
    insights.push(`${company} is a high-priority lead with strong market presence.`)
  } else if (score >= 80) {
    insights.push(`${company} shows excellent potential as a qualified lead.`)
  } else {
    insights.push(`${company} is a viable prospect worth exploring.`)
  }

  insights.push(`They specialize in ${keywords.slice(0, 2).join(' and ')}.`)

  if (userKeywords) {
    insights.push(`Matches your criteria: ${userKeywords.split(',')[0].trim()}.`)
  }

  const engagementTips = [
    'Strong digital presence indicates tech-savviness.',
    'Active on social media - good for outreach.',
    'Recently expanded operations.',
    'Looking to modernize their tech stack.',
    'Participated in recent industry events.'
  ]
  insights.push(engagementTips[Math.floor(Math.random() * engagementTips.length)])

  return insights.join(' ')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { industry, location, companySize, keywords } = body

    if (!industry || !location || !companySize) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await new Promise(resolve => setTimeout(resolve, 2000))

    const numberOfLeads = Math.floor(Math.random() * 5) + 8
    const leads: Lead[] = []

    for (let i = 0; i < numberOfLeads; i++) {
      leads.push(generateLead(industry, location, companySize, keywords))
    }

    leads.sort((a, b) => b.score - a.score)

    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Error generating leads:', error)
    return NextResponse.json(
      { error: 'Failed to generate leads' },
      { status: 500 }
    )
  }
}
