# Site de mariage — Sarah & Philippe

Un site simple (HTML/CSS/JS, aucun outil à installer). Les réponses RSVP arrivent dans un Google Sheet.

## Fichiers

- **`infos.js` : le seul fichier à modifier pour les infos du mariage.** Noms, date, ville, lieu, date limite du RSVP, courriel de contact, programme de la journée et adresse du script RSVP. Chaque info est mise à jour partout sur le site automatiquement, y compris le compte à rebours et le lien vers la carte.
- `index.html` : les textes plus longs (repas, FAQ). Les endroits à compléter sont marqués `✏️ À COMPLÉTER`.
- `style.css` : les couleurs et la mise en page (palette lavande en haut du fichier).
- `script.js` : le fonctionnement du site. Pas besoin d'y toucher.
- `apps-script.gs` : le code à coller dans Google Sheets.

### Modifier une info depuis GitHub

Ouvrez `infos.js` sur GitHub, cliquez sur ✏️ (*Edit this file*), changez le texte entre les guillemets, puis cliquez sur **Commit changes**. Le site est à jour 1 à 2 minutes plus tard.

## Étape 1 : brancher le RSVP sur Google Sheets (10 min)

1. Créez un nouveau Google Sheet, par exemple « RSVP Mariage ».
2. Menu **Extensions → Apps Script**.
3. Effacez le code existant, collez le contenu de `apps-script.gs`, puis cliquez sur 💾.
4. Cliquez sur **Déployer → Nouveau déploiement**.
   - Type : **Application Web**
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
5. Cliquez sur **Déployer** et autorisez l'accès. Google affichera « Cette application n'est pas validée » : choisissez **Paramètres avancés → Accéder au projet**. C'est normal, puisque c'est votre propre script.
6. Copiez l'**URL de l'application Web** (elle se termine par `/exec`).
7. Dans `infos.js`, collez-la ici : `rsvpUrl: "https://script.google.com/macros/s/…/exec",`

Les réponses apparaîtront dans l'onglet **RSVP** du Sheet, qui se crée lors de la première réponse.
Si quelqu'un répond deux fois, gardez la ligne la plus récente.

**Alerte en cas de réponse en double :** si un même nom répond une deuxième fois (sans tenir compte des majuscules, des accents ni des espaces), un courriel est envoyé à philippe.niles@gmail.com et sroymolgat@gmail.com. Il liste tous les courriels associés à ce nom ainsi que chaque réponse. Pour changer les destinataires, modifiez `ALERT_EMAILS` en haut de `apps-script.gs`. Les courriels partent du compte Google propriétaire du Sheet.

> Si vous modifiez le script plus tard : **Déployer → Gérer les déploiements → ✏️ → Nouvelle version**, sinon l'ancienne version reste active.

## Étape 2 : mettre le site en ligne avec GitHub Pages (gratuit)

1. Sur github.com, créez un nouveau dépôt (par exemple `mariage`). Il peut être public.
2. Envoyez-y les fichiers de ce dossier : **Add file → Upload files**, puis glissez-déposez-les.
3. Allez dans **Settings → Pages** :
   - Source : **Deploy from a branch**
   - Branch : **main** / **(root)**
4. Après environ 1 minute, le site est en ligne à `https://VOTRE-NOM.github.io/mariage/`.

Pour un nom de domaine personnalisé (ex. `philippeetsarah.com`, environ 15 $/an) : achetez-le chez Namecheap, Porkbun ou un autre registraire, puis ajoutez-le dans **Settings → Pages → Custom domain** en suivant les instructions DNS de GitHub.

## Tester avant d'envoyer aux invités

- Remplissez le formulaire vous-même et vérifiez que la ligne apparaît dans le Sheet.
- Ouvrez le site sur votre téléphone.
- Tant que `rsvpUrl` est vide, le formulaire est en **mode démo** : il affiche « Merci » sans rien enregistrer.
