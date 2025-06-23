
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatMessage, User } from '@/models/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

interface ChatSupportInterfaceProps {
  users: User[];
  chatMessages: ChatMessage[];
  onSendMessage: (userId: string, message: string) => void;
}

const ChatSupportInterface: React.FC<ChatSupportInterfaceProps> = ({
  users,
  chatMessages,
  onSendMessage,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [userMessages, setUserMessages] = useState<Record<string, ChatMessage[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Group messages by user
    const messagesByUser: Record<string, ChatMessage[]> = {};
    
    chatMessages.forEach(message => {
      if (!messagesByUser[message.userId]) {
        messagesByUser[message.userId] = [];
      }
      messagesByUser[message.userId].push(message);
    });
    
    // Sort messages by timestamp for each user
    Object.keys(messagesByUser).forEach(userId => {
      messagesByUser[userId].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
    
    setUserMessages(messagesByUser);
    
    // If we have messages and no selected user, select the first user with messages
    if (Object.keys(messagesByUser).length > 0 && !selectedUserId) {
      setSelectedUserId(Object.keys(messagesByUser)[0]);
    }
  }, [chatMessages, selectedUserId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [userMessages, selectedUserId]);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedUserId) {
      onSendMessage(selectedUserId, messageInput);
      setMessageInput('');
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const activeUsers = Object.keys(userMessages).map(userId => {
    const user = getUserById(userId);
    return {
      id: userId,
      name: user ? user.name : 'Unknown User',
      profileImage: user?.profileImage,
      lastMessage: userMessages[userId][userMessages[userId].length - 1].message,
      unreadCount: userMessages[userId].filter(m => !m.isBot).length,
      lastActivity: userMessages[userId][userMessages[userId].length - 1].timestamp,
    };
  }).sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
      {/* User list */}
      <Card className="md:col-span-1 overflow-hidden">
        <CardHeader>
          <CardTitle>Active Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[calc(100vh-16rem)] overflow-y-auto">
            {activeUsers.map(user => (
              <div
                key={user.id}
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors",
                  selectedUserId === user.id && "bg-muted"
                )}
                onClick={() => setSelectedUserId(user.id)}
              >
                <Avatar>
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(user.lastActivity)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                </div>
                {user.unreadCount > 0 && (
                  <Badge variant="default" className="ml-auto">
                    {user.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
            {activeUsers.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No active conversations
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat area */}
      <Card className="md:col-span-2 overflow-hidden flex flex-col">
        {selectedUserId ? (
          <>
            <CardHeader className="border-b px-4 py-3 flex-row items-center gap-3">
              <Avatar>
                <AvatarImage src={getUserById(selectedUserId)?.profileImage} />
                <AvatarFallback>
                  {getInitials(getUserById(selectedUserId)?.name || 'Unknown')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {getUserById(selectedUserId)?.name || 'Unknown User'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {getUserById(selectedUserId)?.email}
                </p>
              </div>
            </CardHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {userMessages[selectedUserId]?.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-end gap-2 max-w-[80%]",
                    message.isBot ? "ml-0" : "ml-auto"
                  )}
                >
                  {message.isBot && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      message.isBot
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">
              Choose a user from the list to view their chat history
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatSupportInterface;
