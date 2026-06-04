import Link from "next/link"
import { EventCardComponent } from "./EventCardComponent"

export const EventList = ({ title, data }) => {
    if (data.payload == null) {
        return
    }
    return (
        <div className="">
            <h2 className="font-bold text-4xl lg:text-[42px]">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                {data?.payload?.slice(0, 6)?.map((x, index) => {
                    const imageUrl = x?.poster;
                    const img =
                        imageUrl?.startsWith("http://") ||
                        imageUrl?.startsWith("https://") ||
                        imageUrl?.startsWith("/")
                            ? imageUrl
                            : "/images/festival.png";

                    return (
                        <EventCardComponent
                            key={x?.eventId ?? index}
                            img={img}
                            title={x?.eventName}
                            description={x?.description}
                            location={x?.address}
                            company={x?.orgName}
                            date={x?.startDate}
                            status={x?.isOpen ?? false}
                            id={x?.eventId}
                        />
                    )
                })}
            </div>
            <Link prefetch={true} href={`/events/${title}`}>
                <button className={`${data?.payload?.length >= 6 ? "block" : "hidden"} mx-auto mt-8 text-sm rounded-full bg-purple-text text-white px-6 py-3 border-1px border-purple-text`}>See more</button>
            </Link>
        </div>
    )
}