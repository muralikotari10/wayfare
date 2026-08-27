export const seedDestinations = [
  {
    _id: "dest-1",
    name: "Tokyo",
    country: "Japan",
    continent: "Asia",
    tagline: "Where futuristic neon meets timeless shrine tranquility",
    description: "Tokyo blends ultramodern skycrapers, robot cafes, and tranquil cedar shrines. From the buzzing scramble crossing of Shibuya to the artisan ramen alleys of Shinjuku and historic streets of Asakusa, Tokyo is the ultimate sensory playground.",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    category: "City",
    rating: 4.95,
    reviewCount: 420,
    avgCostPerDay: 135,
    currency: "JPY / USD",
    bestTimeToVisit: "March to May (Sakura) & Oct to Dec",
    weather: { temp: 21, condition: "Partly Cloudy", humidity: "52%" },
    highlights: ["Shibuya Sky Observation Deck", "Senso-ji Temple & Nakamise-dori", "TeamLab Planets Digital Art", "Tsukiji Outer Market Food Tour", "Shinjuku Gyoen National Garden"],
    localEats: ["Tonkotsu Ramen", "A5 Wagyu Sukiyaki", "Fresh Nigiri Sushi", "Matcha Parfait", "Yakitori in Omoide Yokocho"],
    safetyRating: "Extremely Safe (9.8/10)",
    visaRequirement: "Visa-Free for 68+ countries (up to 90 days)"
  },
  {
    _id: "dest-2",
    name: "Amalfi Coast & Positano",
    country: "Italy",
    continent: "Europe",
    tagline: "Pastel cliffside villages over turquoise Mediterranean waters",
    description: "The Amalfi Coast is a 50-kilometer stretch of coastline along the southern edge of Italy’s Sorrentine Peninsula. Featuring sheer cliffs and a rugged shoreline dotted with small beaches and pastel-colored fishing villages.",
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: 40.634, lng: 14.6027 },
    category: "Romantic",
    rating: 4.88,
    reviewCount: 310,
    avgCostPerDay: 220,
    currency: "EUR",
    bestTimeToVisit: "May to September",
    weather: { temp: 26, condition: "Sunny & Warm", humidity: "40%" },
    highlights: ["Path of the Gods Hiking Trail", "Private Boat Tour to Capri & Blue Grotto", "Villa Cimbrone Gardens in Ravello", "Sunset drinks at Franco's Bar"],
    localEats: ["Limoncello di Sorrento", "Scialatielli ai Frutti di Mare", "Neapolitan Wood-fired Pizza", "Delizia al Limone"],
    safetyRating: "Very Safe (9.2/10)",
    visaRequirement: "Schengen Visa / ETIAS"
  },
  {
    _id: "dest-3",
    name: "Bali & Nusa Penida",
    country: "Indonesia",
    continent: "Asia",
    tagline: "Emerald rice terraces, spiritual temples, and surf beaches",
    description: "An Indonesian paradise known for its forested volcanic mountains, iconic rice paddies, beaches, coral reefs, and vibrant yoga and digital nomad culture.",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: -8.4095, lng: 115.1889 },
    category: "Beaches",
    rating: 4.82,
    reviewCount: 512,
    avgCostPerDay: 55,
    currency: "IDR / USD",
    bestTimeToVisit: "April to October (Dry Season)",
    weather: { temp: 29, condition: "Tropical Warm", humidity: "70%" },
    highlights: ["Kelingking Beach Cliff View", "Tegallalang Rice Terraces Ubud", "Uluwatu Sunset Temple & Kecak Dance", "Mount Batur Sunrise Volcano Trek"],
    localEats: ["Nasi Goreng Special", "Babi Guling", "Açaí Smoothie Bowls in Canggu", "Sate Lilit Ayam"],
    safetyRating: "Safe (8.9/10)",
    visaRequirement: "Visa on Arrival (30 Days)"
  },
  {
    _id: "dest-4",
    name: "Swiss Alps & Zermatt",
    country: "Switzerland",
    continent: "Europe",
    tagline: "Glacial peaks, mirror-like lakes, and alpine luxury",
    description: "Home to the pyramid-shaped Matterhorn, the Swiss Alps boast dramatic landscapes, pristine air, world-class skiing, mountain train journeys, and world-renowned alpine cuisine.",
    coverImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: 45.9765, lng: 7.7491 },
    category: "Adventure",
    rating: 4.97,
    reviewCount: 380,
    avgCostPerDay: 260,
    currency: "CHF",
    bestTimeToVisit: "Dec to April (Ski) & June to Sept (Hike)",
    weather: { temp: 14, condition: "Crisp Alpine Breeze", humidity: "35%" },
    highlights: ["Gornergrat Cogwheel Train", "Matterhorn Glacier Paradise", "Lake Stellisee Reflection Hike", "Glacier Express Panoramic Train"],
    localEats: ["Swiss Cheese Fondue", "Crispy Rösti with Fried Egg", "Raclette", "Swiss Chocolate Truffles"],
    safetyRating: "Extremely Safe (9.9/10)",
    visaRequirement: "Schengen Visa"
  },
  {
    _id: "dest-5",
    name: "Reykjavik & South Coast",
    country: "Iceland",
    continent: "Europe",
    tagline: "Land of Fire & Ice, Northern Lights, and thundering waterfalls",
    description: "Iceland's otherworldly landscapes feature roaring geothermal geysers, vast black sand beaches, glowing blue ice caves, and the luminous dance of the Aurora Borealis.",
    coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: 64.1466, lng: -21.9426 },
    category: "Nature",
    rating: 4.92,
    reviewCount: 290,
    avgCostPerDay: 190,
    currency: "ISK",
    bestTimeToVisit: "Sept to March (Auroras) & June to Aug (Midnight Sun)",
    weather: { temp: 8, condition: "Chilly & Clear", humidity: "60%" },
    highlights: ["Blue Lagoon & Sky Lagoon Geothermal Spa", "Reynisfjara Black Sand Beach", "Seljalandsfoss Walk-Behind Waterfall", "Jökulsárlón Glacier Lagoon"],
    localEats: ["Icelandic Lamb Stew (Kjötsúpa)", "Fresh Arctic Char", "Skyr with Bilberries", "Bæjarins Beztu Pylsur Hot Dogs"],
    safetyRating: "Safest Country in the World (10/10)",
    visaRequirement: "Schengen Visa"
  },
  {
    _id: "dest-6",
    name: "Santorini & Oia",
    country: "Greece",
    continent: "Europe",
    tagline: "Iconic blue domes perched above a volcanic Aegean caldera",
    description: "Santorini is one of the Cyclades islands in the Aegean Sea. Devastated by a volcanic eruption in the 16th century BC, its whitewashed, cubiform houses cling to cliffs above an underwater caldera.",
    coverImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: 36.3932, lng: 25.4615 },
    category: "Romantic",
    rating: 4.89,
    reviewCount: 460,
    avgCostPerDay: 175,
    currency: "EUR",
    bestTimeToVisit: "April to November",
    weather: { temp: 25, condition: "Sunny & Gentle Breeze", humidity: "42%" },
    highlights: ["Oia Sunset Lookout", "Catamaran Sunset Cruise with Greek BBQ", "Ancient Akrotiri Ruins", "Red Beach & Perissa Black Sand Beach"],
    localEats: ["Santorini Fava", "Tomatokeftedes (Tomato Fritters)", "Grilled Octopus", "Assyrtiko White Wine"],
    safetyRating: "Very Safe (9.5/10)",
    visaRequirement: "Schengen Visa"
  },
  {
    _id: "dest-7",
    name: "Cape Town & Table Mountain",
    country: "South Africa",
    continent: "Africa",
    tagline: "Where dramatic ocean coasts meet towering flat-top mountains",
    description: "A port city on South Africa’s southwest coast on a peninsula beneath the imposing Table Mountain. Ride cable cars, surf at Muizenberg, taste wines in Stellenbosch, and meet penguins at Boulders Beach.",
    coverImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: -33.9249, lng: 18.4241 },
    category: "Adventure",
    rating: 4.84,
    reviewCount: 220,
    avgCostPerDay: 75,
    currency: "ZAR / USD",
    bestTimeToVisit: "Nov to March",
    weather: { temp: 24, condition: "Breezy & Sunny", humidity: "50%" },
    highlights: ["Table Mountain Cableway & Hike", "Boulders Beach African Penguin Colony", "Cape of Good Hope Coastal Drive", "Kirstenbosch Botanical Gardens Canopy Walk"],
    localEats: ["Bobotie", "Cape Malay Curry", "Braai (South African BBQ)", "Pinotage Wine"],
    safetyRating: "Moderate - Guided tours recommended (8.0/10)",
    visaRequirement: "Visa-Free for 90 days for US/EU/UK"
  },
  {
    _id: "dest-8",
    name: "Kyoto Ancient Temples",
    country: "Japan",
    continent: "Asia",
    tagline: "Centuries-old bamboo groves, geisha districts, and golden pavilions",
    description: "Once the capital of Japan, Kyoto is famous for numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: 35.0116, lng: 135.7681 },
    category: "Culture",
    rating: 4.96,
    reviewCount: 390,
    avgCostPerDay: 110,
    currency: "JPY",
    bestTimeToVisit: "Spring (Sakura) & Autumn (Maple leaves)",
    weather: { temp: 20, condition: "Clear & Pleasant", humidity: "48%" },
    highlights: ["Fushimi Inari 10,000 Torii Gates", "Arashiyama Bamboo Forest", "Kinkaku-ji (Golden Pavilion)", "Gion Geisha District Evening Walk"],
    localEats: ["Kaiseki Multi-course Banquet", "Kyoto Uji Matcha Sweets", "Yudofu (Hot Tofu)", "Kyo-wagashi"],
    safetyRating: "Extremely Safe (9.9/10)",
    visaRequirement: "Visa-Free (90 Days)"
  }
];

