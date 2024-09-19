import { BackgroundBeams } from "@/components/ui/BeamBackground";
import Headline from "@/components/Headline";
import Navbar from "@/components/Navbar";
import AIIcon from "@/components/AiImg";

export default function Home() {
  return (
    <div className="relative h-screen w-full p-2 bg-gradient-to-b from-blue-700 to-transparent overflow-x-hidden">
      <Navbar />
      <BackgroundBeams />
      <Headline />
      <AIIcon />
    </div>
  );
}
