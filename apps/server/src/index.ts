import { reconcileKickSubscriptions } from "@VISP/api/chat/kick";
import { app } from "./app";
import { startReconciler } from "./machine";

app.listen({ hostname: "127.0.0.1", port: 3000 }, () => {
	console.log("Server is running on http://127.0.0.1:3000");
});
startReconciler();
void reconcileKickSubscriptions().catch((error) => {
	console.error("Kick chat subscription reconciliation failed", error);
});
