'use client';

import { useEffect, useState } from 'react';

export default function Art() {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [frames, setFrames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const TOTAL_FRAMES = 100;
    const FPS = 10;

    useEffect(() => {
        // Load all frames on mount
        const loadFrames = async () => {
            const framePromises = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
                const frameNum = i.toString().padStart(4, '0');
                return fetch(`/sway/frame_${frameNum}.txt`)
                    .then(res => res.text());
            });

            const loadedFrames = await Promise.all(framePromises);
            setFrames(loadedFrames);
            setLoading(false);
        };

        loadFrames();
    }, []);

    useEffect(() => {
        if (frames.length === 0) return;

        const interval = setInterval(() => {
            setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES);
        }, 1000 / FPS);

        return () => clearInterval(interval);
    }, [frames]);

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen">
                <div>Loading animation...</div>
            </main>
        );
    }

    return (
        <main className="flex items-center min-h-screen bg-black">
            <pre className="text-white text-[8px] leading-tight font-mono whitespace-pre">
                {frames[currentFrame]}
            </pre>
            <h1>
                Playing around with some Ascii animation art
            </h1>
        </main>
    );
}