
export const CITIES = ['Milano', 'Roma', 'Napoli', 'Torino', 'Firenze', 'Bologna'];
export const SPECIALIZATIONS = ['Bodybuilding', 'Yoga', 'Pilates', 'CrossFit', 'Functional Training', 'Calisthenics', 'Riabilitazione'];
export const FACILITIES = ['Sala Pesi', 'Piscina', 'Sauna', 'WiFi Gratuito', 'Parcheggio', 'Sala Corsi'];
export const GOALS = ['weight-loss', 'muscle-gain', 'endurance', 'wellness'];

const FIRST_NAMES = ['Marco', 'Giulia', 'Alessandro', 'Sofia', 'Luca', 'Martina', 'Francesco', 'Chiara', 'Matteo', 'Giorgia', 'Davide', 'Sara', 'Federico', 'Elena', 'Andrea'];
const LAST_NAMES = ['Rossi', 'Bianchi', 'Ferrari', 'Esposito', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo'];

export const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getRandomItems = <T>(arr: T[], count: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export const generateRandomUser = (index: number) => ({
    email: `athlete${index}_${Date.now()}@test.com`,
    password: 'password123',
    firstName: getRandomItem(FIRST_NAMES),
    lastName: getRandomItem(LAST_NAMES),
    city: getRandomItem(CITIES),
    age: 18 + Math.floor(Math.random() * 40),
    weight: 50 + Math.floor(Math.random() * 50),
    height: 150 + Math.floor(Math.random() * 50),
    fitnessLevel: getRandomItem(['beginner', 'intermediate', 'advanced']),
    goal: getRandomItem(GOALS),
    budget_min: 50 + Math.floor(Math.random() * 50),
    budget_max: 100 + Math.floor(Math.random() * 200),
    availability: 2 + Math.floor(Math.random() * 10)
});

export const generateRandomTrainer = (index: number) => ({
    email: `trainer${index}_${Date.now()}@test.com`,
    password: 'password123',
    firstName: getRandomItem(FIRST_NAMES),
    lastName: getRandomItem(LAST_NAMES),
    city: getRandomItem(CITIES),
    bio: "Professionista certificato con anni di esperienza nel settore fitness.",
    yearsExperience: 1 + Math.floor(Math.random() * 15),
    specializations: getRandomItems(SPECIALIZATIONS, 2),
    hourlyRate: 30 + Math.floor(Math.random() * 70)
});

export const generateRandomGym = (index: number) => ({
    email: `gym${index}_${Date.now()}@test.com`,
    password: 'password123',
    gymName: `Gym ${getRandomItem(['Elite', 'Power', 'Fit', 'Active', 'Pro'])} ${index}`,
    ownerName: getRandomItem(FIRST_NAMES) + ' ' + getRandomItem(LAST_NAMES),
    city: getRandomItem(CITIES),
    address: `Via Roma ${1 + Math.floor(Math.random() * 100)}`,
    postalCode: '20100',
    description: "Centro fitness moderno e attrezzato per ogni esigenza.",
    facilities: getRandomItems(FACILITIES, 3),
    monthlyFee: 30 + Math.floor(Math.random() * 70)
});

// --- ROME SCENARIO GENERATORS ---

export const generateRomeUser = (index: number) => ({
    ...generateRandomUser(index),
    email: `rome_user_${index}@test.com`,
    city: 'Roma',
    goal: 'muscle-gain', // Common goal for testing
    budget_max: 80 // Reasonable budget to match trainers
});

export const generateRomeTrainer = (index: number) => ({
    ...generateRandomTrainer(index),
    email: `rome_trainer_${index}@test.com`,
    city: 'Roma',
    specializations: ['Bodybuilding', 'Functional Training'], // Matching the user goal
    hourlyRate: 50 // Within user budget
});


export const generateRomeGym = (index: number) => ({
    ...generateRandomGym(index),
    email: `rome_gym_${index}@test.com`,
    city: 'Roma',
    address: `Via Appia Nuova ${100 + index}`,
    facilities: ['Sala Pesi', 'Sauna'], // Attractive facilities
    monthlyFee: 45 // Within budget
});

// --- SALERNO SCENARIO GENERATORS ---

export const generateSalernoUser = (index: number) => ({
    ...generateRandomUser(index),
    email: `salerno_user_${index}@test.com`,
    city: 'Salerno',
    goal: index % 2 === 0 ? 'muscle-gain' : 'wellness', // Mix of goals
    budget_max: 60,
    availability: 5 // Good availability
});

export const generateSalernoTrainer = (index: number) => ({
    ...generateRandomTrainer(index),
    email: `salerno_trainer_${index}@test.com`,
    city: 'Salerno',
    specializations: index % 2 === 0 ? ['CrossFit', 'Bodybuilding'] : ['Pilates', 'Yoga'],
    hourlyRate: 40 // Affordable
});

export const generateSalernoGym = (index: number) => ({
    ...generateRandomGym(index),
    email: `salerno_gym_${index}@test.com`,
    city: 'Salerno',
    gymName: `Salerno Fit ${index}`,
    address: `Corso Vittorio Emanuele ${50 + index}`,
    facilities: ['Sala Pesi', 'Sala Corsi', 'Area Relax'],
    monthlyFee: 35
});

