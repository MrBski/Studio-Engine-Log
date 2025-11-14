import type { SVGProps } from "react";

export function SeaPilotLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 20a2.4 2.4 0 0 0 2 0l1.41-1.41L7.5 21l3.09-3.09L13.5 21l3.09-3.09L19.5 21l2.09-2.09A2.4 2.4 0 0 0 22 18V7.5l-2-2.5-2-2.5-2-2.5-2-2.5L12 2 9.5 4.5 7.5 7 5.5 9.5 3.5 12 2 14.5V20Z"/>
      <path d="M12 11.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
      <path d="M12 2v2.5"/>
      <path d="m3.5 12-2.5 2.5"/>
      <path d="M22 7.5l-2.5 2.5"/>
    </svg>
  );
}
