
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Zap, Clock, BadgeCheck } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              <Zap className="h-4 w-4 mr-2" />
              <span>Quick & easy insurance for your valuables</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Protect Your <span className="text-primary">Small Products</span> With Just a Few Clicks
            </h1>
            <p className="text-lg text-muted-foreground">
              InsureMojo makes it simple to insure your electronics, household items, and personal valuables. 
              Get instant coverage, easy renewals, and hassle-free claims—all from your phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/admin">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-primary mr-2" />
                <div>
                  <h3 className="font-medium">Instant Coverage</h3>
                  <p className="text-sm text-muted-foreground">Get insured in minutes</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <div>
                  <h3 className="font-medium">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">AI-powered assistance</p>
                </div>
              </div>
              <div className="flex items-start">
                <BadgeCheck className="h-5 w-5 text-primary mr-2" />
                <div>
                  <h3 className="font-medium">Easy Claims</h3>
                  <p className="text-sm text-muted-foreground">Simple digital process</p>
                </div>
              </div>
              <div className="flex items-start">
                <Zap className="h-5 w-5 text-primary mr-2" />
                <div>
                  <h3 className="font-medium">Mobile Payments</h3>
                  <p className="text-sm text-muted-foreground">M-PESA integration</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full h-64 w-64 blur-3xl opacity-20 animate-pulse-slow"></div>
            <div className="relative bg-white p-6 rounded-2xl shadow-xl">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Protected smartphone" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">iPhone 14 Pro</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Coverage</p>
                    <p className="font-medium">KES 120,000</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Premium</p>
                    <p className="font-medium">KES 12,000</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">Oct 1, 2023</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">Oct 1, 2024</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View Policy</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
