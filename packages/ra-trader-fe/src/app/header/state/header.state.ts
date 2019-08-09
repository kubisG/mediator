import { State, NgxsOnInit, Store, Selector, StateContext, Action } from "@ngxs/store";
import { HeaderStateModel } from "./header.model";
import { Load, LoadCompleted, IncNewMessages, NewMessagesCount, ClearMessagesCount, SetAlertMessage } from "./header.actions";
import { HeaderItems } from "./header-items";

@State<HeaderStateModel>({
    name: "nav",
    defaults: {
        headerItems: [{ description: "home", url: "/trader" }],
        newMessages: 0,
        alertMessage: undefined,
    }
})
export class HeaderState implements NgxsOnInit {

    constructor(private store: Store) { }

    @Selector()
    static getItems(state: HeaderStateModel): HeaderItems[] {
        return state.headerItems;
    }

    @Selector()
    static getNewMessagesCount(state: HeaderStateModel): number {
        return state.newMessages;
    }

    @Selector()
    static getAlertMessage(state: HeaderStateModel): string {
        return state.alertMessage;
    }

    public ngxsOnInit(ctx: StateContext<HeaderStateModel>) {

    }

    @Action(Load)
    public load(ctx: StateContext<HeaderStateModel>, action: Load) {
        ctx.patchState({ headerItems: action.headerItems });
        ctx.dispatch(new LoadCompleted(action));
    }

    @Action(IncNewMessages)
    public newMessage(ctx: StateContext<HeaderStateModel>, action: IncNewMessages) {
        const msgCount = ctx.getState().newMessages + 1;
        ctx.patchState({ newMessages: msgCount });
        ctx.dispatch(new NewMessagesCount());
    }

    @Action(ClearMessagesCount)
    public clearMessagesCount(ctx: StateContext<HeaderStateModel>, action: ClearMessagesCount) {
        ctx.patchState({ newMessages: 0 });
        ctx.dispatch(new NewMessagesCount());
    }

    @Action(SetAlertMessage)
    public setAlertMessage(ctx: StateContext<HeaderStateModel>, action: SetAlertMessage) {
        ctx.patchState({ alertMessage: action.alertMessage });
    }

}
