// export default function Index() {
//     return (
//         <div>
//             <div className={"animate-fadeOut"}>
//                 <div
//                     className="flex justify-center items-center h-screen text-[5em] font-mono w-full whitespace-nowrap overflow-hidden animate-typing">
//                     Welcome to
//                     <img src={"logo_UniNet_text.png"} alt="uninet"></img>
//                 </div>
//             </div>
//             <h1>
//
//             </h1>
//         </div>
//     )
// }
//
// import React, { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import HelloText from '~/components/hello';
//
// const App: React.FC = () => {
//     const helloRef = useRef<HTMLDivElement | null>(null); // Ref for the HelloText container
//     const welcomeRef = useRef<HTMLDivElement | null>(null); // Ref for the Welcome text container
//
//     useEffect(() => {
//         const helloElement = helloRef.current;
//         const welcomeElement = welcomeRef.current;
//
//         if (!helloElement || !welcomeElement) return;
//
//         // Hide the welcome element initially
//         gsap.set(welcomeElement, { opacity: 0, display: 'none' });
//
//         // Create a timeline for sequential animations
//         const timeline = gsap.timeline();
//
//         // Fade out HelloText and then fade in Welcome text
//         timeline.to(helloElement, { opacity: 0, duration: 1, delay: 2 })
//             .to(helloElement, { display: 'none' }) // Hide the hello element after fade out
//             .set(welcomeElement, { display: 'flex' }) // Show the welcome element
//             .to(welcomeElement, { opacity: 1, duration: 1 }); // Fade in the welcome element
//     }, []);
//
//     return (
//         <div style={{
//             backgroundColor: 'white',
//             height: '100vh',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             flexDirection: 'column' // Stack items vertically
//         }}>
//             <div ref={helloRef}>
//                 <HelloText />
//             </div>
//
//             <div ref={welcomeRef} className="flex justify-center items-center h-screen text-[5em] font-mono w-full whitespace-nowrap overflow-hidden">
//                 Welcome to
//                 <img src={"logo_UniNet_text.png"} alt="uninet" />
//             </div>
//         </div>
//     );
// };
//
// export default App;
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import HelloText from '~/components/hello';
import "app/grad_bg.css";
import NotFound from "./404";


const App: React.FC = () => {
    const helloRef = useRef<HTMLDivElement | null>(null); // Ref for the HelloText container
    const welcomeRef = useRef<HTMLDivElement | null>(null); // Ref for the Welcome text container
    const navigate = useNavigate(); // Use navigate for redirecting

    useEffect(() => {
        const helloElement = helloRef.current;
        const welcomeElement = welcomeRef.current;

        if (!helloElement || !welcomeElement) return;

        // Hide the welcome element initially
        gsap.set(welcomeElement, { opacity: 0, display: 'none' });

        // Create a timeline for sequential animations
        const timeline = gsap.timeline();

        // Fade out HelloText and then fade in Welcome text
        timeline
            .to(helloElement, { opacity: 0, duration: 1, delay: 1 }) // Fade out HelloText
            .to(helloElement, { display: 'none' }) // Hide the hello element after fade out
            .set(welcomeElement, { display: 'flex' }) // Show the welcome element
            .to(welcomeElement, { opacity: 1, duration: 1, delay: 0.5 }) // Fade in the welcome element
            .to(welcomeElement, { opacity: 0, duration: 1, delay: 0.5, onComplete: () => {
                    // Redirect to sign-in after the welcome animation completes
                    navigate('/sign-in');
                }}); // Fade out the welcome element before redirecting

        // Cleanup function
        return () => {
            // No need to remove event listeners since we're using gsap callbacks
        };
    }, [navigate]); // Add navigate to dependency array

    return (
        <div className="bg-gradient-animation" style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column' // Stack items vertically
        }}>
            <div ref={helloRef}>
                <HelloText />
            </div>

            <div ref={welcomeRef} className="flex justify-center items-center h-screen  font-mono w-full whitespace-nowrap overflow-hidden" style = {{fontFamily:'cursive',fontSize: '4rem'}}>
                Welcome to UniNet!
            </div>
        </div>
    );
};

export const CatchBoundary = () => {
    return <NotFound />;
};

export default App;