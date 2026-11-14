import LobbyRoutePage from "../../features/home/page/LobbyRoutePage";
import { getLobbyLayout } from "../../features/home/page/LobbyApplicationLayout";
import type { NextPageWithLayout } from "../_app";
import { cachedPage } from "../../lib/cached-page";

export const getStaticProps = cachedPage();

const MapUploadRoute: NextPageWithLayout = function MapUploadRoute() {
  return (
    <LobbyRoutePage
      title="AtlasRush | Upload Map"
      description="Upload a custom AtlasRush map."
      canonicalPath="/maps/upload"
    />
  );
};

MapUploadRoute.getLayout = getLobbyLayout;

export default MapUploadRoute;
