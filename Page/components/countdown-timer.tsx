"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0); // Next midnight

            const diff = midnight.getTime() - now.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        };

        // Update immediately
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center mt-6">
            <p className="text-white/70 text-sm mb-2">Próximo desafío en:</p>
            <p className="text-white text-2xl font-bold font-mono tracking-wider">
                {timeLeft}
            </p>
        </div>
    );
}
