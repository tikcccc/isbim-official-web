'use client';

import * as m from '@/paraglide/messages';

export default function jarvis_ai_suitePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{m.jarvis_suite_title()}</h1>
        <p className="text-lg text-gray-700 mb-2">{m.jarvis_suite_subtitle()}</p>
        <p className="text-gray-600">{m.jarvis_suite_under_construction()}</p>
      </div>
    </div>
  );
}
