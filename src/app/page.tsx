'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const UsersPage = () => {
  const router = useRouter();

  const handleCreateHabitList = () => {
    router.push('/create');
  };

  const handleEnterHabitSession = () => {
    router.push('/habits');
  };

  const handleStartSession = () => {
    router.push('/habits/session');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">
              Build Better Habits with Ease
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-emerald-700 mb-6">
                Habit Reminder is your personal companion for building and maintaining positive habits. 
                Our app helps you stay on track with your goals through gentle reminders and progress tracking.
              </p>
              <p className="text-lg text-emerald-700">
                Whether you want to establish a new routine, break old habits, or simply stay organized, 
                Habit Reminder provides the tools and motivation you need to succeed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <button
              onClick={handleCreateHabitList}
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <h2 className="text-2xl font-bold mb-2">Create New Habit</h2>
              <p className="text-emerald-100">Start building your habits today</p>
            </button>

            <button
              onClick={handleEnterHabitSession}
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <h2 className="text-2xl font-bold mb-2">Manage Habits</h2>
              <p className="text-emerald-100">Track and modify your habits</p>
            </button>

            <button
              onClick={handleStartSession}
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <h2 className="text-2xl font-bold mb-2">Start Session</h2>
              <p className="text-emerald-100">Begin your habit tracking session</p>
            </button>
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

export default UsersPage;
