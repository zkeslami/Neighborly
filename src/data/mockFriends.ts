export interface Friend {
  id: string;
  name: string;
  avatar_url: string;
  last_hangout: string | null;
  relationship_start: string;
  tags: string[];
  days_since_seen: number;
}

export const mockFriends: Friend[] = [
  {
    id: "f1",
    name: "Alex Chen",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    last_hangout: "2024-11-15",
    relationship_start: "2019-03-15",
    tags: ["coffee buddy", "tech talks"],
    days_since_seen: 17
  },
  {
    id: "f2",
    name: "Priya Sharma",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    last_hangout: "2024-11-28",
    relationship_start: "2021-06-20",
    tags: ["brunch crew", "hiking"],
    days_since_seen: 4
  },
  {
    id: "f3",
    name: "Sam Rodriguez",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    last_hangout: "2024-10-20",
    relationship_start: "2018-01-10",
    tags: ["gym partner", "movie nights"],
    days_since_seen: 43
  },
  {
    id: "f4",
    name: "Jamie Wilson",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
    last_hangout: "2024-11-01",
    relationship_start: "2017-09-01",
    tags: ["concert buddy", "travel"],
    days_since_seen: 31
  },
  {
    id: "f5",
    name: "Chris Taylor",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    last_hangout: "2024-11-25",
    relationship_start: "2022-02-14",
    tags: ["workout partner", "cooking"],
    days_since_seen: 7
  },
  {
    id: "f6",
    name: "Morgan Lee",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
    last_hangout: "2024-09-10",
    relationship_start: "2020-07-04",
    tags: ["book club", "wine nights"],
    days_since_seen: 83
  },
  {
    id: "f7",
    name: "Jordan Kim",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    last_hangout: "2024-11-30",
    relationship_start: "2023-01-15",
    tags: ["coworking", "lunch dates"],
    days_since_seen: 2
  },
  {
    id: "f8",
    name: "Riley Parker",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riley",
    last_hangout: "2024-08-20",
    relationship_start: "2019-11-20",
    tags: ["old friend", "road trips"],
    days_since_seen: 104
  }
];
