# Access Compass Modules

Complete module inventory for accessibility self-assessment. 26 modules across 5 journey phases with conditional logic, confidence-based responses, and optional evidence collection.

## Module Structure

Each module contains:
- **Pulse Check questions** - Quick overview (shown in both modes)
- **Deep Dive questions** - Detailed follow-ups (only in Deep Dive mode)
- **Media Analysis** - Optional automated website/media accessibility checks
- **Help Content** - Tips, examples, and guidance for each question

## Journey Phases

### 1. Before They Arrive (6 modules)
How customers find information, communicate with you, and plan their visit.

| Code | Module Name | Description |
|------|-------------|-------------|
| B1 | Pre-visit information | How you share accessibility information before customers visit |
| B4.1 | Website basics | Core website accessibility including navigation, content structure, and assistive technology compatibility |
| B4.2 | Booking & ticketing systems | Accessibility of online booking, ticketing, and reservation systems |
| B4.3 | Social media, video & audio | Accessibility of social media content, videos, and audio materials |
| B5 | Communication and language | How you communicate with customers who have different communication needs |
| B6 | Marketing and representation | How people with disability are represented in your marketing materials |

### 2. Getting In and Moving Around (4 modules)
Physical access and navigation.

| Code | Module Name | Description |
|------|-------------|-------------|
| A1 | Arrival, parking and drop-off | Parking spaces, drop-off zones, and approaching your venue |
| A2 | Entry and doors | Entrances, doors, and thresholds |
| A3a | Paths and aisles | Internal pathways, corridors, and aisles |
| A3b | Queues and busy times | Managing queues and high-traffic periods |

### 3. During the Visit (6 modules)
The experience while on-site.

| Code | Module Name | Description |
|------|-------------|-------------|
| A4 | Seating, furniture and layout | Seating options, furniture accessibility, and space layout |
| A5 | Toilets and amenities | Accessible toilets and other amenities |
| A6 | Lighting, sound and sensory environment | Sensory aspects of your environment |
| A6a | Equipment and resources | Accessibility equipment and resources you provide |
| B2 | Signage and wayfinding | Signs, directories, and navigation aids |
| B3 | Menus and printed materials | Menus, brochures, and other printed materials |

### 4. Service and Support (5 modules)
How you serve, support, and stay connected with customers.

| Code | Module Name | Description |
|------|-------------|-------------|
| C1 | Customer service and staff confidence | How staff interact with and support customers with disability |
| C2 | Bookings and ticketing | In-person and phone booking accessibility |
| A7 | Safety and emergencies | Emergency procedures and safety for people with disability |
| C3 | Feedback and reviews | How customers can provide feedback about accessibility |
| C4 | Staying connected | Post-visit communication and loyalty programs |

### 5. Organisational Commitment (5 modules)
How your organisation embeds accessibility into policies, employment, and operations.

| Code | Module Name | Description |
|------|-------------|-------------|
| P1 | Policy and inclusion | Accessibility policies and inclusion commitments |
| P2 | Employing people with disability | Employment practices for people with disability |
| P3 | Staff training and awareness | Disability awareness and accessibility training |
| P4 | Accessible procurement | Purchasing accessible products and services |
| P5 | Continuous improvement and reporting | Measuring and reporting on accessibility progress |

## Question Types

- **yes-no-unsure** - Standard Yes / No / Not sure
- **yes-no-limited** - Yes / Limited options / No / Not sure
- **single-select** - Single choice from options
- **multi-select** - Multiple choices from options
- **link-input** - URL/link input field
- **measurement** - Numeric measurement with unit
- **media-analysis** - Automated accessibility analysis (website, images, etc.)

## Review Modes

- **Pulse Check** - Quick 15-20 minute assessment covering key questions
- **Deep Dive** - Comprehensive 45-60 minute assessment with detailed follow-ups

## Universal Modules

Some modules are recommended to all businesses regardless of touchpoints selected:
- Modules marked with `isUniversal: true` appear for all businesses
- These cover fundamental accessibility areas relevant to every visitor economy business

## Module Changes Log

### January 2026
- Added new journey phase: **Organisational Commitment** (5 modules: P1-P5)
- Added `isUniversal` and `universalReason` properties for universal module recommendations
- Updated group descriptions for clarity
- Added comprehensive help content with tips and examples to all questions
- Added media analysis questions for automated accessibility checking
- Expanded question branching logic for more relevant follow-ups

### December 2024
- Initial 17 modules across 4 journey phases
- Basic question structure with pulse check and deep dive modes
