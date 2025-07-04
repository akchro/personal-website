import Link from "next/link";
import Head from "next/head";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import ThreeBackground from "@/components/ThreeBackground";

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
                url: "/thumbnail_v2.jpg",
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
        images: ["/thumbnail_v2.jpg"],
    },
};


export default function Home() {
    return (

        <main className={"min-h-screen"}>
            <Head>
                <meta property="og:title" content="Andy Khau" />
                <meta property="og:description" content="Check my stuff out." />
                <meta property="og:image" content="https://andykhau.com/thumbnail_v2.jpg" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://andykhau.com/" />
            </Head>
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
                <div className={'flex gap-10 flex-wrap justify-center'}>
                    <ProjectCard title={'Eyesite'} image={'eyesite.jpg'} link={'https://eyesite.andykhau.com/'} />
                    <ProjectCard title={'Waddling Life'} image={'waddling.jpg'} link={'https://waddlinglife.com/'}/>
                    <ProjectCard title={"Google Sheets MCP"} image={'sheetsmcp.jpg'} link={'https://github.com/akchro/google-sheets-mcp'} />
                    <ProjectCard title={'Accountable'} image={'accountable.jpg'} link={'https://devpost.com/software/accountable-tnij3l'}/>
                </div>
            </div>
            <Footer/>
        </main>
    );
}
