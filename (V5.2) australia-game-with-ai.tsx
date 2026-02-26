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

// Resource Market pricing (V5.0)
const RESOURCE_MARKET_PRICES_BY_CATEGORY = {
  luxury: 150,
  industrial: 120,
  energy: 120,
  food: 100,
  agricultural: 100,
  financial: 130,
  service: 130
} as const;

const getResourceMarketPrice = (resource: string) => {
  const category = RESOURCE_CATEGORIES[resource] || 'industrial';
  return RESOURCE_MARKET_PRICES_BY_CATEGORY[category] || 120;
};

const RESOURCE_MARKET_RESOURCES = Object.keys(RESOURCE_CATEGORIES).sort();

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

// Crafting system recipes
const CRAFTING_RECIPES = [
  // Luxury Items (High Value)
  {
    id: "opal_jewelry",
    name: "Opal Jewelry",
    inputs: { "Opals": 2, "Gold": 1 },
    output: "Opal Jewelry",
    baseValue: 800,
    craftTime: 1,
    category: "luxury",
    description: "Stunning handcrafted Australian jewelry"
  },
  {
    id: "croc_bag",
    name: "Designer Crocodile Bag",
    inputs: { "Crocodile Leather": 2, "Aboriginal Art": 1 },
    output: "Designer Bag",
    baseValue: 950,
    craftTime: 1,
    category: "luxury",
    description: "Luxury designer bag with indigenous artwork"
  },

  // Food/Tourism Items (Medium Value)
  {
    id: "gourmet_box",
    name: "Gourmet Gift Box",
    inputs: { "Wine": 2, "Seafood": 1, "Dairy": 1 },
    output: "Gourmet Box",
    baseValue: 600,
    craftTime: 1,
    category: "food",
    description: "Premium Australian food collection"
  },
  {
    id: "tourist_package",
    name: "Tourist Experience Package",
    inputs: { "Coral": 1, "Tropical Fruit": 2 },
    output: "Tourist Package",
    baseValue: 450,
    craftTime: 1,
    category: "tourism",
    description: "Curated tourist experience bundle"
  },

  // Industrial Items (Processing)
  {
    id: "steel_ingots",
    name: "Steel Ingots",
    inputs: { "Iron Ore": 3, "Coal": 2 },
    output: "Steel",
    baseValue: 700,
    craftTime: 1,
    category: "industrial",
    description: "High-quality processed steel"
  },
  {
    id: "furniture",
    name: "Premium Furniture",
    inputs: { "Timber": 3, "Wool": 1 },
    output: "Furniture Set",
    baseValue: 550,
    craftTime: 1,
    category: "goods",
    description: "Handcrafted Australian furniture"
  },

  // Energy Products
  {
    id: "energy_cell",
    name: "Hydroelectric Battery",
    inputs: { "Uranium": 1, "Hydropower": 2, "Natural Gas": 1 },
    output: "Energy Cell",
    baseValue: 1100,
    craftTime: 2,
    category: "energy",
    description: "Advanced energy storage system"
  }
];

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

// =========================================
// ADVANCED LOAN SYSTEM HELPER FUNCTIONS
// =========================================

const calculateCreditScore = (player: any, gameState: any): number => {
  let score = 50; // Base score

  const loanHistory = player.loanHistory || { totalTaken: 0, totalRepaid: 0, defaultCount: 0, earlyRepaymentCount: 0 };
  const advancedLoans = player.advancedLoans || [];

  // Repayment history (±30 points)
  if (loanHistory.totalTaken > 0) {
    const repaymentRate = loanHistory.totalRepaid / loanHistory.totalTaken;
    score += Math.floor(repaymentRate * 30) - 15;
  }

  // Early repayments (+10 max)
  score += Math.min(10, loanHistory.earlyRepaymentCount * 2);

  // Defaults (-20 per default)
  score -= loanHistory.defaultCount * 20;

  // Net worth (±20 points)
  const netWorth = player.money + (player.inventory?.length || 0) * 50;
  if (netWorth > 5000) score += 20;
  else if (netWorth > 3000) score += 10;
  else if (netWorth > 1000) score += 0;
  else if (netWorth > 500) score -= 10;
  else score -= 20;

  // Active loans penalty (-5 per loan)
  score -= advancedLoans.length * 5;

  // Days without bankruptcy (+1 per 3 days, max +10)
  const daysSinceBankruptcy = player.daysSinceLastBankruptcy || 0;
  score += Math.min(10, Math.floor(daysSinceBankruptcy / 3));

  // Challenge completion rate (+10 max)
  const totalChallenges = Object.values(REGIONS).reduce((sum: number, region: any) => sum + region.challenges.length, 0);
  const completedChallenges = player.challengesCompleted?.length || 0;
  if (completedChallenges > 0) {
    const completionRate = completedChallenges / totalChallenges;
    score += Math.floor(completionRate * 10);
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, score));
};

const getCreditScoreRange = (score: number) => {
  return CREDIT_SCORE_RANGES.find(range => score >= range.min && score <= range.max) || CREDIT_SCORE_RANGES[4];
};

const calculateLoanInterest = (loan: AdvancedLoan, creditScoreMultiplier: number, accrualRate: number): number => {
  const dailyRate = loan.actualInterestRate / loan.term;
  return loan.amount * dailyRate * accrualRate;
};

const getEarlyRepaymentDiscount = (): number => {
  return 0.5; // 50% discount on interest for early repayment
};

const checkLoanEvent = (player: any, settings: GameSettingsState): typeof LOAN_EVENTS[0] | null => {
  if (!settings.loanEventsEnabled) return null;

  for (const event of LOAN_EVENTS) {
    if (event.triggerCondition(player)) {
      // Random chance to trigger (30% when conditions met)
      if (Math.random() < 0.3) {
        return event;
      }
    }
  }
  return null;
};

// =========================================
// ADAPTIVE AI HELPER FUNCTIONS
// =========================================

const calculateNetWorth = (player: any): number => {
  const money = player.money || 0;
  const inventoryValue = (player.inventory?.length || 0) * 50; // Rough estimate
  const investmentValue = (player.investments?.length || 0) * 2000; // Rough estimate
  const equipmentValue = (player.equipment?.length || 0) * 1500; // Rough estimate
  return money + inventoryValue + investmentValue + equipmentValue;
};

const detectAdaptiveAiPhase = (
  playerNetWorth: number,
  aiNetWorth: number,
  playerLevel: number,
  aiLevel: number,
  playerChallenges: number,
  aiChallenges: number,
  settings: GameSettingsState
): 'normal' | 'phase1_aggressive' | 'phase2_desperate' | 'phase3_allIn' => {
  if (!settings.adaptiveAiEnabled) return 'normal';

  // Avoid division by zero
  if (playerNetWorth === 0) playerNetWorth = 1;

  const netWorthRatio = aiNetWorth / playerNetWorth;
  const levelDiff = playerLevel - aiLevel;
  const challengeDiff = playerChallenges - aiChallenges;

  // Check Phase 3 (All-In) - most desperate
  const phase3Thresholds = ADAPTIVE_AI_THRESHOLDS.phase3_allIn;
  if (
    netWorthRatio < phase3Thresholds.netWorthRatio ||
    levelDiff >= phase3Thresholds.levelDifference ||
    challengeDiff >= phase3Thresholds.challengeDifference
  ) {
    return 'phase3_allIn';
  }

  // Check Phase 2 (Desperate)
  const phase2Thresholds = ADAPTIVE_AI_THRESHOLDS.phase2_desperate;
  if (
    netWorthRatio < phase2Thresholds.netWorthRatio ||
    levelDiff >= phase2Thresholds.levelDifference ||
    challengeDiff >= phase2Thresholds.challengeDifference
  ) {
    return 'phase2_desperate';
  }

  // Check Phase 1 (Aggressive)
  const phase1Thresholds = ADAPTIVE_AI_THRESHOLDS.phase1_aggressive;
  if (
    netWorthRatio < phase1Thresholds.netWorthRatio ||
    levelDiff >= phase1Thresholds.levelDifference ||
    challengeDiff >= phase1Thresholds.challengeDifference
  ) {
    return 'phase1_aggressive';
  }

  return 'normal';
};

const updatePlayerPattern = (pattern: PlayerPattern, action: string, data: any): PlayerPattern => {
  const newPattern = { ...pattern };

  switch (action) {
    case 'sell':
      const resource = data.resource;
      newPattern.favoriteResources = {
        ...newPattern.favoriteResources,
        [resource]: (newPattern.favoriteResources[resource] || 0) + 1
      };
      break;

    case 'challenge':
      const challengeType = data.type;
      newPattern.preferredChallengeTypes = {
        ...newPattern.preferredChallengeTypes,
        [challengeType]: (newPattern.preferredChallengeTypes[challengeType] || 0) + 1
      };

      // Update average wager
      const currentAvg = newPattern.averageChallengeWager;
      const totalChallenges = Object.values(newPattern.preferredChallengeTypes).reduce((a: number, b: number) => a + b, 0);
      newPattern.averageChallengeWager = ((currentAvg * (totalChallenges - 1)) + data.wager) / totalChallenges;
      break;

    case 'travel':
      newPattern.recentTravel = [data.region, ...newPattern.recentTravel].slice(0, 10);
      break;

    case 'craft':
      newPattern.craftingFrequency += 1;
      break;
  }

  // Update risk profile based on average wager and challenge frequency
  if (newPattern.averageChallengeWager > 300) {
    newPattern.riskProfile = 'aggressive';
  } else if (newPattern.averageChallengeWager > 150) {
    newPattern.riskProfile = 'moderate';
  } else {
    newPattern.riskProfile = 'conservative';
  }

  return newPattern;
};

const getAdaptiveAiPhaseEmoji = (phase: string): string => {
  switch (phase) {
    case 'phase1_aggressive': return '😤';
    case 'phase2_desperate': return '😰';
    case 'phase3_allIn': return '🔥';
    default: return '🤖';
  }
};

const getAdaptiveAiPhaseName = (phase: string): string => {
  switch (phase) {
    case 'phase1_aggressive': return 'Aggressive';
    case 'phase2_desperate': return 'Desperate';
    case 'phase3_allIn': return 'All-In';
    default: return 'Normal';
  }
};

const processAdvancedLoans = (
  player: any,
  gameSettings: GameSettingsState,
  currentDay: number
): { updatedPlayer: any; notifications: Array<{ message: string; type: string }> } => {
  if (!gameSettings.advancedLoansEnabled) {
    return { updatedPlayer: player, notifications: [] };
  }

  const notifications: Array<{ message: string; type: string }> = [];
  let updatedPlayer = { ...player };
  let advancedLoans = [...(player.advancedLoans || [])];
  let loanHistory = { ...(player.loanHistory || { totalTaken: 0, totalRepaid: 0, defaultCount: 0, earlyRepaymentCount: 0 }) };

  const creditScore = gameSettings.creditScoreEnabled ? calculateCreditScore(player, { day: currentDay }) : 50;
  const creditRange = getCreditScoreRange(creditScore);

  // Process each loan
  const loansToRemove: string[] = [];

  advancedLoans = advancedLoans.map(loan => {
    const updatedLoan = { ...loan };

    // Decrease days remaining
    updatedLoan.daysRemaining -= 1;

    // Accrue interest
    const interestAmount = calculateLoanInterest(
      updatedLoan,
      gameSettings.creditScoreEnabled ? creditRange.multiplier : 1.0,
      gameSettings.interestAccrualRate
    );
    updatedLoan.accrued += interestAmount;

    // Check for default (term expired)
    if (updatedLoan.daysRemaining <= 0) {
      const totalOwed = updatedLoan.amount + updatedLoan.accrued;
      const penalty = totalOwed * (gameSettings.defaultPenaltyMultiplier - 1.0);

      updatedPlayer.money -= (totalOwed + penalty);
      loanHistory.defaultCount += 1;

      notifications.push({
        message: `Loan defaulted! Paid $${Math.floor(totalOwed + penalty)} (includes ${Math.floor(penalty)} penalty)`,
        type: 'error'
      });

      loansToRemove.push(loan.id);

      // Update bankruptcy tracking
      if (updatedPlayer.money < BANKRUPTCY_THRESHOLD) {
        updatedPlayer.daysSinceLastBankruptcy = 0;
      }
    }

    return updatedLoan;
  });

  // Remove defaulted loans
  advancedLoans = advancedLoans.filter(loan => !loansToRemove.includes(loan.id));

  // Update player state
  updatedPlayer.advancedLoans = advancedLoans;
  updatedPlayer.loanHistory = loanHistory;
  updatedPlayer.creditScore = creditScore;

  // Increment days since last bankruptcy
  if (updatedPlayer.money >= BANKRUPTCY_THRESHOLD) {
    updatedPlayer.daysSinceLastBankruptcy = (updatedPlayer.daysSinceLastBankruptcy || 0) + 1;
  }

  return { updatedPlayer, notifications };
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
    craftingBonus: {
      description: "Crafts tourism items instantly (no action cost)",
      effect: { categorySpeedBonus: { tourism: 1.0 } }
    },
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
    craftingBonus: {
      description: "Crafted items sell for +20% more",
      effect: { sellBonus: 0.20 }
    },
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
    craftingBonus: {
      description: "Chance to get bonus materials when crafting",
      effect: { bonusMaterialChance: 0.25 }
    },
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
    craftingBonus: {
      description: "Higher success rate and quality when crafting",
      effect: { successBonus: 0.15, qualityBonus: 0.10 }
    },
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
  'r': { action: 'openResources', label: 'Sell Market', description: 'Open resource selling market' },
  'w': { action: 'openWorkshop', label: 'Workshop', description: 'Open crafting workshop' },
  'm': { action: 'openResourceMarket', label: 'Resource Market', description: 'Open resource buying market' },
  'g': { action: 'openMap', label: 'Map', description: 'Toggle map view' },
  't': { action: 'openTravel', label: 'Travel', description: 'Open travel modal' },
  'n': { action: 'openNegotiations', label: 'Negotiations', description: 'Open negotiation center' },
  'h': { action: 'openNotifications', label: 'Notifications', description: 'Open notification history' },
  'p': { action: 'openProgress', label: 'Progress', description: 'Open progress dashboard' },
  'ctrl+shift+c': { action: 'clearNotifications', label: 'Clear Notifications', description: 'Clear all notifications' },
  '?': { action: 'toggleHelp', label: 'Help', description: 'Toggle keyboard shortcuts help' },
  'escape': { action: 'closeModal', label: 'Close', description: 'Close any open modal' },
};

const GAME_VERSION = "5.1.0";
const MINIMUM_WAGER = 50; // Minimum wager required for challenges
const MAX_INVENTORY = 50; // Maximum inventory capacity for players and AI
const OVERRIDE_DAILY_CAP = 3;
const OVERRIDE_BASE_COST = 500;
const OVERRIDE_FATIGUE_DECAY = 0.5;
const BANKRUPTCY_THRESHOLD = 50;
const BANKRUPTCY_STREAK_DAYS = 3;
const LOAN_AMOUNT = 500;
const LOAN_INTEREST_RATE = 0.25;
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

// =========================================
// ADVANCED LOAN SYSTEM CONSTANTS
// =========================================

// Four-tiered loan structure
const LOAN_TIERS = [
  {
    id: "quick_cash",
    name: "Quick Cash",
    amount: 300,
    baseInterestRate: 0.30,
    term: 3,
    levelRequired: 1,
    description: "Fast cash for immediate needs"
  },
  {
    id: "standard",
    name: "Standard Loan",
    amount: 500,
    baseInterestRate: 0.25,
    term: 5,
    levelRequired: 1,
    description: "Balanced loan option"
  },
  {
    id: "business",
    name: "Business Loan",
    amount: 1000,
    baseInterestRate: 0.20,
    term: 7,
    levelRequired: 5,
    description: "Larger loan for business expansion"
  },
  {
    id: "investment",
    name: "Investment Loan",
    amount: 2000,
    baseInterestRate: 0.15,
    term: 10,
    levelRequired: 10,
    description: "Premium loan with best rates"
  }
];

// Credit score ranges and their multipliers
const CREDIT_SCORE_RANGES = [
  { min: 80, max: 100, label: "Excellent", multiplier: 0.8, color: "#10b981" },
  { min: 60, max: 79, label: "Good", multiplier: 0.9, color: "#3b82f6" },
  { min: 40, max: 59, label: "Fair", multiplier: 1.0, color: "#f59e0b" },
  { min: 20, max: 39, label: "Poor", multiplier: 1.2, color: "#ef4444" },
  { min: 0, max: 19, label: "Bad", multiplier: 1.5, color: "#991b1b" }
];

// Special loan events (random triggers)
const LOAN_EVENTS = [
  {
    id: "loan_shark",
    name: "Loan Shark",
    amount: 800,
    interestRate: 0.50,
    term: 3,
    triggerCondition: (player: any) => player.money < 300,
    description: "Desperate times call for desperate measures"
  },
  {
    id: "government_relief",
    name: "Government Relief",
    amount: 600,
    interestRate: 0,
    term: 5,
    triggerCondition: (player: any) => (player.loans?.length || 0) >= 2,
    description: "Government aid for those in financial distress"
  },
  {
    id: "investor_backing",
    name: "Investor Backing",
    amount: 1500,
    interestRate: 0.10,
    term: 7,
    bonusResources: 3,
    triggerCondition: (player: any) => {
      const netWorth = player.money + (player.inventory?.length || 0) * 50;
      return netWorth > 3000;
    },
    description: "Investor impressed by your success"
  }
];

// =========================================
// ADAPTIVE AI CONSTANTS
// =========================================

// Adaptive AI phase thresholds
const ADAPTIVE_AI_THRESHOLDS = {
  phase1_aggressive: {
    netWorthRatio: 0.50, // AI net worth < 50% of player
    levelDifference: 3,
    challengeDifference: 5
  },
  phase2_desperate: {
    netWorthRatio: 0.33, // AI net worth < 33% of player
    levelDifference: 5,
    challengeDifference: 10
  },
  phase3_allIn: {
    netWorthRatio: 0.25, // AI net worth < 25% of player
    levelDifference: 7,
    challengeDifference: 15
  }
};

// Adaptive AI phase modifiers
const ADAPTIVE_AI_MODIFIERS = {
  normal: {
    riskTolerance: 1.0,
    challengeWagerMultiplier: 1.0,
    travelAggression: 1.0,
    sabotageChance: 0,
    specialAbilityPriority: 1.0,
    craftingFocus: 1.0
  },
  phase1_aggressive: {
    riskTolerance: 1.4,
    challengeWagerMultiplier: 1.5,
    travelAggression: 1.3,
    sabotageChance: 0.4,
    specialAbilityPriority: 1.2,
    craftingFocus: 1.1
  },
  phase2_desperate: {
    riskTolerance: 1.8,
    challengeWagerMultiplier: 2.0,
    travelAggression: 1.5,
    sabotageChance: 0.6,
    specialAbilityPriority: 1.5,
    craftingFocus: 2.0,
    investmentBlocking: true
  },
  phase3_allIn: {
    riskTolerance: 2.5,
    challengeWagerMultiplier: 2.5,
    travelAggression: 2.0,
    sabotageChance: 0.8,
    specialAbilityPriority: 2.0,
    craftingFocus: 2.5,
    highRiskLoans: true,
    mirrorPlayerStrategy: true,
    blockPlayerRegions: true
  }
};

// =========================================
// TYPE DEFINITIONS FOR NEW FEATURES
// =========================================

// Extended loan type
interface AdvancedLoan {
  id: string;
  tierId: string;
  amount: number;
  baseInterestRate: number;
  actualInterestRate: number;
  accrued: number;
  term: number;
  daysRemaining: number;
  issuedDay: number;
  isEvent: boolean;
  eventId?: string;
}

// Loan history tracking
interface LoanHistory {
  totalTaken: number;
  totalRepaid: number;
  defaultCount: number;
  earlyRepaymentCount: number;
}

// Player behavior pattern tracking
interface PlayerPattern {
  favoriteResources: Record<string, number>; // resource -> sell count
  preferredChallengeTypes: Record<string, number>; // type -> completion count
  recentTravel: string[]; // last 10 regions visited
  craftingFrequency: number;
  averageChallengeWager: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

// Region control system (V5.0)
interface RegionDeposits {
  [regionId: string]: {
    [playerId: string]: number;
  };
}

interface RegionControlStats {
  totalControlled: Record<string, number>;
  totalInvested: Record<string, number>;
  controlHistory: Array<{
    turn: number;
    region: string;
    fromPlayer: string;
    toPlayer: string;
    method: 'deposit' | 'steal' | 'proposal';
  }>;
}

type ProposalStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
type ProposalTermType = 'cash' | 'resources' | 'quest' | 'hybrid' | 'custom';

interface Proposal {
  id: string;
  from: string;
  to: string;
  region: string;
  status: ProposalStatus;
  termType: ProposalTermType;
  termDetails: {
    cashAmount?: number;
    resources?: Record<string, number>;
    challengeNames?: string[];
    customText?: string;
  };
  timestamp: number;
  acceptedAt?: number;
  completedAt?: number;
  cancelledAt?: number;
  aiReasoning?: string;
  counterProposalOf?: string;
}

interface NegotiationCenterState {
  isOpen: boolean;
  activeTab: 'active' | 'pending' | 'create' | 'history' | 'settings' | 'logs';
  pendingProposalsCount: number;
  draftProposal?: Partial<Proposal>;
  filters: {
    historyPlayer?: string;
    historyRegion?: string;
    historyOutcome?: 'completed' | 'cancelled';
  };
  sortOptions: {
    activeSort: 'region' | 'player' | 'progress' | 'time';
    historySortBy: 'date' | 'duration' | 'region' | 'player';
    sortDirection: 'asc' | 'desc';
  };
}

interface NegotiationLogEntry {
  id: string;
  turn: number;
  timestamp: number;
  eventType: 'proposal_sent' | 'proposal_received' | 'proposal_accepted' | 'proposal_declined' | 'proposal_completed' | 'proposal_cancelled' | 'counter_proposal' | 'task_attempt' | 'task_pending';
  proposalId: string;
  from: string;
  to: string;
  region: string;
  details: string;
  reasoning?: string;
}

interface NegotiationStats {
  totalSent: number;
  totalReceived: number;
  accepted: number;
  declined: number;
  completed: number;
  cancelled: number;
  totalCashSpent: number;
  totalResourcesSpent: Record<string, number>;
  byOpponent: Record<string, {
    exchanged: number;
    accepted: number;
    completed: number;
    favouriteTermType: ProposalTermType | null;
  }>;
}

interface ChallengeCompletionLogEntry {
  id: string;
  playerId: 'player' | 'ai';
  challengeName: string;
  turn: number;
  timestamp: number;
}

// Notification settings system (V5.0)
type NotificationType =
  | 'ai_travel' | 'ai_sabotage' | 'ai_trade' | 'ai_challenge'
  | 'resource_buy' | 'resource_sell' | 'crafting' | 'market'
  | 'control_gain' | 'control_lost' | 'deposit' | 'cashout'
  | 'proposal_received' | 'proposal_accepted' | 'proposal_declined'
  | 'proposal_completed' | 'counter_proposal' | 'task_completion'
  | 'challenge_result' | 'level_up' | 'system';

type NotificationClearShortcut = 'ctrl+shift+c' | 'ctrl+alt+c' | 'disabled';

interface NotificationSettings {
  size: 'small' | 'medium' | 'large' | 'custom';
  customSize?: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  animation: 'slide' | 'fade' | 'none';
  animationSpeed: number;
  autoDismiss: Record<NotificationType, number>;
  typeFilters: Record<NotificationType, boolean>;
  opacity: number;
  maxVisible: number;
  stackOrder: 'newest-first' | 'oldest-first';
  borderStyle: 'none' | 'thin' | 'thick';
  shadow: 'none' | 'subtle' | 'prominent';
}

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
  aiWinConditionSpendingEnabled: boolean;
  aiRegionsMajorityRushEnabled: boolean;
  aiDeterministic: boolean;
  aiDeterministicSeed: number;
  // Advanced Loan System (disabled by default)
  advancedLoansEnabled: boolean;
  creditScoreEnabled: boolean;
  loanEventsEnabled: boolean;
  earlyRepaymentEnabled: boolean;
  loanRefinancingEnabled: boolean;
  defaultPenaltyMultiplier: number; // 0.5 - 2.0
  interestAccrualRate: number; // 0.5 - 2.0
  maxSimultaneousLoans: number; // 1-5
  loanTierUnlockSpeedMultiplier: number; // 0.5 - 3.0
  // Adaptive AI System (disabled by default)
  adaptiveAiEnabled: boolean;
  adaptiveAiNetWorthThreshold: number; // 1.5 - 5.0 (player/AI ratio)
  adaptiveAiLevelDifference: number; // 3-10 levels
  adaptiveAiChallengeDifference: number; // 5-20 challenges
  adaptiveAiConsecutiveDays: number; // 1-7 days required
  adaptiveAiMaxDifficulty: 'medium' | 'hard' | 'expert';
  adaptiveAiAggressionMultiplier: number; // 0.5 - 2.0
  adaptiveAiPatternLearning: boolean;
  adaptiveAiRubberBanding: boolean;
  adaptiveAiTauntsEnabled: boolean;
  // V5.0 gameplay settings
  winCondition: 'money' | 'regions';
  allowCashOut: boolean;
  negotiationMode: boolean;
  negotiationOptions: {
    autoAcceptCashUnder: number;
    autoAcceptResourceValueUnder: number;
    autoAcceptQuestDifficulty: 'Easy' | 'Medium' | 'Hard' | 'Any';
    autoDeclineIfLackingResources: boolean;
    alwaysAutoAcceptFrom: string[];
    requireManualHybrid: boolean;
    requireManualCustom: boolean;
    suggestCounterOffers: boolean;
    fairPriceCalculator: boolean;
    probabilityEstimator: boolean;
    strategyTips: boolean;
    autoCompleteReadyTasks: boolean;
    proposalExpirationTurns: number;
    confirmExpensiveTasks: boolean;
    confirmCancelProposal: boolean;
  };
  notificationSettings: NotificationSettings;
  notificationClearShortcut: NotificationClearShortcut;
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
  notificationType: NotificationType;
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
  type: 'challenge' | 'travel' | 'sell' | 'collect' | 'think' | 'end_turn' | 'special_ability' | 'invest' | 'buy_equipment' | 'sabotage' | 'craft' | 'buy_market' | 'region_deposit' | 'cashout_region';
  description: string;
  data?: any;
}

const NOTIFICATION_TYPES_ALL: NotificationType[] = [
  'ai_travel', 'ai_sabotage', 'ai_trade', 'ai_challenge',
  'resource_buy', 'resource_sell', 'crafting', 'market',
  'control_gain', 'control_lost', 'deposit', 'cashout',
  'proposal_received', 'proposal_accepted', 'proposal_declined',
  'proposal_completed', 'counter_proposal', 'task_completion',
  'challenge_result', 'level_up', 'system'
];

const NOTIFICATION_GROUPS: Record<string, NotificationType[]> = {
  ai_actions: ['ai_travel', 'ai_sabotage', 'ai_trade', 'ai_challenge'],
  resource_updates: ['resource_buy', 'resource_sell', 'crafting', 'market'],
  region_control: ['control_gain', 'control_lost', 'deposit', 'cashout'],
  negotiation_events: ['proposal_received', 'proposal_accepted', 'proposal_declined', 'proposal_completed', 'counter_proposal', 'task_completion'],
  challenge_results: ['challenge_result'],
  level_ups: ['level_up'],
  system_messages: ['system']
};

const createDefaultNotificationSettings = (): NotificationSettings => ({
  size: 'medium',
  customSize: 100,
  position: 'top-right',
  animation: 'slide',
  animationSpeed: 0.5,
  autoDismiss: {
    ai_travel: 5,
    ai_sabotage: 5,
    ai_trade: 5,
    ai_challenge: 5,
    resource_buy: 5,
    resource_sell: 5,
    crafting: 5,
    market: 5,
    control_gain: 5,
    control_lost: 5,
    deposit: 5,
    cashout: 5,
    proposal_received: 5,
    proposal_accepted: 5,
    proposal_declined: 5,
    proposal_completed: 5,
    counter_proposal: 5,
    task_completion: 5,
    challenge_result: 8,
    level_up: 10,
    system: 10
  },
  typeFilters: {
    ai_travel: true,
    ai_sabotage: true,
    ai_trade: true,
    ai_challenge: true,
    resource_buy: true,
    resource_sell: true,
    crafting: true,
    market: true,
    control_gain: true,
    control_lost: true,
    deposit: true,
    cashout: true,
    proposal_received: true,
    proposal_accepted: true,
    proposal_declined: true,
    proposal_completed: true,
    counter_proposal: true,
    task_completion: true,
    challenge_result: true,
    level_up: true,
    system: true
  },
  opacity: 100,
  maxVisible: 5,
  stackOrder: 'newest-first',
  borderStyle: 'thin',
  shadow: 'subtle'
});

const createDefaultRegionControlStats = (): RegionControlStats => ({
  totalControlled: { player: 0, ai: 0 },
  totalInvested: { player: 0, ai: 0 },
  controlHistory: []
});

const createDefaultNegotiationCenterState = (): NegotiationCenterState => ({
  isOpen: false,
  activeTab: 'active',
  pendingProposalsCount: 0,
  draftProposal: {},
  filters: {},
  sortOptions: {
    activeSort: 'time',
    historySortBy: 'date',
    sortDirection: 'desc'
  }
});

const createDefaultNegotiationStats = (): NegotiationStats => ({
  totalSent: 0,
  totalReceived: 0,
  accepted: 0,
  declined: 0,
  completed: 0,
  cancelled: 0,
  totalCashSpent: 0,
  totalResourcesSpent: {},
  byOpponent: {}
});

