import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { VERTICALS, INDUSTRIES, LOCATIONS } from './constants';
import { countries } from 'countries-list' 

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create an array of country options
const countryOptions = Object.entries(countries).map(([code, country]) => ({
    label: country.name,
    value: code,
  }))

const COUNTRY_NAMES = countryOptions.map(option => option.value) as [string, ...string[]];

const StartupSchema = z.object({
    companyName: z.string(),
    industries: z.array(z.enum(INDUSTRIES)),
    verticals: z.array(z.enum(VERTICALS)),
    startupLocations: z.array(z.enum(COUNTRY_NAMES)),
    targetLocations: z.array(z.enum(LOCATIONS)),
    startupIntro: z.string(),
    fundAsk: z.number(),
    targetFundingStages: z.array(z.enum(["Seed", "Series A", "Beyond A"])),
    lastFundingAmount: z.number(),
    lastFundingStage: z.enum(["Bootstrapped", "Pre-seed", "Seed", "Series A", "Series B", "Series C", "Series D+"]),
});

export async function extractStructuredData(generalInfo: string, websiteContent: string) {
    const prompt = `
    Extract structured information about a startup based on the following data:

    General Info:
    ${generalInfo}

    Website Content:
    ${websiteContent}

    Provide the information in the required structure. For industries and verticals, use the following predefined categories as a guide:

    Industries: ${INDUSTRIES.join(', ')}

    Verticals: ${VERTICALS.join(', ')}
    Note: Digital Health vertical refers to healthcare solutions digitally.

    Important: Always provide at least one industry and one vertical that best describes the startup, even if it's not an exact match. If the startup's focus doesn't precisely fit the predefined categories, choose the closest matches or use a combination of categories that best represent the startup's domain.

    startupIntro gives an overview of the startup and describes what it does.
    
    fundAsk is the estimated fund ask and target.
    
    targetFundingStages are the funding stages which startup wants to target (to find investors who invest in these stages) basis the last funding round. If the last funding round is "Pre-seed" or "Bootstrapped", then target funding stages would be ["Seed"]. If the last funding round is "Seed", then target funding stages would be ["Series A"]. If the last funding round is "Series A" or "Series B" or "Series C" or "Series D+", then target funding stages would be ["Beyond A"].
    
    startupLocations are the locations where the company is located or primarily operates in. Map relevant country codes.
    
    targetLocations are the same startupLocations mapped to one or multiple of these: US, UK, Europe, India, Canada, Germany and UAE.

    If there were no previous funding round, fundAsk could be between 0.5 to 2. If previous funding was <1 million $, fund ask could be 1 to 3. If previous funding was between 1 to 5 million $, fund ask could be 5 to 10. If previous funding was between 5 to 10 million $, fund ask could be 10 to 20. If previous funding was >10 million $, fund ask could be 2 to 4 times of last funding amount.

    Provide the fundAsk and lastFundingAmount number in $millions. For example, instead of 3500000, provide 3.5.

    For last funding round, provide only factual data, do not make it up. Use 0 and "Bootstrapped" as the default values. Only deviate from default if previous funding round is clearly found in General Info or Website Content.
    `;

    try {
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a world class researcher and investor matchmaker at Qubit Capital, a digital investment bank which helps startups connect and raise capital from potential investors.You do structured data extraction for helping startups find suitable investors. Extract the required information based on the given data." },
                { role: "user", content: prompt }
            ],
            response_format: zodResponseFormat(StartupSchema, "startup_info_extraction"),
        });

        const extractedData = completion.choices[0].message.parsed;
        console.log(extractedData)
        console.log('Extracted Structured Data:', JSON.stringify(extractedData, null, 2));
        return extractedData;
    } catch (error) {
        console.error('Error extracting structured data:', error);
        throw error;
    }
}