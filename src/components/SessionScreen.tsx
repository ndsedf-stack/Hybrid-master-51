import React, { useState, useEffect } from 'react';
import { ActiveWorkout, Exercise, Program, Screen } from '../types';
import { findBlock, getCurrentBlockName } from '../constants';
import { ArrowLeftIcon, WarningIcon, TrashIcon } from './icons';

interface SessionScreenProps {
  activeWorkout: ActiveWorkout;
  week: number;
  program: Program;
  onEndWorkout: () => void;
  onCancelWorkout: () => void;
  onToggleSet: (exerciseIndex: number, setIndex: number, isChecked: boolean) => void;
  onScreenChange: (screen: Screen) => void;
}

const SetCheckbox: React.FC<{
  exerciseIndex: number;
  setIndex: number;
  isChecked: boolean;
  onToggle: (exerciseIndex: number, setIndex: number, isChecked: boolean) => void;
}> = ({ exerciseIndex, setIndex, isChecked, onToggle }) => {
  const id = `set-${exerciseIndex}-${setIndex}`;
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={(e) => onToggle(exerciseIndex, setIndex, e.target.checked)}
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

const ExerciseCard: React.FC<{
  exercise: Exercise;
  exerciseIndex: number;
  week: number;
  checkedSets: { [key: string]: { completed: boolean } };
  onToggleSet: (exerciseIndex: number, setIndex: number, isChecked: boolean) => void;
  workoutKey: string;
}> = ({ exercise, exerciseIndex, week, checkedSets, onToggleSet, workoutKey }) => {
    const currentBlock = getCurrentBlockName(week);
    const technique = typeof exercise.techniques === 'object' ? exercise.techniques[currentBlock] : exercise.techniques;
  
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg space-y-4">
        <div>
          <h3 className="font-bold text-lg">{exercise.name}</h3>
          <p className="text-slate-400 text-sm">
            {exercise.sets} × {exercise.reps} reps | {exercise.weight}kg | Repos: {Math.floor(exercise.rest / 60)}:{(exercise.rest % 60).toString().padStart(2, '0')}
          </p>
        </div>

        {technique && (
          <div className="bg-amber-900/50 border border-amber-700 text-amber-300 font-bold text-center text-sm py-2 px-3 rounded-md">
            {technique}
          </div>
        )}

        <div className="flex gap-3 flex-wrap justify-center pt-2">
            {Array.from({ length: exercise.sets }, (_, s) => {
                const setKey = `${workoutKey}-${exerciseIndex}-${s}`;
                const isChecked = checkedSets[setKey]?.completed || false;
                return <SetCheckbox key={s} exerciseIndex={exerciseIndex} setIndex={s} isChecked={isChecked} onToggle={onToggleSet} />;
            })}
        </div>
        
        {exercise.securite && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm p-3 rounded-md flex items-start gap-3">
                <WarningIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
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
};

const SessionScreen: React.FC<SessionScreenProps> = ({ activeWorkout, week, program, onEndWorkout, onCancelWorkout, onToggleSet, onScreenChange }) => {
  const workout = program[activeWorkout.key];
  const [duration, setDuration] = useState(Date.now() - activeWorkout.startTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(Date.now() - activeWorkout.startTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeWorkout.startTime]);
  
  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours > 0 ? hours.toString().padStart(2, '0') : null,
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].filter(Boolean).join(':');
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <button
            onClick={() => onScreenChange('home')}
            className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors font-semibold"
        >
            <ArrowLeftIcon />
            Quitter
        </button>
        <div className="bg-slate-800 text-amber-400 font-bold font-mono text-lg py-1 px-3 rounded-md border border-slate-700">
            {formatDuration(duration)}
        </div>
      </header>
      
      <div>
        <h1 className="text-3xl font-extrabold text-amber-400">{workout.title}</h1>
        <p className="text-slate-400">Semaine {week} - {findBlock(week)}</p>
      </div>

      <div className="space-y-4">
        {workout.exercises.map((ex, i) => (
          <ExerciseCard
            key={i}
            exercise={ex}
            exerciseIndex={i}
            week={week}
            checkedSets={activeWorkout.sets}
            onToggleSet={onToggleSet}
            workoutKey={activeWorkout.key}
          />
        ))}
      </div>
      
      <div className="space-y-3 pt-4">
        <button onClick={onEndWorkout} className="w-full bg-amber-500 text-slate-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors text-lg">
            ✅ Terminer la séance
        </button>
         <button onClick={onCancelWorkout} className="w-full flex items-center justify-center gap-2 text-red-400 font-semibold py-2 px-4 rounded-lg hover:bg-red-900/30 transition-colors">
            <TrashIcon /> Annuler la séance
        </button>
      </div>

    </div>
  );
};

export default SessionScreen;