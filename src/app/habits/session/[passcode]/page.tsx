'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const decodeHabit = (encodedString: string) => {
  const decodedString = atob(encodedString); 
  const habit = JSON.parse(decodedString); 
  return habit;
};

const HabitPage = () => {
  const [habitData, setHabitData] = useState<any[]>([]);  
  const [error, setError] = useState<string>('');  
  const [loading, setLoading] = useState<boolean>(true);  
  const router = useRouter(); 

  useEffect(() => {
    const storedData = localStorage.getItem('habitData'); 

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);

        if (parsedData?.habits && Array.isArray(parsedData.habits)) {
          const decodedHabits = parsedData.habits.map((encodedHabit: string) => decodeHabit(encodedHabit));
          setHabitData(decodedHabits); 
          setLoading(false);
        } else {
          setError('Habit list data is not properly structured.');
          setLoading(false);
        }
      } catch (error) {
        setError('Failed to parse habit data from localStorage.');
        setLoading(false);
      }
    } else {
      setError('No habit data found.');
      setLoading(false);
    }
  }, []);

  const handleCompletionChange = (habitId: number) => {
    const updatedHabits = habitData.map((habit) => {
      if (habit.id === habitId) {
        const updatedHabit = { ...habit, completed: !habit.completed };
        return updatedHabit;
      }
      return habit;
    });

    setHabitData(updatedHabits);

    const storedData = localStorage.getItem('habitData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      parsedData.habits = updatedHabits.map((habit) => btoa(JSON.stringify(habit))); 
      localStorage.setItem('habitData', JSON.stringify(parsedData));
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-red-500 text-lg p-4 bg-white rounded-lg shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-emerald-800 text-lg p-4 bg-white rounded-lg shadow-lg">
          Loading habit data...
        </div>
      </div>
    );
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-800 mb-4">
              Your Daily Habits
            </h1>
            <button
              onClick={() => router.push('/')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Home
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Morning Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Morning</h2>
              <div className="space-y-4">
                {habitData
                  .filter((habit) => habit.time === 'morning')
                  .map((habit) => (
                    <div
                      key={habit.id}
                      className="p-4 bg-emerald-50 rounded-lg border border-emerald-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={habit.completed}
                            onChange={() => handleCompletionChange(habit.id)}
                            className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                          />
                          <p className={`font-medium ${habit.completed ? 'line-through text-emerald-500' : 'text-emerald-800'}`}>
                            {habit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Afternoon Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Afternoon</h2>
              <div className="space-y-4">
                {habitData
                  .filter((habit) => habit.time === 'afternoon')
                  .map((habit) => (
                    <div
                      key={habit.id}
                      className="p-4 bg-emerald-50 rounded-lg border border-emerald-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={habit.completed}
                            onChange={() => handleCompletionChange(habit.id)}
                            className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                          />
                          <p className={`font-medium ${habit.completed ? 'line-through text-emerald-500' : 'text-emerald-800'}`}>
                            {habit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Evening Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Evening</h2>
              <div className="space-y-4">
                {habitData
                  .filter((habit) => habit.time === 'evening')
                  .map((habit) => (
                    <div
                      key={habit.id}
                      className="p-4 bg-emerald-50 rounded-lg border border-emerald-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={habit.completed}
                            onChange={() => handleCompletionChange(habit.id)}
                            className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                          />
                          <p className={`font-medium ${habit.completed ? 'line-through text-emerald-500' : 'text-emerald-800'}`}>
                            {habit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
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

export default HabitPage;
