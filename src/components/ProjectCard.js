import Image from 'next/image';
import Link from "next/link";

const ProjectCard = ({title, image, link}) => {
    return (
        <div className="relative rounded-t-xl overflow-hidden h-56 w-72 cursor-pointer transition-transform hover:scale-[1.02]">
            <Link href={link}>
                <Image
                    src={`/${image}`}
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg z-10">{title}</h3>
            </Link>
        </div>
    );
};

export default ProjectCard;