export const seedTrips = [
  {
    _id: "trip-101",
    title: "Enchanted Tokyo & Mount Fuji Quest",
    destination: "Tokyo",
    country: "Japan",
    startDate: "2026-10-12",
    endDate: "2026-10-18",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    totalBudget: 2200,
    currency: "USD",
    travelersCount: 2,
    isPublic: true,
    status: "Active",
    userName: "Alex Nomad",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    days: [
      {
        dayNumber: 1,
        date: "2026-10-12",
        title: "Touchdown Tokyo & Shibuya Nightscape",
        activities: [
          {
            _id: "act-1",
            time: "02:30 PM",
            title: "Arrive at Haneda Airport & Pick up JR Pass",
            location: "Haneda Airport Terminal 3",
            cost: 0,
            category: "Transport",
            notes: "Pick up Suica IC Card and pocket WiFi at counter.",
            completed: true,
            coordinates: { lat: 35.5494, lng: 139.7798 }
          },
          {
            _id: "act-2",
            time: "04:30 PM",
            title: "Check in to Cerulean Tower Tokyu Hotel",
            location: "Shibuya, Tokyo",
            cost: 210,
            category: "Hotel",
            notes: "High floor room with view of Mount Fuji.",
            completed: true,
            coordinates: { lat: 35.656, lng: 139.699 }
          },
          {
            _id: "act-3",
            time: "06:30 PM",
            title: "Shibuya Sky 360 Observatory at Golden Hour",
            location: "Shibuya Scramble Square",
            cost: 22,
            category: "Sightseeing",
            notes: "Pre-booked sunset slot. Best 360 photo angles.",
            completed: false,
            coordinates: { lat: 35.659, lng: 139.701 }
          },
          {
            _id: "act-4",
            time: "08:30 PM",
            title: "Ramen Dinner at Ichiran Shibuya",
            location: "Shibuya Center-Gai",
            cost: 16,
            category: "Food",
            notes: "Solo booth ordering with extra pork chashu.",
            completed: false,
            coordinates: { lat: 35.6601, lng: 139.698 }
          }
        ]
      },
      {
        dayNumber: 2,
        date: "2026-10-13",
        title: "Digital Art, Modern Architecture & Ginza",
        activities: [
          {
            _id: "act-5",
            time: "09:00 AM",
            title: "Tsukiji Outer Market Seafood Tasting",
            location: "Tsukiji, Chuo City",
            cost: 35,
            category: "Food",
            notes: "Try the grilled wagyu skewers, tamagoyaki, and sea urchin.",
            completed: false,
            coordinates: { lat: 35.6655, lng: 139.7708 }
          },
          {
            _id: "act-6",
            time: "11:30 AM",
            title: "TeamLab Planets Sensory Experience",
            location: "Toyosu, Tokyo",
            cost: 32,
            category: "Activity",
            notes: "Barefoot digital immersion in crystal light waters.",
            completed: false,
            coordinates: { lat: 35.6489, lng: 139.7899 }
          },
          {
            _id: "act-7",
            time: "03:00 PM",
            title: "Coffee Break at Starbucks Reserve Roastery",
            location: "Nakameguro, Tokyo",
            cost: 18,
            category: "Food",
            notes: "Architect Kengo Kuma designed 4-story roastery along the canal.",
            completed: false,
            coordinates: { lat: 35.6482, lng: 139.6931 }
          }
        ]
      }
    ],
    packingList: [
      { item: "Universal Travel Plug Adapter (Type A/B)", category: "Electronics", isPacked: true },
      { item: "Power Bank 20,000mAh", category: "Electronics", isPacked: true },
      { item: "Physical Passport & Flight Boarding Passes", category: "Documents", isPacked: true },
      { item: "Comfortable Walking Shoes (15k+ steps/day)", category: "Clothing", isPacked: true },
      { item: "Lightweight Rain Jacket", category: "Clothing", isPacked: false },
      { item: "Pocket Yen Cash ($200 USD equivalent)", category: "Essentials", isPacked: false }
    ],
    notes: "Download Japan Travel by NAVITIME app for real-time subway routing."
  },
  {
    _id: "trip-102",
    title: "Amalfi Coastline & Sunset Sailing",
    destination: "Amalfi Coast & Positano",
    country: "Italy",
    startDate: "2026-09-04",
    endDate: "2026-09-10",
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    totalBudget: 3100,
    currency: "USD",
    travelersCount: 4,
    isPublic: true,
    status: "Planning",
    userName: "Elena Rossi",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    days: [
      {
        dayNumber: 1,
        date: "2026-09-04",
        title: "Arrive in Naples & Scenic Cliffside Drive to Positano",
        activities: [
          {
            _id: "act-8",
            time: "11:00 AM",
            title: "Private Mercedes Van Transfer to Positano",
            location: "Naples International Airport",
            cost: 140,
            category: "Transport",
            notes: "Stop at panoramic cliff viewpoint for espresso.",
            completed: false,
            coordinates: { lat: 40.886, lng: 14.2908 }
          },
          {
            _id: "act-9",
            time: "06:00 PM",
            title: "Aperitivo at Franco's Bar Positano",
            location: "Via Cristoforo Colombo, Positano",
            cost: 45,
            category: "Nightlife",
            notes: "Iconic yellow ceramic bar looking over the pastel village.",
            completed: false,
            coordinates: { lat: 40.6281, lng: 14.485 }
          }
        ]
      }
    ],
    packingList: [
      { item: "Polarized Sunglasses & Sun Hat", category: "Essentials", isPacked: true },
      { item: "Linen Shirts & Resort Wear", category: "Clothing", isPacked: false },
      { item: "Waterproof Phone Pouch for Boat Tour", category: "Electronics", isPacked: true }
    ],
    notes: "Reserve dinner at Chez Black 3 weeks in advance."
  }
];

