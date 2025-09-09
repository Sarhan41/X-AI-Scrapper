import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, Bot, User, Moon, Sun, Loader2 } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import xLogo from '@/assets/x-logo.png';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  reply: string;
  tweets_used: Array<{
    id: string;
    text: string;
    created_at: string;
  }>;
}

export default function ChatPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [tweetsCount, setTweetsCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (username) {
      initializeChat();
    }
  }, [username]);

  const initializeChat = async () => {
    setIsInitializing(true);
    try {
      const response = await fetch(`http://127.0.0.1:5500/tweets?username=${username}`);
      const data = await response.json();
      
      if (data.tweets) {
        setTweetsCount(data.count || 0);
        setMessages([{
          id: '1',
          type: 'bot',
          content: `Hello! I've analyzed ${data.count} recent tweets from @${username}. You can now ask me questions about their tweet patterns, content themes, or any specific topics you're curious about. What would you like to know?`,
          timestamp: new Date()
        }]);
      } else {
        setMessages([{
          id: '1',
          type: 'bot',
          content: `Sorry, I couldn't fetch tweets for @${username}. Please make sure the username is correct and the account is public.`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: 'There was an error connecting to the service. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      setIsInitializing(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5500/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          username: username
        })
      });

      const data: ChatResponse = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.reply || 'Sorry, I couldn\'t process your request.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card/50">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <img src={xLogo} alt="X Logo" className="w-8 h-8" />
            <div>
              <h2 className="font-semibold text-card-foreground">X Bot Assistant</h2>
              <p className="text-sm text-muted-foreground">AI Tweet Analyzer</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Analyzing:</span>
              <span className="font-medium text-card-foreground">@{username}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tweets Found:</span>
              <span className="font-medium text-card-foreground">{tweetsCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time Range:</span>
              <span className="font-medium text-card-foreground">Last 7 days</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-medium text-card-foreground mb-3">Suggested Questions</h3>
          <div className="space-y-2">
            {[
              "What are the main topics discussed?",
              "What's the overall sentiment?",
              "Any trending themes?",
              "What's the posting frequency?",
              "Any controversial topics?"
            ].map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left h-auto p-3 text-sm text-muted-foreground hover:text-card-foreground"
                onClick={() => setInputMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-border bg-card/30 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Chat with @{username} Bot</h3>
              <p className="text-sm text-muted-foreground">Ask me anything about their recent tweets</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6 max-w-4xl mx-auto">
            {isInitializing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                <span className="text-muted-foreground">Analyzing tweets...</span>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <Card className={`max-w-2xl ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <span className={`text-xs mt-2 block ${message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </CardContent>
                  </Card>
                  
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <Card className="bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border bg-card/30 p-4">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Ask me anything about their tweets..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1"
                disabled={isLoading || isInitializing}
              />
              <Button type="submit" disabled={isLoading || isInitializing || !inputMessage.trim()}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}