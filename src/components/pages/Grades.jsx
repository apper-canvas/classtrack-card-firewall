import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import { toast } from "react-toastify";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const subjects = ["Mathematics", "English", "Science", "History", "Physical Education"];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll()
      ]);
      
setStudents(studentsData.filter(s => s.status_c === "active"));
      setGrades(gradesData);
    } catch (err) {
      setError("Failed to load grades data. Please try again.");
      console.error("Error loading grades data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStudentGrade = (studentId, subject) => {
return grades.find(g => g.student_id_c?.Id === studentId && g.subject_c === subject);
  };

const getGradeBadgeVariant = (grade) => {
    if (!grade) return "default";
    if (grade.percentage_c >= 90) return "success";
    if (grade.percentage_c >= 80) return "info";
    if (grade.percentage_c >= 70) return "warning";
    return "error";
  };

const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.student_id_c?.Id === studentId);
    if (studentGrades.length === 0) return 0;
    
    const total = studentGrades.reduce((sum, grade) => sum + grade.percentage_c, 0);
    return Math.round(total / studentGrades.length);
  };

const calculateSubjectAverage = (subject) => {
    const subjectGrades = grades.filter(g => g.subject_c === subject);
    if (subjectGrades.length === 0) return 0;
    
    const total = subjectGrades.reduce((sum, grade) => sum + grade.percentage_c, 0);
    return Math.round(total / subjectGrades.length);
  };

const handleGradeClick = (student, subject) => {
    const existingGrade = getStudentGrade(student.Id, subject);
    const newScore = prompt(
      `Enter grade for ${student.first_name_c} ${student.last_name_c} - ${subject}:`,
      existingGrade ? existingGrade.score_c.toString() : ""
    );
    
    if (newScore !== null && newScore.trim() !== "") {
      const score = parseFloat(newScore);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        saveGrade(student.Id, subject, score, 100);
      } else {
        toast.error("Please enter a valid score between 0 and 100");
      }
    }
  };

const saveGrade = async (studentId, subject, score, maxScore) => {
    try {
      const gradeData = {
        student_id_c: studentId,
        subject_c: subject,
        score_c: score,
        max_score_c: maxScore,
        semester_c: "Fall 2024",
        date_c: new Date().toISOString().split('T')[0]
      };

      const existingGrade = getStudentGrade(studentId, subject);
      if (existingGrade) {
        await gradeService.update(existingGrade.Id, gradeData);
        toast.success("Grade updated successfully");
      } else {
        await gradeService.create(gradeData);
        toast.success("Grade added successfully");
      }
      
      await loadData();
    } catch (err) {
      toast.error("Failed to save grade");
      console.error("Error saving grade:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header title="Grades" subtitle="Grade book and performance tracking" />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Empty
            title="No active students found"
            description="Add some students first before you can enter grades."
            actionLabel="Go to Students"
            onAction={() => window.location.href = "/students"}
            icon="BookOpen"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        title="Grades"
        subtitle={`Grade book for ${students.length} active students`}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="primary">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Bulk Import
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:lg-8 space-y-6">
        {/* Subject Averages */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {subjects.map((subject) => {
            const average = calculateSubjectAverage(subject);
            return (
              <Card key={subject}>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">{subject}</div>
                  <div className="text-2xl font-bold text-gray-900">{average}%</div>
                  <div className="text-xs text-gray-500">Class Average</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Grade Book Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BookOpen" className="w-5 h-5 text-primary-600" />
              <span>Grade Book</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Student
                    </th>
                    {subjects.map((subject) => (
                      <th key={subject} className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                        {subject}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Average
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
{students.map((student) => {
                    const studentAverage = calculateStudentAverage(student.Id);
                    return (
                      <tr key={student.Id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary-600">
                                {student.first_name_c[0]}{student.last_name_c[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {student.first_name_c} {student.last_name_c}
                              </div>
                              <div className="text-sm text-gray-500">{student.student_id_c}</div>
                            </div>
                          </div>
                        </td>
                        {subjects.map((subject) => {
const grade = getStudentGrade(student.Id, subject);
                          return (
                            <td key={subject} className="px-4 py-4 text-center">
                              <button
                                onClick={() => handleGradeClick(student, subject)}
                                className="inline-flex items-center justify-center min-w-[60px] hover:scale-105 transition-transform duration-150"
                              >
                                {grade ? (
                                  <Badge variant={getGradeBadgeVariant(grade)}>
                                    {grade.percentage_c}%
                                  </Badge>
                                ) : (
                                  <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-primary-400 hover:bg-primary-50 transition-colors duration-150">
                                    <ApperIcon name="Plus" className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                              </button>
                            </td>
                          );
                        })}
                        <td className="px-4 py-4 text-center">
                          <div className="font-semibold text-gray-900">
                            {studentAverage > 0 ? `${studentAverage}%` : "—"}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <ApperIcon name="Info" className="w-4 h-4" />
                <span>Click on any cell to add or edit grades. Grades are calculated automatically.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Grades;