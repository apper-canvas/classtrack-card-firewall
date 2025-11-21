import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StudentModal = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
    phone: "",
    gradeLevel: "",
    class: "",
    photoUrl: "",
    enrollmentDate: "",
    status: "active"
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        studentId: student.studentId || "",
        email: student.email || "",
        phone: student.phone || "",
        gradeLevel: student.gradeLevel || "",
        class: student.class || "",
        photoUrl: student.photoUrl || "",
        enrollmentDate: student.enrollmentDate || "",
        status: student.status || "active"
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
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!formData.gradeLevel.trim()) newErrors.gradeLevel = "Grade level is required";
    if (!formData.class.trim()) newErrors.class = "Class is required";
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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
              value={formData.photoUrl}
              onChange={(e) => handleChange("photoUrl", e.target.value)}
              error={errors.photoUrl}
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