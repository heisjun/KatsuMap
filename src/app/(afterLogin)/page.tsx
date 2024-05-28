import Main from "@/app/(afterLogin)/_component/Main";

export default function home() {
  return (
    <div>
      {/* @ts-expect-error Async Server Component */}
      <Main />
    </div>
  );
}
