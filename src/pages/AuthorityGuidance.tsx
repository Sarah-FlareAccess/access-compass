import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
import { accessModules, moduleGroups } from '../data/accessModules';
import '../styles/authority.css';

import type { AuthorityQuestionGuidance, AuthorityProgram } from '../types/access';

export default function AuthorityGuidance() {
  usePageTitle('Guidance Notes');
  const { accessState } = useAuth();
  const orgId = accessState.organisation?.id;
  const { getGuidanceNotes, saveGuidanceNote, deleteGuidanceNote, getPrograms, isLoading } = useAuthorityAdmin();

  const [guidance, setGuidance] = useState<AuthorityQuestionGuidance[]>([]);
  const [programs, setPrograms] = useState<AuthorityProgram[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    getGuidanceNotes(orgId).then(setGuidance);
    getPrograms(orgId).then(setPrograms);
  }, [orgId]);

  const handleSave = async () => {
    if (!orgId || !editingQuestionId || !editText.trim()) return;
    setSaving(true);
    const result = await saveGuidanceNote({
      organisation_id: orgId,
      question_id: editingQuestionId,
      guidance_text: editText.trim(),
      program_id: selectedProgramId || undefined,
    });
    if (result) {
      setGuidance(prev => {
        const existing = prev.findIndex(g => g.question_id === editingQuestionId && g.program_id === (selectedProgramId || null));
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = result;
          return updated;
        }
        return [...prev, result];
      });
      setEditingQuestionId(null);
      setEditText('');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteGuidanceNote(id);
    if (success) {
      setGuidance(prev => prev.filter(g => g.id !== id));
    }
  };

  const startEdit = (questionId: string) => {
    const existing = guidance.find(g => g.question_id === questionId);
    setEditingQuestionId(questionId);
    setEditText(existing?.guidance_text || '');
    setSelectedProgramId(existing?.program_id || '');
  };

  if (!orgId) return null;

  const currentModule = accessModules.find(m => m.id === selectedModule);

  return (
    <div className="authority-page">
      <Link to="/authority" className="authority-back-link">Authority Portal</Link>
      <div className="authority-header">
        <h1>Guidance Notes</h1>
      </div>

      <p className="authority-subtitle">
        Add local context to standard assessment questions. Your notes appear alongside the question for enrolled businesses. Questions remain unchanged.
      </p>

      {/* Module selector */}
      <div className="authority-form-group">
        <label htmlFor="module-select">Select module</label>
        <select id="module-select" value={selectedModule} onChange={e => setSelectedModule(e.target.value)}>
          <option value="">Choose a module</option>
          {moduleGroups.map(group => (
            <optgroup key={group.id} label={group.label}>
              {accessModules.filter(m => m.group === group.id).map(mod => (
                <option key={mod.id} value={mod.id}>{mod.id} {mod.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Existing guidance notes (when no module selected) */}
      {!selectedModule && guidance.length > 0 && (
        <div className="authority-section">
          <h2>Your guidance notes ({guidance.length})</h2>
          <div className="authority-guidance-list">
            {guidance.map(note => (
              <div key={note.id} className="authority-guidance-item">
                <div className="authority-guidance-item-header">
                  <span className="authority-guidance-question-id">{note.question_id}</span>
                  <button className="btn btn-small btn-outline" onClick={() => handleDelete(note.id)}>Remove</button>
                </div>
                <p>{note.guidance_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions for selected module */}
      {currentModule && (
        <div className="authority-section">
          <h2>{currentModule.id} {currentModule.name}</h2>
          <div className="authority-guidance-list">
            {currentModule.questions.map(question => {
              const existingNote = guidance.find(g => g.question_id === question.id);
              const isEditing = editingQuestionId === question.id;

              return (
                <div key={question.id} className="authority-guidance-item">
                  <div className="authority-guidance-question">
                    <span className="authority-guidance-question-id">{question.id}</span>
                    <span>{question.text}</span>
                  </div>

                  {existingNote && !isEditing && (
                    <div className="authority-guidance-note">
                      <p>{existingNote.guidance_text}</p>
                      <div className="authority-guidance-actions">
                        <button className="btn btn-small btn-outline" onClick={() => startEdit(question.id)}>Edit</button>
                        <button className="btn btn-small btn-outline" onClick={() => handleDelete(existingNote.id)}>Remove</button>
                      </div>
                    </div>
                  )}

                  {isEditing && (
                    <div className="authority-guidance-edit">
                      <textarea
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        placeholder="Add local guidance for this question (e.g., 'City of Melbourne requires minimum 2 accessible parking spaces for venues over 200sqm')"
                        rows={3}
                      />
                      {programs.length > 0 && (
                        <select value={selectedProgramId} onChange={e => setSelectedProgramId(e.target.value)}>
                          <option value="">All programs</option>
                          {programs.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      )}
                      <div className="authority-guidance-actions">
                        <button className="btn btn-primary btn-small" onClick={handleSave} disabled={saving || !editText.trim()}>
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button className="btn btn-small btn-outline" onClick={() => setEditingQuestionId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {!existingNote && !isEditing && (
                    <button className="btn btn-small btn-outline" onClick={() => startEdit(question.id)}>
                      Add guidance
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!selectedModule && guidance.length === 0 && !isLoading && (
        <div className="authority-empty">
          <p>Select a module above to add guidance notes to specific questions.</p>
        </div>
      )}
    </div>
  );
}
