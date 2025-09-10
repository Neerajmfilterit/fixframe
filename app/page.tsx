import dynamic from "next/dynamic";
const UltimateWireframeBuilder = dynamic(() => import("../components/UltimateWireframeBuilder"), { ssr: false });

export default function Page(){
  return <UltimateWireframeBuilder/>;
}
