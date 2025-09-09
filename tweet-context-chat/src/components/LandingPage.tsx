import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Zap, BarChart3, Shield, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import xLogo from '@/assets/x-logo.png';
import heroBg from '@/assets/hero-bg.jpg';

export default function LandingPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/chat/${username.trim()}`);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const benefits = [
    {
      icon: Bot,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes recent tweets to provide intelligent insights and responses'
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Get instant analysis of the last 7 days of tweets from any X account'
    },
    {
      icon: BarChart3,
      title: 'Deep Insights',
      description: 'Understand trends, sentiment, and key topics from tweet history'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your queries are processed securely with no data stored permanently'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={xLogo} alt="X Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-foreground">X Bot Assistant</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold mb-6 leading-tight text-foreground">
            Analyze Any X Account <br />
            <span className="text-foreground">with AI Intelligence</span>
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-muted-foreground">
            Get instant insights from the last 7 days of tweets. Ask questions, analyze trends, 
            and understand content patterns with our advanced AI assistant.
          </p>
          
          {/* Username Input Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter X username (e.g., elonmusk)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-input border border-border text-foreground placeholder:text-muted-foreground"
                required
              />
              <Button type="submit" variant="default" size="lg">
                Start Analysis
              </Button>
            </div>
          </form>
          
          <p className="text-sm text-muted-foreground">
            Enter any public X username to begin analyzing their recent tweets
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Why Choose X Bot Assistant?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful AI-driven analysis that helps you understand X accounts like never before
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-border bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-background" />
                  </div>
                  <h4 className="text-xl font-semibold text-card-foreground mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 text-foreground">
            Ready to Get Started?
          </h3>
          <p className="text-lg mb-8 text-muted-foreground">
            Enter a username above and discover powerful insights from their recent tweets
          </p>
          <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-card">
            Learn More
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 X Bot Assistant. Powered by AI for intelligent tweet analysis.</p>
        </div>
      </footer>
    </div>
  );
}