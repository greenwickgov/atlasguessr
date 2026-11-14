import type React from "react";
import Link from "next/link";
import { forwardRef } from "react";
import { ArrowRight, Compass, Globe2, MapPinned, Play, Swords, Users, Sparkles } from "lucide-react";
import { AppCardButton } from "../../../components/ui/compositions";
import { Button } from "../../../components/ui/button";
import { useShowAppNoticeOnValue } from "../../../components/ui/AppNotice";
import type { CustomMap } from "../../maps/lib/maps-client";
import { mapThumbnailURL } from "../../maps/lib/map-thumbnails";
import { MapCard } from "./maps/MapPanels";

export function PlayModeActionButton({ tone, loading = false, children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone: "duel" | "singleplayer"; loading?: boolean }) {
  return <Button {...props} variant={tone === "duel" ? "primary" : "blue"} loading={loading} className={`atlas-button ar-mode-action w-full ${className}`} icon={<Play size={18} fill="currentColor" />}>{children}</Button>;
}

type Props = {
  isSingleplayerLoading: boolean;
  queueError: string;
  onDuelsPlay: () => void;
  onSingleplayerPlay: () => void;
  onPartyPlay: () => void;
  playerName: string;
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

function ExplorerGlobe() {
  return <div className="ar-planet-scene" aria-hidden="true">
    <div className="ar-orbit ar-orbit-one" /><div className="ar-orbit ar-orbit-two" />
    <div className="ar-planet">
      <svg viewBox="0 0 400 400" className="ar-land"><g fill="currentColor">
        <path d="M65 73 107 52 145 65 164 93 152 116 168 135 151 159 121 158 111 190 89 184 77 152 46 135 34 105Z" />
        <path d="m120 193 41-13 30 25 10 35-21 25-9 46-22 31-13-17 4-36-20-28-14-35Z" />
        <path d="m199 86 26-21 25 12 8 17 33-6 38 29 32 4 15 30-35 15-16 27-24-3-6-28-29-9-9-24-24 4-10-20-22 5Z" />
        <path d="m222 147 35 3 24 25 6 38-25 25-8 42-23-15-14-35-24-24-3-34Z" />
        <path d="m314 268 33-12 28 18-5 32-37 10-23-22Z" /><path d="m154 33 25-10 15 18-14 24-25-7Z" />
      </g></svg>
      <div className="ar-globe-grid" /><div className="ar-planet-light" />
      <span className="ar-world-pin ar-world-pin-one"><MapPinned size={24} /></span>
      <span className="ar-world-pin ar-world-pin-two"><MapPinned size={18} /></span>
    </div>
    <div className="ar-planet-shadow" />
    <span className="ar-coordinate ar-coordinate-one">FOLLOW THE CLUES</span><span className="ar-coordinate ar-coordinate-two">FIND YOUR WORLD</span>
  </div>;
}

export const PlayPanel = forwardRef<HTMLDivElement, Props>(function PlayPanel(props, ref) {
  useShowAppNoticeOnValue(props.queueError);
  const paused = props.playPaused || props.maintenanceIsActive;
  return <div ref={ref} className="atlas-lobby ar-home">
    <div className="ar-home-heading"><div><p className="ar-eyebrow">A LITTLE CURIOSITY. A WHOLE PLANET.</p><h1>{props.playerName ? `Welcome back, ${props.playerName}.` : "Your world awaits."}</h1></div><Link href="/help" className="ar-text-link">New here? Learn to play <ArrowRight size={15}/></Link></div>
    <div className="ar-dashboard">
      <aside className="ar-mode-rail" aria-label="Game modes">
        <p className="ar-eyebrow">PICK YOUR ADVENTURE</p>
        <AppCardButton type="button" className="ar-mode ar-mode-classic" onClick={props.onSingleplayerPlay} disabled={props.singleplayerDisabled}>
          <span className="ar-mode-symbol"><Compass size={35}/></span><span className="ar-mode-tag">SINGLEPLAYER</span><strong>Classic</strong><span>Five rounds. One big world.</span><span className="ar-mode-link">{props.isSingleplayerLoading ? "Starting…" : paused ? "Play paused" : "Let's explore"}<ArrowRight size={17}/></span>
        </AppCardButton>
        <AppCardButton type="button" className="ar-mode ar-mode-party" onClick={props.onPartyPlay} disabled={props.singleplayerDisabled}>
          <span className="ar-mode-symbol"><Users size={33}/></span><span className="ar-mode-tag">BETTER TOGETHER</span><strong>Play with friends</strong><span>Create a party. Share the adventure.</span><span className="ar-mode-link">Create or join<ArrowRight size={17}/></span>
        </AppCardButton>
        <AppCardButton type="button" className="ar-mode ar-mode-ranked" onClick={props.onDuelsPlay} disabled={props.duelDisabled}>
          <span className="ar-mode-symbol"><Swords size={32}/></span><span className="ar-mode-tag">COMPETITIVE</span><strong>Ranked duels</strong><span>Go head to head. Climb the ranks.</span><span className="ar-mode-link">{props.queuePaused ? "Queue paused" : "Find a rival"}<ArrowRight size={17}/></span>
        </AppCardButton>
      </aside>
      <section className="ar-world-stage" aria-labelledby="ar-world-title">
        <span className="ar-stage-label"><Globe2 size={14}/> NO PASSPORT REQUIRED</span>
        <ExplorerGlobe />
        <div className="ar-world-copy"><h2 id="ar-world-title">Every road has a story.</h2><p>A mountain pass. A quiet street. A place you've never been.<br/>Look around, follow the clues, and put your pin on the map.</p><Button variant="primary" size="lg" className="ar-explore-button" onClick={props.onSingleplayerPlay} disabled={props.singleplayerDisabled} loading={props.isSingleplayerLoading} icon={<Play size={18} fill="currentColor"/>}>Explore the world</Button><span className="ar-stage-note">Free guest play · No account needed</span></div>
      </section>
      <aside className="ar-discovery-rail" aria-label="Explorer guide">
        <Link className="ar-destination-card" href="/maps"><img src="/atlasrush/alps.jpg" alt="Mountain village beneath the Alps"/><div><span className="ar-eyebrow">TAKE THE SCENIC ROUTE</span><h2>Find your next<br/>favourite place.</h2><span className="ar-mode-link">Discover maps <ArrowRight size={17}/></span></div></Link>
        <div className="ar-explorer-tip"><Sparkles size={22}/><p className="ar-eyebrow">EXPLORER TIP</p><h3>Start with the small things.</h3><p>Road signs, driving direction, plants and architecture can all point you in the right direction.</p><Link href="/help" className="ar-text-link">More ways to find your bearings <ArrowRight size={14}/></Link></div>
        <div className="ar-session-note"><span className="ar-live-dot"/><div><strong>Ready when you are.</strong><p>Solo exploration and private parties are open to guests.</p></div></div>
      </aside>
    </div>
    <section className="ar-map-section" aria-labelledby="ar-maps-title"><div className="ar-section-heading"><div><p className="ar-eyebrow">GO SOMEWHERE NEW</p><h2 id="ar-maps-title">Maps worth getting lost in</h2></div><Link href="/maps" className="ar-text-link">Browse all maps <ArrowRight size={16}/></Link></div><div className="ar-map-grid">{props.trendingMapsLoading ? <p role="status">Finding your next adventure…</p> : props.trendingMaps.length ? props.trendingMaps.slice(0,4).map(map => <MapCard key={map.id} item={map} mode="link" showAuthor={false} thumbnailURL={item=>mapThumbnailURL(item.thumbnailKey,item.thumbnailVariant)}/>) : <p>No maps are available yet. Please check back soon.</p>}</div></section>
  </div>;
});
