-- Track whether a user has manually edited a DIAP item's action or success
-- indicators. Content-refresh migrations skip edited items so a user's own
-- wording is never overwritten when we ship improved default content.

ALTER TABLE diap_items
  ADD COLUMN IF NOT EXISTS content_edited boolean NOT NULL DEFAULT false;
