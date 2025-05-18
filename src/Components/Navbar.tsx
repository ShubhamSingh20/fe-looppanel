import { useState } from "react";
import type { Project } from "../types";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = ({ 
  projects, 
  selectedProject, 
  onProjectChange 
}: { 
  projects: Project[]; 
  selectedProject: string; 
  onProjectChange: (projectId: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <span className="text-gray-700">
              {projects.find(p => p.id === selectedProject)?.name || 'Select Project'}
            </span>
            <IoIosArrowDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    onProjectChange(project.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                    selectedProject === project.id ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                  }`}
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;