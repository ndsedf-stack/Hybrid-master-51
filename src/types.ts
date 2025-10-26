export type ActiveWorkout = {
  key: string;
  sets: { [setKey: string]: { completed: boolean } };
  startTime: number;
};

export type Exercise = {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number;
  techniques?: string | { [blockName: string]: string };
  securite?: string[];
};

export type Program = {
  [key: string]: {
    title: string;
    exercises: Exercise[];
  };
};

export type Screen = 'home' | 'session' | 'other';