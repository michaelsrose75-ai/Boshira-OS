import React from 'react';
import type { PortfolioRules } from '../types';
import { Mail } from 'lucide-react';

interface EmailProviderSelectorProps {
  rules: PortfolioRules;
  onRulesChange: (newRules: PortfolioRules) => void;
}

const EmailProviderSelector: React.FC<EmailProviderSelectorProps> = ({ rules, onRulesChange }) => {
  const providers = [
    { id: 'Buttondown', name: 'Buttondown', description: 'Simple, minimalist email for creators.' },
    { id: 'ConvertKit', name: 'ConvertKit', description: 'Powerful email marketing for professional creators.' },
  ];

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
        <Mail size={22} className="mr-3 text-indigo-400" />
        Email Marketing Integration
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Select your email provider. The app will automatically use the correct API keys from your vault and generate the right landing page code.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map(provider => (
          <button
            key={provider.id}
            onClick={() => onRulesChange({ ...rules, activeEmailProvider: provider.id as 'Buttondown' | 'ConvertKit' })}
            className={`p-4 rounded-lg border-2 text-left transition-all ${rules.activeEmailProvider === provider.id ? 'bg-indigo-900/40 border-indigo-500 ring-2 ring-indigo-500' : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'}`}
          >
            <h4 className="font-bold text-lg text-white">{provider.name}</h4>
            <p className="text-sm text-gray-400">{provider.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmailProviderSelector;
