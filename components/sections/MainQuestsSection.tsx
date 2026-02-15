import { MAIN_QUEST_CHAPTERS, QuestStatus } from "@/config/data";
import { toInlineStyle } from "@/lib/utils";
import { ExpandIcon } from "../expand-icon";
import { SectionHeading } from "../SectionHeading";

function QuestStatusMask({ status }: { status: QuestStatus }) {
  if (status === "todo") {
    return <div className="absolute left-0 top-0 z-10 h-full w-full bg-white"></div>;
  }

  if (status === "partial") {
    return <div className="absolute right-0 top-0 h-full w-1/2 bg-white"></div>;
  }

  return null;
}

export function MainQuestsSection() {
  return (
    <div className="h-full w-full" data-main-quests-section="true">
      <SectionHeading title="Main Quests" />

      {MAIN_QUEST_CHAPTERS.map((chapter, chapterIndex) => {
        const triggerId = `chapter-trigger-${chapter.id}-${chapterIndex}`;
        const contentId = `chapter-content-${chapter.id}-${chapterIndex}`;

        return (
          <div key={chapter.id} data-orientation="vertical">
            <div
              data-state={chapter.isOpen ? "open" : "closed"}
              data-orientation="vertical"
              className=""
            >
              <h3
                data-orientation="vertical"
                data-state={chapter.isOpen ? "open" : "closed"}
                className="flex"
              >
                <button
                  type="button"
                  aria-controls={contentId}
                  aria-expanded={chapter.isOpen}
                  data-state={chapter.isOpen ? "open" : "closed"}
                  data-orientation="vertical"
                  id={triggerId}
                  data-main-quest-trigger
                  data-analytics-title={chapter.title}
                  className="[&amp;[data-state=open]&gt;div&gt;div&gt;svg]:rotate-180 group flex flex-1 items-center justify-between py-4 transition-all"
                  data-radix-collection-item=""
                >
                  <div className="flex items-center">
                    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-sm bg-[#e9ecef] p-px transition duration-300 group-hover:bg-zinc-300">
                      <ExpandIcon />
                    </div>
                    <div className="group mx-2 ml-4 flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-zinc-600 hover:text-[#333]">
                      <h3 className="whitespace-nowrap text-xl font-semibold italic">
                        {chapter.title}
                      </h3>
                    </div>
                  </div>
                </button>
              </h3>

              <div
                data-state={chapter.isOpen ? "open" : "closed"}
                id={contentId}
                role="region"
                aria-labelledby={triggerId}
                data-orientation="vertical"
                className="relative w-[105%] overflow-hidden pr-[5%] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                style={toInlineStyle(chapter.panelStyleText)}
                hidden={chapter.isOpen ? undefined : true}
              >
                {chapter.isOpen ? (
                  <div className="pb-4 pt-0">
                    {chapter.items.map((item) => (
                      <div
                        key={`${chapter.id}-${item.text}`}
                        className="group my-3 ml-9 flex items-center"
                      >
                        <div className="relative mr-4 flex h-[22px] w-[22px] items-center justify-center rounded border-2 border-[#e9ecef] bg-[#E9ECEF] p-px transition duration-300 group-hover:border-zinc-300 group-hover:bg-zinc-200">
                          <QuestStatusMask status={item.status} />
                          <CheckIcon status={item.status} />
                        </div>
                        {item.text}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CheckIcon({ status }: { status: QuestStatus }) {
  return (
    <svg
      width="1.5em"
      height="1.5em"
      strokeWidth="3"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color="currentColor"
      className={`relative h-4 w-4 shrink-0 transition-transform duration-200 dark:text-zinc-400 ${
        status === "partial" ? "text-zinc-400" : "text-zinc-500"
      }`}
    >
      <path
        d="M5 13L9 17L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
