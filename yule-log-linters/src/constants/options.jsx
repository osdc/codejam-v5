export const SelectTravelersList = [
    {
      id: 1,
      title: 'Just Me',
      desc: 'Solo travel in exploration',
      icon: '🧍‍♂️',
      people: '1 person',
    },
    {
      id: 2,
      title: 'A Couple',
      desc: 'Two people traveling together',
      icon: '❤️',
      people: '2 persons',
    },
    {
      id: 3,
      title: 'Family',
      desc: 'A family of 3 or more',
      icon: '👨‍👩‍👧‍👦',
      people: '3 to 5 persons',
    },
    {
      id: 4,
      title: 'Friends',
      desc: 'A group of friends',
      icon: '👫👬👭',
      people: '5 to 10 persons',
    },
  ];
  
  export const SelectBudgetOptions = [
    {
      id: 1,
      title: 'Cheap',
      desc: 'Stay in budget-friendly accommodations',
      // icon: '💸',
    },
    {
      id: 2,
      title: 'Moderate',
      desc: 'Keep costs on the average side',
      // icon: '💵',
    },
    {
      id: 3,
      title: 'Luxury',
      desc: 'Do not worry about the cost',
      // icon: '💎',
    },
  ];

  export const SelectModeOfTransport = [
    {
      id: 1,
      title: 'Walking',
      desc: 'I will love to walk on streets and explore nearby attractions on foot.',
    },
    
    {
      id: 2,
      title: 'Public Transport',
      desc: 'I want to use publicly available transport options like buses or trains for affordability and convenience.',
    },
    
    {
      id: 3,
      title: 'Taxi',
      desc: 'I prefer to use taxis for comfort and direct travel to my destinations.',
    },
  ];
  
  export const AI_PROMPT = 'Generate a comprehensive travel plan for a trip to **{location}** for **{totalDays}** Days for **{travelers}** with a **{budget}** budget. Include the following details : 1. **Hotel Options**: - A list of 3-5 hotel options with - Hotel Name - Hotel Address- Price per night- Hotel Image URL - Geo-coordinates (latitude and longitude) - Rating (out of 5 - Description - Amenities (e.g., Wi-Fi, pool, etc.) 2. **Daily Itinerary**: - For each day: - Place Name - Place Details (brief description of the attraction) - Place Image URL - Geo-coordinates (latitude and longitude) - Tickets Pricing (if applicable) - Rating (out of 5) - Best Time to Visit - Time to Spend at the Place 3. **Transportation Options**: - Using **{modeOfTransport}**  moving between locations (e.g., walking, public transport, taxi). - Estimated travel costs for each day. 4. **Activity Preferences**: - Include suggestions for:  - Adventure activities  - Relaxation spots - Cultural landmarks - Shopping areas (if applicable) 7. **Additional Recommendations**: - Tips for local customs, must-try experiences, and safety precautions,  in JSON format only.';
