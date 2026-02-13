import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppState } from './types';
import { NO_MESSAGES } from './constants';
import { generateLovePoem } from './services/geminiService';
import FallingLove from './components/FallingLove';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ASKING);
  const [noCount, setNoCount] = useState(0);
  const [generatedPoem, setGeneratedPoem] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });

  const handleNoClick = () => {
    setNoCount((prev) => prev + 1);
    moveNoButton();
  };

  const moveNoButton = () => {
    // Calculate available window space
    const maxWidth = window.innerWidth - 100; // Subtract approximate button width
    const maxHeight = window.innerHeight - 50; // Subtract approximate button height
    
    // Generate random position centered around screen center
    // We want it to be unpredictable
    const randomX = (Math.random() - 0.5) * (window.innerWidth * 0.6); 
    const randomY = (Math.random() - 0.5) * (window.innerHeight * 0.6);

    setNoButtonPos({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    setAppState(AppState.SUCCESS);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#ffa500', '#ffc0cb']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#ffa500', '#ffc0cb']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleGeneratePoem = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    const poem = await generateLovePoem();
    setGeneratedPoem(poem);
    setIsGenerating(false);
  };

  // Logic to calculate Yes button size
  const yesButtonScale = 1 + noCount * 0.2; // Grows slightly less aggressively to fit screen better

  const getNoButtonText = () => {
    return NO_MESSAGES[Math.min(noCount, NO_MESSAGES.length - 1)];
  };

  if (appState === AppState.SUCCESS) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-body text-rose-900">
        <FallingLove />
        
        <div className="z-10 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl max-w-lg w-full text-center border-2 border-rose-200 animate-[fadeIn_1s_ease-out]">
            <div className="flex justify-center mb-6">
                 <Heart className="w-20 h-20 text-rose-500 fill-rose-500 animate-pulse-fast" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-hand font-bold text-rose-600 mb-6">
                I knew you would say Yes!
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-rose-800">
                You've made me the happiest person in the world. I love you so much! ❤️
            </p>

            <div className="mt-8 pt-8 border-t border-rose-100">
                <p className="text-sm uppercase tracking-widest text-rose-400 font-bold mb-4">
                    A special note for you
                </p>
                
                {generatedPoem ? (
                    <div className="bg-rose-50 p-6 rounded-xl border border-rose-200 shadow-inner mb-6">
                        <p className="whitespace-pre-line italic font-hand text-2xl leading-relaxed text-rose-700">
                            {generatedPoem}
                        </p>
                    </div>
                ) : (
                    <button 
                        onClick={handleGeneratePoem}
                        disabled={isGenerating}
                        className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-full font-semibold shadow-lg hover:from-rose-500 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="w-5 h-5 animate-spin" />
                                Writing a poem...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Write a poem for us (AI)
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4 overflow-hidden relative font-body transition-colors duration-1000">
      <FallingLove />

      {/* Main Card */}
      <div className="z-10 text-center w-full max-w-2xl relative">
        
        <h1 className="text-4xl md:text-6xl font-hand font-bold text-rose-600 mb-16 drop-shadow-sm leading-tight">
          Will you be my Valentine?
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 min-h-[200px] relative">
            {/* YES Button */}
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-xl transition-all duration-300 z-20 flex items-center justify-center gap-2 ring-4 ring-green-200"
              style={{
                fontSize: `${yesButtonScale}rem`,
                padding: `${1 + noCount * 0.3}rem ${2 + noCount * 0.5}rem`,
              }}
              onClick={handleYesClick}
            >
              Yes
            </button>

            {/* NO Button */}
            {noCount < NO_MESSAGES.length + 1 && (
            <button
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 z-30 whitespace-nowrap ring-4 ring-rose-200"
              style={{
                position: noCount > 0 ? 'absolute' : 'static',
                left: noCount > 0 ? `calc(50% + ${noButtonPos.x}px)` : 'auto',
                top: noCount > 0 ? `calc(50% + ${noButtonPos.y}px)` : 'auto',
                transform: noCount > 0 ? `translate(-50%, -50%) rotate(${Math.random() * 20 - 10}deg)` : 'none',
              }}
              onClick={handleNoClick}
            >
              {getNoButtonText()}
            </button>
            )}
        </div>
      </div>
      
      <div className="fixed bottom-4 text-rose-800 font-bold text-xs text-center opacity-80 z-10">
        Made with ❤️ for you by Your Husband Puran
      </div>
    </div>
  );
};

export default App;