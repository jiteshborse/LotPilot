import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { HelpCircle, ChevronDown, ChevronUp, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Fundamentals' | 'Instruments & Sizing' | 'Broker Nuances' | 'Safety & Execution';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'Fundamentals',
    question: 'What is position sizing?',
    answer:
      'Position sizing is the mathematical determination of how many units, shares, lots, coins, or contracts to trade so that if your predetermined stop-loss level is reached, your financial loss exactly equals your predefined risk budget.',
  },
  {
    category: 'Fundamentals',
    question: 'How does a stop loss affect position size?',
    answer:
      'Position size is inversely proportional to your stop-loss distance. If your stop loss is tight (close to entry), each unit represents a smaller financial loss, permitting a larger position size for the same cash risk. Conversely, a wide stop loss requires a smaller position size to keep total loss within your risk budget.',
  },
  {
    category: 'Instruments & Sizing',
    question: 'What is the difference between lots, shares, coins, and contracts?',
    answer:
      'Shares represent equity ownership in cash stocks. Coins represent digital units in cryptocurrency spot. Lots are standardized bundles used in Forex (1 standard lot = 100,000 currency units) and Commodity CFDs (e.g. 100 oz of gold). Contracts are exchange-defined derivatives specifications in futures and options.',
  },
  {
    category: 'Broker Nuances',
    question: 'Why does lot size vary between brokers?',
    answer:
      'Over-the-counter (OTC) brokers and CFD providers set their own contract specifications. For example, while standard institutional gold lots are 100 troy ounces, some retail brokers define a lot as 10 oz or 1 oz. LotPilot provides an "Edit Specifications" panel so you can match your broker\'s exact contract sizing.',
  },
  {
    category: 'Broker Nuances',
    question: 'Why do I need an account currency?',
    answer:
      'When you trade an instrument quoted in a currency different from your deposit account (such as trading USD/CHF or RELIANCE in INR with a USD account), your profit or loss must be converted. LotPilot calculates the exact currency conversion route to ensure your final risk does not exceed your account budget.',
  },
  {
    category: 'Instruments & Sizing',
    question: 'What is a pip, point, tick, and contract multiplier?',
    answer:
      'A pip is typically the 4th decimal place (0.0001) in forex, or 2nd (0.01) in JPY pairs. A tick is the minimum price movement allowed on an exchange (e.g. 0.25 on CME ES futures). A point is a full whole number price change (1.00) in an index. A contract multiplier specifies how many underlying units are controlled per contract (e.g., 50 for ES, 100 for equity options).',
  },
  {
    category: 'Broker Nuances',
    question: 'What happens when my broker has a minimum lot size?',
    answer:
      'If your calculated theoretical risk requires 0.004 lots but your broker’s minimum lot size is 0.01 lots, placing a 0.01 lot order would exceed your risk budget. LotPilot issues a clear warning and sets the permitted quantity according to strict floor rounding rules so you are alerted before entering an oversized trade.',
  },
  {
    category: 'Safety & Execution',
    question: 'Why can the actual loss differ from the estimated risk?',
    answer:
      'LotPilot models theoretical stop-loss execution at your exact requested price. In live markets, realized losses may differ due to market gaps over weekends or news events, execution slippage, bid-ask spread widening, broker commissions, and currency exchange rate drift during trade duration. A stop-loss order is an order to sell when a price is reached, not a guarantee of execution price.',
  },
  {
    category: 'Fundamentals',
    question: 'Does the calculator provide trade signals or promise profits?',
    answer:
      'No. LotPilot is strictly an analytical risk calculation and position sizing tool. It does not provide buy or sell signals, algorithmic trading advice, or guarantees of profitability. Risk management preserves capital; it does not predict market direction.',
  },
  {
    category: 'Safety & Execution',
    question: 'Do I need to connect my brokerage account or share passwords?',
    answer:
      'No. LotPilot requires zero brokerage logins, passwords, or API keys. All calculations run client-side in your web browser using local storage, keeping your trading data private and secure.',
  },
  {
    category: 'Instruments & Sizing',
    question: 'How are stock futures and options different from cash shares?',
    answer:
      'Cash shares involve direct capital purchase with linear 1:1 exposure. Stock futures employ leverage and exchange lot bundles (such as 25 shares per lot in NSE NIFTY). Options involve non-linear premium decay (theta), volatility (vega), and contract multipliers (typically 100 shares per contract in US options).',
  },
  {
    category: 'Safety & Execution',
    question: 'How frequently are instrument specifications updated?',
    answer:
      'LotPilot includes standard verified exchange specifications and illustrative broker presets with explicit timestamped references. Because retail brokers change their contract specifications periodically, LotPilot allows you to review, edit, and persist custom specifications at any time.',
  },
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="py-6 space-y-8">
      <Container size="xl">
        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Everything you need to know about position sizing, contract multipliers, broker variations, and trade execution safety.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl space-y-3">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-150"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <div className="space-y-1 pr-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block font-mono">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 leading-relaxed bg-slate-950/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link to="/calculator">
            <Button variant="primary" size="lg" leftIcon={<Calculator className="w-5 h-5" />}>
              Open Position Size Calculator
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};
