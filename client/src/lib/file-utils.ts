import Papa from "papaparse";

export interface ParsedFileData {
  data: any[];
  errors: string[];
  warnings: string[];
  totalRecords: number;
  validRecords: number;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class FileUtils {
  static async parseFile(file: File): Promise<ParsedFileData> {
    const extension = this.getFileExtension(file.name);
    
    try {
      switch (extension) {
        case 'csv':
          return await this.parseCSV(file);
        case 'xlsx':
        case 'xls':
          return await this.parseExcel(file);
        default:
          throw new Error(`Unsupported file type: ${extension}`);
      }
    } catch (error) {
      return {
        data: [],
        errors: [`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
        totalRecords: 0,
        validRecords: 0,
      };
    }
  }

  static async parseCSV(file: File): Promise<ParsedFileData> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<any>) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          // Add parsing errors
          results.errors.forEach((error: Papa.ParseError) => {
            errors.push(`Row ${error.row}: ${error.message}`);
          });

          // Validate data structure
          const validationResult = this.validateStudentData(results.data);
          errors.push(...validationResult.errors);
          warnings.push(...validationResult.warnings);

          resolve({
            data: results.data,
            errors,
            warnings,
            totalRecords: results.data.length,
            validRecords: validationResult.isValid ? results.data.length : 0,
          });
        },
        error: (error: Error) => {
          resolve({
            data: [],
            errors: [`CSV parsing failed: ${error.message}`],
            warnings: [],
            totalRecords: 0,
            validRecords: 0,
          });
        }
      });
    });
  }

  static async parseExcel(file: File): Promise<ParsedFileData> {
    try {
      // For client-side Excel parsing, we'd typically use a library like xlsx
      // Since it's not in dependencies, we'll convert to CSV approach
      const text = await file.text();
      
      // This is a simplified approach - in production, use proper Excel parsing
      const csvFile = new File([text], file.name.replace(/\.xlsx?$/, '.csv'), {
        type: 'text/csv'
      });
      
      return await this.parseCSV(csvFile);
    } catch (error) {
      return {
        data: [],
        errors: [`Excel parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
        totalRecords: 0,
        validRecords: 0,
      };
    }
  }

  static validateStudentData(data: any[]): FileValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const requiredFields = ['studentId', 'name', 'district', 'class', 'attendance', 'academicPerformance'];
    const optionalFields = ['socioEconomicStatus', 'parentalEducation', 'distanceFromSchool'];
    
    data.forEach((row, index) => {
      const rowNum = index + 1;
      
      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field] || row[field] === '') {
          errors.push(`Row ${rowNum}: Missing required field '${field}'`);
        }
      });
      
      // Validate numeric fields
      if (row.attendance !== undefined && row.attendance !== '') {
        const attendance = parseFloat(row.attendance);
        if (isNaN(attendance) || attendance < 0 || attendance > 100) {
          errors.push(`Row ${rowNum}: Attendance must be a number between 0 and 100`);
        }
      }
      
      if (row.academicPerformance !== undefined && row.academicPerformance !== '') {
        const performance = parseFloat(row.academicPerformance);
        if (isNaN(performance) || performance < 0 || performance > 100) {
          errors.push(`Row ${rowNum}: Academic performance must be a number between 0 and 100`);
        }
      }
      
      if (row.distanceFromSchool !== undefined && row.distanceFromSchool !== '') {
        const distance = parseFloat(row.distanceFromSchool);
        if (isNaN(distance) || distance < 0) {
          errors.push(`Row ${rowNum}: Distance from school must be a positive number`);
        }
      }
      
      // Check for missing optional fields that could affect prediction accuracy
      optionalFields.forEach(field => {
        if (!row[field] || row[field] === '') {
          warnings.push(`Row ${rowNum}: Missing optional field '${field}' may affect prediction accuracy`);
        }
      });
      
      // Validate student ID format
      if (row.studentId && !/^[A-Z]{2}\d{4}-\d{4}$/.test(row.studentId)) {
        warnings.push(`Row ${rowNum}: Student ID format should be like 'ST2024-0001'`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static isValidFileType(file: File): boolean {
    const validTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    const validExtensions = ['csv', 'xlsx', 'xls'];
    const extension = this.getFileExtension(file.name);
    
    return validTypes.includes(file.type) || validExtensions.includes(extension);
  }

  static generateTemplate(): Blob {
    const templateData = [
      {
        studentId: 'ST2024-0001',
        name: 'Example Student Name',
        district: 'Sample District',
        class: '10th Grade',
        attendance: 85.5,
        academicPerformance: 75.0,
        socioEconomicStatus: 'Middle',
        parentalEducation: 'High School',
        distanceFromSchool: 2.5,
      }
    ];
    
    const csv = Papa.unparse(templateData);
    return new Blob([csv], { type: 'text/csv' });
  }

  static downloadTemplate(): void {
    const blob = this.generateTemplate();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_data_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export default FileUtils;
