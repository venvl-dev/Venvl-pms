export const MOCK_DASHBOARD_DATA = {
  user: { name: "Sara", roleLabel: "Org admin" },
  metrics: {
    occupancy: 57,
    adr: "205.00",
    revpar: "12.00",
    revenue: "3.27K"
  },
  operations: {
    arrivals: [
      { id: "a1", guest: "Oliver Smith", property: "Downtown Loft", unit: "Apt 4B" },
      { id: "a2", guest: "Liam Johnson", property: "Nile View Condo", unit: "Floor 12" },
      { id: "a3", guest: "Isabella Davis", property: "Maadi Retreat", unit: "Villa 2" },
      { id: "a4", guest: "Sophia Garcia", property: "Zamalek Studio", unit: "Unit 8A" }
    ],
    departures: [
      { id: "d1", guest: "Nour El-Din", property: "Maadi Nile Apartment", unit: "Apt 2A" },
      { id: "d2", guest: "James Wilson", property: "Zamalek Studio", unit: "Unit 3C" },
      { id: "d3", guest: "Emma Brown", property: "Downtown Loft", unit: "Apt 5" },
      { id: "d4", guest: "Lucas Taylor", property: "El Gouna Lagoon", unit: "Chalet 14" },
      { id: "d5", guest: "Amelia Thomas", property: "Marassi Beachfront", unit: "Villa 9" },
      { id: "d6", guest: "Mia Martinez", property: "New Cairo Serviced", unit: "Apt 101" }
    ],
    upcomingReservations: [
      { id: "u1", guest: "John Doe", property: "Zayed Family Villa", daysUntil: 2 },
      { id: "u2", guest: "Jane Smith", property: "Downtown Loft", daysUntil: 3 },
      { id: "u3", guest: "Ahmed Hassan", property: "Maadi Nile Apartment", daysUntil: 4 },
      { id: "u4", guest: "Elena Rodriguez", property: "El Gouna Lagoon", daysUntil: 5 },
      { id: "u5", guest: "Wei Chen", property: "Zamalek Studio", daysUntil: 7 },
      { id: "u6", guest: "Sarah Williams", property: "Marassi Beachfront", daysUntil: 8 }
    ],
    stayingGuests: [
      { id: "s1", guest: "Emma Smith", property: "El Gouna Lagoon Studio", nightsLeft: 1 },
      { id: "s2", guest: "Michael Jones", property: "New Cairo Serviced", nightsLeft: 2 },
      { id: "s3", guest: "David Miller", property: "Downtown Loft", nightsLeft: 3 },
      { id: "s4", guest: "Sarah Davis", property: "Zamalek Studio", nightsLeft: 4 },
      { id: "s5", guest: "James Brown", property: "Maadi Nile Apartment", nightsLeft: 5 },
      { id: "s6", guest: "Robert Wilson", property: "Zayed Family Villa", nightsLeft: 7 },
      { id: "s7", guest: "Maria Garcia", property: "Marassi Beachfront", nightsLeft: 10 },
      { id: "s8", guest: "William Taylor", property: "Nile View Condo", nightsLeft: 14 }
    ]
  },
  needsAttention: [
    { id: "n1", guest: "Sophie Martin", property: "El Gouna Lagoon Studio", balance: "292.00" },
    { id: "n2", guest: "Maria Rossi", property: "New Cairo Serviced Residences", balance: "152.00" },
    { id: "n3", guest: "Hana Saleh", property: "Marassi Beachfront Chalet", balance: "417.00" },
    { id: "n4", guest: "Ahmed Tarek", property: "Zayed Family Villa", balance: "685.00" },
    { id: "n5", guest: "Oliver White", property: "Downtown Loft", balance: "150.00" },
    { id: "n6", guest: "Liam Harris", property: "Zamalek Studio", balance: "320.00" },
    { id: "n7", guest: "Noah Martin", property: "Nile View Condo", balance: "50.00" },
    { id: "n8", guest: "William Thompson", property: "Maadi Retreat", balance: "890.00" },
    { id: "n9", guest: "James Garcia", property: "El Gouna Lagoon Studio", balance: "120.00" },
    { id: "n10", guest: "Benjamin Martinez", property: "Marassi Beachfront", balance: "45.00" }
  ]
}