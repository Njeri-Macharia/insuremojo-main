
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats, InsurancePolicy, Claim, Payment } from '@/models/types';
import { apiService } from '@/services/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertTriangle, CheckCircle, CreditCard, FileText, TrendingUp, Users } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, policiesData, claimsData, paymentsData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getPolicies(),
          apiService.getClaims(),
          apiService.getPayments(),
        ]);
        
        setStats(statsData);
        setPolicies(policiesData);
        setClaims(claimsData);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  // Create recent activity data
  const recentActivities = [
    ...claims.map(claim => ({
      id: claim.id,
      type: 'claim' as const,
      title: `New Claim: ${claim.description.substring(0, 20)}...`,
      status: claim.status,
      date: claim.createdAt,
      amount: claim.claimAmount,
    })),
    ...payments.filter(payment => payment.status === 'paid').map(payment => ({
      id: payment.id,
      type: 'payment' as const,
      title: `Payment Received for Policy ${payment.policyId}`,
      status: payment.status,
      date: payment.createdAt,
      amount: payment.amount,
    })),
    ...policies.filter(policy => policy.status === 'pending').map(policy => ({
      id: policy.id,
      type: 'policy' as const,
      title: `New Policy: ${policy.itemName}`,
      status: policy.status,
      date: policy.createdAt,
      amount: policy.premium,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Prepare data for charts
  const categoryData = policies.reduce((acc, policy) => {
    const category = policy.category;
    if (!acc[category]) {
      acc[category] = {
        name: category.charAt(0).toUpperCase() + category.slice(1),
        count: 0,
        value: 0,
      };
    }
    acc[category].count += 1;
    acc[category].value += policy.premium;
    return acc;
  }, {} as Record<string, { name: string; count: number; value: number }>);

  const pieChartData = Object.values(categoryData);
  
  const monthlyRevenueData = [
    { name: 'Jan', revenue: 1800000 },
    { name: 'Feb', revenue: 2200000 },
    { name: 'Mar', revenue: 2800000 },
    { name: 'Apr', revenue: 2500000 },
    { name: 'May', revenue: 3000000 },
    { name: 'Jun', revenue: 3200000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{new Date().toDateString()}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-pulse">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="dashboard-stat h-32"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Active Policies"
              value={stats?.activePolicies || 0}
              icon={FileText}
              trend="up"
              trendValue="5% from last month"
            />
            <StatCard
              title="Pending Claims"
              value={stats?.pendingClaims || 0}
              icon={AlertTriangle}
              trend="down"
              trendValue="3% from last month"
            />
            <StatCard
              title="Total Monthly Revenue"
              value={formatCurrency(stats?.revenueThisMonth || 0)}
              icon={CreditCard}
              trend="up"
              trendValue="12% from last month"
            />
            <StatCard
              title="New Customers"
              value={stats?.newCustomers || 0}
              icon={Users}
              trend="up"
              trendValue="8% from last month"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue overview for the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip formatter={(value) => [`KES ${(value as number).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policy Categories</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [value, 'Policies']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
                <TabsTrigger value="recent">Recent Claims</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Policy Approvals</CardTitle>
                    <CardDescription>Policies awaiting underwriter review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {policies.filter(policy => policy.status === 'pending').length > 0 ? (
                      <div className="space-y-4">
                        {policies
                          .filter(policy => policy.status === 'pending')
                          .slice(0, 5)
                          .map(policy => (
                            <div key={policy.id} className="flex justify-between items-center p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{policy.itemName}</p>
                                <p className="text-sm text-muted-foreground">{`Policy ID: ${policy.id}`}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(policy.premium)}</p>
                                <p className="text-sm text-muted-foreground">{new Date(policy.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">No pending policy approvals</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="recent">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Claims</CardTitle>
                    <CardDescription>Latest claims submitted</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {claims.length > 0 ? (
                      <div className="space-y-4">
                        {claims
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 5)
                          .map(claim => (
                            <div key={claim.id} className="flex justify-between items-center p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{claim.description.substring(0, 30)}...</p>
                                <p className="text-sm text-muted-foreground">{`Claim ID: ${claim.id}`}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(claim.claimAmount)}</p>
                                <p className="text-sm text-muted-foreground">{new Date(claim.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">No recent claims</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <RecentActivityCard activities={recentActivities} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
