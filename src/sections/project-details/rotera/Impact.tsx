const DEFAULT_CONTENT = (
  <>
    Today this <span className="font-normal">3D modal flow generates</span> a revenue of{" "}
    <span className="font-bold">+€450k per week</span>
    <br />
    Is responsible for x% traffic to IKEA Kreativ
    <br />
    Is responsible for x% traffic to IKEA Planners
  </>
);

type ImpactProps = {
  /** Optional section title. Default "Impact". */
  title?: string;
  /** Optional custom content. When set, only this text is shown instead of the default metrics. */
  content?: string;
};

export function Impact({ title = "Impact", content }: ImpactProps) {
  const body = content ? (
    <p className="text-xl leading-[28px] text-muted-foreground whitespace-pre-line">{content}</p>
  ) : (
    <p className="text-xl leading-[28px] text-muted-foreground">{DEFAULT_CONTENT}</p>
  );

  return (
    <div data-reveal="impact" className="flex gap-6 md:gap-12 items-start py-8 min-w-0">
      <div className="bg-[#f0f0f3] dark:bg-muted flex gap-4 items-center p-4 rounded-md w-full max-w-[960px] min-w-0">
        <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
          <div className="flex items-center justify-start relative shrink-0 w-full">
            <p className="font-sans text-base font-semibold leading-6 text-foreground">
              {title}
            </p>
          </div>
          <div className="flex items-center justify-start relative shrink-0 w-full">
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}

