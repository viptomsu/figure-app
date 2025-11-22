'use client';

import React, { useRef, useState, useEffect } from 'react';

const Countdown = () => {
  const [countdownHours, setCountdownHours] = useState<number | string>('00');
  const [countdownMinutes, setCountdownMinutes] = useState<number | string>('00');
  const [countdownSeconds, setCountdownSeconds] = useState<number | string>('00');

  let interval: any = useRef(null);

  // Đếm ngược 24 giờ (86400000 milliseconds)
  const startTimer = (): void => {
    const countdownDuration: number = 24 * 60 * 60 * 1000; // 24 giờ tính bằng milliseconds
    const endTime = new Date().getTime() + countdownDuration; // Thời gian kết thúc

    interval.current = setInterval((): void => {
      const now: number = new Date().getTime();
      const distance: number = endTime - now;

      const hours: number | string = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
        .toString()
        .padStart(2, '0');
      const minutes: number | string = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, '0');
      const seconds: number | string = Math.floor((distance % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, '0');

      if (distance < 0) {
        clearInterval(interval.current);
        setCountdownHours('00');
        setCountdownMinutes('00');
        setCountdownSeconds('00');
      } else {
        setCountdownHours(hours);
        setCountdownMinutes(minutes);
        setCountdownSeconds(seconds);
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();

    return () => {
      clearInterval(interval.current);
    };
  }, []); // Chỉ chạy 1 lần khi component được mount

  return (
    <div className="flex items-center">
      <div className="mr-3">
        <p className="text-sm text-gray-600 m-0">Kết thúc sau:</p>
      </div>
      <div className="flex items-center">
        <div className="bg-primary text-white px-3 py-1 rounded text-center min-w-[50px]">
          <span className="text-lg font-semibold">{countdownHours}</span>
        </div>
        <span className="mx-2 text-gray-600">:</span>
        <div className="bg-primary text-white px-3 py-1 rounded text-center min-w-[50px]">
          <span className="text-lg font-semibold">{countdownMinutes}</span>
        </div>
        <span className="mx-2 text-gray-600">:</span>
        <div className="bg-primary text-white px-3 py-1 rounded text-center min-w-[50px]">
          <span className="text-lg font-semibold">{countdownSeconds}</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
