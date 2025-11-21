import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class AttendanceService {
  constructor() {
    this.tableName = "attendance_c";
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
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
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
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
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
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance record ${id}:`, error?.response?.data?.message || error);
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
        lookupId = parseInt(studentId);
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
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
      console.error("Error fetching attendance by student ID:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByDate(date) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "EqualTo",
          "Values": [date]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Only include updateable fields
      const params = {
        records: [{
          Name: `${attendanceData.date_c} - ${attendanceData.status_c}`,
          student_id_c: parseInt(attendanceData.student_id_c),
          date_c: attendanceData.date_c || new Date().toISOString().split('T')[0],
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c || ""
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
          console.error(`Failed to create ${failed.length} attendance records:`, failed);
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
      console.error("Error creating attendance record:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Only include updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${attendanceData.date_c} - ${attendanceData.status_c}`,
          student_id_c: parseInt(attendanceData.student_id_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c || ""
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
          console.error(`Failed to update ${failed.length} attendance records:`, failed);
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
      console.error("Error updating attendance record:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return { success: successful.length === 1 };
      }

      return { success: false };
    } catch (error) {
      console.error("Error deleting attendance record:", error?.response?.data?.message || error);
      return { success: false };
    }
  }

  async markAttendance(studentId, date, status, notes = "") {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      // Check if record already exists
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [
          {
            "FieldName": "student_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(studentId)]
          },
          {
            "FieldName": "date_c",
            "Operator": "EqualTo",
            "Values": [date]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const existingRecords = response.data || [];

      if (existingRecords.length > 0) {
        // Update existing record
        const existingRecord = existingRecords[0];
        return await this.update(existingRecord.Id, {
          student_id_c: studentId,
          date_c: date,
          status_c: status,
          notes_c: notes
        });
      } else {
        // Create new record
        return await this.create({
          student_id_c: studentId,
          date_c: date,
          status_c: status,
          notes_c: notes
        });
      }
    } catch (error) {
      console.error("Error marking attendance:", error?.response?.data?.message || error);
      return null;
    }
  }

  async getAttendanceRate(studentId, startDate, endDate) {
    try {
      const records = await this.getByStudentId(studentId);

      const filteredRecords = records.filter(record => {
        const recordDate = new Date(record.date_c);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return recordDate >= start && recordDate <= end;
      });

      if (filteredRecords.length === 0) return 100;

      const presentCount = filteredRecords.filter(record =>
        record.status_c === "present" || record.status_c === "excused"
      ).length;

      return Math.round((presentCount / filteredRecords.length) * 100);
    } catch (error) {
      console.error("Error calculating attendance rate:", error);
      return 0;
    }
  }

  async getClassAttendanceByDate(date) {
    try {
      const records = await this.getByDate(date);

      const summary = {
        present: records.filter(r => r.status_c === "present").length,
        absent: records.filter(r => r.status_c === "absent").length,
        late: records.filter(r => r.status_c === "late").length,
        excused: records.filter(r => r.status_c === "excused").length,
        total: records.length
      };

      return summary;
    } catch (error) {
      console.error("Error getting class attendance by date:", error);
      return {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        total: 0
      };
    }
  }
}

export default new AttendanceService();