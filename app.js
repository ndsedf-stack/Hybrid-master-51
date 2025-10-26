document.addEventListener('DOMContentLoaded', () => {
   // --- CONSTANTS & DATA ---
   const svgFront = `<svg viewBox="0 0 263 564" xmlns="http://www.w3.org/2000/svg"><g class="muscle-group"> <path class="muscle" data-muscle="Deltoïde antérieur" d="M109.5 136.5s-2-3-3-4-5-6-5-11-2-12 1-14 1-5 2-5 3-1 3-1-3 1-3 4-2 11 0 13 4 10 5 9z"/> <path class="muscle" data-muscle="Deltoïde latéral" d="M110.5 137.5s-4 1-5-1-1-6 0-10 1-5 2-7-1-7-1-7-2-2-2 1-2 5-2 9-1 10 2 13 5 4 4 2z"/> <path class="muscle" data-muscle="Pectoraux" d="M109.5 136.5s-1-2-1-3 0-6 1-8 2-6 5-8 9-6 15-6h1s-1 1-5 4-8 5-11 8-4 5-5 5z"/> <path class="muscle" data-muscle="Biceps" d="M112.5 167.5s-1 8-1 11-1 9-1 11 0 5 1 5 3-1 3-4-1-10-1-15 1-8 0-8z"/> <path class="muscle" data-muscle="Avant-bras" d="M114.5 208.5s0 13 0 16-1 8 0 9 2 2 3 0 1-13 1-18 0-12-2-11-2 4-2 4z"/> <path class="muscle" data-muscle="Dentelé" d="M111.5 174.5s4 14 5 17 0 6 0 6-1-10-1-15-2-10-4-8z"/> <path class="muscle" data-muscle="Abdominaux" d="M131.5 167.5s0 16 0 28 0 25-1 27-2 4-2 4h1s2-2 3-5 1-27 1-42-1-12-1-12z"/> <path class="muscle" data-muscle="Quadriceps" d="M113.5 285.5s-2 23-2 37 1 45 1 54 2 15 2 15s1-18 1-57-1-50-2-49zM149.5 285.5s-1 17-1 33 0 45 1 57 2 15 2 15s1-22 1-60-1-46-3-45z"/> <path class="muscle" data-muscle="Brachioradial" d="M113.5 194.5s0 14 0 17 2 6 3 4 1-13 1-16 0-10-2-9-2 4-2 4z"/> <path class="muscle" data-muscle="Trapèze" d="M110.5 125.5s3-11 4-13 4-3 6-3 6 1 8 4 4 13 4 13l-5-1s-3-4-6-4-5 1-6 2-1 2-1 2z"/> </g> <g> <text class="muscle-label" data-muscle-label="Pectoraux" x="140" y="155">Pectoraux</text> <text class="muscle-label" data-muscle-label="Deltoïde antérieur" x="90" y="120">Deltoïde Ant.</text> <text class="muscle-label" data-muscle-label="Biceps" x="88" y="180">Biceps</text> <text class="muscle-label" data-muscle-label="Abdominaux" x="135" y="200">Abdominaux</text> <text class="muscle-label" data-muscle-label="Quadriceps" x="140" y="350">Quadriceps</text> <text class="muscle-label" data-muscle-label="Avant-bras" x="80" y="230">Avant-bras</text> </g></svg>`;
   const svgBack = `<svg viewBox="0 0 263 564" xmlns="http://www.w3.org/2000/svg"><g class="muscle-group"> <path class="muscle" data-muscle="Trapèze" d="m154,124s3-10,5-12,4-2,6-2,5,1,7,4,3,12,3,12l-5-1s-2-4-5-4-4,1-5,2-2,2-2,2Z"/> <path class="muscle" data-muscle="Deltoïde postérieur" d="m156,137s4,1,5-1,1-6,0-10-1-5,0-7,1-7,1-7,2-2,2,1,2,5,2,9,1,10-2,13-5,4-4,2Z"/> <path class="muscle" data-muscle="Grand dorsal" d="m154,161s10,2,13,5,6,9,6,15-2,19-2,19-2-7-3-15-4-14-9-17-5-7-5-7Z"/> <path class="muscle" data-muscle="Dos" d="M132.5 158.5s0 10 0 20-1 20-1 26 0 10 0 10h1s1-10 1-26-1-20 0-30z"/> <path class="muscle" data-muscle="Rhomboïdes" d="M141.5 142.5s3,7,3,12-1,8-1,8-1-6-1-11,0-9-1-9z"/> <path class="muscle" data-muscle="Triceps" d="m152,168s1,8,1,11,1,9,1,11,0,5-1,5-3-1-3-4,1-10,1-15,0-8,0-8Z"/> <path class="muscle" data-muscle="Avant-bras" d="m150,209s0,13,0,16,1,8,0,9-2,2-3,0-1-13-1-18,0-12,2-11,2,4,2,4Z"/> <path class="muscle" data-muscle="Fessiers" d="m151,257s9,3,13,5,7,10,7,17-2,15-2,15l-1-2s-3-8-6-13-7-12-11-12Z"/> <path class="muscle" data-muscle="Ischios" d="m151,298s0,15,0,29-1,40,0,48,1,15,1,15,0-20,0-52-1-40,0-40Z"/> <path class="muscle" data-muscle="Mollets" d="m151,410s0,17,0,27,0,25,1,28,2,5,2,5-2-5-2-25,0-32-1-35Z"/> </g> <g> <text class="muscle-label" data-muscle-label="Trapèze" x="120" y="125">Trapèze</text> <text class="muscle-label" data-muscle-label="Grand dorsal" x="165" y="180">Grand Dorsal</text> <text class="muscle-label" data-muscle-label="Deltoïde postérieur" x="175" y="145">Deltoïde Post.</text> <text class="muscle-label" data-muscle-label="Triceps" x="165" y="190">Triceps</text> <text class="muscle-label" data-muscle-label="Fessiers" x="175" y="280">Fessiers</text> <text class="muscle-label" data-muscle-label="Ischios" x="165" y="350">Ischios</text> <text class="muscle-label" data-muscle-label="Mollets" x="165" y="450">Mollets</text> </g></svg>`;
   const EXERCISE_VISUALS = {
     'Dumbbell Press':'https://i.imgur.com/0343g78.gif',
     'Lat Pulldown':'https://i.imgur.com/GaM04g4.gif',
     'Leg Press':'https://i.imgur.com/f20ffVj.gif',
     'Leg Curl':'https://i.imgur.com/cmWS3B5.gif',
     'Leg Extension':'https://i.imgur.com/P2BUd5l.gif',
     'Cable Curl':'https://i.imgur.com/4q0o24g.gif',
     'Triceps Pushdown':'https://i.imgur.com/m3NQY9q.gif',
     'Lateral Raises':'https://i.imgur.com/uFdedo2.gif'
   };

   const PROGRAM = {
... (truncated for brevity in tool call) ...
   };

   const STATE_KEY = 'hybrid_master_51_app_vanilla_js_2';
   const PROG_HALTERE = 2.5, PROG_BARRE = 5, MIN_RECORDS = 2;

   let state, currentSessionKey, timerInterval;
   // Astuce: son facultatif (base64 raccourci)
   const timerSound = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAI1RTSEhLa...//ZHiKAAAA//6x4hwAAAP/oA//9aQZgA=");

   function defaultState() {
       const weights = {};
       Object.values(PROGRAM).forEach(session =>
         session.exercises.forEach(ex => { weights[ex.name] = ex.weight; })
       );
       return { week:1, weights, hist:{}, program:JSON.parse(JSON.stringify(PROGRAM)) };
   }
   function loadState() {
       try {
           const raw = localStorage.getItem(STATE_KEY);
           const s = raw ? JSON.parse(raw) : defaultState();
           return s.program ? s : defaultState();
       } catch (e) { return defaultState(); }
   }

   // (rest of app.js identical to the provided JS)