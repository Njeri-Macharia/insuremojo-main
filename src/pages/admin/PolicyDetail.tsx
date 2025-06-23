
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { FileText, User, CalendarClock, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PolicyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');

  // In a real app, this would fetch from API
  const { data: policy, isLoading, error } = useQuery({
    queryKey: ['policy', id],
    queryFn: async () => {
      // Simulate API call
      return {
        id: id,
        itemName: "MacBook Pro 16-inch",
        itemDescription: "2023 model, M2 chip, Space Gray, 32GB RAM, 1TB SSD",
        category: "electronics",
        purchaseDate: new Date("2023-05-15"),
        purchasePrice: 300000,
        coverageAmount: 320000,
        premium: 8500,
        startDate: new Date("2023-05-20"),
        endDate: new Date("2024-05-20"),
        status: "active",
        userId: "usr123456",
        userName: "James Mwangi",
        userEmail: "james.mwangi@example.com",
        userPhone: "+254712345678",
        createdAt: new Date("2023-05-18"),
        documents: [
          { name: "Receipt", url: "#" },
          { name: "Product Photos", url: "#" }
        ],
        paymentHistory: [
          { id: "pmt001", amount: 8500, date: new Date("2023-05-18"), method: "mpesa" }
        ],
        claimHistory: []
      };
    }
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'claimed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const handleStatusChange = (newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Policy status changed to ${newStatus}`,
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Loading Policy Details...</h1>
          </div>
          <div className="grid gap-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !policy) {
    return (
      <AdminLayout>
        <div className="container py-6">
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Error Loading Policy</h1>
            <p className="text-gray-600 mb-4">Unable to load the policy information.</p>
            <Button asChild>
              <Link to="/admin/policies">Back to Policies</Link>
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Policy Details</h1>
            <p className="text-gray-500">ID: {policy.id}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link to="/admin/policies">Back to Policies</Link>
            </Button>
            <Button>Renew Policy</Button>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{policy.itemName}</CardTitle>
                  <CardDescription>{policy.itemDescription}</CardDescription>
                </div>
                <Badge className={getStatusBadgeColor(policy.status)} variant="outline">
                  {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Category</span>
                  <span className="capitalize">{policy.category}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Purchase Date</span>
                  <span>{formatDate(policy.purchaseDate)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Purchase Price</span>
                  <span>{formatCurrency(policy.purchasePrice)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Coverage Amount</span>
                  <span>{formatCurrency(policy.coverageAmount)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Premium</span>
                  <span>{formatCurrency(policy.premium)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Policy Term</span>
                  <span>{formatDate(policy.startDate)} - {formatDate(policy.endDate)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-500">Created on {formatDate(policy.createdAt)}</span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('cancelled')}
                >
                  Cancel Policy
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('active')}
                >
                  Activate Policy
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Policy Details</TabsTrigger>
              <TabsTrigger value="customer">Customer Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Policy History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="mt-0.5">
                        <CalendarClock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Policy Created</h4>
                        <p className="text-sm text-gray-500">{formatDate(policy.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="mt-0.5">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Payment Received</h4>
                        <p className="text-sm text-gray-500">{formatDate(policy.createdAt)} - {formatCurrency(policy.premium)}</p>
                        <p className="text-sm text-gray-500">Method: M-Pesa</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="mt-0.5">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Policy Activated</h4>
                        <p className="text-sm text-gray-500">{formatDate(policy.startDate)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="customer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg">
                        {policy.userName.split(' ').map(part => part.charAt(0)).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-medium">{policy.userName}</h4>
                      <p className="text-gray-500">Customer ID: {policy.userId}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Email Address</span>
                      <span>{policy.userEmail}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Phone Number</span>
                      <span>{policy.userPhone}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/customers/${policy.userId}`}>View Customer Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Policy Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {policy.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <span>{doc.name}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noreferrer">View</a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PolicyDetail;
