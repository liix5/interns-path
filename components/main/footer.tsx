import { Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-card py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-5">
          {/* Contact Header */}
          <p className="text-sm text-foreground/50">تواصل معنا</p>

          {/* Social Links - Stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
            <a
              href="https://x.com/internspathSA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors min-h-[20px]"
            >
              <XIcon className="w-4 h-4 flex-shrink-0" />
              <span>@internspathSA</span>
            </a>
            <a
              href="https://www.instagram.com/internspathsa/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors min-h-[20px]"
            >
              <InstagramIcon className="w-4 h-4 flex-shrink-0" />
              <span>@internspathsa</span>
            </a>
            <Link
              href="mailto:internspath@gmail.com"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors min-h-[20px]"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>internspath@gmail.com</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-border" />

          {/* Brand + Copyright */}
          <p className="text-sm text-foreground/50">© {year} Interns Path</p>
        </div>
      </div>
    </footer>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
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

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
        fill="currentColor"
      />
    </svg>
  );
}
