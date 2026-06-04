import Link from "next/link"
// import googleIcon from "../../../../public/icons/google.png"
// import facebookIcon from "../../../../public/icons/facebook.png"
import Image from "next/image"

export const FooterComponent = () => {
    return (
        <footer className="space-y-6 px-10 pt-28 pb-16 container">
            <h2 className="font-extrabold text-2xl lg:text-3xl">EventMaster</h2>
            <p className="font-medium w-full lg:w-1/3 text-sm md:text-base">EventMaster is a comprehensive, user-friendly event management system that streamlines every aspect of event planning and execution.</p>
            <div className="flex gap-4 font-medium md:gap-10 text-sm md:text-base">
                <Link href={'/'}>Home</Link>
                <Link href={'/about'}>About</Link>
            </div>
            <hr />
            <div className="flex justify-between">
                <p className="font-medium text-sm md:text-base">@Copyright 2024 EventMaster</p>
                <div className="flex gap-4">
                    <a href="https://www.facebook.com/ksignhrd" target="_blank">
                        {/* <Image
                            src={facebookIcon}
                            className="p-1 rounded-full border-1px border-greyUi"
                            width={32}
                            height={32}
                            alt="facebook-icon"
                        /> */}
                    </a>
                    <a href="https://maps.app.goo.gl/pSM8FKj1BayJ7uph7" target="_blank">
                        {/* <Image
                            src={googleIcon}
                            className="p-1 rounded-full border-1px border-greyUi"
                            width={32}
                            height={32}
                            alt="google-icon"
                        /> */}
                    </a>
                </div>
            </div>
        </footer>
    )
}