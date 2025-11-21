import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import { toast } from "react-toastify";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("month");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load reports data. Please try again.");
      console.error("Error loading reports data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getFilteredStudents = () => {
    let filtered = [...students];
    
    if (selectedClass !== "all") {
      filtered = filtered.filter(s => s.class === selectedClass);
    }
    
    if (selectedGrade !== "all") {
      filtered = filtered.filter(s => s.gradeLevel === selectedGrade);
    }
    
    return filtered;
  };

  const getDateRangeFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case "week":
        return subWeeks(now, 1);
      case "month":
        return subMonths(now, 1);
      case "semester":
        return subMonths(now, 4);
      default:
        return subMonths(now, 1);
    }
  };

  const calculateReportStats = () => {
    const filteredStudents = getFilteredStudents();
    const startDate = getDateRangeFilter();
    
    // Overall stats
    const totalStudents = filteredStudents.length;
    const activeStudents = filteredStudents.filter(s => s.status === "active").length;
    
    // Grade statistics
    const studentGradeAverages = filteredStudents.map(student => {
      const studentGrades = grades.filter(g => 
        g.studentId === student.studentId &&
        new Date(g.date) >= startDate
      );
      
      const avgGrade = studentGrades.length > 0 
        ? studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length
        : 0;
        
      return { ...student, avgGrade };
    });

    const classAverage = studentGradeAverages.length > 0
      ? Math.round(studentGradeAverages.reduce((sum, s) => sum + s.avgGrade, 0) / studentGradeAverages.length)
      : 0;

    const highPerformers = studentGradeAverages.filter(s => s.avgGrade >= 90).length;
    const atRiskStudents = studentGradeAverages.filter(s => s.avgGrade < 70 && s.avgGrade > 0).length;

    // Attendance statistics
    const attendanceInRange = attendance.filter(a => new Date(a.date) >= startDate);
    const totalAttendanceRecords = attendanceInRange.length;
    const presentRecords = attendanceInRange.filter(a => a.status === "present" || a.status === "excused").length;
    const attendanceRate = totalAttendanceRecords > 0 
      ? Math.round((presentRecords / totalAttendanceRecords) * 100)
      : 100;

    return {
      totalStudents,
      activeStudents,
      classAverage,
      attendanceRate,
      highPerformers,
      atRiskStudents,
      studentGradeAverages: studentGradeAverages.filter(s => s.avgGrade > 0).slice(0, 10)
    };
  };

  const getSubjectPerformance = () => {
    const subjects = ["Mathematics", "English", "Science", "History", "Physical Education"];
    const filteredStudents = getFilteredStudents();
    const startDate = getDateRangeFilter();
    
    return subjects.map(subject => {
      const subjectGrades = grades.filter(g => 
        g.subject === subject &&
        new Date(g.date) >= startDate &&
        filteredStudents.some(s => s.studentId === g.studentId)
      );
      
      const average = subjectGrades.length > 0
        ? Math.round(subjectGrades.reduce((sum, g) => sum + g.percentage, 0) / subjectGrades.length)
        : 0;
        
      return { subject, average, count: subjectGrades.length };
    });
  };

  const getAttendanceTrends = () => {
    const filteredStudents = getFilteredStudents();
    const startDate = getDateRangeFilter();
    
    const attendanceInRange = attendance.filter(a => 
      new Date(a.date) >= startDate &&
      filteredStudents.some(s => s.studentId === a.studentId)
    );

    const groupedByStatus = {
      present: attendanceInRange.filter(a => a.status === "present").length,
      absent: attendanceInRange.filter(a => a.status === "absent").length,
      late: attendanceInRange.filter(a => a.status === "late").length,
      excused: attendanceInRange.filter(a => a.status === "excused").length
    };

    return groupedByStatus;
  };

  const exportReport = () => {
    const stats = calculateReportStats();
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange,
      filters: { selectedClass, selectedGrade },
      statistics: stats,
      subjectPerformance: getSubjectPerformance(),
      attendanceTrends: getAttendanceTrends()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `classtrack-report-${format(new Date(), "yyyy-MM-dd")}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success("Report exported successfully");
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  const stats = calculateReportStats();
  const subjectPerformance = getSubjectPerformance();
  const attendanceTrends = getAttendanceTrends();

  const uniqueClasses = [...new Set(students.map(s => s.class))];
  const uniqueGrades = [...new Set(students.map(s => s.gradeLevel))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        title="Reports"
        subtitle="Comprehensive performance and attendance analytics"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={exportReport}>
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="primary">
              <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="semester">This Semester</option>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <Select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="all">All Classes</option>
                  {uniqueClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                <Select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                >
                  <option value="all">All Grades</option>
                  {uniqueGrades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDateRange("month");
                    setSelectedClass("all");
                    setSelectedGrade("all");
                  }}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Students in Report"
            value={stats.totalStudents}
            icon="Users"
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Class Average"
            value={`${stats.classAverage}%`}
            icon="TrendingUp"
            change={stats.classAverage >= 80 ? "Excellent" : stats.classAverage >= 70 ? "Good" : "Needs Improvement"}
            changeType={stats.classAverage >= 75 ? "positive" : "negative"}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon="Calendar"
            change={stats.attendanceRate >= 90 ? "Excellent" : stats.attendanceRate >= 80 ? "Good" : "Poor"}
            changeType={stats.attendanceRate >= 85 ? "positive" : "negative"}
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
          <StatCard
            title="At Risk Students"
            value={stats.atRiskStudents}
            icon="AlertTriangle"
            change={stats.atRiskStudents === 0 ? "All on track!" : "Need attention"}
            changeType={stats.atRiskStudents === 0 ? "positive" : "negative"}
            iconColor="text-red-600"
            iconBg="bg-red-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" className="w-5 h-5 text-primary-600" />
                <span>Subject Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectPerformance.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{subject.subject}</div>
                      <div className="text-sm text-gray-500">{subject.count} grades recorded</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{subject.average}%</div>
                      <div className={`text-sm ${
                        subject.average >= 85 ? "text-green-600" :
                        subject.average >= 75 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {subject.average >= 85 ? "Excellent" :
                         subject.average >= 75 ? "Good" : "Needs Work"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="PieChart" className="w-5 h-5 text-primary-600" />
                <span>Attendance Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Present</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{attendanceTrends.present}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Absent</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">{attendanceTrends.absent}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Late</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{attendanceTrends.late}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Excused</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{attendanceTrends.excused}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        {stats.studentGradeAverages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Award" className="w-5 h-5 text-primary-600" />
                <span>Student Performance Rankings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Student</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Class</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Grade Level</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Average</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.studentGradeAverages
                      .sort((a, b) => b.avgGrade - a.avgGrade)
                      .slice(0, 10)
                      .map((student, index) => (
                      <tr key={student.Id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {index < 3 && (
                              <ApperIcon 
                                name="Award" 
                                className={`w-4 h-4 mr-2 ${
                                  index === 0 ? "text-yellow-500" :
                                  index === 1 ? "text-gray-400" : "text-yellow-600"
                                }`}
                              />
                            )}
                            <span className="font-medium">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{student.studentId}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{student.class}</td>
                        <td className="px-4 py-3 text-gray-600">{student.gradeLevel}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold ${
                            student.avgGrade >= 90 ? "text-green-600" :
                            student.avgGrade >= 80 ? "text-blue-600" :
                            student.avgGrade >= 70 ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {Math.round(student.avgGrade)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reports;