import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlForm } from '@/components/UrlForm';
import { StartupInfoForm } from '@/components/StartupInfoForm';
import { FundraisingForm } from '@/components/FundraisingForm';
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [startupInfo, setStartupInfo] = useState(null);
  const [step, setStep] = useState(1);

  const handleUrlSubmit = async (data: { url: string }) => {
    setIsLoading(true);
    setUrl(data.url);
    try {
      const response = await fetch('/api/matchmaking/extract-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.url }),
      });
      const extractedData = await response.json();
      console.log("Extracted data:", extractedData);
      setStartupInfo(extractedData);
      setStep(2);
    } catch (error) {
      console.error("Error processing URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartupInfoSubmit = (data) => {
    console.log("Startup info submitted:", data);
    setStartupInfo({ ...startupInfo, ...data });
    setStep(3);
  };

  const handleFundraisingSubmit = (data) => {
    console.log("Fundraising info submitted:", data);
    // Here you would typically send this data to your backend
    // or move to the next step in your process
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Enter your startup's website to get started";
      case 2:
        return "Review and edit your startup's information";
      case 3:
        return "Enter your fundraising details";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {user?.name || user?.email}</p>
      <LogoutButton />

      <Card className="w-[600px] max-w-full mb-8 mt-8">
        <CardHeader>
          <CardTitle>Investor Matchmaker</CardTitle>
          <CardDescription>{getStepTitle()}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && <UrlForm onSubmit={handleUrlSubmit} isLoading={isLoading} />}
          {step === 2 && <StartupInfoForm initialData={startupInfo} onSubmit={handleStartupInfoSubmit} />}
          {step === 3 && (
            <FundraisingForm
              initialData={{
                fundAsk: startupInfo?.fundAsk || 0,
                fundingStage: startupInfo?.fundingStage || "",
                lastFundingAmount: startupInfo?.lastFundingRound?.amount || 0,
                lastFundingStage: startupInfo?.lastFundingRound?.stage || "",
              }}
              onSubmit={handleFundraisingSubmit}
            />
          )}
        </CardContent>
      </Card>

      {step > 1 && (
        <Button onClick={() => setStep(step - 1)} className="mt-4">
          Back
        </Button>
      )}
    </div>
  );
};

export default Dashboard;