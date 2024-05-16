import { createRouteHandler } from "uploadthing/next";

import { UPLOADTHING_APP_ID, UPLOADTHING_SECRET } from "../../config";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: UPLOADTHING_APP_ID,
    uploadthingSecret: UPLOADTHING_SECRET,
  },

  // Apply an (optional) custom config:
  // config: { ... },
});
