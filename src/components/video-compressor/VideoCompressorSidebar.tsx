import { FaPlay, FaHistory, FaQuestionCircle, FaInfoCircle, FaCog, FaTools, FaWrench } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";
import React from 'react';
import { useTheme } from "next-themes";
import { Sun, Moon, ChevronRight } from "lucide-react";

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
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar 
      className={`transition-all duration-300 shadow-xl bg-sidebar text-sidebar-foreground ${isCollapsed ? "w-16" : "w-64 lg:w-72 xl:w-80 2xl:w-96"}`} 
      collapsible="icon"
      side="left"
      variant="sidebar"
    >
      <SidebarContent className="h-full flex flex-col">
        {/* Logo Section */}
        <div 
          className="p-6 border-b border-sidebar-border flex items-center justify-between cursor-pointer hover:bg-sidebar-accent transition-colors"
          onClick={() => navigate('/')}
        >
          <div className="flex items-center">
            <img src="/logo.png" alt="ClipSqueeze" className="w-12 h-12 rounded-full shadow-lg" />
            {!isCollapsed && (
              <span className="ml-3 text-2xl font-bold tracking-tight text-sidebar-foreground hidden md:block">ClipSqueeze</span>
            )}
          </div>
          {!isCollapsed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              className="p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-4 h-4 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              className="p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4 text-video-primary" />
            </button>
          )}
        </div>

        <SidebarGroup className="flex-1">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider px-6 py-4">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className={`py-2 ${isCollapsed ? "px-2" : "px-4"}`}>
            <SidebarMenu className="space-y-3">
              {navigationItems.map((item, idx) => (
                <React.Fragment key={item.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          `flex items-center gap-4 px-6 py-5 rounded-lg transition-all duration-200 font-medium hover:bg-video-primary/10 focus:outline-none focus:ring-2 focus:ring-video-primary/50 ${
                            isActive
                              ? "bg-video-primary/20 text-video-primary shadow-md"
                              : "text-video-primary"
                          } ${isCollapsed ? "justify-center px-3" : ""}`
                        }
                      >
                        <item.icon className="w-6 h-6 flex-shrink-0 text-video-primary" />
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-base leading-tight">{item.title}</div>
                            <div className="text-sm text-video-primary/70 truncate mt-1">
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

        {/* Collapsed Theme Toggle */}
        {isCollapsed && (
          <div className="mt-auto p-2 border-t border-sidebar-border">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-full flex items-center justify-center p-2 rounded-lg transition-all duration-200 font-medium hover:bg-video-primary/10 focus:outline-none focus:ring-2 focus:ring-video-primary/50 text-video-primary"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-video-primary" /> : <Sun className="w-5 h-5 text-video-primary" />}
            </button>
          </div>
        )}

        {/* Theme Toggle - Full Sidebar */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium hover:bg-video-primary/10 focus:outline-none focus:ring-2 focus:ring-video-primary/50 text-video-primary"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-video-primary" /> : <Sun className="w-5 h-5 text-video-primary" />}
              <span className="text-sm">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
          </div>
        )}

        {/* Stats Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
            <div className="text-xs text-sidebar-foreground/70 space-y-1">
              <div className="flex justify-between">
                <span>Client-side only</span>
                <span className="text-video-primary">✓</span>
              </div>
              <div className="flex justify-between">
                <span>No uploads</span>
                <span className="text-video-primary">✓</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}