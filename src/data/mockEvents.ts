export interface Event {
  id: string;
  title: string;
  event_type: "social" | "workout";
  date: string;
  location_name: string;
  location_address: string;
  attendee_ids: string[];
  workout_id?: string;
  workout_name?: string;
  notes?: string;
  status: "upcoming" | "past" | "suggested";
}

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Coffee Catch-up",
    event_type: "social",
    date: "2024-12-05T10:00:00",
    location_name: "Epoch Coffee",
    location_address: "221 W North Loop Blvd, Austin, TX",
    attendee_ids: ["f1"],
    status: "upcoming"
  },
  {
    id: "e2",
    title: "Full-Body HIIT Session",
    event_type: "workout",
    date: "2024-12-04T07:00:00",
    location_name: "Town Lake Trail",
    location_address: "Lady Bird Lake, Austin, TX",
    attendee_ids: ["f3", "f5"],
    workout_id: "w1",
    workout_name: "Full-Body 30 Min HIIT",
    status: "upcoming"
  },
  {
    id: "e3",
    title: "Brunch at Paperboy",
    event_type: "social",
    date: "2024-12-07T11:00:00",
    location_name: "Paperboy",
    location_address: "1203 E 11th St, Austin, TX",
    attendee_ids: ["f2", "f4"],
    status: "upcoming"
  },
  {
    id: "e4",
    title: "Evening Yoga",
    event_type: "workout",
    date: "2024-12-06T18:00:00",
    location_name: "Zilker Park",
    location_address: "2100 Barton Springs Rd, Austin, TX",
    attendee_ids: ["f5"],
    workout_id: "w2",
    workout_name: "Sunset Flow Yoga",
    status: "upcoming"
  },
  {
    id: "e5",
    title: "Movie Night",
    event_type: "social",
    date: "2024-11-20T19:30:00",
    location_name: "Alamo Drafthouse",
    location_address: "320 E 6th St, Austin, TX",
    attendee_ids: ["f3", "f4"],
    status: "past"
  },
  {
    id: "e6",
    title: "Morning Run",
    event_type: "workout",
    date: "2024-11-25T06:30:00",
    location_name: "Butler Hike and Bike Trail",
    location_address: "Austin, TX",
    attendee_ids: ["f5"],
    workout_id: "w3",
    workout_name: "5K Easy Run",
    status: "past"
  },
  {
    id: "e7",
    title: "Dinner at Franklin BBQ",
    event_type: "social",
    date: "2024-12-10T18:00:00",
    location_name: "Franklin Barbecue",
    location_address: "900 E 11th St, Austin, TX",
    attendee_ids: ["f1", "f2", "f7"],
    notes: "Get there early!",
    status: "suggested"
  },
  {
    id: "e8",
    title: "Partner Workout Challenge",
    event_type: "workout",
    date: "2024-12-08T08:00:00",
    location_name: "Barton Springs Pool",
    location_address: "2201 Barton Springs Rd, Austin, TX",
    attendee_ids: ["f3"],
    workout_id: "w4",
    workout_name: "Partner AMRAP Challenge",
    status: "suggested"
  }
];
