import { CITIES, SPECIALIZATIONS, FACILITIES } from '@/utils/seedData';

// Generate UUID for mock items
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Initialize localStorage databases with mock data if empty
const initMockDB = () => {
  if (localStorage.getItem('gc_mock_initialized')) return;

  console.log('Initializing Mock Local Storage Database...');

  const mockProfiles: any[] = [];
  const mockUserProfiles: any[] = [];
  const mockTrainerProfiles: any[] = [];
  const mockGymProfiles: any[] = [];
  const mockTrainerAvailability: any[] = [];
  const mockWallets: any[] = [];
  const mockTransactions: any[] = [];
  const mockBookings: any[] = [];
  const mockReviews: any[] = [];
  const mockWorkoutPlans: any[] = [];
  const mockLeads: any[] = [];
  const mockMatchingPreferences: any[] = [];

  // 1. Create a default Rome User for easy testing
  const romeUserId = 'rome-user-id-1';
  mockProfiles.push({
    id: romeUserId,
    email: 'rome_user_1@test.com',
    first_name: 'Massimo',
    last_name: 'Rossi',
    user_type: 'user',
    city: 'Roma',
    phone: '+39 333 1234567',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  mockUserProfiles.push({
    id: romeUserId,
    age: 28,
    weight: 75,
    height: 180,
    fitness_level: 'intermediate',
    primary_goal: 'muscle-gain',
    secondary_goals: ['wellness', 'endurance'],
    availability_hours_per_week: 5,
    budget_min: 30,
    budget_max: 80,
    preferred_location: 'Roma',
  });
  mockWallets.push({
    id: 'wallet-user-1',
    user_id: romeUserId,
    balance: 150, // 150 Fitness Credits starting balance
  });

  // 2. Create mock trainers
  const trainerNames = [
    { first: 'Marco', last: 'Bianchi', city: 'Roma', rate: 45, specs: ['Bodybuilding', 'Functional Training'] },
    { first: 'Giulia', last: 'Ferrari', city: 'Roma', rate: 50, specs: ['Yoga', 'Pilates'] },
    { first: 'Luca', last: 'Esposito', city: 'Salerno', rate: 35, specs: ['Functional Training', 'Calisthenics'] },
    { first: 'Martina', last: 'Ricci', city: 'Salerno', rate: 40, specs: ['Pilates', 'Yoga'] },
    { first: 'Alessandro', last: 'Gallo', city: 'Milano', rate: 60, specs: ['Bodybuilding', 'CrossFit'] },
    { first: 'Sofia', last: 'Conti', city: 'Milano', rate: 55, specs: ['Yoga', 'Functional Training'] },
  ];

  trainerNames.forEach((t, index) => {
    const tId = `trainer-id-${index + 1}`;
    mockProfiles.push({
      id: tId,
      email: `${t.first.toLowerCase()}.${t.last.toLowerCase()}@test.com`,
      first_name: t.first,
      last_name: t.last,
      user_type: 'trainer',
      city: t.city,
      phone: `+39 320 987654${index}`,
      avatar_url: `https://images.unsplash.com/photo-${1500000000000 + index * 1000}?auto=format&fit=crop&q=80&w=200`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    mockTrainerProfiles.push({
      id: tId,
      bio: `Personal Trainer professionista specializzato in ${t.specs.join(' e ')}. Ti aiuterò a raggiungere la tua forma ideale.`,
      years_experience: 3 + index,
      specializations: t.specs,
      certifications: ['Diploma Nazionale ACSI/CONI', 'Certified PT Level 3'],
      languages: ['Italiano', 'Inglese'],
      personal_rate_per_hour: t.rate,
      group_rate_per_hour: Math.round(t.rate * 0.6),
      preferred_areas: t.city,
      is_verified: true,
    });

    mockWallets.push({
      id: `wallet-trainer-${index + 1}`,
      user_id: tId,
      balance: 0,
    });

    // Setup availability slots (Mon, Wed, Fri)
    for (let day = 1; day <= 5; day += 2) {
      mockTrainerAvailability.push({
        id: uuidv4(),
        trainer_id: tId,
        day_of_week: day,
        start_time: '09:00:00',
        end_time: '12:00:00',
        is_available: true,
        created_at: new Date().toISOString(),
      });
      mockTrainerAvailability.push({
        id: uuidv4(),
        trainer_id: tId,
        day_of_week: day,
        start_time: '15:00:00',
        end_time: '18:00:00',
        is_available: true,
        created_at: new Date().toISOString(),
      });
    }

    // Add some sample completed reviews for trainers
    mockReviews.push({
      id: uuidv4(),
      reviewer_id: romeUserId,
      reviewed_id: tId,
      booking_id: uuidv4(),
      rating: 4 + (index % 2),
      comment: 'Ottimo trainer, super professionale e motivante! Consigliatissimo.',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Add some mock workout plans that users can unlock
    mockWorkoutPlans.push({
      id: `plan-id-${index + 1}`,
      user_id: romeUserId,
      trainer_id: tId,
      title: `Scheda ${t.specs[0]} - Livello Intermedio`,
      description: `Giorno 1: Riscaldamento 10m\nSquat: 4 serie x 8 rep\nLeg Press: 3 serie x 10 rep\nAffondi: 3 serie x 12 rep\n\nGiorno 2: Upper Body Focus\nPanca Piana: 4 serie x 8 rep\nTrazioni: 4 serie x max rep\nSpalle: Lento avanti 3 x 10 rep\n\nGiorno 3: Core & Cardio\nPlank: 3 serie x 1 min\nCrunch: 3 serie x 20 rep\nCardio HIIT: 20 min`,
      price: 15 + index * 5, // price in credits
      payment_status: 'pending',
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    });
  });

  // 3. Create mock gyms
  const gymNames = [
    { name: 'Power Gym Roma', city: 'Roma', fee: 50, facilities: ['Sala Pesi', 'Sauna', 'Parcheggio'] },
    { name: 'Elite Fitness Salerno', city: 'Salerno', fee: 40, facilities: ['Sala Pesi', 'Sala Corsi', 'WiFi Gratuito'] },
    { name: 'Active Club Milano', city: 'Milano', fee: 75, facilities: ['Sala Pesi', 'Piscina', 'Sauna', 'Area Relax'] },
  ];

  gymNames.forEach((g, index) => {
    const gId = `gym-id-${index + 1}`;
    mockProfiles.push({
      id: gId,
      email: `info@${g.name.toLowerCase().replace(/\s+/g, '')}.com`,
      first_name: g.name,
      last_name: 'Owner',
      user_type: 'gym_owner',
      city: g.city,
      phone: `+39 06 998877${index}`,
      avatar_url: `https://images.unsplash.com/photo-${1540575467063 + index * 1000}?auto=format&fit=crop&q=80&w=200`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    mockGymProfiles.push({
      id: gId,
      gym_name: g.name,
      description: `Il centro fitness ${g.name} offre le migliori attrezzature d'Italia in un ambiente moderno e stimolante.`,
      address: `Via dello Sport ${10 + index * 15}`,
      city: g.city,
      postal_code: `0010${index}`,
      monthly_fee: g.fee,
      day_pass_fee: Math.round(g.fee * 0.2),
      facilities: g.facilities,
      specializations: ['Fitness', 'Cardio', 'Bodybuilding'],
      is_verified: true,
      opening_hours: '07:00',
      closing_hours: '22:00',
      opening_days: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    });
  });

  // Save all tables to localStorage
  localStorage.setItem('gc_mock_profiles', JSON.stringify(mockProfiles));
  localStorage.setItem('gc_mock_user_profiles', JSON.stringify(mockUserProfiles));
  localStorage.setItem('gc_mock_trainer_profiles', JSON.stringify(mockTrainerProfiles));
  localStorage.setItem('gc_mock_gym_profiles', JSON.stringify(mockGymProfiles));
  localStorage.setItem('gc_mock_trainer_availability', JSON.stringify(mockTrainerAvailability));
  localStorage.setItem('gc_mock_wallets', JSON.stringify(mockWallets));
  localStorage.setItem('gc_mock_transactions', JSON.stringify(mockTransactions));
  localStorage.setItem('gc_mock_bookings', JSON.stringify(mockBookings));
  localStorage.setItem('gc_mock_reviews', JSON.stringify(mockReviews));
  localStorage.setItem('gc_mock_workout_plans', JSON.stringify(mockWorkoutPlans));
  localStorage.setItem('gc_mock_leads', JSON.stringify(mockLeads));
  localStorage.setItem('gc_mock_matching_preferences', JSON.stringify(mockMatchingPreferences));

  // Flag as initialized
  localStorage.setItem('gc_mock_initialized', 'true');
  console.log('Mock Local Storage Database populated successfully!');
};

// Implement query builder to execute localStorage operations
class MockQueryBuilder {
  private tableName: string;
  private data: any[];
  private filters: ((item: any) => boolean)[] = [];
  private orderCol: string | null = null;
  private orderAscending: boolean = true;
  private limitVal: number | null = null;

  constructor(tableName: string) {
    this.tableName = tableName;
    initMockDB();
    this.data = JSON.parse(localStorage.getItem(`gc_mock_${tableName}`) || '[]');
  }

  private saveData() {
    localStorage.setItem(`gc_mock_${this.tableName}`, JSON.stringify(this.data));
  }

  select(fields?: string) {
    // Fluent interface pattern, return self
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push((item) => {
      // In useMatching: .eq('profiles.city', targetCity)
      if (col.startsWith('profiles.')) {
        const profileCol = col.split('.')[1];
        const profile = this.getProfileForJoin(item.id || item.user_id || item.trainer_id);
        return profile ? profile[profileCol] === val : false;
      }
      return item[col] === val;
    });
    return this;
  }

  neq(col: string, val: any) {
    this.filters.push((item) => item[col] !== val);
    return this;
  }

  or(filterStr: string) {
    // In useBookings: .or(`user_id.eq.${user.id},trainer_id.eq.${user.id}`)
    this.filters.push((item) => {
      const conditions = filterStr.split(',');
      return conditions.some((cond) => {
        const parts = cond.split('.');
        const col = parts[0];
        const op = parts[1];
        const val = parts.slice(2).join('.');
        if (op === 'eq') {
          return item[col] === val;
        }
        return false;
      });
    });
    return this;
  }

  contains(col: string, val: any[]) {
    this.filters.push((item) => {
      const arr = item[col];
      if (!Array.isArray(arr)) return false;
      return val.every((v) => arr.includes(v));
    });
    return this;
  }

  lte(col: string, val: any) {
    this.filters.push((item) => Number(item[col]) <= Number(val));
    return this;
  }

  gte(col: string, val: any) {
    this.filters.push((item) => Number(item[col]) >= Number(val));
    return this;
  }

  order(col: string, { ascending = true } = {}) {
    this.orderCol = col;
    this.orderAscending = ascending;
    return this;
  }

  limit(val: number) {
    this.limitVal = val;
    return this;
  }

  range(from: number, to: number) {
    return this;
  }

  private getProfileForJoin(id: string) {
    const profiles = JSON.parse(localStorage.getItem('gc_mock_profiles') || '[]');
    return profiles.find((p: any) => p.id === id) || null;
  }

  private executeQuery() {
    let result = [...this.data];

    // Apply filters
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    // Apply sorting
    if (this.orderCol) {
      result.sort((a, b) => {
        const valA = a[this.orderCol!];
        const valB = b[this.orderCol!];
        if (valA === undefined || valB === undefined) return 0;
        if (typeof valA === 'string') {
          return this.orderAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return this.orderAscending ? valA - valB : valB - valA;
      });
    }

    // Apply limit
    if (this.limitVal !== null) {
      result = result.slice(0, this.limitVal);
    }

    // Resolve Joins automatically based on the tables
    return result.map((item) => {
      const resolved = { ...item };

      if (this.tableName === 'bookings') {
        const trainerProfile = this.getTableItem('trainer_profiles', resolved.trainer_id);
        const trainerBase = this.getTableItem('profiles', resolved.trainer_id);
        const clientBase = this.getTableItem('profiles', resolved.user_id);

        resolved.trainer = {
          profiles: trainerBase ? { first_name: trainerBase.first_name, last_name: trainerBase.last_name } : null,
        };
        resolved.client = clientBase ? { first_name: clientBase.first_name, last_name: clientBase.last_name } : null;
      }

      if (
        this.tableName === 'trainer_profiles' ||
        this.tableName === 'gym_profiles' ||
        this.tableName === 'user_profiles'
      ) {
        const baseProfile = this.getTableItem('profiles', resolved.id);
        resolved.profiles = baseProfile
          ? {
              first_name: baseProfile.first_name,
              last_name: baseProfile.last_name,
              city: baseProfile.city,
              avatar_url: baseProfile.avatar_url,
            }
          : null;
      }

      if (this.tableName === 'workout_plans') {
        const trainerBase = this.getTableItem('profiles', resolved.trainer_id);
        resolved.trainer = trainerBase
          ? {
              first_name: trainerBase.first_name,
              last_name: trainerBase.last_name,
            }
          : null;
      }

      return resolved;
    });
  }

  private getTableItem(tableName: string, id: string) {
    const list = JSON.parse(localStorage.getItem(`gc_mock_${tableName}`) || '[]');
    return list.find((x: any) => x.id === id) || null;
  }

  private insertData: any = undefined;
  private updateData: any = undefined;
  private upsertData: any = undefined;
  private isDelete = false;

  insert(data: any) {
    this.insertData = data;
    return this;
  }

  update(updates: any) {
    this.updateData = updates;
    return this;
  }

  upsert(data: any) {
    this.upsertData = data;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  private async executeInsert(data: any) {
    const rows = Array.isArray(data) ? data : [data];
    const inserted: any[] = [];

    for (const row of rows) {
      const newRow = {
        id: row.id || uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...row,
      };

      if (this.tableName === 'profiles') {
        const userType = newRow.user_type || 'user';
        if (userType === 'user') {
          const userProfs = JSON.parse(localStorage.getItem('gc_mock_user_profiles') || '[]');
          if (!userProfs.some((x: any) => x.id === newRow.id)) {
            userProfs.push({ id: newRow.id });
            localStorage.setItem('gc_mock_user_profiles', JSON.stringify(userProfs));
          }
        } else if (userType === 'trainer') {
          const trainerProfs = JSON.parse(localStorage.getItem('gc_mock_trainer_profiles') || '[]');
          if (!trainerProfs.some((x: any) => x.id === newRow.id)) {
            trainerProfs.push({ id: newRow.id, bio: '', specializations: [], years_experience: 1 });
            localStorage.setItem('gc_mock_trainer_profiles', JSON.stringify(trainerProfs));
          }
        } else if (userType === 'gym_owner') {
          const gymProfs = JSON.parse(localStorage.getItem('gc_mock_gym_profiles') || '[]');
          if (!gymProfs.some((x: any) => x.id === newRow.id)) {
            gymProfs.push({ id: newRow.id, gym_name: 'Nuova Palestra' });
            localStorage.setItem('gc_mock_gym_profiles', JSON.stringify(gymProfs));
          }
        }

        const wallets = JSON.parse(localStorage.getItem('gc_mock_wallets') || '[]');
        if (!wallets.some((w: any) => w.user_id === newRow.id)) {
          wallets.push({ id: uuidv4(), user_id: newRow.id, balance: 100 });
          localStorage.setItem('gc_mock_wallets', JSON.stringify(wallets));
        }
      }

      this.data.push(newRow);
      inserted.push(newRow);
    }

    this.saveData();
    return Array.isArray(data) ? inserted : inserted[0];
  }

  private async executeUpdate(updates: any) {
    const queryResults = this.executeQuery();
    const queryIds = queryResults.map((x) => x.id);

    this.data = this.data.map((item) => {
      if (queryIds.includes(item.id)) {
        return { ...item, ...updates, updated_at: new Date().toISOString() };
      }
      return item;
    });

    this.saveData();
    const updated = this.data.filter((item) => queryIds.includes(item.id));
    return updated;
  }

  private async executeUpsert(data: any) {
    const rows = Array.isArray(data) ? data : [data];
    const upserted: any[] = [];

    for (const row of rows) {
      const id = row.id || uuidv4();
      const existingIdx = this.data.findIndex((x) => x.id === id);

      const updatedRow = {
        created_at: new Date().toISOString(),
        ...(existingIdx > -1 ? this.data[existingIdx] : {}),
        ...row,
        id,
        updated_at: new Date().toISOString(),
      };

      if (existingIdx > -1) {
        this.data[existingIdx] = updatedRow;
      } else {
        this.data.push(updatedRow);
      }

      upserted.push(updatedRow);

      if (this.tableName === 'profiles') {
        const userType = updatedRow.user_type || 'user';
        if (userType === 'user') {
          const userProfs = JSON.parse(localStorage.getItem('gc_mock_user_profiles') || '[]');
          if (!userProfs.some((x: any) => x.id === id)) {
            userProfs.push({ id });
            localStorage.setItem('gc_mock_user_profiles', JSON.stringify(userProfs));
          }
        } else if (userType === 'trainer') {
          const trainerProfs = JSON.parse(localStorage.getItem('gc_mock_trainer_profiles') || '[]');
          if (!trainerProfs.some((x: any) => x.id === id)) {
            trainerProfs.push({ id, bio: '', specializations: [], years_experience: 1 });
            localStorage.setItem('gc_mock_trainer_profiles', JSON.stringify(trainerProfs));
          }
        } else if (userType === 'gym_owner') {
          const gymProfs = JSON.parse(localStorage.getItem('gc_mock_gym_profiles') || '[]');
          if (!gymProfs.some((x: any) => x.id === id)) {
            gymProfs.push({ id, gym_name: 'Nuova Palestra' });
            localStorage.setItem('gc_mock_gym_profiles', JSON.stringify(gymProfs));
          }
        }
      }
    }

    this.saveData();
    return Array.isArray(data) ? upserted : upserted[0];
  }

  private async executeDelete() {
    const queryResults = this.executeQuery();
    const queryIds = queryResults.map((x) => x.id);

    this.data = this.data.filter((item) => !queryIds.includes(item.id));
    this.saveData();

    return queryResults;
  }

  // Query terminators
  async single() {
    let results = [];
    if (this.insertData !== undefined) {
      results = [await this.executeInsert(this.insertData)];
    } else if (this.updateData !== undefined) {
      results = await this.executeUpdate(this.updateData);
    } else if (this.upsertData !== undefined) {
      results = [await this.executeUpsert(this.upsertData)];
    } else if (this.isDelete) {
      results = await this.executeDelete();
    } else {
      results = this.executeQuery();
    }

    if (results.length === 0) {
      return { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
    }
    return { data: results[0], error: null };
  }

  async maybeSingle() {
    let results = [];
    if (this.insertData !== undefined) {
      results = [await this.executeInsert(this.insertData)];
    } else if (this.updateData !== undefined) {
      results = await this.executeUpdate(this.updateData);
    } else if (this.upsertData !== undefined) {
      results = [await this.executeUpsert(this.upsertData)];
    } else if (this.isDelete) {
      results = await this.executeDelete();
    } else {
      results = this.executeQuery();
    }

    if (results.length === 0) {
      return { data: null, error: null };
    }
    return { data: results[0], error: null };
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      let data: any = null;
      if (this.insertData !== undefined) {
        data = await this.executeInsert(this.insertData);
      } else if (this.updateData !== undefined) {
        data = await this.executeUpdate(this.updateData);
      } else if (this.upsertData !== undefined) {
        data = await this.executeUpsert(this.upsertData);
      } else if (this.isDelete) {
        data = await this.executeDelete();
      } else {
        data = this.executeQuery();
      }
      return Promise.resolve({ data, error: null }).then(onfulfilled, onrejected);
    } catch (err: any) {
      return Promise.resolve({ data: null, error: err }).then(onfulfilled, onrejected);
    }
  }
}

// Mock auth handlers
const getAuthSession = () => {
  const sess = localStorage.getItem('gc_mock_session');
  return sess ? JSON.parse(sess) : null;
};

const authListeners: ((event: string, session: any) => void)[] = [];

// Mock RPC caller
const mockRpc = async (fn: string, args: any) => {
  console.log(`Executing Mock RPC: ${fn}`, args);

  switch (fn) {
    case 'calculate_match_score': {
      // Calculate realistic matching score based on trainers/gyms details
      const score = 75 + Math.floor(Math.random() * 25);
      return { data: score, error: null };
    }
    case 'check_trainer_availability': {
      // Return true for availability checks
      return { data: true, error: null };
    }
    case 'apply_referral_code': {
      // Add 15 FC to the user's wallet
      const session = getAuthSession();
      if (!session) return { data: { success: false, error: 'No session' }, error: null };

      const wallets = JSON.parse(localStorage.getItem('gc_mock_wallets') || '[]');
      const userWallet = wallets.find((w: any) => w.user_id === session.user.id);
      if (userWallet) {
        userWallet.balance = Number(userWallet.balance) + 15;
        localStorage.setItem('gc_mock_wallets', JSON.stringify(wallets));

        // Add transaction
        const txs = JSON.parse(localStorage.getItem('gc_mock_transactions') || '[]');
        txs.push({
          id: uuidv4(),
          wallet_id: userWallet.id,
          amount: 15,
          type: 'referral_bonus',
          description: `Referral Bonus sbloccato (${args.code_input})`,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('gc_mock_transactions', JSON.stringify(txs));

        return { data: { success: true }, error: null };
      }
      return { data: { success: false }, error: null };
    }
    case 'process_booking_payment': {
      const wallets = JSON.parse(localStorage.getItem('gc_mock_wallets') || '[]');
      const userWallet = wallets.find((w: any) => w.user_id === args.p_user_id);
      const trainerWallet = wallets.find((w: any) => w.user_id === args.p_trainer_id);

      if (!userWallet) return { data: { success: false, error: 'User wallet not found' }, error: null };
      if (Number(userWallet.balance) < Number(args.p_amount)) {
        return { data: { success: false, error: 'Credito insufficiente.' }, error: null };
      }

      // Process transaction
      userWallet.balance = Number(userWallet.balance) - Number(args.p_amount);
      if (trainerWallet) {
        trainerWallet.balance = Number(trainerWallet.balance) + Number(args.p_amount);
      }
      localStorage.setItem('gc_mock_wallets', JSON.stringify(wallets));

      // Log transactions
      const txs = JSON.parse(localStorage.getItem('gc_mock_transactions') || '[]');
      txs.push({
        id: uuidv4(),
        wallet_id: userWallet.id,
        amount: -Number(args.p_amount),
        type: 'booking_payment',
        description: 'Pagamento prenotazione sessione PT',
        created_at: new Date().toISOString(),
      });
      if (trainerWallet) {
        txs.push({
          id: uuidv4(),
          wallet_id: trainerWallet.id,
          amount: Number(args.p_amount),
          type: 'booking_income',
          description: 'Compenso sessione PT ricevuta',
          created_at: new Date().toISOString(),
        });
      }
      localStorage.setItem('gc_mock_transactions', JSON.stringify(txs));

      // Update booking status
      const bookings = JSON.parse(localStorage.getItem('gc_mock_bookings') || '[]');
      const bIdx = bookings.findIndex((b: any) => b.id === args.p_booking_id);
      if (bIdx > -1) {
        bookings[bIdx].status = 'confirmed';
        localStorage.setItem('gc_mock_bookings', JSON.stringify(bookings));
      }

      return { data: { success: true }, error: null };
    }
    case 'pay_for_workout_plan': {
      const plans = JSON.parse(localStorage.getItem('gc_mock_workout_plans') || '[]');
      const plan = plans.find((p: any) => p.id === args.p_plan_id);
      if (!plan) return { data: { success: false, error: 'Piano non trovato' }, error: null };

      const wallets = JSON.parse(localStorage.getItem('gc_mock_wallets') || '[]');
      const userWallet = wallets.find((w: any) => w.user_id === args.p_user_id);
      if (!userWallet) return { data: { success: false, error: 'Wallet utente non trovato' }, error: null };

      const price = Number(plan.price);
      if (Number(userWallet.balance) < price) {
        return { data: { success: false, error: 'Credito insufficiente per sbloccare questa scheda.' }, error: null };
      }

      // Deduct credits
      userWallet.balance = Number(userWallet.balance) - price;
      
      // Credit trainer if present
      if (plan.trainer_id) {
        const trainerWallet = wallets.find((w: any) => w.user_id === plan.trainer_id);
        if (trainerWallet) {
          trainerWallet.balance = Number(trainerWallet.balance) + price;
        }
      }
      localStorage.setItem('gc_mock_wallets', JSON.stringify(wallets));

      // Log transactions
      const txs = JSON.parse(localStorage.getItem('gc_mock_transactions') || '[]');
      txs.push({
        id: uuidv4(),
        wallet_id: userWallet.id,
        amount: -price,
        type: 'workout_plan_payment',
        description: `Acquisto scheda: ${plan.title}`,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('gc_mock_transactions', JSON.stringify(txs));

      // Update plan payment status
      plan.payment_status = 'completed';
      localStorage.setItem('gc_mock_workout_plans', JSON.stringify(plans));

      return { data: { success: true }, error: null };
    }
    case 'manage_gym_profile': {
      const gymProfs = JSON.parse(localStorage.getItem('gc_mock_gym_profiles') || '[]');
      const existingIdx = gymProfs.findIndex((g: any) => g.id === args.p_user_id);

      const updatedGym = {
        id: args.p_user_id,
        gym_name: args.p_gym_name,
        business_email: args.p_business_email,
        address: args.p_address,
        city: args.p_city,
        postal_code: args.p_postal_code,
        description: args.p_description,
        facilities: args.p_facilities,
        specializations: args.p_specializations,
        opening_days: args.p_opening_days,
        opening_hours: args.p_opening_hours,
        closing_hours: args.p_closing_hours,
        member_capacity: args.p_member_capacity,
        subscription_plans: args.p_subscription_plans,
        monthly_fee: args.p_monthly_fee,
        day_pass_fee: args.p_day_pass_fee,
        website_url: args.p_website_url,
        social_media: args.p_social_media,
        opening_hours_map: args.p_opening_hours_map,
        updated_at: new Date().toISOString(),
      };

      if (existingIdx > -1) {
        gymProfs[existingIdx] = { ...gymProfs[existingIdx], ...updatedGym };
      } else {
        gymProfs.push(updatedGym);
      }

      localStorage.setItem('gc_mock_gym_profiles', JSON.stringify(gymProfs));

      return { data: updatedGym, error: null };
    }
    default:
      console.warn(`RPC function ${fn} is not mocked.`);
      return { data: null, error: { message: `Function ${fn} not mocked` } };
  }
};

// Export mocked supabase client
export const mockSupabaseClient = {
  auth: {
    signUp: async ({ email, password, options }: any) => {
      console.log('Mock Auth: signUp', email);
      initMockDB();

      const profiles = JSON.parse(localStorage.getItem('gc_mock_profiles') || '[]');
      if (profiles.some((p: any) => p.email === email)) {
        return {
          data: { user: null, session: null },
          error: { message: 'User already registered', status: 400 },
        };
      }

      const newUserId = uuidv4();
      const meta = options?.data || {};

      // Insert base profile
      const newProfile = {
        id: newUserId,
        email,
        first_name: meta.first_name || '',
        last_name: meta.last_name || '',
        user_type: meta.user_type || 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      profiles.push(newProfile);
      localStorage.setItem('gc_mock_profiles', JSON.stringify(profiles));

      // Trigger sub profiles
      const userType = meta.user_type || 'user';
      if (userType === 'user') {
        const userProfs = JSON.parse(localStorage.getItem('gc_mock_user_profiles') || '[]');
        userProfs.push({ id: newUserId });
        localStorage.setItem('gc_mock_user_profiles', JSON.stringify(userProfs));
      } else if (userType === 'trainer') {
        const trainerProfs = JSON.parse(localStorage.getItem('gc_mock_trainer_profiles') || '[]');
        trainerProfs.push({ id: newUserId, bio: '', specializations: [], years_experience: 1 });
        localStorage.setItem('gc_mock_trainer_profiles', JSON.stringify(trainerProfs));
      } else if (userType === 'gym_owner') {
        const gymProfs = JSON.parse(localStorage.getItem('gc_mock_gym_profiles') || '[]');
        gymProfs.push({ id: newUserId, gym_name: 'Nuova Palestra' });
        localStorage.setItem('gc_mock_gym_profiles', JSON.stringify(gymProfs));
      }

      // Initialize wallet
      const wallets = JSON.parse(localStorage.getItem('gc_mock_wallets') || '[]');
      wallets.push({ id: uuidv4(), user_id: newUserId, balance: 100 });
      localStorage.setItem('gc_mock_wallets', JSON.stringify(wallets));

      const mockSession = {
        access_token: 'mock-session-token',
        user: { id: newUserId, email },
      };

      localStorage.setItem('gc_mock_session', JSON.stringify(mockSession));

      // Trigger listeners
      authListeners.forEach((cb) => cb('SIGNED_IN', mockSession));

      return { data: { user: mockSession.user, session: mockSession }, error: null };
    },

    signInWithPassword: async ({ email, password }: any) => {
      console.log('Mock Auth: signInWithPassword', email);
      initMockDB();

      const profiles = JSON.parse(localStorage.getItem('gc_mock_profiles') || '[]');
      const matchedProfile = profiles.find((p: any) => p.email === email);

      if (!matchedProfile) {
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials', status: 400 },
        };
      }

      const mockSession = {
        access_token: 'mock-session-token',
        user: { id: matchedProfile.id, email: matchedProfile.email },
      };

      localStorage.setItem('gc_mock_session', JSON.stringify(mockSession));
      authListeners.forEach((cb) => cb('SIGNED_IN', mockSession));

      return { data: { user: mockSession.user, session: mockSession }, error: null };
    },

    signInWithOAuth: async ({ provider, options }: any) => {
      console.log('Mock Auth: signInWithOAuth', provider);
      initMockDB();

      const newUserId = 'oauth-user-id';
      const mockSession = {
        access_token: 'mock-oauth-session-token',
        user: { id: newUserId, email: 'google.user@test.com' },
      };

      const profiles = JSON.parse(localStorage.getItem('gc_mock_profiles') || '[]');
      if (!profiles.some((p: any) => p.id === newUserId)) {
        profiles.push({
          id: newUserId,
          email: 'google.user@test.com',
          first_name: 'Google',
          last_name: 'User',
          user_type: 'user',
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('gc_mock_profiles', JSON.stringify(profiles));
      }

      localStorage.setItem('gc_mock_session', JSON.stringify(mockSession));
      authListeners.forEach((cb) => cb('SIGNED_IN', mockSession));

      if (options?.redirectTo) {
        window.location.href = options.redirectTo;
      }

      return { error: null };
    },

    signOut: async () => {
      console.log('Mock Auth: signOut');
      localStorage.removeItem('gc_mock_session');
      authListeners.forEach((cb) => cb('SIGNED_OUT', null));
      return { error: null };
    },

    getSession: async () => {
      const session = getAuthSession();
      return { data: { session }, error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      authListeners.push(callback);
      const session = getAuthSession();
      // Trigger initial call asynchronously to allow component mounting first
      setTimeout(() => {
        callback(session ? 'INITIAL_SESSION' : 'SIGNED_OUT', session);
      }, 0);

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const idx = authListeners.indexOf(callback);
              if (idx > -1) authListeners.splice(idx, 1);
            },
          },
        },
      };
    },
  },

  from: (table: string) => {
    return new MockQueryBuilder(table);
  },

  rpc: mockRpc,
};
