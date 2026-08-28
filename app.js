'use strict';

// ═══════════════════════════════════════════════════════════════════════════
//  CONFIGURATION — modifier ces deux sections pour ton stream
// ═══════════════════════════════════════════════════════════════════════════

// Date/heure de démarrage du stream (UTC).
// Tous les visiteurs calculent leur position par rapport à cette date :
// synchronisation parfaite, sans serveur.
// Pour générer la valeur du moment présent, tape dans la console :
//   new Date().toISOString()
const STREAM_START = new Date('2026-08-28T00:00:00Z'); // minuit UTC = 2h du matin Paris

// Playlist — chaque entrée correspond à un fichier réel dans videos/.
// • folder   : sous-dossier dans videos/ (ex: 's1')
// • file     : nom exact du fichier (avec son extension)
// • title    : affiché à l'écran
// • duration : durée en secondes (récupérée automatiquement via Windows)
//
// Pour ajouter un fichier : copier une ligne, ajuster folder/file/title/duration.
// Pour connaître la durée sans ffprobe, lancer dans PowerShell :
//   $sh = New-Object -ComObject Shell.Application
//   $f  = $sh.Namespace("C:\kaamelive\videos\s4")
//   $it = $f.ParseName("mon_fichier.mp4")
//   $f.GetDetailsOf($it, 27)
const playlist = [
  // ── Livre I ──────────────────────────────────────────────────────────────
  { folder: 's1', file: 'Kaamelott - Livre 1 - Tome 1.mp4', title: 'Livre I - Tome 1', duration: 10563 },
  { folder: 's1', file: 'Kaamelott - Livre 1 - Tome 2.mp4', title: 'Livre I - Tome 2', duration: 10614 },
  // ── Livre II ─────────────────────────────────────────────────────────────
  { folder: 's2', file: 'Kaamelott - Livre 2 - Tome 1.mp4', title: 'Livre II - Tome 1', duration: 11054 },
  { folder: 's2', file: 'Kaamelott - Livre 2 - Tome 2.mp4', title: 'Livre II - Tome 2', duration: 11232 },
  // ── Livre III ────────────────────────────────────────────────────────────
  { folder: 's3', file: 'Kaamelott - Livre 3 - Tome 1.mp4', title: 'Livre III - Tome 1', duration: 11201 },
  { folder: 's3', file: 'Kaamelott - Livre 3 - Tome 2.mp4', title: 'Livre III - Tome 2', duration: 11175 },
  // ── Livre IV ─────────────────────────────────────────────────────────────
  { folder: 's4', file: '001    Tous les matins du monde 1re partie.mp4', title: 'Livre IV - Tous les matins du monde (1/2)', duration: 218 },
  { folder: 's4', file: '002    Tous les matins du monde 2e partie.mp4',  title: 'Livre IV - Tous les matins du monde (2/2)', duration: 217 },
  { folder: 's4', file: '003    Raison et Sentiments.mp4',                title: 'Livre IV - Raison et Sentiments',           duration: 208 },
  { folder: 's4', file: '004    Les Tartes aux fraises.mp4',              title: 'Livre IV - Les Tartes aux fraises',         duration: 205 },
  { folder: 's4', file: '005    Le Dédale.mp4',                           title: 'Livre IV - Le Dédale',                      duration: 223 },
  { folder: 's4', file: '006    Les Pisteurs.mp4',                        title: 'Livre IV - Les Pisteurs',                   duration: 216 },
  { folder: 's4', file: '007    Le Traître.mp4',                          title: 'Livre IV - Le Traître',                     duration: 219 },
  { folder: 's4', file: '008    La Faute 1re partie.mp4',                 title: 'Livre IV - La Faute (1/2)',                  duration: 215 },
  { folder: 's4', file: '009    La Faute 2e partie.mp4',                  title: 'Livre IV - La Faute (2/2)',                  duration: 229 },
  { folder: 's4', file: "010    L'Ascension du Lion.mp4",                 title: "Livre IV - L'Ascension du Lion",             duration: 225 },
  { folder: 's4', file: '011    Une vie simple.mp4',                      title: 'Livre IV - Une vie simple',                  duration: 225 },
  { folder: 's4', file: '012    Le Privilégié.mp4',                       title: 'Livre IV - Le Privilégié',                   duration: 195 },
  { folder: 's4', file: '013    Le Bouleversé.mp4',                       title: 'Livre IV - Le Bouleversé',                   duration: 225 },
  { folder: 's4', file: '014    Les Liaisons dangereuses.mp4',            title: 'Livre IV - Les Liaisons dangereuses',        duration: 216 },
  { folder: 's4', file: '015    Les Exploités II.mp4',                    title: 'Livre IV - Les Exploités II',                duration: 209 },
  { folder: 's4', file: '016    Dagonet et le Cadastre.mp4',              title: 'Livre IV - Dagonet et le Cadastre',          duration: 228 },
  { folder: 's4', file: '017    Duel 1re partie.mp4',                     title: 'Livre IV - Duel (1/2)',                      duration: 218 },
  { folder: 's4', file: '018    Duel 2e partie.mp4',                      title: 'Livre IV - Duel (2/2)',                      duration: 228 },
  { folder: 's4', file: '019    La Foi bretonne.mp4',                     title: 'Livre IV - La Foi bretonne',                 duration: 210 },
  { folder: 's4', file: '020    Au service secret de Sa Majesté.mp4',     title: 'Livre IV - Au service secret de Sa Majesté', duration: 214 },
  { folder: 's4', file: '021    La Parade.mp4',                           title: 'Livre IV - La Parade',                      duration: 214 },
  { folder: 's4', file: '022    Seigneur Caius.mp4',                      title: 'Livre IV - Seigneur Caius',                  duration: 231 },
  { folder: 's4', file: "023    L'Échange 1re partie.mp4",                title: "Livre IV - L'Échange (1/2)",                 duration: 209 },
  { folder: 's4', file: "024    L'Échange 2e partie.mp4",                 title: "Livre IV - L'Échange (2/2)",                 duration: 216 },
  { folder: 's4', file: "025    L'Échelle de Perceval.mp4",               title: "Livre IV - L'Échelle de Perceval",           duration: 204 },
  { folder: 's4', file: '026    La Chambre de la reine.mp4',              title: 'Livre IV - La Chambre de la reine',          duration: 229 },
  { folder: 's4', file: '027    Les Émancipés.mp4',                       title: 'Livre IV - Les Émancipés',                   duration: 225 },
  { folder: 's4', file: '028    La Révoquée.mp4',                         title: 'Livre IV - La Révoquée',                     duration: 223 },
  { folder: 's4', file: '029    La Baliste II.mp4',                       title: 'Livre IV - La Baliste II',                   duration: 223 },
  { folder: 's4', file: '030    Les Bonnes.mp4',                          title: 'Livre IV - Les Bonnes',                      duration: 222 },
  { folder: 's4', file: '031    La Révolte III.mp4',                      title: 'Livre IV - La Révolte III',                  duration: 232 },
  { folder: 's4', file: '032    Le Rapport.mp4',                          title: 'Livre IV - Le Rapport',                      duration: 216 },
  { folder: 's4', file: "033    L'Art de la table.mp4",                   title: "Livre IV - L'Art de la table",               duration: 211 },
  { folder: 's4', file: '034    Les Novices.mp4',                         title: 'Livre IV - Les Novices',                     duration: 217 },
  { folder: 's4', file: '035    Les Refoulés.mp4',                        title: 'Livre IV - Les Refoulés',                    duration: 209 },
  { folder: 's4', file: '036    Les Tuteurs II.mp4',                      title: 'Livre IV - Les Tuteurs II',                  duration: 217 },
  { folder: 's4', file: '037    Le Tourment IV.mp4',                      title: 'Livre IV - Le Tourment IV',                  duration: 211 },
  { folder: 's4', file: '038    Le Rassemblement du corbeau II.mp4',      title: 'Livre IV - Le Rassemblement du corbeau II',  duration: 216 },
  { folder: 's4', file: '039    Le Grand Départ.mp4',                     title: 'Livre IV - Le Grand Départ',                 duration: 217 },
  { folder: 's4', file: "040    L'Auberge rouge.mp4",                     title: "Livre IV - L'Auberge rouge",                 duration: 216 },
  { folder: 's4', file: '041    Les Curieux 1re partie.mp4',              title: 'Livre IV - Les Curieux (1/2)',               duration: 224 },
  { folder: 's4', file: '042    Les Curieux 2e partie.mp4',               title: 'Livre IV - Les Curieux (2/2)',               duration: 225 },
  { folder: 's4', file: '043    La Clandestine.mp4',                      title: 'Livre IV - La Clandestine',                  duration: 231 },
  { folder: 's4', file: '044    Les Envahisseurs.mp4',                    title: 'Livre IV - Les Envahisseurs',                duration: 223 },
  { folder: 's4', file: '045    La vie est belle.mp4',                    title: 'Livre IV - La vie est belle',                duration: 220 },
  { folder: 's4', file: '046    La Relève.mp4',                           title: 'Livre IV - La Relève',                       duration: 227 },
  { folder: 's4', file: '047    Les Tacticiens 1re partie.mp4',           title: 'Livre IV - Les Tacticiens (1/2)',            duration: 228 },
  { folder: 's4', file: '048    Les Tacticiens 2e partie.mp4',            title: 'Livre IV - Les Tacticiens (2/2)',            duration: 216 },
  { folder: 's4', file: '049    Drakkars !.mp4',                          title: 'Livre IV - Drakkars !',                      duration: 210 },
  { folder: 's4', file: '050    La Réponse.mp4',                          title: 'Livre IV - La Réponse',                      duration: 235 },
  { folder: 's4', file: '051    Unagi IV.mp4',                            title: 'Livre IV - Unagi IV',                        duration: 241 },
  { folder: 's4', file: '052    La Permission.mp4',                       title: 'Livre IV - La Permission',                   duration: 232 },
  { folder: 's4', file: '053    Anges et Démons.mp4',                     title: 'Livre IV - Anges et Démons',                 duration: 232 },
  { folder: 's4', file: '054    La Rémanence.mp4',                        title: 'Livre IV - La Rémanence',                    duration: 237 },
  { folder: 's4', file: '055    Le Refuge.mp4',                           title: 'Livre IV - Le Refuge',                       duration: 220 },
  { folder: 's4', file: '056    Le Dragon gris.mp4',                      title: 'Livre IV - Le Dragon gris',                  duration: 205 },
  { folder: 's4', file: '057    La Potion de vivacité II.mp4',            title: 'Livre IV - La Potion de vivacité II',        duration: 224 },
  { folder: 's4', file: '058    Vox populi III.mp4',                      title: 'Livre IV - Vox populi III',                  duration: 227 },
  { folder: 's4', file: '059    La Sonde.mp4',                            title: 'Livre IV - La Sonde',                        duration: 221 },
  { folder: 's4', file: '060    La Réaffectation.mp4',                    title: 'Livre IV - La Réaffectation',                duration: 224 },
  { folder: 's4', file: '061    La Poétique II 1re partie.mp4',           title: 'Livre IV - La Poétique II (1/2)',            duration: 222 },
  { folder: 's4', file: '062    La Poétique II 2e partie.mp4',            title: 'Livre IV - La Poétique II (2/2)',            duration: 206 },
  { folder: 's4', file: '063    Le Jeu de la guerre.mp4',                 title: 'Livre IV - Le Jeu de la guerre',             duration: 226 },
  { folder: 's4', file: "064    Le Rêve d'Ygerne.mp4",                   title: "Livre IV - Le Rêve d'Ygerne",               duration: 230 },
  { folder: 's4', file: '065    Les Chaperons.mp4',                       title: 'Livre IV - Les Chaperons',                   duration: 212 },
  { folder: 's4', file: "066    L'Habitué.mp4",                           title: "Livre IV - L'Habitué",                       duration: 207 },
  { folder: 's4', file: '067    Le Camp romain.mp4',                      title: 'Livre IV - Le Camp romain',                  duration: 238 },
  { folder: 's4', file: "068    L'Usurpateur.mp4",                        title: "Livre IV - L'Usurpateur",                    duration: 218 },
  { folder: 's4', file: '069    Loth et le Graal.mp4',                    title: 'Livre IV - Loth et le Graal',                duration: 230 },
  { folder: 's4', file: '070    Le Paladin.mp4',                          title: 'Livre IV - Le Paladin',                      duration: 223 },
  { folder: 's4', file: '071    Perceval fait raitournelle.mp4',          title: 'Livre IV - Perceval fait raitournelle',      duration: 222 },
  { folder: 's4', file: '072    La Dame et le Lac.mp4',                   title: 'Livre IV - La Dame et le Lac',               duration: 224 },
  { folder: 's4', file: '073    Beaucoup de bruit pour rien.mp4',         title: 'Livre IV - Beaucoup de bruit pour rien',     duration: 217 },
  { folder: 's4', file: "074    L'Ultimatum.mp4",                         title: "Livre IV - L'Ultimatum",                     duration: 227 },
  { folder: 's4', file: '075    Le Oud II.mp4',                           title: 'Livre IV - Le Oud II',                       duration: 227 },
  { folder: 's4', file: '076    La Répétition.mp4',                       title: 'Livre IV - La Répétition',                   duration: 216 },
  { folder: 's4', file: '077    Le Discours.mp4',                         title: 'Livre IV - Le Discours',                     duration: 214 },
  { folder: 's4', file: '078    Le Choix de Gauvain.mp4',                 title: 'Livre IV - Le Choix de Gauvain',             duration: 239 },
  { folder: 's4', file: '079    Fluctuat nec mergitur.mp4',               title: 'Livre IV - Fluctuat nec mergitur',           duration: 235 },
  { folder: 's4', file: '080    Le Face-à-face 1re partie.mp4',           title: 'Livre IV - Le Face-à-face (1/2)',            duration: 204 },
  { folder: 's4', file: '081    Le Face-à-face 2e partie.mp4',            title: 'Livre IV - Le Face-à-face (2/2)',            duration: 222 },
  { folder: 's4', file: "082    L'Entente cordiale.mp4",                  title: "Livre IV - L'Entente cordiale",              duration: 227 },
  { folder: 's4', file: "083    L'Approbation.mp4",                       title: "Livre IV - L'Approbation",                   duration: 239 },
  { folder: 's4', file: '084    Alone in the Dark II.mp4',                title: 'Livre IV - Alone in the Dark II',            duration: 233 },
  { folder: 's4', file: "085    La Blessure d'Yvain.mp4",                 title: "Livre IV - La Blessure d'Yvain",            duration: 214 },
  { folder: 's4', file: '086    Corpore sano II.mp4',                     title: 'Livre IV - Corpore sano II',                 duration: 238 },
  { folder: 's4', file: "087    L'Enchanteur.mp4",                        title: "Livre IV - L'Enchanteur",                    duration: 227 },
  { folder: 's4', file: '088    Les Bien Nommés.mp4',                     title: 'Livre IV - Les Bien Nommés',                 duration: 222 },
  { folder: 's4', file: '089    La Prisonnière.mp4',                      title: 'Livre IV - La Prisonnière',                  duration: 230 },
  { folder: 's4', file: '090    Les Paris III.mp4',                       title: 'Livre IV - Les Paris III',                   duration: 217 },
  { folder: 's4', file: '091    Les Plaques de dissimulation.mp4',        title: 'Livre IV - Les Plaques de dissimulation',    duration: 200 },
  { folder: 's4', file: '092    Le Vice de forme.mp4',                    title: 'Livre IV - Le Vice de forme',                duration: 222 },
  { folder: 's4', file: '093    Le Renoncement 1re partie.mp4',           title: 'Livre IV - Le Renoncement (1/2)',            duration: 229 },
  { folder: 's4', file: '094    Le Renoncement 2e partie.mp4',            title: 'Livre IV - Le Renoncement (2/2)',            duration: 236 },
  { folder: 's4', file: "095    L'Inspiration.mp4",                       title: "Livre IV - L'Inspiration",                   duration: 216 },
  { folder: 's4', file: '096    Les Endettés.mp4',                        title: 'Livre IV - Les Endettés',                    duration: 213 },
  { folder: 's4', file: '097    Double Dragon.mp4',                       title: 'Livre IV - Double Dragon',                   duration: 223 },
  { folder: 's4', file: '098    Le Sauvetage.mp4',                        title: 'Livre IV - Le Sauvetage',                    duration: 199 },
  { folder: 's4', file: '099    Le Désordre et la Nuit.mp4',              title: 'Livre IV - Le Désordre et la Nuit',          duration: 431 },
  // ── Livre V ──────────────────────────────────────────────────────────────
  { folder: 's5', file: '1 - Corvus Corone.mp4',              title: 'Livre V - Corvus Corone',              duration: 2764 },
  { folder: 's5', file: '2 - La Roche et le Fer.mp4',         title: 'Livre V - La Roche et le Fer',         duration: 2810 },
  { folder: 's5', file: '3 - Væ Soli.mp4',                    title: 'Livre V - Væ Soli',                    duration: 2773 },
  { folder: 's5', file: '4 - Le Dernier Jour.mp4',            title: 'Livre V - Le Dernier Jour',            duration: 3431 },
  { folder: 's5', file: '5 - Le Royaume Sans Tête.mp4',       title: 'Livre V - Le Royaume Sans Tête',       duration: 3333 },
  { folder: 's5', file: '6 - Jizô.mp4',                       title: 'Livre V - Jizô',                       duration: 3317 },
  { folder: 's5', file: '7 - Le Phare.mp4',                   title: 'Livre V - Le Phare',                   duration: 2650 },
  { folder: 's5', file: '8 - Le Garçon Qui Criait Au Loup.mp4', title: 'Livre V - Le Garçon Qui Criait Au Loup', duration: 3020 },
  // ── Livre VI ─────────────────────────────────────────────────────────────
  { folder: 's6', file: '1 - Miles Ignotus.mp4',              title: 'Livre VI - Miles Ignotus',              duration: 2819 },
  { folder: 's6', file: '2 - Centurio.mp4',                   title: 'Livre VI - Centurio',                   duration: 2723 },
  { folder: 's6', file: '3 - Præceptores.mp4',                title: 'Livre VI - Præceptores',                duration: 2857 },
  { folder: 's6', file: '4 - Artuei Inquisito.mp4',           title: 'Livre VI - Artuei Inquisito',           duration: 2776 },
  { folder: 's6', file: '5 - Dux Bellorum.mp4',               title: 'Livre VI - Dux Bellorum',               duration: 3472 },
  { folder: 's6', file: '6 - Nuptiae.mp4',                    title: 'Livre VI - Nuptiae',                    duration: 2747 },
  { folder: 's6', file: '7 - Arturus Rex.mp4',                title: 'Livre VI - Arturus Rex',                duration: 2539 },
  { folder: 's6', file: '8 - Lacrimosa.mp4',                  title: 'Livre VI - Lacrimosa',                  duration: 3620 },
  { folder: 's6', file: '9 - Dies Irae.mp4',                  title: 'Livre VI - Dies Irae',                  duration: 2677 },
];

