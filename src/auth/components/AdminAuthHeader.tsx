import DootWordmark from "./DootWordmark";

export default function AdminAuthHeader() {
  return (
    <header className="mb-7 text-center lg:landscape:max-xl:mb-5 xl:mb-7">
      <DootWordmark
        variant="sans"
        className="text-[2rem] leading-none lg:landscape:max-xl:text-[1.5rem] xl:text-[2rem]"
      />
      <h1 className="mt-5 text-[1.625rem] font-bold leading-tight tracking-tight text-foreground lg:landscape:max-xl:mt-3 lg:landscape:max-xl:text-[1.25rem] xl:mt-5 xl:text-[1.625rem]">
        Welcome back!
      </h1>
      <p className="mt-2 text-[14px] text-muted-foreground lg:landscape:max-xl:mt-1.5 lg:landscape:max-xl:text-[12px] xl:mt-2 xl:text-[14px]">
        Sign in to your Doot admin workspace
      </p>
    </header>
  );
}
