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
};

type DontAskAgainPrefs = {
  travel: boolean;
  sell: boolean;
  challenge: boolean;
  endDay: boolean;
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
  type: 'challenge' | 'travel' | 'sell' | 'collect' | 'think' | 'end_turn' | 'special_ability';
  description: string;
  data?: any;
}

const DEFAULT_GAME_SETTINGS: GameSettingsState = {
  actionLimitsEnabled: true,
  maxActionsPerTurn: 3,
  aiMaxActionsPerTurn: 3,
  allowActionOverride: true,
  overrideCost: 1000,
  totalDays: 30,
  playerActionsPerDay: 3,
  aiActionsPerDay: 3,
  showDayTransition: false,
  // Optional challenge features (disabled by default for classic gameplay)
  dynamicWagerEnabled: false,
  doubleOrNothingEnabled: false
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
  actionsUsedThisTurn: 0
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
      return {
        ...state,
        challengesCompleted: [...state.challengesCompleted, action.payload],
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
        actionsUsedThisTurn: 0
      };
    case 'GAIN_XP':
      const newXp = state.xp + action.payload;
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
  lastChallengeReward: 0
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
    actionsUsedThisTurn: 0
  });

  // AI action queue for visual feedback
  const [aiActionQueue, setAiActionQueue] = useState<AIAction[]>([]);
  const [currentAiAction, setCurrentAiAction] = useState<AIAction | null>(null);

  // Game Settings State
  const [gameSettings, setGameSettings] = useState<GameSettingsState>({ ...DEFAULT_GAME_SETTINGS });

  // UI state
  const [uiState, setUiState] = useState({
    showTravelModal: false,
    showChallenges: false,
    showMarket: false,
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
        currentAction: currentAiAction
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
        actionsUsedThisTurn: typeof data?.actionsUsedThisTurn === 'number' ? data.actionsUsedThisTurn : 0
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
      actionLimitsEnabled: Boolean(stateData.actionLimitsEnabled),
      actionsThisTurn: typeof stateData.actionsThisTurn === 'number' ? stateData.actionsThisTurn : 0,
      maxActionsPerTurn: typeof stateData.maxActionsPerTurn === 'number' ? stateData.maxActionsPerTurn : initialGameState.maxActionsPerTurn,
      playerActionsThisTurn: typeof stateData.playerActionsThisTurn === 'number' ? stateData.playerActionsThisTurn : 0,
      allChallengesCompleted: Boolean(stateData.allChallengesCompleted),
      isAiThinking: Boolean(stateData.isAiThinking)
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
      showDayTransition: typeof settingsData.showDayTransition === 'boolean' ? settingsData.showDayTransition : DEFAULT_GAME_SETTINGS.showDayTransition
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
      currentAction: raw.aiRuntime?.currentAction || null
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
  // AI DECISION MAKING ENGINE
  // =========================================

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
    
    return Math.min(0.95, Math.max(0.1, baseChance + statBonus - difficultyPenalty + characterBonus + levelBonus));
  }, []);

  const calculateAiTravelCost = useCallback((fromRegion, toRegion, aiState) => {
    if (ADJACENT_REGIONS[fromRegion]?.includes(toRegion)) {
      let baseCost = 200;
      if (aiState.character.name === "Explorer") {
        baseCost *= 0.75;
      }
      if (aiState.masteryUnlocks.includes("Pathfinder")) {
        return 0;
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
    return Math.floor(baseCost);
  }, []);

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

    const successChance = calculateAiSuccessChance(challenge, aiState);
    const maxWager = Math.min(aiState.money, 500);
    const actualWager = Math.max(MINIMUM_WAGER, maxWager); // Ensure at least minimum wager
    const potentialReward = actualWager * challenge.reward;
    const expectedValue = potentialReward * successChance - actualWager * (1 - successChance);

    // Adjust for difficulty profile
    const profile = AI_DIFFICULTY_PROFILES[difficulty];
    const riskAdjusted = expectedValue * profile.riskTolerance;

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
  }, [calculateAiSuccessChance]);

  // AI Strategy: Evaluate best region to travel to
  const evaluateTravel = useCallback((region, aiState, difficulty, resourcePrices) => {
    const cost = calculateAiTravelCost(aiState.currentRegion, region, aiState);
    if (aiState.money < cost) return { region, score: -Infinity };
    
    // Value unvisited regions higher
    let score = aiState.visitedRegions.includes(region) ? 10 : 100;
    
    // Value resource richness
    const regionResources = REGIONAL_RESOURCES[region] || [];
    const avgResourceValue = regionResources.reduce((sum, r) => 
      sum + (resourcePrices[r] || 100), 0) / regionResources.length;
    score += avgResourceValue * 0.5;
    
    // Value uncompleted challenges
    const regionChallenges = REGIONS[region]?.challenges || [];
    const uncompletedChallenges = regionChallenges.filter(c => 
      !aiState.challengesCompleted.includes(c.name)
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

    return { region, score, cost };
  }, [calculateAiTravelCost]);

  // AI Strategy: Evaluate which resource to sell
  const evaluateResourceSale = useCallback((resource, aiState, resourcePrices) => {
    const price = resourcePrices[resource] || 100;
    let score = price;

    // Strategy adjustments
    if (aiState.character.name === "Businessman") {
      score *= 1.1;
    }

    if (aiState.masteryUnlocks.includes("Investment Genius")) {
      score *= 1.15;
    }

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
  }, []);

  // AI Strategy: Evaluate special ability usage
  const evaluateSpecialAbility = useCallback((aiState, gameState) => {
    const ability = aiState.character.specialAbility;
    if (!ability || aiState.specialAbilityUses <= 0) return -Infinity;

    let score = 0;

    switch (ability.name) {
      case "Tourist Luck":
        // Use if we have risky challenges available
        const currentRegion = REGIONS[aiState.currentRegion];
        const riskyChallenges = currentRegion?.challenges.filter(c =>
          !aiState.challengesCompleted.includes(c.name) &&
          c.difficulty >= 2
        ) || [];
        score = riskyChallenges.length > 0 ? 80 : 0;
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
          !aiState.challengesCompleted.includes(c.name) &&
          c.difficulty < 2 &&
          aiState.money >= MINIMUM_WAGER
        ) || [];
        score = easyChallenges.length > 0 ? 150 : 0; // High priority for guaranteed win
        break;

      default:
        score = 0;
    }

    return score;
  }, []);

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
      if (Math.random() < profile.mistakeChance) {
        return {
          type: 'think',
          description: 'Contemplating strategy...',
          data: null
        };
      }

      const decisions: Array<{ type: string; description: string; data: any; score: number }> = [];

      // Evaluate special ability usage
      if (aiState.specialAbilityUses > 0 && aiState.character?.specialAbility) {
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

      // Evaluate challenges in current region
      const currentRegion = REGIONS[aiState.currentRegion];
      const availableChallenges = currentRegion?.challenges.filter(c =>
        !aiState.challengesCompleted.includes(c.name)
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
        const randomIndex = Math.floor(Math.random() * Math.min(3, decisions.length));
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
  }, [evaluateChallenge, evaluateTravel, evaluateResourceSale, evaluateSpecialAbility, calculateAiSuccessChance]);

  // Execute AI action with validation
  const executeAiAction = useCallback((action: AIAction) => {
    setCurrentAiAction(action);

    // Validate action before execution
    try {
      switch (action.type) {
        case 'challenge':
          // Validate AI has money for wager
          if (action.data?.wager && aiPlayer.money < action.data.wager) {
            addNotification(`🤖 ${aiPlayer.name} can't afford challenge (needs $${action.data.wager})`, 'ai', false);
            return;
          }
          break;

        case 'travel':
          // Validate AI has money for travel
          if (action.data?.cost && aiPlayer.money < action.data.cost) {
            addNotification(`🤖 ${aiPlayer.name} can't afford travel (needs $${action.data.cost})`, 'ai', false);
            return;
          }
          // Validate region exists
          if (action.data?.region && !REGIONS[action.data.region]) {
            console.error('Invalid region:', action.data.region);
            return;
          }
          break;

        case 'sell':
          // Validate AI has resource in inventory
          if (action.data?.resource && !aiPlayer.inventory.includes(action.data.resource)) {
            addNotification(`🤖 ${aiPlayer.name} doesn't have ${action.data.resource} to sell`, 'ai', false);
            return;
          }
          break;

        case 'special_ability':
          // Validate AI has special ability uses left
          if (aiPlayer.specialAbilityUses <= 0) {
            addNotification(`🤖 ${aiPlayer.name} has no special ability uses left`, 'ai', false);
            return;
          }
          break;
      }
    } catch (error) {
      console.error('Action validation error:', error);
      return;
    }

    // Execute validated action
    switch (action.type) {
      case 'challenge':
        const { challenge, wager, successChance } = action.data;
        const success = Math.random() < successChance;
        
        if (success) {
          let reward = Math.floor(wager * challenge.reward);

          if (aiPlayer.character.name === "Tourist") {
            reward = Math.floor(reward * 1.2);
          }

          if (aiPlayer.character.name === "Businessman") {
            reward = Math.floor(reward * 1.1);
          }

          // Calculate XP gain and check for level up
          const xpGain = challenge.difficulty * 20;
          const newXp = aiPlayer.xp + xpGain;
          const xpForNextLevel = aiPlayer.level * 100;

          let levelUpData = {};
          let didLevelUp = false;

          if (newXp >= xpForNextLevel) {
            // Level up!
            didLevelUp = true;
            levelUpData = {
              xp: newXp - xpForNextLevel,
              level: aiPlayer.level + 1,
              stats: {
                strength: aiPlayer.stats.strength + 1,
                charisma: aiPlayer.stats.charisma + 1,
                luck: aiPlayer.stats.luck + 1,
                intelligence: aiPlayer.stats.intelligence + 1
              }
            };
          } else {
            levelUpData = {
              xp: newXp
            };
          }

          setAiPlayer(prev => ({
            ...prev,
            money: addMoney(prev.money, reward),
            challengesCompleted: [...prev.challengesCompleted, challenge.name],
            consecutiveWins: prev.consecutiveWins + 1,
            ...levelUpData
          }));

          addNotification(
            `🤖 ${aiPlayer.name} completed ${challenge.name} and won $${reward}!`,
            'ai',
            false
          );

          if (didLevelUp) {
            addNotification(
              `🤖 ${aiPlayer.name} leveled up to level ${aiPlayer.level + 1}!`,
              'levelup',
              true
            );
          }

          // Check for mastery unlocks (after state update, so we use the old level + 1)
          const newLevel = didLevelUp ? aiPlayer.level + 1 : aiPlayer.level;
          Object.entries(aiPlayer.character.masteryTree || {}).forEach(([name, mastery]) => {
            if (newLevel >= (mastery as any).unlockLevel && !aiPlayer.masteryUnlocks.includes(name)) {
              setAiPlayer(prev => ({
                ...prev,
                masteryUnlocks: [...prev.masteryUnlocks, name]
              }));
              addNotification(
                `🤖 ${aiPlayer.name} unlocked mastery: ${name}!`,
                'levelup',
                true
              );
            }
          });
        } else {
          setAiPlayer(prev => ({
            ...prev,
            money: deductMoney(prev.money, wager),
            consecutiveWins: 0
          }));
          
          addNotification(
            `🤖 ${aiPlayer.name} failed ${challenge.name} and lost $${wager}`,
            'ai',
            false
          );
        }
        break;
        
      case 'travel':
        const { region, cost } = action.data;
        setAiPlayer(prev => ({
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
          const collectedResource = regionResources[Math.floor(Math.random() * regionResources.length)];

          // Check inventory capacity
          if (aiPlayer.inventory.length < MAX_INVENTORY) {
            setAiPlayer(prev => ({
              ...prev,
              inventory: [...prev.inventory, collectedResource]
            }));

            addNotification(
              `🤖 ${aiPlayer.name} traveled to ${REGIONS[region].name} and found ${collectedResource}`,
              'ai',
              false
            );
          } else {
            addNotification(
              `🤖 ${aiPlayer.name} traveled to ${REGIONS[region].name} (inventory full, couldn't collect ${collectedResource})`,
              'ai',
              false
            );
          }
        } else {
          addNotification(
            `🤖 ${aiPlayer.name} traveled to ${REGIONS[region].name}`,
            'ai',
            false
          );
        }
        break;
        
      case 'sell':
        const { resource, price } = action.data;
        const index = aiPlayer.inventory.indexOf(resource);
        if (index > -1) {
          let finalPrice = price;
          
          if (aiPlayer.character.name === "Businessman") {
            finalPrice = Math.floor(price * 1.1);
          }
          
          if (aiPlayer.masteryUnlocks.includes("Investment Genius")) {
            finalPrice = Math.floor(finalPrice * 1.15);
          }
          
          setAiPlayer(prev => {
            const newInventory = [...prev.inventory];
            newInventory.splice(index, 1);
            return {
              ...prev,
              inventory: newInventory,
              money: addMoney(prev.money, finalPrice)
            };
          });
          
          addNotification(
            `🤖 ${aiPlayer.name} sold ${resource} for $${finalPrice}`,
            'ai',
            false
          );
        }
        break;
        
      case 'special_ability':
        const { ability } = action.data;

        // Use the special ability
        setAiPlayer(prev => ({
          ...prev,
          specialAbilityUses: Math.max(0, prev.specialAbilityUses - 1)
        }));

        addNotification(
          `🤖 ${aiPlayer.name} used ${ability.name}!`,
          'ai',
          true
        );

        // Note: The actual effect of special abilities is applied during challenge/sell/travel
        // This just marks that the ability was used and decrements the counter
        break;

      case 'think':
        addNotification(
          `🤖 ${aiPlayer.name} is thinking...`,
          'ai',
          false
        );
        break;
    }

    dispatchGameState({ type: 'INCREMENT_ACTIONS' });
  }, [aiPlayer, addNotification, addMoney, deductMoney]);

  // AI Turn Management
  const performAiTurn = useCallback(async () => {
    if (gameState.currentTurn !== 'ai' || gameState.isAiThinking) return;

    dispatchGameState({ type: 'SET_AI_THINKING', payload: true });
    dispatchGameState({ type: 'RESET_ACTIONS' });

    const profile = AI_DIFFICULTY_PROFILES[gameState.aiDifficulty];
    const maxActions = gameSettings.aiActionsPerDay;
    
    addNotification(`🤖 ${aiPlayer.name}'s turn begins`, 'ai', true);
    
    // AI takes multiple actions per turn
    for (let i = 0; i < maxActions; i++) {
      // Thinking delay
      const thinkingTime = profile.thinkingTimeMin + 
        Math.random() * (profile.thinkingTimeMax - profile.thinkingTimeMin);
      
      await new Promise(resolve => setTimeout(resolve, thinkingTime));
      
      // Make decision
      const decision = makeAiDecision(aiPlayer, gameState, player);
      
      if (decision.type === 'end_turn') {
        break;
      }
      
      // Execute action
      executeAiAction(decision as AIAction);
      
      // Small delay between actions for visibility
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // End AI turn
    await new Promise(resolve => setTimeout(resolve, 1000));

    addNotification(`🤖 ${aiPlayer.name} ended their turn`, 'ai', true);
    dispatchGameState({ type: 'SET_AI_THINKING', payload: false });

    // In AI mode, advance the day after AI completes their turn
    // This happens BEFORE switching back to player
    advanceDay();

    // Now switch to player turn for the new day
    dispatchGameState({ type: 'SET_TURN', payload: 'player' });
    setCurrentAiAction(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, aiPlayer, player, makeAiDecision, executeAiAction, addNotification, gameSettings]);

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
    const selectedCharacterIndex = CHARACTERS.findIndex(char => char.name === data.player.character.name);
    updateUiState({
      theme: data.uiPreferences?.theme || uiState.theme,
      showTravelModal: false,
      showChallenges: false,
      showMarket: false,
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
    return Math.floor(baseCost);
  }, [player.character, player.masteryUnlocks, gameState.weather, gameState.season, gameState.activeEvents]);

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

    return Math.min(0.95, Math.max(0.1, baseChance + statBonus - difficultyPenalty + characterBonus + levelBonus + weatherEffect + seasonEffect + eventBonus));
  }, [player.stats, player.character, player.level, player.currentRegion, gameState.weather, gameState.season, gameState.activeEvents]);

  const calculateFinalScore = useCallback((playerData) => {
    return playerData.money + 
           (playerData.challengesCompleted?.length || 0) * 100 +
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
  }, [player, calculateTravelCost, addNotification, showConfirmation, incrementAction]);

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

        dispatchPlayer({ type: 'UPDATE_MONEY', payload: reward });
        dispatchPlayer({ type: 'COMPLETE_CHALLENGE', payload: challenge.name });

        // Apply Quick Study mastery - 50% more XP
        let xpGain = challenge.difficulty * 20;
        if (player.masteryUnlocks.includes("Quick Study")) {
          xpGain = Math.floor(xpGain * 1.5);
        }
        // Apply universal streak XP bonus
        if (appliedStreakBonus) {
          xpGain = Math.floor(xpGain * (1 + appliedStreakBonus.xpBonus));
        }
        dispatchPlayer({ type: 'GAIN_XP', payload: xpGain });

        // Show streak notification
        if (appliedStreakBonus) {
          addNotification(`${appliedStreakBonus.emoji} ${appliedStreakBonus.label}! ${newStreak} wins in a row!`, 'success');
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
  }, [player, calculateSuccessChance, addNotification, showConfirmation, updatePersonalRecords, activeSpecialAbility, incrementAction]);

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

        if (player.character.name === "Businessman") {
          finalPrice = Math.floor(finalPrice * 1.1);
        }

        if (player.masteryUnlocks.includes("Investment Genius")) {
          finalPrice = Math.floor(finalPrice * 1.15);
        }

        dispatchPlayer({ type: 'SELL_RESOURCE', payload: { resource, price: finalPrice } });

        // Update supply/demand tracking
        dispatchGameState({ type: 'UPDATE_SUPPLY_DEMAND', payload: { resource, amount: 1 } });

        // Show bonus notification if applicable
        const bonusMessages = [];
        if (regionalBonus > 1) bonusMessages.push(`+${Math.round((regionalBonus - 1) * 100)}% regional demand`);
        if (supplyDemandMod < 1) bonusMessages.push(`${Math.round((1 - supplyDemandMod) * 100)}% oversupply`);

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
  }, [player, gameState.activeEvents, gameState.season, gameState.supplyDemand, addNotification, showConfirmation, updatePersonalRecords, incrementAction, calculateRegionalBonus, calculateSupplyDemandModifier]);

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
    const newDay = prevDay + 1;

    // Track net worth history for progress dashboard
    const playerWorth = player.money + player.inventory.reduce((sum, r) => sum + (gameState.resourcePrices[r] || 100), 0);
    const aiWorth = aiPlayer.money + aiPlayer.inventory.reduce((sum, r) => sum + (gameState.resourcePrices[r] || 100), 0);
    dispatchGameState({ type: 'ADD_NET_WORTH_HISTORY', payload: { day: prevDay, playerWorth, aiWorth } });

    // Track price history for Market Insight
    dispatchGameState({ type: 'ADD_PRICE_HISTORY', payload: { day: prevDay, prices: { ...gameState.resourcePrices } } });

    // Show day transition screen if enabled
    if (gameSettings.showDayTransition) {
      setDayTransitionData({
        prevDay: prevDay,
        newDay: newDay,
        playerEarned: player.money - (personalRecords.maxMoney || player.character.startingMoney),
        aiEarned: aiPlayer.money - (aiPlayer.character.startingMoney || 1000)
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

    // Calculate AI mood based on performance difference
    const moneyDiff = aiPlayer.money - player.money;
    const worthDiff = aiWorth - playerWorth;
    let newMood: keyof typeof AI_MOOD_STATES = 'neutral';
    if (worthDiff > 500) {
      newMood = 'confident';
    } else if (worthDiff < -500) {
      newMood = 'desperate';
    } else if (Math.abs(worthDiff) < 200 && gameState.day > 10) {
      newMood = 'aggressive';
    }
    dispatchGameState({ type: 'SET_AI_MOOD', payload: newMood });

    // AI taunt based on mood
    if (gameState.selectedMode === 'ai') {
      const moodState = AI_MOOD_STATES[newMood];
      if (Math.random() < moodState.tauntChance) {
        const taunt = moodState.messages[Math.floor(Math.random() * moodState.messages.length)];
        addNotification(`${moodState.emoji} AI: "${taunt}"`, 'ai', false);
      }
    }

    if (!gameSettings.showDayTransition) {
      addNotification(`Market trend: ${newTrend}`, 'market', true);
      addNotification(`Weather: ${newWeather} - ${WEATHER_EFFECTS[newWeather]?.description || ''}`, 'info', true);
    }

    // Check for game end - use configurable totalDays
    if (gameState.day >= gameSettings.totalDays) {
      dispatchGameState({ type: 'SET_GAME_MODE', payload: 'end' });
      addNotification(`Game Over! Final Day Reached (${gameSettings.totalDays} days)`, 'success', true);
    }
  }, [gameState, gameSettings, player, aiPlayer, personalRecords, addNotification]);

  // When turn switches to player, reset their actions
  useEffect(() => {
    if (gameState.currentTurn === 'player') {
      dispatchPlayer({ type: 'RESET_ACTIONS' });
    }
  }, [gameState.currentTurn]);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (uiState.showSettings || uiState.showProgress || uiState.showSaveLoadModal || uiState.showNotifications || loadPreview.isOpen) {
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
  }, [uiState.showSettings, uiState.showProgress, uiState.showSaveLoadModal, uiState.showNotifications, loadPreview.isOpen]);

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
    return gameSettings.actionLimitsEnabled && player.actionsUsedThisTurn >= gameSettings.playerActionsPerDay;
  };

  // Helper function to check if all challenges are completed
  const checkAllChallengesCompleted = () => {
    const totalChallenges = Object.values(REGIONS).reduce(
      (sum, region: any) => sum + region.challenges.length,
      0
    );
    return player.challengesCompleted.length === totalChallenges;
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
  }, [player.challengesCompleted]);

  // =========================================
  // CONTEXT-AWARE QUICK ACTIONS
  // =========================================

  const getQuickActions = useMemo(() => {
    if (gameState.currentTurn !== 'player') return [];
    
    const actions = [];
    const actionLimitReached = isActionLimitReached();
    
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
              `You have reached your action limit (${gameSettings.playerActionsPerDay}). Pay $${gameSettings.overrideCost} to continue?`,
              'Pay & Continue',
              () => {
                if (player.money >= gameSettings.overrideCost && gameSettings.allowActionOverride) {
                  dispatchPlayer({ type: 'USE_ACTION_OVERRIDE', payload: gameSettings.overrideCost });
                  addNotification(`💸 Paid $${gameSettings.overrideCost} to override action limit`, 'warning');
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
    
    // Available challenges
    const currentChallenges = REGIONS[player.currentRegion]?.challenges || [];
    const availableChallenges = currentChallenges.filter(
      c => !player.challengesCompleted.includes(c.name)
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
              `You have reached your action limit (${gameSettings.playerActionsPerDay}). Pay $${gameSettings.overrideCost} to continue?`,
              'Pay & Continue',
              () => {
                if (player.money >= gameSettings.overrideCost && gameSettings.allowActionOverride) {
                  dispatchPlayer({ type: 'USE_ACTION_OVERRIDE', payload: gameSettings.overrideCost });
                  addNotification(`💸 Paid $${gameSettings.overrideCost} to override action limit`, 'warning');
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
                `You have reached your action limit (${gameSettings.maxActionsPerTurn}). Pay $${gameSettings.overrideCost} to continue?`,
                'Pay & Continue',
                () => {
                  if (player.money >= gameSettings.overrideCost && gameSettings.allowActionOverride) {
                    dispatchPlayer({ type: 'USE_ACTION_OVERRIDE', payload: gameSettings.overrideCost });
                    addNotification(`💸 Paid $${gameSettings.overrideCost} to override action limit`, 'warning');
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
  }, [player, gameState.day, gameState.currentTurn, gameState.allChallengesCompleted, gameSettings]);

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
                    <label className="block font-semibold mb-2">Override Cost: ${gameSettings.overrideCost}</label>
                    <input type="range" min="100" max="5000" step="100" value={gameSettings.overrideCost} onChange={(e) => setGameSettings(prev => ({ ...prev, overrideCost: parseInt(e.target.value) }))} className="w-full" />
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
              <p>Challenges Won: {data.player.challengesCompleted.length}</p>
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
                  <div className="font-bold">{aiPlayer.challengesCompleted.length}</div>
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
    const completedCount = player.challengesCompleted.length;
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
                      actionsUsedThisTurn: 0
                    });

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
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold opacity-75 mr-2">Quick Actions:</span>
                {getQuickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    disabled={!isPlayerTurn}
                    className={`${themeStyles.button} text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:scale-105 transform transition-all disabled:opacity-50`}
                  >
                    <span>{action.icon}</span>
                    <span className="text-sm">{action.label}</span>
                    <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">
                      {action.hotkey}
                    </kbd>
                  </button>
                ))}
                <button
                  onClick={() => updateUiState({ quickActionsOpen: false })}
                  className={`${themeStyles.buttonSecondary} px-2 py-2 rounded ml-2`}
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
                      {aiPlayer.actionsUsedThisTurn} / {gameSettings.aiActionsPerDay}
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
            className={`${themeStyles.buttonSecondary} px-4 py-2 rounded-lg flex items-center space-x-2`}
          >
            <span>💾</span>
            <span>Save / Load</span>
            <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">Ctrl+S</kbd>
          </button>
          <button
            onClick={() => updateUiState({ showChallenges: true })}
            disabled={!isPlayerTurn}
            className={`${themeStyles.button} text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50`}
          >
            <span>🎯</span>
            <span>Challenges</span>
            <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">C</kbd>
          </button>
          
          <button
            onClick={() => updateUiState({ showTravelModal: true })}
            disabled={!isPlayerTurn}
            className={`${themeStyles.button} text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50`}
          >
            <span>✈️</span>
            <span>Travel</span>
            <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">T</kbd>
          </button>
          
          <button
            onClick={() => updateUiState({ showMarket: true })}
            disabled={!isPlayerTurn}
            className={`${themeStyles.button} text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50`}
          >
            <span>💰</span>
            <span>Market ({player.inventory.length}/{MAX_INVENTORY})</span>
            <kbd className="ml-2 px-2 py-0.5 bg-black bg-opacity-30 rounded text-xs">R</kbd>
          </button>

          {/* Special Ability Button */}
          {player.character.specialAbility && (
            <button
              onClick={activateSpecialAbility}
              disabled={!isPlayerTurn || player.specialAbilityUses <= 0 || activeSpecialAbility !== null}
              className={`${activeSpecialAbility ? 'bg-gradient-to-r from-purple-600 to-blue-600' : themeStyles.accent} text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 relative`}
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
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 animate-pulse"
            >
              <span>🍀</span>
              <span>Retry Challenge</span>
            </button>
          )}

          {/* Double or Nothing Button - Shows after winning a challenge (only if enabled in settings) */}
          {gameSettings.doubleOrNothingEnabled && gameState.doubleOrNothingAvailable && isPlayerTurn && (
            <button
              onClick={handleDoubleOrNothing}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 animate-pulse"
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
                  const isCompleted = player.challengesCompleted.includes(challenge.name);
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${themeStyles.card} ${themeStyles.border} border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">💰 Resource Market</h3>
                <button
                  onClick={() => updateUiState({ showMarket: false })}
                  className={`${themeStyles.buttonSecondary} px-3 py-1 rounded`}
                >
                  ✕
                </button>
              </div>

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
                  className={`${themeStyles.border} border rounded px-2 py-1 text-sm bg-transparent`}
                >
                  <option value="default">Sort: Default</option>
                  <option value="value">Sort: Value ↓</option>
                  <option value="quantity">Sort: Quantity ↓</option>
                  <option value="category">Sort: Category</option>
                </select>
                <select
                  value={uiState.inventoryFilter}
                  onChange={(e) => updateUiState({ inventoryFilter: e.target.value as any })}
                  className={`${themeStyles.border} border rounded px-2 py-1 text-sm bg-transparent`}
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
                <div className={`space-y-3 overflow-y-auto flex-1 ${themeStyles.scrollbar}`}>
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
              <span className="font-bold">{player.challengesCompleted.length}</span>
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
                  actionsUsedThisTurn: 0
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
