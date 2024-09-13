import Image from 'next/image';
import DocReadIcon from '@/components/icons/DocReadIcon.svg';

const BouncingIcon = () => {
  return (
    <div className="absolute top-[25%] right-0 animate-bounce hidden md:block">
        <Image
          src={DocReadIcon}
          alt="My Icon"
          height={200}
          width={200}
          className="h-[3rem] lg:h-[6rem]"
        />
      </div>
  );
};

export default BouncingIcon;
