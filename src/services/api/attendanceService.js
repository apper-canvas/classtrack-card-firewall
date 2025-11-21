import mockAttendance from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.storageKey = "classtrack_attendance";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(mockAttendance));
    }
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  async getById(id) {
    await this.delay();
    const attendance = await this.getAll();
    const record = attendance.find(a => a.Id === parseInt(id));
    return record ? { ...record } : null;
  }

  async getByStudentId(studentId) {
    await this.delay();
    const attendance = await this.getAll();
    return attendance.filter(a => a.studentId === studentId);
  }

  async getByDate(date) {
    await this.delay();
    const attendance = await this.getAll();
    return attendance.filter(a => a.date === date);
  }

  async create(attendanceData) {
    await this.delay();
    const attendance = await this.getAll();
    const highestId = attendance.reduce((max, record) => Math.max(max, record.Id), 0);
    
    const newRecord = {
      Id: highestId + 1,
      ...attendanceData,
      date: attendanceData.date || new Date().toISOString().split('T')[0]
    };

    const updatedAttendance = [...attendance, newRecord];
    localStorage.setItem(this.storageKey, JSON.stringify(updatedAttendance));
    return { ...newRecord };
  }

  async update(id, attendanceData) {
    await this.delay();
    const attendance = await this.getAll();
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Attendance record not found");
    }

    const updatedRecord = { ...attendance[index], ...attendanceData, Id: parseInt(id) };
    attendance[index] = updatedRecord;
    
    localStorage.setItem(this.storageKey, JSON.stringify(attendance));
    return { ...updatedRecord };
  }

  async delete(id) {
    await this.delay();
    const attendance = await this.getAll();
    const filteredAttendance = attendance.filter(a => a.Id !== parseInt(id));
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredAttendance));
    return { success: true };
  }

  async markAttendance(studentId, date, status, notes = "") {
    await this.delay();
    const attendance = await this.getAll();
    
    // Check if record already exists
    const existingIndex = attendance.findIndex(a => 
      a.studentId === studentId && a.date === date
    );

    if (existingIndex !== -1) {
      // Update existing record
      attendance[existingIndex] = {
        ...attendance[existingIndex],
        status,
        notes
      };
      localStorage.setItem(this.storageKey, JSON.stringify(attendance));
      return { ...attendance[existingIndex] };
    } else {
      // Create new record
      return await this.create({ studentId, date, status, notes });
    }
  }

  async getAttendanceRate(studentId, startDate, endDate) {
    await this.delay();
    const records = await this.getByStudentId(studentId);
    
    const filteredRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return recordDate >= start && recordDate <= end;
    });

    if (filteredRecords.length === 0) return 100;

    const presentCount = filteredRecords.filter(record => 
      record.status === "present" || record.status === "excused"
    ).length;

    return Math.round((presentCount / filteredRecords.length) * 100);
  }

  async getClassAttendanceByDate(date) {
    await this.delay();
    const records = await this.getByDate(date);
    
    const summary = {
      present: records.filter(r => r.status === "present").length,
      absent: records.filter(r => r.status === "absent").length,
      late: records.filter(r => r.status === "late").length,
      excused: records.filter(r => r.status === "excused").length,
      total: records.length
    };

    return summary;
  }
}

export default new AttendanceService();