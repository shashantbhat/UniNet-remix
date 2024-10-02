// app/components/HelloText.tsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HelloText: React.FC = () => {
    const textRef = useRef<HTMLSpanElement | null>(null); // Ref for the text element

    useEffect(() => {
        const text = textRef.current;

        if (text) {
            // Split text into individual characters for animation
            const chars = text.textContent?.split('');
            text.textContent = ''; // Clear the original text

            // Create a span for each character
            chars?.forEach((char) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char; // Preserve spaces
                span.style.display = 'inline-block'; // Inline block to position characters
                span.style.opacity = '0'; // Start with invisible characters
                text.appendChild(span);
            });

            // Animate the characters
            gsap.fromTo(
                text.children,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1, // Stagger animation for each character
                }
            );
        }
    }, []);

    return (
        <div style={{ textAlign: 'center', fontFamily:'cursive' , fontSize: '4rem', color: '#000' }}>
            <span ref={textRef}>Hello!</span>
        </div>
    );
};

export default HelloText;
//
// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
//
// const HelloText: React.FC = () => {
//     const mountRef = useRef<HTMLDivElement | null>(null); // Typed ref for the mounting element
//     const animationFrameRef = useRef<number | null>(null); // Ref to store the animation frame ID
//     const textMeshRef = useRef<THREE.Mesh | null>(null); // Ref to store the text mesh
//     const typingSpeed = 200; // Speed of typing (in milliseconds per character)
//
//     useEffect(() => {
//         const mount = mountRef.current;
//
//         if (!mount) return; // Ensure the ref is not null
//
//         // Create Scene
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0xffffff); // Set background color to white
//
//         // Set Camera
//         const camera = new THREE.PerspectiveCamera(
//             75,
//             window.innerWidth / window.innerHeight,
//             0.1,
//             1000
//         );
//         camera.position.z = 5;
//
//         // Create Renderer
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         mount.appendChild(renderer.domElement);
//
//         // Create Font Loader
//         const loader = new FontLoader();
//         loader.load(
//             'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
//             (font) => {
//                 const text = "hello"; // The text to write
//                 const textGeometry = new TextGeometry('', {
//                     font: font,
//                     size: 1,
//                     height: 0.2,
//                     curveSegments: 12,
//                     bevelEnabled: true,
//                     bevelThickness: 0.1,
//                     bevelSize: 0.05,
//                     bevelSegments: 5,
//                 });
//
//                 // Text Material
//                 const material = new THREE.MeshNormalMaterial();
//                 const textMesh = new THREE.Mesh(textGeometry, material);
//                 textMeshRef.current = textMesh; // Store reference to the text mesh
//                 textMesh.position.x = -2; // Set initial position of the text
//                 scene.add(textMesh);
//
//                 // Writing Animation
//                 let currentIndex = 0;
//
//                 const writeText = () => {
//                     if (currentIndex < text.length) {
//                         const typedText = text.slice(0, currentIndex + 1);
//                         const typedGeometry = new TextGeometry(typedText, {
//                             font: font,
//                             size: 1,
//                             height: 0.2,
//                             curveSegments: 12,
//                             bevelEnabled: true,
//                             bevelThickness: 0.1,
//                             bevelSize: 0.05,
//                             bevelSegments: 5,
//                         });
//
//                         // Update the mesh geometry to show the new typed text
//                         textMesh.geometry.dispose(); // Dispose the old geometry
//                         textMesh.geometry = typedGeometry; // Update geometry
//                         currentIndex++;
//                         setTimeout(writeText, typingSpeed); // Continue writing
//                     }
//                 };
//
//                 writeText(); // Start writing animation
//
//                 // Animation loop
//                 const animate = () => {
//                     animationFrameRef.current = requestAnimationFrame(animate);
//                     renderer.render(scene, camera);
//                 };
//
//                 animate(); // Start the animation loop
//             }
//         );
//
//         // Handle window resize
//         const handleResize = () => {
//             camera.aspect = window.innerWidth / window.innerHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(window.innerWidth, window.innerHeight);
//         };
//         window.addEventListener('resize', handleResize);
//
//         // Clean up
//         return () => {
//             if (animationFrameRef.current) {
//                 cancelAnimationFrame(animationFrameRef.current); // Cancel the animation frame
//             }
//             mount.removeChild(renderer.domElement);
//             window.removeEventListener('resize', handleResize); // Remove the resize listener
//         };
//     }, []);
//
//     return <div ref={mountRef} />;
// };
//
// export default HelloText;
//
