import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ProcessingStatusProps {
  onComplete?: () => void;
}

export default function ProcessingStatus({ onComplete }: ProcessingStatusProps) {
  const [progress, setProgress] = useState({
    upload: 100,
    validation: 0,
    aiPrediction: 0,
  });

  useEffect(() => {
    // Simulate processing progress
    const timer1 = setTimeout(() => setProgress(prev => ({ ...prev, validation: 35 })), 1000);
    const timer2 = setTimeout(() => setProgress(prev => ({ ...prev, validation: 78 })), 2000);
    const timer3 = setTimeout(() => setProgress(prev => ({ ...prev, validation: 100, aiPrediction: 25 })), 3000);
    const timer4 = setTimeout(() => setProgress(prev => ({ ...prev, aiPrediction: 60 })), 4000);
    const timer5 = setTimeout(() => setProgress(prev => ({ ...prev, aiPrediction: 100 })), 6000);
    const timer6 = setTimeout(() => onComplete?.(), 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [onComplete]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Loader2 className="w-5 h-5 animate-spin mr-3" />
          Processing Data...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Uploading file</span>
              <span className={`text-sm font-semibold ${
                progress.upload === 100 ? "text-green-600" : "text-primary"
              }`} data-testid="text-upload-status">
                {progress.upload === 100 ? "Complete" : `${progress.upload}%`}
              </span>
            </div>
            <Progress value={progress.upload} className="h-2" />
          </div>

          {/* Validation Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Validating data</span>
              <span className={`text-sm font-semibold ${
                progress.validation === 100 ? "text-green-600" : "text-primary"
              }`} data-testid="text-validation-status">
                {progress.validation === 100 ? "Complete" : `${progress.validation}%`}
              </span>
            </div>
            <Progress value={progress.validation} className="h-2" />
          </div>

          {/* AI Prediction Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">AI risk prediction analysis</span>
              <span className={`text-sm font-semibold ${
                progress.aiPrediction === 100 ? "text-green-600" :
                progress.aiPrediction > 0 ? "text-primary" : "text-muted-foreground"
              }`} data-testid="text-ai-prediction-status">
                {progress.aiPrediction === 100 ? "Complete" :
                 progress.aiPrediction > 0 ? `${progress.aiPrediction}%` : "Pending"}
              </span>
            </div>
            <Progress value={progress.aiPrediction} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
