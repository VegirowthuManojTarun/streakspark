import React, { useEffect, useRef } from "react";

const ProceduralBackground = ({
  backgroundColor = "white",
  ballColor = "rgba(255, 127, 80, 0.7)",
  ballRadius = 20,
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ballRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    radius: ballRadius,
    color: ballColor,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // High-DPI Setup
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    // Smooth Ball Movement
    const updateBallPosition = (ball, mouse) => {
      const ease = 0.15; // Increased for quicker response
      ball.x += (mouse.x - ball.x) * ease;
      ball.y += (mouse.y - ball.y) * ease;
    };

    // Rendering Function
    const renderBall = (ctx, ball) => {
      // Create radial gradient
      const gradient = ctx.createRadialGradient(
        ball.x,
        ball.y,
        0,
        ball.x,
        ball.y,
        ball.radius
      );
      gradient.addColorStop(0, ball.color);
      gradient.addColorStop(1, ball.color.replace("0.8", "0.2"));

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.shadowColor = ball.color;
      ctx.shadowBlur = 20;
      ctx.fill();
    };

    // Mouse move tracker
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ball = ballRef.current;
      const mouse = mouseRef.current;

      // Update ball position
      updateBallPosition(ball, mouse);

      // Render ball
      renderBall(ctx, ball);

      // Continue animation
      requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);

    // Start animation
    const animationFrame = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [ballColor, ballRadius]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999, // High z-index to ensure visibility
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        backgroundColor: "transparent",
      }}
    />
  );
};

// import React, { useEffect, useRef } from "react";

// const ProceduralBackground = ({ backgroundColor = "white" }) => {
//   const canvasRef = useRef(null);
//   const mouseRef = useRef({ x: 0, y: 0 });
//   const ballRef = useRef({
//     x: window.innerWidth / 2,
//     y: window.innerHeight / 2,
//     radius: 100,
//     color: "rgba(255, 127, 80, 0.7)",
//   });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     // High-DPI Setup
//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = window.innerWidth * dpr;
//     canvas.height = window.innerHeight * dpr;
//     ctx.scale(dpr, dpr);

//     // Smooth following parameters
//     const ease = 0.1;
//     const maxDistance = 200;

//     // Mouse move tracker
//     const handleMouseMove = (e) => {
//       mouseRef.current.x = e.clientX;
//       mouseRef.current.y = e.clientY;
//     };

//     // Animation loop
//     const animate = () => {
//       // Clear canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const ball = ballRef.current;
//       const mouse = mouseRef.current;

//       // Calculate distance
//       const dx = mouse.x - ball.x;
//       const dy = mouse.y - ball.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);

//       // Smooth interpolation
//       ball.x += dx * ease;
//       ball.y += dy * ease;

//       // Dynamic radius based on distance
//       const targetRadius = Math.max(
//         50,
//         Math.min(200, 100 + (distance / maxDistance) * 100)
//       );
//       ball.radius += (targetRadius - ball.radius) * 0.1;

//       // Create fluid deformation
//       const deformFactor = Math.sin(Date.now() * 0.01) * 0.2 + 1;

//       // Draw ball with complex fluid dynamics
//       ctx.beginPath();
//       const pointCount = 200;
//       for (let i = 0; i < pointCount; i++) {
//         const angle = (i / pointCount) * Math.PI * 2;

//         // Complex radius calculation with noise
//         const noiseAmplitude = 20;
//         const noise = Math.sin(angle * 5 + Date.now() * 0.005) * noiseAmplitude;

//         const radius = ball.radius * deformFactor + noise;

//         const x = ball.x + Math.cos(angle) * radius;
//         const y = ball.y + Math.sin(angle) * radius;

//         if (i === 0) {
//           ctx.moveTo(x, y);
//         } else {
//           ctx.lineTo(x, y);
//         }
//       }
//       ctx.closePath();

//       // Gradient for depth
//       const gradient = ctx.createRadialGradient(
//         ball.x,
//         ball.y,
//         0,
//         ball.x,
//         ball.y,
//         ball.radius
//       );
//       gradient.addColorStop(0, "rgba(255, 127, 80, 0.8)");
//       gradient.addColorStop(1, "rgba(255, 127, 80, 0.2)");

//       ctx.fillStyle = gradient;
//       ctx.fill();

