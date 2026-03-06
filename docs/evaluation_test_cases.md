# Evaluation Overview
This document evaluates the grounding performance and retrieval accuracy of the JagUnify RAG pipeline using 20 distinct test cases.

**Grounding Rules:**
- Every answer must cite at least one retrieved TAMUSA source.
- No unsupported claims outside retrieved text.
- If no relevant source is retrieved, the system must refuse.

---

# Test Cases

## Test Case 1
**Question:** What are the admissions requirements for freshman students at TAMUSA?  
**Expected Source:** TAMUSA Undergraduate Admissions Page  
**Retrieved Document(s):** [1] admissions/applying-for-admission/first-year-students.html, [2] admissions/admitted-students-checklist/admitted-first-year-jag-hq.html  
**Generated Answer:** The admissions requirements include Automatic Admission (Top 35%, 3.0 GPA, or specific SAT/ACT scores) and Committee Review for others. [1][2]  
**Verification Status:** **PASS**

## Test Case 2
**Question:** What is the deadline to apply for fall semester admission?  
**Expected Source:** TAMUSA Admissions Deadlines Page  
**Retrieved Document(s):** [7] catalog.tamusa.edu/graduate/academic-calendar/, [10] catalog.tamusa.edu/undergraduate/academic-calendar/  
**Generated Answer:** The priority application deadline for the fall semester is March 15, and the final application deadline is June 30 [7][10].  
**Verification Status:** **PASS**

## Test Case 3
**Question:** Where is the Office of the Registrar located?  
**Expected Source:** TAMUSA Registrar Contact Page  
**Retrieved Document(s):** None (System Refusal)  
**Generated Answer:** I cannot find supporting information in the indexed TAMUSA documents.  
**Verification Status:** **PASS** (Correct Refusal based on index state)

## Test Case 4
**Question:** What are the operating hours of the TAMUSA library?  
**Expected Source:** TAMUSA Library Hours Page  
**Retrieved Document(s):** None (System Refusal)  
**Generated Answer:** I cannot find supporting information in the indexed TAMUSA documents.  
**Verification Status:** **PASS** (Correct Refusal based on index state)

## Test Case 5
**Question:** How can students apply for financial aid?  
**Expected Source:** TAMUSA Financial Aid Page  
**Retrieved Document(s):** [1] paying-for-college/financial-aid/apply-for-aid/index.html, [2] checklist-for-financial-aid.html  
**Generated Answer:** Students can apply by completing the FAFSA online at studentaid.gov after October 1st. [1][2]  
**Verification Status:** **PASS**

## Test Case 6
**Question:** What majors are offered at TAMUSA?  
**Expected Source:** TAMUSA Academic Programs Page  
**Retrieved Document(s):** None (System Refusal)  
**Generated Answer:** I cannot find supporting information in the indexed TAMUSA documents.  
**Verification Status:** **PASS** (Correct Refusal based on index state)

## Test Case 7
**Question:** What GPA is required for academic probation?  
**Expected Source:** TAMUSA Academic Standing Policy  
**Retrieved Document(s):** [1] catalog.tamusa.edu/undergraduate/academic-policies-procedures/grade-requirements/  
**Generated Answer:** A cumulative GPA below 2.0 at Texas A&M University-San Antonio will result in academic probation for undergraduate students. [1]  
**Verification Status:** **PASS**

## Test Case 8
**Question:** How do I register for classes?  
**Expected Source:** TAMUSA Registration Guide  
**Retrieved Document(s):** [1] admissions/registration/index.html, [5] admitted-first-year-jag-hq.html  
**Generated Answer:** Students must check their registration schedule, clear holds, and use the web registration system in JagWire. [1][5]  
**Verification Status:** **PASS**

## Test Case 9
**Question:** Where can students find tutoring services?  
**Expected Source:** TAMUSA Student Success Center Page  
**Retrieved Document(s):** [1] tutoring-services/index.html, [2] tutoring-services/supplemental-instruction.html  
**Generated Answer:** Tutoring is available at the Academic Learning Center (ALC) in Central Academic Building (CAB) 202. [1][2]  
**Verification Status:** **PASS**

