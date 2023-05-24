export default function Footer() {
  return (
    <footer className="flex w-full prose absolute bottom-0 py-4 lg:px-0 md:px-8 px-8">
      <p className="dark:text-zinc-400 text-zinc-700 m-0 text-sm md:ml-16">
        <a
          className="dark:text-zinc-400 dark:hover:text-zinc-100 text-zinc-800 hover:text-zinc-900 duration-300 underline decoration-dotted underline-offset-4"
          href="https://opensource.org/licenses/MIT"
          target={"_blank"}
          rel="noreferrer"
        >
          MIT
        </a>{" "}
        2023-present &#169;{" "}
        <a
          className="dark:text-zinc-400 dark:hover:text-zinc-100 text-zinc-800 hover:text-zinc-900 duration-300 underline decoration-dotted underline-offset-4"
          href="https://github.com/muditg317"
          target={"_blank"}
          rel="noreferrer"
        >
          muditg317
        </a>
      </p>
    </footer>
  );
}