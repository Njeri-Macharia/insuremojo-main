
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
import { 
  FileText, 
  Calendar, 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle, 
  XCircle
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const ClaimDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  const [reviewNotes, setReviewNotes] = useState('');

  // In a real app, this would fetch from API
  const { data: claim, isLoading, error } = useQuery({
    queryKey: ['claim', id],
    queryFn: async () => {
      // Simulate API call
      return {
        id: id,
        policyId: "pol123456",
        userId: "usr123456",
        description: "My MacBook Pro was damaged when water was spilled on the keyboard. The device no longer turns on and shows signs of liquid damage.",
        incidentDate: new Date("2023-10-15"),
        claimAmount: 250000,
        status: "reviewing",
        evidence: [
          { name: "Damage Photo 1", url: "#" },
          { name: "Damage Photo 2", url: "#" },
          { name: "Service Center Report", url: "#" }
        ],
        reviewNotes: "Claim is being reviewed by the technical team to assess the extent of damage.",
        policyDetails: {
          itemName: "MacBook Pro 16-inch",
          category: "electronics",
          coverageAmount: 320000,
          premium: 8500,
        },
        customerDetails: {
          name: "James Mwangi",
          email: "james.mwangi@example.com",
          phone: "+254712345678"
        },
        createdAt: new Date("2023-10-17")
      };
    }
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
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

  const handleApprove = () => {
    toast({
      title: "Claim Approved",
      description: "The claim has been approved and will be processed for payment.",
    });
  };

  const handleReject = () => {
    toast({
      title: "Claim Rejected",
      description: "The claim has been rejected. Customer will be notified.",
    });
  };

  const handleSaveNotes = () => {
    toast({
      title: "Review Notes Saved",
      description: "Your notes have been saved successfully.",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Loading Claim Details...</h1>
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

  if (error || !claim) {
    return (
      <AdminLayout>
        <div className="container py-6">
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Error Loading Claim</h1>
            <p className="text-gray-600 mb-4">Unable to load the claim information.</p>
            <Button asChild>
              <Link to="/admin/claims">Back to Claims</Link>
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
            <h1 className="text-2xl font-semibold">Claim Details</h1>
            <p className="text-gray-500">ID: {claim.id}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link to="/admin/claims">Back to Claims</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Claim for {claim.policyDetails.itemName}</CardTitle>
                  <CardDescription>
                    Reported on {formatDate(claim.createdAt)} for incident dated {formatDate(claim.incidentDate)}
                  </CardDescription>
                </div>
                <Badge className={getStatusBadgeColor(claim.status)} variant="outline">
                  {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Policy ID</span>
                  <span>{claim.policyId}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Claimed Amount</span>
                  <span>{formatCurrency(claim.claimAmount)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Policy Coverage</span>
                  <span>{formatCurrency(claim.policyDetails.coverageAmount)}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-medium mb-2">Claim Description</h4>
                <p>{claim.description}</p>
              </div>
            </CardContent>
            <CardFooter className="justify-between space-x-2 border-t pt-4">
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="h-4 w-4 mr-2" /> Reject Claim
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                <CheckCircle className="h-4 w-4 mr-2" /> Approve Claim
              </Button>
            </CardFooter>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Claim Details</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="notes">Review Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg">
                        {claim.customerDetails.name.split(' ').map(part => part.charAt(0)).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-medium">{claim.customerDetails.name}</h4>
                      <p className="text-gray-500">Customer ID: {claim.userId}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Email Address</span>
                      <span>{claim.customerDetails.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Phone Number</span>
                      <span>{claim.customerDetails.phone}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/customers/${claim.userId}`}>View Customer Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Claim Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="mt-0.5">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Incident Occurred</h4>
                        <p className="text-sm text-gray-500">{formatDate(claim.incidentDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="mt-0.5">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Claim Submitted</h4>
                        <p className="text-sm text-gray-500">{formatDate(claim.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="mt-0.5">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Claim Under Review</h4>
                        <p className="text-sm text-gray-500">Technical team is assessing the damage</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="evidence" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submitted Evidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {claim.evidence.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <span>{item.name}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.url} target="_blank" rel="noreferrer">View</a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">Current Notes</h4>
                      <p>{claim.reviewNotes}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Add Notes</h4>
                      <Textarea 
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Enter your review notes here..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNotes}>Save Notes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClaimDetail;
