import React from 'react';
import '../App.css';
import {
    Link
  } from "react-router-dom";
import { useState,  useEffect } from 'react';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";
import * as PIXI from 'pixi.js'

//without this line, PixiPlugin and MotionPathPlugin may get dropped by your bundler (tree shaking)...
gsap.registerPlugin(PixiPlugin, MotionPathPlugin);



function Home () {


    const app = new PIXI.Application({ resizeTo: window.document.body ,transparent: true});

    const movementSpeed = 0.03;
    const impulsePower = 3;

    // A basic AABB check between two different squares
    function testForAABB(object1, object2) {
        const bounds1 = object1.getBounds();
        const bounds2 = object2.getBounds();

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }
    

    function collisionResponse(object1, object2) {
        if (!object1 || !object2) {
            return new PIXI.Point(0);
        }
    
        const vCollision = new PIXI.Point(
            object2.x - object1.x,
            object2.y - object1.y,
        );
    
        const distance = Math.sqrt(
            (object2.x - object1.x) * (object2.x - object1.x)
            + (object2.y - object1.y) * (object2.y - object1.y),
        );
    
        const vCollisionNorm = new PIXI.Point(
            vCollision.x / distance,
            vCollision.y / distance,
        );
    
        const vRelativeVelocity = new PIXI.Point(
            object1.acceleration.x - object2.acceleration.x,
            object1.acceleration.y - object2.acceleration.y,
        );
    
        const speed = vRelativeVelocity.x * vCollisionNorm.x
            + vRelativeVelocity.y * vCollisionNorm.y;
    
        const impulse = impulsePower * speed / (object1.mass + object2.mass);
    
        return new PIXI.Point(
            impulse * vCollisionNorm.x,
            impulse * vCollisionNorm.y,
        );
    }

    function distanceBetweenTwoPoints(p1, p2) {
        const a = p1.x - p2.x;
        const b = p1.y - p2.y;
    
        return Math.hypot(a, b);
    }

    // The green square we will knock about
    /* const greenSquare = new PIXI.Sprite(PIXI.Texture.WHITE);
    greenSquare.position.set((app.screen.width - 100) / 2, (app.screen.height - 100) / 2);
    greenSquare.width = 100;
    greenSquare.height = 100;
    greenSquare.tint = '0x00FF00';
    greenSquare.acceleration = new PIXI.Point(0);
    greenSquare.mass = 3; */

    // The square you move around
    const redSquare = new PIXI.Sprite(PIXI.Texture.WHITE);
    redSquare.position.set(0, 0);
    redSquare.width = 200;
    redSquare.height = 200;
    /* redSquare.tint = false; */
    redSquare.visible = false
    redSquare.acceleration = new PIXI.Point(0);
    redSquare.mass = 1;


    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx.fill();

    const greenSquare = new PIXI.Sprite.from(c)
    greenSquare.position.set((app.screen.width - 100) / 2, (app.screen.height - 100) / 2);
    /* greenSquare.width = 200;
    greenSquare.height = 100; */
    /* greenSquare.tint = false; */
    greenSquare.acceleration = new PIXI.Point(0);
    greenSquare.mass = 1;

    

    app.stage.addChild(redSquare, greenSquare);

    
    
    useEffect(()=>{

        const hero = document.querySelector('[data-hero]')
    
        window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e
        const x = Math.round((clientX / window.innerWidth) * 100)
        const y = Math.round((clientY / window.innerHeight) * 100)
        
        gsap.to(hero, {
            '--x': `${x}%`,
            '--y': `${y}%`,
            duration: 0.3,
            ease: 'sine.out',
        })
        })
       
            // Listen for animate update
    app.ticker.add((delta) => {
        // Applied deacceleration for both squares, done by reducing the
        // acceleration by 0.01% of the acceleration every loop
        redSquare.acceleration.set(redSquare.acceleration.x * 0.99, redSquare.acceleration.y * 0.99);
        greenSquare.acceleration.set(greenSquare.acceleration.x * 0.99, greenSquare.acceleration.y * 0.99);

        const mouseCoords = app.renderer.plugins.interaction.mouse.global;

        // Check whether the green square ever moves off the screen
        // If so, reverse acceleration in that direction
        if (greenSquare.x < 0 || greenSquare.x > (app.screen.width - 100)) {
            greenSquare.acceleration.x = -greenSquare.acceleration.x;
        }

        if (greenSquare.y < 0 || greenSquare.y > (app.screen.height - 100)) {
            greenSquare.acceleration.y = -greenSquare.acceleration.y;
        }

        // If the green square pops out of the cordon, it pops back into the
        // middle
        if ((greenSquare.x < -30 || greenSquare.x > (app.screen.width + 30))
            || greenSquare.y < -30 || greenSquare.y > (app.screen.height + 30)) {
            greenSquare.position.set((app.screen.width - 100) / 2, (app.screen.height - 100) / 2);
        }

        // If the mouse is off screen, then don't update any further
        if (app.screen.width > mouseCoords.x || mouseCoords.x > 0
            || app.screen.height > mouseCoords.y || mouseCoords.y > 0) {
            // Get the red square's center point
            const redSquareCenterPosition = new PIXI.Point(
                redSquare.x + (redSquare.width * 0.5),
                redSquare.y + (redSquare.height * 0.5),
            );

            // Calculate the direction vector between the mouse pointer and
            // the red square
            const toMouseDirection = new PIXI.Point(
                mouseCoords.x - redSquareCenterPosition.x,
                mouseCoords.y - redSquareCenterPosition.y,
            );

            // Use the above to figure out the angle that direction has
            const angleToMouse = Math.atan2(
                toMouseDirection.y,
                toMouseDirection.x,
            );

            // Figure out the speed the square should be travelling by, as a
            // function of how far away from the mouse pointer the red square is
            const distMouseRedSquare = distanceBetweenTwoPoints(
                mouseCoords,
                redSquareCenterPosition,
            );
            const redSpeed = distMouseRedSquare * movementSpeed;

            // Calculate the acceleration of the red square
            redSquare.acceleration.set(
                Math.cos(angleToMouse) * redSpeed,
                Math.sin(angleToMouse) * redSpeed,
            );
        }

        // If the two squares are colliding
        if (testForAABB(greenSquare, redSquare)) {
            // Calculate the changes in acceleration that should be made between
            // each square as a result of the collision
            const collisionPush = collisionResponse(greenSquare, redSquare);
            // Set the changes in acceleration for both squares
            redSquare.acceleration.set(
                (collisionPush.x * greenSquare.mass),
                (collisionPush.y * greenSquare.mass),
            );
            greenSquare.acceleration.set(
                -(collisionPush.x * redSquare.mass),
                -(collisionPush.y * redSquare.mass),
            );
        }

        greenSquare.x += greenSquare.acceleration.x * delta;
        greenSquare.y += greenSquare.acceleration.y * delta;

        redSquare.x += redSquare.acceleration.x * delta;
        redSquare.y += redSquare.acceleration.y * delta;
    });

    const wrapper = document.querySelector('.wrapper');
    wrapper.appendChild(app.view);

    //app.stage.addChild(redSquare, greenSquare);
    },[])


    return (
        <div className="wrapper">
            <div className="hero">
                <h1 className="hero__heading">César Arteaga</h1>
            </div>

            <div className="hero hero--secondary" aria-hidden="true" data-hero>
                <p className="hero__heading">César Arteaga</p>
                <div className="menu">
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>
    );
}

export default Home;