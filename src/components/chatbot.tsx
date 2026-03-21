
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Send, X, Sparkles, Loader2, User, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatbotAction } from '@/app/actions/portfolio-actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const languages = ['English', 'Russian', 'French', 'German', 'Japanese'];

const faqQuestions: Record<string, string[]> = {
  English: [
    "How do I generate a portfolio?",
    "What information can I import?",
    "How can I make my portfolio stand out?",
    "What are the latest trends in web development?",
  ],
  Russian: [
    "Как мне сгенерировать портфолио?",
    "Какую информацию я могу импортировать?",
    "Как я могу выделить свое портфолио?",
    "Какие последние тенденции в веб-разработке?",
  ],
  French: [
    "Comment puis-je générer un portfolio ?",
    "Quelles informations puis-je importer ?",
    "Comment puis-je faire ressortir mon portfolio ?",
    "Quelles sont les dernières tendances en développement web ?",
  ],
  German: [
    "Wie erstelle ich ein Portfolio?",
    "Welche Informationen kann ich importieren?",
    "Wie kann ich mein Portfolio hervorheben?",
    "Was sind die neuesten Trends in der Webentwicklung?",
  ],
  Japanese: [
    "ポートフォリオを生成するにはどうすればよいですか？",
    "どのような情報をインポートできますか？",
    "どうすればポートフォリオを目立たせることができますか？",
    "ウェブ開発の最新トレンドは何ですか？",
  ],
};

const SkillMaprBotLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    {...props}
  >
    <g>
      <path
        d="M50,90C27.9,90,10,72.1,10,50S27.9,10,50,10s40,17.9,40,40-17.9,40-40,40Z"
        fill="#cde7f7"
        stroke="#4a80b0"
        strokeWidth="4"
      />
      <path
        d="M50,85c-19.3,0-35-15.7-35-35S30.7,15,50,15,85,30.7,85,50,69.3,85,50,85Z"
        fill="#f0f9ff"
        stroke="#4a80b0"
        strokeWidth="4"
      />
      <circle cx="38" cy="50" r="7" fill="white" stroke="#4a80b0" strokeWidth="2" />
      <circle cx="62" cy="50" r="7" fill="white" stroke="#4a80b0" strokeWidth="2" />
      <path
        d="M38,68c0-6.6,5.4-12,12-12s12,5.4,12,12"
        fill="none"
        stroke="#4a80b0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="30" cy="18" r="7" fill="#cde7f7" stroke="#4a80b0" strokeWidth="2" />
      <line x1="33" y1="24" x2="35" y2="30" stroke="#4a80b0" strokeWidth="2" />
      <circle cx="70" cy="18" r="7" fill="#cde7f7" stroke="#4a80b0" strokeWidth="2" />
      <line x1="67" y1="24" x2="65" y2="30" stroke="#4a80b0" strokeWidth="2" />
    </g>
  </svg>
);


export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const greetingTimeout = setTimeout(() => {
      if (!isOpen) {
        setIsGreeting(true);
      }
    }, 2000);

    return () => clearTimeout(greetingTimeout);
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableNode = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableNode) {
        scrollableNode.scrollTop = scrollableNode.scrollHeight;
      }
    }
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isGreeting) {
      setIsGreeting(false);
    }
  };

  const handleFaqClick = async (question: string) => {
    if (isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const result = await chatbotAction({
        history: newMessages,
        language,
      });

      if (result.success && result.data) {
        setMessages([...newMessages, { role: 'model', content: result.data.response }]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to get a response from the bot.',
        });
        setMessages(messages);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the bot.',
      });
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatbotAction({
        history: newMessages,
        language,
      });

      if (result.success && result.data) {
        setMessages([...newMessages, { role: 'model', content: result.data.response }]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to get a response from the bot.',
        });
        setMessages(messages); // revert messages if there was an error
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the bot.',
      });
      setMessages(messages); // revert messages if there was an error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={cn("fixed bottom-4 right-4 z-50 transition-all duration-300",
        isGreeting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      )}>
        <Card className="max-w-xs bg-background/80 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-1 rounded-full">
              <SkillMaprBotLogo className="w-10 h-10" />
            </div>
            <div>
              <p className="font-semibold">Hello, this is SkillMaprBOT!</p>
              <p className="text-sm text-muted-foreground">How can I help you?</p>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setIsGreeting(false)}><X className="w-4 h-4" /></Button>
          </CardContent>
        </Card>
      </div>

      <div className={cn("fixed bottom-4 right-4 z-50 transition-transform duration-300", isOpen && "translate-x-[-380px]")}>
        <Button
          size="icon"
          className="rounded-full w-16 h-16 shadow-lg neon-glow flex items-center justify-center bg-transparent p-0 overflow-hidden"
          onClick={handleToggle}
        >
          {isOpen ? <X className="w-8 h-8 text-primary" /> : <SkillMaprBotLogo className="w-full h-full scale-110" />}
        </Button>
      </div>

      <Card className={cn(
        "fixed bottom-4 right-4 z-40 w-[370px] h-[calc(100vh-80px)] max-h-[600px] flex flex-col shadow-2xl transition-all duration-300",
        isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-full">
              <SkillMaprBotLogo className="w-8 h-8" />
            </div>
            <CardTitle>SkillMaprBOT</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem key={lang} onSelect={() => setLanguage(lang)}>
                  {lang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="mx-auto w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Ask me anything in {language}!</p>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-left">
                    {faqQuestions[language].map((q) => (
                      <button key={q} onClick={() => handleFaqClick(q)} className="p-2 bg-muted/50 text-sm rounded-lg text-left hover:bg-muted transition-colors text-muted-foreground">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                    {message.role === 'model' && <div className="p-1 rounded-full"><SkillMaprBotLogo className="w-8 h-8" /></div>}
                    <div className={cn("p-3 rounded-lg max-w-[80%]", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && <div className="bg-muted p-2 rounded-full"><User className="w-6 h-6 text-muted-foreground" /></div>}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full"><SkillMaprBotLogo className="w-8 h-8" /></div>
                  <div className="p-3 rounded-lg bg-muted">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SkillMaprBOT..."
                className="pr-12"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