// ═══════════════════════════════════════════════════════════════════════════
//  FIN CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

// ─── DOM ──────────────────────────────────────────────────────────────────
const player        = document.getElementById('player');
const video         = document.getElementById('video');
const overlay       = document.getElementById('overlay');
const episodeTitle  = document.getElementById('episode-title');
const startBtn      = document.getElementById('start-btn');
const overlayBottom = document.getElementById('overlay-bottom');
const playBtn       = document.getElementById('play-btn');
const iconPlay      = document.getElementById('icon-play');
const iconPause     = document.getElementById('icon-pause');
const volumeSlider  = document.getElementById('volume');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const iconFsEnter   = document.getElementById('icon-fs-enter');
const iconFsExit    = document.getElementById('icon-fs-exit');
const loadingSpinner = document.getElementById('loading-spinner');
const viewerBadge   = document.getElementById('viewer-badge');
const viewerCount   = document.getElementById('viewer-count');
const muteBtn       = document.getElementById('mute-btn');
const iconVolOn     = document.getElementById('icon-vol-on');
const iconVolOff    = document.getElementById('icon-vol-off');
const timeCurrent   = document.getElementById('time-current');
const timeTotal     = document.getElementById('time-total');
const timelineFill  = document.getElementById('timeline-fill');
const timelineDot   = document.getElementById('timeline-dot');
const chatBubble    = document.getElementById('chat-bubble');
const notifBtn      = document.getElementById('notif-btn');

