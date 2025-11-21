import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const studentsData = await studentService.getAll();
      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (err) {
      setError("Failed to load students. Please try again.");
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Filter students based on search query and filters
  useEffect(() => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
student.first_name_c.toLowerCase().includes(query) ||
        student.last_name_c.toLowerCase().includes(query) ||
        student.student_id_c.toLowerCase().includes(query) ||
        student.email_c.toLowerCase().includes(query)
      );
    }

    // Apply status filter
if (statusFilter !== "all") {
      filtered = filtered.filter(student => student.status_c === statusFilter);
    }
    
    // Apply grade filter
    if (gradeFilter !== "all") {
      filtered = filtered.filter(student => student.gradeLevel === gradeFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchQuery, statusFilter, gradeFilter]);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await studentService.delete(student.Id);
        await loadStudents();
        toast.success("Student deleted successfully");
      } catch (err) {
        toast.error("Failed to delete student");
        console.error("Error deleting student:", err);
      }
    }
  };

  const handleViewStudent = (student) => {
    // For now, just show a toast. In a real app, this might navigate to a detail view
    toast.info(`Viewing ${student.firstName} ${student.lastName}`);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (selectedStudent) {
        await studentService.update(selectedStudent.Id, studentData);
        toast.success("Student updated successfully");
      } else {
        await studentService.create(studentData);
        toast.success("Student added successfully");
      }
      await loadStudents();
    } catch (err) {
      toast.error(`Failed to ${selectedStudent ? "update" : "add"} student`);
      console.error("Error saving student:", err);
      throw err;
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadStudents} />;

  const gradeOptions = [
    "9th Grade",
    "10th Grade", 
    "11th Grade",
    "12th Grade"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        title="Students"
        subtitle={`Manage your ${students.length} students`}
        actions={
          <Button onClick={handleAddStudent} className="bg-gradient-to-r from-primary-600 to-primary-700">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students by name, ID, or email..."
              />
            </div>
            
            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </Select>
            </div>

            <div>
              <Select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full"
              >
                <option value="all">All Grades</option>
                {gradeOptions.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {filteredStudents.length} of {students.length} students
            </div>
            {(searchQuery || statusFilter !== "all" || gradeFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setGradeFilter("all");
                }}
                className="text-primary-600 hover:text-primary-700"
              >
                <ApperIcon name="X" className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Students Table */}
        {filteredStudents.length === 0 ? (
          <Empty
            title="No students found"
            description={
              searchQuery || statusFilter !== "all" || gradeFilter !== "all"
                ? "Try adjusting your search criteria or filters."
                : "Get started by adding your first student to the system."
            }
            actionLabel="Add Student"
            onAction={handleAddStudent}
            icon="Users"
          />
        ) : (
          <StudentTable
            students={filteredStudents}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onView={handleViewStudent}
          />
        )}
      </div>

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />
    </div>
  );
};

export default Students;