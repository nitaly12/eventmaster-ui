import LoginComponent from "../_components/LoginComponent";

export default function LoginPage() {
  return <LoginComponent />;
}
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { ArrowLeft, Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

// //   const handleLoginSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     console.log("Login credentials submitted:", { email, password });
// //   };

//   return (
//     <div className="relative min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between overflow-x-hidden font-sans">
      
//       {/* ================= PURPLE BACKDROP WAVE ENGINE ================= */}
//       <div className="absolute top-0 inset-x-0 h-[45vh] md:h-[55vh] bg-[#7939EF] -z-10 overflow-hidden rounded-b-[40px] md:rounded-b-[80px] shadow-sm">
//         {/* Your mathematical television static pattern injected cleanly into the background layer */}
//         <div 
//           className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-[0.25]"
//           style={{
//             background: `
//               repeating-radial-gradient(#000 0px, #000 1px, #fff 1px, #fff 2px) 0 0 / 8px 8px,
//               repeating-conic-gradient(#000 0% 0.0003%, #fff 0% 0.0006%) 50% 50% / 1500px 1500px
//             `,
//             backgroundBlendMode: "difference",
//             animation: "ctaHeavyNoise 0.15s infinite linear",
//           }}
//         />

//         {/* Floating background graphic decoration matching the transparent star motif in your image asset */}
//         <div className="absolute right-[5%] top-[15%] text-white/10 select-none hidden md:block">
//           <svg className="w-64 h-64 fill-current rotate-12" viewBox="0 0 24 24">
//             <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/>
//           </svg>
//         </div>
//       </div>

//       {/* ================= TOP NAVIGATION CONTROLLER ================= */}
//       <header className="w-full max-w-7xl mx-auto px-6 pt-6 relative z-10">
//         <Link 
//           href="/" 
//           className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back</span>
//         </Link>
//       </header>

//       {/* ================= MAIN SPLIT CONTENT GRID ================= */}
//       <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col md:grid md:grid-cols-12 items-center gap-12 pt-4 pb-16 relative z-20">
        
//         {/* LEFT COLUMN: THE LOGIN CARD CONTAINER */}
//         <div className="w-full sm:max-w-md mx-auto md:max-w-none md:col-span-5 lg:col-span-5 order-2 md:order-1">
//           <div className="w-full bg-white rounded-[28px] p-8 md:p-10 shadow-xl border border-zinc-100/50">
            
//             {/* Header Identity */}
//             <div className="text-center md:text-left space-y-2 mb-8">
//               <h1 className="text-3xl md:text-4xl font-bold text-[#1D2939] tracking-tight">
//                 Login
//               </h1>
//               <p className="text-zinc-400 text-sm font-medium">
//                 Welcome back! Please enter your information.
//               </p>
//             </div>

//             {/* Input Action Form */}
//             <form className="space-y-5">
              
//               {/* Email Input Field */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-[#344054] tracking-wide flex items-center">
//                   Email<span className="text-red-500 ml-0.5">*</span>
//                 </label>
//                 <input 
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   className="w-full h-11 px-4 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7939EF]/20 focus:border-[#7939EF] text-zinc-800 font-medium transition-all placeholder:text-zinc-300"
//                 />
//               </div>

//               {/* Password Input Field */}
//               <div className="space-y-1.5 relative">
//                 <label className="text-xs font-semibold text-[#344054] tracking-wide flex items-center">
//                   Password<span className="text-red-500 ml-0.5">*</span>
//                 </label>
//                 <div className="relative">
//                   <input 
//                     type={showPassword ? "text" : "password"}
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     className="w-full h-11 pl-4 pr-11 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7939EF]/20 focus:border-[#7939EF] text-zinc-800 font-medium transition-all placeholder:text-zinc-300"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>

//                 {/* Forgot Password Link */}
//                 <div className="w-full flex justify-end pt-1">
//                   <Link 
//                     href="/forgot-password" 
//                     className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//               </div>

//               {/* Main Submit Button */}
//               <Button 
//                 type="submit"
//                 className="w-full h-11 bg-[#7939EF] hover:bg-[#652cd3] text-white font-semibold rounded-full text-sm shadow-md shadow-purple-200 transition-all cursor-pointer active:scale-[0.98] border-0 mt-2"
//               >
//                 Login
//               </Button>

//               {/* Redirection Link */}
//               <div className="text-center pt-3 text-xs font-semibold text-zinc-500">
//                 <span>Don't have an account? </span>
//                 <Link 
//                   href="/register" 
//                   className="text-[#7939EF] hover:text-[#652cd3] ml-0.5 font-bold transition-colors"
//                 >
//                   Sign up
//                 </Link>
//               </div>

//             </form>
//           </div>
//         </div>

//         {/* RIGHT COLUMN: BRAND VALUE PROPOSITION GRAPHIC HERO */}
//         <div className="w-full md:col-span-7 lg:col-span-7 flex flex-col items-center md:items-start text-center md:text-left text-white order-1 md:order-2 md:pl-8 lg:pl-12">
          
//           <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 leading-tight text-white drop-shadow-sm">
//             Welcome !
//           </h2>
          
//           <p className="text-purple-100/90 text-sm md:text-base font-medium max-w-sm md:max-w-md leading-relaxed mb-8 md:mb-10">
//             Log in to manage your events with ease and efficiency.
//           </p>

//           {/* Clean Flat-Illustration Mock Workspace vector placement */}
//           <div className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-full aspect-[4/3] pointer-events-none drop-shadow-xl select-none flex justify-center items-center">
//             {/* You can swap this custom inline placeholder svg graphic with your clean vector asset 
//               whenever your public folder image is ready!
//             */}
//             <svg viewBox="0 0 500 400" className="w-full h-full text-white" fill="none">
//               <rect x="60" y="80" width="280" height="220" rx="20" fill="#2E2E3A" transform="rotate(-5 200 190)" opacity="0.95" />
//               <rect x="75" y="95" width="250" height="150" rx="8" fill="#F4F5F7" transform="rotate(-5 200 190)" />
//               <circle cx="130" cy="330" r="45" fill="#C3B4FD" opacity="0.3" />
//               <rect x="290" y="270" width="100" height="14" rx="7" fill="#7939EF" transform="rotate(25 340 277)" />
//               <path d="M 360 160 L 410 280 L 380 320 Z" fill="#E4E7EC" opacity="0.5"/>
//               <circle cx="380" cy="180" r="22" fill="#E4E7EC" />
//               <rect x="90" y="115" width="100" height="25" rx="4" fill="#7939EF" transform="rotate(-5 200 190)"/>
//               <rect x="95" y="155" width="120" height="8" rx="4" fill="#D0D5DD" transform="rotate(-5 200 190)"/>
//               <rect x="95" y="175" width="160" height="8" rx="4" fill="#E4E7EC" transform="rotate(-5 200 190)"/>
//               <rect x="95" y="195" width="80" height="8" rx="4" fill="#E4E7EC" transform="rotate(-5 200 190)"/>
//             </svg>
//           </div>

//         </div>

//       </main>

//       {/* Empty responsive layout anchor space wrapper */}
//       <footer className="w-full py-4" />
//     </div>
//   );
// }