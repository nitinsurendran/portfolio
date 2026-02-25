import { Separator } from "@/components/ui/separator";
import { workHistory } from "@/data/workHistory";

export function AboutWorkHistory() {
  return (
    <div data-reveal="workHistory" className="flex flex-col gap-0 min-w-0 w-full">
      <div className="flex flex-col gap-0">
        {workHistory.map((entry, index) => (
          <div key={entry.company + index}>
            {index > 0 && <Separator className="my-6 md:my-8" />}
            <div className="flex flex-col gap-1">
              <p className="font-sans text-xl font-semibold leading-7 text-foreground">
                {entry.company}
              </p>
              <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
                {entry.role} · {entry.dates}
              </p>
              <p className="font-sans text-base font-normal leading-6 text-foreground mt-1">
                {entry.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Education section */}
      <Separator className="my-6 md:my-8" />
      <Separator className="mb-4 md:mb-6" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-sans text-xs font-medium tracking-[0.12em] text-muted-foreground">
            EDUCATION
          </p>
          <div className="flex flex-col gap-1">
            <p className="font-sans text-xl font-semibold leading-7 text-foreground">
              Copenhagen Institute of Interaction Design (CIID)
            </p>
            <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
              Master's Interaction Design Programme, Feb 2020 - March 2021
            </p>
          </div>
          <div className="flex flex-col gap-1 mt-3">
            <p className="font-sans text-xl font-semibold leading-7 text-foreground">
              Visvesvaraya Technological University (REVA University)
            </p>
            <p className="font-sans text-base font-normal leading-6 text-muted-foreground">
              B.Tech in Electrical and Electronics Engineering, 2011 - 2015
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
