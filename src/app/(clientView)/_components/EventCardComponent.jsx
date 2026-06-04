import Image from "next/image"
import Link from "next/link"
import image from "../../../../public/images/image_237-removebg 1.png"

const FALLBACK_POSTER = "/images/festival.png";

export const EventCardComponent = ({ img, title, location, description, company, date, id, status }) => {
    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "TBD";

    const imageSrc =
        img?.startsWith("http://") ||
        img?.startsWith("https://") ||
        img?.startsWith("/")
            ? img
            : FALLBACK_POSTER;

    const isRemote =
        imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

    return (
        <div className="shadow-md rounded-3xl">
            <div className="relative">
                <div className="relative h-[300px] w-full overflow-hidden rounded-t-3xl">
                    <Image
                        src={imageSrc}
                        fill
                        className="object-cover"
                        alt={title || "Event image"}
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        unoptimized={isRemote}
                    />
                </div>
                <div className="absolute top-0 right-0 p-6 ">
                    <span
                        className={`rounded-full bg-white px-4 py-2 text-sm font-semibold ${
                            status ? "text-[#7939EF]" : "text-red-600"
                        }`}
                    >
                        {status ? "Open" : "Close"}
                    </span>
                </div>
            </div>
            <div className="bg-white px-6 py-8 rounded-b-3xl flex flex-col justify-between h-[305.72px]">
                <div className="space-y-4">
                    <div className="flex gap-3 items-center">
                        <Image src={image} height={40} width={40} alt="orgImage" />
                        <p className="text-sm font-medium">{company || "EventMaster"}</p>
                    </div>
                    <div className="flex text-sm justify-between font-medium">
                        <p className="max-w-64 line-clamp-1">{location || "Location TBD"}</p>
                        <p>{formattedDate}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h2 className="text-lg lg:text-xl font-bold max-w-64 line-clamp-1">{title}</h2>
                        <p className="text-sm lg:text-base line-clamp-2 font-medium">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <Link href={`/detail/${id}`} className="text-sm border-1px font-semibold rounded-full border-purple-text text-purple-text px-6 py-3">View Detail</Link>
                    <div>
                        {!status ? (
                            <p className="text-red-600 text-sm">Attendee full</p>
                        ) : (
                            <Link href={`/register/${id}`} className="text-sm rounded-full font-semibold bg-purple-text text-white px-6 py-3 border-1px border-purple-text">Join Event</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}