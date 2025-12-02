export interface LocalAlert {
  id: string;
  message: string;
  source: string;
  category: string;
  location_name?: string;
  created_at: string;
}

export const mockAlerts: LocalAlert[] = [
  {
    id: "la1",
    message: "Water outage in Zone 3 until 4pm today. Crews working on main line repair.",
    source: "@AustinWater",
    category: "Utilities",
    location_name: "Zone 3",
    created_at: "2024-12-02T10:30:00"
  },
  {
    id: "la2",
    message: "Trail closed due to weather: Barton Creek Greenbelt Section 2. Reopening tomorrow.",
    source: "@AustinParks",
    category: "Recreation",
    location_name: "Barton Creek Greenbelt",
    created_at: "2024-12-02T08:00:00"
  },
  {
    id: "la3",
    message: "Free outdoor fitness class in Zilker Park this Saturday 9am! All levels welcome.",
    source: "@AustinFitEvents",
    category: "Events",
    location_name: "Zilker Park",
    created_at: "2024-12-01T14:00:00"
  },
  {
    id: "la4",
    message: "Farmers market extended hours this weekend: 7am-2pm at Mueller Lake Park.",
    source: "@MuellerAustin",
    category: "Events",
    location_name: "Mueller Lake Park",
    created_at: "2024-12-01T12:00:00"
  },
  {
    id: "la5",
    message: "Traffic advisory: I-35 southbound delays due to construction. Use MoPac as alternate.",
    source: "@AustinTraffic",
    category: "Traffic",
    created_at: "2024-12-02T07:00:00"
  }
];