//       // Continue animation
//       requestAnimationFrame(animate);
//     };

//     // Event listeners
//     window.addEventListener("mousemove", handleMouseMove);

//     // Start animation
//     const animationFrame = requestAnimationFrame(animate);

//     // Cleanup
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       cancelAnimationFrame(animationFrame);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         zIndex: -10,
//         width: "100%",
//         height: "100%",
//         pointerEvents: "none",
//         backgroundColor: backgroundColor,
//       }}
//     />
//   );
// };

export default ProceduralBackground;
// import React, { useEffect, useState, useRef, useMemo } from "react";
// import { motion } from "framer-motion";

// const ProceduralBackground = ({
//   ballCount = 20,
//   backgroundColor = "white",
// }) => {
//   const canvasRef = useRef(null);
//   const [canRender, setCanRender] = useState(true);
//   const mouseRef = useRef({ x: 0, y: 0 });

//   // Ball configuration
//   const ballConfig = useMemo(
//     () => ({
//       baseColor: "rgba(255, 127, 80, 0.6)", // Soft orange
//       highlightColor: "rgba(255, 99, 71, 0.8)", // More intense orange
//       maxRadius: 40,
//       minRadius: 10,
//       maxSpeed: 2,
//     }),
//     []
//   );

//   useEffect(() => {
//     const checkPerformance = () => {
//       const hardwareCapacity = navigator.hardwareConcurrency || 4;
//       setCanRender(hardwareCapacity > 2);
//     };

//     checkPerformance();
//   }, []);

//   useEffect(() => {
//     if (!canRender || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // High-DPI Canvas Setup
//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = window.innerWidth * dpr;
//     canvas.height = window.innerHeight * dpr;
//     ctx.scale(dpr, dpr);

//     // Ball Class
//     class Ball {
//       constructor(canvas) {
//         this.canvas = canvas;
//         this.reset();
//       }

//       reset() {
//         this.x = Math.random() * this.canvas.width;
//         this.y = Math.random() * this.canvas.height;
//         this.radius =
//           Math.random() * (ballConfig.maxRadius - ballConfig.minRadius) +
//           ballConfig.minRadius;

//         // Randomize direction and speed
//         const angle = Math.random() * Math.PI * 2;
//         this.dx = Math.cos(angle) * (Math.random() * ballConfig.maxSpeed);
//         this.dy = Math.sin(angle) * (Math.random() * ballConfig.maxSpeed);

//         // Unique characteristics
//         this.opacity = Math.random() * 0.5 + 0.3;
//         this.color = ballConfig.baseColor;
//       }

//       update(mouseX, mouseY) {
//         // Basic movement
//         this.x += this.dx;
//         this.y += this.dy;

//         // Boundary collision
//         if (
//           this.x - this.radius < 0 ||
//           this.x + this.radius > this.canvas.width
//         ) {
//           this.dx *= -1;
//         }
//         if (
//           this.y - this.radius < 0 ||
//           this.y + this.radius > this.canvas.height
//         ) {
//           this.dy *= -1;
//         }

//         // Mouse interaction
//         const dx = this.x - mouseX;
//         const dy = this.y - mouseY;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         // Repulsion effect
//         if (distance < 100) {
//           const repulsionFactor = (100 - distance) / 100;
//           this.dx += dx * 0.05 * repulsionFactor;
//           this.dy += dy * 0.05 * repulsionFactor;

//           // Color and size change on proximity
//           this.color = ballConfig.highlightColor;
//           this.radius = Math.min(
//             this.radius + repulsionFactor,
//             ballConfig.maxRadius
//           );
//         } else {
//           // Return to original state
//           this.color = ballConfig.baseColor;
//           this.radius = Math.max(this.radius - 0.5, ballConfig.minRadius);
//         }

//         // Damping to prevent extreme speeds
//         this.dx *= 0.99;
//         this.dy *= 0.99;
//       }

//       draw(ctx) {
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

//         // Radial gradient for depth
//         const gradient = ctx.createRadialGradient(
//           this.x,
//           this.y,
//           0,
//           this.x,
//           this.y,
//           this.radius
//         );
//         gradient.addColorStop(0, this.color);
//         gradient.addColorStop(1, `${this.color.replace("0.6", "0.2")}`);

//         ctx.fillStyle = gradient;
//         ctx.fill();
//       }
//     }

