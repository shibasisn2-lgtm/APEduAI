import { 
  users, districts, students, schemes, schemeEnrollments, interventions, 
  uploadedFiles, alerts, dliIndicators,
  type User, type InsertUser, type District, type InsertDistrict,
  type Student, type InsertStudent, type Scheme, type InsertScheme,
  type Intervention, type InsertIntervention, type UploadedFile, type InsertUploadedFile,
  type Alert, type InsertAlert, type DliIndicator, type InsertDliIndicator
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, avg, sum } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // District methods
  getAllDistricts(): Promise<District[]>;
  getDistrictById(id: string): Promise<District | undefined>;
  createDistrict(district: InsertDistrict): Promise<District>;
  updateDistrict(id: string, updates: Partial<InsertDistrict>): Promise<District>;

  // Student methods
  getAllStudents(): Promise<Student[]>;
  getStudentsByDistrict(districtId: string): Promise<Student[]>;
  getHighRiskStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student>;

  // Scheme methods
  getAllSchemes(): Promise<Scheme[]>;
  createScheme(scheme: InsertScheme): Promise<Scheme>;

  // Intervention methods
  getAllInterventions(): Promise<Intervention[]>;
  getInterventionsByStudent(studentId: string): Promise<Intervention[]>;
  createIntervention(intervention: InsertIntervention): Promise<Intervention>;
  updateIntervention(id: string, updates: Partial<InsertIntervention>): Promise<Intervention>;

  // File upload methods
  createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile>;
  updateUploadedFile(id: string, updates: Partial<InsertUploadedFile>): Promise<UploadedFile>;
  getUploadedFiles(): Promise<UploadedFile[]>;

  // Alert methods
  getAllAlerts(): Promise<Alert[]>;
  getUnreadAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<Alert>;

  // DLI Indicator methods
  getAllDliIndicators(): Promise<DliIndicator[]>;
  createDliIndicator(indicator: InsertDliIndicator): Promise<DliIndicator>;
  updateDliIndicator(id: string, updates: Partial<InsertDliIndicator>): Promise<DliIndicator>;

  // Analytics methods
  getStateStatistics(): Promise<{
    primaryEnrollment: number;
    secondaryEnrollment: number;
    dropoutRate: number;
    atRiskPercentage: number;
  }>;
  getDistrictRiskAnalysis(): Promise<Array<{
    district: District;
    totalStudents: number;
    atRiskStudents: number;
    riskPercentage: number;
    riskLevel: string;
  }>>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllDistricts(): Promise<District[]> {
    return await db.select().from(districts).orderBy(districts.name);
  }

  async getDistrictById(id: string): Promise<District | undefined> {
    const [district] = await db.select().from(districts).where(eq(districts.id, id));
    return district || undefined;
  }

  async createDistrict(district: InsertDistrict): Promise<District> {
    const [created] = await db.insert(districts).values(district).returning();
    return created;
  }

  async updateDistrict(id: string, updates: Partial<InsertDistrict>): Promise<District> {
    const [updated] = await db
      .update(districts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(districts.id, id))
      .returning();
    return updated;
  }

  async getAllStudents(): Promise<Student[]> {
    return await db.select().from(students).orderBy(students.name);
  }

  async getStudentsByDistrict(districtId: string): Promise<Student[]> {
    return await db.select().from(students).where(eq(students.districtId, districtId));
  }

  async getHighRiskStudents(): Promise<Student[]> {
    return await db
      .select()
      .from(students)
      .where(eq(students.riskLevel, "High"))
      .orderBy(desc(students.riskScore));
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [created] = await db.insert(students).values(student).returning();
    return created;
  }

  async updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student> {
    const [updated] = await db
      .update(students)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return updated;
  }

  async getAllSchemes(): Promise<Scheme[]> {
    return await db.select().from(schemes).orderBy(schemes.name);
  }

  async createScheme(scheme: InsertScheme): Promise<Scheme> {
    const [created] = await db.insert(schemes).values(scheme).returning();
    return created;
  }

  async getAllInterventions(): Promise<Intervention[]> {
    return await db
      .select()
      .from(interventions)
      .orderBy(desc(interventions.startDate));
  }

  async getInterventionsByStudent(studentId: string): Promise<Intervention[]> {
    return await db
      .select()
      .from(interventions)
      .where(eq(interventions.studentId, studentId))
      .orderBy(desc(interventions.startDate));
  }

  async createIntervention(intervention: InsertIntervention): Promise<Intervention> {
    const [created] = await db.insert(interventions).values(intervention).returning();
    return created;
  }

  async updateIntervention(id: string, updates: Partial<InsertIntervention>): Promise<Intervention> {
    const [updated] = await db
      .update(interventions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(interventions.id, id))
      .returning();
    return updated;
  }

  async createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile> {
    const [created] = await db.insert(uploadedFiles).values(file).returning();
    return created;
  }

  async updateUploadedFile(id: string, updates: Partial<InsertUploadedFile>): Promise<UploadedFile> {
    const [updated] = await db
      .update(uploadedFiles)
      .set(updates)
      .where(eq(uploadedFiles.id, id))
      .returning();
    return updated;
  }

  async getUploadedFiles(): Promise<UploadedFile[]> {
    return await db
      .select()
      .from(uploadedFiles)
      .orderBy(desc(uploadedFiles.uploadedAt))
      .limit(10);
  }

  async getAllAlerts(): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .orderBy(desc(alerts.createdAt));
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(eq(alerts.isRead, false))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [created] = await db.insert(alerts).values(alert).returning();
    return created;
  }

  async markAlertAsRead(id: string): Promise<Alert> {
    const [updated] = await db
      .update(alerts)
      .set({ isRead: true })
      .where(eq(alerts.id, id))
      .returning();
    return updated;
  }

  async getAllDliIndicators(): Promise<DliIndicator[]> {
    return await db.select().from(dliIndicators).orderBy(dliIndicators.indicatorName);
  }

  async createDliIndicator(indicator: InsertDliIndicator): Promise<DliIndicator> {
    const [created] = await db.insert(dliIndicators).values(indicator).returning();
    return created;
  }

  async updateDliIndicator(id: string, updates: Partial<InsertDliIndicator>): Promise<DliIndicator> {
    const [updated] = await db
      .update(dliIndicators)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(dliIndicators.id, id))
      .returning();
    return updated;
  }

  async getStateStatistics(): Promise<{
    primaryEnrollment: number;
    secondaryEnrollment: number;
    dropoutRate: number;
    atRiskPercentage: number;
  }> {
    // Mock implementation - in real scenario, calculate from actual data
    return {
      primaryEnrollment: 96.4,
      secondaryEnrollment: 89.7,
      dropoutRate: 4.2,
      atRiskPercentage: 8.7,
    };
  }

  async getDistrictRiskAnalysis(): Promise<Array<{
    district: District;
    totalStudents: number;
    atRiskStudents: number;
    riskPercentage: number;
    riskLevel: string;
  }>> {
    const districtList = await this.getAllDistricts();
    const analysis = [];

    for (const district of districtList) {
      const districtStudents = await this.getStudentsByDistrict(district.id);
      const atRiskStudents = districtStudents.filter(s => s.riskLevel === "High" || s.riskLevel === "Medium").length;
      const riskPercentage = districtStudents.length > 0 ? (atRiskStudents / districtStudents.length) * 100 : 0;
      
      let riskLevel = "Low";
      if (riskPercentage > 10) riskLevel = "High";
      else if (riskPercentage > 7) riskLevel = "Medium";

      analysis.push({
        district,
        totalStudents: districtStudents.length,
        atRiskStudents,
        riskPercentage: Number(riskPercentage.toFixed(1)),
        riskLevel,
      });
    }

    return analysis;
  }
}

export const storage = new DatabaseStorage();
