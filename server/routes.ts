import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { aiPredictionService } from "./services/ai-prediction";
import { alertGenerator } from "./services/alert-generator";
import { pdfGenerator } from "./services/pdf-generator";
import { requireAuth, requireRole, requireDistrictAccess } from "./middleware/auth";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { z } from "zod";
import { insertStudentSchema, insertDistrictSchema, insertInterventionSchema } from "@shared/schema";
import bcrypt from "bcryptjs";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  const registerSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6),
    email: z.string().email(),
    fullName: z.string().min(1),
    role: z.enum(["State Administrator", "District Official", "Data Analyst"]).optional(),
    districtId: z.string().optional(),
  });

  app.post("/api/auth/register", requireAuth, requireRole("State Administrator"), async (req: any, res) => {
    try {
      const validated = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(validated.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const hashedPassword = await bcrypt.hash(validated.password, 10);
      
      const user = await storage.createUser({
        username: validated.username,
        password: hashedPassword,
        email: validated.email,
        fullName: validated.fullName,
        role: validated.role || "District Official",
        districtId: validated.districtId || null,
        isActive: true,
      });
      
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error registering user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        username: z.string(),
        password: z.string(),
      });
      
      const validated = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validated.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(validated.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (!user.isActive) {
        return res.status(403).json({ message: "Account is inactive" });
      }
      
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to create session" });
        }
        
        req.session.userId = user.id;
        
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    } catch (error) {
      console.error("Error logging in:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error" });
      }
      res.status(500).json({ message: "Failed to log in" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // State overview endpoints
  app.get("/api/districts", requireAuth, async (req: any, res) => {
    try {
      let districts = await storage.getAllDistricts();
      
      if (req.user.role === "District Official" && req.user.districtId) {
        districts = districts.filter(d => d.id === req.user.districtId);
      }
      
      res.json(districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ message: "Failed to fetch districts" });
    }
  });

  app.get("/api/statistics", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getStateStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/district-analysis", requireAuth, async (req: any, res) => {
    try {
      let analysis = await storage.getDistrictRiskAnalysis();
      
      if (req.user.role === "District Official" && req.user.districtId) {
        analysis = analysis.filter(a => a.district.id === req.user.districtId);
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching district analysis:", error);
      res.status(500).json({ message: "Failed to fetch district analysis" });
    }
  });

  // Students endpoints
  app.get("/api/students", requireAuth, async (req: any, res) => {
    try {
      let students = await storage.getAllStudents();
      
      if (req.user.role === "District Official" && req.user.districtId) {
        students = students.filter(s => s.districtId === req.user.districtId);
      }
      
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.get("/api/students/high-risk", requireAuth, async (req: any, res) => {
    try {
      let highRiskStudents = await storage.getHighRiskStudents();
      
      if (req.user.role === "District Official" && req.user.districtId) {
        highRiskStudents = highRiskStudents.filter(s => s.districtId === req.user.districtId);
      }
      
      res.json(highRiskStudents);
    } catch (error) {
      console.error("Error fetching high-risk students:", error);
      res.status(500).json({ message: "Failed to fetch high-risk students" });
    }
  });

  // Schemes endpoints
  app.get("/api/schemes", requireAuth, async (req, res) => {
    try {
      const schemes = await storage.getAllSchemes();
      res.json(schemes);
    } catch (error) {
      console.error("Error fetching schemes:", error);
      res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });

  app.get("/api/scheme-analytics", requireAuth, async (req: any, res) => {
    try {
      let analytics = await storage.getSchemeAnalytics();
      
      if (req.user.role === "District Official" && req.user.districtId) {
        const district = await storage.getDistrictById(req.user.districtId);
        if (district) {
          analytics = analytics.map(a => ({
            ...a,
            districtCoverage: a.districtCoverage.filter(dc => dc.districtName === district.name)
          }));
        }
      }
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching scheme analytics:", error);
      res.status(500).json({ message: "Failed to fetch scheme analytics" });
    }
  });

  // Interventions endpoints
  app.get("/api/interventions", requireAuth, async (req: any, res) => {
    try {
      let interventions = await storage.getAllInterventions();
      
      if (req.user.role === "District Official" && req.user.districtId) {
        const districtStudents = await storage.getStudentsByDistrict(req.user.districtId);
        const districtStudentIds = districtStudents.map(s => s.id);
        interventions = interventions.filter(i => districtStudentIds.includes(i.studentId));
      }
      
      res.json(interventions);
    } catch (error) {
      console.error("Error fetching interventions:", error);
      res.status(500).json({ message: "Failed to fetch interventions" });
    }
  });

  app.post("/api/interventions", requireAuth, requireRole("State Administrator", "District Official"), async (req: any, res) => {
    try {
      const validatedData = insertInterventionSchema.parse(req.body);
      
      if (req.user.role === "District Official") {
        const student = await storage.getAllStudents().then(students => 
          students.find(s => s.id === validatedData.studentId)
        );
        
        if (!student || student.districtId !== req.user.districtId) {
          return res.status(403).json({ message: "Cannot create interventions for students in other districts" });
        }
      }
      
      const intervention = await storage.createIntervention(validatedData);
      res.json(intervention);
    } catch (error) {
      console.error("Error creating intervention:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid intervention data" });
    }
  });

  // Alerts endpoints
  app.get("/api/alerts", requireAuth, async (req: any, res) => {
    try {
      let alerts = await storage.getAllAlerts();
      
      if (req.user.role === "District Official" && req.user.districtId) {
        alerts = alerts.filter(alert => alert.districtId === req.user.districtId);
      }
      
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/unread", requireAuth, async (req: any, res) => {
    try {
      let unreadAlerts = await storage.getUnreadAlerts();
      
      if (req.user.role === "District Official" && req.user.districtId) {
        unreadAlerts = unreadAlerts.filter(alert => alert.districtId === req.user.districtId);
      }
      
      res.json(unreadAlerts);
    } catch (error) {
      console.error("Error fetching unread alerts:", error);
      res.status(500).json({ message: "Failed to fetch unread alerts" });
    }
  });

  app.patch("/api/alerts/:id/read", requireAuth, requireRole("State Administrator", "District Official"), async (req: any, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      const alert = alerts.find(a => a.id === req.params.id);
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      if (req.user.role === "District Official" && alert.districtId !== req.user.districtId) {
        return res.status(403).json({ message: "Cannot mark alerts from other districts as read" });
      }
      
      const updatedAlert = await storage.markAlertAsRead(req.params.id);
      res.json(updatedAlert);
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // DLI Indicators endpoints
  app.get("/api/dli-indicators", requireAuth, async (req: any, res) => {
    try {
      let indicators = await storage.getAllDliIndicators();
      
      if (req.user.role === "District Official" && req.user.districtId) {
        indicators = indicators.filter(ind => ind.districtId === req.user.districtId);
      }
      
      res.json(indicators);
    } catch (error) {
      console.error("Error fetching DLI indicators:", error);
      res.status(500).json({ message: "Failed to fetch DLI indicators" });
    }
  });

  // File upload and AI prediction endpoints
  app.post("/api/upload", requireAuth, requireRole("State Administrator", "District Official"), upload.single("file"), async (req, res) => {
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

  app.get("/api/upload/:id/status", requireAuth, async (req, res) => {
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

  app.get("/api/uploads/recent", requireAuth, async (req, res) => {
    try {
      const recentUploads = await storage.getUploadedFiles();
      res.json(recentUploads);
    } catch (error) {
      console.error("Error fetching recent uploads:", error);
      res.status(500).json({ message: "Failed to fetch recent uploads" });
    }
  });

  // Download template endpoint
  app.get("/api/template/download", requireAuth, (req, res) => {
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
  app.post("/api/alerts/generate", requireAuth, requireRole("State Administrator"), async (req, res) => {
    try {
      await alertGenerator.runAllAlertGenerators();
      res.json({ message: "Alerts generated successfully" });
    } catch (error) {
      console.error("Error generating alerts:", error);
      res.status(500).json({ message: "Failed to generate alerts" });
    }
  });

  // PDF report generation endpoints
  app.get("/api/reports/district/:districtId", requireAuth, requireDistrictAccess, async (req, res) => {
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

  app.get("/api/reports/state", requireAuth, requireRole("State Administrator", "Data Analyst"), async (req, res) => {
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

  // Third-party integration API endpoints
  app.post("/api/external/students", requireAuth, requireRole("State Administrator", "District Official"), async (req: any, res) => {
    try {
      const validatedStudent = insertStudentSchema.parse(req.body);
      
      if (req.user.role === "District Official" && req.user.districtId !== validatedStudent.districtId) {
        return res.status(403).json({ message: "Cannot create students for other districts" });
      }
      
      const student = await storage.createStudent(validatedStudent);
      res.status(201).json(student);
    } catch (error) {
      console.error("Error creating student via API:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(400).json({ message: "Failed to create student", error });
    }
  });

  app.get("/api/external/students/:districtId", requireAuth, requireDistrictAccess, async (req, res) => {
    try {
      const students = await storage.getStudentsByDistrict(req.params.districtId);
      res.json(students);
    } catch (error) {
      console.error("Error fetching students via API:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.post("/api/external/interventions", requireAuth, requireRole("State Administrator", "District Official"), async (req: any, res) => {
    try {
      const validatedIntervention = insertInterventionSchema.parse(req.body);
      
      const student = await storage.getAllStudents().then(students => 
        students.find(s => s.id === validatedIntervention.studentId)
      );
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      if (req.user.role === "District Official" && req.user.districtId !== student.districtId) {
        return res.status(403).json({ message: "Cannot create interventions for students in other districts" });
      }
      
      const intervention = await storage.createIntervention(validatedIntervention);
      res.status(201).json(intervention);
    } catch (error) {
      console.error("Error creating intervention via API:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(400).json({ message: "Failed to create intervention", error });
    }
  });

  app.get("/api/external/statistics", requireAuth, requireRole("State Administrator", "Data Analyst"), async (req, res) => {
    try {
      const stats = await storage.getStateStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics via API:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/external/alerts", requireAuth, async (req: any, res) => {
    try {
      let alerts = await storage.getUnreadAlerts();
      
      if (req.user.role === "District Official") {
        alerts = alerts.filter(alert => alert.districtId === req.user.districtId);
      }
      
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts via API:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
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
