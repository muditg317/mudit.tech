import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type NextPage } from "next";


const About: NextPage = () => {

  const [show, setShow] = useState(false);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center pb-8 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] my-12">
            About
          </h1>
        </div>
        {/* <AnimatePresence
            mode="popLayout"
          >
          <div>
            {show
              ? (<motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100, transition: {duration: 3} }}
                  key="red"
                  transition={{ type: 'linear', duration: 1 }}
                  className="h-16 w-16 bg-red-500"
                />)
              : (<motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -100, transition: {duration: 1} }}
                  key="blue"
                  transition={{ type: 'linear', duration: 3 }}
                  className="h-16 w-16 bg-blue-500"
                />)
            }
          </div>
        </AnimatePresence>
        <button onClick={() => setShow(s=>!s)} className="w-max h-12 bg-green-700">Toggle</button> */}
        {new Array(10).fill(0).map((_, index) => (
          <h1 key={index} data-nav-tab={`${index}`} className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            About {index}<br />--foo foo {index} foo <br />--foo foo {index} foo <br />--foo foo {index} foo 
          </h1>
        ))}
      </main>
    </>
  );
};

export default About;