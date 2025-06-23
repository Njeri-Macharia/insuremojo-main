
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CreditCard, 
  FileCheck 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('profile');

  // In a real app, this would fetch from API
  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      // Simulate API call
      return {
        id: id,
        name: "James Mwangi",
        email: "james.mwangi@example.com",
        phone: "+254712345678",
        address: "200 Kimathi Street, Nairobi",
        profileImage: "",
        createdAt: new Date("2022-08-10"),
        policies: [
          {
            id: "pol123456",
            itemName: "MacBook Pro 16-inch",
            status: "active",
            premium: 8500,
            startDate: new Date("2023-05-20"),
            endDate: new Date("2024-05-20")
          },
          {
            id: "pol789012",
            itemName: "iPhone 15 Pro",
            status: "active",
            premium: 4500,
            startDate: new Date("2023-10-05"),
            endDate: new Date("2024-10-05")
          }
        ],
        claims: [
          {
            id: "clm123456",
            itemName: "MacBook Pro 16-inch",
            status: "reviewing",
            claimAmount: 250000,
            createdAt: new Date("2023-10-17")
          }
        ],
        payments: [
          {
            id: "pmt123456",
            policyId: "pol123456",
            amount: 8500,
            status: "paid",
            method: "mpesa",
            date: new Date("2023-05-18")
          },
          {
            id: "pmt789012",
            policyId: "pol789012",
            amount: 4500,
            status: "paid",
            method: "mpesa",
            date: new Date("2023-10-05")
          }
        ],
        totalPolicies: 2,
        activePolicies: 2,
        totalClaims: 1,
        totalPayments: 13000
      };
    }
  });

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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleContact = () => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the customer.",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Loading Customer Details...</h1>
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

  if (error || !customer) {
    return (
      <AdminLayout>
        <div className="container py-6">
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Error Loading Customer</h1>
            <p className="text-gray-600 mb-4">Unable to load the customer information.</p>
            <Button asChild>
              <Link to="/admin/customers">Back to Customers</Link>
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
            <h1 className="text-2xl font-semibold">Customer Details</h1>
            <p className="text-gray-500">ID: {customer.id}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link to="/admin/customers">Back to Customers</Link>
            </Button>
            <Button onClick={handleContact}>Contact Customer</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Customer Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={customer.profileImage} />
                  <AvatarFallback className="text-xl">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{customer.name}</h2>
                <p className="text-gray-500 mb-4">Customer since {formatDate(customer.createdAt)}</p>
                
                <Separator className="my-4 w-full" />
                
                <div className="w-full space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                    <span>{customer.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Customer Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Policies</span>
                    <span className="font-medium">{customer.totalPolicies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Active Policies</span>
                    <span className="font-medium">{customer.activePolicies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Claims</span>
                    <span className="font-medium">{customer.totalClaims}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Payments</span>
                    <span className="font-medium">{formatCurrency(customer.totalPayments)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="profile">Customer Details</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="claims">Claims & Payments</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Full Name</span>
                        <span>{customer.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Email</span>
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Phone</span>
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Address</span>
                        <span>{customer.address}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Customer Since</span>
                        <span>{formatDate(customer.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="policies" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Policies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customer.policies.length > 0 ? (
                      <div className="space-y-4">
                        {customer.policies.map((policy) => (
                          <div key={policy.id} className="p-4 border rounded-md flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-primary mr-2" />
                                <h4 className="font-medium">{policy.itemName}</h4>
                              </div>
                              <div className="ml-7 mt-1">
                                <p className="text-sm text-gray-500">
                                  Policy ID: {policy.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`text-sm px-2 py-1 rounded-full ${getStatusBadgeColor(policy.status)}`}>
                                {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                              </span>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/admin/policies/${policy.id}`}>View</Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        This customer has no policies yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="claims" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Claims</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customer.claims.length > 0 ? (
                      <div className="space-y-4">
                        {customer.claims.map((claim) => (
                          <div key={claim.id} className="p-4 border rounded-md flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <FileCheck className="h-5 w-5 text-primary mr-2" />
                                <h4 className="font-medium">{claim.itemName}</h4>
                              </div>
                              <div className="ml-7 mt-1">
                                <p className="text-sm text-gray-500">
                                  Claim ID: {claim.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Submitted on {formatDate(claim.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`text-sm px-2 py-1 rounded-full ${getStatusBadgeColor(claim.status)}`}>
                                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                              </span>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/admin/claims/${claim.id}`}>View</Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        This customer has no claims yet
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customer.payments.length > 0 ? (
                      <div className="space-y-4">
                        {customer.payments.map((payment) => (
                          <div key={payment.id} className="p-4 border rounded-md flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <CreditCard className="h-5 w-5 text-primary mr-2" />
                                <h4 className="font-medium">{formatCurrency(payment.amount)}</h4>
                              </div>
                              <div className="ml-7 mt-1">
                                <p className="text-sm text-gray-500">
                                  Payment ID: {payment.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Policy ID: {payment.policyId}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Paid on {formatDate(payment.date)} via {payment.method.toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <div>
                              <span className={`text-sm px-2 py-1 rounded-full ${getStatusBadgeColor(payment.status)}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No payment records found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerDetail;
