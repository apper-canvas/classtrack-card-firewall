import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class DepartmentService {
  constructor() {
    this.apperClient = null;
  }

  async initClient() {
    if (!this.apperClient) {
      this.apperClient = getApperClient();
    }
    return this.apperClient;
  }

  async getAll() {
    try {
      const client = await this.initClient();
      if (!client) {
        throw new Error('Apper client not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await client.fetchRecords('departments_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching departments:", error?.response?.data?.message || error);
      toast.error("Failed to load departments");
      return [];
    }
  }

  async getById(id) {
    try {
      const client = await this.initClient();
      if (!client) {
        throw new Error('Apper client not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await client.getRecordById('departments_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load department details");
      return null;
    }
  }

  async create(departmentData) {
    try {
      const client = await this.initClient();
      if (!client) {
        throw new Error('Apper client not initialized');
      }

      // Only include Updateable fields
      const params = {
        records: [{
          Name: departmentData.Name || '',
          Tags: departmentData.Tags || '',
          description_c: departmentData.description_c || '',
          location_c: departmentData.location_c || '',
          phone_c: departmentData.phone_c || ''
        }]
      };

      const response = await client.createRecord('departments_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} departments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Department created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating department:", error?.response?.data?.message || error);
      toast.error("Failed to create department");
      return null;
    }
  }

  async update(id, departmentData) {
    try {
      const client = await this.initClient();
      if (!client) {
        throw new Error('Apper client not initialized');
      }

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: departmentData.Name || '',
          Tags: departmentData.Tags || '',
          description_c: departmentData.description_c || '',
          location_c: departmentData.location_c || '',
          phone_c: departmentData.phone_c || ''
        }]
      };

      const response = await client.updateRecord('departments_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} departments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Department updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating department:", error?.response?.data?.message || error);
      toast.error("Failed to update department");
      return null;
    }
  }

  async delete(id) {
    try {
      const client = await this.initClient();
      if (!client) {
        throw new Error('Apper client not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await client.deleteRecord('departments_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Department deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting department:", error?.response?.data?.message || error);
      toast.error("Failed to delete department");
      return false;
    }
  }

  async search(query) {
    try {
      const client = await this.initClient();
      if (!client) {
        throw new Error('Apper client not initialized');
      }

      if (!query || query.trim() === '') {
        return await this.getAll();
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "Name",
                  "operator": "Contains",
                  "values": [query.trim()]
                }
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {
                  "fieldName": "location_c",
                  "operator": "Contains",
                  "values": [query.trim()]
                }
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await client.fetchRecords('departments_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching departments:", error?.response?.data?.message || error);
      toast.error("Failed to search departments");
      return [];
    }
  }
}

const departmentService = new DepartmentService();
export default departmentService;