import mockStudents from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.storageKey = "classtrack_students";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(mockStudents));
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
    const students = await this.getAll();
    const student = students.find(s => s.Id === parseInt(id));
    return student ? { ...student } : null;
  }

  async create(studentData) {
    await this.delay();
    const students = await this.getAll();
    const highestId = students.reduce((max, student) => Math.max(max, student.Id), 0);
    
    const newStudent = {
      Id: highestId + 1,
      ...studentData,
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0]
    };

    const updatedStudents = [...students, newStudent];
    localStorage.setItem(this.storageKey, JSON.stringify(updatedStudents));
    return { ...newStudent };
  }

  async update(id, studentData) {
    await this.delay();
    const students = await this.getAll();
    const index = students.findIndex(s => s.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Student not found");
    }

    const updatedStudent = { ...students[index], ...studentData, Id: parseInt(id) };
    students[index] = updatedStudent;
    
    localStorage.setItem(this.storageKey, JSON.stringify(students));
    return { ...updatedStudent };
  }

  async delete(id) {
    await this.delay();
    const students = await this.getAll();
    const filteredStudents = students.filter(s => s.Id !== parseInt(id));
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredStudents));
    return { success: true };
  }

  async getByClass(className) {
    await this.delay();
    const students = await this.getAll();
    return students.filter(s => s.class === className);
  }

  async getByGradeLevel(gradeLevel) {
    await this.delay();
    const students = await this.getAll();
    return students.filter(s => s.gradeLevel === gradeLevel);
  }

  async search(query) {
    await this.delay();
    const students = await this.getAll();
    const searchTerm = query.toLowerCase();
    
    return students.filter(student => 
      student.firstName.toLowerCase().includes(searchTerm) ||
      student.lastName.toLowerCase().includes(searchTerm) ||
      student.studentId.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm)
    );
  }
}

export default new StudentService();