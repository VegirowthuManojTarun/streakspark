import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary to-secondary text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to StreakSpark</h1>
      <p className="mb-8 text-lg max-w-xl text-center">
        Build habits, stay motivated, and watch your streaks grow every day!
      </p>
      <Link to="/login" className="btn-primary">
        Get Started
      </Link>
    </div>
  );
}
