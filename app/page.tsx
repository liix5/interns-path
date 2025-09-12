import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Experiences from "@/components/main/Experiences";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import ExperiencesFeed from "@/components/main/Experiences";
import ExperienceCard from "@/components/Experience/ExperienceCard";

export default function Home() {
  return (
    <div>
      <section className="py-11 mx-8 my-3">
        <div className="container">
          <div className="flex flex-col items-center text-center ">
            <Badge variant="outline">
              حدد طريقك الان
              <ArrowUpLeft className="mr-2 size-4" />
            </Badge>

            <h1 className="my-6 text-pretty text-3xl font-bold lg:text-6xl">
              شارك تجربتك وحدد طريقك
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              شارك تجربتك واقرا تجارب الاخرين لتحدد الاختيار الافضل للتدريب في
              سنه الامتياز
            </p>

            <Button asChild className="w-full justify-center  max-w-lg">
              <a href="/form"> شارك تجربتك</a>
            </Button>
          </div>
        </div>
      </section>
      <hr className="shadow-sm my-4" />
      <section id="experiences" className="  p-6">
        <h2 className="text-2xl text-center  font-bold ">تجارب المستخدمين</h2>

        <Experiences profession={"all"} />
        {/* <ExperiencesFeed profession={profession} page={page} /> */}
      </section>
    </div>
  );
}
