// src/components/ai-assistant/index.tsx
"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Bot,
  User,
  Send,
  Loader2,
  Maximize2,
  Minimize2,
  X,
  FileText,
  Download,
  Eye
} from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  artifact?: {
    id: string;
    name: string;
    path: string;
    type: string;
  };
}

interface FileContext {
  filename: string;
  content: string;
  caseId?: string;
}

export function AIAssistant({ 
  currentFile,
  caseId 
}: { 
  currentFile?: FileContext;
  caseId?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<Message['artifact']>();
  const [isArtifactDialogOpen, setIsArtifactDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages([]);
  }, [currentFile?.filename]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          fileContext: currentFile,
          caseId
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        artifact: data.artifact
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.artifact) {
        setCurrentArtifact(data.artifact);
        setIsArtifactDialogOpen(true);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isMinimized) {
    return (
      <Button
        className="fixed bottom-4 right-4 p-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg"
        onClick={() => setIsMinimized(false)}
      >
        <Bot className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <>
      <Card className={`fixed transition-all duration-300 ease-in-out bg-white shadow-2xl ${
        isExpanded 
          ? 'inset-4 z-50'
          : 'right-4 left-4 bottom-4 h-[400px] z-40'
      }`}>
        <div className="h-full flex flex-col">
          <div className="p-3 border-b flex items-center justify-between bg-violet-50">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-violet-600" />
              <h2 className="font-semibold text-gray-900">AI Assistant</h2>
              {currentFile && (
                <>
                  <span className="text-gray-500">•</span>
                  <div className="flex items-center space-x-1 bg-white/50 px-2 py-1 rounded-md">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                      {currentFile.filename}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsMinimized(true)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {currentFile && messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <div className="space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-gray-400" />
                  <p>Ask me anything about <span className="font-medium text-gray-700">{currentFile.filename}</span></p>
                  <p className="text-sm">I have the file content and can help you understand or analyze it.</p>
                </div>
              </div>
            )}
            {!currentFile && messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <div className="space-y-2">
                  <Bot className="w-8 h-8 mx-auto text-gray-400" />
                  <p>How can I help you today?</p>
                  <p className="text-sm">Open a file to get specific assistance, or ask me any general question.</p>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                }`}
              >
                <div className={`flex-shrink-0 rounded-full p-2 ${
                  message.role === 'assistant' ? 'bg-violet-100' : 'bg-blue-100'
                }`}>
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 text-violet-600" />
                  ) : (
                    <User className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className={`flex flex-col ${
                  message.role === 'assistant' ? 'items-start' : 'items-end'
                }`}>
                  <div className={`rounded-lg px-4 py-2 max-w-[85%] shadow-sm ${
                    message.role === 'assistant' 
                      ? 'bg-violet-50' 
                      : 'bg-blue-50'
                  }`}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-gray-800 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-code:text-gray-800">
                        <ReactMarkdown
                          components={{
                            code({node, inline, className, children, ...props}: any) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  {...props}
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code {...props} className="bg-gray-100 text-gray-800 px-1 rounded">
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.artifact && (
                    <div className="mt-2 p-2 bg-white rounded-lg border shadow-sm">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-violet-600" />
                        <span className="text-sm font-medium">{message.artifact.name}</span>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/api/download/${message.artifact?.id}`, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/api/preview/${message.artifact?.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 rounded-full p-2 bg-violet-100">
                  <Bot className="w-4 h-4 text-violet-600" />
                </div>
                <div className="bg-violet-50 rounded-lg px-4 py-2 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
            <div className="flex space-x-2">
              <div className="flex-1 min-h-[40px] relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={currentFile 
                    ? `Ask me about ${currentFile.filename}... (Press Enter to send, Shift+Enter for new line)`
                    : "Ask me anything... (Press Enter to send, Shift+Enter for new line)"
                  }
                  className="w-full h-full min-h-[40px] px-3 py-2 resize-none overflow-hidden rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-sm text-gray-800"
                  disabled={isLoading}
                  rows={1}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-violet-600 hover:bg-violet-700 text-white h-10"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {currentArtifact && (
        <Dialog open={isArtifactDialogOpen} onOpenChange={setIsArtifactDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generated Document</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <FileText className="h-8 w-8 text-violet-600" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{currentArtifact.name}</h3>
                <p className="text-sm text-gray-500">{currentArtifact.type}</p>
              </div>
            </div>
            <div className="flex space-x-2 justify-end">
              <Button
                variant="outline"
                onClick={() => window.open(`/api/download/${currentArtifact.id}`, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={() => window.open(`/api/preview/${currentArtifact.id}`, '_blank')}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}