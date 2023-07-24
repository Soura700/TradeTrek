import React, { useEffect, useState } from 'react';
import "./countdown.css";

let Countdown = ({ duration }) => {
    let [time, setTime] = useState(duration);

    useEffect(() => {
        const countdown = setTimeout(() => {
            setTime(time - 1000);
        }, 1000);

        if (time === 0) {
            clearTimeout(countdown);
            // Handle the case when the time reaches 0
        }

        // Flip animation
        flipAllCards(time);

        return () => clearTimeout(countdown); // Cleanup the timeout on component unmount
    }, [time]);

    const flipAllCards = (time) => {
        let total_seconds = parseInt(Math.floor(time / 1000));
        let total_minutes = parseInt(Math.floor(total_seconds / 60));
        let total_hours = parseInt(Math.floor(total_minutes / 60));
        let total_days = parseInt(Math.floor(total_hours / 24));

        const seconds = parseInt(total_seconds % 60);
        const minutes = parseInt(total_minutes % 60);
        const hours = parseFloat(total_hours % 24);
        const days = total_days;

        flip(document.querySelector("[data-days-tens]"), Math.floor(days / 10));
        flip(document.querySelector("[data-days-ones]"), days % 10);
        flip(document.querySelector("[data-hours-tens]"), Math.floor(hours / 10));
        flip(document.querySelector("[data-hours-ones]"), hours % 10);
        flip(document.querySelector("[data-minutes-tens]"), Math.floor(minutes / 10));
        flip(document.querySelector("[data-minutes-ones]"), minutes % 10);
        flip(document.querySelector("[data-seconds-tens]"), Math.floor(seconds / 10));
        flip(document.querySelector("[data-seconds-ones]"), seconds % 10);
    }

    const flip = (flipCard, newNumber) => {
        const topHalf = flipCard.querySelector(".top");
        const startNumber = parseInt(topHalf.textContent);
        if (newNumber === startNumber) return;

        const bottomHalf = flipCard.querySelector(".bottom");
        const topFlip = document.createElement("div");
        topFlip.classList.add("top-flip");
        const bottomFlip = document.createElement("div");
        bottomFlip.classList.add("bottom-flip");

        topFlip.textContent = startNumber;
        bottomHalf.textContent = startNumber;
        topFlip.textContent = startNumber;
        bottomFlip.textContent = newNumber;

        topFlip.addEventListener("animationstart", () => {
            topHalf.textContent = newNumber;
        });
        topFlip.addEventListener("animationend", () => {
            topFlip.remove();
        });
        bottomFlip.addEventListener("animationend", () => {
            bottomHalf.textContent = newNumber;
            bottomFlip.remove();
        });
        flipCard.append(topFlip, bottomFlip);
    }

    return (
        <div className="container">
            <div className="container-segment">
                <div className="segment-title">Day</div>
                <div className="segment">
                    <div className="flip-card" data-days-tens>
                        <div className="top">0</div>
                        <div className="bottom">0</div>
                    </div>
                    <div className="flip-card" data-days-ones>
                        <div className="top">0</div>
                        <div className="bottom">0</div>
                    </div>
                </div>
            </div>

            <div className="container-segment">
                <div className="segment-title">Hours</div>
                <div className="segment">
                    <div className="flip-card" data-hours-tens>
                        <div className="top">0</div>
                        <div className="bottom">0</div>
                    </div>
                    <div className="flip-card" data-hours-ones>
                        <div className="top">0</div>
                        <div className="bottom">0</div>
                    </div>
                </div>
            </div>

            <div className="container-segment">
                <div className="segment-title">Minutes</div>
                <div className="segment">
                    <div className="flip-card" data-minutes-tens>
                        <div className="top">0</div>
                        <div className="bottom">0</div>
                    </div>
                    <div className="flip-card" data-minutes-ones>
                        <div className="top">0</div>
                        <div className="bottom">0</div>
                    </div>
                </div>
            </div>

            <div className="container-segment">
                <div className="segment-title">Seconds</div>
                <div className="segment">
                    <div className="flip-card" data-seconds-tens>
                        <div className="top">0</div>
                        <div className="bottom">0</div>
                    </div>
                    <div className="flip-card" data-seconds-ones>
                        <div className="top">0</div>
                        <div className="bottom">0</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Countdown;