const createDefaultNegotiationOptions = (): GameSettingsState['negotiationOptions'] => ({
  autoAcceptCashUnder: 0,
  autoAcceptResourceValueUnder: 0,
  autoAcceptQuestDifficulty: 'Any',
  autoDeclineIfLackingResources: true,
  alwaysAutoAcceptFrom: [],
  requireManualHybrid: true,
  requireManualCustom: true,
  suggestCounterOffers: true,
  fairPriceCalculator: true,
  probabilityEstimator: true,
  strategyTips: true,
  autoCompleteReadyTasks: false,
  proposalExpirationTurns: 0,
  confirmExpensiveTasks: true,
  confirmCancelProposal: true
});

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
  aiWinConditionSpendingEnabled: false,
  aiRegionsMajorityRushEnabled: false,
  aiDeterministic: false,
  aiDeterministicSeed: 1337,
  // Advanced Loan System (disabled by default)
  advancedLoansEnabled: false,
  creditScoreEnabled: false,
  loanEventsEnabled: false,
  earlyRepaymentEnabled: false,
  loanRefinancingEnabled: false,
  defaultPenaltyMultiplier: 1.0,
  interestAccrualRate: 1.0,
  maxSimultaneousLoans: 3,
  loanTierUnlockSpeedMultiplier: 1.0,
  // Adaptive AI System (disabled by default)
  adaptiveAiEnabled: false,
  adaptiveAiNetWorthThreshold: 2.5,
  adaptiveAiLevelDifference: 5,
  adaptiveAiChallengeDifference: 10,
  adaptiveAiConsecutiveDays: 3,
  adaptiveAiMaxDifficulty: 'expert',
  adaptiveAiAggressionMultiplier: 1.0,
  adaptiveAiPatternLearning: false,
  adaptiveAiRubberBanding: false,
  adaptiveAiTauntsEnabled: false,
  // V5.0 settings
  winCondition: 'money',
  allowCashOut: false,
  negotiationMode: false,
  negotiationOptions: createDefaultNegotiationOptions(),
  notificationSettings: createDefaultNotificationSettings(),
  notificationClearShortcut: 'ctrl+shift+c'
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
  loans: [] as Array<{ id: string; amount: number; accrued: number }>,
  advancedLoans: [] as AdvancedLoan[],
  creditScore: 50,
  loanHistory: {
    totalTaken: 0,
    totalRepaid: 0,
    defaultCount: 0,
    earlyRepaymentCount: 0
  } as LoanHistory,
  daysSinceLastBankruptcy: 0,
  completedThisSeason: [] as string[],
  challengeMastery: {} as Record<string, number>,
  stipendCooldown: 0,
  investments: [] as string[],
  equipment: [] as string[],
  debuffs: [] as Debuff[]
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
  dominanceTracker: { player: 0, ai: 0 },
  // Adaptive AI tracking
  adaptiveAiPhase: 'normal' as 'normal' | 'phase1_aggressive' | 'phase2_desperate' | 'phase3_allIn',
  adaptiveAiDaysTriggered: 0,
  playerDominanceDays: 0,
  aiPatternData: {
    favoriteResources: {},
    preferredChallengeTypes: {},
    recentTravel: [],
    craftingFrequency: 0,
    averageChallengeWager: 0,
    riskProfile: 'moderate'
  } as PlayerPattern,
  aiStrategyFocus: 'balanced' as 'challenges' | 'trading' | 'travel' | 'balanced',
  // V5.0 region control
  regionDeposits: {} as RegionDeposits,
  regionControlStats: createDefaultRegionControlStats(),
  proposals: [] as Proposal[],
  negotiationCenter: createDefaultNegotiationCenterState(),
  negotiationLogs: [] as NegotiationLogEntry[],
  negotiationStats: createDefaultNegotiationStats(),
  challengeCompletions: [] as ChallengeCompletionLogEntry[]
};

type GameStateSnapshot = typeof initialGameState;

const CONTROL_PLAYER_IDS = ['player', 'ai'] as const;
const TOTAL_REGION_COUNT = Object.keys(REGIONS).length;
const REGION_CONTROL_MAJORITY = Math.floor(TOTAL_REGION_COUNT / 2) + 1;

const sanitizeRegionDeposits = (raw: any): RegionDeposits => {
  if (!raw || typeof raw !== 'object') return {};
  const sanitized: RegionDeposits = {};
  Object.keys(REGIONS).forEach(regionCode => {
    const regionEntry = raw[regionCode];
    if (!regionEntry || typeof regionEntry !== 'object') return;
    const normalized: Record<string, number> = {};
    Object.entries(regionEntry).forEach(([playerId, amount]) => {
      if (typeof amount !== 'number' || !isFinite(amount) || amount <= 0) return;
      normalized[playerId] = Math.floor(amount);
    });
    if (Object.keys(normalized).length > 0) {
      sanitized[regionCode] = normalized;
    }
  });
  return sanitized;
};

const getRegionControlSnapshot = (regionEntry: Record<string, number> = {}) => {
  const entries = Object.entries(regionEntry)
    .filter(([, amount]) => typeof amount === 'number' && isFinite(amount) && amount > 0)
    .map(([playerId, amount]) => ({ playerId, amount: Math.floor(amount) }))
    .sort((a, b) => b.amount - a.amount);

  const highestDeposit = entries[0]?.amount || 0;
  const top = entries[0];
  const second = entries[1];
  const controllerId = top && (!second || top.amount > second.amount) ? top.playerId : null;

  return {
    entries,
    highestDeposit,
    controllerId
  };
};

const getRequiredDepositToControl = (
  regionDeposits: RegionDeposits,
  regionId: string,
  actorId: string
) => {
  const regionEntry = regionDeposits?.[regionId] || {};
  const snapshot = getRegionControlSnapshot(regionEntry);
  const actorCurrent = Math.floor(regionEntry?.[actorId] || 0);
  if (snapshot.controllerId === actorId) return 1;
  const requiredTotal = snapshot.highestDeposit > 0 ? snapshot.highestDeposit + 1 : 1;
  return Math.max(1, requiredTotal - actorCurrent);
};

