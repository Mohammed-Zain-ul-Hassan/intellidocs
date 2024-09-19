import Image from 'next/image';
import AiIcon from '@/components/icons/Ai.svg';

const AIIcon = () => {
  return (
    <div className="absolute bottom-0 right-[3rem] z-[5] hidden lg:block">
      <Image
        src={AiIcon}
        alt="AI Icon"
        height={300}
        width={300}
        className="h-[10rem] lg:h-[15rem]"
      />
    </div>
  );
};

export default AIIcon;
