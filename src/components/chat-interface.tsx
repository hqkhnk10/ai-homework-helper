"use client"

import { useState, useRef, useEffect } from 'react';
import { Send, PaperclipIcon } from 'lucide-react';
import DOMPurify from 'dompurify';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];
}

interface ChatInterfaceProps {
  initialText?: string;
  initialFiles?: File[];
}

export function ChatInterface({ initialText = '', initialFiles = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Initialize messages with initial text and files if they exist
    if (initialText.trim() || initialFiles.length > 0) {
      return [
        {
          role: 'user',
          content: initialText,
          attachments: initialFiles.map(file => ({
            type: file.type,
            url: URL.createObjectURL(file),
            name: file.name,
          })),
        },
        {
          role: 'assistant',
          content: 'I see your question. Let me help you with that...',
        },
      ];
    }
    return [];
  });
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const prevFilesLengthRef = useRef(initialFiles.length); // Initialize with current length

  useEffect(() => {
    // Only handle new files being added
    const newFiles = initialFiles.slice(prevFilesLengthRef.current);
    if (newFiles.length > 0) {
      const newMessage: Message = {
        role: 'user',
        content: initialText,
        attachments: newFiles.map(file => ({
          type: file.type,
          url: URL.createObjectURL(file),
          name: file.name,
        })),
      };
      
      const mockResponse: Message = {
        role: 'assistant',
        content: 'I see your question. Let me help you with that...',
      };
      
      setMessages(prev => [...prev, newMessage, mockResponse]);
      prevFilesLengthRef.current = initialFiles.length;
    }
  }, [initialFiles]);

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      role: 'user',
      content: input,
      attachments: attachments.map(file => ({
        type: file.type,
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setAttachments([]);

    // Only show mock response for non-initial messages
      try {
        // Mock API response for now
        const response: Message = {
          role: 'assistant',
          content: 'This is a mock response. Replace with actual AI response.',
        };
        setMessages(prev => [...prev, response]);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 border-b flex items-center px-6">
        <h2 className="text-lg font-medium">Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(message.content, { 
                    ADD_TAGS: ['math', 'mi', 'mn', 'mo', 'msup', 'sub', 'sup'],
                    ADD_ATTR: ['display']
                  }) 
                }} 
              />
              {message.attachments?.map((file, fileIndex) => (
                <div key={fileIndex} className="mt-2">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="max-w-full rounded"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <PaperclipIcon className="w-4 h-4" />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <PaperclipIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-md"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-100 p-2 rounded"
              >
                <PaperclipIcon className="w-4 h-4" />
                <span>{file.name}</span>
                <button
                  onClick={() =>
                    setAttachments(prev => prev.filter((_, i) => i !== index))
                  }
                  className="text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
