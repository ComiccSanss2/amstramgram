# Amstramgram 

Projet de réseau social (type Instagram). 
L'application repose sur une architecture moderne utilisant obligatoirement **TypeScript** pour le Front et le Back.

##  Stack Technique
**Frontend** : React + TypeScript.
**Backend** : Node.js + TypeScript.
**Gestion de version** : Git.

---

## Installation et Lancement

### 1. Prérequis
* Node.js (v18 ou supérieur)
* npm ou yarn

### 2. Installation
Ouvrez deux terminaux différents :

**Pour le Frontend :**
```bash
cd client
npm install
npm run dev
```


**Pour le Backend :**
```bash
cd server
npm install
npm run dev
```


## Pour se connecter en ligne (meme reseau seulement)

- Aller sans api.ts
- Changer la ligne : 

```bash
const API = "http://localhost:3000";

```
En

```bash
const API = "http://adresseIP:3000";
```

Une fois que ça a été fait,
**Lancez :**
```bash
coté client: npm run dev -- --host
coté server: npm run dev
```

**Coté users qui vont se connecter :**
Taper l'ip donné par le host dans le navigateur et have fun !










