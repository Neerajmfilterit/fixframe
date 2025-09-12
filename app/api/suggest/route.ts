import { NextResponse } from "next/server";

export async function POST(req: Request){
  const body = await req.json().catch(()=>({}));
  // Very simple rule-based "AI" for hackathon demo
  const needsTrend = !body.widgets?.some((w: any)=> w.type === "TimeSeries");
  const needsDonut = !body.widgets?.some((w: any)=> w.type === "Donut");
  const recs = [];
  if (needsTrend) recs.push({ type: "TimeSeries", reason: "No time series trend present" });
  if (needsDonut) recs.push({ type: "Donut", reason: "Source split not visible" });
  if (!body.widgets?.some((w: any)=> w.type === "KPI")) recs.push({ type: "KPI", reason: "Key totals missing" });
  return NextResponse.json({ recommendations: recs });
}
