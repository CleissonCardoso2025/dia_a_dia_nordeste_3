'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Globe, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRadio } from '@/contexts/RadioContext';

export default function RadioPlayer() {
  const { isPlaying, volume, isMuted, togglePlay, handleVolumeChange, toggleMute } = useRadio();

  const LOGO_URL = 'https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1786059035334_uzrk66y.webp';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl bg-linear-to-br from-slate-800 to-slate-900 p-4 text-white shadow-lg border border-white/10 relative overflow-hidden"
    >
      
      <div className="flex items-center gap-2 mb-4">
        <Radio className="text-brand-laranja" size={20} />
        <span className="font-titulo font-bold text-base">Rádio Ao Vivo</span>
        
        <div className="ml-auto flex items-center gap-2.5">
          <a href="https://canabravafm.com.br/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors" title="Site da Rádio">
            <Globe size={15} />
          </a>
          <a href="https://www.instagram.com/canabravafm104/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#E1306C] transition-colors" title="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <a href="https://wa.me/5575998111049" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#25D366] transition-colors" title="WhatsApp">
            <MessageCircle size={15} />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 p-1 shrink-0 shadow-inner flex items-center justify-center">
          <img src={LOGO_URL} alt="Rádio Canabrava" className="w-full h-full object-contain rounded-full bg-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-sm text-white">Rádio Canabrava</h3>
          <p className="text-xs text-brand-muted mb-2">A rádio mais feliz da cidade!</p>
          
          {/* VU / Equalizer */}
          <div className="flex items-end gap-1 h-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-brand-laranja rounded-t-sm"
                animate={
                  isPlaying
                    ? { height: ["20%", "100%", "40%", "80%", "30%"] }
                    : { height: "15%" }
                }
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + i * 0.15,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-black/40 rounded-full p-2 border border-white/5">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-brand-laranja flex items-center justify-center hover:bg-brand-laranja-light transition-colors shrink-0"
          aria-label={isPlaying ? "Pausar rádio" : "Tocar rádio"}
        >
          {isPlaying ? (
            <Pause size={18} className="text-white fill-white" />
          ) : (
            <Play size={18} className="text-white fill-white ml-1" />
          )}
        </button>

        <button 
          onClick={toggleMute} 
          className="text-white/80 hover:text-brand-laranja transition-colors"
          aria-label="Mutar/Desmutar"
        >
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-laranja cursor-pointer"
          aria-label="Volume"
        />
      </div>
    </motion.div>
  );
}
