import React from 'react';
import '../App.css';
import {
    Link
} from "react-router-dom";
import { useState, useEffect } from 'react';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";
import * as PIXI from 'pixi.js'
import asterisco from "../assets/svg-shapes/asterisco.svg"
import shape1 from "../assets/svg-shapes/shape1.svg"
import shape2 from "../assets/svg-shapes/shape2.svg"
import shape3 from "../assets/svg-shapes/shape3.svg"
import shape4 from "../assets/svg-shapes/shape4.svg"
import cursor from "../assets/svg-shapes/cursor.svg"

//without this line, PixiPlugin and MotionPathPlugin may get dropped by your bundler (tree shaking)...
gsap.registerPlugin(PixiPlugin, MotionPathPlugin);


function Home() {

    //const [mainName, setMainName] = useState();
    const app = new PIXI.Application({ backgroundAlpha: 0, resizeTo: window });
    // How fast the red square moves
    const movementSpeed = 0.05;

    // Strength of the impulse push between two objects
    const impulsePower = 2;

    //const [shapesToAnimate, setShapeToAnimate] = useState([]);
    const shapesToAnimate = [];

    // Test For Hit
    // A basic AABB check between two different squares
    const testForAABB = (object1, object2) => {
        const bounds1 = object1.getBounds();
        const bounds2 = object2.getBounds();

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }

    // Calculates the results of a collision, allowing us to give an impulse that
    // shoves objects apart
    const collisionResponse = (object1, object2) => {
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

    // Calculate the distance between two given points
    const distanceBetweenTwoPoints = (p1, p2) => {
        const a = p1.x - p2.x;
        const b = p1.y - p2.y;

        return Math.hypot(a, b);
    }

    const textEffect = (e) => {
        const target = e.target;
        gsap.to(target, {
            keyframes: [
                { scaleX: 1.3, scaleY: 0.7, duration: 0.2, ease: "power2.out" },
                { scaleX: 1, scaleY: 1, duration: 0.8, ease: "elastic.out(2, 0.5)" }
            ]
        })
    }

    // The square you move around
    const redSquare = new PIXI.Sprite(PIXI.Texture.from(asterisco));
    redSquare.position.set(0, 0);
    /* redSquare.width = 80;
    redSquare.height = 80;
    redSquare.tint = '0xFF0000'; */
   // redSquare.alpha = 0;
    redSquare.acceleration = new PIXI.Point(0);
    redSquare.mass = 1;

    const createShape = (svg, sc) => {
        const shape = new PIXI.Sprite(PIXI.Texture.from(svg));
        shape.position.set(Math.round(Math.random() * window.innerWidth)-100, Math.round(Math.random() * window.innerHeight)-100);
        shape.acceleration = new PIXI.Point(0);
        shape.mass = 1;
        shape.alpha = 0.72;
        shape.scale.set(sc, sc);
        shapesToAnimate.push(shape);
    }

    createShape(cursor, 1.2);
    createShape(shape1, 2);
    createShape(shape2, 3);
    createShape(shape3, 2);
    createShape(shape4, 2);


    const array = ["C", "é", "s", "a", "r"];
    const array2 = ["A", "r", "t", "e", "a", "g", "a"];
    const mainName = array.map(letter => (
        <span key={letter} style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={textEffect} >{letter}</span>
    ))
    const mainLastName = array2.map(letter => (
        <span key={letter} style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={textEffect} >{letter}</span>
    ))

    useEffect(() => {
        document.querySelector('.wrapper').appendChild(app.view);
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
            shapesToAnimate.forEach(shape => {
                shape.acceleration.set(shape.acceleration.x * 0.99, shape.acceleration.y * 0.99);
            })

            const mouseCoords = app.renderer.plugins.interaction.mouse.global;

            shapesToAnimate.forEach(shape => {
                // Check whether the green square ever moves off the screen
                // If so, reverse acceleration in that direction
                if (shape.x < 0 || shape.x > (app.screen.width - 100)) {
                    shape.acceleration.x = -shape.acceleration.x;
                }

                if (shape.y < 0 || shape.y > (app.screen.height - 100)) {
                    shape.acceleration.y = -shape.acceleration.y;
                }

                // If the green square pops out of the cordon, it pops back into the
                // middle
                if ((shape.x < -30 || shape.x > (app.screen.width + 30))
                    || shape.y < -30 || shape.y > (app.screen.height + 30)) {
                    shape.position.set((app.screen.width - 100) / 2, (app.screen.height - 100) / 2);
                }
            })

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
            shapesToAnimate.forEach(shape => {

                if (testForAABB(shape, redSquare)) {
                    // Calculate the changes in acceleration that should be made between
                    // each square as a result of the collision
                    const collisionPush = collisionResponse(shape, redSquare);
                    // Set the changes in acceleration for both squares
                    redSquare.acceleration.set(
                        (collisionPush.x * shape.mass),
                        (collisionPush.y * shape.mass),
                    );
                    shape.acceleration.set(
                        -(collisionPush.x * redSquare.mass),
                        -(collisionPush.y * redSquare.mass),
                    );
                }
            });
            redSquare.anchor.set(0.5);
            redSquare.x += redSquare.acceleration.x * delta;
            redSquare.y += redSquare.acceleration.y * delta;
            redSquare.scale.set(.4,.4);
            redSquare.rotation += 0.03 * delta;

            shapesToAnimate.forEach(shape => {
                shape.x += shape.acceleration.x * delta;
                shape.y += shape.acceleration.y * delta;
            })

        });

        // Add to stage
        app.stage.addChild(redSquare);
        shapesToAnimate.forEach(shape => {
            app.stage.addChild(shape);
        })
    }, [])







    return (
        <div className="wrapper">

            <div className="hero">
                <h1 className="hero__heading">{mainName} {mainLastName} </h1>
            </div>

            {/* <div className="hero hero--secondary" aria-hidden="true" data-hero>
                <h1 className="hero__heading" >{mainName} {mainLastName} </h1>
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
            </div> */}
        </div>
    );
}

export default Home;