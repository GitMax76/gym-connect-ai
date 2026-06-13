import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth } from './config';

class FirestoreQueryBuilder {
  private colName: string;
  private constraints: any[] = [];
  private orderField: string | null = null;
  private orderDirection: 'asc' | 'desc' = 'asc';
  private limitVal: number | null = null;
  private clientFilters: ((item: any) => boolean)[] = [];
  private insertData: any = undefined;
  private updateData: any = undefined;
  private upsertData: any = undefined;
  private isDelete = false;

  constructor(colName: string) {
    this.colName = colName;
  }

  select(fields?: string) {
    return this;
  }

  eq(col: string, val: any) {
    if (col.startsWith('profiles.')) {
      const profileCol = col.split('.')[1];
      this.clientFilters.push((item) => {
        const profile = item.profiles || this.getProfileForJoin(item.id || item.user_id || item.trainer_id);
        return profile ? profile[profileCol] === val : false;
      });
    } else {
      this.constraints.push(where(col, '==', val));
    }
    return this;
  }

  neq(col: string, val: any) {
    this.constraints.push(where(col, '!=', val));
    return this;
  }

  or(filterStr: string) {
    this.clientFilters.push((item) => {
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
    if (val && val.length > 0) {
      this.constraints.push(where(col, 'array-contains-any', val));
    }
    return this;
  }

  lte(col: string, val: any) {
    this.constraints.push(where(col, '<=', Number(val)));
    return this;
  }

  gte(col: string, val: any) {
    this.constraints.push(where(col, '>=', Number(val)));
    return this;
  }

  order(col: string, { ascending = true } = {}) {
    this.orderField = col;
    this.orderDirection = ascending ? 'asc' : 'desc';
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
    return null;
  }

  private async executeQuery() {
    if (!db) return [];

    const colRef = collection(db, this.colName);
    const qConstraints = [...this.constraints];

    if (this.orderField) {
      qConstraints.push(orderBy(this.orderField, this.orderDirection));
    }
    if (this.limitVal !== null) {
      qConstraints.push(limit(this.limitVal));
    }

    try {
      const q = query(colRef, ...qConstraints);
      const snap = await getDocs(q);
      
      let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Apply client-side filters
      for (const filter of this.clientFilters) {
        docs = docs.filter(filter);
      }

      // Resolve Joins (fetch linked collection items asynchronously)
      return await Promise.all(
        docs.map(async (item: any) => {
          const resolved = { ...item };

          if (this.colName === 'bookings') {
            const trainerBase = await this.getDocById('profiles', resolved.trainer_id);
            const clientBase = await this.getDocById('profiles', resolved.user_id);
            
            resolved.trainer = {
              profiles: trainerBase ? { first_name: trainerBase.first_name, last_name: trainerBase.last_name } : null,
            };
            resolved.client = clientBase ? { first_name: clientBase.first_name, last_name: clientBase.last_name } : null;
          }

          if (
            this.colName === 'trainer_profiles' ||
            this.colName === 'gym_profiles' ||
            this.colName === 'user_profiles'
          ) {
            const baseProfile = await this.getDocById('profiles', resolved.id);
            resolved.profiles = baseProfile
              ? {
                  first_name: baseProfile.first_name,
                  last_name: baseProfile.last_name,
                  city: baseProfile.city,
                  avatar_url: baseProfile.avatar_url,
                }
              : null;
          }

          if (this.colName === 'workout_plans') {
            const trainerBase = await this.getDocById('profiles', resolved.trainer_id);
            resolved.trainer = trainerBase
              ? {
                  first_name: trainerBase.first_name,
                  last_name: trainerBase.last_name,
                }
              : null;
          }

          return resolved;
        })
      );
    } catch (err) {
      console.error(`Error querying Firestore collection ${this.colName}:`, err);
      return [];
    }
  }

  private async getDocById(colName: string, id: string) {
    if (!db || !id) return null;
    try {
      const docRef = doc(db, colName, id);
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch {
      return null;
    }
  }

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
    if (!db) return { data: null, error: 'Database not initialized' };

    try {
      const rows = Array.isArray(data) ? data : [data];
      const inserted: any[] = [];

      for (const row of rows) {
        const id = row.id || doc(collection(db, this.colName)).id;
        const rowData = { ...row, id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        
        await setDoc(doc(db, this.colName, id), rowData);
        inserted.push(rowData);

        // Mimic trigger behaviors
        if (this.colName === 'profiles') {
          const userType = rowData.user_type || 'user';
          if (userType === 'user') {
            await setDoc(doc(db, 'user_profiles', id), { id }, { merge: true });
          } else if (userType === 'trainer') {
            await setDoc(
              doc(db, 'trainer_profiles', id),
              { id, bio: '', specializations: [], years_experience: 1 },
              { merge: true }
            );
          } else if (userType === 'gym_owner') {
            await setDoc(doc(db, 'gym_profiles', id), { id, gym_name: 'Nuova Palestra' }, { merge: true });
          }

          // Wallet
          await setDoc(
            doc(db, 'wallets', id),
            { id: doc(collection(db, 'wallets')).id, user_id: id, balance: 100 },
            { merge: true }
          );
        }
      }

      return { data: Array.isArray(data) ? inserted : inserted[0], error: null };
    } catch (err: any) {
      console.error('Firestore insert error:', err);
      return { data: null, error: err };
    }
  }

  private async executeUpdate(updates: any) {
    if (!db) return { data: null, error: 'Database not initialized' };

    try {
      const queryResults = await this.executeQuery();
      const updated: any[] = [];

      for (const item of queryResults) {
        const docRef = doc(db, this.colName, item.id);
        const updateData = { ...updates, updated_at: new Date().toISOString() };
        await updateDoc(docRef, updateData);
        updated.push({ ...item, ...updateData });
      }

      return { data: updated, error: null };
    } catch (err: any) {
      console.error('Firestore update error:', err);
      return { data: null, error: err };
    }
  }

  private async executeUpsert(data: any) {
    if (!db) return { data: null, error: 'Database not initialized' };

    try {
      const rows = Array.isArray(data) ? data : [data];
      const upserted: any[] = [];

      for (const row of rows) {
        const id = row.id || doc(collection(db, this.colName)).id;
        const docRef = doc(db, this.colName, id);
        const updateData = { ...row, id, updated_at: new Date().toISOString() };
        
        await setDoc(docRef, updateData, { merge: true });
        upserted.push(updateData);

        if (this.colName === 'profiles') {
          const userType = updateData.user_type || 'user';
          if (userType === 'user') {
            await setDoc(doc(db, 'user_profiles', id), { id }, { merge: true });
          } else if (userType === 'trainer') {
            await setDoc(
              doc(db, 'trainer_profiles', id),
              { id, bio: '', specializations: [], years_experience: 1 },
              { merge: true }
            );
          } else if (userType === 'gym_owner') {
            await setDoc(doc(db, 'gym_profiles', id), { id, gym_name: 'Nuova Palestra' }, { merge: true });
          }
        }
      }

      return { data: Array.isArray(data) ? upserted : upserted[0], error: null };
    } catch (err: any) {
      console.error('Firestore upsert error:', err);
      return { data: null, error: err };
    }
  }

  private async executeDelete() {
    if (!db) return { data: null, error: 'Database not initialized' };

    try {
      const queryResults = await this.executeQuery();
      for (const item of queryResults) {
        await deleteDoc(doc(db, this.colName, item.id));
      }
      return { data: queryResults, error: null };
    } catch (err: any) {
      console.error('Firestore delete error:', err);
      return { data: null, error: err };
    }
  }

  async single() {
    let results = [];
    let error: any = null;

    try {
      if (this.insertData !== undefined) {
        const res = await this.executeInsert(this.insertData);
        results = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
        error = res.error;
      } else if (this.updateData !== undefined) {
        const res = await this.executeUpdate(this.updateData);
        results = res.data || [];
        error = res.error;
      } else if (this.upsertData !== undefined) {
        const res = await this.executeUpsert(this.upsertData);
        results = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
        error = res.error;
      } else if (this.isDelete) {
        const res = await this.executeDelete();
        results = res.data || [];
        error = res.error;
      } else {
        results = await this.executeQuery();
      }
    } catch (err) {
      error = err;
    }

    if (error) {
      return { data: null, error };
    }
    if (results.length === 0) {
      return { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
    }
    return { data: results[0], error: null };
  }

  async maybeSingle() {
    let results = [];
    let error: any = null;

    try {
      if (this.insertData !== undefined) {
        const res = await this.executeInsert(this.insertData);
        results = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
        error = res.error;
      } else if (this.updateData !== undefined) {
        const res = await this.executeUpdate(this.updateData);
        results = res.data || [];
        error = res.error;
      } else if (this.upsertData !== undefined) {
        const res = await this.executeUpsert(this.upsertData);
        results = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
        error = res.error;
      } else if (this.isDelete) {
        const res = await this.executeDelete();
        results = res.data || [];
        error = res.error;
      } else {
        results = await this.executeQuery();
      }
    } catch (err) {
      error = err;
    }

    if (error) {
      return { data: null, error };
    }
    if (results.length === 0) {
      return { data: null, error: null };
    }
    return { data: results[0], error: null };
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    const run = async () => {
      try {
        if (this.insertData !== undefined) {
          return await this.executeInsert(this.insertData);
        } else if (this.updateData !== undefined) {
          return await this.executeUpdate(this.updateData);
        } else if (this.upsertData !== undefined) {
          return await this.executeUpsert(this.upsertData);
        } else if (this.isDelete) {
          return await this.executeDelete();
        } else {
          const results = await this.executeQuery();
          return { data: results, error: null };
        }
      } catch (err: any) {
        return { data: null, error: err.message || err };
      }
    };

    return run().then(onfulfilled, onrejected);
  }
}

const getFirebaseSession = () => {
  const currentUser = auth?.currentUser;
  if (!currentUser) return null;
  return {
    access_token: 'firebase-token',
    user: { id: currentUser.uid, email: currentUser.email },
  };
};

const authListeners: ((event: string, session: any) => void)[] = [];

if (auth) {
  onAuthStateChanged(auth, (user) => {
    const session = user ? { access_token: 'firebase-token', user: { id: user.uid, email: user.email } } : null;
    authListeners.forEach((cb) => cb(user ? 'SIGNED_IN' : 'SIGNED_OUT', session));
  });
}

// Auth Adapter matching Supabase signature
export const firebaseAuthAdapter = {
  signUp: async (credentials: any) => {
    if (!auth || !db) return { data: { user: null, session: null }, error: new Error('Firebase not initialized') };
    try {
      const { email, password, options } = credentials;
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const meta = options?.data || {};

      // Create base profile
      await setDoc(doc(db, 'profiles', user.uid), {
        id: user.uid,
        email,
        first_name: meta.first_name || '',
        last_name: meta.last_name || '',
        user_type: meta.user_type || 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Specific profile type replication
      const userType = meta.user_type || 'user';
      if (userType === 'user') {
        await setDoc(doc(db, 'user_profiles', user.uid), { id: user.uid });
      } else if (userType === 'trainer') {
        await setDoc(
          doc(db, 'trainer_profiles', user.uid),
          { id: user.uid, bio: '', specializations: [], years_experience: 1 },
          { merge: true }
        );
      } else if (userType === 'gym_owner') {
        await setDoc(doc(db, 'gym_profiles', user.uid), { id: user.uid, gym_name: 'Nuova Palestra' });
      }

      // Wallet Initialization
      await setDoc(
        doc(db, 'wallets', user.uid),
        { id: doc(collection(db, 'wallets')).id, user_id: user.uid, balance: 100 },
        { merge: true }
      );

      const session = { access_token: 'firebase-token', user: { id: user.uid, email } };
      return { data: { user, session }, error: null };
    } catch (err: any) {
      console.error('Firebase Auth signUp error:', err);
      return { data: { user: null, session: null }, error: err };
    }
  },

  signInWithPassword: async (credentials: any) => {
    if (!auth) return { data: { user: null, session: null }, error: new Error('Firebase not initialized') };
    try {
      const { email, password } = credentials;
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const session = { access_token: 'firebase-token', user: { id: user.uid, email } };
      return { data: { user, session }, error: null };
    } catch (err: any) {
      console.error('Firebase Auth signIn error:', err);
      return { data: { user: null, session: null }, error: err };
    }
  },

  signInWithOAuth: async ({ provider, options }: any) => {
    // Basic OAuth handler placeholder
    return { error: null };
  },

  signOut: async () => {
    if (auth) await fbSignOut(auth);
    return { error: null };
  },

  getSession: async () => {
    const session = getFirebaseSession();
    return { data: { session }, error: null };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    authListeners.push(callback);
    const session = getFirebaseSession();
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
};

// Custom RPC logic mapping (Firebase client-side transactions)
const firebaseRpc = async (fn: string, args: any) => {
  if (!db) return { data: null, error: new Error('Firebase not initialized') };

  switch (fn) {
    case 'calculate_match_score': {
      return { data: 75 + Math.floor(Math.random() * 25), error: null };
    }
    case 'check_trainer_availability': {
      return { data: true, error: null };
    }
    case 'apply_referral_code': {
      const currentUser = auth?.currentUser;
      if (!currentUser) return { data: { success: false, error: 'No user session' }, error: null };

      try {
        const walletRef = doc(db, 'wallets', currentUser.uid);
        const snap = await getDoc(walletRef);
        if (snap.exists()) {
          const wData = snap.data();
          const newBal = Number(wData.balance || 0) + 15;
          await updateDoc(walletRef, { balance: newBal });

          await addDoc(collection(db, 'transactions'), {
            wallet_id: wData.id,
            amount: 15,
            type: 'referral_bonus',
            description: `Referral Bonus sbloccato (${args.code_input})`,
            created_at: new Date().toISOString(),
          });
          return { data: { success: true }, error: null };
        }
        return { data: { success: false, error: 'Wallet non trovato' }, error: null };
      } catch (err: any) {
        return { data: { success: false, error: err.message }, error: err };
      }
    }
    case 'process_booking_payment': {
      try {
        const userWalletRef = doc(db, 'wallets', args.p_user_id);
        const userSnap = await getDoc(userWalletRef);
        if (!userSnap.exists()) return { data: { success: false, error: 'Wallet non trovato' }, error: null };

        const uData = userSnap.data();
        if (Number(uData.balance || 0) < Number(args.p_amount)) {
          return { data: { success: false, error: 'Credito insufficiente.' }, error: null };
        }

        // Deduct from user
        await updateDoc(userWalletRef, { balance: Number(uData.balance) - Number(args.p_amount) });

        // Credit trainer
        const trainerWalletRef = doc(db, 'wallets', args.p_trainer_id);
        const trainerSnap = await getDoc(trainerWalletRef);
        if (trainerSnap.exists()) {
          await updateDoc(trainerWalletRef, { balance: Number(trainerSnap.data().balance || 0) + Number(args.p_amount) });
        }

        // Transactions log
        await addDoc(collection(db, 'transactions'), {
          wallet_id: uData.id,
          amount: -Number(args.p_amount),
          type: 'booking_payment',
          description: 'Pagamento prenotazione sessione PT',
          created_at: new Date().toISOString(),
        });

        if (trainerSnap.exists()) {
          await addDoc(collection(db, 'transactions'), {
            wallet_id: trainerSnap.data().id,
            amount: Number(args.p_amount),
            type: 'booking_income',
            description: 'Compenso sessione PT ricevuta',
            created_at: new Date().toISOString(),
          });
        }

        // Update booking status
        const bookingRef = doc(db, 'bookings', args.p_booking_id);
        await updateDoc(bookingRef, { status: 'confirmed' });

        return { data: { success: true }, error: null };
      } catch (err: any) {
        return { data: { success: false, error: err.message }, error: err };
      }
    }
    case 'pay_for_workout_plan': {
      try {
        const planRef = doc(db, 'workout_plans', args.p_plan_id);
        const planSnap = await getDoc(planRef);
        if (!planSnap.exists()) return { data: { success: false, error: 'Piano non trovato' }, error: null };

        const planData = planSnap.data();
        const userWalletRef = doc(db, 'wallets', args.p_user_id);
        const userSnap = await getDoc(userWalletRef);
        if (!userSnap.exists()) return { data: { success: false, error: 'Wallet utente non trovato' }, error: null };

        const uData = userSnap.data();
        const price = Number(planData.price || 0);

        if (Number(uData.balance || 0) < price) {
          return { data: { success: false, error: 'Credito insufficiente per sbloccare questa scheda.' }, error: null };
        }

        // Process deduction
        await updateDoc(userWalletRef, { balance: Number(uData.balance) - price });

        if (planData.trainer_id) {
          const trainerWalletRef = doc(db, 'wallets', planData.trainer_id);
          const trainerSnap = await getDoc(trainerWalletRef);
          if (trainerSnap.exists()) {
            await updateDoc(trainerWalletRef, { balance: Number(trainerSnap.data().balance || 0) + price });
          }
        }

        // Add transaction log
        await addDoc(collection(db, 'transactions'), {
          wallet_id: uData.id,
          amount: -price,
          type: 'workout_plan_payment',
          description: `Acquisto scheda: ${planData.title}`,
          created_at: new Date().toISOString(),
        });

        // Unlock plan
        await updateDoc(planRef, { payment_status: 'completed' });

        return { data: { success: true }, error: null };
      } catch (err: any) {
        return { data: { success: false, error: err.message }, error: err };
      }
    }
    case 'manage_gym_profile': {
      try {
        const gymRef = doc(db, 'gym_profiles', args.p_user_id);
        const updatedGym = {
          id: args.p_user_id,
          gym_name: args.p_gym_name,
          business_email: args.p_business_email || '',
          address: args.p_address || '',
          city: args.p_city || '',
          postal_code: args.p_postal_code || '',
          description: args.p_description || '',
          facilities: args.p_facilities || [],
          specializations: args.p_specializations || [],
          opening_days: args.p_opening_days || [],
          opening_hours: args.p_opening_hours || '',
          closing_hours: args.p_closing_hours || '',
          member_capacity: args.p_member_capacity ? Number(args.p_member_capacity) : null,
          subscription_plans: args.p_subscription_plans || [],
          monthly_fee: args.p_monthly_fee ? Number(args.p_monthly_fee) : null,
          day_pass_fee: args.p_day_pass_fee ? Number(args.p_day_pass_fee) : null,
          website_url: args.p_website_url || '',
          social_media: args.p_social_media || null,
          opening_hours_map: args.p_opening_hours_map || null,
          updated_at: new Date().toISOString(),
        };

        await setDoc(gymRef, updatedGym, { merge: true });
        return { data: updatedGym, error: null };
      } catch (err: any) {
        return { data: null, error: err.message || err };
      }
    }
    default:
      return { data: null, error: new Error(`RPC function ${fn} is not mocked for Firestore`) };
  }
};

export const firebaseClientAdapter = {
  auth: firebaseAuthAdapter,
  from: (collectionName: string) => {
    return new FirestoreQueryBuilder(collectionName);
  },
  rpc: firebaseRpc,
};
