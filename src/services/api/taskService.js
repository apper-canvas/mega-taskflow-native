import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const tableName = 'task';
      
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "CreatedOn" } },
          { field: { "Name": "CreatedBy" } },
          { field: { "Name": "ModifiedOn" } },
          { field: { "Name": "ModifiedBy" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "created_at" } },
          { field: { "Name": "completed_at" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const tableName = 'task';
      const recordId = parseInt(id, 10);
      
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "CreatedOn" } },
          { field: { "Name": "CreatedBy" } },
          { field: { "Name": "ModifiedOn" } },
          { field: { "Name": "ModifiedBy" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "created_at" } },
          { field: { "Name": "completed_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, recordId, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      toast.error("Failed to fetch task");
      return null;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      const tableName = 'task';
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: taskData.title,
            Tags: taskData.tags || '',
            Owner: taskData.owner || null,
            title: taskData.title,
            description: taskData.description || '',
            priority: taskData.priority || 'medium',
            due_date: taskData.dueDate || null,
            completed: false,
            created_at: new Date().toISOString(),
            completed_at: null
          }
        ]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Task created successfully');
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      const tableName = 'task';
      const recordId = parseInt(id, 10);
      
      // Only include Updateable fields plus Id
      const updateData = {
        Id: recordId
      };
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      if (updates.owner !== undefined) updateData.Owner = updates.owner;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.completed !== undefined) {
        updateData.completed = updates.completed;
        updateData.completed_at = updates.completed ? new Date().toISOString() : null;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Task updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const tableName = 'task';
      const recordId = parseInt(id, 10);
      
      const params = {
        RecordIds: [recordId]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Task deleted successfully');
          return true;
        }
      }
      
      throw new Error('Failed to delete task');
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      const tableName = 'task';
      
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "CreatedOn" } },
          { field: { "Name": "CreatedBy" } },
          { field: { "Name": "ModifiedOn" } },
          { field: { "Name": "ModifiedBy" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "created_at" } },
          { field: { "Name": "completed_at" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching tasks:", error);
      toast.error("Failed to search tasks");
      return [];
    }
  },

  async filter(status = 'all', sortBy = 'created_at') {
    try {
      const apperClient = getApperClient();
      const tableName = 'task';
      
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "CreatedOn" } },
          { field: { "Name": "CreatedBy" } },
          { field: { "Name": "ModifiedOn" } },
          { field: { "Name": "ModifiedBy" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "created_at" } },
          { field: { "Name": "completed_at" } }
        ],
        orderBy: [
          {
            fieldName: sortBy,
            sorttype: sortBy === 'priority' ? "DESC" : "ASC"
          }
        ]
      };
      
      // Add status filter if needed
      if (status === 'active') {
        params.where = [
          {
            FieldName: "completed",
            Operator: "EqualTo",
            Values: ["false"]
          }
        ];
      } else if (status === 'completed') {
        params.where = [
          {
            FieldName: "completed",
            Operator: "EqualTo",
            Values: ["true"]
          }
        ];
      }
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error filtering tasks:", error);
      toast.error("Failed to filter tasks");
      return [];
    }
  }
};

export default taskService;