import type React from "react";
import Link from "next/link";
import { forwardRef } from "react";
import { useShowAppNoticeOnValue } from "../../../components/ui/AppNotice";
import { ArrowUpRight, CalendarDays, Compass, Globe2, Play, Swords } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { AppPanel } from "../../../components/ui/compositions";
import { HorizontalScroller } from "../../../components/ui/HorizontalScroller";
import { CenteredSpinner } from "../../../components/ui/Spinner";
import { Eyebrow, Heading, SectionTitle } from "../../../components/ui/typography";
import type { CustomMap } from "../../maps/lib/maps-client";
import { mapThumbnailURL } from "../../maps/lib/map-thumbnails";
import { MapCard } from "./maps/MapPanels";

const panelMotion = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.97 },
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
};

type PlayPanelProps = {
  isSingleplayerLoading: boolean;
  queueError: string;
  onDuelsPlay: () => void;
  onSingleplayerPlay: () => void;
  duelDisabled: boolean;
  singleplayerDisabled: boolean;
  queuePaused: boolean;
  playPaused: boolean;
  maintenanceIsActive: boolean;
  primaryButtonLabel: string;
  trendingMaps: CustomMap[];
  trendingMapsLoading: boolean;
  changelogCard: React.ReactNode;
  inboxCard: React.ReactNode;
  donateCard: React.ReactNode;
  socialCard: React.ReactNode;
};

type PlayModeActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone: "duel" | "singleplayer";
  loading?: boolean;
};

const playModeActionButtonClass =
  "w-full min-h-[54px] rounded-2xl px-4 py-0 text-body leading-collapsed transition-transform hover:scale-[1.01] active:scale-[0.98]";

export function PlayModeActionButton({
  tone,
  loading = false,
  children,
  className = "",
  ...props
}: PlayModeActionButtonProps) {
  return (
    <Button
      {...props}
      variant={tone === "duel" ? "primary" : "blue"}
      className={`${playModeActionButtonClass} ${className}`}
      loading={loading}
      icon={<Play fill="currentColor" size={20} />}
    >
      {children}
    </Button>
  );
}

export const PlayPanel = forwardRef<HTMLDivElement, PlayPanelProps>(function PlayPanel({
  isSingleplayerLoading,
  queueError,
  onDuelsPlay,
  onSingleplayerPlay,
  duelDisabled,
  singleplayerDisabled,
  queuePaused,
  playPaused,
  maintenanceIsActive,
  primaryButtonLabel,
  trendingMaps,
  trendingMapsLoading,
  changelogCard,
  inboxCard,
  donateCard,
  socialCard,
}, ref) {
  return (
    <motion.div
      ref={ref}
      key="play"
      {...panelMotion}
      className="atlas-lobby flex w-full max-w-6xl flex-col gap-8 pointer-events-auto sm:gap-10"
    >
      <section className="atlas-hero" aria-labelledby="atlas-hero-title">
        <div className="atlas-hero-copy">
          <Eyebrow>THE WORLD IS YOUR PLAYGROUND</Eyebrow>
          <h1 id="atlas-hero-title">SMALL CLUES.<br /><span>BIG WORLD.</span></h1>
          <p>Real streets. Unexpected places. Follow the clues and see how close you can get.</p>
          <div className="atlas-hero-actions">
            <Button variant="primary" size="lg" loading={isSingleplayerLoading} disabled={singleplayerDisabled} onClick={onSingleplayerPlay} icon={<Compass size={20} />}>LET’S EXPLORE</Button>
            <Link href="/help" className="atlas-how-link">How to play <ArrowUpRight size={16} /></Link>
          </div>
        </div>
        <span className="atlas-hero-caption"><Globe2 size={14} /> YOUR NEXT ADVENTURE IS OUT THERE</span>
      </section>
      <section>
        <Heading as="h2" variant="heading-md" className="atlas-section-title mb-3">CHOOSE YOUR ADVENTURE</Heading>
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QueueModeCard
            queueError={queueError}
            onDuelsPlay={onDuelsPlay}
            duelDisabled={duelDisabled}
            queuePaused={queuePaused}
            playPaused={playPaused}
            maintenanceIsActive={maintenanceIsActive}
            primaryButtonLabel={primaryButtonLabel}
          />
          <SingleplayerModeCard
            isSingleplayerLoading={isSingleplayerLoading}
            singleplayerDisabled={singleplayerDisabled}
            playPaused={playPaused}
            maintenanceIsActive={maintenanceIsActive}
            onSingleplayerPlay={onSingleplayerPlay}
          />
          <DailyQuizModeCard />
        </div>
      </section>

      <HorizontalScroller label="Trending Maps" itemClassName="w-80" viewAllHref="/maps">
        {trendingMapsLoading ? (
          <AppPanel className="flex h-44 w-80 items-center justify-center rounded-2xl">
            <CenteredSpinner label="Loading trending maps" />
          </AppPanel>
        ) : trendingMaps.length ? (
          trendingMaps.map((map) => (
            <MapCard key={map.id} item={map} mode="link" showAuthor={false} thumbnailURL={(item) => mapThumbnailURL(item.thumbnailKey, item.thumbnailVariant)} />
          ))
        ) : (
          <AppPanel className="flex h-44 w-80 items-center justify-center rounded-2xl p-5 text-center text-body-sm font-semibold text-content-secondary">
            No trending maps yet.
          </AppPanel>
        )}
      </HorizontalScroller>

      <section>
        <Heading as="h2" variant="heading-md" className="atlas-section-title mb-3">THE EXPLORER’S DESK</Heading>
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div className="min-w-0">{changelogCard}</div>
          <div className="min-w-0">{inboxCard}</div>
          {socialCard}
          {donateCard}
        </div>
      </section>
    </motion.div>
  );
});