export const seedBookings = [
  {
    _id: "book-1",
    bookingType: "Flight",
    title: "Flight NH107: SFO -> HND (Tokyo Haneda)",
    provider: "All Nippon Airways (ANA)",
    referenceCode: "ANA-892482",
    date: "2026-10-12",
    time: "11:20 AM Departure",
    origin: "San Francisco (SFO)",
    destination: "Tokyo Haneda (HND)",
    passengerName: "Alex Nomad",
    seatOrRoom: "22K (Window)",
    price: 940,
    currency: "USD",
    status: "Confirmed",
    gateOrAddress: "International Terminal - Gate G98",
    qrData: "WAYFARE-FLIGHT-ANA-892482-ALEX-NOMAD-SFO-HND",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "book-2",
    bookingType: "Hotel",
    title: "Cerulean Tower Tokyu Hotel - Executive Suite",
    provider: "Tokyu Hotels Group",
    referenceCode: "HTL-TOK-4419",
    date: "2026-10-12 to 2026-10-18 (6 Nights)",
    time: "Check-in: 03:00 PM",
    origin: "Shibuya Scramble",
    destination: "26-1 Sakuragaokacho, Shibuya City, Tokyo",
    passengerName: "Alex Nomad + 1 Guest",
    seatOrRoom: "Room 3402 (Sky View)",
    price: 1260,
    currency: "USD",
    status: "Confirmed",
    gateOrAddress: "Shibuya Station South Exit (5 min walk)",
    qrData: "WAYFARE-HOTEL-HTL-TOK-4419-ALEX-NOMAD",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "book-3",
    bookingType: "Tour",
    title: "Mount Fuji & Lake Kawaguchiko Private Day Expedition",
    provider: "Fuji Alpine Guides",
    referenceCode: "EXP-FUJI-771",
    date: "2026-10-15",
    time: "07:30 AM",
    origin: "Tokyo Hotel Pickup",
    destination: "Mount Fuji 5th Station & Chureito Pagoda",
    passengerName: "Alex Nomad & Party",
    seatOrRoom: "Private Luxury Alphard Van",
    price: 240,
    currency: "USD",
    status: "Confirmed",
    gateOrAddress: "Hotel Lobby Concierge",
    qrData: "WAYFARE-TOUR-EXP-FUJI-771-ALEX-NOMAD",
    image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80"
  }
];

