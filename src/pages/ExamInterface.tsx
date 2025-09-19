import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, Eye, EyeOff, Flag, CheckCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ExamData {
  id: string;
  title: string;
  duration: number; // in minutes
  questions: Question[];
}

// Sample Easy Level Questions
const easyTests: { [key: string]: ExamData } = {
  'easy-1': {
    id: 'easy-1',
    title: 'Basic Quantitative Aptitude',
    duration: 30,
    questions: [
      {
        id: 'q1',
        question: 'What is 25% of 200?',
        options: ['40', '50', '60', '75'],
        correctAnswer: 1,
        explanation: '25% of 200 = (25/100) × 200 = 50'
      },
      {
        id: 'q2',
        question: 'If a shirt costs ₹800 after a 20% discount, what was the original price?',
        options: ['₹900', '₹1000', '₹1200', '₹960'],
        correctAnswer: 1,
        explanation: 'Let original price = x. After 20% discount: x - 0.2x = 0.8x = 800. So x = 1000'
      },
      {
        id: 'q3',
        question: 'Simple Interest on ₹1000 for 2 years at 5% per annum is:',
        options: ['₹50', '₹100', '₹150', '₹200'],
        correctAnswer: 1,
        explanation: 'SI = (P × R × T) / 100 = (1000 × 5 × 2) / 100 = ₹100'
      },
      {
        id: 'q4',
        question: 'What is the next number in the sequence: 2, 6, 12, 20, ?',
        options: ['28', '30', '32', '36'],
        correctAnswer: 1,
        explanation: 'Pattern: 2×1+0=2, 2×2+2=6, 3×3+3=12, 4×4+4=20, 5×5+5=30'
      },
      {
        id: 'q5',
        question: 'If 3x + 5 = 14, what is the value of x?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 1,
        explanation: '3x + 5 = 14, so 3x = 9, therefore x = 3'
      },
      {
        id: 'q6',
        question: 'The average of 5 numbers is 20. If one number is removed, the average becomes 18. What is the removed number?',
        options: ['25', '28', '30', '32'],
        correctAnswer: 1,
        explanation: 'Sum of 5 numbers = 5 × 20 = 100. Sum of 4 numbers = 4 × 18 = 72. Removed number = 100 - 72 = 28'
      },
      {
        id: 'q7',
        question: 'A train 120m long crosses a platform 80m long in 10 seconds. What is the speed of the train?',
        options: ['18 km/hr', '20 km/hr', '72 km/hr', '36 km/hr'],
        correctAnswer: 2,
        explanation: 'Total distance = 120 + 80 = 200m. Speed = 200/10 = 20 m/s = 20 × 3.6 = 72 km/hr'
      },
      {
        id: 'q8',
        question: 'If 40% of a number is 80, what is 60% of the same number?',
        options: ['100', '120', '140', '160'],
        correctAnswer: 1,
        explanation: 'If 40% = 80, then 100% = 200. So 60% = (60/100) × 200 = 120'
      },
      {
        id: 'q9',
        question: 'The ratio of ages of A and B is 3:4. If B is 4 years older than A, what is A\'s age?',
        options: ['10 years', '12 years', '15 years', '16 years'],
        correctAnswer: 1,
        explanation: 'Let ages be 3x and 4x. Given 4x - 3x = 4, so x = 4. A\'s age = 3 × 4 = 12 years'
      },
      {
        id: 'q10',
        question: 'In how many ways can 5 people sit in a row?',
        options: ['60', '120', '24', '25'],
        correctAnswer: 1,
        explanation: '5 people can be arranged in 5! = 5 × 4 × 3 × 2 × 1 = 120 ways'
      },
      {
        id: 'q11',
        question: 'A shopkeeper marks his goods 40% above cost price and gives a discount of 15%. What is his profit percentage?',
        options: ['19%', '25%', '21%', '15%'],
        correctAnswer: 0,
        explanation: 'CP = 100, MP = 140, SP = 140 × 0.85 = 119. Profit% = (119-100)/100 × 100 = 19%'
      },
      {
        id: 'q12',
        question: 'If the compound interest on ₹1000 for 2 years at 10% per annum is ₹210, what is the simple interest?',
        options: ['₹200', '₹210', '₹220', '₹180'],
        correctAnswer: 0,
        explanation: 'SI = (P × R × T)/100 = (1000 × 10 × 2)/100 = ₹200'
      },
      {
        id: 'q13',
        question: 'A bag contains 3 red, 4 blue, and 5 green balls. What is the probability of drawing a blue ball?',
        options: ['1/3', '1/4', '4/12', '5/12'],
        correctAnswer: 2,
        explanation: 'Total balls = 3 + 4 + 5 = 12. Probability of blue = 4/12 = 1/3'
      },
      {
        id: 'q14',
        question: 'If a² + b² = 25 and ab = 12, what is (a + b)²?',
        options: ['49', '50', '48', '47'],
        correctAnswer: 0,
        explanation: '(a + b)² = a² + b² + 2ab = 25 + 2(12) = 25 + 24 = 49'
      },
      {
        id: 'q15',
        question: 'The HCF of 12, 18, and 24 is:',
        options: ['4', '6', '8', '12'],
        correctAnswer: 1,
        explanation: '12 = 2² × 3, 18 = 2 × 3², 24 = 2³ × 3. HCF = 2 × 3 = 6'
      },
      {
        id: 'q16',
        question: 'A car travels 60 km in 1 hour. How much time will it take to travel 180 km?',
        options: ['2 hours', '3 hours', '4 hours', '2.5 hours'],
        correctAnswer: 1,
        explanation: 'Speed = 60 km/hr. Time = Distance/Speed = 180/60 = 3 hours'
      },
      {
        id: 'q17',
        question: 'What is 15% of 15% of 200?',
        options: ['4.5', '5', '6', '7.5'],
        correctAnswer: 0,
        explanation: '15% of 200 = 30. 15% of 30 = 4.5'
      },
      {
        id: 'q18',
        question: 'If x/3 = y/4 = z/5 and x + y + z = 24, what is the value of x?',
        options: ['6', '8', '10', '12'],
        correctAnswer: 0,
        explanation: 'Let x/3 = y/4 = z/5 = k. Then x = 3k, y = 4k, z = 5k. 3k + 4k + 5k = 24, so 12k = 24, k = 2. x = 3 × 2 = 6'
      },
      {
        id: 'q19',
        question: 'The area of a circle with radius 7 cm is: (π = 22/7)',
        options: ['144 cm²', '154 cm²', '164 cm²', '174 cm²'],
        correctAnswer: 1,
        explanation: 'Area = πr² = (22/7) × 7² = (22/7) × 49 = 22 × 7 = 154 cm²'
      },
      {
        id: 'q20',
        question: 'If log₁₀ 2 = 0.301, what is log₁₀ 8?',
        options: ['0.602', '0.903', '1.204', '2.408'],
        correctAnswer: 1,
        explanation: 'log₁₀ 8 = log₁₀ 2³ = 3 × log₁₀ 2 = 3 × 0.301 = 0.903'
      },
      {
        id: 'q21',
        question: 'A tank can be filled by pipe A in 4 hours and by pipe B in 6 hours. How long will it take to fill the tank if both pipes work together?',
        options: ['2.4 hours', '2.5 hours', '3 hours', '5 hours'],
        correctAnswer: 0,
        explanation: 'Rate of A = 1/4, Rate of B = 1/6. Combined rate = 1/4 + 1/6 = 5/12. Time = 12/5 = 2.4 hours'
      },
      {
        id: 'q22',
        question: 'If sin θ = 3/5, what is cos θ? (θ is acute)',
        options: ['4/5', '3/4', '5/4', '5/3'],
        correctAnswer: 0,
        explanation: 'sin²θ + cos²θ = 1. cos²θ = 1 - (3/5)² = 1 - 9/25 = 16/25. cos θ = 4/5'
      },
      {
        id: 'q23',
        question: 'The sum of first 10 natural numbers is:',
        options: ['45', '50', '55', '60'],
        correctAnswer: 2,
        explanation: 'Sum = n(n+1)/2 = 10(11)/2 = 55'
      },
      {
        id: 'q24',
        question: 'If 2^x = 32, what is the value of x?',
        options: ['4', '5', '6', '8'],
        correctAnswer: 1,
        explanation: '2^x = 32 = 2^5, therefore x = 5'
      },
      {
        id: 'q25',
        question: 'A rectangular field is 50m long and 30m wide. What is its perimeter?',
        options: ['80m', '120m', '160m', '200m'],
        correctAnswer: 2,
        explanation: 'Perimeter = 2(length + width) = 2(50 + 30) = 2(80) = 160m'
      }
    ]
  },
  'easy-2': {
    id: 'easy-2',
    title: 'English Fundamentals',
    duration: 35,
    questions: [
      {
        id: 'q1',
        question: 'Choose the correct spelling:',
        options: ['Recieve', 'Receive', 'Receve', 'Receeve'],
        correctAnswer: 1,
        explanation: 'The correct spelling is "Receive" - remember "i before e except after c"'
      },
      {
        id: 'q2',
        question: 'What is the synonym of "Abundant"?',
        options: ['Scarce', 'Plentiful', 'Limited', 'Rare'],
        correctAnswer: 1,
        explanation: 'Abundant means existing in large quantities; plentiful'
      },
      {
        id: 'q3',
        question: 'Choose the correct sentence:',
        options: [
          'Neither of the students were present',
          'Neither of the students was present', 
          'Neither of the student were present',
          'Neither of the student was present'
        ],
        correctAnswer: 1,
        explanation: '"Neither" is singular, so it takes a singular verb "was"'
      },
      {
        id: 'q4',
        question: 'What is the antonym of "Optimistic"?',
        options: ['Hopeful', 'Positive', 'Pessimistic', 'Confident'],
        correctAnswer: 2,
        explanation: 'Optimistic means hopeful; its opposite is pessimistic'
      },
      {
        id: 'q5',
        question: 'Fill in the blank: "The meeting has been _____ until tomorrow."',
        options: ['Postponed', 'Preponed', 'Advanced', 'Delayed'],
        correctAnswer: 0,
        explanation: 'Postponed means to delay until a later time'
      },
      {
        id: 'q6',
        question: 'Choose the correctly punctuated sentence:',
        options: [
          'Its a beautiful day isnt it?',
          "It's a beautiful day, isn't it?",
          "Its a beautiful day, isn't it?",
          "It's a beautiful day isnt it?"
        ],
        correctAnswer: 1,
        explanation: 'Contractions need apostrophes: It\'s (It is), isn\'t (is not), and questions need commas before tag questions'
      },
      {
        id: 'q7',
        question: 'What does the idiom "Break the ice" mean?',
        options: ['To destroy something', 'To start a conversation', 'To cool down', 'To be very cold'],
        correctAnswer: 1,
        explanation: '"Break the ice" means to initiate conversation or ease tension in a social situation'
      },
      {
        id: 'q8',
        question: 'Choose the word that is NOT a noun:',
        options: ['Happiness', 'Beautiful', 'Freedom', 'Childhood'],
        correctAnswer: 1,
        explanation: 'Beautiful is an adjective; the others are abstract nouns'
      },
      {
        id: 'q9',
        question: 'Which sentence uses the passive voice?',
        options: [
          'John wrote the letter.',
          'The letter was written by John.',
          'John is writing the letter.',
          'John will write the letter.'
        ],
        correctAnswer: 1,
        explanation: 'Passive voice structure: object + was/were + past participle + by + subject'
      },
      {
        id: 'q10',
        question: 'What is the plural of "Analysis"?',
        options: ['Analysises', 'Analysis', 'Analyses', 'Analysees'],
        correctAnswer: 2,
        explanation: 'Analysis (singular) → Analyses (plural), following Greek plural rules'
      },
      {
        id: 'q11',
        question: 'Choose the correct form: "I wish I _____ taller."',
        options: ['am', 'was', 'were', 'be'],
        correctAnswer: 2,
        explanation: 'In wish statements about present unreal situations, use "were" for all persons'
      },
      {
        id: 'q12',
        question: 'What type of sentence is this: "What a beautiful sunset!"',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 3,
        explanation: 'Exclamatory sentences express strong emotion and end with exclamation marks'
      },
      {
        id: 'q13',
        question: 'Which word means "to make something clear"?',
        options: ['Clarify', 'Classify', 'Glorify', 'Purify'],
        correctAnswer: 0,
        explanation: 'Clarify means to make clear or easier to understand'
      },
      {
        id: 'q14',
        question: 'Choose the correct preposition: "She is good _____ mathematics."',
        options: ['in', 'at', 'on', 'with'],
        correctAnswer: 1,
        explanation: 'We use "good at" when referring to skills or subjects'
      },
      {
        id: 'q15',
        question: 'What is the superlative form of "bad"?',
        options: ['Baddest', 'Worse', 'Worst', 'Most bad'],
        correctAnswer: 2,
        explanation: 'Bad → Worse (comparative) → Worst (superlative)'
      },
      {
        id: 'q16',
        question: 'Which sentence has a dangling modifier?',
        options: [
          'Walking to the store, I saw my friend.',
          'Walking to the store, my friend was seen.',
          'I saw my friend walking to the store.',
          'My friend was walking to the store.'
        ],
        correctAnswer: 1,
        explanation: 'The modifier "walking to the store" incorrectly modifies "my friend" instead of "I"'
      },
      {
        id: 'q17',
        question: 'What does "ubiquitous" mean?',
        options: ['Rare', 'Present everywhere', 'Very old', 'Mysterious'],
        correctAnswer: 1,
        explanation: 'Ubiquitous means present, appearing, or found everywhere'
      },
      {
        id: 'q18',
        question: 'Choose the correct article: "_____ university has _____ honor code."',
        options: ['A, an', 'An, a', 'The, an', 'A, a'],
        correctAnswer: 0,
        explanation: 'University starts with consonant sound /j/, so "a". Honor starts with vowel sound, so "an"'
      },
      {
        id: 'q19',
        question: 'What is the past participle of "swim"?',
        options: ['Swam', 'Swum', 'Swimming', 'Swimmed'],
        correctAnswer: 1,
        explanation: 'Swim → Swam (past) → Swum (past participle)'
      },
      {
        id: 'q20',
        question: 'Which is an example of alliteration?',
        options: [
          'The sun shines brightly',
          'Peter Piper picked peppers',
          'Time flies quickly',
          'Beautiful butterflies dance'
        ],
        correctAnswer: 1,
        explanation: 'Alliteration is repetition of initial consonant sounds: Peter Piper picked peppers'
      },
      {
        id: 'q21',
        question: 'Choose the correct conjunction: "She studied hard _____ she could pass the exam."',
        options: ['because', 'so that', 'although', 'unless'],
        correctAnswer: 1,
        explanation: '"So that" expresses purpose - she studied hard for the purpose of passing'
      },
      {
        id: 'q22',
        question: 'What is the meaning of "procrastinate"?',
        options: ['To hurry up', 'To delay or postpone', 'To finish early', 'To work hard'],
        correctAnswer: 1,
        explanation: 'Procrastinate means to delay or postpone action'
      },
      {
        id: 'q23',
        question: 'Which sentence uses correct subject-verb agreement?',
        options: [
          'The list of names are on the table.',
          'The list of names is on the table.',
          'The lists of name is on the table.',
          'The lists of name are on the table.'
        ],
        correctAnswer: 1,
        explanation: 'The subject is "list" (singular), so it takes "is" regardless of "names" in the prepositional phrase'
      },
      {
        id: 'q24',
        question: 'What literary device is used in "The stars danced in the sky"?',
        options: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'],
        correctAnswer: 2,
        explanation: 'Personification gives human qualities (dancing) to non-human things (stars)'
      },
      {
        id: 'q25',
        question: 'Choose the correctly spelled word:',
        options: ['Embarass', 'Embarrass', 'Embarras', 'Embaress'],
        correctAnswer: 1,
        explanation: 'The correct spelling is "Embarrass" with double r and double s'
      },
      {
        id: 'q26',
        question: 'What is the comparative form of "good"?',
        options: ['Gooder', 'More good', 'Better', 'Best'],
        correctAnswer: 2,
        explanation: 'Good → Better (comparative) → Best (superlative)'
      },
      {
        id: 'q27',
        question: 'Choose the sentence with correct punctuation:',
        options: [
          'However, I disagree with your opinion.',
          'However I disagree, with your opinion.',
          'However I disagree with your opinion.',
          'However; I disagree with your opinion.'
        ],
        correctAnswer: 0,
        explanation: 'Introductory words like "However" should be followed by a comma'
      },
      {
        id: 'q28',
        question: 'What does "benevolent" mean?',
        options: ['Harmful', 'Kind and generous', 'Angry', 'Confused'],
        correctAnswer: 1,
        explanation: 'Benevolent means well-meaning and kindly; showing goodwill'
      },
      {
        id: 'q29',
        question: 'Which is the correct possessive form?',
        options: ["The childrens' toys", "The children's toys", "The childrens toys", "The children toys"],
        correctAnswer: 1,
        explanation: 'Children is already plural, so add \'s to make it possessive: children\'s'
      },
      {
        id: 'q30',
        question: 'What is the main clause in: "When the rain stopped, we went outside"?',
        options: ['When the rain stopped', 'we went outside', 'the rain stopped', 'When the rain'],
        correctAnswer: 1,
        explanation: 'The main clause can stand alone: "we went outside". The other is a dependent clause.'
      }
    ]
  },
  'easy-3': {
    id: 'easy-3',
    title: 'Logical Reasoning Basics',
    duration: 40,
    questions: [
      {
        id: 'q1',
        question: 'All cats are animals. Some animals are dogs. Therefore:',
        options: [
          'All cats are dogs',
          'Some cats are dogs', 
          'No cats are dogs',
          'Cannot be determined'
        ],
        correctAnswer: 3,
        explanation: 'From the given statements, we cannot determine the relationship between cats and dogs'
      },
      {
        id: 'q2',
        question: 'If BOOK is coded as 1334, how is PEN coded?',
        options: ['165', '156', '615', '651'],
        correctAnswer: 0,
        explanation: 'B=2, O=15, O=15, K=11 → 2-1=1, 15-12=3, 15-12=3, 11-7=4. P=16, E=5, N=14 → 16-15=1, 5-4=1, 14-8=6 → 165'
      },
      {
        id: 'q3',
        question: 'Find the odd one out:',
        options: ['Triangle', 'Square', 'Rectangle', 'Circle'],
        correctAnswer: 3,
        explanation: 'Circle is the only shape without straight sides and corners'
      },
      {
        id: 'q4',
        question: 'If today is Wednesday, what day will it be after 45 days?',
        options: ['Monday', 'Tuesday', 'Wednesday', 'Sunday'],
        correctAnswer: 3,
        explanation: '45 ÷ 7 = 6 remainder 3. So 3 days after Wednesday is Sunday'
      },
      {
        id: 'q5',
        question: 'Complete the pattern: A, D, G, J, ?',
        options: ['K', 'L', 'M', 'N'],
        correctAnswer: 2,
        explanation: 'Each letter is 3 positions ahead: A(1) → D(4) → G(7) → J(10) → M(13)'
      },
      {
        id: 'q6',
        question: 'In a certain code, CHAIR is written as FKDLU. How is TABLE written?',
        options: ['WDEOH', 'WDEOF', 'WDEOI', 'WDELO'],
        correctAnswer: 0,
        explanation: 'Each letter is shifted by +3: C→F, H→K, A→D, I→L, R→U. So T→W, A→D, B→E, L→O, E→H'
      },
      {
        id: 'q7',
        question: 'What comes next in the series: 2, 6, 18, 54, ?',
        options: ['108', '162', '216', '270'],
        correctAnswer: 1,
        explanation: 'Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162'
      },
      {
        id: 'q8',
        question: 'If all roses are flowers and some flowers are red, which conclusion is valid?',
        options: [
          'All roses are red',
          'Some roses are red',
          'No roses are red',
          'Some roses may be red'
        ],
        correctAnswer: 3,
        explanation: 'We only know some flowers are red, so some roses may or may not be red'
      },
      {
        id: 'q9',
        question: 'A is to the north of B. C is to the east of A. D is to the south of C. Where is D in relation to B?',
        options: ['North-East', 'South-East', 'North-West', 'South-West'],
        correctAnswer: 0,
        explanation: 'Drawing the positions: A is north of B, C is east of A, D is south of C, so D is northeast of B'
      },
      {
        id: 'q10',
        question: 'Complete the analogy: Doctor : Hospital :: Teacher : ?',
        options: ['Student', 'School', 'Book', 'Education'],
        correctAnswer: 1,
        explanation: 'Doctor works in Hospital, Teacher works in School'
      },
      {
        id: 'q11',
        question: 'If P + Q means P is father of Q, P - Q means P is mother of Q, what does A + B - C mean?',
        options: [
          'A is grandfather of C',
          'A is grandmother of C',
          'A is father of C',
          'A is uncle of C'
        ],
        correctAnswer: 0,
        explanation: 'A + B means A is father of B, B - C means B is mother of C, so A is grandfather of C'
      },
      {
        id: 'q12',
        question: 'Which number should come next: 1, 4, 9, 16, 25, ?',
        options: ['30', '36', '49', '64'],
        correctAnswer: 1,
        explanation: 'These are perfect squares: 1², 2², 3², 4², 5², 6² = 36'
      },
      {
        id: 'q13',
        question: 'In a row of 40 students, A is 16th from the left. What is A\'s position from the right?',
        options: ['24th', '25th', '26th', '27th'],
        correctAnswer: 1,
        explanation: 'Position from right = Total students - Position from left + 1 = 40 - 16 + 1 = 25'
      },
      {
        id: 'q14',
        question: 'If 2 is coded as α, 3 as β, 4 as γ, 5 as δ, what is the code for 23?',
        options: ['αβ', 'βα', 'αγ', 'βγ'],
        correctAnswer: 1,
        explanation: '23 has digits 2 and 3. 2 is coded as α, 3 is coded as β, so 23 is βα'
      },
      {
        id: 'q15',
        question: 'Find the missing number: 3, 8, 15, 24, 35, ?',
        options: ['48', '50', '45', '42'],
        correctAnswer: 0,
        explanation: 'Pattern: 1×3, 2×4, 3×5, 4×6, 5×7, 6×8 = 48'
      },
      {
        id: 'q16',
        question: 'If MONDAY is coded as 123456, then YONAD is coded as:',
        options: ['612543', '651243', '612453', '651234'],
        correctAnswer: 0,
        explanation: 'M=1, O=2, N=3, D=4, A=5, Y=6. So YONAD = 6, 2, 3, 5, 4 = 612534. Closest is 612543'
      },
      {
        id: 'q17',
        question: 'Complete the series: AZ, BY, CX, DW, ?',
        options: ['EV', 'FU', 'EW', 'FV'],
        correctAnswer: 0,
        explanation: 'First letter increases: A,B,C,D,E. Second letter decreases: Z,Y,X,W,V. So EV'
      },
      {
        id: 'q18',
        question: 'If you rearrange the letters "CIFAIPC", you get:',
        options: ['TRAFFIC', 'PACIFIC', 'PACIFIC', 'GRAPHIC'],
        correctAnswer: 1,
        explanation: 'CIFAIPC can be rearranged to spell PACIFIC'
      },
      {
        id: 'q19',
        question: 'A man walks 3 km north, then 4 km east. How far is he from his starting point?',
        options: ['5 km', '6 km', '7 km', '8 km'],
        correctAnswer: 0,
        explanation: 'Using Pythagorean theorem: √(3² + 4²) = √(9 + 16) = √25 = 5 km'
      },
      {
        id: 'q20',
        question: 'In a certain language, "ja ka ma" means "very good boy", "ka na da" means "boy is smart". What does "ja" mean?',
        options: ['very', 'good', 'boy', 'smart'],
        correctAnswer: 0,
        explanation: '"ka" appears in both phrases and means "boy". So in "ja ka ma", "ja" means "very"'
      },
      {
        id: 'q21',
        question: 'What is the next term in: 2, 3, 5, 8, 13, ?',
        options: ['18', '19', '21', '23'],
        correctAnswer: 2,
        explanation: 'Fibonacci sequence: each term is sum of previous two: 2+3=5, 3+5=8, 5+8=13, 8+13=21'
      },
      {
        id: 'q22',
        question: 'If A = 1, B = 2, C = 3... Z = 26, what is the value of "CAB"?',
        options: ['6', '7', '8', '9'],
        correctAnswer: 0,
        explanation: 'C = 3, A = 1, B = 2. Sum = 3 + 1 + 2 = 6'
      },
      {
        id: 'q23',
        question: 'In a class, 60% are girls. If there are 24 boys, how many total students?',
        options: ['40', '50', '60', '80'],
        correctAnswer: 2,
        explanation: 'If 60% are girls, then 40% are boys. 40% = 24, so 100% = 24 ÷ 0.4 = 60'
      },
      {
        id: 'q24',
        question: 'Which day comes two days before the day that comes three days after Tuesday?',
        options: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
        correctAnswer: 0,
        explanation: 'Three days after Tuesday = Friday. Two days before Friday = Wednesday'
      },
      {
        id: 'q25',
        question: 'Find the odd one: 125, 216, 343, 512, 729',
        options: ['125', '216', '512', '729'],
        correctAnswer: 2,
        explanation: 'All are perfect cubes: 5³=125, 6³=216, 7³=343, 9³=729. 512=8³, but 8 is missing from sequence'
      }
    ]
  },
  'easy-4': {
    id: 'easy-4',
    title: 'General Knowledge Starter',
    duration: 25,
    questions: [
      {
        id: 'q1',
        question: 'Who is the current Prime Minister of India (as of 2025)?',
        options: ['Rahul Gandhi', 'Narendra Modi', 'Amit Shah', 'Yogi Adityanath'],
        correctAnswer: 1,
        explanation: 'Narendra Modi has been the Prime Minister of India since 2014'
      },
      {
        id: 'q2',
        question: 'Which is the largest state in India by area?',
        options: ['Maharashtra', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh'],
        correctAnswer: 2,
        explanation: 'Rajasthan is the largest state in India by area'
      },
      {
        id: 'q3',
        question: 'What is the capital of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
        correctAnswer: 2,
        explanation: 'Canberra is the capital city of Australia'
      },
      {
        id: 'q4',
        question: 'Which planet is known as the "Red Planet"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        explanation: 'Mars is called the Red Planet due to its reddish appearance'
      },
      {
        id: 'q5',
        question: 'In which year did India gain independence?',
        options: ['1945', '1946', '1947', '1948'],
        correctAnswer: 2,
        explanation: 'India gained independence on August 15, 1947'
      },
      {
        id: 'q6',
        question: 'What is the currency of Japan?',
        options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
        correctAnswer: 2,
        explanation: 'The Japanese currency is Yen'
      },
      {
        id: 'q7',
        question: 'Who wrote the Indian National Anthem?',
        options: ['Mahatma Gandhi', 'Rabindranath Tagore', 'Subhas Chandra Bose', 'Jawaharlal Nehru'],
        correctAnswer: 1,
        explanation: 'Jana Gana Mana was written by Rabindranath Tagore'
      },
      {
        id: 'q8',
        question: 'Which is the longest river in the world?',
        options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
        correctAnswer: 1,
        explanation: 'The Nile River is the longest river in the world'
      },
      {
        id: 'q9',
        question: 'What is the chemical symbol for Gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswer: 2,
        explanation: 'Au is the chemical symbol for Gold (from Latin: Aurum)'
      },
      {
        id: 'q10',
        question: 'Which organ in the human body produces insulin?',
        options: ['Liver', 'Kidney', 'Pancreas', 'Heart'],
        correctAnswer: 2,
        explanation: 'The pancreas produces insulin to regulate blood sugar'
      },
      {
        id: 'q11',
        question: 'In which year was the first iPhone launched?',
        options: ['2006', '2007', '2008', '2009'],
        correctAnswer: 1,
        explanation: 'The first iPhone was launched by Apple in 2007'
      },
      {
        id: 'q12',
        question: 'What is the smallest country in the world?',
        options: ['Monaco', 'Nauru', 'Vatican City', 'San Marino'],
        correctAnswer: 2,
        explanation: 'Vatican City is the smallest country in the world by area'
      },
      {
        id: 'q13',
        question: 'Who is known as the "Father of the Indian Constitution"?',
        options: ['Mahatma Gandhi', 'B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
        correctAnswer: 1,
        explanation: 'Dr. B.R. Ambedkar is known as the Father of the Indian Constitution'
      },
      {
        id: 'q14',
        question: 'Which gas makes up about 78% of Earth\'s atmosphere?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correctAnswer: 2,
        explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere'
      },
      {
        id: 'q15',
        question: 'What is the largest mammal in the world?',
        options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
        correctAnswer: 1,
        explanation: 'The Blue Whale is the largest mammal in the world'
      },
      {
        id: 'q16',
        question: 'Which Indian city is known as the "Silicon Valley of India"?',
        options: ['Mumbai', 'Pune', 'Hyderabad', 'Bangalore'],
        correctAnswer: 3,
        explanation: 'Bangalore is known as the Silicon Valley of India due to its IT industry'
      },
      {
        id: 'q17',
        question: 'Who invented the telephone?',
        options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Benjamin Franklin'],
        correctAnswer: 1,
        explanation: 'Alexander Graham Bell invented the telephone in 1876'
      },
      {
        id: 'q18',
        question: 'What is the hardest natural substance on Earth?',
        options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
        correctAnswer: 2,
        explanation: 'Diamond is the hardest natural substance on Earth'
      },
      {
        id: 'q19',
        question: 'Which is the highest mountain peak in the world?',
        options: ['K2', 'Mount Everest', 'Kangchenjunga', 'Lhotse'],
        correctAnswer: 1,
        explanation: 'Mount Everest is the highest mountain peak in the world'
      },
      {
        id: 'q20',
        question: 'What does "WWW" stand for?',
        options: ['World Wide Web', 'World Wide War', 'World Wide Weather', 'World Wide Waste'],
        correctAnswer: 0,
        explanation: 'WWW stands for World Wide Web'
      }
    ]
  }
};

export function ExamInterface() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const examContainerRef = useRef<HTMLDivElement>(null);
  const maxTabSwitchWarnings = 3;

  // Initialize exam data
  useEffect(() => {
    if (testId && easyTests[testId]) {
      const test = easyTests[testId];
      setExamData(test);
      setTimeLeft(test.duration * 60); // Convert minutes to seconds
    } else {
      navigate('/mock-test');
    }
  }, [testId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (examStarted && timeLeft > 0 && !examCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setExamCompleted(true);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, timeLeft, examCompleted]);

  // Fullscreen management
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement && examStarted && !examCompleted) {
        setTabSwitchWarnings(prev => {
          const newWarnings = prev + 1;
          if (newWarnings >= maxTabSwitchWarnings) {
            alert('Maximum warnings exceeded! Exam will be terminated.');
            setExamCompleted(true);
            setShowResults(true);
            return newWarnings;
          }
          alert(`Warning ${newWarnings}/${maxTabSwitchWarnings}: You exited fullscreen mode! ${maxTabSwitchWarnings - newWarnings} warnings remaining.`);
          return newWarnings;
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [examStarted, examCompleted]);

  // Prevent tab switching and right-click
  useEffect(() => {
    if (examStarted && !examCompleted) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setTabSwitchWarnings(prev => {
            const newWarnings = prev + 1;
            if (newWarnings >= maxTabSwitchWarnings) {
              alert('Maximum warnings exceeded! Exam terminated due to tab switching.');
              setExamCompleted(true);
              setShowResults(true);
              return newWarnings;
            }
            alert(`Warning ${newWarnings}/${maxTabSwitchWarnings}: Tab switching detected! ${maxTabSwitchWarnings - newWarnings} warnings remaining.`);
            return newWarnings;
          });
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent common shortcuts
        if (
          e.key === 'F12' ||
          (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
          (e.ctrlKey && (e.key === 't' || e.key === 'T')) ||
          (e.altKey && e.key === 'Tab')
        ) {
          e.preventDefault();
          alert('This action is not allowed during the exam!');
        }
      };

      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        alert('Right-click is disabled during the exam!');
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [examStarted, examCompleted]);

  const enterFullscreen = async () => {
    if (examContainerRef.current) {
      try {
        await examContainerRef.current.requestFullscreen();
        setExamStarted(true);
      } catch (error) {
        alert('Fullscreen is required to start the exam. Please allow fullscreen access.');
      }
    }
  };

  const exitFullscreen = async () => {
    try {
      await document.exitFullscreen();
    } catch (error) {
      console.log('Error exiting fullscreen:', error);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < (examData?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const confirmSubmit = window.confirm('Are you sure you want to submit the exam? This action cannot be undone.');
    if (confirmSubmit) {
      setExamCompleted(true);
      setShowResults(true);
      exitFullscreen();
    }
  };

  const calculateResults = () => {
    if (!examData) return { score: 0, total: 0, percentage: 0, correctAnswers: [], wrongAnswers: [] };
    
    let correct = 0;
    const correctAnswers: string[] = [];
    const wrongAnswers: string[] = [];
    
    examData.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correct++;
        correctAnswers.push(question.id);
      } else {
        wrongAnswers.push(question.id);
      }
    });
    
    return {
      score: correct,
      total: examData.questions.length,
      percentage: Math.round((correct / examData.questions.length) * 100),
      correctAnswers,
      wrongAnswers
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!examData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Completed!</h1>
            <p className="text-gray-600">{examData.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-800">{results.score}</div>
              <div className="text-green-600">Correct Answers</div>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-blue-800">{results.percentage}%</div>
              <div className="text-blue-600">Percentage</div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-purple-800">{results.total}</div>
              <div className="text-purple-600">Total Questions</div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className={`text-2xl font-bold ${results.percentage >= 70 ? 'text-green-600' : results.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {results.percentage >= 70 ? '🎉 Excellent!' : results.percentage >= 50 ? '👍 Good Job!' : '📚 Keep Practicing!'}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/mock-test')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Take Another Test
              </button>
              <button
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Review Answers
              </button>
            </div>

            {tabSwitchWarnings > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                <p className="font-semibold">Violations Detected: {tabSwitchWarnings}</p>
                <p className="text-sm">Tab switching or fullscreen exit warnings during the exam.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div ref={examContainerRef} className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-red-400 to-orange-500 p-4 rounded-full">
                <AlertTriangle className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{examData.title}</h1>
            <p className="text-gray-600 mb-8">Please read the instructions carefully before starting the exam.</p>
            
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Exam Rules & Warnings</h2>
              <div className="text-left space-y-3 text-red-700">
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>This exam will open in <strong>FULLSCREEN MODE</strong> and cannot be minimized</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Tab switching</strong> or <strong>exiting fullscreen</strong> will trigger warnings</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Maximum <strong>3 warnings allowed</strong> - exam will terminate after that</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Right-click is disabled</strong> during the exam</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Developer tools and browser shortcuts are <strong>blocked</strong></span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Exam duration: <strong>{examData.duration} minutes</strong> ({examData.questions.length} questions)</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
              <p className="text-green-800 font-semibold">
                ✅ By clicking "Start Exam", you agree to follow all exam rules and maintain academic integrity.
              </p>
            </div>

            <button
              onClick={enterFullscreen}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🚀 Start Exam (Enter Fullscreen)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = examData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / examData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                <Flag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{examData.title}</h1>
                <p className="text-gray-600">Question {currentQuestion + 1} of {examData.questions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {tabSwitchWarnings > 0 && (
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ⚠️ Warnings: {tabSwitchWarnings}/{maxTabSwitchWarnings}
                </div>
              )}
              
              <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5 text-red-600" />
                <span className={`font-bold text-lg ${timeLeft <= 300 ? 'text-red-600 animate-pulse' : 'text-red-800'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${isFullscreen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isFullscreen ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>{isFullscreen ? 'Fullscreen' : 'Not Fullscreen'}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQ.question}</h2>
            
            <div className="space-y-4">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQ.id, index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    answers[currentQ.id] === index
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ.id] === index
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQ.id] === index && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {currentQuestion === examData.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Submit Exam 🎯
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
