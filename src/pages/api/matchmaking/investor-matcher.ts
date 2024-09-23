import { MongoClient, ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { StartupInfoValues, FundraisingValues } from '@/lib/schema'

const mongoUri = process.env.MONGODB_URI
const dbName = 'InvestorData'

type InvestorData = Record<string, { combinations: Record<string, number> }>;

interface Investment {
    investor_id: string;
    investments?: number;
    investment_sector: string;
    investment_stage: string;
    investment_country: string;
}

interface Investor {
    _id: ObjectId;
    [key: string]: any;
}

let investmentsCollection: any, investorsCollection: any, angelsCollection: any;

async function connectToMongo() {
    const client = new MongoClient(mongoUri as string);
    await client.connect();
    const db = client.db(dbName);
    investmentsCollection = db.collection('Investments');
    investorsCollection = db.collection('Investors');
    angelsCollection = db.collection('Angels');
}

async function fetchInvestors(startupData: StartupInfoValues, fundraisingData: FundraisingValues) {
    const { verticals } = startupData;
    const { targetFundingStages, targetLocations, targetInvestors } = fundraisingData;

    const combinations = verticals.flatMap(vertical => 
        targetFundingStages.flatMap(stage => 
            targetLocations.map(country => ({ vertical, stage, country }))
        )
    );

    let investorData: InvestorData = {};

    for (const combo of combinations) {
        console.log(`Searching for: ${JSON.stringify(combo)}`);
        const matchingInvestments: Investment[] = await investmentsCollection.find({
            investment_sector: combo.vertical,
            investment_stage: combo.stage,
            investment_country: combo.country
        }).toArray();
        console.log(`Found ${matchingInvestments.length} matching investments`);

        matchingInvestments.forEach((inv: Investment) => {
            if (!investorData[inv.investor_id]) {
                investorData[inv.investor_id] = {
                    combinations: {}
                };
            }
            const comboName = `${combo.vertical}-${combo.stage}-${combo.country}`;
            investorData[inv.investor_id].combinations[comboName] = inv.investments || 0;
        });
    }

    const investorIds = Object.keys(investorData);
    console.log(`Unique investor IDs found: ${investorIds.length}`);

    if (investorIds.length === 0) {
        console.log('No investor IDs found. Returning empty array.');
        return [];
    }

    // Prepare investor type filter
    const investorTypeFilter = targetInvestors
        .filter(type => type !== "Angel Investor");
    
    // Fetch full investor details
    const investors: Investor[] = await investorsCollection.find({
        _id: { $in: investorIds.map(id => {
            try {
                return new ObjectId(id);
            } catch (error) {
                console.error(`Invalid ObjectId: ${id}`);
                return null;
            }
        }).filter((id): id is ObjectId => id !== null) },
        ...(investorTypeFilter.length > 0 ? { investor_type: { $in: investorTypeFilter } } : {})
    }).toArray();

    console.log(`Fetched ${investors.length} investors from the database`);

    // Fetch Angel investors if selected
    let angelInvestors: any[] = [];
    if (targetInvestors.includes("Angel Investor")) {
        angelInvestors = await angelsCollection.find({
            target_location: { $in: targetLocations }
        })
        .limit(1000)
        .toArray();
        console.log(`Fetched ${angelInvestors.length} angel investors from the database`);
    }

    // Combine investor details with investment counts
    let detailedInvestors = [
        ...investors
            .filter(investor => investor.website && investor.website.trim() !== '')
            .map(investor => ({
                ...investor,
                investmentCounts: investorData[investor._id.toString()].combinations
            })),
        ...angelInvestors.map(angel => ({
            ...angel,
            investor_type: "Angel Investor",
            website: angel.name, // Use name instead of website for Angel investors
            investmentCounts: angel.total_investments || 0
        }))
    ];

    // Sort investors by total investment count
    detailedInvestors.sort((a, b) => {
        const totalA = a.investor_type === "Angel Investor" 
            ? a.investmentCounts.total 
            : Object.values(a.investmentCounts).reduce((sum, count) => sum + (count as number), 0);
        const totalB = b.investor_type === "Angel Investor" 
            ? b.investmentCounts.total 
            : Object.values(b.investmentCounts).reduce((sum, count) => sum + (count as number), 0);
        return totalB - totalA;
    });

    return detailedInvestors;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectToMongo()

    const { startupData, fundraisingData } = req.body
    const matchedInvestors = await fetchInvestors(startupData, fundraisingData)

    res.status(200).json(matchedInvestors)
  } catch (error) {
    console.error('Error in investorMatcher:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}