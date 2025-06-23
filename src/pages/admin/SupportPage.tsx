
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ChatSupportInterface from '@/components/admin/ChatSupportInterface';
import { User, ChatMessage } from '@/models/types';
import { apiService } from '@/services/apiService';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "@/components/ui/use-toast";

const SupportPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersData = await apiService.getUsers();
        setUsers(usersData);
        
        // For demo purposes, fetch chat messages for the first user
        if (usersData.length > 0) {
          const messagesData = await apiService.getUserChat(usersData[0].id);
          setChatMessages(messagesData);
        }
        
      } catch (error) {
        console.error('Error fetching support data:', error);
        toast({
          title: "Error",
          description: "Failed to load support data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = async (userId: string, message: string) => {
    try {
      // Send message from admin (bot: true)
      const newMessage = await apiService.sendChatMessage({
        userId,
        isBot: true,
        message,
        timestamp: new Date(),
      });
      
      // Update local state to include the new message
      setChatMessages((prev) => [...prev, newMessage]);
      
      toast({
        title: "Message Sent",
        description: "Your response has been sent to the customer.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Customer Support</h1>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="h-[calc(100vh-12rem)] space-y-4">
                <Skeleton className="h-full w-full" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <ChatSupportInterface 
            users={users}
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default SupportPage;
