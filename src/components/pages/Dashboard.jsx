import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
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
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const calculateStats = () => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === "active").length;
    
    // Calculate average grade
    const validGrades = grades.filter(g => g.percentage && g.percentage > 0);
    const averageGrade = validGrades.length > 0 
      ? Math.round(validGrades.reduce((sum, g) => sum + g.percentage, 0) / validGrades.length)
      : 0;

    // Calculate attendance rate
    const presentRecords = attendance.filter(a => a.status === "present" || a.status === "excused").length;
    const attendanceRate = attendance.length > 0 
      ? Math.round((presentRecords / attendance.length) * 100)
      : 100;

    // Find at-risk students (average grade below 70%)
    const studentGradeAverages = students.map(student => {
      const studentGrades = grades.filter(g => g.studentId === student.studentId);
      const avgGrade = studentGrades.length > 0 
        ? studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length
        : 100;
      return { ...student, avgGrade };
    });
    
    const atRiskStudents = studentGradeAverages.filter(s => s.avgGrade < 70 && s.status === "active").length;

    return {
      totalStudents,
      activeStudents,
      averageGrade,
      attendanceRate,
      atRiskStudents,
      studentGradeAverages: studentGradeAverages.filter(s => s.status === "active").slice(0, 5)
    };
  };

  const getRecentActivity = () => {
    const recentGrades = grades
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(grade => ({
        type: "grade",
        description: `Grade added for ${grade.subject}`,
        value: `${grade.percentage}%`,
        date: grade.date,
        status: grade.percentage >= 70 ? "success" : "warning"
      }));

    const recentAttendance = attendance
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .map(att => ({
        type: "attendance",
        description: `Attendance marked`,
        value: att.status,
        date: att.date,
        status: att.status === "present" ? "success" : att.status === "absent" ? "error" : "warning"
      }));

    return [...recentGrades, ...recentAttendance]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadDashboardData} />;

  const stats = calculateStats();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your students today."
        actions={
          <Button variant="primary" className="bg-gradient-to-r from-primary-600 to-primary-700">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="Users"
            change="+2 this week"
            changeType="positive"
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Active Students"
            value={stats.activeStudents}
            icon="UserCheck"
            change="98% active rate"
            changeType="positive"
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
          <StatCard
            title="Average Grade"
            value={`${stats.averageGrade}%`}
            icon="TrendingUp"
            change="+5% from last month"
            changeType="positive"
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon="Calendar"
            change="Excellent attendance"
            changeType="positive"
            iconColor="text-indigo-600"
            iconBg="bg-indigo-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Activity" className="w-5 h-5 text-primary-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.status === "success" ? "bg-green-100" :
                          activity.status === "warning" ? "bg-yellow-100" :
                          activity.status === "error" ? "bg-red-100" : "bg-gray-100"
                        }`}>
                          <ApperIcon 
                            name={activity.type === "grade" ? "BookOpen" : "Calendar"} 
                            className={`w-5 h-5 ${
                              activity.status === "success" ? "text-green-600" :
                              activity.status === "warning" ? "text-yellow-600" :
                              activity.status === "error" ? "text-red-600" : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                        <Badge variant={activity.status}>
                          {activity.value}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ApperIcon name="Clock" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers & At Risk */}
          <div className="space-y-6">
            {/* At Risk Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5" />
                  <span>At Risk Students</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.atRiskStudents > 0 ? (
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{stats.atRiskStudents}</div>
                      <div className="text-sm text-red-700">Students need attention</div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                      View Details
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <ApperIcon name="CheckCircle" className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <p className="text-sm text-green-600 font-medium">All students on track!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Zap" className="w-5 h-5 text-primary-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="BookOpen" className="w-4 h-4 mr-2" />
                    Enter Grades
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;