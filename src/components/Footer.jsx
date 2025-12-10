import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>© {currentYear} Product Owner Hub</span>
            <span className="hidden md:inline">•</span>
            <span>All rights reserved</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>by <span className="font-semibold text-slate-700">Malek Berrezouga</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
