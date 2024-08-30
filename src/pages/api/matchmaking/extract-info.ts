import type { NextApiRequest, NextApiResponse } from 'next'
import { extractStartupInfo } from '@/lib/UrlProcessor'
import { extractStructuredData } from '@/lib/GPT4Processor'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { url } = req.body
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }
    const rawInfo = await extractStartupInfo(url)
    const structuredData = await extractStructuredData(
      rawInfo.generalInfo,
      rawInfo.websiteContent
    )
    res.json(structuredData)
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ 
      error: 'Failed to extract startup information', 
      details: error.message,
    })
  }
}