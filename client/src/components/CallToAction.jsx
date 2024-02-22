import { Button } from "flowbite-react";
import React from "react";

export default function CallToAction() {
  return (
    <div className=" flex flex-col sm:flex-row p-3 border border-teal-500 justify-center rounded-tl-3xl rounded-br-3xl gap-3 items-center ">
      <div className="flex flex-col xs:flex-row p-3">
        <h2 className="my-2">Want to Learn more About JavaScript</h2>
        <p className="my-2">Check out new resources from Greys Blog</p>
        <Button
          gradientDuoTone={"purpleToPink"}
          className="rounded rounded-tl-none"
        >
          <a
            href="https://github.com/mgabrielo"
            target="__blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </Button>
      </div>
      <div>
        <img
          src={
            "https://cdn.pixabay.com/photo/2018/01/17/20/22/analytics-3088958_1280.jpg"
          }
          about="call-to-action"
          className="rounded-md  w-full max-h-[350px] object-cover"
        />
      </div>
    </div>
  );
}
