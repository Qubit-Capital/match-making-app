import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlForm } from '@/components/UrlForm';
import { StartupInfoForm } from '@/components/StartupInfoForm';
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
    // Here you would typically send this data to your backend
    // or move to the next step in your process
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {user?.name || user?.email}</p>
      <LogoutButton />

      <Card className="w-[600px] max-w-full mb-8 mt-8">
        <CardHeader>
          <CardTitle>Investor Matchmaker</CardTitle>
          <CardDescription>
            {step === 1 ? "Enter your startup's website to get started" : "Review and edit your startup's information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <UrlForm onSubmit={handleUrlSubmit} isLoading={isLoading} />
          ) : (
            <StartupInfoForm initialData={startupInfo} onSubmit={handleStartupInfoSubmit} />
          )}
        </CardContent>
      </Card>

      {step === 2 && (
        <Button onClick={() => setStep(1)} className="mt-4">
          Back to URL Input
        </Button>
      )}
    </div>
  );
};

export default Dashboard;