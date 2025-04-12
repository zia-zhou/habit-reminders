'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ModifyHabits = () => {
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasscode(e.target.value);
    };

    const handleModifyClick = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL}/${passcode}`);

            if (response.ok) {
                const habit = await response.json();

                localStorage.setItem('habitData', JSON.stringify(habit));
                localStorage.setItem('passcode', JSON.stringify(passcode));
                localStorage.setItem('ID', JSON.stringify(habit.id));
                console.log(habit);

                router.push(`/habits/session/${passcode}`);
            } else {
                setError('Invalid passcode or error fetching data.');
            }
        } catch (error) {
            setError('An error occurred while fetching the habit data.');
        }
    };

    const handleBackClick = () => {
        router.push('/');
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
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-emerald-800 mb-4">
                            Start Habit Session
                        </h1>
                        <p className="text-lg text-emerald-700">
                            Enter your habit code to start your habit session.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="passcode" className="block text-sm font-medium text-emerald-700 mb-2">
                                    Habit Code
                                </label>
                                <input
                                    type="text"
                                    id="passcode"
                                    value={passcode}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter your habit code"
                                    required
                                    className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={handleModifyClick}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Start Session
                                </button>
                                <button
                                    onClick={handleBackClick}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Back to Home
                                </button>
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

export default ModifyHabits;
