import Image from "next/image";
const featureCards = [
    {
        title: "Manage Event",
        description:
            "We are a team of passionate individuals dedicated to creating innovative solutions that empower our clients to achieve their goals. We are a team of passionate individuals dedicated to creating innovative solutions that empower our clients to achieve their goals.",
    },
    {
        title: "Manage Event",
        description:
            "We are a team of passionate individuals dedicated to creating innovative solutions that empower our clients to achieve their goals. We are a team of passionate individuals dedicated to creating innovative solutions that empower our clients to achieve their goals.",
    },
    {
        title: "Manage Event",
        description:
            "We are a team of passionate individuals dedicated to creating innovative solutions that empower our clients to achieve their goals. We are a team of passionate individuals dedicated to creating innovative solutions that empower our clients to achieve their goals.",
    },
    {
        title: "Manage Event",
        description:
            "We are a team of passionate individuals dedicated to creating innovative solutions that empower our clients to achieve their goals. We are a team of passionate individuals dedicated to creating innovative solutions that empower our clients to achieve their goals.",
    },
];

const ArrowDecor = ({ side }) => (
    <svg
        aria-hidden
        viewBox="0 0 180 120"
        className={`h-20 w-28 text-[#727272] md:h-28 md:w-40 ${side === "right" ? "rotate-180" : ""
            }`}
        fill="none"
    >
        <path
            d="M160 10C140 60 100 85 58 80C29 76 16 54 26 38C34 26 50 26 56 36C64 50 59 70 40 86C28 96 15 101 8 102"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
        />
        <path
            d="M20 95L8 102L22 109"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const AboutCardComponent = () => {
    return (
        <section className="relative mx-auto w-full max-w-[1280px] px-6 pb-24 pt-20 md:px-10">
            <div
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_30%,#000_20%,transparent_100%)]"
                aria-hidden
            />

            <div className="mx-auto max-w-3xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-[#344054] md:text-6xl">
                    About EventMaster
                </h1>
                <p className="mt-6 text-base font-medium leading-relaxed text-[#475467]">
                    Created by KPS students with expert mentors, our Event Management
                    System simplifies managing events like weddings, sports, and
                    conferences. Users can join events without an account, while admins
                    efficiently handle event creation, materials, and task delegation.
                </p>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 md:gap-16">
                <ArrowDecor side="left" />
                <h2 className="text-5xl font-bold tracking-tight text-[#344054]">
                    Our Feature
                </h2>
                <ArrowDecor side="right" />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                {featureCards.map((card, index) => (
                    <article
                        key={`${card.title}-${index}`}
                        className="rounded-3xl border border-[#E4E7EC] bg-white p-6 shadow-sm"
                    >
                        <span className="text-xl leading-none text-[#475467]">◈</span>
                        <h3 className="mt-4 text-3xl font-semibold text-[#344054]">
                            {card.title}
                        </h3>
                        <p className="mt-4 text-lg font-medium leading-relaxed text-[#475467]">
                            {card.description}
                        </p>
                    </article>
                ))}
            </div>
            <div className="flex justify-center mt-10">
                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                        <Image src="/images/nitaly.jpg" alt="team" width={200} height={200} className="rounded-full" />
                        <h2 className="text-2xl font-bold text-[#344054]">AI</h2>
                        <p className="text-lg font-medium leading-relaxed text-[#475467]">Developer</p>
                    </div>
                </div>
            </div>
        </section>
    );
};