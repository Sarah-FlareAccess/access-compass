# Slide Deck Copy Review — 2026-06-15

Source: 20-slide deck for the Using AI to Create Accessible & Inclusive Communications workshop. Reviewed against course state as of commit `7bf52df` (today).

Overall verdict: structurally strong, messaging mostly aligned, but 3 critical mismatches with today's course changes plus a style sweep needed before this fronts the cohort.

---

## Critical (publishing blockers)

These directly contradict today's course state and will cause demo/teaching errors.

### 1. Slide 15 "Export to PDF" step

Current copy: *"Export to PDF: Enable 'Document structure tags' when exporting."*

Problem: today we descoped PDF accessibility from the workshop. Course now states full PDF accessibility verification requires Adobe Acrobat Pro or Grackle Docs and sits outside this session. Slide still promises PDF export as a Stage 7 deliverable.

Fix options:
- A. Delete the Export to PDF step entirely. End Stage 7 at Run Accessibility Checker.
- B. Reframe as: *"Optional: starter PDF only. Word's PDF export with structure tags is a basic step, not full PDF accessibility. Full PDF verification needs Adobe Acrobat Pro or Grackle Docs, see handout."*

Recommend B if you want to keep the slide visually balanced, A if you want a clean scope.

### 2. Slide 14 prompt missing per-issue confirmation

Current copy: *"Paste into ChatGPT: 'Please apply these and show the full updated draft'"*

Problem: today's fix in the iteration prompt requires Part A (full updated draft) + Part B (numbered confirmation list of what changed per issue). Without Part B you get the silent skips we caught in the waterbike test today. The slide's simple prompt is the OLD form.

Fix: update slide 14 to show the new prompt structure:

> Please update the draft to address each issue. Then return:
> A. The COMPLETE updated draft from heading to sign-off line.
> B. A numbered confirmation list saying what you changed for each issue. For structural changes, name the section you moved or merged. If you could not action an issue, say so and explain why.

If that runs too long for the slide, abbreviate to: *"'Apply each issue. Return: A) the full updated draft, B) a numbered list of what changed for each issue.'"*

### 3. Slide 4 title "AI is a co-pilot, not the author"

Problem: project decision recorded in memory is to avoid "Co-Pilot" terminology because it conflicts with the Microsoft Copilot product name. The slide title uses it verbatim.

Fix options:
- "AI is your first drafter, not the author"
- "AI is your assistant, not the author"
- "AI is your starting point, not the author"

Recommend first or second. The Venn diagram and supporting text on this slide are otherwise strong, only the title needs swapping.

---

## Style violations (house rules)

### 4. Em-dashes throughout

House rule: no em or en dashes. Use periods, commas, colons or parentheses.

Instances found:
- Slide 11: *"Always end with the magic phrase: 'Show the full updated draft' — without it..."*
- Slide 11: *"One at a time — do not ask for five things at once."*
- Slide 12: *"Back at [TIME] — rest your eyes and stretch."*
- Slide 13: *"Not every issue raised needs to be actioned — your judgement matters."*
- Slide 14: *"That is why it is structured that way — it is already formatted for ChatGPT to act on."*
- Slide 16: *"Different build prompt — same brief, same review..."*
- Slide 17: *"In 6 weeks you will have a complete suite of accessible content — and within a year..."*
- Slide 18: *"About your venue, your services, your context — not a generic version."*

Sweep all em-dashes to colons, commas or periods.

### 5. Slide 8 ungrammatical line

Current: *"Save and confirm both reply"*

Should be: *"Save and confirm both have replied"* or *"Save and confirm both respond"*.

### 6. Slide 2 "shippable" jargon

Current: *"Today is about turning that work into shippable, customer-facing content."*

"Shippable" is software jargon. For council, hospitality and festival audiences:
- "publish-ready, customer-facing content"
- "customer-ready content"
- "real customer-facing content"

Recommend "publish-ready".

---

## Structural alignment

### 7. Slide 17 "Sensory map" in Week 5 schedule

Problem: "sensory map" is not one of the 6 course formats. The deck claims "the same workflow works for every format" then lists a 6-week schedule including a format the workshop has not trained them on. Participants will look for a sensory-map build prompt and not find one.

Fix: swap Week 5 to one of the 6 covered formats. Options that fit a small business cadence:
- "A Plain Language refund policy"
- "An Accessible Word policy doc"
- Drop Week 5 entirely, make it 5 weeks

### 8. Slides 3 + 7 say "Eight steps", in-app course is 4 lessons

Not wrong, just two different mental models. Participants who return to the in-app course will see 4 lessons, not 8 steps.

Fix: add one line on slide 7 noting *"Grouped as 4 lessons in your in-app course."* No need to rebuild the workflow visual.

### 9. Slide 19 "Format Failure Modes Cheat Sheet"

Verify this exists in your printed pack. If not yet built, either drop the entry or build before Wednesday.

### 10. Slide 1 program name

Verify "Designing Accessible Experiences program" is the actual CoM pilot program name. Not in project memory, worth a quick check with Josie at CoM before printing.

---

## Things to keep as-is (strong copy)

- Slides 4 + 5 frame AI scope correctly and match the Lesson 1 safety scaffolding
- Slide 6 four-part Teach/Demo/Do/Ask rhythm is solid workshop facilitation structure
- Slide 11 "Show the full updated draft" magic phrase callout is directly aligned with today's iteration fix
- Slide 18 Human Review messaging mirrors the Layer Your Review section in Lesson 4
- Slides 8 to 15 stage progress pills help participants track where they are
- Slide 5 red-list (do not use AI for behaviour support, crisis, very young children, ATSI content, NDIS plans, legal terms, diagnostic) matches the course content exactly
- Slide 20 closing line *"AI is the first draft. You are the final word. Now go make something accessible."* is a clean exit

---

## Suggested order of work

1. Fix items 1, 2, 3 first. These are the only items that will actively mislead participants if left.
2. Em-dash sweep (item 4). Mechanical, ~8 swaps.
3. Items 5, 6 (grammar and jargon). 2 small wording fixes.
4. Items 7, 8 (structural alignment). One swap on slide 17 plus one line added to slide 7.
5. Verify items 9, 10 against your prep and CoM program name.

Estimated total time: 20 to 30 minutes in your slide tool.
