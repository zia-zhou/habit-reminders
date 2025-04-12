'use client';

import Link from 'next/link';

export default function InstructionsPage() {
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
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-emerald-800 mb-4">
              How to Use Habit Reminder
            </h1>
            <p className="text-lg text-emerald-700">
              A simple guide to help you get started with tracking your daily habits
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-emerald-800 mb-2">Create Your Habit List</h2>
                  <p className="text-emerald-700">
                    Start by creating a new habit list. The app will automatically generate a numeric passcode for you. 
                    Make sure to save this passcode as you'll need it to access your habits later.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-emerald-800 mb-2">Add Your Habits</h2>
                  <p className="text-emerald-700">
                    Add your daily habits and specify when you want to do them (morning, afternoon, or evening). You can add as many habits as you need.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-emerald-800 mb-2">Access Your Habits</h2>
                  <p className="text-emerald-700">
                    Use your passcode to access your habit list anytime. Your habits will be organized by time of day for easy tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-emerald-800 mb-2">Track Your Progress</h2>
                  <p className="text-emerald-700">
                    Mark your habits as completed throughout the day. Your progress is automatically saved, so you can pick up where you left off.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-bold">
                    5
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-emerald-800 mb-2">Modify Your Habits</h2>
                  <p className="text-emerald-700">
                    Need to make changes? You can edit, delete, or add new habits at any time using your passcode.
                  </p>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-emerald-100 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Tips for Success</h2>
              <ul className="space-y-3 text-emerald-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  Start with a few manageable habits and gradually add more
                </li>
               
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  Check your habits at the beginning of each time period (morning, afternoon, evening)
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  Be consistent with your habit tracking to build momentum
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  The passcode is automatically generated as a 6-digit number - make sure to save it somewhere safe
                </li>
              </ul>
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
} 