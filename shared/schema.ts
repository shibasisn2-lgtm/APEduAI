import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const districts = pgTable("districts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  totalStudents: integer("total_students").notNull().default(0),
  atRiskStudents: integer("at_risk_students").notNull().default(0),
  riskLevel: text("risk_level").notNull().default("Low"), // Low, Medium, High
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: text("student_id").notNull().unique(),
  name: text("name").notNull(),
  districtId: varchar("district_id").references(() => districts.id).notNull(),
  class: text("class").notNull(),
  attendance: decimal("attendance", { precision: 5, scale: 2 }).notNull().default("0"),
  academicPerformance: decimal("academic_performance", { precision: 5, scale: 2 }).notNull().default("0"),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }).notNull().default("0"),
  riskLevel: text("risk_level").notNull().default("Low"), // Low, Medium, High
  primaryRiskFactor: text("primary_risk_factor"),
  socioEconomicStatus: text("socio_economic_status"),
  parentalEducation: text("parental_education"),
  distanceFromSchool: decimal("distance_from_school", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const schemes = pgTable("schemes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  coverage: decimal("coverage", { precision: 5, scale: 2 }).notNull().default("0"), // percentage
  beneficiaries: integer("beneficiaries").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const schemeEnrollments = pgTable("scheme_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  schemeId: varchar("scheme_id").references(() => schemes.id).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: text("status").notNull().default("Active"), // Active, Inactive, Completed
});

export const interventions = pgTable("interventions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  type: text("type").notNull(), // Parental Meeting, Tutoring Support, Financial Aid, etc.
  description: text("description"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  status: text("status").notNull().default("In Progress"), // In Progress, Completed, Cancelled
  effectiveness: decimal("effectiveness", { precision: 5, scale: 2 }), // percentage improvement
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const uploadedFiles = pgTable("uploaded_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  status: text("status").notNull().default("Processing"), // Processing, Completed, Failed
  recordsProcessed: integer("records_processed").default(0),
  totalRecords: integer("total_records").default(0),
  validationResults: jsonb("validation_results"),
  aiPredictionResults: jsonb("ai_prediction_results"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // Critical, Warning, Info
  title: text("title").notNull(),
  description: text("description").notNull(),
  districtId: varchar("district_id").references(() => districts.id),
  studentId: varchar("student_id").references(() => students.id),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dliIndicators = pgTable("dli_indicators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  indicatorName: text("indicator_name").notNull(),
  currentValue: decimal("current_value", { precision: 5, scale: 2 }).notNull(),
  targetValue: decimal("target_value", { precision: 5, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // percentage, count, etc.
  status: text("status").notNull(), // Achieved, In Progress, At Risk
  districtId: varchar("district_id").references(() => districts.id),
  reportingPeriod: text("reporting_period").notNull(), // Q1 2024, Monthly, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
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

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

// Types
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
