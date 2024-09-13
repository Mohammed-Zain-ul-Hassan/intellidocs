import { TypewriterEffectSmooth } from "./ui/Typewriter";

const Headline = () => {
  const words = [
    {
      text: "Upload,",
    },
    {
      text: "Ask,",
    },
    {
      text: "and",
    },
    {
      text: "Explore",
    },
    {
      text: "with",
    },
    {
      text: "AI-Powered",
      className: "text-blue-700 dark:text-blue-700",
    },
    {
      text: "Document",
    },
    {
      text: "Insights",
    },
  ];
  
  const words2 = [
    {
      text: "Transform",
    },
    {
      text: "Your",
    },
    {
      text: "PDFs",
      className: "text-blue-700 dark:text-blue-700",
    },
    {
      text: "into",
    },
    {
      text: "Knowledge",
    },
  ];

  return (
    <div className="absolute flex justify-center flex-col z-0 left-[6%] top-[25%]">
      <div className="mx-[2rem] px-[2rem] text-center text-white p-2 flex justify-center">
        <div className="text-[2rem] font-bold md:text-[4rem]">
          <span className="text-shadow-lg font-mono">Talk to your</span>
          <span className="text-blue-900 font-mono tracking-tighter text-shadow-lg"> PDF-Docs</span>
          <span className="font-mono font-thin text-shadow-lg hidden sm:inline"> with AI</span>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col space-y-4 my-10">
        {/* First typewriter effect */}
        <TypewriterEffectSmooth words={words} cursorClassName="cursor-class" />

        {/* Second typewriter effect with a longer delay */}
        <TypewriterEffectSmooth
          words={words2}
          className="mt-4"
          cursorClassName="cursor-class"
          delay={3} // Adjust this delay to control when the second effect starts
        />
        <div className='flex justify-center items-center w-full'>
        <button className="mt-8 px-12 py-4  rounded-full tracking-widest uppercase font-bold dark:hover:text-neutral-200 hover:bg-transparent hover:shadow-[inset_0_0_0_2px_#616467] hover:animate-shimmer bg-[length:200%_100%] hover:bg-shimmer bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition duration-200 transform hover:scale-105 shadow-lg">
          Upload PDF
        </button>

      </div>
      </div>
    </div>
  );
};

export default Headline;
