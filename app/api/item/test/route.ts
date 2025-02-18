import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://ec2-54-251-81-183.ap-southeast-1.compute.amazonaws.com:8081/ords/ridbiz/useritemcat/?mkrid=RIDBIZ&cdomain=buyerpanda.com');
  const data = await res.json();
  return NextResponse.json(data);
}
