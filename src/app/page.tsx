import Image from "next/image";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className={"bg-black min-h-screen"}>
            <div className={"h-full flex justify-center items-center h-screen"}>
                <div className={'flex flex-col'}>
                    <h1 className={'text-5xl'}>Andy Khau</h1>
                    <div className={'flex justify-between'}>
                        <Link href={'https://github.com/akchro'}>Github</Link>
                        <Link href={'#projects'} scroll={true} >Projects</Link>
                        <Link href={'/resume.pdf'}>Resume</Link>
                    </div>
                </div>
            </div>
            <div className={'mx-20 mb-10 h-screen'} id={'projects'}>
                <h2 className={'text-4xl text-center mb-20'}>Projects</h2>
                <div className={'flex gap-10 '}>
                    <ProjectCard title={'Waddling Life'} image={'waddling.jpg'} link={'https://waddlinglife.com/'}/>
                    <ProjectCard title={"Google Sheets MCP"} image={'sheetsmcp.jpg'} link={'https://github.com/akchro/google-sheets-mcp'} />
                </div>
            </div>
            <Footer/>
        </main>
    );
}
