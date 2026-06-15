import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { PageFooter } from '../PageFooter';
import './CourseLockedLanding.css';

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'drafting-ai',
    label: 'Drafting AI account ready',
    detail: 'Create a ChatGPT account at chat.openai.com (free tier OK). Microsoft Copilot or Google Gemini also work as alternatives. Pick one as your drafting tool for the workshop. Do not use Claude for drafting, we reserve Claude for the Reviewer role.',
  },
  {
    id: 'reviewer-ai',
    label: 'Claude account ready for the Reviewer role',
    detail: 'Create a Claude account at claude.ai (free tier OK). Claude has tighter daily message limits on the free tier, so we keep it for the Reviewer role only (fewer messages) and use ChatGPT or another tool for the drafting work (lots of iteration).',
  },
  {
    id: 'device',
    label: 'Laptop or desktop ready',
    detail: 'Not a phone. Screens are too small for the work we will do. Make sure you can join the workshop with a real keyboard and a browser open.',
  },
  {
    id: 'source-material',
    label: 'At least 400 words of source material from your business',
    detail: 'A webpage section, an FAQ, a policy excerpt, a brochure section, a menu page, signage copy or detailed bullet-point notes. Below 400 words the AI starts inventing access details, which is high-risk for content you intend to publish.',
  },
  {
    id: 'format-identified',
    label: 'Identified your format and the specific document you want to create',
    detail: 'Pick one of the six formats: Easy Read, Plain Language, Social Story or Visual Narrative, Accessibility Guide, Accessible Word Document or Large Print. Note which specific piece of content you want to develop in the workshop.',
  },
];

export function CourseLockedLanding() {
  usePageTitle('Workshop pre-flight');
  const { accessState, user } = useAuth();
  const orgName = accessState.organisation?.name || 'your organisation';
  const userId = user?.id || 'anonymous';
  const storageKey = `course_preflight_checklist_${userId}`;

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const completedCount = CHECKLIST_ITEMS.filter(i => checked[i.id]).length;
  const allDone = completedCount === CHECKLIST_ITEMS.length;

  return (
    <div className="course-locked-landing">
      <header className="locked-header">
        <span className="locked-badge">Workshop pre-flight</span>
        <h1>Welcome, {orgName}.</h1>
        <p className="locked-subtitle">
          Your AI Accessible Communications course unlocks on workshop day. Use the time before to set up your tools and gather your content. Your progress on this checklist saves to this device.
        </p>
      </header>

      <section className="locked-before-you-start" aria-labelledby="before-heading">
        <h2 id="before-heading">Before you start: what this course is for</h2>
        <p>This workshop pairs AI as your first drafter with you as the final reviewer. AI handles structure, reformatting and first-pass drafts. You stay in charge of accuracy, voice and judgement.</p>
        <p><strong>The course is upstream of consultation, never a substitute.</strong> These still matter and the workshop does not replace them:</p>
        <ul>
          <li>Lived-experience review and co-design with disability community</li>
          <li>Your DIAP or DAIP process and community consultation</li>
          <li>Specialist producers for high-stakes content (Easy Read producers, Auslan interpreters, audio describers)</li>
        </ul>
        <div className="locked-warning">
          <strong>Do not AI-draft these content types:</strong> behaviour support plans, crisis or emergency information, content for very young children, content about Aboriginal and Torres Strait Islander communities, NDIS plan documents, legal terms and diagnostic content.
        </div>
      </section>

      <section className="locked-checklist-section" aria-labelledby="checklist-heading">
        <h2 id="checklist-heading">Pre-flight checklist</h2>
        <p className="locked-checklist-progress" aria-live="polite">
          {allDone ? 'All set. See you on workshop day.' : `${completedCount} of ${CHECKLIST_ITEMS.length} complete`}
        </p>
        <ul className="locked-checklist">
          {CHECKLIST_ITEMS.map(item => (
            <li key={item.id} className={`locked-checklist-item${checked[item.id] ? ' is-checked' : ''}`}>
              <label className="locked-checklist-label">
                <input
                  type="checkbox"
                  checked={!!checked[item.id]}
                  onChange={() => toggle(item.id)}
                  aria-describedby={`${item.id}-detail`}
                />
                <span className="locked-checklist-content">
                  <span className="locked-checklist-title">{item.label}</span>
                  <span id={`${item.id}-detail`} className="locked-checklist-detail">{item.detail}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="locked-contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Questions before the workshop?</h2>
        <p>Email <a href="mailto:sarah@flareaccess.com">sarah@flareaccess.com</a>.</p>
      </section>

      <PageFooter />
    </div>
  );
}
