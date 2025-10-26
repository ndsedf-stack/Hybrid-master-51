// Corrections : gère correctement la récréation des charts (destroy de l'ancienne instance)
// et garde une référence globale à l'instance Chart pour éviter les fuites.
const MUSCLE_MAP = { 'Pectoraux': 'Pectoraux', 'Grand dorsal': 'Dos', 'Dos': 'Dos', 'Rhomboïdes': 'Dos', 'Trapèze': 'Dos', 'Quadriceps': 'Jambes', 'Ischios': 'Jambes', 'Fessiers': 'Jambes', 'Mollets': 'Jambes', 'Deltoïde antérieur': 'Épaules', 'Deltoïde latéral': 'Épaules', 'Deltoïde postérieur': 'Épaules', 'Triceps': 'Bras', 'Biceps': 'Bras', 'Brachioradial': 'Bras', 'Avant-bras': 'Bras', 'Abdominaux':'Abdominaux' };
const ANATOMY_SVG = { combined: `<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg"><g class="muscle" data-muscle="Épaules"><path d="M85,95 a20,20 0 0,1 30,0 l10,20 h-50 z" /></g><g class="muscle" data-muscle="Pectoraux"><path d="M85,115 l15,0 l10,30 h-50 l10,-30 z" /></g><g class="muscle" data-muscle="Abdominaux"><path d="M90,145 h20 v30 h-20 z" /></g><g class="muscle" data-muscle="Jambes"><path d="M80,175 l-10,100 h20 l-5,-100 z M120,175 l10,100 h-20 l5,-100 z" /></g><g class="muscle" data-muscle="Bras"><path d="M70,115 l-10,70 h10 l5,-70 z M130,115 l10,70 h-10 l-5,-70 z" /></g><g class="muscle" data-muscle="Dos"><path d="M90,115 h20 v30 h-20 z" fill-opacity="0.05" /></g></svg>` };
const PROGRAM_DATA = { 
    dimanche: { key: 'dimanche', title: "Dos + Jambes Lourdes", exercises: [ 
        { name: "Trap Bar Deadlift", sets: 4, reps: "6-8", rest: 150, weight: 75, type: "barre", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Rest-Pause dernière série", Bloc3: "Cluster sets série 4" }, muscles: { direct: ['Ischios', 'Fessiers', 'Dos'], indirect: ['Quadriceps'] } },
        { name: "Goblet Squat", sets: 3, reps: "10", rest: 90, weight: 25, type: "haltères", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Drop-set dernière série" }, muscles: { direct: ['Quadriceps', 'Fessiers'], indirect: ['Ischios'] } },
        { name: "Leg Press", sets: 3, reps: "10", rest: 90, weight: 110, type: "machine", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Myo-reps dernière série" }, muscles: { direct: ['Quadriceps', 'Fessiers'], indirect: ['Ischios'] } },
        { name: "Lat Pulldown", sets: 3, reps: "10", rest: 90, weight: 60, type: "machine", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Rest-Pause série 3", Bloc3: "Drop-set -20% série 3" }, muscles: { direct: ['Grand dorsal'], indirect: ['Biceps', 'Trapèze'] } },
        { name: "Rowing Poulie", sets: 3, reps: "10", rest: 90, weight: 65, type: "machine", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Rest-Pause série 3" }, muscles: { direct: ['Dos', 'Grand dorsal'], indirect: ['Biceps', 'Deltoïde postérieur'] } },
        { name: "Landmine Press", sets: 3, reps: "10", rest: 90, weight: 35, type: "barre", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Myo-reps série 3" }, muscles: { direct: ['Pectoraux', 'Deltoïde antérieur'], indirect: ['Triceps'] } },
        { name: "Incline Curl", sets: 3, reps: "12", rest: 60, weight: 12, type: "haltères", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Standard" }, muscles: { direct: ['Biceps'], indirect: ['Avant-bras'] } }
    ] }, 
    mardi: { key: 'mardi', title: "Pecs + Épaules + Triceps", exercises: [
        { name: "Dumbbell Press", sets: 4, reps: "10", rest: 120, weight: 22, type: "haltères", techniques: { Bloc1: "Tempo 2-1-2", Bloc2: "Rest-Pause série 4", Bloc3: "Drop-set série 4" }, muscles: { direct: ['Pectoraux'], indirect: ['Triceps', 'Deltoïde antérieur'] } },
        { name: "Leg Press Léger", sets: 3, reps: "15", rest: 75, weight: 80, type: "machine", techniques: { Bloc1: "Tempo 2-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Myo-reps série 3" }, muscles: { direct: ['Quadriceps'], indirect: ['Fessiers'] } },
        { name: "Close-Grip Bench", sets: 3, reps: "10", rest: 90, weight: 45, type: "barre", techniques: { Bloc1: "Tempo 2-1-2", Bloc2: "Rest-Pause série 3", Bloc3: "Cluster série 3" }, muscles: { direct: ['Triceps', 'Pectoraux'], indirect: ['Deltoïde antérieur'] } },
        { name: "Lateral Raises", sets: 3, reps: "15", rest: 60, weight: 8, type: "haltères", techniques: { Bloc1: "Tempo 2-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Myo-reps série 3" }, muscles: { direct: ['Deltoïde latéral'], indirect: ['Trapèze'] } },
        { name: "Face Pull", sets: 4, reps: "15", rest: 60, weight: 20, type: "machine", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 3-1-2", Bloc3: "Rest-Pause série 4" }, muscles: { direct: ['Deltoïde postérieur', 'Rhomboïdes'], indirect: ['Trapèze'] } },
        { name: "Bent-Over Raises", sets: 3, reps: "12", rest: 60, weight: 8, type: "haltères", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 3-1-2", Bloc3: "Drop-set série 3" }, muscles: { direct: ['Deltoïde postérieur'], indirect: ['Dos'] } },
        { name: "Cable Pushdown", sets: 3, reps: "12", rest: 60, weight: 20, type: "machine", techniques: { Bloc1: "Tempo 2-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Myo-reps série 3" }, muscles: { direct: ['Triceps'], indirect: [] } }
    ] }, 
    vendredi: { key: 'vendredi', title: "Dos + Jambes Légères + Bras", exercises: [
        { name: "Landmine Row", sets: 4, reps: "10", rest: 120, weight: 55, type: "barre", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Rest-Pause série 4", Bloc3: "Cluster série 4" }, muscles: { direct: ['Grand dorsal', 'Trapèze'], indirect: ['Biceps'] } },
        { name: "Leg Curl", sets: 3, reps: "12", rest: 75, weight: 40, type: "machine", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 3-1-2", Bloc3: "Myo-reps série 3" }, muscles: { direct: ['Ischios'], indirect: ['Mollets'] } },
        { name: "Romanian Deadlift", sets: 3, reps: "10", rest: 90, weight: 30, type: "haltères", techniques: { Bloc1: "Tempo 3-1-2 STRICT", Bloc2: "Tempo 2-1-2", Bloc3: "Rest-Pause série 3" }, securite: ["Dos neutre uniquement", "Barre contre cuisses", "Descente mi-tibias", "STOP si douleur"], muscles: { direct: ['Ischios', 'Fessiers'], indirect: ['Dos'] } },
        { name: "Leg Extension", sets: 3, reps: "15", rest: 60, weight: 35, type: "machine", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Drop-set série 3" }, muscles: { direct: ['Quadriceps'], indirect: [] } },
        { name: "Dumbbell Fly", sets: 3, reps: "12", rest: 75, weight: 10, type: "haltères", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 3-1-2", Bloc3: "Myo-reps série 3" }, muscles: { direct: ['Pectoraux'], indirect: ['Deltoïde antérieur'] } },
        { name: "EZ Bar Curl", sets: 3, reps: "12", rest: 60, weight: 20, type: "barre", techniques: { Bloc1: "Tempo 3-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Rest-Pause série 3" }, muscles: { direct: ['Biceps'], indirect: ['Avant-bras'] } },
        { name: "Hammer Curl", sets: 3, reps: "12", rest: 60, weight: 12, type: "haltères", techniques: { Bloc1: "Tempo 2-1-2", Bloc2: "Tempo 2-1-2", Bloc3: "Drop-set série 3" }, muscles: { direct: ['Brachioradial', 'Biceps'], indirect: ['Avant-bras'] } },
        { name: "Wrist Curl", sets: 3, reps: "20", rest: 45, weight: 30, type: "barre", techniques: "Standard", muscles: { direct: ['Avant-bras'], indirect: [] } }
    ] } 
};

let volumeChart = null; // instance Chart.js (référence globale pour destroy)

/* -------------------------
   App lifecycle & render
   ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const app = {
        container: document.getElementById('app-container'),
        modal: document.getElementById('modal-container'),
        timer: document.getElementById('timer-container'),
    };
    
    let state;
    const defaultState = { week: 1, activeWorkout: null, history: {} };
    
    const saveState = () => localStorage.setItem('hm51_state', JSON.stringify(state));
    const loadState = () => {
        const saved = localStorage.getItem('hm51_state');
        const loadedState = saved ? JSON.parse(saved) : {};
        state = { ...defaultState, ...loadedState, program: PROGRAM_DATA };
    };

    const calculateVolume = () => {
        const volume = {};
        Object.values(state.program).forEach(workout => {
            workout.exercises.forEach(ex => {
                const mainMuscle = MUSCLE_MAP[ex.muscles.direct[0]] || 'Autre';
                if (!volume[mainMuscle]) volume[mainMuscle] = 0;
                volume[mainMuscle] += ex.sets;
            });
        });
        return volume;
    };
    
    const renderHomeScreen = () => {
        const workoutKeys = Object.keys(state.program);
        const volumeByMuscle = calculateVolume();
        app.container.innerHTML = `
            <div class="screen-container">
                <h1 class="screen-title header-glow">Hybrid Master 51</h1>
                <div class="card">
                    <p class="section-title">Semaine ${state.week}</p>
                    <p>Bloc Actuel: <span class="font-bold">${findBlock(state.week)}</span></p>
                    <div class="flex gap-2 mt-2 items-center"><button class="btn-ghost text-xs" data-action="change-week" data-amount="-1">-</button><input type="range" class="w-full" min="1" max="26" value="${state.week}" data-action="set-week"><button class="btn-ghost text-xs" data-action="change-week" data-amount="1">+</button></div>
                    <p id="quick-msg" class="text-xs text-center text-gray-500 mt-2">Prêt.</p>
                </div>
                <div class="section-title">Volume Hebdomadaire</div>
                <div class="card">
                    <canvas id="volumeChart"></canvas>
                </div>
                <div class="section-title">Séances</div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${workoutKeys.map(key => `
                        <div class="card">
                            <h3 class="font-bold text-lg">${state.program[key].title}</h3>
                            <p class="text-sm text-gray-400 mt-2">Prêt pour la séance ?</p>
                            <button class="btn mt-4 w-full" data-action="start-workout" data-key="${key}">Commencer</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        renderChart(volumeByMuscle);
    };
    
    const renderSessionScreen = () => {
        if (!state.activeWorkout) return render();
        const workout = state.program[state.activeWorkout.key];
        const currentBlock = getCurrentBlockName(state.week);
        const getBlockTechnique = (t) => typeof t === 'string' ? t : (t[currentBlock] || 'Standard');

        app.container.innerHTML = `
            <div class="screen-container">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="screen-title header-glow" style="margin-bottom:0;">${workout.title}</h1>
                    <button class="btn-ghost" data-action="finish-workout">Terminer</button>
                </div>
                ${workout.exercises.map((ex, exIndex) => `
                    <div class="exercise-card mb-4">
                        <div class="flex justify-between items-start">
                           <div>
                            <h3 class="font-bold text-lg">${ex.name}</h3>
                            <p class="text-sm text-gray-400">${ex.sets} sets x ${ex.reps} reps</p>
                           </div>
                           <button class="btn-ghost text-xs p-2" data-action="show-ex-details" data-ex-key="${btoa(JSON.stringify(ex))}" data-block-tech="${getBlockTechnique(ex.techniques)}">i</button>
                        </div>
                        ${getBlockTechnique(ex.techniques) ? `<div class="technique-box mt-2">${getBlockTechnique(ex.techniques)}</div>` : ''}
                        <div class="grid grid-cols-5 items-center mt-4 gap-2">
                             ${Array.from({ length: ex.sets }, (_, i) => {
                                const setKey = \\`${exIndex}-${i}\``;
                                const setData = state.activeWorkout.sets && state.activeWorkout.sets[setKey] ? state.activeWorkout.sets[setKey] : { weight: '', reps: '', completed: false };
                                return `
                                <div class="col-span-1 text-center">
                                    <input type="checkbox" id="set-${setKey}" class="set-checkbox" data-action="toggle-set" data-ex-index="${exIndex}" data-set-index="${i}" ${setData.completed ? 'checked' : ''}>
                                    <label for="set-${setKey}" class="text-lg">${i + 1}</label>
                                </div>
                                <div class="col-span-2">
                                     <input type="text" class="input text-center text-sm" placeholder="${ex.weight} kg" value="${setData.weight || ''}" data-action="update-set-data" data-key="${setKey}" data-field="weight">
                                </div>
                                <div class="col-span-2">
                                    <input type="text" class="input text-center text-sm" placeholder="${ex.reps} reps" value="${setData.reps || ''}" data-action="update-set-data" data-key="${setKey}" data-field="reps">
                                </div>
                            `}).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    };
    
    const render = () => { if (state.activeWorkout) renderSessionScreen(); else renderHomeScreen(); };

    const renderChart = (volumeByMuscle) => {
        const ctx = document.getElementById('volumeChart')?.getContext('2d');
        if(!ctx) return;
        // destroy previous chart instance to avoid duplicates / warnings
        if (volumeChart) {
            try { volumeChart.destroy(); } catch (e) { /* ignore */ }
            volumeChart = null;
        }
        volumeChart = new Chart(ctx, { 
            type: 'bar', 
            data: { 
                labels: Object.keys(volumeByMuscle), 
                datasets: [{ 
                    label: 'Séries par groupe musculaire', 
                    data: Object.values(volumeByMuscle), 
                    backgroundColor: 'rgba(245, 158, 11, 0.2)', 
                    borderColor: 'rgba(245, 158, 11, 1)', 
                    borderWidth: 1 
                }] 
            }, 
            options: { 
                responsive: true, 
                plugins: { legend: { display: false } }, 
                scales: { 
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#9ca3af' } }, 
                    x: { grid: { display: false }, ticks: { color: '#9ca3af' } } 
                } 
            } 
        });
    };

    const showExDetailsModal = (exB64, blockTech) => {
        const ex = JSON.parse(atob(exB64));
        const musclesB64 = btoa(JSON.stringify(ex.muscles));
        app.modal.innerHTML = `<div class="modal-overlay" onclick="document.getElementById('modal-container').innerHTML = ''"><div class="modal-card" onclick="event.stopPropagation()"><h2 class="section-title">${ex.name}</h2><p class="technique-box">${blockTech}</p><div class="anatomy-container" onmouseleave="window.highlightMuscles(null)">${ANATOMY_SVG.combined}</div><div class="text-center text-xs space-x-4 mb-4"><span onmouseenter="window.highlightMuscles('${musclesB64}')" class="cursor-pointer"><span class="inline-block w-3 h-3 rounded-full bg-green-400 mr-1" style="background-color: var(--highlight-direct);"></span>Direct</span><span onmouseenter="window.highlightMuscles('${musclesB64}')" class="cursor-pointer"><span class="inline-block w-3 h-3 rounded-full bg-blue-400 mr-1" style="background-color: var(--highlight-indirect);"></span>Indirect</span></div>${ex.securite ? `<div class="mt-4"><h3 class="font-bold mb-2">Points de sécurité</h3><ul class="list-disc list-inside text-sm text-gray-300">${ex.securite.map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}<button class="btn-ghost mt-6 w-full" onclick="document.getElementById('modal-container').innerHTML = ''">Fermer</button></div></div>`;
    };
    
    app.container.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const action = target.getAttribute('data-action');
        const key = target.getAttribute('data-key');
        
        if (action === 'start-workout' && key) { 
            state.activeWorkout = { key: key, started: Date.now(), sets: {} }; 
            saveState(); 
            render(); 
        }
        if (action === 'finish-workout') { 
            state.activeWorkout = null; 
            saveState();
            render(); 
        }
        if (action === 'change-week') { 
            state.week = Math.max(1, Math.min(26, state.week + parseInt(target.getAttribute('data-amount')))); 
            saveState(); 
            render(); 
            showQuickMsg(`Semaine ${state.week}`); 
        }
        if (action === 'show-ex-details') { 
            showExDetailsModal(target.getAttribute('data-ex-key'), target.getAttribute('data-block-tech')); 
        }
    });

    app.container.addEventListener('change', (e) => {
        const target = e.target;
        if (target.dataset.action === 'toggle-set' && state.activeWorkout) {
            const exIndex = target.dataset.exIndex;
            const setIndex = target.dataset.setIndex;
            const setKey = `${exIndex}-${setIndex}`;
            
            if (!state.activeWorkout.sets) state.activeWorkout.sets = {};
            if (!state.activeWorkout.sets[setKey]) {
                state.activeWorkout.sets[setKey] = { weight: '', reps: '', completed: false };
            }
            
            state.activeWorkout.sets[setKey].completed = target.checked;
            
            if (target.checked) {
                const ex = state.program[state.activeWorkout.key].exercises[parseInt(exIndex)];
                if(ex.rest) startTimer(ex.rest);
            }
            saveState();
        }
    });
    
    app.container.addEventListener('input', (e) => {
        const target = e.target;
        const action = target.dataset.action;
        
        if (action === 'update-set-data' && state.activeWorkout) {
            const { key, field } = target.dataset;
            if (key && field) {
                if (!state.activeWorkout.sets) state.activeWorkout.sets = {};
                if (!state.activeWorkout.sets[key]) {
                    state.activeWorkout.sets[key] = { weight: '', reps: '', completed: false };
                }
                state.activeWorkout.sets[key][field] = target.value;
                saveState();
            }
        }
        
        if (action === 'set-week') { 
            state.week = parseInt(target.value); 
            render(); 
            showQuickMsg(`Semaine ${state.week}`); 
        }
    });
    
    const saveWeek = (e) => {
        if(e.target.dataset.action === 'set-week') saveState();
    };
    app.container.addEventListener('touchend', saveWeek);
    app.container.addEventListener('mouseup', saveWeek);
    
    const showQuickMsg = (msg) => { 
        const el = document.getElementById('quick-msg'); 
        if(el) { 
            el.textContent = msg; 
            setTimeout(() => { el.textContent = 'Prêt.'; }, 2000); 
        } 
    };
    
    const findBlock = (w) => { 
        if ([6,12,18,24,26].includes(w)) return "DELOAD"; 
        if (w <= 5) return "Fondation (B1)"; 
        if (w <= 11) return "Surcharge (B2)"; 
        if (w <= 25) return "Intensification (B3)"; 
        return "Cycle Terminé"; 
    };
    
    const getCurrentBlockName = (w) => { 
        if (w <= 5) return 'Bloc1'; 
        if (w <= 11) return 'Bloc2'; 
        return 'Bloc3'; 
    };
    
    let timerInterval;
    const startTimer = (duration) => {
        clearInterval(timerInterval);
        let timeLeft = duration;
        const updateTimer = () => {
            if (timeLeft < 0) { 
                clearInterval(timerInterval); 
                app.timer.innerHTML = ''; 
                return; 
            }
            const circumference = 2 * Math.PI * 20; 
            const offset = circumference - (timeLeft / duration) * circumference;
            app.timer.innerHTML = `
                <div class="timer">
                    <div class="relative w-12 h-12 flex-shrink-0">
                        <svg class="w-full h-full" viewBox="0 0 44 44">
                            <circle class="text-gray-700" stroke-width="4" stroke="currentColor" fill="transparent" r="20" cx="22" cy="22"/>
                            <circle class="progress-circle" style="color:var(--accent)" stroke-width="4" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" stroke="currentColor" fill="transparent" r="20" cx="22" cy="22"/>
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center font-bold text-sm">
                            ${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}
                        </div>
                    </div>
                    <div class="font-bold flex-grow">Repos</div>
                    <button class="btn-ghost text-xs" onclick="clearInterval(window.timerInterval);document.getElementById('timer-container').innerHTML = ''">X</button>
                </div>`;
            timeLeft--;
        };
        updateTimer();
        window.timerInterval = timerInterval = setInterval(updateTimer, 1000);
    };
    
    window.highlightMuscles = (musclesB64) => {
        const muscles = musclesB64 ? JSON.parse(atob(musclesB64)) : null;
        document.querySelectorAll('.anatomy-container .muscle').forEach(m => {
            m.classList.remove('direct', 'indirect');
            if(!muscles) return;
            if(muscles.direct.includes(m.dataset.muscle)) m.classList.add('direct');
            if(muscles.indirect.includes(m.dataset.muscle)) m.classList.add('indirect');
        });
    };
    
    loadState();
    render();
});
