import LoadingSpinner from "./_component/LoadingSpinner";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <LoadingSpinner />
    </div>
  );
}
