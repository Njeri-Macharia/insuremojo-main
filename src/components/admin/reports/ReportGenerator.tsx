
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, BarChart } from 'lucide-react';
import { InsurancePolicy, Payment } from '@/models/types';
import { apiService } from '@/services/apiService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ReportGeneratorProps {
  type: 'policies' | 'premiums';
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ type }) => {
  const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // In a real app, we would filter by date range
      // For demo purposes, we'll use all data
      let data;
      const title = type === 'policies' ? 'Policies Report' : 'Premium Payments Report';
      
      if (type === 'policies') {
        data = await apiService.getPolicies();
      } else {
        data = await apiService.getPayments();
      }
      
      generatePDF(data, title, reportType);
      
      toast({
        title: "Report Generated",
        description: `Your ${type} report has been generated successfully.`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generatePDF = (data: InsurancePolicy[] | Payment[], title: string, reportType: string) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(11);
    const today = format(new Date(), 'PPP');
    doc.text(`Generated on: ${today}`, 14, 30);
    
    // Filter by date range if selected
    const filteredData = data.filter(item => {
      if (!dateRange.from && !dateRange.to) return true;
      
      const itemDate = new Date(item.createdAt);
      
      if (dateRange.from && dateRange.to) {
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      }
      
      if (dateRange.from) {
        return itemDate >= dateRange.from;
      }
      
      if (dateRange.to) {
        return itemDate <= dateRange.to;
      }
      
      return true;
    });
    
    // Create table
    if (type === 'policies') {
      const policiesData = filteredData as InsurancePolicy[];
      
      if (reportType === 'summary') {
        // Summary report - count by status and category
        const statusCounts: Record<string, number> = {};
        const categoryCounts: Record<string, number> = {};
        let totalPremium = 0;
        let totalCoverage = 0;
        
        policiesData.forEach(policy => {
          statusCounts[policy.status] = (statusCounts[policy.status] || 0) + 1;
          categoryCounts[policy.category] = (categoryCounts[policy.category] || 0) + 1;
          totalPremium += policy.premium;
          totalCoverage += policy.coverageAmount;
        });
        
        // Status table
        doc.setFontSize(14);
        doc.text('Policy Status Summary', 14, 45);
        
        const statusRows = Object.entries(statusCounts).map(([status, count]) => [
          status.charAt(0).toUpperCase() + status.slice(1), 
          count.toString()
        ]);
        
        // @ts-ignore
        doc.autoTable({
          startY: 50,
          head: [['Status', 'Count']],
          body: statusRows
        });
        
        // Category table
        const categoryY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text('Policy Category Summary', 14, categoryY);
        
        const categoryRows = Object.entries(categoryCounts).map(([category, count]) => [
          category.charAt(0).toUpperCase() + category.slice(1), 
          count.toString()
        ]);
        
        // @ts-ignore
        doc.autoTable({
          startY: categoryY + 5,
          head: [['Category', 'Count']],
          body: categoryRows
        });
        
        // Financials
        const financialsY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text('Financial Summary', 14, financialsY);
        
        // @ts-ignore
        doc.autoTable({
          startY: financialsY + 5,
          head: [['Metric', 'Amount (KES)']],
          body: [
            ['Total Premium', totalPremium.toLocaleString()],
            ['Total Coverage', totalCoverage.toLocaleString()]
          ]
        });
        
      } else {
        // Detailed report
        const rows = policiesData.map(policy => [
          policy.id,
          policy.itemName,
          policy.category,
          policy.status,
          policy.premium.toLocaleString(),
          policy.coverageAmount.toLocaleString(),
          format(new Date(policy.startDate), 'dd/MM/yyyy'),
          format(new Date(policy.endDate), 'dd/MM/yyyy')
        ]);
        
        // @ts-ignore
        doc.autoTable({
          startY: 40,
          head: [['ID', 'Item', 'Category', 'Status', 'Premium', 'Coverage', 'Start Date', 'End Date']],
          body: rows
        });
      }
      
    } else {
      // Payments report
      const paymentsData = filteredData as Payment[];
      
      if (reportType === 'summary') {
        // Summary report
        const methodCounts: Record<string, number> = {};
        const statusCounts: Record<string, number> = {};
        let totalAmount = 0;
        
        paymentsData.forEach(payment => {
          methodCounts[payment.method] = (methodCounts[payment.method] || 0) + 1;
          statusCounts[payment.status] = (statusCounts[payment.status] || 0) + 1;
          totalAmount += payment.amount;
        });
        
        // Payment methods table
        doc.setFontSize(14);
        doc.text('Payment Methods Summary', 14, 45);
        
        const methodRows = Object.entries(methodCounts).map(([method, count]) => [
          method.toUpperCase(), 
          count.toString()
        ]);
        
        // @ts-ignore
        doc.autoTable({
          startY: 50,
          head: [['Payment Method', 'Count']],
          body: methodRows
        });
        
        // Status table
        const statusY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text('Payment Status Summary', 14, statusY);
        
        const statusRows = Object.entries(statusCounts).map(([status, count]) => [
          status.charAt(0).toUpperCase() + status.slice(1), 
          count.toString()
        ]);
        
        // @ts-ignore
        doc.autoTable({
          startY: statusY + 5,
          head: [['Status', 'Count']],
          body: statusRows
        });
        
        // Total amount
        const amountY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text('Financial Summary', 14, amountY);
        
        // @ts-ignore
        doc.autoTable({
          startY: amountY + 5,
          head: [['Metric', 'Amount (KES)']],
          body: [
            ['Total Payments', totalAmount.toLocaleString()]
          ]
        });
        
      } else {
        // Detailed report
        const rows = paymentsData.map(payment => [
          payment.id,
          payment.policyId,
          payment.method.toUpperCase(),
          payment.status,
          payment.amount.toLocaleString(),
          format(new Date(payment.createdAt), 'dd/MM/yyyy')
        ]);
        
        // @ts-ignore
        doc.autoTable({
          startY: 40,
          head: [['ID', 'Policy ID', 'Method', 'Status', 'Amount', 'Date']],
          body: rows
        });
      }
    }
    
    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
        align: 'center'
      });
      doc.text('InsureMojo Reports', 14, doc.internal.pageSize.height - 10);
    }
    
    // Save the PDF
    doc.save(`${type}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  // Helper function to handle date range selection compatible with the DatePicker component
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange({
      from: range.from,
      to: range.to
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>
          {type === 'policies' ? 'Policy Reports' : 'Premium Payment Reports'}
        </CardTitle>
        <CardDescription>
          {type === 'policies' 
            ? 'Generate reports on policy data and statistics'
            : 'Generate reports on premium payments and collections'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select 
              value={reportType} 
              onValueChange={(value) => setReportType(value as 'summary' | 'detailed')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary Report</SelectItem>
                <SelectItem value="detailed">Detailed Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DatePicker
              selected={dateRange}
              onSelect={handleDateRangeChange}
              placeholder="Select date range"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <h3 className="text-sm font-medium mb-2">Report will include:</h3>
          <ul className="space-y-1 text-sm">
            {type === 'policies' ? (
              reportType === 'summary' ? (
                <>
                  <li className="flex items-center gap-2">
                    <BarChart className="w-4 h-4" /> 
                    Policy status distribution
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart className="w-4 h-4" /> 
                    Policy categories breakdown
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart className="w-4 h-4" /> 
                    Total premium and coverage amounts
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 
                    Complete policy details
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 
                    Premium and coverage for each policy
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 
                    Policy start and end dates
                  </li>
                </>
              )
            ) : (
              reportType === 'summary' ? (
                <>
                  <li className="flex items-center gap-2">
                    <BarChart className="w-4 h-4" /> 
                    Payment method distribution
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart className="w-4 h-4" /> 
                    Payment status summary
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart className="w-4 h-4" /> 
                    Total payment amounts
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 
                    Complete transaction details
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 
                    Payment amount for each transaction
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 
                    Payment dates and methods
                  </li>
                </>
              )
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={generateReport} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>Generating Report...</>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate & Download PDF
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportGenerator;