//     // Create balls
//     const balls = Array.from({ length: ballCount }, () => new Ball(canvas));

//     // Mouse move listener
//     const handleMouseMove = (event) => {
//       mouseRef.current.x = event.clientX * dpr;
//       mouseRef.current.y = event.clientY * dpr;
//     };
//     window.addEventListener("mousemove", handleMouseMove);

//     // Animation Loop
//     let animationFrameId;
//     function animate() {
//       // Clear with slight trailing effect
//       ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // Update and draw each ball
//       balls.forEach((ball) => {
//         ball.update(mouseRef.current.x, mouseRef.current.y);
//         ball.draw(ctx);
//       });

//       animationFrameId = requestAnimationFrame(animate);
//     }

//     // Start animation
//     animate();

//     // Responsive Handling
//     const handleResize = () => {
//       canvas.width = window.innerWidth * dpr;
//       canvas.height = window.innerHeight * dpr;
//       ctx.scale(dpr, dpr);
//     };
//     window.addEventListener("resize", handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("resize", handleResize);
//       if (animationFrameId) cancelAnimationFrame(animationFrameId);
//     };
//   }, [canRender, ballCount]);

//   // Render only if can render
//   if (!canRender) return null;

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         zIndex: -10,
//         width: "100%",
//         height: "100%",
//         pointerEvents: "none",
//         backgroundColor: backgroundColor,
//       }}
//     />
//   );
// };

// export default React.memo(ProceduralBackground);
// import React, { useEffect, useState, useRef, useMemo } from "react";
// import { motion } from "framer-motion";

// const ProceduralBackground = ({
//   particleCount = 50,
//   waveIntensity = 0.5,
//   backgroundColor = "white",
// }) => {
//   const canvasRef = useRef(null);
//   const [canRender, setCanRender] = useState(true);
//   const mouseRef = useRef({ x: 0, y: 0 });

//   // Wave-specific configuration
//   const waveConfig = useMemo(
//     () => ({
//       baseColor: "rgba(255, 127, 80, 0.1)", // Soft orange
//       highlightColor: "rgba(255, 127, 80, 0.3)", // More intense orange
//       maxWaveHeight: 200,
//       waveSpeed: 0.02,
//     }),
//     []
//   );

//   useEffect(() => {
//     const checkPerformance = () => {
//       const hardwareCapacity = navigator.hardwareConcurrency || 4;
//       setCanRender(hardwareCapacity > 2);
//     };

//     checkPerformance();
//   }, []);

//   useEffect(() => {
//     if (!canRender || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // High-DPI Canvas Setup
//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = window.innerWidth * dpr;
//     canvas.height = window.innerHeight * dpr;
//     ctx.scale(dpr, dpr);

//     // Wave Layer Class
//     class WaveLayer {
//       constructor(canvas, index, totalLayers) {
//         this.canvas = canvas;
//         this.index = index;
//         this.totalLayers = totalLayers;
//         this.points = [];
//         this.time = 0;
//         this.initializePoints();
//       }

//       initializePoints() {
//         const spacing = this.canvas.width / 50;
//         for (let x = 0; x <= this.canvas.width + spacing; x += spacing) {
//           this.points.push({
//             x: x,
//             y: this.canvas.height / 2,
//             originalY: this.canvas.height / 2,
//             amplitude:
//               (waveConfig.maxWaveHeight * (this.index + 1)) / this.totalLayers,
//             frequency: 0.02 * (this.index + 1),
//             phase: Math.random() * Math.PI * 2,
//           });
//         }
//       }

//       update(mouseX, mouseY) {
//         this.time += waveConfig.waveSpeed;

//         this.points.forEach((point, index) => {
//           // Base wave motion
//           const sineWave = Math.sin(
//             point.x * point.frequency + this.time + point.phase
//           );

//           // Mouse interaction influence
//           const dx = point.x - mouseX;
//           const dy = point.y - mouseY;
//           const distance = Math.sqrt(dx * dx + dy * dy);
//           const mouseInfluence =
//             Math.max(0, 200 - distance) * 0.1 * waveIntensity;

//           // Calculate new y position
//           point.y =
//             point.originalY +
//             sineWave * point.amplitude +
//             mouseInfluence * Math.sign(dy);
//         });
//       }

