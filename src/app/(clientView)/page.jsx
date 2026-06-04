import Image from "next/image";
import { CategoryCardListComponent } from "./_components/CategoryCardListComponent";
import { CTAComponent } from "./_components/CTAComponent";
import { SearchBar } from "./_components/SearchBar";
import {
  getAllCategory,
  getEventByCateName,
  getPopularEvent,
} from "@/services/clientPage/landingService";
import { Suspense } from "react";
import { EventList } from "./_components/EventList";
import { ListOfSkeleton } from "./_components/ListOfSkeleton";

const heroImages = [
  { src: "/images/campfire.png", alt: "Festival event", tall: true },
  { src: "/images/presentation.png", alt: "Conference event", tall: false },
  { src: "/images/festival.png", alt: "Social gathering", tall: false, short: true },
  { src: "/images/skiing.png", alt: "Skiing event", tall: false },
  { src: "/images/racecar.png", alt: "Racing event", tall: true },
];

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const popularData = await getPopularEvent();
  const allCategory = await getAllCategory();
  const isSearching = Boolean(params?.search);

  return (
    <div className="container">
      <section className="bg-pattern bg-cover md:bg-contain relative lg:-top-16 2xl:top-0">
        <div className="text-center space-y-8 mt-16 lg:mt-0 lg:relative lg:top-24">
          <div className="space-y-8 mb-8">
            <h1 className="!leading-snug font-bold text-5xl md:text-6xl lg:text-[64px] w-full lg:w-3/4 2xl:w-1/2 mx-auto">
              Bringing everyone <br className="hidden lg:block" />
              all together
            </h1>
            <p className="text-sm md:text-base w-full md:w-3/4 lg:w-1/3 xl:w-1/3 mx-auto font-medium">
              Unite, Celebrate, Create: Bringing Everyone Together for
              Unforgettable Events, Perfectly Realized with Seamless Planning
              and Exquisite Execution.
            </p>
          </div>
          <a href="#content">
            <button
              type="button"
              className="bg-purple-text text-white px-10 py-3 rounded-full text-base lg:text-lg font-semibold relative"
            >
              Let&apos;s Explore
            </button>
          </a>
        </div>
        <div className="hidden lg:grid grid-cols-5 gap-6 px-2">
          {heroImages.map((img) => (
            <div
              key={img.src}
              className={`flex ${img.tall ? "items-start" : "items-end"}`}
            >
              <Image
                height={450}
                width={280}
                src={img.src}
                className={`rounded-3xl object-cover w-full ${
                  img.tall
                    ? "relative -top-32 h-[450px]"
                    : img.short
                      ? "h-[255px]"
                      : "h-[350px]"
                }`}
                alt={img.alt}
              />
            </div>
          ))}
        </div>
        <div className="hidden lg:block bg-gradient-to-t from-white to-transparent h-[200px] w-full absolute bottom-0 left-0" />
      </section>

      <section className="space-y-12 py-32">
        <div className="text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-semibold w-full sm:w-2/3 lg:w-1/2 mx-auto">
            Popular events you may like also.
          </h2>
          <p className="text-sm md:text-base font-medium">
            explore new thing by gathering with people.
          </p>
        </div>
        <Suspense>
          <CategoryCardListComponent data={popularData} />
        </Suspense>
      </section>

      <section className="mb-16">
        <Suspense>
          <SearchBar />
        </Suspense>
      </section>

      <section
        id="content"
        className={`space-y-16 ${isSearching ? "hidden" : "block"}`}
      >
        {await Promise.all(
          allCategory.payload.map(async (categoryName, index) => {
            const data = await getEventByCateName(categoryName);
            return (
              <Suspense key={categoryName} fallback={<ListOfSkeleton />}>
                <EventList title={categoryName} data={data} />
              </Suspense>
            );
          }),
        )}
      </section>

      <section>
        <CTAComponent />
      </section>
    </div>
  );
}
