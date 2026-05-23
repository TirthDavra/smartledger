export default function Header() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-semibold">
        SmartLedger
      </h1>

      <div className="text-sm text-muted-foreground">
        Welcome back
      </div>
    </header>
  );
}