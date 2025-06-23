
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, User as UserIcon } from 'lucide-react';

const SettingsPage = () => {
  const [isEditingRoles, setIsEditingRoles] = useState(false);
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', description: 'Full system access', permissions: ['read', 'write', 'delete'] },
    { id: 2, name: 'Manager', description: 'Department management', permissions: ['read', 'write'] },
    { id: 3, name: 'Underwriter', description: 'Policy management', permissions: ['read', 'write'] },
    { id: 4, name: 'Support', description: 'Customer support', permissions: ['read'] }
  ]);
  const [activeRoleId, setActiveRoleId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState({ name: '', description: '', permissions: [''] });
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [userToReset, setUserToReset] = useState({ email: '', name: '' });
  const { toast } = useToast();
  const { resetLoginAttempts } = useUser();

  // Mock users for demo
  const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@insuremojo.co.ke', role: 'Admin' },
    { id: 2, name: 'John Underwriter', email: 'underwriter@insuremojo.co.ke', role: 'Underwriter' },
    { id: 3, name: 'Support Agent', email: 'support@insuremojo.co.ke', role: 'Support' },
    { id: 4, name: 'Wanjiku Kamau', email: 'wanjiku@example.com', role: 'User' }
  ];

  const generateGuidePDF = () => {
    // In a real app, this would generate or fetch a PDF
    // For demo, we'll direct to the markdown file
    toast({
      title: "Documentation Downloaded",
      description: "The user management guide has been downloaded.",
    });
    
    // Create a blob link to the markdown
    fetch('/src/docs/UserManagementGuide.md')
      .then(response => response.text())
      .then(text => {
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'UserManagementGuide.md';
        a.click();
      });
  };

  // Role management functions
  const handleAddRole = () => {
    setRoles([
      ...roles,
      { 
        id: roles.length + 1, 
        name: 'New Role', 
        description: 'Role description', 
        permissions: ['read'] 
      }
    ]);
    toast({
      title: "Role Added",
      description: "New role has been added successfully.",
    });
  };

  const handleEditRole = (id: number) => {
    setActiveRoleId(id);
    const role = roles.find(r => r.id === id);
    if (role) {
      setEditingRole({
        name: role.name,
        description: role.description,
        permissions: [...role.permissions]
      });
    }
    setIsEditingRoles(true);
  };

  const handleUpdateRole = () => {
    if (activeRoleId === null) return;
    
    const updatedRoles = roles.map(role => {
      if (role.id === activeRoleId) {
        return {
          ...role,
          name: editingRole.name,
          description: editingRole.description,
          permissions: [...editingRole.permissions]
        };
      }
      return role;
    });
    
    setRoles(updatedRoles);
    setActiveRoleId(null);
    setIsEditingRoles(false);
    
    toast({
      title: "Role Updated",
      description: "Role has been updated successfully.",
    });
  };

  const handleSaveRoles = () => {
    setIsEditingRoles(false);
    toast({
      title: "Changes Saved",
      description: "Role changes have been saved successfully.",
    });
  };

  // User management
  const handleAddTeamMember = () => {
    toast({
      title: "Team Member Added",
      description: "New team member has been added successfully.",
    });
  };

  const handleOpenResetDialog = (user: { email: string, name: string }) => {
    setUserToReset(user);
    setIsResetDialogOpen(true);
  };

  const handleResetUserLoginAttempts = () => {
    resetLoginAttempts();
    toast({
      title: "Login Attempts Reset",
      description: `Login attempts for ${userToReset.name} have been reset successfully.`,
    });
    setIsResetDialogOpen(false);
  };

  const handleDownloadDocumentation = () => {
    const content = `
# InsureMojo Insurance System Documentation

## Introduction
InsureMojo is a comprehensive insurance management system designed to streamline policy administration, claims processing, customer management, and financial operations.

## System Overview
The system consists of modules for policy management, claims handling, customer relationship management, and financial tracking.

## User Roles
- Admin: Full system access
- Underwriter: Policy management focus
- Support: Customer service focus
- Manager: Department oversight
- User: Policy holder access

## Getting Started
1. Login with your credentials
2. Navigate through the dashboard
3. Access your assigned modules based on role

## For more information
Contact the IT department or refer to detailed module guides.
    `;

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'InsureMojo_Documentation.pdf';
    a.click();
    
    toast({
      title: "Documentation Downloaded",
      description: "The system documentation has been downloaded successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Team Members</h3>
                <Button onClick={handleAddTeamMember}>Add Team Member</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-gray-500 mb-4">Reset login attempts for specific users</p>
                <div className="space-y-4">
                  {mockUsers.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-2 border-b">
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenResetDialog(user)}
                      >
                        Reset Login
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Role Management */}
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Configure user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">System Roles</h3>
                <div className="space-x-2">
                  {isEditingRoles ? (
                    <Button onClick={handleSaveRoles}>Save Changes</Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setIsEditingRoles(true)}>Edit Roles</Button>
                      <Button onClick={handleAddRole}>Add New Role</Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="border rounded-md divide-y">
                {roles.map(role => (
                  <div key={role.id} className="p-3 flex justify-between items-center">
                    <div>
                      {activeRoleId === role.id ? (
                        <div className="space-y-2">
                          <div>
                            <Label htmlFor="role-name">Role Name</Label>
                            <Input 
                              id="role-name" 
                              value={editingRole.name} 
                              onChange={e => setEditingRole({...editingRole, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="role-desc">Description</Label>
                            <Input 
                              id="role-desc" 
                              value={editingRole.description} 
                              onChange={e => setEditingRole({...editingRole, description: e.target.value})}
                            />
                          </div>
                          <Button onClick={handleUpdateRole}>Update</Button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-medium">{role.name}</h4>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </>
                      )}
                    </div>
                    {isEditingRoles && activeRoleId !== role.id && (
                      <Button variant="ghost" size="sm" onClick={() => handleEditRole(role.id)}>Edit</Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* System Documentation */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>System Documentation</CardTitle>
              <CardDescription>Access system guides and documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">User Management Guide</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Complete guide for managing users, roles and permissions
                  </p>
                  <Button onClick={generateGuidePDF}>Download Guide</Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">System Documentation</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Complete system documentation in PDF format
                  </p>
                  <Button onClick={handleDownloadDocumentation}>Download Documentation</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reset Login Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Login Attempts</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset login attempts for {userToReset.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
            <Mail className="h-5 w-5 text-gray-500" />
            <span>{userToReset.email}</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResetUserLoginAttempts}>Reset Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SettingsPage;
