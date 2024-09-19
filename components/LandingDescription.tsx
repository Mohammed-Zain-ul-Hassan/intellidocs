'use client'
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Description = () => {
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
      const elements = descriptionRef.current.querySelectorAll('li, button');

      elements.forEach((el, index) => {
        tl.fromTo(el, { x: -200, opacity: 0 }, { x: 10, opacity: 1 }, index * 0.3);
      });
    }
  }, []);

  return (
    <div ref={descriptionRef} className="flex flex-col items-start mt-24 mb-5 ml-10">
      <div className='flex justify-center items-center w-full'>
        <button className="mt-8 px-8 py-2 md:px-12 md:py-4 rounded-full tracking-widest uppercase font-bold dark:hover:text-neutral-200 hover:bg-transparent hover:shadow-[inset_0_0_0_2px_#616467] hover:animate-shimmer bg-[length:200%_100%] hover:bg-shimmer bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition duration-200 transform hover:scale-105 shadow-lg">
          Upload PDF
        </button>
      </div>
    </div>
  );
};

export default Description;