// ─── Compteur de viewers ──────────────────────────────────────────────────
// UUID stable par navigateur, stocké en localStorage
function getViewerId() {
  let id = localStorage.getItem('kaamelive-viewer-id');
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36));
    localStorage.setItem('kaamelive-viewer-id', id);
  }
  return id;
}
const VIEWER_ID = getViewerId();
let pingTimer = null;

async function ping() {
  if (!VIDEO_BASE_URL) return; // pas de serveur local en mode GitHub Pages seul
  try {
    const r    = await fetch(`${VIDEO_BASE_URL}api/ping?id=${VIEWER_ID}`);
    const data = await r.json();
    viewerCount.textContent = data.viewers;
    viewerBadge.style.display = 'flex';
  } catch { /* ignorer les erreurs réseau */ }
}

function startPinging() {
  ping();
  if (!pingTimer) pingTimer = setInterval(ping, 30000);
}

// ─── État ─────────────────────────────────────────────────────────────────
// 'idle'    → page ouverte, stream pas encore rejoint
// 'loading' → chargement / seek en cours
// 'playing' → lecture en cours, synchronisée
// 'paused'  → pause locale (le stream continue pour les autres)
let appState       = 'idle';
let currentEp      = playlist[0];
let hideTimeout    = null;
let suppressEvents = false;
let mutedVolume    = null; // volume sauvegardé avant un mute

