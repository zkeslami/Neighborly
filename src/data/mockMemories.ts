export interface Memory {
  id: string;
  title: string;
  description: string;
  memory_type: "timeline" | "trip" | "workout_streak" | "milestone";
  date: string;
  friend_ids: string[];
  image_url?: string;
  tags: string[];
}

export const mockMemories: Memory[] = [
  {
    id: "m1",
    title: "You & Jamie: 7 years of memories",
    description: "From college roommates to lifelong friends. 47 hangouts, 3 road trips, countless memories.",
    memory_type: "timeline",
    date: "2017-09-01",
    friend_ids: ["f4"],
    tags: ["friendship anniversary"]
  },
  {
    id: "m2",
    title: "Trip to Portland – June 2023",
    description: "Food carts, Powell's Books, and that amazing hike up Multnomah Falls. Best weekend trip ever!",
    memory_type: "trip",
    date: "2023-06-15",
    friend_ids: ["f4", "f8"],
    image_url: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400",
    tags: ["travel", "summer"]
  },
  {
    id: "m3",
    title: "Workout streak with Chris – 8 sessions",
    description: "You and Chris have been crushing it! 8 GeneraFit workouts together this year.",
    memory_type: "workout_streak",
    date: "2024-11-25",
    friend_ids: ["f5"],
    tags: ["fitness", "consistency"]
  },
  {
    id: "m4",
    title: "One year ago today",
    description: "Game night at Priya's place – you won Settlers of Catan!",
    memory_type: "milestone",
    date: "2023-12-02",
    friend_ids: ["f2", "f1", "f7"],
    tags: ["game night", "throwback"]
  },
  {
    id: "m5",
    title: "Concert at ACL – October 2024",
    description: "Saw Dua Lipa and Hozier with Jamie. Perfect weather, perfect music.",
    memory_type: "trip",
    date: "2024-10-12",
    friend_ids: ["f4"],
    image_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
    tags: ["music", "festival"]
  },
  {
    id: "m6",
    title: "First workout with Sam",
    description: "Started your gym partnership with Sam – the beginning of something great!",
    memory_type: "milestone",
    date: "2022-03-15",
    friend_ids: ["f3"],
    tags: ["fitness", "milestone"]
  },
  {
    id: "m7",
    title: "5 years with Alex",
    description: "Half a decade of friendship! From work acquaintances to true friends.",
    memory_type: "timeline",
    date: "2019-03-15",
    friend_ids: ["f1"],
    tags: ["friendship anniversary"]
  },
  {
    id: "m8",
    title: "Book club anniversary",
    description: "One year of monthly book club meetings with Morgan. 12 books read together!",
    memory_type: "milestone",
    date: "2024-07-04",
    friend_ids: ["f6"],
    tags: ["book club", "anniversary"]
  }
];