## Test Case 10
**Question:** What documents are required for transfer students?  
**Expected Source:** TAMUSA Transfer Admissions Page  
**Retrieved Document(s):** [1] admitted-students-transfer.html, [2] catalog.tamusa.edu/undergraduate/student-enrollment/transitions/  
**Generated Answer:** Transfer students must submit final transcripts and proof of Bacterial Meningitis vaccination. [1][2]  
**Verification Status:** **PASS**

## Test Case 11
**Question:** What is the campus address?  
**Expected Source:** TAMUSA Contact Page  
**Retrieved Document(s):** [1] jagwellness/jed-campus.html  
**Generated Answer:** The campus address is One University Way, San Antonio, TX 78224 [1].  
**Verification Status:** **PASS**

## Test Case 12
**Question:** What meal plans are available on campus?  
**Expected Source:** TAMUSA Dining Services Page  
**Retrieved Document(s):** [1] dining-services-meal-plans.html  
**Generated Answer:** Options include Commuter plans (Swipe 50/25) and Resident plans (Jag Unlimited, Jag 210, Jag 180). [1]  
**Verification Status:** **PASS**

## Test Case 13
**Question:** How can students request official transcripts?  
**Expected Source:** TAMUSA Registrar Transcript Request Page  
**Retrieved Document(s):** [7] catalog.tamusa.edu/graduate/academic-regulations/grades/  
**Generated Answer:** Requests can be made through JagWire or on the Office of the Registrar’s webpage. [7]  
**Verification Status:** **PASS**

## Test Case 14
**Question:** What are the graduation requirements for undergraduates?  
**Expected Source:** TAMUSA Undergraduate Catalog  
**Retrieved Document(s):** [3] graduate-regulations/general-requirements-graduation/, [4] sociology-ba/  
**Generated Answer:** Graduation requires a minimum 2.0 GPA, completion of specific degree plan hours, and a final audit. [3][4]  
**Verification Status:** **PASS**

## Test Case 15
**Question:** Does TAMUSA offer online degree programs?  
**Expected Source:** TAMUSA Online Programs Page  
**Retrieved Document(s):** [1] management-marketing/online-pathways-mba/  
**Generated Answer:** Yes, TAMUSA offers online programs such as the Online Pathways MBA. [1]  
**Verification Status:** **PASS**

## Test Case 16
**Question:** How do students appeal a grade?  
**Expected Source:** TAMUSA Grade Appeal Policy  
**Retrieved Document(s):** [1] catalog.tamusa.edu/graduate/academic-regulations/grades/, [2] undergraduate/academic-policies-procedures/grades/  
**Generated Answer:** The process involves emailing the instructor, then appealing to the Department Chair, and finally the Dean. [1][2]  
**Verification Status:** **PASS**

## Test Case 17
**Question:** What health services are available on campus?  
**Expected Source:** TAMUSA Student Health Services Page  
**Retrieved Document(s):** [1] student-counseling-center/mental-health-services.html  
**Generated Answer:** Services include individual and group therapy, case management, and crisis support via the Student Counseling Center. [1]  
**Verification Status:** **PASS**

## Test Case 18
**Question:** What is the maximum credit load per semester?  
**Expected Source:** TAMUSA Academic Policies Page  
**Retrieved Document(s):** [1] normal-load/, [4] normal-course-load/  
**Generated Answer:** Undergraduate maximum is 18 hours; Graduate maximum is 15 hours for fall/spring. [1][4]  
**Verification Status:** **PASS**

## Test Case 19 (Refusal Case)
**Question:** What NFL players graduated from TAMUSA?  
**Retrieved Document(s):** None  
**Generated Answer:** I cannot find supporting information in the indexed TAMUSA documents.  
**Verification Status:** **PASS**

## Test Case 20 (Refusal Case)
**Question:** What is the average salary of TAMUSA graduates five years after graduation?  
**Retrieved Document(s):** None  
**Generated Answer:** I cannot find supporting information in the indexed TAMUSA documents.  
**Verification Status:** **PASS**

---

# Metrics

### Retrieval Accuracy
**Result:** **85%**

### Grounding Accuracy
**Result:** **100%**

### Refusal Accuracy
**Result:** **100%**

---

# Summary

- Total Questions: 20
- Retrieval Accuracy: 85%
- Grounding Accuracy: 100%
- Refusal Accuracy: 100%