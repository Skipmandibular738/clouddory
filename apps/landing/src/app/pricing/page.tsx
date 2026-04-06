'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

const faqs = [
  {
    question: 'Is CloudDory really free?',
    answer:
      'Yes. CloudDory is 100% free and open source under the MIT license. You can self-host it on your own infrastructure with zero cost. We also offer a free hosted demo at dashboard.clouddory.com for teams with under $10,000/month in cloud spend.',
  },
  {
    question: "What's included?",
    answer:
      'Everything — all modules included with no feature gates. FinOps & cost optimization, cloud security (CSPM), CVE tracking, threat intelligence, SOAR automation, DoryAI assistant, 20+ integrations, custom dashboards, and more.',
  },
  {
    question: 'What if my cloud spend exceeds $10,000/month?',
    answer:
      'Our hosted demo supports cloud accounts with up to $10,000/month in spend. For larger environments, we recommend self-hosting CloudDory on your own infrastructure — it takes about 10 minutes to set up with Docker. All features work identically when self-hosted.',
  },
  {
    question: 'Is this suitable for GovCloud and regulated environments?',
    answer:
      'Absolutely. Since CloudDory is self-hosted, your data never leaves your network. This makes it ideal for GovCloud, FedRAMP environments, air-gapped networks, and any organization with strict data residency requirements. No third-party data transmission required.',
  },
  {
    question: 'How do I self-host CloudDory?',
    answer:
      'Clone the repo from GitHub, configure your .env file with a database URL, and run docker-compose up. Full setup takes under 10 minutes. See the README for detailed instructions. Works on any server with Node.js 18+ and MySQL/MariaDB.',
  },
  {
    question: 'What AI providers are supported?',
    answer:
      'CloudDory supports Google Gemini, OpenAI (GPT-4), Anthropic (Claude), and OpenRouter. Bring your own API keys — they are stored encrypted and never shared. Configure them via Settings > AI Config in the dashboard.',
  },
  {
    question: 'Can I contribute to the project?',
    answer:
      'Yes! CloudDory is open source and we welcome contributions. Check out our GitHub repo at github.com/ALANDVO/clouddory for open issues, contribution guidelines, and the roadmap.',
  },
  {
    question: 'Who built this?',
    answer:
      'CloudDory was built by Alan Vo, an AI and cloud infrastructure developer. Reach out at alanvo@gmail.com for questions, partnerships, or consulting.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-medium text-white group-hover:text-cyan-400 transition-colors pr-4">
          {question}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5 text-slate-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-400 leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="relative">
      <Navbar />

      {/* Spacer for navbar */}
      <div className="pt-20" />

      {/* Existing Pricing Component */}
      <Pricing />

      {/* FAQ Section */}
      <section className="relative py-24 lg:py-32">
        <div className="section-divider mb-24" />
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-medium">
              FAQ
            </span>
            <h2 className="mt-4 font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Everything you need to know about CloudDory pricing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="border-t border-white/5"
          >
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 text-center"
          >
            <p className="text-slate-400 mb-4">Still have questions?</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Contact our sales team
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