export const seedExpenses = [
  {
    _id: "exp-1",
    title: "Airbnb Cliffside Villa in Positano",
    amount: 1200,
    currency: "USD",
    category: "Accommodation",
    paidBy: "Alex",
    splitBetween: ["Alex", "Elena", "Marcus", "Sora"],
    date: "2026-09-04",
    notes: "3-night deposit for 4 people."
  },
  {
    _id: "exp-2",
    title: "Private Speedboat Tour to Capri & Grotto",
    amount: 480,
    currency: "USD",
    category: "Activities",
    paidBy: "Elena",
    splitBetween: ["Alex", "Elena", "Marcus", "Sora"],
    date: "2026-09-05",
    notes: "Includes Prosecco and skipper."
  },
  {
    _id: "exp-3",
    title: "Seafood Feast at Ristorante Da Adolfo",
    amount: 280,
    currency: "USD",
    category: "Food",
    paidBy: "Marcus",
    splitBetween: ["Alex", "Elena", "Marcus", "Sora"],
    date: "2026-09-06",
    notes: "Fresh mussels, pasta, and house wine."
  },
  {
    _id: "exp-4",
    title: "Rental Car & Amalfi Coast Fuel",
    amount: 190,
    currency: "USD",
    category: "Transport",
    paidBy: "Sora",
    splitBetween: ["Alex", "Elena", "Marcus", "Sora"],
    date: "2026-09-07",
    notes: "Fiat 500 convertible hire."
  }
];

