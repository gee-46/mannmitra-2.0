import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './ui/Card';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';

const affirmations = [
  "I am capable of overcoming any challenge.",
  "I am worthy of love and happiness.",
  "I choose to be positive and create a happy life.",
  "I am grateful for all the good in my life.",
  "I believe in my abilities and my potential.",
];

const DailyAffirmation = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cycleAffirmation = () => {
    setIndex((prevIndex) => (prevIndex + 1) % affirmations.length);
  };

  const shareAffirmation = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#A855F7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Daily Affirmation', canvas.width / 2, 100);

    ctx.font = 'italic 28px Arial';
    const lines = affirmations[index].split(' ');
    let y = 200;
    const maxWidth = 600;
    let currentLine = '';

    for (const word of lines) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        ctx.fillText(currentLine, canvas.width / 2, y);
        currentLine = word + ' ';
        y += 40;
      } else {
        currentLine = testLine;
      }
    }
    ctx.fillText(currentLine, canvas.width / 2, y);

    // Add app name
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('MannMitra', canvas.width / 2, canvas.height - 50);

    // Convert to blob and share
    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'daily-affirmation.png', { type: 'image/png' });
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Daily Affirmation',
              text: affirmations[index],
              files: [file],
            });
          } catch (error) {
            console.log('Error sharing:', error);
          }
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'daily-affirmation.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    });
  };

  return (
    <Card className="relative text-center p-8 bg-gradient-to-br from-accent/80 to-purple-800/80 border-accent/50">
      <motion.p 
        key={index}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-semibold mb-6 text-accent-foreground"
      >
        "{affirmations[index]}"
      </motion.p>
      <div className="flex flex-col items-center space-y-4">
        <motion.button
          onClick={cycleAffirmation}
          className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {t('mindfulness_page.new_affirmation')}
        </motion.button>
        <motion.button
          onClick={shareAffirmation}
          className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center space-x-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </motion.button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
};

export default DailyAffirmation;
