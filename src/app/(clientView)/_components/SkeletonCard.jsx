export const SkeletonCard = () => {
    return (
        <>
            <div className="shadow-md rounded-3xl">
                <div className="relative">
                    <div className="relative h-[300px] bg-gray-300 animate-pulse w-full object-cover rounded-t-3xl">
                        {/* <Image
                            src={"/"}
                            className={'rounded-t-3xl'}
                        /> */}
                    </div>
                    {/* <Image src={img} width={500} height={300} className="rounded-t-3xl h-[300px] w-full object-cover" alt="racingImage" /> */}
                    <div className="absolute top-0 right-0 p-6 ">
                        <div className={`bg-white animate-pulse text-sm rounded-full py-2 px-4 font-semibold`}>
                            <p className="invisible">Close</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-6 py-8 rounded-b-3xl flex flex-col justify-between h-[305.72px]">
                    <div className="space-y-4">
                        <div className="flex gap-3 items-center">
                            {/* <Image src={"/"} height={40} width={40} alt="orgImage" /> */}
                            <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-full"></div>
                            <p className="text-sm font-medium w-1/6 h-3 bg-gray-300 animate-pulse"></p>
                        </div>
                        <div className="flex text-sm justify-between font-medium">
                            <p className="bg-gray-300 w-1/6 animate-pulse h-3"></p>
                            <p className="bg-gray-300 w-1/6 animate-pulse h-3"></p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h2 className="text-lg lg:text-xl font-bold h-4 bg-gray-300 animate-pulse w-2/5"></h2>
                            <p className="text-sm lg:text-base bg-gray-300 animate-pulse line-clamp-2 font-medium h-3"></p>
                            <p className="text-sm lg:text-base bg-gray-300 animate-pulse line-clamp-2 font-medium h-3"></p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="bg-gray-300 animate-pulse rounded-full px-6 py-3">
                            <p className="invisible">View Detail</p>
                        </div>
                        <div className="bg-gray-300 animate-pulse rounded-full px-6 py-3">
                            <p className="invisible">View Detail</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}