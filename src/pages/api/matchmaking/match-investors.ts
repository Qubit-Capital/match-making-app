import type { NextApiRequest, NextApiResponse } from 'next'
import { matchInvestors } from '@/lib/investorMatcher'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const startupData = req.body
    const matchedInvestors = await matchInvestors(startupData)
    res.json(matchedInvestors)
  } catch (error) {
    console.error('Error matching investors:', error)
    res.status(500).json({ error: 'An error occurred while matching investors' })
  }
}