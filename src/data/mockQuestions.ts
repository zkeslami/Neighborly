export interface Answer {
  id: string;
  friend_id: string;
  friend_name: string;
  friend_avatar: string;
  text: string;
  location_name?: string;
}

export interface Question {
  id: string;
  question: string;
  category: string;
  location_name?: string;
  is_urgent: boolean;
  answers: Answer[];
  created_at: string;
}

export const mockQuestions: Question[] = [
  {
    id: "q1",
    question: "Good electrician in East Austin?",
    category: "Home Repair",
    location_name: "East Austin",
    is_urgent: false,
    answers: [
      {
        id: "a1",
        friend_id: "f1",
        friend_name: "Alex Chen",
        friend_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        text: "Used Austin Pro Electric last month – great work, fair prices!"
      },
      {
        id: "a2",
        friend_id: "f7",
        friend_name: "Jordan Kim",
        friend_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        text: "Avoid Sparky's, they overcharged me. Go with Alex's recommendation."
      }
    ],
    created_at: "2024-12-01"
  },
  {
    id: "q2",
    question: "Best quiet cafe to work from near downtown?",
    category: "Food & Drink",
    location_name: "Downtown Austin",
    is_urgent: false,
    answers: [
      {
        id: "a3",
        friend_id: "f2",
        friend_name: "Priya Sharma",
        friend_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        text: "Houndstooth Coffee on Congress is perfect – great wifi, quiet atmosphere."
      }
    ],
    created_at: "2024-11-30"
  },
  {
    id: "q3",
    question: "Best outdoor workout spot for GeneraFit routines?",
    category: "Fitness",
    location_name: "Austin",
    is_urgent: false,
    answers: [
      {
        id: "a4",
        friend_id: "f5",
        friend_name: "Chris Taylor",
        friend_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
        text: "The outdoor gym at Zilker is great! Bars for pull-ups, benches, plenty of space.",
        location_name: "Zilker Park"
      },
      {
        id: "a5",
        friend_id: "f3",
        friend_name: "Sam Rodriguez",
        friend_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
        text: "Butler Trail has awesome spots near the boardwalk section."
      }
    ],
    created_at: "2024-11-28"
  },
  {
    id: "q4",
    question: "Anyone else have power out near Mueller?",
    category: "Safety",
    location_name: "Mueller",
    is_urgent: true,
    answers: [
      {
        id: "a6",
        friend_id: "f4",
        friend_name: "Jamie Wilson",
        friend_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
        text: "Yes! Austin Energy says restoration by 4pm. Working from a coffee shop."
      }
    ],
    created_at: "2024-12-02"
  },
  {
    id: "q5",
    question: "Dog-friendly patios for happy hour?",
    category: "Food & Drink",
    is_urgent: false,
    answers: [
      {
        id: "a7",
        friend_id: "f6",
        friend_name: "Morgan Lee",
        friend_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
        text: "Yard Bar on Burnet is literally made for this – bar + dog park!"
      },
      {
        id: "a8",
        friend_id: "f2",
        friend_name: "Priya Sharma",
        friend_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        text: "Lazarus Brewing has a huge patio and is super dog friendly."
      }
    ],
    created_at: "2024-11-25"
  }
];
