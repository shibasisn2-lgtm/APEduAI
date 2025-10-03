import { storage } from "../storage";

export class AlertGenerator {
  async generateHighRiskAlerts(): Promise<void> {
    try {
      const highRiskStudents = await storage.getHighRiskStudents();
      const existingAlerts = await storage.getAllAlerts();
      
      for (const student of highRiskStudents) {
        const highRiskAlertExists = existingAlerts.some(
          (alert) => alert.studentId === student.id && 
                    alert.type === "Critical" && 
                    alert.title.includes("High Dropout Risk")
        );
        
        if (!highRiskAlertExists && Number(student.riskScore) >= 70) {
          await storage.createAlert({
            type: "Critical",
            title: `High Dropout Risk: ${student.name}`,
            description: `Student ${student.name} (${student.studentId}) has a high risk score of ${student.riskScore}%. Primary risk factor: ${student.primaryRiskFactor || 'Not specified'}. Immediate intervention recommended.`,
            studentId: student.id,
            districtId: student.districtId,
            isRead: false,
          });
        }
        
        const attendanceAlertExists = existingAlerts.some(
          (alert) => alert.studentId === student.id && 
                    alert.type === "Warning" &&
                    alert.title.includes("Low Attendance")
        );
        
        if (!attendanceAlertExists && Number(student.attendance) < 70) {
          await storage.createAlert({
            type: "Warning",
            title: `Low Attendance Alert: ${student.name}`,
            description: `Student ${student.name} (${student.studentId}) has an attendance rate of ${student.attendance}%. This may lead to increased dropout risk.`,
            studentId: student.id,
            districtId: student.districtId,
            isRead: false,
          });
        }
      }
      
      await this.generateDistrictAlerts();
    } catch (error) {
      console.error("Error generating high-risk alerts:", error);
    }
  }

  async generateDistrictAlerts(): Promise<void> {
    try {
      const districtAnalysis = await storage.getDistrictRiskAnalysis();
      const existingAlerts = await storage.getAllAlerts();
      
      for (const analysis of districtAnalysis) {
        const districtAlertExists = existingAlerts.some(
          (alert) => alert.districtId === analysis.district.id && 
                    alert.type === "Warning" &&
                    alert.title.includes("District Alert")
        );
        
        if (!districtAlertExists && analysis.riskLevel === "High" && analysis.riskPercentage > 12) {
          await storage.createAlert({
            type: "Warning",
            title: `District Alert: ${analysis.district.name}`,
            description: `District ${analysis.district.name} has ${analysis.atRiskStudents} at-risk students (${analysis.riskPercentage}% of total). District-wide intervention strategy recommended.`,
            districtId: analysis.district.id,
            isRead: false,
          });
        }
      }
    } catch (error) {
      console.error("Error generating district alerts:", error);
    }
  }

  async generateAttendanceAlerts(): Promise<void> {
    try {
      const allStudents = await storage.getAllStudents();
      const existingAlerts = await storage.getAllAlerts();
      
      for (const student of allStudents) {
        const attendanceRate = Number(student.attendance);
        
        const criticalAttendanceAlertExists = existingAlerts.some(
          (alert) => alert.studentId === student.id && 
                    alert.type === "Critical" &&
                    alert.title.includes("Critical Attendance")
        );
        
        if (!criticalAttendanceAlertExists && attendanceRate < 60) {
          await storage.createAlert({
            type: "Critical",
            title: `Critical Attendance: ${student.name}`,
            description: `Student ${student.name} has critically low attendance (${student.attendance}%). Immediate parent contact required.`,
            studentId: student.id,
            districtId: student.districtId,
            isRead: false,
          });
        }
        
        const attendanceWarningAlertExists = existingAlerts.some(
          (alert) => alert.studentId === student.id && 
                    alert.type === "Warning" &&
                    alert.title.includes("Attendance Warning")
        );
        
        if (!attendanceWarningAlertExists && attendanceRate >= 60 && attendanceRate < 75) {
          await storage.createAlert({
            type: "Warning",
            title: `Attendance Warning: ${student.name}`,
            description: `Student ${student.name} attendance is below target (${student.attendance}%). Monitor and provide support.`,
            studentId: student.id,
            districtId: student.districtId,
            isRead: false,
          });
        }
      }
    } catch (error) {
      console.error("Error generating attendance alerts:", error);
    }
  }

  async generatePerformanceAlerts(): Promise<void> {
    try {
      const allStudents = await storage.getAllStudents();
      const existingAlerts = await storage.getAllAlerts();
      
      for (const student of allStudents) {
        const performance = Number(student.academicPerformance);
        
        const performanceAlertExists = existingAlerts.some(
          (alert) => alert.studentId === student.id && 
                    alert.type === "Warning" &&
                    alert.title.includes("Academic Performance Alert")
        );
        
        if (!performanceAlertExists && performance < 50) {
          await storage.createAlert({
            type: "Warning",
            title: `Academic Performance Alert: ${student.name}`,
            description: `Student ${student.name} has low academic performance (${student.academicPerformance}%). Consider tutoring support.`,
            studentId: student.id,
            districtId: student.districtId,
            isRead: false,
          });
        }
      }
    } catch (error) {
      console.error("Error generating performance alerts:", error);
    }
  }

  async runAllAlertGenerators(): Promise<void> {
    console.log("Starting automated alert generation...");
    await Promise.all([
      this.generateHighRiskAlerts(),
      this.generateAttendanceAlerts(),
      this.generatePerformanceAlerts(),
    ]);
    console.log("Automated alert generation completed.");
  }
}

export const alertGenerator = new AlertGenerator();
