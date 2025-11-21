import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class GradeService {
  constructor() {
    this.tableName = "grades_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "letter_grade_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "student_id_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "letter_grade_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "student_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Convert studentId to student lookup ID if needed
      let lookupId = studentId;
      if (typeof studentId === 'string') {
        // If it's a student_id_c string, we need to find the actual record ID
        // For now, assume it's already the correct lookup ID
        lookupId = parseInt(studentId);
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "letter_grade_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "student_id_c"}}
        ],
        where: [{
          "FieldName": "student_id_c",
          "Operator": "EqualTo",
          "Values": [lookupId]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades by student ID:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(gradeData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const percentage = (gradeData.score_c / gradeData.max_score_c) * 100;
      const letterGrade = this.calculateLetterGrade(percentage);

      // Only include updateable fields
      const params = {
        records: [{
          Name: `${gradeData.subject_c} - ${gradeData.score_c}/${gradeData.max_score_c}`,
          subject_c: gradeData.subject_c,
          score_c: parseInt(gradeData.score_c),
          max_score_c: parseInt(gradeData.max_score_c),
          percentage_c: Math.round(percentage * 100) / 100,
          letter_grade_c: letterGrade,
          date_c: gradeData.date_c || new Date().toISOString().split('T')[0],
          semester_c: gradeData.semester_c || "Fall 2024",
          student_id_c: parseInt(gradeData.student_id_c)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, gradeData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const percentage = (gradeData.score_c / gradeData.max_score_c) * 100;
      const letterGrade = this.calculateLetterGrade(percentage);

      // Only include updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${gradeData.subject_c} - ${gradeData.score_c}/${gradeData.max_score_c}`,
          subject_c: gradeData.subject_c,
          score_c: parseInt(gradeData.score_c),
          max_score_c: parseInt(gradeData.max_score_c),
          percentage_c: Math.round(percentage * 100) / 100,
          letter_grade_c: letterGrade,
          date_c: gradeData.date_c,
          semester_c: gradeData.semester_c,
          student_id_c: parseInt(gradeData.student_id_c)
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return { success: successful.length === 1 };
      }

      return { success: false };
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      return { success: false };
    }
  }

  calculateLetterGrade(percentage) {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 63) return "D";
    if (percentage >= 60) return "D-";
    return "F";
  }

  async getGradesBySubject(subject) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "letter_grade_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "student_id_c"}}
        ],
        where: [{
          "FieldName": "subject_c",
          "Operator": "EqualTo",
          "Values": [subject]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades by subject:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getAverageGrade(studentId) {
    try {
      const grades = await this.getByStudentId(studentId);
      if (grades.length === 0) return 0;

      const total = grades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0);
      return Math.round((total / grades.length) * 100) / 100;
    } catch (error) {
      console.error("Error calculating average grade:", error);
      return 0;
    }
  }
}

export default new GradeService();