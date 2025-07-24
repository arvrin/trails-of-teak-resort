'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authHelpers, User } from "@/lib/supabase";
import AuthModal from "./AuthModal";
import { usePathname } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    authHelpers.getCurrentUser().then(setUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await authHelpers.signOut();
    setUser(null);
    window.location.reload();
  };

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const isActivePage = (path: string) => pathname === path;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-primary/95 backdrop-blur-md border-b border-white/10 shadow-2xl' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            {/* Brand Section */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-lg group-hover:bg-accent/30 transition-all duration-300"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20 group-hover:border-accent/50 transition-all duration-300">
                    <Image
                      src="/images/logo.png"
                      alt="Trails of Teak Resort"
                      width={40}
                      height={40}
                      priority
                      className="h-10 w-10 brightness-0 invert object-contain"
                    />
                  </div>
                </div>
                <div className="hidden md:block">
                  <h1 className="font-heading text-xl text-white font-bold tracking-[0.1em] group-hover:text-accent transition-colors duration-300">
                    TRAILS OF TEAK
                  </h1>
                  <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium opacity-90">
                    LUXURY ECO RESORT
                  </p>
                </div>
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { href: '/', label: 'Home' },
                { href: '/rooms', label: 'Accommodations' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/contact', label: 'Contact' }
              ].map(({ href, label }) => (
                <Link 
                  key={href}
                  href={href} 
                  className={`relative group font-medium tracking-wide transition-all duration-300 text-base ${
                    isActivePage(href) 
                      ? 'text-accent' 
                      : 'text-white hover:text-accent'
                  }`}
                >
                  {label}
                  <div className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                    isActivePage(href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                </Link>
              ))}
              
              {user && user.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className={`relative group font-medium tracking-wide transition-all duration-300 text-base ${
                    isActivePage('/admin') 
                      ? 'text-accent' 
                      : 'text-white hover:text-accent'
                  }`}
                >
                  Admin
                  <div className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                    isActivePage('/admin') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                </Link>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">Welcome back,</p>
                    <p className="text-accent text-xs uppercase tracking-wider">{user.full_name}</p>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <button 
                    onClick={handleLogout}
                    className="text-white hover:text-accent transition-colors duration-300 font-medium text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLoginClick}
                  className="hidden md:flex items-center space-x-2 text-white hover:text-accent transition-colors duration-300 font-medium text-sm group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Sign In</span>
                </button>
              )}
              
              <Link href="/rooms">
                <button className="relative group bg-gradient-to-r from-accent to-yellow-400 text-primary px-6 py-2.5 rounded-full font-bold text-sm tracking-wider uppercase hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-accent/30">
                  <span className="relative z-10">Reserve Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden relative p-2 text-white hover:text-accent transition-colors duration-300 group"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
                  }`}></span>
                  <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}></span>
                  <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-500 transform ${
          mobileMenuOpen 
            ? 'translate-y-0 opacity-100 visible' 
            : '-translate-y-4 opacity-0 invisible'
        }`}>
          <div className="bg-primary/95 backdrop-blur-md border-t border-white/10 shadow-2xl">
            <div className="px-6 py-8 space-y-6">
              
              {/* Navigation Links */}
              <div className="space-y-4">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/rooms', label: 'Accommodations' },
                  { href: '/gallery', label: 'Gallery' },
                  { href: '/contact', label: 'Contact' }
                ].map(({ href, label }) => (
                  <Link 
                    key={href}
                    href={href} 
                    className={`block text-lg font-medium transition-all duration-300 py-2 border-l-4 pl-4 ${
                      isActivePage(href)
                        ? 'text-accent border-accent bg-accent/10'
                        : 'text-white border-transparent hover:text-accent hover:border-accent hover:bg-accent/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                
                {user && user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className={`block text-lg font-medium transition-all duration-300 py-2 border-l-4 pl-4 ${
                      isActivePage('/admin')
                        ? 'text-accent border-accent bg-accent/10'
                        : 'text-white border-transparent hover:text-accent hover:border-accent hover:bg-accent/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
              
              {/* User Section */}
              <div className="pt-6 border-t border-white/20">
                {user ? (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-white text-sm font-medium mb-1">Welcome back,</p>
                      <p className="text-accent text-lg font-bold">{user.full_name}</p>
                    </div>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 text-white hover:text-accent transition-colors duration-300 font-medium w-full py-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      handleLoginClick();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-white hover:text-accent transition-colors duration-300 font-medium w-full py-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Sign In</span>
                  </button>
                )}
                
                <Link href="/rooms" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full mt-6 bg-gradient-to-r from-accent to-yellow-400 text-primary px-6 py-3 rounded-full font-bold tracking-wider uppercase hover:shadow-2xl transition-all duration-300 border border-accent/30">
                    Reserve Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}