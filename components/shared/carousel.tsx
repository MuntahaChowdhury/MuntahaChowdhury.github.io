import React from "react";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

export const Carousel = ({ children, className }: CarouselProps) => {
  return <div className={`carousel ${className}`}>{children}</div>;
};

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export const CarouselItem = ({ children, className }: CarouselItemProps) => {
  return <div className={`carousel-item ${className}`}>{children}</div>;
};
