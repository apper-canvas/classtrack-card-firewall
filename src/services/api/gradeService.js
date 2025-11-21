import mockGrades from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.storageKey = "classtrack_grades";
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(mockGrades));
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
    const grades = await this.getAll();
    const grade = grades.find(g => g.Id === parseInt(id));
    return grade ? { ...grade } : null;
  }

  async getByStudentId(studentId) {
    await this.delay();
    const grades = await this.getAll();
    return grades.filter(g => g.studentId === studentId);
  }

  async create(gradeData) {
    await this.delay();
    const grades = await this.getAll();
    const highestId = grades.reduce((max, grade) => Math.max(max, grade.Id), 0);
    
    const percentage = (gradeData.score / gradeData.maxScore) * 100;
    const letterGrade = this.calculateLetterGrade(percentage);
    
    const newGrade = {
      Id: highestId + 1,
      ...gradeData,
      percentage: Math.round(percentage * 100) / 100,
      letterGrade,
      date: gradeData.date || new Date().toISOString().split('T')[0]
    };

    const updatedGrades = [...grades, newGrade];
    localStorage.setItem(this.storageKey, JSON.stringify(updatedGrades));
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await this.delay();
    const grades = await this.getAll();
    const index = grades.findIndex(g => g.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Grade not found");
    }

    const percentage = (gradeData.score / gradeData.maxScore) * 100;
    const letterGrade = this.calculateLetterGrade(percentage);

    const updatedGrade = {
      ...grades[index],
      ...gradeData,
      Id: parseInt(id),
      percentage: Math.round(percentage * 100) / 100,
      letterGrade
    };
    grades[index] = updatedGrade;
    
    localStorage.setItem(this.storageKey, JSON.stringify(grades));
    return { ...updatedGrade };
  }

  async delete(id) {
    await this.delay();
    const grades = await this.getAll();
    const filteredGrades = grades.filter(g => g.Id !== parseInt(id));
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredGrades));
    return { success: true };
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
    await this.delay();
    const grades = await this.getAll();
    return grades.filter(g => g.subject === subject);
  }

  async getAverageGrade(studentId) {
    await this.delay();
    const grades = await this.getByStudentId(studentId);
    if (grades.length === 0) return 0;
    
    const total = grades.reduce((sum, grade) => sum + grade.percentage, 0);
    return Math.round((total / grades.length) * 100) / 100;
  }
}

export default new GradeService();