import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ConfettiEffect = () => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    // Generate 50 particles
    setParticles(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden flex justify-center">
      {particles.map((i) => (
        <ConfettiParticle key={i} />
      ))}
    </div>
  );
};

const ConfettiParticle = () => {
  // Randomize start position, color, and animation props
  const randomX = Math.random() * 100 - 50; // -50% to 50%
  const randomDelay = Math.random() * 0.5;
  const randomDuration = 2 + Math.random() * 2;
  const randomRotation = Math.random() * 360;
  const colors = ['#3b82f6', '#ef4444', '#eab308', '#22c55e', '#a855f7', '#ec4899'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const shape = Math.random() > 0.5 ? '50%' : '0%'; // Circle or Square

  return (
    <motion.div
      initial={{ 
        y: '-10vh', 
        x: `${Math.random() * 100}vw`,
        opacity: 1, 
        rotate: 0 
      }}
      animate={{ 
        y: '110vh', 
        x: `calc(${Math.random() * 100}vw + ${randomX}px)`,
        opacity: 0, 
        rotate: randomRotation + 720 
      }}
      transition={{ 
        duration: randomDuration, 
        delay: randomDelay, 
        ease: "linear",
        repeat: 0
      }}
      style={{
        width: '10px',
        height: '10px',
        backgroundColor: color,
        borderRadius: shape,
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
};