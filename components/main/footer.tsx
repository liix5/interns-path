import { Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-card py-6">
      <div className="container mx-auto flex flex-col items-center justify-between text-sm text-foreground/80 gap-4">
        {/* Year + Brand */}
        <p>{year} Interns Path©</p>

        {/* Contact Email */}
        <div className="flex text-xs gap-1">
          <span>تواصل معنا: </span>

          <Link
            href="mailto:internspath@gmail.com"
            className="flex items-center gap-1 hover:text-primary"
          >
            internspath@gmail.com
            <Mail className="w-4 h-4" />
          </Link>
        </div>

        {/* Designer credit */}
        <div className="flex text-xs gap-1">
          تصميم وتطوير{" "}
          <a
            href="https://x.com/ot_layan5"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-primary flex items-center gap-1"
          >
            <span>@ot_layan5</span>
            <XIcon className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 1200 1227"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
        fill="currentColor"
      />
    </svg>
  );
}
