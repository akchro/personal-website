import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import ThreeBackground from "@/components/ThreeBackground";

// app/layout.tsx or app/page.tsx (in TypeScript)

export const metadata = {
    title: "Andy Khau",
    description: "Check my stuff out.",
    openGraph: {
        type: "website",
        url: "https://andykhau.com/",
        title: "Andy Khau",
        description: "Check my stuff out.",
        images: [
            {
                url: "/thumbnail.jpg",
                width: 1200,
                height: 630,
                alt: "Andy Khau",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Andy Khau",
        description: "Check my stuff out.",
        images: ["/thumbnail.jpg"],
    },
};


export default function Home() {
    return (
        <main className={"min-h-screen"}>
            <ThreeBackground />
            <div className={"h-full flex justify-center items-center h-screen"}>
                <div className={'flex flex-col'}>
                    <h1 className={'text-5xl'}>Andy Khau</h1>
                    <div className={'flex justify-between text-gray-50'}>
                        <Link href={'https://github.com/akchro'} className={'hover:underline'}>Github</Link>
                        <Link href={'#projects'} scroll={true} className={'hover:underline'} >Projects</Link>
                        <Link href={'/resume.pdf'} className={'hover:underline'}>Resume</Link>
                        <Link href={'https://blog.andykhau.com'} className={'hover:underline'}>Blog</Link>
                    </div>
                </div>
            </div>
            <div className={'mx-20 mb-10 min-h-screen'} id={'projects'}>
                <h2 className={'text-4xl text-center mb-20'}>Projects</h2>
                <div className={'flex gap-10 flex-wrap'}>
                    <ProjectCard title={'Waddling Life'} image={'waddling.jpg'} link={'https://waddlinglife.com/'}/>
                    <ProjectCard title={"Google Sheets MCP"} image={'sheetsmcp.jpg'} link={'https://github.com/akchro/google-sheets-mcp'} />
                    <ProjectCard title={'Eyesite'} image={'eyesite.jpg'} link={'https://eyesite.andykhau.com'} />
                </div>
            </div>
            <Footer/>
        </main>
    );
}
