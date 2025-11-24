'use client';

import * as m from '@/paraglide/messages';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{m.contact_title()}</h1>
        <p className="text-gray-600">{m.contact_subtitle()}</p>
      </div>
    </div>
  );
}
