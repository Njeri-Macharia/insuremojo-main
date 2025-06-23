import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InsurancePolicy, InsuranceCategory } from '@/models/types';
import PolicyTable from '@/components/admin/PolicyTable';
import { useToast } from '@/hooks/use-toast';

// Mock data since we don't have a backend connection
const mockPolicies: InsurancePolicy[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `policy-${i+1}`,
  userId: `user-${i % 5 + 1}`,
  purchasePrice: Math.round(1000 + Math.random() * 9000),
  coverageAmount: Math.round(10000 + Math.random() * 90000),
  premium: Math.round(100 + Math.random() * 900),
  purchaseDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  startDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  endDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  status: ['active', 'pending', 'cancelled', 'expired'][Math.floor(Math.random() * 4)] as any,
  itemName: `Item ${i+1}`,
  itemDescription: `Description for item ${i+1}`,
  category: ['electronics', 'household', 'personal', 'other'][Math.floor(Math.random() * 4)] as InsuranceCategory,
  createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  updatedAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  itemImages: [],
  documents: [],
}));

const PoliciesPage = () => {
  const [policies, setPolicies] = useState<InsurancePolicy[]>(mockPolicies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    itemName: '',
    itemDescription: '',
    category: '' as InsuranceCategory,
    purchasePrice: 0,
    coverageAmount: 0,
    premium: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewPolicy = (id: string) => {
    navigate(`/admin/policies/${id}`);
  };

  const handleCreatePolicy = () => {
    // Create a new policy
    const policy: Omit<InsurancePolicy, "id" | "createdAt" | "updatedAt"> = {
      userId: 'user-1',
      purchasePrice: newPolicy.purchasePrice,
      coverageAmount: newPolicy.coverageAmount,
      premium: newPolicy.premium,
      purchaseDate: new Date(),
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      status: 'pending',
      itemName: newPolicy.itemName,
      itemDescription: newPolicy.itemDescription,
      category: newPolicy.category,
      itemImages: [],
      documents: [],
    };

    // Add the new policy to the list with a generated ID
    const newPolicyWithId: InsurancePolicy = {
      ...policy,
      id: `policy-${policies.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setPolicies([newPolicyWithId, ...policies]);
    setIsDialogOpen(false);
    
    // Reset form
    setNewPolicy({
      itemName: '',
      itemDescription: '',
      category: '' as InsuranceCategory,
      purchasePrice: 0,
      coverageAmount: 0,
      premium: 0,
    });

    toast({
      title: "Success",
      description: "New policy has been created successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Policies</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Policy</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Policy</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemName" className="text-right">
                    Item Name
                  </Label>
                  <Input
                    id="itemName"
                    value={newPolicy.itemName}
                    onChange={(e) => setNewPolicy({...newPolicy, itemName: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemDescription" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="itemDescription"
                    value={newPolicy.itemDescription}
                    onChange={(e) => setNewPolicy({...newPolicy, itemDescription: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select 
                    onValueChange={(value: string) => setNewPolicy({...newPolicy, category: value as InsuranceCategory})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="household">Household</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="purchasePrice" className="text-right">
                    Purchase Price
                  </Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={newPolicy.purchasePrice || ''}
                    onChange={(e) => setNewPolicy({...newPolicy, purchasePrice: Number(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="coverageAmount" className="text-right">
                    Coverage Amount
                  </Label>
                  <Input
                    id="coverageAmount"
                    type="number"
                    value={newPolicy.coverageAmount || ''}
                    onChange={(e) => setNewPolicy({...newPolicy, coverageAmount: Number(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="premium" className="text-right">
                    Premium
                  </Label>
                  <Input
                    id="premium"
                    type="number"
                    value={newPolicy.premium || ''}
                    onChange={(e) => setNewPolicy({...newPolicy, premium: Number(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePolicy}>
                  Create Policy
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Management</CardTitle>
            </CardHeader>
            <CardContent>
              <PolicyTable 
                policies={policies} 
                onView={handleViewPolicy}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PoliciesPage;
