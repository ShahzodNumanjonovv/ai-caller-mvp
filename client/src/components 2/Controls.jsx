export default function Controls({ running, busy, onStart, onStop, onRefresh, onReset }){
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="px-3 py-1 rounded-full text-sm bg-gray-100">
        State: {running ? "Running" : "Stopped"} {busy ? "(Dialing...)" : ""}
      </span>
      <button className="btn" onClick={onStart} disabled={running}>Start Campaign</button>
      <button className="btn" onClick={onStop} disabled={!running}>Stop</button>
      <button className="btn" onClick={onRefresh}>Refresh</button>
      <button className="btn bg-red-600" onClick={onReset}>Reset Leads</button>
    </div>
  );
}