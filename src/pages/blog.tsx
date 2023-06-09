import { type NextPage } from "next";


const Blog: NextPage = () => {

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center pb-8 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] my-12">
            Blog
          </h1>
        </div>
        {new Array(10).fill(0).map((_, index) => (
          <h1 key={index} data-nav-tab={`${index}`} className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Blog {index}<br />--foo foo {index} foo <br />--foo foo {index} foo <br />--foo foo {index} foo 
          </h1>
        ))}
      </main>
    </>
  );
};

export default Blog;