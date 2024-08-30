import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlForm } from '@/components/UrlForm';
import { StartupInfoForm } from '@/components/StartupInfoForm';
import { FundraisingForm } from '@/components/FundraisingForm';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [startupInfo, setStartupInfo] = useState(null);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

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

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleForward = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const getButtonLabel = (direction: 'back' | 'forward') => {
    switch (step) {
      case 1:
        return direction === 'forward' ? 'Startup Info' : '';
      case 2:
        return direction === 'forward' ? 'Fundraising' : 'URL Input';
      case 3:
        return direction === 'back' ? 'Startup Info' : '';
      default:
        return '';
    }
  };

  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <p>Welcome, {user?.name || user?.email}</p>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto flex flex-col items-center justify-center p-4">
        <Card className="w-[600px] max-w-full mb-8 mt-8">
          <CardHeader>
            <CardTitle>Investor Matchmaker</CardTitle>
            <CardDescription>{getStepTitle()}</CardDescription>
            <Progress value={progressPercentage} className="mt-2" />
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
        
        <div className="flex justify-between w-[600px] max-w-full">
          {step > 1 && (
            <Button 
              onClick={handleBack} 
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> {getButtonLabel('back')}
            </Button>
          )}
          {step < totalSteps && (
            <Button 
              onClick={handleForward} 
              variant="outline"
              className={step === 1 ? "ml-auto" : ""}
            >
              {getButtonLabel('forward')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;