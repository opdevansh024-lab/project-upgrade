const statusNode = () => document.getElementById('accountStatus');
const accountButton = () => document.getElementById('accountButton');
let client = null;
let currentUser = null;
let saveTimer = null;
let syncing = false;
let queuedState = null;
let dirty = false;

function status(message, connected = false) {
  const node = statusNode();
  if (node) node.textContent = message;
  const button = accountButton();
  if (button) button.textContent = currentUser ? 'Account' : 'Sign in';
  document.documentElement.dataset.cloudConnected = connected ? 'true' : 'false';
}
function openAccount() { document.getElementById('accountOverlay')?.classList.add('open'); }
function closeAccount() { document.getElementById('accountOverlay')?.classList.remove('open'); }
function setBusy(busy) {
  document.querySelectorAll('#accountForm button').forEach((button) => button.disabled = busy);
}
function readLocalState() {
  try { return JSON.parse(localStorage.getItem('forgeState') || '{}'); }
  catch { return {}; }
}
async function loadCloudState() {
  if (!client || !currentUser) return;
  status('Syncing your account…', true);
  const { data, error } = await client.from('fitness_state').select('state').eq('user_id', currentUser.id).maybeSingle();
  if (error) { status('Signed in · cloud setup needs attention', false); console.error('FORGE cloud read:', error.message); return; }
  if (data?.state) {
    localStorage.setItem('forgeState', JSON.stringify(data.state));
    status('Cloud sync on', true);
    location.reload();
    return;
  }
  status('Account ready · saving this device’s demo data', true);
  queueSave(readLocalState());
}
async function flushSave() {
  if (!client || !currentUser || !queuedState || syncing) return;
  syncing = true;
  const state = queuedState;
  queuedState = null;
  const { error } = await client.from('fitness_state').upsert({ user_id: currentUser.id, state, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  syncing = false;
  if (error) {
    queuedState ||= state;
    status('Signed in · cloud save failed', false);
    console.error('FORGE cloud save:', error.message);
  } else {
    dirty = false;
    status('Cloud sync on · saved', true);
    if (queuedState) flushSave();
  }
}
function queueSave(state) {
  if (!client || !currentUser) { dirty = true; return; }
  queuedState = state;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 700);
}
async function submitAccount(event) {
  event.preventDefault();
  if (!client) { status('Add your Supabase URL and public key first', false); return; }
  const form = event.currentTarget;
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  const mode = form.elements.mode.value;
  setBusy(true);
  try {
    const result = mode === 'signup'
      ? await client.auth.signUp({ email, password })
      : await client.auth.signInWithPassword({ email, password });
    if (result.error) throw result.error;
    if (mode === 'signup' && !result.data.session) {
      status('Check your email to confirm your account', false);
      return;
    }
    currentUser = result.data.user;
    closeAccount();
    await loadCloudState();
  } catch (error) {
    status(error.message || 'Could not sign in', false);
  } finally { setBusy(false); }
}
async function signOut() {
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) status(error.message, false);
  else { currentUser = null; status('Signed out · this device keeps its demo data', false); closeAccount(); }
}
window.FORGE_ACCOUNT = { open: openAccount, close: closeAccount, submit: submitAccount, signOut };
window.FORGE_SYNC = { queue: queueSave };

const config = window.FORGE_SUPABASE_CONFIG;
if (!config?.url || !config?.publishableKey || config.url.includes('YOUR_PROJECT') || config.publishableKey.includes('YOUR_')) {
  status('Demo mode · add Supabase config to enable accounts');
} else {
  import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
    .then(async ({ createClient }) => {
      client = createClient(config.url, config.publishableKey);
      const { data } = await client.auth.getSession();
      currentUser = data.session?.user || null;
      client.auth.onAuthStateChange((event, session) => {
        currentUser = session?.user || null;
        if (event === 'INITIAL_SESSION') return;
        if (currentUser) setTimeout(() => loadCloudState(), 0);
        else status('Signed out · this device keeps its demo data');
      });
      if (currentUser) await loadCloudState();
      else status('Ready · sign in to turn on cloud sync');
    })
    .catch((error) => { status('Supabase client could not load', false); console.error(error); });
}


