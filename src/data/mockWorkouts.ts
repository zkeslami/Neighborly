export interface Workout {
  id: string;
  name: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  description: string;
}

export const mockWorkouts: Workout[] = [
  {
    id: "w1",
    name: "Full-Body 30 Min HIIT",
    duration: "30 min",
    difficulty: "Intermediate",
    category: "HIIT",
    description: "High-intensity intervals targeting all major muscle groups. Perfect for a quick, effective workout."
  },
  {
    id: "w2",
    name: "Sunset Flow Yoga",
    duration: "45 min",
    difficulty: "Beginner",
    category: "Yoga",
    description: "Gentle evening yoga flow to unwind and stretch. Great for flexibility and relaxation."
  },
  {
    id: "w3",
    name: "5K Easy Run",
    duration: "25-35 min",
    difficulty: "Beginner",
    category: "Cardio",
    description: "Conversational pace 5K run. Perfect for running with a friend."
  },
  {
    id: "w4",
    name: "Partner AMRAP Challenge",
    duration: "20 min",
    difficulty: "Advanced",
    category: "CrossFit",
    description: "As Many Rounds As Possible with a partner. Competitive and fun!"
  },
  {
    id: "w5",
    name: "Core Crusher",
    duration: "15 min",
    difficulty: "Intermediate",
    category: "Strength",
    description: "Focused ab and core workout. Quick but intense."
  },
  {
    id: "w6",
    name: "Morning Stretch Routine",
    duration: "10 min",
    difficulty: "Beginner",
    category: "Mobility",
    description: "Wake up your body with this gentle morning stretch sequence."
  },
  {
    id: "w7",
    name: "Upper Body Strength",
    duration: "40 min",
    difficulty: "Intermediate",
    category: "Strength",
    description: "Build upper body strength with this comprehensive workout."
  },
  {
    id: "w8",
    name: "Trail Running Adventure",
    duration: "45-60 min",
    difficulty: "Advanced",
    category: "Cardio",
    description: "Hit the trails for a challenging outdoor run with varied terrain."
  }
];
