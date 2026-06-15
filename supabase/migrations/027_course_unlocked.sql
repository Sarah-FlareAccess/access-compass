-- Add course_unlocked flag for staged release of workshop content.
-- When the org has training_hub_only = TRUE and course_unlocked = FALSE,
-- members see a locked pre-flight landing instead of the course.
-- Flip to TRUE on workshop day to release the course content.
-- Has no effect on orgs that do not have training_hub_only = TRUE.

ALTER TABLE organisations
ADD COLUMN IF NOT EXISTS course_unlocked BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN organisations.course_unlocked IS 'When false and training_hub_only is true, members see a locked pre-flight landing instead of course content. Flip to true on workshop day to release the course.';
