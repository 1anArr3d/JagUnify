# Milestone 2 Deliverables
## Team: JagUnify
### Focus: MVP Demo of a Reliable, Grounded TAMUSA Information Assistant

---

## Context

- Sprint 1 was intended to make the system reliable, verifiable, and demo-ready.
- Milestone 2 is due on Apr 5th.
- Milestone 2 is the MVP milestone, not a planning checkpoint.

By Milestone 2, the team must demonstrate a working MVP with a clearly frozen scope and visible trust signals.

---

# Milestone 2 Objective

By Milestone 2, your team must demonstrate:

- A stable end-to-end MVP that answers a limited set of TAMUSA questions reliably
- Visible retrieval evidence for every grounded answer
- Clear refusal behavior for unsupported or out-of-scope questions
- Consistent scope across PRD, README, evaluation, and live demo
- A clean repository with complete deliverables and no missing required artifacts
- Minimum functioning UI

The expectation is not breadth.
The expectation is a small, trustworthy product.

---

# 1. MVP Scope Freeze

Submit a short scope statement at the top of the README and in the demo:

- What domains are in scope
- What domains are out of scope
- What the system will refuse

Expected MVP scope:

- Admissions
- Financial aid
- Registration / academic policies
- One additional domain only if it is already reliable and evaluated

If tutoring or IT are claimed, they must be indexed, demonstrated, and evaluated.
If they are not ready, remove them from MVP claims.

---

# 2. Required MVP Demo

In class, you must show all of the following live:

1. One successful admissions or financial-aid question
2. One successful registration / academic-policy question
3. The retrieved top-k source evidence for each answer
4. The final answer with inline citations
5. The source preview or snippet evidence used to support the answer
6. One refusal case for an unsupported question

The demo must make the retrieval step visible.
Citation links alone are not enough if the user cannot see the evidence flow.

---

# 3. Retrieval and Verification Expectations

For Milestone 2, the system must show:

- Retrieved sources ranked and displayed
- Citations mapped to actual retrieved documents
- Refusal when support is missing or weak
- No unsupported claims in answers

Minimum bar:

- Retrieval accuracy improves or is defended with a concrete limitation analysis
- Grounding accuracy remains high
- Refusal behavior is predictable and explainable

You must address the known Sprint 1 failure cases, especially:

- Graduate-program retrieval gap
- Any ambiguity in refusal behavior for weak matches

If a failure remains, document it explicitly and narrow scope accordingly.

---

# 4. Required Repository Deliverables

Your repository must include:

- `/docs/Milestone 2 Deliverables.md`
- `/docs/data_sources.md`
- `/docs/evaluation_test_cases.md`
- `/docs/mvp_demo_script.md`
- `/docs/milestone2_status.md`
- Updated `/docs/PRD.md` if scope changed
- Updated `README.md`

The following source files must remain current and demoable:

- `/src/ingestion.py`
- `/src/retrieval.py`
- `/src/generator.py`
- `/src/citation_formatter.py`
- Backend entrypoint
- Frontend or demo interface used in class

---

# 5. `docs/data_sources.md` (Required)

This file was required earlier and must be complete by Milestone 2.

It must include:

- Every indexed source URL
- Source category
- Source type
- Date collected or indexed
- Whether the source is currently included in MVP scope

If the indexed corpus is larger than MVP scope, mark which sources are actively used for the MVP demo.

---

# 6. Updated Evaluation Package

Update `/docs/evaluation_test_cases.md` to include:

- Current grounded questions within MVP scope
- Current refusal questions outside MVP scope
- Expected source documents
- Actual retrieved documents
- Generated answer
- Verification status
- Notes for failures or edge cases

Required metrics:

- Retrieval accuracy
- Grounding accuracy
- Refusal accuracy

Add a short section:

- "What changed since Sprint 1"
- "Which cases improved"
- "Which cases still fail and why"

---

# 7. `docs/mvp_demo_script.md`

Create a concise demo script that includes:

- Demo order
- Exact questions to ask
- What should appear on screen
- One refusal example
- Backup question if a primary example fails

This is to prevent an improvised and unstable live demo.

---

# 8. `docs/milestone2_status.md`

Create a short status report that includes:

- What is complete
- What is partial
- What remains risky
- Final team member ownership for the week
- Go / no-go assessment for the demo

This should read like an engineering checkpoint, not a marketing summary.

---

# 9. README Expectations

Your README must match the real system.

It must clearly state:

- The actual MVP scope
- Backend setup
- Index build instructions
- Frontend or demo interface instructions
- How to run one grounded example
- How to run one refusal example

Remove claims that are broader than the implemented system.

---

# 10. Definition of Milestone 2 Done

Milestone 2 is complete only if:

- The MVP scope is frozen and consistent everywhere
- The team can demo grounded answers with visible retrieval evidence
- The team can demo a correct refusal
- Required docs are present and current
- No known missing artifact from Milestone 1 remains unresolved

If the demo still depends on explanation instead of evidence, Milestone 2 is not complete.

---

# Submission Checklist

- [ ] Frozen MVP scope is stated clearly
- [ ] `docs/data_sources.md` is complete
- [ ] Evaluation document is updated
- [ ] Demo script is prepared
- [ ] Milestone 2 status report is prepared
- [ ] README matches the implemented system
- [ ] Live demo path works for grounded answer and refusal case

---

## Instructor Note

> A credible MVP is not the broadest assistant you can describe. It is the narrowest assistant you can defend with evidence.
