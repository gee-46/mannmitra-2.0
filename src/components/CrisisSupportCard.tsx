import React from 'react';
import { Phone } from 'lucide-react';

const CrisisSupportCard = () => {
  return (
    <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl p-6 max-w-md w-full mx-auto my-4 border-2 border-red-400 shadow-2xl shadow-red-500/50">
      <div className="text-center space-y-4">
        <h2 className="font-bold text-2xl mb-2">🆘 Crisis Support</h2>
        <p className="text-lg font-semibold mb-6">You are not alone. Please reach out for immediate help:</p>

        <div className="space-y-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-center gap-3 bg-white/20 rounded-lg p-4 hover:bg-white/30 transition-colors">
            <Phone className="w-6 h-6" />
            <div className="text-left">
              <p className="font-bold text-sm">KIRAN Mental Health Helpline</p>
              <a href="tel:18005990019" className="text-2xl font-bold tracking-wide">1800-599-0019</a>
              <p className="text-xs text-white/80 mt-1">24/7 Support (Toll-Free)</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 bg-white/20 rounded-lg p-4 hover:bg-white/30 transition-colors">
            <Phone className="w-6 h-6" />
            <div className="text-left">
              <p className="font-bold text-sm">Vandrevala Foundation</p>
              <a href="tel:9999666555" className="text-2xl font-bold tracking-wide">9999-666-555</a>
              <p className="text-xs text-white/80 mt-1">24/7 Confidential Support</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/90 italic mt-4">
          "Your life matters. These trained professionals are here to listen and help."
        </p>
      </div>
    </div>
  );
};

export default CrisisSupportCard;
