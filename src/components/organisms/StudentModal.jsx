import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StudentModal = ({ isOpen, onClose, student, onSave }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    student_id_c: "",
    email_c: "",
    phone_c: "",
    grade_level_c: "",
    class_c: "",
    photo_url_c: "",
    enrollment_date_c: "",
    status_c: "active"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = onSave || (() => {});
  useEffect(() => {
    if (student) {
      setFormData({
        first_name_c: student.first_name_c || "",
        last_name_c: student.last_name_c || "",
        student_id_c: student.student_id_c || "",
        email_c: student.email_c || "",
        phone_c: student.phone_c || "",
        grade_level_c: student.grade_level_c || "",
        class_c: student.class_c || "",
        photo_url_c: student.photo_url_c || "",
        enrollment_date_c: student.enrollment_date_c || "",
        status_c: student.status_c || "active"
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        studentId: "",
        email: "",
        phone: "",
        gradeLevel: "",
        class: "",
        photoUrl: "",
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: "active"
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.student_id_c.trim()) newErrors.student_id_c = "Student ID is required";
    if (!formData.grade_level_c.trim()) newErrors.grade_level_c = "Grade level is required";
    if (!formData.class_c.trim()) newErrors.class_c = "Class is required";
    
    if (formData.email_c && !/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {student ? "Edit Student" : "Add New Student"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={errors.firstName}
                placeholder="Enter first name"
              />
              
              <FormField
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                error={errors.lastName}
                placeholder="Enter last name"
              />
            </div>

            <FormField
              label="Student ID"
              required
              value={formData.studentId}
              onChange={(e) => handleChange("studentId", e.target.value)}
              error={errors.studentId}
              placeholder="Enter student ID"
            />

            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              placeholder="student@school.edu"
            />

            <FormField
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="(555) 123-4567"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Grade Level"
                required
                type="select"
                value={formData.gradeLevel}
                onChange={(e) => handleChange("gradeLevel", e.target.value)}
                error={errors.gradeLevel}
              >
                <option value="">Select grade level</option>
                <option value="9th Grade">9th Grade</option>
                <option value="10th Grade">10th Grade</option>
                <option value="11th Grade">11th Grade</option>
                <option value="12th Grade">12th Grade</option>
              </FormField>

              <FormField
                label="Class"
                required
                value={formData.class}
                onChange={(e) => handleChange("class", e.target.value)}
                error={errors.class}
                placeholder="e.g., Class A"
              />
            </div>

<FormField
              label="Photo URL"
              type="url"
              value={formData.photo_url_c}
              onChange={(e) => handleChange("photo_url_c", e.target.value)}
              error={errors.photo_url_c}
              placeholder="https://example.com/photo.jpg"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Enrollment Date"
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => handleChange("enrollmentDate", e.target.value)}
                error={errors.enrollmentDate}
              />

              <FormField
                label="Status"
                type="select"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                error={errors.status}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </FormField>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  student ? "Update" : "Add Student"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;