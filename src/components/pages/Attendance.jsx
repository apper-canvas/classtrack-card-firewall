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
import attendanceService from "@/services/api/attendanceService";
import { format, startOfWeek, addDays, subWeeks, addWeeks } from "date-fns";
import { toast } from "react-toastify";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      
setStudents(studentsData.filter(s => s.status_c === "active"));
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
      console.error("Error loading attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getWeekDays = () => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
    return Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)); // Monday to Friday
  };

const getAttendanceRecord = (studentId, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendance.find(a => a.student_id_c?.Id === studentId && a.date_c === dateStr);
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      present: "success",
      absent: "error", 
      late: "warning",
      excused: "info"
    };
    return variants[status] || "default";
  };

const handleAttendanceClick = async (student, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = getAttendanceRecord(student.Id, date);
    
    const statuses = ["present", "absent", "late", "excused"];
    const currentIndex = existing ? statuses.indexOf(existing.status_c) : -1;
    const nextIndex = (currentIndex + 1) % statuses.length;
    const newStatus = statuses[nextIndex];

    try {
      await attendanceService.markAttendance(student.Id, dateStr, newStatus);
      await loadData();
      toast.success(`Marked ${student.first_name_c} as ${newStatus} for ${format(date, "MMM dd")}`);
    } catch (err) {
      toast.error("Failed to update attendance");
      console.error("Error updating attendance:", err);
    }
  };

  const calculateAttendanceStats = () => {
    const weekDays = getWeekDays();
    const totalPossible = students.length * weekDays.length;
    
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;

weekDays.forEach(date => {
      students.forEach(student => {
        const record = getAttendanceRecord(student.Id, date);
        if (record) {
          switch (record.status_c) {
            case "present":
              presentCount++;
              break;
            case "absent":
              absentCount++;
              break;
            case "late":
              lateCount++;
              break;
            case "excused":
              excusedCount++;
              break;
            default:
              break;
          }
        }
      });
    });
    const attendanceRate = totalPossible > 0 ? Math.round(((presentCount + excusedCount) / totalPossible) * 100) : 0;

    return {
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      attendanceRate,
      totalPossible
    };
  };

  const navigateWeek = (direction) => {
    if (direction === "prev") {
      setCurrentWeek(subWeeks(currentWeek, 1));
    } else {
      setCurrentWeek(addWeeks(currentWeek, 1));
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header title="Attendance" subtitle="Track daily student attendance" />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Empty
            title="No active students found"
            description="Add some students first before you can track attendance."
            actionLabel="Go to Students"
            onAction={() => window.location.href = "/students"}
            icon="Calendar"
          />
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();
  const stats = calculateAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        title="Attendance"
        subtitle={`Track attendance for ${students.length} active students`}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="primary">
              <ApperIcon name="Users" className="w-4 h-4 mr-2" />
              Bulk Mark
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Weekly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">Present</div>
              <div className="text-2xl font-bold text-green-600">{stats.presentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">Absent</div>
              <div className="text-2xl font-bold text-red-600">{stats.absentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">Late</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.lateCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">Attendance Rate</div>
              <div className="text-2xl font-bold text-primary-600">{stats.attendanceRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Week Navigation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Calendar" className="w-5 h-5 text-primary-600" />
                <span>Weekly Attendance</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek("prev")}
                >
                  <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-gray-700 px-3">
                  Week of {format(weekDays[0], "MMM dd, yyyy")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek("next")}
                >
                  <ApperIcon name="ChevronRight" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Student
                    </th>
                    {weekDays.map((day) => (
                      <th key={day.toISOString()} className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                        <div>{format(day, "EEE")}</div>
                        <div className="text-xs text-gray-500">{format(day, "MM/dd")}</div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Weekly %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
{students.map((student) => {
                    const studentRecords = weekDays.map(day => getAttendanceRecord(student.Id, day));
                    const presentDays = studentRecords.filter(r => r && (r.status_c === "present" || r.status_c === "excused")).length;
                    const weeklyRate = Math.round((presentDays / weekDays.length) * 100);

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
                        {weekDays.map((day) => {
const record = getAttendanceRecord(student.Id, day);
                          return (
                            <td key={day.toISOString()} className="px-4 py-4 text-center">
                              <button
                                onClick={() => handleAttendanceClick(student, day)}
                                className="inline-flex items-center justify-center w-12 h-8 hover:scale-105 transition-transform duration-150"
                              >
                                {record ? (
                                  <Badge variant={getStatusBadgeVariant(record.status_c)} className="text-xs">
                                    {record.status_c.charAt(0).toUpperCase()}
                                  </Badge>
                                ) : (
                                  <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-primary-400 hover:bg-primary-50 transition-colors duration-150">
                                    <ApperIcon name="Plus" className="w-3 h-3 text-gray-400" />
                                  </div>
                                )}
                              </button>
                            </td>
                          );
                        })}
                        <td className="px-4 py-4 text-center">
                          <div className="font-semibold text-gray-900">
                            {weeklyRate}%
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
                <span>Click on any attendance cell to cycle through: Present → Absent → Late → Excused</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;