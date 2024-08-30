import { getGeneralStartupInfo } from '@/lib/PerplexityApi';
import axios from 'axios';

function normalizeUrl(url: string): string {
    // Add https:// if not present and handle www.
    if (!/^https?:\/\//i.test(url)) {
        url = url.startsWith('www.') ? 'https://' + url : 'https://www.' + url;
    }
    return url;
}

async function fetchWebsiteContent(url: any) {
    try {
        const normalizedUrl = normalizeUrl(url);
        const response = await axios.get(`https://r.jina.ai/${normalizedUrl}`);
        console.log(`Fetched content for ${url}:`, response.data.substring(0, 500) + '...');
        return response.data;
    } catch (error) {
        console.error(`Error fetching content for ${url}:`, error);
        return null;
    }
}

export async function extractStartupInfo(url: any) {
    try {
        // Get general info from Perplexity
        const generalInfo = await getGeneralStartupInfo(url);
        console.log('General Info from Perplexity:', generalInfo);

        // Fetch startup's website content
        const websiteContent = await fetchWebsiteContent(url);
        console.log('Website Content:', websiteContent);

        return {
            generalInfo,
            websiteContent,
            originalUrl: url
        };
    } catch (error) {
        console.error('Error extracting startup info:', error);
        throw error;
    }
}