import React from 'react';
import '../App.css';
import {
    Link,
} from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";
import Matter from 'matter-js'
import Two from "two.js";
import Menu from './Menu';



//without this line, PixiPlugin and MotionPathPlugin may get dropped by your bundler (tree shaking)...
gsap.registerPlugin(PixiPlugin, MotionPathPlugin);

var vector = new Two.Vector();
var entities = [];
var mouse;
var copy = [
    ":-)",
    "Creativity",
    "Apps",
    ":-P",
    "Development",
    "Tech",
    "Concept",
    "Business",
    "Design",
    "Web",
    ":-D"
];



function Home() {

    var domElement = useRef();
    const boxRef = useRef(null)
    const canvasRef = useRef(null)


    var two = new Two({
        type: Two.Types.canvas,
        fullscreen: true,
        autostart: true,
    }).appendTo(document.body.firstElementChild)


    useEffect(() => {


        const interval = setInterval(() => {
            const spans = document.querySelector('.hero__heading').children;
            console.log('This will run every second!', spans);


            for (let i = 0; i < spans.length; i++) {
                // Do stuff
                const mouseoverEvent = new Event('mouseover');
                spans[i].dispatchEvent(mouseoverEvent);
            }


        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const animateLetter = (e) => {
        gsap.to(e, {
            keyframes: [
                { scaleX: 1.3, scaleY: 0.7, duration: 0.2, ease: "power2.out" },
                { scaleX: 1, scaleY: 1, duration: 0.8, ease: "elastic.out(2, 0.5)" }
            ]
        })
    }

    var solver = Matter.Engine.create();
    solver.world.gravity.y = 1;

    var bounds = {
        length: 5000,
        thickness: 50,
        properties: {
            isStatic: true
        }
    };

    // bounds.top = createBoundary(bounds.length, bounds.thickness);
    bounds.left = createBoundary(bounds.thickness, bounds.length);
    bounds.right = createBoundary(bounds.thickness, bounds.length);
    bounds.bottom = createBoundary(bounds.length, bounds.thickness);

    Matter.World.add(solver.world, [
  /*bounds.top.entity,*/ bounds.left.entity,
        bounds.right.entity,
        bounds.bottom.entity,
    ]);

    var defaultStyles = {
        size: two.width * 0.08,
        weight: 400,
        fill: "white",
        leading: two.width * 0.08 * 0.8,
        family: "Angus, Arial, sans-serif",
        alignment: "center",
        baseline: "baseline",
        margin: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
    };

    addSlogan();
    resize();
    mouse = addMouseInteraction();
    two.bind("resize", resize).bind("update", update);




    /* 
    useEffect(() => {
        let Engine = Matter.Engine
        let Render = Matter.Render
        let World = Matter.World
        let Bodies = Matter.Bodies

        let engine = Engine.create({})

        let render = Render.create({
            element: boxRef.current,
            engine: engine,
            canvas: canvasRef.current,
            options: {
                width: 300,
                height: 300,
                background: 'rgba(255, 0, 0, 0.5)',
                wireframes: false,
            },
        })
    }, []) */


    //TextEffect
    const textEffect = (e) => {
        const target = e.target;
        gsap.to(target, {
            keyframes: [
                { scaleX: 1.3, scaleY: 0.7, duration: 0.2, ease: "power2.out" },
                { scaleX: 1, scaleY: 1, duration: 0.8, ease: "elastic.out(2, 0.5)" }
            ]
        })
    }

    //Nombre Apellido - Efecto de Animacion
    const array = ["C", "é", "s", "a", "r"];
    const array2 = ["A", "r", "t", "e", "a", "g", "a"];
    const mainName = array.map((letter, index) => (
        <span key={index} style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={textEffect} >{letter}</span>
    ))
    const mainLastName = array2.map((letter, index) => (
        <span key={index} style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={textEffect} >{letter}</span>
    ))




    function addMouseInteraction() {
        // add mouse control
        var mouse = Matter.Mouse.create(document.body);
        var mouseConstraint = Matter.MouseConstraint.create(solver, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2
            }
        });

        Matter.World.add(solver.world, mouseConstraint);

        return mouseConstraint;
    }

    function resize() {
        var length = bounds.length;
        var thickness = bounds.thickness;

        // vector.x = two.width / 2;
        // vector.y = - thickness / 2;
        // Matter.Body.setPosition(bounds.top.entity, vector);

        vector.x = -thickness / 2;
        vector.y = two.height / 2;
        Matter.Body.setPosition(bounds.left.entity, vector);

        vector.x = two.width + thickness / 2;
        vector.y = two.height / 2;
        Matter.Body.setPosition(bounds.right.entity, vector);

        vector.x = two.width / 2;
        vector.y = two.height + thickness / 2;
        Matter.Body.setPosition(bounds.bottom.entity, vector);

        var size;

        if (two.width < 480) {
            size = two.width * 0.12;
        } else if (two.width > 1080 && two.width < 1600) {
            size = two.width * 0.07;
        } else if (two.width > 1600) {
            size = two.width * 0.06;
        } else {
            size = two.width * 0.08;
        }

        var leading = size * 0.8;

        for (var i = 0; i < two.scene.children.length; i++) {
            var child = two.scene.children[i];

            if (!child.isWord) {
                continue;
            }

            var text = child.text;
            var rectangle = child.rectangle;
            var entity = child.entity;

            text.size = size;
            text.leading = leading;

            var rect = text.getBoundingClientRect(true);
            rectangle.width = rect.width;
            rectangle.height = rect.height;

            Matter.Body.scale(entity, 1 / entity.scale.x, 1 / entity.scale.y);
            Matter.Body.scale(entity, rect.width, rect.height);
            entity.scale.set(rect.width, rect.height);

            text.size = size / 3;
        }
    }

    function addSlogan() {
        var x = defaultStyles.margin.left;
        var y = -two.height; // Header offset

        for (var i = 0; i < copy.length; i++) {
            var word = copy[i];
            var group = new Two.Group();
            var text = new Two.Text("", 0, 0, defaultStyles);

            group.isWord = true;

            // Override default styles
            if (word.value) {
                text.value = word.value;

                for (var prop in word.styles) {
                    text[prop] = word.styles[prop];
                }
            } else {
                text.value = word;
            }

            var rect = text.getBoundingClientRect();
            var ox = x + rect.width / 2;
            var oy = y + rect.height / 2;

            var ca = x + rect.width;
            var cb = two.width;

            // New line
            if (ca >= cb) {
                x = defaultStyles.margin.left;
                y +=
                    defaultStyles.leading +
                    defaultStyles.margin.top +
                    defaultStyles.margin.bottom;

                ox = x + rect.width / 2;
                oy = y + rect.height / 2;
            }

            group.translation.x = ox;
            group.translation.y = oy;
            text.translation.y = 14;

            var rectangle = new Two.Rectangle(0, 0, rect.width, rect.height);
            // rectangle.fill = 'rgb(255, 50, 50)';
            rectangle.fill =
                "rgba(" +
                255 +
                "," +
                Math.floor(Math.random() * 255) +
                "," +
                Math.floor(Math.random() * 255) +
                "," +
                0.8 +
                ")";
            rectangle.noStroke();
            // rectangle.opacity = 0.75;
            rectangle.visible = true;

            var entity = Matter.Bodies.rectangle(ox, oy, 1, 1);
            Matter.Body.scale(entity, rect.width, rect.height);

            entity.scale = new Two.Vector(rect.width, rect.height);
            entity.object = group;
            entities.push(entity);

            x += rect.width + defaultStyles.margin.left + defaultStyles.margin.right;

            group.text = text;
            group.rectangle = rectangle;
            group.entity = entity;

            group.add(rectangle, text);
            two.add(group);
        }

        Matter.World.add(solver.world, entities);
    }

    function update(frameCount, timeDelta) {
        var allBodies = Matter.Composite.allBodies(solver.world);
        Matter.MouseConstraint.update(mouse, allBodies);
        Matter.MouseConstraint._triggerEvents(mouse);

        Matter.Engine.update(solver);

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            entity.object.position.copy(entity.position);
            entity.object.rotation = entity.angle;
        }
    }

    function createBoundary(width, height) {
        var rectangle = two.makeRectangle(0, 0, width, height);
        rectangle.visible = false;

        rectangle.entity = Matter.Bodies.rectangle(
            0,
            0,
            width,
            height,
            bounds.properties,
        );
        rectangle.entity.position = rectangle.position;

        return rectangle;
    }



    return (
        <div className="wrapper">


            <Menu />


            <div className="hero">
                <h1 className="hero__heading">{mainName}  {mainLastName} </h1>
                {/* <h1 className="menu">
                    <ul>
                        <li  >
                            <Link onMouseEnter={textEffect} to="/">Home</Link>
                        </li>
                        <li>
                            <Link onMouseEnter={textEffect} to="/about">About</Link>
                        </li>
                        <li>
                            <Link onMouseEnter={textEffect} to="/dashboard">Dashboard</Link>
                        </li>
                    </ul>
                </h1> */}
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
        </div >
    );
}

export default Home;