const totalDuration = playlist.reduce((sum, e) => sum + e.duration, 0);

// ─── Timeline ─────────────────────────────────────────────────────────────
function formatTime(secs) {
  const s = Math.floor(Math.max(0, secs));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${m}:${String(sec).padStart(2,'0')}`;
}

function updateTimeline() {
  const dur = currentEp ? currentEp.duration : 0;
  const cur = video.currentTime || 0;
  const pct = dur > 0 ? Math.min(100, (cur / dur) * 100) : 0;
  timeCurrent.textContent     = formatTime(cur);
  timelineFill.style.width    = pct + '%';
  timelineDot.style.left      = pct + '%';
}

// ─── Synchronisation UTC ──────────────────────────────────────────────────
// Calcule l'épisode et la position exacts d'après l'heure UTC actuelle.
// Tous les visiteurs obtiennent le même résultat car Date.now() est universel.
function calcSync() {
  const elapsedMs = Date.now() - STREAM_START.getTime();

  if (elapsedMs < 0) {
    // Le stream n'a pas encore commencé
    return null;
  }

  // Boucle infinie sur la playlist
  let elapsed = (elapsedMs / 1000) % totalDuration;

  let cumulative = 0;
  for (let i = 0; i < playlist.length; i++) {
    const d = playlist[i].duration;
    if (elapsed < cumulative + d) {
      return {
        episodeIndex: i,
        position:     elapsed - cumulative,
        ep:           playlist[i],
      };
    }
    cumulative += d;
  }

  return { episodeIndex: 0, position: 0, ep: playlist[0] };
}

// ─── Chemin vidéo ─────────────────────────────────────────────────────────
// En local (test) : laisser VIDEO_BASE_URL vide → chemins relatifs.
// En prod (GitHub Pages + tunnel) : mettre l'URL Cloudflare avec slash final.
//   ex: 'https://abc-def-123.trycloudflare.com/'
const VIDEO_BASE_URL = 'https://camera-architects-refer-brakes.trycloudflare.com/';

function videoPath(ep) {
  return `${VIDEO_BASE_URL}videos/${ep.folder}/${encodeURIComponent(ep.file)}`;
}

// ─── Chargement + seek ────────────────────────────────────────────────────
function loadAndSeek(ep, position) {
  suppressEvents = true;
  currentEp = ep;
  episodeTitle.textContent = ep.title;
  timeTotal.textContent    = formatTime(ep.duration);
  timelineFill.style.width = '0%';
  timelineDot.style.left   = '0%';

  video.src = videoPath(ep);
  video.load();

  video.addEventListener('canplay', () => {
    // Recalculer la position réelle après le délai de chargement
    const fresh  = calcSync();
    const target = (fresh && fresh.ep.folder === ep.folder && fresh.ep.file === ep.file)
      ? fresh.position : position;
    video.currentTime = target;
    suppressEvents    = false;
    video.play().catch(() => {});
  }, { once: true });

  video.addEventListener('error', () => {
    suppressEvents = false;
    console.error('[kaamelive] Erreur vidéo :', video.error?.message);
  }, { once: true });
}

// ─── État de l'interface ──────────────────────────────────────────────────
function setState(newState) {
  appState = newState;

  if (newState === 'playing') {
    scheduleHide();
  } else {
    cancelHide();
    showOverlay();
  }

  // Spinner : visible uniquement en état "loading"
  loadingSpinner.classList.toggle('visible', newState === 'loading');

  player.classList.toggle('cursor-visible', newState !== 'playing');

  startBtn.style.display      = newState === 'idle' ? 'flex' : 'none';
  overlayBottom.style.display = newState === 'idle' ? 'none' : 'flex';
  chatBubble.style.display    = newState === 'idle' ? 'none' : 'flex';
  notifBtn.style.display      = newState === 'idle' ? 'none' : 'flex';
  if (newState === 'idle') episodeTitle.textContent = '';

  iconPlay .style.display  = newState === 'playing' ? 'none'  : 'block';
  iconPause.style.display  = newState === 'playing' ? 'block' : 'none';
}

// ─── Overlay ──────────────────────────────────────────────────────────────
function showOverlay() {
  overlay.classList.add('active');
  player.classList.add('cursor-visible');
}

function scheduleHide() {
  showOverlay();
  cancelHide();
  hideTimeout = setTimeout(() => {
    if (appState === 'playing') {
      overlay.classList.remove('active');
      player.classList.remove('cursor-visible');
    }
  }, 3000);
}

function cancelHide() {
  clearTimeout(hideTimeout);
  hideTimeout = null;
}

// ─── Actions ──────────────────────────────────────────────────────────────

// Premier clic : rejoindre le stream à la bonne position UTC
function startStream() {
  const sync = calcSync();

  if (!sync) {
    // Le stream n'a pas encore commencé
    episodeTitle.textContent = 'Le stream n\'a pas encore commencé.';
    return;
  }

  setState('loading');
  startBtn.disabled = true;
  loadAndSeek(sync.ep, sync.position);
  startPinging();
}

// Après une pause locale : calculer la position UTC actuelle et sauter dessus
function catchupToLive() {
  const sync = calcSync();
  if (!sync) return;

  setState('loading');

  const sameEp = sync.ep.folder === currentEp.folder && sync.ep.file === currentEp.file;

  if (sameEp) {
    // Même épisode : seek puis recalcul au moment où le buffer est prêt
    suppressEvents    = true;
    video.currentTime = sync.position;
    video.addEventListener('seeked', () => {
      // Le buffering est terminé : recalculer pour compenser le délai
      const fresh = calcSync();
      if (fresh && fresh.ep.folder === currentEp.folder && fresh.ep.file === currentEp.file) {
        video.currentTime = fresh.position;
      }
      suppressEvents = false;
      video.play().catch(() => {});
    }, { once: true });
  } else {
    // Épisode différent depuis la pause : rechargement complet
    loadAndSeek(sync.ep, sync.position);
  }
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  } else {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

// ─── Événements vidéo ─────────────────────────────────────────────────────
video.addEventListener('timeupdate', () => {
  if (!suppressEvents) updateTimeline();
});

// Spinner pendant le buffering mid-lecture
video.addEventListener('waiting', () => {
  if (!suppressEvents) loadingSpinner.classList.add('visible');
});
video.addEventListener('playing', () => {
  loadingSpinner.classList.remove('visible');
});

video.addEventListener('play', () => {
  if (!suppressEvents) setState('playing');
});

video.addEventListener('pause', () => {
  if (!suppressEvents && appState !== 'idle' && appState !== 'loading') {
    setState('paused');
  }
});

// Fin d'épisode : calculer la position UTC au cas où on a du retard,
// sinon passer simplement au suivant
video.addEventListener('ended', () => {
  const sync = calcSync();
  if (sync) {
    loadAndSeek(sync.ep, sync.position);
  } else {
    const next = (playlist.indexOf(currentEp) + 1) % playlist.length;
    loadAndSeek(playlist[next], 0);
  }
});

// ─── Événements UI ────────────────────────────────────────────────────────
startBtn.addEventListener('click', startStream);

playBtn.addEventListener('click', () => {
  if (appState === 'playing')      video.pause();
  else if (appState === 'paused')  catchupToLive();
  scheduleHide();
});

// Clic sur le player (hors contrôles) : pause/reprise
// Double clic sur le player (hors contrôles) : plein écran
// Le listener est sur `player` et non `video` car l'overlay capte les events
// quand il est visible.
let clickTimer = null;
player.addEventListener('click', (e) => {
  if (appState === 'idle') return;
  if (e.target.closest('button, input, select')) return;

  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
    toggleFullscreen();
    scheduleHide();
    return;
  }
  clickTimer = setTimeout(() => {
    clickTimer = null;
    if (appState === 'playing')     video.pause();
    else if (appState === 'paused') catchupToLive();
  }, 250);
});

volumeSlider.addEventListener('input', () => {
  const v = parseFloat(volumeSlider.value);
  if (v > 0) mutedVolume = null; // slider déplacé manuellement : annule le mute
  applyVolume(v);
  scheduleHide();
});

muteBtn.addEventListener('click', () => { toggleMute(); });

fullscreenBtn.addEventListener('click', () => {
  toggleFullscreen();
  scheduleHide();
});

document.addEventListener('fullscreenchange', () => {
  const isFs          = !!document.fullscreenElement;
  iconFsEnter.style.display = isFs ? 'none'  : 'block';
  iconFsExit .style.display = isFs ? 'block' : 'none';
});

['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach(evt => {
  document.addEventListener(evt, () => {
    if (appState === 'playing') scheduleHide();
    else showOverlay();
  });
});

document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'Space':
      e.preventDefault();
      if (appState === 'playing')      video.pause();
      else if (appState === 'paused')  catchupToLive();
      break;
    case 'KeyF':
      toggleFullscreen();
      scheduleHide();
      break;
    case 'ArrowUp':
      e.preventDefault();
      applyVolume(Math.min(1, video.volume + 0.1));
      scheduleHide();
      break;
    case 'ArrowDown':
      e.preventDefault();
      applyVolume(Math.max(0, video.volume - 0.1));
      scheduleHide();
      break;
  }
});

// ─── Volume ───────────────────────────────────────────────────────────────
function applyVolume(v) {
  video.volume = v;
  volumeSlider.value = String(v);
  volumeSlider.style.setProperty('--vol', v * 100 + '%');
  localStorage.setItem('kaamelive-volume', String(v));
  // Icône mute
  iconVolOn.style.display  = v > 0 ? 'block' : 'none';
  iconVolOff.style.display = v > 0 ? 'none'  : 'block';
}

function toggleMute() {
  if (video.volume > 0) {
    mutedVolume = video.volume;
    applyVolume(0);
  } else {
    applyVolume(mutedVolume ?? 0.2);
    mutedVolume = null;
  }
  scheduleHide();
}

// ─── Init ─────────────────────────────────────────────────────────────────
const savedVol  = parseFloat(localStorage.getItem('kaamelive-volume'));
applyVolume(isNaN(savedVol) ? 0.2 : Math.max(0, Math.min(1, savedVol)));

setState('idle');

// ═══════════════════════════════════════════════════════════════════════════
//  CHAT
// ═══════════════════════════════════════════════════════════════════════════

// ─── DOM chat ─────────────────────────────────────────────────────────────
const chatUnread    = document.getElementById('chat-unread');
const chatPanel     = document.getElementById('chat-panel');
const chatMsgs      = document.getElementById('chat-messages');
const chatInput     = document.getElementById('chat-input');
const chatSend      = document.getElementById('chat-send');
const chatClose     = document.getElementById('chat-close');
const emojiBtnEl    = document.getElementById('emoji-btn');
const emojiPicker   = document.getElementById('emoji-picker');
const pseudoModal   = document.getElementById('pseudo-modal');
const pseudoInputEl = document.getElementById('pseudo-input');
const pseudoConfirm = document.getElementById('pseudo-confirm');
const pseudoChange  = document.getElementById('pseudo-change');
const iconBellOn    = document.getElementById('icon-bell-on');
const iconBellOff   = document.getElementById('icon-bell-off');
const pseudoCancel  = document.getElementById('pseudo-cancel');

// ─── Emojis ───────────────────────────────────────────────────────────────
const EMOJIS = [
  '😂','😭','😍','😎','😤','😱','🤔','🥰',
  '👍','👎','👏','🙏','💪','🤌','🫡','👀',
  '❤️','🔥','💯','🎉','⭐','💀','🤣','😆',
  '⚔️','🏰','👑','🛡️','🐉','🐴','🍺','🍷',
];

(function buildEmojiGrid() {
  emojiPicker.innerHTML = EMOJIS.map(e =>
    `<button class="emoji-item" type="button" data-emoji="${e}">${e}</button>`
  ).join('');
  emojiPicker.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.emoji-item');
    if (!btn) return;
    const emoji = btn.dataset.emoji;
    const pos   = chatInput.selectionStart ?? chatInput.value.length;
    chatInput.value = chatInput.value.slice(0, pos) + emoji + chatInput.value.slice(pos);
    chatInput.selectionStart = chatInput.selectionEnd = pos + [...emoji].length;
    chatInput.focus();
  });
})();

// ─── Son de notification ──────────────────────────────────────────────────
const notifAudio = new Audio('notification_sound.mp3');
notifAudio.volume = 0.25;

let notifEnabled = localStorage.getItem('kaamelive-notif') !== 'off';

function updateNotifIcon() {
  iconBellOn .style.display = notifEnabled ? 'block' : 'none';
  iconBellOff.style.display = notifEnabled ? 'none'  : 'block';
  notifBtn.classList.toggle('notif-on', notifEnabled);
  notifBtn.title = notifEnabled ? 'Désactiver les notifications sonores'
                                : 'Activer les notifications sonores';
}

function playNotif() {
  if (!notifEnabled) return;
  notifAudio.currentTime = 0;
  notifAudio.play().catch(() => {});
}

updateNotifIcon();

// ─── État chat ────────────────────────────────────────────────────────────
let chatWs       = null;
let chatIsOpen   = false;
let unreadCount  = 0;
let wsRetryTimer = null;

// ─── Pseudo ───────────────────────────────────────────────────────────────
function getPseudo() { return localStorage.getItem('kaamelive-pseudo') || ''; }
function savePseudo(v) { localStorage.setItem('kaamelive-pseudo', v.trim().slice(0, 20)); }

// ─── URL WebSocket ────────────────────────────────────────────────────────
function getChatWsUrl() {
  if (!VIDEO_BASE_URL) {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${location.host}/ws`;
  }
  return VIDEO_BASE_URL.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws';
}

