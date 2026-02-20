import React from "react";
import {useState} from "react";

function HealthBar({ maxHealth = 100, currentHealth = 0 }) {
    const healthPercentage = (maxHealth > 0) ? (currentHealth / maxHealth) * 100 : 0;
    const containerStyle = {
        position: 'relative',
        width: '100%',
        backgroundColor: 'black',
        borderRadius: '5px',
        height: '20px',
        overflow: 'hidden'
    };

    const fillStyle = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${healthPercentage}%`,
        height: '100%',
        backgroundColor: 'red',
        borderRadius: '5px',
        transition: 'width 0.3s ease-in-out'
    };

    const textStyle = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        margin: 0,
        fontSize: '12px',
        zIndex: 1,
        pointerEvents: 'none'
    };

    return (
        <div style={containerStyle}>
            <div style={fillStyle} />
            <p style={textStyle}>{currentHealth} / {maxHealth}</p>
        </div>
    );
} 

export { HealthBar };