import { protectedProcedure, publicProcedure, router } from "../index";
import { channelRouter } from "./channel";
import { chatRouter } from "./chat";
import { relayRoutes } from "./relay";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	chat: chatRouter,
	channel: channelRouter,
	...relayRoutes,
});
export type AppRouter = typeof appRouter;
