export default function LogTable({ logs }){
  return (
    <div className="max-h-80 overflow-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-left"><th>Time</th><th>Message</th></tr></thead>
        <tbody>
          {logs.map((l,i)=>(
            <tr key={i} className="border-t">
              <td className="whitespace-nowrap">{new Date(l.t).toLocaleTimeString()}</td>
              <td>{l.msg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}