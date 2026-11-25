import csv, json

def esc(s):
    return s.strip() if s else ""

questions = []
with open('/downloads/elsadiqrcph_neonatal_jaundice_questions-75e321bf.csv', encoding='utf-8-sig') as f:
    for row in csv.DictReader(f):
        opts = []
        for letter in ['A','B','C','D','E']:
            text = esc(row[f'option_{letter}'])
            if not text:
                continue
            opts.append({
                'label': letter,
                'text': text,
                'explanation': esc(row[f'explanation_{letter}']),
                'isCorrect': row['correct'].strip() == letter,
            })
        questions.append({
            'id': esc(row['id']),
            'topic': esc(row['topic']),
            'subtopic': esc(row['subtopic']),
            'difficulty': esc(row['difficulty']),
            'type': esc(row['question_type']),
            'stem': esc(row['stem']),
            'options': opts,
            'keyPoint': esc(row['key_learning_point']),
            'reference': esc(row['reference']),
            'status': esc(row['status']),
        })

with open('/downloads/elsadiqrcph_article_neonatal_jaundice-b6444473.csv', encoding='utf-8-sig') as f:
    row = next(csv.DictReader(f))
    article = {
        'id': esc(row['id']),
        'topic': esc(row['topic']),
        'title': esc(row['title']),
        'body': row['body_markdown'],
        'reference': esc(row['reference']),
        'linkedQuestionIds': esc(row['linked_question_ids']),
        'status': esc(row['status']),
    }

qts = "import type { Question } from '../lib/types'\n\nexport const questions: Question[] = " + json.dumps(questions, indent=2, ensure_ascii=False) + "\n"
ats = "import type { Article } from '../lib/types'\n\nexport const articles: Article[] = " + json.dumps([article], indent=2, ensure_ascii=False) + "\n"

open('src/data/questions.ts','w').write(qts)
open('src/data/articles.ts','w').write(ats)
print(f"{len(questions)} questions, {len(article['body'])} chars article body")
diffs = {}
subs = {}
for q in questions:
    diffs[q['difficulty']] = diffs.get(q['difficulty'],0)+1
    subs[q['subtopic']] = subs.get(q['subtopic'],0)+1
print('difficulty:', diffs)
print('subtopics:', subs)
