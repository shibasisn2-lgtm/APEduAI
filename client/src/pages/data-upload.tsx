import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Upload, Download, Check, FileText, History } from "lucide-react";
import FileUploadZone from "@/components/data-upload/file-upload-zone";
import ProcessingStatus from "@/components/data-upload/processing-status";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { UploadedFile } from "@shared/schema";

export default function DataUpload() {
  const [uploadOptions, setUploadOptions] = useState({
    autoValidate: true,
    aiPrediction: true,
    generateReport: false,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  
  const { data: recentUploads } = useQuery<UploadedFile[]>({
    queryKey: ["/api/uploads/recent"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("autoValidate", uploadOptions.autoValidate.toString());
      formData.append("aiPrediction", uploadOptions.aiPrediction.toString());
      formData.append("generateReport", uploadOptions.generateReport.toString());

      const response = await apiRequest("POST", "/api/upload", formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Started",
        description: "Your file is being processed. You'll be notified when it's complete.",
      });
      setIsProcessing(true);
      setUploadedFile(null);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    },
  });

  const downloadTemplate = async () => {
    try {
      const response = await fetch("/api/template/download");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_data_template.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download template file.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = () => {
    if (uploadedFile) {
      uploadMutation.mutate(uploadedFile);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Brain className="w-10 h-10 text-white" />
              <h2 className="text-3xl font-bold text-white">AI-Powered Data Upload System</h2>
            </div>
            <p className="text-white/90 text-lg">
              Upload student data for automatic validation and AI-based risk prediction analysis
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="flex items-center space-x-2 text-white">
                <div className="w-3 h-3 bg-white rounded-full ai-pulse" />
                <span className="font-semibold">AI Engine Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-6 h-6 text-primary mr-3" />
                Upload Student Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploadZone
                onFileSelect={setUploadedFile}
                selectedFile={uploadedFile}
                disabled={isProcessing}
              />

              {/* Upload Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="auto-validate"
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    checked={uploadOptions.autoValidate}
                    onChange={(e) => setUploadOptions(prev => ({ ...prev, autoValidate: e.target.checked }))}
                    data-testid="checkbox-auto-validate"
                  />
                  <label htmlFor="auto-validate" className="text-sm text-foreground">
                    Enable automatic data validation
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="ai-prediction"
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    checked={uploadOptions.aiPrediction}
                    onChange={(e) => setUploadOptions(prev => ({ ...prev, aiPrediction: e.target.checked }))}
                    data-testid="checkbox-ai-prediction"
                  />
                  <label htmlFor="ai-prediction" className="text-sm text-foreground">
                    Run AI-powered risk prediction analysis
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="generate-report"
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    checked={uploadOptions.generateReport}
                    onChange={(e) => setUploadOptions(prev => ({ ...prev, generateReport: e.target.checked }))}
                    data-testid="checkbox-generate-report"
                  />
                  <label htmlFor="generate-report" className="text-sm text-foreground">
                    Generate detailed analytics report
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleUpload}
                  disabled={!uploadedFile || uploadMutation.isPending || isProcessing}
                  className="flex-1"
                  data-testid="button-upload-process"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Process
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  data-testid="button-download-template"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Processing Status */}
          {isProcessing && (
            <ProcessingStatus onComplete={() => setIsProcessing(false)} />
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Brain className="w-5 h-5 text-primary mr-2" />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Automatic Data Validation</h4>
                    <p className="text-xs text-muted-foreground">
                      Validates data format, completeness, and consistency
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Dropout Risk Prediction</h4>
                    <p className="text-xs text-muted-foreground">
                      ML models predict student dropout probability
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Pattern Recognition</h4>
                    <p className="text-xs text-muted-foreground">
                      Identifies trends and anomalies in student data
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Intervention Recommendations</h4>
                    <p className="text-xs text-muted-foreground">
                      Suggests targeted actions for at-risk students
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 text-accent mr-2" />
                Data Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-2">Required Fields:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Student ID</li>
                    <li>Name & Demographics</li>
                    <li>Attendance Records</li>
                    <li>Academic Performance</li>
                    <li>Scheme Enrollment Status</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Optional Fields:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Socio-economic Indicators</li>
                    <li>Parental Education</li>
                    <li>Distance from School</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <History className="w-5 h-5 text-muted-foreground mr-2" />
                Recent Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUploads?.map((upload, index) => (
                  <div 
                    key={upload.id} 
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    data-testid={`upload-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{upload.originalName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(upload.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        upload.status === "Completed" ? "bg-green-50 text-green-600 border-green-200" :
                        upload.status === "Failed" ? "bg-red-50 text-red-600 border-red-200" :
                        "bg-amber-50 text-amber-600 border-amber-200"
                      }
                    >
                      {upload.status}
                    </Badge>
                  </div>
                ))}
                
                {!recentUploads?.length && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent uploads found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
