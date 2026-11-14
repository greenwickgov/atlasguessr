import LobbyRoutePage from "../features/home/page/LobbyRoutePage";
import { getLobbyLayout } from "../features/home/page/LobbyApplicationLayout";
import type { NextPageWithLayout } from "./_app";
import { leaderboardKey, requestLeaderboard } from "../features/lobby/lib/leaderboard";
import { cachedPage } from "../lib/cached-page";

export const getStaticProps = cachedPage(async (_context, queries) => {
  queries.setQueryData(leaderboardKey(""), await requestLeaderboard());
  return {};
});

const TopPage: NextPageWithLayout = function TopPage() {
  return (
    <LobbyRoutePage
      title="AtlasRush | Leaderboard"
      description="Browse the AtlasRush ranked leaderboard."
      canonicalPath="/top"
    />
  );
};

TopPage.getLayout = getLobbyLayout;

export default TopPage;