export const seedPosts = [
  {
    _id: "post-1",
    authorName: "Maya Lin",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    authorHandle: "@mayatravels",
    destination: "Tokyo, Japan",
    country: "Japan",
    title: "Secret Hidden Alleyways & Coffee Gems in Yanaka Ginza",
    content: "If you're visiting Tokyo, skip the crowded Shibuya crossing for one morning and wander through Yanaka. It's one of the few districts that survived WW2 intact. Grab a pour-over at Kayaba Coffee (built in a 1916 wooden townhouse) and pet the local cats along the street!",
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
    ],
    tripDuration: "7 Days",
    budgetSpent: "$1,450",
    tags: ["Tokyo", "HiddenGems", "JapanFood", "Photography"],
    likes: 342,
    savedBy: ["user-1"],
    comments: [
      {
        userName: "Leo Carter",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        content: "Adding Kayaba Coffee to my October itinerary right now! Thanks Maya!",
        createdAt: "2026-08-20T10:14:00Z"
      },
      {
        userName: "Sara Croft",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        content: "Yanaka Cemetery during cherry blossom season is magical too.",
        createdAt: "2026-08-21T14:32:00Z"
      }
    ]
  },
  {
    _id: "post-2",
    authorName: "Lucas Vance",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    authorHandle: "@lucasvance",
    destination: "Swiss Alps, Switzerland",
    country: "Switzerland",
    title: "Hiking the 5-Lakes Walk in Zermatt — Pure Magic",
    content: "The Matterhorn reflected in Lake Stellisee is something straight out of a dream. Start the trail early from Sunnegga station to beat the midday wind when the water turns into a crystal mirror. Bring a thermos of hot cocoa!",
    images: [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80"
    ],
    tripDuration: "4 Days",
    budgetSpent: "$890",
    tags: ["SwissAlps", "Matterhorn", "Hiking", "Alpine"],
    likes: 518,
    savedBy: ["user-1", "user-2"],
    comments: [
      {
        userName: "Elena Rossi",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        content: "That reflection shot is award-winning. What camera setup did you use?",
        createdAt: "2026-08-22T08:10:00Z"
      }
    ]
  }
];

export const demoUser = {
  _id: "user-demo-1",
  name: "Alex Nomad",
  email: "alex@wayfare.travel",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  bio: "Solo backpacker & landscape photographer. 24 countries and counting.",
  homeCountry: "United States",
  currency: "USD",
  travelStyle: ["Adventure", "Photography", "Local Food", "Culture"],
  passportStats: {
    countriesVisited: 14,
    tripsCompleted: 21,
    totalMiles: 48900,
    badges: ["Globe Trotter", "Alpine Trekker", "Budget Ninja", "Foodie Master", "Island Hopper"]
  },
  savedDestinations: ["dest-1", "dest-2", "dest-4"]
};
