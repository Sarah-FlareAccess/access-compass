# Changelog

All notable changes to Access Compass will be documented in this file.

## [Unreleased]

### Added

#### Module Ownership & Accountability
- **Module Assignment System**: Assign modules to team members with name, email, and target completion date
- **Person+Plus Icon**: Improved assign button with clear person-with-plus icon (previously ambiguous `+` symbol)
- **Email Field**: Added optional email field for future notification capability
- **Completion Confirmation**: At end of module, users confirm completion with "Completed by" name and role
  - Pre-fills with assigned person if module was assigned
  - Completion date is captured automatically
- **Confidence Snapshot**: Automatic assessment of module confidence (Strong/Mixed/Needs Work) based on responses

#### DIAP Integration
- **DIAP Section Mapping**: Modules now map to standard DIAP focus areas:
  - Information & Communication
  - Built Environment
  - Service Delivery
  - Customer Service & Training
  - Policy & Procedure
- **Evidence Layer**: DIAP Workspace shows completed module metadata as evidence
- **View Mode Toggle**: Switch between list view and by-section view in DIAP Workspace

#### Reports
- **Module Evidence Section**: Reports now include "Modules Reviewed" section showing:
  - Module name and code
  - Completion date
  - Who completed it (name and role)
  - Who it was assigned to
  - Confidence snapshot
  - Count of strengths and actions identified

### Changed
- Assignment modal now includes email field for future notifications
- Assign button shows edit (pencil) icon when module already has assignment
- Improved tooltip messages for assignment button

### Technical
- Added `ModuleOwnership` interface with `assignedToEmail` field
- Added `ModuleCompletionEvidence` interface for report generation
- Created `src/data/diapMapping.ts` for DIAP section mapping utilities
- Updated `useModuleProgress` hook with ownership management methods
- Updated `useReportGeneration` hook to include module evidence

## [0.1.0] - Initial Release

### Added
- Core accessibility self-review functionality
- 13 assessment modules covering:
  - Before the visit (Accessibility Information)
  - Getting in and around (Entrance, Parking, Paths, Vertical Movement, Wayfinding, Toilets, Sensory Environment)
  - During the visit (Experience, Service Points, Seating)
  - Service and support (Staff Awareness, Communication Support)
- Discovery flow for organisation context
- Module-based question flow with branching logic
- Summary generation with strengths, actions, and areas to explore
- DIAP (Disability Inclusion Action Plan) workspace
- Report generation (Pulse Check and Deep Dive modes)
- PDF export capability
- Local storage persistence
