# Kaamelive

Lecteur web synchronisé par horloge UTC — tous les visiteurs voient le même épisode au même moment, sans backend.

---

## Architecture

```
GitHub Pages          →  index.html · style.css · app.js
PC serveur local      →  videos/ (via Cloudflare Tunnel HTTPS)
```

---

## 1. Déploiement du site (GitHub Pages)

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/TON_USER/kaamelive.git
git push -u origin main
```

Sur GitHub → Settings → Pages → Source : `main / (root)` → Save.

Le site sera accessible à `https://TON_USER.github.io/kaamelive/`.

---

## 2. Serveur vidéo local (PC à côté)

**Installer Cloudflare Tunnel** (une seule fois) :
→ https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

**Lancer le serveur vidéo :**
```bash
# Depuis le dossier kaamelive/
python -m http.server 8080
```

**Lancer le tunnel (dans un autre terminal) :**
```bash
cloudflared tunnel --url http://localhost:8080
```

Cloudflare affiche une URL du type : `https://abc-def-123.trycloudflare.com`

---

## 3. Connecter le site aux vidéos

Dans `app.js`, mettre l'URL du tunnel dans `VIDEO_BASE_URL` :

```js
const VIDEO_BASE_URL = 'https://abc-def-123.trycloudflare.com/';
```

Puis pousser le changement :
```bash
git add app.js
git commit -m "set video base url"
git push
```

> L'URL change à chaque redémarrage du tunnel quick. Pour une URL fixe et permanente,
> crée un tunnel nommé (compte Cloudflare gratuit requis).

---

## 4. Configurer le stream

Dans `app.js` (section CONFIGURATION) :

- `STREAM_START` → date/heure UTC de démarrage. Pour l'instant :
  ```js
  new Date().toISOString()  // coller le résultat ici
  ```
- `playlist` → liste des fichiers avec leur durée exacte.

Durée d'un fichier (PowerShell) :
```powershell
$sh = New-Object -ComObject Shell.Application
$f  = $sh.Namespace("C:\kaamelive\videos\s1")
$it = $f.ParseName("Kaamelott - Livre 1 - Tome 1.mp4")
$f.GetDetailsOf($it, 27)
```

---

## Structure des fichiers vidéo

```
videos/
  s1/  Kaamelott - Livre 1 - Tome 1.mp4
       Kaamelott - Livre 1 - Tome 2.mp4
  s2/  ...
  s4/  001    Episode.mp4
       002    Episode.mp4
```

## Conversion MKV → MP4

```bash
ffmpeg -i input.mkv -c:v copy -c:a aac -movflags +faststart output.mp4
```

`-movflags +faststart` est indispensable pour que le seek fonctionne sur de gros fichiers.

---

## Contrôles

| Action | Raccourci |
|---|---|
| Pause / Rattraper le direct | Espace · clic · bouton |
| Plein écran | F · double clic |
| Volume | Flèches haut/bas |

L'interface se rétracte 3 s après le dernier mouvement.
