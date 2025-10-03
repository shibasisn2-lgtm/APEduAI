import PDFDocument from "pdfkit";
import { storage } from "../storage";
import type { District } from "@shared/schema";

export class PDFGenerator {
  async generateDistrictReport(districtId: string): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    const district = await storage.getDistrictById(districtId);
    if (!district) {
      throw new Error("District not found");
    }

    const students = await storage.getStudentsByDistrict(districtId);
    const highRiskStudents = students.filter(s => s.riskLevel === "High");
    const mediumRiskStudents = students.filter(s => s.riskLevel === "Medium");
    const lowRiskStudents = students.filter(s => s.riskLevel === "Low");

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Andhra Pradesh Education Analytics", { align: "center" });
    
    doc.moveDown();
    doc
      .fontSize(18)
      .text(`District Dropout Risk Report: ${district.name}`, { align: "center" });
    
    doc.moveDown();
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, { align: "center" });

    doc.moveDown(2);

    doc.fontSize(14).font("Helvetica-Bold").text("District Overview", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica");
    doc.text(`Total Students: ${students.length}`);
    doc.text(`High Risk Students: ${highRiskStudents.length} (${((highRiskStudents.length / students.length) * 100).toFixed(1)}%)`);
    doc.text(`Medium Risk Students: ${mediumRiskStudents.length} (${((mediumRiskStudents.length / students.length) * 100).toFixed(1)}%)`);
    doc.text(`Low Risk Students: ${lowRiskStudents.length} (${((lowRiskStudents.length / students.length) * 100).toFixed(1)}%)`);
    doc.text(`District Risk Level: ${district.riskLevel}`);

    doc.moveDown(2);

    doc.fontSize(14).font("Helvetica-Bold").text("High Risk Students", { underline: true });
    doc.moveDown(0.5);
    
    if (highRiskStudents.length > 0) {
      doc.fontSize(10).font("Helvetica");
      highRiskStudents.slice(0, 10).forEach((student, index) => {
        doc.text(
          `${index + 1}. ${student.name} (${student.studentId}) - Risk Score: ${student.riskScore}% - ${student.primaryRiskFactor || 'N/A'}`
        );
      });
      
      if (highRiskStudents.length > 10) {
        doc.text(`... and ${highRiskStudents.length - 10} more high-risk students`);
      }
    } else {
      doc.fontSize(10).text("No high-risk students identified.");
    }

    doc.moveDown(2);

    doc.fontSize(14).font("Helvetica-Bold").text("Key Risk Factors", { underline: true });
    doc.moveDown(0.5);

    const riskFactors = students
      .filter(s => s.primaryRiskFactor)
      .reduce((acc, student) => {
        const factor = student.primaryRiskFactor || "Unknown";
        acc[factor] = (acc[factor] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const sortedFactors = Object.entries(riskFactors)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    doc.fontSize(10).font("Helvetica");
    sortedFactors.forEach(([factor, count]) => {
      const percentage = ((count / students.length) * 100).toFixed(1);
      doc.text(`• ${factor}: ${count} students (${percentage}%)`);
    });

    doc.moveDown(2);

    doc.fontSize(14).font("Helvetica-Bold").text("Recommendations", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica");

    const recommendations = [];
    
    if (highRiskStudents.length > students.length * 0.1) {
      recommendations.push("• Implement district-wide early intervention program");
      recommendations.push("• Increase counseling resources for at-risk students");
    }
    
    const lowAttendanceCount = students.filter(s => Number(s.attendance) < 75).length;
    if (lowAttendanceCount > students.length * 0.2) {
      recommendations.push("• Launch attendance improvement campaign");
      recommendations.push("• Engage with parents of low-attendance students");
    }
    
    const lowPerformanceCount = students.filter(s => Number(s.academicPerformance) < 60).length;
    if (lowPerformanceCount > students.length * 0.15) {
      recommendations.push("• Expand tutoring and academic support programs");
      recommendations.push("• Identify and address learning gaps");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("• Continue current monitoring and support programs");
      recommendations.push("• Maintain focus on student well-being");
    }

    recommendations.forEach(rec => doc.text(rec));

    doc.moveDown(2);
    doc.fillColor("#666666").fontSize(8).font("Helvetica").text(
      "This report is generated automatically based on current student data and AI-powered risk predictions.",
      { align: "center" }
    );

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on("error", reject);
    });
  }

  async generateStateReport(): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    const statistics = await storage.getStateStatistics();
    const districtAnalysis = await storage.getDistrictRiskAnalysis();
    const highRiskDistricts = districtAnalysis.filter(d => d.riskLevel === "High");

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Andhra Pradesh Education Analytics", { align: "center" });
    
    doc.moveDown();
    doc
      .fontSize(18)
      .text("State-Level Dropout Risk Report", { align: "center" });
    
    doc.moveDown();
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, { align: "center" });

    doc.moveDown(2);

    doc.fontSize(14).font("Helvetica-Bold").text("State Overview", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica");
    doc.text(`Primary Enrollment Rate: ${statistics.primaryEnrollment}%`);
    doc.text(`Secondary Enrollment Rate: ${statistics.secondaryEnrollment}%`);
    doc.text(`Overall Dropout Rate: ${statistics.dropoutRate}%`);
    doc.text(`At-Risk Student Percentage: ${statistics.atRiskPercentage}%`);
    doc.text(`Total Districts: ${districtAnalysis.length}`);
    doc.text(`High-Risk Districts: ${highRiskDistricts.length}`);

    doc.moveDown(2);

    doc.fontSize(14).font("Helvetica-Bold").text("District Risk Analysis", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica");

    districtAnalysis
      .sort((a, b) => b.riskPercentage - a.riskPercentage)
      .slice(0, 10)
      .forEach((analysis, index) => {
        doc.text(
          `${index + 1}. ${analysis.district.name} - ${analysis.riskLevel} Risk (${analysis.riskPercentage}% at-risk, ${analysis.atRiskStudents}/${analysis.totalStudents} students)`
        );
      });

    doc.moveDown(2);

    doc.fontSize(14).font("Helvetica-Bold").text("State-Level Recommendations", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica");
    
    const stateRecommendations = [
      "• Allocate additional resources to high-risk districts",
      "• Expand government scheme coverage in underserved areas",
      "• Implement state-wide dropout prevention programs",
      "• Enhance data collection and monitoring systems",
      "• Provide targeted training for teachers in high-risk areas",
    ];

    stateRecommendations.forEach(rec => doc.text(rec));

    doc.moveDown(2);
    doc.fillColor("#666666").fontSize(8).font("Helvetica").text(
      "This report is generated automatically based on current state-wide student data and AI-powered risk predictions.",
      { align: "center" }
    );

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on("error", reject);
    });
  }
}

export const pdfGenerator = new PDFGenerator();
