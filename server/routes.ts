import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { aiPredictionService } from "./services/ai-prediction";
import { alertGenerator } from "./services/alert-generator";
import { pdfGenerator } from "./services/pdf-generator";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { z } from "zod";
import { insertStudentSchema, insertDistrictSchema, insertInterventionSchema } from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // State overview endpoints
  app.get("/api/districts", async (req, res) => {
    try {
      const districts = await storage.getAllDistricts();
      res.json(districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ message: "Failed to fetch districts" });
    }
  });

  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStateStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/district-analysis", async (req, res) => {
    try {
      const analysis = await storage.getDistrictRiskAnalysis();
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching district analysis:", error);
      res.status(500).json({ message: "Failed to fetch district analysis" });
    }
  });

  // Students endpoints
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.get("/api/students/high-risk", async (req, res) => {
    try {
      const highRiskStudents = await storage.getHighRiskStudents();
      res.json(highRiskStudents);
    } catch (error) {
      console.error("Error fetching high-risk students:", error);
      res.status(500).json({ message: "Failed to fetch high-risk students" });
    }
  });

  // Schemes endpoints
  app.get("/api/schemes", async (req, res) => {
    try {
      const schemes = await storage.getAllSchemes();
      res.json(schemes);
    } catch (error) {
      console.error("Error fetching schemes:", error);
      res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });

  app.get("/api/scheme-analytics", async (req, res) => {
    try {
      const analytics = await storage.getSchemeAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching scheme analytics:", error);
      res.status(500).json({ message: "Failed to fetch scheme analytics" });
    }
  });

  // Interventions endpoints
  app.get("/api/interventions", async (req, res) => {
    try {
      const interventions = await storage.getAllInterventions();
      res.json(interventions);
    } catch (error) {
      console.error("Error fetching interventions:", error);
      res.status(500).json({ message: "Failed to fetch interventions" });
    }
  });

  app.post("/api/interventions", async (req, res) => {
    try {
      const validatedData = insertInterventionSchema.parse(req.body);
      const intervention = await storage.createIntervention(validatedData);
      res.json(intervention);
    } catch (error) {
      console.error("Error creating intervention:", error);
      res.status(400).json({ message: "Invalid intervention data" });
    }
  });

  // Alerts endpoints
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/unread", async (req, res) => {
    try {
      const unreadAlerts = await storage.getUnreadAlerts();
      res.json(unreadAlerts);
    } catch (error) {
      console.error("Error fetching unread alerts:", error);
      res.status(500).json({ message: "Failed to fetch unread alerts" });
    }
  });

  app.patch("/api/alerts/:id/read", async (req, res) => {
    try {
      const alert = await storage.markAlertAsRead(req.params.id);
      res.json(alert);
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // DLI Indicators endpoints
  app.get("/api/dli-indicators", async (req, res) => {
    try {
      const indicators = await storage.getAllDliIndicators();
      res.json(indicators);
    } catch (error) {
      console.error("Error fetching DLI indicators:", error);
      res.status(500).json({ message: "Failed to fetch DLI indicators" });
    }
  });

  // File upload and AI prediction endpoints
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }

      const file = req.file;
      const options = {
        autoValidate: req.body.autoValidate === "true",
        aiPrediction: req.body.aiPrediction === "true",
        generateReport: req.body.generateReport === "true",
      };

      // Save file record
      const uploadedFile = await storage.createUploadedFile({
        filename: file.filename || `upload_${Date.now()}`,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        status: "Processing",
      });

      // Process file in background
      processUploadedFile(uploadedFile.id, file.buffer, options);

      res.json({
        fileId: uploadedFile.id,
        message: "File uploaded successfully. Processing started.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.get("/api/upload/:id/status", async (req, res) => {
    try {
      const uploadedFile = await storage.getUploadedFileById(req.params.id);
      
      if (!uploadedFile) {
        return res.status(404).json({ message: "Upload not found" });
      }

      const progress = {
        upload: 100,
        validation: uploadedFile.status === "Processing" ? 50 : 100,
        aiPrediction: uploadedFile.status === "Completed" ? 100 : uploadedFile.status === "Processing" ? 25 : 0,
      };

      res.json({
        status: uploadedFile.status,
        progress,
        recordsProcessed: uploadedFile.recordsProcessed || 0,
        totalRecords: uploadedFile.totalRecords || 0,
        validationResults: uploadedFile.validationResults,
        aiPredictionResults: uploadedFile.aiPredictionResults,
      });
    } catch (error) {
      console.error("Error fetching upload status:", error);
      res.status(500).json({ message: "Failed to fetch upload status" });
    }
  });

  app.get("/api/uploads/recent", async (req, res) => {
    try {
      const recentUploads = await storage.getUploadedFiles();
      res.json(recentUploads);
    } catch (error) {
      console.error("Error fetching recent uploads:", error);
      res.status(500).json({ message: "Failed to fetch recent uploads" });
    }
  });

  // Download template endpoint
  app.get("/api/template/download", (req, res) => {
    const templateData = [
      {
        studentId: "ST2024-0001",
        name: "Example Student",
        district: "Sample District",
        class: "10th Grade",
        attendance: 85.5,
        academicPerformance: 75.0,
        socioEconomicStatus: "Middle",
        parentalEducation: "High School",
        distanceFromSchool: 2.5,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Data Template");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=student_data_template.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  });

  // Alert generation endpoint
  app.post("/api/alerts/generate", async (req, res) => {
    try {
      await alertGenerator.runAllAlertGenerators();
      res.json({ message: "Alerts generated successfully" });
    } catch (error) {
      console.error("Error generating alerts:", error);
      res.status(500).json({ message: "Failed to generate alerts" });
    }
  });

  // PDF report generation endpoints
  app.get("/api/reports/district/:districtId", async (req, res) => {
    try {
      const pdfBuffer = await pdfGenerator.generateDistrictReport(req.params.districtId);
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=district_report_${req.params.districtId}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating district report:", error);
      res.status(500).json({ message: "Failed to generate district report" });
    }
  });

  app.get("/api/reports/state", async (req, res) => {
    try {
      const pdfBuffer = await pdfGenerator.generateStateReport();
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=state_report.pdf");
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating state report:", error);
      res.status(500).json({ message: "Failed to generate state report" });
    }
  });

  const httpServer = createServer(app);
  
  setInterval(async () => {
    try {
      await alertGenerator.runAllAlertGenerators();
    } catch (error) {
      console.error("Scheduled alert generation failed:", error);
    }
  }, 3600000);

  return httpServer;
}

// Background file processing function
async function processUploadedFile(
  fileId: string,
  buffer: Buffer,
  options: { autoValidate: boolean; aiPrediction: boolean; generateReport: boolean }
) {
  try {
    // Parse file content
    const data = await parseFileContent(buffer);
    
    await storage.updateUploadedFile(fileId, {
      totalRecords: data.length,
    });

    if (options.autoValidate) {
      // Validate data
      const validation = await aiPredictionService.validateStudentData(data);
      
      await storage.updateUploadedFile(fileId, {
        validationResults: validation,
      });

      if (!validation.isValid) {
        await storage.updateUploadedFile(fileId, {
          status: "Failed",
        });
        return;
      }
    }

    if (options.aiPrediction) {
      // Run AI predictions
      const predictions = await aiPredictionService.batchPredictDropoutRisk(data);
      
      await storage.updateUploadedFile(fileId, {
        aiPredictionResults: predictions,
        recordsProcessed: predictions.length,
      });

      // Save students to database
      for (const prediction of predictions) {
        const studentData = data.find(d => d.studentId === prediction.studentId);
        if (studentData) {
          // Find or create district
          let district = (await storage.getAllDistricts()).find(d => d.name === studentData.district);
          if (!district) {
            district = await storage.createDistrict({
              name: studentData.district,
              code: studentData.district.toUpperCase().replace(/\s+/g, "_"),
            });
          }

          await storage.createStudent({
            studentId: prediction.studentId,
            name: studentData.name,
            districtId: district.id,
            class: studentData.class,
            attendance: studentData.attendance.toString(),
            academicPerformance: studentData.academicPerformance.toString(),
            riskScore: prediction.riskScore.toString(),
            riskLevel: prediction.riskLevel,
            primaryRiskFactor: prediction.primaryRiskFactor,
            socioEconomicStatus: studentData.socioEconomicStatus,
            parentalEducation: studentData.parentalEducation,
            distanceFromSchool: studentData.distanceFromSchool?.toString(),
          });
        }
      }
    }

    await storage.updateUploadedFile(fileId, {
      status: "Completed",
      processedAt: new Date(),
    });
  } catch (error) {
    console.error("Error processing file:", error);
    await storage.updateUploadedFile(fileId, {
      status: "Failed",
    });
  }
}

async function parseFileContent(buffer: Buffer): Promise<any[]> {
  // Try to parse as Excel first, then CSV
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    // Fall back to CSV parsing
    const text = buffer.toString("utf-8");
    const result = Papa.parse(text, { header: true, skipEmptyLines: true });
    return result.data;
  }
}
