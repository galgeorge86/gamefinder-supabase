"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  // Form state
  const [form, setForm] = useState({
    username: "",
    bio: "",
    play_style: "",
    location: "",
    preferred_play_location: "LGS",
    decks: [""],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    idx?: number
  ) => {
    const { name, value } = e.target;
    if (name === "deck" && typeof idx === "number") {
      const newDecks = [...form.decks];
      newDecks[idx] = value;
      setForm({ ...form, decks: newDecks });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addDeck = () => setForm({ ...form, decks: [...form.decks, ""] });
  const removeDeck = (idx: number) =>
    setForm({ ...form, decks: form.decks.filter((_, i) => i !== idx) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Submit form data to your API
    // await fetch(...)
    router.push(redirectUrl);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>
        <div>
          <label className="block font-medium">Play Style</label>
          <input
            name="play_style"
            value={form.play_style}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="e.g. Casual, Competitive, Commander"
          />
        </div>
        <div>
          <label className="block font-medium">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="City or region"
          />
        </div>
        <div>
          <label className="block font-medium">Preferred Play Location</label>
          <select
            name="preferred_play_location"
            value={form.preferred_play_location}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="LGS">Local Game Store</option>
            <option value="Home">Home</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Decks</label>
          {form.decks.map((deck, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                name="deck"
                value={deck}
                onChange={(e) => handleChange(e, idx)}
                className="w-full border rounded p-2"
                placeholder="Deck name or description"
              />
              {form.decks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDeck(idx)}
                  className="text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDeck} className="text-blue-500">
            + Add Deck
          </button>
        </div>
        <button
          type="submit"
          className="bg-[#6c47ff] text-white rounded-full font-medium px-6 py-2"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Save and Continue"}
        </button>
      </form>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto p-6">Loading...</div>}>
      <OnboardingForm />
    </Suspense>
  );
}