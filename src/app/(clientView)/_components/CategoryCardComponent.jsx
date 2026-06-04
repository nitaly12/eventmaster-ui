import Image from "next/image"
import Link from "next/link"

export const CategoryCardComponent = ({ img, title, content, eventId }) => {
    return (
        <div className="w-full h-[350px] bg-slate-200 object-cover rounded-3xl">
            <Image className="bg-contain object-cover rounded-3xl w-full h-full brightness-75" src={img} height={525} width={450} alt="categoryListImage" />
            <h2 className="absolute top-0 p-6 text-2xl lg:text-2xl font-bold text-white">{title}</h2>
            <div className="absolute bottom-0 p-6 space-y-4">
                <p className="text-white text-sm lg:text-base mb-3 line-clamp-3">{content}</p>
                <Link href={`/detail/${eventId}`}>
                    <button className="px-6 py-2 rounded-full bg-white font-semibold text-base text-primary-text">See Detailis</button>
                </Link>
            </div>
        </div>
    );
}