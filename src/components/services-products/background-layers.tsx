/**
 * Background Layers Component
 *
 * Renders the dark cyberpunk-style background layers:
 * 1. Noise texture overlay
 * 2. Tech grid pattern with radial fade
 * 3. Ambient emerald glow from top-center
 */

export function BackgroundLayers() {
  return (
    <>
      {/* Noise Texture Overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-10 bg-[url('/images/noise.svg')] bg-repeat will-change-opacity"
      />

      {/* Tech Grid Pattern */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          maskImage: "radial-gradient(circle at 50% 0%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, black 40%, transparent 85%)",
        }}
      />

      {/* Ambient Emerald Glow */}
      <div
        className="fixed left-1/2 -translate-x-1/2 w-full h-[80vh] pointer-events-none"
        style={{
          top: "-20%",
          zIndex: 0,
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
    </>
  );
}
