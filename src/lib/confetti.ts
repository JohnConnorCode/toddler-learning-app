"use client";

import confetti from "canvas-confetti";

type CelebrationLevel = 'small' | 'medium' | 'big' | 'mega';

/**
 * Enhanced confetti celebration system
 * Now with multiple levels and more variety for 3-year-olds
 */

const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

/**
 * Small celebration - quick burst for minor achievements
 */
export function triggerSmallConfetti() {
    confetti({
        particleCount: 30,
        spread: 60,
        startVelocity: 25,
        scalar: 1.2, // Bigger particles
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1'],
    });
}

/**
 * Medium celebration - good job!
 */
export function triggerMediumConfetti() {
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB', '#32CD32'];

    confetti({
        particleCount: 60,
        spread: 100,
        startVelocity: 35,
        scalar: 1.4, // Even bigger
        origin: { x: 0.3, y: 0.5 },
        colors,
    });

    setTimeout(() => {
        confetti({
            particleCount: 60,
            spread: 100,
            startVelocity: 35,
            scalar: 1.4,
            origin: { x: 0.7, y: 0.5 },
            colors,
        });
    }, 150);
}

/**
 * Big celebration - amazing achievement!
 */
export function triggerBigConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB', '#32CD32', '#FF4500', '#1E90FF'];

    const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 70 * (timeLeft / duration);

        confetti({
            particleCount,
            startVelocity: 40,
            spread: 360,
            ticks: 80,
            scalar: 1.5, // Much bigger particles
            shapes: ['circle', 'square'],
            colors,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
            particleCount,
            startVelocity: 40,
            spread: 360,
            ticks: 80,
            scalar: 1.5,
            shapes: ['circle', 'square'],
            colors,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
    }, 250);
}

/**
 * Mega celebration - incredible! Top achievement!
 */
export function triggerMegaConfetti() {
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB', '#32CD32', '#FF4500', '#1E90FF'];

    // Initial burst from bottom
    confetti({
        particleCount: 100,
        spread: 160,
        startVelocity: 55,
        scalar: 2.0, // HUGE particles
        shapes: ['star', 'circle', 'square'],
        colors,
        origin: { y: 0.8 },
    });

    // Side bursts
    setTimeout(() => {
        confetti({
            particleCount: 70,
            angle: 60,
            spread: 55,
            startVelocity: 50,
            scalar: 1.8,
            shapes: ['star', 'circle'],
            colors,
            origin: { x: 0, y: 0.6 },
        });
        confetti({
            particleCount: 70,
            angle: 120,
            spread: 55,
            startVelocity: 50,
            scalar: 1.8,
            shapes: ['star', 'circle'],
            colors,
            origin: { x: 1, y: 0.6 },
        });
    }, 200);

    // Continuous celebration
    const duration = 2500;
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            particleCount,
            startVelocity: 35,
            spread: 360,
            ticks: 100,
            scalar: 1.6,
            shapes: ['star', 'circle', 'square'],
            colors,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
        });
    }, 200);
}

/**
 * Star shower - stars falling from top (for perfect scores)
 */
export function triggerStarShower() {
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        confetti({
            particleCount: 3,
            spread: 20,
            startVelocity: 20,
            scalar: 2.5, // Very large stars
            shapes: ['star'],
            colors: ['#FFD700', '#FFA500'],
            origin: { x: Math.random(), y: -0.1 },
            gravity: 0.8,
        });
    }, 150);
}

/**
 * Heart explosion - for reading independently (using circles in pink/purple)
 */
export function triggerHeartExplosion() {
    const colors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FF00FF'];

    confetti({
        particleCount: 50,
        spread: 100,
        startVelocity: 40,
        scalar: 2.0,
        shapes: ['circle'],
        colors,
        origin: { y: 0.5 },
    });

    setTimeout(() => {
        confetti({
            particleCount: 30,
            spread: 80,
            startVelocity: 30,
            scalar: 1.6,
            shapes: ['circle'],
            colors,
            origin: { y: 0.6 },
        });
    }, 300);
}

/**
 * Main confetti function - maintains backward compatibility
 * Defaults to big celebration
 */
export function triggerConfetti(level: CelebrationLevel = 'big') {
    switch (level) {
        case 'small':
            triggerSmallConfetti();
            break;
        case 'medium':
            triggerMediumConfetti();
            break;
        case 'mega':
            triggerMegaConfetti();
            break;
        case 'big':
        default:
            triggerBigConfetti();
            break;
    }
}

// Export all celebration types
export {
    triggerSmallConfetti as celebrateSmall,
    triggerMediumConfetti as celebrateMedium,
    triggerBigConfetti as celebrateBig,
    triggerMegaConfetti as celebrateMega,
    triggerStarShower as celebrateStars,
    triggerHeartExplosion as celebrateHearts,
};
