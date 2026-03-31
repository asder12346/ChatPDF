"use client";
import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";

const FILE_ICONS = [
  { label: "Word", url: "https://img.icons8.com/color/96/microsoft-word-2019--v2.png" },
  { label: "PDF", url: "https://img.icons8.com/color/96/pdf.png" },
  { label: "PowerPoint", url: "https://img.icons8.com/color/96/microsoft-powerpoint-2019--v1.png" },
  { label: "Excel", url: "https://img.icons8.com/color/96/microsoft-excel-2019--v1.png" },
  { label: "HTML", url: "https://img.icons8.com/color/96/html-5--v1.png" },
  { label: "TXT", url: "https://img.icons8.com/color/96/txt.png" },
];

function SemiCircleOrbit({ radius, centerX, centerY, count, iconSize }: any) {
  return (
    <>
      {/* Semi-circle glow background */}
      <div className="absolute inset-0 flex justify-center">
        <div
          className="
            w-[1000px] h-[1000px] rounded-full 
            bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]
            blur-3xl 
            -mt-40 
            pointer-events-none
          "
          style={{ zIndex: 0 }}
        />
      </div>

      {/* Orbit icons */}
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / (count - 1)) * 180;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);
        
        // Use a deterministic pseudo-random index based on radius and index to mix up icons
        const iconIndex = Math.floor((radius + index * 13) % FILE_ICONS.length);
        const iconData = FILE_ICONS[iconIndex];
        const label = iconData.label;

        // Tooltip positioning — above or below based on angle
        const tooltipAbove = angle > 90;

        return (
          <div
            key={index}
            className="absolute flex flex-col items-center group"
            style={{
              left: `${centerX + x - iconSize / 2}px`,
              top: `${centerY - y - iconSize / 2}px`,
              zIndex: 5,
            }}
          >
            <div 
              className={`flex items-center justify-center bg-white shadow-lg rounded-full border border-slate-100 cursor-pointer transition-transform hover:scale-110 hover:shadow-xl`}
              style={{ width: iconSize, height: iconSize }}
            >
                <img src={iconData.url} alt={label} className="w-3/5 h-3/5 object-contain" referrerPolicy="no-referrer" />
            </div>

            {/* Tooltip */}
            <div
              className={`absolute ${
                tooltipAbove ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
              } hidden group-hover:block w-auto whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg text-center z-50`}
            >
              {label}
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-900 ${
                  tooltipAbove ? "top-[calc(100%-4px)]" : "bottom-[calc(100%-4px)]"
                }`}
              ></div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function MultiOrbitSemiCircle() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const baseWidth = Math.min(size.width * 0.8, 700);
  const centerX = baseWidth / 2;
  const centerY = baseWidth * 0.5;

  const iconSize =
    size.width < 480
      ? Math.max(32, baseWidth * 0.08)
      : size.width < 768
      ? Math.max(40, baseWidth * 0.09)
      : Math.max(48, baseWidth * 0.1);

  return (
    <section className="py-24 relative w-full overflow-hidden bg-white border-b border-slate-200">
      <div className="relative flex flex-col items-center text-center z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Supported Formats</h2>
        <p className="mb-16 max-w-2xl text-slate-600 text-xl">
          Chat with your PDFs, Word documents, text files, and more. We support a wide range of formats to help you learn from any source.
        </p>

        <div
          className="relative"
          style={{ width: baseWidth, height: baseWidth * 0.6 }}
        >
          {/* Orbit rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] rounded-full border border-slate-200/50" style={{ width: baseWidth * 0.44, height: baseWidth * 0.44 }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] rounded-full border border-slate-200/50" style={{ width: baseWidth * 0.72, height: baseWidth * 0.72 }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] rounded-full border border-slate-200/50" style={{ width: baseWidth, height: baseWidth }} />
          
          <SemiCircleOrbit radius={baseWidth * 0.22} centerX={centerX} centerY={centerY} count={4} iconSize={iconSize} />
          <SemiCircleOrbit radius={baseWidth * 0.36} centerX={centerX} centerY={centerY} count={6} iconSize={iconSize} />
          <SemiCircleOrbit radius={baseWidth * 0.5} centerX={centerX} centerY={centerY} count={8} iconSize={iconSize} />
          
          {/* Center logo */}
          <div 
            className="absolute flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl rounded-full border-4 border-white z-10"
            style={{
              left: `${centerX - iconSize * 0.75}px`,
              top: `${centerY - iconSize * 0.75}px`,
              width: iconSize * 1.5,
              height: iconSize * 1.5,
            }}
          >
            <FileText className="w-1/2 h-1/2 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
