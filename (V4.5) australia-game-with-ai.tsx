import { useState, useEffect, useCallback, useMemo, useReducer, useRef, ChangeEvent } from 'react';

// =========================================
// GAME DATA AND CONSTANTS
// =========================================

// Game regions with enhanced data
const REGIONS = {
  QLD: { 
    name: "Queensland", 
    color: "#f4a261", 
    challenges: [
      {name: "Surf at Gold Coast", difficulty: 1, reward: 1.8, type: "physical"}, 
      {name: "Feed kangaroos", difficulty: 1, reward: 1.5, type: "wildlife"}, 
      {name: "Tour Great Barrier Reef", difficulty: 2, reward: 2.5, type: "educational"},
      {name: "Explore Daintree Rainforest", difficulty: 3, reward: 3.0, type: "physical"}
    ], 
    position: {x: 80, y: 35},
    description: "Known for its beautiful beaches and the Great Barrier Reef.",
    funFact: "Queensland is home to the world's largest sand island, Fraser Island."
  },
  NSW: { 
    name: "New South Wales", 
    color: "#e76f51", 
    challenges: [
      {name: "Visit Sydney Opera House", difficulty: 1, reward: 1.5, type: "educational"}, 
      {name: "Make a rock carving", difficulty: 2, reward: 2.0, type: "social"}, 
      {name: "Tour the Blue Mountains", difficulty: 2, reward: 2.2, type: "physical"},
      {name: "Surf at Bondi Beach", difficulty: 1, reward: 1.6, type: "physical"}
    ], 
    position: {x: 80, y: 65},
    description: "Home to Sydney, Australia's most populous city.",
    funFact: "The Sydney Harbour Bridge is nicknamed 'The Coathanger' due to its arch-based design."
  },
  VIC: { 
    name: "Victoria", 
    color: "#264653", 
    challenges: [
      {name: "Tour Great Ocean Road", difficulty: 2, reward: 2.0, type: "educational"}, 
      {name: "Visit Melbourne Museum", difficulty: 1, reward: 1.5, type: "educational"}, 
      {name: "Wine tasting tour", difficulty: 1, reward: 1.7, type: "social"},
      {name: "Explore Grampians National Park", difficulty: 3, reward: 2.8, type: "physical"}
    ], 
    position: {x: 65, y: 85},
    description: "Known for Melbourne, coffee culture and the Great Ocean Road.",
    funFact: "Melbourne has the largest tram system outside of Europe."
  },
  TAS: { 
    name: "Tasmania", 
    color: "#2a9d8f", 
    challenges: [
      {name: "Hike Cradle Mountain", difficulty: 3, reward: 2.7, type: "physical"}, 
      {name: "Visit Port Arthur", difficulty: 1, reward: 1.5, type: "educational"}, 
      {name: "Spot Tasmanian Devils", difficulty: 2, reward: 2.2, type: "wildlife"},
      {name: "Tour MONA Art Museum", difficulty: 1, reward: 1.6, type: "educational"}
    ], 
    position: {x: 75, y: 100},
    description: "An island state with pristine wilderness and unique wildlife.",
    funFact: "Tasmania has the cleanest air in the world, as measured at Cape Grim."
  },
  SA: { 
    name: "South Australia", 
    color: "#e9c46a", 
    challenges: [
      {name: "Wine tour in Barossa Valley", difficulty: 1, reward: 1.7, type: "social"}, 
      {name: "Explore Adelaide Central Market", difficulty: 1, reward: 1.4, type: "social"}, 
      {name: "Visit Kangaroo Island", difficulty: 2, reward: 2.1, type: "wildlife"},
      {name: "Dive with Great White Sharks", difficulty: 3, reward: 3.2, type: "wildlife"}
    ], 
    position: {x: 45, y: 75},
    description: "Famous for its wine regions and festivals.",
    funFact: "South Australia is home to the world's largest collection of opals."
  },
  WA: { 
    name: "Western Australia", 
    color: "#f4a261", 
    challenges: [
      {name: "Explore Pinnacles Desert", difficulty: 2, reward: 2.0, type: "physical"}, 
      {name: "Swim with whale sharks", difficulty: 3, reward: 3.0, type: "wildlife"}, 
      {name: "Tour Margaret River", difficulty: 1, reward: 1.6, type: "educational"},
      {name: "Visit the pink Lake Hillier", difficulty: 2, reward: 2.3, type: "educational"}
    ], 
    position: {x: 15, y: 55},
    description: "The largest state, known for vast deserts and beautiful coastline.",
    funFact: "Western Australia is so large that if it were a country, it would be the 10th largest in the world."
  },
  NT: { 
    name: "Northern Territory", 
    color: "#e76f51", 
    challenges: [
      {name: "Visit Uluru", difficulty: 2, reward: 2.2, type: "educational"}, 
      {name: "Crocodile spotting", difficulty: 2, reward: 2.0, type: "wildlife"}, 
      {name: "Explore Kakadu National Park", difficulty: 2, reward: 2.1, type: "physical"},
      {name: "Swim at Florence Falls", difficulty: 1, reward: 1.7, type: "physical"}
    ], 
    position: {x: 45, y: 35},
    description: "Home to iconic landmarks like Uluru and tropical national parks.",
    funFact: "Uluru is estimated to be around 600 million years old."
  },
  ACT: { 
    name: "Australian Capital Territory", 
    color: "#264653", 
    challenges: [
      {name: "Tour Parliament House", difficulty: 1, reward: 1.4, type: "educational"}, 
      {name: "Visit Australian War Memorial", difficulty: 1, reward: 1.5, type: "educational"}, 
      {name: "Explore Tidbinbilla Nature Reserve", difficulty: 2, reward: 1.9, type: "wildlife"},
      {name: "Hot air ballooning over Canberra", difficulty: 2, reward: 2.1, type: "social"}
    ], 
    position: {x: 75, y: 70},
    description: "Australia's capital territory, home to Canberra.",
    funFact: "Canberra was created as a compromise when Sydney and Melbourne both wanted to be the capital city."
  },
};

// Adjacent regions for travel logic
const ADJACENT_REGIONS = {
  QLD: ["NSW", "NT"],
  NSW: ["QLD", "VIC", "SA", "ACT"],
  VIC: ["NSW", "SA"],
  TAS: [], // Island
  SA: ["NSW", "VIC", "NT", "WA"],
  WA: ["NT", "SA"],
  NT: ["QLD", "SA", "WA"],
  ACT: ["NSW"],
};

// Regional resources with their types for AI decision making
const REGIONAL_RESOURCES = {
  QLD: ["Coral", "Tropical Fruit", "Sugar Cane"],
  NSW: ["Opals", "Wine", "Coal"],
  VIC: ["Dairy", "Wool", "Wheat"],
  TAS: ["Timber", "Seafood", "Hydropower"],
  SA: ["Uranium", "Opals", "Wine"],
  WA: ["Iron Ore", "Gold", "Natural Gas"],
  NT: ["Crocodile Leather", "Aboriginal Art", "Uranium"],
  ACT: ["Government Grants", "Research Funds", "Education"]
};

// Resource categories for AI strategy
const RESOURCE_CATEGORIES = {
  "Coral": "luxury",
  "Tropical Fruit": "food",
  "Sugar Cane": "agricultural",
  "Opals": "luxury", 
  "Wine": "luxury",
  "Coal": "industrial",
  "Dairy": "food",
  "Wool": "agricultural",
  "Wheat": "agricultural",
  "Timber": "industrial",
  "Seafood": "food",
  "Hydropower": "energy",
  "Uranium": "energy",
  "Iron Ore": "industrial",
  "Gold": "luxury",
  "Natural Gas": "energy",
  "Crocodile Leather": "luxury",
  "Aboriginal Art": "luxury",
  "Government Grants": "financial",
  "Research Funds": "financial",
  "Education": "service"
};

// Regional investments for passive income (disabled by default in settings)
const REGIONAL_INVESTMENTS = {
  QLD: { name: "Surf School", cost: 2500, dailyIncome: 130 },
  NSW: { name: "Harbor Apartments", cost: 3200, dailyIncome: 170 },
  VIC: { name: "Laneway Cafe", cost: 2800, dailyIncome: 150 },
  TAS: { name: "Eco Lodge", cost: 2300, dailyIncome: 120 },
  SA: { name: "Winery", cost: 2600, dailyIncome: 140 },
  WA: { name: "Mining Outpost", cost: 3400, dailyIncome: 190 },
  NT: { name: "Outback Station", cost: 2200, dailyIncome: 115 },
  ACT: { name: "Research Lab", cost: 3000, dailyIncome: 160 }
};

const EQUIPMENT_SHOP_REGIONS = ["NSW", "VIC"];

const SHOP_ITEMS = [
  {
    id: "hiking_boots",
    name: "Hiking Boots",
    description: "Reduce travel costs by 20%",
    cost: 1600,
    effects: { travelDiscount: 0.2 },
    tags: ["travel"]
  },
  {
    id: "smart_watch",
    name: "Smart Watch",
    description: "Gain 20% more XP from challenges",
    cost: 1800,
    effects: { xpBonus: 0.2 },
    tags: ["xp"]
  },
  {
    id: "surfboard",
    name: "Surfboard",
    description: "+12% success chance on physical challenges",
    cost: 1500,
    effects: { challengeBonus: { physical: 0.12 } },
    tags: ["challenge"]
  },
  {
    id: "outback_map",
    name: "Outback Map",
    description: "Reduce travel costs by 15%",
    cost: 1400,
    effects: { travelDiscount: 0.15 },
    tags: ["travel"]
  },
  {
    id: "field_journal",
    name: "Field Journal",
    description: "Gain 15% more XP from challenges",
    cost: 1700,
    effects: { xpBonus: 0.15 },
    tags: ["xp"]
  },
  {
    id: "wildlife_lens",
    name: "Wildlife Lens",
    description: "+14% success chance on wildlife challenges",
    cost: 1500,
    effects: { challengeBonus: { wildlife: 0.14 } },
    tags: ["challenge"]
  },
  {
    id: "diplomats_badge",
    name: "Diplomat's Badge",
    description: "+12% success chance on social challenges",
    cost: 1450,
    effects: { challengeBonus: { social: 0.12 } },
    tags: ["challenge"]
  },
  {
    id: "study_atlas",
    name: "Study Atlas",
    description: "+12% success chance on educational challenges",
    cost: 1450,
    effects: { challengeBonus: { educational: 0.12 } },
    tags: ["challenge"]
  }
];

const SABOTAGE_ACTIONS = [
  {
    id: "customs_hold",
    name: "Customs Hold",
    description: "Freeze opponent travel for 1 turn",
    cost: 900,
    duration: 1,
    aiWeight: 130
  },
  {
    id: "border_lockdown",
    name: "Border Lockdown",
    description: "Freeze opponent travel for 2 turns",
    cost: 1400,
    duration: 2,
    aiWeight: 150
  },
  {
    id: "rumors",
    name: "Rumors",
    description: "Opponent sells for 20% less for 1 day",
    cost: 700,
    duration: 1,
    aiWeight: 105
  },
  {
    id: "market_panic",
    name: "Market Panic",
    description: "Opponent sells for 35% less for 1 day",
    cost: 1200,
    duration: 1,
    aiWeight: 120
  },
  {
    id: "challenge_jitters",
    name: "Challenge Jitters",
    description: "Opponent has -12% success chance for 2 days",
    cost: 1100,
    duration: 2,
    aiWeight: 125
  },
  {
    id: "gear_jam",
    name: "Gear Jam",
    description: "Disable opponent equipment bonuses for 2 days",
    cost: 1000,
    duration: 2,
    aiWeight: 115
  }
];

// Crafting Recipes - Combine resources into high-value items
const CRAFTING_RECIPES = [
  {
    id: "opal_jewelry",
    name: "Opal Jewelry",
    inputs: { "Gold": 1, "Opals": 2 },
    output: "Opal Jewelry",
    baseValue: 800,
    craftTime: 1,
    category: "luxury",
    description: "Stunning handcrafted Australian jewelry",
    emoji: "💎"
  },
  {
    id: "croc_bag",
    name: "Designer Crocodile Bag",
    inputs: { "Crocodile Leather": 2, "Aboriginal Art": 1 },
    output: "Designer Bag",
    baseValue: 950,
    craftTime: 1,
    category: "luxury",
    description: "Exclusive designer bag made from Australian materials",
    emoji: "👜"
  },
  {
    id: "gourmet_box",
    name: "Gourmet Gift Box",
    inputs: { "Wine": 2, "Seafood": 1, "Dairy": 1 },
    output: "Gourmet Box",
    baseValue: 600,
    craftTime: 1,
    category: "food",
    description: "Premium Australian food and wine collection",
    emoji: "🎁"
  },
  {
    id: "tourist_package",
    name: "Tourist Experience Package",
    inputs: { "Coral": 1, "Tropical Fruit": 2 },
    output: "Tourist Package",
    baseValue: 450,
    craftTime: 1,
    category: "tourism",
    description: "Complete Queensland experience bundle",
    emoji: "🏖️"
  },
  {
    id: "steel_ingots",
    name: "Steel Ingots",
    inputs: { "Iron Ore": 3, "Coal": 2 },
    output: "Steel",
    baseValue: 700,
    craftTime: 1,
    category: "industrial",
    description: "High-grade processed steel",
    emoji: "🔩"
  },
  {
    id: "furniture",
    name: "Premium Furniture",
    inputs: { "Timber": 3, "Wool": 1 },
    output: "Furniture Set",
    baseValue: 550,
    craftTime: 1,
    category: "goods",
    description: "Handcrafted Australian furniture",
    emoji: "🪑"
  },
  {
    id: "energy_cell",
    name: "Hydroelectric Battery",
    inputs: { "Uranium": 1, "Hydropower": 2, "Natural Gas": 1 },
    output: "Energy Cell",
    baseValue: 1100,
    craftTime: 2,
    category: "energy",
    description: "Advanced renewable energy storage",
    emoji: "🔋"
  },
  {
    id: "wool_textiles",
    name: "Wool Textiles",
    inputs: { "Wool": 3, "Dairy": 1 },
    output: "Wool Textiles",
    baseValue: 420,
    craftTime: 1,
    category: "goods",
    description: "Premium Australian wool products",
    emoji: "🧶"
  }
];

// Loan System Options - Multiple tiers with different rates
const LOAN_OPTIONS = [
  {
    id: "micro",
    name: "Micro Loan",
    amount: 200,
    dailyInterest: 0.05,
    maxActive: 5,
    requirement: "None",
    description: "Small emergency loan with standard rates",
    emoji: "💵"
  },
  {
    id: "standard",
    name: "Standard Loan",
    amount: 500,
    dailyInterest: 0.08,
    maxActive: 3,
    requirement: "None",
    description: "Medium loan for expansion",
    emoji: "💰"
  },
  {
    id: "business",
    name: "Business Loan",
    amount: 1500,
    dailyInterest: 0.12,
    maxActive: 2,
    requirement: "Level 3+",
    description: "Large loan for serious investments",
    emoji: "🏢"
  },
  {
    id: "investor",
    name: "Investor Backing",
    amount: 3000,
    dailyInterest: 0.15,
    maxActive: 1,
    requirement: "Level 5+ and Net Worth $5000+",
    description: "Massive loan for experienced players",
    emoji: "🎩"
  }
];

const AI_SAFETY_BUFFER = 600;
const SABOTAGE_RUMORS_MULTIPLIER = 0.8;
const SABOTAGE_MARKET_PANIC_MULTIPLIER = 0.65;
const SABOTAGE_CHALLENGE_PENALTY = 0.12;
const SABOTAGE_ICON = "!";

const getDebuffDisplayName = (type: string) => {
  const action = SABOTAGE_ACTIONS.find(candidate => candidate.id === type);
  if (action) return action.name;
  return type.replace(/_/g, ' ');
};

const getEquipmentEffects = (equipment: string[] = []) => {
  const effects = {
    travelDiscount: 0,
    xpBonus: 0,
    challengeBonus: {} as Record<string, number>
  };

  equipment.forEach(itemId => {
    const item = SHOP_ITEMS.find(candidate => candidate.id === itemId);
    if (!item) return;
    if (item.effects?.travelDiscount) {
      effects.travelDiscount += item.effects.travelDiscount;
    }
    if (item.effects?.xpBonus) {
      effects.xpBonus += item.effects.xpBonus;
    }
    if (item.effects?.challengeBonus) {
      Object.entries(item.effects.challengeBonus).forEach(([type, bonus]) => {
        effects.challengeBonus[type] = (effects.challengeBonus[type] || 0) + bonus;
      });
    }
  });

  effects.travelDiscount = Math.min(0.5, effects.travelDiscount);
  effects.xpBonus = Math.min(0.5, effects.xpBonus);
  return effects;
};

const hasActiveDebuff = (debuffs: Array<{ type: string; remainingDays: number }> | undefined, type: string) => {
  if (!Array.isArray(debuffs)) return false;
  return debuffs.some(debuff => debuff.type === type && debuff.remainingDays > 0);
};

// Crafting helper functions
const canCraft = (recipe: typeof CRAFTING_RECIPES[0], inventory: string[]) => {
  return Object.entries(recipe.inputs).every(([resource, required]) => {
    const count = inventory.filter(item => item === resource).length;
    return count >= required;
  });
};

const getCraftableRecipes = (inventory: string[]) => {
  return CRAFTING_RECIPES.filter(recipe => canCraft(recipe, inventory));
};

const removeRecipeInputs = (inventory: string[], recipe: typeof CRAFTING_RECIPES[0]) => {
  const newInventory = [...inventory];
  Object.entries(recipe.inputs).forEach(([resource, required]) => {
    for (let i = 0; i < required; i++) {
      const index = newInventory.indexOf(resource);
      if (index > -1) {
        newInventory.splice(index, 1);
      }
    }
  });
  return newInventory;
};

const calculateCraftValue = (recipe: typeof CRAFTING_RECIPES[0], character: any, masteryUnlocks: string[]) => {
  let value = recipe.baseValue;

  // Character bonuses
  if (character.name === "Businessman") {
    value = Math.floor(value * 1.2); // Crafted items sell for 20% more
  }
  if (character.name === "Scientist") {
    value = Math.floor(value * 1.15); // Better crafting quality
  }

  // Mastery bonuses
  if (masteryUnlocks.includes("Craftmaster")) {
    value = Math.floor(value * 1.25);
  }

  return value;
};

// Validate loan eligibility for AI (standalone version that doesn't depend on player state)
const canTakeLoanForAI = (
  loanOption: typeof LOAN_OPTIONS[0],
  aiLoans: Array<{ loanType: string; amount: number; accrued: number; interestRate: number }>,
  aiCreditScore: number,
  aiLevel: number,
  aiNetWorth: number
) => {
  // Check active loans of this type
  const activeLoansOfType = aiLoans.filter(loan => loan.loanType === loanOption.id).length;
  if (activeLoansOfType >= loanOption.maxActive) {
    return { canTake: false, reason: `Maximum ${loanOption.maxActive} ${loanOption.name}s active` };
  }

  // Check level requirement for Business/Investor loans
  if (loanOption.id === 'business' && aiLevel < 3) {
    return { canTake: false, reason: 'Requires Level 3+' };
  }
  if (loanOption.id === 'investor') {
    if (aiLevel < 5) {
      return { canTake: false, reason: 'Requires Level 5+' };
    }
    if (aiNetWorth < 5000) {
      return { canTake: false, reason: 'Requires Net Worth $5000+' };
    }
  }

  return { canTake: true, reason: '' };
};

const isTravelBlocked = (debuffs: Array<{ type: string; remainingDays: number }> | undefined) => {
  return hasActiveDebuff(debuffs, 'customs_hold') || hasActiveDebuff(debuffs, 'border_lockdown');
};

const getSabotageSellMultiplier = (debuffs: Array<{ type: string; remainingDays: number }> | undefined) => {
  if (hasActiveDebuff(debuffs, 'market_panic')) return SABOTAGE_MARKET_PANIC_MULTIPLIER;
  if (hasActiveDebuff(debuffs, 'rumors')) return SABOTAGE_RUMORS_MULTIPLIER;
  return 1;
};

const getSabotageChallengePenalty = (debuffs: Array<{ type: string; remainingDays: number }> | undefined) => {
  return hasActiveDebuff(debuffs, 'challenge_jitters') ? SABOTAGE_CHALLENGE_PENALTY : 0;
};

const isEquipmentJammed = (debuffs: Array<{ type: string; remainingDays: number }> | undefined) => {
  return hasActiveDebuff(debuffs, 'gear_jam');
};

const tickDebuffs = (debuffs: Debuff[] = []) => {
  return debuffs
    .map(debuff => ({ ...debuff, remainingDays: debuff.remainingDays - 1 }))
    .filter(debuff => debuff.remainingDays > 0);
};

const upsertDebuff = (debuffs: Debuff[] = [], type: string, duration: number) => {
  const normalized = debuffs.filter(debuff => debuff.remainingDays > 0);
  const existing = normalized.find(debuff => debuff.type === type);
  if (existing) {
    return normalized.map(debuff =>
      debuff.type === type ? { ...debuff, remainingDays: Math.max(debuff.remainingDays, duration) } : debuff
    );
  }
  return [...normalized, { type, remainingDays: duration }];
};

// Weather effects on gameplay
const WEATHER_EFFECTS = {
  "Sunny": {
    challengeModifier: { physical: 0.05, wildlife: 0.05, social: 0.1, educational: 0 },
    travelCostModifier: 1.0,
    resourceBonus: 0,
    description: "Perfect weather for outdoor activities"
  },
  "Cloudy": {
    challengeModifier: { physical: 0, wildlife: 0, social: 0, educational: 0.05 },
    travelCostModifier: 1.0,
    resourceBonus: 0,
    description: "Mild conditions, good for indoor activities"
  },
  "Rainy": {
    challengeModifier: { physical: -0.1, wildlife: -0.05, social: -0.05, educational: 0.1 },
    travelCostModifier: 1.15,
    resourceBonus: 0.1,
    description: "Slippery conditions, but great for museums"
  },
  "Stormy": {
    challengeModifier: { physical: -0.2, wildlife: -0.15, social: -0.1, educational: 0.05 },
    travelCostModifier: 1.3,
    resourceBonus: 0.15,
    description: "Dangerous conditions, higher travel costs"
  }
};

// Season effects on gameplay
const SEASON_EFFECTS = {
  "Summer": {
    challengeModifier: { physical: 0.1, wildlife: 0.05, social: 0.1, educational: -0.05 },
    travelCostModifier: 1.1,
    resourcePriceModifier: { food: 0.9, luxury: 1.1 },
    bonusResourceChance: 0.1,
    description: "Hot weather, beach activities thrive"
  },
  "Autumn": {
    challengeModifier: { physical: 0, wildlife: 0, social: 0.05, educational: 0.05 },
    travelCostModifier: 1.0,
    resourcePriceModifier: { agricultural: 1.2, food: 1.1 },
    bonusResourceChance: 0.15,
    description: "Harvest season, stable conditions"
  },
  "Winter": {
    challengeModifier: { physical: -0.1, wildlife: -0.1, social: 0, educational: 0.1 },
    travelCostModifier: 1.2,
    resourcePriceModifier: { energy: 1.3, industrial: 1.1 },
    bonusResourceChance: 0.05,
    description: "Cold weather, some regions harder to reach"
  },
  "Spring": {
    challengeModifier: { physical: 0.05, wildlife: 0.15, social: 0.05, educational: 0 },
    travelCostModifier: 0.9,
    resourcePriceModifier: { luxury: 0.95, agricultural: 0.9 },
    bonusResourceChance: 0.25,
    description: "Wildlife active, bonus resources more common"
  }
};

// Dynamic regional events
const REGIONAL_EVENTS = [
  { id: "mining_boom", name: "Mining Boom", region: "WA", duration: 3, effect: { resourcePrice: { "Gold": 1.5, "Iron Ore": 1.3 } }, description: "Gold rush in Western Australia!" },
  { id: "coral_bleaching", name: "Coral Bleaching", region: "QLD", duration: 2, effect: { resourcePrice: { "Coral": 1.8 }, resourceRarity: { "Coral": 0.5 } }, description: "Coral becomes rare but valuable" },
  { id: "wine_festival", name: "Wine Festival", region: "VIC", duration: 2, effect: { challengeBonus: { social: 0.15 }, resourcePrice: { "Wine": 1.4 } }, description: "Festival in Victoria boosts social events" },
  { id: "tech_conference", name: "Tech Conference", region: "ACT", duration: 2, effect: { challengeBonus: { educational: 0.2 }, resourcePrice: { "Research Funds": 1.5 } }, description: "Educational challenges easier in Canberra" },
  { id: "outback_drought", name: "Outback Drought", region: "NT", duration: 3, effect: { travelCost: 1.4, resourcePrice: { "Aboriginal Art": 1.6 } }, description: "Harsh conditions in the outback" },
  { id: "seafood_boom", name: "Seafood Boom", region: "TAS", duration: 2, effect: { resourcePrice: { "Seafood": 1.5, "Timber": 1.2 } }, description: "Tasmania's seafood in high demand" },
  { id: "tourism_surge", name: "Tourism Surge", region: "NSW", duration: 2, effect: { challengeBonus: { physical: 0.1, social: 0.1 } }, description: "Sydney sees tourist influx" },
  { id: "energy_crisis", name: "Energy Crisis", region: "SA", duration: 3, effect: { resourcePrice: { "Uranium": 1.7, "Natural Gas": 1.4 } }, description: "Energy resources in high demand" }
];

// AI mood states based on performance
const AI_MOOD_STATES = {
  confident: { emoji: "😎", tauntChance: 0.4, riskModifier: 1.2, messages: ["I'm crushing it!", "Can't stop me now!", "Too easy!"] },
  neutral: { emoji: "🤖", tauntChance: 0.1, riskModifier: 1.0, messages: ["Calculating...", "Interesting move.", "Noted."] },
  desperate: { emoji: "😰", tauntChance: 0.05, riskModifier: 0.7, messages: ["Need to catch up!", "This isn't over!", "Time to take risks..."] },
  aggressive: { emoji: "😤", tauntChance: 0.3, riskModifier: 1.4, messages: ["Watch this!", "All in!", "No holding back!"] }
};

// Challenge streak bonus tiers (universal for all characters)
const STREAK_BONUSES = {
  3: { xpBonus: 0.05, rewardBonus: 0, label: "Hot Streak", emoji: "🔥" },
  5: { xpBonus: 0.1, rewardBonus: 0.1, label: "On Fire", emoji: "🔥🔥" },
  7: { xpBonus: 0.15, rewardBonus: 0.15, label: "Unstoppable", emoji: "🔥🔥🔥" },
  10: { xpBonus: 0.2, rewardBonus: 0.25, label: "Legendary", emoji: "⭐🔥⭐" }
};

// Enhanced Characters with mastery progression
const CHARACTERS = [
  {
    name: "Tourist",
    ability: "Challenge Bonus",
    description: "Gets a 20% bonus on challenge winnings",
    startingMoney: 1000,
    avatar: "🧳",
    perk: "Has a 10% higher chance of succeeding at challenges",
    startingStats: { strength: 3, charisma: 5, luck: 4, intelligence: 3 },
    specialAbility: {
      name: "Tourist Luck",
      description: "Once per day, can retry a failed challenge with a 20% higher success chance",
      usesLeft: 1
    },
    aiStrategy: "challenge-focused",
    masteryTree: {
      "Lucky Streak": { unlockLevel: 3, effect: "Consecutive challenge wins grant +10% bonus each" },
      "Globe Trotter": { unlockLevel: 5, effect: "Travel costs reduced by additional 15%" },
      "Challenge Master": { unlockLevel: 7, effect: "Can attempt any challenge twice per turn" }
    }
  },
  {
    name: "Businessman",
    ability: "Money Bonus",
    description: "Starts with extra money",
    startingMoney: 1500,
    avatar: "💼",
    perk: "Earns 10% more from all money sources",
    startingStats: { strength: 2, charisma: 4, luck: 3, intelligence: 6 },
    specialAbility: {
      name: "Market Insight",
      description: "Can see resource price trends once per day",
      usesLeft: 1
    },
    aiStrategy: "money-focused",
    masteryTree: {
      "Investment Genius": { unlockLevel: 3, effect: "Resources sold for 15% more" },
      "Negotiator": { unlockLevel: 5, effect: "All costs reduced by 20%" },
      "Mogul": { unlockLevel: 7, effect: "Gain passive income of $100 per turn" }
    }
  },
  {
    name: "Explorer",
    ability: "Travel Discount",
    description: "Pays 25% less for travel",
    startingMoney: 1200,
    avatar: "🗺️",
    perk: "Discovers bonus resources more often",
    startingStats: { strength: 5, charisma: 3, luck: 5, intelligence: 2 },
    specialAbility: {
      name: "Scout Ahead",
      description: "Reveals adjacent regions' resources before traveling",
      usesLeft: 2
    },
    aiStrategy: "exploration-focused",
    masteryTree: {
      "Treasure Hunter": { unlockLevel: 3, effect: "Find rare resources 25% more often" },
      "Fast Travel": { unlockLevel: 5, effect: "Can travel to any region for flat $300" },
      "Pathfinder": { unlockLevel: 7, effect: "Travel costs nothing to adjacent regions" }
    }
  },
  {
    name: "Scientist",
    ability: "Learning Bonus",
    description: "Gains experience faster",
    startingMoney: 1100,
    avatar: "🔬",
    perk: "Gets detailed information about challenge success rates",
    startingStats: { strength: 2, charisma: 2, luck: 2, intelligence: 9 },
    specialAbility: {
      name: "Calculate Odds",
      description: "Guarantee success on next challenge under difficulty 2",
      usesLeft: 1
    },
    aiStrategy: "balanced",
    masteryTree: {
      "Quick Study": { unlockLevel: 3, effect: "Gain 50% more XP from all sources" },
      "Efficiency Expert": { unlockLevel: 5, effect: "Actions have a 30% chance to not consume time" },
      "Mastermind": { unlockLevel: 7, effect: "All stats increased by 2 permanently" }
    }
  },
];

// AI Difficulty Profiles
const AI_DIFFICULTY_PROFILES = {
  easy: {
    name: "Easy",
    description: "Makes random decisions, often inefficient",
    decisionQuality: 0.4,
    riskTolerance: 0.3,
    planningDepth: 1,
    mistakeChance: 0.3,
    thinkingTimeMin: 500,
    thinkingTimeMax: 1000
  },
  medium: {
    name: "Medium",
    description: "Makes decent strategic decisions",
    decisionQuality: 0.7,
    riskTolerance: 0.5,
    planningDepth: 2,
    mistakeChance: 0.15,
    thinkingTimeMin: 800,
    thinkingTimeMax: 1500
  },
  hard: {
    name: "Hard",
    description: "Highly strategic and optimized gameplay",
    decisionQuality: 0.9,
    riskTolerance: 0.6,
    planningDepth: 3,
    mistakeChance: 0.05,
    thinkingTimeMin: 1000,
    thinkingTimeMax: 2000
  },
  expert: {
    name: "Expert",
    description: "Nearly perfect decision-making",
    decisionQuality: 0.95,
    riskTolerance: 0.7,
    planningDepth: 4,
    mistakeChance: 0.02,
    thinkingTimeMin: 1200,
    thinkingTimeMax: 2500
  }
};

// Notification types and their styling
const NOTIFICATION_TYPES = {
  money: { icon: '💰', color: '#10b981', label: 'Money' },
  challenge: { icon: '🎯', color: '#f59e0b', label: 'Challenge' },
  travel: { icon: '✈️', color: '#3b82f6', label: 'Travel' },
  resource: { icon: '📦', color: '#8b5cf6', label: 'Resource' },
  event: { icon: '⚡', color: '#ef4444', label: 'Event' },
  success: { icon: '✅', color: '#10b981', label: 'Success' },
  warning: { icon: '⚠️', color: '#f59e0b', label: 'Warning' },
  error: { icon: '❌', color: '#ef4444', label: 'Error' },
  info: { icon: 'ℹ️', color: '#3b82f6', label: 'Info' },
  levelup: { icon: '⭐', color: '#fbbf24', label: 'Level Up' },
  market: { icon: '📈', color: '#06b6d4', label: 'Market' },
  ai: { icon: '🤖', color: '#ec4899', label: 'AI Action' },
};

// Keyboard shortcuts configuration
const KEYBOARD_SHORTCUTS = {
  ' ': { action: 'endTurn', label: 'End Turn', description: 'End your turn' },
  'c': { action: 'openChallenges', label: 'Challenges', description: 'Open challenges modal' },
  'r': { action: 'openResources', label: 'Resources', description: 'Open resource market' },
  'm': { action: 'openMap', label: 'Map', description: 'Toggle map view' },
  't': { action: 'openTravel', label: 'Travel', description: 'Open travel modal' },
  'n': { action: 'openNotifications', label: 'Notifications', description: 'Open notification history' },
  'p': { action: 'openProgress', label: 'Progress', description: 'Open progress dashboard' },
  '?': { action: 'toggleHelp', label: 'Help', description: 'Toggle keyboard shortcuts help' },
  'Escape': { action: 'closeModal', label: 'Close', description: 'Close any open modal' },
};

const GAME_VERSION = "4.0.0";
const MINIMUM_WAGER = 50; // Minimum wager required for challenges
const MAX_INVENTORY = 50; // Maximum inventory capacity for players and AI
const OVERRIDE_DAILY_CAP = 3;
const OVERRIDE_BASE_COST = 500;
const OVERRIDE_FATIGUE_DECAY = 0.5;
const BANKRUPTCY_THRESHOLD = 50;
const BANKRUPTCY_STREAK_DAYS = 3;
const LOAN_AMOUNT = 500;
const LOAN_INTEREST_RATE = 0.25; // Legacy - now using LOAN_OPTIONS with variable rates
const MAX_ACTIVE_LOANS = 3;
const AI_STIPEND_AMOUNT = 200;
const AI_STIPEND_COOLDOWN = 2;
const COMEBACK_EVENT_CHANCE = 0.35;
const AI_RNG_MODULUS = 2147483647;
const AI_RNG_MULTIPLIER = 48271;
const AI_SPECIAL_ABILITY_EFFECTS = {
  touristLuckBonus: 0.3,
  calculateOddsMaxDifficulty: 3,
  marketInsightMultiplier: 1.25,
  scoutAheadTravelMultiplier: 0.6
};

const normalizeAiSeed = (seed: number) => {
  const numericSeed = Number.isFinite(seed) ? Math.floor(seed) : 1;
  const normalized = numericSeed % (AI_RNG_MODULUS - 1);
  return normalized > 0 ? normalized : 1;
};

type GameSettingsState = {
  actionLimitsEnabled: boolean;
  maxActionsPerTurn: number;
  aiMaxActionsPerTurn: number;
  allowActionOverride: boolean;
  overrideCost: number;
  totalDays: number;
  playerActionsPerDay: number;
  aiActionsPerDay: number;
  showDayTransition: boolean;
  // Challenge Risk/Reward options (optional features)
  dynamicWagerEnabled: boolean;
  doubleOrNothingEnabled: boolean;
  // Gameplay expansions (disabled by default)
  investmentsEnabled: boolean;
  equipmentShopEnabled: boolean;
  sabotageEnabled: boolean;
  // AI options (disabled by default)
  aiUsesMarketModifiers: boolean;
  aiSpecialAbilitiesEnabled: boolean;
  aiAffectsEconomy: boolean;
  aiDeterministic: boolean;
  aiDeterministicSeed: number;
};

type DontAskAgainPrefs = {
  travel: boolean;
  sell: boolean;
  challenge: boolean;
  endDay: boolean;
};

type Debuff = {
  type: string;
  remainingDays: number;
};

// =========================================
// TYPE DEFINITIONS AND INTERFACES
// =========================================

interface Notification {
  id: string;
  type: keyof typeof NOTIFICATION_TYPES;
  message: string;
  timestamp: number;
  day: number;
  read: boolean;
  persistent?: boolean;
}

interface PersonalRecord {
  highestChallenge: number;
  mostExpensiveResourceSold: { resource: string; price: number };
  consecutiveWins: number;
  maxMoney: number;
  fastestChallengeWin: number;
  totalEarned: number;
}

interface ConfirmationDialog {
  isOpen: boolean;
  type: 'travel' | 'sell' | 'challenge' | 'endDay' | null;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  data?: any;
}

interface AIAction {
  type: 'challenge' | 'travel' | 'sell' | 'collect' | 'think' | 'end_turn' | 'special_ability' | 'invest' | 'buy_equipment' | 'sabotage';
  description: string;
  data?: any;
}

const DEFAULT_GAME_SETTINGS: GameSettingsState = {
  actionLimitsEnabled: true,
  maxActionsPerTurn: 3,
  aiMaxActionsPerTurn: 3,
  allowActionOverride: true,
  overrideCost: OVERRIDE_BASE_COST,
  totalDays: 30,
  playerActionsPerDay: 3,
  aiActionsPerDay: 3,
  showDayTransition: false,
  // Challenge features (disabled by default for classic gameplay)
  dynamicWagerEnabled: false,
  doubleOrNothingEnabled: false,
  // Gameplay expansions (disabled by default)
  investmentsEnabled: false,
  equipmentShopEnabled: false,
  sabotageEnabled: false,
  // AI options (disabled by default)
  aiUsesMarketModifiers: false,
  aiSpecialAbilitiesEnabled: false,
  aiAffectsEconomy: false,
  aiDeterministic: false,
  aiDeterministicSeed: 1337
};

const DEFAULT_DONT_ASK: DontAskAgainPrefs = {
  travel: false,
  sell: false,
  challenge: false,
  endDay: false
};

const DEFAULT_PERSONAL_RECORDS: PersonalRecord = {
  highestChallenge: 0,
  mostExpensiveResourceSold: { resource: '', price: 0 },
  consecutiveWins: 0,
  maxMoney: 1000,
  fastestChallengeWin: Infinity,
  totalEarned: 0
};

// =========================================
// REDUCERS
// =========================================

const initialPlayerState = {
  money: 1000,
  currentRegion: "QLD",
  inventory: [],
  visitedRegions: ["QLD"],
  challengesCompleted: [],
  character: CHARACTERS[0],
  level: 1,
  xp: 0,
  stats: { strength: 3, charisma: 5, luck: 4, intelligence: 3 },
  consecutiveWins: 0,
  specialAbilityUses: 1,
  masteryUnlocks: [],
  name: "Player",
  actionsUsedThisTurn: 0,
  overridesUsedToday: 0,
  overrideFatigue: 0,
  loans: [] as Array<{ id: string; amount: number; accrued: number; loanType: string; interestRate: number }>,
  completedThisSeason: [] as string[],
  challengeMastery: {} as Record<string, number>,
  stipendCooldown: 0,
  investments: [] as string[],
  equipment: [] as string[],
  debuffs: [] as Debuff[],
  creditScore: 650,
  craftedItems: [] as string[],
  loansPaidEarly: 0,
  totalLoansTaken: 0
};

type PlayerStateSnapshot = typeof initialPlayerState;

function playerReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_MONEY':
      return { ...state, money: Math.max(0, state.money + action.payload) };
    case 'SET_REGION':
      const newVisited = state.visitedRegions.includes(action.payload)
        ? state.visitedRegions
        : [...state.visitedRegions, action.payload];
      return { ...state, currentRegion: action.payload, visitedRegions: newVisited };
    case 'COMPLETE_CHALLENGE':
      const completedName = action.payload;
      const newMasteryCount = (state.challengeMastery[completedName] || 0) + 1;
      const completedThisSeason = state.completedThisSeason.includes(completedName)
        ? state.completedThisSeason
        : [...state.completedThisSeason, completedName];
      return {
        ...state,
        challengesCompleted: [...state.challengesCompleted, completedName],
        completedThisSeason,
        challengeMastery: { ...state.challengeMastery, [completedName]: newMasteryCount },
        consecutiveWins: state.consecutiveWins + 1,
        actionsUsedThisTurn: state.actionsUsedThisTurn + 1
      };
    case 'RESET_STREAK':
      return { ...state, consecutiveWins: 0 };
    case 'COLLECT_RESOURCES':
      // Enforce inventory capacity limit
      const newResources = action.payload.resources;
      const availableSpace = MAX_INVENTORY - state.inventory.length;
      const resourcesToAdd = availableSpace > 0 ? newResources.slice(0, availableSpace) : [];
      return { ...state, inventory: [...state.inventory, ...resourcesToAdd] };
    case 'SELL_RESOURCE':
      const updatedInventory = [...state.inventory];
      const index = updatedInventory.indexOf(action.payload.resource);
      if (index > -1) updatedInventory.splice(index, 1);
      return {
        ...state,
        inventory: updatedInventory,
        money: state.money + action.payload.price,
        actionsUsedThisTurn: state.actionsUsedThisTurn + 1
      };
    case 'INCREMENT_ACTIONS':
      return { ...state, actionsUsedThisTurn: state.actionsUsedThisTurn + 1 };
    case 'RESET_ACTIONS':
      return { ...state, actionsUsedThisTurn: 0 };
    case 'USE_ACTION_OVERRIDE':
      return { 
        ...state, 
        money: state.money - action.payload,
        actionsUsedThisTurn: 0,
        overridesUsedToday: (state.overridesUsedToday || 0) + 1,
        overrideFatigue: (state.overrideFatigue || 0) + (state.overridesUsedToday === 0 ? 0 : state.overridesUsedToday === 1 ? 0.03 : 0.05)
      };
    case 'GAIN_XP':
      const rawGain = typeof action.payload === 'number'
        ? action.payload
        : typeof action.payload?.amount === 'number'
          ? action.payload.amount
          : 0;
      const applyEquipment = typeof action.payload === 'object'
        ? Boolean(action.payload.applyEquipment)
        : true;
      const equipmentEffects = applyEquipment ? getEquipmentEffects(state.equipment || []) : { xpBonus: 0 };
      const xpGain = Math.floor(rawGain * (1 + (equipmentEffects.xpBonus || 0)));
      const newXp = state.xp + xpGain;
      const xpForNextLevel = state.level * 100;
      if (newXp >= xpForNextLevel) {
        return {
          ...state,
          xp: newXp - xpForNextLevel,
          level: state.level + 1,
          stats: {
            strength: state.stats.strength + 1,
            charisma: state.stats.charisma + 1,
            luck: state.stats.luck + 1,
            intelligence: state.stats.intelligence + 1
          }
        };
      }
      return { ...state, xp: newXp };
    case 'USE_SPECIAL_ABILITY':
      return { ...state, specialAbilityUses: state.specialAbilityUses - 1 };
    case 'RESET_SPECIAL_ABILITY':
      return { ...state, specialAbilityUses: state.character.specialAbility.usesLeft };
    case 'UNLOCK_MASTERY':
      return { ...state, masteryUnlocks: [...state.masteryUnlocks, action.payload] };
    case 'RESET_DAILY_STATE':
      return {
        ...state,
        actionsUsedThisTurn: 0,
        overridesUsedToday: 0,
        overrideFatigue: Math.max(0, (state.overrideFatigue || 0) * OVERRIDE_FATIGUE_DECAY)
      };
    case 'RESET_SEASONAL_CHALLENGES':
      return { ...state, completedThisSeason: [] };
    case 'SET_LOANS':
      return { ...state, loans: action.payload || [] };
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload || [] };
    case 'MERGE_STATE':
      return { ...state, ...(action.payload || {}) };
    case 'RESET_PLAYER':
      const char = CHARACTERS[action.payload.characterIndex || 0];
      return {
        ...initialPlayerState,
        money: char.startingMoney,
        character: char,
        stats: { ...char.startingStats },
        specialAbilityUses: char.specialAbility.usesLeft,
        name: action.payload.name || "Player"
      };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const initialGameState = {
  day: 1,
  season: "Summer",
  weather: "Sunny",
  resourcePrices: {},
  priceHistory: [] as Array<{day: number, prices: Record<string, number>}>,
  activeEvents: [] as Array<{id: string, name: string, region: string, duration: number, remainingDays: number, effect: any, description: string}>,
  marketTrend: "stable",
  gameMode: "menu",
  selectedMode: null,
  currentTurn: "player", // "player" or "ai"
  isAiThinking: false,
  aiDifficulty: "medium",
  actionsThisTurn: 0,
  maxActionsPerTurn: 3,
  actionLimitsEnabled: true,
  playerActionsThisTurn: 0,
  allChallengesCompleted: false,
  // New enhancement fields
  aiMood: "neutral" as keyof typeof AI_MOOD_STATES,
  netWorthHistory: [] as Array<{day: number, playerWorth: number, aiWorth: number}>,
  bestDayRecord: { day: 0, earned: 0 },
  supplyDemand: {} as Record<string, number>, // Tracks how much of each resource has been sold
  doubleOrNothingAvailable: false,
  lastChallengeReward: 0,
  bankruptcyTracker: { player: 0, ai: 0 },
  dominanceTracker: { player: 0, ai: 0 }
};

type GameStateSnapshot = typeof initialGameState;

function gameStateReducer(state, action) {
  switch (action.type) {
    case 'NEXT_DAY':
      const newDay = state.day + 1;
      const seasons = ["Summer", "Autumn", "Winter", "Spring"];
      const newSeason = seasons[Math.floor((newDay - 1) / 7) % 4];
      return { ...state, day: newDay, season: newSeason, actionsThisTurn: 0 };
    case 'UPDATE_WEATHER':
      return { ...state, weather: action.payload };
    case 'UPDATE_RESOURCE_PRICES':
      return { ...state, resourcePrices: action.payload };
    case 'ADD_EVENT':
      return { ...state, activeEvents: [...state.activeEvents, action.payload] };
    case 'REMOVE_EVENT':
      return {
        ...state,
        activeEvents: state.activeEvents.filter((e, i) => i !== action.payload)
      };
    case 'UPDATE_MARKET_TREND':
      return { ...state, marketTrend: action.payload };
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload };
    case 'SET_SELECTED_MODE':
      return { ...state, selectedMode: action.payload };
    case 'SET_TURN':
      return { ...state, currentTurn: action.payload, actionsThisTurn: 0 };
    case 'SET_AI_THINKING':
      return { ...state, isAiThinking: action.payload };
    case 'SET_AI_DIFFICULTY':
      return { ...state, aiDifficulty: action.payload };
    case 'INCREMENT_ACTIONS':
      return { ...state, actionsThisTurn: state.actionsThisTurn + 1 };
    case 'RESET_ACTIONS':
      return { ...state, actionsThisTurn: 0 };
    case 'SET_PLAYER_ACTIONS':
      return { ...state, playerActionsThisTurn: action.payload };
    case 'INCREMENT_PLAYER_ACTIONS':
      return { ...state, playerActionsThisTurn: state.playerActionsThisTurn + 1 };
    case 'SET_ACTION_LIMITS_ENABLED':
      return { ...state, actionLimitsEnabled: action.payload };
    case 'SET_MAX_ACTIONS':
      return { ...state, maxActionsPerTurn: action.payload };
    case 'SET_ALL_CHALLENGES_COMPLETED':
      return { ...state, allChallengesCompleted: action.payload };
    // New enhancement actions
    case 'SET_AI_MOOD':
      return { ...state, aiMood: action.payload };
    case 'ADD_PRICE_HISTORY':
      const newHistory = [...state.priceHistory, action.payload].slice(-10); // Keep last 10 days
      return { ...state, priceHistory: newHistory };
    case 'ADD_NET_WORTH_HISTORY':
      const newWorthHistory = [...state.netWorthHistory, action.payload].slice(-30);
      return { ...state, netWorthHistory: newWorthHistory };
    case 'UPDATE_BEST_DAY':
      if (action.payload.earned > state.bestDayRecord.earned) {
        return { ...state, bestDayRecord: action.payload };
      }
      return state;
    case 'UPDATE_SUPPLY_DEMAND':
      const newSupplyDemand = { ...state.supplyDemand };
      const resource = action.payload.resource;
      newSupplyDemand[resource] = (newSupplyDemand[resource] || 0) + action.payload.amount;
      return { ...state, supplyDemand: newSupplyDemand };
    case 'SET_DOUBLE_OR_NOTHING':
      return { ...state, doubleOrNothingAvailable: action.payload.available, lastChallengeReward: action.payload.reward || 0 };
    case 'UPDATE_ACTIVE_EVENTS':
      return { ...state, activeEvents: action.payload };
    case 'SET_BANKRUPTCY_TRACKER':
      return { ...state, bankruptcyTracker: { ...state.bankruptcyTracker, ...action.payload } };
    case 'SET_DOMINANCE_TRACKER':
      return { ...state, dominanceTracker: { ...state.dominanceTracker, ...action.payload } };
    case 'RESET_GAME':
      return {
        ...initialGameState,
        gameMode: state.gameMode,
        selectedMode: state.selectedMode,
        aiDifficulty: state.aiDifficulty
      };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface SaveMetadata {
  timestamp: number;
  gameVersion: string;
  saveDescription: string;
}

interface SaveGameData {
  metadata: SaveMetadata;
  player: PlayerStateSnapshot;
  aiPlayer: PlayerStateSnapshot;
  gameState: GameStateSnapshot;
  gameSettings: GameSettingsState;
  notifications: Notification[];
  personalRecords: PersonalRecord;
  dontAskAgain: DontAskAgainPrefs;
  uiPreferences: {
    theme: string;
  };
  aiRuntime: {
    queue: AIAction[];
    currentAction: AIAction | null;
    rngState: number;
  };
}

interface LoadPreviewState {
  isOpen: boolean;
  data: SaveGameData | null;
  filename?: string;
  error?: string;
}

// =========================================
// MAIN COMPONENT
// =========================================

function AustraliaGame() {
  // Core game state
  const [player, dispatchPlayer] = useReducer(playerReducer, initialPlayerState);
  const [gameState, dispatchGameState] = useReducer(gameStateReducer, initialGameState);

  // AI opponent state
  const [aiPlayer, setAiPlayer] = useState<PlayerStateSnapshot>({
    money: 1000,
    currentRegion: "QLD",
    inventory: [],
    visitedRegions: ["QLD"],
    challengesCompleted: [],
    character: CHARACTERS[1],
    level: 1,
    xp: 0,
    stats: { strength: 2, charisma: 4, luck: 3, intelligence: 6 },
    consecutiveWins: 0,
    specialAbilityUses: 1,
    masteryUnlocks: [],
    name: "AI Opponent",
    actionsUsedThisTurn: 0,
    overridesUsedToday: 0,
    overrideFatigue: 0,
    loans: [] as Array<{ id: string; amount: number; accrued: number; loanType: string; interestRate: number }>,
    completedThisSeason: [] as string[],
    challengeMastery: {} as Record<string, number>,
    stipendCooldown: 0,
    investments: [] as string[],
    equipment: [] as string[],
    debuffs: [] as Debuff[],
    creditScore: 650,
    craftedItems: [] as string[],
    loansPaidEarly: 0,
    totalLoansTaken: 0
  });

  // AI action queue for visual feedback
  const [aiActionQueue, setAiActionQueue] = useState<AIAction[]>([]);
  const [currentAiAction, setCurrentAiAction] = useState<AIAction | null>(null);
  const [aiActiveSpecialAbility, setAiActiveSpecialAbility] = useState<string | null>(null);
  const aiRngStateRef = useRef<number>(DEFAULT_GAME_SETTINGS.aiDeterministicSeed);
  const aiRngSeedRef = useRef<number>(DEFAULT_GAME_SETTINGS.aiDeterministicSeed);
  const aiActiveSpecialAbilityRef = useRef<string | null>(null);

  // Game Settings State
  const [gameSettings, setGameSettings] = useState<GameSettingsState>({ ...DEFAULT_GAME_SETTINGS });

  // UI state
  const [uiState, setUiState] = useState({
    showTravelModal: false,
    showChallenges: false,
    showMarket: false,
    showShop: false,
    showInvestments: false,
    showSabotage: false,
    showStats: false,
    showMap: true,
    selectedCharacter: 0,
    playerName: "",
    wagerAmount: 100,
    showCampaignSelect: false,
    theme: "dark",
    showNotifications: false,
    showProgress: false,
    showHelp: false,
    showSettings: false,
    showEndGameModes: false,
    notificationFilter: 'all',
    quickActionsOpen: true,
    showAiStats: false,
    showDayTransition: false,
    showSaveLoadModal: false,
    showWorkshop: false,
    showBank: false,
    // New inventory management options
    inventorySort: 'default' as 'default' | 'value' | 'quantity' | 'category',
    inventoryFilter: 'all' as 'all' | 'luxury' | 'food' | 'industrial' | 'agricultural' | 'energy' | 'financial' | 'service',
    showDoubleOrNothing: false
  });

  // Special ability state tracking
  const [activeSpecialAbility, setActiveSpecialAbility] = useState<string | null>(null);
  const [failedChallengeData, setFailedChallengeData] = useState<{challenge: any, wager: number} | null>(null);
  const [usedFreeChallengeThisTurn, setUsedFreeChallengeThisTurn] = useState(false);

  // Day transition state
  const [dayTransitionData, setDayTransitionData] = useState({
    prevDay: 1,
    newDay: 2,
    playerEarned: 0,
    aiEarned: 0
  });

  // Enhanced notification system
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord>({ ...DEFAULT_PERSONAL_RECORDS });

  // Confirmation dialog state
  const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialog>({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {},
    data: null
  });

  // Don't ask again preferences
  const [dontAskAgain, setDontAskAgain] = useState<DontAskAgainPrefs>({ ...DEFAULT_DONT_ASK });

  const [saveDescription, setSaveDescription] = useState("");
  const [loadPreview, setLoadPreview] = useState<LoadPreviewState>({
    isOpen: false,
    data: null
  });

  // Refs
  const notificationEndRef = useRef<HTMLDivElement>(null);
  const aiTurnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const aiPlayerRef = useRef(aiPlayer);

  // Keep aiPlayerRef in sync with aiPlayer state
  useEffect(() => {
    aiPlayerRef.current = aiPlayer;
  }, [aiPlayer]);

  useEffect(() => {
    aiActiveSpecialAbilityRef.current = aiActiveSpecialAbility;
  }, [aiActiveSpecialAbility]);

  useEffect(() => {
    if (!gameSettings.aiDeterministic) return;
    const normalizedSeed = normalizeAiSeed(gameSettings.aiDeterministicSeed);
    if (!aiRngStateRef.current || aiRngSeedRef.current !== gameSettings.aiDeterministicSeed) {
      aiRngStateRef.current = normalizedSeed;
      aiRngSeedRef.current = gameSettings.aiDeterministicSeed;
    }
  }, [gameSettings.aiDeterministic, gameSettings.aiDeterministicSeed]);

  // =========================================
  // NOTIFICATION SYSTEM
  // =========================================

  const addNotification = useCallback((message: string, type: keyof typeof NOTIFICATION_TYPES = 'info', persistent: boolean = false) => {
    const notification: Notification = {
      id: Date.now().toString() + Math.random(),
      type,
      message,
      timestamp: Date.now(),
      day: gameState.day,
      read: false,
      persistent
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove non-persistent notifications after 5 seconds
    if (!persistent) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    }
  }, [gameState.day]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // =========================================
  // SAVE / LOAD SYSTEM
  // =========================================

  const resolveCharacter = useCallback((name?: string) => {
    if (!name) return CHARACTERS[0];
    return CHARACTERS.find(character => character.name === name) || CHARACTERS[0];
  }, []);

  const generateSaveFileName = useCallback((data: SaveGameData) => {
    const safeName = (data.player.name || "Adventurer").replace(/[^a-z0-9]/gi, '') || "Traveler";
    const timestamp = new Date(data.metadata.timestamp);
    const stamp = `${timestamp.getFullYear()}${String(timestamp.getMonth() + 1).padStart(2, '0')}${String(timestamp.getDate()).padStart(2, '0')}_${String(timestamp.getHours()).padStart(2, '0')}${String(timestamp.getMinutes()).padStart(2, '0')}`;
    const money = Math.max(0, Math.floor(data.player.money));
    return `AussieAdventure_Day${data.gameState.day}_${safeName}_Lv${data.player.level}_$${money}_${stamp}.json`;
  }, []);

  const buildSaveData = useCallback((descriptionOverride?: string): SaveGameData => {
    const description = (descriptionOverride ?? saveDescription).trim() || `Manual Save Day ${gameState.day}`;
    return {
      metadata: {
        timestamp: Date.now(),
        gameVersion: GAME_VERSION,
        saveDescription: description
      },
      player,
      aiPlayer,
      gameState,
      gameSettings,
      notifications,
      personalRecords,
      dontAskAgain,
      uiPreferences: {
        theme: uiState.theme
      },
      aiRuntime: {
        queue: aiActionQueue,
        currentAction: currentAiAction,
        rngState: aiRngStateRef.current
      }
    };
  }, [aiActionQueue, aiPlayer, currentAiAction, dontAskAgain, gameSettings, gameState, notifications, personalRecords, player, saveDescription, uiState.theme]);

  const downloadSaveFile = useCallback((data: SaveGameData) => {
    const filename = generateSaveFileName(data);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, [generateSaveFileName]);

  const handleSaveGame = useCallback((descriptionOverride?: string) => {
    if (gameState.gameMode === 'menu') {
      addNotification('Start or load a game before saving.', 'warning');
      return;
    }
    try {
      const data = buildSaveData(descriptionOverride);
      downloadSaveFile(data);
      addNotification(`Game saved! Day ${data.gameState.day}, ${data.player.name}`, 'success');
    } catch (error) {
      console.error('Save failed', error);
      addNotification('Failed to save game. Please try again.', 'error');
    }
  }, [addNotification, buildSaveData, downloadSaveFile, gameState.gameMode]);

  const validateSaveData = useCallback((raw: any): SaveGameData => {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Save file is empty or corrupted.');
    }

    const metadata = raw.metadata || {};
    if (typeof metadata.timestamp !== 'number') {
      throw new Error('Save file missing timestamp.');
    }
    if (typeof metadata.gameVersion !== 'string') {
      throw new Error('Save file missing version information.');
    }

    const playerData = raw.player;
    const aiData = raw.aiPlayer;
    const stateData = raw.gameState;
    const settingsData = raw.gameSettings;
    if (!playerData || !aiData || !stateData || !settingsData) {
      throw new Error('Save file missing core state sections.');
    }

    const requiredPlayerFields = [
      'money', 'currentRegion', 'inventory', 'visitedRegions', 'challengesCompleted',
      'character', 'level', 'xp', 'stats', 'consecutiveWins', 'specialAbilityUses',
      'masteryUnlocks', 'name', 'actionsUsedThisTurn'
    ];
    requiredPlayerFields.forEach(field => {
      if (typeof playerData[field] === 'undefined') {
        throw new Error(`Save file missing player field: ${field}`);
      }
      if (typeof aiData[field] === 'undefined') {
        throw new Error(`Save file missing AI field: ${field}`);
      }
    });

    const requiredGameFields = [
      'day', 'season', 'weather', 'resourcePrices', 'activeEvents', 'marketTrend',
      'gameMode', 'selectedMode', 'currentTurn', 'isAiThinking', 'aiDifficulty',
      'actionsThisTurn', 'maxActionsPerTurn', 'actionLimitsEnabled',
      'playerActionsThisTurn', 'allChallengesCompleted'
    ];
    requiredGameFields.forEach(field => {
      if (typeof stateData[field] === 'undefined') {
        throw new Error(`Save file missing game state field: ${field}`);
      }
    });

    const sanitizeStats = (stats: any) => ({
      strength: typeof stats?.strength === 'number' ? stats.strength : initialPlayerState.stats.strength,
      charisma: typeof stats?.charisma === 'number' ? stats.charisma : initialPlayerState.stats.charisma,
      luck: typeof stats?.luck === 'number' ? stats.luck : initialPlayerState.stats.luck,
      intelligence: typeof stats?.intelligence === 'number' ? stats.intelligence : initialPlayerState.stats.intelligence
    });

    const sanitizePlayerState = (data: any, fallbackName: string): PlayerStateSnapshot => {
      const character = resolveCharacter(data?.character?.name);
      const region = REGIONS[data?.currentRegion] ? data.currentRegion : initialPlayerState.currentRegion;
      const visited = Array.isArray(data?.visitedRegions)
        ? data.visitedRegions.filter(regionCode => REGIONS[regionCode]).map(String)
        : [];
      if (!visited.includes(region)) {
        visited.push(region);
      }

      const inventory = Array.isArray(data?.inventory) ? data.inventory.map(String) : [];
      const challenges = Array.isArray(data?.challengesCompleted) ? data.challengesCompleted.map(String) : [];
      const mastery = Array.isArray(data?.masteryUnlocks) ? data.masteryUnlocks.map(String) : [];
      const completedThisSeason = Array.isArray(data?.completedThisSeason) ? data.completedThisSeason.map(String) : [];
      const challengeMastery = typeof data?.challengeMastery === 'object' && data.challengeMastery !== null ? data.challengeMastery : {};
      const investments = Array.isArray(data?.investments)
        ? data.investments.filter((regionCode: string) => REGIONAL_INVESTMENTS[regionCode]).map(String)
        : [];
      const equipment = Array.isArray(data?.equipment)
        ? data.equipment.filter((itemId: string) => SHOP_ITEMS.some(item => item.id === itemId)).map(String)
        : [];
      const debuffs = Array.isArray(data?.debuffs)
        ? data.debuffs
            .filter((debuff: Debuff) => debuff && typeof debuff.type === 'string' && typeof debuff.remainingDays === 'number')
            .map((debuff: Debuff) => ({
              type: debuff.type,
              remainingDays: Math.max(0, Math.floor(debuff.remainingDays))
            }))
        : [];
      const loans = Array.isArray(data?.loans)
        ? data.loans
            .filter(l => typeof l?.amount === 'number')
            .map(l => ({
              id: typeof l?.id === 'string' ? l.id : Date.now().toString(),
              amount: typeof l?.amount === 'number' ? l.amount : 0,
              accrued: typeof l?.accrued === 'number' ? l.accrued : 0
            }))
        : [];

      return {
        ...initialPlayerState,
        ...data,
        character,
        currentRegion: region,
        money: typeof data?.money === 'number' ? data.money : initialPlayerState.money,
        visitedRegions: visited,
        inventory,
        challengesCompleted: challenges,
        masteryUnlocks: mastery,
        stats: sanitizeStats(data?.stats),
        level: typeof data?.level === 'number' ? data.level : initialPlayerState.level,
        xp: typeof data?.xp === 'number' ? data.xp : initialPlayerState.xp,
        consecutiveWins: typeof data?.consecutiveWins === 'number' ? data.consecutiveWins : 0,
        specialAbilityUses: typeof data?.specialAbilityUses === 'number' ? data.specialAbilityUses : character.specialAbility.usesLeft,
        name: typeof data?.name === 'string' && data.name.trim() ? data.name : fallbackName,
        actionsUsedThisTurn: typeof data?.actionsUsedThisTurn === 'number' ? data.actionsUsedThisTurn : 0,
        overridesUsedToday: typeof data?.overridesUsedToday === 'number' ? data.overridesUsedToday : 0,
        overrideFatigue: typeof data?.overrideFatigue === 'number' ? data.overrideFatigue : 0,
        loans,
        completedThisSeason,
        challengeMastery,
        stipendCooldown: typeof data?.stipendCooldown === 'number' ? data.stipendCooldown : 0,
        investments,
        equipment,
        debuffs
      };
    };

    const sanitizedGameState: GameStateSnapshot = {
      ...initialGameState,
      ...stateData,
      resourcePrices: typeof stateData.resourcePrices === 'object' && stateData.resourcePrices !== null ? stateData.resourcePrices : {},
      activeEvents: Array.isArray(stateData.activeEvents) ? stateData.activeEvents : [],
      currentTurn: stateData.currentTurn === 'ai' ? 'ai' : 'player',
      selectedMode: stateData.selectedMode || null,
      gameMode: ['menu', 'game', 'end'].includes(stateData.gameMode) ? stateData.gameMode : 'game',
      aiDifficulty: typeof stateData.aiDifficulty === 'string' && AI_DIFFICULTY_PROFILES[stateData.aiDifficulty]
        ? stateData.aiDifficulty
        : initialGameState.aiDifficulty,
      actionLimitsEnabled: Boolean(stateData.actionLimitsEnabled),
      actionsThisTurn: typeof stateData.actionsThisTurn === 'number' ? stateData.actionsThisTurn : 0,
      maxActionsPerTurn: typeof stateData.maxActionsPerTurn === 'number' ? stateData.maxActionsPerTurn : initialGameState.maxActionsPerTurn,
      playerActionsThisTurn: typeof stateData.playerActionsThisTurn === 'number' ? stateData.playerActionsThisTurn : 0,
      allChallengesCompleted: Boolean(stateData.allChallengesCompleted),
      isAiThinking: Boolean(stateData.isAiThinking),
      bankruptcyTracker: typeof stateData.bankruptcyTracker === 'object' && stateData.bankruptcyTracker !== null
        ? { player: stateData.bankruptcyTracker.player || 0, ai: stateData.bankruptcyTracker.ai || 0 }
        : initialGameState.bankruptcyTracker,
      dominanceTracker: typeof stateData.dominanceTracker === 'object' && stateData.dominanceTracker !== null
        ? { player: stateData.dominanceTracker.player || 0, ai: stateData.dominanceTracker.ai || 0 }
        : initialGameState.dominanceTracker
    };

    const sanitizedGameSettings: GameSettingsState = {
      actionLimitsEnabled: Boolean(settingsData.actionLimitsEnabled),
      maxActionsPerTurn: typeof settingsData.maxActionsPerTurn === 'number' ? settingsData.maxActionsPerTurn : DEFAULT_GAME_SETTINGS.maxActionsPerTurn,
      aiMaxActionsPerTurn: typeof settingsData.aiMaxActionsPerTurn === 'number' ? settingsData.aiMaxActionsPerTurn : DEFAULT_GAME_SETTINGS.aiMaxActionsPerTurn,
      allowActionOverride: Boolean(settingsData.allowActionOverride),
      overrideCost: typeof settingsData.overrideCost === 'number' ? settingsData.overrideCost : DEFAULT_GAME_SETTINGS.overrideCost,
      // New settings with backwards compatibility
      totalDays: typeof settingsData.totalDays === 'number' ? settingsData.totalDays : DEFAULT_GAME_SETTINGS.totalDays,
      playerActionsPerDay: typeof settingsData.playerActionsPerDay === 'number' ? settingsData.playerActionsPerDay : (typeof settingsData.maxActionsPerTurn === 'number' ? settingsData.maxActionsPerTurn : DEFAULT_GAME_SETTINGS.playerActionsPerDay),
      aiActionsPerDay: typeof settingsData.aiActionsPerDay === 'number' ? settingsData.aiActionsPerDay : (typeof settingsData.aiMaxActionsPerTurn === 'number' ? settingsData.aiMaxActionsPerTurn : DEFAULT_GAME_SETTINGS.aiActionsPerDay),
      showDayTransition: typeof settingsData.showDayTransition === 'boolean' ? settingsData.showDayTransition : DEFAULT_GAME_SETTINGS.showDayTransition,
      investmentsEnabled: Boolean(settingsData.investmentsEnabled),
      equipmentShopEnabled: Boolean(settingsData.equipmentShopEnabled),
      sabotageEnabled: Boolean(settingsData.sabotageEnabled),
      aiUsesMarketModifiers: Boolean(settingsData.aiUsesMarketModifiers),
      aiSpecialAbilitiesEnabled: Boolean(settingsData.aiSpecialAbilitiesEnabled),
      aiAffectsEconomy: Boolean(settingsData.aiAffectsEconomy),
      aiDeterministic: Boolean(settingsData.aiDeterministic),
      aiDeterministicSeed: normalizeAiSeed(
        typeof settingsData.aiDeterministicSeed === 'number'
          ? settingsData.aiDeterministicSeed
          : DEFAULT_GAME_SETTINGS.aiDeterministicSeed
      )
    };

    const sanitizedNotifications: Notification[] = Array.isArray(raw.notifications)
      ? raw.notifications
          .filter(n => n && typeof n.message === 'string' && typeof n.type === 'string')
          .map((n) => ({
            id: typeof n.id === 'string' ? n.id : `${n.type}-${n.message}-${Math.random()}`,
            type: n.type in NOTIFICATION_TYPES ? n.type : 'info',
            message: n.message,
            timestamp: typeof n.timestamp === 'number' ? n.timestamp : metadata.timestamp,
            day: typeof n.day === 'number' ? n.day : stateData.day,
            read: Boolean(n.read),
            persistent: Boolean(n.persistent)
          }))
      : [];

    const sanitizedPersonalRecords: PersonalRecord = {
      ...DEFAULT_PERSONAL_RECORDS,
      ...(raw.personalRecords || {})
    };

    const sanitizedDontAskAgain: DontAskAgainPrefs = {
      travel: Boolean(raw.dontAskAgain?.travel),
      sell: Boolean(raw.dontAskAgain?.sell),
      challenge: Boolean(raw.dontAskAgain?.challenge),
      endDay: Boolean(raw.dontAskAgain?.endDay)
    };

    const sanitizedRuntime = {
      queue: Array.isArray(raw.aiRuntime?.queue) ? raw.aiRuntime.queue : [],
      currentAction: raw.aiRuntime?.currentAction || null,
      rngState: typeof raw.aiRuntime?.rngState === 'number'
        ? raw.aiRuntime.rngState
        : normalizeAiSeed(
            typeof settingsData.aiDeterministicSeed === 'number'
              ? settingsData.aiDeterministicSeed
              : DEFAULT_GAME_SETTINGS.aiDeterministicSeed
          )
    };

    const uiPreferences = {
      theme: raw.uiPreferences?.theme === 'light' ? 'light' : 'dark'
    };

    return {
      metadata: {
        timestamp: metadata.timestamp,
        gameVersion: metadata.gameVersion,
        saveDescription: typeof metadata.saveDescription === 'string' ? metadata.saveDescription : ''
      },
      player: sanitizePlayerState(playerData, "Player"),
      aiPlayer: sanitizePlayerState(aiData, "AI Opponent"),
      gameState: sanitizedGameState,
      gameSettings: sanitizedGameSettings,
      notifications: sanitizedNotifications,
      personalRecords: sanitizedPersonalRecords,
      dontAskAgain: sanitizedDontAskAgain,
      uiPreferences,
      aiRuntime: sanitizedRuntime
    };
  }, [resolveCharacter]);

  const openLoadDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    } else {
      addNotification('Load input not ready. Please try again.', 'error');
    }
  }, [addNotification]);

  const handleLoadFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validated = validateSaveData(parsed);
      setLoadPreview({
        isOpen: true,
        data: validated,
        filename: file.name
      });
    } catch (error) {
      console.error('Load failed', error);
      const message = error instanceof Error ? error.message : 'Unable to load save file.';
      addNotification(message, 'error');
    } finally {
      event.target.value = '';
    }
  }, [addNotification, validateSaveData]);

  const closeLoadPreview = useCallback(() => {
    setLoadPreview({ isOpen: false, data: null });
  }, []);

// =========================================
// CONFIRMATION DIALOG SYSTEM
// =========================================

  const showConfirmation = useCallback((
    type: ConfirmationDialog['type'],
    title: string,
    message: string,
    confirmText: string,
    onConfirm: () => void,
    data?: any
  ) => {
    if (dontAskAgain[type as keyof typeof dontAskAgain]) {
      onConfirm();
      return;
    }

    setConfirmationDialog({
      isOpen: true,
      type,
      title,
      message,
      confirmText,
      onConfirm,
      data
    });
  }, [dontAskAgain]);

  const closeConfirmation = useCallback(() => {
    setConfirmationDialog({
      isOpen: false,
      type: null,
      title: '',
      message: '',
      confirmText: '',
      onConfirm: () => {},
      data: null
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmationDialog.onConfirm) {
      confirmationDialog.onConfirm();
    }
    closeConfirmation();
  }, [confirmationDialog, closeConfirmation]);

  // =========================================
  // PERSONAL RECORDS TRACKING
  // =========================================

  const updatePersonalRecords = useCallback((type: string, value: any) => {
    setPersonalRecords(prev => {
      const updated = { ...prev };
      
      switch (type) {
        case 'challenge':
          if (value > updated.highestChallenge) {
            updated.highestChallenge = value;
            addNotification(`New record! Highest challenge reward: $${value}`, 'success', false);
          }
          break;
        case 'resource':
          if (value.price > updated.mostExpensiveResourceSold.price) {
            updated.mostExpensiveResourceSold = value;
            addNotification(`New record! Most valuable sale: ${value.resource} for $${value.price}`, 'success', false);
          }
          break;
        case 'consecutiveWins':
          if (value > updated.consecutiveWins) {
            updated.consecutiveWins = value;
            if (value >= 3) {
              addNotification(`${value} challenges won in a row! 🔥`, 'success', false);
            }
          }
          break;
        case 'money':
          if (value > updated.maxMoney) {
            updated.maxMoney = value;
          }
          break;
        case 'earned':
          updated.totalEarned += value;
          break;
      }
      
      return updated;
    });
  }, [addNotification]);

  // =========================================
  // MONEY VALIDATION HELPERS
  // =========================================

  // Centralized money floor validation - ensures money never goes negative
  const validateMoney = useCallback((amount: number): number => {
    return Math.max(0, Math.floor(amount));
  }, []);

  // Safe money deduction - returns validated amount after deduction
  const deductMoney = useCallback((currentMoney: number, deduction: number): number => {
    return validateMoney(currentMoney - deduction);
  }, [validateMoney]);

  // Safe money addition - returns validated amount after addition
  const addMoney = useCallback((currentMoney: number, addition: number): number => {
    return validateMoney(currentMoney + addition);
  }, [validateMoney]);

  // =========================================
  // AI STATE MANAGEMENT HELPERS
  // =========================================

  // CRITICAL FIX: Atomic AI state update that syncs ref immediately
  // This prevents race conditions and stale closure issues
  const updateAiPlayerState = useCallback((updater: (prev: PlayerStateSnapshot) => PlayerStateSnapshot) => {
    setAiPlayer(prev => {
      const newState = updater(prev);
      // Immediately sync ref to prevent stale reads
      aiPlayerRef.current = newState;
      return newState;
    });
  }, []);

  // =========================================
  // AI RNG HELPERS
  // =========================================

  // CRITICAL FIX: RNG with BigInt to prevent overflow and state validation
  const aiRandom = useCallback(() => {
    if (!gameSettings.aiDeterministic) {
      return Math.random();
    }

    let state = aiRngStateRef.current;

    // Validate RNG state - recover from corruption
    if (!state || !isFinite(state) || state <= 0 || state >= AI_RNG_MODULUS) {
      console.warn('Invalid RNG state detected, reinitializing:', state);
      state = normalizeAiSeed(gameSettings.aiDeterministicSeed);
    }

    // Use BigInt to prevent integer overflow for large multiplications
    const nextState = Number(
      (BigInt(state) * BigInt(AI_RNG_MULTIPLIER)) % BigInt(AI_RNG_MODULUS)
    );

    // Validate output before storing
    if (!isFinite(nextState) || nextState <= 0 || nextState >= AI_RNG_MODULUS) {
      console.error('RNG produced invalid state:', nextState, 'falling back to system RNG');
      aiRngStateRef.current = normalizeAiSeed(Date.now());
      return Math.random();
    }

    aiRngStateRef.current = nextState;
    return nextState / AI_RNG_MODULUS;
  }, [gameSettings.aiDeterministic, gameSettings.aiDeterministicSeed]);

  // =========================================
  // NET WORTH & UNDERDOG HELPERS
  // =========================================

  const computeNetWorth = useCallback((state: any) => {
    if (!state) return 0;
    return (state.money || 0) + (state.inventory || []).reduce((total, resource) => {
      return total + (gameState.resourcePrices[resource] || 100);
    }, 0);
  }, [gameState.resourcePrices]);

  const getWealthState = useCallback(() => {
    const playerWorth = computeNetWorth(player);
    const aiWorth = computeNetWorth(aiPlayer);
    return {
      playerWorth,
      aiWorth,
      ratio: aiWorth > 0 ? playerWorth / aiWorth : 1
    };
  }, [aiPlayer, player, computeNetWorth]);

  const calculateOverrideCost = useCallback((target: 'player' | 'ai' = 'player') => {
    const state = target === 'ai' ? aiPlayer : player;
    const base = gameSettings.overrideCost || OVERRIDE_BASE_COST;
    const netWorth = computeNetWorth(state);
    let wealthMultiplier = 1;
    if (netWorth >= 20000) {
      wealthMultiplier = 3;
    } else if (netWorth >= 10000) {
      wealthMultiplier = 2;
    } else if (netWorth >= 5000) {
      wealthMultiplier = 1.5;
    }

    const used = state?.overridesUsedToday || 0;
    const scaled = base * Math.pow(2, used);
    return Math.floor(scaled * wealthMultiplier);
  }, [aiPlayer, player, computeNetWorth, gameSettings.overrideCost]);

  const getUnderdogBonus = useCallback((perspective: 'player' | 'ai') => {
    const { playerWorth, aiWorth } = getWealthState();
    if (gameState.selectedMode !== 'ai') {
      return { isUnderdog: false, ratio: 1, leader: null as null | 'player' | 'ai' };
    }

    const playerBehind = playerWorth < aiWorth;
    const aiBehind = aiWorth < playerWorth;
    const leader = playerWorth > aiWorth ? 'player' : (aiWorth > playerWorth ? 'ai' : null);
    const isUnderdog = perspective === 'player' ? playerBehind : aiBehind;
    const deficitRatio = perspective === 'player'
      ? (aiWorth > 0 ? playerWorth / aiWorth : 1)
      : (playerWorth > 0 ? aiWorth / playerWorth : 1);

    return { isUnderdog, ratio: deficitRatio, leader };
  }, [getWealthState, gameState.selectedMode]);

  const getOverrideFatigueIncrement = (used: number) => {
    if (used === 0) return 0;
    if (used === 1) return 0.03;
    return 0.05;
  };

  // =========================================
  // AI DECISION MAKING ENGINE
  // =========================================

  const calculateAiRegionalBonus = useCallback((resource: string, region: string) => {
    const resourceCategory = RESOURCE_CATEGORIES[resource];
    const localResources = REGIONAL_RESOURCES[region] || [];

    if (!localResources.includes(resource)) {
      if (resourceCategory === 'food' && ['WA', 'SA', 'NT'].includes(region)) {
        return 1.2;
      }
      if (resourceCategory === 'luxury' && ['NSW', 'VIC', 'ACT'].includes(region)) {
        return 1.15;
      }
      if (resourceCategory === 'energy' && ['NSW', 'VIC', 'QLD'].includes(region)) {
        return 1.1;
      }
    }
    return 1.0;
  }, []);

  const calculateAiSupplyDemandModifier = useCallback((resource: string) => {
    const soldAmount = gameState.supplyDemand[resource] || 0;
    const reduction = Math.min(0.25, soldAmount * 0.01);
    return 1 - reduction;
  }, [gameState.supplyDemand]);

  // CRITICAL FIX: Price calculation with bounds checking and validation
  const calculateAiSalePrice = useCallback((resource, aiState, resourcePrices) => {
    // Validate base price
    let price = resourcePrices[resource];
    if (typeof price !== 'number' || price < 0 || !isFinite(price)) {
      console.warn(`Invalid base price for ${resource}: ${price}, using default 100`);
      price = 100;
    }

    // Accumulate all multipliers before applying (more accurate than sequential Math.floor)
    let multiplier = 1.0;

    if (gameSettings.aiUsesMarketModifiers) {
      const regionalBonus = calculateAiRegionalBonus(resource, aiState.currentRegion);
      if (isFinite(regionalBonus) && regionalBonus > 0) {
        multiplier *= regionalBonus;
      }

      const supplyDemandMod = calculateAiSupplyDemandModifier(resource);
      if (isFinite(supplyDemandMod) && supplyDemandMod > 0) {
        multiplier *= supplyDemandMod;
      }

      gameState.activeEvents.forEach(event => {
        const eventPriceMod = event.effect?.resourcePrice?.[resource];
        if (eventPriceMod && isFinite(eventPriceMod) && eventPriceMod > 0) {
          multiplier *= eventPriceMod;
        }
      });

      const resourceCategory = RESOURCE_CATEGORIES[resource];
      const seasonMod = SEASON_EFFECTS[gameState.season]?.resourcePriceModifier?.[resourceCategory];
      if (seasonMod && isFinite(seasonMod) && seasonMod > 0) {
        multiplier *= seasonMod;
      }
    }

    const { isUnderdog, leader } = getUnderdogBonus('ai');
    if (isUnderdog) {
      multiplier *= 1.15;
    }
    if (leader === 'ai' && getWealthState().ratio < 0.5) {
      multiplier *= 0.95;
    }

    if (aiState.character.name === "Businessman") {
      multiplier *= 1.1;
    }

    if (aiState.masteryUnlocks.includes("Investment Genius")) {
      multiplier *= 1.15;
    }

    if (gameSettings.aiSpecialAbilitiesEnabled && aiActiveSpecialAbilityRef.current === 'Market Insight') {
      const abilityMult = AI_SPECIAL_ABILITY_EFFECTS.marketInsightMultiplier;
      if (abilityMult && isFinite(abilityMult) && abilityMult > 0) {
        multiplier *= abilityMult;
      }
    }

    if (gameSettings.sabotageEnabled) {
      const sabotageMultiplier = getSabotageSellMultiplier(aiState.debuffs);
      if (sabotageMultiplier && isFinite(sabotageMultiplier) && sabotageMultiplier > 0) {
        multiplier *= sabotageMultiplier;
      }
    }

    // Apply accumulated multiplier once
    let finalPrice = Math.floor(price * multiplier);

    // Enforce bounds to prevent extreme values
    const MIN_PRICE = 10;
    const MAX_PRICE = 10000;
    finalPrice = Math.max(MIN_PRICE, Math.min(MAX_PRICE, finalPrice));

    // Final validation
    if (!isFinite(finalPrice) || finalPrice <= 0) {
      console.error(`Price calculation failed for ${resource}, using minimum: ${finalPrice}`);
      return MIN_PRICE;
    }

    return finalPrice;
  }, [gameSettings.aiUsesMarketModifiers, gameSettings.aiSpecialAbilitiesEnabled, gameSettings.sabotageEnabled, gameState.activeEvents, gameState.season, calculateAiRegionalBonus, calculateAiSupplyDemandModifier, getUnderdogBonus, getWealthState]);

  const calculateAiSuccessChance = useCallback((challenge, aiState) => {
    const baseChance = 0.5;
    const statBonus = (aiState.stats[
      challenge.type === "physical" ? "strength" :
      challenge.type === "social" ? "charisma" :
      challenge.type === "wildlife" ? "luck" : "intelligence"
    ] || 3) * 0.05;
    
    const difficultyPenalty = challenge.difficulty * 0.1;
    const characterBonus = aiState.character.name === "Tourist" ? 0.1 : 0;
    const levelBonus = aiState.level * 0.02;

    let weatherEffect = 0;
    let seasonEffect = 0;
    let eventBonus = 0;
    if (gameSettings.aiUsesMarketModifiers) {
      weatherEffect = WEATHER_EFFECTS[gameState.weather]?.challengeModifier?.[challenge.type] || 0;
      seasonEffect = SEASON_EFFECTS[gameState.season]?.challengeModifier?.[challenge.type] || 0;
      gameState.activeEvents.forEach(event => {
        if (event.region === aiState.currentRegion && event.effect?.challengeBonus?.[challenge.type]) {
          eventBonus += event.effect.challengeBonus[challenge.type];
        }
      });
    }

    const equipmentEffects = gameSettings.equipmentShopEnabled &&
      !(gameSettings.sabotageEnabled && isEquipmentJammed(aiState.debuffs))
      ? getEquipmentEffects(aiState.equipment)
      : null;
    const equipmentBonus = equipmentEffects?.challengeBonus?.[challenge.type] || 0;
    const { isUnderdog, leader } = getUnderdogBonus('ai');
    const underdogBonus = isUnderdog ? 0.1 : 0;
    const leaderPenalty = leader === 'ai' && getWealthState().ratio < 0.5 ? 0.05 : 0;
    const fatiguePenalty = aiState.overrideFatigue || 0;
    const sabotagePenalty = gameSettings.sabotageEnabled ? getSabotageChallengePenalty(aiState.debuffs) : 0;

    let abilityBonus = 0;
    let guaranteeSuccess = false;
    if (gameSettings.aiSpecialAbilitiesEnabled) {
      if (aiActiveSpecialAbilityRef.current === 'Tourist Luck') {
        abilityBonus = AI_SPECIAL_ABILITY_EFFECTS.touristLuckBonus;
      }
      if (aiActiveSpecialAbilityRef.current === 'Calculate Odds' &&
          challenge.difficulty <= AI_SPECIAL_ABILITY_EFFECTS.calculateOddsMaxDifficulty) {
        guaranteeSuccess = true;
      }
    }

    if (guaranteeSuccess) {
      return 1.0;
    }

    return Math.min(
      0.98,
      Math.max(
        0.1,
        baseChance + statBonus - difficultyPenalty + characterBonus + levelBonus +
          weatherEffect + seasonEffect + eventBonus + underdogBonus - leaderPenalty - fatiguePenalty - sabotagePenalty + abilityBonus + equipmentBonus
      )
    );
  }, [gameSettings.aiUsesMarketModifiers, gameSettings.aiSpecialAbilitiesEnabled, gameSettings.equipmentShopEnabled, gameSettings.sabotageEnabled, gameState.weather, gameState.season, gameState.activeEvents, getUnderdogBonus, getWealthState]);

  const calculateAiTravelCost = useCallback((fromRegion, toRegion, aiState) => {
    let weatherModifier = 1.0;
    let seasonModifier = 1.0;
    let eventModifier = 1.0;
    const equipmentEffects = gameSettings.equipmentShopEnabled &&
      !(gameSettings.sabotageEnabled && isEquipmentJammed(aiState.debuffs))
      ? getEquipmentEffects(aiState.equipment)
      : null;
    const equipmentDiscount = equipmentEffects?.travelDiscount || 0;
    if (gameSettings.aiUsesMarketModifiers) {
      weatherModifier = WEATHER_EFFECTS[gameState.weather]?.travelCostModifier || 1.0;
      seasonModifier = SEASON_EFFECTS[gameState.season]?.travelCostModifier || 1.0;
      gameState.activeEvents.forEach(event => {
        if (event.region === toRegion && event.effect?.travelCost) {
          eventModifier *= event.effect.travelCost;
        }
      });
    }

    if (ADJACENT_REGIONS[fromRegion]?.includes(toRegion)) {
      let baseCost = 200;
      if (aiState.character.name === "Explorer") {
        baseCost *= 0.75;
      }
      if (aiState.masteryUnlocks.includes("Pathfinder")) {
        return 0;
      }
      if (gameSettings.aiSpecialAbilitiesEnabled && aiActiveSpecialAbilityRef.current === 'Scout Ahead') {
        baseCost *= AI_SPECIAL_ABILITY_EFFECTS.scoutAheadTravelMultiplier;
      }
      baseCost = baseCost * weatherModifier * seasonModifier * eventModifier;
      if (equipmentDiscount > 0) {
        baseCost = baseCost * (1 - equipmentDiscount);
      }
      return Math.floor(baseCost);
    }
    
    let baseCost = toRegion === "TAS" ? 800 : 500;
    if (aiState.character.name === "Explorer") {
      baseCost *= 0.75;
    }
    if (aiState.masteryUnlocks.includes("Fast Travel")) {
      return 300;
    }
    if (gameSettings.aiSpecialAbilitiesEnabled && aiActiveSpecialAbilityRef.current === 'Scout Ahead') {
      baseCost *= AI_SPECIAL_ABILITY_EFFECTS.scoutAheadTravelMultiplier;
    }
    baseCost = baseCost * weatherModifier * seasonModifier * eventModifier;
    if (equipmentDiscount > 0) {
      baseCost = baseCost * (1 - equipmentDiscount);
    }
    const { isUnderdog, leader } = getUnderdogBonus('ai');
    if (isUnderdog) {
      baseCost *= 0.75;
    }
    if (leader === 'ai' && getWealthState().ratio < 0.5) {
      baseCost *= 1.05;
    }
    return Math.floor(baseCost);
  }, [gameSettings.aiUsesMarketModifiers, gameSettings.aiSpecialAbilitiesEnabled, gameSettings.equipmentShopEnabled, gameSettings.sabotageEnabled, gameState.weather, gameState.season, gameState.activeEvents, getUnderdogBonus, getWealthState]);

  // AI Strategy: Evaluate best challenge to take
  const evaluateChallenge = useCallback((challenge, aiState, difficulty) => {
    // Check if AI can afford minimum wager
    if (aiState.money < MINIMUM_WAGER) {
      return {
        challenge,
        score: -Infinity, // Can't afford challenge
        successChance: 0,
        wager: 0,
        expectedValue: 0
      };
    }

    const wealth = getWealthState();
    const aiRatio = wealth.aiWorth > 0 ? wealth.aiWorth / Math.max(wealth.playerWorth, 1) : 1;
    let postureRisk = 1;
    if (aiRatio < 0.7) postureRisk = 1.4; // losing badly
    else if (aiRatio < 0.9) postureRisk = 1.15; // slightly behind
    else if (aiRatio > 1.3) postureRisk = 0.85; // protect lead
    else if (aiRatio > 1.1) postureRisk = 0.95;

    const successChance = calculateAiSuccessChance(challenge, aiState);
    const maxWager = Math.min(aiState.money, Math.floor(500 * postureRisk));
    const actualWager = Math.max(MINIMUM_WAGER, maxWager); // Ensure at least minimum wager
    const potentialReward = actualWager * challenge.reward;
    const expectedValue = potentialReward * successChance - actualWager * (1 - successChance);

    // Adjust for difficulty profile
    const profile = AI_DIFFICULTY_PROFILES[difficulty];
    const riskAdjusted = expectedValue * profile.riskTolerance * postureRisk;

    // Bonus for strategy match
    let strategyBonus = 0;
    if (aiState.character.aiStrategy === "challenge-focused") {
      strategyBonus = 50;
    }

    return {
      challenge,
      score: riskAdjusted + strategyBonus,
      successChance,
      wager: actualWager,
      expectedValue
    };
  }, [calculateAiSuccessChance, getWealthState]);

  // AI Strategy: Evaluate best region to travel to
  const evaluateTravel = useCallback((region, aiState, difficulty, resourcePrices) => {
    if (gameSettings.sabotageEnabled && isTravelBlocked(aiState.debuffs)) {
      return { region, score: -Infinity };
    }
    const cost = calculateAiTravelCost(aiState.currentRegion, region, aiState);
    if (aiState.money < cost) return { region, score: -Infinity };
    
    // Value unvisited regions higher
    let score = aiState.visitedRegions.includes(region) ? 10 : 100;
    const wealth = getWealthState();
    const aiRatio = wealth.aiWorth > 0 ? wealth.aiWorth / Math.max(wealth.playerWorth, 1) : 1;

    if (gameState.selectedMode === 'ai') {
      if (player.currentRegion === region) {
        score += 80; // compete directly with player
      }
      if (!(player.visitedRegions || []).includes(region)) {
        score += 40; // race to new areas
      }
    }
    
    // Value resource richness
    const regionResources = REGIONAL_RESOURCES[region] || [];
    if (regionResources.length > 0) {
      const avgResourceValue = regionResources.reduce((sum, r) =>
        sum + (resourcePrices[r] || 100), 0) / regionResources.length;
      score += avgResourceValue * 0.5;
    }
    
    // Value uncompleted challenges
    const regionChallenges = REGIONS[region]?.challenges || [];
    const uncompletedChallenges = regionChallenges.filter(c => 
      !(aiState.completedThisSeason || []).includes(c.name)
    ).length;
    score += uncompletedChallenges * 30;
    
    // Penalize by cost
    score -= cost * 0.5;
    
    // Strategy bonuses
    if (aiState.character.aiStrategy === "exploration-focused") {
      score += aiState.visitedRegions.includes(region) ? 0 : 150;
    }

    // Penalize travel if inventory is full (can't collect resources)
    const inventoryFullness = aiState.inventory.length / MAX_INVENTORY;
    if (inventoryFullness >= 1.0) {
      // Only travel for challenges, not resources
      score = score * 0.3;
    } else if (inventoryFullness > 0.8) {
      score = score * 0.7; // Reduce travel priority when near full
    }

    if (aiRatio > 1.3) {
      score *= 0.9; // conservative when ahead
    } else if (aiRatio < 0.8) {
      score *= 1.1; // aggressive travel when behind
    }

    return { region, score, cost };
  }, [calculateAiTravelCost, gameSettings.sabotageEnabled, getWealthState, gameState.selectedMode, player]);

  // AI Strategy: Evaluate which resource to sell
  const evaluateResourceSale = useCallback((resource, aiState, resourcePrices) => {
    const price = calculateAiSalePrice(resource, aiState, resourcePrices);
    let score = price;

    // Consider inventory count
    const count = aiState.inventory.filter(r => r === resource).length;
    if (count > 3) score *= 1.2; // Sell duplicates

    // Prioritize selling when inventory is getting full
    const inventoryFullness = aiState.inventory.length / MAX_INVENTORY;
    if (inventoryFullness > 0.8) {
      score *= 2.0; // Urgently sell when >80% full
    } else if (inventoryFullness > 0.6) {
      score *= 1.5; // Prioritize selling when >60% full
    }

    return { resource, score, price };
  }, [calculateAiSalePrice]);

  // AI Strategy: Evaluate special ability usage
  const evaluateSpecialAbility = useCallback((aiState, gameState) => {
    if (!gameSettings.aiSpecialAbilitiesEnabled) return -Infinity;
    const ability = aiState.character.specialAbility;
    if (!ability || aiState.specialAbilityUses <= 0) return -Infinity;

    let score = 0;
    const underdogState = getUnderdogBonus('ai');
    const currentRegion = REGIONS[aiState.currentRegion];

    switch (ability.name) {
      case "Tourist Luck":
        // Use if we have risky challenges available
        const riskyChallenges = currentRegion?.challenges.filter(c =>
          !(aiState.completedThisSeason || []).includes(c.name) &&
          c.difficulty >= 2
        ) || [];
        score = riskyChallenges.length > 0 ? 80 : 0;
        if (underdogState.isUnderdog) score *= 1.2;
        break;

      case "Market Insight":
        // Use if we have resources to sell
        score = aiState.inventory.length > 5 ? 100 : 30;
        break;

      case "Scout Ahead":
        // Use if we're planning to travel
        const unvisitedRegions = Object.keys(REGIONS).filter(r =>
          r !== aiState.currentRegion && !aiState.visitedRegions.includes(r)
        );
        score = unvisitedRegions.length > 0 ? 60 : 20;
        break;

      case "Calculate Odds":
        // Use on easy challenges for guaranteed win
        const easyChallenges = currentRegion?.challenges.filter(c =>
          !(aiState.completedThisSeason || []).includes(c.name) &&
          c.difficulty < 2 &&
          aiState.money >= MINIMUM_WAGER
        ) || [];
        score = easyChallenges.length > 0 ? 150 : 0; // High priority for guaranteed win
        if (!underdogState.isUnderdog) score *= 0.9;
        break;

      default:
        score = 0;
    }

    return score;
  }, [gameSettings.aiSpecialAbilitiesEnabled, getUnderdogBonus]);

  const evaluateInvestment = useCallback((regionCode, aiState) => {
    if (!gameSettings.investmentsEnabled) return { region: regionCode, score: -Infinity };
    const investment = REGIONAL_INVESTMENTS[regionCode];
    if (!investment) return { region: regionCode, score: -Infinity };
    if ((aiState.investments || []).includes(regionCode)) {
      return { region: regionCode, score: -Infinity };
    }
    const daysRemaining = Math.max(0, gameSettings.totalDays - gameState.day);
    if (daysRemaining <= 1) return { region: regionCode, score: -Infinity };
    if (aiState.money - investment.cost < AI_SAFETY_BUFFER) {
      return { region: regionCode, score: -Infinity };
    }
    const roiValue = (investment.dailyIncome * daysRemaining) - investment.cost;
    if (roiValue <= 0) return { region: regionCode, score: -Infinity };

    let score = roiValue * 0.12;
    if (aiState.character.aiStrategy === "money-focused") {
      score *= 1.2;
    } else if (aiState.character.aiStrategy === "exploration-focused") {
      score *= 0.85;
    }
    return { region: regionCode, score, investment };
  }, [gameSettings.investmentsEnabled, gameSettings.totalDays, gameState.day]);

  const evaluateEquipmentPurchase = useCallback((item, aiState) => {
    if (!gameSettings.equipmentShopEnabled) return { item, score: -Infinity };
    if (!EQUIPMENT_SHOP_REGIONS.includes(aiState.currentRegion)) {
      return { item, score: -Infinity };
    }
    if ((aiState.equipment || []).includes(item.id)) {
      return { item, score: -Infinity };
    }
    if (aiState.money - item.cost < AI_SAFETY_BUFFER) {
      return { item, score: -Infinity };
    }

    const strategy = aiState.character.aiStrategy;
    const tag = item.tags?.[0] || "balanced";
    let weight = 1.0;
    if (strategy === "exploration-focused") {
      weight = tag === "travel" ? 1.4 : 0.9;
    } else if (strategy === "challenge-focused") {
      weight = tag === "challenge" ? 1.4 : 0.95;
    } else if (strategy === "money-focused") {
      weight = tag === "xp" ? 1.2 : 0.95;
    }

    const effectScore =
      (item.effects?.travelDiscount || 0) * 500 +
      (item.effects?.xpBonus || 0) * 450 +
      Object.values(item.effects?.challengeBonus || {}).reduce((sum, value) => sum + (value as number), 0) * 550;
    const daysRemaining = Math.max(1, gameSettings.totalDays - gameState.day);
    const timeFactor = Math.min(1.5, 0.5 + (daysRemaining / gameSettings.totalDays));
    const score = (effectScore * weight * timeFactor) - (item.cost * 0.04);

    return { item, score };
  }, [gameSettings.equipmentShopEnabled, gameSettings.totalDays, gameState.day]);

  const evaluateSabotage = useCallback((action, aiState, playerState) => {
    if (!gameSettings.sabotageEnabled || gameState.selectedMode !== 'ai') {
      return { action, score: -Infinity };
    }
    const underdogState = getUnderdogBonus('ai');
    const isAggressive = gameState.aiMood === 'aggressive' || gameState.aiMood === 'desperate';
    if (!underdogState.isUnderdog && !isAggressive) {
      return { action, score: -Infinity };
    }
    if (aiState.money - action.cost < (AI_SAFETY_BUFFER + 200)) {
      return { action, score: -Infinity };
    }
    if (hasActiveDebuff(playerState.debuffs, action.id)) {
      return { action, score: -Infinity };
    }

    let score = typeof action.aiWeight === 'number' ? action.aiWeight : 100;
    if (underdogState.isUnderdog) score += 35;
    if (isAggressive) score += 20;
    score -= action.cost * 0.05;
    return { action, score };
  }, [gameSettings.sabotageEnabled, gameState.selectedMode, gameState.aiMood, getUnderdogBonus]);

  // Evaluate loan opportunities
  const evaluateLoan = useCallback((loanOption, aiState) => {
    if (!gameSettings.loansEnabled) {
      return { loanOption, score: -Infinity };
    }

    // Calculate AI net worth for loan eligibility check
    const inventoryValue = aiState.inventory.reduce((sum: number, item: string) => {
      return sum + (gameState.resourcePrices[item] || 50);
    }, 0);
    const aiNetWorth = aiState.money + inventoryValue;

    // Check if AI can take this loan using the standalone helper
    const check = canTakeLoanForAI(
      loanOption,
      aiState.loans || [],
      aiState.creditScore || 700,
      aiState.level || 1,
      aiNetWorth
    );
    if (!check.canTake) {
      return { loanOption, score: -Infinity };
    }

    // Calculate effective interest rate with credit score
    let effectiveRate = loanOption.dailyInterest;
    if (aiState.creditScore >= 750) effectiveRate -= 0.03;
    else if (aiState.creditScore >= 650) effectiveRate -= 0.01;
    else if (aiState.creditScore < 550) effectiveRate += 0.02;
    effectiveRate = Math.max(0.03, effectiveRate);

    // Calculate total debt and daily interest burden
    const currentDebt = aiState.loans.reduce((sum, l) => sum + l.amount + l.accrued, 0);
    const dailyInterestBurden = aiState.loans.reduce((sum, l) => sum + Math.floor(l.amount * l.interestRate), 0);

    // Don't take loans if already heavily in debt (unless emergency)
    const debtRatio = currentDebt / Math.max(aiState.money, 1);
    if (debtRatio > 2 && aiState.money > BANKRUPTCY_THRESHOLD) {
      return { loanOption, score: -Infinity };
    }

    // Don't take loans if daily interest is already high
    if (dailyInterestBurden > 150 && aiState.money > BANKRUPTCY_THRESHOLD) {
      return { loanOption, score: -Infinity };
    }

    // Calculate score based on need and opportunity
    let score = 0;

    // Emergency situation - need money badly
    if (aiState.money < BANKRUPTCY_THRESHOLD) {
      score = 300; // High priority
    } else if (aiState.money < 500) {
      score = 150; // Medium priority
    } else if (aiState.money < 1000) {
      score = 50; // Low priority
    } else {
      // Has money - only take loans for strategic reasons
      score = -50; // Generally avoid unless strategic
    }

    // Adjust based on loan amount and rate
    score -= effectiveRate * 1000; // Penalize high interest rates
    score += loanOption.amount * 0.05; // Bonus for larger loans (more capital to work with)

    // Character bonuses
    if (aiState.character?.name === 'Businessman') {
      score += 20; // Businessman is better at leveraging debt
    }

    // AI mood adjustments
    if (gameState.aiMood === 'aggressive') {
      score += 30; // More willing to take risks with debt
    } else if (gameState.aiMood === 'desperate') {
      score += 50; // Very willing to take loans when desperate
    } else if (gameState.aiMood === 'cautious') {
      score -= 30; // Less willing to take debt
    }

    // Credit score considerations
    if (aiState.creditScore >= 750) {
      score += 15; // Good rates make loans more attractive
    } else if (aiState.creditScore < 550) {
      score -= 20; // Bad rates make loans less attractive
    }

    return { loanOption, score, effectiveRate };
  }, [gameSettings.loansEnabled, gameState.resourcePrices, gameState.aiMood]);

  // Evaluate crafting opportunities
  const evaluateCrafting = useCallback((recipe, aiState) => {
    if (!gameSettings.craftingEnabled) {
      return { recipe, score: -Infinity };
    }

    // Check if AI can craft this recipe
    if (!canCraft(recipe, aiState.inventory)) {
      return { recipe, score: -Infinity };
    }

    // Check action limits
    if (gameSettings.actionLimitsEnabled &&
        aiState.actionsUsedThisTurn + recipe.craftTime > gameSettings.aiActionsPerDay) {
      return { recipe, score: -Infinity };
    }

    // Check inventory space
    if (aiState.inventory.length >= MAX_INVENTORY) {
      return { recipe, score: -Infinity };
    }

    // Calculate profit potential
    const craftValue = calculateCraftValue(recipe, aiState.character, aiState.masteryUnlocks);
    const inputCost = Object.entries(recipe.inputs).reduce((sum, [resource, qty]) => {
      const price = gameState.resourcePrices[resource] || 50;
      return sum + (price * (qty as number));
    }, 0);
    const profit = craftValue - inputCost;

    // Don't craft if unprofitable
    if (profit <= 0) {
      return { recipe, score: -Infinity };
    }

    // Calculate score based on profit margin and value
    let score = profit * 0.5; // Base score from profit
    score += craftValue * 0.2; // Bonus for high-value items

    // Character bonuses
    if (aiState.character?.name === 'Businessman') {
      score += 25; // Businessman is better at crafting for profit
    } else if (aiState.character?.name === 'Scientist') {
      score += 20; // Scientist has better success rate
    }

    // Prefer crafting when inventory is getting full of raw materials
    const inventoryRatio = aiState.inventory.length / MAX_INVENTORY;
    if (inventoryRatio > 0.7) {
      score += 30; // Higher priority to consolidate inventory
    }

    // AI mood adjustments
    if (gameState.aiMood === 'confident' || gameState.aiMood === 'aggressive') {
      score += 15; // More likely to craft when confident
    }

    return { recipe, score, profit, craftValue };
  }, [gameSettings.craftingEnabled, gameSettings.actionLimitsEnabled, gameSettings.aiActionsPerDay]);

  // Main AI decision engine
  const makeAiDecision = useCallback((aiState, gameState, playerState) => {
    try {
      const difficulty = gameState.aiDifficulty;
      const profile = AI_DIFFICULTY_PROFILES[difficulty];

      // Validate AI state
      if (!aiState || !aiState.currentRegion || !REGIONS[aiState.currentRegion]) {
        console.error('Invalid AI state or region:', aiState);
        return {
          type: 'end_turn',
          description: 'Invalid state - ending turn',
          data: null,
          score: 0
        };
      }

      // Sometimes make mistakes based on difficulty
      if (aiRandom() < profile.mistakeChance) {
        return {
          type: 'think',
          description: 'Contemplating strategy...',
          data: null
        };
      }

      const decisions: Array<{ type: string; description: string; data: any; score: number }> = [];

      // Evaluate special ability usage
      if (gameSettings.aiSpecialAbilitiesEnabled &&
          !aiActiveSpecialAbilityRef.current &&
          aiState.specialAbilityUses > 0 &&
          aiState.character?.specialAbility) {
        const abilityScore = evaluateSpecialAbility(aiState, gameState);
        if (abilityScore > 0) {
          decisions.push({
            type: 'special_ability',
            description: `Use ${aiState.character.specialAbility.name}`,
            data: { ability: aiState.character.specialAbility },
            score: abilityScore * profile.decisionQuality
          });
        }
      }

      // Evaluate investments
      if (gameSettings.investmentsEnabled) {
        Object.keys(REGIONAL_INVESTMENTS).forEach(regionCode => {
          const evaluation = evaluateInvestment(regionCode, aiState);
          if (evaluation.score > 0) {
            decisions.push({
              type: 'invest',
              description: `Invest in ${REGIONS[regionCode]?.name || regionCode}`,
              data: { region: regionCode },
              score: evaluation.score * profile.decisionQuality
            });
          }
        });
      }

      // Evaluate equipment purchases
      if (gameSettings.equipmentShopEnabled) {
        SHOP_ITEMS.forEach(item => {
          const evaluation = evaluateEquipmentPurchase(item, aiState);
          if (evaluation.score > 0) {
            decisions.push({
              type: 'buy_equipment',
              description: `Buy ${item.name}`,
              data: { itemId: item.id },
              score: evaluation.score * profile.decisionQuality
            });
          }
        });
      }

      // Evaluate sabotage actions
      if (gameSettings.sabotageEnabled && gameState.selectedMode === 'ai') {
        SABOTAGE_ACTIONS.forEach(action => {
          const evaluation = evaluateSabotage(action, aiState, playerState);
          if (evaluation.score > 0) {
            decisions.push({
              type: 'sabotage',
              description: `Sabotage: ${action.name}`,
              data: { sabotageId: action.id },
              score: evaluation.score * profile.decisionQuality
            });
          }
        });
      }

      // Evaluate crafting recipes
      if (gameSettings.craftingEnabled) {
        CRAFTING_RECIPES.forEach(recipe => {
          const evaluation = evaluateCrafting(recipe, aiState);
          if (evaluation.score > 0) {
            decisions.push({
              type: 'craft',
              description: `Craft ${recipe.name}`,
              data: { recipeId: recipe.id, craftValue: evaluation.craftValue },
              score: evaluation.score * profile.decisionQuality
            });
          }
        });
      }

      // Evaluate loan options
      if (gameSettings.loansEnabled) {
        LOAN_OPTIONS.forEach(loanOption => {
          const evaluation = evaluateLoan(loanOption, aiState);
          if (evaluation.score > 0) {
            decisions.push({
              type: 'take_loan',
              description: `Take ${loanOption.name} ($${loanOption.amount})`,
              data: { loanOptionId: loanOption.id, effectiveRate: evaluation.effectiveRate },
              score: evaluation.score * profile.decisionQuality
            });
          }
        });
      }

      // Evaluate challenges in current region
      const currentRegion = REGIONS[aiState.currentRegion];
      const availableChallenges = currentRegion?.challenges.filter(c =>
        !(aiState.completedThisSeason || []).includes(c.name)
      ) || [];

      availableChallenges.forEach(challenge => {
        try {
          const evaluation = evaluateChallenge(challenge, aiState, difficulty);
          if (evaluation.score > 0 && aiState.money >= evaluation.wager) {
            decisions.push({
              type: 'challenge',
              description: `Attempt ${challenge.name}`,
              data: { challenge, wager: evaluation.wager, successChance: evaluation.successChance },
              score: evaluation.score * profile.decisionQuality
            });
          }
        } catch (error) {
          console.error('Error evaluating challenge:', challenge, error);
        }
      });

      // Evaluate travel options
      Object.keys(REGIONS).forEach(region => {
        if (region !== aiState.currentRegion) {
          try {
            const evaluation = evaluateTravel(region, aiState, difficulty, gameState.resourcePrices);
            if (evaluation.score > 0) {
              decisions.push({
                type: 'travel',
                description: `Travel to ${REGIONS[region].name}`,
                data: { region, cost: evaluation.cost },
                score: evaluation.score * profile.decisionQuality
              });
            }
          } catch (error) {
            console.error('Error evaluating travel to region:', region, error);
          }
        }
      });

      // Evaluate selling resources
      const uniqueResources = Array.from(new Set(aiState.inventory));
      uniqueResources.forEach(resource => {
        try {
          const evaluation = evaluateResourceSale(resource, aiState, gameState.resourcePrices);
          if (evaluation.score > 100) { // Only sell if price is decent
            decisions.push({
              type: 'sell',
              description: `Sell ${resource}`,
              data: { resource, price: evaluation.price },
              score: evaluation.score * profile.decisionQuality
            });
          }
        } catch (error) {
          console.error('Error evaluating resource sale:', resource, error);
        }
      });

      // If we have good options, choose the best one
      if (decisions.length > 0) {
        decisions.sort((a, b) => b.score - a.score);
        const bestDecision = decisions[0];

        // Add some randomness to make AI less predictable
        const randomIndex = Math.floor(aiRandom() * Math.min(3, decisions.length));
        return decisions[randomIndex];
      }

      // No good options, end turn
      return {
        type: 'end_turn',
        description: 'Ending turn',
        data: null,
        score: 0
      };
    } catch (error) {
      console.error('Critical error in AI decision making:', error);
      // Graceful fallback - end turn
      return {
        type: 'end_turn',
        description: 'Error - ending turn safely',
        data: null,
        score: 0
      };
    }
  }, [
    aiRandom,
    evaluateChallenge,
    evaluateTravel,
    evaluateResourceSale,
    evaluateSpecialAbility,
    evaluateInvestment,
    evaluateEquipmentPurchase,
    evaluateSabotage,
    gameSettings.aiSpecialAbilitiesEnabled,
    gameSettings.investmentsEnabled,
    gameSettings.equipmentShopEnabled,
    gameSettings.sabotageEnabled,
    gameState.selectedMode
  ]);

  // CRITICAL FIX: Execute AI action with async/await for state consistency
  // Returns Promise<boolean> indicating success/failure
  const executeAiAction = useCallback(async (action: AIAction): Promise<boolean> => {
    setCurrentAiAction(action);

    // Get fresh AI state from ref to avoid stale closure
    const currentAi = aiPlayerRef.current;
    if (!action || !action.type) {
      console.error('Invalid action provided to executeAiAction');
      return false;
    }
    const actionData = action.data || {};

    // Validate action before execution
    try {
      switch (action.type) {
        case 'challenge':
          const challenge = actionData.challenge;
          const wager = actionData.wager;
          if (!challenge || typeof challenge.name !== 'string' || typeof challenge.reward !== 'number' || typeof challenge.difficulty !== 'number') {
            console.error('Invalid challenge action payload:', actionData);
            return false;
          }
          if (typeof wager !== 'number') {
            console.error('Invalid challenge wager:', actionData);
            return false;
          }
          // Validate AI has money for wager
          if (typeof wager === 'number' && currentAi.money < wager) {
            addNotification(`🤖 ${currentAi.name} can't afford challenge (needs $${wager})`, 'ai', false);
            return false;
          }
          break;

        case 'travel':
          const region = actionData.region;
          const cost = actionData.cost;
          if (typeof region !== 'string' || !REGIONS[region]) {
            console.error('Invalid region:', region);
            return false;
          }
          if (typeof cost !== 'number') {
            console.error('Invalid travel cost:', actionData);
            return false;
          }
          // Validate AI has money for travel
          if (typeof cost === 'number' && currentAi.money < cost) {
            addNotification(`🤖 ${currentAi.name} can't afford travel (needs $${cost})`, 'ai', false);
            return false;
          }
          // Validate region exists
          if (region && !REGIONS[region]) {
            console.error('Invalid region:', region);
            return false;
          }
          break;

        case 'sell':
          const resource = actionData.resource;
          if (typeof resource !== 'string') {
            console.error('Invalid resource in sell action:', actionData);
            return false;
          }
          // Validate AI has resource in inventory
          if (resource && !currentAi.inventory.includes(resource)) {
            addNotification(`🤖 ${currentAi.name} doesn't have ${resource} to sell`, 'ai', false);
            return false;
          }
          break;

        case 'invest':
          if (!gameSettings.investmentsEnabled) return false;
          const investRegion = actionData.region;
          const investment = typeof investRegion === 'string' ? REGIONAL_INVESTMENTS[investRegion] : null;
          if (!investment) {
            console.error('Invalid investment action payload:', actionData);
            return false;
          }
          if ((currentAi.investments || []).includes(investRegion)) {
            return false;
          }
          if (currentAi.money < investment.cost) {
            addNotification(`🤖 ${currentAi.name} can't afford ${investment.name}`, 'ai', false);
            return false;
          }
          break;

        case 'buy_equipment':
          if (!gameSettings.equipmentShopEnabled) return false;
          const itemId = actionData.itemId;
          const item = SHOP_ITEMS.find(candidate => candidate.id === itemId);
          if (!item) {
            console.error('Invalid equipment action payload:', actionData);
            return false;
          }
          if (!EQUIPMENT_SHOP_REGIONS.includes(currentAi.currentRegion)) {
            return false;
          }
          if ((currentAi.equipment || []).includes(item.id)) {
            return false;
          }
          if (currentAi.money < item.cost) {
            addNotification(`🤖 ${currentAi.name} can't afford ${item.name}`, 'ai', false);
            return false;
          }
          break;

        case 'sabotage':
          if (!gameSettings.sabotageEnabled || gameState.selectedMode !== 'ai') return false;
          const sabotageId = actionData.sabotageId;
          const sabotage = SABOTAGE_ACTIONS.find(candidate => candidate.id === sabotageId);
          if (!sabotage) {
            console.error('Invalid sabotage action payload:', actionData);
            return false;
          }
          if (currentAi.money < sabotage.cost) {
            addNotification(`🤖 ${currentAi.name} can't afford sabotage`, 'ai', false);
            return false;
          }
          if (hasActiveDebuff(player.debuffs, sabotageId)) {
            return false;
          }
          break;

        case 'special_ability':
          const ability = actionData.ability;
          if (!gameSettings.aiSpecialAbilitiesEnabled) {
            return false;
          }
          if (!ability || typeof ability.name !== 'string') {
            console.error('Invalid special ability action payload:', actionData);
            return false;
          }
          if (aiActiveSpecialAbilityRef.current) {
            return false;
          }
          // Validate AI has special ability uses left
          if (currentAi.specialAbilityUses <= 0) {
            addNotification(`🤖 ${currentAi.name} has no special ability uses left`, 'ai', false);
            return false;
          }
          break;

        case 'craft':
          if (!gameSettings.craftingEnabled) return false;
          const recipeId = actionData.recipeId;
          const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
          if (!recipe) {
            console.error('Invalid craft action payload:', actionData);
            return false;
          }
          // Validate AI can craft this recipe
          if (!canCraft(recipe, currentAi.inventory)) {
            addNotification(`🤖 ${currentAi.name} missing resources for ${recipe.name}`, 'ai', false);
            return false;
          }
          // Validate action limits
          if (gameSettings.actionLimitsEnabled &&
              currentAi.actionsUsedThisTurn + recipe.craftTime > gameSettings.aiActionsPerDay) {
            return false;
          }
          // Validate inventory space
          if (currentAi.inventory.length >= MAX_INVENTORY) {
            addNotification(`🤖 ${currentAi.name}'s inventory is full`, 'ai', false);
            return false;
          }
          break;

        case 'take_loan':
          if (!gameSettings.loansEnabled) return false;
          const loanOptionId = actionData.loanOptionId;
          const loanOption = LOAN_OPTIONS.find(opt => opt.id === loanOptionId);
          if (!loanOption) {
            console.error('Invalid loan action payload:', actionData);
            return false;
          }
          // Validate AI can take this loan
          const aiInventoryValue = currentAi.inventory.reduce((sum: number, item: string) => {
            return sum + (gameState.resourcePrices[item] || 50);
          }, 0);
          const aiNetWorth = currentAi.money + aiInventoryValue;
          const loanCheck = canTakeLoanForAI(
            loanOption,
            currentAi.loans || [],
            currentAi.creditScore || 700,
            currentAi.level || 1,
            aiNetWorth
          );
          if (!loanCheck.canTake) {
            addNotification(`🤖 ${currentAi.name} cannot take ${loanOption.name}: ${loanCheck.reason}`, 'ai', false);
            return false;
          }
          break;
      }
    } catch (error) {
      console.error('Action validation error:', error);
      return false;
    }

    // Execute validated action
    switch (action.type) {
      case 'challenge':
        const challenge = actionData.challenge;
        const wager = actionData.wager;
        const successChance = calculateAiSuccessChance(challenge, currentAi);
        const success = aiRandom() < successChance;

        if (success) {
          let reward = Math.floor(wager * challenge.reward);

          if (currentAi.character.name === "Tourist") {
            reward = Math.floor(reward * 1.2);
          }

          if (currentAi.character.name === "Businessman") {
            reward = Math.floor(reward * 1.1);
          }

          const { isUnderdog, leader } = getUnderdogBonus('ai');
          if (leader === 'ai' && getWealthState().ratio < 0.5) {
            reward = Math.floor(reward * 0.9);
          }

          const masteryCount = (currentAi.challengeMastery?.[challenge.name] || 0) + 1;
          let masteryRewardBonus = 0;
          let masteryXpBonus = 0;
          let masteryLabel: string | null = null;
          switch (Math.min(masteryCount, 4)) {
            case 2:
              masteryRewardBonus = 0.25;
              masteryXpBonus = 0.5;
              masteryLabel = 'Mastered';
              break;
            case 3:
              masteryRewardBonus = 0.5;
              masteryXpBonus = 1.0;
              masteryLabel = 'Expert';
              break;
            case 4:
              masteryRewardBonus = 1.0;
              masteryXpBonus = 2.0;
              masteryLabel = 'Legendary';
              break;
          }
          if (masteryRewardBonus > 0) {
            reward = Math.floor(reward * (1 + masteryRewardBonus));
          }

          // Calculate XP gain and check for level up
          let xpGain = challenge.difficulty * 20;
          if (isUnderdog) {
            xpGain = Math.floor(xpGain * 1.25);
          }
          if (masteryXpBonus > 0) {
            xpGain = Math.floor(xpGain * (1 + masteryXpBonus));
          }
          if (gameSettings.equipmentShopEnabled && !(gameSettings.sabotageEnabled && isEquipmentJammed(currentAi.debuffs))) {
            const aiEquipmentEffects = getEquipmentEffects(currentAi.equipment || []);
            if (aiEquipmentEffects.xpBonus > 0) {
              xpGain = Math.floor(xpGain * (1 + aiEquipmentEffects.xpBonus));
            }
          }

          const newXp = currentAi.xp + xpGain;
          const xpForNextLevel = currentAi.level * 100;

          let levelUpData = {};
          let didLevelUp = false;

          if (newXp >= xpForNextLevel) {
            // Level up!
            didLevelUp = true;
            levelUpData = {
              xp: newXp - xpForNextLevel,
              level: currentAi.level + 1,
              stats: {
                strength: currentAi.stats.strength + 1,
                charisma: currentAi.stats.charisma + 1,
                luck: currentAi.stats.luck + 1,
                intelligence: currentAi.stats.intelligence + 1
              }
            };
          } else {
            levelUpData = {
              xp: newXp
            };
          }

          updateAiPlayerState(prev => ({
            ...prev,
            money: addMoney(prev.money, reward),
            challengesCompleted: [...prev.challengesCompleted, challenge.name],
            completedThisSeason: prev.completedThisSeason.includes(challenge.name)
              ? prev.completedThisSeason
              : [...prev.completedThisSeason, challenge.name],
            challengeMastery: { ...prev.challengeMastery, [challenge.name]: masteryCount },
            consecutiveWins: prev.consecutiveWins + 1,
            ...levelUpData
          }));

          addNotification(
            `🤖 ${currentAi.name} completed ${challenge.name} and won $${reward}!`,
            'ai',
            false
          );
          if (masteryLabel) {
            addNotification(
              `🤖 ${currentAi.name} reached ${masteryLabel} tier for ${challenge.name}`,
              'ai',
              false
            );
          }

          if (didLevelUp) {
            addNotification(
              `🤖 ${currentAi.name} leveled up to level ${currentAi.level + 1}!`,
              'levelup',
              true
            );
          }

          // Check for mastery unlocks (after state update, so we use the old level + 1)
          const newLevel = didLevelUp ? currentAi.level + 1 : currentAi.level;
          Object.entries(currentAi.character.masteryTree || {}).forEach(([name, mastery]) => {
            if (newLevel >= (mastery as any).unlockLevel && !currentAi.masteryUnlocks.includes(name)) {
              updateAiPlayerState(prev => ({
                ...prev,
                masteryUnlocks: [...prev.masteryUnlocks, name]
              }));
              addNotification(
                `🤖 ${currentAi.name} unlocked mastery: ${name}!`,
                'levelup',
                true
              );
            }
          });
        } else {
          updateAiPlayerState(prev => ({
            ...prev,
            money: deductMoney(prev.money, wager),
            consecutiveWins: 0
          }));

          addNotification(
            `🤖 ${currentAi.name} failed ${challenge.name} and lost $${wager}`,
            'ai',
            false
          );
        }
        if (gameSettings.aiSpecialAbilitiesEnabled &&
            (aiActiveSpecialAbilityRef.current === 'Tourist Luck' || aiActiveSpecialAbilityRef.current === 'Calculate Odds')) {
          setAiActiveSpecialAbility(null);
        }
        break;

      case 'travel':
        const region = actionData.region;
        const cost = actionData.cost;
        if (gameSettings.sabotageEnabled && isTravelBlocked(currentAi.debuffs)) {
          addNotification(`🤖 ${currentAi.name} couldn't travel due to sabotage`, 'ai', false);
          break;
        }
        updateAiPlayerState(prev => ({
          ...prev,
          currentRegion: region,
          money: deductMoney(prev.money, cost),
          visitedRegions: prev.visitedRegions.includes(region)
            ? prev.visitedRegions
            : [...prev.visitedRegions, region]
        }));

        // Collect resource (if inventory not full)
        const regionResources = REGIONAL_RESOURCES[region] || [];
        if (regionResources.length > 0) {
          let collectedResource = regionResources[Math.floor(aiRandom() * regionResources.length)];
          if (gameSettings.aiSpecialAbilitiesEnabled && aiActiveSpecialAbilityRef.current === 'Scout Ahead') {
            collectedResource = regionResources.reduce((best, candidate) => {
              const bestPrice = gameState.resourcePrices[best] || 100;
              const candidatePrice = gameState.resourcePrices[candidate] || 100;
              return candidatePrice > bestPrice ? candidate : best;
            }, regionResources[0]);
            setAiActiveSpecialAbility(null);
          }

          // Check inventory capacity
          if (currentAi.inventory.length < MAX_INVENTORY) {
            updateAiPlayerState(prev => ({
              ...prev,
              inventory: [...prev.inventory, collectedResource]
            }));

            addNotification(
              `🤖 ${currentAi.name} traveled to ${REGIONS[region].name} and found ${collectedResource}`,
              'ai',
              false
            );
          } else {
            addNotification(
              `🤖 ${currentAi.name} traveled to ${REGIONS[region].name} (inventory full, couldn't collect ${collectedResource})`,
              'ai',
              false
            );
          }
        } else {
          addNotification(
            `🤖 ${currentAi.name} traveled to ${REGIONS[region].name}`,
            'ai',
            false
          );
        }
        break;

      case 'sell':
        const resource = actionData.resource;
        const index = currentAi.inventory.indexOf(resource);
        if (index > -1) {
          const finalPrice = calculateAiSalePrice(resource, currentAi, gameState.resourcePrices);
          updateAiPlayerState(prev => {
            const newInventory = [...prev.inventory];
            newInventory.splice(index, 1);
            return {
              ...prev,
              inventory: newInventory,
              money: addMoney(prev.money, finalPrice)
            };
          });

          addNotification(
            `🤖 ${currentAi.name} sold ${resource} for $${finalPrice}`,
            'ai',
            false
          );
          if (gameSettings.aiAffectsEconomy) {
            dispatchGameState({ type: 'UPDATE_SUPPLY_DEMAND', payload: { resource, amount: 1 } });
          }
          if (gameSettings.aiSpecialAbilitiesEnabled && aiActiveSpecialAbilityRef.current === 'Market Insight') {
            setAiActiveSpecialAbility(null);
          }
        }
        break;

      case 'invest':
        const investRegion = actionData.region;
        const investment = REGIONAL_INVESTMENTS[investRegion];
        if (!investment) break;
        updateAiPlayerState(prev => ({
          ...prev,
          money: deductMoney(prev.money, investment.cost),
          investments: [...(prev.investments || []), investRegion]
        }));
        addNotification(
          `🤖 ${currentAi.name} invested in ${investment.name} (${REGIONS[investRegion]?.name || investRegion})`,
          'ai',
          false
        );
        break;

      case 'buy_equipment':
        const itemId = actionData.itemId;
        const item = SHOP_ITEMS.find(candidate => candidate.id === itemId);
        if (!item) break;
        updateAiPlayerState(prev => ({
          ...prev,
          money: deductMoney(prev.money, item.cost),
          equipment: [...(prev.equipment || []), item.id]
        }));
        addNotification(`🤖 ${currentAi.name} bought ${item.name}`, 'ai', false);
        break;

      case 'sabotage':
        const sabotageId = actionData.sabotageId;
        const sabotage = SABOTAGE_ACTIONS.find(candidate => candidate.id === sabotageId);
        if (!sabotage) break;
        updateAiPlayerState(prev => ({
          ...prev,
          money: deductMoney(prev.money, sabotage.cost)
        }));
        dispatchPlayer({
          type: 'MERGE_STATE',
          payload: { debuffs: upsertDebuff(player.debuffs || [], sabotage.id, sabotage.duration) }
        });
        addNotification(`🤖 ${currentAi.name} used ${sabotage.name}!`, 'ai', true);
        addNotification(`${sabotage.name} is active on you.`, 'warning', true);
        break;

      case 'special_ability':
        const ability = actionData.ability;
        if (!gameSettings.aiSpecialAbilitiesEnabled) return true; // Changed from return to return true

        // Use the special ability
        updateAiPlayerState(prev => ({
          ...prev,
          specialAbilityUses: Math.max(0, prev.specialAbilityUses - 1)
        }));
        setAiActiveSpecialAbility(ability.name);

        addNotification(
          `🤖 ${currentAi.name} used ${ability.name}!`,
          'ai',
          true
        );

        // Note: The actual effect of special abilities is applied during challenge/sell/travel
        // This just marks that the ability was used and decrements the counter
        break;

      case 'craft':
        const craftRecipeId = actionData.recipeId;
        const craftRecipe = CRAFTING_RECIPES.find(r => r.id === craftRecipeId);
        if (!craftRecipe) break;

        // Calculate success chance (95% base, 98% for Scientist)
        const craftSuccessChance = currentAi.character?.name === 'Scientist' ? 0.98 : 0.95;
        const craftSuccess = aiRandom() < craftSuccessChance;

        if (craftSuccess) {
          // Remove input resources from inventory
          const newInventory = [...currentAi.inventory];
          Object.entries(craftRecipe.inputs).forEach(([resource, qty]) => {
            for (let i = 0; i < (qty as number); i++) {
              const idx = newInventory.indexOf(resource);
              if (idx > -1) newInventory.splice(idx, 1);
            }
          });

          // Add crafted item
          newInventory.push(craftRecipe.output);

          // Update AI state
          updateAiPlayerState(prev => ({
            ...prev,
            inventory: newInventory,
            craftedItems: [...(prev.craftedItems || []), craftRecipe.output],
            actionsUsedThisTurn: (prev.actionsUsedThisTurn || 0) + (craftRecipe.craftTime - 1) // -1 because action counter is incremented below
          }));

          const craftValue = actionData.craftValue || calculateCraftValue(craftRecipe, currentAi.character, currentAi.masteryUnlocks);
          addNotification(
            `🤖 ${currentAi.name} crafted ${craftRecipe.emoji} ${craftRecipe.name} (${craftRecipe.output}) worth $${craftValue}!`,
            'ai',
            false
          );
        } else {
          // Crafting failed - consume resources anyway
          const newInventory = [...currentAi.inventory];
          Object.entries(craftRecipe.inputs).forEach(([resource, qty]) => {
            for (let i = 0; i < (qty as number); i++) {
              const idx = newInventory.indexOf(resource);
              if (idx > -1) newInventory.splice(idx, 1);
            }
          });

          updateAiPlayerState(prev => ({
            ...prev,
            inventory: newInventory,
            actionsUsedThisTurn: (prev.actionsUsedThisTurn || 0) + (craftRecipe.craftTime - 1)
          }));

          addNotification(
            `🤖 ${currentAi.name} failed to craft ${craftRecipe.name} - resources lost!`,
            'ai',
            false
          );
        }
        break;

      case 'take_loan':
        const takeLoanOptionId = actionData.loanOptionId;
        const takeLoanOption = LOAN_OPTIONS.find(opt => opt.id === takeLoanOptionId);
        if (!takeLoanOption) break;

        // Calculate effective interest rate with credit score
        let effectiveInterestRate = actionData.effectiveRate || takeLoanOption.dailyInterest;
        if (currentAi.creditScore >= 750) effectiveInterestRate = Math.max(0.03, takeLoanOption.dailyInterest - 0.03);
        else if (currentAi.creditScore >= 650) effectiveInterestRate = Math.max(0.03, takeLoanOption.dailyInterest - 0.01);
        else if (currentAi.creditScore < 550) effectiveInterestRate = takeLoanOption.dailyInterest + 0.02;

        // Create new loan
        const newLoan = {
          id: `ai-loan-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          loanType: takeLoanOption.id,
          amount: takeLoanOption.amount,
          accrued: 0,
          interestRate: effectiveInterestRate,
          turnTaken: gameState.currentTurn
        };

        // Update AI state
        updateAiPlayerState(prev => ({
          ...prev,
          money: addMoney(prev.money, takeLoanOption.amount),
          loans: [...(prev.loans || []), newLoan],
          totalLoansTaken: (prev.totalLoansTaken || 0) + 1
        }));

        addNotification(
          `🤖 ${currentAi.name} took out ${takeLoanOption.emoji} ${takeLoanOption.name} for $${takeLoanOption.amount} at ${(effectiveInterestRate * 100).toFixed(1)}%/day!`,
          'ai',
          false
        );
        break;

      case 'think':
        addNotification(
          `🤖 ${currentAi.name} is thinking...`,
          'ai',
          false
        );
        break;
    }

    // Update action counter with atomic state update
    updateAiPlayerState(prev => ({
      ...prev,
      actionsUsedThisTurn: (prev.actionsUsedThisTurn || 0) + 1
    }));
    dispatchGameState({ type: 'INCREMENT_ACTIONS' });

    // Wait for React state to settle before returning
    await new Promise(resolve => setTimeout(resolve, 10));

    return true; // Action completed successfully
  }, [
    addNotification,
    addMoney,
    aiRandom,
    calculateAiSalePrice,
    calculateAiSuccessChance,
    deductMoney,
    updateAiPlayerState,
    gameSettings.aiAffectsEconomy,
    gameSettings.aiSpecialAbilitiesEnabled,
    gameSettings.equipmentShopEnabled,
    gameSettings.investmentsEnabled,
    gameSettings.sabotageEnabled,
    gameState.resourcePrices,
    gameState.selectedMode,
    player,
    getUnderdogBonus,
    getWealthState
  ]);

  // AI Turn Management
  const performAiTurn = useCallback(async () => {
    if (gameState.currentTurn !== 'ai' || gameState.isAiThinking) return;

    dispatchGameState({ type: 'SET_AI_THINKING', payload: true });
    dispatchGameState({ type: 'RESET_ACTIONS' });

    const profile = AI_DIFFICULTY_PROFILES[gameState.aiDifficulty];
    let actionBudget = gameSettings.aiActionsPerDay;
    let actionsTaken = 0;

    addNotification(`🤖 ${aiPlayerRef.current.name}'s turn begins`, 'ai', true);

    // AI takes multiple actions per turn
    while (actionsTaken < actionBudget) {
      // Thinking delay
      const thinkingTime = profile.thinkingTimeMin +
        aiRandom() * (profile.thinkingTimeMax - profile.thinkingTimeMin);

      await new Promise(resolve => setTimeout(resolve, thinkingTime));

      // Use ref to get latest AI state (fixes stale closure issue)
      const currentAiState = aiPlayerRef.current;

      // Make decision with fresh state
      const decision = makeAiDecision(currentAiState, gameState, player);

      if (decision.type === 'end_turn') {
        addNotification(`🤖 ${currentAiState.name} has no more actions to take`, 'ai', false);
        break;
      }

      // CRITICAL FIX: Await action completion before proceeding
      const actionSuccess = await executeAiAction(decision as AIAction);

      if (!actionSuccess) {
        console.warn('AI action failed, continuing to next action');
        // Don't count failed actions toward budget
        continue;
      }

      // Small delay between actions for visibility
      await new Promise(resolve => setTimeout(resolve, 800));

      actionsTaken += 1;

      // Consider action override if AI is behind
      const aiOverrideRemaining = OVERRIDE_DAILY_CAP - (aiPlayerRef.current.overridesUsedToday || 0);
      const aiUnderdog = getUnderdogBonus('ai').isUnderdog;
      if (actionsTaken >= actionBudget && aiOverrideRemaining > 0 && aiUnderdog) {
        const overrideCost = calculateOverrideCost('ai');
        const currentAi = aiPlayerRef.current;
        if (gameSettings.allowActionOverride && currentAi.money >= overrideCost && aiRandom() < 0.6) {
          // Use atomic state update for override
          updateAiPlayerState(prev => ({
            ...prev,
            money: deductMoney(prev.money, overrideCost),
            overridesUsedToday: (prev.overridesUsedToday || 0) + 1,
            overrideFatigue: (prev.overrideFatigue || 0) + getOverrideFatigueIncrement(prev.overridesUsedToday || 0)
          }));
          actionBudget += gameSettings.aiActionsPerDay;
          addNotification(`🤖 ${currentAi.name} paid $${overrideCost} for extra actions`, 'ai', true);
        }
      }
    }

    // End AI turn
    await new Promise(resolve => setTimeout(resolve, 1000));

    addNotification(`🤖 ${aiPlayerRef.current.name} ended their turn`, 'ai', true);
    dispatchGameState({ type: 'SET_AI_THINKING', payload: false });

    // In AI mode, advance the day after AI completes their turn
    // This happens BEFORE switching back to player
    advanceDay();

    // Now switch to player turn for the new day
    dispatchGameState({ type: 'SET_TURN', payload: 'player' });
    setCurrentAiAction(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, aiPlayer, player, makeAiDecision, executeAiAction, addNotification, aiRandom, gameSettings, getUnderdogBonus, calculateOverrideCost, deductMoney, updateAiPlayerState]);

  // Auto-trigger AI turn
  useEffect(() => {
    if (gameState.gameMode === 'game' && 
        gameState.selectedMode === 'ai' && 
        gameState.currentTurn === 'ai' && 
        !gameState.isAiThinking) {
      
      aiTurnTimeoutRef.current = setTimeout(() => {
        performAiTurn();
      }, 1000);
    }
    
    return () => {
      if (aiTurnTimeoutRef.current) {
        clearTimeout(aiTurnTimeoutRef.current);
      }
    };
  }, [gameState.currentTurn, gameState.gameMode, gameState.selectedMode, gameState.isAiThinking, performAiTurn]);

  // =========================================
  // KEYBOARD SHORTCUTS
  // =========================================

  useEffect(() => {
    if (gameState.gameMode !== 'game') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === 's') {
        e.preventDefault();
        handleSaveGame();
        return;
      }

      const shortcut = KEYBOARD_SHORTCUTS[key];

      if (!shortcut) return;

      e.preventDefault();

      switch (shortcut.action) {
        case 'endTurn':
          if (gameState.currentTurn === 'player' && gameState.day < gameSettings.totalDays) {
            handleEndTurn();
          }
          break;
        case 'openChallenges':
          if (gameState.currentTurn === 'player') {
            updateUiState({ showChallenges: !uiState.showChallenges });
          }
          break;
        case 'openResources':
          if (gameState.currentTurn === 'player') {
            updateUiState({ showMarket: !uiState.showMarket });
          }
          break;
        case 'openMap':
          updateUiState({ showMap: !uiState.showMap });
          break;
        case 'openTravel':
          if (gameState.currentTurn === 'player') {
            updateUiState({ showTravelModal: !uiState.showTravelModal });
          }
          break;
        case 'openNotifications':
          updateUiState({ showNotifications: !uiState.showNotifications });
          break;
        case 'openProgress':
          updateUiState({ showProgress: !uiState.showProgress });
          break;
        case 'toggleHelp':
          updateUiState({ showHelp: !uiState.showHelp });
          break;
        case 'closeModal':
          updateUiState({
            showChallenges: false,
            showMarket: false,
            showTravelModal: false,
            showShop: false,
            showInvestments: false,
            showSabotage: false,
            showStats: false,
            showNotifications: false,
            showProgress: false,
            showHelp: false,
            showAiStats: false
          });
          closeConfirmation();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameMode, gameState.day, gameState.currentTurn, uiState, handleSaveGame]);

  // =========================================
  // HELPER FUNCTIONS
  // =========================================

  const updateUiState = useCallback((updates) => {
    setUiState(prev => ({ ...prev, ...updates }));
  }, []);

  const applyLoadedState = useCallback((data: SaveGameData) => {
    if (aiTurnTimeoutRef.current) {
      clearTimeout(aiTurnTimeoutRef.current);
      aiTurnTimeoutRef.current = null;
    }
    closeConfirmation();
    dispatchPlayer({ type: 'LOAD_STATE', payload: data.player });
    dispatchGameState({ type: 'LOAD_STATE', payload: data.gameState });
    setAiPlayer(data.aiPlayer);
    setGameSettings(data.gameSettings);
    setNotifications(data.notifications || []);
    setPersonalRecords(data.personalRecords || { ...DEFAULT_PERSONAL_RECORDS });
    setDontAskAgain(data.dontAskAgain || { ...DEFAULT_DONT_ASK });
    setAiActionQueue(data.aiRuntime?.queue || []);
    setCurrentAiAction(data.aiRuntime?.currentAction || null);
    setAiActiveSpecialAbility(null);
    aiRngSeedRef.current = data.gameSettings.aiDeterministicSeed;
    aiRngStateRef.current = typeof data.aiRuntime?.rngState === 'number'
      ? data.aiRuntime.rngState
      : normalizeAiSeed(data.gameSettings.aiDeterministicSeed);
    const selectedCharacterIndex = CHARACTERS.findIndex(char => char.name === data.player.character.name);
    updateUiState({
      theme: data.uiPreferences?.theme || uiState.theme,
      showTravelModal: false,
      showChallenges: false,
      showMarket: false,
      showShop: false,
      showInvestments: false,
      showSabotage: false,
      showStats: false,
      showNotifications: false,
      showProgress: false,
      showHelp: false,
      showSettings: false,
      showEndGameModes: false,
      showCampaignSelect: false,
      showAiStats: false,
      playerName: data.player.name,
      selectedCharacter: selectedCharacterIndex >= 0 ? selectedCharacterIndex : uiState.selectedCharacter
    });
    setSaveDescription(data.metadata.saveDescription || '');
    closeLoadPreview();
    addNotification(`Loaded save from Day ${data.gameState.day}`, 'success', true);
  }, [addNotification, closeConfirmation, closeLoadPreview, dispatchGameState, dispatchPlayer, setAiActionQueue, setAiPlayer, setCurrentAiAction, setDontAskAgain, setGameSettings, setNotifications, setPersonalRecords, uiState.selectedCharacter, uiState.theme, updateUiState]);

  const confirmLoadGame = useCallback(() => {
    if (!loadPreview.data) {
      closeLoadPreview();
      return;
    }
    applyLoadedState(loadPreview.data);
  }, [applyLoadedState, closeLoadPreview, loadPreview]);

  const calculateTravelCost = useCallback((fromRegion, toRegion) => {
    // Weather modifier for travel costs
    const weatherModifier = WEATHER_EFFECTS[gameState.weather]?.travelCostModifier || 1.0;
    // Season modifier for travel costs
    const seasonModifier = SEASON_EFFECTS[gameState.season]?.travelCostModifier || 1.0;
    const equipmentEffects = gameSettings.equipmentShopEnabled &&
      !(gameSettings.sabotageEnabled && isEquipmentJammed(player.debuffs))
      ? getEquipmentEffects(player.equipment)
      : null;
    const equipmentDiscount = equipmentEffects?.travelDiscount || 0;

    // Check for active event affecting travel to this region
    let eventModifier = 1.0;
    gameState.activeEvents.forEach(event => {
      if (event.region === toRegion && event.effect?.travelCost) {
        eventModifier *= event.effect.travelCost;
      }
    });

    if (ADJACENT_REGIONS[fromRegion]?.includes(toRegion)) {
      let baseCost = 200;
      if (player.character.name === "Explorer") {
        baseCost *= 0.75;
      }
      if (player.masteryUnlocks.includes("Pathfinder")) {
        return 0;
      }
      // Apply weather, season, and event modifiers
      baseCost = baseCost * weatherModifier * seasonModifier * eventModifier;
      if (equipmentDiscount > 0) {
        baseCost = baseCost * (1 - equipmentDiscount);
      }
      return Math.floor(baseCost);
    }

    let baseCost = toRegion === "TAS" ? 800 : 500;
    if (player.character.name === "Explorer") {
      baseCost *= 0.75;
    }
    if (player.masteryUnlocks.includes("Fast Travel")) {
      return 300;
    }
    // Apply weather, season, and event modifiers
    baseCost = baseCost * weatherModifier * seasonModifier * eventModifier;
    if (equipmentDiscount > 0) {
      baseCost = baseCost * (1 - equipmentDiscount);
    }
    const { isUnderdog, leader } = getUnderdogBonus('player');
    if (isUnderdog) {
      baseCost *= 0.75;
    }
    if (leader === 'player' && getWealthState().ratio > 2) {
      baseCost *= 1.05;
    }
    return Math.floor(baseCost);
  }, [player.character, player.masteryUnlocks, player.equipment, player.debuffs, gameSettings.equipmentShopEnabled, gameSettings.sabotageEnabled, gameState.weather, gameState.season, gameState.activeEvents, getUnderdogBonus, getWealthState]);

  const calculateSuccessChance = useCallback((challenge) => {
    const baseChance = 0.5;
    const statBonus = (player.stats[
      challenge.type === "physical" ? "strength" :
      challenge.type === "social" ? "charisma" :
      challenge.type === "wildlife" ? "luck" : "intelligence"
    ] || 3) * 0.05;

    const difficultyPenalty = challenge.difficulty * 0.1;
    const characterBonus = player.character.name === "Tourist" ? 0.1 : 0;
    const levelBonus = player.level * 0.02;

    // Weather effect on challenge success
    const weatherEffect = WEATHER_EFFECTS[gameState.weather]?.challengeModifier?.[challenge.type] || 0;

    // Season effect on challenge success
    const seasonEffect = SEASON_EFFECTS[gameState.season]?.challengeModifier?.[challenge.type] || 0;

    // Active event effects (check if there's an event in current region that affects this challenge type)
    let eventBonus = 0;
    gameState.activeEvents.forEach(event => {
      if (event.region === player.currentRegion && event.effect?.challengeBonus?.[challenge.type]) {
        eventBonus += event.effect.challengeBonus[challenge.type];
      }
    });

    const equipmentEffects = gameSettings.equipmentShopEnabled &&
      !(gameSettings.sabotageEnabled && isEquipmentJammed(player.debuffs))
      ? getEquipmentEffects(player.equipment)
      : null;
    const equipmentBonus = equipmentEffects?.challengeBonus?.[challenge.type] || 0;
    const { isUnderdog, leader } = getUnderdogBonus('player');
    const underdogBonus = isUnderdog ? 0.1 : 0;
    const leaderPenalty = leader === 'player' && getWealthState().ratio > 2 ? 0.05 : 0;
    const fatiguePenalty = player.overrideFatigue || 0;
    const sabotagePenalty = gameSettings.sabotageEnabled ? getSabotageChallengePenalty(player.debuffs) : 0;

    return Math.min(
      0.95,
      Math.max(
        0.1,
        baseChance + statBonus - difficultyPenalty + characterBonus + levelBonus + weatherEffect + seasonEffect + eventBonus + underdogBonus - leaderPenalty - fatiguePenalty - sabotagePenalty + equipmentBonus
      )
    );
  }, [player.stats, player.character, player.level, player.currentRegion, player.overrideFatigue, player.equipment, player.debuffs, gameSettings.equipmentShopEnabled, gameSettings.sabotageEnabled, gameState.weather, gameState.season, gameState.activeEvents, getUnderdogBonus, getWealthState]);

  const calculateFinalScore = useCallback((playerData) => {
    const completionCount = playerData.challengeMastery
      ? Object.keys(playerData.challengeMastery || {}).length
      : (playerData.challengesCompleted?.length || 0);
    return playerData.money + 
           completionCount * 100 +
           (playerData.visitedRegions?.length || 0) * 50;
  }, []);

  const getInventoryValue = useMemo(() => {
    return player.inventory.reduce((total, resource) => {
      return total + (gameState.resourcePrices[resource] || 100);
    }, 0);
  }, [player.inventory, gameState.resourcePrices]);

  const getNetWorth = useMemo(() => {
    return player.money + getInventoryValue;
  }, [player.money, getInventoryValue]);

  const getAiInventoryValue = useMemo(() => {
    return aiPlayer.inventory.reduce((total, resource) => {
      return total + (gameState.resourcePrices[resource] || 100);
    }, 0);
  }, [aiPlayer.inventory, gameState.resourcePrices]);

  const getAiNetWorth = useMemo(() => {
    return aiPlayer.money + getAiInventoryValue;
  }, [aiPlayer.money, getAiInventoryValue]);

  const playerInvestmentSummary = useMemo(() => {
    const investments = Array.isArray(player.investments) ? player.investments : [];
    const entries = investments
      .map(regionCode => {
        const investment = REGIONAL_INVESTMENTS[regionCode];
        if (!investment) return null;
        const regionName = REGIONS[regionCode]?.name || regionCode;
        return {
          regionCode,
          name: investment.name,
          regionName,
          dailyIncome: investment.dailyIncome
        };
      })
      .filter(Boolean);
    const totalIncome = entries.reduce((sum, entry) => sum + (entry?.dailyIncome || 0), 0);
    return { entries, totalIncome };
  }, [player.investments]);

  const aiInvestmentSummary = useMemo(() => {
    const investments = Array.isArray(aiPlayer.investments) ? aiPlayer.investments : [];
    const entries = investments
      .map(regionCode => {
        const investment = REGIONAL_INVESTMENTS[regionCode];
        if (!investment) return null;
        const regionName = REGIONS[regionCode]?.name || regionCode;
        return {
          regionCode,
          name: investment.name,
          regionName,
          dailyIncome: investment.dailyIncome
        };
      })
      .filter(Boolean);
    const totalIncome = entries.reduce((sum, entry) => sum + (entry?.dailyIncome || 0), 0);
    return { entries, totalIncome };
  }, [aiPlayer.investments]);

  const playerEquipmentNames = useMemo(() => {
    const equipment = Array.isArray(player.equipment) ? player.equipment : [];
    return equipment.map(itemId => {
      const item = SHOP_ITEMS.find(candidate => candidate.id === itemId);
      return item ? item.name : itemId;
    });
  }, [player.equipment]);

  const aiEquipmentNames = useMemo(() => {
    const equipment = Array.isArray(aiPlayer.equipment) ? aiPlayer.equipment : [];
    return equipment.map(itemId => {
      const item = SHOP_ITEMS.find(candidate => candidate.id === itemId);
      return item ? item.name : itemId;
    });
  }, [aiPlayer.equipment]);

  const playerActiveDebuffs = useMemo(() => {
    const debuffs = Array.isArray(player.debuffs) ? player.debuffs : [];
    return debuffs.filter(debuff => debuff.remainingDays > 0);
  }, [player.debuffs]);

  const aiActiveDebuffs = useMemo(() => {
    const debuffs = Array.isArray(aiPlayer.debuffs) ? aiPlayer.debuffs : [];
    return debuffs.filter(debuff => debuff.remainingDays > 0);
  }, [aiPlayer.debuffs]);

  // =========================================
  // GAME LOGIC FUNCTIONS
  // =========================================

  // Helper function to increment actions with Efficiency Expert mastery check
  const incrementAction = useCallback(() => {
    // Efficiency Expert mastery: 30% chance to not consume action
    if (player.masteryUnlocks.includes("Efficiency Expert")) {
      if (Math.random() < 0.3) {
        addNotification('⚡ Efficiency Expert! Action performed instantly!', 'success');
        return; // Don't increment action
      }
    }
    dispatchGameState({ type: 'INCREMENT_ACTIONS' });
  }, [player.masteryUnlocks, addNotification]);

  // Updated loan tick to use variable interest rates per loan
  const applyLoanTick = useCallback((state: any) => {
    if (!state.loans || state.loans.length === 0) {
      return { money: state.money, loans: [] as typeof state.loans };
    }
    let money = state.money;
    const updatedLoans = state.loans.map((loan: any) => {
      // Use loan's individual interest rate, fallback to legacy rate if not set
      const rate = loan.interestRate ?? LOAN_INTEREST_RATE;
      const interest = Math.floor(loan.amount * rate);
      const payment = Math.min(interest, money);
      money -= payment;
      return {
        ...loan,
        amount: loan.amount + interest - payment,
        accrued: (loan.accrued || 0) + interest
      };
    }).filter((loan: any) => loan.amount > 0.5);
    return { money, loans: updatedLoans };
  }, []);

  const liquidateInventoryForCash = useCallback((state: any) => {
    if (!state.inventory || state.inventory.length === 0) {
      return { cash: 0, remaining: state.inventory };
    }
    let cash = 0;
    state.inventory.forEach((resource: string) => {
      const price = gameState.resourcePrices[resource] || 100;
      cash += Math.floor(price * 0.75);
    });
    return { cash, remaining: [] as string[] };
  }, [gameState.resourcePrices]);

  const activateSpecialAbility = useCallback(() => {
    if (!player.character.specialAbility) return;
    if (player.specialAbilityUses <= 0) {
      addNotification('No special ability uses remaining!', 'warning');
      return;
    }

    const abilityName = player.character.specialAbility.name;

    // Activate the ability
    setActiveSpecialAbility(abilityName);
    addNotification(`${abilityName} activated! Use it in your next action.`, 'success', true);

    // Special handling for different abilities
    if (abilityName === 'Market Insight') {
      // Open market to show predictions
      updateUiState({ showMarket: true });
    } else if (abilityName === 'Scout Ahead') {
      // Open travel to show resources
      updateUiState({ showTravelModal: true });
    }
  }, [player.character, player.specialAbilityUses, addNotification, setActiveSpecialAbility, updateUiState]);

  const travelToRegion = useCallback((region) => {
    const cost = calculateTravelCost(player.currentRegion, region);

    if (gameSettings.sabotageEnabled && isTravelBlocked(player.debuffs)) {
      addNotification('Travel blocked by sabotage. Wait until it expires.', 'warning', true);
      return;
    }
    
    const confirmTravel = () => {
      if (player.money >= cost) {
        dispatchPlayer({ type: 'UPDATE_MONEY', payload: -cost });
        dispatchPlayer({ type: 'SET_REGION', payload: region });
        updateUiState({ showTravelModal: false });
        addNotification(`Traveled to ${REGIONS[region].name} for $${cost}`, 'travel');
        
        // Collect resources (if inventory not full)
        const regionResources = REGIONAL_RESOURCES[region] || [];
        if (regionResources.length > 0) {
          const collectedResource = regionResources[Math.floor(Math.random() * regionResources.length)];

          if (player.inventory.length < MAX_INVENTORY) {
            dispatchPlayer({ type: 'COLLECT_RESOURCES', payload: { resources: [collectedResource] } });
            addNotification(`Found ${collectedResource}!`, 'resource');
          } else {
            addNotification(`Inventory full (${MAX_INVENTORY}/${MAX_INVENTORY})! Couldn't collect ${collectedResource}`, 'warning');
          }
        }

        incrementAction();
      }
    };

    showConfirmation(
      'travel',
      'Confirm Travel',
      `Travel to ${REGIONS[region].name} for $${cost}?`,
      'Travel',
      confirmTravel,
      { region, cost }
    );
  }, [player, gameSettings.sabotageEnabled, calculateTravelCost, addNotification, showConfirmation, incrementAction]);

  // Calculate dynamic max wager based on difficulty and level
  const calculateMaxWager = useCallback((challenge) => {
    const baseMax = 500;
    const levelBonus = player.level * 50; // +50 per level
    const difficultyBonus = challenge.difficulty * 100; // +100 per difficulty level
    return Math.min(2000, baseMax + levelBonus + difficultyBonus);
  }, [player.level]);

  // Handle double or nothing
  const handleDoubleOrNothing = useCallback(() => {
    if (!gameState.doubleOrNothingAvailable || gameState.lastChallengeReward <= 0) return;

    const doubleReward = gameState.lastChallengeReward * 2;
    const success = Math.random() < 0.5; // 50/50 chance

    if (success) {
      dispatchPlayer({ type: 'UPDATE_MONEY', payload: gameState.lastChallengeReward }); // Add the extra amount
      addNotification(`Double or Nothing SUCCESS! Won extra $${gameState.lastChallengeReward}! Total: $${doubleReward}`, 'success', true);
      updatePersonalRecords('earned', gameState.lastChallengeReward);
    } else {
      dispatchPlayer({ type: 'UPDATE_MONEY', payload: -gameState.lastChallengeReward }); // Lose the original reward
      addNotification(`Double or Nothing FAILED! Lost your $${gameState.lastChallengeReward} reward!`, 'error', true);
    }

    dispatchGameState({ type: 'SET_DOUBLE_OR_NOTHING', payload: { available: false, reward: 0 } });
    updateUiState({ showDoubleOrNothing: false });
  }, [gameState.doubleOrNothingAvailable, gameState.lastChallengeReward, addNotification, updatePersonalRecords]);

  const takeChallenge = useCallback((challenge, wager) => {
    let successChance = calculateSuccessChance(challenge);

    // Calculate Odds: Guarantee success on challenges under difficulty 2
    const hasCalculateOdds = activeSpecialAbility === 'Calculate Odds';
    if (hasCalculateOdds && challenge.difficulty < 2) {
      successChance = 1.0;
    }

    // Tourist Luck: +20% bonus to success chance when active
    const hasTouristLuck = activeSpecialAbility === 'Tourist Luck';
    if (hasTouristLuck) {
      successChance = Math.min(0.95, successChance + 0.2);
    }

    const confirmChallenge = () => {
      if (player.money < wager) {
        addNotification('Not enough money!', 'error');
        return;
      }

      const success = Math.random() < successChance;

      if (success) {
        let reward = Math.floor(wager * challenge.reward);

        if (player.character.name === "Tourist") {
          reward = Math.floor(reward * 1.2);
        }

        if (player.character.name === "Businessman") {
          reward = Math.floor(reward * 1.1);
        }

        const { isUnderdog, leader } = getUnderdogBonus('player');
        if (leader === 'player' && getWealthState().ratio > 2) {
          reward = Math.floor(reward * 0.9);
        }

        // Apply Lucky Streak mastery bonus (Tourist-specific)
        if (player.masteryUnlocks.includes("Lucky Streak") && player.consecutiveWins > 0) {
          const streakBonus = Math.min(0.5, player.consecutiveWins * 0.1);
          reward = Math.floor(reward * (1 + streakBonus));
          addNotification(`Lucky Streak! +${Math.round(streakBonus * 100)}% bonus`, 'success');
        }

        // Universal streak bonuses (apply to all characters)
        const newStreak = player.consecutiveWins + 1;
        const streakTiers = Object.keys(STREAK_BONUSES).map(Number).sort((a, b) => b - a);
        let appliedStreakBonus = null;
        for (const tier of streakTiers) {
          if (newStreak >= tier) {
            appliedStreakBonus = STREAK_BONUSES[tier];
            break;
          }
        }
        if (appliedStreakBonus && !player.masteryUnlocks.includes("Lucky Streak")) {
          // Only apply universal bonus if Lucky Streak mastery isn't active (to avoid double-dipping)
          reward = Math.floor(reward * (1 + appliedStreakBonus.rewardBonus));
        }

        // Seasonal mastery bonuses
        const masteryCount = (player.challengeMastery?.[challenge.name] || 0) + 1;
        let masteryRewardBonus = 0;
        let masteryXpBonus = 0;
        let masteryLabel = '';
        switch (Math.min(masteryCount, 4)) {
          case 2:
            masteryRewardBonus = 0.25;
            masteryXpBonus = 0.5;
            masteryLabel = 'Mastered';
            break;
          case 3:
            masteryRewardBonus = 0.5;
            masteryXpBonus = 1.0;
            masteryLabel = 'Expert';
            break;
          case 4:
            masteryRewardBonus = 1.0;
            masteryXpBonus = 2.0;
            masteryLabel = 'Legendary';
            break;
        }
        if (masteryRewardBonus > 0) {
          reward = Math.floor(reward * (1 + masteryRewardBonus));
        }

        dispatchPlayer({ type: 'UPDATE_MONEY', payload: reward });
        dispatchPlayer({ type: 'COMPLETE_CHALLENGE', payload: challenge.name });

        // Apply Quick Study mastery - 50% more XP
        let xpGain = challenge.difficulty * 20;
        if (player.masteryUnlocks.includes("Quick Study")) {
          xpGain = Math.floor(xpGain * 1.5);
        }
        if (isUnderdog) {
          xpGain = Math.floor(xpGain * 1.25);
        }
        // Apply universal streak XP bonus
        if (appliedStreakBonus) {
          xpGain = Math.floor(xpGain * (1 + appliedStreakBonus.xpBonus));
        }
        if (masteryXpBonus > 0) {
          xpGain = Math.floor(xpGain * (1 + masteryXpBonus));
        }
        dispatchPlayer({ type: 'GAIN_XP', payload: { amount: xpGain, applyEquipment: gameSettings.equipmentShopEnabled && !(gameSettings.sabotageEnabled && isEquipmentJammed(player.debuffs)) } });

        // Show streak notification
        if (appliedStreakBonus) {
          addNotification(`${appliedStreakBonus.emoji} ${appliedStreakBonus.label}! ${newStreak} wins in a row!`, 'success');
        }
        if (masteryLabel) {
          addNotification(`${masteryLabel}! ${challenge.name} rewards boosted for this run.`, 'success');
        }

        addNotification(`${challenge.name} completed! Won $${reward}${player.masteryUnlocks.includes("Quick Study") ? ' (+50% XP)' : ''}`, 'success');
        updatePersonalRecords('challenge', reward);
        updatePersonalRecords('consecutiveWins', newStreak);
        updatePersonalRecords('earned', reward);

        // Enable double or nothing for this reward
        if (reward >= 100) {
          dispatchGameState({ type: 'SET_DOUBLE_OR_NOTHING', payload: { available: true, reward: reward } });
          addNotification('Double or Nothing available! Risk your reward for 2x!', 'info', true);
        }

        // Clear active special ability after use
        if (activeSpecialAbility) {
          setActiveSpecialAbility(null);
          dispatchPlayer({ type: 'USE_SPECIAL_ABILITY' });
        }

        // Clear failed challenge data
        setFailedChallengeData(null);

        // Check for mastery unlocks
        Object.entries(player.character.masteryTree || {}).forEach(([name, mastery]) => {
          if (player.level >= (mastery as any).unlockLevel && !player.masteryUnlocks.includes(name)) {
            dispatchPlayer({ type: 'UNLOCK_MASTERY', payload: name });
            addNotification(`Mastery Unlocked: ${name}!`, 'levelup', true);
          }
        });
      } else {
        // Challenge failed
        dispatchPlayer({ type: 'UPDATE_MONEY', payload: -wager });
        dispatchPlayer({ type: 'RESET_STREAK' });
        addNotification(`${challenge.name} failed. Lost $${wager}`, 'error');

        // Disable double or nothing on failure
        dispatchGameState({ type: 'SET_DOUBLE_OR_NOTHING', payload: { available: false, reward: 0 } });

        // Store failed challenge for Tourist Luck retry
        if (player.character.name === "Tourist" && player.specialAbilityUses > 0 && !activeSpecialAbility) {
          setFailedChallengeData({ challenge, wager });
          addNotification('Tourist Luck available! You can retry this challenge.', 'info', true);
        }

        // Clear active special ability after use
        if (activeSpecialAbility) {
          setActiveSpecialAbility(null);
          dispatchPlayer({ type: 'USE_SPECIAL_ABILITY' });
        }
      }

      updateUiState({ showChallenges: false });

      // Challenge Master mastery: First challenge of the turn doesn't consume an action
      if (player.masteryUnlocks.includes("Challenge Master") && !usedFreeChallengeThisTurn) {
        setUsedFreeChallengeThisTurn(true);
        addNotification('⚔️ Challenge Master! Free challenge attempt!', 'success');
      } else {
        incrementAction();
      }
    };

    if (successChance < 0.5 && !hasCalculateOdds) {
      showConfirmation(
        'challenge',
        'Risky Challenge',
        `This challenge has only a ${Math.round(successChance * 100)}% success rate. Wager $${wager}?${hasTouristLuck ? ' (Tourist Luck active!)' : ''}`,
        'Take Challenge',
        confirmChallenge,
        { challenge, wager, successChance }
      );
    } else {
      confirmChallenge();
    }
  }, [player, gameSettings.equipmentShopEnabled, calculateSuccessChance, addNotification, showConfirmation, updatePersonalRecords, activeSpecialAbility, incrementAction, getUnderdogBonus, getWealthState]);

  // Calculate regional demand bonus for selling resources
  const calculateRegionalBonus = useCallback((resource: string, region: string) => {
    const resourceCategory = RESOURCE_CATEGORIES[resource];
    const localResources = REGIONAL_RESOURCES[region] || [];

    // If the resource is NOT local to the region, it's more valuable (regional demand)
    if (!localResources.includes(resource)) {
      // Food sells better in industrial/mining regions
      if (resourceCategory === 'food' && ['WA', 'SA', 'NT'].includes(region)) {
        return 1.2; // 20% bonus
      }
      // Luxury items sell better in urban areas
      if (resourceCategory === 'luxury' && ['NSW', 'VIC', 'ACT'].includes(region)) {
        return 1.15; // 15% bonus
      }
      // Energy resources sell better in industrial regions
      if (resourceCategory === 'energy' && ['NSW', 'VIC', 'QLD'].includes(region)) {
        return 1.1; // 10% bonus
      }
    }
    return 1.0; // No bonus
  }, []);

  // Calculate supply/demand modifier (selling lots of one resource lowers price)
  const calculateSupplyDemandModifier = useCallback((resource: string) => {
    const soldAmount = gameState.supplyDemand[resource] || 0;
    // Every 5 units sold reduces price by 5%, max 25% reduction
    const reduction = Math.min(0.25, soldAmount * 0.01);
    return 1 - reduction;
  }, [gameState.supplyDemand]);

  const sellResource = useCallback((resource, price) => {
    const confirmSell = () => {
      const index = player.inventory.indexOf(resource);
      if (index > -1) {
        let finalPrice = price;

        // Apply regional demand bonus
        const regionalBonus = calculateRegionalBonus(resource, player.currentRegion);
        finalPrice = Math.floor(finalPrice * regionalBonus);

        // Apply supply/demand modifier
        const supplyDemandMod = calculateSupplyDemandModifier(resource);
        finalPrice = Math.floor(finalPrice * supplyDemandMod);

        // Apply active event effects on resource prices
        gameState.activeEvents.forEach(event => {
          if (event.effect?.resourcePrice?.[resource]) {
            finalPrice = Math.floor(finalPrice * event.effect.resourcePrice[resource]);
          }
        });

        // Apply season effects on resource prices
        const resourceCategory = RESOURCE_CATEGORIES[resource];
        const seasonMod = SEASON_EFFECTS[gameState.season]?.resourcePriceModifier?.[resourceCategory];
        if (seasonMod) {
          finalPrice = Math.floor(finalPrice * seasonMod);
        }

        const { isUnderdog, leader } = getUnderdogBonus('player');
        if (isUnderdog) {
          finalPrice = Math.floor(finalPrice * 1.15);
        }
        if (leader === 'player' && getWealthState().ratio > 2) {
          finalPrice = Math.floor(finalPrice * 0.95);
        }

        if (player.character.name === "Businessman") {
          finalPrice = Math.floor(finalPrice * 1.1);
        }

        if (player.masteryUnlocks.includes("Investment Genius")) {
          finalPrice = Math.floor(finalPrice * 1.15);
        }

        if (gameSettings.sabotageEnabled) {
          const sabotageMultiplier = getSabotageSellMultiplier(player.debuffs);
          if (sabotageMultiplier < 1) {
            finalPrice = Math.floor(finalPrice * sabotageMultiplier);
          }
        }

        dispatchPlayer({ type: 'SELL_RESOURCE', payload: { resource, price: finalPrice } });

        // Update supply/demand tracking
        dispatchGameState({ type: 'UPDATE_SUPPLY_DEMAND', payload: { resource, amount: 1 } });

        // Show bonus notification if applicable
        const bonusMessages = [];
        if (regionalBonus > 1) bonusMessages.push(`+${Math.round((regionalBonus - 1) * 100)}% regional demand`);
        if (supplyDemandMod < 1) bonusMessages.push(`${Math.round((1 - supplyDemandMod) * 100)}% oversupply`);
        if (gameSettings.sabotageEnabled) {
          if (hasActiveDebuff(player.debuffs, 'market_panic')) {
            bonusMessages.push('35% market panic penalty');
          } else if (hasActiveDebuff(player.debuffs, 'rumors')) {
            bonusMessages.push('20% rumors penalty');
          }
        }

        addNotification(`Sold ${resource} for $${finalPrice}${bonusMessages.length > 0 ? ` (${bonusMessages.join(', ')})` : ''}`, 'money');
        updatePersonalRecords('resource', { resource, price: finalPrice });
        updatePersonalRecords('earned', finalPrice);
        updatePersonalRecords('money', player.money + finalPrice);
        incrementAction();
      }
    };

    if (price >= 200) {
      showConfirmation(
        'sell',
        'Confirm Sale',
        `Sell ${resource} for $${price}?`,
        'Sell',
        confirmSell,
        { resource, price }
      );
    } else {
      confirmSell();
    }
  }, [player, gameSettings.sabotageEnabled, gameState.activeEvents, gameState.season, gameState.supplyDemand, addNotification, showConfirmation, updatePersonalRecords, incrementAction, calculateRegionalBonus, calculateSupplyDemandModifier, getUnderdogBonus, getWealthState]);

  const buyInvestment = useCallback((regionCode: string) => {
    if (!gameSettings.investmentsEnabled || gameState.currentTurn !== 'player') return;
    const investment = REGIONAL_INVESTMENTS[regionCode];
    if (!investment) return;
    const owned = (player.investments || []).includes(regionCode);
    if (owned) {
      addNotification('You already own this investment.', 'warning');
      return;
    }
    if (player.money < investment.cost) {
      addNotification('Not enough money for this investment.', 'error');
      return;
    }
    dispatchPlayer({ type: 'UPDATE_MONEY', payload: -investment.cost });
    dispatchPlayer({ type: 'MERGE_STATE', payload: { investments: [...(player.investments || []), regionCode] } });
    addNotification(`Purchased ${investment.name} in ${REGIONS[regionCode].name} for $${investment.cost}.`, 'success', true);
    incrementAction();
  }, [gameSettings.investmentsEnabled, gameState.currentTurn, player.investments, player.money, addNotification, incrementAction]);

  const buyEquipment = useCallback((itemId: string) => {
    if (!gameSettings.equipmentShopEnabled || gameState.currentTurn !== 'player') return;
    const item = SHOP_ITEMS.find(candidate => candidate.id === itemId);
    if (!item) return;
    if (!EQUIPMENT_SHOP_REGIONS.includes(player.currentRegion)) {
      addNotification('Equipment shop is only available in NSW or VIC.', 'warning');
      return;
    }
    const owned = (player.equipment || []).includes(itemId);
    if (owned) {
      addNotification('You already own this equipment.', 'warning');
      return;
    }
    if (player.money < item.cost) {
      addNotification('Not enough money for this equipment.', 'error');
      return;
    }
    dispatchPlayer({ type: 'UPDATE_MONEY', payload: -item.cost });
    dispatchPlayer({ type: 'MERGE_STATE', payload: { equipment: [...(player.equipment || []), itemId] } });
    addNotification(`Purchased ${item.name} for $${item.cost}.`, 'success', true);
    incrementAction();
  }, [gameSettings.equipmentShopEnabled, gameState.currentTurn, player.currentRegion, player.equipment, player.money, addNotification, incrementAction]);

  const useSabotage = useCallback((sabotageId: string) => {
    if (!gameSettings.sabotageEnabled || gameState.selectedMode !== 'ai' || gameState.currentTurn !== 'player') return;
    const sabotage = SABOTAGE_ACTIONS.find(candidate => candidate.id === sabotageId);
    if (!sabotage) return;
    if (hasActiveDebuff(aiPlayer.debuffs, sabotageId)) {
      addNotification('That sabotage effect is already active.', 'warning');
      return;
    }
    if (player.money < sabotage.cost) {
      addNotification('Not enough money for sabotage.', 'error');
      return;
    }
    setAiPlayer(prev => ({
      ...prev,
      debuffs: upsertDebuff(prev.debuffs || [], sabotage.id, sabotage.duration)
    }));
    dispatchPlayer({ type: 'UPDATE_MONEY', payload: -sabotage.cost });
    addNotification(`Sabotage used: ${sabotage.name}.`, 'warning', true);
    addNotification(`🤖 ${aiPlayerRef.current.name} is affected by ${sabotage.name}.`, 'ai', false);
    incrementAction();
  }, [gameSettings.sabotageEnabled, gameState.selectedMode, gameState.currentTurn, player.money, aiPlayer.debuffs, addNotification, incrementAction]);

  const retryFailedChallenge = useCallback(() => {
    if (!failedChallengeData) return;
    if (player.specialAbilityUses <= 0) {
      addNotification('No special ability uses remaining!', 'warning');
      return;
    }

    setActiveSpecialAbility('Tourist Luck');
    takeChallenge(failedChallengeData.challenge, failedChallengeData.wager);
  }, [failedChallengeData, player.specialAbilityUses, addNotification, takeChallenge]);

  // =========================================
  // CRAFTING SYSTEM HANDLERS
  // =========================================

  const handleCraft = useCallback((recipe: typeof CRAFTING_RECIPES[0]) => {
    // Validate can craft
    if (!canCraft(recipe, player.inventory)) {
      addNotification('Missing required resources!', 'error');
      return;
    }

    // Check action limit
    if (gameSettings.actionLimitsEnabled && player.actionsUsedThisTurn >= gameSettings.playerActionsPerDay) {
      addNotification('No actions remaining this turn!', 'warning');
      return;
    }

    // Check inventory space
    if (player.inventory.length >= MAX_INVENTORY) {
      addNotification('Inventory full! Sell items first.', 'warning');
      return;
    }

    // Remove inputs from inventory
    const newInventory = removeRecipeInputs(player.inventory, recipe);

    // Add crafted item to inventory
    newInventory.push(recipe.output);

    // Calculate success chance (Scientist gets bonus)
    let successChance = 0.95;
    if (player.character.name === "Scientist") {
      successChance = 0.98;
    }

    const success = Math.random() < successChance;

    if (success) {
      dispatchPlayer({
        type: 'MERGE_STATE',
        payload: {
          inventory: newInventory,
          actionsUsedThisTurn: player.actionsUsedThisTurn + recipe.craftTime,
          craftedItems: [...player.craftedItems, recipe.output]
        }
      });

      const craftValue = calculateCraftValue(recipe, player.character, player.masteryUnlocks);
      addNotification(`✨ Crafted ${recipe.emoji} ${recipe.output}! (Value: $${craftValue})`, 'success', true);
    } else {
      // Failed craft - lose materials
      dispatchPlayer({
        type: 'SET_INVENTORY',
        payload: newInventory
      });
      addNotification(`❌ Crafting failed! Lost materials.`, 'error', true);
    }

  }, [player, gameSettings, addNotification]);

  // =========================================
  // LOAN SYSTEM HANDLERS
  // =========================================

  const canTakeLoan = useCallback((loanOption: typeof LOAN_OPTIONS[0]) => {
    // Check active loans of this type
    const activeLoansOfType = player.loans.filter(loan => loan.loanType === loanOption.id).length;
    if (activeLoansOfType >= loanOption.maxActive) {
      return { canTake: false, reason: `Maximum ${loanOption.maxActive} ${loanOption.name}s active` };
    }

    // Check level requirement for Business/Investor loans
    if (loanOption.id === 'business' && player.level < 3) {
      return { canTake: false, reason: 'Requires Level 3+' };
    }
    if (loanOption.id === 'investor') {
      if (player.level < 5) {
        return { canTake: false, reason: 'Requires Level 5+' };
      }
      const netWorth = computeNetWorth(player);
      if (netWorth < 5000) {
        return { canTake: false, reason: 'Requires Net Worth $5000+' };
      }
    }

    return { canTake: true, reason: '' };
  }, [player, computeNetWorth]);

  const handleTakeLoan = useCallback((loanOption: typeof LOAN_OPTIONS[0]) => {
    const check = canTakeLoan(loanOption);
    if (!check.canTake) {
      addNotification(check.reason, 'error');
      return;
    }

    // Apply credit score modifier to interest rate
    let interestRate = loanOption.dailyInterest;
    if (player.creditScore >= 750) {
      interestRate -= 0.03; // Excellent: -3%
    } else if (player.creditScore >= 650) {
      interestRate -= 0.01; // Good: -1%
    } else if (player.creditScore < 550) {
      interestRate += 0.02; // Poor: +2%
    }
    interestRate = Math.max(0.03, interestRate); // Minimum 3%

    const newLoan = {
      id: Date.now().toString(),
      amount: loanOption.amount,
      accrued: 0,
      loanType: loanOption.id,
      interestRate: interestRate
    };

    dispatchPlayer({
      type: 'MERGE_STATE',
      payload: {
        money: validateMoney(player.money + loanOption.amount),
        loans: [...player.loans, newLoan],
        totalLoansTaken: player.totalLoansTaken + 1,
        creditScore: Math.max(300, player.creditScore - 5) // Taking loan slightly reduces score
      }
    });

    addNotification(`💰 Received ${loanOption.emoji} ${loanOption.name}: $${loanOption.amount} @ ${(interestRate * 100).toFixed(1)}% daily`, 'money', true);
  }, [player, canTakeLoan, addNotification, validateMoney]);

  const handleRepayLoan = useCallback((loanId: string, fullAmount?: boolean) => {
    const loan = player.loans.find(l => l.id === loanId);
    if (!loan) {
      addNotification('Loan not found!', 'error');
      return;
    }

    const totalOwed = loan.amount + loan.accrued;
    const paymentAmount = fullAmount ? totalOwed : Math.min(player.money, totalOwed);

    if (player.money < paymentAmount) {
      addNotification('Insufficient funds to repay!', 'error');
      return;
    }

    const remainingDebt = totalOwed - paymentAmount;
    const paidInFull = remainingDebt <= 0;

    // Calculate credit score change
    let creditScoreChange = 0;
    if (paidInFull) {
      // Paid off early (before accumulating too much interest)
      if (loan.accrued < loan.amount * 0.5) {
        creditScoreChange = 10; // Early payoff bonus
      } else {
        creditScoreChange = 5; // Regular payoff
      }
    }

    if (paidInFull) {
      // Remove loan entirely
      const updatedLoans = player.loans.filter(l => l.id !== loanId);
      dispatchPlayer({
        type: 'MERGE_STATE',
        payload: {
          money: validateMoney(player.money - paymentAmount),
          loans: updatedLoans,
          creditScore: Math.min(850, player.creditScore + creditScoreChange),
          loansPaidEarly: loan.accrued < loan.amount * 0.5 ? player.loansPaidEarly + 1 : player.loansPaidEarly
        }
      });
      addNotification(`✅ Loan paid off! +${creditScoreChange} credit score`, 'success', true);
    } else {
      // Partial payment - reduce debt
      const updatedLoans = player.loans.map(l =>
        l.id === loanId ? { ...l, amount: remainingDebt, accrued: 0 } : l
      );
      dispatchPlayer({
        type: 'MERGE_STATE',
        payload: {
          money: validateMoney(player.money - paymentAmount),
          loans: updatedLoans
        }
      });
      addNotification(`Paid $${paymentAmount} toward loan. Remaining: $${Math.floor(remainingDebt)}`, 'info');
    }
  }, [player, addNotification, validateMoney]);

  const calculateCreditScore = useCallback((state: PlayerStateSnapshot) => {
    let score = 650; // Base score

    // Positive factors
    score += state.loansPaidEarly * 15; // +15 per early payoff
    score += Math.min(100, state.level * 10); // +10 per level (max +100)
    if (state.loans.length === 0 && state.totalLoansTaken > 0) {
      score += 50; // Debt-free bonus
    }

    // Negative factors
    const totalDebt = state.loans.reduce((sum, loan) => sum + loan.amount + loan.accrued, 0);
    if (totalDebt > 2000) score -= 50;
    else if (totalDebt > 1000) score -= 25;

    if (state.loans.length > 3) score -= 30; // Too many active loans

    // Cap between 300-850
    return Math.max(300, Math.min(850, score));
  }, []);

  const handleEndTurn = useCallback(() => {
    if (gameState.currentTurn !== 'player') return;

    const confirmEndTurn = () => {
      // Reset special ability
      dispatchPlayer({ type: 'RESET_SPECIAL_ABILITY' });
      setActiveSpecialAbility(null);
      setFailedChallengeData(null);
      setUsedFreeChallengeThisTurn(false);
      dispatchPlayer({ type: 'MERGE_STATE', payload: { debuffs: tickDebuffs(player.debuffs || []) } });
      
      // Update resource prices based on market trend
      const newPrices = {};
      const currentPrices = gameState.resourcePrices;

      Object.keys(RESOURCE_CATEGORIES).forEach(resource => {
        const currentPrice = currentPrices[resource] || 100;
        let variance = Math.random() * 100 - 50; // Base variance: -50 to +50

        // Apply market trend bias
        switch (gameState.marketTrend) {
          case 'rising':
            variance += 30; // Bias towards higher prices (+30 to +80)
            break;
          case 'falling':
            variance -= 30; // Bias towards lower prices (-80 to -30)
            break;
          case 'volatile':
            variance *= 1.5; // Larger swings (-75 to +75)
            break;
          case 'stable':
            variance *= 0.5; // Smaller changes (-25 to +25)
            break;
        }

        // Apply change to current price rather than base price
        const newPrice = currentPrice + variance;
        newPrices[resource] = Math.max(50, Math.min(250, Math.floor(newPrice))); // Cap at 50-250
      });
      dispatchGameState({ type: 'UPDATE_RESOURCE_PRICES', payload: newPrices });
      
      addNotification('Your turn ended', 'info');
      
      if (gameState.selectedMode === 'ai') {
        // Switch to AI turn
        dispatchGameState({ type: 'SET_TURN', payload: 'ai' });
      } else {
        // Single player mode - advance day
        advanceDay();
      }
      
      updatePersonalRecords('money', player.money);
    };

    const hasUnusedResources = player.inventory.length > 0;
    const hasHighMoney = player.money > 1000;
    
    if ((hasUnusedResources || hasHighMoney) && gameState.actionsThisTurn < 2) {
      showConfirmation(
        'endDay',
        'End Turn?',
        hasUnusedResources 
          ? `You have ${player.inventory.length} unsold resources. End turn anyway?`
          : `You have $${player.money}. Sure you want to end your turn?`,
        'End Turn',
        confirmEndTurn
      );
    } else {
      confirmEndTurn();
    }
  }, [player, gameState, addNotification, showConfirmation, updatePersonalRecords]);

  const advanceDay = useCallback(() => {
    const prevDay = gameState.day;
    const currentPlayer = player;
    const currentAi = aiPlayerRef.current;
    const newDay = prevDay + 1;
    const seasons = ["Summer", "Autumn", "Winter", "Spring"];
    const newSeason = seasons[Math.floor((newDay - 1) / 7) % 4];
    const seasonChanged = newSeason !== gameState.season;

    // Track net worth history for progress dashboard
    const playerWorth = computeNetWorth(currentPlayer);
    const aiWorth = computeNetWorth(currentAi);
    dispatchGameState({ type: 'ADD_NET_WORTH_HISTORY', payload: { day: prevDay, playerWorth, aiWorth } });

    // Track price history for Market Insight
    dispatchGameState({ type: 'ADD_PRICE_HISTORY', payload: { day: prevDay, prices: { ...gameState.resourcePrices } } });

    // Show day transition screen if enabled
    if (gameSettings.showDayTransition) {
      setDayTransitionData({
        prevDay: prevDay,
        newDay: newDay,
        playerEarned: currentPlayer.money - (personalRecords.maxMoney || currentPlayer.character.startingMoney),
        aiEarned: currentAi.money - (currentAi.character.startingMoney || 1000)
      });
      updateUiState({ showDayTransition: true });

      // Auto-dismiss after 2 seconds
      setTimeout(() => {
        updateUiState({ showDayTransition: false });
      }, 2000);
    } else {
      // Show brief notification instead
      addNotification(`Day ${newDay} begins`, 'info', true);
    }

    dispatchGameState({ type: 'NEXT_DAY' });

    // Build projected states for daily maintenance before committing
    let projectedPlayer = { ...currentPlayer };
    let projectedAi = { ...currentAi };

    projectedPlayer.actionsUsedThisTurn = 0;
    projectedPlayer.overridesUsedToday = 0;
    projectedPlayer.overrideFatigue = Math.max(0, (projectedPlayer.overrideFatigue || 0) * OVERRIDE_FATIGUE_DECAY);
    projectedAi.actionsUsedThisTurn = 0;
    projectedAi.overridesUsedToday = 0;
    projectedAi.overrideFatigue = Math.max(0, (projectedAi.overrideFatigue || 0) * OVERRIDE_FATIGUE_DECAY);
    projectedAi.specialAbilityUses = projectedAi.character?.specialAbility?.usesLeft ?? projectedAi.specialAbilityUses;
    setAiActiveSpecialAbility(null);
    projectedAi.debuffs = tickDebuffs(projectedAi.debuffs || []);

    if (seasonChanged) {
      projectedPlayer.completedThisSeason = [];
      projectedAi.completedThisSeason = [];
      addNotification(`Season changed to ${newSeason}. Challenges have refreshed with mastery tiers.`, 'info', true);
    }

    // Update weather
    const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Stormy"];
    const newWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    dispatchGameState({ type: 'UPDATE_WEATHER', payload: newWeather });

    // Market trend
    const trends = ["rising", "falling", "stable", "volatile"];
    const newTrend = trends[Math.floor(Math.random() * trends.length)];
    dispatchGameState({ type: 'UPDATE_MARKET_TREND', payload: newTrend });

    // Process active events - decrease remaining days and remove expired ones
    const updatedEvents = gameState.activeEvents
      .map(event => ({ ...event, remainingDays: event.remainingDays - 1 }))
      .filter(event => event.remainingDays > 0);

    // Chance to spawn new event (20% chance per day)
    if (Math.random() < 0.2 && updatedEvents.length < 3) {
      const availableEvents = REGIONAL_EVENTS.filter(
        e => !updatedEvents.some(active => active.id === e.id)
      );
      if (availableEvents.length > 0) {
        const newEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        const activeEvent = { ...newEvent, remainingDays: newEvent.duration };
        updatedEvents.push(activeEvent);
        addNotification(`Event: ${newEvent.name} in ${REGIONS[newEvent.region]?.name || newEvent.region}!`, 'event', true);
      }
    }
    dispatchGameState({ type: 'UPDATE_ACTIVE_EVENTS', payload: updatedEvents });

    // Apply loan interest ticks
    const playerLoanTick = applyLoanTick(projectedPlayer);
    projectedPlayer.money = playerLoanTick.money;
    projectedPlayer.loans = playerLoanTick.loans;

    const aiLoanTick = applyLoanTick(projectedAi);
    projectedAi.money = aiLoanTick.money;
    projectedAi.loans = aiLoanTick.loans;

    if (gameSettings.investmentsEnabled) {
      const playerInvestmentIncome = (projectedPlayer.investments || []).reduce((sum, regionCode) => {
        return sum + (REGIONAL_INVESTMENTS[regionCode]?.dailyIncome || 0);
      }, 0);
      if (playerInvestmentIncome > 0) {
        projectedPlayer.money += playerInvestmentIncome;
        addNotification(`Investment income: +$${playerInvestmentIncome}`, 'money', true);
      }

      const aiInvestmentIncome = (projectedAi.investments || []).reduce((sum, regionCode) => {
        return sum + (REGIONAL_INVESTMENTS[regionCode]?.dailyIncome || 0);
      }, 0);
      if (aiInvestmentIncome > 0) {
        projectedAi.money += aiInvestmentIncome;
        addNotification(`🤖 ${projectedAi.name} earned $${aiInvestmentIncome} from investments`, 'ai', false);
      }
    }

    // Emergency loan system - AI takes smallest available loan when desperate
    if (gameSettings.loansEnabled && projectedAi.money < BANKRUPTCY_THRESHOLD) {
      // Calculate AI net worth for loan eligibility
      const emergencyInventoryValue = projectedAi.inventory.reduce((sum: number, item: string) => {
        return sum + (gameState.resourcePrices[item] || 50);
      }, 0);
      const emergencyNetWorth = projectedAi.money + emergencyInventoryValue;

      // Find smallest loan tier the AI can take
      const availableLoan = LOAN_OPTIONS.find(opt => {
        const check = canTakeLoanForAI(
          opt,
          projectedAi.loans || [],
          projectedAi.creditScore || 700,
          projectedAi.level || 1,
          emergencyNetWorth
        );
        return check.canTake;
      });

      if (availableLoan) {
        // Calculate effective interest rate
        let effectiveRate = availableLoan.dailyInterest;
        if (projectedAi.creditScore >= 750) effectiveRate = Math.max(0.03, availableLoan.dailyInterest - 0.03);
        else if (projectedAi.creditScore >= 650) effectiveRate = Math.max(0.03, availableLoan.dailyInterest - 0.01);
        else if (projectedAi.creditScore < 550) effectiveRate = availableLoan.dailyInterest + 0.02;

        const emergencyLoan = {
          id: `ai-emergency-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          loanType: availableLoan.id,
          amount: availableLoan.amount,
          accrued: 0,
          interestRate: effectiveRate,
          turnTaken: gameState.currentTurn
        };

        projectedAi.loans = [...(projectedAi.loans || []), emergencyLoan];
        projectedAi.money += availableLoan.amount;
        projectedAi.totalLoansTaken = (projectedAi.totalLoansTaken || 0) + 1;
        addNotification(
          `🤖 ${projectedAi.name} took emergency ${availableLoan.emoji} ${availableLoan.name} for $${availableLoan.amount}!`,
          'ai',
          true
        );
      } else {
        addNotification(`🤖 ${projectedAi.name} is broke and can't get more loans!`, 'ai', true);
      }
    }

    // Asset liquidation safety net
    if (projectedPlayer.money < BANKRUPTCY_THRESHOLD && projectedPlayer.inventory.length > 0) {
      const { cash, remaining } = liquidateInventoryForCash(projectedPlayer);
      if (cash > 0) {
        projectedPlayer.money += cash;
        projectedPlayer.inventory = remaining;
        addNotification(`Emergency liquidation sold your inventory for $${cash} (75% value).`, 'warning', true);
      }
    }

    if (projectedAi.money < BANKRUPTCY_THRESHOLD && projectedAi.inventory.length > 0) {
      const { cash, remaining } = liquidateInventoryForCash(projectedAi);
      if (cash > 0) {
        projectedAi.money += cash;
        projectedAi.inventory = remaining;
        addNotification(`🤖 ${projectedAi.name} liquidated inventory for $${cash} to stay afloat.`, 'ai', false);
      }
    }

    // AI emergency stipend
    projectedAi.stipendCooldown = Math.max(0, (projectedAi.stipendCooldown || 0) - 1);
    if (projectedAi.money < 100 && projectedAi.stipendCooldown <= 0) {
      projectedAi.money += AI_STIPEND_AMOUNT;
      projectedAi.stipendCooldown = AI_STIPEND_COOLDOWN;
      addNotification(`🤖 Emergency fund: ${projectedAi.name} received $${AI_STIPEND_AMOUNT}`, 'ai', true);
    }

    // Catch-up comeback events & leader penalties
    if (gameState.selectedMode === 'ai') {
      const updatedPlayerWorth = computeNetWorth(projectedPlayer);
      const updatedAiWorth = computeNetWorth(projectedAi);
      const playerBehind = updatedPlayerWorth < updatedAiWorth * 0.5;
      const aiBehind = updatedAiWorth < updatedPlayerWorth * 0.5;

      if (playerBehind && Math.random() < COMEBACK_EVENT_CHANCE) {
        projectedPlayer.money += 300;
        addNotification('Investor Interest! Backers toss you $300 to fight back.', 'money', true);
      } else if (aiBehind && Math.random() < COMEBACK_EVENT_CHANCE) {
        projectedAi.money += 300;
        addNotification(`🤖 Investor Interest! ${projectedAi.name} received $300 to catch up.`, 'ai', true);
      }

      if (!playerBehind && !aiBehind) {
        // Mild correction for runaway leads
        if (updatedPlayerWorth > updatedAiWorth * 2) {
          const correction = Math.floor(projectedPlayer.money * 0.1);
          projectedPlayer.money = Math.max(0, projectedPlayer.money - correction);
          addNotification(`Market correction trims $${correction} from your coffers.`, 'warning', true);
        } else if (updatedAiWorth > updatedPlayerWorth * 2) {
          const correction = Math.floor(projectedAi.money * 0.1);
          projectedAi.money = Math.max(0, projectedAi.money - correction);
          addNotification(`🤖 Market correction hit the AI for $${correction}.`, 'ai', false);
        }
      }
    }

    // Bankruptcy tracking and mercy rule
    const updatedPlayerWorth = computeNetWorth(projectedPlayer);
    const updatedAiWorth = computeNetWorth(projectedAi);
    const playerBroke = projectedPlayer.money < BANKRUPTCY_THRESHOLD;
    const aiBroke = projectedAi.money < BANKRUPTCY_THRESHOLD;

    const playerStreak = playerBroke ? gameState.bankruptcyTracker.player + 1 : 0;
    const aiStreak = aiBroke ? gameState.bankruptcyTracker.ai + 1 : 0;
    dispatchGameState({ type: 'SET_BANKRUPTCY_TRACKER', payload: { player: playerStreak, ai: aiStreak } });

    if (playerStreak === 1) {
      addNotification('⚠️ Funds critically low. Three days under $50 triggers bankruptcy.', 'warning', true);
    } else if (playerStreak === 2) {
      addNotification('⚠️ One day until bankruptcy! Improve cash above $50.', 'warning', true);
    } else if (playerStreak >= BANKRUPTCY_STREAK_DAYS) {
      dispatchGameState({ type: 'SET_GAME_MODE', payload: 'end' });
      addNotification('Bankruptcy! You fell below $50 for 3 days. AI wins.', 'error', true);
      return;
    }

    if (gameState.selectedMode === 'ai') {
      if (aiStreak === 1) {
        addNotification('🤖 AI is broke. Three days under $50 will end the game.', 'ai', true);
      } else if (aiStreak === 2) {
        addNotification('🤖 AI has one day to avoid bankruptcy!', 'ai', true);
      } else if (aiStreak >= BANKRUPTCY_STREAK_DAYS) {
        dispatchGameState({ type: 'SET_GAME_MODE', payload: 'end' });
        addNotification('AI bankrupt for 3 days. You win!', 'success', true);
        return;
      }
    }

    const playerDominance = updatedAiWorth > 0 && updatedPlayerWorth / updatedAiWorth >= 5 ? gameState.dominanceTracker.player + 1 : 0;
    const aiDominance = updatedPlayerWorth > 0 && updatedAiWorth / updatedPlayerWorth >= 5 ? gameState.dominanceTracker.ai + 1 : 0;
    dispatchGameState({ type: 'SET_DOMINANCE_TRACKER', payload: { player: playerDominance, ai: aiDominance } });

    if (playerDominance >= 5) {
      dispatchGameState({ type: 'SET_GAME_MODE', payload: 'end' });
      addNotification('Mercy rule: you maintained 5x net worth for 5 days. Victory!', 'success', true);
      return;
    }
    if (aiDominance >= 5) {
      dispatchGameState({ type: 'SET_GAME_MODE', payload: 'end' });
      addNotification('Mercy rule: AI dominated for 5 days straight.', 'ai', true);
      return;
    }

    // Calculate AI mood based on performance difference
    const moneyDiff = projectedAi.money - projectedPlayer.money;
    const worthDiff = updatedAiWorth - updatedPlayerWorth;
    let newMood: keyof typeof AI_MOOD_STATES = 'neutral';
    if (worthDiff > 500) {
      newMood = 'confident';
    } else if (worthDiff < -500) {
      newMood = 'desperate';
    } else if (Math.abs(worthDiff) < 200 && newDay > 10) {
      newMood = 'aggressive';
    }
    dispatchGameState({ type: 'SET_AI_MOOD', payload: newMood });

    // AI taunt based on mood
    if (gameState.selectedMode === 'ai') {
      const moodState = AI_MOOD_STATES[newMood];
      if (aiRandom() < moodState.tauntChance) {
        const taunt = moodState.messages[Math.floor(aiRandom() * moodState.messages.length)];
        addNotification(`${moodState.emoji} AI: "${taunt}"`, 'ai', false);
      }
    }

    // Commit projected player state changes
    dispatchPlayer({
      type: 'MERGE_STATE',
      payload: {
        actionsUsedThisTurn: projectedPlayer.actionsUsedThisTurn,
        overridesUsedToday: projectedPlayer.overridesUsedToday,
        overrideFatigue: projectedPlayer.overrideFatigue,
        completedThisSeason: projectedPlayer.completedThisSeason
      }
    });
    dispatchPlayer({ type: 'SET_LOANS', payload: projectedPlayer.loans });
    dispatchPlayer({ type: 'SET_INVENTORY', payload: projectedPlayer.inventory });
    dispatchPlayer({ type: 'UPDATE_MONEY', payload: projectedPlayer.money - currentPlayer.money });

    setAiPlayer(projectedAi);
    aiPlayerRef.current = projectedAi;

    if (!gameSettings.showDayTransition) {
      addNotification(`Market trend: ${newTrend}`, 'market', true);
      addNotification(`Weather: ${newWeather} - ${WEATHER_EFFECTS[newWeather]?.description || ''}`, 'info', true);
    }

    // Check for game end - use configurable totalDays
    if (newDay >= gameSettings.totalDays) {
      dispatchGameState({ type: 'SET_GAME_MODE', payload: 'end' });
      addNotification(`Game Over! Final Day Reached (${gameSettings.totalDays} days)`, 'success', true);
    }
  }, [gameState, gameSettings, player, personalRecords, addNotification, aiRandom, applyLoanTick, liquidateInventoryForCash, computeNetWorth]);

  // When turn switches to player, reset their actions
  useEffect(() => {
    if (gameState.currentTurn === 'player') {
      dispatchPlayer({ type: 'RESET_ACTIONS' });
    }
  }, [gameState.currentTurn]);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (
      uiState.showSettings ||
      uiState.showProgress ||
      uiState.showSaveLoadModal ||
      uiState.showNotifications ||
      uiState.showMarket ||
      uiState.showShop ||
      uiState.showInvestments ||
      uiState.showSabotage ||
      loadPreview.isOpen
    ) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [
    uiState.showSettings,
    uiState.showProgress,
    uiState.showSaveLoadModal,
    uiState.showNotifications,
    uiState.showMarket,
    uiState.showShop,
    uiState.showInvestments,
    uiState.showSabotage,
    loadPreview.isOpen
  ]);

  // Initialize resource prices
  useEffect(() => {
    if (Object.keys(gameState.resourcePrices).length === 0) {
      const initialPrices = {};
      Object.keys(RESOURCE_CATEGORIES).forEach(resource => {
        initialPrices[resource] = 100;
      });
      dispatchGameState({ type: 'UPDATE_RESOURCE_PRICES', payload: initialPrices });
    }
  }, [gameState.resourcePrices]);

  // =========================================
  // THEME SYSTEM - Comprehensive Light/Dark Mode
  // =========================================

  const themeStyles = useMemo(() => {
    const isDark = uiState.theme === "dark";
    return {
      // === BACKGROUNDS ===
      background: isDark ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
      backgroundSecondary: isDark ? "bg-gray-800" : "bg-white",
      backgroundTertiary: isDark ? "bg-gray-700" : "bg-gray-50",
      backgroundHover: isDark ? "hover:bg-gray-700" : "hover:bg-gray-100",
      backgroundActive: isDark ? "bg-gray-600" : "bg-gray-200",
      overlay: isDark ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50",
      overlayLight: isDark ? "bg-black bg-opacity-50" : "bg-white bg-opacity-70",

      // === CARDS & CONTAINERS ===
      card: isDark ? "bg-gray-800" : "bg-white",
      cardHover: isDark ? "hover:bg-gray-750" : "hover:bg-gray-50",
      cardElevated: isDark ? "bg-gray-800 shadow-2xl" : "bg-white shadow-xl",
      panel: isDark ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm",
      tooltip: isDark ? "bg-gray-700" : "bg-gray-800 text-white",
      modal: isDark ? "bg-gray-800" : "bg-white",

      // === TYPOGRAPHY ===
      text: isDark ? "text-white" : "text-gray-900",
      textSecondary: isDark ? "text-gray-300" : "text-gray-600",
      textMuted: isDark ? "text-gray-400" : "text-gray-500",
      textDisabled: isDark ? "text-gray-500" : "text-gray-400",
      heading: isDark ? "text-white" : "text-gray-900",
      label: isDark ? "text-gray-300" : "text-gray-700",
      link: isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700",
      placeholder: isDark ? "placeholder-gray-500" : "placeholder-gray-400",

      // === BORDERS & DIVIDERS ===
      border: isDark ? "border-gray-700" : "border-gray-200",
      borderLight: isDark ? "border-gray-600" : "border-gray-300",
      borderFocus: isDark ? "focus:border-blue-500" : "focus:border-blue-400",
      divider: isDark ? "border-gray-700" : "border-gray-200",
      ring: isDark ? "ring-gray-600" : "ring-gray-300",
      ringFocus: isDark ? "focus:ring-blue-500" : "focus:ring-blue-400",

      // === PRIMARY BUTTONS ===
      button: isDark
        ? "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
        : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/30",
      buttonDisabled: isDark
        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
        : "bg-gray-300 text-gray-500 cursor-not-allowed",

      // === SECONDARY BUTTONS ===
      buttonSecondary: isDark
        ? "bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white border border-gray-600"
        : "bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300 shadow-sm",

      // === GHOST/TERTIARY BUTTONS ===
      buttonGhost: isDark
        ? "bg-transparent hover:bg-gray-700/50 text-gray-300 hover:text-white"
        : "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900",
      buttonTertiary: isDark
        ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700",

      // === ACCENT BUTTONS ===
      accent: isDark
        ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25"
        : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/30",
      accentSecondary: isDark
        ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
        : "bg-purple-50 text-purple-700 border border-purple-200",

      // === STATUS COLORS ===
      success: isDark ? "bg-green-600" : "bg-green-500",
      successLight: isDark ? "bg-green-600/20 text-green-400" : "bg-green-50 text-green-700",
      successBorder: isDark ? "border-green-500" : "border-green-400",
      error: isDark ? "bg-red-600" : "bg-red-500",
      errorLight: isDark ? "bg-red-600/20 text-red-400" : "bg-red-50 text-red-700",
      errorBorder: isDark ? "border-red-500" : "border-red-400",
      warning: isDark ? "bg-yellow-600" : "bg-yellow-500",
      warningLight: isDark ? "bg-yellow-600/20 text-yellow-400" : "bg-yellow-50 text-yellow-700",
      warningBorder: isDark ? "border-yellow-500" : "border-yellow-400",
      info: isDark ? "bg-blue-600" : "bg-blue-500",
      infoLight: isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-50 text-blue-700",

      // === AI/SPECIAL ===
      ai: isDark
        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
        : "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
      aiLight: isDark ? "bg-pink-600/20 text-pink-400" : "bg-pink-50 text-pink-700",

      // === INPUTS ===
      input: isDark
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20",
      inputDisabled: isDark
        ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed",
      select: isDark
        ? "bg-gray-700 border-gray-600 text-white"
        : "bg-white border-gray-300 text-gray-900",
      checkbox: isDark
        ? "bg-gray-700 border-gray-500 checked:bg-blue-600"
        : "bg-white border-gray-300 checked:bg-blue-500",
      toggle: isDark
        ? "bg-gray-600 peer-checked:bg-blue-600"
        : "bg-gray-300 peer-checked:bg-blue-500",
      slider: isDark
        ? "bg-gray-600 accent-blue-500"
        : "bg-gray-300 accent-blue-500",

      // === SHADOWS ===
      shadow: isDark ? "shadow-2xl shadow-black/50" : "shadow-xl shadow-gray-200/50",
      shadowSm: isDark ? "shadow-lg shadow-black/30" : "shadow-md shadow-gray-200/40",
      shadowInner: isDark ? "shadow-inner shadow-black/30" : "shadow-inner shadow-gray-200/50",

      // === SCROLLBAR ===
      scrollbar: isDark
        ? "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500"
        : "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400",

      // === PROGRESS BARS ===
      progressTrack: isDark ? "bg-gray-700" : "bg-gray-200",
      progressBar: isDark ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gradient-to-r from-blue-400 to-purple-400",

      // === BADGES ===
      badge: isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700",
      badgePrimary: isDark ? "bg-blue-600/30 text-blue-400" : "bg-blue-100 text-blue-700",
      badgeSuccess: isDark ? "bg-green-600/30 text-green-400" : "bg-green-100 text-green-700",
      badgeWarning: isDark ? "bg-yellow-600/30 text-yellow-400" : "bg-yellow-100 text-yellow-700",
      badgeError: isDark ? "bg-red-600/30 text-red-400" : "bg-red-100 text-red-700",

      // === TABS ===
      tab: isDark
        ? "text-gray-400 hover:text-white border-b-2 border-transparent hover:border-gray-500"
        : "text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300",
      tabActive: isDark
        ? "text-white border-b-2 border-blue-500"
        : "text-blue-600 border-b-2 border-blue-500",

      // === TABLES ===
      tableHeader: isDark ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-600",
      tableRow: isDark ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50",
      tableRowAlt: isDark ? "bg-gray-800/50" : "bg-gray-50/50",

      // === LISTS ===
      listItem: isDark
        ? "border-gray-700 hover:bg-gray-700/50"
        : "border-gray-200 hover:bg-gray-50",
      listItemActive: isDark
        ? "bg-blue-600/20 border-blue-500"
        : "bg-blue-50 border-blue-400",

      // === ACCORDIONS ===
      accordionHeader: isDark
        ? "bg-gray-700 hover:bg-gray-600"
        : "bg-gray-100 hover:bg-gray-200",
      accordionContent: isDark ? "bg-gray-800" : "bg-white",

      // === NAVIGATION ===
      nav: isDark ? "bg-gray-800/95 backdrop-blur-md" : "bg-white/95 backdrop-blur-md",
      navItem: isDark
        ? "text-gray-300 hover:text-white hover:bg-gray-700"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
      navItemActive: isDark
        ? "text-white bg-blue-600"
        : "text-blue-600 bg-blue-50",

      // === GRADIENTS ===
      gradientPrimary: isDark
        ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
        : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
      gradientSuccess: isDark
        ? "bg-gradient-to-r from-green-600 to-emerald-600"
        : "bg-gradient-to-r from-green-400 to-emerald-400",
      gradientWarning: isDark
        ? "bg-gradient-to-r from-yellow-600 to-orange-600"
        : "bg-gradient-to-r from-yellow-400 to-orange-400",
      gradientDanger: isDark
        ? "bg-gradient-to-r from-red-600 to-pink-600"
        : "bg-gradient-to-r from-red-500 to-pink-500",

      // === SPECIAL EFFECTS ===
      glow: isDark ? "shadow-lg shadow-blue-500/30" : "shadow-lg shadow-blue-400/20",
      glowSuccess: isDark ? "shadow-lg shadow-green-500/30" : "shadow-lg shadow-green-400/20",
      glowWarning: isDark ? "shadow-lg shadow-yellow-500/30" : "shadow-lg shadow-yellow-400/20",
      glowDanger: isDark ? "shadow-lg shadow-red-500/30" : "shadow-lg shadow-red-400/20",

      // === MENU SCREEN SPECIFIC ===
      menuBackground: isDark
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        : "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100",
      menuCard: isDark
        ? "bg-gray-800/80 backdrop-blur-lg border-gray-700"
        : "bg-white/80 backdrop-blur-lg border-white shadow-2xl",
      menuTitle: isDark
        ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",

      // === KEYBOARD SHORTCUTS ===
      kbd: isDark
        ? "bg-gray-700 border-gray-600 text-gray-300 shadow-sm"
        : "bg-gray-100 border-gray-300 text-gray-600 shadow-sm",
    };
  }, [uiState.theme]);

  // =========================================
  // ACTION LIMIT & END-GAME HELPERS
  // =========================================

  // Helper function to check if action limit reached
  const isActionLimitReached = () => {
    const actionsUsed = Math.max(player.actionsUsedThisTurn, gameState.actionsThisTurn);
    return gameSettings.actionLimitsEnabled && actionsUsed >= gameSettings.playerActionsPerDay;
  };

  // Helper function to check if all challenges are completed
  const checkAllChallengesCompleted = () => {
    const totalChallenges = Object.values(REGIONS).reduce(
      (sum, region: any) => sum + region.challenges.length,
      0
    );
    const uniqueCompleted = Object.keys(player.challengeMastery || {}).length;
    return uniqueCompleted >= totalChallenges;
  };

  // Update game state when all challenges are completed
  useEffect(() => {
    const allCompleted = checkAllChallengesCompleted();
    if (allCompleted !== gameState.allChallengesCompleted) {
      dispatchGameState({ type: 'SET_ALL_CHALLENGES_COMPLETED', payload: allCompleted });
      if (allCompleted) {
        addNotification('🎉 You have completed all challenges! Access End-Game Modes!', 'success', true);
      }
    }
  }, [player.challengeMastery]);

  // =========================================
  // CONTEXT-AWARE QUICK ACTIONS
  // =========================================

  const getQuickActions = useMemo(() => {
    if (gameState.currentTurn !== 'player') return [];
    
    const actions = [];
    const actionLimitReached = isActionLimitReached();
    const overrideCost = calculateOverrideCost('player');
    const overridesRemaining = Math.max(0, OVERRIDE_DAILY_CAP - (player.overridesUsedToday || 0));
    const isShopRegion = EQUIPMENT_SHOP_REGIONS.includes(player.currentRegion);

    // Emergency loan
    if ((player.money < 300 || player.loans.length < MAX_ACTIVE_LOANS) && player.loans.length < MAX_ACTIVE_LOANS) {
      actions.push({
        label: `Emergency Loan ($${LOAN_AMOUNT})`,
        icon: '💳',
        action: () => {
          const newLoan = { id: Date.now().toString(), amount: LOAN_AMOUNT, accrued: 0 };
          dispatchPlayer({ type: 'SET_LOANS', payload: [...player.loans, newLoan] });
          dispatchPlayer({ type: 'UPDATE_MONEY', payload: LOAN_AMOUNT });
          addNotification(`Took emergency loan for $${LOAN_AMOUNT}. Interest 25%/day.`, 'warning', true);
        },
        hotkey: null,
        disabled: false
      });
    }
    
    // Resources to sell
    if (player.inventory.length > 0) {
      actions.push({
        label: `Sell Resources (${player.inventory.length}/${MAX_INVENTORY})`,
        icon: '💰',
        action: () => {
          if (actionLimitReached) {
            showConfirmation(
              'endDay',
              'Action Limit Reached',
              overridesRemaining > 0
                ? `You have reached your action limit (${gameSettings.playerActionsPerDay}). Pay $${overrideCost} to continue? (${overridesRemaining} override${overridesRemaining === 1 ? '' : 's'} left today)`
                : `Override cap reached for today (${OVERRIDE_DAILY_CAP}). End your turn or wait for tomorrow.`,
              overridesRemaining > 0 ? 'Pay & Continue' : 'Close',
              () => {
                if (overridesRemaining <= 0) return;
                if (player.money >= overrideCost && gameSettings.allowActionOverride) {
                  dispatchPlayer({ type: 'USE_ACTION_OVERRIDE', payload: overrideCost });
                  dispatchGameState({ type: 'RESET_ACTIONS' });
                  addNotification(`💸 Paid $${overrideCost} to override action limit`, 'warning');
                  updateUiState({ showMarket: true });
                } else {
                  addNotification('Not enough money for override', 'error');
                }
              }
            );
          } else {
            updateUiState({ showMarket: true });
          }
        },
        hotkey: 'R',
        disabled: actionLimitReached && gameSettings.actionLimitsEnabled
      });
    }
    
    if (gameSettings.investmentsEnabled) {
      actions.push({
        label: 'Investments',
        icon: '🏦',
        action: () => {
          if (actionLimitReached) {
            showConfirmation(
              'endDay',
              'Action Limit Reached',
              overridesRemaining > 0
                ? `You have reached your action limit (${gameSettings.playerActionsPerDay}). Pay $${overrideCost} to continue? (${overridesRemaining} override${overridesRemaining === 1 ? '' : 's'} left today)`
                : `Override cap reached for today (${OVERRIDE_DAILY_CAP}). End your turn or wait for tomorrow.`,
              overridesRemaining > 0 ? 'Pay & Continue' : 'Close',
              () => {
                if (overridesRemaining <= 0) return;
                if (player.money >= overrideCost && gameSettings.allowActionOverride) {
                  dispatchPlayer({ type: 'USE_ACTION_OVERRIDE', payload: overrideCost });
                  dispatchGameState({ type: 'RESET_ACTIONS' });
                  addNotification(`?? Paid $${overrideCost} to override action limit`, 'warning');
                  updateUiState({ showInvestments: true });
                } else {
                  addNotification('Not enough money for override', 'error');
                }
              }
            );
          } else {
            updateUiState({ showInvestments: true });
          }
        },
        hotkey: 'I',
        disabled: actionLimitReached && gameSettings.actionLimitsEnabled
      });
    }

    if (gameSettings.equipmentShopEnabled) {
      actions.push({
        label: isShopRegion ? 'Shop' : 'Shop (NSW/VIC)',
        icon: '🛒',
        action: () => {
          if (!isShopRegion) {
            addNotification('Equipment shop is only available in NSW or VIC.', 'warning');
            return;
          }
          if (actionLimitReached) {
            showConfirmation(
              'endDay',
              'Action Limit Reached',
              overridesRemaining > 0
                ? `You have reached your action limit (${gameSettings.playerActionsPerDay}). Pay $${overrideCost} to continue? (${overridesRemaining} override${overridesRemaining === 1 ? '' : 's'} left today)`
                : `Override cap reached for today (${OVERRIDE_DAILY_CAP}). End your turn or wait for tomorrow.`,
              overridesRemaining > 0 ? 'Pay & Continue' : 'Close',
              () => {
                if (overridesRemaining <= 0) return;
                if (player.money >= overrideCost && gameSettings.allowActionOverride) {
                  dispatchPlayer({ type: 'USE_ACTION_OVERRIDE', payload: overrideCost });
                  dispatchGameState({ type: 'RESET_ACTIONS' });
                  addNotification(`?? Paid $${overrideCost} to override action limit`, 'warning');
                  updateUiState({ showShop: true });
                } else {
                  addNotification('Not enough money for override', 'error');
                }
              }
            );
          } else {
            updateUiState({ showShop: true });
          }
        },
        hotkey: 'B',
        disabled: actionLimitReached && gameSettings.actionLimitsEnabled
      });
    }

    if (gameSettings.sabotageEnabled && gameState.selectedMode === 'ai') {
      actions.push({
        label: 'Sabotage',
        icon: SABOTAGE_ICON,
        action: () => {
          if (actionLimitReached) {
            showConfirmation(
              'endDay',
              'Action Limit Reached',
              overridesRemaining > 0
                ? `You have reached your action limit (${gameSettings.playerActionsPerDay}). Pay $${overrideCost} to continue? (${overridesRemaining} override${overridesRemaining === 1 ? '' : 's'} left today)`
                : `Override cap reached for today (${OVERRIDE_DAILY_CAP}). End your turn or wait for tomorrow.`,
              overridesRemaining > 0 ? 'Pay & Continue' : 'Close',
              () => {
                if (overridesRemaining <= 0) return;
                if (player.money >= overrideCost && gameSettings.allowActionOverride) {
                  dispatchPlayer({ type: 'USE_ACTION_OVERRIDE', payload: overrideCost });
                  dispatchGameState({ type: 'RESET_ACTIONS' });
                  addNotification(`?? Paid $${overrideCost} to override action limit`, 'warning');
                  updateUiState({ showSabotage: true });
                } else {
                  addNotification('Not enough money for override', 'error');
                }
              }
            );
          } else {
            updateUiState({ showSabotage: true });
          }
        },
        hotkey: 'S',
        disabled: actionLimitReached && gameSettings.actionLimitsEnabled
      });
    }

    // Available challenges
    const currentChallenges = REGIONS[player.currentRegion]?.challenges || [];
    const availableChallenges = currentChallenges.filter(
      c => !(player.completedThisSeason || []).includes(c.name)
    );
    
    if (availableChallenges.length > 0) {
      actions.push({
        label: `Challenges (${availableChallenges.length})`,
        icon: '🎯',
        action: () => {
          if (actionLimitReached) {
            showConfirmation(
              'endDay',
              'Action Limit Reached',
              overridesRemaining > 0
                ? `You have reached your action limit (${gameSettings.playerActionsPerDay}). Pay $${overrideCost} to continue? (${overridesRemaining} override${overridesRemaining === 1 ? '' : 's'} left today)`
                : `Override cap reached for today (${OVERRIDE_DAILY_CAP}). End your turn or wait for tomorrow.`,
              overridesRemaining > 0 ? 'Pay & Continue' : 'Close',
              () => {
                if (overridesRemaining <= 0) return;
                if (player.money >= overrideCost && gameSettings.allowActionOverride) {
                  dispatchPlayer({ type: 'USE_ACTION_OVERRIDE', payload: overrideCost });
                  dispatchGameState({ type: 'RESET_ACTIONS' });
                  addNotification(`💸 Paid $${overrideCost} to override action limit`, 'warning');
                  updateUiState({ showChallenges: true });
                } else {
                  addNotification('Not enough money for override', 'error');
                }
              }
            );
          } else {
            updateUiState({ showChallenges: true });
          }
        },
        hotkey: 'C',
        disabled: actionLimitReached && gameSettings.actionLimitsEnabled
      });
    }
    
    // Can travel
    if (player.money >= 200) {
      const unvisitedRegions = Object.keys(REGIONS).filter(
        r => !player.visitedRegions.includes(r)
      );
      if (unvisitedRegions.length > 0) {
        actions.push({
          label: `Explore (${unvisitedRegions.length} new)`,
          icon: '🗺️',
        action: () => {
          if (actionLimitReached) {
            showConfirmation(
              'endDay',
              'Action Limit Reached',
              overridesRemaining > 0
                ? `You have reached your action limit (${gameSettings.maxActionsPerTurn}). Pay $${overrideCost} to continue? (${overridesRemaining} override${overridesRemaining === 1 ? '' : 's'} left today)`
                : `Override cap reached for today (${OVERRIDE_DAILY_CAP}). End your turn or wait for tomorrow.`,
              overridesRemaining > 0 ? 'Pay & Continue' : 'Close',
              () => {
                  if (overridesRemaining <= 0) return;
                  if (player.money >= overrideCost && gameSettings.allowActionOverride) {
                    dispatchPlayer({ type: 'USE_ACTION_OVERRIDE', payload: overrideCost });
                    dispatchGameState({ type: 'RESET_ACTIONS' });
                    addNotification(`💸 Paid $${overrideCost} to override action limit`, 'warning');
                    updateUiState({ showTravelModal: true });
                  } else {
                    addNotification('Not enough money for override', 'error');
                  }
              }
            );
          } else {
            updateUiState({ showTravelModal: true });
          }
        },
        hotkey: 'T',
        disabled: actionLimitReached && gameSettings.actionLimitsEnabled
      });
    }
    }

    // End-Game Modes (when all challenges completed)
    if (gameState.allChallengesCompleted) {
      actions.push({
        label: 'End-Game Modes 🏆',
        icon: '⚡',
        action: () => updateUiState({ showEndGameModes: true }),
        hotkey: 'E',
        disabled: false
      });
    }
    
    // End turn
    if (gameState.day < gameSettings.totalDays) {
      actions.push({
        label: 'End Turn',
        icon: '⏭️',
        action: handleEndTurn,
        hotkey: 'Space',
        disabled: false
      });
    }
    
    return actions;
  }, [player, gameState.day, gameState.currentTurn, gameState.allChallengesCompleted, gameState.selectedMode, gameSettings, calculateOverrideCost]);

  // =========================================
  // RENDER FUNCTIONS - SETTINGS & END-GAME
  // =========================================

  // Settings Modal
  const renderSettingsModal = () => {
    if (!uiState.showSettings) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
        onClick={() => updateUiState({ showSettings: false })}
      >
        <div
          className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-2xl w-full h-[90vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed Header */}
          <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
            <h3 className="text-2xl font-bold">⚙️ Game Settings</h3>
            <button
              onClick={() => updateUiState({ showSettings: false })}
              className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div className={`flex-1 overflow-y-scroll p-6 pt-4 ${themeStyles.scrollbar}`} style={{ maxHeight: 'calc(90vh - 180px)', overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}>
            <div className="space-y-6">
              <div className={`${themeStyles.border} border rounded-lg p-4`}>
                <h4 className="text-lg font-bold mb-4">🎮 Game Rules</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">Total Days: {gameSettings.totalDays}</label>
                    <input type="range" min="10" max="100" value={gameSettings.totalDays} onChange={(e) => setGameSettings(prev => ({ ...prev, totalDays: parseInt(e.target.value) }))} className="w-full" />
                    <div className="text-xs opacity-75 mt-1">Currently: Day {gameState.day} of {gameSettings.totalDays}</div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Player Actions Per Day: {gameSettings.playerActionsPerDay}</label>
                    <input type="range" min="1" max="10" value={gameSettings.playerActionsPerDay} onChange={(e) => setGameSettings(prev => ({ ...prev, playerActionsPerDay: parseInt(e.target.value), maxActionsPerTurn: parseInt(e.target.value) }))} className="w-full" />
                    <div className="text-xs opacity-75 mt-1">Current: {player.actionsUsedThisTurn} / {gameSettings.playerActionsPerDay}</div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">AI Actions Per Day: {gameSettings.aiActionsPerDay}</label>
                    <input type="range" min="1" max="10" value={gameSettings.aiActionsPerDay} onChange={(e) => setGameSettings(prev => ({ ...prev, aiActionsPerDay: parseInt(e.target.value), aiMaxActionsPerTurn: parseInt(e.target.value) }))} className="w-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Show Day Transition Screen</div>
                      <div className="text-sm opacity-75">Display summary between days</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, showDayTransition: !prev.showDayTransition }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.showDayTransition ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.showDayTransition ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
              <div className={`${themeStyles.border} border rounded-lg p-4`}>
                <h4 className="text-lg font-bold mb-4">⏱️ Action Limits</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Enable Action Limits</div>
                      <div className="text-sm opacity-75">Restrict actions per turn</div>
                    </div>
                    <button
                      onClick={() => {
                        setGameSettings(prev => ({ ...prev, actionLimitsEnabled: !prev.actionLimitsEnabled }));
                      }}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.actionLimitsEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.actionLimitsEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Max Actions (Human): {gameSettings.maxActionsPerTurn}</label>
                    <input type="range" min="1" max="10" value={gameSettings.maxActionsPerTurn} onChange={(e) => setGameSettings(prev => ({ ...prev, maxActionsPerTurn: parseInt(e.target.value) }))} className="w-full" disabled />
                    <div className="text-xs opacity-75 mt-1">Use "Player Actions Per Day" above to adjust</div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Max Actions (AI): {gameSettings.aiMaxActionsPerTurn}</label>
                    <input type="range" min="1" max="10" value={gameSettings.aiMaxActionsPerTurn} onChange={(e) => setGameSettings(prev => ({ ...prev, aiMaxActionsPerTurn: parseInt(e.target.value) }))} className="w-full" disabled />
                    <div className="text-xs opacity-75 mt-1">Use "AI Actions Per Day" above to adjust</div>
                  </div>
                </div>
              </div>
              <div className={`${themeStyles.border} border rounded-lg p-4`}>
                <h4 className="text-lg font-bold mb-4">💸 Action Override</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Allow Override</div>
                      <div className="text-sm opacity-75">Pay to exceed limit</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, allowActionOverride: !prev.allowActionOverride }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.allowActionOverride ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.allowActionOverride ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Override Base Cost: ${gameSettings.overrideCost}</label>
                    <input type="range" min="100" max="5000" step="100" value={gameSettings.overrideCost} onChange={(e) => setGameSettings(prev => ({ ...prev, overrideCost: parseInt(e.target.value) }))} className="w-full" />
                    <div className="text-xs opacity-75 mt-1">
                      Cost doubles with each override, scales with net worth, cap {OVERRIDE_DAILY_CAP} overrides/day.
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${themeStyles.border} border rounded-lg p-4`}>
                <h4 className="text-lg font-bold mb-4">🎰 Challenge Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Dynamic Wager System</div>
                      <div className="text-sm opacity-75">Scale max wager based on challenge difficulty (default: fixed $50-500)</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, dynamicWagerEnabled: !prev.dynamicWagerEnabled }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.dynamicWagerEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.dynamicWagerEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Double or Nothing</div>
                      <div className="text-sm opacity-75">After winning, risk reward for double payout</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, doubleOrNothingEnabled: !prev.doubleOrNothingEnabled }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.doubleOrNothingEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.doubleOrNothingEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
              <div className={`${themeStyles.border} border rounded-lg p-4`}>
                <h4 className="text-lg font-bold mb-4">Gameplay Expansions</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Regional Investments</div>
                      <div className="text-sm opacity-75">Buy properties for daily passive income</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, investmentsEnabled: !prev.investmentsEnabled }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.investmentsEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.investmentsEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Equipment Shop</div>
                      <div className="text-sm opacity-75">Buy gear with travel, XP, and challenge bonuses</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, equipmentShopEnabled: !prev.equipmentShopEnabled }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.equipmentShopEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.equipmentShopEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Sabotage Actions</div>
                      <div className="text-sm opacity-75">Spend money to debuff your opponent</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, sabotageEnabled: !prev.sabotageEnabled }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.sabotageEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.sabotageEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
              <div className={`${themeStyles.border} border rounded-lg p-4`}>
                <h4 className="text-lg font-bold mb-4">AI Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">AI Uses Market Modifiers</div>
                      <div className="text-sm opacity-75">Apply weather, season, events, and pricing modifiers</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, aiUsesMarketModifiers: !prev.aiUsesMarketModifiers }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.aiUsesMarketModifiers ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.aiUsesMarketModifiers ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">AI Special Abilities</div>
                      <div className="text-sm opacity-75">Enable simplified but stronger AI abilities</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, aiSpecialAbilitiesEnabled: !prev.aiSpecialAbilitiesEnabled }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.aiSpecialAbilitiesEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.aiSpecialAbilitiesEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">AI Affects Economy</div>
                      <div className="text-sm opacity-75">AI sales change supply and demand</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, aiAffectsEconomy: !prev.aiAffectsEconomy }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.aiAffectsEconomy ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.aiAffectsEconomy ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Deterministic AI</div>
                      <div className="text-sm opacity-75">Use a seeded RNG for AI decisions</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, aiDeterministic: !prev.aiDeterministic }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.aiDeterministic ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.aiDeterministic ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">AI RNG Seed</label>
                    <input
                      type="number"
                      min="1"
                      max="2147483646"
                      value={gameSettings.aiDeterministicSeed}
                      onChange={(e) => setGameSettings(prev => ({ ...prev, aiDeterministicSeed: Math.max(1, Math.floor(Number(e.target.value) || 1)) }))}
                      className="w-full"
                      disabled={!gameSettings.aiDeterministic}
                    />
                    <div className="text-xs opacity-75 mt-1">Used when deterministic AI is enabled</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
            <button onClick={() => updateUiState({ showSettings: false })} className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Save/Load Game Modal
  const renderSaveLoadModal = () => {
    if (!uiState.showSaveLoadModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
        onClick={() => updateUiState({ showSaveLoadModal: false })}
      >
        <div
          className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-lg w-full flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed Header */}
          <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
            <h3 className="text-2xl font-bold">💾 Save / Load Game</h3>
            <button
              onClick={() => updateUiState({ showSaveLoadModal: false })}
              className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Save Game Section */}
              <div className={`${themeStyles.border} border rounded-lg p-4`}>
                <h4 className="font-bold text-lg mb-3">💾 Save Current Game</h4>
                <p className="text-sm opacity-75 mb-4">
                  Download your current game progress as a JSON file. You can load it later to continue from where you left off.
                </p>
                <div className="mb-3">
                  <label className="block text-sm font-semibold mb-2">Save Description (Optional)</label>
                  <input
                    type="text"
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    placeholder={`Day ${gameState.day} - ${player.name}`}
                    className={`w-full px-3 py-2 rounded ${themeStyles.input} border ${themeStyles.border}`}
                    maxLength={50}
                  />
                  <p className="text-xs opacity-75 mt-1">Appears in the save preview and filename.</p>
                </div>
                <button
                  onClick={() => {
                    handleSaveGame(saveDescription);
                    updateUiState({ showSaveLoadModal: false });
                  }}
                  disabled={gameState.gameMode === 'menu'}
                  className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  💾 Download Save File
                </button>
                {gameState.gameMode === 'menu' && (
                  <p className="text-xs text-yellow-500 mt-2">Start a game first before saving</p>
                )}
              </div>

              {/* Load Game Section */}
              <div className={`${themeStyles.border} border rounded-lg p-4`}>
                <h4 className="font-bold text-lg mb-3">📂 Load Saved Game</h4>
                <p className="text-sm opacity-75 mb-4">
                  Upload a previously saved JSON file to restore your game progress.
                </p>
                <button
                  onClick={() => {
                    openLoadDialog();
                    updateUiState({ showSaveLoadModal: false });
                  }}
                  className={`${themeStyles.buttonSecondary} px-6 py-3 rounded-lg w-full font-bold`}
                >
                  📂 Upload Save File
                </button>
              </div>

              {/* Quick Tip */}
              <div className={`text-xs opacity-75 text-center pt-2 border-t ${themeStyles.border}`}>
                💡 Quick tip: Press <kbd className="px-2 py-1 bg-black bg-opacity-30 rounded">Ctrl+S</kbd> anytime to quick save
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
            <button onClick={() => updateUiState({ showSaveLoadModal: false })} className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  // End-Game Modes Modal
  const renderEndGameModesModal = () => {
    if (!uiState.showEndGameModes || !gameState.allChallengesCompleted) return null;

    const endGameModes = {
      "Time Attack": { name: "Time Attack", icon: "⏱️", description: "Re-complete challenges faster for bonus money", reward: "Earn 50% more money" },
      "Hardcore Mode": { name: "Hardcore Mode", icon: "💀", description: "Increased difficulty challenges", reward: "Earn 2x XP and 2x money" },
      "Treasure Hunt": { name: "Treasure Hunt", icon: "🗺️", description: "Find hidden treasures", reward: "Rare resources worth $200-$1000" },
      "Master Challenges": { name: "Master Challenges", icon: "🏆", description: "All challenges in one turn", reward: "Triple rewards" }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto ${themeStyles.scrollbar}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">🏆 End-Game Modes</h3>
            <button onClick={() => updateUiState({ showEndGameModes: false })} className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}>✕</button>
          </div>
          <div className="mb-4 p-4 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg">
            <div className="font-semibold">🎉 Congratulations!</div>
            <div className="text-sm">You completed all challenges! Access new gameplay modes.</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(endGameModes).map(([key, mode]) => (
              <div key={key} onClick={() => { addNotification(`🎮 Started ${mode.name}!`, 'event', true); updateUiState({ showEndGameModes: false }); }} className={`${themeStyles.border} border rounded-lg p-4 hover:scale-105 transition cursor-pointer`}>
                <div className="text-4xl mb-2">{mode.icon}</div>
                <div className="font-bold text-lg mb-2">{mode.name}</div>
                <div className="text-sm opacity-75 mb-3">{mode.description}</div>
                <div className={`text-sm p-2 rounded ${themeStyles.accent} text-white`}>✨ {mode.reward}</div>
              </div>
            ))}
          </div>
          <button onClick={() => updateUiState({ showEndGameModes: false })} className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}>Return to Game</button>
        </div>
      </div>
    );
  };

  // =========================================
  // RENDER FUNCTIONS (CONTINUED IN NEXT PART)
  // =========================================

  // Notification Display Component
  const renderNotificationBar = () => {
    const recentNotifications = notifications.slice(-3);
    
    return (
      <div className="fixed top-4 right-4 z-40 space-y-2 max-w-md">
        {recentNotifications.map(notification => {
          const notifType = NOTIFICATION_TYPES[notification.type];
          return (
            <div
              key={notification.id}
              className={`${themeStyles.card} border-l-4 rounded-lg p-3 ${themeStyles.shadow} transform transition-all duration-300 hover:scale-105 cursor-pointer`}
              style={{ borderLeftColor: notifType.color }}
              onClick={() => markNotificationRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{notifType.icon}</span>
                <div className="flex-1">
                  <div className="text-xs opacity-75 mb-1">
                    {notifType.label} • Day {notification.day}
                  </div>
                  <div className="text-sm">{notification.message}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(notification.id);
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLoadPreviewModal = () => {
    if (!loadPreview.isOpen || !loadPreview.data) return null;
    const data = loadPreview.data;
    const saveDate = new Date(data.metadata.timestamp).toLocaleString();
    const totalDays = data.gameSettings?.totalDays || 30;
    const progressPercent = Math.min(100, Math.round((data.gameState.day / totalDays) * 100));
    const regionName = REGIONS[data.player.currentRegion]?.name || data.player.currentRegion;
    const netWorth = data.player.money + (Array.isArray(data.player.inventory)
      ? data.player.inventory.reduce((total, resource) => {
          return total + (data.gameState.resourcePrices?.[resource] || 100);
        }, 0)
      : 0);
    const isAiMode = data.gameState.selectedMode === 'ai';
    const difficultyLabel = isAiMode
      ? (AI_DIFFICULTY_PROFILES[data.gameState.aiDifficulty]?.name || data.gameState.aiDifficulty)
      : 'Single Player';

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-hidden"
        onClick={closeLoadPreview}
      >
        <div
          className={`${themeStyles.card} ${themeStyles.border} border rounded-xl w-full max-w-2xl h-[90vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed Header */}
          <div className={`p-6 pb-4 border-b ${themeStyles.border}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Load Save Preview</h3>
                <p className="text-sm opacity-75">{loadPreview.filename || 'Manual Save File'}</p>
              </div>
              <button onClick={closeLoadPreview} className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}>
                ✕
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className={`flex-1 overflow-y-scroll p-6 pt-4 ${themeStyles.scrollbar}`} style={{ maxHeight: 'calc(90vh - 200px)', overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <div className="font-bold mb-2">Save Details</div>
              <p>Saved At: {saveDate}</p>
              <p>Version: {data.metadata.gameVersion}</p>
              <p>Description: {data.metadata.saveDescription || 'Manual Save'}</p>
              <p>Day: {data.gameState.day} / {totalDays} ({progressPercent}%)</p>
            </div>

            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <div className="font-bold mb-2">Player Snapshot</div>
              <p>Character: {data.player.character.name}</p>
              <p>Level: {data.player.level}</p>
              <p>Money: ${data.player.money.toLocaleString()}</p>
              <p>Net Worth: ${netWorth.toLocaleString()}</p>
            </div>

            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <div className="font-bold mb-2">World State</div>
              <p>Region: {regionName}</p>
              <p>Weather: {data.gameState.weather}</p>
              <p>Season: {data.gameState.season}</p>
              <p>Current Turn: {data.gameState.currentTurn === 'ai' ? 'AI' : 'Player'}</p>
            </div>

            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <div className="font-bold mb-2">Mode & Progress</div>
              <p>Mode: {isAiMode ? 'AI Battle' : 'Single Player'}</p>
              {isAiMode && (
                <p>AI Difficulty: {difficultyLabel}</p>
              )}
              <p>Challenges Won: {Object.keys(data.player.challengeMastery || {}).length || data.player.challengesCompleted.length}</p>
              <p>Regions Visited: {data.player.visitedRegions.length}/8</p>
            </div>
            </div>

            {gameState.gameMode === 'game' && (
              <div className="mt-4 p-3 rounded-lg bg-red-500 bg-opacity-20 text-sm text-red-200">
                Loading will overwrite your current game progress. Continue?
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
            <div className="flex flex-col md:flex-row md:justify-end gap-3">
              <button onClick={closeLoadPreview} className={`${themeStyles.buttonSecondary} px-6 py-2 rounded-lg w-full md:w-auto`}>
                Cancel
              </button>
              <button onClick={confirmLoadGame} className={`${themeStyles.button} text-white px-6 py-2 rounded-lg w-full md:w-auto`}>
                Load Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Turn Indicator Component
  const renderTurnIndicator = () => {
    if (gameState.selectedMode !== 'ai') return null;
    
    const isPlayerTurn = gameState.currentTurn === 'player';
    const isAiTurn = gameState.currentTurn === 'ai';
    
    return (
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
        <div className={`${isPlayerTurn ? themeStyles.success : themeStyles.ai} ${themeStyles.shadow} rounded-full px-6 py-3 flex items-center space-x-3 animate-pulse`}>
          <span className="text-2xl">{isPlayerTurn ? '👤' : '🤖'}</span>
          <div>
            <div className="font-bold text-white">
              {isPlayerTurn ? 'YOUR TURN' : "AI'S TURN"}
            </div>
            {isAiTurn && gameState.isAiThinking && (
              <div className="text-xs text-white opacity-75">
                Thinking...
              </div>
            )}
            {currentAiAction && isAiTurn && (
              <div className="text-xs text-white opacity-75">
                {currentAiAction.description}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Day Transition Screen
  const renderDayTransitionScreen = () => {
    if (!uiState.showDayTransition) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-8 max-w-md w-full text-center ${themeStyles.shadow}`}>
          <div className="text-4xl mb-4">🌅</div>
          <h3 className="text-3xl font-bold mb-4">Day {dayTransitionData.prevDay} Complete</h3>

          {gameState.selectedMode === 'ai' && (
            <div className="space-y-3 mb-6">
              <div className={`${themeStyles.border} border rounded-lg p-3`}>
                <div className="text-sm opacity-75 mb-1">Your Earnings</div>
                <div className="text-2xl font-bold text-green-400">${dayTransitionData.playerEarned.toLocaleString()}</div>
              </div>
              <div className={`${themeStyles.border} border rounded-lg p-3`}>
                <div className="text-sm opacity-75 mb-1">AI Earnings</div>
                <div className="text-2xl font-bold text-pink-400">${dayTransitionData.aiEarned.toLocaleString()}</div>
              </div>
            </div>
          )}

          <div className="text-xl mb-6">Starting Day {dayTransitionData.newDay}...</div>

          <button
            onClick={() => updateUiState({ showDayTransition: false })}
            className={`${themeStyles.button} text-white px-6 py-3 rounded-lg font-bold w-full`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // AI Stats Modal
  const renderAiStatsModal = () => {
    if (!uiState.showAiStats || gameState.selectedMode !== 'ai') return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-6 max-w-2xl w-full`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">🤖 AI Opponent Stats</h3>
            <button
              onClick={() => updateUiState({ showAiStats: false })}
              className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-4xl">{aiPlayer.character.avatar}</span>
                <div>
                  <div className="font-bold text-lg">{aiPlayer.name}</div>
                  <div className="text-sm opacity-75">{aiPlayer.character.name}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="opacity-75">Money</div>
                  <div className="font-bold text-green-500">${aiPlayer.money}</div>
                </div>
                <div>
                  <div className="opacity-75">Net Worth</div>
                  <div className="font-bold text-blue-500">${getAiNetWorth}</div>
                </div>
                <div>
                  <div className="opacity-75">Level</div>
                  <div className="font-bold">{aiPlayer.level}</div>
                </div>
                <div>
                  <div className="opacity-75">Inventory</div>
                  <div className="font-bold">{aiPlayer.inventory.length}/{MAX_INVENTORY} items</div>
                </div>
                <div>
                  <div className="opacity-75">Current Region</div>
                  <div className="font-bold">{REGIONS[aiPlayer.currentRegion].name}</div>
                </div>
                <div>
                  <div className="opacity-75">Challenges Won</div>
                  <div className="font-bold">{Object.keys(aiPlayer.challengeMastery || {}).length || aiPlayer.challengesCompleted.length}</div>
                </div>
                <div>
                  <div className="opacity-75">Regions Visited</div>
                  <div className="font-bold">{aiPlayer.visitedRegions.length}/8</div>
                </div>
                <div>
                  <div className="opacity-75">Win Streak</div>
                  <div className="font-bold">{aiPlayer.consecutiveWins} 🔥</div>
                </div>
              </div>
            </div>
            
            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <h4 className="font-bold mb-2">Stats</h4>
              <div className="grid grid-cols-4 gap-3 text-center text-sm">
                <div>
                  <div className="opacity-75">STR</div>
                  <div className="text-lg font-bold">{aiPlayer.stats.strength}</div>
                </div>
                <div>
                  <div className="opacity-75">CHA</div>
                  <div className="text-lg font-bold">{aiPlayer.stats.charisma}</div>
                </div>
                <div>
                  <div className="opacity-75">LCK</div>
                  <div className="text-lg font-bold">{aiPlayer.stats.luck}</div>
                </div>
                <div>
                  <div className="opacity-75">INT</div>
                  <div className="text-lg font-bold">{aiPlayer.stats.intelligence}</div>
                </div>
              </div>
            </div>

            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <h4 className="font-bold mb-2">Assets & Effects</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="opacity-75">Investments</div>
                  <div className="font-bold text-green-500">
                    {aiInvestmentSummary.entries.length}
                    {aiInvestmentSummary.totalIncome > 0 && ` (+$${aiInvestmentSummary.totalIncome}/day)`}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {aiInvestmentSummary.entries.length > 0
                      ? aiInvestmentSummary.entries.map(entry => `${entry.name} (${entry.regionName})`).join(', ')
                      : 'None'}
                  </div>
                </div>
                <div>
                  <div className="opacity-75">Equipment</div>
                  <div className="font-bold text-blue-500">{aiEquipmentNames.length}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {aiEquipmentNames.length > 0 ? aiEquipmentNames.join(', ') : 'None'}
                  </div>
                </div>
                <div>
                  <div className="opacity-75">Debuffs</div>
                  <div className={`font-bold ${aiActiveDebuffs.length > 0 ? 'text-red-400' : ''}`}>
                    {aiActiveDebuffs.length}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {aiActiveDebuffs.length > 0
                      ? aiActiveDebuffs.map(debuff => `${getDebuffDisplayName(debuff.type)} (${debuff.remainingDays}d)`).join(', ')
                      : 'None'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <h4 className="font-bold mb-2">Difficulty: {AI_DIFFICULTY_PROFILES[gameState.aiDifficulty].name}</h4>
              <p className="text-sm opacity-75">
                {AI_DIFFICULTY_PROFILES[gameState.aiDifficulty].description}
              </p>
            </div>

            {/* AI Mood */}
            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <h4 className="font-bold mb-2">Current Mood</h4>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{AI_MOOD_STATES[gameState.aiMood]?.emoji}</span>
                <div>
                  <div className="font-bold capitalize">{gameState.aiMood}</div>
                  <div className="text-sm opacity-75">
                    {gameState.aiMood === 'confident' && 'Playing aggressively, taking more risks'}
                    {gameState.aiMood === 'neutral' && 'Playing balanced strategy'}
                    {gameState.aiMood === 'desperate' && 'May make risky moves to catch up'}
                    {gameState.aiMood === 'aggressive' && 'Going all-in on high-value plays'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Progress Dashboard Modal (keeping existing, adding AI comparison)
  const renderProgressDashboard = () => {
    if (!uiState.showProgress) return null;
    
    const totalRegions = Object.keys(REGIONS).length;
    const visitedCount = player.visitedRegions.length;
    const regionsProgress = (visitedCount / totalRegions) * 100;
    
    const totalChallenges = Object.values(REGIONS).reduce(
      (sum, region: any) => sum + region.challenges.length,
      0
    );
    const completedCount = Object.keys(player.challengeMastery || {}).length || player.challengesCompleted.length;
    const challengesProgress = (completedCount / totalChallenges) * 100;
    
    const playerScore = calculateFinalScore(player);
    const aiScore = gameState.selectedMode === 'ai' ? calculateFinalScore(aiPlayer) : 0;
    const scoreComparison = playerScore - aiScore;
    
    const daysRemaining = gameSettings.totalDays - gameState.day;
    const timeProgress = (gameState.day / gameSettings.totalDays) * 100;
    
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
        onClick={() => updateUiState({ showProgress: false })}
      >
        <div
          className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-4xl w-full h-[90vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed Header */}
          <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
            <h3 className="text-2xl font-bold">📊 Progress Dashboard</h3>
            <button
              onClick={() => updateUiState({ showProgress: false })}
              className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div className={`flex-1 overflow-y-scroll p-6 pt-4 ${themeStyles.scrollbar}`} style={{ maxHeight: 'calc(90vh - 180px)', overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Progress */}
            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">⏰ Time</h4>
                <span className="text-sm">Day {gameState.day} / {gameSettings.totalDays}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${timeProgress}%` }}
                />
              </div>
              <div className="text-sm text-center">
                {daysRemaining} days remaining
              </div>
            </div>
            
            {/* Net Worth */}
            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <h4 className="font-bold mb-2">💎 Net Worth</h4>
              <div className="text-3xl font-bold text-green-500 mb-2">
                ${getNetWorth.toLocaleString()}
              </div>
              <div className="text-sm space-y-1">
                <div>Cash: ${player.money.toLocaleString()}</div>
                <div>Inventory: ${getInventoryValue.toLocaleString()}</div>
              </div>
            </div>

            {/* Net Worth History Graph */}
            {gameState.netWorthHistory.length > 1 && (
              <div className={`${themeStyles.border} border rounded-lg p-4 md:col-span-2`}>
                <h4 className="font-bold mb-3">📈 Net Worth History</h4>
                <div className="h-32 flex items-end space-x-1">
                  {gameState.netWorthHistory.slice(-15).map((entry, index) => {
                    const maxWorth = Math.max(...gameState.netWorthHistory.map(e => Math.max(e.playerWorth, e.aiWorth || 0)));
                    const playerHeight = (entry.playerWorth / maxWorth) * 100;
                    const aiHeight = gameState.selectedMode === 'ai' ? (entry.aiWorth / maxWorth) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex space-x-0.5" title={`Day ${entry.day}: You $${entry.playerWorth}${gameState.selectedMode === 'ai' ? `, AI $${entry.aiWorth}` : ''}`}>
                        <div
                          className="flex-1 bg-green-500 rounded-t transition-all"
                          style={{ height: `${playerHeight}%` }}
                        />
                        {gameState.selectedMode === 'ai' && (
                          <div
                            className="flex-1 bg-pink-500 rounded-t transition-all"
                            style={{ height: `${aiHeight}%` }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center space-x-4 mt-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>You</span>
                  </div>
                  {gameState.selectedMode === 'ai' && (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-pink-500 rounded"></div>
                      <span>AI</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Active Events */}
            {gameState.activeEvents.length > 0 && (
              <div className={`${themeStyles.border} border rounded-lg p-4 md:col-span-2`}>
                <h4 className="font-bold mb-3">⚡ Active Events</h4>
                <div className="space-y-2">
                  {gameState.activeEvents.map((event, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-700 bg-opacity-50 rounded-lg p-2">
                      <div>
                        <div className="font-bold text-sm">{event.name}</div>
                        <div className="text-xs opacity-75">{REGIONS[event.region]?.name || event.region} - {event.description}</div>
                      </div>
                      <div className="text-sm bg-yellow-500 bg-opacity-20 text-yellow-400 px-2 py-1 rounded">
                        {event.remainingDays} days
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best Day Record */}
            {gameState.bestDayRecord.earned > 0 && (
              <div className={`${themeStyles.border} border rounded-lg p-4`}>
                <h4 className="font-bold mb-2">🌟 Best Day</h4>
                <div className="text-2xl font-bold text-yellow-500">
                  Day {gameState.bestDayRecord.day}
                </div>
                <div className="text-sm opacity-75">
                  Earned ${gameState.bestDayRecord.earned.toLocaleString()}
                </div>
              </div>
            )}

            {/* Streak Status */}
            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <h4 className="font-bold mb-2">🔥 Current Streak</h4>
              <div className="text-2xl font-bold">
                {player.consecutiveWins} wins
              </div>
              {(() => {
                const streakTiers = Object.keys(STREAK_BONUSES).map(Number).sort((a, b) => a - b);
                const nextTier = streakTiers.find(t => t > player.consecutiveWins);
                const currentTierKey = streakTiers.filter(t => t <= player.consecutiveWins).pop();
                const currentTier = currentTierKey ? STREAK_BONUSES[currentTierKey] : null;
                return (
                  <>
                    {currentTier && (
                      <div className="text-sm text-yellow-400">{currentTier.emoji} {currentTier.label}</div>
                    )}
                    {nextTier && (
                      <div className="text-xs opacity-75 mt-1">
                        {nextTier - player.consecutiveWins} more for {STREAK_BONUSES[nextTier].label}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            
            {/* Regions Explored */}
            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">🗺️ Regions</h4>
                <span className="text-sm">{visitedCount} / {totalRegions}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${regionsProgress}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.keys(REGIONS).map(region => (
                  <span
                    key={region}
                    className={`text-xs px-2 py-1 rounded ${
                      player.visitedRegions.includes(region)
                        ? 'bg-purple-600'
                        : 'bg-gray-700'
                    }`}
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Challenges Completed */}
            <div className={`${themeStyles.border} border rounded-lg p-4`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">🎯 Challenges</h4>
                <span className="text-sm">{completedCount} / {totalChallenges}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="bg-yellow-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${challengesProgress}%` }}
                />
              </div>
              <div className="text-sm">
                Win streak: {player.consecutiveWins} 🔥
              </div>
            </div>
            
            {/* AI Comparison */}
            {gameState.selectedMode === 'ai' && (
              <div className={`${themeStyles.border} border rounded-lg p-4 md:col-span-2`}>
                <h4 className="font-bold mb-3">⚔️ VS {aiPlayer.name}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm opacity-75 mb-1">Your Score</div>
                    <div className="text-2xl font-bold text-green-500">
                      {playerScore}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm opacity-75 mb-1">AI Score</div>
                    <div className="text-2xl font-bold text-pink-500">
                      {aiScore}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  {scoreComparison > 0 ? (
                    <div className="text-green-500">
                      ✅ Leading by {scoreComparison} points!
                    </div>
                  ) : scoreComparison < 0 ? (
                    <div className="text-red-500">
                      ⚠️ Behind by {Math.abs(scoreComparison)} points
                    </div>
                  ) : (
                    <div className="text-yellow-500">
                      🤝 Tied!
                    </div>
                  )}
                </div>
                <button
                  onClick={() => updateUiState({ showAiStats: true, showProgress: false })}
                  className={`${themeStyles.ai} text-white px-4 py-2 rounded-lg w-full mt-3 text-sm`}
                >
                  View AI Stats
                </button>
              </div>
            )}
            
            {/* Personal Records */}
            <div className={`${themeStyles.border} border rounded-lg p-4 md:col-span-2`}>
              <h4 className="font-bold mb-3">🏆 Personal Records</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="opacity-75">Highest Challenge Win</div>
                  <div className="font-bold text-lg">
                    ${personalRecords.highestChallenge}
                  </div>
                </div>
                <div>
                  <div className="opacity-75">Most Valuable Sale</div>
                  <div className="font-bold text-lg">
                    ${personalRecords.mostExpensiveResourceSold.price}
                  </div>
                  {personalRecords.mostExpensiveResourceSold.resource && (
                    <div className="text-xs opacity-75">
                      ({personalRecords.mostExpensiveResourceSold.resource})
                    </div>
                  )}
                </div>
                <div>
                  <div className="opacity-75">Best Win Streak</div>
                  <div className="font-bold text-lg">
                    {personalRecords.consecutiveWins} 🔥
                  </div>
                </div>
                <div>
                  <div className="opacity-75">Peak Money</div>
                  <div className="font-bold text-lg">
                    ${personalRecords.maxMoney.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="opacity-75">Total Earned</div>
                  <div className="font-bold text-lg">
                    ${personalRecords.totalEarned.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="opacity-75">Current Level</div>
                  <div className="font-bold text-lg">
                    Level {player.level}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
            <button onClick={() => updateUiState({ showProgress: false })} className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  // [Continue with remaining render functions - Menu, Game, etc. - keeping existing implementations]
  // Due to length constraints, I'll include the key changes and mention that other render functions remain the same

  // Menu Screen with AI Mode Option
  const renderMenu = () => {
    const isDark = uiState.theme === "dark";

    return (
      <div className={`min-h-screen ${themeStyles.menuBackground} ${themeStyles.text} flex items-center justify-center p-6 relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-72 h-72 ${isDark ? 'bg-blue-500/10' : 'bg-blue-300/20'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 ${isDark ? 'bg-purple-500/10' : 'bg-purple-300/20'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute top-1/2 left-1/2 w-64 h-64 ${isDark ? 'bg-amber-500/5' : 'bg-amber-300/15'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
        </div>

        <div className={`${themeStyles.menuCard} rounded-2xl p-8 max-w-lg w-full text-center relative z-10`}>
          {/* Logo and Title */}
          <div className="mb-6">
            <div className="text-6xl mb-3 animate-bounce" style={{ animationDuration: '2s' }}>🦘</div>
            <h1 className={`text-4xl font-extrabold mb-2 ${themeStyles.menuTitle}`}>
              Aussie Adventure
            </h1>
            <p className={`${themeStyles.textMuted} text-sm`}>
              Explore Australia, take on challenges, and become the ultimate adventurer!
            </p>
          </div>

          {/* Character Selection */}
          <div className="mb-6">
            <h3 className={`${themeStyles.heading} text-lg mb-4 flex items-center justify-center gap-2`}>
              <span>👤</span> Choose Your Character
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {CHARACTERS.map((char, index) => (
                <button
                  key={index}
                  onClick={() => updateUiState({ selectedCharacter: index })}
                  className={`relative rounded-xl p-4 transition-all duration-300 transform hover:scale-105 ${
                    uiState.selectedCharacter === index
                      ? isDark
                        ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-2 border-blue-400 shadow-lg shadow-blue-500/20'
                        : 'bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-500 shadow-lg shadow-blue-300/50'
                      : isDark
                        ? 'bg-gray-700/50 border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-700/70'
                        : 'bg-white/50 border-2 border-gray-200 hover:border-gray-300 hover:bg-white/80'
                  }`}
                >
                  {uiState.selectedCharacter === index && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      ✓
                    </div>
                  )}
                  <div className="text-4xl mb-2">{char.avatar}</div>
                  <div className={`font-bold ${themeStyles.text}`}>{char.name}</div>
                  <div className={`text-xs ${themeStyles.textMuted} mt-1`}>{char.ability}</div>
                  <div className={`text-xs mt-2 font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    💰 ${char.startingMoney}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Player Name Input */}
          <div className="mb-6">
            <label className={`${themeStyles.label} text-sm mb-2 block text-left`}>Your Name</label>
            <input
              type="text"
              placeholder="Enter your adventurer name..."
              value={uiState.playerName}
              onChange={(e) => updateUiState({ playerName: e.target.value })}
              className={`${themeStyles.input} rounded-xl px-4 py-3 w-full text-center font-medium`}
            />
          </div>

          {/* Game Mode Selection */}
          <div className="space-y-3">
            <button
              onClick={() => {
                dispatchPlayer({
                  type: 'RESET_PLAYER',
                  payload: {
                    characterIndex: uiState.selectedCharacter,
                    name: uiState.playerName || "Player"
                  }
                });
                dispatchGameState({ type: 'SET_SELECTED_MODE', payload: 'single' });
                dispatchGameState({ type: 'SET_GAME_MODE', payload: 'game' });
                dispatchGameState({ type: 'SET_TURN', payload: 'player' });
                dispatchGameState({ type: 'RESET_GAME' });
                addNotification('Welcome to Australia! 🦘', 'info', true);
                addNotification('Press ? for keyboard shortcuts', 'info', true);
              }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] ${
                isDark
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/40'
              }`}
            >
              🎮 Single Player Mode
            </button>

            <button
              onClick={() => updateUiState({ showCampaignSelect: true })}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] ${
                isDark
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/40'
              }`}
            >
              🤖 AI Opponent Mode
            </button>

            <button
              onClick={() => updateUiState({ showSaveLoadModal: true })}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                isDark
                  ? 'bg-gray-700/80 hover:bg-gray-600 text-gray-200 border border-gray-600'
                  : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200 shadow-sm'
              }`}
            >
              💾 Save / Load Game
            </button>
          </div>

          {/* Theme Toggle & Settings */}
          <div className="mt-6 pt-4 border-t border-opacity-20 flex items-center justify-center gap-3">
            <button
              onClick={() => updateUiState({ theme: uiState.theme === "dark" ? "light" : "dark" })}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {uiState.theme === "dark" ? "☀️" : "🌙"}
              <span className="text-sm">{uiState.theme === "dark" ? "Light" : "Dark"} Mode</span>
            </button>
          </div>

          {/* Footer */}
          <div className={`mt-4 text-xs ${themeStyles.textDisabled}`}>
            Press <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>?</kbd> for keyboard shortcuts
          </div>
        </div>
      </div>
    );
  };

  // Campaign/AI Difficulty Selection
  const renderCampaignSelect = () => {
    if (!uiState.showCampaignSelect) return null;
    const isDark = uiState.theme === "dark";

    const difficultyColors: Record<string, { bg: string, border: string, glow: string }> = {
      easy: {
        bg: isDark ? 'from-green-600/20 to-emerald-600/20' : 'from-green-100 to-emerald-100',
        border: isDark ? 'border-green-500' : 'border-green-400',
        glow: isDark ? 'shadow-green-500/20' : 'shadow-green-400/30'
      },
      medium: {
        bg: isDark ? 'from-yellow-600/20 to-amber-600/20' : 'from-yellow-100 to-amber-100',
        border: isDark ? 'border-yellow-500' : 'border-yellow-400',
        glow: isDark ? 'shadow-yellow-500/20' : 'shadow-yellow-400/30'
      },
      hard: {
        bg: isDark ? 'from-red-600/20 to-orange-600/20' : 'from-red-100 to-orange-100',
        border: isDark ? 'border-red-500' : 'border-red-400',
        glow: isDark ? 'shadow-red-500/20' : 'shadow-red-400/30'
      },
      expert: {
        bg: isDark ? 'from-purple-600/20 to-pink-600/20' : 'from-purple-100 to-pink-100',
        border: isDark ? 'border-purple-500' : 'border-purple-400',
        glow: isDark ? 'shadow-purple-500/20' : 'shadow-purple-400/30'
      }
    };

    return (
      <div className={`min-h-screen ${themeStyles.menuBackground} ${themeStyles.text} flex items-center justify-center p-6 relative overflow-hidden`}>
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-10 right-20 w-80 h-80 ${isDark ? 'bg-purple-500/10' : 'bg-purple-300/20'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-10 left-20 w-64 h-64 ${isDark ? 'bg-blue-500/10' : 'bg-blue-300/20'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        </div>

        <div className={`${themeStyles.menuCard} rounded-2xl p-8 max-w-2xl w-full relative z-10`}>
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🤖</div>
            <h2 className={`text-3xl font-extrabold ${themeStyles.menuTitle}`}>Select AI Difficulty</h2>
            <p className={`${themeStyles.textMuted} mt-2`}>Choose your opponent's skill level</p>
          </div>

          <div className="space-y-4">
            {Object.entries(AI_DIFFICULTY_PROFILES).map(([key, profile]) => {
              const colors = difficultyColors[key] || difficultyColors.medium;
              return (
                <button
                  key={key}
                  onClick={() => {
                    const aiCharIndex = Math.floor(Math.random() * CHARACTERS.length);
                    const aiChar = CHARACTERS[aiCharIndex];

                    dispatchPlayer({
                      type: 'RESET_PLAYER',
                      payload: {
                        characterIndex: uiState.selectedCharacter,
                        name: uiState.playerName || "Player"
                      }
                    });

                    setAiPlayer({
                      money: aiChar.startingMoney,
                      currentRegion: "QLD",
                      inventory: [],
                      visitedRegions: ["QLD"],
                      challengesCompleted: [],
                      character: aiChar,
                      level: 1,
                      xp: 0,
                      stats: { ...aiChar.startingStats },
                      consecutiveWins: 0,
                      specialAbilityUses: aiChar.specialAbility.usesLeft,
                      masteryUnlocks: [],
                      name: `${aiChar.name} AI`,
                      actionsUsedThisTurn: 0,
                      overridesUsedToday: 0,
                      overrideFatigue: 0,
                      loans: [],
                      completedThisSeason: [],
                      challengeMastery: {},
                      stipendCooldown: 0,
                      investments: [],
                      equipment: [],
                      debuffs: []
                    });
                    setAiActiveSpecialAbility(null);
                    aiRngSeedRef.current = gameSettings.aiDeterministicSeed;
                    aiRngStateRef.current = normalizeAiSeed(gameSettings.aiDeterministicSeed);

                    dispatchGameState({ type: 'SET_SELECTED_MODE', payload: 'ai' });
                    dispatchGameState({ type: 'SET_AI_DIFFICULTY', payload: key });
                    dispatchGameState({ type: 'SET_TURN', payload: 'player' });
                    dispatchGameState({ type: 'SET_GAME_MODE', payload: 'game' });
                    dispatchGameState({ type: 'RESET_GAME' });
                    updateUiState({ showCampaignSelect: false });
                    addNotification(`AI Battle started! Difficulty: ${profile.name}`, 'ai', true);
                    addNotification('Press ? for keyboard shortcuts', 'info', true);
                  }}
                  className={`w-full text-left rounded-xl p-5 transition-all duration-300 transform hover:scale-[1.02] border-2 bg-gradient-to-r ${colors.bg} ${colors.border} hover:shadow-lg ${colors.glow}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`font-bold text-xl mb-1 ${themeStyles.text}`}>{profile.name}</div>
                      <p className={`text-sm ${themeStyles.textSecondary} mb-3`}>{profile.description}</p>
                      <div className={`grid grid-cols-2 gap-2 text-xs ${themeStyles.textMuted}`}>
                        <div className="flex items-center gap-1">
                          <span className="text-blue-500">🎯</span> Decision: {Math.round(profile.decisionQuality * 100)}%
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⚡</span> Risk: {Math.round(profile.riskTolerance * 100)}%
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-purple-500">🧠</span> Planning: Lvl {profile.planningDepth}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-red-500">❌</span> Mistakes: {Math.round(profile.mistakeChance * 100)}%
                        </div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-sm font-bold ml-4 text-white ${
                      key === 'easy' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      key === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                      key === 'hard' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                      'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {key.toUpperCase()}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => updateUiState({ showCampaignSelect: false })}
            className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isDark
                ? 'bg-gray-700/80 hover:bg-gray-600 text-gray-200 border border-gray-600'
                : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200'
            }`}
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    );
  };

  // Main Game Screen (keeping existing with minor additions)
  const renderGame = () => {
    const currentRegion = REGIONS[player.currentRegion];
    const adjacentRegions = ADJACENT_REGIONS[player.currentRegion] || [];
    const isPlayerTurn = gameState.currentTurn === 'player';
    const isShopRegion = EQUIPMENT_SHOP_REGIONS.includes(player.currentRegion);
    const actionButtonCompact = gameSettings.investmentsEnabled || gameSettings.equipmentShopEnabled || gameSettings.sabotageEnabled;
    const actionButtonSize = actionButtonCompact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2';
    const actionButtonGap = actionButtonCompact ? 'gap-1.5' : 'gap-2';
    const actionButtonClass = `${themeStyles.button} text-white rounded-lg flex items-center ${actionButtonSize} ${actionButtonGap} disabled:opacity-50`;
    const actionButtonSecondaryClass = `${themeStyles.buttonSecondary} rounded-lg flex items-center ${actionButtonSize} ${actionButtonGap}`;
    const actionButtonKbdClass = `${actionButtonCompact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'} bg-black bg-opacity-30 rounded`;
    const quickActionCompact = actionButtonCompact || getQuickActions.length > 6;
    const quickActionButtonClass = `${themeStyles.button} text-white rounded-lg flex items-center ${quickActionCompact ? 'px-3 py-1.5 text-xs gap-1.5' : 'px-4 py-2 text-sm gap-2'} hover:scale-105 transform transition-all disabled:opacity-50`;
    const quickActionKbdClass = `${quickActionCompact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'} bg-black bg-opacity-30 rounded`;
    const quickActionLabelClass = quickActionCompact ? 'text-xs font-bold opacity-75 mr-2' : 'text-sm font-bold opacity-75 mr-2';
    const quickActionHideClass = `${themeStyles.buttonSecondary} ${quickActionCompact ? 'px-2 py-1' : 'px-2 py-2'} rounded ml-2`;
    
    return (
      <div className={`min-h-screen ${themeStyles.background} ${themeStyles.text} p-4`}>
        {/* Notification Bar */}
        {renderNotificationBar()}
        
        {/* Turn Indicator */}
        {renderTurnIndicator()}

        {/* Day Transition Screen */}
        {renderDayTransitionScreen()}

        {/* Quick Actions Bar - only show on player turn */}
        {isPlayerTurn && getQuickActions.length > 0 && uiState.quickActionsOpen && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
            <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-3 ${themeStyles.shadow}`}>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-[95vw]">
                <span className={quickActionLabelClass}>Quick Actions:</span>
                {getQuickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    disabled={!isPlayerTurn}
                    className={quickActionButtonClass}
                  >
                    <span>{action.icon}</span>
                    <span className={quickActionCompact ? 'text-xs' : 'text-sm'}>{action.label}</span>
                    {action.hotkey && (
                      <kbd className={quickActionKbdClass}>
                        {action.hotkey}
                      </kbd>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => updateUiState({ quickActionsOpen: false })}
                  className={quickActionHideClass}
                  title="Hide quick actions"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Top Status Bar */}
        <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-4 mb-4 ${themeStyles.shadow}`}>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-sm opacity-75">Player</div>
                <div className="font-bold">{player.name}</div>
              </div>
              <div>
                <div className="text-sm opacity-75">Money</div>
                <div className="font-bold text-green-500">${player.money}</div>
              </div>
              <div>
                <div className="text-sm opacity-75">Net Worth</div>
                <div className="font-bold text-blue-500">${getNetWorth}</div>
              </div>
              <div>
                <div className="text-sm opacity-75">Level</div>
                <div className="font-bold text-purple-500">{player.level}</div>
              </div>
              {gameState.selectedMode === 'ai' && (
                <>
                  <div className="border-l border-gray-600 h-10 mx-2"></div>
                  <div>
                    <div className="text-sm opacity-75">AI Money</div>
                    <div className="font-bold text-pink-500">${aiPlayer.money}</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-75">AI Level</div>
                    <div className="font-bold text-pink-500">{aiPlayer.level}</div>
                  </div>
                  <button
                    onClick={() => updateUiState({ showAiStats: true })}
                    className={`${themeStyles.ai} text-white px-3 py-1 rounded text-sm`}
                  >
                    AI Stats
                  </button>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-sm opacity-75">Day</div>
                <div className="font-bold">{gameState.day} / {gameSettings.totalDays}</div>
              </div>
              <div>
                <div className="text-sm opacity-75">
                  {gameState.currentTurn === 'player' ? 'Your Actions' : 'AI Actions'}
                </div>
                <div className="font-bold">
                  {gameState.currentTurn === 'player' ? (
                    <>
                      {player.actionsUsedThisTurn} / {gameSettings.playerActionsPerDay}
                      {player.actionsUsedThisTurn > gameSettings.playerActionsPerDay && ' ⚡'}
                    </>
                  ) : (
                    <>
                      {aiPlayer.actionsUsedThisTurn} / {gameSettings.aiActionsPerDay * (1 + (aiPlayer.overridesUsedToday || 0))}
                    </>
                  )}
                </div>
              </div>
              <div className="relative group">
                <div className="text-sm opacity-75">Season</div>
                <div className="font-bold">{gameState.season}</div>
                {/* Season effect tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                  <div className={`${themeStyles.card} border ${themeStyles.border} rounded-lg p-2 text-xs whitespace-nowrap shadow-lg`}>
                    <div className="font-bold mb-1">{SEASON_EFFECTS[gameState.season]?.description}</div>
                    <div className="space-y-0.5 opacity-75">
                      <div>Travel: {SEASON_EFFECTS[gameState.season]?.travelCostModifier > 1 ? `+${Math.round((SEASON_EFFECTS[gameState.season].travelCostModifier - 1) * 100)}%` : SEASON_EFFECTS[gameState.season]?.travelCostModifier < 1 ? `-${Math.round((1 - SEASON_EFFECTS[gameState.season].travelCostModifier) * 100)}%` : 'Normal'}</div>
                      <div>Bonus Resources: +{Math.round((SEASON_EFFECTS[gameState.season]?.bonusResourceChance || 0) * 100)}%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="text-sm opacity-75">Weather</div>
                <div className={`font-bold ${gameState.weather === 'Stormy' ? 'text-yellow-400' : gameState.weather === 'Rainy' ? 'text-blue-400' : ''}`}>
                  {gameState.weather === 'Sunny' ? '☀️' : gameState.weather === 'Cloudy' ? '☁️' : gameState.weather === 'Rainy' ? '🌧️' : '⛈️'} {gameState.weather}
                </div>
                {/* Weather effect tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                  <div className={`${themeStyles.card} border ${themeStyles.border} rounded-lg p-2 text-xs whitespace-nowrap shadow-lg`}>
                    <div className="font-bold mb-1">{WEATHER_EFFECTS[gameState.weather]?.description}</div>
                    <div className="space-y-0.5 opacity-75">
                      <div>Travel Cost: {WEATHER_EFFECTS[gameState.weather]?.travelCostModifier > 1 ? `+${Math.round((WEATHER_EFFECTS[gameState.weather].travelCostModifier - 1) * 100)}%` : 'Normal'}</div>
                      {Object.entries(WEATHER_EFFECTS[gameState.weather]?.challengeModifier || {}).map(([type, mod]) => (
                        mod !== 0 && <div key={type}>{type}: {(mod as number) > 0 ? '+' : ''}{Math.round((mod as number) * 100)}%</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* AI Mood (only in AI mode) */}
              {gameState.selectedMode === 'ai' && (
                <div>
                  <div className="text-sm opacity-75">AI Mood</div>
                  <div className="font-bold">
                    {AI_MOOD_STATES[gameState.aiMood]?.emoji} {gameState.aiMood.charAt(0).toUpperCase() + gameState.aiMood.slice(1)}
                  </div>
                </div>
              )}
              {(gameSettings.investmentsEnabled || playerInvestmentSummary.entries.length > 0) && (
                <div className="relative group">
                  <div className="text-sm opacity-75">Investments</div>
                  <div className="font-bold text-green-400">
                    {playerInvestmentSummary.entries.length}
                    {playerInvestmentSummary.totalIncome > 0 && ` (+$${playerInvestmentSummary.totalIncome}/day)`}
                  </div>
                  {playerInvestmentSummary.entries.length > 0 && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                      <div className={`${themeStyles.card} border ${themeStyles.border} rounded-lg p-2 text-xs whitespace-nowrap shadow-lg`}>
                        {playerInvestmentSummary.entries.map(entry => (
                          <div key={entry.regionCode} className="flex justify-between space-x-2">
                            <span>{entry.name} ({entry.regionName})</span>
                            <span className="font-semibold">+${entry.dailyIncome}/day</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {(gameSettings.equipmentShopEnabled || playerEquipmentNames.length > 0) && (
                <div className="relative group">
                  <div className="text-sm opacity-75">Equipment</div>
                  <div className="font-bold text-blue-400">{playerEquipmentNames.length}</div>
                  {playerEquipmentNames.length > 0 && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                      <div className={`${themeStyles.card} border ${themeStyles.border} rounded-lg p-2 text-xs whitespace-nowrap shadow-lg`}>
                        {playerEquipmentNames.map((name, index) => (
                          <div key={`${name}-${index}`}>{name}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {((gameSettings.sabotageEnabled && gameState.selectedMode === 'ai') || playerActiveDebuffs.length > 0) && (
                <div className="relative group">
                  <div className="text-sm opacity-75">Debuffs</div>
                  <div className={`font-bold ${playerActiveDebuffs.length > 0 ? 'text-red-400' : ''}`}>
                    {playerActiveDebuffs.length}
                  </div>
                  {playerActiveDebuffs.length > 0 && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                      <div className={`${themeStyles.card} border ${themeStyles.border} rounded-lg p-2 text-xs whitespace-nowrap shadow-lg`}>
                        {playerActiveDebuffs.map(debuff => (
                          <div key={`${debuff.type}-${debuff.remainingDays}`}>
                            {getDebuffDisplayName(debuff.type)} ({debuff.remainingDays}d)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Active Events Indicator */}
              {gameState.activeEvents.length > 0 && (
                <div className="relative group">
                  <div className="text-sm opacity-75">Events</div>
                  <div className="font-bold text-yellow-400">
                    ⚡ {gameState.activeEvents.length} Active
                  </div>
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50">
                    <div className={`${themeStyles.card} border ${themeStyles.border} rounded-lg p-2 text-xs shadow-lg min-w-48`}>
                      {gameState.activeEvents.map((event, idx) => (
                        <div key={idx} className="mb-1 last:mb-0">
                          <div className="font-bold">{event.name}</div>
                          <div className="opacity-75">{REGIONS[event.region]?.name} - {event.remainingDays}d left</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons Bar */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => updateUiState({ showSaveLoadModal: true })}
            className={actionButtonSecondaryClass}
          >
            <span>💾</span>
            <span>Save / Load</span>
            <kbd className={actionButtonKbdClass}>Ctrl+S</kbd>
          </button>
          <button
            onClick={() => updateUiState({ showChallenges: true })}
            disabled={!isPlayerTurn}
            className={actionButtonClass}
          >
            <span>🎯</span>
            <span>Challenges</span>
            <kbd className={actionButtonKbdClass}>C</kbd>
          </button>
          
          <button
            onClick={() => updateUiState({ showTravelModal: true })}
            disabled={!isPlayerTurn}
            className={actionButtonClass}
          >
            <span>✈️</span>
            <span>Travel</span>
            <kbd className={actionButtonKbdClass}>T</kbd>
          </button>
          
          <button
            onClick={() => updateUiState({ showMarket: true })}
            disabled={!isPlayerTurn}
            className={actionButtonClass}
          >
            <span>💰</span>
            <span>Market ({player.inventory.length}/{MAX_INVENTORY})</span>
            <kbd className={actionButtonKbdClass}>R</kbd>
          </button>
          {gameSettings.equipmentShopEnabled && (
            <button
              onClick={() => updateUiState({ showShop: true })}
              disabled={!isPlayerTurn || !isShopRegion}
              className={actionButtonClass}
            >
              <span>🛒</span>
              <span>Shop</span>
            </button>
          )}
          {gameSettings.investmentsEnabled && (
            <button
              onClick={() => updateUiState({ showInvestments: true })}
              disabled={!isPlayerTurn}
              className={actionButtonClass}
            >
              <span>🏦</span>
              <span>Investments</span>
            </button>
          )}
          {gameSettings.craftingEnabled && (
            <button
              onClick={() => updateUiState({ showWorkshop: true })}
              disabled={!isPlayerTurn}
              className={actionButtonClass}
            >
              <span>🛠️</span>
              <span>Workshop</span>
            </button>
          )}
          {gameSettings.loansEnabled && (
            <button
              onClick={() => updateUiState({ showBank: true })}
              disabled={!isPlayerTurn}
              className={actionButtonClass}
            >
              <span>💰</span>
              <span>Bank</span>
            </button>
          )}
          {gameSettings.sabotageEnabled && gameState.selectedMode === 'ai' && (
            <button
              onClick={() => updateUiState({ showSabotage: true })}
              disabled={!isPlayerTurn}
              className={actionButtonClass}
            >
              <span>{SABOTAGE_ICON}</span>
              <span>Sabotage</span>
            </button>
          )}

          {/* Special Ability Button */}
          {player.character.specialAbility && (
            <button
              onClick={activateSpecialAbility}
              disabled={!isPlayerTurn || player.specialAbilityUses <= 0 || activeSpecialAbility !== null}
              className={`${activeSpecialAbility ? 'bg-gradient-to-r from-purple-600 to-blue-600' : themeStyles.accent} text-white rounded-lg flex items-center ${actionButtonSize} ${actionButtonGap} disabled:opacity-50 relative`}
            >
              <span>✨</span>
              <span>{player.character.specialAbility.name.split(' ')[0]}</span>
              <span className="bg-black bg-opacity-40 px-1.5 py-0.5 rounded text-xs">{player.specialAbilityUses}</span>
              {activeSpecialAbility && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse">
                  ACTIVE
                </span>
              )}
            </button>
          )}

          {/* Tourist Luck Retry Button - Only shows after failed challenge */}
          {failedChallengeData && player.character.name === "Tourist" && player.specialAbilityUses > 0 && (
            <button
              onClick={retryFailedChallenge}
              disabled={!isPlayerTurn}
              className={`bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg flex items-center ${actionButtonSize} ${actionButtonGap} disabled:opacity-50 animate-pulse`}
            >
              <span>🍀</span>
              <span>Retry Challenge</span>
            </button>
          )}

          {/* Double or Nothing Button - Shows after winning a challenge (only if enabled in settings) */}
          {gameSettings.doubleOrNothingEnabled && gameState.doubleOrNothingAvailable && isPlayerTurn && (
            <button
              onClick={handleDoubleOrNothing}
              className={`bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg flex items-center ${actionButtonSize} ${actionButtonGap} animate-pulse`}
            >
              <span>🎲</span>
              <span>Double or Nothing (${gameState.lastChallengeReward})</span>
            </button>
          )}

          {/* Streak Indicator */}
          {player.consecutiveWins >= 3 && (
            <div className="flex items-center px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white text-sm">
              {(() => {
                const streakTiers = Object.keys(STREAK_BONUSES).map(Number).sort((a, b) => b - a);
                const currentTierKey = streakTiers.find(t => t <= player.consecutiveWins);
                const tier = currentTierKey ? STREAK_BONUSES[currentTierKey] : null;
                return tier ? (
                  <span>{tier.emoji} {tier.label} ({player.consecutiveWins})</span>
                ) : null;
              })()}
            </div>
          )}

          <button
            onClick={() => updateUiState({ showProgress: true })}
            className={`${themeStyles.accent} text-white px-4 py-2 rounded-lg flex items-center space-x-2`}
          >
            <span>📊</span>
            <span>Progress</span>
            <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">P</kbd>
          </button>
          
          <button
            onClick={() => updateUiState({ showNotifications: true })}
            className={`${themeStyles.buttonSecondary} px-4 py-2 rounded-lg flex items-center space-x-2 relative`}
          >
            <span>📜</span>
            <span>History</span>
            <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">N</kbd>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => updateUiState({ showHelp: true })}
            className={`${themeStyles.buttonSecondary} px-4 py-2 rounded-lg`}
          >
            <span>❓</span>
          </button>
          
          <button
            onClick={() => updateUiState({ showSettings: true })}
            className={`${themeStyles.buttonSecondary} px-4 py-2 rounded-lg`}
          >
            <span>⚙️</span>
          </button>
          
          <div className="flex-1"></div>
          
          <button
            onClick={handleEndTurn}
            disabled={!isPlayerTurn || gameState.day >= gameSettings.totalDays}
            className={`${themeStyles.button} text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 flex items-center space-x-2`}
          >
            <span>⏭️</span>
            <span>End Turn</span>
            <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">Space</kbd>
          </button>
        </div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Current Region Info */}
          <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-6 ${themeStyles.shadow}`}>
            <h3 className="text-2xl font-bold mb-3">📍 {currentRegion.name}</h3>
            <p className="text-sm opacity-75 mb-4">{currentRegion.description}</p>
            
            <div className="mb-4">
              <div className="text-sm font-bold mb-2">💡 Fun Fact</div>
              <p className="text-sm opacity-75">{currentRegion.funFact}</p>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-bold mb-2">📦 Resources</div>
              <div className="flex flex-wrap gap-2">
                {REGIONAL_RESOURCES[player.currentRegion]?.map((resource, index) => (
                  <span key={index} className={`${themeStyles.border} border rounded px-2 py-1 text-xs`}>
                    {resource}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-bold mb-2">✈️ Adjacent Regions</div>
              <div className="space-y-2">
                {adjacentRegions.map(regionCode => {
                  const cost = calculateTravelCost(player.currentRegion, regionCode);
                  return (
                    <button
                      key={regionCode}
                      onClick={() => travelToRegion(regionCode)}
                      disabled={player.money < cost || !isPlayerTurn}
                      className={`${themeStyles.border} border rounded px-3 py-2 text-sm w-full text-left hover:border-blue-500 disabled:opacity-50 transition-all`}
                    >
                      <div className="flex justify-between">
                        <span>{REGIONS[regionCode].name}</span>
                        <span>${cost}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Middle Column - Map */}
          {uiState.showMap && (
            <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-6 ${themeStyles.shadow} lg:col-span-2`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">🗺️ Australia Map</h3>
                <button
                  onClick={() => updateUiState({ showMap: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded text-sm`}
                >
                  Hide Map
                </button>
              </div>
              
              <div className="relative w-full h-96 bg-gray-800 rounded-lg overflow-hidden">
                {Object.entries(REGIONS).map(([code, region]: [string, any]) => {
                  const isPlayerHere = player.currentRegion === code;
                  const isAiHere = gameState.selectedMode === 'ai' && aiPlayer.currentRegion === code;
                  const isPlayerVisited = player.visitedRegions.includes(code);
                  const isAdjacent = adjacentRegions.includes(code);
                  
                  const hasEvent = gameState.activeEvents.some(e => e.region === code);
                  const travelCost = !isPlayerHere ? calculateTravelCost(player.currentRegion, code) : 0;
                  const canAfford = player.money >= travelCost;

                  return (
                    <div
                      key={code}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 group ${
                        isPlayerHere || isAiHere ? 'z-20' : 'z-10'
                      } ${isAdjacent && !isPlayerHere ? 'hover:z-30' : ''}`}
                      style={{
                        left: `${region.position.x}%`,
                        top: `${region.position.y}%`,
                      }}
                      onClick={() => {
                        if (isPlayerTurn && !isPlayerHere && canAfford) {
                          travelToRegion(code);
                        }
                      }}
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm border-4 ${
                          isPlayerHere
                            ? 'border-green-500 bg-green-500 text-white animate-pulse'
                            : isAiHere
                            ? 'border-pink-500 bg-pink-500 text-white animate-pulse'
                            : isAdjacent && canAfford
                            ? 'border-yellow-500 bg-yellow-600 text-white hover:bg-yellow-500'
                            : isPlayerVisited
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-600 bg-gray-700 text-gray-400'
                        } ${themeStyles.shadow} ${hasEvent ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''}`}
                      >
                        {code}
                      </div>
                      {isPlayerHere && (
                        <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap bg-green-500 text-white px-2 py-1 rounded font-bold">
                          You
                        </div>
                      )}
                      {isAiHere && (
                        <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap bg-pink-500 text-white px-2 py-1 rounded font-bold">
                          AI
                        </div>
                      )}
                      {/* Event indicator */}
                      {hasEvent && !isPlayerHere && !isAiHere && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                          ⚡
                        </div>
                      )}
                      {/* Travel cost tooltip on hover */}
                      {!isPlayerHere && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-8 hidden group-hover:block z-40">
                          <div className={`${themeStyles.card} border ${themeStyles.border} rounded-lg p-2 text-xs shadow-lg min-w-32`}>
                            <div className="font-bold mb-1">{region.name}</div>
                            <div className={canAfford ? 'text-green-400' : 'text-red-400'}>
                              Travel: ${travelCost}
                            </div>
                            {REGIONAL_RESOURCES[code] && (
                              <div className="mt-1 opacity-75">
                                Resources: {REGIONAL_RESOURCES[code].slice(0, 2).join(', ')}
                              </div>
                            )}
                            {hasEvent && (
                              <div className="text-yellow-400 mt-1">
                                ⚡ {gameState.activeEvents.find(e => e.region === code)?.name}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>You</span>
                </div>
                {gameState.selectedMode === 'ai' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                    <span>AI</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                  <span>Adjacent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Visited</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-700 rounded-full border-2 border-yellow-400"></div>
                  <span>Event</span>
                </div>
              </div>
            </div>
          )}
          
          {!uiState.showMap && (
            <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-6 ${themeStyles.shadow} lg:col-span-2 flex items-center justify-center`}>
              <button
                onClick={() => updateUiState({ showMap: true })}
                className={`${themeStyles.button} text-white px-6 py-3 rounded-lg flex items-center space-x-2`}
              >
                <span>🗺️</span>
                <span>Show Map</span>
                <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">M</kbd>
              </button>
            </div>
          )}
        </div>
        
        {/* Player Stats Row */}
        <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-4 mt-4 ${themeStyles.shadow}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm opacity-75">Strength</div>
              <div className="text-2xl font-bold">{player.stats.strength}</div>
            </div>
            <div>
              <div className="text-sm opacity-75">Charisma</div>
              <div className="text-2xl font-bold">{player.stats.charisma}</div>
            </div>
            <div>
              <div className="text-sm opacity-75">Luck</div>
              <div className="text-2xl font-bold">{player.stats.luck}</div>
            </div>
            <div>
              <div className="text-sm opacity-75">Intelligence</div>
              <div className="text-2xl font-bold">{player.stats.intelligence}</div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Level {player.level}</span>
              <span>{player.xp} / {player.level * 100} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(player.xp / (player.level * 100)) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Modals */}
        {renderAiStatsModal()}
        {renderProgressDashboard()}
        {renderHelpModal()}
        {renderSettingsModal()}
        {renderEndGameModesModal()}
        {renderConfirmationDialog()}
        {renderNotificationHistory()}
        
        {/* Travel Modal */}
        {uiState.showTravelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto ${themeStyles.scrollbar}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">✈️ Travel</h3>
                <button
                  onClick={() => updateUiState({ showTravelModal: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                {Object.entries(REGIONS).map(([code, region]: [string, any]) => {
                  if (code === player.currentRegion) return null;
                  
                  const cost = calculateTravelCost(player.currentRegion, code);
                  const canAfford = player.money >= cost;
                  const isAdjacent = adjacentRegions.includes(code);
                  
                  return (
                    <div key={code} className={`${themeStyles.border} border rounded-lg p-4`}>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-bold">{region.name}</div>
                          <div className="text-sm opacity-75">
                            {isAdjacent ? '📍 Adjacent' : code === 'TAS' ? '🏝️ Island' : '📍 Distant'}
                          </div>
                          {/* Scout Ahead - Show resources for adjacent regions */}
                          {activeSpecialAbility === 'Scout Ahead' && isAdjacent && REGIONAL_RESOURCES[code] && (
                            <div className="mt-2 text-xs">
                              <div className="text-blue-400 font-bold">🔍 Scout Ahead - Resources:</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {REGIONAL_RESOURCES[code].map((resource: string) => (
                                  <span key={resource} className="bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-0.5 rounded">
                                    {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className={`font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}>
                            ${cost}
                          </div>
                          <button
                            onClick={() => travelToRegion(code)}
                            disabled={!canAfford || !isPlayerTurn}
                            className={`${themeStyles.button} text-white px-3 py-1 rounded mt-1 disabled:opacity-50 text-sm`}
                          >
                            Travel
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Challenges Modal */}
        {uiState.showChallenges && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">🎯 Challenges in {currentRegion.name}</h3>
                <button
                  onClick={() => updateUiState({ showChallenges: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
                >
                  ✕
                </button>
              </div>

              {/* Weather & Season Effects Banner */}
              <div className={`${themeStyles.border} border rounded-lg p-3 mb-4 text-xs`}>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="opacity-75">Weather:</span>{' '}
                    <span className={gameState.weather === 'Stormy' ? 'text-yellow-400' : gameState.weather === 'Rainy' ? 'text-blue-400' : 'text-green-400'}>
                      {gameState.weather}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-75">Season:</span>{' '}
                    <span className="text-purple-400">{gameState.season}</span>
                  </div>
                  {/* Show active event effects */}
                  {gameState.activeEvents.filter(e => e.region === player.currentRegion).map(event => (
                    <div key={event.id} className="text-yellow-400">
                      ⚡ {event.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`space-y-3 overflow-y-auto flex-1 ${themeStyles.scrollbar}`}>
                {currentRegion.challenges.map((challenge: any, index: number) => {
                  const isCompleted = (player.completedThisSeason || []).includes(challenge.name);
                  const successChance = calculateSuccessChance(challenge);
                  // Use dynamic wager only if enabled, otherwise fixed $500 max
                  const dynamicMaxWager = gameSettings.dynamicWagerEnabled ? calculateMaxWager(challenge) : 500;
                  const maxWager = Math.min(player.money, dynamicMaxWager);

                  // Calculate weather/season bonuses for display
                  const weatherMod = WEATHER_EFFECTS[gameState.weather]?.challengeModifier?.[challenge.type] || 0;
                  const seasonMod = SEASON_EFFECTS[gameState.season]?.challengeModifier?.[challenge.type] || 0;
                  const eventMod = gameState.activeEvents
                    .filter(e => e.region === player.currentRegion && e.effect?.challengeBonus?.[challenge.type])
                    .reduce((sum, e) => sum + (e.effect.challengeBonus[challenge.type] || 0), 0);

                  return (
                    <div key={index} className={`${themeStyles.border} border rounded-lg p-4 ${isCompleted ? 'opacity-50' : ''}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold">{challenge.name}</div>
                          <div className="text-sm opacity-75">{challenge.type} challenge</div>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className={successChance >= 0.5 ? 'text-green-400' : 'text-red-400'}>
                              Success: {Math.round(successChance * 100)}%
                            </span>
                            {/* Show modifiers */}
                            {weatherMod !== 0 && (
                              <span className={weatherMod > 0 ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>
                                ({weatherMod > 0 ? '+' : ''}{Math.round(weatherMod * 100)}% weather)
                              </span>
                            )}
                            {seasonMod !== 0 && (
                              <span className={seasonMod > 0 ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>
                                ({seasonMod > 0 ? '+' : ''}{Math.round(seasonMod * 100)}% season)
                              </span>
                            )}
                            {eventMod !== 0 && (
                              <span className="text-yellow-400 text-xs">
                                (+{Math.round(eventMod * 100)}% event)
                              </span>
                            )}
                          </div>
                          {isCompleted && <div className="text-sm text-green-500">✅ Completed</div>}
                        </div>
                        <div className="text-right">
                          <div className="text-sm">Difficulty: {'⭐'.repeat(challenge.difficulty)}</div>
                          <div className="text-sm">Reward: {challenge.reward}x</div>
                          {gameSettings.dynamicWagerEnabled && (
                            <div className="text-xs opacity-50">Max bet: ${dynamicMaxWager}</div>
                          )}
                        </div>
                      </div>

                      {!isCompleted && (
                        <>
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="range"
                              min="50"
                              max={maxWager}
                              value={Math.min(uiState.wagerAmount, maxWager)}
                              onChange={(e) => updateUiState({ wagerAmount: parseInt(e.target.value) })}
                              className="flex-1"
                            />
                            <span className="text-sm font-bold w-16 text-right">${Math.min(uiState.wagerAmount, maxWager)}</span>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => takeChallenge(challenge, Math.min(uiState.wagerAmount, maxWager))}
                              disabled={player.money < 50 || !isPlayerTurn}
                              className={`${themeStyles.button} text-white px-4 py-2 rounded-lg flex-1 disabled:opacity-50`}
                            >
                              Take Challenge (${Math.min(uiState.wagerAmount, maxWager)})
                            </button>
                            {/* Max button only shows when dynamic wager is enabled */}
                            {gameSettings.dynamicWagerEnabled && maxWager >= 200 && (
                              <button
                                onClick={() => takeChallenge(challenge, maxWager)}
                                disabled={player.money < maxWager || !isPlayerTurn}
                                className={`bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50`}
                              >
                                Max
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Market Modal */}
        {uiState.showMarket && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
            onClick={() => updateUiState({ showMarket: false })}
          >
            <div
              className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-2xl w-full h-[85vh] flex flex-col overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header */}
              <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
                <h3 className="text-xl font-bold">💰 Resource Market</h3>
                <button
                  onClick={() => updateUiState({ showMarket: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
                  aria-label="Close"
                  title="Close"
                >
                  X
                </button>
              </div>

              {/* Scrollable Content */}
              <div
                className={`flex-1 overflow-y-scroll p-6 pt-4 ${themeStyles.scrollbar}`}
                style={{
                  maxHeight: 'calc(85vh - 180px)',
                  overflowY: 'scroll',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
              >
                {/* Market Trend Display */}
                <div className={`${themeStyles.border} border rounded-lg p-3 mb-4`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Market Trend:</span>
                    <span className={`font-bold ${
                      gameState.marketTrend === 'rising' ? 'text-green-500' :
                      gameState.marketTrend === 'falling' ? 'text-red-500' :
                      gameState.marketTrend === 'volatile' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`}>
                      {gameState.marketTrend === 'rising' ? '📈 Rising' :
                       gameState.marketTrend === 'falling' ? '📉 Falling' :
                       gameState.marketTrend === 'volatile' ? '⚡ Volatile' :
                       '➡️ Stable'}
                    </span>
                  </div>
                  {/* Season effect on prices */}
                  <div className="text-xs opacity-75 mt-1">
                    Season: {gameState.season} - {SEASON_EFFECTS[gameState.season]?.description || ''}
                  </div>
                  {/* Market Insight - Price Predictions */}
                  {activeSpecialAbility === 'Market Insight' && (
                    <div className="mt-3 pt-3 border-t border-blue-500 border-opacity-30">
                      <div className="text-xs text-blue-400 font-bold mb-2">🔮 Market Insight Active - Next Turn Predictions:</div>
                      <div className="text-xs space-y-1">
                        {gameState.marketTrend === 'rising' && <div className="text-green-400">↗ Prices likely to increase by 10-20%</div>}
                        {gameState.marketTrend === 'falling' && <div className="text-red-400">↘ Prices likely to decrease by 10-20%</div>}
                        {gameState.marketTrend === 'volatile' && <div className="text-yellow-400">⚡ Prices may swing +/- 30%</div>}
                        {gameState.marketTrend === 'stable' && <div className="text-blue-400">➡ Prices will remain relatively stable (+/- 5%)</div>}
                      </div>
                      {/* Price History */}
                      {gameState.priceHistory.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-blue-500 border-opacity-20">
                          <div className="text-blue-400 font-bold mb-1">Price History (Last 5 days):</div>
                          <div className="flex space-x-2 overflow-x-auto text-xs">
                            {gameState.priceHistory.slice(-5).map((history, idx) => (
                              <div key={idx} className="bg-blue-500 bg-opacity-10 rounded p-1 min-w-max">
                                D{history.day}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Inventory Sorting & Filtering Controls */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <select
                    value={uiState.inventorySort}
                    onChange={(e) => updateUiState({ inventorySort: e.target.value as any })}
                    className={`${themeStyles.select} rounded px-2 py-1 text-sm`}
                  >
                    <option value="default">Sort: Default</option>
                    <option value="value">Sort: Value ↓</option>
                    <option value="quantity">Sort: Quantity ↓</option>
                    <option value="category">Sort: Category</option>
                  </select>
                  <select
                    value={uiState.inventoryFilter}
                    onChange={(e) => updateUiState({ inventoryFilter: e.target.value as any })}
                    className={`${themeStyles.select} rounded px-2 py-1 text-sm`}
                  >
                    <option value="all">Filter: All</option>
                    <option value="luxury">Luxury</option>
                    <option value="food">Food</option>
                    <option value="industrial">Industrial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="energy">Energy</option>
                    <option value="financial">Financial</option>
                  </select>
                  {player.inventory.length > 0 && (
                    <div className="text-sm opacity-75 ml-auto">
                      {player.inventory.length}/{MAX_INVENTORY} items
                    </div>
                  )}
                </div>

                {player.inventory.length === 0 ? (
                  <div className="text-center py-8 opacity-60">
                    No resources to sell. Collect some resources first!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                    // Get unique resources with counts
                    let resourceData = Array.from(new Set(player.inventory)).map(resource => ({
                      resource,
                      count: player.inventory.filter(item => item === resource).length,
                      price: gameState.resourcePrices[resource] || 100,
                      category: RESOURCE_CATEGORIES[resource] || 'unknown'
                    }));

                    // Apply filter
                    if (uiState.inventoryFilter !== 'all') {
                      resourceData = resourceData.filter(r => r.category === uiState.inventoryFilter);
                    }

                    // Apply sort
                    switch (uiState.inventorySort) {
                      case 'value':
                        resourceData.sort((a, b) => (b.price * b.count) - (a.price * a.count));
                        break;
                      case 'quantity':
                        resourceData.sort((a, b) => b.count - a.count);
                        break;
                      case 'category':
                        resourceData.sort((a, b) => a.category.localeCompare(b.category));
                        break;
                    }

                    if (resourceData.length === 0) {
                      return (
                        <div className="text-center py-4 opacity-60">
                          No resources match this filter.
                        </div>
                      );
                    }

                    return resourceData.map(({ resource, count, price, category }) => {
                      const regionalBonus = calculateRegionalBonus(resource, player.currentRegion);
                      const supplyMod = calculateSupplyDemandModifier(resource);

                      return (
                        <div key={resource} className={`${themeStyles.border} border rounded-lg p-4`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-bold">{resource}</div>
                              <div className="text-sm opacity-75">Owned: {count}</div>
                              <div className="text-xs opacity-75 mt-1 flex items-center space-x-2">
                                <span className="bg-gray-600 bg-opacity-50 px-1 rounded">{category}</span>
                                {regionalBonus > 1 && (
                                  <span className="text-green-400">+{Math.round((regionalBonus - 1) * 100)}% regional</span>
                                )}
                                {supplyMod < 1 && (
                                  <span className="text-red-400">-{Math.round((1 - supplyMod) * 100)}% supply</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-500">${price} each</div>
                              <div className="text-xs opacity-75 mb-2">
                                Total: ${price * count}
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => sellResource(resource, price)}
                                  disabled={!isPlayerTurn}
                                  className={`${themeStyles.accent} text-white px-3 py-1 rounded text-sm disabled:opacity-50`}
                                >
                                  Sell 1
                                </button>
                                {count > 1 && (
                                  <button
                                    onClick={() => {
                                      // Sell all of this resource type
                                      for (let i = 0; i < count; i++) {
                                        sellResource(resource, price);
                                      }
                                    }}
                                    disabled={!isPlayerTurn}
                                    className={`bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50`}
                                  >
                                    All
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                  </div>
                )}
              </div>

              {/* Fixed Footer */}
              <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
                <button
                  onClick={() => updateUiState({ showMarket: false })}
                  className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}
                >
                  Close Market
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Shop Modal */}
        {uiState.showShop && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
            onClick={() => updateUiState({ showShop: false })}
          >
            <div
              className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-2xl w-full flex flex-col overflow-hidden`}
              style={{ height: '80vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
                <h3 className="text-xl font-bold">Equipment Shop</h3>
                <button
                  onClick={() => updateUiState({ showShop: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
                  aria-label="Close"
                  title="Close"
                >
                  X
                </button>
              </div>
              <div className={`flex-1 min-h-0 overflow-y-auto p-6 pt-4 ${themeStyles.scrollbar}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                {!isShopRegion && (
                  <div className={`${themeStyles.border} border rounded-lg p-3 mb-4 text-sm`}>
                    Shop access is only available in NSW or VIC.
                  </div>
                )}
                <div className="space-y-3">
                  {SHOP_ITEMS.map(item => {
                    const owned = (player.equipment || []).includes(item.id);
                    const canAfford = player.money >= item.cost;
                    return (
                      <div key={item.id} className={`${themeStyles.border} border rounded-lg p-4`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold">{item.name}</div>
                            <div className="text-sm opacity-75">{item.description}</div>
                            {owned && <div className="text-xs text-green-400 mt-1">Owned</div>}
                          </div>
                          <div className="text-right ml-4">
                            <div className={`font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}>${item.cost}</div>
                            <button
                              onClick={() => buyEquipment(item.id)}
                              disabled={!isPlayerTurn || !isShopRegion || owned || !canAfford}
                              className={`${themeStyles.button} text-white px-3 py-1 rounded mt-2 text-sm disabled:opacity-50`}
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
                <button
                  onClick={() => updateUiState({ showShop: false })}
                  className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}
                >
                  Close Shop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workshop Modal - Crafting System */}
        {uiState.showWorkshop && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
            onClick={() => updateUiState({ showWorkshop: false })}
          >
            <div
              className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-3xl w-full flex flex-col overflow-hidden`}
              style={{ height: '85vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
                <h3 className="text-xl font-bold">🛠️ Workshop - Crafting System</h3>
                <button
                  onClick={() => updateUiState({ showWorkshop: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
                  aria-label="Close"
                  title="Close"
                >
                  X
                </button>
              </div>
              <div className={`flex-1 min-h-0 overflow-y-auto p-6 pt-4 ${themeStyles.scrollbar}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                {/* Crafting Info */}
                <div className={`${themeStyles.border} border rounded-lg p-4 mb-4 text-sm`}>
                  <div className="font-bold mb-2">✨ Combine resources into valuable items!</div>
                  <div className="opacity-75 space-y-1">
                    <div>• Crafted items are worth 1.5-2x their raw materials</div>
                    <div>• Success rate: 95% (98% for Scientist)</div>
                    <div>• Businessman: +20% value | Scientist: +15% value</div>
                    <div>• Actions used: {player.actionsUsedThisTurn}/{gameSettings.playerActionsPerDay}</div>
                  </div>
                </div>

                {/* Craftable Recipes */}
                <div className="space-y-4">
                  {CRAFTING_RECIPES.map(recipe => {
                    const craftable = canCraft(recipe, player.inventory);
                    const hasActions = !gameSettings.actionLimitsEnabled || player.actionsUsedThisTurn + recipe.craftTime <= gameSettings.playerActionsPerDay;
                    const hasSpace = player.inventory.length < MAX_INVENTORY;
                    const canCraftThis = craftable && hasActions && hasSpace && isPlayerTurn;
                    const craftValue = calculateCraftValue(recipe, player.character, player.masteryUnlocks);

                    // Count how many of each input player has
                    const inputCounts = Object.entries(recipe.inputs).map(([resource, required]) => {
                      const owned = player.inventory.filter(item => item === resource).length;
                      return { resource, required: required as number, owned };
                    });

                    return (
                      <div key={recipe.id} className={`${themeStyles.border} border rounded-lg p-4 ${craftable ? 'border-green-500 border-opacity-30' : ''}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-bold text-lg">{recipe.emoji} {recipe.name}</div>
                            <div className="text-xs opacity-75 mt-1">{recipe.description}</div>
                            <div className="text-sm mt-2">
                              <span className="font-bold text-green-400">Value: ${craftValue}</span>
                              <span className="opacity-75 ml-3">⏱️ {recipe.craftTime} action{recipe.craftTime > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>

                        {/* Required Resources */}
                        <div className="mb-3">
                          <div className="text-xs font-bold opacity-75 mb-2">Required Resources:</div>
                          <div className="flex flex-wrap gap-2">
                            {inputCounts.map(({ resource, required, owned }) => {
                              const hasEnough = owned >= required;
                              return (
                                <div key={resource} className={`text-xs px-2 py-1 rounded ${
                                  hasEnough ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                                }`}>
                                  {resource} ({owned}/{required})
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Craft Button */}
                        <button
                          onClick={() => handleCraft(recipe)}
                          disabled={!canCraftThis}
                          className={`${themeStyles.button} text-white px-4 py-2 rounded-lg w-full font-bold text-sm disabled:opacity-50`}
                          title={
                            !craftable ? 'Missing required resources' :
                            !hasActions ? 'Not enough actions remaining' :
                            !hasSpace ? 'Inventory full' :
                            !isPlayerTurn ? 'Not your turn' :
                            'Craft this item'
                          }
                        >
                          {craftable ? '✨ Craft' : '❌ Missing Resources'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Crafted Items Summary */}
                {player.craftedItems && player.craftedItems.length > 0 && (
                  <div className={`${themeStyles.border} border rounded-lg p-4 mt-4`}>
                    <div className="font-bold mb-2">📦 Items You've Crafted ({player.craftedItems.length} total):</div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(player.craftedItems)).map(item => {
                        const count = player.craftedItems.filter(i => i === item).length;
                        const recipe = CRAFTING_RECIPES.find(r => r.output === item);
                        return (
                          <div key={item} className={`text-xs px-2 py-1 rounded bg-blue-500 bg-opacity-20`}>
                            {recipe?.emoji} {item} x{count}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
                <button
                  onClick={() => updateUiState({ showWorkshop: false })}
                  className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}
                >
                  Close Workshop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bank Modal - Loan Management */}
        {uiState.showBank && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
            onClick={() => updateUiState({ showBank: false })}
          >
            <div
              className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-3xl w-full flex flex-col overflow-hidden`}
              style={{ height: '85vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
                <h3 className="text-xl font-bold">🏦 Bank of Australia</h3>
                <button
                  onClick={() => updateUiState({ showBank: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
                  aria-label="Close"
                  title="Close"
                >
                  X
                </button>
              </div>
              <div className={`flex-1 min-h-0 overflow-y-auto p-6 pt-4 ${themeStyles.scrollbar}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                {/* Credit Score Display */}
                <div className={`${themeStyles.border} border rounded-lg p-4 mb-4`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Credit Score:</span>
                    <span className={`text-2xl font-bold ${
                      player.creditScore >= 750 ? 'text-green-400' :
                      player.creditScore >= 650 ? 'text-blue-400' :
                      player.creditScore >= 550 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {player.creditScore}
                    </span>
                  </div>
                  <div className="text-xs opacity-75">
                    {player.creditScore >= 750 ? '⭐ Excellent - 3% interest discount' :
                     player.creditScore >= 650 ? '✓ Good - 1% interest discount' :
                     player.creditScore >= 550 ? '→ Fair - Standard rates' :
                     '⚠️ Poor - 2% interest penalty'}
                  </div>
                  <div className="mt-2 pt-2 border-t border-opacity-30 text-xs space-y-1 opacity-75">
                    <div>• Loans paid early: {player.loansPaidEarly || 0}</div>
                    <div>• Total loans taken: {player.totalLoansTaken || 0}</div>
                  </div>
                </div>

                {/* Debt Summary */}
                {player.loans && player.loans.length > 0 && (
                  <div className={`${themeStyles.border} border border-red-500 border-opacity-30 rounded-lg p-4 mb-4`}>
                    <div className="font-bold mb-2 text-red-400">💳 Active Loans ({player.loans.length})</div>
                    <div className="space-y-2">
                      {player.loans.map((loan) => {
                        const loanOption = LOAN_OPTIONS.find(opt => opt.id === loan.loanType) || LOAN_OPTIONS[1];
                        const totalOwed = loan.amount + loan.accrued;
                        const dailyInterest = Math.floor(loan.amount * loan.interestRate);

                        return (
                          <div key={loan.id} className={`${themeStyles.border} border rounded-lg p-3`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-bold text-sm">{loanOption.emoji} {loanOption.name}</div>
                                <div className="text-xs opacity-75 mt-1">
                                  Rate: {(loan.interestRate * 100).toFixed(1)}%/day ({dailyInterest}/day)
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-red-400">${Math.floor(totalOwed)}</div>
                                <div className="text-xs opacity-75">Principal: ${loan.amount}</div>
                                <div className="text-xs opacity-75">Interest: ${loan.accrued}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRepayLoan(loan.id, false)}
                                disabled={player.money < 1}
                                className={`${themeStyles.buttonSecondary} px-3 py-1 rounded text-xs flex-1 disabled:opacity-50`}
                                title={`Pay what you can (max $${Math.min(player.money, totalOwed)})`}
                              >
                                Pay Partial
                              </button>
                              <button
                                onClick={() => handleRepayLoan(loan.id, true)}
                                disabled={player.money < totalOwed}
                                className={`${themeStyles.button} text-white px-3 py-1 rounded text-xs flex-1 disabled:opacity-50`}
                                title={`Pay off full amount ($${Math.floor(totalOwed)})`}
                              >
                                Pay Off ${Math.floor(totalOwed)}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-opacity-30 text-sm">
                      <div className="flex justify-between font-bold">
                        <span>Total Debt:</span>
                        <span className="text-red-400">${Math.floor(player.loans.reduce((sum, l) => sum + l.amount + l.accrued, 0))}</span>
                      </div>
                      <div className="flex justify-between text-xs opacity-75 mt-1">
                        <span>Daily Interest:</span>
                        <span>${player.loans.reduce((sum, l) => sum + Math.floor(l.amount * l.interestRate), 0)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Available Loans */}
                <div className="space-y-3">
                  <div className="font-bold mb-3">💰 Available Loans:</div>
                  {LOAN_OPTIONS.map(loanOption => {
                    const check = canTakeLoan(loanOption);
                    const activeCount = player.loans.filter(l => l.loanType === loanOption.id).length;

                    // Calculate effective rate with credit score
                    let effectiveRate = loanOption.dailyInterest;
                    if (player.creditScore >= 750) effectiveRate -= 0.03;
                    else if (player.creditScore >= 650) effectiveRate -= 0.01;
                    else if (player.creditScore < 550) effectiveRate += 0.02;
                    effectiveRate = Math.max(0.03, effectiveRate);

                    return (
                      <div key={loanOption.id} className={`${themeStyles.border} border rounded-lg p-4 ${check.canTake ? 'border-green-500 border-opacity-30' : 'border-red-500 border-opacity-30'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold">{loanOption.emoji} {loanOption.name}</div>
                            <div className="text-xs opacity-75 mt-1">{loanOption.description}</div>
                            <div className="text-xs opacity-75 mt-1">
                              Active: {activeCount}/{loanOption.maxActive}
                              {loanOption.requirement !== "None" && <span className="ml-2">• {loanOption.requirement}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-400 text-xl">${loanOption.amount}</div>
                            <div className="text-xs opacity-75">
                              {(effectiveRate * 100).toFixed(1)}%/day
                              {effectiveRate !== loanOption.dailyInterest && (
                                <span className="ml-1">
                                  ({effectiveRate < loanOption.dailyInterest ? '↓' : '↑'} credit)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleTakeLoan(loanOption)}
                          disabled={!check.canTake || !isPlayerTurn}
                          className={`${themeStyles.button} text-white px-4 py-2 rounded-lg w-full font-bold text-sm disabled:opacity-50`}
                          title={check.canTake ? `Take ${loanOption.name}` : check.reason}
                        >
                          {check.canTake ? `Borrow $${loanOption.amount}` : `🔒 ${check.reason}`}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Loan Tips */}
                <div className={`${themeStyles.border} border rounded-lg p-4 mt-4 text-xs opacity-75`}>
                  <div className="font-bold mb-2">💡 Banking Tips:</div>
                  <div className="space-y-1">
                    <div>• Pay loans early to boost your credit score</div>
                    <div>• Higher credit score = lower interest rates</div>
                    <div>• Interest compounds daily, so repay quickly</div>
                    <div>• Each loan tier has a maximum number of active loans</div>
                  </div>
                </div>
              </div>
              <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
                <button
                  onClick={() => updateUiState({ showBank: false })}
                  className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}
                >
                  Close Bank
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Investments Modal */}
        {uiState.showInvestments && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
            onClick={() => updateUiState({ showInvestments: false })}
          >
            <div
              className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-2xl w-full flex flex-col overflow-hidden`}
              style={{ height: '80vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
                <h3 className="text-xl font-bold">Regional Investments</h3>
                <button
                  onClick={() => updateUiState({ showInvestments: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
                  aria-label="Close"
                  title="Close"
                >
                  X
                </button>
              </div>
              <div className={`flex-1 min-h-0 overflow-y-auto p-6 pt-4 ${themeStyles.scrollbar}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="space-y-3">
                  {Object.entries(REGIONAL_INVESTMENTS).map(([regionCode, investment]) => {
                    const owned = (player.investments || []).includes(regionCode);
                    const canAfford = player.money >= investment.cost;
                    return (
                      <div key={regionCode} className={`${themeStyles.border} border rounded-lg p-4`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold">{investment.name}</div>
                            <div className="text-sm opacity-75">{REGIONS[regionCode]?.name}</div>
                            <div className="text-xs opacity-75 mt-1">Daily Income: ${investment.dailyIncome}</div>
                            {owned && <div className="text-xs text-green-400 mt-1">Owned</div>}
                          </div>
                          <div className="text-right ml-4">
                            <div className={`font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}>${investment.cost}</div>
                            <button
                              onClick={() => buyInvestment(regionCode)}
                              disabled={!isPlayerTurn || owned || !canAfford}
                              className={`${themeStyles.button} text-white px-3 py-1 rounded mt-2 text-sm disabled:opacity-50`}
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
                <button
                  onClick={() => updateUiState({ showInvestments: false })}
                  className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}
                >
                  Close Investments
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sabotage Modal */}
        {uiState.showSabotage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
            onClick={() => updateUiState({ showSabotage: false })}
          >
            <div
              className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-2xl w-full flex flex-col overflow-hidden`}
              style={{ height: '80vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
                <h3 className="text-xl font-bold">Sabotage Actions</h3>
                <button
                  onClick={() => updateUiState({ showSabotage: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
                  aria-label="Close"
                  title="Close"
                >
                  X
                </button>
              </div>
              <div className={`flex-1 min-h-0 overflow-y-auto p-6 pt-4 ${themeStyles.scrollbar}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className={`${themeStyles.border} border rounded-lg p-3 mb-4 text-sm`}>
                  Target: {aiPlayer.name}
                </div>
                <div className="space-y-3">
                  {SABOTAGE_ACTIONS.map(action => {
                    const active = hasActiveDebuff(aiPlayer.debuffs, action.id);
                    const canAfford = player.money >= action.cost;
                    return (
                      <div key={action.id} className={`${themeStyles.border} border rounded-lg p-4`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold">{action.name}</div>
                            <div className="text-sm opacity-75">{action.description}</div>
                            <div className="text-xs opacity-75 mt-1">Duration: {action.duration} {action.duration === 1 ? 'day' : 'days'}</div>
                            {active && <div className="text-xs text-yellow-400 mt-1">Active</div>}
                          </div>
                          <div className="text-right ml-4">
                            <div className={`font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}>${action.cost}</div>
                            <button
                              onClick={() => useSabotage(action.id)}
                              disabled={!isPlayerTurn || active || !canAfford}
                              className={`${themeStyles.button} text-white px-3 py-1 rounded mt-2 text-sm disabled:opacity-50`}
                            >
                              Use
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
                <button
                  onClick={() => updateUiState({ showSabotage: false })}
                  className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}
                >
                  Close Sabotage
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // [Additional helper render functions like renderHelpModal, renderConfirmationDialog, renderNotificationHistory - keeping existing implementations]
  
  // Keyboard Shortcuts Help Modal
  const renderHelpModal = () => {
    if (!uiState.showHelp) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-6 max-w-2xl w-full`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">⌨️ Keyboard Shortcuts</h3>
            <button
              onClick={() => updateUiState({ showHelp: false })}
              className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(KEYBOARD_SHORTCUTS).map(([key, shortcut]) => (
              <div key={key} className={`${themeStyles.border} border rounded p-3`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{shortcut.label}</div>
                    <div className="text-sm opacity-75">{shortcut.description}</div>
                  </div>
                  <kbd className="px-3 py-1 bg-gray-700 rounded text-sm font-mono">
                    {key === ' ' ? 'Space' : key.toUpperCase()}
                  </kbd>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-sm opacity-75 text-center">
            Press any key while focused on the game to use shortcuts
          </div>
        </div>
      </div>
    );
  };

  // Confirmation Dialog Component
  const renderConfirmationDialog = () => {
    if (!confirmationDialog.isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-6 max-w-md w-full ${themeStyles.shadow}`}>
          <h3 className="text-xl font-bold mb-3">{confirmationDialog.title}</h3>
          <p className="mb-6">{confirmationDialog.message}</p>
          
          {/* Show relevant data */}
          {confirmationDialog.data && confirmationDialog.type === 'travel' && (
            <div className={`${themeStyles.border} border rounded p-3 mb-4 text-sm`}>
              <div className="flex justify-between mb-1">
                <span>Destination:</span>
                <span className="font-bold">{REGIONS[confirmationDialog.data.region]?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost:</span>
                <span className="font-bold text-red-500">${confirmationDialog.data.cost}</span>
              </div>
            </div>
          )}
          
          {confirmationDialog.data && confirmationDialog.type === 'challenge' && (
            <div className={`${themeStyles.border} border rounded p-3 mb-4 text-sm`}>
              <div className="flex justify-between mb-1">
                <span>Success Chance:</span>
                <span className={`font-bold ${confirmationDialog.data.successChance >= 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.round(confirmationDialog.data.successChance * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Wager:</span>
                <span className="font-bold text-yellow-500">${confirmationDialog.data.wager}</span>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={handleConfirm}
              className={`${themeStyles.button} text-white px-6 py-2 rounded-lg flex-1 font-bold`}
            >
              {confirmationDialog.confirmText}
            </button>
            <button
              onClick={closeConfirmation}
              className={`${themeStyles.buttonSecondary} px-6 py-2 rounded-lg flex-1`}
            >
              Cancel
            </button>
          </div>
          
          {/* Don't ask again option */}
          {confirmationDialog.type && (
            <label className="flex items-center space-x-2 mt-4 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={dontAskAgain[confirmationDialog.type as keyof typeof dontAskAgain]}
                onChange={(e) => {
                  setDontAskAgain(prev => ({
                    ...prev,
                    [confirmationDialog.type as string]: e.target.checked
                  }));
                }}
                className="form-checkbox"
              />
              <span className="opacity-75">Don't ask me again</span>
            </label>
          )}
        </div>
      </div>
    );
  };

  // Notification History Modal
  const renderNotificationHistory = () => {
    if (!uiState.showNotifications) return null;
    
    const filteredNotifications = notifications.filter(n => 
      uiState.notificationFilter === 'all' || n.type === uiState.notificationFilter
    );
    
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
        onClick={() => updateUiState({ showNotifications: false })}
      >
        <div
          className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-3xl w-full h-[90vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed Header */}
          <div className={`p-6 pb-4 border-b ${themeStyles.border}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">📜 Notification History</h3>
              <button
                onClick={() => updateUiState({ showNotifications: false })}
                className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
              >
                ✕
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateUiState({ notificationFilter: 'all' })}
              className={`px-3 py-1 rounded text-sm ${
                uiState.notificationFilter === 'all' 
                  ? themeStyles.button 
                  : themeStyles.buttonSecondary
              }`}
            >
              All ({notifications.length})
            </button>
            {Object.entries(NOTIFICATION_TYPES).map(([type, config]) => {
              const count = notifications.filter(n => n.type === type).length;
              if (count === 0) return null;
              return (
                <button
                  key={type}
                  onClick={() => updateUiState({ notificationFilter: type })}
                  className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${
                    uiState.notificationFilter === type 
                      ? themeStyles.button 
                      : themeStyles.buttonSecondary
                  }`}
                >
                  <span>{config.icon}</span>
                  <span>({count})</span>
                </button>
              );
            })}
            </div>

            {/* Clear all button */}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className={`${themeStyles.error} text-white px-4 py-2 rounded mt-3 text-sm w-full`}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Scrollable Notifications List */}
          <div className={`flex-1 overflow-y-scroll p-6 pt-4 ${themeStyles.scrollbar}`} style={{ maxHeight: 'calc(90vh - 280px)', overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}>
            <div className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 opacity-60">
                No notifications yet
              </div>
            ) : (
              filteredNotifications.reverse().map(notification => {
                const notifType = NOTIFICATION_TYPES[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={`${themeStyles.border} border-l-4 rounded p-3 ${
                      notification.read ? 'opacity-60' : ''
                    }`}
                    style={{ borderLeftColor: notifType.color }}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{notifType.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs opacity-75 mb-1">
                          {notifType.label} • Day {notification.day} • {
                            new Date(notification.timestamp).toLocaleTimeString()
                          }
                        </div>
                        <div className="text-sm">{notification.message}</div>
                      </div>
                      {notification.persistent && (
                        <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                          Important
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={notificationEndRef} />
            </div>
          </div>

          {/* Fixed Footer */}
          <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
            <button onClick={() => updateUiState({ showNotifications: false })} className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Game Over Screen
  const renderGameOver = () => {
    const playerScore = calculateFinalScore(player);
    const aiScore = gameState.selectedMode === 'ai' ? calculateFinalScore(aiPlayer) : 0;
    const won = gameState.selectedMode === 'ai' ? playerScore > aiScore : true;
    
    return (
      <div className={`min-h-screen ${themeStyles.background} ${themeStyles.text} flex items-center justify-center p-6`}>
        <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-8 max-w-md w-full text-center ${themeStyles.shadow}`}>
          <div className="text-6xl mb-4">{won ? '🏆' : '😔'}</div>
          <h2 className="text-3xl font-bold mb-4">{won ? 'Victory!' : 'Defeat'}</h2>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Your Score:</span>
              <span className="font-bold">{playerScore}</span>
            </div>
            {gameState.selectedMode === 'ai' && (
              <div className="flex justify-between">
                <span>{aiPlayer.name}:</span>
                <span className="font-bold">{aiScore}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Net Worth:</span>
              <span className="font-bold text-green-500">${getNetWorth}</span>
            </div>
            <div className="flex justify-between">
              <span>Regions Explored:</span>
              <span className="font-bold">{player.visitedRegions.length}/8</span>
            </div>
            <div className="flex justify-between">
              <span>Challenges Won:</span>
              <span className="font-bold">{Object.keys(player.challengeMastery || {}).length || player.challengesCompleted.length}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                dispatchGameState({ type: 'SET_GAME_MODE', payload: 'menu' });
                dispatchPlayer({
                  type: 'RESET_PLAYER',
                  payload: { 
                    characterIndex: uiState.selectedCharacter, 
                    name: uiState.playerName 
                  }
                });
                setAiPlayer({
                  money: 1000,
                  currentRegion: "QLD",
                  inventory: [],
                  visitedRegions: ["QLD"],
                  challengesCompleted: [],
                  character: CHARACTERS[1],
                  level: 1,
                  xp: 0,
                  stats: { strength: 2, charisma: 4, luck: 3, intelligence: 6 },
                  consecutiveWins: 0,
                  specialAbilityUses: 1,
                  masteryUnlocks: [],
                  name: "AI Opponent",
                  actionsUsedThisTurn: 0,
                  overridesUsedToday: 0,
                  overrideFatigue: 0,
                  loans: [],
                  completedThisSeason: [],
                  challengeMastery: {},
                  stipendCooldown: 0,
                  investments: [],
                  equipment: [],
                  debuffs: []
                });
                setNotifications([]);
                setPersonalRecords({
                  highestChallenge: 0,
                  mostExpensiveResourceSold: { resource: '', price: 0 },
                  consecutiveWins: 0,
                  maxMoney: 1000,
                  fastestChallengeWin: Infinity,
                  totalEarned: 0
                });
              }}
              className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}
            >
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================
  // MAIN RENDER
  // =========================================

  return (
    <div className="font-sans">
      {gameState.gameMode === "menu" && renderMenu()}
      {uiState.showCampaignSelect && renderCampaignSelect()}
      {gameState.gameMode === "game" && renderGame()}
      {gameState.gameMode === "end" && renderGameOver()}
      {renderSaveLoadModal()}
      {renderLoadPreviewModal()}
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={handleLoadFileChange}
        className="hidden"
      />
    </div>
  );
}

export default AustraliaGame;

