export default function Footer() {
  return (
    <footer className="absolute bottom-0 flex w-full px-8 py-4 prose lg:px-0 md:px-8">
      <p className="m-0 text-sm dark:text-zinc-400 text-zinc-700 md:ml-16">
        <a
          className="underline duration-300 dark:text-zinc-400 dark:hover:text-zinc-100 text-zinc-800 hover:text-zinc-900 decoration-dotted underline-offset-4"
          href="https://opensource.org/licenses/MIT"
          target={"_blank"}
          rel="noreferrer"
        >
          MIT
        </a>{" "}
        2023-present &#169;{" "}
        <a
          className="underline duration-300 dark:text-zinc-400 dark:hover:text-zinc-100 text-zinc-800 hover:text-zinc-900 decoration-dotted underline-offset-4"
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