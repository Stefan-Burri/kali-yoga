"use client";

export default function AnimatedGradientBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -999, filter: "blur(80px)" }}>
      {/* Circle 1 - Light blue */}
      <div
        className="absolute animate-blob-1"
        style={{
          width: 480,
          height: 480,
          top: -60,
          left: -100,
          borderRadius: "20%",
          background: "rgb(160, 200, 240)",
          opacity: 0.85,
        }}
      />
      {/* Circle 2 - Warm beige */}
      <div
        className="absolute animate-blob-2"
        style={{
          width: 360,
          height: 360,
          top: 80,
          left: 100,
          borderRadius: "40%",
          background: "rgb(235, 215, 190)",
          opacity: 0.6,
        }}
      />
      {/* Circle 3 - Peach/salmon */}
      <div
        className="absolute animate-blob-3"
        style={{
          width: 480,
          height: 480,
          top: -40,
          left: 200,
          borderRadius: "100%",
          background: "rgb(240, 190, 155)",
          opacity: 0.65,
        }}
      />
      {/* Circle 4 - Lavender/pink */}
      <div
        className="absolute animate-blob-4"
        style={{
          width: 720,
          height: 720,
          top: -200,
          left: "50%",
          borderRadius: "100%",
          background: "rgb(220, 185, 235)",
          opacity: 0.75,
        }}
      />
      {/* Circle 5 - Purple */}
      <div
        className="absolute animate-blob-5"
        style={{
          width: 360,
          height: 360,
          top: -100,
          right: -100,
          borderRadius: "100%",
          background: "rgb(196, 140, 230)",
          opacity: 0.65,
        }}
      />
      {/* Circle 6 - Light blue */}
      <div
        className="absolute animate-blob-6"
        style={{
          width: 480,
          height: 480,
          top: -60,
          right: -200,
          borderRadius: "100%",
          background: "rgb(180, 210, 240)",
          opacity: 0.65,
        }}
      />
    </div>
  );
}