//       draw(ctx) {
//         ctx.beginPath();
//         ctx.moveTo(0, this.canvas.height);
//         ctx.lineTo(this.points[0].x, this.points[0].y);

//         // Draw wave curves
//         for (let i = 1; i < this.points.length - 2; i++) {
//           const xc = (this.points[i].x + this.points[i + 1].x) / 2;
//           const yc = (this.points[i].y + this.points[i + 1].y) / 2;
//           ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
//         }

//         // Complete the wave shape
//         ctx.lineTo(this.canvas.width, this.canvas.height);
//         ctx.closePath();

//         // Gradient for depth
//         const gradient = ctx.createLinearGradient(
//           0,
//           this.canvas.height / 2,
//           0,
//           this.canvas.height
//         );
//         gradient.addColorStop(0, waveConfig.baseColor);
//         gradient.addColorStop(1, waveConfig.highlightColor);

//         ctx.fillStyle = gradient;
//         ctx.fill();
//       }
//     }

//     // Create multiple wave layers
//     const waveLayers = Array.from(
//       { length: 3 },
//       (_, index) => new WaveLayer(canvas, index, 3)
//     );

//     // Mouse move listener
//     const handleMouseMove = (event) => {
//       mouseRef.current.x = event.clientX * dpr;
//       mouseRef.current.y = event.clientY * dpr;
//     };
//     window.addEventListener("mousemove", handleMouseMove);

//     // Animation Loop
//     let animationFrameId;
//     function animate() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Update and draw each wave layer
//       waveLayers.forEach((layer) => {
//         layer.update(mouseRef.current.x, mouseRef.current.y);
//         layer.draw(ctx);
//       });

//       animationFrameId = requestAnimationFrame(animate);
//     }

//     // Start animation
//     animate();

//     // Responsive Handling
//     const handleResize = () => {
//       canvas.width = window.innerWidth * dpr;
//       canvas.height = window.innerHeight * dpr;
//       ctx.scale(dpr, dpr);

//       // Reinitialize points on resize
//       waveLayers.forEach((layer) => layer.initializePoints());
//     };
//     window.addEventListener("resize", handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("resize", handleResize);
//       if (animationFrameId) cancelAnimationFrame(animationFrameId);
//     };
//   }, [canRender, waveIntensity]);

//   // Render only if can render
//   if (!canRender) return null;

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         zIndex: -10,
//         width: "100%",
//         height: "100%",
//         pointerEvents: "none",
//         backgroundColor: backgroundColor,
//       }}
//     />
//   );
// };

// export default React.memo(ProceduralBackground);

// //connections
// // import React, { useEffect, useState, useRef, useMemo } from "react";
// // import { motion } from "framer-motion";

// // const ProceduralBackground = ({
// //   particleCount = 75,
// //   connectionDistance = 120,
// //   backgroundColor = "rgba(255,255,255,0.1)",
// // }) => {
// //   const canvasRef = useRef(null);
// //   const [canRender, setCanRender] = useState(true);

// //   // Memoize color palette
// //   const colorPalette = useMemo(
// //     () => ({
// //       light: {
// //         particleColor: "rgba(96, 165, 250, 0.1)", // Primary light blue
// //         connectionColor: "rgba(96, 165, 250, 0.05)",
// //       },
// //       dark: {
// //         particleColor: "rgba(31, 41, 55, 0.05)", // Dark mode variant
// //         connectionColor: "rgba(31, 41, 55, 0.02)",
// //       },
// //     }),
// //     []
// //   );

// //   // Performance and rendering check
// //   useEffect(() => {
// //     const checkPerformance = () => {
// //       const hardwareCapacity = navigator.hardwareConcurrency || 4;
// //       setCanRender(hardwareCapacity > 2);
// //     };

// //     checkPerformance();
// //   }, []);

// //   // Main rendering effect
// //   useEffect(() => {
// //     if (!canRender || !canvasRef.current) return;

// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext("2d");
// //     if (!ctx) return;

// //     // High-DPI Canvas Setup
// //     const dpr = window.devicePixelRatio || 1;
// //     canvas.width = window.innerWidth * dpr;
// //     canvas.height = window.innerHeight * dpr;
// //     ctx.scale(dpr, dpr);

// //     // Color Scheme Detection
// //     const isDarkMode = window.matchMedia(
// //       "(prefers-color-scheme: dark)"
// //     ).matches;
// //     const colorScheme = isDarkMode ? colorPalette.dark : colorPalette.light;

