import React, { useState } from 'react';

export function VerticalJoystickSlider(props: { onDelta: (deltaY: number) => void, scale: number }) {
    const [isDragging, setIsDragging] = useState(false);
    const [sliderPosition, setSliderPosition] = useState({ y: 0 });

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            const sliderRect = event.currentTarget.getBoundingClientRect();
            const sliderCenter = {
                y: sliderRect.top + sliderRect.height / 2,
            };
            const deltaY = event.clientY - sliderCenter.y;
            setSliderPosition({ y: deltaY / props.scale });
            props.onDelta(deltaY);
        }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(false);
        setSliderPosition({ y: 0 });
        props.onDelta(0);
    };

    return (
        <div
            style={{
                width: '20px',
                height: '100px',
                backgroundColor: 'lightgray',
                position: 'relative',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'gray',
                    position: 'absolute',
                    left: '0',
                    top: '50%',
                    transform: `translateY(-50%) translateY(${sliderPosition.y}px)`,
                }}
            />
        </div>
    );
}

export function HorizontalJoystickSlider(props: { onDelta: (deltaX: number) => void, scale: number, width: number }) {
    const [isDragging, setIsDragging] = useState(false);
    const [sliderPosition, setSliderPosition] = useState({ x: 0 });

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            const sliderRect = event.currentTarget.getBoundingClientRect();
            const sliderCenter = {
                x: sliderRect.left + sliderRect.width / 2,
            };
            const deltaX = event.clientX - sliderCenter.x;
            setSliderPosition({ x: deltaX });
            props.onDelta(deltaX / props.width * props.scale);
        }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(false);
        setSliderPosition({ x: 0 });
        props.onDelta(0);
    };

    return (
        <div
            style={{
                width: `${props.width}px`,
                height: '20px',
                backgroundColor: 'lightgray',
                position: 'relative',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'red',
                    position: 'absolute',
                    left: '50%',
                    top: '0',
                    transform: `translateX(-50%) translateX(${sliderPosition.x}px)`,
                }}
            />
        </div>
    );
}

export function JoystickSlider(props: { onDelta: (deltaX: number, deltaY: number) => void, scale: number }) {
    const [isDragging, setIsDragging] = useState(false);
    const [sliderPosition, setSliderPosition] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            const sliderRect = event.currentTarget.getBoundingClientRect();
            const sliderCenter = {
                x: sliderRect.left + sliderRect.width / 2,
                y: sliderRect.top + sliderRect.height / 2,
            };
            const deltaX = event.clientX - sliderCenter.x;
            const deltaY = event.clientY - sliderCenter.y;
            setSliderPosition({ x: deltaX / props.scale, y: deltaY / props.scale });
            props.onDelta(deltaX, deltaY);
        }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(false);
        setSliderPosition({ x: 0, y: 0 });
        props.onDelta(0, 0);
    };

    return (
        <div
            style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'lightgray',
                position: 'relative',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'red',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${sliderPosition.x}px, ${sliderPosition.y}px)`,
                }}
            />
        </div>
    );
}