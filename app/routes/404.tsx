import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "@remix-run/react";

export default function NotFound() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(
            containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1 }
        )
        .fromTo(
            textRef.current,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }
        )
        .fromTo(
            imageRef.current,
            { scale: 0 },
            { scale: 1, duration: 1, ease: "elastic.out(1, 0.3)" }
        );

        // Create a flying animation for the astronaut image
        gsap.to(imageRef.current, {
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: "none",
            keyframes: [
                { x: 100, y: -100 },
                { x: 200, y: 0 },
                { x: 300, y: 100 },
                { x: 400, y: 0 },
                { x: 300, y: -100 },
                { x: 200, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 0 }
            ]
        });
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 ref={textRef} className="text-6xl font-bold mb-4">404</h1>
            <div className="">
                <img ref={imageRef} src="/public/404.png" alt="404 Not Found" className="w-1/2 h-auto mb-8" />
            </div>
            
            <p className="text-lg mb-8">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="text-blue-500 hover:underline">
                Go back to the homepage
            </Link>
        </div>
    );
}