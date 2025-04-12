'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Habit = {
    id: number;
    description: string;
    time: 'morning' | 'afternoon' | 'evening';
    completed: boolean;
};

interface HabitData {
    passcode: string;
    habits: string[];
}

const HabitPage = () => {
    const [habitData, setHabitData] = useState<Habit[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [newDescription, setNewDescription] = useState<string>('');
    const [newTime, setNewTime] = useState<'morning' | 'afternoon' | 'evening' | ''>('');
    const [passcode, setPasscode] = useState<string>('');

    const router = useRouter();

    useEffect(() => {
        const storedData = localStorage.getItem('habitData');

        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setPasscode(parsedData.passcode);

                const base64Habits = parsedData?.habits || [];

                const decodedHabits = base64Habits.map((encodedHabit: string) => {
                    try {
                        const decodedString = atob(encodedHabit);
                        return JSON.parse(decodedString);
                    } catch (e) {
                        console.error('Error decoding habit:', e);
                        return null;
                    }
                }).filter((habit: Habit | null) => habit !== null);

                const timeOrder: { [key: string]: number } = { morning: 0, afternoon: 1, evening: 2 };
                const sortedHabits = decodedHabits.sort((a: any, b: any) => timeOrder[a.time] - timeOrder[b.time]);

                setHabitData(sortedHabits);
                setLoading(false);
            } catch (error) {
                setError('Failed to parse habit data from localStorage.');
                setLoading(false);
            }
        } else {
            setError('No habit data found.');
            setLoading(false);
        }
    }, []);

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => setNewDescription(e.target.value);
    const handleTimeChange = (e: ChangeEvent<HTMLSelectElement>) => setNewTime(e.target.value as 'morning' | 'afternoon' | 'evening');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!newDescription || !newTime) {
            alert('Please enter a description and select a time of day.');
            return;
        }

        const newHabit: Habit = {
            id: editingHabit ? editingHabit.id : Date.now(),
            description: newDescription,
            time: newTime,
            completed: false,
        };

        const updatedHabits = editingHabit
            ? habitData.map((habit) => (habit.id === editingHabit.id ? newHabit : habit))
            : [...habitData, newHabit];

        setHabitData(updatedHabits);
        localStorage.setItem('habitData', JSON.stringify({ habits: updatedHabits.map(habit => btoa(JSON.stringify(habit))) }));

        setNewDescription('');
        setNewTime('');
        setEditingHabit(null);
    };

    const handleEdit = (habit: Habit) => {
        setEditingHabit(habit);
        setNewDescription(habit.description);
        setNewTime(habit.time);
    };

    const handleDelete = (habitId: number) => {
        const updatedHabits = habitData.filter((habit) => habit.id !== habitId);
        setHabitData(updatedHabits);
        localStorage.setItem('habitData', JSON.stringify({ habits: updatedHabits.map(habit => btoa(JSON.stringify(habit))) }));
    };

    const handleCompletionChange = (habitId: number) => {
        const updatedHabits = habitData.map((habit) =>
            habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
        );
        setHabitData(updatedHabits);
        localStorage.setItem('habitData', JSON.stringify({ habits: updatedHabits.map(habit => btoa(JSON.stringify(habit))) }));
    };

    const encodeHabit = (habit: Habit): string => {
        const habitString = JSON.stringify(habit);
        const encodedString = Buffer.from(habitString).toString('base64');
        return encodedString;
    };

    const handleSaveAllToDb = async () => {
        try {
            const habitDescriptions = habitData.map((habit) => habit.description).join(',');

            const bodyData = {
                passcode: passcode,
                habits: habitData.map(encodeHabit),
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL}/${passcode}`, {
                method: 'PUT',
                body: JSON.stringify(bodyData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setHabitData([]);
                localStorage.setItem('habitData', JSON.stringify({ habits: [] }));
                localStorage.removeItem('ID');
                localStorage.removeItem('passcode');
                router.push('/');
                alert('All habits saved successfully to the database!');
            } else {
                alert('Error saving habits to the database!');
            }
        } catch (error) {
            console.error('Error during saving habits:', error);
            alert('An error occurred while saving the habits.');
        }
    };

    const handleDeleteAllFromDb = async (): Promise<void> => {
        const habitDataString = localStorage.getItem('habitData');

        if (!habitDataString) {
            console.error("No habit data found in localStorage");
            return;
        }

        const habitData: HabitData = JSON.parse(habitDataString);

        if (!habitData.passcode) {
            console.error("No passcode found in habit data");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL}/${habitData.passcode}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to delete habit data from the server");
            }

            localStorage.removeItem('habitData');
            router.push('/');
            console.log("Habit data deleted from the server and localStorage cleared.");
        } catch (error) {
            console.error("Error deleting habit data:", error);
        }
    };

    if (loading) return <div>Loading habits...</div>;
    if (error) return <div>{error}</div>;

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
                            Modify Your Habits
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
                                        value={newDescription}
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
                                        value={newTime}
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
                                    {editingHabit ? 'Update Habit' : 'Add Habit'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-emerald-800 mb-6">Your Habits</h2>
                        <div className="space-y-4">
                            {habitData.map((habit) => (
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
                                            onClick={() => handleEdit(habit)}
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
                                onClick={handleSaveAllToDb}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Save All to Database
                            </button>
                            <button
                                onClick={handleDeleteAllFromDb}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Delete All Habits
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

export default HabitPage;
