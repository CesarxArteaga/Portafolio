import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";

//without this line, PixiPlugin and MotionPathPlugin may get dropped by your bundler (tree shaking)...
gsap.registerPlugin(PixiPlugin, MotionPathPlugin);

const Menu = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        gsap.to(".Menu", { duration: 0, x: -window.innerWidth });
    }, [])

    const showMenu = () => {

        setShow(!show);
        if (show) {
            gsap.to(".Menu", { duration: .2, x: -window.innerWidth });
        } else {
            gsap.to(".Menu", { duration: .2, x: 0 });
        }
    }

    const textEffect = (e) => {
        const target = e.target;
        gsap.to(target, {
            keyframes: [
                { scaleX: 1, scaleY: 0.7, duration: 0.2, ease: "power2.out" },
                { scaleX: 2, scaleY: 1, duration: 0.8, ease: "elastic.out(2, 0.5)" }
            ]
        })
    }


    return (

        <>

            <span className="menuH" style={{ fontSize: 90 }} onClick={showMenu} onMouseEnter={textEffect}>
                ☰
            </span>


            <div className="Menu">


            </div>


        </>
    )

}

export default Menu;