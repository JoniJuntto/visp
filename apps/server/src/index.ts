import { reconcileKickSubscriptions } from "@VISP/api/chat/kick";
import { env } from "@VISP/env/server";
import { app } from "./app";
import { startReconciler } from "./machine";

app.listen({ hostname: env.SERVER_HOST, port: env.PORT }, () => {
	console.log(`Server is running on http://${env.SERVER_HOST}:${env.PORT}`);
});
startReconciler();
void reconcileKickSubscriptions().catch((error) => {
	console.error("Kick chat subscription reconciliation failed", error);
});
