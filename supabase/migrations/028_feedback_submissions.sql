-- Capture in-app feedback submissions (Report a Problem + Need more resource info).
-- Previously these forms only logged to the browser console.
-- This table receives the submissions so Sarah can read them via SQL.

CREATE TABLE IF NOT EXISTS feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 'problem' for Report a Problem, 'resource_request' for Need more resource info
  submission_type TEXT NOT NULL CHECK (submission_type IN ('problem', 'resource_request')),

  -- Sub-category chosen in the form
  category TEXT NOT NULL,

  -- Free-text body (problem description or resource request detail)
  details TEXT,

  -- Page context at the time of submission
  page_url TEXT,
  page_pathname TEXT,
  user_agent TEXT,
  has_screenshot BOOLEAN DEFAULT FALSE,

  -- Who submitted (null if anonymous / not logged in)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  organisation_name TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_submissions_created_at ON feedback_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_type ON feedback_submissions(submission_type);

-- Anyone authenticated can INSERT their own feedback (no RLS check on submitter side
-- because we want anonymous-feeling submissions to land too). Reads are restricted to
-- service_role / dashboard only.
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON feedback_submissions
  FOR INSERT
  WITH CHECK (TRUE);

-- Reads only via service_role (dashboard SQL Editor or admin scripts).
-- No SELECT policy for authenticated users = no read access.

GRANT INSERT ON feedback_submissions TO authenticated, anon;
GRANT SELECT ON feedback_submissions TO service_role;

COMMENT ON TABLE feedback_submissions IS 'In-app feedback from ReportProblem and ResourceInfoRequest forms.';
