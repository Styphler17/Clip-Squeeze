<<<<<<< HEAD
import { FaPlay, FaHistory, FaQuestionCircle, FaInfoCircle, FaCog, FaWrench } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
=======
import { FaPlay, FaHistory, FaQuestionCircle, FaInfoCircle, FaCog, FaTools, FaWrench } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";
>>>>>>> 6f15866 (latest fixes)
import React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "Compressor", 
    url: "/", 
    icon: FaPlay,
    description: "Compress your videos"
  },
  { 
    title: "Video Repair", 
    url: "/repair", 
    icon: FaWrench,
    description: "Fix corrupted videos"
  },
  { 
    title: "History", 
    url: "/history", 
    icon: FaHistory,
    description: "View compression history"
  },
  { 
    title: "How To Use", 
    url: "/guide", 
    icon: FaQuestionCircle,
    description: "Learn how to compress"
  },
  { 
    title: "Settings", 
    url: "/settings", 
    icon: FaCog,
    description: "Configure preferences"
  },
  { 
    title: "About", 
    url: "/about", 
    icon: FaInfoCircle,
    description: "About ClipSqueeze"
  },
];

export function VideoCompressorSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();

  return (
    <Sidebar 
      className={`transition-all duration-300 shadow-xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white ${isCollapsed ? "w-16" : "w-64"} hidden lg:flex`} 
      collapsible="icon"
    >
      <SidebarContent className="h-full flex flex-col">
        {/* Logo Section */}
        <div 
          className="p-6 border-b border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => navigate('/')}
        >
          <img src="/logo.png" alt="ClipSqueeze" className="w-12 h-12 rounded-full shadow-lg" />
          {!isCollapsed && (
            <span className="ml-3 text-2xl font-bold tracking-tight text-white hidden md:block">ClipSqueeze</span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-4 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item, idx) => (
                <React.Fragment key={item.title}>
                  <SidebarMenuItem className={idx < navigationItems.length - 1 ? "mb-2" : ""}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-6 py-4 rounded-lg transition-all duration-200 font-medium hover:bg-gray-700 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
                            isActive
                              ? "bg-yellow-500 text-white shadow-md"
                              : "text-gray-200"
                          }`
                        }
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-base">{item.title}</div>
                            <div className="text-xs opacity-70 truncate">
                              {item.description}
                            </div>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stats Section */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-gray-700 bg-gray-800/60">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Client-side only</span>
                <span className="text-green-400">✓</span>
              </div>
              <div className="flex justify-between">
                <span>No uploads</span>
                <span className="text-green-400">✓</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}