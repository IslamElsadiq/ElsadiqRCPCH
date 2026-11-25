import type { Question } from '../lib/types'

export const questions: Question[] = [
  {
    "id": "NJ-001",
    "topic": "Neonatal jaundice",
    "subtopic": "Assessment",
    "difficulty": "Easy",
    "type": "SBA",
    "stem": "A term baby is noticed to be jaundiced at 14 hours of age. She is feeding well and examination is otherwise normal. What is the most appropriate next step?",
    "options": [
      {
        "label": "A",
        "text": "Reassure the mother that this is physiological jaundice",
        "explanation": "Incorrect. Physiological jaundice does not appear in the first 24 hours; jaundice before 24 hours is regarded as pathological until proven otherwise.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Measure transcutaneous bilirubin and repeat in 12 hours",
        "explanation": "Incorrect. Transcutaneous meters are not used in the first 24 hours of life; a serum level is needed.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Measure serum bilirubin urgently (within 2 hours)",
        "explanation": "Correct. Any suspected or obvious jaundice in the first 24 hours needs an urgent serum bilirubin, within 2 hours, to look for haemolysis or other pathology.",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Start phototherapy without measuring bilirubin",
        "explanation": "Incorrect. Treatment decisions depend on a measured level plotted against the threshold chart for gestation and age.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Review again at 24 hours with visual assessment",
        "explanation": "Incorrect. Waiting risks missing rapidly rising bilirubin from haemolysis.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Jaundice in the first 24 hours is pathological: serum bilirubin within 2 hours.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-002",
    "topic": "Neonatal jaundice",
    "subtopic": "Assessment",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "A well, breastfed term baby is 3 days old and looks jaundiced. A transcutaneous bilirubinometer reads 190 micromol/L. What is the most appropriate management?",
    "options": [
      {
        "label": "A",
        "text": "Serum bilirubin now to confirm",
        "explanation": "Incorrect. Serum confirmation is needed only if the transcutaneous reading is above 250 micromol/L (in babies of 35 weeks or more and over 24 hours old).",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Start phototherapy",
        "explanation": "Incorrect. 190 micromol/L at 3 days is well below treatment thresholds for a term baby.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Stop breastfeeding and give formula",
        "explanation": "Incorrect. Breastfeeding should be supported; stopping it is not recommended for jaundice.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Give supplementary water between feeds",
        "explanation": "Incorrect. Water or dextrose supplementation does not reduce bilirubin and is not recommended.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "No further bilirubin testing is needed; continue feeding and give advice on when to seek review",
        "explanation": "Correct. A transcutaneous value of 250 micromol/L or less in a well term baby over 24 hours needs no serum test; support feeding and advise parents.",
        "isCorrect": true
      }
    ],
    "keyPoint": "In babies of 35 weeks or more and over 24 hours old, check serum bilirubin only if transcutaneous reading exceeds 250 micromol/L.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-003",
    "topic": "Neonatal jaundice",
    "subtopic": "Assessment",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "A baby born at 33 weeks' gestation is jaundiced at 30 hours of age. Which is the most appropriate way to measure bilirubin?",
    "options": [
      {
        "label": "A",
        "text": "Icterometer",
        "explanation": "Incorrect. Icterometers are not recommended for assessing bilirubin.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Transcutaneous bilirubinometer",
        "explanation": "Incorrect. Transcutaneous meters are not used in babies under 35 weeks.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Serum bilirubin",
        "explanation": "Correct. Babies under 35 weeks, and those under 24 hours old, need serum bilirubin measurement.",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Visual assessment only, using the head-to-toe progression",
        "explanation": "Incorrect. Visual estimation of level by body zone is unreliable.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Urinary bilirubin dipstick",
        "explanation": "Incorrect. Urine dipsticks do not measure neonatal unconjugated bilirubin reliably and are not used.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Under 35 weeks or under 24 hours old: serum bilirubin, not a transcutaneous meter.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-004",
    "topic": "Neonatal jaundice",
    "subtopic": "Causes",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "A male term baby, blood group A positive, is deeply jaundiced at 12 hours. His mother is group O positive and took no anti-D. The DAT is weakly positive and the blood film shows spherocytes. What is the most likely diagnosis?",
    "options": [
      {
        "label": "A",
        "text": "Rhesus haemolytic disease",
        "explanation": "Incorrect. Mother is Rh positive, so rhesus alloimmunisation is not the explanation.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "ABO haemolytic disease",
        "explanation": "Correct. Group O mother with group A or B baby, early jaundice, weakly positive DAT and spherocytes is typical of ABO disease.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "G6PD deficiency",
        "explanation": "Incorrect. G6PD deficiency causes DAT-negative haemolysis with bite and blister cells or Heinz bodies, not spherocytes with a positive DAT.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Hereditary elliptocytosis",
        "explanation": "Incorrect. Elliptocytes, not spherocytes, would be seen and the DAT is negative.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Crigler-Najjar syndrome",
        "explanation": "Incorrect. Crigler-Najjar causes severe unconjugated jaundice without haemolysis and the DAT is negative.",
        "isCorrect": false
      }
    ],
    "keyPoint": "ABO disease: O mother, A/B baby, weak DAT, spherocytes.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-005",
    "topic": "Neonatal jaundice",
    "subtopic": "Management",
    "difficulty": "Hard",
    "type": "SBA",
    "stem": "A baby with rhesus haemolytic disease is on continuous intensified phototherapy. Serum bilirubin is rising at 10 micromol/L per hour. What is the most appropriate additional treatment?",
    "options": [
      {
        "label": "A",
        "text": "Oral phenobarbital",
        "explanation": "Incorrect. Phenobarbital is not used in acute haemolytic disease.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Intravenous immunoglobulin 500 mg/kg over 4 hours",
        "explanation": "Correct. IVIG is an adjunct to intensified phototherapy in rhesus or ABO haemolytic disease when bilirubin keeps rising by more than 8.5 micromol/L per hour.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Intravenous albumin infusion alone",
        "explanation": "Incorrect. Albumin alone does not treat haemolysis or lower bilirubin appreciably.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Ursodeoxycholic acid",
        "explanation": "Incorrect. Ursodeoxycholic acid is used in cholestasis, not haemolysis.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Stop phototherapy and recheck in 6 hours",
        "explanation": "Incorrect. Stopping treatment while bilirubin is rising is dangerous.",
        "isCorrect": false
      }
    ],
    "keyPoint": "IVIG 500 mg/kg over 4 h if bilirubin rises more than 8.5 micromol/L/h despite intensified phototherapy in Rh or ABO disease.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-006",
    "topic": "Neonatal jaundice",
    "subtopic": "Causes",
    "difficulty": "Hard",
    "type": "SBA",
    "stem": "A male term baby of Mediterranean family origin develops jaundice at 30 hours. The DAT is negative, blood groups are compatible, and the blood film shows bite cells and Heinz bodies on supravital staining. Which test confirms the diagnosis?",
    "options": [
      {
        "label": "A",
        "text": "Hb electrophoresis",
        "explanation": "Incorrect. Electrophoresis diagnoses haemoglobinopathies; it is not the answer here.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "G6PD enzyme assay",
        "explanation": "Correct. Heinz bodies and bite cells with DAT-negative haemolysis suggest G6PD deficiency, confirmed by enzyme assay (interpret with care during acute haemolysis).",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Osmotic fragility test",
        "explanation": "Incorrect. Osmotic fragility supports hereditary spherocytosis, where spherocytes are present.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Urine reducing substances",
        "explanation": "Incorrect. Reducing substances screen for galactosaemia.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Thyroid function tests",
        "explanation": "Incorrect. Hypothyroidism causes prolonged, not early, jaundice.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Early DAT-negative haemolysis plus Heinz bodies: think G6PD deficiency, especially with Mediterranean, Middle Eastern, African or Asian ancestry.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-007",
    "topic": "Neonatal jaundice",
    "subtopic": "Phototherapy",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "Which statement best explains how phototherapy lowers serum bilirubin?",
    "options": [
      {
        "label": "A",
        "text": "It induces hepatic glucuronyl transferase",
        "explanation": "Incorrect. Phenobarbital induces the enzyme; light does not.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "It converts bilirubin to water-soluble isomers excreted without conjugation",
        "explanation": "Correct. Blue-green light (about 460 to 490 nm) converts bilirubin to structural isomers such as lumirubin, which are water-soluble and excreted in bile and urine.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "It destroys red blood cells",
        "explanation": "Incorrect. Phototherapy does not affect red cells in this way.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "It increases enterohepatic circulation",
        "explanation": "Incorrect. Enterohepatic circulation is a reason bilirubin is reabsorbed; phototherapy does not increase it.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "It converts conjugated bilirubin to urobilinogen",
        "explanation": "Incorrect. Urobilinogen formation is by gut bacteria acting on conjugated bilirubin.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Phototherapy makes photoisomers (lumirubin) that need no conjugation.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-008",
    "topic": "Neonatal jaundice",
    "subtopic": "Phototherapy",
    "difficulty": "Easy",
    "type": "SBA",
    "stem": "A 3-day-old breastfed term baby is receiving phototherapy and is not dehydrated. What is the most appropriate feeding advice?",
    "options": [
      {
        "label": "A",
        "text": "Stop breastfeeding until phototherapy ends",
        "explanation": "Incorrect. Breastfeeding should continue.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Replace feeds with dextrose water",
        "explanation": "Incorrect. Dextrose water does not lower bilirubin and is not recommended.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Continue breastfeeding, including during short breaks from phototherapy",
        "explanation": "Correct. Support breastfeeding, encourage frequent feeds, and allow short breaks for feeding and parent contact.",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Start routine intravenous fluids",
        "explanation": "Incorrect. IV fluids are not routine; they are for babies who are clinically dehydrated and cannot be rehydrated enterally.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Feed only expressed milk by cup",
        "explanation": "Incorrect. Cup feeding alone is unnecessary.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Continue breastfeeding during phototherapy; give supplementary fluids only if clinically dehydrated.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-009",
    "topic": "Neonatal jaundice",
    "subtopic": "Phototherapy",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "A 37-week baby has completed phototherapy. Serum bilirubin has fallen to more than 50 micromol/L below the threshold at which treatment started, so it is stopped. What is the next step?",
    "options": [
      {
        "label": "A",
        "text": "Discharge with no further testing",
        "explanation": "Incorrect. Rebound hyperbilirubinaemia can occur after treatment is stopped.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Repeat serum bilirubin 12 to 18 hours after stopping to check for rebound",
        "explanation": "Correct. Check for rebound with a repeat serum bilirubin 12 to 18 hours after stopping; this need not keep the baby in hospital.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Repeat serum bilirubin after 7 days",
        "explanation": "Incorrect. Seven days is too late to detect rebound.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Restart phototherapy for 12 hours as prophylaxis",
        "explanation": "Incorrect. Prophylactic extra phototherapy is not recommended.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Measure transcutaneous bilirubin at 3 hours",
        "explanation": "Incorrect. Three hours is too early and a transcutaneous meter is not suitable after phototherapy.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Stop phototherapy at 50 micromol/L or more below the starting threshold, then recheck serum bilirubin at 12 to 18 h.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-010",
    "topic": "Neonatal jaundice",
    "subtopic": "Prolonged jaundice",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "A 17-day-old term, breastfed baby is thriving with normal stools and urine but remains jaundiced. What investigation is most important to do first?",
    "options": [
      {
        "label": "A",
        "text": "Skull ultrasound",
        "explanation": "Incorrect. Not indicated in a well baby.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Measure conjugated bilirubin",
        "explanation": "Correct. In prolonged jaundice (over 14 days in term babies, over 21 days if preterm) measure split bilirubin to exclude cholestasis, which is treatable and time critical.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Liver biopsy",
        "explanation": "Incorrect. Invasive and not a first-line test.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Sweat chloride",
        "explanation": "Incorrect. Cystic fibrosis is rare as a cause and is not the first test.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Abdominal X-ray",
        "explanation": "Incorrect. Not indicated.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Prolonged jaundice: always measure conjugated bilirubin; also do FBC, blood groups and DAT, urine culture if UTI suspected, and check newborn screening results.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-011",
    "topic": "Neonatal jaundice",
    "subtopic": "Prolonged jaundice",
    "difficulty": "Hard",
    "type": "SBA",
    "stem": "A 5-week-old girl has been jaundiced since birth. Stools are pale and urine is dark. The liver is palpable 3 cm below the costal margin. Total bilirubin is 160 micromol/L with a conjugated fraction of 130 micromol/L. What is the most appropriate management?",
    "options": [
      {
        "label": "A",
        "text": "Reassure that this is breast milk jaundice",
        "explanation": "Incorrect. Breast milk jaundice is unconjugated and stools are normal coloured.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Start phototherapy",
        "explanation": "Incorrect. Phototherapy does not treat cholestasis and may cause bronze baby syndrome.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Urgent referral to a paediatric liver unit",
        "explanation": "Correct. Pale stools, dark urine and conjugated hyperbilirubinaemia suggest biliary atresia until proven otherwise. Referral is urgent; outcome after Kasai portoenterostomy is best when done before about 8 weeks.",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Review in 2 weeks with repeat bilirubin",
        "explanation": "Incorrect. Delay harms outcome.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Start phenobarbital",
        "explanation": "Incorrect. Phenobarbital is not the treatment for biliary atresia.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Conjugated bilirubin above 25 micromol/L: urgent liver unit referral; think biliary atresia.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-012",
    "topic": "Neonatal jaundice",
    "subtopic": "Prolonged jaundice",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "A 16-day-old breastfed term baby is thriving. Serum total bilirubin is 140 micromol/L, conjugated 6 micromol/L. FBC, blood groups, DAT and thyroid screen are normal. What is the most appropriate management?",
    "options": [
      {
        "label": "A",
        "text": "Stop breastfeeding for 48 hours",
        "explanation": "Incorrect. Temporary cessation is not needed.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Reassure and continue breastfeeding",
        "explanation": "Correct. This is prolonged unconjugated jaundice with breast milk jaundice as a diagnosis of exclusion; reassure and continue breastfeeding with clear safety-net advice.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Start phototherapy",
        "explanation": "Incorrect. The level is far below the phototherapy threshold.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Start ursodeoxycholic acid",
        "explanation": "Incorrect. Not cholestatic.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Refer for liver biopsy",
        "explanation": "Incorrect. Not indicated.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Breast milk jaundice is a benign diagnosis of exclusion; do not stop breastfeeding.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-013",
    "topic": "Neonatal jaundice",
    "subtopic": "Causes",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "A 3-week-old term baby has prolonged jaundice, constipation, poor feeding, a large tongue and an umbilical hernia. What is the most appropriate next test?",
    "options": [
      {
        "label": "A",
        "text": "Serum TSH and free T4",
        "explanation": "Correct. These features suggest congenital hypothyroidism, which causes prolonged unconjugated jaundice. Confirm with TSH and free T4, then start levothyroxine promptly (check newborn screening result too).",
        "isCorrect": true
      },
      {
        "label": "B",
        "text": "Urine reducing substances",
        "explanation": "Incorrect. This would suit suspected galactosaemia with vomiting, hepatomegaly and sepsis.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Sweat test",
        "explanation": "Incorrect. Does not fit the picture.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Serum ammonia",
        "explanation": "Incorrect. Ammonia is for urea cycle or other metabolic crises with encephalopathy.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Blood culture",
        "explanation": "Incorrect. No sepsis picture.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Prolonged jaundice + constipation + macroglossia + hernia = hypothyroidism.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-014",
    "topic": "Neonatal jaundice",
    "subtopic": "Causes",
    "difficulty": "Hard",
    "type": "SBA",
    "stem": "A 6-day-old baby on full milk feeds is jaundiced, vomiting, lethargic, with hepatomegaly. Urine reducing substances are positive but the glucose oxidase dipstick is negative. Blood culture grows Escherichia coli. What is the most appropriate dietary management?",
    "options": [
      {
        "label": "A",
        "text": "Switch to a lactose-free, galactose-free formula",
        "explanation": "Correct. The picture is classical galactosaemia (GALT deficiency): E. coli sepsis, jaundice, hepatomegaly, vomiting, positive reducing substances with negative glucose dipstick. Remove all galactose and lactose.",
        "isCorrect": true
      },
      {
        "label": "B",
        "text": "Switch to a hydrolysed protein formula only",
        "explanation": "Incorrect. Hydrolysed formula still contains lactose in many preparations.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Continue standard milk with antibiotics",
        "explanation": "Incorrect. Continuing galactose causes further liver and renal damage.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Add medium-chain triglyceride oil",
        "explanation": "Incorrect. MCT is used in fat malabsorption.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Fast the baby for 24 hours",
        "explanation": "Incorrect. Fasting does not treat the cause.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Galactosaemia: E. coli sepsis, cataracts, reducing substances positive, glucose negative. Treat with galactose-free diet.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-015",
    "topic": "Neonatal jaundice",
    "subtopic": "Complications",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "What is the most characteristic long-term neurological outcome of kernicterus?",
    "options": [
      {
        "label": "A",
        "text": "Spastic diplegia",
        "explanation": "Incorrect. Spastic diplegia is typical of periventricular leukomalacia in preterm infants.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Athetoid (dyskinetic) cerebral palsy with sensorineural hearing loss",
        "explanation": "Correct. Chronic bilirubin encephalopathy features athetoid or dyskinetic CP, sensorineural deafness, upward gaze palsy and dental enamel hypoplasia.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Hydrocephalus",
        "explanation": "Incorrect. Not a feature.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Microcephaly with calcifications",
        "explanation": "Incorrect. This describes congenital CMV.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Isolated global developmental delay",
        "explanation": "Incorrect. Cognition may be relatively spared; a motor and hearing disorder dominates.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Kernicterus tetrad: dyskinetic CP, deafness, upward gaze palsy, enamel hypoplasia.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-016",
    "topic": "Neonatal jaundice",
    "subtopic": "Complications",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "Which brain structure is most vulnerable to bilirubin deposition in acute bilirubin encephalopathy?",
    "options": [
      {
        "label": "A",
        "text": "Hippocampus",
        "explanation": "Incorrect. Hippocampus is vulnerable to hypoxia-ischaemia more than bilirubin.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Globus pallidus",
        "explanation": "Correct. Bilirubin preferentially affects the globus pallidus, subthalamic nucleus and brainstem auditory nuclei; MRI shows high T1 signal in the globus pallidus.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Occipital cortex",
        "explanation": "Incorrect. Occipital cortex is not the typical site.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Cerebellar vermis only",
        "explanation": "Incorrect. Cerebellar involvement is not isolated.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Corpus callosum",
        "explanation": "Incorrect. Not a typical site.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Bilirubin damage: globus pallidus, subthalamic nuclei, brainstem auditory nuclei.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-017",
    "topic": "Neonatal jaundice",
    "subtopic": "Management",
    "difficulty": "Hard",
    "type": "SBA",
    "stem": "A 4-day-old term baby is lethargic, hypotonic and has a high-pitched cry, with intermittent arching of the back. Serum bilirubin is 20 micromol/L below the exchange transfusion threshold. What is the most appropriate management?",
    "options": [
      {
        "label": "A",
        "text": "Continue intensified phototherapy and repeat bilirubin in 6 hours",
        "explanation": "Incorrect. Clinical signs change the management irrespective of the number.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Perform an exchange transfusion immediately",
        "explanation": "Correct. Clinical features of acute bilirubin encephalopathy are an indication for immediate exchange transfusion, whatever the serum bilirubin level. Continue intensified phototherapy while preparing.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Give oral phenobarbital",
        "explanation": "Incorrect. Not effective.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Give IV immunoglobulin alone",
        "explanation": "Incorrect. IVIG is an adjunct for haemolytic disease, not a substitute for exchange here.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Observe, as bilirubin is below the exchange threshold",
        "explanation": "Incorrect. Waiting risks permanent brain injury.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Signs of acute bilirubin encephalopathy: immediate exchange transfusion, regardless of level.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-018",
    "topic": "Neonatal jaundice",
    "subtopic": "Risk factors",
    "difficulty": "Medium",
    "type": "SBA",
    "stem": "Which is a recognised risk factor for developing significant hyperbilirubinaemia in a newborn?",
    "options": [
      {
        "label": "A",
        "text": "Female sex",
        "explanation": "Incorrect. Not a recognised risk factor in this guideline.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Birth weight above 4 kg",
        "explanation": "Incorrect. Macrosomia alone is not listed (cephalhaematoma or bruising would add risk).",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Delivery by caesarean section",
        "explanation": "Incorrect. Mode of delivery is not the risk factor; bruising or instrumentation may add risk.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "A sibling who needed phototherapy for neonatal jaundice",
        "explanation": "Correct. Sibling with neonatal jaundice requiring phototherapy is listed, along with gestation under 38 weeks, exclusive breastfeeding intent, and visible jaundice in the first 24 hours.",
        "isCorrect": true
      },
      {
        "label": "E",
        "text": "Maternal age over 35",
        "explanation": "Incorrect. Not listed.",
        "isCorrect": false
      }
    ],
    "keyPoint": "NICE risk factors: gestation under 38 wk, sibling needing phototherapy, intended exclusive breastfeeding, jaundice in first 24 h.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-019",
    "topic": "Neonatal jaundice",
    "subtopic": "Assessment",
    "difficulty": "Easy",
    "type": "SBA",
    "stem": "What is the recommended way to visually examine a newborn for jaundice?",
    "options": [
      {
        "label": "A",
        "text": "Use an icterometer on the nose",
        "explanation": "Incorrect. Icterometers are not recommended.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Examine in dim light for the yellow tinge on the soles",
        "explanation": "Incorrect. Dim light hides jaundice.",
        "isCorrect": false
      },
      {
        "label": "C",
        "text": "Examine in bright, preferably natural light, looking at sclerae, gums and blanched skin",
        "explanation": "Correct. Check all babies at every opportunity; examine sclerae, gums and blanched skin, especially in darker skin.",
        "isCorrect": true
      },
      {
        "label": "D",
        "text": "Rely on parental report alone",
        "explanation": "Incorrect. Parent concern matters but does not replace examination.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Inspect only the face",
        "explanation": "Incorrect. Whole-body examination in good light is needed.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Check for jaundice in bright natural light: sclerae, gums, blanched skin.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  },
  {
    "id": "NJ-020",
    "topic": "Neonatal jaundice",
    "subtopic": "Complications",
    "difficulty": "Hard",
    "type": "SBA",
    "stem": "A baby with cholestatic jaundice receiving phototherapy develops grey-brown skin and urine discolouration. What is the underlying cause?",
    "options": [
      {
        "label": "A",
        "text": "Haemolytic anaemia",
        "explanation": "Incorrect. Not the mechanism.",
        "isCorrect": false
      },
      {
        "label": "B",
        "text": "Accumulation of photoproducts in conjugated hyperbilirubinaemia",
        "explanation": "Correct. This is bronze baby syndrome: photo-oxidation products accumulate when conjugated bilirubin is raised and cannot be excreted. Another reason to check conjugated bilirubin before and during treatment.",
        "isCorrect": true
      },
      {
        "label": "C",
        "text": "Methaemoglobinaemia",
        "explanation": "Incorrect. Methaemoglobinaemia gives cyanosis with grey skin but is not this phenomenon.",
        "isCorrect": false
      },
      {
        "label": "D",
        "text": "Vitamin K deficiency",
        "explanation": "Incorrect. Causes bleeding, not discolouration.",
        "isCorrect": false
      },
      {
        "label": "E",
        "text": "Hypernatraemia",
        "explanation": "Incorrect. Dehydration can occur with phototherapy but does not cause this.",
        "isCorrect": false
      }
    ],
    "keyPoint": "Bronze baby syndrome: phototherapy plus raised conjugated bilirubin.",
    "reference": "NICE CG98 Jaundice in newborn babies under 28 days (updated Oct 2023), https://www.nice.org.uk/guidance/cg98",
    "status": "draft_needs_clinical_review"
  }
]
