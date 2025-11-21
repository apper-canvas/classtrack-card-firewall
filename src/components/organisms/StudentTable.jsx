import React from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
  const getStatusVariant = (status) => {
    const variants = {
      active: "success",
      inactive: "error",
      graduated: "info"
    };
    return variants[status] || "default";
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-8 text-center">
          <ApperIcon name="Users" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-500">Get started by adding your first student.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Class</th>
              <th>Grade Level</th>
              <th>Status</th>
              <th>Enrolled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
<tr key={student.Id}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                      {student.photo_url_c ? (
                        <img 
                          src={student.photo_url_c} 
                          alt={`${student.first_name_c} ${student.last_name_c}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-primary-600">
                          {student.first_name_c[0]}{student.last_name_c[0]}
                        </span>
                      )}
                    </div>
                    <div>
<div className="font-medium text-gray-900">
                        {student.first_name_c} {student.last_name_c}
                      </div>
                      {student.email_c && (
                        <div className="text-sm text-gray-500">{student.email_c}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="font-mono text-sm">{student.student_id_c}</td>
                <td>{student.class_c}</td>
                <td>{student.grade_level_c}</td>
                <td>
                  <Badge variant={getStatusVariant(student.status_c)}>
                    {student.status_c}
                  </Badge>
                </td>
                <td className="text-gray-600">{formatDate(student.enrollment_date_c)}</td>
                <td>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(student)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ApperIcon name="Eye" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(student)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(student)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;