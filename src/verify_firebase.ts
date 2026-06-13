import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

// Load environment variables from .env
dotenv.config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

async function verify() {
  console.log(`\n${colors.bold}${colors.cyan}=== GYMCONNECT AI - FIREBASE INTEGRATION VERIFIER ===${colors.reset}\n`);

  let errors = 0;
  let warnings = 0;

  // 1. Check .env file
  console.log(`${colors.bold}1. Verifica del file .env...${colors.reset}`);
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.log(`  ❌ ${colors.red}File .env non trovato nella cartella principale!${colors.reset}`);
    console.log(`     Crea un file chiamato .env inserendo le tue chiavi di Firebase.`);
    errors++;
    return;
  } else {
    console.log(`  ✅ ${colors.green}File .env individuato.${colors.reset}`);
  }

  // 2. Check keys in .env
  const keys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  let missingKeys = 0;
  keys.forEach(key => {
    const value = process.env[key];
    if (!value || value === '' || value.includes('inserisci_qui')) {
      console.log(`  ❌ ${colors.red}Chiave mancante o non impostata nel .env: ${key}${colors.reset}`);
      missingKeys++;
    }
  });

  if (missingKeys > 0) {
    errors += missingKeys;
    console.log(`\n  ⚠️  ${colors.yellow}Risolvi i problemi del file .env prima di procedere con i test di connessione.${colors.reset}\n`);
    return;
  } else {
    console.log(`  ✅ ${colors.green}Tutte le chiavi di Firebase sono presenti nel file .env.${colors.reset}`);
  }

  // 3. Test API Key validity via REST API fetch
  console.log(`\n${colors.bold}2. Verifica validità API Key con Google Firebase...${colors.reset}`);
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true })
    });
    const data = await response.json();
    
    if (data.error && data.error.message === 'API_KEY_INVALID') {
      console.log(`  ❌ ${colors.red}La chiave API di Firebase (VITE_FIREBASE_API_KEY) non è valida!${colors.reset}`);
      console.log(`     Controlla di averla copiata correttamente dalla Console Firebase.`);
      errors++;
    } else {
      console.log(`  ✅ ${colors.green}La chiave API è valida ed attiva.${colors.reset}`);
    }
  } catch (err: any) {
    console.log(`  ⚠️  ${colors.yellow}Impossibile connettersi alle API Firebase per il controllo chiave (Errore di rete).${colors.reset}`);
    warnings++;
  }

  // 4. Test Firestore Connection and Rules
  console.log(`\n${colors.bold}3. Verifica Connessione Database (Cloud Firestore)...${colors.reset}`);
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
  };

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log(`  - Connessione a Firestore in corso...`);
    const testDocId = `test_verification_${Date.now()}`;
    const testDocRef = doc(db, '_migration_test', testDocId);

    // Try to write
    await setDoc(testDocRef, { 
      verified: true, 
      timestamp: new Date().toISOString() 
    });
    console.log(`  ✅ ${colors.green}Scrittura nel database Firestore riuscita.${colors.reset}`);

    // Try to read
    const snap = await getDoc(testDocRef);
    if (snap.exists() && snap.data()?.verified === true) {
      console.log(`  ✅ ${colors.green}Lettura dal database Firestore riuscita.${colors.reset}`);
    } else {
      console.log(`  ❌ ${colors.red}La lettura del documento di test non ha restituito i dati attesi.${colors.reset}`);
      errors++;
    }

    // Clean up test document
    await deleteDoc(testDocRef);
    console.log(`  ✅ ${colors.green}Pulizia del documento di test completata.${colors.reset}`);

  } catch (err: any) {
    console.log(`  ❌ ${colors.red}Connessione a Firestore fallita!${colors.reset}`);
    console.log(`     Dettagli errore: ${err.message}`);
    console.log(`     Suggerimenti:`);
    console.log(`     1. Assicurati che Cloud Firestore sia abilitato nel tuo progetto Firebase.`);
    console.log(`     2. Verifica che le Regole di Sicurezza in Firebase permettano la scrittura (es. avvia in modalità test).`);
    errors++;
  }

  // 5. Check Firebase CLI & Hosting files
  console.log(`\n${colors.bold}4. Verifica Configurazioni Hosting...${colors.reset}`);
  
  const rcPath = path.resolve(process.cwd(), '.firebaserc');
  if (fs.existsSync(rcPath)) {
    console.log(`  ✅ ${colors.green}File .firebaserc configurato correttamente.${colors.reset}`);
  } else {
    console.log(`  ⚠️  ${colors.yellow}File .firebaserc non trovato. Verrà ricreato al deploy.${colors.reset}`);
    warnings++;
  }

  const jsonPath = path.resolve(process.cwd(), 'firebase.json');
  if (fs.existsSync(jsonPath)) {
    console.log(`  ✅ ${colors.green}File firebase.json (Hosting configurato per cartella /dist).${colors.reset}`);
  } else {
    console.log(`  ❌ ${colors.red}File firebase.json non trovato!${colors.reset}`);
    errors++;
  }

  // Final Verdict
  console.log(`\n${colors.bold}=== VERDETTO FINALE ===${colors.reset}`);
  if (errors === 0) {
    console.log(`\n  🎉 ${colors.bold}${colors.green}COMPLIMENTI! La migrazione a Firebase è configurata al 100% con successo!${colors.reset}`);
    console.log(`     Ora puoi procedere con la build e il deploy:`);
    console.log(`     ${colors.cyan}npm run build${colors.reset}`);
    console.log(`     ${colors.cyan}firebase deploy --only hosting${colors.reset}\n`);
  } else {
    console.log(`\n  ❌ ${colors.bold}${colors.red}ATTENZIONE: Trovati ${errors} errori e ${warnings} avvisi.${colors.reset}`);
    console.log(`     Risolvi gli errori sopra descritti prima di provare a compilare o caricare il sito.\n`);
  }
}

verify();