// ─── Connexion ────────────────────────────────────────────────────────────
function connectChat() {
  clearTimeout(wsRetryTimer);
  try { chatWs = new WebSocket(getChatWsUrl()); } catch { scheduleWsRetry(); return; }

  chatWs.onopen = () => {
    clearTimeout(wsRetryTimer);
    chatBubble.classList.remove('chat-bubble--offline');
    chatInput.disabled  = false;
    chatSend.disabled   = false;
    appendSystemMsg('Connecté au chat');
  };

  chatWs.onmessage = ({ data }) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }
    if (msg.type === 'chat') onChatMsg(msg);
  };

  chatWs.onclose = chatWs.onerror = () => {
    chatBubble.classList.add('chat-bubble--offline');
    chatInput.disabled = true;
    chatSend.disabled  = true;
    appendSystemMsg('Déconnecté — reconnexion…');
    scheduleWsRetry();
  };
}

function scheduleWsRetry() {
  clearTimeout(wsRetryTimer);
  wsRetryTimer = setTimeout(connectChat, 5000);
}

// ─── Réception message ───────────────────────────────────────────────────
function onChatMsg(msg) {
  const mine = msg.pseudo === getPseudo();
  addMsgEl(msg.pseudo, msg.text, msg.time, mine);
  if (!mine) playNotif();
  if (!chatIsOpen) { unreadCount++; updateBadge(); }
}

