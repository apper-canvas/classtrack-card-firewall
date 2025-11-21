import React, { useState, useEffect } from 'react';
import Header from '@/components/organisms/Header';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import departmentService from '@/services/api/departmentService';
import { toast } from 'react-toastify';

const DepartmentModal = ({ isOpen, onClose, department, onSave }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    description_c: '',
    location_c: '',
    phone_c: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      setFormData({
        Name: department.Name || '',
        Tags: department.Tags || '',
        description_c: department.description_c || '',
        location_c: department.location_c || '',
        phone_c: department.phone_c || ''
      });
    } else {
      setFormData({
        Name: '',
        Tags: '',
        description_c: '',
        location_c: '',
        phone_c: ''
      });
    }
    setErrors({});
  }, [department, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Name?.trim()) {
      newErrors.Name = 'Department name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await onSave(formData);
      if (result) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {department ? 'Edit Department' : 'Add New Department'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                errors.Name
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter department name"
              disabled={loading}
            />
            {errors.Name && (
              <p className="mt-1 text-sm text-red-600">{errors.Name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={formData.Tags}
              onChange={(e) => setFormData({ ...formData, Tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tags (comma separated)"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description_c}
              onChange={(e) => setFormData({ ...formData, description_c: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter department description"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location_c}
              onChange={(e) => setFormData({ ...formData, location_c: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone_c}
              onChange={(e) => setFormData({ ...formData, phone_c: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                department ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DepartmentTable = ({ departments, onEdit, onDelete, onView }) => {
  if (!departments || departments.length === 0) {
    return (
      <Empty
        title="No departments found"
        description="Get started by creating your first department"
        actionLabel="Add Department"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Phone</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.Id}>
                <td>
                  <div className="font-medium text-gray-900">
                    {department.Name}
                  </div>
                  {department.description_c && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {department.description_c}
                    </div>
                  )}
                </td>
                <td>
                  <span className="text-gray-900">
                    {department.location_c || '-'}
                  </span>
                </td>
                <td>
                  <span className="text-gray-900">
                    {department.phone_c || '-'}
                  </span>
                </td>
                <td>
                  {department.Tags ? (
                    <div className="flex flex-wrap gap-1">
                      {department.Tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">No tags</span>
                  )}
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(department)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(department)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ApperIcon name="Pencil" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(department)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <ApperIcon name="Trash2" size={16} />
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

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter(department =>
        department.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        department.location_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        department.description_c?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDepartments(filtered);
    }
  }, [departments, searchQuery]);

  const loadDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError("Failed to load departments");
      console.error("Error loading departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteDepartment = async (department) => {
    if (!window.confirm(`Are you sure you want to delete "${department.Name}"?`)) {
      return;
    }

    const success = await departmentService.delete(department.Id);
    if (success) {
      await loadDepartments();
    }
  };

  const handleSaveDepartment = async (departmentData) => {
    let result = null;

    if (modalMode === 'create') {
      result = await departmentService.create(departmentData);
    } else if (modalMode === 'edit') {
      result = await departmentService.update(selectedDepartment.Id, departmentData);
    }

    if (result) {
      await loadDepartments();
      return result;
    }
    return null;
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={loadDepartments}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Departments"
        subtitle={`${departments.length} department${departments.length !== 1 ? 's' : ''} total`}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search departments..."
          className="flex-1 max-w-md"
        />
        <Button onClick={handleAddDepartment} className="shrink-0">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Department
        </Button>
      </div>

      <DepartmentTable
        departments={filteredDepartments}
        onEdit={handleEditDepartment}
        onDelete={handleDeleteDepartment}
        onView={handleViewDepartment}
      />

      <DepartmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        department={modalMode === 'edit' ? selectedDepartment : null}
        onSave={handleSaveDepartment}
      />
    </div>
  );
}