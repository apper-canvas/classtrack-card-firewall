import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "", icon: "LayoutDashboard" },
    { name: "Students", href: "students", icon: "Users" },
    { name: "Grades", href: "grades", icon: "BookOpen" },
    { name: "Attendance", href: "attendance", icon: "Calendar" },
    { name: "Reports", href: "reports", icon: "BarChart3" }
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={`/${item.href}`}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg"
            : "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
        )
      }
    >
      <ApperIcon 
        name={item.icon} 
        className="mr-3 h-5 w-5 flex-shrink-0" 
      />
      {item.name}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ClassTrack</span>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
          
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Teacher</p>
                <p className="text-xs text-gray-500 truncate">teacher@school.edu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div 
          className="absolute inset-0 bg-gray-600 bg-opacity-75" 
          onClick={onClose}
        />
        
        <div className={cn(
          "relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <ApperIcon name="X" className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ClassTrack</span>
            </div>
            
            <nav className="px-4 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Teacher</p>
                <p className="text-xs text-gray-500 truncate">teacher@school.edu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;