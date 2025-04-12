'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Habit = {
  id: number;
  description: string;
  time: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
};

//Base 64 Encoding function to store Habit Objects as JSON Strings
const encodeHabit = (habit: Habit): string => {
  const habitString = JSON.stringify(habit);  
  const encodedString = Buffer.from(habitString).toString('base64'); 
  return encodedString;
};

// decode habit Object
const decodeHabit = (encodedString: string): Habit => {
  const decodedString = Buffer.from(encodedString, 'base64').toString();  
  return JSON.parse(decodedString);  
};

const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const Habits = () => {
  const apiUrl = process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL;

  if (!apiUrl) {
    console.error("API URL is not defined");
    return;
  }

  const [habits, setHabits] = useState<Habit[]>([]);
  const [passcode, setPasscode] = useState<string>('');
  const [habitDescription, setHabitDescription] = useState<string>('');
  const [habitTime, setHabitTime] = useState<'morning' | 'afternoon' | 'evening' | ''>(''); 
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    const storedPasscode = localStorage.getItem('habitPasscode');

    if (storedHabits) {
      const decodedHabits = JSON.parse(storedHabits).map((encodedHabit: string) => decodeHabit(encodedHabit)); 
      setHabits(decodedHabits);
    }

    if (storedPasscode) {
      setPasscode(storedPasscode);
    } else {
      const newPasscode = generatePasscode();
      setPasscode(newPasscode);
      localStorage.setItem('habitPasscode', newPasscode);
    }
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      const encodedHabits = habits.map(encodeHabit);  
      localStorage.setItem('habits', JSON.stringify(encodedHabits));
    }
  }, [habits]);

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHabitDescription(e.target.value);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setHabitTime(e.target.value as 'morning' | 'afternoon' | 'evening' | '');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!habitDescription || !habitTime) {
      alert('Please fill out both fields!');
      return;
    }

    const newHabit: Habit = {
      id: editingHabitId ?? Date.now(),  
      description: habitDescription,
      time: habitTime as 'morning' | 'afternoon' | 'evening',
      completed: false, 
    };

    if (editingHabitId) {
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === editingHabitId ? { ...habit, ...newHabit } : habit
        )
      );
    } else {
      setHabits((prevHabits) => [...prevHabits, newHabit]);
    }

    setHabitDescription('');
    setHabitTime(''); 
    setEditingHabitId(null);
  };

  const handleEdit = (habitId: number) => {
    const habitToEdit = habits.find((habit) => habit.id === habitId);
    if (habitToEdit) {
      setEditingHabitId(habitToEdit.id);
      setHabitDescription(habitToEdit.description);
      setHabitTime(habitToEdit.time);
    }
  };

  const handleDelete = (habitId: number) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId);
    setHabits(updatedHabits);
  };

  const handleCompletionChange = (habitId: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const saveHabitsToDatabase = async () => {
    try {
      const habitDescriptions = habits.map((habit) => habit.description).join(',');

      const bodyData = {
        passcode: passcode,
        habits: habits.map(encodeHabit),  
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(bodyData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Habits saved successfully!');
        localStorage.removeItem('habits');
        localStorage.removeItem('habitPasscode');
        router.push('/');
      } else {
        alert('Error saving habits to the database!');
      }
    } catch (error) {
      console.error('Error during saving habits:', error);
      alert('An error occurred while saving the habits.');
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-emerald-50">
      {/* Navigation Bar */}
      <nav className="bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-white hover:text-emerald-100">
                Habit Reminder
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/instructions"
                className="text-white hover:text-emerald-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                How to Use
              </Link>
              <Link
                href="/"
                className="text-white hover:text-emerald-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-800 mb-4">
              Create & Manage Your Habits
            </h1>
            <div className="bg-emerald-100 p-4 rounded-lg inline-block">
              <p className="text-emerald-700 font-medium">
                Your Habit List Passcode: <span className="font-bold">{passcode}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="habit-description" className="block text-sm font-medium text-emerald-700 mb-2">
                    Habit Description
                  </label>
                  <input
                    type="text"
                    id="habit-description"
                    value={habitDescription}
                    onChange={handleDescriptionChange}
                    placeholder="E.g., Drink 8 cups of water"
                    required
                    className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="habit-time" className="block text-sm font-medium text-emerald-700 mb-2">
                    Time of Day
                  </label>
                  <select
                    id="habit-time"
                    value={habitTime}
                    onChange={handleTimeChange}
                    required
                    className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select Time of Day</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {editingHabitId ? 'Update Habit' : 'Add Habit'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Your Habits</h2>
            <div className="space-y-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={habit.completed}
                      onChange={() => handleCompletionChange(habit.id)}
                      className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div>
                      <p className={`font-medium ${habit.completed ? 'line-through text-emerald-500' : 'text-emerald-800'}`}>
                        {habit.description}
                      </p>
                      <p className="text-sm text-emerald-600">
                        {habit.time.charAt(0).toUpperCase() + habit.time.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(habit.id)}
                      className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={saveHabitsToDatabase}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Save to Database
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-emerald-100">© {new Date().getFullYear()} Habit Reminder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Habits;
