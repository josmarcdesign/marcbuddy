export const PLAN_PRICES = {
  free: 0,
  classic: 29.90,
  pro: 59.90,
  team: 149.90
};

export const PLAN_NAMES = {
  free: 'MBuddy Free',
  classic: 'MBuddy Classic',
  pro: 'MBuddy Pro',
  team: 'MBuddy Team'
};

export const getPlanById = (planId) => {
  return {
    id: planId,
    name: PLAN_NAMES[planId] || planId,
    price: PLAN_PRICES[planId] || 0
  };
};

