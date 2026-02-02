/**
 * DiscoveryHelp Page
 *
 * Full help page for the discovery/onboarding process.
 * Contains comprehensive FAQs, journey mapping guide, and contact options.
 *
 * Tone: Encouraging, supportive, professional
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/discovery-help.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  icon: string;
  faqs: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "Getting Started",
    icon: "🚀",
    faqs: [
      {
        question: "What is Access Compass?",
        answer: "Access Compass is a self-assessment tool that helps businesses understand and improve their accessibility. We guide you through evaluating your customer experience from an accessibility perspective, then provide practical recommendations you can implement."
      },
      {
        question: "Who is this for?",
        answer: "Access Compass is designed for any business that serves customers - whether you're a café, retail store, hotel, tourist attraction, or service provider. If people visit your premises or use your services, this tool can help you make their experience more accessible."
      },
      {
        question: "How long does the discovery process take?",
        answer: "Most people complete the discovery process in 5-10 minutes. It's designed to be quick and straightforward. You can pause at any time and come back later - your progress is automatically saved."
      },
      {
        question: "Do I need to complete everything in one session?",
        answer: "Not at all! Your progress is saved automatically as you go. Feel free to take breaks, consult with colleagues, or gather information. When you return, you'll pick up right where you left off."
      },
    ]
  },
  {
    title: "Journey Mapping",
    icon: "🗺️",
    faqs: [
      {
        question: "What is journey mapping?",
        answer: "Journey mapping is thinking through the complete experience a customer has with your business - from first finding out about you, to arriving, moving through your space, using your services, and leaving. By understanding this journey, we can identify where accessibility improvements would have the biggest impact."
      },
      {
        question: "How do I choose which touchpoints apply to my business?",
        answer: "Think about a typical customer visit from start to finish. Select the touchpoints that are part of their experience. For example, if customers drive to you, select 'Parking'. If you have a physical shopfront, select 'Entry'. If something doesn't apply (like you don't have a website), you can mark it as not applicable."
      },
      {
        question: "What are the different journey phases?",
        answer: "We break the customer journey into four phases: 'Before Arrival' (finding you, booking, planning), 'Getting In' (parking, approaching, entering), 'During Visit' (moving around, using facilities, experiencing your service), and 'Service & Support' (getting help, communication, feedback). This helps ensure nothing is overlooked."
      },
      {
        question: "What if a touchpoint only partially applies?",
        answer: "Select it anyway! It's better to include it and provide context than to skip it entirely. During the detailed assessment, you'll have opportunities to explain the specifics of your situation."
      },
    ]
  },
  {
    title: "Answering Questions",
    icon: "✍️",
    faqs: [
      {
        question: "What if I'm not sure about an answer?",
        answer: "That's completely okay! Just give your best estimate based on what you know. This isn't a test - it's a tool to help you understand your current state. If you're uncertain, you might note that as something to verify later."
      },
      {
        question: "Can I change my answers later?",
        answer: "Absolutely! You can revisit the discovery process anytime from your dashboard. Your business might change over time, or you might learn new information. We encourage you to keep your responses up to date."
      },
      {
        question: "Should I answer based on how things are now, or how I want them to be?",
        answer: "Please answer based on your current state. Being honest about where you are today helps us give you the most relevant and useful recommendations. The goal is improvement, not perfection."
      },
      {
        question: "What if different locations or situations have different answers?",
        answer: "Focus on your primary location or most common scenario first. If you have multiple very different situations, you can run separate assessments for each. Contact us if you need help with complex multi-site setups."
      },
    ]
  },
  {
    title: "After Discovery",
    icon: "📋",
    faqs: [
      {
        question: "What happens after I complete discovery?",
        answer: "Based on your responses, we'll recommend specific accessibility modules for you to review. These modules contain questions about particular aspects of your business, and completing them will give you a clear picture of what you're doing well and where you can improve."
      },
      {
        question: "What's the difference between Pulse Check and Deep Dive?",
        answer: "Pulse Check gives you a quick overview of key accessibility areas - great for getting started or doing regular check-ins. Deep Dive goes into comprehensive detail, examining every aspect thoroughly. Deep Dive also includes access to DIAP (Disability Inclusion Action Plan) management tools."
      },
      {
        question: "Can I upgrade from Pulse Check to Deep Dive later?",
        answer: "Yes! You can upgrade at any time. Your existing progress and responses will be preserved, and you'll gain access to the additional Deep Dive questions and DIAP features."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we take data security seriously. Your information is stored securely and is only used to provide you with accessibility insights and recommendations. We never share your data with third parties without your consent."
      },
    ]
  },
];

export default function DiscoveryHelp() {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleFAQ = (sectionIndex: number, faqIndex: number) => {
    const key = `${sectionIndex}-${faqIndex}`;
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const isExpanded = (sectionIndex: number, faqIndex: number) => {
    return expandedItems.has(`${sectionIndex}-${faqIndex}`);
  };

  return (
    <div className="discovery-help-page">
      {/* Header */}
      <header className="discovery-help-header">
        <button
          onClick={() => navigate(-1)}
          className="back-link"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span>Back</span>
        </button>
        <h1 className="discovery-help-title">Help & FAQs</h1>
        <p className="discovery-help-subtitle">
          Everything you need to know about completing your accessibility discovery
        </p>
      </header>

      {/* Main Content */}
      <main className="discovery-help-content">
        {/* Encouragement Banner */}
        <div className="encouragement-banner">
          <div className="encouragement-icon">💪</div>
          <div className="encouragement-text">
            <strong>You're taking a great step!</strong>
            <p>By exploring accessibility, you're working to make your business welcoming for everyone. We're here to support you every step of the way.</p>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="faq-sections">
          {faqSections.map((section, sectionIndex) => (
            <section key={sectionIndex} className="faq-section">
              <h2 className="faq-section-title">
                <span className="faq-section-icon">{section.icon}</span>
                {section.title}
              </h2>
              <ul className="faq-list">
                {section.faqs.map((faq, faqIndex) => {
                  const expanded = isExpanded(sectionIndex, faqIndex);
                  return (
                    <li key={faqIndex} className="faq-item">
                      <button
                        className={`faq-question ${expanded ? 'expanded' : ''}`}
                        onClick={() => toggleFAQ(sectionIndex, faqIndex)}
                        aria-expanded={expanded}
                      >
                        <span>{faq.question}</span>
                        <svg
                          className="faq-chevron"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      <div className={`faq-answer ${expanded ? 'expanded' : ''}`}>
                        <p>{faq.answer}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <section className="contact-section">
          <h2 className="contact-title">Still have questions?</h2>
          <p className="contact-text">
            Our team is here to help. Whether you're stuck on a question, need clarification,
            or just want to chat about accessibility, we'd love to hear from you.
          </p>
          <div className="contact-options">
            <a
              href="mailto:support@accesscompass.com.au?subject=Help%20with%20Access%20Compass"
              className="contact-btn primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Email Us</span>
            </a>
            <div className="contact-info">
              <p><strong>Email:</strong> support@accesscompass.com.au</p>
              <p><strong>Response time:</strong> Usually within 24 hours</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
