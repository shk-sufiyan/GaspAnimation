"use client";

import Image from 'next/image'
import styles from './page.module.css'
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function Home() {

  useEffect(() => {
    let scroll: any;
    const container_elemtent = document.querySelector("[data-scroll-container]") as HTMLElement
    import("locomotive-scroll").then((locomotiveModule) => {
      scroll = new locomotiveModule.default({
          el: document.querySelector("[data-scroll-container]") as HTMLElement,
          smooth: true,
          tablet: {
            breakpoint: 0
          }
      });
      scroll.on("scroll", ScrollTrigger.update);

      gsap.registerPlugin(ScrollTrigger);


      // tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
      ScrollTrigger.scrollerProxy("#main-section-identifier", {
        scrollTop(value) {
          // return arguments.length ? scroll.scrollTo(value, 0, 0) :    scroll.scroll.instance.scroll.y;
          return arguments.length ? scroll.scrollTo(value, {duration: 0, disableLerp: true}) :    scroll.scroll.instance.scroll.y;
        }, 
        // we don't have to define a scrollLeft because we're only scrolling vertically.
        getBoundingClientRect() {
          return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: container_elemtent.style.transform ? "transform" : "fixed"
      });


      // ignore mobile resize issue to avoid lagging
      ScrollTrigger.config({ ignoreMobileResize: true });

      // animation for first section pin and zoom out
      ScrollTrigger.create({
        trigger:"#scrolling-section-1",
        start:"top top",
        end:"+=400",
        scroller:"#main-section-identifier",
        animation: gsap.fromTo("#scrolling-section-1", {scale: 1, opacity: 1}, {scale: 0.5, opacity: 0, duration: 1}),
        scrub:true,
        pin:true,
        pinType: "transform",
        pinSpacing: false
      })



      // animation for second section pin and color rain
      ScrollTrigger.create({
        trigger:"#scrolling-section-2",
        start:"top top",
        end:"+=1200",
        scroller:"#main-section-identifier",
        animation: gsap.timeline({}).fromTo(".red-bg-color", {scale: 0}, {scale: 90, duration: 1}).fromTo(".blue-bg-color", {scale: 0}, {scale: 90, duration: 1}),
        scrub:true,
        pin:true
      })

      // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
      ScrollTrigger.addEventListener("refresh", () => scroll.update());

      // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
      ScrollTrigger.refresh();
    });

    // `useEffect`'s cleanup phase
    return () => {
        if (scroll) scroll.destroy();
    }
  });

  return (
    <main data-scroll-container>
      <div className={styles.main} id="main-section-identifier">
        <section className={`${styles.first_scroll_section} ${styles.animation_section}`} id="scrolling-section-1">
          <div className={styles.first_section_content}>
            <h1>Welcome to GASP Animation</h1>
            <p>Scroll Down to view the Animation</p>
          </div>
        </section>

        <section className={`${styles.second_scroll_section} ${styles.animation_section}`} id="scrolling-section-2">
          <div className="color-animation red-bg-color"></div>
          <div className="color-animation blue-bg-color"></div>
          <div className={styles.second_section_content}>
            <h1>Now Start with the Colors</h1>
            <p>A beautiful color dance</p>
          </div>
        </section>

        <section className={`${styles.third_scroll_section} ${styles.animation_section}`} id="scrolling-section-3">
          <div className={styles.third_section_content}>
            <h1>Thanks for your view</h1>
            <p>If you like it hit the star and give some credit</p>
          </div>
        </section>
      </div>
    </main>
  )
}
