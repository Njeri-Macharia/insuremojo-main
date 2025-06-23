
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Clock, Smartphone, Zap, FileCheck, MessageSquare } from 'lucide-react';

const features = [
  {
    title: 'Instant Digital Policies',
    description: 'Create and manage your insurance policies online with just a few taps. No paperwork, no hassle.',
    icon: ShieldCheck,
  },
  {
    title: '24/7 Customer Support',
    description: 'Get help anytime with our AI-powered chatbot, designed to answer your insurance questions instantly.',
    icon: Clock,
  },
  {
    title: 'Mobile-First Experience',
    description: 'Our platform is designed for mobile, making it easy to manage your insurance on the go.',
    icon: Smartphone,
  },
  {
    title: 'Fast M-PESA Payments',
    description: 'Pay premiums and receive claim settlements directly through M-PESA for maximum convenience.',
    icon: Zap,
  },
  {
    title: 'Simple Claims Process',
    description: 'Submit claims with photos and receive updates throughout the approval process - all digitally.',
    icon: FileCheck,
  },
  {
    title: 'Policy Renewal Reminders',
    description: 'Never miss a renewal with automated notifications and one-click policy extensions.',
    icon: MessageSquare,
  },
];

const FeaturesSection = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Insurance Made Simple</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            InsureMojo brings the entire insurance experience to your fingertips with innovative features designed for the digital age.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
