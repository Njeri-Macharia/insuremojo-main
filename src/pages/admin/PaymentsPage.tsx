
// import React, { useState, useEffect } from 'react';
// import { paymentService } from '../../services/paymentService';
// import { Payment } from '../../models/types';
// import { toast } from "@/components/ui/use-toast"

// interface PaymentsPageProps {
//   // You can define props here if needed
// }

// const PaymentsPage: React.FC<PaymentsPageProps> = () => {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   const fetchPayments = async () => {
//     try {
//       setIsLoading(true);
//       const data = await paymentService.getAllPayments();
      
//       // Enrich payment data with user and policy details if needed
//       const enrichedPayments = data.map(payment => ({
//         ...payment,
//         userFullName: payment.userId 
//           ? (typeof payment.userId === 'object' 
//             ? (payment.userId as { name?: string }).name || 'Unknown User'
//             : 'Unknown User'),
//         policyNumber: payment.policyId 
//           ? (typeof payment.policyId === 'object' 
//             ? (payment.policyId as { policyNumber?: string }).policyNumber || `POL-${payment.policyId}`
//             : `POL-${payment.policyId}`),
//         date: new Date(payment.paymentDate || payment.createdAt)
//       }));
      
//       setPayments(enrichedPayments);
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching payments:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load payment data",
//         variant: "destructive",
//       });
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <div>Loading payments...</div>;
//   }

//   return (
//     <div>
//       <h1>Payments</h1>
//       {payments.length > 0 ? (
//         <ul>
//           {payments.map(payment => (
//             <li key={payment.id}>
//               Payment ID: {payment.id}, Amount: {payment.amount}, Method: {payment.method}, Status: {payment.status}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No payments found.</p>
//       )}
//     </div>
//   );
// };

// export default PaymentsPage;
