import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface StudentDataRow {
  studentId: string;
  name: string;
  district: string;
  class: string;
  attendance: number;
  academicPerformance: number;
  socioEconomicStatus?: string;
  parentalEducation?: string;
  distanceFromSchool?: number;
}

export interface RiskPredictionResult {
  studentId: string;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  primaryRiskFactor: string;
  recommendations: string[];
  confidence: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validRecords: number;
  totalRecords: number;
}

export class AIPredictionService {
  async validateStudentData(data: StudentDataRow[]): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let validRecords = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowIndex = i + 1;

      // Required field validation
      if (!row.studentId) errors.push(`Row ${rowIndex}: Student ID is required`);
      if (!row.name) errors.push(`Row ${rowIndex}: Student name is required`);
      if (!row.district) errors.push(`Row ${rowIndex}: District is required`);
      if (!row.class) errors.push(`Row ${rowIndex}: Class is required`);

      // Numeric validation
      if (isNaN(row.attendance) || row.attendance < 0 || row.attendance > 100) {
        errors.push(`Row ${rowIndex}: Attendance must be a number between 0 and 100`);
      }
      if (isNaN(row.academicPerformance) || row.academicPerformance < 0 || row.academicPerformance > 100) {
        errors.push(`Row ${rowIndex}: Academic performance must be a number between 0 and 100`);
      }

      // Warnings for missing optional data
      if (!row.socioEconomicStatus) {
        warnings.push(`Row ${rowIndex}: Missing socio-economic status may affect prediction accuracy`);
      }
      if (!row.parentalEducation) {
        warnings.push(`Row ${rowIndex}: Missing parental education data may affect prediction accuracy`);
      }

      // Count valid records
      if (row.studentId && row.name && row.district && row.class && 
          !isNaN(row.attendance) && !isNaN(row.academicPerformance)) {
        validRecords++;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      validRecords,
      totalRecords: data.length,
    };
  }

  async predictDropoutRisk(studentData: StudentDataRow): Promise<RiskPredictionResult> {
    try {
      const prompt = `
        Analyze the following student data and predict dropout risk:
        
        Student ID: ${studentData.studentId}
        Name: ${studentData.name}
        District: ${studentData.district}
        Class: ${studentData.class}
        Attendance: ${studentData.attendance}%
        Academic Performance: ${studentData.academicPerformance}%
        Socio-Economic Status: ${studentData.socioEconomicStatus || 'Not provided'}
        Parental Education: ${studentData.parentalEducation || 'Not provided'}
        Distance from School: ${studentData.distanceFromSchool || 'Not provided'} km
        
        Based on education research and risk factors, provide a comprehensive dropout risk assessment.
        Consider factors like:
        - Low attendance (high risk if <75%)
        - Poor academic performance (high risk if <50%)
        - Socio-economic challenges
        - Distance from school
        - Parental education level
        
        Respond with JSON in this format:
        {
          "riskScore": number (0-100),
          "riskLevel": "Low" | "Medium" | "High",
          "primaryRiskFactor": "string describing main concern",
          "recommendations": ["array", "of", "intervention", "suggestions"],
          "confidence": number (0-1)
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are an expert education analyst specializing in dropout risk prediction. Provide accurate, actionable assessments based on student data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 2048,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        studentId: studentData.studentId,
        riskScore: Math.max(0, Math.min(100, result.riskScore || 0)),
        riskLevel: result.riskLevel || "Low",
        primaryRiskFactor: result.primaryRiskFactor || "Insufficient data",
        recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
        confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      };
    } catch (error) {
      console.error("AI prediction error:", error);
      
      // Fallback risk calculation based on simple heuristics
      let riskScore = 0;
      let primaryRiskFactor = "Data analysis";
      const recommendations: string[] = [];

      if (studentData.attendance < 75) {
        riskScore += 40;
        primaryRiskFactor = "Low attendance";
        recommendations.push("Schedule parental meeting to discuss attendance");
        recommendations.push("Implement attendance tracking system");
      }

      if (studentData.academicPerformance < 50) {
        riskScore += 35;
        if (riskScore === 35) primaryRiskFactor = "Poor academic performance";
        recommendations.push("Provide additional tutoring support");
        recommendations.push("Review teaching methods and materials");
      }

      if (studentData.distanceFromSchool && studentData.distanceFromSchool > 5) {
        riskScore += 15;
        recommendations.push("Consider transportation assistance");
      }

      if (studentData.socioEconomicStatus === "Low") {
        riskScore += 10;
        recommendations.push("Evaluate for financial assistance programs");
      }

      let riskLevel: "Low" | "Medium" | "High" = "Low";
      if (riskScore > 70) riskLevel = "High";
      else if (riskScore > 40) riskLevel = "Medium";

      return {
        studentId: studentData.studentId,
        riskScore: Math.min(100, riskScore),
        riskLevel,
        primaryRiskFactor,
        recommendations: recommendations.length > 0 ? recommendations : ["Continue monitoring student progress"],
        confidence: 0.6,
      };
    }
  }

  async batchPredictDropoutRisk(studentsData: StudentDataRow[]): Promise<RiskPredictionResult[]> {
    const results: RiskPredictionResult[] = [];
    
    // Process in batches to avoid API limits
    const batchSize = 5;
    for (let i = 0; i < studentsData.length; i += batchSize) {
      const batch = studentsData.slice(i, i + batchSize);
      const batchPromises = batch.map(student => this.predictDropoutRisk(student));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches to respect API limits
      if (i + batchSize < studentsData.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  async generateAnalyticsReport(predictions: RiskPredictionResult[]): Promise<{
    summary: {
      totalStudents: number;
      lowRisk: number;
      mediumRisk: number;
      highRisk: number;
    };
    insights: string[];
    recommendations: string[];
  }> {
    const summary = {
      totalStudents: predictions.length,
      lowRisk: predictions.filter(p => p.riskLevel === "Low").length,
      mediumRisk: predictions.filter(p => p.riskLevel === "Medium").length,
      highRisk: predictions.filter(p => p.riskLevel === "High").length,
    };

    const topRiskFactors = predictions
      .reduce((acc, p) => {
        acc[p.primaryRiskFactor] = (acc[p.primaryRiskFactor] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const insights = [
      `${summary.highRisk} students (${((summary.highRisk / summary.totalStudents) * 100).toFixed(1)}%) are at high risk of dropout`,
      `Most common risk factor: ${Object.keys(topRiskFactors).sort((a, b) => topRiskFactors[b] - topRiskFactors[a])[0]}`,
      `Average risk score: ${(predictions.reduce((sum, p) => sum + p.riskScore, 0) / predictions.length).toFixed(1)}%`,
    ];

    const allRecommendations = predictions.flatMap(p => p.recommendations);
    const uniqueRecommendations = [...new Set(allRecommendations)];
    
    return {
      summary,
      insights,
      recommendations: uniqueRecommendations.slice(0, 10), // Top 10 unique recommendations
    };
  }
}

export const aiPredictionService = new AIPredictionService();
