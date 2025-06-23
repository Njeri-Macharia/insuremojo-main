
// import React, { useState } from 'react';
// import UserLayout from '@/components/layout/UserLayout';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import { useUser } from '@/contexts/UserContext';
// import { FileText, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
// import { useNotifications } from '@/contexts/NotificationContext';

// // Mock policy data
// const mockPolicies = [
//   {
//     id: "pol1",
//     policyNumber: "HOM2023001",
//     type: "Home Insurance",
//     status: "active",
//     startDate: "2023-01-15",
//     endDate: "2024-01-14",
//     premium: 1200,
//     coverageAmount: 150000
//   },
//   {
//     id: "pol2",
//     policyNumber: "AUT2023042",
//     type: "Auto Insurance",
//     status: "active",
//     startDate: "2023-03-10",
//     endDate: "2024-03-09",
//     premium: 850,
//     coverageAmount: 45000
//   },
//   {
//     id: "pol3",
//     policyNumber: "LIF2023078",
//     type: "Life Insurance",
//     status: "pending",
//     startDate: "2023-06-01",
//     endDate: "2024-05-31",
//     premium: 2400,
//     coverageAmount: 500000
//   }
// ];

// const UserDashboard = () => {
//   const { user } = useUser();
//   const { toast } = useToast();
//   const { addNotification } = useNotifications();
//   const [policies, setPolicies] = useState(mockPolicies);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active':
//         return 'bg-green-100 text-green-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'expired':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const handleViewPolicy = (id: string) => {
//     toast({
//       title: "Policy Details",
//       description: `Viewing details for policy ${id}`,
//     });
//   };

//   const handleFileClaim = (policyId: string) => {
//     toast({
//       title: "File Claim",
//       description: `Starting claim process for policy ${policyId}`,
//     });
    
//     // Add notification
//     addNotification({
//       title: "Claim Started",
//       message: `You've started a new claim for policy ${policyId}. We'll review it shortly.`,
//       type: "info"
//     });
//   };

//   const handleRenewPolicy = (policyId: string) => {
//     toast({
//       title: "Policy Renewal",
//       description: `Starting renewal process for policy ${policyId}`,
//     });
    
//     // Add notification
//     addNotification({
//       title: "Renewal Started",
//       message: `You've started renewal for policy ${policyId}. Please complete the process.`,
//       type: "warning"
//     });
//   };

//   return (
//     <UserLayout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Welcome Back, {user?.name}</h1>
//           <Button>New Policy Quote</Button>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="p-6 flex items-center">
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <FileText className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Active Policies</p>
//                 <h3 className="text-2xl font-bold">{policies.filter(p => p.status === 'active').length}</h3>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-6 flex items-center">
//               <div className="bg-yellow-100 p-3 rounded-full">
//                 <AlertTriangle className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Pending Actions</p>
//                 <h3 className="text-2xl font-bold">2</h3>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-6 flex items-center">
//               <div className="bg-green-100 p-3 rounded-full">
//                 <CheckCircle className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Claims Filed</p>
//                 <h3 className="text-2xl font-bold">1</h3>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-6 flex items-center">
//               <div className="bg-purple-100 p-3 rounded-full">
//                 <DollarSign className="h-6 w-6 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Total Coverage</p>
//                 <h3 className="text-2xl font-bold">$695,000</h3>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* My Policies */}
//         <Card>
//           <CardHeader>
//             <CardTitle>My Policies</CardTitle>
//             <CardDescription>Manage your active insurance policies</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="p-2 text-left">Policy Number</th>
//                     <th className="p-2 text-left">Type</th>
//                     <th className="p-2 text-left">Status</th>
//                     <th className="p-2 text-left">Expiry</th>
//                     <th className="p-2 text-left">Premium</th>
//                     <th className="p-2 text-left">Coverage</th>
//                     <th className="p-2 text-left">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {policies.map((policy) => (
//                     <tr key={policy.id} className="hover:bg-gray-50">
//                       <td className="p-2 font-medium">{policy.policyNumber}</td>
//                       <td className="p-2">{policy.type}</td>
//                       <td className="p-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
//                           {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="p-2">{new Date(policy.endDate).toLocaleDateString()}</td>
//                       <td className="p-2">${policy.premium}</td>
//                       <td className="p-2">${policy.coverageAmount.toLocaleString()}</td>
//                       <td className="p-2">
//                         <div className="flex space-x-2">
//                           <Button size="sm" variant="outline" onClick={() => handleViewPolicy(policy.id)}>View</Button>
//                           <Button size="sm" variant="outline" onClick={() => handleFileClaim(policy.id)}>Claim</Button>
//                           <Button size="sm" variant="outline" onClick={() => handleRenewPolicy(policy.id)}>Renew</Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Recent Activity */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Activity</CardTitle>
//             <CardDescription>Your latest insurance-related activities</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-start space-x-4 p-3 rounded-md bg-gray-50">
//                 <div className="bg-blue-100 p-2 rounded-full">
//                   <FileText className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium">Policy Renewal Reminder</p>
//                   <p className="text-sm text-gray-500">Your auto insurance policy will expire in 30 days</p>
//                   <p className="text-xs text-gray-400 mt-1">2 days ago</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-4 p-3 rounded-md bg-gray-50">
//                 <div className="bg-green-100 p-2 rounded-full">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium">Payment Received</p>
//                   <p className="text-sm text-gray-500">Your payment of $850 for auto insurance has been received</p>
//                   <p className="text-xs text-gray-400 mt-1">1 week ago</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-4 p-3 rounded-md bg-gray-50">
//                 <div className="bg-purple-100 p-2 rounded-full">
//                   <DollarSign className="h-5 w-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium">New Quote Generated</p>
//                   <p className="text-sm text-gray-500">Quote for life insurance policy has been generated</p>
//                   <p className="text-xs text-gray-400 mt-1">2 weeks ago</p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </UserLayout>
//   );
// };

// export default UserDashboard;
