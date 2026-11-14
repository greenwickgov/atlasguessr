# AtlasRush upstream and licence

This is a modified distribution of https://github.com/sourcelocation/geoduels

Base revision: a3dde5b451bb0334bf18db6bcc4e1ff85086a05f
Upstream branch: master. Retrieved 14 November 2026.

Original authors: sourcelocation and GeoDuels contributors. Original copyright and AGPL-3.0-only licence are retained. AtlasRush UI modifications are also distributed under AGPL-3.0-only. Added Sensa artwork retains its MIT licence, and Barlow Condensed retains its SIL Open Font License. The bundled alpine image was obtained from https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1.

Modifications: purple theme tokens; starry application backdrop; AtlasRush wordmark and lobby hero; rounded navigation and buttons; display typography; mode card presentation; purple timer accent; Sensa chat artwork using existing network emote IDs; source/credit page and footer; fork documentation; removal of the default upstream donation link from environment defaults; fork-safe release guard and CI on main; source URL build argument passed through Compose to the web image.

The backend and game/network logic have not been rewritten or replaced. This is the complete actual upstream project, not the earlier independent Node/SQLite implementation. The original game services, database migrations, websocket gateway, matchmaking, party system, community map system, OAuth accounts and optional extension are included.

AGPL source obligations continue to apply when modifying or hosting this project. Publish your corresponding modified source and set NEXT_PUBLIC_SOURCE_URL to that repository before network deployment. Do not remove upstream attribution or licensing. The source URL page is /source.

Additional no-key adaptation: replaced the v1 API-key Street View URL builder with a public share iframe URL using only the existing panorama ID; switched guessing/results tiles from Google to attributed OpenStreetMap tiles; added two tests for the embed boundary and camera/token validation. The existing backend/bootstrap key field is retained for protocol compatibility, but the AtlasRush renderer does not use it. The backend remains unchanged.
