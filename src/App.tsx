import React, { useState, useEffect } from 'react';

// MOCK DATA
const workout = {
  title: "Push 1",
  week: 7,
  block: "Surcharge (B2)",
  exercises: [
    {
      name: "Développé couché haltères",
      sets: 4,
      reps: 10,
      weight: 22,
      rest: 120,
      techniques: "Tempo contrôlé",
      securite: ["Toujours garder le dos collé au banc.", "Ne pas verrouiller complètement les coudes."]
    },
    {
      name: "Pompes",
      sets: 3,
      reps: 15,
      weight: null,
      rest: 90,
      techniques: "Amplitude complète",
      securite: ["Gardez les abdos contractés.", "Alignement du corps."]
    }
  ]
};

const initialSets = {};
workout.exercises.forEach((ex, i) => {
  for (let s = 0; s < ex.sets; s++) {
    initialSets[`${i}-${s}`] = { completed: false };
  }
});

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours > 0 ? hours.toString().padStart(2, '0') : null,
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].filter(Boolean).join(':');
}

const SetCheckbox = ({ exerciseIndex, setIndex, isChecked, onToggle }) => {
  const id = `set-${exerciseIndex}-${setIndex}`;
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={e => onToggle(exerciseIndex, setIndex, e.target.checked)}
        className="hidden peer"
      />
      <label
        htmlFor={id}
        className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-slate-600 cursor-pointer font-bold text-slate-400 transition-all peer-checked:bg-amber-500 peer-checked:border-amber-500 peer-checked:text-slate-900 peer-checked:scale-110"
      >
        {setIndex + 1}
      </label>
    </div>
  );
};

const ExerciseCard = ({ exercise, exerciseIndex, checkedSets, onToggleSet }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-4">
    <div>
      <h3 className="font-bold text-lg">{exercise.name}</h3>
      <p className="text-slate-400 text-sm">
        {exercise.sets} × {exercise.reps} reps
        {exercise.weight ? ` | ${exercise.weight}kg` : ""}
        {" | Repos: "}
        {Math.floor(exercise.rest / 60)}:{(exercise.rest % 60).toString().padStart(2, '0')}
      </p>
    </div>
    {exercise.techniques && (
      <div className="bg-amber-900/50 border border-amber-700 text-amber-300 font-bold text-center text-sm py-2 px-3 rounded-md">
        {exercise.techniques}
      </div>
    )}
    <div className="flex gap-3 flex-wrap justify-center pt-2">
      {Array.from({ length: exercise.sets }, (_, s) => (
        <SetCheckbox
          key={s}
          exerciseIndex={exerciseIndex}
          setIndex={s}
          isChecked={checkedSets[`${exerciseIndex}-${s}`]?.completed || false}
          onToggle={onToggleSet}
        />
      ))}
    </div>
    {exercise.securite && (
      <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm p-3 rounded-md flex items-start gap-3">
        <span className="w-5 h-5 mt-0.5 flex-shrink-0">⚠️</span>
        <div>
          <h4 className="font-bold mb-1">Sécurité</h4>
          <ul className="list-disc list-inside text-xs space-y-1">
            {exercise.securite.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    )}
  </div>
);

const App = () => {
  const [duration, setDuration] = useState(0);
  const [checkedSets, setCheckedSets] = useState(initialSets);

  useEffect(() => {
    const startTime = Date.now();
    setDuration(0);
    const timer = setInterval(() => {
      setDuration(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSet = (exerciseIndex, setIndex, isChecked) => {
    setCheckedSets(prev => ({
      ...prev,
      [`${exerciseIndex}-${setIndex}`]: { completed: isChecked }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <button
          className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors font-semibold"
          onClick={() => window.location.reload()}
        >
          <span className="text-xl">←</span>
          Quitter
        </button>
        <div className="bg-slate-800 text-amber-400 font-bold font-mono text-lg py-1 px-3 rounded-md border border-slate-700">
          {formatDuration(duration)}
        </div>
      </header>

      <div>
        <h1 className="text-3xl font-extrabold text-amber-400">{workout.title}</h1>
        <p className="text-slate-400">Semaine {workout.week} - {workout.block}</p>
      </div>

      <div className="space-y-4">
        {workout.exercises.map((ex, i) => (
          <ExerciseCard
            key={i}
            exercise={ex}
            exerciseIndex={i}
            checkedSets={checkedSets}
            onToggleSet={handleToggleSet}
          />
        ))}
      </div>

      <div className="space-y-3 pt-4">
        <button className="w-full bg-amber-500 text-slate-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors text-lg">
          ✅ Terminer la séance
        </button>
        <button className="w-full flex items-center justify-center gap-2 text-red-400 font-semibold py-2 px-4 rounded-lg hover:bg-red-900/30 transition-colors">
          <span>🗑️</span> Annuler la séance
        </button>
      </div>
    </div>
  );
};

export default App;