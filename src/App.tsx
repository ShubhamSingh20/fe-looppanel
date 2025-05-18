import { useState, useRef, useEffect } from 'react'
import { FaUser } from 'react-icons/fa'
import { RiRobot2Line } from 'react-icons/ri'
import { BsChatDots } from 'react-icons/bs'
import type { ChatReplyResponse, Message, Project } from './types'
import Navbar from './Components/Navbar'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/list_projects`);
        const data = await response.json();
        setProjects(data.projects);
        if (data.projects.length > 0) {
          setSelectedProject(data.projects[0].id);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      setMessages([]);
    }
  }, [selectedProject]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedProject) return;

    const userMessage: Message = {
      text: inputText,
      isUser: true
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/get_chat_reply/${selectedProject}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: inputText,
          messageHistory: messages.map(message => ({
            text: message.text,
            isUser: message.isUser
          }))
        }),
      });

      const data: ChatReplyResponse = await response.json();
      
      const aiMessage: Message = {
        text: data.response || "Sorry, I couldn't process that request.",
        isUser: false,
        proofs: data.proof
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        text: "Sorry, there was an error processing your request.",
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const SkeletonMessage = () => (
    <div className="flex justify-start w-full">
      <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3 w-[70%]">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const WelcomeMessage = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
      <BsChatDots className="w-16 h-16" />
      <p className="text-xl font-medium">Start a conversation</p>
      <p className="text-sm">Type a message to begin chatting</p>
    </div>
  );

  const ProofChips = ({ proofs }: { proofs: ChatReplyResponse['proof'] }) => {
    const uniqueProofs = Array.from(new Set(proofs.map(proof => proof.file_name)));
    return (
    <div className="mt-2 flex flex-wrap gap-2">
      <span className="text-xs text-gray-500 font-semibold uppercase underline">REF</span>
      {uniqueProofs.map((proof, index) => (
        <div 
          key={index}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
        >
          {proof}
        </div>
      ))}
    </div>
  )
  }
  return (
    <div className="h-screen flex flex-col">
      <Navbar 
        projects={projects} 
        selectedProject={selectedProject} 
        onProjectChange={setSelectedProject} 
      />
      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex flex-col p-4">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
                  >
                    {!message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <RiRobot2Line className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.isUser
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.text}
                      {!message.isUser && 'proofs' in message && message.proofs && (
                        <ProofChips proofs={Array.from(new Set(message.proofs))} />
                      )}
                    </div>
                    {message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-teal-200 flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-teal-600" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <RiRobot2Line className="w-5 h-5 text-gray-600" />
                    </div>
                    <SkeletonMessage />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex space-x-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading || !selectedProject}
                className={`px-6 py-2 rounded-lg font-semibold text-white ${
                  !inputText.trim() || isLoading || !selectedProject
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
