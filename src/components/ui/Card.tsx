import React from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = ({ className, children, ...props }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={twMerge(
      'bg-card backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-4',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

export default Card;
