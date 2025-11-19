import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

function generateId() {
  return sql`(lower(hex(randomblob(16))))`;
}

function timestamp(name: string) {
  return integer(name, { mode: 'timestamp' });
}

export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(generateId()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("District Official"),
  districtId: text("district_id").references(() => districts.id),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  createdAt: timestamp("created_at").default(sql`(unixepoch())`),
  updatedAt: timestamp("updated_at").default(sql`(unixepoch())`),
});

export const districts = sqliteTable("districts", {
  id: text("id").primaryKey().default(generateId()),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  totalStudents: integer("total_students").notNull().default(0),
  atRiskStudents: integer("at_risk_students").notNull().default(0),
  riskLevel: text("risk_level").notNull().default("Low"),
  createdAt: timestamp("created_at").default(sql`(unixepoch())`),
  updatedAt: timestamp("updated_at").default(sql`(unixepoch())`),
});

export const students = sqliteTable("students", {
  id: text("id").primaryKey().default(generateId()),
  studentId: text("student_id").notNull().unique(),
  name: text("name").notNull(),
  districtId: text("district_id").references(() => districts.id).notNull(),
  class: text("class").notNull(),
  attendance: real("attendance").notNull().default(0),
  academicPerformance: real("academic_performance").notNull().default(0),
  riskScore: real("risk_score").notNull().default(0),
  riskLevel: text("risk_level").notNull().default("Low"),
  primaryRiskFactor: text("primary_risk_factor"),
  socioEconomicStatus: text("socio_economic_status"),
  parentalEducation: text("parental_education"),
  distanceFromSchool: real("distance_from_school"),
  createdAt: timestamp("created_at").default(sql`(unixepoch())`),
  updatedAt: timestamp("updated_at").default(sql`(unixepoch())`),
});

export const schemes = sqliteTable("schemes", {
  id: text("id").primaryKey().default(generateId()),
  name: text("name").notNull(),
  description: text("description"),
  coverage: real("coverage").notNull().default(0),
  beneficiaries: integer("beneficiaries").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`(unixepoch())`),
  updatedAt: timestamp("updated_at").default(sql`(unixepoch())`),
});

export const schemeEnrollments = sqliteTable("scheme_enrollments", {
  id: text("id").primaryKey().default(generateId()),
  studentId: text("student_id").references(() => students.id).notNull(),
  schemeId: text("scheme_id").references(() => schemes.id).notNull(),
  enrolledAt: timestamp("enrolled_at").default(sql`(unixepoch())`),
  status: text("status").notNull().default("Active"),
});

export const interventions = sqliteTable("interventions", {
  id: text("id").primaryKey().default(generateId()),
  studentId: text("student_id").references(() => students.id).notNull(),
  type: text("type").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").default(sql`(unixepoch())`),
  endDate: timestamp("end_date"),
  status: text("status").notNull().default("In Progress"),
  effectiveness: real("effectiveness"),
  createdAt: timestamp("created_at").default(sql`(unixepoch())`),
  updatedAt: timestamp("updated_at").default(sql`(unixepoch())`),
});

export const uploadedFiles = sqliteTable("uploaded_files", {
  id: text("id").primaryKey().default(generateId()),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  status: text("status").notNull().default("Processing"),
  recordsProcessed: integer("records_processed").default(0),
  totalRecords: integer("total_records").default(0),
  validationResults: text("validation_results"),
  aiPredictionResults: text("ai_prediction_results"),
  uploadedAt: timestamp("uploaded_at").default(sql`(unixepoch())`),
  processedAt: timestamp("processed_at"),
});

export const alerts = sqliteTable("alerts", {
  id: text("id").primaryKey().default(generateId()),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  districtId: text("district_id").references(() => districts.id),
  studentId: text("student_id").references(() => students.id),
  isRead: integer("is_read", { mode: 'boolean' }).default(false),
  createdAt: timestamp("created_at").default(sql`(unixepoch())`),
});

export const dliIndicators = sqliteTable("dli_indicators", {
  id: text("id").primaryKey().default(generateId()),
  indicatorName: text("indicator_name").notNull(),
  currentValue: real("current_value").notNull(),
  targetValue: real("target_value").notNull(),
  unit: text("unit").notNull(),
  status: text("status").notNull(),
  districtId: text("district_id").references(() => districts.id),
  reportingPeriod: text("reporting_period").notNull(),
  createdAt: timestamp("created_at").default(sql`(unixepoch())`),
  updatedAt: timestamp("updated_at").default(sql`(unixepoch())`),
});

export const districtsRelations = relations(districts, ({ many }) => ({
  students: many(students),
  alerts: many(alerts),
  dliIndicators: many(dliIndicators),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  district: one(districts, {
    fields: [students.districtId],
    references: [districts.id],
  }),
  schemeEnrollments: many(schemeEnrollments),
  interventions: many(interventions),
  alerts: many(alerts),
}));

export const schemesRelations = relations(schemes, ({ many }) => ({
  enrollments: many(schemeEnrollments),
}));

export const schemeEnrollmentsRelations = relations(schemeEnrollments, ({ one }) => ({
  student: one(students, {
    fields: [schemeEnrollments.studentId],
    references: [students.id],
  }),
  scheme: one(schemes, {
    fields: [schemeEnrollments.schemeId],
    references: [schemes.id],
  }),
}));

export const interventionsRelations = relations(interventions, ({ one }) => ({
  student: one(students, {
    fields: [interventions.studentId],
    references: [students.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  district: one(districts, {
    fields: [alerts.districtId],
    references: [districts.id],
  }),
  student: one(students, {
    fields: [alerts.studentId],
    references: [students.id],
  }),
}));

export const dliIndicatorsRelations = relations(dliIndicators, ({ one }) => ({
  district: one(districts, {
    fields: [dliIndicators.districtId],
    references: [districts.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDistrictSchema = createInsertSchema(districts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSchemeSchema = createInsertSchema(schemes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInterventionSchema = createInsertSchema(interventions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUploadedFileSchema = createInsertSchema(uploadedFiles).omit({
  id: true,
  uploadedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertDliIndicatorSchema = createInsertSchema(dliIndicators).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDistrict = z.infer<typeof insertDistrictSchema>;
export type District = typeof districts.$inferSelect;

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemes.$inferSelect;

export type InsertIntervention = z.infer<typeof insertInterventionSchema>;
export type Intervention = typeof interventions.$inferSelect;

export type InsertUploadedFile = z.infer<typeof insertUploadedFileSchema>;
export type UploadedFile = typeof uploadedFiles.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertDliIndicator = z.infer<typeof insertDliIndicatorSchema>;
export type DliIndicator = typeof dliIndicators.$inferSelect;