function addMsgEl(pseudo, text, time, mine) {
  const d = document.createElement('div');
  d.className = 'chat-msg' + (mine ? ' chat-msg--mine' : '');
  d.innerHTML =
    `<span class="chat-pseudo">${esc(pseudo)}</span>` +
    `<span class="chat-text">${esc(text)}</span>` +
    `<span class="chat-time">${esc(time)}</span>`;
  chatMsgs.appendChild(d);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function appendSystemMsg(text) {
  const d = document.createElement('div');
  d.className = 'chat-system';
  d.textContent = text;
  chatMsgs.appendChild(d);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Envoi ────────────────────────────────────────────────────────────────
function sendChatMsg() {
  const text = chatInput.value.trim();
  if (!text || !chatWs || chatWs.readyState !== WebSocket.OPEN) return;
  chatWs.send(JSON.stringify({ type: 'chat', pseudo: getPseudo(), text }));
  chatInput.value = '';
  closeEmojiPicker();
}

// ─── Panel ────────────────────────────────────────────────────────────────
function openChatPanel() {
  if (!getPseudo()) { openPseudoModal(); return; }
  chatIsOpen = true;
  unreadCount = 0;
  updateBadge();
  chatPanel.classList.add('open');
  setTimeout(() => chatInput.focus(), 280);
}

function closeChatPanel() {
  chatIsOpen = false;
  chatPanel.classList.remove('open');
  closeEmojiPicker();
}

// ─── Emoji picker ─────────────────────────────────────────────────────────
function toggleEmojiPicker() { emojiPicker.classList.toggle('open'); }
function closeEmojiPicker()  { emojiPicker.classList.remove('open'); }

// ─── Pseudo modal ─────────────────────────────────────────────────────────
function openPseudoModal(fromChange) {
  pseudoInputEl.value = getPseudo();
  pseudoModal.classList.add('open');
  setTimeout(() => { pseudoInputEl.focus(); pseudoInputEl.select(); }, 50);
}

function closePseudoModal() { pseudoModal.classList.remove('open'); }

function confirmPseudo() {
  const name = pseudoInputEl.value.trim().slice(0, 20);
  if (!name) { pseudoInputEl.focus(); return; }
  savePseudo(name);
  closePseudoModal();
  openChatPanel();
}

// ─── Badge ────────────────────────────────────────────────────────────────
function updateBadge() {
  chatUnread.textContent    = unreadCount > 99 ? '99+' : String(unreadCount);
  chatUnread.style.display  = unreadCount > 0  ? 'flex' : 'none';
}

// ─── Événements ───────────────────────────────────────────────────────────
chatBubble.addEventListener('click', () => chatIsOpen ? closeChatPanel() : openChatPanel());
chatClose .addEventListener('click', closeChatPanel);
emojiBtnEl.addEventListener('click', (e) => { e.stopPropagation(); toggleEmojiPicker(); });
chatSend  .addEventListener('click', sendChatMsg);

pseudoChange .addEventListener('click', () => { closeChatPanel(); openPseudoModal(); });
pseudoConfirm.addEventListener('click', confirmPseudo);
pseudoCancel .addEventListener('click', closePseudoModal);

// Fermer la modal en cliquant sur le fond ou en appuyant sur Échap
pseudoModal.addEventListener('click', (e) => {
  if (e.target === pseudoModal) closePseudoModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && pseudoModal.classList.contains('open')) closePseudoModal();
});

notifBtn.addEventListener('click', () => {
  notifEnabled = !notifEnabled;
  localStorage.setItem('kaamelive-notif', notifEnabled ? 'on' : 'off');
  updateNotifIcon();
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMsg(); }
});

pseudoInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmPseudo();
});

document.addEventListener('click', (e) => {
  if (!emojiPicker.contains(e.target) && e.target !== emojiBtnEl) closeEmojiPicker();
});

// Fermer le panel en cliquant sur le player (hors chat)
document.getElementById('player').addEventListener('click', closeChatPanel);

// ─── Démarrage ────────────────────────────────────────────────────────────
connectChat();
