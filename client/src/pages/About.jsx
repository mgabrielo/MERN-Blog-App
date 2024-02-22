import React from "react";

export default function About() {
  return (
    <div className=" flex flex-col min-h-screen max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-center w-full my-4">
        About Blog Article
      </h1>
      <p className="italic text-sm md:text-lg font-semibold my-4 px-5">
        The purpose of a blog application created with React is to provide a
        dynamic and interactive platform for users to publish, share, and engage
        with written content. React, as a JavaScript library for building user
        interfaces, enables the creation of a responsive and efficient blog that
        offers a seamless user experience. The application allows authors to
        compose and publish blog posts, readers to explore and comment on
        articles, and administrators to manage content efficiently. By
        leveraging React's component-based architecture, the blog application
        aims to deliver a visually appealing, user-friendly, and engaging
        environment for both content creators and consumers.
      </p>
    </div>
  );
}