// //     // Particle Class
// //     class Particle {
// //       constructor(canvasWidth, canvasHeight) {
// //         this.reset(canvasWidth, canvasHeight);
// //       }

// //       reset(canvasWidth, canvasHeight) {
// //         this.x = Math.random() * canvasWidth;
// //         this.y = Math.random() * canvasHeight;
// //         this.radius = Math.random() * 1.5 + 0.5;
// //         this.velocityX = (Math.random() - 0.5) * 0.3;
// //         this.velocityY = (Math.random() - 0.5) * 0.3;
// //         this.color = colorScheme.particleColor;
// //       }

// //       update(canvasWidth, canvasHeight) {
// //         this.x += this.velocityX;
// //         this.y += this.velocityY;

// //         // Boundary wrapping with subtle elasticity
// //         if (this.x < 0 || this.x > canvasWidth) this.velocityX *= -1;
// //         if (this.y < 0 || this.y > canvasHeight) this.velocityY *= -1;
// //       }

// //       draw(ctx) {
// //         ctx.beginPath();
// //         ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
// //         ctx.fillStyle = this.color;
// //         ctx.fill();
// //       }
// //     }

// //     // Particles initialization
// //     const particles = Array.from(
// //       { length: particleCount },
// //       () => new Particle(canvas.width, canvas.height)
// //     );

// //     // Mouse Interaction
// //     let mouseX = 0,
// //       mouseY = 0;
// //     const handleMouseMove = (event) => {
// //       mouseX = event.clientX;
// //       mouseY = event.clientY;
// //     };
// //     window.addEventListener("mousemove", handleMouseMove);

// //     // Animation Loop
// //     let animationFrameId;
// //     function animate() {
// //       ctx.clearRect(0, 0, canvas.width, canvas.height);

// //       // Draw Connections
// //       for (let i = 0; i < particles.length; i++) {
// //         particles[i].update(canvas.width, canvas.height);
// //         particles[i].draw(ctx);

// //         // Mouse interaction (optional)
// //         const dx = mouseX - particles[i].x;
// //         const dy = mouseY - particles[i].y;
// //         const distance = Math.sqrt(dx * dx + dy * dy);

// //         if (distance < 100) {
// //           particles[i].velocityX += dx * 0.0001;
// //           particles[i].velocityY += dy * 0.0001;
// //         }

// //         for (let j = i + 1; j < particles.length; j++) {
// //           const dx = particles[i].x - particles[j].x;
// //           const dy = particles[i].y - particles[j].y;
// //           const distance = Math.sqrt(dx * dx + dy * dy);

// //           if (distance < connectionDistance) {
// //             ctx.beginPath();
// //             ctx.moveTo(particles[i].x, particles[i].y);
// //             ctx.lineTo(particles[j].x, particles[j].y);
// //             ctx.strokeStyle = `rgba(96, 165, 250, ${
// //               1 - distance / connectionDistance
// //             })`;
// //             ctx.lineWidth = 0.5;
// //             ctx.stroke();
// //           }
// //         }
// //       }

// //       animationFrameId = requestAnimationFrame(animate);
// //     }

// //     // Start animation
// //     animate();

// //     // Responsive Handling
// //     const handleResize = () => {
// //       canvas.width = window.innerWidth * dpr;
// //       canvas.height = window.innerHeight * dpr;
// //       ctx.scale(dpr, dpr);
// //     };

// //     window.addEventListener("resize", handleResize);

// //     // Cleanup
// //     return () => {
// //       window.removeEventListener("mousemove", handleMouseMove);
// //       window.removeEventListener("resize", handleResize);
// //       if (animationFrameId) cancelAnimationFrame(animationFrameId);
// //     };
// //   }, [canRender, particleCount, connectionDistance, colorPalette]);

// //   // Render only if can render
// //   if (!canRender) return null;

// //   return (
// //     <canvas
// //       ref={canvasRef}
// //       style={{
// //         position: "fixed",
// //         top: 0,
// //         left: 0,
// //         zIndex: -10,
// //         width: "100%",
// //         height: "100%",
// //         pointerEvents: "none",
// //         backgroundColor: backgroundColor,
// //       }}
// //     />
// //   );
// // };

// // export default React.memo(ProceduralBackground);
