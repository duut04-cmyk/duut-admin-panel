import DootWordmark from "./DootWordmark";

export default function AdminAuthHeader() {
  return (
    <header className="mb-7 text-center">
      <DootWordmark variant="sans" className="text-[2rem] leading-none" />
      <h1 className="mt-5 text-[1.625rem] font-bold leading-tight tracking-tight text-foreground">
        Welcome back!
      </h1>
      <p className="mt-2 text-[14px] text-muted-foreground">
        Sign in to your Doot admin workspace
      </p>
    </header>
  );
}
