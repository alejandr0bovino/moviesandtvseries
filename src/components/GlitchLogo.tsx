'use client';

import { useEffect } from 'react';
import { PowerGlitch } from 'powerglitch';
import MovieIcon from "@/icons/movie";

const GlitchLogo = () => {
  useEffect(() => {
    PowerGlitch.glitch('.cm-logo',
      {
        "timing": {
          "duration": 4000,
          "easing": "ease-in-out"
        },
      }
    );
  }, []);

  return (
    <div className="flex items-center cm-logo mr-6">
      <MovieIcon fill="#CCCCCC" width="40px" height="40px" />
      <div className="ml-[10] leading-[1.2] font-bold text-gray-200">Movies &<br /> TV Series</div>
    </div>
  );
};

export default GlitchLogo;