function QueueModeCard(props: {
  queueError: string;
  onDuelsPlay: () => void;
  duelDisabled: boolean;
  queuePaused: boolean;
  playPaused: boolean;
  maintenanceIsActive: boolean;
  primaryButtonLabel: string;
}) {
  useShowAppNoticeOnValue(props.queueError);
  const paused = props.queuePaused || props.playPaused || props.maintenanceIsActive;
  return (
    <AppPanel className="atlas-mode-card lobby-feature-card relative flex min-h-[180px] w-full flex-col gap-4 rounded-2xl p-4 transition-colors duration-emphasis sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-status-success/20 opacity-80 transition-opacity duration-emphasis" />
      <ModeMountains active={false} />
      <Swords className="atlas-mode-icon" aria-hidden="true" />
      <ModeHeading eyebrow="Ranked multiplayer" title="DUELS" subtitle="Same place. Two players. One winner." eyebrowClassName="text-status-success" />

      <div className="relative z-content flex w-full flex-col">
        <PlayModeActionButton tone="duel" onClick={props.onDuelsPlay} disabled={props.duelDisabled}>
          {paused ? "Paused" : props.primaryButtonLabel}
        </PlayModeActionButton>
      </div>
    </AppPanel>
  );
}

function SingleplayerModeCard(props: {
  isSingleplayerLoading: boolean;
  singleplayerDisabled: boolean;
  playPaused: boolean;
  maintenanceIsActive: boolean;
  onSingleplayerPlay: () => void;
}) {
  return (
    <AppPanel className="atlas-mode-card lobby-feature-card relative flex min-h-[180px] w-full flex-col gap-4 rounded-2xl p-4 transition-colors duration-emphasis sm:p-5" style={{ animationDelay: "-2s" }}>
      <div className="pointer-events-none absolute inset-0 bg-status-info/20 opacity-80 transition-opacity duration-emphasis" />
      <ModeMountains hueRotate active={false} />
      <Compass className="atlas-mode-icon" aria-hidden="true" />
      <ModeHeading eyebrow="Solo exploration" title="CLASSIC" subtitle="Take your time. Read the world." eyebrowClassName="text-status-info" />

      <div className="relative z-content w-full">
        <PlayModeActionButton
          tone="singleplayer"
          loading={props.isSingleplayerLoading}
          onClick={props.onSingleplayerPlay}
          disabled={props.singleplayerDisabled}
        >
          {props.isSingleplayerLoading ? "Loading..." : props.playPaused || props.maintenanceIsActive ? "Paused" : "Play"}
        </PlayModeActionButton>
      </div>
    </AppPanel>
  );
}

function DailyQuizModeCard() {
  return (
    <AppPanel className="atlas-mode-card lobby-feature-card relative flex min-h-[180px] w-full flex-col gap-4 rounded-2xl p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-status-warning/20 opacity-80" />
      <div className="relative z-content flex flex-1 flex-col justify-between gap-4">
        <div>
          <Eyebrow className="mb-1 text-status-warning">On the horizon</Eyebrow>
          <SectionTitle className="text-content-primary drop-shadow-md">DAILY QUIZ</SectionTitle>
        </div>
        <Button type="button" variant="secondary" className={playModeActionButtonClass} icon={<CalendarDays size={20} />} disabled>
          Coming soon
        </Button>
      </div>
    </AppPanel>
  );
}

function ModeMountains({ active, hueRotate = false }: { active: boolean; hueRotate?: boolean }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 pointer-events-none h-full transition-opacity duration-emphasis ${active ? "opacity-25" : "opacity-30"}`}>
      <img
        src="/mountains.v1.svg"
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover object-center ${hueRotate ? "opacity-50" : ""}`}
        style={{ objectPosition: "center bottom", filter: hueRotate ? "hue-rotate(190deg)" : undefined }}
      />
    </div>
  );
}

function ModeHeading({
  eyebrow,
  title,
  subtitle,
  eyebrowClassName,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  eyebrowClassName: string;
}) {
  return (
    <div className="relative z-content flex flex-col">
      <Eyebrow className={`mb-1 drop-shadow-sm ${eyebrowClassName}`}>
        {eyebrow}
      </Eyebrow>
      <SectionTitle className="text-content-primary drop-shadow-md">
        {title}
      </SectionTitle>
      {subtitle ? <span className="text-body font-medium text-content-primary drop-shadow-sm">{subtitle}</span> : null}
    </div>
  );
}
