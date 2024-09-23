import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import { UrlForm } from '@/components/UrlForm';
import { StartupInfoForm } from '@/components/StartupInfoForm';
import { FundraisingForm } from '@/components/FundraisingForm';
import { InvestorDataTable } from '@/components/InvestorDataTable';
import { StartupInfoValues, FundraisingValues } from '@/lib/schema';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [startupInfo, setStartupInfo] = useState<Partial<StartupInfoValues>>({});
  const [fundraisingInfo, setFundraisingInfo] = useState<Partial<FundraisingValues>>({});
  const [step, setStep] = useState(1);
  const [matchedInvestors, setMatchedInvestors] = useState([]);
  const router = useRouter(); // Initialize useRouter

  const handleUrlSubmit = async (data: { url: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/matchmaking/extract-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.url }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const extractedData = await response.json();

      // Populate StartupInfoForm data
      setStartupInfo({
        companyName: extractedData.companyName,
        industries: extractedData.industries,
        verticals: extractedData.verticals,
        startupLocation: extractedData.startupLocations,
        startupIntro: extractedData.startupIntro,
      });

      // Populate FundraisingForm data
      setFundraisingInfo({
        fundAsk: extractedData.fundAsk,
        targetFundingStages: extractedData.targetFundingStages,
        lastFundingAmount: extractedData.lastFundingAmount,
        lastFundingStage: extractedData.lastFundingStage,
        targetLocations: extractedData.targetLocations,
      });

      setStep(2);
    } catch (error) {
      console.error("Error processing URL:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartupInfoSubmit = (data: StartupInfoValues) => {
    console.log("Startup info submitted:", data);
    setStartupInfo(data);
    setStep(3);

  };

  const handleFundraisingSubmit = async (data: FundraisingValues) => {
    console.log("Fundraising info submitted:", data);
    setFundraisingInfo(data); // Save the fundraising data
    setIsLoading(true);
    try {
      const response = await fetch('/api/matchmaking/investor-matcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupData: startupInfo,
          fundraisingData: data
        }),
      });
      const matchedInvestorsData = await response.json();
      setMatchedInvestors(matchedInvestorsData);
      setStep(4);
    } catch (error) {
      console.error("Error matching investors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleBackToFundraising = () => {
    setStep(3);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setStep(1)}> {/* Added onClick */}
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={150}
              height={40}
              priority
            />
          </div>
          <div className="flex items-center space-x-4">
            <p>Welcome, {user?.name || user?.email}</p>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto flex flex-col items-center justify-center p-4">
        {step === 1 && (
          <UrlForm 
            onSubmit={handleUrlSubmit} 
            isLoading={isLoading} 
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StartupInfoForm 
            initialData={startupInfo} 
            onSubmit={handleStartupInfoSubmit} 
            onBack={handleBack} 
            onNext={() => setStep(3)} 
          />
        )}
        {step === 3 && (
          <FundraisingForm
            initialData={fundraisingInfo}
            onSubmit={handleFundraisingSubmit}
            onBack={handleBack}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <InvestorDataTable 
            data={matchedInvestors} 
            onBack={handleBackToFundraising}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;