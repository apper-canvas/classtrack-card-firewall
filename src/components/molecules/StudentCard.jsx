import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const StudentCard = ({ student, onEdit, onDelete, onView }) => {
  const getStatusVariant = (status) => {
    const variants = {
      active: "success",
      inactive: "error",
      graduated: "info"
    };
    return variants[status] || "default";
  };

  return (
    <Card hover className="group">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shrink-0">
            {student.photoUrl ? (
              <img 
                src={student.photoUrl} 
                alt={`${student.firstName} ${student.lastName}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-primary-600">
                {student.firstName[0]}{student.lastName[0]}
              </span>
            )}
          </div>

          {/* Student Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {student.firstName} {student.lastName}
              </h3>
              <Badge variant={getStatusVariant(student.status)}>
                {student.status}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">ID:</span> {student.studentId}</p>
              <p><span className="font-medium">Class:</span> {student.class}</p>
              <p><span className="font-medium">Grade:</span> {student.gradeLevel}</p>
              {student.email && (
                <p><span className="font-medium">Email:</span> {student.email}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(student)}
              className="text-xs"
            >
              <ApperIcon name="Eye" className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(student)}
              className="text-xs"
            >
              <ApperIcon name="Edit2" className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(student)}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;