const computeRegionControlStats = (
  regionDeposits: RegionDeposits,
  history: RegionControlStats['controlHistory']
): RegionControlStats => {
  const totalControlled: Record<string, number> = { player: 0, ai: 0 };
  const totalInvested: Record<string, number> = { player: 0, ai: 0 };

  Object.keys(REGIONS).forEach(regionCode => {
    const regionEntry = regionDeposits?.[regionCode] || {};
    const snapshot = getRegionControlSnapshot(regionEntry);

    if (snapshot.controllerId && typeof totalControlled[snapshot.controllerId] === 'number') {
      totalControlled[snapshot.controllerId] += 1;
    }

    CONTROL_PLAYER_IDS.forEach(playerId => {
      const amount = Math.floor(regionEntry[playerId] || 0);
      totalInvested[playerId] = (totalInvested[playerId] || 0) + Math.max(0, amount);
    });
  });

  return {
    totalControlled,
    totalInvested,
    controlHistory: Array.isArray(history) ? history : []
  };
};

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
    // Adaptive AI actions
    case 'SET_ADAPTIVE_AI_PHASE':
      return { ...state, adaptiveAiPhase: action.payload };
    case 'SET_ADAPTIVE_AI_DAYS_TRIGGERED':
      return { ...state, adaptiveAiDaysTriggered: action.payload };
    case 'SET_PLAYER_DOMINANCE_DAYS':
      return { ...state, playerDominanceDays: action.payload };
    case 'UPDATE_AI_PATTERN_DATA':
      return { ...state, aiPatternData: action.payload };
    case 'SET_AI_STRATEGY_FOCUS':
      return { ...state, aiStrategyFocus: action.payload };
    case 'SET_REGION_CONTROL_DATA':
      return {
        ...state,
        regionDeposits: action.payload?.regionDeposits || state.regionDeposits,
        regionControlStats: action.payload?.regionControlStats || state.regionControlStats
      };
    case 'ADD_CHALLENGE_COMPLETION':
      return {
        ...state,
        challengeCompletions: [...(state.challengeCompletions || []), action.payload].slice(-1000)
      };
    case 'SET_NEGOTIATION_DATA':
      return {
        ...state,
        proposals: Array.isArray(action.payload?.proposals) ? action.payload.proposals : state.proposals,
        negotiationCenter: action.payload?.negotiationCenter
          ? { ...state.negotiationCenter, ...action.payload.negotiationCenter }
          : state.negotiationCenter,
        negotiationLogs: Array.isArray(action.payload?.negotiationLogs) ? action.payload.negotiationLogs : state.negotiationLogs,
        negotiationStats: action.payload?.negotiationStats || state.negotiationStats,
        challengeCompletions: Array.isArray(action.payload?.challengeCompletions)
          ? action.payload.challengeCompletions
          : state.challengeCompletions
      };
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
    loans: [] as Array<{ id: string; amount: number; accrued: number }>,
    advancedLoans: [] as AdvancedLoan[],
    creditScore: 50,
    loanHistory: {
      totalTaken: 0,
      totalRepaid: 0,
      defaultCount: 0,
      earlyRepaymentCount: 0
    } as LoanHistory,
    daysSinceLastBankruptcy: 0,
    completedThisSeason: [] as string[],
    challengeMastery: {} as Record<string, number>,
    stipendCooldown: 0,
    investments: [] as string[],
    equipment: [] as string[],
    debuffs: [] as Debuff[]
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
    showResourceMarket: false,
    showShop: false,
    showInvestments: false,
    showSabotage: false,
    showStats: false,
    showMap: true,
    showWorkshop: false,
    selectedCharacter: 0,
    playerName: "",
    wagerAmount: 100,
    showCampaignSelect: false,
    theme: "dark",
    showNotifications: false,
    showProgress: false,
    showHelp: false,
    showSettings: false,
    showNegotiationCenter: false,
    showEndGameModes: false,
    notificationFilter: 'all',
    quickActionsOpen: true,
    showAiStats: false,
    showDayTransition: false,
    showSaveLoadModal: false,
    // New inventory management options
    inventorySort: 'default' as 'default' | 'value' | 'quantity' | 'category',
    inventoryFilter: 'all' as 'all' | 'luxury' | 'food' | 'industrial' | 'agricultural' | 'energy' | 'financial' | 'service',
    showDoubleOrNothing: false,
    // Advanced Loan System UI
    showAdvancedLoans: false
  });

  const [resourceMarketSelection, setResourceMarketSelection] = useState<string>(RESOURCE_MARKET_RESOURCES[0] || "Opals");
  const [resourceMarketQuantity, setResourceMarketQuantity] = useState<number>(1);
  const [proposalResourceSelection, setProposalResourceSelection] = useState<string>(RESOURCE_MARKET_RESOURCES[0] || "Wine");
  const [proposalResourceQuantity, setProposalResourceQuantity] = useState<number>(1);
  const [proposalChallengeSelection, setProposalChallengeSelection] = useState<string>(((Object.values(REGIONS)[0] as any)?.challenges?.[0]?.name) || "");
  const [negotiationHistorySearch, setNegotiationHistorySearch] = useState<string>("");
  const [negotiationLogSearch, setNegotiationLogSearch] = useState<string>("");
  const [regionDepositInput, setRegionDepositInput] = useState<number>(1);

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
  const regionDepositsRef = useRef<RegionDeposits>(sanitizeRegionDeposits(initialGameState.regionDeposits));
  const regionControlHistoryRef = useRef<RegionControlStats['controlHistory']>(initialGameState.regionControlStats.controlHistory || []);
  const proposalsRef = useRef<Proposal[]>(initialGameState.proposals || []);
  const negotiationLogsRef = useRef<NegotiationLogEntry[]>(initialGameState.negotiationLogs || []);
  const negotiationCenterRef = useRef<NegotiationCenterState>(initialGameState.negotiationCenter || createDefaultNegotiationCenterState());
  const challengeCompletionsRef = useRef<ChallengeCompletionLogEntry[]>(initialGameState.challengeCompletions || []);

  // Keep aiPlayerRef in sync with aiPlayer state
  useEffect(() => {
    aiPlayerRef.current = aiPlayer;
  }, [aiPlayer]);

  useEffect(() => {
    regionDepositsRef.current = sanitizeRegionDeposits(gameState.regionDeposits);
    regionControlHistoryRef.current = gameState.regionControlStats?.controlHistory || [];
    proposalsRef.current = Array.isArray(gameState.proposals) ? gameState.proposals : [];
    negotiationLogsRef.current = Array.isArray(gameState.negotiationLogs) ? gameState.negotiationLogs : [];
    negotiationCenterRef.current = gameState.negotiationCenter || createDefaultNegotiationCenterState();
    challengeCompletionsRef.current = Array.isArray(gameState.challengeCompletions) ? gameState.challengeCompletions : [];
  }, [gameState.regionControlStats, gameState.regionDeposits, gameState.proposals, gameState.negotiationLogs, gameState.negotiationCenter, gameState.challengeCompletions]);

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

  const resolveNotificationSubtype = useCallback((
    type: keyof typeof NOTIFICATION_TYPES,
    message: string,
    explicitType?: NotificationType
  ): NotificationType => {
    if (explicitType) return explicitType;

    const normalized = (message || '').toLowerCase();

    if (normalized.includes('cash out')) return 'cashout';
    if (normalized.includes('control') && normalized.includes('lost')) return 'control_lost';
    if (normalized.includes('control') && normalized.includes('gained')) return 'control_gain';
    if (normalized.includes('deposit')) return 'deposit';
    if (normalized.includes('crafted')) return 'crafting';
    if (normalized.includes('bought') || normalized.includes('purchased')) return 'resource_buy';
    if (normalized.includes('sold')) return 'resource_sell';

    if (type === 'ai') {
      if (normalized.includes('travel')) return 'ai_travel';
      if (normalized.includes('sabotage')) return 'ai_sabotage';
      if (normalized.includes('challenge')) return 'ai_challenge';
      return 'ai_trade';
    }

    if (type === 'challenge') return 'challenge_result';
    if (type === 'levelup') return 'level_up';
    if (type === 'market') return 'market';
    if (type === 'resource') return 'resource_sell';
    if (type === 'money') return 'resource_sell';
    return 'system';
  }, []);

  const addNotification = useCallback((
    message: string,
    type: keyof typeof NOTIFICATION_TYPES = 'info',
    persistent: boolean = false,
    notificationTypeOverride?: NotificationType
  ) => {
    const notificationType = resolveNotificationSubtype(type, message, notificationTypeOverride);
    const notification: Notification = {
      id: Date.now().toString() + Math.random(),
      type,
      notificationType,
      message,
      timestamp: Date.now(),
      day: gameState.day,
      read: false,
      persistent
    };
    
    setNotifications(prev => [...prev, notification]);
    
    const dismissSeconds = gameSettings.notificationSettings?.autoDismiss?.[notificationType] ?? 5;
    if (!persistent && dismissSeconds > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, dismissSeconds * 1000);
    }
  }, [gameSettings.notificationSettings, gameState.day, resolveNotificationSubtype]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback((force = false) => {
    if (!force && notifications.length >= 5) {
      const shouldClear = window.confirm(`Clear ${notifications.length} notifications?`);
      if (!shouldClear) return false;
    }
    setNotifications([]);
    return true;
  }, [notifications.length]);

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
    const persistedGameState: GameStateSnapshot = {
      ...gameState,
      negotiationCenter: {
        ...createDefaultNegotiationCenterState(),
        draftProposal: gameState.negotiationCenter?.draftProposal || {}
      }
    };
    return {
      metadata: {
        timestamp: Date.now(),
        gameVersion: GAME_VERSION,
        saveDescription: description
      },
      player,
      aiPlayer,
      gameState: persistedGameState,
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
	        : initialGameState.dominanceTracker,
	      regionDeposits: sanitizeRegionDeposits(stateData.regionDeposits),
	      regionControlStats: (() => {
	        const rawStats = stateData.regionControlStats;
	        const rawHistory = Array.isArray(rawStats?.controlHistory)
	          ? rawStats.controlHistory
	              .filter((entry: any) =>
	                entry &&
	                typeof entry.turn === 'number' &&
	                typeof entry.region === 'string' &&
	                typeof entry.fromPlayer === 'string' &&
	                typeof entry.toPlayer === 'string' &&
	                (entry.method === 'deposit' || entry.method === 'steal' || entry.method === 'proposal')
	              )
	              .map((entry: any) => ({
	                turn: Math.floor(entry.turn),
	                region: entry.region,
	                fromPlayer: entry.fromPlayer,
	                toPlayer: entry.toPlayer,
	                method: entry.method
	              }))
	          : [];
	        return computeRegionControlStats(
	          sanitizeRegionDeposits(stateData.regionDeposits),
	          rawHistory
	        );
	      })(),
      proposals: Array.isArray(stateData.proposals)
        ? stateData.proposals
            .filter((proposal: Proposal) =>
              proposal &&
              typeof proposal.id === 'string' &&
              typeof proposal.from === 'string' &&
              typeof proposal.to === 'string' &&
              typeof proposal.region === 'string'
            )
            .map((proposal: Proposal) => ({
              ...proposal,
              status: ['pending', 'accepted', 'declined', 'completed', 'cancelled'].includes(proposal.status)
                ? proposal.status
                : 'pending',
              termType: ['cash', 'resources', 'quest', 'hybrid', 'custom'].includes(proposal.termType)
                ? proposal.termType
                : 'custom',
              termDetails: {
                cashAmount: typeof proposal.termDetails?.cashAmount === 'number' ? proposal.termDetails.cashAmount : undefined,
                resources: proposal.termDetails?.resources && typeof proposal.termDetails.resources === 'object'
                  ? proposal.termDetails.resources
                  : undefined,
                challengeNames: Array.isArray(proposal.termDetails?.challengeNames) ? proposal.termDetails.challengeNames : undefined,
                customText: typeof proposal.termDetails?.customText === 'string' ? proposal.termDetails.customText : undefined
              }
            }))
        : [],
      negotiationCenter: (() => {
        const rawCenter = stateData.negotiationCenter || {};
        return {
          ...createDefaultNegotiationCenterState(),
          ...rawCenter,
          activeTab: ['active', 'pending', 'create', 'history', 'settings', 'logs'].includes(rawCenter.activeTab)
            ? rawCenter.activeTab
            : 'active',
          sortOptions: {
            ...createDefaultNegotiationCenterState().sortOptions,
            ...(rawCenter.sortOptions || {})
          },
          filters: {
            ...(rawCenter.filters || {})
          }
        } as NegotiationCenterState;
      })(),
      negotiationLogs: Array.isArray(stateData.negotiationLogs)
        ? stateData.negotiationLogs
            .filter((entry: NegotiationLogEntry) => entry && typeof entry.id === 'string')
            .slice(-1000)
        : [],
      negotiationStats: {
        ...createDefaultNegotiationStats(),
        ...(stateData.negotiationStats || {})
      },
      challengeCompletions: Array.isArray(stateData.challengeCompletions)
        ? stateData.challengeCompletions
            .filter((entry: ChallengeCompletionLogEntry) =>
              entry &&
              (entry.playerId === 'player' || entry.playerId === 'ai') &&
              typeof entry.challengeName === 'string' &&
              typeof entry.timestamp === 'number'
            )
            .slice(-1000)
        : []
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
	      aiWinConditionSpendingEnabled: typeof settingsData.aiWinConditionSpendingEnabled === 'boolean'
	        ? settingsData.aiWinConditionSpendingEnabled
	        : DEFAULT_GAME_SETTINGS.aiWinConditionSpendingEnabled,
	      aiRegionsMajorityRushEnabled: typeof settingsData.aiRegionsMajorityRushEnabled === 'boolean'
	        ? settingsData.aiRegionsMajorityRushEnabled
	        : DEFAULT_GAME_SETTINGS.aiRegionsMajorityRushEnabled,
	      aiDeterministic: Boolean(settingsData.aiDeterministic),
	      aiDeterministicSeed: normalizeAiSeed(
	        typeof settingsData.aiDeterministicSeed === 'number'
	          ? settingsData.aiDeterministicSeed
	          : DEFAULT_GAME_SETTINGS.aiDeterministicSeed
	      ),
	      dynamicWagerEnabled: typeof settingsData.dynamicWagerEnabled === 'boolean' ? settingsData.dynamicWagerEnabled : DEFAULT_GAME_SETTINGS.dynamicWagerEnabled,
	      doubleOrNothingEnabled: typeof settingsData.doubleOrNothingEnabled === 'boolean' ? settingsData.doubleOrNothingEnabled : DEFAULT_GAME_SETTINGS.doubleOrNothingEnabled,
	      advancedLoansEnabled: typeof settingsData.advancedLoansEnabled === 'boolean' ? settingsData.advancedLoansEnabled : DEFAULT_GAME_SETTINGS.advancedLoansEnabled,
	      creditScoreEnabled: typeof settingsData.creditScoreEnabled === 'boolean' ? settingsData.creditScoreEnabled : DEFAULT_GAME_SETTINGS.creditScoreEnabled,
	      loanEventsEnabled: typeof settingsData.loanEventsEnabled === 'boolean' ? settingsData.loanEventsEnabled : DEFAULT_GAME_SETTINGS.loanEventsEnabled,
	      earlyRepaymentEnabled: typeof settingsData.earlyRepaymentEnabled === 'boolean' ? settingsData.earlyRepaymentEnabled : DEFAULT_GAME_SETTINGS.earlyRepaymentEnabled,
	      loanRefinancingEnabled: typeof settingsData.loanRefinancingEnabled === 'boolean' ? settingsData.loanRefinancingEnabled : DEFAULT_GAME_SETTINGS.loanRefinancingEnabled,
	      defaultPenaltyMultiplier: typeof settingsData.defaultPenaltyMultiplier === 'number' ? settingsData.defaultPenaltyMultiplier : DEFAULT_GAME_SETTINGS.defaultPenaltyMultiplier,
	      interestAccrualRate: typeof settingsData.interestAccrualRate === 'number' ? settingsData.interestAccrualRate : DEFAULT_GAME_SETTINGS.interestAccrualRate,
	      maxSimultaneousLoans: typeof settingsData.maxSimultaneousLoans === 'number' ? settingsData.maxSimultaneousLoans : DEFAULT_GAME_SETTINGS.maxSimultaneousLoans,
	      loanTierUnlockSpeedMultiplier: typeof settingsData.loanTierUnlockSpeedMultiplier === 'number' ? settingsData.loanTierUnlockSpeedMultiplier : DEFAULT_GAME_SETTINGS.loanTierUnlockSpeedMultiplier,
	      adaptiveAiEnabled: typeof settingsData.adaptiveAiEnabled === 'boolean' ? settingsData.adaptiveAiEnabled : DEFAULT_GAME_SETTINGS.adaptiveAiEnabled,
	      adaptiveAiNetWorthThreshold: typeof settingsData.adaptiveAiNetWorthThreshold === 'number' ? settingsData.adaptiveAiNetWorthThreshold : DEFAULT_GAME_SETTINGS.adaptiveAiNetWorthThreshold,
	      adaptiveAiLevelDifference: typeof settingsData.adaptiveAiLevelDifference === 'number' ? settingsData.adaptiveAiLevelDifference : DEFAULT_GAME_SETTINGS.adaptiveAiLevelDifference,
	      adaptiveAiChallengeDifference: typeof settingsData.adaptiveAiChallengeDifference === 'number' ? settingsData.adaptiveAiChallengeDifference : DEFAULT_GAME_SETTINGS.adaptiveAiChallengeDifference,
	      adaptiveAiConsecutiveDays: typeof settingsData.adaptiveAiConsecutiveDays === 'number' ? settingsData.adaptiveAiConsecutiveDays : DEFAULT_GAME_SETTINGS.adaptiveAiConsecutiveDays,
	      adaptiveAiMaxDifficulty: settingsData.adaptiveAiMaxDifficulty || DEFAULT_GAME_SETTINGS.adaptiveAiMaxDifficulty,
	      adaptiveAiAggressionMultiplier: typeof settingsData.adaptiveAiAggressionMultiplier === 'number' ? settingsData.adaptiveAiAggressionMultiplier : DEFAULT_GAME_SETTINGS.adaptiveAiAggressionMultiplier,
	      adaptiveAiPatternLearning: typeof settingsData.adaptiveAiPatternLearning === 'boolean' ? settingsData.adaptiveAiPatternLearning : DEFAULT_GAME_SETTINGS.adaptiveAiPatternLearning,
	      adaptiveAiRubberBanding: typeof settingsData.adaptiveAiRubberBanding === 'boolean' ? settingsData.adaptiveAiRubberBanding : DEFAULT_GAME_SETTINGS.adaptiveAiRubberBanding,
	      adaptiveAiTauntsEnabled: typeof settingsData.adaptiveAiTauntsEnabled === 'boolean' ? settingsData.adaptiveAiTauntsEnabled : DEFAULT_GAME_SETTINGS.adaptiveAiTauntsEnabled,
	      winCondition: settingsData.winCondition === 'regions' ? 'regions' : 'money',
	      allowCashOut: Boolean(settingsData.allowCashOut),
      negotiationMode: typeof settingsData.negotiationMode === 'boolean'
        ? settingsData.negotiationMode
        : DEFAULT_GAME_SETTINGS.negotiationMode,
      negotiationOptions: {
        ...createDefaultNegotiationOptions(),
        ...(settingsData.negotiationOptions || {})
      },
	      notificationSettings: (() => {
	        const source = settingsData.notificationSettings || {};
	        const defaults = createDefaultNotificationSettings();
	        const autoDismiss = { ...defaults.autoDismiss };
	        const typeFilters = { ...defaults.typeFilters };
	        NOTIFICATION_TYPES_ALL.forEach(typeKey => {
	          const rawDismiss = source.autoDismiss?.[typeKey];
	          if (typeof rawDismiss === 'number' && isFinite(rawDismiss) && rawDismiss >= 0) {
	            autoDismiss[typeKey] = rawDismiss;
	          }
	          if (typeof source.typeFilters?.[typeKey] === 'boolean') {
	            typeFilters[typeKey] = source.typeFilters[typeKey];
	          }
	        });
	        return {
	          size: source.size === 'small' || source.size === 'large' || source.size === 'custom' ? source.size : 'medium',
	          customSize: typeof source.customSize === 'number' ? Math.max(80, Math.min(150, source.customSize)) : defaults.customSize,
	          position: source.position || defaults.position,
	          animation: source.animation === 'fade' || source.animation === 'none' ? source.animation : 'slide',
	          animationSpeed: typeof source.animationSpeed === 'number' ? source.animationSpeed : defaults.animationSpeed,
	          autoDismiss,
	          typeFilters,
	          opacity: typeof source.opacity === 'number' ? Math.max(70, Math.min(100, source.opacity)) : defaults.opacity,
	          maxVisible: typeof source.maxVisible === 'number' ? source.maxVisible : defaults.maxVisible,
	          stackOrder: source.stackOrder === 'oldest-first' ? 'oldest-first' : 'newest-first',
	          borderStyle: source.borderStyle === 'none' || source.borderStyle === 'thick' ? source.borderStyle : 'thin',
	          shadow: source.shadow === 'none' || source.shadow === 'prominent' ? source.shadow : 'subtle'
	        } as NotificationSettings;
	      })(),
	      notificationClearShortcut: settingsData.notificationClearShortcut === 'ctrl+alt+c'
	        ? 'ctrl+alt+c'
	        : settingsData.notificationClearShortcut === 'disabled'
	          ? 'disabled'
	          : 'ctrl+shift+c'
	    };

	    const sanitizedNotifications: Notification[] = Array.isArray(raw.notifications)
	      ? raw.notifications
	          .filter(n => n && typeof n.message === 'string' && typeof n.type === 'string')
	          .map((n) => ({
	            id: typeof n.id === 'string' ? n.id : `${n.type}-${n.message}-${Math.random()}`,
	            type: n.type in NOTIFICATION_TYPES ? n.type : 'info',
	            notificationType: NOTIFICATION_TYPES_ALL.includes(n.notificationType as NotificationType)
	              ? n.notificationType
	              : 'system',
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

    // Check if this is a crafted item (Businessman gets +20% bonus on crafted items)
    const isCraftedItem = CRAFTING_RECIPES.some(recipe => recipe.output === resource);
    if (isCraftedItem && aiState.character.craftingBonus?.effect?.sellBonus) {
      multiplier *= (1 + aiState.character.craftingBonus.effect.sellBonus);
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

  // AI Strategy: Evaluate crafting recipes
  const evaluateCrafting = useCallback((recipe, aiState, resourcePrices) => {
    // Check if AI has required materials
    let canCraft = true;
    for (const [resource, requiredCount] of Object.entries(recipe.inputs)) {
      const availableCount = aiState.inventory.filter(item => item === resource).length;
      if (availableCount < (requiredCount as number)) {
        canCraft = false;
        break;
      }
    }

    if (!canCraft) {
      return { recipeId: recipe.id, score: -Infinity };
    }

    // Calculate material cost
    let materialCost = 0;
    for (const [resource, count] of Object.entries(recipe.inputs)) {
      const price = resourcePrices[resource] || 100;
      materialCost += price * (count as number);
    }

    // Estimated crafted item value (1.5-2x materials)
    const craftedValue = recipe.baseValue;
    const profit = craftedValue - materialCost;

    // Base score on profitability
    let score = profit;

    // Businessman gets +20% sell bonus on crafted items
    if (aiState.character.craftingBonus?.effect?.sellBonus) {
      score *= (1 + aiState.character.craftingBonus.effect.sellBonus);
    }

    // Prioritize crafting when inventory is getting full (convert materials to valuable items)
    const inventoryFullness = aiState.inventory.length / MAX_INVENTORY;
    if (inventoryFullness > 0.7) {
      score *= 1.8; // Crafting consolidates inventory
    }

    // Higher value items are better
    if (recipe.baseValue > 800) {
      score *= 1.3; // Luxury items
    }

    // Tourist bonus: tourism items are instant (no action cost)
    if (recipe.category === 'tourism' && aiState.character.craftingBonus?.effect?.categorySpeedBonus?.tourism === 1.0) {
      score *= 1.5; // Free action is very valuable
    }

    // Penalize if low on money (might need cash more than items)
    if (aiState.money < 500) {
      score *= 0.5;
    }

    return { recipeId: recipe.id, score, recipe };
  }, []);

  const evaluateAiMarketPurchase = useCallback((aiState) => {
    let bestPlan: {
      score: number;
      purchases: Array<{ resource: string; quantity: number }>;
      recipeName: string;
      reason: string;
    } | null = null;

    CRAFTING_RECIPES.forEach(recipe => {
      const missing: Array<{ resource: string; quantity: number }> = [];
      let totalCost = 0;
      let totalMissingUnits = 0;

      Object.entries(recipe.inputs).forEach(([resource, required]) => {
        const requiredCount = Number(required) || 0;
        const available = aiState.inventory.filter(item => item === resource).length;
        const missingCount = Math.max(0, requiredCount - available);
        if (missingCount > 0) {
          missing.push({ resource, quantity: missingCount });
          totalMissingUnits += missingCount;
          totalCost += getResourceMarketPrice(resource) * missingCount;
        }
      });

      if (missing.length === 0) return;
      if (totalMissingUnits > 5) return;
      if (aiState.inventory.length + totalMissingUnits > MAX_INVENTORY) return;
      if (aiState.money - totalCost < AI_SAFETY_BUFFER) return;

      let score = recipe.baseValue - totalCost;
      if (score <= 50) return;
      if (totalMissingUnits <= 2) score *= 1.2;
      if (gameSettings.winCondition === 'money') score *= 1.1;
      if (recipe.baseValue > 800) score *= 1.15;

      if (!bestPlan || score > bestPlan.score) {
        bestPlan = {
          score,
          purchases: missing,
          recipeName: recipe.name,
          reason: `buying missing materials for ${recipe.name}`
        };
      }
    });

    return bestPlan;
  }, [gameSettings.winCondition]);

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
    const prioritizeRegions = gameSettings.winCondition === 'regions';
    const useWinConditionAllocator = gameSettings.aiWinConditionSpendingEnabled;
    const requiredSafetyBuffer = useWinConditionAllocator && !prioritizeRegions
      ? (AI_SAFETY_BUFFER + 1200)
      : AI_SAFETY_BUFFER;
    if (aiState.money - investment.cost < requiredSafetyBuffer) {
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
    if (useWinConditionAllocator) {
      if (prioritizeRegions) {
        const regionDeposits = sanitizeRegionDeposits(gameState.regionDeposits);
        const regionSnapshot = getRegionControlSnapshot(regionDeposits[regionCode] || {});
        if (regionSnapshot.controllerId === 'player') {
          score += 65;
        } else if (!regionSnapshot.controllerId) {
          score += 45;
        } else {
          score += 12;
        }

        const surplusCash = Math.max(0, aiState.money - (AI_SAFETY_BUFFER + 1200));
        if (surplusCash > 0) {
          score += Math.min(120, Math.floor(surplusCash * 0.04));
        }

        // Late-game investments become less attractive when region control needs immediate deposits.
        if (daysRemaining <= 4) score *= 0.75;
        else score *= 1.25;
      } else {
        // Strict money mode: keep cash unless investment is clearly worth it.
        if (daysRemaining < 6) return { region: regionCode, score: -Infinity };
        if (roiValue < Math.floor(investment.cost * 0.45)) {
          return { region: regionCode, score: -Infinity };
        }
        score *= 0.35;
      }
    }
    return { region: regionCode, score, investment };
  }, [gameSettings.aiWinConditionSpendingEnabled, gameSettings.investmentsEnabled, gameSettings.totalDays, gameSettings.winCondition, gameState.day, gameState.regionDeposits]);

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

  const evaluateAiRegionControlMove = useCallback((aiState, currentState, _playerState) => {
    if (gameSettings.negotiationMode) return null;
    if (currentState.selectedMode !== 'ai') return null;

    const regionDeposits = sanitizeRegionDeposits(currentState.regionDeposits);
    const controlStats = computeRegionControlStats(regionDeposits, []);
    const aiControlled = controlStats.totalControlled.ai || 0;
    const playerControlled = controlStats.totalControlled.player || 0;
    const prioritizeRegions = gameSettings.winCondition === 'regions';
    const useWinConditionAllocator = gameSettings.aiWinConditionSpendingEnabled;
    const useRegionRush = prioritizeRegions && gameSettings.aiRegionsMajorityRushEnabled;
    const regionsNeededForMajority = Math.max(0, REGION_CONTROL_MAJORITY - aiControlled);
    const daysRemaining = Math.max(0, gameSettings.totalDays - currentState.day);
    const rushWindow = useRegionRush && (
      regionsNeededForMajority <= 3 ||
      playerControlled >= REGION_CONTROL_MAJORITY - 1 ||
      daysRemaining <= 6
    );

    const reserveBuffer = useRegionRush
      ? Math.max(180, AI_SAFETY_BUFFER - (rushWindow ? 280 : 140))
      : (useWinConditionAllocator && prioritizeRegions ? Math.max(260, AI_SAFETY_BUFFER - 160) : AI_SAFETY_BUFFER);
    const spendable = Math.floor(aiState.money - reserveBuffer);
    const surplusCash = Math.max(0, aiState.money - (AI_SAFETY_BUFFER + (prioritizeRegions ? 900 : 1800)));

    if (spendable < 1) return null;
    if (!prioritizeRegions) {
      const conservativeGate = useWinConditionAllocator ? 4000 : 1500;
      if (spendable < conservativeGate) return null;
    }

    let bestMove: { region: string; amount: number; score: number; reason: string } | null = null;

    Object.keys(REGIONS).forEach(regionCode => {
      const regionEntry = regionDeposits[regionCode] || {};
      const snapshot = getRegionControlSnapshot(regionEntry);
      const aiDeposit = Math.floor(regionEntry.ai || 0);
      const playerDeposit = Math.floor(regionEntry.player || 0);

      let score = -Infinity;
      let amount = 0;
      let reason = '';

      if (snapshot.controllerId === 'ai') {
        const stealCostForPlayer = Math.max(1, (aiDeposit + 1) - playerDeposit);
        if (prioritizeRegions && useRegionRush) {
          const defendThreshold = rushWindow ? 12 : 8;
          if (stealCostForPlayer <= defendThreshold) {
            const desiredDefenseLead = rushWindow ? 4 : 3;
            const antiHoardPad = surplusCash > 1600 ? 1 : 0;
            amount = Math.min(spendable, Math.max(1, playerDeposit + desiredDefenseLead - aiDeposit + antiHoardPad));
            score = 235 - (amount * 1.25) + (regionsNeededForMajority > 0 ? 24 : 10);
            if (rushWindow) score += 35;
            reason = `majority-rush defense in ${regionCode}; opponent could steal for $${stealCostForPlayer}`;
          }
        } else if (prioritizeRegions && stealCostForPlayer <= 5) {
          const desiredDefenseLead = useWinConditionAllocator ? 3 : 2;
          amount = Math.min(spendable, Math.max(1, playerDeposit + desiredDefenseLead - aiDeposit));
          score = (useWinConditionAllocator ? 205 : 190) - (amount * (useWinConditionAllocator ? 1.7 : 2)) + (regionsNeededForMajority > 0 ? 20 : 0);
          reason = `defending ${regionCode}; opponent could steal for $${stealCostForPlayer}`;
        } else if (!prioritizeRegions && spendable > (useWinConditionAllocator ? 4500 : 2000) && stealCostForPlayer <= 2) {
          amount = 1;
          score = useWinConditionAllocator ? 35 : 55;
          reason = `opportunistic defense in ${regionCode}`;
        }
      } else {
        const requiredAmount = getRequiredDepositToControl(regionDeposits, regionCode, 'ai');
        const aggressiveThreshold = Math.max(20, Math.floor(spendable * (rushWindow ? 0.9 : 0.75)));
        const expensiveThreshold = prioritizeRegions
          ? (useRegionRush
              ? aggressiveThreshold
              : Math.max(12, Math.floor(spendable * (useWinConditionAllocator ? 0.55 : 0.45))))
          : (useWinConditionAllocator ? 4 : 6);
        const allowEmergencyBid = useRegionRush && playerControlled >= REGION_CONTROL_MAJORITY - 1;
        const avoidBidWar = requiredAmount > expensiveThreshold && !allowEmergencyBid;

        if (!avoidBidWar && requiredAmount <= spendable) {
          let targetAmount = requiredAmount;
          if (prioritizeRegions && useWinConditionAllocator) {
            const reclaimPadding = snapshot.controllerId === 'player' ? 1 : 0;
            const surplusPadding = surplusCash > 1200
              ? Math.min(3, Math.floor((surplusCash - 1200) / 1200) + 1)
              : 0;
            targetAmount = Math.min(spendable, requiredAmount + reclaimPadding + surplusPadding);
          }
          if (useRegionRush) {
            const rushPadding = snapshot.controllerId === 'player' ? (rushWindow ? 2 : 1) : (rushWindow ? 1 : 0);
            targetAmount = Math.min(spendable, Math.max(targetAmount, requiredAmount + rushPadding));
          }
          amount = Math.max(requiredAmount, targetAmount);
          const costPenalty = prioritizeRegions
            ? (useRegionRush ? 2.1 : (useWinConditionAllocator ? 2.6 : 3))
            : 5;
          score = (prioritizeRegions ? (useRegionRush ? 255 : 215) : 80) - (amount * costPenalty);
          if (snapshot.controllerId === 'player') {
            score += prioritizeRegions ? (useRegionRush ? 48 : 35) : 10;
            reason = `${useRegionRush ? 'majority-rush: ' : ''}stealing weakly-held ${regionCode} for $${amount}`;
          } else {
            reason = `${useRegionRush ? 'majority-rush: ' : ''}claiming open ${regionCode} for $${amount}`;
          }
          if (regionsNeededForMajority > 0) score += useRegionRush ? 35 : 25;
          if (requiredAmount <= 2) score += 15;
          if (prioritizeRegions && playerControlled >= REGION_CONTROL_MAJORITY - 1) score += useRegionRush ? 45 : 25;
          if (useRegionRush && daysRemaining <= 5) score += 30;
          if (prioritizeRegions && useWinConditionAllocator && surplusCash > 0) {
            score += Math.min(65, Math.floor(surplusCash * 0.03));
          }
        }
      }

      if (amount > 0 && score > -Infinity && (!bestMove || score > bestMove.score)) {
        bestMove = {
          region: regionCode,
          amount: Math.max(1, Math.floor(amount)),
          score,
          reason
        };
      }
    });

    return bestMove;
  }, [gameSettings.aiRegionsMajorityRushEnabled, gameSettings.aiWinConditionSpendingEnabled, gameSettings.negotiationMode, gameSettings.totalDays, gameSettings.winCondition]);

  const evaluateAiCashOutMove = useCallback((aiState, currentState) => {
    if (gameSettings.negotiationMode) return null;
    if (!gameSettings.allowCashOut || currentState.selectedMode !== 'ai') return null;

    const regionDeposits = sanitizeRegionDeposits(currentState.regionDeposits);
    const controlStats = computeRegionControlStats(regionDeposits, []);
    const aiControlled = controlStats.totalControlled.ai || 0;
    const playerControlled = controlStats.totalControlled.player || 0;
    const regionsNeededForMajority = Math.max(0, REGION_CONTROL_MAJORITY - aiControlled);
    const useRegionRush = gameSettings.aiRegionsMajorityRushEnabled && gameSettings.winCondition === 'regions';
    if (useRegionRush && regionsNeededForMajority <= 1) {
      return null;
    }
    const desperateForCash = aiState.money < (AI_SAFETY_BUFFER + 150);
    const pressureInRegionRace = gameSettings.winCondition === 'regions' && aiControlled < playerControlled;

    if (!desperateForCash && !pressureInRegionRace) return null;

    let bestCashout: { region: string; refund: number; score: number; reason: string } | null = null;

    Object.keys(REGIONS).forEach(regionCode => {
      const regionEntry = regionDeposits[regionCode] || {};
      const snapshot = getRegionControlSnapshot(regionEntry);
      if (snapshot.controllerId !== 'ai') return;

      const aiDeposit = Math.floor(regionEntry.ai || 0);
      const playerDeposit = Math.floor(regionEntry.player || 0);
      const holdMargin = aiDeposit - playerDeposit;
      const refund = Math.floor(aiDeposit * 0.5);
      if (refund <= 0) return;

      let score = -Infinity;
      if (desperateForCash && aiDeposit >= 2) {
        score = refund - Math.max(0, holdMargin * 10);
      }
      if (pressureInRegionRace && holdMargin <= 2) {
        score = Math.max(score, refund + 30 - Math.max(0, holdMargin * 8));
      }

      if (score > -Infinity && (!bestCashout || score > bestCashout.score)) {
        bestCashout = {
          region: regionCode,
          refund,
          score,
          reason: `liquidating ${regionCode} to reallocate funds`
        };
      }
    });

    return bestCashout;
  }, [gameSettings.aiRegionsMajorityRushEnabled, gameSettings.allowCashOut, gameSettings.negotiationMode, gameSettings.winCondition]);

  // Main AI decision engine
  const makeAiDecision = useCallback((aiState, gameState, playerState) => {
    try {
      const difficulty = gameState.aiDifficulty;
      const profile = AI_DIFFICULTY_PROFILES[difficulty];

      // Get adaptive AI modifiers
      const adaptivePhase = gameSettings.adaptiveAiEnabled ? gameState.adaptiveAiPhase : 'normal';
      const adaptiveModifiers = ADAPTIVE_AI_MODIFIERS[adaptivePhase] || ADAPTIVE_AI_MODIFIERS.normal;
      const aggressionMultiplier = gameSettings.adaptiveAiAggressionMultiplier || 1.0;

      // Apply adaptive modifiers to profile
      const adjustedProfile = {
        ...profile,
        riskTolerance: profile.riskTolerance * adaptiveModifiers.riskTolerance * aggressionMultiplier
      };

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

	      // Strategic cash-out (only when enabled and needed)
	      const cashoutMove = evaluateAiCashOutMove(aiState, gameState);
	      if (cashoutMove) {
	        decisions.push({
	          type: 'cashout_region',
	          description: `Cash out ${REGIONS[cashoutMove.region]?.name || cashoutMove.region}`,
	          data: {
	            region: cashoutMove.region,
	            reason: cashoutMove.reason
	          },
	          score: cashoutMove.score * profile.decisionQuality
	        });
	      }

      // Evaluate special ability usage (with adaptive AI priority boost)
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
            score: abilityScore * profile.decisionQuality * adaptiveModifiers.specialAbilityPriority
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

      // Evaluate sabotage actions (with adaptive AI sabotage chance boost)
      if (gameSettings.sabotageEnabled && gameState.selectedMode === 'ai') {
        const sabotageBoost = 1 + adaptiveModifiers.sabotageChance;
        SABOTAGE_ACTIONS.forEach(action => {
          const evaluation = evaluateSabotage(action, aiState, playerState);
          if (evaluation.score > 0) {
            decisions.push({
              type: 'sabotage',
              description: `Sabotage: ${action.name}`,
              data: { sabotageId: action.id },
              score: evaluation.score * profile.decisionQuality * sabotageBoost
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
          // Apply adaptive AI challenge wager multiplier
          const adaptiveWager = Math.floor(evaluation.wager * adaptiveModifiers.challengeWagerMultiplier);
          if (evaluation.score > 0 && aiState.money >= adaptiveWager) {
            decisions.push({
              type: 'challenge',
              description: `Attempt ${challenge.name}`,
              data: {
                challenge,
                wager: adaptiveWager,
                successChance: evaluation.successChance
              },
              score: evaluation.score * profile.decisionQuality
            });
          }
        } catch (error) {
          console.error('Error evaluating challenge:', challenge, error);
        }
      });

      // Evaluate travel options (with adaptive AI travel aggression)
      Object.keys(REGIONS).forEach(region => {
        if (region !== aiState.currentRegion) {
          try {
            const evaluation = evaluateTravel(region, aiState, difficulty, gameState.resourcePrices);
            if (evaluation.score > 0) {
              decisions.push({
                type: 'travel',
                description: `Travel to ${REGIONS[region].name}`,
                data: { region, cost: evaluation.cost },
                score: evaluation.score * profile.decisionQuality * adaptiveModifiers.travelAggression
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

	      // Evaluate crafting recipes (with adaptive AI crafting focus)
	      CRAFTING_RECIPES.forEach(recipe => {
        try {
          const evaluation = evaluateCrafting(recipe, aiState, gameState.resourcePrices);
          if (evaluation.score > 0) {
            decisions.push({
              type: 'craft',
              description: `Craft ${recipe.name}`,
              data: { recipeId: recipe.id, recipe: recipe },
              score: evaluation.score * profile.decisionQuality * adaptiveModifiers.craftingFocus
            });
          }
        } catch (error) {
          console.error('Error evaluating crafting recipe:', recipe, error);
        }
	      });

	      // Evaluate market buys for crafting gaps
	      const marketPurchasePlan = evaluateAiMarketPurchase(aiState);
	      if (marketPurchasePlan) {
	        decisions.push({
	          type: 'buy_market',
	          description: `Buy materials for ${marketPurchasePlan.recipeName}`,
	          data: {
	            purchases: marketPurchasePlan.purchases,
	            recipeName: marketPurchasePlan.recipeName,
	            reason: marketPurchasePlan.reason
	          },
	          score: marketPurchasePlan.score * profile.decisionQuality
	        });
	      }

	      // Evaluate region control deposits
	      const regionMove = evaluateAiRegionControlMove(aiState, gameState, playerState);
	      if (regionMove) {
	        decisions.push({
	          type: 'region_deposit',
	          description: `Deposit $${regionMove.amount} in ${REGIONS[regionMove.region]?.name || regionMove.region}`,
	          data: {
	            region: regionMove.region,
	            amount: regionMove.amount,
	            reason: regionMove.reason
	          },
	          score: regionMove.score * profile.decisionQuality
	        });
	      }

	      // Win-condition-specific strategy weighting
	      const useWinConditionAllocator = gameSettings.aiWinConditionSpendingEnabled;
	      const useRegionRushDecision = gameSettings.aiRegionsMajorityRushEnabled && gameSettings.winCondition === 'regions';
	      decisions.forEach(decision => {
	        if (useWinConditionAllocator) {
	          if (gameSettings.winCondition === 'regions') {
	            if (decision.type === 'region_deposit') decision.score *= (useRegionRushDecision ? 2.35 : 2.05);
	            if (decision.type === 'invest') decision.score *= 1.65;
	            if (decision.type === 'cashout_region') decision.score *= 0.9;
	            if (decision.type === 'challenge' || decision.type === 'craft' || decision.type === 'sell' || decision.type === 'buy_market') {
	              decision.score *= 1.05;
	            }
	            if (decision.type === 'buy_equipment' || decision.type === 'sabotage') decision.score *= 0.78;
	          } else {
	            if (decision.type === 'region_deposit') decision.score *= 0.2;
	            if (decision.type === 'invest') decision.score *= 0.38;
	            if (decision.type === 'cashout_region') decision.score *= 1.35;
	            if (decision.type === 'challenge' || decision.type === 'craft' || decision.type === 'sell' || decision.type === 'buy_market') {
	              decision.score *= 1.15;
	            }
	            if (decision.type === 'buy_equipment') decision.score *= 0.85;
	            if (decision.type === 'sabotage') decision.score *= 0.7;
	          }
	          return;
	        }
	        if (gameSettings.winCondition === 'regions') {
	          if (decision.type === 'region_deposit') decision.score *= 1.8;
	          if (decision.type === 'cashout_region') decision.score *= 1.25;
	          if (decision.type === 'challenge' || decision.type === 'craft') decision.score *= 0.88;
	          if (decision.type === 'sell') decision.score *= 0.92;
	        } else {
	          if (decision.type === 'region_deposit') decision.score *= 0.6;
	          if (decision.type === 'cashout_region') decision.score *= 0.5;
	        }
	      });

	      // If we have good options, choose the best one
	      if (decisions.length > 0) {
        decisions.sort((a, b) => b.score - a.score);
        const bestDecision = decisions[0];
        const forceBestDecision = useRegionRushDecision &&
          (bestDecision.type === 'region_deposit' || bestDecision.type === 'cashout_region') &&
          bestDecision.score > 120;
        if (forceBestDecision) {
          return bestDecision;
        }

        // Add some randomness to make AI less predictable
        const randomPoolSize = useRegionRushDecision ? 2 : 3;
        const randomIndex = Math.floor(aiRandom() * Math.min(randomPoolSize, decisions.length));
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
	    evaluateCrafting,
	    evaluateAiMarketPurchase,
	    evaluateAiRegionControlMove,
	    evaluateAiCashOutMove,
	    evaluateSpecialAbility,
	    evaluateInvestment,
	    evaluateEquipmentPurchase,
	    evaluateSabotage,
	    gameSettings.aiSpecialAbilitiesEnabled,
	    gameSettings.aiWinConditionSpendingEnabled,
	    gameSettings.aiRegionsMajorityRushEnabled,
	    gameSettings.investmentsEnabled,
	    gameSettings.equipmentShopEnabled,
	    gameSettings.sabotageEnabled,
	    gameSettings.winCondition,
	    gameSettings.allowCashOut,
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

	      case 'craft': {
	        const recipeId = actionData.recipeId;
	        const craftRecipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
          if (!craftRecipe) {
            console.error('Invalid craft recipe:', recipeId);
            return false;
          }
          // Check if AI has materials
          for (const [resource, requiredCount] of Object.entries(craftRecipe.inputs)) {
            const availableCount = currentAi.inventory.filter(item => item === resource).length;
            if (availableCount < (requiredCount as number)) {
              return false;
            }
          }
          // Check inventory space - calculate net change after crafting
          const itemsConsumed = Object.values(craftRecipe.inputs).reduce((sum, count) => sum + (count as number), 0);
          let itemsCreated = 1; // base crafted item

          // Account for potential bonus material (character bonuses)
          const aiCraftingBonus = currentAi.character.craftingBonus;
          if (aiCraftingBonus?.effect?.bonusMaterialChance) {
            itemsCreated += 1; // Conservative: assume bonus material might be returned
          }

          const netInventoryChange = itemsCreated - itemsConsumed;

	          if (currentAi.inventory.length + netInventoryChange > MAX_INVENTORY) {
	            return false; // Not enough space for crafting result
	          }
	          break;
	        }
	        case 'buy_market': {
	          const purchases = Array.isArray(actionData.purchases) ? actionData.purchases : [];
	          if (purchases.length === 0) return false;

	          let totalCost = 0;
	          let totalUnits = 0;
	          for (const entry of purchases) {
	            if (!entry || typeof entry.resource !== 'string' || !RESOURCE_CATEGORIES[entry.resource]) {
	              return false;
	            }
	            const quantity = Math.max(1, Math.floor(Number(entry.quantity) || 0));
	            totalUnits += quantity;
	            totalCost += getResourceMarketPrice(entry.resource) * quantity;
	          }

	          if (currentAi.money - totalCost < AI_SAFETY_BUFFER) return false;
	          if ((currentAi.inventory?.length || 0) + totalUnits > MAX_INVENTORY) return false;
	          break;
	        }
	        case 'region_deposit': {
	          const region = actionData.region;
	          const amount = Math.max(1, Math.floor(Number(actionData.amount) || 0));
	          if (typeof region !== 'string' || !REGIONS[region]) return false;
	          if (currentAi.money < amount) return false;

	          const currentDeposits = sanitizeRegionDeposits(gameState.regionDeposits);
	          const regionEntry = currentDeposits[region] || {};
	          const snapshot = getRegionControlSnapshot(regionEntry);
	          const required = getRequiredDepositToControl(currentDeposits, region, 'ai');
	          if (snapshot.controllerId !== 'ai' && amount < required) return false;
	          break;
	        }
	        case 'cashout_region': {
	          if (!gameSettings.allowCashOut) return false;
	          const region = actionData.region;
	          if (typeof region !== 'string' || !REGIONS[region]) return false;
	          const currentDeposits = sanitizeRegionDeposits(gameState.regionDeposits);
	          const regionEntry = currentDeposits[region] || {};
	          const snapshot = getRegionControlSnapshot(regionEntry);
	          const aiDeposit = Math.floor(regionEntry.ai || 0);
	          if (snapshot.controllerId !== 'ai' || aiDeposit <= 0) return false;
	          break;
	        }
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
          dispatchGameState({
            type: 'ADD_CHALLENGE_COMPLETION',
            payload: {
              id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              playerId: 'ai',
              challengeName: challenge.name,
              turn: gameState.day,
              timestamp: Date.now()
            } as ChallengeCompletionLogEntry
          });

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

      case 'craft': {
        const recipeId = actionData.recipeId;
        const craftRecipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
        if (!craftRecipe) break;

        // Remove materials from inventory
        let newInventory = [...currentAi.inventory];
        for (const [resource, requiredCount] of Object.entries(craftRecipe.inputs)) {
          for (let i = 0; i < (requiredCount as number); i++) {
            const index = newInventory.findIndex(item => item === resource);
            if (index !== -1) {
              newInventory.splice(index, 1);
            }
          }
        }

        // Calculate crafting success (base 90% success rate)
        let craftSuccessChance = 0.90;

        // Apply character crafting bonus
        const craftingBonus = currentAi.character.craftingBonus;
        if (craftingBonus?.effect?.successBonus) {
          craftSuccessChance += craftingBonus.effect.successBonus;
        }

        // Roll for success
        const craftSuccess = aiRandom() < craftSuccessChance;

        if (craftSuccess) {
          // Add crafted item to inventory
          newInventory.push(craftRecipe.output);

          // Explorer bonus: chance to get materials back
          if (craftingBonus?.effect?.bonusMaterialChance && aiRandom() < craftingBonus.effect.bonusMaterialChance) {
            const materials = Object.keys(craftRecipe.inputs);
            const bonusMaterial = materials[Math.floor(aiRandom() * materials.length)];
            newInventory.push(bonusMaterial);
            addNotification(
              `🤖 ${currentAi.name} crafted ${craftRecipe.output}! (Got ${bonusMaterial} back)`,
              'ai',
              false
            );
          } else {
            addNotification(
              `🤖 ${currentAi.name} crafted ${craftRecipe.output}!`,
              'ai',
              false
            );
          }
        } else {
          addNotification(
            `🤖 ${currentAi.name}'s crafting failed! Materials were lost.`,
            'ai',
            false
          );
        }

        // Update AI inventory
	        updateAiPlayerState(prev => ({
	          ...prev,
	          inventory: newInventory
	        }));
	        break;
	      }

	      case 'buy_market': {
	        const purchases = Array.isArray(actionData.purchases) ? actionData.purchases : [];
	        const normalized = purchases
	          .filter(entry => entry && typeof entry.resource === 'string' && RESOURCE_CATEGORIES[entry.resource])
	          .map(entry => ({
	            resource: entry.resource,
	            quantity: Math.max(1, Math.floor(Number(entry.quantity) || 0))
	          }));

	        if (normalized.length === 0) return false;

	        const boughtItems: string[] = [];
	        let totalCost = 0;
	        normalized.forEach(entry => {
	          totalCost += getResourceMarketPrice(entry.resource) * entry.quantity;
	          for (let i = 0; i < entry.quantity; i += 1) {
	            boughtItems.push(entry.resource);
	          }
	        });

	        updateAiPlayerState(prev => ({
	          ...prev,
	          money: deductMoney(prev.money, totalCost),
	          inventory: [...(prev.inventory || []), ...boughtItems]
	        }));

	        const purchaseSummary = normalized.map(entry => `${entry.quantity}x ${entry.resource}`).join(', ');
	        const reason = actionData.reason ? ` (${actionData.reason})` : '';
	        addNotification(
	          `🤖 ${currentAi.name} used the Resource Market: ${purchaseSummary} for $${totalCost}.${reason}`,
	          'ai',
	          false,
	          'market'
	        );
	        break;
	      }

	      case 'region_deposit': {
	        const region = actionData.region;
	        const amount = Math.max(1, Math.floor(Number(actionData.amount) || 0));
	        const reason = typeof actionData.reason === 'string' ? actionData.reason : undefined;
	        const success = depositInRegion(region, 'ai', amount, {
	          consumeAction: false,
	          reason,
	          silent: false
	        });
	        if (!success) return false;
	        break;
	      }

	      case 'cashout_region': {
	        const region = actionData.region;
	        const reason = typeof actionData.reason === 'string' ? actionData.reason : undefined;
	        const success = cashOutRegionPosition(region, 'ai', {
	          consumeAction: false,
	          reason,
	          silent: false
	        });
	        if (!success) return false;
	        break;
	      }

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
	    gameSettings.allowCashOut,
	    gameState.resourcePrices,
	    gameState.regionDeposits,
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
    // Turn-transition subsystems run after main AI actions complete.
    handleTurnTransition('ai');
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

	      const wantsClearNotifications =
	        (gameSettings.notificationClearShortcut === 'ctrl+shift+c' && (e.ctrlKey || e.metaKey) && e.shiftKey && !e.altKey && key === 'c') ||
	        (gameSettings.notificationClearShortcut === 'ctrl+alt+c' && (e.ctrlKey || e.metaKey) && e.altKey && !e.shiftKey && key === 'c');

	      if (wantsClearNotifications) {
	        e.preventDefault();
	        clearAllNotifications();
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
	        case 'openResourceMarket':
	          if (gameState.currentTurn === 'player') {
	            updateUiState({ showResourceMarket: !uiState.showResourceMarket });
	          }
	          break;
	        case 'openWorkshop':
	          if (gameState.currentTurn === 'player') {
	            updateUiState({ showWorkshop: !uiState.showWorkshop });
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
        case 'openNegotiations': {
          const nextOpen = !uiState.showNegotiationCenter;
          setNegotiationCenterOpen(nextOpen);
          break;
        }
        case 'openNotifications':
          updateUiState({ showNotifications: !uiState.showNotifications });
          break;
	        case 'openProgress':
	          updateUiState({ showProgress: !uiState.showProgress });
	          break;
	        case 'clearNotifications':
	          clearAllNotifications();
	          break;
	        case 'toggleHelp':
	          updateUiState({ showHelp: !uiState.showHelp });
	          break;
	        case 'closeModal':
	          updateUiState({
	            showChallenges: false,
	            showMarket: false,
	            showResourceMarket: false,
	            showWorkshop: false,
	            showTravelModal: false,
	            showShop: false,
	            showInvestments: false,
	            showSabotage: false,
	            showStats: false,
	            showNotifications: false,
            showNegotiationCenter: false,
	            showProgress: false,
	            showHelp: false,
	            showAiStats: false,
	            showAdvancedLoans: false,
	            showSaveLoadModal: false,
	            showSettings: false
	          });
          updateNegotiationData({
            negotiationCenter: {
              ...(negotiationCenterRef.current || createDefaultNegotiationCenterState()),
              isOpen: false
            }
          });
	          closeConfirmation();
	          break;
	      }
	    };

	    window.addEventListener('keydown', handleKeyPress);
	    return () => window.removeEventListener('keydown', handleKeyPress);
	  }, [clearAllNotifications, gameSettings.notificationClearShortcut, gameSettings.totalDays, gameState.currentTurn, gameState.day, gameState.gameMode, handleSaveGame, uiState]);

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

    // Merge player state with defaults for backward compatibility
    const loadedPlayer = {
      ...data.player,
      advancedLoans: data.player.advancedLoans || [],
      creditScore: data.player.creditScore ?? 50,
      loanHistory: data.player.loanHistory || { totalTaken: 0, totalRepaid: 0, defaultCount: 0, earlyRepaymentCount: 0 },
      daysSinceLastBankruptcy: data.player.daysSinceLastBankruptcy ?? 0
    };

    // Merge AI player state with defaults for backward compatibility
    const loadedAiPlayer = {
      ...data.aiPlayer,
      advancedLoans: data.aiPlayer.advancedLoans || [],
      creditScore: data.aiPlayer.creditScore ?? 50,
      loanHistory: data.aiPlayer.loanHistory || { totalTaken: 0, totalRepaid: 0, defaultCount: 0, earlyRepaymentCount: 0 },
      daysSinceLastBankruptcy: data.aiPlayer.daysSinceLastBankruptcy ?? 0
    };

	    // Merge game state with defaults for backward compatibility
	    const loadedGameState = {
	      ...initialGameState,
	      ...data.gameState,
	      adaptiveAiPhase: data.gameState.adaptiveAiPhase || 'normal',
	      adaptiveAiDaysTriggered: data.gameState.adaptiveAiDaysTriggered ?? 0,
	      playerDominanceDays: data.gameState.playerDominanceDays ?? 0,
      aiPatternData: data.gameState.aiPatternData || {
        favoriteResources: {},
        preferredChallengeTypes: {},
        recentTravel: [],
        craftingFrequency: 0,
        averageChallengeWager: 0,
        riskProfile: 'moderate'
	      },
	      aiStrategyFocus: data.gameState.aiStrategyFocus || 'balanced',
	      regionDeposits: sanitizeRegionDeposits(data.gameState.regionDeposits),
	      regionControlStats: computeRegionControlStats(
	        sanitizeRegionDeposits(data.gameState.regionDeposits),
	        data.gameState.regionControlStats?.controlHistory || []
	      ),
      proposals: Array.isArray(data.gameState.proposals) ? data.gameState.proposals : [],
      negotiationCenter: {
        ...createDefaultNegotiationCenterState(),
        ...(data.gameState.negotiationCenter || {}),
        isOpen: false
      },
      negotiationLogs: Array.isArray(data.gameState.negotiationLogs) ? data.gameState.negotiationLogs : [],
      negotiationStats: {
        ...createDefaultNegotiationStats(),
        ...(data.gameState.negotiationStats || {})
      },
      challengeCompletions: Array.isArray(data.gameState.challengeCompletions) ? data.gameState.challengeCompletions : []
	    };

    dispatchPlayer({ type: 'LOAD_STATE', payload: loadedPlayer });
    dispatchGameState({ type: 'LOAD_STATE', payload: loadedGameState });
    setAiPlayer(loadedAiPlayer);
    // Merge with defaults to ensure backward compatibility with old saves
    setGameSettings({ ...DEFAULT_GAME_SETTINGS, ...data.gameSettings });
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
	      showResourceMarket: false,
	      showShop: false,
	      showInvestments: false,
	      showSabotage: false,
	      showStats: false,
	      showNotifications: false,
      showNegotiationCenter: false,
      showProgress: false,
	      showHelp: false,
	      showSettings: false,
	      showEndGameModes: false,
	      showCampaignSelect: false,
	      showAdvancedLoans: false,
	      showAiStats: false,
	      playerName: data.player.name,
	      selectedCharacter: selectedCharacterIndex >= 0 ? selectedCharacterIndex : uiState.selectedCharacter
	    });
	    setSaveDescription(data.metadata.saveDescription || '');
	    closeLoadPreview();
	    addNotification(`Loaded save from Day ${data.gameState.day}`, 'success', true, 'system');
	    const loadedVersion = parseFloat(String(data.metadata.gameVersion || "0"));
	    if (!isFinite(loadedVersion) || loadedVersion < 5) {
	      addNotification(
	        `Older save detected (${data.metadata.gameVersion || "unknown"}). Missing V5.0 fields were initialized to defaults.`,
	        'warning',
	        true,
	        'system'
	      );
	    } else if (loadedVersion < 5.1) {
	      addNotification(
	        `Older save detected (${data.metadata.gameVersion || "unknown"}). V5.1 negotiation fields were initialized to defaults.`,
	        'warning',
	        true,
	        'system'
	      );
	    }
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

  const regionControlStats = useMemo(() => {
    const deposits = sanitizeRegionDeposits(gameState.regionDeposits);
    const history = gameState.regionControlStats?.controlHistory || [];
    return computeRegionControlStats(deposits, history);
  }, [gameState.regionControlStats, gameState.regionDeposits]);

  const getRegionControlInfo = useCallback((regionCode: string, sourceDeposits?: RegionDeposits) => {
    const deposits = sanitizeRegionDeposits(sourceDeposits || gameState.regionDeposits);
    const regionEntry = deposits[regionCode] || {};
    const snapshot = getRegionControlSnapshot(regionEntry);
    return {
      regionEntry,
      entries: snapshot.entries,
      highestDeposit: snapshot.highestDeposit,
      controllerId: snapshot.controllerId,
      playerDeposit: Math.floor(regionEntry.player || 0),
      aiDeposit: Math.floor(regionEntry.ai || 0),
      minimumPlayerDeposit: getRequiredDepositToControl(deposits, regionCode, 'player'),
      minimumAiDeposit: getRequiredDepositToControl(deposits, regionCode, 'ai')
    };
  }, [gameState.regionDeposits]);

  const playerControlledRegions = regionControlStats.totalControlled.player || 0;
  const aiControlledRegions = regionControlStats.totalControlled.ai || 0;
  const playerRegionInvested = regionControlStats.totalInvested.player || 0;
  const aiRegionInvested = regionControlStats.totalInvested.ai || 0;
  const playerControlledRegionCodes = useMemo(() => {
    const deposits = sanitizeRegionDeposits(gameState.regionDeposits);
    return Object.keys(REGIONS).filter(regionCode => {
      const snapshot = getRegionControlSnapshot(deposits[regionCode] || {});
      return snapshot.controllerId === 'player';
    });
  }, [gameState.regionDeposits]);

  const winConditionLabel = gameSettings.winCondition === 'regions'
    ? `Current Goal: Control Majority (${REGION_CONTROL_MAJORITY}/${TOTAL_REGION_COUNT} regions) 🗺️`
    : 'Current Goal: Most Money 💰';

  const evaluateWinConditionOutcome = useCallback(() => {
    if (gameState.selectedMode !== 'ai') {
      return {
        playerWon: true,
        reason: 'Solo mode completed.',
        playerValue: gameSettings.winCondition === 'regions' ? playerControlledRegions : player.money,
        aiValue: 0
      };
    }

    if (gameSettings.winCondition === 'regions') {
      let playerWon = false;
      let reason = '';

      if (playerControlledRegions > aiControlledRegions) {
        playerWon = true;
        reason = `You controlled more regions (${playerControlledRegions} vs ${aiControlledRegions}).`;
      } else if (aiControlledRegions > playerControlledRegions) {
        playerWon = false;
        reason = `${aiPlayer.name} controlled more regions (${aiControlledRegions} vs ${playerControlledRegions}).`;
      } else if (player.money !== aiPlayer.money) {
        playerWon = player.money > aiPlayer.money;
        reason = `Region tie resolved by money (${player.money} vs ${aiPlayer.money}).`;
      } else {
        playerWon = true;
        reason = `Exact tie; defaulting to player victory.`;
      }

      return {
        playerWon,
        reason,
        playerValue: playerControlledRegions,
        aiValue: aiControlledRegions
      };
    }

    const playerWon = player.money >= aiPlayer.money;
    return {
      playerWon,
      reason: playerWon
        ? `You finished with more money ($${player.money} vs $${aiPlayer.money}).`
        : `${aiPlayer.name} finished with more money ($${aiPlayer.money} vs $${player.money}).`,
      playerValue: player.money,
      aiValue: aiPlayer.money
    };
  }, [aiControlledRegions, aiPlayer.money, aiPlayer.name, gameSettings.winCondition, gameState.selectedMode, player.money, playerControlledRegions]);

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

  const getControllerDisplayName = useCallback((playerId: string | null) => {
    if (playerId === 'player') return player.name || 'Player';
    if (playerId === 'ai') return aiPlayerRef.current.name || aiPlayer.name || 'AI';
    return 'Uncontrolled';
  }, [aiPlayer.name, player.name]);

  const updateRegionControlData = useCallback((
    nextDeposits: RegionDeposits,
    historyOverride?: RegionControlStats['controlHistory']
  ) => {
    const history = Array.isArray(historyOverride)
      ? historyOverride.slice(-250)
      : (regionControlHistoryRef.current || []);
    const regionControlStats = computeRegionControlStats(nextDeposits, history);
    regionDepositsRef.current = nextDeposits;
    regionControlHistoryRef.current = history;
    dispatchGameState({
      type: 'SET_REGION_CONTROL_DATA',
      payload: {
        regionDeposits: nextDeposits,
        regionControlStats
      }
    });
  }, [dispatchGameState]);

  const updateNegotiationData = useCallback((payload: {
    proposals?: Proposal[];
    negotiationCenter?: NegotiationCenterState;
    negotiationLogs?: NegotiationLogEntry[];
    negotiationStats?: NegotiationStats;
    challengeCompletions?: ChallengeCompletionLogEntry[];
  }) => {
    if (payload.proposals) proposalsRef.current = payload.proposals;
    if (payload.negotiationLogs) negotiationLogsRef.current = payload.negotiationLogs;
    if (payload.negotiationCenter) negotiationCenterRef.current = payload.negotiationCenter;
    if (payload.challengeCompletions) challengeCompletionsRef.current = payload.challengeCompletions;
    dispatchGameState({ type: 'SET_NEGOTIATION_DATA', payload });
  }, []);

  const createProposalId = useCallback(() => {
    return `proposal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  const countInventoryResource = useCallback((inventory: string[] = [], resource: string) => {
    return inventory.reduce((count, item) => count + (item === resource ? 1 : 0), 0);
  }, []);

  const consumeResourcesFromInventory = useCallback((inventory: string[] = [], requirements: Record<string, number> = {}) => {
    const nextInventory = [...inventory];
    const spent: Record<string, number> = {};
    Object.entries(requirements).forEach(([resource, rawQty]) => {
      const qty = Math.max(0, Math.floor(Number(rawQty) || 0));
      if (qty <= 0) return;
      let removed = 0;
      for (let i = nextInventory.length - 1; i >= 0 && removed < qty; i -= 1) {
        if (nextInventory[i] === resource) {
          nextInventory.splice(i, 1);
          removed += 1;
        }
      }
      if (removed > 0) {
        spent[resource] = removed;
      }
    });
    return { nextInventory, spent };
  }, []);

  const addResourcesToInventory = useCallback((inventory: string[] = [], resources: Record<string, number> = {}) => {
    const nextInventory = [...inventory];
    Object.entries(resources).forEach(([resource, rawQty]) => {
      const qty = Math.max(0, Math.floor(Number(rawQty) || 0));
      for (let i = 0; i < qty; i += 1) {
        if (nextInventory.length < MAX_INVENTORY) {
          nextInventory.push(resource);
        }
      }
    });
    return nextInventory;
  }, []);

  const getProposalTermValue = useCallback((proposal: Proposal) => {
    const cashValue = Math.max(0, Math.floor(Number(proposal.termDetails?.cashAmount) || 0));
    const resourceValue = Object.entries(proposal.termDetails?.resources || {}).reduce((sum, [resource, rawQty]) => {
      const qty = Math.max(0, Math.floor(Number(rawQty) || 0));
      return sum + (getResourceMarketPrice(resource) * qty);
    }, 0);
    const challengeValue = (proposal.termDetails?.challengeNames || []).reduce((sum, challengeName) => {
      let difficulty = 2;
      Object.values(REGIONS).forEach((region: any) => {
        const found = (region?.challenges || []).find((challenge: any) => challenge.name === challengeName);
        if (found) difficulty = Math.max(1, Math.floor(found.difficulty || 2));
      });
      return sum + (difficulty * 140);
    }, 0);
    return cashValue + resourceValue + challengeValue;
  }, []);

  const estimateRegionValue = useCallback((regionCode: string) => {
    const region = REGIONS[regionCode];
    if (!region) return 300;
    const resourceBase = (REGIONAL_RESOURCES[regionCode] || []).reduce((sum, resource) => sum + getResourceMarketPrice(resource), 0);
    const challengeBase = (region.challenges || []).reduce((sum, challenge: any) => sum + Math.floor(challenge.reward * 120), 0);
    const adjacency = (ADJACENT_REGIONS[regionCode] || []).length * 70;
    return Math.floor(220 + (resourceBase * 0.95) + (challengeBase * 0.35) + adjacency);
  }, []);

  const hasChallengeCompletionSince = useCallback((playerId: 'player' | 'ai', challengeName: string, acceptedAt?: number) => {
    const minTimestamp = typeof acceptedAt === 'number' ? acceptedAt : 0;
    return (challengeCompletionsRef.current || []).some(entry =>
      entry.playerId === playerId &&
      entry.challengeName === challengeName &&
      entry.timestamp >= minTimestamp
    );
  }, []);

  const getProposalProgress = useCallback((proposal: Proposal, actorState: any) => {
    const cashRequired = Math.max(0, Math.floor(Number(proposal.termDetails?.cashAmount) || 0));
    const cashOk = cashRequired <= 0 || actorState.money >= cashRequired;

    const resourceRequirements = proposal.termDetails?.resources || {};
    const resourceChecks = Object.entries(resourceRequirements).map(([resource, rawQty]) => {
      const requiredQty = Math.max(0, Math.floor(Number(rawQty) || 0));
      const available = countInventoryResource(actorState.inventory || [], resource);
      return {
        resource,
        requiredQty,
        available,
        ok: available >= requiredQty
      };
    });
    const resourcesOk = resourceChecks.every(check => check.ok);

    const challengeChecks = (proposal.termDetails?.challengeNames || []).map(challengeName => {
      const actorId: 'player' | 'ai' = proposal.from === 'player' ? 'player' : 'ai';
      const ok = hasChallengeCompletionSince(actorId, challengeName, proposal.acceptedAt);
      return { challengeName, ok };
    });
    const challengesOk = challengeChecks.every(check => check.ok);

    const checks = [
      cashRequired > 0 ? Number(cashOk) : 1,
      resourceChecks.length > 0 ? Number(resourcesOk) : 1,
      challengeChecks.length > 0 ? Number(challengesOk) : 1
    ];
    const relevantChecks = checks.filter((_, index) => {
      if (index === 0) return cashRequired > 0;
      if (index === 1) return resourceChecks.length > 0;
      return challengeChecks.length > 0;
    });
    const progress = relevantChecks.length > 0
      ? Math.round((relevantChecks.reduce((sum, value) => sum + value, 0) / relevantChecks.length) * 100)
      : 100;

    return {
      cashRequired,
      cashOk,
      resourceChecks,
      resourcesOk,
      challengeChecks,
      challengesOk,
      progress,
      completable: cashOk && resourcesOk && challengesOk
    };
  }, [countInventoryResource, hasChallengeCompletionSince]);

  const updatePendingProposalCount = useCallback((proposalList: Proposal[]) => {
    const pendingForPlayer = proposalList.filter(proposal => proposal.status === 'pending' && proposal.to === 'player').length;
    const nextCenter: NegotiationCenterState = {
      ...(negotiationCenterRef.current || createDefaultNegotiationCenterState()),
      pendingProposalsCount: pendingForPlayer,
      isOpen: uiState.showNegotiationCenter
    };
    updateNegotiationData({ negotiationCenter: nextCenter });
  }, [uiState.showNegotiationCenter, updateNegotiationData]);

  useEffect(() => {
    const pending = (gameState.proposals || []).filter(proposal => proposal.status === 'pending' && proposal.to === 'player').length;
    if ((gameState.negotiationCenter?.pendingProposalsCount || 0) === pending) return;
    updatePendingProposalCount(gameState.proposals || []);
  }, [gameState.negotiationCenter?.pendingProposalsCount, gameState.proposals, updatePendingProposalCount]);

  const buildNegotiationStats = useCallback((proposalList: Proposal[]): NegotiationStats => {
    const stats = createDefaultNegotiationStats();
    proposalList.forEach(proposal => {
      if (proposal.from === 'player') stats.totalSent += 1;
      if (proposal.to === 'player') stats.totalReceived += 1;
      if (proposal.status === 'accepted') stats.accepted += 1;
      if (proposal.status === 'declined') stats.declined += 1;
      if (proposal.status === 'completed') stats.completed += 1;
      if (proposal.status === 'cancelled') stats.cancelled += 1;
      const counterpart = proposal.from === 'player' ? proposal.to : proposal.from;
      const bucket = stats.byOpponent[counterpart] || {
        exchanged: 0,
        accepted: 0,
        completed: 0,
        favouriteTermType: null
      };
      bucket.exchanged += 1;
      if (proposal.status === 'accepted') bucket.accepted += 1;
      if (proposal.status === 'completed') bucket.completed += 1;
      bucket.favouriteTermType = proposal.termType;
      stats.byOpponent[counterpart] = bucket;
      if (proposal.status === 'completed' && proposal.from === 'player') {
        stats.totalCashSpent += Math.max(0, Math.floor(Number(proposal.termDetails?.cashAmount) || 0));
        Object.entries(proposal.termDetails?.resources || {}).forEach(([resource, rawQty]) => {
          const qty = Math.max(0, Math.floor(Number(rawQty) || 0));
          stats.totalResourcesSpent[resource] = (stats.totalResourcesSpent[resource] || 0) + qty;
        });
      }
    });
    return stats;
  }, []);

  const getAiNegotiationStyle = useCallback((aiState: any) => {
    const strategy = aiState?.character?.aiStrategy || 'balanced';
    if (strategy === 'challenge-focused') {
      return { key: 'aggressive', label: 'Aggressive', proposalVolume: 0.9, riskTolerance: 0.65 };
    }
    if (strategy === 'exploration-focused') {
      return { key: 'defensive', label: 'Defensive', proposalVolume: 0.45, riskTolerance: 0.35 };
    }
    if (strategy === 'money-focused') {
      return { key: 'economic', label: 'Economic', proposalVolume: 0.6, riskTolerance: 0.4 };
    }
    return { key: 'balanced', label: 'Balanced', proposalVolume: 0.55, riskTolerance: 0.5 };
  }, []);

  const evaluateIncomingProposalForAi = useCallback((proposal: Proposal, aiState: any, currentDeposits: RegionDeposits) => {
    const style = getAiNegotiationStyle(aiState);
    const offerValue = getProposalTermValue(proposal);
    const regionValue = estimateRegionValue(proposal.region);
    const snapshot = getRegionControlSnapshot((currentDeposits || {})[proposal.region] || {});
    const currentlyAiControlled = snapshot.controllerId === 'ai';
    const affordability = getProposalProgress(proposal, aiState);
    const isAffordable = affordability.completable || proposal.termType === 'custom';
    const valueRatio = regionValue > 0 ? (offerValue / regionValue) : 0;
    const aiControlCount = computeRegionControlStats(currentDeposits, []).totalControlled.ai || 0;
    const needsMoreRegions = aiControlCount < REGION_CONTROL_MAJORITY;

    let acceptThreshold = gameSettings.winCondition === 'regions' ? 0.55 : 0.8;
    if (style.key === 'aggressive') acceptThreshold -= 0.1;
    if (style.key === 'defensive') acceptThreshold += 0.12;
    if (style.key === 'economic') acceptThreshold += 0.08;
    if (gameSettings.winCondition === 'regions' && needsMoreRegions) acceptThreshold -= 0.08;
    if (currentlyAiControlled) acceptThreshold += 0.16;

    const shouldAccept = isAffordable && valueRatio >= acceptThreshold;
    const shouldCounter = !shouldAccept && gameSettings.negotiationOptions.suggestCounterOffers && valueRatio >= acceptThreshold * 0.65;
    const targetOfferRatio = Math.max(0.35, acceptThreshold);
    const suggestedCash = Math.max(80, Math.floor(regionValue * targetOfferRatio));

    return {
      shouldAccept,
      shouldCounter,
      suggestedCash,
      reasoning: [
        `Strategic value: $${regionValue}`,
        `Offered terms value: $${offerValue}`,
        `Value ratio: ${(valueRatio * 100).toFixed(1)}%`,
        `AI style: ${style.label}`,
        `Win condition: ${gameSettings.winCondition === 'regions' ? 'Most Regions' : 'Most Money'}`,
        `Affordability: ${isAffordable ? 'CAN COMPLETE' : 'CANNOT COMPLETE'}`
      ].join(' | ')
    };
  }, [estimateRegionValue, gameSettings.negotiationOptions.suggestCounterOffers, gameSettings.winCondition, getAiNegotiationStyle, getProposalProgress, getProposalTermValue]);

  const buildAiCounterProposal = useCallback((original: Proposal, aiState: any, suggestedCash: number): Proposal => {
    const counterCash = Math.max(50, suggestedCash);
    return {
      id: createProposalId(),
      from: 'ai',
      to: original.from,
      region: original.region,
      status: 'pending',
      termType: 'cash',
      termDetails: {
        cashAmount: counterCash
      },
      timestamp: Date.now(),
      aiReasoning: `Counter generated by ${aiState.name || 'AI'}: ${REGIONS[original.region]?.name || original.region} requires stronger compensation.`,
      counterProposalOf: original.id
    };
  }, [createProposalId]);

  const buildAiProposal = useCallback((aiState: any, currentDeposits: RegionDeposits) => {
    if (gameState.selectedMode !== 'ai') return null;
    const style = getAiNegotiationStyle(aiState);
    const controlStats = computeRegionControlStats(currentDeposits, []);
    const aiControlled = controlStats.totalControlled.ai || 0;
    const playerControlled = controlStats.totalControlled.player || 0;
    const behindInRegions = aiControlled < playerControlled;
    const maxPendingByAi = gameSettings.winCondition === 'regions' && behindInRegions ? 2 : 1;
    const pendingByAi = (proposalsRef.current || []).filter(proposal => proposal.status === 'pending' && proposal.from === 'ai').length;
    if (pendingByAi >= maxPendingByAi) return null;
    if (Math.random() > style.proposalVolume) return null;

    const candidateRegions = Object.keys(REGIONS)
      .map(regionCode => {
        const snapshot = getRegionControlSnapshot((currentDeposits || {})[regionCode] || {});
        const controlledByAi = snapshot.controllerId === 'ai';
        return {
          regionCode,
          snapshot,
          value: estimateRegionValue(regionCode),
          priority: controlledByAi ? -1000 : (snapshot.controllerId === 'player' ? 100 : 60) + ((ADJACENT_REGIONS[regionCode] || []).length * 8)
        };
      })
      .filter(candidate => candidate.priority > 0)
      .sort((a, b) => (b.priority + b.value * 0.01) - (a.priority + a.value * 0.01));

    const best = candidateRegions[0];
    if (!best) return null;

    const baseCash = Math.max(90, Math.floor(best.value * (gameSettings.winCondition === 'regions' ? 0.55 : 0.35)));
    const aiInventory = Array.isArray(aiState.inventory) ? aiState.inventory : [];
    const resourceCounts: Record<string, number> = {};
    aiInventory.forEach((resource: string) => {
      resourceCounts[resource] = (resourceCounts[resource] || 0) + 1;
    });
    const bestResource = Object.keys(resourceCounts)
      .sort((a, b) => (getResourceMarketPrice(b) * resourceCounts[b]) - (getResourceMarketPrice(a) * resourceCounts[a]))[0];

    let termType: ProposalTermType = 'cash';
    const termDetails: Proposal['termDetails'] = {};

    if (style.key === 'defensive') {
      termType = 'quest';
      const easiestChallenge = (REGIONS[best.regionCode]?.challenges || [])
        .slice()
        .sort((a: any, b: any) => a.difficulty - b.difficulty)[0];
      termDetails.challengeNames = easiestChallenge ? [easiestChallenge.name] : [];
    } else if (style.key === 'economic' && bestResource) {
      termType = 'resources';
      termDetails.resources = { [bestResource]: Math.min(2, resourceCounts[bestResource]) };
      if (!termDetails.resources[bestResource]) {
        termType = 'cash';
        termDetails.cashAmount = baseCash;
      }
    } else if (style.key === 'balanced' && bestResource) {
      termType = 'hybrid';
      termDetails.cashAmount = Math.floor(baseCash * 0.65);
      termDetails.resources = { [bestResource]: 1 };
    } else {
      termType = 'cash';
      termDetails.cashAmount = baseCash;
    }

    if (!termDetails.cashAmount && (termType === 'cash' || termType === 'hybrid')) {
      termDetails.cashAmount = baseCash;
    }

    return {
      id: createProposalId(),
      from: 'ai',
      to: 'player',
      region: best.regionCode,
      status: 'pending' as ProposalStatus,
      termType,
      termDetails,
      timestamp: Date.now(),
      aiReasoning: `${aiState.name || 'AI'} proposes to secure ${REGIONS[best.regionCode]?.name || best.regionCode} (${style.label} style, ${gameSettings.winCondition === 'regions' ? 'regions focus' : 'ROI focus'}).`
    } as Proposal;
  }, [createProposalId, estimateRegionValue, gameSettings.winCondition, gameState.selectedMode, getAiNegotiationStyle]);

  const completeProposal = useCallback((
    proposal: Proposal,
    workingPlayer: any,
    workingAi: any,
    workingDeposits: RegionDeposits,
    workingHistory: RegionControlStats['controlHistory'],
    options?: { manual?: boolean; silent?: boolean }
  ) => {
    const actorId = proposal.from === 'ai' ? 'ai' : 'player';
    const receiverId = actorId === 'player' ? 'ai' : 'player';
    const actorState = actorId === 'player' ? workingPlayer : workingAi;
    const receiverState = receiverId === 'player' ? workingPlayer : workingAi;
    const progress = getProposalProgress(proposal, actorState);
    if (!progress.completable && proposal.termType !== 'custom') {
      return {
        success: false,
        reason: 'Requirements not met',
        proposal,
        playerState: workingPlayer,
        aiState: workingAi,
        deposits: workingDeposits,
        history: workingHistory
      };
    }

    const manual = Boolean(options?.manual);
    const expensive = progress.cashRequired > 500;
    if (
      actorId === 'player' &&
      !manual &&
      gameSettings.negotiationOptions.confirmExpensiveTasks &&
      expensive &&
      !gameSettings.negotiationOptions.autoCompleteReadyTasks
    ) {
      return {
        success: false,
        reason: 'Confirmation required for expensive task',
        proposal,
        playerState: workingPlayer,
        aiState: workingAi,
        deposits: workingDeposits,
        history: workingHistory
      };
    }

    let nextActor = { ...actorState };
    let nextReceiver = { ...receiverState };
    const cashAmount = Math.max(0, Math.floor(Number(proposal.termDetails?.cashAmount) || 0));
    if (cashAmount > 0) {
      nextActor.money = deductMoney(nextActor.money, cashAmount);
      nextReceiver.money = addMoney(nextReceiver.money, cashAmount);
    }

    const resourcesToTransfer = proposal.termDetails?.resources || {};
    if (Object.keys(resourcesToTransfer).length > 0) {
      const consumed = consumeResourcesFromInventory(nextActor.inventory || [], resourcesToTransfer);
      nextActor.inventory = consumed.nextInventory;
      nextReceiver.inventory = addResourcesToInventory(nextReceiver.inventory || [], consumed.spent);
    }

    const nextDeposits = sanitizeRegionDeposits(workingDeposits);
    const regionEntry = { ...(nextDeposits[proposal.region] || {}) };
    const beforeSnapshot = getRegionControlSnapshot(regionEntry);
    const highestDeposit = beforeSnapshot.highestDeposit;
    regionEntry[actorId] = Math.max(Math.floor(regionEntry[actorId] || 0), highestDeposit + 1);
    nextDeposits[proposal.region] = regionEntry;
    const afterSnapshot = getRegionControlSnapshot(regionEntry);

    let nextHistory = [...(workingHistory || [])];
    if (beforeSnapshot.controllerId !== afterSnapshot.controllerId) {
      nextHistory = [
        ...nextHistory,
        {
          turn: gameState.day,
          region: proposal.region,
          fromPlayer: beforeSnapshot.controllerId || 'none',
          toPlayer: afterSnapshot.controllerId || 'none',
          method: 'proposal' as const
        }
      ].slice(-250);
    }

    const completedProposal: Proposal = {
      ...proposal,
      status: 'completed',
      completedAt: Date.now()
    };

    if (!options?.silent) {
      addNotification(
        `${getControllerDisplayName(actorId)} completed a proposal and gained ${REGIONS[proposal.region]?.name || proposal.region}.`,
        actorId === 'player' ? 'success' : 'ai',
        true,
        'proposal_completed'
      );
      addNotification(
        `Proposal terms settled: $${cashAmount}${Object.keys(resourcesToTransfer).length > 0 ? ' + resources' : ''}.`,
        'info',
        false,
        'task_completion'
      );
    }

    return {
      success: true,
      proposal: completedProposal,
      reason: 'Completed',
      playerState: actorId === 'player' ? nextActor : (receiverId === 'player' ? nextReceiver : workingPlayer),
      aiState: actorId === 'ai' ? nextActor : (receiverId === 'ai' ? nextReceiver : workingAi),
      deposits: nextDeposits,
      history: nextHistory
    };
  }, [
    addMoney,
    addNotification,
    addResourcesToInventory,
    consumeResourcesFromInventory,
    deductMoney,
    gameSettings.negotiationOptions.autoCompleteReadyTasks,
    gameSettings.negotiationOptions.confirmExpensiveTasks,
    gameState.day,
    getControllerDisplayName,
    getProposalProgress
  ]);

  const handleTurnTransition = useCallback((_sourcePlayer: 'player' | 'ai') => {
    if (!gameSettings.negotiationMode || gameState.selectedMode !== 'ai') {
      updatePendingProposalCount(proposalsRef.current || []);
      return;
    }

    let proposals = [...(proposalsRef.current || [])];
    let logs = [...(negotiationLogsRef.current || [])];
    let workingPlayer = { ...player };
    let workingAi = { ...aiPlayerRef.current };
    let workingDeposits = sanitizeRegionDeposits(regionDepositsRef.current);
    let workingHistory = [...(regionControlHistoryRef.current || [])];
    const now = Date.now();

    const pushLog = (entry: Omit<NegotiationLogEntry, 'id' | 'turn' | 'timestamp'>) => {
      logs.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        turn: gameState.day,
        timestamp: Date.now(),
        ...entry
      });
      if (logs.length > 1000) {
        logs = logs.slice(-1000);
      }
    };

    // Subsystem A: Negotiation Evaluation
    const incomingForAi = proposals.filter(proposal => proposal.status === 'pending' && proposal.to === 'ai');
    incomingForAi.forEach(incoming => {
      const evaluation = evaluateIncomingProposalForAi(incoming, workingAi, workingDeposits);
      if (evaluation.shouldAccept) {
        proposals = proposals.map(proposal => proposal.id === incoming.id
          ? {
            ...proposal,
            status: 'accepted',
            acceptedAt: now,
            aiReasoning: evaluation.reasoning
          }
          : proposal
        );
        pushLog({
          eventType: 'proposal_accepted',
          proposalId: incoming.id,
          from: incoming.from,
          to: incoming.to,
          region: incoming.region,
          details: `AI accepted proposal for ${REGIONS[incoming.region]?.name || incoming.region}.`,
          reasoning: evaluation.reasoning
        });
        addNotification(`🤖 ${workingAi.name} accepted your proposal for ${REGIONS[incoming.region]?.name || incoming.region}.`, 'ai', false, 'proposal_accepted');
      } else {
        proposals = proposals.map(proposal => proposal.id === incoming.id
          ? {
            ...proposal,
            status: 'declined',
            aiReasoning: evaluation.reasoning
          }
          : proposal
        );
        pushLog({
          eventType: 'proposal_declined',
          proposalId: incoming.id,
          from: incoming.from,
          to: incoming.to,
          region: incoming.region,
          details: `AI declined proposal for ${REGIONS[incoming.region]?.name || incoming.region}.`,
          reasoning: evaluation.reasoning
        });
        addNotification(`🤖 ${workingAi.name} declined your proposal for ${REGIONS[incoming.region]?.name || incoming.region}.`, 'ai', false, 'proposal_declined');

        if (evaluation.shouldCounter) {
          const counter = buildAiCounterProposal(incoming, workingAi, evaluation.suggestedCash);
          proposals.push(counter);
          pushLog({
            eventType: 'counter_proposal',
            proposalId: counter.id,
            from: counter.from,
            to: counter.to,
            region: counter.region,
            details: `AI generated a counter-proposal.`,
            reasoning: counter.aiReasoning
          });
          addNotification(`🤖 ${workingAi.name} sent a counter-proposal for ${REGIONS[counter.region]?.name || counter.region}.`, 'info', true, 'counter_proposal');
        }
      }
    });

    const generatedProposal = buildAiProposal(workingAi, workingDeposits);
    if (generatedProposal) {
      proposals.push(generatedProposal);
      pushLog({
        eventType: 'proposal_sent',
        proposalId: generatedProposal.id,
        from: generatedProposal.from,
        to: generatedProposal.to,
        region: generatedProposal.region,
        details: `AI sent proposal for ${REGIONS[generatedProposal.region]?.name || generatedProposal.region}.`,
        reasoning: generatedProposal.aiReasoning
      });
      pushLog({
        eventType: 'proposal_received',
        proposalId: generatedProposal.id,
        from: generatedProposal.from,
        to: generatedProposal.to,
        region: generatedProposal.region,
        details: `Player received a proposal from AI.`
      });
      addNotification(`New proposal from ${workingAi.name}: ${REGIONS[generatedProposal.region]?.name || generatedProposal.region}.`, 'info', true, 'proposal_received');
    }

    const activeAiProposals = proposals.filter(proposal => proposal.status === 'accepted' && proposal.from === 'ai');
    activeAiProposals.forEach(activeProposal => {
      const valuation = getProposalTermValue(activeProposal);
      const regionValue = estimateRegionValue(activeProposal.region);
      const ratio = regionValue > 0 ? valuation / regionValue : 0;
      if (gameSettings.winCondition === 'money' && ratio > 1.25) {
        proposals = proposals.map(proposal => proposal.id === activeProposal.id
          ? { ...proposal, status: 'cancelled', cancelledAt: Date.now(), aiReasoning: 'Cancelled: terms no longer cost-effective for money win condition.' }
          : proposal
        );
        pushLog({
          eventType: 'proposal_cancelled',
          proposalId: activeProposal.id,
          from: activeProposal.from,
          to: activeProposal.to,
          region: activeProposal.region,
          details: `AI cancelled an active proposal due to strategic re-evaluation.`,
          reasoning: 'Cost exceeded current value target.'
        });
      }
    });

    const incomingForPlayer = proposals.filter(proposal => proposal.status === 'pending' && proposal.to === 'player');
    incomingForPlayer.forEach(incoming => {
      const autoAcceptFrom = (gameSettings.negotiationOptions.alwaysAutoAcceptFrom || []).includes(incoming.from);
      const termValue = getProposalTermValue(incoming);
      const regionValue = estimateRegionValue(incoming.region);
      const favorable = termValue >= Math.floor(regionValue * 0.7);
      if (autoAcceptFrom || (gameSettings.negotiationOptions.autoAcceptCashUnder > 0 && incoming.termType === 'cash' && Math.floor(Number(incoming.termDetails.cashAmount) || 0) <= gameSettings.negotiationOptions.autoAcceptCashUnder && favorable)) {
        proposals = proposals.map(proposal => proposal.id === incoming.id
          ? { ...proposal, status: 'accepted', acceptedAt: now }
          : proposal
        );
        pushLog({
          eventType: 'proposal_accepted',
          proposalId: incoming.id,
          from: incoming.from,
          to: incoming.to,
          region: incoming.region,
          details: `Auto-accepted by player rule.`
        });
        addNotification(`Auto-accepted proposal for ${REGIONS[incoming.region]?.name || incoming.region}.`, 'success', false, 'proposal_accepted');
      }
    });

    // Subsystem B: Task Completion
    const activeAccepted = proposals.filter(proposal => proposal.status === 'accepted');
    activeAccepted.forEach(activeProposal => {
      const actorId = activeProposal.from === 'ai' ? 'ai' : 'player';
      const actorState = actorId === 'player' ? workingPlayer : workingAi;
      const progress = getProposalProgress(activeProposal, actorState);
      if (progress.completable || activeProposal.termType === 'custom') {
        const completionResult = completeProposal(
          activeProposal,
          workingPlayer,
          workingAi,
          workingDeposits,
          workingHistory,
          {
            manual: false,
            silent: false
          }
        );
        if (completionResult.success) {
          proposals = proposals.map(proposal => proposal.id === activeProposal.id ? completionResult.proposal : proposal);
          workingPlayer = completionResult.playerState;
          workingAi = completionResult.aiState;
          workingDeposits = completionResult.deposits;
          workingHistory = completionResult.history;
          pushLog({
            eventType: 'proposal_completed',
            proposalId: activeProposal.id,
            from: activeProposal.from,
            to: activeProposal.to,
            region: activeProposal.region,
            details: `Proposal completed and region transferred.`
          });
        } else {
          pushLog({
            eventType: 'task_pending',
            proposalId: activeProposal.id,
            from: activeProposal.from,
            to: activeProposal.to,
            region: activeProposal.region,
            details: completionResult.reason || 'Task pending'
          });
        }
      } else if (actorId === 'player') {
        addNotification(`Proposal for ${REGIONS[activeProposal.region]?.name || activeProposal.region} is still pending requirements.`, 'info', false, 'task_completion');
      }
    });

    // Subsystem C: Cleanup/Bookkeeping
    if (gameSettings.negotiationOptions.proposalExpirationTurns > 0) {
      const maxAge = gameSettings.negotiationOptions.proposalExpirationTurns * 24 * 60 * 60 * 1000;
      proposals = proposals.map(proposal => {
        if (proposal.status !== 'pending') return proposal;
        if ((Date.now() - proposal.timestamp) > maxAge) {
          pushLog({
            eventType: 'proposal_cancelled',
            proposalId: proposal.id,
            from: proposal.from,
            to: proposal.to,
            region: proposal.region,
            details: `Proposal expired and was auto-cancelled.`
          });
          return { ...proposal, status: 'cancelled', cancelledAt: Date.now() };
        }
        return proposal;
      });
    }

    if (workingPlayer.money !== player.money || workingPlayer.inventory !== player.inventory) {
      dispatchPlayer({ type: 'MERGE_STATE', payload: { money: workingPlayer.money, inventory: workingPlayer.inventory } });
    }
    if (workingAi.money !== aiPlayerRef.current.money || workingAi.inventory !== aiPlayerRef.current.inventory) {
      updateAiPlayerState(prev => ({
        ...prev,
        money: workingAi.money,
        inventory: workingAi.inventory
      }));
    }

    updateRegionControlData(workingDeposits, workingHistory);

    const nextCenter: NegotiationCenterState = {
      ...(negotiationCenterRef.current || createDefaultNegotiationCenterState()),
      pendingProposalsCount: proposals.filter(proposal => proposal.status === 'pending' && proposal.to === 'player').length,
      isOpen: uiState.showNegotiationCenter
    };
    updateNegotiationData({
      proposals,
      negotiationLogs: logs,
      negotiationCenter: nextCenter,
      negotiationStats: buildNegotiationStats(proposals)
    });
  }, [
    addNotification,
    buildAiCounterProposal,
    buildAiProposal,
    buildNegotiationStats,
    completeProposal,
    estimateRegionValue,
    evaluateIncomingProposalForAi,
    gameSettings.negotiationMode,
    gameSettings.negotiationOptions.alwaysAutoAcceptFrom,
    gameSettings.negotiationOptions.autoAcceptCashUnder,
    gameSettings.negotiationOptions.autoCompleteReadyTasks,
    gameSettings.negotiationOptions.proposalExpirationTurns,
    gameSettings.winCondition,
    gameState.day,
    gameState.selectedMode,
    getProposalProgress,
    getProposalTermValue,
    player,
    uiState.showNegotiationCenter,
    updateAiPlayerState,
    updateNegotiationData,
    updatePendingProposalCount,
    updateRegionControlData
  ]);

  const createProposal = useCallback((payload: {
    to: string;
    region: string;
    termType: ProposalTermType;
    termDetails: Proposal['termDetails'];
    customText?: string;
  }) => {
    if (!gameSettings.negotiationMode) {
      addNotification('Negotiation mode is disabled. Enable it in Settings to create proposals.', 'warning', false, 'system');
      return false;
    }
    if (gameState.selectedMode !== 'ai') {
      addNotification('Negotiations are available in AI mode only.', 'warning', false, 'system');
      return false;
    }
    if (!REGIONS[payload.region]) {
      addNotification('Select a valid region for the proposal.', 'warning', false, 'system');
      return false;
    }
    if (payload.to !== 'ai' && payload.to !== 'player') {
      addNotification('Select a valid proposal target.', 'warning', false, 'system');
      return false;
    }
    const proposal: Proposal = {
      id: createProposalId(),
      from: 'player',
      to: payload.to,
      region: payload.region,
      status: 'pending',
      termType: payload.termType,
      termDetails: {
        ...payload.termDetails,
        customText: payload.customText
      },
      timestamp: Date.now()
    };
    const proposals = [...(proposalsRef.current || []), proposal];
    const logs = [
      ...(negotiationLogsRef.current || []),
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        turn: gameState.day,
        timestamp: Date.now(),
        eventType: 'proposal_sent' as const,
        proposalId: proposal.id,
        from: proposal.from,
        to: proposal.to,
        region: proposal.region,
        details: `Player sent proposal for ${REGIONS[proposal.region]?.name || proposal.region}.`,
        reasoning: proposal.aiReasoning
      },
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        turn: gameState.day,
        timestamp: Date.now(),
        eventType: 'proposal_received' as const,
        proposalId: proposal.id,
        from: proposal.from,
        to: proposal.to,
        region: proposal.region,
        details: `${getControllerDisplayName(proposal.to)} received a proposal.`
      }
    ].slice(-1000);
    const nextCenter: NegotiationCenterState = {
      ...(negotiationCenterRef.current || createDefaultNegotiationCenterState()),
      draftProposal: {},
      pendingProposalsCount: proposals.filter(item => item.status === 'pending' && item.to === 'player').length
    };
    updateNegotiationData({
      proposals,
      negotiationLogs: logs,
      negotiationCenter: nextCenter,
      negotiationStats: buildNegotiationStats(proposals)
    });
    addNotification(`Proposal sent to ${payload.to === 'ai' ? aiPlayerRef.current.name : player.name}.`, 'success', false, 'system');
    return true;
  }, [addNotification, buildNegotiationStats, createProposalId, gameSettings.negotiationMode, gameState.day, gameState.selectedMode, getControllerDisplayName, player.name, updateNegotiationData]);

  const respondToProposal = useCallback((proposalId: string, action: 'accept' | 'decline') => {
    const proposal = (proposalsRef.current || []).find(candidate => candidate.id === proposalId);
    if (!proposal || proposal.status !== 'pending') return;
    const proposals = (proposalsRef.current || []).map(candidate => {
      if (candidate.id !== proposalId) return candidate;
      if (action === 'accept') {
        return { ...candidate, status: 'accepted', acceptedAt: Date.now() };
      }
      return { ...candidate, status: 'declined' };
    });
    const logs = [
      ...(negotiationLogsRef.current || []),
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        turn: gameState.day,
        timestamp: Date.now(),
        eventType: action === 'accept' ? 'proposal_accepted' : 'proposal_declined',
        proposalId: proposal.id,
        from: proposal.from,
        to: proposal.to,
        region: proposal.region,
        details: `Player ${action}ed proposal for ${REGIONS[proposal.region]?.name || proposal.region}.`
      }
    ].slice(-1000);
    updateNegotiationData({
      proposals,
      negotiationLogs: logs,
      negotiationStats: buildNegotiationStats(proposals)
    });
    updatePendingProposalCount(proposals);
    const verb = action === 'accept' ? 'accepted' : 'declined';
    addNotification(`Proposal ${verb}.`, action === 'accept' ? 'success' : 'warning', false, action === 'accept' ? 'proposal_accepted' : 'proposal_declined');
  }, [addNotification, buildNegotiationStats, gameState.day, updateNegotiationData, updatePendingProposalCount]);

  const cancelProposal = useCallback((proposalId: string) => {
    const proposal = (proposalsRef.current || []).find(candidate => candidate.id === proposalId);
    if (!proposal || !['pending', 'accepted'].includes(proposal.status)) return;
    if (gameSettings.negotiationOptions.confirmCancelProposal && !window.confirm('Cancel this proposal?')) {
      return;
    }
    const proposals = (proposalsRef.current || []).map(candidate =>
      candidate.id === proposalId
        ? { ...candidate, status: 'cancelled', cancelledAt: Date.now() }
        : candidate
    );
    const logs = [
      ...(negotiationLogsRef.current || []),
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        turn: gameState.day,
        timestamp: Date.now(),
        eventType: 'proposal_cancelled' as const,
        proposalId: proposal.id,
        from: proposal.from,
        to: proposal.to,
        region: proposal.region,
        details: `Proposal cancelled.`
      }
    ].slice(-1000);
    updateNegotiationData({
      proposals,
      negotiationLogs: logs,
      negotiationStats: buildNegotiationStats(proposals)
    });
    updatePendingProposalCount(proposals);
    addNotification('Proposal cancelled.', 'warning', false, 'system');
  }, [addNotification, buildNegotiationStats, gameSettings.negotiationOptions.confirmCancelProposal, gameState.day, updateNegotiationData, updatePendingProposalCount]);

  const completeProposalManually = useCallback((proposalId: string) => {
    const proposal = (proposalsRef.current || []).find(candidate => candidate.id === proposalId && candidate.status === 'accepted');
    if (!proposal) return;

    const result = completeProposal(
      proposal,
      { ...player },
      { ...aiPlayerRef.current },
      sanitizeRegionDeposits(regionDepositsRef.current),
      [...(regionControlHistoryRef.current || [])],
      { manual: true, silent: false }
    );
    if (!result.success) {
      addNotification(result.reason || 'Proposal is not ready to complete.', 'warning', false, 'task_completion');
      return;
    }

    const proposals = (proposalsRef.current || []).map(candidate => candidate.id === proposal.id ? result.proposal : candidate);
    const logs = [
      ...(negotiationLogsRef.current || []),
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        turn: gameState.day,
        timestamp: Date.now(),
        eventType: 'proposal_completed' as const,
        proposalId: proposal.id,
        from: proposal.from,
        to: proposal.to,
        region: proposal.region,
        details: `Proposal manually completed.`
      }
    ].slice(-1000);

    dispatchPlayer({ type: 'MERGE_STATE', payload: { money: result.playerState.money, inventory: result.playerState.inventory } });
    updateAiPlayerState(prev => ({
      ...prev,
      money: result.aiState.money,
      inventory: result.aiState.inventory
    }));
    updateRegionControlData(result.deposits, result.history);
    updateNegotiationData({
      proposals,
      negotiationLogs: logs,
      negotiationStats: buildNegotiationStats(proposals)
    });
    updatePendingProposalCount(proposals);
  }, [
    addNotification,
    buildNegotiationStats,
    completeProposal,
    gameState.day,
    player,
    updateAiPlayerState,
    updateNegotiationData,
    updatePendingProposalCount,
    updateRegionControlData
  ]);

  const setNegotiationCenterOpen = useCallback((isOpen: boolean) => {
    updateUiState({ showNegotiationCenter: isOpen });
    updateNegotiationData({
      negotiationCenter: {
        ...(negotiationCenterRef.current || createDefaultNegotiationCenterState()),
        isOpen
      }
    });
  }, [updateNegotiationData, updateUiState]);

  const setNegotiationCenterTab = useCallback((tab: NegotiationCenterState['activeTab']) => {
    updateNegotiationData({
      negotiationCenter: {
        ...(negotiationCenterRef.current || createDefaultNegotiationCenterState()),
        activeTab: tab,
        isOpen: true
      }
    });
  }, [updateNegotiationData]);

  const updateNegotiationDraft = useCallback((updates: Partial<Proposal>) => {
    const currentCenter = negotiationCenterRef.current || createDefaultNegotiationCenterState();
    updateNegotiationData({
      negotiationCenter: {
        ...currentCenter,
        draftProposal: {
          ...(currentCenter.draftProposal || {}),
          ...updates
        }
      }
    });
  }, [updateNegotiationData]);

  const exportNegotiationLogs = useCallback((aiOnly: boolean) => {
    const logs = (negotiationLogsRef.current || [])
      .filter(entry => !aiOnly || (entry.from === 'ai' || entry.to === 'ai' || entry.eventType === 'counter_proposal'))
      .map(entry => {
        return `Turn ${entry.turn} | ${new Date(entry.timestamp).toLocaleString()} | ${entry.eventType} | ${entry.from} -> ${entry.to} | ${entry.region}\n${entry.details}${entry.reasoning ? `\nReasoning: ${entry.reasoning}` : ''}`;
      })
      .join('\n\n');
    const blob = new Blob([logs || 'No logs available.'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = aiOnly ? 'negotiation-ai-decisions.txt' : 'negotiation-log.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, []);

  const depositInRegion = useCallback((
    regionCode: string,
    actorId: 'player' | 'ai',
    rawAmount: number,
    options?: { consumeAction?: boolean; reason?: string; silent?: boolean }
  ) => {
    if (!REGIONS[regionCode]) return false;
    if (gameSettings.negotiationMode) {
      if (actorId === 'player' && !options?.silent) {
        addNotification('Negotiation mode is enabled. Region deposits are disabled; use Negotiations instead.', 'warning', false, 'system');
      }
      return false;
    }

    const amount = Math.max(1, Math.floor(Number(rawAmount) || 0));
    const actorState = actorId === 'player' ? player : aiPlayerRef.current;
    if ((actorState.money || 0) < amount) {
      if (!options?.silent) {
        const prefix = actorId === 'player' ? '' : '🤖 ';
        addNotification(`${prefix}${actorState.name} cannot afford a $${amount} region deposit.`, actorId === 'player' ? 'error' : 'ai', false, 'deposit');
      }
      return false;
    }

    const currentDeposits = sanitizeRegionDeposits(regionDepositsRef.current);
    const regionEntry = { ...(currentDeposits[regionCode] || {}) };
    const beforeSnapshot = getRegionControlSnapshot(regionEntry);
    const requiredToTake = getRequiredDepositToControl(currentDeposits, regionCode, actorId);
    const isDefending = beforeSnapshot.controllerId === actorId;
    if (!isDefending && amount < requiredToTake) {
      if (!options?.silent) {
        const actorLabel = actorId === 'player' ? 'You need' : `🤖 ${actorState.name} needs`;
        addNotification(`${actorLabel} at least $${requiredToTake} to take control of ${REGIONS[regionCode].name}.`, 'warning', false, 'deposit');
      }
      return false;
    }

    if (actorId === 'player') {
      dispatchPlayer({ type: 'UPDATE_MONEY', payload: -amount });
    } else {
      updateAiPlayerState(prev => ({ ...prev, money: deductMoney(prev.money, amount) }));
    }

    regionEntry[actorId] = Math.max(0, Math.floor(regionEntry[actorId] || 0)) + amount;
    const nextDeposits: RegionDeposits = {
      ...currentDeposits,
      [regionCode]: regionEntry
    };
    const afterSnapshot = getRegionControlSnapshot(regionEntry);

    let nextHistory = regionControlHistoryRef.current || [];
    const controlChanged = beforeSnapshot.controllerId !== afterSnapshot.controllerId;
    if (controlChanged) {
      nextHistory = [
        ...nextHistory,
        {
          turn: gameState.day,
          region: regionCode,
          fromPlayer: beforeSnapshot.controllerId || 'none',
          toPlayer: afterSnapshot.controllerId || 'none',
          method: beforeSnapshot.controllerId && afterSnapshot.controllerId && beforeSnapshot.controllerId !== afterSnapshot.controllerId
            ? 'steal'
            : 'deposit'
        }
      ].slice(-250);
    }

    updateRegionControlData(nextDeposits, nextHistory);

    if (actorId === 'player' && options?.consumeAction !== false) {
      incrementAction();
    }

    if (!options?.silent) {
      const actorName = actorId === 'player' ? 'You' : `🤖 ${actorState.name}`;
      const reasonSuffix = options?.reason ? ` (${options.reason})` : '';
      addNotification(
        `${actorName} deposited $${amount} in ${REGIONS[regionCode].name}.${reasonSuffix}`,
        actorId === 'player' ? 'info' : 'ai',
        false,
        'deposit'
      );
      if (controlChanged && afterSnapshot.controllerId === actorId) {
        addNotification(
          `${actorName} now controls ${REGIONS[regionCode].name} at $${afterSnapshot.highestDeposit}.`,
          actorId === 'player' ? 'success' : 'ai',
          true,
          'control_gain'
        );
        if (beforeSnapshot.controllerId && beforeSnapshot.controllerId !== actorId) {
          const previousController = getControllerDisplayName(beforeSnapshot.controllerId);
          addNotification(
            `${previousController} lost control of ${REGIONS[regionCode].name}.`,
            beforeSnapshot.controllerId === 'player' ? 'warning' : 'ai',
            true,
            'control_lost'
          );
        }
      }
    }

    return true;
  }, [
    addNotification,
    deductMoney,
    gameSettings.negotiationMode,
    gameState.day,
    getControllerDisplayName,
    incrementAction,
    player,
    updateAiPlayerState,
    updateRegionControlData
  ]);

  const cashOutRegionPosition = useCallback((
    regionCode: string,
    actorId: 'player' | 'ai',
    options?: { consumeAction?: boolean; reason?: string; silent?: boolean }
  ) => {
    if (gameSettings.negotiationMode) {
      if (actorId === 'player' && !options?.silent) {
        addNotification('Negotiation mode is enabled. Cash-out is disabled while diplomatic control is active.', 'warning', false, 'system');
      }
      return false;
    }
    if (!gameSettings.allowCashOut || !REGIONS[regionCode]) return false;

    const currentDeposits = sanitizeRegionDeposits(regionDepositsRef.current);
    const regionEntry = { ...(currentDeposits[regionCode] || {}) };
    const snapshot = getRegionControlSnapshot(regionEntry);
    const actorDeposit = Math.floor(regionEntry[actorId] || 0);

    if (snapshot.controllerId !== actorId || actorDeposit <= 0) {
      return false;
    }

    const refund = Math.floor(actorDeposit * 0.5);
    delete regionEntry[actorId];
    const cleanedEntry = Object.fromEntries(
      Object.entries(regionEntry).filter(([, amount]) => typeof amount === 'number' && amount > 0)
    );

    const nextDeposits: RegionDeposits = { ...currentDeposits };
    if (Object.keys(cleanedEntry).length > 0) {
      nextDeposits[regionCode] = cleanedEntry;
    } else {
      delete nextDeposits[regionCode];
    }

    const afterSnapshot = getRegionControlSnapshot(cleanedEntry);
    const nextHistory = [
      ...(regionControlHistoryRef.current || []),
      {
        turn: gameState.day,
        region: regionCode,
        fromPlayer: actorId,
        toPlayer: afterSnapshot.controllerId || 'none',
        method: 'deposit' as const
      }
    ].slice(-250);

    updateRegionControlData(nextDeposits, nextHistory);

    if (actorId === 'player') {
      dispatchPlayer({ type: 'UPDATE_MONEY', payload: refund });
      if (options?.consumeAction !== false) {
        incrementAction();
      }
    } else {
      updateAiPlayerState(prev => ({ ...prev, money: addMoney(prev.money, refund) }));
    }

    if (!options?.silent) {
      const actorName = actorId === 'player' ? 'You' : `🤖 ${getControllerDisplayName(actorId)}`;
      const reasonSuffix = options?.reason ? ` (${options.reason})` : '';
      addNotification(
        `${actorName} cashed out ${REGIONS[regionCode].name} for $${refund} (50% of $${actorDeposit}).${reasonSuffix}`,
        actorId === 'player' ? 'warning' : 'ai',
        true,
        'cashout'
      );
      addNotification(
        `${REGIONS[regionCode].name} control released.`,
        actorId === 'player' ? 'warning' : 'ai',
        true,
        'control_lost'
      );
      if (afterSnapshot.controllerId && afterSnapshot.controllerId !== actorId) {
        const newController = getControllerDisplayName(afterSnapshot.controllerId);
        addNotification(
          `${newController} now controls ${REGIONS[regionCode].name}.`,
          afterSnapshot.controllerId === 'player' ? 'success' : 'ai',
          true,
          'control_gain'
        );
      }
    }

    return true;
  }, [
    addMoney,
    addNotification,
    gameSettings.negotiationMode,
    gameSettings.allowCashOut,
    gameState.day,
    getControllerDisplayName,
    incrementAction,
    updateAiPlayerState,
    updateRegionControlData
  ]);

  const applyLoanTick = useCallback((state: any) => {
    if (!state.loans || state.loans.length === 0) {
      return { money: state.money, loans: [] as typeof state.loans };
    }
    let money = state.money;
    const updatedLoans = state.loans.map((loan: any) => {
      const interest = Math.floor(loan.amount * LOAN_INTEREST_RATE);
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

  // Advanced Loan System handlers
  const takeAdvancedLoan = useCallback((tierId: string, isEvent: boolean = false, eventId?: string) => {
    if (!gameSettings.advancedLoansEnabled) return;

    const tier = LOAN_TIERS.find(t => t.id === tierId);
    if (!tier) return;

    // Check level requirement
    if (player.level < tier.levelRequired) {
      addNotification(`Requires level ${tier.levelRequired} for ${tier.name}`, 'warning', true);
      return;
    }

    // Check max loans
    const currentLoans = player.advancedLoans || [];
    if (currentLoans.length >= gameSettings.maxSimultaneousLoans) {
      addNotification(`Maximum ${gameSettings.maxSimultaneousLoans} loans allowed`, 'warning', true);
      return;
    }

    // Calculate actual interest rate based on credit score
    const creditScore = gameSettings.creditScoreEnabled ? (player.creditScore || 50) : 50;
    const creditRange = getCreditScoreRange(creditScore);
    const actualInterestRate = tier.baseInterestRate * creditRange.multiplier * gameSettings.loanTierUnlockSpeedMultiplier;

    // Create the loan
    const newLoan: AdvancedLoan = {
      id: Date.now().toString() + Math.random(),
      tierId: tier.id,
      amount: tier.amount,
      baseInterestRate: tier.baseInterestRate,
      actualInterestRate,
      accrued: 0,
      term: tier.term,
      daysRemaining: tier.term,
      issuedDay: gameState.day,
      isEvent,
      eventId
    };

    // Update player state
    const updatedLoanHistory = {
      ...player.loanHistory,
      totalTaken: (player.loanHistory?.totalTaken || 0) + tier.amount
    };

    // Create temporary player state for credit score calculation
    const tempPlayer = {
      ...player,
      advancedLoans: [...currentLoans, newLoan],
      loanHistory: updatedLoanHistory
    };

    // Recalculate credit score after taking loan
    const newCreditScore = gameSettings.creditScoreEnabled
      ? calculateCreditScore(tempPlayer, gameState)
      : player.creditScore || 50;

    const updatedPlayer = {
      ...player,
      money: player.money + tier.amount,
      advancedLoans: [...currentLoans, newLoan],
      loanHistory: updatedLoanHistory,
      creditScore: newCreditScore
    };

    dispatchPlayer({ type: 'MERGE_STATE', payload: updatedPlayer });
    addNotification(`Received ${tier.name}: +$${tier.amount} (${Math.floor(actualInterestRate * 100)}% interest, ${tier.term} days)`, 'money', true);
    updateUiState({ showAdvancedLoans: false });
  }, [player, gameState.day, gameState, gameSettings, addNotification, dispatchPlayer, updateUiState]);

  const repayAdvancedLoan = useCallback((loanId: string, isEarlyRepayment: boolean = false) => {
    if (!gameSettings.advancedLoansEnabled) return;

    const advancedLoans = player.advancedLoans || [];
    const loan = advancedLoans.find(l => l.id === loanId);
    if (!loan) return;

    // Calculate total owed
    let interestOwed = loan.accrued;
    if (isEarlyRepayment && gameSettings.earlyRepaymentEnabled) {
      interestOwed *= getEarlyRepaymentDiscount(); // 50% discount
    }

    const totalOwed = loan.amount + interestOwed;

    if (player.money < totalOwed) {
      addNotification(`Need $${Math.floor(totalOwed)} to repay this loan`, 'warning', true);
      return;
    }

    // Update player state
    const updatedLoans = advancedLoans.filter(l => l.id !== loanId);
    const updatedLoanHistory = {
      ...player.loanHistory,
      totalRepaid: (player.loanHistory?.totalRepaid || 0) + totalOwed,
      earlyRepaymentCount: (player.loanHistory?.earlyRepaymentCount || 0) + (isEarlyRepayment ? 1 : 0)
    };

    // Create temporary player state for credit score calculation
    const tempPlayer = {
      ...player,
      advancedLoans: updatedLoans,
      loanHistory: updatedLoanHistory
    };

    // Recalculate credit score after repayment
    const newCreditScore = gameSettings.creditScoreEnabled
      ? calculateCreditScore(tempPlayer, gameState)
      : player.creditScore || 50;

    const updatedPlayer = {
      ...player,
      money: player.money - totalOwed,
      advancedLoans: updatedLoans,
      loanHistory: updatedLoanHistory,
      creditScore: newCreditScore
    };

    dispatchPlayer({ type: 'MERGE_STATE', payload: updatedPlayer });

    const message = isEarlyRepayment
      ? `Early repayment: Paid $${Math.floor(totalOwed)} (50% interest discount!)`
      : `Repaid loan: $${Math.floor(totalOwed)}`;
    addNotification(message, 'success', true);
  }, [player, gameState, gameSettings, addNotification, dispatchPlayer]);

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
        dispatchGameState({
          type: 'ADD_CHALLENGE_COMPLETION',
          payload: {
            id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            playerId: 'player',
            challengeName: challenge.name,
            turn: gameState.day,
            timestamp: Date.now()
          } as ChallengeCompletionLogEntry
        });

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

        // Check if this is a crafted item (Businessman gets +20% bonus on crafted items)
        const isCraftedItem = CRAFTING_RECIPES.some(recipe => recipe.output === resource);
        if (isCraftedItem && player.character.craftingBonus?.effect?.sellBonus) {
          finalPrice = Math.floor(finalPrice * (1 + player.character.craftingBonus.effect.sellBonus));
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

  const buyResourceFromMarket = useCallback((
    resource: string,
    rawQuantity: number,
    actorId: 'player' | 'ai' = 'player',
    options?: { consumeAction?: boolean; reason?: string; silent?: boolean }
  ) => {
    if (!RESOURCE_CATEGORIES[resource]) return false;

    const quantity = Math.max(1, Math.floor(Number(rawQuantity) || 0));
    const unitPrice = getResourceMarketPrice(resource);
    const totalCost = unitPrice * quantity;
    const actorState = actorId === 'player' ? player : aiPlayerRef.current;

    if ((actorState.money || 0) < totalCost) {
      if (!options?.silent) {
        const actorLabel = actorId === 'player' ? 'Not enough money' : `🤖 ${actorState.name} cannot afford that purchase`;
        addNotification(`${actorLabel} ($${totalCost} needed).`, actorId === 'player' ? 'error' : 'ai', false, 'market');
      }
      return false;
    }

    const remainingSlots = MAX_INVENTORY - (actorState.inventory?.length || 0);
    if (remainingSlots <= 0) {
      if (!options?.silent) {
        const actorLabel = actorId === 'player' ? 'Inventory is full.' : `🤖 ${actorState.name}'s inventory is full.`;
        addNotification(actorLabel, 'warning', false, 'resource_buy');
      }
      return false;
    }

    const finalQuantity = Math.min(quantity, remainingSlots);
    const finalCost = finalQuantity * unitPrice;
    const purchased = Array.from({ length: finalQuantity }, () => resource);

    if (actorId === 'player') {
      dispatchPlayer({ type: 'UPDATE_MONEY', payload: -finalCost });
      dispatchPlayer({ type: 'COLLECT_RESOURCES', payload: { resources: purchased } });
      if (options?.consumeAction !== false) {
        incrementAction();
      }
    } else {
      updateAiPlayerState(prev => ({
        ...prev,
        money: deductMoney(prev.money, finalCost),
        inventory: [...(prev.inventory || []), ...purchased]
      }));
    }

    if (!options?.silent) {
      const actorName = actorId === 'player' ? 'Bought' : `🤖 ${actorState.name} bought`;
      const reasonSuffix = options?.reason ? ` (${options.reason})` : '';
      addNotification(
        `${actorName} ${finalQuantity}x ${resource} for $${finalCost}.${reasonSuffix}`,
        actorId === 'player' ? 'market' : 'ai',
        false,
        'market'
      );
    }

    return true;
  }, [addNotification, deductMoney, incrementAction, player, updateAiPlayerState]);

  const handlePlayerResourceMarketPurchase = useCallback(() => {
    if (gameState.currentTurn !== 'player') return;
    buyResourceFromMarket(resourceMarketSelection, resourceMarketQuantity, 'player', {
      consumeAction: true
    });
  }, [buyResourceFromMarket, gameState.currentTurn, resourceMarketQuantity, resourceMarketSelection]);

  const handlePlayerRegionDeposit = useCallback(() => {
    if (gameState.currentTurn !== 'player') return;
    if (gameSettings.negotiationMode) {
      addNotification('Negotiation mode is ON. Region control changes happen through proposals.', 'warning', false, 'system');
      return;
    }
    depositInRegion(player.currentRegion, 'player', regionDepositInput, {
      consumeAction: true
    });
  }, [addNotification, depositInRegion, gameSettings.negotiationMode, gameState.currentTurn, player.currentRegion, regionDepositInput]);

  const handlePlayerCashOutRegion = useCallback(() => {
    if (gameState.currentTurn !== 'player') return;
    if (gameSettings.negotiationMode) {
      addNotification('Negotiation mode is ON. Cashing out region positions is disabled.', 'warning', false, 'system');
      return;
    }
    if (!gameSettings.allowCashOut) {
      addNotification('Cash out is disabled in settings.', 'warning', false, 'system');
      return;
    }
    cashOutRegionPosition(player.currentRegion, 'player', {
      consumeAction: true
    });
  }, [addNotification, cashOutRegionPosition, gameSettings.allowCashOut, gameSettings.negotiationMode, gameState.currentTurn, player.currentRegion]);

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

  // Crafting System Functions
  const canCraftRecipe = useCallback((recipe: any, inventory: string[]) => {
    for (const [resource, requiredCount] of Object.entries(recipe.inputs)) {
      const availableCount = inventory.filter(item => item === resource).length;
      if (availableCount < (requiredCount as number)) {
        return false;
      }
    }
    return true;
  }, []);

  const craftItem = useCallback((recipeId: string) => {
    if (gameState.currentTurn !== 'player') return;

    const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    // Check if player has required materials
    if (!canCraftRecipe(recipe, player.inventory)) {
      addNotification('Not enough materials to craft this item.', 'error');
      return;
    }

    // Get crafting bonus once for use throughout function
    const craftingBonus = player.character.craftingBonus;

    // Check inventory space - calculate net change after crafting
    const itemsConsumed = Object.values(recipe.inputs).reduce((sum, count) => sum + (count as number), 0);
    let itemsCreated = 1; // base crafted item

    // Account for potential bonus material (Explorer or other character bonuses)
    if (craftingBonus?.effect?.bonusMaterialChance) {
      itemsCreated += 1; // Conservative: assume bonus material might be returned
    }

    const netInventoryChange = itemsCreated - itemsConsumed;

    if (player.inventory.length + netInventoryChange > MAX_INVENTORY) {
      addNotification('Not enough inventory space for crafting result!', 'warning');
      return;
    }

    // Remove materials from inventory
    let newInventory = [...player.inventory];
    for (const [resource, requiredCount] of Object.entries(recipe.inputs)) {
      for (let i = 0; i < (requiredCount as number); i++) {
        const index = newInventory.findIndex(item => item === resource);
        if (index !== -1) {
          newInventory.splice(index, 1);
        }
      }
    }

    // Calculate crafting success (base 90% success rate)
    let successChance = 0.90;

    // Apply character crafting bonus
    if (craftingBonus?.effect?.successBonus) {
      successChance += craftingBonus.effect.successBonus;
    }

    // Roll for success
    const success = Math.random() < successChance;

    if (success) {
      // Add crafted item to inventory
      newInventory.push(recipe.output);

      // Explorer bonus: chance to get materials back
      if (craftingBonus?.effect?.bonusMaterialChance && Math.random() < craftingBonus.effect.bonusMaterialChance) {
        // Return one random material
        const materials = Object.keys(recipe.inputs);
        const bonusMaterial = materials[Math.floor(Math.random() * materials.length)];
        newInventory.push(bonusMaterial);
        addNotification(`Crafted ${recipe.output}! Explorer bonus: got ${bonusMaterial} back.`, 'success', true);
      } else {
        addNotification(`Successfully crafted ${recipe.output}!`, 'success', true);
      }
    } else {
      addNotification(`Crafting failed! Materials were lost.`, 'error', true);
    }

    // Update inventory
    dispatchPlayer({ type: 'SET_INVENTORY', payload: newInventory });

    // Tourist speed bonus - no action cost for tourism items
    const isTourismItem = recipe.category === 'tourism';
    const hasTourismBonus = craftingBonus?.effect?.categorySpeedBonus?.tourism === 1.0;

    if (!(isTourismItem && hasTourismBonus)) {
      // Normal crafting consumes actions based on craftTime
      for (let i = 0; i < recipe.craftTime; i++) {
        incrementAction();
      }
    } else {
      addNotification(`Tourist bonus: No action cost for tourism crafting!`, 'info');
    }
  }, [gameState.currentTurn, player.inventory, player.character, canCraftRecipe, addNotification, incrementAction]);

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
      // Turn-transition subsystems run after main player actions complete.
      handleTurnTransition('player');
      
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
  }, [player, gameState, addNotification, handleTurnTransition, showConfirmation, updatePersonalRecords]);

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

    // Apply loan interest ticks (simple loans)
    const playerLoanTick = applyLoanTick(projectedPlayer);
    projectedPlayer.money = playerLoanTick.money;
    projectedPlayer.loans = playerLoanTick.loans;

    const aiLoanTick = applyLoanTick(projectedAi);
    projectedAi.money = aiLoanTick.money;
    projectedAi.loans = aiLoanTick.loans;

    // Process advanced loans if enabled
    if (gameSettings.advancedLoansEnabled) {
      const playerAdvancedLoanResult = processAdvancedLoans(projectedPlayer, gameSettings, newDay);
      projectedPlayer = playerAdvancedLoanResult.updatedPlayer;
      playerAdvancedLoanResult.notifications.forEach(notif => {
        addNotification(notif.message, notif.type as any, true);
      });

      const aiAdvancedLoanResult = processAdvancedLoans(projectedAi, gameSettings, newDay);
      projectedAi = aiAdvancedLoanResult.updatedPlayer;
      aiAdvancedLoanResult.notifications.forEach(notif => {
        addNotification(`🤖 ${notif.message}`, 'ai', false);
      });
    }

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

    if (projectedAi.money < BANKRUPTCY_THRESHOLD && projectedAi.loans.length < MAX_ACTIVE_LOANS) {
      projectedAi.loans = [...projectedAi.loans, { id: Date.now().toString(), amount: LOAN_AMOUNT, accrued: 0 }];
      projectedAi.money += LOAN_AMOUNT;
      addNotification(`🤖 ${projectedAi.name} grabbed an emergency $${LOAN_AMOUNT} loan.`, 'ai', true);
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

    // Detect Adaptive AI phase if enabled
    if (gameSettings.adaptiveAiEnabled && gameState.selectedMode === 'ai') {
      const playerNetWorth = calculateNetWorth(projectedPlayer);
      const aiNetWorth = calculateNetWorth(projectedAi);
      const playerChallenges = projectedPlayer.challengesCompleted?.length || 0;
      const aiChallenges = projectedAi.challengesCompleted?.length || 0;

      const detectedPhase = detectAdaptiveAiPhase(
        playerNetWorth,
        aiNetWorth,
        projectedPlayer.level,
        projectedAi.level,
        playerChallenges,
        aiChallenges,
        gameSettings
      );

      // Track consecutive days in trigger state
      if (detectedPhase !== 'normal') {
        const newDaysTriggered = gameState.adaptiveAiDaysTriggered + 1;
        dispatchGameState({ type: 'SET_ADAPTIVE_AI_DAYS_TRIGGERED', payload: newDaysTriggered });

        // Only escalate if consecutive days threshold is met
        if (newDaysTriggered >= gameSettings.adaptiveAiConsecutiveDays) {
          if (gameState.adaptiveAiPhase !== detectedPhase) {
            dispatchGameState({ type: 'SET_ADAPTIVE_AI_PHASE', payload: detectedPhase });
            const phaseEmoji = getAdaptiveAiPhaseEmoji(detectedPhase);
            const phaseName = getAdaptiveAiPhaseName(detectedPhase);
            addNotification(`${phaseEmoji} AI entered ${phaseName} mode!`, 'warning', true);
          }
        }
      } else {
        dispatchGameState({ type: 'SET_ADAPTIVE_AI_DAYS_TRIGGERED', payload: 0 });
        if (gameState.adaptiveAiPhase !== 'normal') {
          dispatchGameState({ type: 'SET_ADAPTIVE_AI_PHASE', payload: 'normal' });
          addNotification('🤖 AI returned to Normal mode', 'info', false);
        }
      }

      // Track player dominance days for rubber-banding
      if (playerNetWorth > aiNetWorth * 1.5) {
        dispatchGameState({ type: 'SET_PLAYER_DOMINANCE_DAYS', payload: gameState.playerDominanceDays + 1 });
      } else {
        dispatchGameState({ type: 'SET_PLAYER_DOMINANCE_DAYS', payload: 0 });
      }
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
        completedThisSeason: projectedPlayer.completedThisSeason,
        advancedLoans: projectedPlayer.advancedLoans,
        creditScore: projectedPlayer.creditScore,
        loanHistory: projectedPlayer.loanHistory,
        daysSinceLastBankruptcy: projectedPlayer.daysSinceLastBankruptcy
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
	      if (gameState.selectedMode === 'ai') {
	        if (gameSettings.winCondition === 'regions') {
	          const controlSnapshot = computeRegionControlStats(
	            sanitizeRegionDeposits(gameState.regionDeposits),
	            gameState.regionControlStats?.controlHistory || []
	          );
	          const playerRegions = controlSnapshot.totalControlled.player || 0;
	          const aiRegions = controlSnapshot.totalControlled.ai || 0;
	          if (playerRegions > aiRegions) {
	            addNotification(`Game Over! You led region control ${playerRegions}-${aiRegions}.`, 'success', true, 'system');
	          } else if (aiRegions > playerRegions) {
	            addNotification(`Game Over! AI led region control ${aiRegions}-${playerRegions}.`, 'ai', true, 'system');
	          } else if (projectedPlayer.money >= projectedAi.money) {
	            addNotification(`Game Over! Region tie broken by money: You $${projectedPlayer.money} vs AI $${projectedAi.money}.`, 'success', true, 'system');
	          } else {
	            addNotification(`Game Over! Region tie broken by money: AI $${projectedAi.money} vs You $${projectedPlayer.money}.`, 'ai', true, 'system');
	          }
	        } else if (projectedPlayer.money >= projectedAi.money) {
	          addNotification(`Game Over! You finished with more money ($${projectedPlayer.money} vs $${projectedAi.money}).`, 'success', true, 'system');
	        } else {
	          addNotification(`Game Over! AI finished with more money ($${projectedAi.money} vs $${projectedPlayer.money}).`, 'ai', true, 'system');
	        }
	      } else {
	        addNotification(`Game Over! Final Day Reached (${gameSettings.totalDays} days).`, 'success', true, 'system');
	      }
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
      uiState.showNegotiationCenter ||
	      uiState.showMarket ||
	      uiState.showResourceMarket ||
	      uiState.showShop ||
	      uiState.showInvestments ||
	      uiState.showSabotage ||
	      uiState.showAdvancedLoans ||
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
    uiState.showNegotiationCenter,
	    uiState.showMarket,
	    uiState.showResourceMarket,
	    uiState.showShop,
	    uiState.showInvestments,
	    uiState.showSabotage,
	    uiState.showAdvancedLoans,
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

	    actions.push({
	      label: 'Resource Market',
	      icon: '🛍️',
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
	                updateUiState({ showResourceMarket: true });
	              } else {
	                addNotification('Not enough money for override', 'error');
	              }
	            }
	          );
	        } else {
	          updateUiState({ showResourceMarket: true });
	        }
	      },
	      hotkey: 'M',
	      disabled: actionLimitReached && gameSettings.actionLimitsEnabled
	    });
    
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
                  addNotification(`Paid $${overrideCost} to override action limit`, 'warning');
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
                  addNotification(`Paid $${overrideCost} to override action limit`, 'warning');
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
                  addNotification(`Paid $${overrideCost} to override action limit`, 'warning');
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
	                <h4 className="text-lg font-bold mb-4">🏁 Win Condition</h4>
	                <div className="space-y-4">
	                  <div>
	                    <label className="block font-semibold mb-2">Victory Goal</label>
	                    <select
	                      value={gameSettings.winCondition}
	                      onChange={(e) => setGameSettings(prev => ({ ...prev, winCondition: e.target.value as 'money' | 'regions' }))}
	                      className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                    >
	                      <option value="money">Most Money (Default)</option>
	                      <option value="regions">Most Controlled Regions</option>
	                    </select>
	                  </div>
	                  <div className={`${themeStyles.border} border rounded-lg p-3 text-sm`}>
	                    {gameSettings.winCondition === 'regions'
	                      ? `Region mode: control the most regions. Majority target is ${REGION_CONTROL_MAJORITY}/${TOTAL_REGION_COUNT}. Tiebreaker: money.`
	                      : 'Money mode: player with the most cash at game end wins.'}
	                  </div>
	                  <div className="flex items-center justify-between">
	                    <div>
	                      <div className="font-semibold">Allow Cashing Out Region Positions</div>
	                      <div className="text-sm opacity-75">Return 50% of your deposit and release control</div>
	                    </div>
	                    <button
	                      onClick={() => setGameSettings(prev => ({ ...prev, allowCashOut: !prev.allowCashOut }))}
	                      className={`px-4 py-2 rounded font-semibold ${gameSettings.allowCashOut ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
	                    >
	                      {gameSettings.allowCashOut ? 'ON' : 'OFF'}
	                    </button>
	                  </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">Enable Negotiation Mode</div>
                        <div className="text-sm opacity-75">OFF by default. Disables new deposit bidding and uses proposal-based region control.</div>
                      </div>
                      <button
                        onClick={() => setGameSettings(prev => ({ ...prev, negotiationMode: !prev.negotiationMode }))}
                        className={`px-4 py-2 rounded font-semibold ${gameSettings.negotiationMode ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                      >
                        {gameSettings.negotiationMode ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    <div className={`${themeStyles.border} border rounded-lg p-3 text-sm`}>
                      {gameSettings.negotiationMode
                        ? 'Negotiation mode ON: turn transition subsystems process proposals after each end turn. Existing deposits are preserved but new deposits are blocked.'
                        : 'Negotiation mode OFF: standard deposit and bidding control works exactly as V5.0.'}
                    </div>
                    {gameSettings.negotiationMode && (
                      <div className="space-y-3 pt-1">
                        <div>
                          <label className="block font-semibold mb-1">Auto-accept cash proposals under ${gameSettings.negotiationOptions.autoAcceptCashUnder}</label>
                          <input
                            type="range"
                            min="0"
                            max="1500"
                            step="50"
                            value={gameSettings.negotiationOptions.autoAcceptCashUnder}
                            onChange={(e) => setGameSettings(prev => ({
                              ...prev,
                              negotiationOptions: {
                                ...prev.negotiationOptions,
                                autoAcceptCashUnder: Math.max(0, Math.floor(Number(e.target.value) || 0))
                              }
                            }))}
                            className="w-full"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={gameSettings.negotiationOptions.autoCompleteReadyTasks}
                              onChange={(e) => setGameSettings(prev => ({
                                ...prev,
                                negotiationOptions: {
                                  ...prev.negotiationOptions,
                                  autoCompleteReadyTasks: e.target.checked
                                }
                              }))}
                            />
                            <span>Auto-complete ready tasks</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={gameSettings.negotiationOptions.confirmExpensiveTasks}
                              onChange={(e) => setGameSettings(prev => ({
                                ...prev,
                                negotiationOptions: {
                                  ...prev.negotiationOptions,
                                  confirmExpensiveTasks: e.target.checked
                                }
                              }))}
                            />
                            <span>Confirm expensive tasks (&gt;$500)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={gameSettings.negotiationOptions.suggestCounterOffers}
                              onChange={(e) => setGameSettings(prev => ({
                                ...prev,
                                negotiationOptions: {
                                  ...prev.negotiationOptions,
                                  suggestCounterOffers: e.target.checked
                                }
                              }))}
                            />
                            <span>Enable AI counter-offer suggestions</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={gameSettings.negotiationOptions.confirmCancelProposal}
                              onChange={(e) => setGameSettings(prev => ({
                                ...prev,
                                negotiationOptions: {
                                  ...prev.negotiationOptions,
                                  confirmCancelProposal: e.target.checked
                                }
                              }))}
                            />
                            <span>Confirm before cancelling proposals</span>
                          </label>
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Proposal expiration (turns): {gameSettings.negotiationOptions.proposalExpirationTurns}</label>
                          <input
                            type="range"
                            min="0"
                            max="15"
                            value={gameSettings.negotiationOptions.proposalExpirationTurns}
                            onChange={(e) => setGameSettings(prev => ({
                              ...prev,
                              negotiationOptions: {
                                ...prev.negotiationOptions,
                                proposalExpirationTurns: Math.max(0, Math.floor(Number(e.target.value) || 0))
                              }
                            }))}
                            className="w-full"
                          />
                          <div className="text-xs opacity-75">0 = never expires</div>
                        </div>
                      </div>
                    )}
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
                      <div className="font-semibold">AI Win-Condition Spending (Optional)</div>
                      <div className="text-sm opacity-75">Feature 1: money mode hoards more cash, regions mode spends more on control</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, aiWinConditionSpendingEnabled: !prev.aiWinConditionSpendingEnabled }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.aiWinConditionSpendingEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.aiWinConditionSpendingEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">AI Regions Majority Rush (Optional)</div>
                      <div className="text-sm opacity-75">Feature 3: stronger region defense, takeovers, and anti-hoard spending in region mode</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, aiRegionsMajorityRushEnabled: !prev.aiRegionsMajorityRushEnabled }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.aiRegionsMajorityRushEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.aiRegionsMajorityRushEnabled ? 'ON' : 'OFF'}
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

              {/* Advanced Loan System Settings */}
              <div className={`${themeStyles.border} border rounded-lg p-4 bg-blue-900 bg-opacity-10`}>
                <h4 className="text-lg font-bold mb-4">🏦 Advanced Loan System (NEW)</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Enable Advanced Loans</div>
                      <div className="text-sm opacity-75">Four-tiered loan system with credit scores</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, advancedLoansEnabled: !prev.advancedLoansEnabled }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.advancedLoansEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.advancedLoansEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  {gameSettings.advancedLoansEnabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">Credit Score System</div>
                          <div className="text-sm opacity-75">Track creditworthiness and adjust rates</div>
                        </div>
                        <button
                          onClick={() => setGameSettings(prev => ({ ...prev, creditScoreEnabled: !prev.creditScoreEnabled }))}
                          className={`px-4 py-2 rounded font-semibold ${gameSettings.creditScoreEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                        >
                          {gameSettings.creditScoreEnabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">Loan Events</div>
                          <div className="text-sm opacity-75">Random special loan opportunities</div>
                        </div>
                        <button
                          onClick={() => setGameSettings(prev => ({ ...prev, loanEventsEnabled: !prev.loanEventsEnabled }))}
                          className={`px-4 py-2 rounded font-semibold ${gameSettings.loanEventsEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                        >
                          {gameSettings.loanEventsEnabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">Early Repayment</div>
                          <div className="text-sm opacity-75">Pay off loans early for 50% interest discount</div>
                        </div>
                        <button
                          onClick={() => setGameSettings(prev => ({ ...prev, earlyRepaymentEnabled: !prev.earlyRepaymentEnabled }))}
                          className={`px-4 py-2 rounded font-semibold ${gameSettings.earlyRepaymentEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                        >
                          {gameSettings.earlyRepaymentEnabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">Max Simultaneous Loans: {gameSettings.maxSimultaneousLoans}</label>
                        <input type="range" min="1" max="5" value={gameSettings.maxSimultaneousLoans} onChange={(e) => setGameSettings(prev => ({ ...prev, maxSimultaneousLoans: parseInt(e.target.value) }))} className="w-full" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">Interest Rate: {((gameSettings.interestAccrualRate || 1.0) * 100).toFixed(0)}%</label>
                        <input type="range" min="0.5" max="2.0" step="0.1" value={gameSettings.interestAccrualRate || 1.0} onChange={(e) => setGameSettings(prev => ({ ...prev, interestAccrualRate: parseFloat(e.target.value) }))} className="w-full" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Adaptive AI Settings */}
	              <div className={`${themeStyles.border} border rounded-lg p-4 bg-red-900 bg-opacity-10`}>
	                <h4 className="text-lg font-bold mb-4">🤖 Adaptive AI "Comeback Mode" (NEW)</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Enable Adaptive AI</div>
                      <div className="text-sm opacity-75">AI gets more aggressive when falling behind</div>
                    </div>
                    <button
                      onClick={() => setGameSettings(prev => ({ ...prev, adaptiveAiEnabled: !prev.adaptiveAiEnabled }))}
                      className={`px-4 py-2 rounded font-semibold ${gameSettings.adaptiveAiEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                    >
                      {gameSettings.adaptiveAiEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  {gameSettings.adaptiveAiEnabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">Pattern Learning</div>
                          <div className="text-sm opacity-75">AI learns and adapts to your playstyle</div>
                        </div>
                        <button
                          onClick={() => setGameSettings(prev => ({ ...prev, adaptiveAiPatternLearning: !prev.adaptiveAiPatternLearning }))}
                          className={`px-4 py-2 rounded font-semibold ${gameSettings.adaptiveAiPatternLearning ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                        >
                          {gameSettings.adaptiveAiPatternLearning ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">Rubber-Banding</div>
                          <div className="text-sm opacity-75">AI gets stat boosts when far behind</div>
                        </div>
                        <button
                          onClick={() => setGameSettings(prev => ({ ...prev, adaptiveAiRubberBanding: !prev.adaptiveAiRubberBanding }))}
                          className={`px-4 py-2 rounded font-semibold ${gameSettings.adaptiveAiRubberBanding ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                        >
                          {gameSettings.adaptiveAiRubberBanding ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">AI Taunts</div>
                          <div className="text-sm opacity-75">Show AI messages when in comeback mode</div>
                        </div>
                        <button
                          onClick={() => setGameSettings(prev => ({ ...prev, adaptiveAiTauntsEnabled: !prev.adaptiveAiTauntsEnabled }))}
                          className={`px-4 py-2 rounded font-semibold ${gameSettings.adaptiveAiTauntsEnabled ? themeStyles.success : themeStyles.buttonSecondary} text-white`}
                        >
                          {gameSettings.adaptiveAiTauntsEnabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">Consecutive Days Required: {gameSettings.adaptiveAiConsecutiveDays}</label>
                        <input type="range" min="1" max="7" value={gameSettings.adaptiveAiConsecutiveDays} onChange={(e) => setGameSettings(prev => ({ ...prev, adaptiveAiConsecutiveDays: parseInt(e.target.value) }))} className="w-full" />
                        <div className="text-xs opacity-75 mt-1">Days AI must be behind before escalating</div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">Aggression Multiplier: {(gameSettings.adaptiveAiAggressionMultiplier || 1.0).toFixed(1)}x</label>
                        <input type="range" min="0.5" max="2.0" step="0.1" value={gameSettings.adaptiveAiAggressionMultiplier || 1.0} onChange={(e) => setGameSettings(prev => ({ ...prev, adaptiveAiAggressionMultiplier: parseFloat(e.target.value) }))} className="w-full" />
                      </div>
                    </>
	                  )}
	                </div>
	              </div>
	              <div className={`${themeStyles.border} border rounded-lg p-4`}>
	                <h4 className="text-lg font-bold mb-4">🔔 Notification Settings</h4>
	                <div className="space-y-5">
	                  <div>
	                    <div className="font-semibold mb-2">Size</div>
	                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
	                      {(['small', 'medium', 'large', 'custom'] as Array<NotificationSettings['size']>).map(sizeOption => (
	                        <button
	                          key={sizeOption}
	                          onClick={() => setGameSettings(prev => ({
	                            ...prev,
	                            notificationSettings: { ...prev.notificationSettings, size: sizeOption }
	                          }))}
	                          className={`px-3 py-2 rounded text-sm font-semibold ${
	                            gameSettings.notificationSettings.size === sizeOption ? themeStyles.button : themeStyles.buttonSecondary
	                          }`}
	                        >
	                          {sizeOption.charAt(0).toUpperCase() + sizeOption.slice(1)}
	                        </button>
	                      ))}
	                    </div>
	                    {gameSettings.notificationSettings.size === 'custom' && (
	                      <div className="mt-3">
	                        <label className="block text-sm font-semibold mb-1">
	                          Custom Size: {Math.round(gameSettings.notificationSettings.customSize || 100)}%
	                        </label>
	                        <input
	                          type="range"
	                          min="80"
	                          max="150"
	                          value={Math.round(gameSettings.notificationSettings.customSize || 100)}
	                          onChange={(e) => setGameSettings(prev => ({
	                            ...prev,
	                            notificationSettings: {
	                              ...prev.notificationSettings,
	                              customSize: Math.max(80, Math.min(150, Number(e.target.value) || 100))
	                            }
	                          }))}
	                          className="w-full"
	                        />
	                      </div>
	                    )}
	                  </div>

	                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
	                    <div>
	                      <div className="font-semibold mb-1">Position</div>
	                      <select
	                        value={gameSettings.notificationSettings.position}
	                        onChange={(e) => setGameSettings(prev => ({
	                          ...prev,
	                          notificationSettings: {
	                            ...prev.notificationSettings,
	                            position: e.target.value as NotificationSettings['position']
	                          }
	                        }))}
	                        className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                      >
	                        <option value="top-left">Top-Left</option>
	                        <option value="top-right">Top-Right</option>
	                        <option value="bottom-left">Bottom-Left</option>
	                        <option value="bottom-right">Bottom-Right</option>
	                        <option value="top-center">Top-Center</option>
	                        <option value="bottom-center">Bottom-Center</option>
	                      </select>
	                    </div>
	                    <div>
	                      <div className="font-semibold mb-1">Clear Shortcut</div>
	                      <select
	                        value={gameSettings.notificationClearShortcut}
	                        onChange={(e) => setGameSettings(prev => ({
	                          ...prev,
	                          notificationClearShortcut: e.target.value as NotificationClearShortcut
	                        }))}
	                        className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                      >
	                        <option value="ctrl+shift+c">Ctrl+Shift+C</option>
	                        <option value="ctrl+alt+c">Ctrl+Alt+C</option>
	                        <option value="disabled">Disabled</option>
	                      </select>
	                    </div>
	                  </div>

	                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
	                    <div>
	                      <div className="font-semibold mb-1">Animation</div>
	                      <select
	                        value={gameSettings.notificationSettings.animation}
	                        onChange={(e) => setGameSettings(prev => ({
	                          ...prev,
	                          notificationSettings: {
	                            ...prev.notificationSettings,
	                            animation: e.target.value as NotificationSettings['animation']
	                          }
	                        }))}
	                        className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                      >
	                        <option value="slide">Slide-in</option>
	                        <option value="fade">Fade-in</option>
	                        <option value="none">None</option>
	                      </select>
	                    </div>
	                    <div>
	                      <div className="font-semibold mb-1">Animation Speed</div>
	                      <select
	                        value={gameSettings.notificationSettings.animationSpeed}
	                        onChange={(e) => setGameSettings(prev => ({
	                          ...prev,
	                          notificationSettings: {
	                            ...prev.notificationSettings,
	                            animationSpeed: Number(e.target.value) || 0.5
	                          }
	                        }))}
	                        className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                      >
	                        <option value={0.3}>0.3s</option>
	                        <option value={0.5}>0.5s</option>
	                        <option value={1}>1.0s</option>
	                      </select>
	                    </div>
	                  </div>

	                  <div>
	                    <div className="font-semibold mb-2">Auto-Dismiss Timers</div>
	                    <div className="space-y-2">
	                      {[
	                        { label: 'AI Actions', key: 'ai_actions' },
	                        { label: 'Resource Updates', key: 'resource_updates' },
	                        { label: 'Region Control Changes', key: 'region_control' },
                          { label: 'Negotiation Events', key: 'negotiation_events' },
	                        { label: 'Challenge Results', key: 'challenge_results' },
	                        { label: 'Level Ups / Achievements', key: 'level_ups' },
	                        { label: 'System Messages', key: 'system_messages' }
	                      ].map(group => {
	                        const groupTypes = NOTIFICATION_GROUPS[group.key];
	                        const currentValue = gameSettings.notificationSettings.autoDismiss[groupTypes[0]];
	                        return (
	                          <div key={group.key} className="flex items-center justify-between gap-2">
	                            <span className="text-sm">{group.label}</span>
	                            <select
	                              value={currentValue}
	                              onChange={(e) => {
	                                const selectedValue = Number(e.target.value);
	                                setGameSettings(prev => {
	                                  const updated = {
	                                    ...prev.notificationSettings,
	                                    autoDismiss: { ...prev.notificationSettings.autoDismiss }
	                                  };
	                                  groupTypes.forEach(typeKey => {
	                                    updated.autoDismiss[typeKey] = selectedValue;
	                                  });
	                                  return { ...prev, notificationSettings: updated };
	                                });
	                              }}
	                              className={`${themeStyles.select} rounded px-2 py-1 text-sm`}
	                            >
	                              <option value={0}>Never</option>
	                              <option value={3}>3s</option>
	                              <option value={5}>5s</option>
	                              <option value={10}>10s</option>
	                              <option value={15}>15s</option>
	                            </select>
	                          </div>
	                        );
	                      })}
	                    </div>
	                  </div>

	                  <div>
	                    <div className="font-semibold mb-2">Notification Type Filters</div>
	                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
	                      {[
	                        { label: 'AI Actions', key: 'ai_actions' },
	                        { label: 'Resource Updates', key: 'resource_updates' },
	                        { label: 'Region Control Changes', key: 'region_control' },
                          { label: 'Negotiation Events', key: 'negotiation_events' },
	                        { label: 'Challenge Results', key: 'challenge_results' },
	                        { label: 'Level Ups / Achievements', key: 'level_ups' },
	                        { label: 'System Messages', key: 'system_messages' }
	                      ].map(group => {
	                        const groupTypes = NOTIFICATION_GROUPS[group.key];
	                        const checked = groupTypes.every(typeKey => gameSettings.notificationSettings.typeFilters[typeKey]);
	                        return (
	                          <label key={group.key} className="flex items-center gap-2 text-sm cursor-pointer">
	                            <input
	                              type="checkbox"
	                              checked={checked}
	                              onChange={(e) => {
	                                const nextChecked = e.target.checked;
	                                setGameSettings(prev => {
	                                  const updated = {
	                                    ...prev.notificationSettings,
	                                    typeFilters: { ...prev.notificationSettings.typeFilters }
	                                  };
	                                  groupTypes.forEach(typeKey => {
	                                    updated.typeFilters[typeKey] = nextChecked;
	                                  });
	                                  return { ...prev, notificationSettings: updated };
	                                });
	                              }}
	                            />
	                            <span>{checked ? '☑' : '☐'} {group.label}</span>
	                          </label>
	                        );
	                      })}
	                    </div>
	                  </div>

	                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
	                    <div>
	                      <div className="font-semibold mb-1">Opacity</div>
	                      <select
	                        value={gameSettings.notificationSettings.opacity}
	                        onChange={(e) => setGameSettings(prev => ({
	                          ...prev,
	                          notificationSettings: {
	                            ...prev.notificationSettings,
	                            opacity: Number(e.target.value) || 100
	                          }
	                        }))}
	                        className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                      >
	                        <option value={70}>70%</option>
	                        <option value={80}>80%</option>
	                        <option value={90}>90%</option>
	                        <option value={100}>100%</option>
	                      </select>
	                    </div>
	                    <div>
	                      <div className="font-semibold mb-1">Max Visible</div>
	                      <select
	                        value={gameSettings.notificationSettings.maxVisible}
	                        onChange={(e) => setGameSettings(prev => ({
	                          ...prev,
	                          notificationSettings: {
	                            ...prev.notificationSettings,
	                            maxVisible: Number(e.target.value)
	                          }
	                        }))}
	                        className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                      >
	                        <option value={3}>3</option>
	                        <option value={5}>5</option>
	                        <option value={10}>10</option>
	                        <option value={20}>20</option>
	                        <option value={0}>Unlimited</option>
	                      </select>
	                    </div>
	                    <div>
	                      <div className="font-semibold mb-1">Stack Behavior</div>
	                      <select
	                        value={gameSettings.notificationSettings.stackOrder}
	                        onChange={(e) => setGameSettings(prev => ({
	                          ...prev,
	                          notificationSettings: {
	                            ...prev.notificationSettings,
	                            stackOrder: e.target.value as NotificationSettings['stackOrder']
	                          }
	                        }))}
	                        className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                      >
	                        <option value="newest-first">Newest First</option>
	                        <option value="oldest-first">Oldest First</option>
	                      </select>
	                    </div>
	                    <div>
	                      <div className="font-semibold mb-1">Border Style</div>
	                      <select
	                        value={gameSettings.notificationSettings.borderStyle}
	                        onChange={(e) => setGameSettings(prev => ({
	                          ...prev,
	                          notificationSettings: {
	                            ...prev.notificationSettings,
	                            borderStyle: e.target.value as NotificationSettings['borderStyle']
	                          }
	                        }))}
	                        className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                      >
	                        <option value="none">None</option>
	                        <option value="thin">Thin</option>
	                        <option value="thick">Thick</option>
	                      </select>
	                    </div>
	                    <div className="md:col-span-2">
	                      <div className="font-semibold mb-1">Shadow</div>
	                      <select
	                        value={gameSettings.notificationSettings.shadow}
	                        onChange={(e) => setGameSettings(prev => ({
	                          ...prev,
	                          notificationSettings: {
	                            ...prev.notificationSettings,
	                            shadow: e.target.value as NotificationSettings['shadow']
	                          }
	                        }))}
	                        className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                      >
	                        <option value="none">None</option>
	                        <option value="subtle">Subtle</option>
	                        <option value="prominent">Prominent</option>
	                      </select>
	                    </div>
	                  </div>

	                  <div className={`${themeStyles.border} border rounded-lg p-3`}>
	                    <div className="font-semibold mb-2">Preview</div>
	                    <div className="space-y-2 mb-3">
	                      <div
	                        className={`${themeStyles.card} rounded-lg p-2 border-l-4 border-blue-500 ${
	                          gameSettings.notificationSettings.borderStyle === 'none'
	                            ? ''
	                            : gameSettings.notificationSettings.borderStyle === 'thick'
	                              ? 'border border-2'
	                              : 'border'
	                        } ${
	                          gameSettings.notificationSettings.shadow === 'none'
	                            ? ''
	                            : gameSettings.notificationSettings.shadow === 'prominent'
	                              ? 'shadow-2xl'
	                              : 'shadow-md'
	                        }`}
	                        style={{
	                          opacity: (gameSettings.notificationSettings.opacity || 100) / 100,
	                          transform: `scale(${
	                            gameSettings.notificationSettings.size === 'small'
	                              ? 0.9
	                              : gameSettings.notificationSettings.size === 'large'
	                                ? 1.2
	                                : gameSettings.notificationSettings.size === 'custom'
	                                  ? (Math.max(80, Math.min(150, gameSettings.notificationSettings.customSize || 100)) / 100)
	                                  : 1
	                          })`
	                        }}
	                      >
	                        <div className="text-xs opacity-75 mb-1">Preview • Day {gameState.day}</div>
	                        <div className="text-sm">This is how notifications will look.</div>
	                      </div>
	                    </div>
	                    <div className="flex flex-col md:flex-row gap-2">
	                      <button
	                        onClick={() => addNotification('Test notification from settings preview.', 'info', false, 'system')}
	                        className={`${themeStyles.button} text-white px-4 py-2 rounded text-sm flex-1`}
	                      >
	                        Test Notification
	                      </button>
	                      <button
	                        onClick={() => setGameSettings(prev => ({
	                          ...prev,
	                          notificationSettings: createDefaultNotificationSettings(),
	                          notificationClearShortcut: 'ctrl+shift+c'
	                        }))}
	                        className={`${themeStyles.buttonSecondary} px-4 py-2 rounded text-sm flex-1`}
	                      >
	                        Reset to Default
	                      </button>
	                    </div>
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
    const settings = gameSettings.notificationSettings || createDefaultNotificationSettings();
    const filtered = notifications.filter(n => settings.typeFilters[n.notificationType || 'system']);
    const ordered = settings.stackOrder === 'newest-first'
      ? [...filtered].reverse()
      : [...filtered];
    const maxVisible = settings.maxVisible === 0 ? ordered.length : settings.maxVisible;
    const visibleNotifications = ordered.slice(0, Math.max(0, maxVisible));

    if (visibleNotifications.length === 0) return null;

    const positionClass = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    }[settings.position] || 'top-4 right-4';

    const borderClass = settings.borderStyle === 'none'
      ? ''
      : settings.borderStyle === 'thick'
        ? 'border-2'
        : 'border';
    const shadowClass = settings.shadow === 'none'
      ? ''
      : settings.shadow === 'prominent'
        ? 'shadow-2xl'
        : 'shadow-md';
    const sizeScale = settings.size === 'small'
      ? 0.9
      : settings.size === 'large'
        ? 1.2
        : settings.size === 'custom'
          ? (Math.max(80, Math.min(150, settings.customSize || 100)) / 100)
          : 1;

    return (
      <div className={`fixed ${positionClass} z-40 space-y-2 max-w-md`}>
        {visibleNotifications.map(notification => {
          const notifType = NOTIFICATION_TYPES[notification.type];
          const animationStyle = settings.animation === 'none'
            ? {}
            : settings.animation === 'fade'
              ? { animation: `notificationFadeIn ${settings.animationSpeed || 0.5}s ease-out` }
              : { animation: `notificationSlideIn ${settings.animationSpeed || 0.5}s ease-out` };
          return (
            <div
              key={notification.id}
              className={`${themeStyles.card} border-l-4 rounded-lg p-3 ${borderClass} ${shadowClass} transform transition-all duration-300 hover:scale-105 cursor-pointer`}
	              style={{
	                borderLeftColor: notifType.color,
	                opacity: (settings.opacity || 100) / 100,
	                fontSize: `${Math.max(80, Math.min(150, Math.round(sizeScale * 100)))}%`,
	                ...animationStyle
	              }}
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
            {gameSettings.adaptiveAiEnabled && gameState.adaptiveAiPhase !== 'normal' && (
              <div className={`${themeStyles.border} border rounded-lg p-3 bg-red-900 bg-opacity-20`}>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getAdaptiveAiPhaseEmoji(gameState.adaptiveAiPhase)}</span>
                  <div>
                    <div className="font-bold text-red-400">Adaptive AI Mode: {getAdaptiveAiPhaseName(gameState.adaptiveAiPhase)}</div>
                    <div className="text-xs opacity-75">AI is fighting back harder!</div>
                  </div>
                </div>
              </div>
            )}
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
    
	    const playerGoalValue = gameSettings.winCondition === 'regions' ? playerControlledRegions : player.money;
	    const aiGoalValue = gameState.selectedMode === 'ai'
	      ? (gameSettings.winCondition === 'regions' ? aiControlledRegions : aiPlayer.money)
	      : 0;
	    const scoreComparison = playerGoalValue - aiGoalValue;
    
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

	            {gameSettings.winCondition === 'regions' && gameState.selectedMode === 'ai' && (
	              <div className={`${themeStyles.border} border rounded-lg p-4`}>
	                <h4 className="font-bold mb-2">🏳️ Region Control Race</h4>
	                <div className="text-sm space-y-1">
	                  <div>You: {playerControlledRegions}/{TOTAL_REGION_COUNT}</div>
	                  <div>{aiPlayer.name}: {aiControlledRegions}/{TOTAL_REGION_COUNT}</div>
	                  <div>Majority Target: {REGION_CONTROL_MAJORITY}</div>
	                  <div>Invested: You ${playerRegionInvested} • {aiPlayer.name} ${aiRegionInvested}</div>
	                </div>
	              </div>
	            )}

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
	                <div className="text-xs opacity-75 mb-2">
	                  {gameSettings.winCondition === 'regions'
	                    ? `Goal: Control majority (${REGION_CONTROL_MAJORITY}/${TOTAL_REGION_COUNT})`
	                    : 'Goal: Finish with the most money'}
	                </div>
	                <div className="grid grid-cols-2 gap-4">
	                  <div>
	                    <div className="text-sm opacity-75 mb-1">
	                      {gameSettings.winCondition === 'regions' ? 'Your Regions' : 'Your Money'}
	                    </div>
	                    <div className="text-2xl font-bold text-green-500">
	                      {gameSettings.winCondition === 'regions' ? playerGoalValue : `$${playerGoalValue.toLocaleString()}`}
	                    </div>
	                  </div>
	                  <div>
	                    <div className="text-sm opacity-75 mb-1">
	                      {gameSettings.winCondition === 'regions' ? `${aiPlayer.name} Regions` : `${aiPlayer.name} Money`}
	                    </div>
	                    <div className="text-2xl font-bold text-pink-500">
	                      {gameSettings.winCondition === 'regions' ? aiGoalValue : `$${aiGoalValue.toLocaleString()}`}
	                    </div>
	                  </div>
	                </div>
	                <div className="mt-3 text-center">
	                  {scoreComparison > 0 ? (
	                    <div className="text-green-500">
	                      ✅ Leading by {gameSettings.winCondition === 'regions' ? `${scoreComparison} region(s)!` : `$${scoreComparison.toLocaleString()}!`}
	                    </div>
	                  ) : scoreComparison < 0 ? (
	                    <div className="text-red-500">
	                      ⚠️ Behind by {gameSettings.winCondition === 'regions' ? `${Math.abs(scoreComparison)} region(s)` : `$${Math.abs(scoreComparison).toLocaleString()}`}
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
                updateUiState({
                  showNegotiationCenter: false,
                  showNotifications: false,
                  showProgress: false,
                  showSettings: false
                });
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
                    updateUiState({
                      showCampaignSelect: false,
                      showNegotiationCenter: false,
                      showNotifications: false,
                      showProgress: false,
                      showSettings: false
                    });
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
	    const craftedItemCount = player.inventory.filter(item => CRAFTING_RECIPES.some(recipe => recipe.output === item)).length;
	    const currentRegionControlInfo = getRegionControlInfo(player.currentRegion);
	    const currentRegionControllerName = getControllerDisplayName(currentRegionControlInfo.controllerId);
    const pendingNegotiationCount = gameState.negotiationCenter?.pendingProposalsCount || 0;
	    
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
	          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
	            <div>
	              <div className="text-sm opacity-75">Win Condition</div>
	              <div className="font-bold">{winConditionLabel}</div>
	            </div>

	            {gameState.selectedMode === 'ai' && gameSettings.winCondition === 'money' && (
	              <div className="space-y-2">
	                <div className="grid grid-cols-2 gap-3 text-sm">
	                  <div className={`${themeStyles.border} border rounded px-3 py-2`}>
	                    <div className="opacity-75">You</div>
	                    <div className="font-bold text-green-400">${player.money}</div>
	                  </div>
	                  <div className={`${themeStyles.border} border rounded px-3 py-2`}>
	                    <div className="opacity-75">{aiPlayer.name}</div>
	                    <div className="font-bold text-pink-400">${aiPlayer.money}</div>
	                  </div>
	                </div>
	                <div className={`${themeStyles.border} border rounded px-3 py-2`}>
	                  <div className="text-xs text-center">
	                    {player.money === aiPlayer.money
	                      ? 'Ranking: Tied'
	                      : player.money > aiPlayer.money
	                        ? `Ranking: You lead by $${(player.money - aiPlayer.money).toLocaleString()}`
	                        : `Ranking: ${aiPlayer.name} leads by $${(aiPlayer.money - player.money).toLocaleString()}`}
	                  </div>
	                </div>
	              </div>
	            )}
	            {gameState.selectedMode === 'ai' && gameSettings.winCondition === 'regions' && (
	              <div className="min-w-[260px]">
	                <div className="flex justify-between text-xs mb-1">
	                  <span>You: {playerControlledRegions}</span>
	                  <span>Majority: {REGION_CONTROL_MAJORITY}</span>
	                  <span>{aiPlayer.name}: {aiControlledRegions}</span>
	                </div>
	                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
	                  <div
	                    className="bg-blue-500 h-2 rounded-l-full"
	                    style={{ width: `${Math.min(100, (playerControlledRegions / TOTAL_REGION_COUNT) * 100)}%` }}
	                  />
	                </div>
	                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden mt-1">
	                  <div
	                    className="bg-pink-500 h-2 rounded-l-full"
	                    style={{ width: `${Math.min(100, (aiControlledRegions / TOTAL_REGION_COUNT) * 100)}%` }}
	                  />
	                </div>
	              </div>
	            )}
	          </div>
	        </div>

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
	              <div>
	                <div className="text-sm opacity-75">Controlling</div>
	                <div className="font-bold text-blue-400">
	                  {playerControlledRegions}/{TOTAL_REGION_COUNT} (${playerRegionInvested} invested)
	                </div>
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
	                  <div>
	                    <div className="text-sm opacity-75">AI Control</div>
	                    <div className="font-bold text-pink-400">
	                      {aiControlledRegions}/{TOTAL_REGION_COUNT} (${aiRegionInvested} invested)
	                    </div>
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

	          <button
	            onClick={() => updateUiState({ showResourceMarket: true })}
	            disabled={!isPlayerTurn}
	            className={actionButtonClass}
	          >
	            <span>🛍️</span>
	            <span>Resource Market</span>
	            <kbd className={actionButtonKbdClass}>M</kbd>
	          </button>

          <button
            onClick={() => updateUiState({ showWorkshop: true })}
            disabled={!isPlayerTurn}
            className={actionButtonClass}
          >
            <span>🔨</span>
            <span>Workshop</span>
            <kbd className={actionButtonKbdClass}>W</kbd>
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

          {gameSettings.advancedLoansEnabled && (
            <button
              onClick={() => updateUiState({ showAdvancedLoans: true })}
              disabled={!isPlayerTurn}
              className={actionButtonClass}
            >
              <span>🏦</span>
              <span>Loans</span>
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
            <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">H</kbd>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              const nextOpen = !uiState.showNegotiationCenter;
              setNegotiationCenterOpen(nextOpen);
            }}
            className={`${themeStyles.buttonSecondary} px-4 py-2 rounded-lg flex items-center space-x-2 relative`}
          >
            <span>🤝</span>
            <span>Negotiations</span>
            <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">N</kbd>
            {pendingNegotiationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {pendingNegotiationCount}
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

	            <div className="mb-4">
	              <div className="text-sm font-bold mb-2">🏳️ Region Control</div>
	              <div className={`${themeStyles.border} border rounded-lg p-3 space-y-2`}>
	                <div className="text-sm">
	                  Controller: <span className="font-bold">{currentRegionControllerName}</span>
	                  {currentRegionControlInfo.highestDeposit > 0 && (
	                    <span className="opacity-75"> (${currentRegionControlInfo.highestDeposit})</span>
	                  )}
	                </div>
	                <div className="text-xs opacity-75">
                    {gameSettings.negotiationMode
                      ? 'Negotiation Mode active: deposit bidding is frozen. Control transfers only via completed proposals.'
                      : 'Deposits are cumulative and spent. Highest total controls the region.'}
	                </div>
	                <div className="space-y-1 text-sm">
	                  {currentRegionControlInfo.entries.length === 0 ? (
	                    <div className="opacity-60">No deposits yet. Deposit $1 to claim control.</div>
	                  ) : (
	                    currentRegionControlInfo.entries.map(entry => (
	                      <div key={`${player.currentRegion}-${entry.playerId}`} className="flex justify-between">
	                        <span>{getControllerDisplayName(entry.playerId)}</span>
	                        <span className="font-semibold">${entry.amount}</span>
	                      </div>
	                    ))
	                  )}
	                </div>
	                {currentRegionControlInfo.controllerId && currentRegionControlInfo.controllerId !== 'player' && !gameSettings.negotiationMode && (
	                  <div className="text-xs text-yellow-300">
	                    Deposit at least ${currentRegionControlInfo.minimumPlayerDeposit} to take control.
	                  </div>
	                )}
	                <div className="flex items-center gap-2 pt-1">
	                  <input
	                    type="number"
	                    min="1"
	                    value={regionDepositInput}
	                    onChange={(e) => setRegionDepositInput(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
	                    className={`${themeStyles.input} rounded px-2 py-1 w-24 text-sm`}
                      disabled={gameSettings.negotiationMode}
	                  />
	                  <button
	                    onClick={handlePlayerRegionDeposit}
	                    disabled={!isPlayerTurn || gameSettings.negotiationMode}
	                    className={`${themeStyles.button} text-white px-3 py-1 rounded text-sm disabled:opacity-50`}
	                  >
                      {gameSettings.negotiationMode ? 'Use Negotiations' : 'Deposit Money'}
	                  </button>
	                  {gameSettings.allowCashOut && !gameSettings.negotiationMode && currentRegionControlInfo.controllerId === 'player' && currentRegionControlInfo.playerDeposit > 0 && (
	                    <button
	                      onClick={handlePlayerCashOutRegion}
	                      disabled={!isPlayerTurn}
	                      className={`${themeStyles.buttonSecondary} px-3 py-1 rounded text-sm disabled:opacity-50`}
	                    >
	                      Cash Out (50%)
	                    </button>
	                  )}
	                </div>
	                {gameSettings.allowCashOut && !gameSettings.negotiationMode && playerControlledRegionCodes.length > 0 && (
	                  <div className="pt-2 border-t border-gray-600 border-opacity-40">
	                    <div className="text-xs opacity-75 mb-1">Your Controlled Regions</div>
	                    <div className="space-y-1">
	                      {playerControlledRegionCodes.map(regionCode => {
	                        const info = getRegionControlInfo(regionCode);
	                        const deposit = info.playerDeposit;
	                        const refund = Math.floor(deposit * 0.5);
	                        return (
	                          <div key={`cashout-${regionCode}`} className="flex justify-between items-center text-xs">
	                            <span>{regionCode} (${deposit})</span>
	                            <button
	                              onClick={() => cashOutRegionPosition(regionCode, 'player', { consumeAction: true })}
	                              disabled={!isPlayerTurn}
	                              className={`${themeStyles.buttonSecondary} px-2 py-1 rounded disabled:opacity-50`}
	                            >
	                              Cash Out ${refund}
	                            </button>
	                          </div>
	                        );
	                      })}
	                    </div>
	                  </div>
	                )}
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
	                  const regionControlInfo = getRegionControlInfo(code);
	                  const isPlayerControlled = regionControlInfo.controllerId === 'player';
	                  const isAiControlled = regionControlInfo.controllerId === 'ai';
	                  
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
	                        className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm border-4 ${
	                          isPlayerHere
	                            ? 'border-green-500 bg-green-500 text-white animate-pulse'
	                            : isAiHere
	                            ? 'border-pink-500 bg-pink-500 text-white animate-pulse'
	                            : isPlayerControlled
	                            ? 'border-blue-400 bg-blue-600 text-white'
	                            : isAiControlled
	                            ? 'border-pink-400 bg-pink-600 text-white'
	                            : isAdjacent && canAfford
	                            ? 'border-yellow-500 bg-yellow-600 text-white hover:bg-yellow-500'
	                            : isPlayerVisited
	                            ? 'border-blue-500 bg-blue-500 text-white'
	                            : 'border-gray-500 bg-gray-700 text-gray-300'
	                        } ${themeStyles.shadow} ${hasEvent ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''} ${
	                          gameSettings.winCondition === 'regions' && isPlayerControlled ? 'ring-2 ring-blue-300' : ''
	                        }`}
	                      >
	                        {code}
	                        {regionControlInfo.highestDeposit > 0 && (
	                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] bg-black bg-opacity-75 px-1.5 py-0.5 rounded">
	                            ${regionControlInfo.highestDeposit}
	                          </div>
	                        )}
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
	                            <div className="mt-2 pt-1 border-t border-gray-500 border-opacity-40">
	                              <div className="font-semibold mb-1">Deposits</div>
	                              {regionControlInfo.entries.length === 0 ? (
	                                <div className="opacity-75">No deposits</div>
	                              ) : (
	                                regionControlInfo.entries.map(entry => (
	                                  <div key={`${code}-deposit-${entry.playerId}`} className="flex justify-between">
	                                    <span>{getControllerDisplayName(entry.playerId)}</span>
	                                    <span>${entry.amount}</span>
	                                  </div>
	                                ))
	                              )}
	                            </div>
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
	                  <div className="w-4 h-4 bg-blue-600 rounded-full border border-blue-300"></div>
	                  <span>Player-Controlled</span>
	                </div>
	                <div className="flex items-center space-x-2">
	                  <div className="w-4 h-4 bg-pink-600 rounded-full border border-pink-300"></div>
	                  <span>AI-Controlled</span>
	                </div>
	                <div className="flex items-center space-x-2">
	                  <div className="w-4 h-4 bg-gray-700 rounded-full border border-gray-400"></div>
	                  <span>Uncontrolled</span>
	                </div>
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

	              {gameSettings.winCondition === 'regions' && gameState.selectedMode === 'ai' && (
	                <div className={`${themeStyles.border} border rounded-lg p-3 mt-4`}>
	                  <div className="flex justify-between text-sm mb-2">
	                    <span className="font-semibold">Majority Progress</span>
	                    <span>{REGION_CONTROL_MAJORITY} needed</span>
	                  </div>
	                  <div className="grid grid-cols-2 gap-2 text-xs">
	                    <div className="bg-blue-900 bg-opacity-40 rounded p-2">
	                      <div>You: {playerControlledRegions}/{TOTAL_REGION_COUNT}</div>
	                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
	                        <div
	                          className="bg-blue-500 h-2 rounded-full"
	                          style={{ width: `${Math.min(100, (playerControlledRegions / REGION_CONTROL_MAJORITY) * 100)}%` }}
	                        />
	                      </div>
	                    </div>
	                    <div className="bg-pink-900 bg-opacity-40 rounded p-2">
	                      <div>{aiPlayer.name}: {aiControlledRegions}/{TOTAL_REGION_COUNT}</div>
	                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
	                        <div
	                          className="bg-pink-500 h-2 rounded-full"
	                          style={{ width: `${Math.min(100, (aiControlledRegions / REGION_CONTROL_MAJORITY) * 100)}%` }}
	                        />
	                      </div>
	                    </div>
	                  </div>
	                </div>
	              )}
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
	                <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">G</kbd>
	              </button>
	            </div>
	          )}
	        </div>
	        
	        <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-4 mt-4 ${themeStyles.shadow}`}>
	          {gameSettings.winCondition === 'money' ? (
	            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
	              <div className={`${themeStyles.border} border rounded-lg p-3`}>
	                <div className="opacity-75 mb-1">Inventory Value</div>
	                <div className="font-bold text-green-400">${getInventoryValue.toLocaleString()}</div>
	              </div>
	              <div className={`${themeStyles.border} border rounded-lg p-3`}>
	                <div className="opacity-75 mb-1">Crafted Items</div>
	                <div className="font-bold text-yellow-400">{craftedItemCount}</div>
	              </div>
	              <div className={`${themeStyles.border} border rounded-lg p-3`}>
	                <div className="opacity-75 mb-1">Passive Income</div>
	                <div className="font-bold text-blue-400">${playerInvestmentSummary.totalIncome}/day</div>
	              </div>
	            </div>
	          ) : (
	            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
	              <div className={`${themeStyles.border} border rounded-lg p-3`}>
	                <div className="opacity-75 mb-1">Your Regions</div>
	                <div className="font-bold text-blue-400">{playerControlledRegions}/{TOTAL_REGION_COUNT}</div>
	              </div>
	              <div className={`${themeStyles.border} border rounded-lg p-3`}>
	                <div className="opacity-75 mb-1">Majority Progress</div>
	                <div className="font-bold text-yellow-400">{Math.max(0, REGION_CONTROL_MAJORITY - playerControlledRegions)} needed</div>
	              </div>
	              <div className={`${themeStyles.border} border rounded-lg p-3`}>
	                <div className="opacity-75 mb-1">{gameSettings.negotiationMode ? 'Current Region Status' : 'Current Region Cost To Take'}</div>
	                <div className="font-bold text-pink-400">
                    {gameSettings.negotiationMode
                      ? (currentRegionControlInfo.controllerId === 'player'
                        ? 'You control via negotiation'
                        : `Negotiate with ${getControllerDisplayName(currentRegionControlInfo.controllerId)}`)
                      : `$${currentRegionControlInfo.minimumPlayerDeposit}`}
	                </div>
	              </div>
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
        {renderNegotiationCenter()}
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
	                <h3 className="text-xl font-bold">💰 Sell Market</h3>
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
	                  Close Sell Market
	                </button>
	              </div>
	            </div>
          </div>
	        )}

	        {/* Resource Purchase Market Modal (V5.0) */}
	        {uiState.showResourceMarket && (
	          <div
	            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
	            onClick={() => updateUiState({ showResourceMarket: false })}
	          >
	            <div
	              className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-3xl w-full h-[85vh] flex flex-col overflow-hidden`}
	              onClick={(e) => e.stopPropagation()}
	            >
	              <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
	                <div>
	                  <h3 className="text-xl font-bold">🛍️ Resource Market</h3>
	                  <div className="text-xs opacity-75 mt-1">Unlimited supply. Buy any resource for crafting anytime.</div>
	                </div>
	                <button
	                  onClick={() => updateUiState({ showResourceMarket: false })}
	                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
	                >
	                  ✕
	                </button>
	              </div>

	              <div className={`flex-1 overflow-y-scroll p-6 pt-4 ${themeStyles.scrollbar}`} style={{ maxHeight: 'calc(85vh - 180px)', overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}>
	                <div className={`${themeStyles.border} border rounded-lg p-3 mb-4`}>
	                  <div className="flex flex-wrap justify-between gap-2 text-sm">
	                    <div>
	                      <span className="opacity-75">Your Money:</span> <span className="font-bold text-green-400">${player.money}</span>
	                    </div>
	                    <div>
	                      <span className="opacity-75">Inventory:</span> <span className="font-bold">{player.inventory.length}/{MAX_INVENTORY}</span>
	                    </div>
	                    <div>
	                      <span className="opacity-75">Current Region:</span> <span className="font-bold">{REGIONS[player.currentRegion]?.name}</span>
	                    </div>
	                  </div>
	                </div>

	                <div className={`${themeStyles.border} border rounded-lg p-4 mb-4`}>
	                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
	                    <div className="md:col-span-2">
	                      <label className="block text-sm font-semibold mb-1">Resource</label>
	                      <select
	                        value={resourceMarketSelection}
	                        onChange={(e) => setResourceMarketSelection(e.target.value)}
	                        className={`${themeStyles.select} rounded px-3 py-2 w-full`}
	                      >
	                        {RESOURCE_MARKET_RESOURCES.map(resource => (
	                          <option key={resource} value={resource}>
	                            {resource} (${getResourceMarketPrice(resource)})
	                          </option>
	                        ))}
	                      </select>
	                    </div>
	                    <div>
	                      <label className="block text-sm font-semibold mb-1">Quantity</label>
	                      <input
	                        type="number"
	                        min="1"
	                        max={Math.max(1, MAX_INVENTORY - player.inventory.length)}
	                        value={resourceMarketQuantity}
	                        onChange={(e) => setResourceMarketQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
	                        className={`${themeStyles.input} rounded px-3 py-2 w-full`}
	                      />
	                    </div>
	                  </div>
	                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
	                    <div className="text-sm">
	                      Cost: <span className="font-bold text-yellow-400">${getResourceMarketPrice(resourceMarketSelection) * Math.max(1, resourceMarketQuantity)}</span>
	                    </div>
	                    <button
	                      onClick={handlePlayerResourceMarketPurchase}
	                      disabled={!isPlayerTurn}
	                      className={`${themeStyles.button} text-white px-4 py-2 rounded disabled:opacity-50`}
	                    >
	                      Buy Selected
	                    </button>
	                  </div>
	                </div>

	                <div className="space-y-3">
	                  {RESOURCE_MARKET_RESOURCES.map(resource => {
	                    const price = getResourceMarketPrice(resource);
	                    const category = RESOURCE_CATEGORIES[resource] || 'industrial';
	                    return (
	                      <div key={resource} className={`${themeStyles.border} border rounded-lg p-3`}>
	                        <div className="flex flex-wrap items-center justify-between gap-2">
	                          <div>
	                            <div className="font-bold">{resource}</div>
	                            <div className="text-xs opacity-75 capitalize">{category} resource</div>
	                          </div>
	                          <div className="text-right">
	                            <div className="font-bold text-green-400">${price} each</div>
	                            <div className="flex gap-1 mt-1">
	                              <button
	                                onClick={() => buyResourceFromMarket(resource, 1, 'player', { consumeAction: true })}
	                                disabled={!isPlayerTurn}
	                                className={`${themeStyles.buttonSecondary} px-2 py-1 rounded text-xs disabled:opacity-50`}
	                              >
	                                Buy 1
	                              </button>
	                              <button
	                                onClick={() => buyResourceFromMarket(resource, 5, 'player', { consumeAction: true })}
	                                disabled={!isPlayerTurn}
	                                className={`${themeStyles.button} text-white px-2 py-1 rounded text-xs disabled:opacity-50`}
	                              >
	                                Buy 5
	                              </button>
	                            </div>
	                          </div>
	                        </div>
	                      </div>
	                    );
	                  })}
	                </div>
	              </div>

	              <div className={`p-6 pt-4 border-t ${themeStyles.border}`}>
	                <button
	                  onClick={() => updateUiState({ showResourceMarket: false })}
	                  className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}
	                >
	                  Close Resource Market
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

        {/* Workshop Modal (Crafting System) */}
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
                <div>
                  <h3 className="text-xl font-bold">🔨 Crafting Workshop</h3>
                  {player.character.craftingBonus && (
                    <div className="text-xs text-green-400 mt-1">
                      {player.character.name} Bonus: {player.character.craftingBonus.description}
                    </div>
                  )}
                </div>
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
                <div className={`${themeStyles.border} border rounded-lg p-3 mb-4 text-sm`}>
                  <div className="font-bold mb-2">How Crafting Works:</div>
                  <ul className="space-y-1 text-xs opacity-90">
                    <li>• Combine raw materials to create valuable items</li>
                    <li>• Crafted items are worth 1.5-2x their materials</li>
                    <li>• 90% base success rate (10% chance to lose materials)</li>
                    <li>• Each craft consumes actions equal to craft time</li>
                    <li>• Character bonuses affect crafting outcomes</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  {CRAFTING_RECIPES.map(recipe => {
                    const canCraft = canCraftRecipe(recipe, player.inventory);
                    const materialsList = Object.entries(recipe.inputs).map(([resource, count]) => {
                      const available = player.inventory.filter(item => item === resource).length;
                      const hasEnough = available >= (count as number);
                      return (
                        <div key={resource} className={`text-xs ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                          {resource}: {available}/{count}
                        </div>
                      );
                    });

                    const categoryColor = {
                      luxury: 'from-purple-600 to-pink-600',
                      food: 'from-green-600 to-emerald-600',
                      tourism: 'from-blue-600 to-cyan-600',
                      industrial: 'from-gray-600 to-slate-600',
                      goods: 'from-yellow-600 to-orange-600',
                      energy: 'from-red-600 to-orange-600'
                    }[recipe.category] || 'from-gray-600 to-gray-700';

                    const isTourismWithBonus =
                      recipe.category === 'tourism' &&
                      player.character.craftingBonus?.effect?.categorySpeedBonus?.tourism === 1.0;

                    return (
                      <div key={recipe.id} className={`${themeStyles.border} border rounded-lg p-4`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-bold text-lg">{recipe.name}</div>
                              <div className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${categoryColor} text-white`}>
                                {recipe.category}
                              </div>
                            </div>
                            <div className="text-sm opacity-75 mb-3">{recipe.description}</div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs font-bold mb-1">Required Materials:</div>
                                {materialsList}
                              </div>
                              <div>
                                <div className="text-xs font-bold mb-1">Output:</div>
                                <div className="text-sm text-green-400">{recipe.output}</div>
                                <div className="text-xs opacity-75">Value: ~${recipe.baseValue}</div>
                                <div className="text-xs opacity-75">
                                  Actions: {isTourismWithBonus ? '0 (Tourist bonus!)' : recipe.craftTime}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => craftItem(recipe.id)}
                              disabled={!isPlayerTurn || !canCraft || player.inventory.length >= MAX_INVENTORY}
                              className={`${themeStyles.button} text-white px-4 py-2 rounded font-bold disabled:opacity-50 whitespace-nowrap`}
                            >
                              {canCraft ? 'Craft' : 'Missing Materials'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {player.inventory.length === 0 && (
                  <div className="text-center py-8 opacity-60">
                    No materials available. Collect resources first!
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

        {/* Advanced Loans Modal */}
        {uiState.showAdvancedLoans && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden"
            onClick={() => updateUiState({ showAdvancedLoans: false })}
          >
            <div
              className={`${themeStyles.card} ${themeStyles.border} border rounded-xl max-w-3xl w-full flex flex-col overflow-hidden`}
              style={{ height: '85vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex justify-between items-center p-6 pb-4 border-b ${themeStyles.border}`}>
                <div>
                  <h3 className="text-xl font-bold">🏦 Advanced Loans</h3>
                  {gameSettings.creditScoreEnabled && (
                    <div className="text-sm mt-1">
                      Credit Score: <span style={{ color: getCreditScoreRange(player.creditScore || 50).color }} className="font-bold">{player.creditScore || 50}</span> ({getCreditScoreRange(player.creditScore || 50).label})
                    </div>
                  )}
                </div>
                <button
                  onClick={() => updateUiState({ showAdvancedLoans: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
                  aria-label="Close"
                  title="Close"
                >
                  X
                </button>
              </div>
              <div className={`flex-1 min-h-0 overflow-y-auto p-6 pt-4 ${themeStyles.scrollbar}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                {/* Active Loans Section */}
                {(player.advancedLoans || []).length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-3">Active Loans</h4>
                    <div className="space-y-2">
                      {(player.advancedLoans || []).map((loan: any) => {
                        const tier = LOAN_TIERS.find(t => t.id === loan.tierId);
                        const totalOwed = loan.amount + loan.accrued;
                        const earlyOwed = gameSettings.earlyRepaymentEnabled ? loan.amount + (loan.accrued * 0.5) : totalOwed;
                        return (
                          <div key={loan.id} className={`${themeStyles.border} border rounded-lg p-3`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-bold">{tier?.name || 'Loan'}</div>
                                <div className="text-sm opacity-75">Principal: ${loan.amount} | Interest: ${Math.floor(loan.accrued)}</div>
                                <div className="text-xs opacity-75">{loan.daysRemaining} days remaining</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-red-400">${Math.floor(totalOwed)}</div>
                                <div className="space-x-2 mt-2">
                                  <button
                                    onClick={() => repayAdvancedLoan(loan.id, false)}
                                    disabled={player.money < totalOwed}
                                    className={`${themeStyles.button} text-white px-2 py-1 rounded text-xs disabled:opacity-50`}
                                  >
                                    Repay
                                  </button>
                                  {gameSettings.earlyRepaymentEnabled && loan.daysRemaining > 0 && (
                                    <button
                                      onClick={() => repayAdvancedLoan(loan.id, true)}
                                      disabled={player.money < earlyOwed}
                                      className={`${themeStyles.accent} text-white px-2 py-1 rounded text-xs disabled:opacity-50`}
                                      title={`Early: $${Math.floor(earlyOwed)} (50% off interest)`}
                                    >
                                      Early ${Math.floor(earlyOwed)}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Available Loans Section */}
                <h4 className="font-bold text-lg mb-3">Available Loans</h4>
                <div className="space-y-3">
                  {LOAN_TIERS.map(tier => {
                    const creditRange = getCreditScoreRange(player.creditScore || 50);
                    const actualRate = tier.baseInterestRate * creditRange.multiplier;
                    const meetsLevel = player.level >= tier.levelRequired;
                    const underLimit = (player.advancedLoans || []).length < gameSettings.maxSimultaneousLoans;
                    return (
                      <div key={tier.id} className={`${themeStyles.border} border rounded-lg p-4`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold">{tier.name}</div>
                            <div className="text-sm opacity-75">{tier.description}</div>
                            <div className="text-xs opacity-75 mt-1">
                              Amount: ${tier.amount} | Interest: {Math.floor(actualRate * 100)}% | Term: {tier.term} days
                            </div>
                            {!meetsLevel && <div className="text-xs text-yellow-400 mt-1">Requires Level {tier.levelRequired}</div>}
                            {!underLimit && <div className="text-xs text-red-400 mt-1">Max loans reached</div>}
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-bold text-green-500">+${tier.amount}</div>
                            <button
                              onClick={() => takeAdvancedLoan(tier.id)}
                              disabled={!meetsLevel || !underLimit}
                              className={`${themeStyles.button} text-white px-3 py-1 rounded mt-2 text-sm disabled:opacity-50`}
                            >
                              Take Loan
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
                  onClick={() => updateUiState({ showAdvancedLoans: false })}
                  className={`${themeStyles.button} text-white px-6 py-3 rounded-lg w-full font-bold`}
                >
                  Close
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
	            {Object.entries(KEYBOARD_SHORTCUTS)
	              .filter(([key]) => key !== 'ctrl+shift+c')
	              .map(([key, shortcut]) => (
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
	            {gameSettings.notificationClearShortcut !== 'disabled' && (
	              <div className={`${themeStyles.border} border rounded p-3`}>
	                <div className="flex items-center justify-between">
	                  <div>
	                    <div className="font-bold">Clear Notifications</div>
	                    <div className="text-sm opacity-75">Clear all notifications</div>
	                  </div>
	                  <kbd className="px-3 py-1 bg-gray-700 rounded text-sm font-mono">
	                    {gameSettings.notificationClearShortcut.toUpperCase()}
	                  </kbd>
	                </div>
	              </div>
	            )}
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

  const renderNegotiationCenter = () => {
    if (!uiState.showNegotiationCenter) return null;

    const center = gameState.negotiationCenter || createDefaultNegotiationCenterState();
    const proposals = Array.isArray(gameState.proposals) ? gameState.proposals : [];
    const activeProposals = proposals.filter(proposal => proposal.status === 'accepted');
    const incomingPending = proposals.filter(proposal => proposal.status === 'pending' && proposal.to === 'player');
    const outgoingPending = proposals.filter(proposal => proposal.status === 'pending' && proposal.from === 'player');
    const historyItems = proposals.filter(proposal => proposal.status === 'completed' || proposal.status === 'cancelled').slice(-100);
    const draft = center.draftProposal || {};
    const draftTermDetails = draft.termDetails || {};
    const allChallenges = Object.entries(REGIONS).flatMap(([regionCode, region]: [string, any]) =>
      (region.challenges || []).map((challenge: any) => ({
        name: challenge.name,
        difficulty: challenge.difficulty,
        reward: challenge.reward,
        regionCode
      }))
    );
    const draftTermValue = draft.region
      ? getProposalTermValue({
        id: 'draft',
        from: 'player',
        to: (draft.to as string) || 'ai',
        region: draft.region as string,
        status: 'pending',
        termType: ((draft.termType as ProposalTermType) || 'cash'),
        termDetails: draftTermDetails,
        timestamp: Date.now()
      } as Proposal)
      : 0;
    const draftRegionValue = draft.region ? estimateRegionValue(draft.region as string) : 0;
    const acceptanceProbability = draftRegionValue > 0
      ? Math.max(5, Math.min(95, Math.round((draftTermValue / draftRegionValue) * 100)))
      : 35;
    const pendingBadge = center.pendingProposalsCount || 0;
    const logEntries = (gameState.negotiationLogs || [])
      .slice()
      .reverse()
      .filter(entry => {
        const query = negotiationLogSearch.trim().toLowerCase();
        if (!query) return true;
        return (
          entry.details.toLowerCase().includes(query) ||
          entry.region.toLowerCase().includes(query) ||
          entry.eventType.toLowerCase().includes(query)
        );
      });

    const close = () => setNegotiationCenterOpen(false);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center p-4 z-50 overflow-y-auto" onClick={close}>
        <div
          className={`${themeStyles.card} ${themeStyles.border} border rounded-xl w-full max-w-6xl flex flex-col`}
          style={{ maxHeight: 'calc(100vh - 2rem)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-5 border-b ${themeStyles.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">🤝 Negotiation Center</h3>
                <div className="text-sm opacity-75">
                  {gameSettings.negotiationMode ? 'Proposal mode active.' : 'Negotiation mode disabled (enable in Settings).'}
                </div>
              </div>
              <button onClick={close} className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}>✕</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {(['active', 'pending', 'create', 'history', 'settings', 'logs'] as Array<NegotiationCenterState['activeTab']>).map(tab => (
                <button
                  key={tab}
                  onClick={() => setNegotiationCenterTab(tab)}
                  className={`px-3 py-1.5 rounded text-sm font-semibold ${center.activeTab === tab ? themeStyles.button : themeStyles.buttonSecondary}`}
                >
                  {tab === 'pending' ? `pending (${pendingBadge})` : tab}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`flex-1 overflow-y-auto p-5 ${themeStyles.scrollbar}`}
            style={{ minHeight: 0 }}
          >
            {center.activeTab === 'active' && (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    activeProposals.forEach(proposal => {
                      const actor = proposal.from === 'player' ? player : aiPlayer;
                      const ready = getProposalProgress(proposal, actor).completable || proposal.termType === 'custom';
                      if (ready) completeProposalManually(proposal.id);
                    });
                  }}
                  className={`${themeStyles.button} text-white px-3 py-1 rounded text-sm`}
                >
                  Complete All Ready
                </button>
                {activeProposals.length === 0 ? <div className="opacity-70 text-sm">No active proposals.</div> : activeProposals.map(proposal => {
                  const actor = proposal.from === 'player' ? player : aiPlayer;
                  const progress = getProposalProgress(proposal, actor);
                  return (
                    <div key={proposal.id} className={`${themeStyles.border} border rounded-lg p-3`}>
                      <div className="font-semibold">{REGIONS[proposal.region]?.name || proposal.region}</div>
                      <div className="text-xs opacity-75">{getControllerDisplayName(proposal.from)} ↔ {getControllerDisplayName(proposal.to)} | {proposal.termType}</div>
                      <div className="text-xs mt-1">Progress: {progress.progress}%</div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress.progress}%` }} /></div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => completeProposalManually(proposal.id)} disabled={!(progress.completable || proposal.termType === 'custom')} className={`${themeStyles.button} text-white px-2 py-1 rounded text-xs disabled:opacity-50`}>Complete Task</button>
                        <button onClick={() => cancelProposal(proposal.id)} className={`${themeStyles.buttonSecondary} px-2 py-1 rounded text-xs`}>Cancel</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {center.activeTab === 'pending' && (
              <div className="space-y-4">
                <div className={`${themeStyles.border} border rounded-lg p-3`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold">Incoming ({incomingPending.length})</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => incomingPending.forEach(proposal => {
                          const favorable = getProposalTermValue(proposal) >= Math.floor(estimateRegionValue(proposal.region) * 0.7);
                          if (favorable) respondToProposal(proposal.id, 'accept');
                        })}
                        className={`${themeStyles.button} text-white px-2 py-1 rounded text-xs`}
                      >
                        Accept All Favorable
                      </button>
                      <button onClick={() => incomingPending.forEach(proposal => respondToProposal(proposal.id, 'decline'))} className={`${themeStyles.buttonSecondary} px-2 py-1 rounded text-xs`}>Decline All</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {incomingPending.map(proposal => (
                      <div key={proposal.id} className={`${themeStyles.border} border rounded p-2`}>
                        <div className="font-semibold">{getControllerDisplayName(proposal.from)} requests {REGIONS[proposal.region]?.name || proposal.region}</div>
                        <div className="text-xs opacity-75">Value ${getProposalTermValue(proposal)} | {proposal.termType}</div>
                        {proposal.aiReasoning ? <div className="text-xs opacity-75 mt-1">{proposal.aiReasoning}</div> : null}
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => respondToProposal(proposal.id, 'accept')} className={`${themeStyles.button} text-white px-2 py-1 rounded text-xs`}>Accept</button>
                          <button onClick={() => respondToProposal(proposal.id, 'decline')} className={`${themeStyles.buttonSecondary} px-2 py-1 rounded text-xs`}>Decline</button>
                          <button
                            onClick={() => {
                              updateNegotiationDraft({
                                to: proposal.from,
                                region: proposal.region,
                                termType: 'cash',
                                termDetails: { cashAmount: Math.max(50, Math.floor(getProposalTermValue(proposal) * 0.8)) },
                                counterProposalOf: proposal.id
                              });
                              setNegotiationCenterTab('create');
                            }}
                            className={`${themeStyles.buttonSecondary} px-2 py-1 rounded text-xs`}
                          >
                            Counter
                          </button>
                        </div>
                      </div>
                    ))}
                    {incomingPending.length === 0 && <div className="text-sm opacity-70">No incoming proposals.</div>}
                  </div>
                </div>
                <div className={`${themeStyles.border} border rounded-lg p-3`}>
                  <h4 className="font-bold mb-2">Outgoing ({outgoingPending.length})</h4>
                  <div className="space-y-2">
                    {outgoingPending.map(proposal => (
                      <div key={proposal.id} className={`${themeStyles.border} border rounded p-2`}>
                        <div className="font-semibold">{REGIONS[proposal.region]?.name || proposal.region} → {getControllerDisplayName(proposal.to)}</div>
                        <div className="text-xs opacity-75">Awaiting response</div>
                        <button onClick={() => cancelProposal(proposal.id)} className={`${themeStyles.buttonSecondary} px-2 py-1 rounded text-xs mt-2`}>Cancel Proposal</button>
                      </div>
                    ))}
                    {outgoingPending.length === 0 && <div className="text-sm opacity-70">No outgoing proposals.</div>}
                  </div>
                </div>
              </div>
            )}

            {center.activeTab === 'create' && (
              <div className="space-y-4">
                <div className={`${themeStyles.border} border rounded-lg p-3`}>
                  <div className="font-bold mb-2">Step 1: Target</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select value={(draft.region as string) || player.currentRegion} onChange={(e) => updateNegotiationDraft({ region: e.target.value })} className={`${themeStyles.select} rounded px-3 py-2`}>
                      {Object.keys(REGIONS).map(regionCode => (
                        <option key={regionCode} value={regionCode}>{regionCode} - {REGIONS[regionCode].name}</option>
                      ))}
                    </select>
                    <select value={(draft.to as string) || 'ai'} onChange={(e) => updateNegotiationDraft({ to: e.target.value })} className={`${themeStyles.select} rounded px-3 py-2`}>
                      <option value="ai">{aiPlayer.name}</option>
                    </select>
                  </div>
                </div>

                <div className={`${themeStyles.border} border rounded-lg p-3`}>
                  <div className="font-bold mb-2">Step 2: Terms</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(['cash', 'resources', 'quest', 'hybrid', 'custom'] as ProposalTermType[]).map(term => (
                      <button key={term} onClick={() => updateNegotiationDraft({ termType: term })} className={`px-2 py-1 rounded text-xs ${((draft.termType as ProposalTermType) || 'cash') === term ? themeStyles.button : themeStyles.buttonSecondary}`}>{term}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className={`${themeStyles.border} border rounded p-2`}>
                      <div className="font-semibold mb-1">Cash</div>
                      <input type="number" min="0" value={Math.floor(Number(draftTermDetails.cashAmount) || 0)} onChange={(e) => updateNegotiationDraft({ termDetails: { ...draftTermDetails, cashAmount: Math.max(0, Math.floor(Number(e.target.value) || 0)) } })} className={`${themeStyles.input} rounded px-2 py-1 w-full`} />
                    </div>
                    <div className={`${themeStyles.border} border rounded p-2`}>
                      <div className="font-semibold mb-1">Resources</div>
                      <div className="flex gap-2">
                        <select value={proposalResourceSelection} onChange={(e) => setProposalResourceSelection(e.target.value)} className={`${themeStyles.select} rounded px-2 py-1 flex-1`}>
                          {RESOURCE_MARKET_RESOURCES.map(resource => <option key={resource} value={resource}>{resource}</option>)}
                        </select>
                        <input type="number" min="1" value={proposalResourceQuantity} onChange={(e) => setProposalResourceQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))} className={`${themeStyles.input} rounded px-2 py-1 w-20`} />
                        <button onClick={() => {
                          const resources = { ...(draftTermDetails.resources || {}) };
                          resources[proposalResourceSelection] = proposalResourceQuantity;
                          updateNegotiationDraft({ termDetails: { ...draftTermDetails, resources } });
                        }} className={`${themeStyles.button} text-white px-2 py-1 rounded text-xs`}>Add</button>
                      </div>
                    </div>
                    <div className={`${themeStyles.border} border rounded p-2`}>
                      <div className="font-semibold mb-1">Quest Challenges</div>
                      <div className="flex gap-2">
                        <select value={proposalChallengeSelection} onChange={(e) => setProposalChallengeSelection(e.target.value)} className={`${themeStyles.select} rounded px-2 py-1 flex-1`}>
                          {allChallenges.map(challenge => <option key={`${challenge.regionCode}-${challenge.name}`} value={challenge.name}>{challenge.name} ({challenge.regionCode})</option>)}
                        </select>
                        <button onClick={() => updateNegotiationDraft({ termDetails: { ...draftTermDetails, challengeNames: Array.from(new Set([...(draftTermDetails.challengeNames || []), proposalChallengeSelection])) } })} className={`${themeStyles.button} text-white px-2 py-1 rounded text-xs`}>Add</button>
                      </div>
                    </div>
                    <div className={`${themeStyles.border} border rounded p-2`}>
                      <div className="font-semibold mb-1">Custom Terms (manual)</div>
                      <textarea value={String(draftTermDetails.customText || '')} maxLength={500} onChange={(e) => updateNegotiationDraft({ termDetails: { ...draftTermDetails, customText: e.target.value.slice(0, 500) } })} className={`${themeStyles.input} rounded px-2 py-1 w-full h-20`} />
                    </div>
                  </div>
                </div>

                <div className={`${themeStyles.border} border rounded-lg p-3`}>
                  <div className="font-bold mb-2">Step 3: Preview & Send</div>
                  <div className="text-sm">
                    <div>Term value: ${draftTermValue}</div>
                    <div>Region value: ${draftRegionValue}</div>
                    <div>AI acceptance probability: {acceptanceProbability}%</div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => {
                      const success = createProposal({
                        to: (draft.to as string) || 'ai',
                        region: (draft.region as string) || player.currentRegion,
                        termType: ((draft.termType as ProposalTermType) || 'cash'),
                        termDetails: draftTermDetails,
                        customText: draftTermDetails.customText
                      });
                      if (success) setNegotiationCenterTab('pending');
                    }} className={`${themeStyles.button} text-white px-3 py-1 rounded text-sm`}>Send Proposal</button>
                    <button onClick={() => setNegotiationCenterTab('pending')} className={`${themeStyles.buttonSecondary} px-3 py-1 rounded text-sm`}>Back</button>
                  </div>
                </div>
              </div>
            )}

            {center.activeTab === 'history' && (
              <div className="space-y-3">
                <input value={negotiationHistorySearch} onChange={(e) => setNegotiationHistorySearch(e.target.value)} placeholder="Search history..." className={`${themeStyles.input} rounded px-3 py-2 w-full`} />
                <div className={`${themeStyles.border} border rounded-lg p-3 space-y-2`}>
                  {historyItems
                    .filter(proposal => {
                      const query = negotiationHistorySearch.trim().toLowerCase();
                      if (!query) return true;
                      return (
                        proposal.region.toLowerCase().includes(query) ||
                        proposal.from.toLowerCase().includes(query) ||
                        proposal.to.toLowerCase().includes(query) ||
                        proposal.termType.toLowerCase().includes(query)
                      );
                    })
                    .map(proposal => (
                      <div key={proposal.id} className={`${themeStyles.border} border rounded p-2 text-sm`}>
                        <div className="flex justify-between">
                          <span>{REGIONS[proposal.region]?.name || proposal.region}</span>
                          <span>{proposal.status === 'completed' ? '✓ Completed' : '✗ Cancelled'}</span>
                        </div>
                        <div className="text-xs opacity-75">{getControllerDisplayName(proposal.from)} ↔ {getControllerDisplayName(proposal.to)} | {proposal.termType}</div>
                      </div>
                    ))}
                </div>
                <div className={`${themeStyles.border} border rounded-lg p-3 text-sm`}>
                  <div className="font-bold mb-2">Statistics</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>Sent: <span className="font-bold">{gameState.negotiationStats?.totalSent || 0}</span></div>
                    <div>Received: <span className="font-bold">{gameState.negotiationStats?.totalReceived || 0}</span></div>
                    <div>Accepted: <span className="font-bold">{gameState.negotiationStats?.accepted || 0}</span></div>
                    <div>Completed: <span className="font-bold">{gameState.negotiationStats?.completed || 0}</span></div>
                  </div>
                </div>
              </div>
            )}

            {center.activeTab === 'settings' && (
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={gameSettings.negotiationMode} onChange={(e) => setGameSettings(prev => ({ ...prev, negotiationMode: e.target.checked }))} />
                  <span>Enable Negotiation Mode</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={gameSettings.negotiationOptions.suggestCounterOffers} onChange={(e) => setGameSettings(prev => ({ ...prev, negotiationOptions: { ...prev.negotiationOptions, suggestCounterOffers: e.target.checked } }))} />
                  <span>Suggest Counter-Offers</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={gameSettings.negotiationOptions.autoCompleteReadyTasks} onChange={(e) => setGameSettings(prev => ({ ...prev, negotiationOptions: { ...prev.negotiationOptions, autoCompleteReadyTasks: e.target.checked } }))} />
                  <span>Auto-Complete Ready Tasks</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={gameSettings.negotiationOptions.confirmExpensiveTasks} onChange={(e) => setGameSettings(prev => ({ ...prev, negotiationOptions: { ...prev.negotiationOptions, confirmExpensiveTasks: e.target.checked } }))} />
                  <span>Confirm Expensive Tasks (&gt;$500)</span>
                </label>
                <div>
                  <label className="block mb-1">Proposal Expiration (turns): {gameSettings.negotiationOptions.proposalExpirationTurns}</label>
                  <input type="range" min="0" max="15" value={gameSettings.negotiationOptions.proposalExpirationTurns} onChange={(e) => setGameSettings(prev => ({ ...prev, negotiationOptions: { ...prev.negotiationOptions, proposalExpirationTurns: Math.max(0, Math.floor(Number(e.target.value) || 0)) } }))} className="w-full" />
                </div>
              </div>
            )}

            {center.activeTab === 'logs' && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <input value={negotiationLogSearch} onChange={(e) => setNegotiationLogSearch(e.target.value)} placeholder="Search logs..." className={`${themeStyles.input} rounded px-3 py-2 flex-1`} />
                  <button onClick={() => exportNegotiationLogs(false)} className={`${themeStyles.buttonSecondary} px-3 py-2 rounded text-sm`}>Export Full Log</button>
                  <button onClick={() => exportNegotiationLogs(true)} className={`${themeStyles.buttonSecondary} px-3 py-2 rounded text-sm`}>Export AI Decisions</button>
                </div>
                <div
                  className={`${themeStyles.border} border rounded-lg p-3 overflow-y-auto`}
                  style={{ maxHeight: 'calc(100vh - 18rem)' }}
                >
                  {logEntries.map(entry => (
                    <div key={entry.id} className={`${themeStyles.border} border rounded p-2 text-sm mb-2 break-words`}>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold break-words">{entry.eventType.replace(/_/g, ' ')}</span>
                        <span className="text-xs opacity-75 shrink-0">Turn {entry.turn} • {new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-xs opacity-75 break-words">{entry.from} → {entry.to} | {REGIONS[entry.region]?.name || entry.region}</div>
                      <div className="break-words">{entry.details}</div>
                      {entry.reasoning ? <div className="text-xs opacity-75 mt-1 break-words">Reasoning: {entry.reasoning}</div> : null}
                    </div>
                  ))}
                  {logEntries.length === 0 && <div className="opacity-70 text-sm">No log entries yet.</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Notification History Modal
	  const renderNotificationHistory = () => {
	    if (!uiState.showNotifications) return null;
	    
	    const filteredNotifications = notifications
	      .filter(n => gameSettings.notificationSettings.typeFilters[n.notificationType || 'system'])
	      .filter(n => uiState.notificationFilter === 'all' || n.type === uiState.notificationFilter);
	    const orderedNotifications = gameSettings.notificationSettings.stackOrder === 'newest-first'
	      ? [...filteredNotifications].reverse()
	      : filteredNotifications;
    
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
	                onClick={() => clearAllNotifications()}
	                className={`${themeStyles.error} text-white px-4 py-2 rounded mt-3 text-sm w-full`}
	              >
	                Clear All ({notifications.length})
	              </button>
	            )}
          </div>

          {/* Scrollable Notifications List */}
          <div className={`flex-1 overflow-y-scroll p-6 pt-4 ${themeStyles.scrollbar}`} style={{ maxHeight: 'calc(90vh - 280px)', overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}>
            <div className="space-y-2">
	            {orderedNotifications.length === 0 ? (
	              <div className="text-center py-8 opacity-60">
	                No notifications yet
	              </div>
	            ) : (
	              orderedNotifications.map(notification => {
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
	    const outcome = evaluateWinConditionOutcome();
	    const won = outcome.playerWon;
	    
	    return (
	      <div className={`min-h-screen ${themeStyles.background} ${themeStyles.text} flex items-center justify-center p-6`}>
	        <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-8 max-w-md w-full text-center ${themeStyles.shadow}`}>
	          <div className="text-6xl mb-4">{won ? '🏆' : '😔'}</div>
	          <h2 className="text-3xl font-bold mb-4">{won ? 'Victory!' : 'Defeat'}</h2>
	          
	          <div className="space-y-2 mb-6">
	            <div className="text-sm opacity-75 mb-2">
	              {gameSettings.winCondition === 'regions'
	                ? `Win Condition: Most Controlled Regions (${REGION_CONTROL_MAJORITY}/${TOTAL_REGION_COUNT} majority)`
	                : 'Win Condition: Most Money'}
	            </div>
	            <div className="flex justify-between">
	              <span>{gameSettings.winCondition === 'regions' ? 'Your Regions:' : 'Your Money:'}</span>
	              <span className="font-bold">
	                {gameSettings.winCondition === 'regions' ? outcome.playerValue : `$${outcome.playerValue.toLocaleString()}`}
	              </span>
	            </div>
	            {gameState.selectedMode === 'ai' && (
	              <div className="flex justify-between">
	                <span>{gameSettings.winCondition === 'regions' ? `${aiPlayer.name} Regions:` : `${aiPlayer.name} Money:`}</span>
	                <span className="font-bold">
	                  {gameSettings.winCondition === 'regions' ? outcome.aiValue : `$${outcome.aiValue.toLocaleString()}`}
	                </span>
	              </div>
	            )}
	            <div className="flex justify-between">
	              <span>Net Worth:</span>
	              <span className="font-bold text-green-500">${getNetWorth}</span>
	            </div>
	            <div className="text-xs opacity-75 pt-2">
	              {outcome.reason}
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
	                dispatchGameState({ type: 'RESET_GAME' });
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
      <style>{`
        @keyframes notificationSlideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes notificationFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
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

