export interface MockPlace {
  id: string;
  name: string;
  address: string;
  category: string;
  neighborhood: string;
  visited_status: "not_visited" | "visited" | "favorite";
  notes?: string;
}

export const mockPlaces: MockPlace[] = [
  {
    id: "p1",
    name: "Paperboy",
    address: "1203 E 11th St, Austin, TX",
    category: "Brunch",
    neighborhood: "East Austin",
    visited_status: "favorite",
    notes: "Best breakfast tacos in town"
  },
  {
    id: "p2",
    name: "Epoch Coffee",
    address: "221 W North Loop Blvd, Austin, TX",
    category: "Coffee",
    neighborhood: "North Loop",
    visited_status: "visited"
  },
  {
    id: "p3",
    name: "Franklin Barbecue",
    address: "900 E 11th St, Austin, TX",
    category: "BBQ",
    neighborhood: "East Austin",
    visited_status: "not_visited",
    notes: "Need to go early!"
  },
  {
    id: "p4",
    name: "Lazarus Brewing",
    address: "1902 E 6th St, Austin, TX",
    category: "Drinks",
    neighborhood: "East Austin",
    visited_status: "visited"
  },
  {
    id: "p5",
    name: "Barton Springs Pool",
    address: "2201 Barton Springs Rd, Austin, TX",
    category: "Recreation",
    neighborhood: "Zilker",
    visited_status: "favorite"
  },
  {
    id: "p6",
    name: "Houndstooth Coffee",
    address: "401 Congress Ave, Austin, TX",
    category: "Coffee",
    neighborhood: "Downtown",
    visited_status: "visited"
  },
  {
    id: "p7",
    name: "Uchi",
    address: "801 S Lamar Blvd, Austin, TX",
    category: "Dinner",
    neighborhood: "South Lamar",
    visited_status: "not_visited",
    notes: "Sushi night destination"
  },
  {
    id: "p8",
    name: "Zilker Park",
    address: "2100 Barton Springs Rd, Austin, TX",
    category: "Recreation",
    neighborhood: "Zilker",
    visited_status: "favorite"
  }
];
