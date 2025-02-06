import React from "react";
export function VideoSection() {
  return (
    <section id="video-section" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          See ParkEaze in Action
        </h2>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl">
          <iframe
            width="100%"
            height="600"
            src="https://www.youtube.com/embed/9IRqBsf7xvg?si=O7hqvIDMnrOxuXYI"
            title="ParkEaze Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}
