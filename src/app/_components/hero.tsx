import React from "react";
import Image from "next/image";
import { ContainerScroll } from "./ui/container-scroll-animation";

/*************  ✨ Codeium Command 🌟  *************/
function Hero() {
    return (
        <section className="bg-gray-50 flex items-center flex-col">
            <div className="flex flex-col overflow-hidden">
                <ContainerScroll
                    titleComponent={
                        <>
                            <h1 className="text-4xl font-semibold text-black dark:text-white">
                                AI driven<br />
                                <span className="text-4xl md:text-[6rem] text-blue-800 font-bold mt-1 leading-none">
                                    Student Finance Advisor
                                </span>
                            </h1>
                        </>
                    }
                >
                    <Image
                        src={`/dashboard.png`}
                        alt="hero"
                        height={720}
                        width={1400}
                        className="mx-auto rounded-2xl object-cover h-full object-left-top"
                        draggable={false}
                    />
                </ContainerScroll>
            </div>
            <div className="flex flex-col items-center gap-4 py-20">
                <p className="text-center px-4 text-gray-700 dark:text-gray-300">
                    We are a non-profit organization that provides financial advice to students. We are
                    independent and unbiased. We generate revenue through affiliate marketing from
                    third-party companies.
                </p>
                <a
                    className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    href="https://www.kickstarter.com/projects/acebudgetai/ace-budget-ai-student-finance-advisor"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        className="dark:invert"
                        src="/kickstarter.svg"
                        alt="Kickstarter"
                        width={20}
                        height={20}
                    />
                    Support us on Kickstarter
                </a>
            </div>
        </section>
    );
}


export default Hero;