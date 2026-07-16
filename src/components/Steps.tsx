export function Steps({ steps, title = "Passaggi" }: { steps: string[]; title?: string }) {
  if (!steps.length) return null;
  return (
    <div>
      <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>{title}</p>
      <div className="steps-list">{steps.join("\n")}</div>
    </div>
  );
}
