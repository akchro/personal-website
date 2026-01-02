import AsciiAnimation from '@/components/AsciiAnimation';
import Link from "next/link";

export const metadata = {
    title: "Favorite stuff",
    description: "Collection of blogs, art inspiration",
};

export default function Favs() {
    return (
        <main className={'pl-10 pt-14'}>
            <h1 className={'text-5xl text-bold mb-2'}>Favorites</h1>
            <div className={'text-xl'}>Collection of some saved blog posts, websites, art inspiration, etc for personal use and sharing.</div>
            <div className={'mb-6'}>Inspired by <Link className={'underline'} href={"https://blog.fogus.me/2025/12/23/the-best-things-and-stuff-of-2025.html"}>this</Link></div>
            <hr className={'mb-6 w-1/3'}/>
            <div className={'pl-2 mb-5'}>
                <h2 className={'text-4xl mb-2'}>Blog Posts</h2>
                <ul className={'text-xl pl-5 mb-10 underline'}>
                    <Link href={"https://www.platinumgames.com/official-blog/article/9581"}>Happy Hacking: Music implementation in NieR:Automata – PlatinumGames</Link>
                </ul>
                <h2 className={'text-4xl mb-2'}>Fun Websites</h2>
                <ul className={'text-xl pl-5 mb-10 underline'}>
                    <Link href={"https://neal.fun/"}>infinite craft</Link><br/>
                    <Link href={"https://www.inkwells.io/"}>inkwells</Link><br/>
                    <Link href={"https://www.whatbeatsrock.com/"}>what beats rock</Link><br/>
                </ul>
                <h2 className={'text-4xl mb-2'}>Fav Artists</h2>
                <ul className={'text-xl pl-5 underline'}>
                    <Link href={"https://x.com/sotonami"}>Sui Ishida</Link><br/>
                    <Link href={"https://www.artstation.com/chenbo"}>Bo Chen</Link><br/>
                    <Link href={"https://www.instagram.com/inoitoh/"}>inoitoh</Link><br/>
                    <Link href={"https://www.instagram.com/delta.pml/"}>delta.pml</Link> <br/>
                </ul>
            </div>

        </main>
    );
}