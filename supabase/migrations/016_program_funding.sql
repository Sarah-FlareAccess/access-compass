-- =====================================================
-- ACCESS COMPASS - PROGRAM FUNDING MODEL
-- =====================================================
-- Migration: 016_program_funding.sql
-- Adds funding model and license pricing to authority programs
-- =====================================================

-- Funding model: who pays for business licenses
ALTER TABLE authority_programs
  ADD COLUMN IF NOT EXISTS funding_model TEXT NOT NULL DEFAULT 'authority_funded'
    CHECK (funding_model IN ('authority_funded', 'business_funded', 'co_funded'));

-- License price in cents (AUD) for business-funded or co-funded programs
-- NULL means authority-funded (no charge to business)
ALTER TABLE authority_programs
  ADD COLUMN IF NOT EXISTS license_price_cents INTEGER;

-- Display message shown to businesses on the enrol page
ALTER TABLE authority_programs
  ADD COLUMN IF NOT EXISTS enrol_message TEXT;
