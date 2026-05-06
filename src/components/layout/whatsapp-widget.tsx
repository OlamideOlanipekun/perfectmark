"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";

export function WhatsappWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);

  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/student") || pathname.startsWith("/watch");

  useEffect(() => {
    const handleScroll = () => {
      // Show widget after scrolling down 100px
      setShowWidget(window.scrollY > 100);

      // Auto-close the popup if scrolling all the way back to top
      if (window.scrollY < 50) {
        setIsOpen(false);
      }
    };

    // Check initial position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phoneNumber = "2349162062050"; // Official PerfectMark WhatsApp
  const message = "Hello! I'm interested in PerfectMark Tutors College.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  if (isDashboard) return null;

  return (
    <AnimatePresence>
      {showWidget && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "fixed left-6 lg:left-8 z-[60] flex flex-col items-start transition-all duration-500",
            pathname === "/" 
              ? "bottom-[100px] lg:bottom-8" 
              : "bottom-8"
          )}
        >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 w-72 bg-white rounded-2xl shadow-2xl border border-primary/10 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#21205c] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  {/* WhatsApp SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Chat with us!</h3>
                  <p className="text-[10px] text-white/70">Usually replies in minutes</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 bg-slate-50">
              <div className="bg-white p-3 rounded-xl rounded-tl-sm shadow-sm border border-slate-100 text-sm text-slate-700">
                Hi there! 👋<br />
                Need help preparing for your exams? Let us know how we can assist you today.
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                Start Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative h-14 w-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-2xl z-10"
        aria-label="Open WhatsApp Chat"
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full border border-[#25D366] animate-ping opacity-75 duration-1000" />
        <span className="absolute inset-0 rounded-full border border-[#25D366] animate-ping opacity-50 duration-1000 delay-300" />

        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="transition-transform group-hover:-translate-y-0.5"
          >
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
          </svg>
        )}
        </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
