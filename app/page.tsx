import { DividerDot } from "@/components/divider-dot";
import { CodeXml } from "lucide-react";
import {
  Cal,
  InstagramLogo,
  LinkedInBrandMark,
  ShopifyGlyph,
  SpotifyTrackThumb,
  XLogo,
} from "@/components/icons";
import { ExperimentsSection } from "@/components/sections/ExperimentsSection";
import { MainQuestsSection } from "@/components/sections/MainQuestsSection";
import { ProductionWorkSection } from "@/components/sections/ProductionWorkSection";
import { SocialLinksSection } from "@/components/sections/SocialLinksSection";
import { DATA } from "@/config/data";
import { CurrentTime } from "@/components/current-time";
import { getAgeText } from "@/lib/age";

export default function Home() {
  return (
    <div className="flex h-full min-h-screen justify-center bg-white py-20 text-[1rem] text-[#525456] md:text-[1.1rem]">
      <div className="h-full w-[90%] md:w-3/4 lg:w-1/2">
        <header>
          <div className="flex">
            <div className="flex-1">
              <h1 className="vulf-mono text-[1.5rem] font-medium italic text-black">Om Sharma</h1>
              <h2>I breath code and ship code in production .</h2>
            </div>
            <button
              type="button"
              aria-label="Profile picture"
              className="cursor-pointer"
              data-analytics-event="profile_picture_clicked"
              data-analytics-properties='{"section":"header","element":"profile_picture"}'
            >
              <img
                src="https://i.ibb.co/m56MYLYY/Om-Profile.jpg"
                alt="Om Profile"
                className="border-3 h-[70px] w-[100px] rounded-sm border-dashed border-[#e9ecef] object-cover object-top"
                loading="eager"
              />
            </button>
          </div>
        </header>

        <main className="h-full w-full">
          <div className="my-5 flex w-full items-center">
            <div className="h-[2px] flex-1 rounded-full bg-[#e9ecef]"></div>
            <h4 className="vulf-mono mx-2 text-sm font-normal italic text-zinc-300">Highlights</h4>
            <div className="h-[2px] w-[5%] rounded-full bg-[#e9ecef]"></div>
          </div>
          
          <div className="flex flex-wrap items-start leading-[180%]">
            <h3>Built</h3>{" "}
            <a
              href={DATA.featuredProjects.collabydraw.href}
              target="_blank"
              data-analytics-label="🏆 Collabydraw [Link Click]"
            >
              <div className="group mx-2 flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-[#6965db] hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">
                  Collabydraw
                </h3>
              </div>
            </a>
            <h3>Recognized by </h3>
            <a href={DATA.highlights[0].url} target="_blank" data-analytics-label="🏆 Excalidraw [Link Click]">
              <div className="group mx-2 flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-[#6965db] hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">
                  Excalidraw
                </h3>
              </div>
            </a>
            <span>and</span>
            <a href={DATA.highlights[1].url} target="_blank" data-analytics-label="🏆 Harkirat Singh [Link Click]">
              <div className="group mx-2 flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-[#aaa] hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">
                  Harkirat Singh.
                </h3>
              </div>
            </a>
          </div>

          <div className="mt-3 flex flex-wrap items-start leading-[180%]">
            <h3>Recommended by</h3>{" "}
            <a
              href={DATA.highlights[0].url}
              target="_blank"
              data-analytics-label="🏆 Maker of the year [Link Click]"
            >
              <div className="group mx-2 flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-[#1f54c4] hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">
                  Parth Amin
                </h3>
                <img
                  src={LinkedInBrandMark}
                  alt="Producthunt Logo"
                  className="rounded-[2px] ml-2"
                  height="22"
                  width="22"
                />
              </div>
            </a>
            <h3>Founder & CEO.</h3>
          </div>

          <div className="mt-3 flex flex-wrap items-start leading-[180%]">
            <h3>Won a bounty in </h3>
            <a href={DATA.highlights[3].url} target="_blank" data-analytics-label="🏆 Solana Hackathon [Link Click]">
              <div className="group mx-2 flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-[#aaa] hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">Solana Hackathon</h3>
              </div>
            </a>
          </div>

          <div className="mt-3 flex flex-wrap items-start leading-[180%]">
            <h3 className="mr-2">Major Products:</h3>{" "}
            <a
              href={DATA.featuredProjects.codeClip.href}
              target="_blank"
              data-analytics-label="🔗 CodeClip [Link Click]"
            >
              <div className="group flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-orange-500 hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">CodeClip</h3>
                <img
                  src={DATA.featuredProjects.codeClip.iconImage}
                  alt="CodeClip Logo"
                  className="ml-2 rounded-[4px]"
                  height="22"
                  width="22"
                />
              </div>
            </a>
            <h4 className="mx-2">,</h4>
            <a
              href={DATA.featuredProjects.superGitSight.href}
              target="_blank"
              data-analytics-label="🔗 SuperGitSight [Link Click]"
            >
              <div className="group flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-[#d97757] hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">SuperGitSight</h3>
                <img
                  src={DATA.featuredProjects.superGitSight.iconImage}
                  alt="SuperGitSight Logo"
                  className="undefined ml-2"
                  height="22"
                  width="22"
                />
              </div>
            </a>
          </div>
          <div className="mt-3 flex flex-wrap items-start leading-[180%]">
            <h3>have an idea?</h3>{" "}
            <a
              href={`mailto:${DATA.contact.email}`}
              target="_blank"
              data-analytics-label="📫 Email [Button Click]"
            >
              <div className="group ml-2 flex items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-[#aaa] hover:text-[#333]">
                <h3 className="whitespace-nowrap font-semibold">{DATA.contact.email}</h3>
              </div>
            </a>
          </div>
          <div className="my-5 flex w-full items-center">
            <div className="h-[2px] flex-1 rounded-full bg-[#e9ecef]"></div>
            <h4 className="vulf-mono mx-2 text-sm font-normal italic text-zinc-300">Me Info</h4>
            <div className="h-[2px] w-[5%] rounded-full bg-[#e9ecef]"></div>
          </div>
          <div className="flex flex-wrap items-center leading-[180%]">
            <h4>🇮🇳 Based in Bhilwara, Rajasthan, India </h4>
            <DividerDot />
            <CurrentTime className="uppercase" />
          </div>
          <div className="mt-3 flex flex-wrap items-center leading-[180%]">
            <h4>Birthday: June 20, 2001</h4>
            <DividerDot />
            <h4 className="italic">{getAgeText(new Date(2001, 5, 20))}</h4>
          </div>
          <div className="mt-3 flex items-center">
            <h4>Besides programming I also enjoy building SaaS products and exploring Web3 and AI</h4>
          </div>
          <div className="mt-3 flex flex-wrap items-start leading-[180%]">
            <h4>Last listened to </h4>
            <a
              href="https://open.spotify.com/track/0KtHnXQjYkHNDsjTX3XqLc"
              target="_blank"
              data-analytics-label="🎵 Spotify song [Link Click]"
            >
              <div className="group mx-2 flex flex-1! items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-[#aaa] hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">
                  Bhaag Milkha Bhaag
                </h3>
                <img
                  src={SpotifyTrackThumb}
                  alt="Spotify Song Thumbnail"
                  className="animate animate-spin-slow ml-2 rounded-full animate-spin"
                  height="22"
                  width="22"
                />
              </div>
            </a>
            <h4 className="ml-1">about 69 minutes ago</h4>
          </div>
          <div className="mt-3 flex flex-wrap items-start leading-[180%]">
            <h4>I share my stuff on </h4>
            <a
              href={DATA.contact.social.X}
              target="_blank"
              data-analytics-label="🚀 Twitter [Link Click]"
            >
              <div className="group mx-2 flex flex-1! items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-black hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">Twitter / X</h3>
                <img
                  src={XLogo}
                  alt="X Logo"
                  className="ml-2 rounded"
                  height="22"
                  width="22"
                />
              </div>
            </a>
            <h4 className="mr-2">&amp; reels on</h4>
            <a
              href={DATA.contact.social.Instagram}
              target="_blank"
              data-analytics-label="🚀 Instagram [Link Click]"
            >
              <div className="group flex flex-1! items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-[#E26548] hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">Instagram</h3>
                <img
                  src={InstagramLogo}
                  alt="Instagram Logo"
                  className="undefined ml-2"
                  height="22"
                  width="22"
                />
              </div>
            </a>
          </div>
          <div className="mt-3 flex flex-wrap items-start leading-[180%]">
            <h4>Schedule a call? </h4>
            <a
              href="https://cal.com/om-sharma/30-min"
              target="_blank"
              data-analytics-label="📆 Book Call [Button Click]"
            >
              <div className="group ml-2 flex flex-1! items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-black hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">Calendar</h3>
                <img
                  src={Cal}
                  alt="Cal Logo"
                  className="undefined ml-2"
                  height="22"
                  width="22"
                />
              </div>
            </a>
          </div>
          <div className="mt-3 flex flex-wrap items-start leading-[180%]">
            <h4>My resumes for </h4>
            <a
              href={DATA.contact.social.Resume.fullstack}
              target="_blank"
              data-analytics-label="📄 Full Stack Resume [Link Click]"
            >
              <div className="group mx-2 flex flex-1! items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-black hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">Full Stack</h3>
                <div className="ml-2 flex h-[22px] w-[22px] items-center justify-center rounded bg-black">
                  <CodeXml className="h-3.5 w-3.5 text-white" strokeWidth={2.25} />
                </div>
              </div>
            </a>
            <h4 className="mr-2">&amp; for</h4>
            <a
              href={DATA.contact.social.Resume.shopify}
              target="_blank"
              data-analytics-label="📄 Shopify Resume [Link Click]"
            >
              <div className="group flex flex-1! items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-[#95bf47] hover:text-[#333]">
                <h3 className="undefined whitespace-nowrap font-semibold italic">Shopify</h3>
                <img
                  src={ShopifyGlyph}
                  alt="Shopify Logo"
                  className="ml-2 rounded"
                  height="22"
                  width="22"
                />
              </div>
            </a>
          </div>
          <ExperimentsSection />
          <ProductionWorkSection />
          <MainQuestsSection />
          <SocialLinksSection />
        </main>

        <footer className="mt-5">
          <div className="flex w-full items-center">
            <div className="h-[2px] flex-1 rounded-full bg-[#e9ecef]"></div>
            <h4 className="vulf-mono mx-2 text-sm font-medium italic text-zinc-600"><span className="text-[10px]">©</span> 2026 Ommm</h4>
            <div className="h-[2px] w-[5%] flex-1 rounded-full bg-[#e9ecef]"></div>
          </div>

          <div className="vulf-mono mt-2 flex items-center justify-center text-center text-xs font-medium italic text-zinc-500">
            thanks for visiting
            <DividerDot />
            <a href="/analytics" data-analytics-label="📊 Site Analytics [Link Click]">
              <span className="border-b border-dashed border-zinc-300 transition duration-300 hover:border-blue-400">
                site analytics
              </span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
