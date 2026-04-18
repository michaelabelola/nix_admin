import type {NixID} from "#/models/Models.ts";
import {UserRequest} from "#/modules/user/api.hook.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar.tsx";
import {Skeleton} from "#/components/ui/skeleton.tsx";
import {Item} from "#/components/ui/item.tsx";
import {type UserModel} from "#/modules/user/Models.ts";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger
} from "#/components/ui/popover.tsx";

function Cell1(props: { id: NixID }) {
    const {data: user, isLoading, error} = UserRequest.useGetUser(props.id)

    if (isLoading)
        return <div>
            <Skeleton className="h-8 w-8 rounded-lg"/>
        </div>

    if (error)
        return <div>{error.message}</div>


    return <Cell2 user={user}/>;
}

function Cell2({user}: { user?: UserModel.User }) {
    if (!user)
        return <div>
            <Skeleton className="h-8 w-8 rounded-lg"/>
        </div>

    return (
        <Item variant={"default"} className={"flex flex-row justify-center gap-2 rounded-lg p-2 flex-nowrap"}>
            <Avatar className="h-5 w-5 rounded-lg grayscale">
                <AvatarImage src={user?.avatar} alt={`${user?.firstname}'s avatar`} className={"object-cover"}/>
                <AvatarFallback className="rounded-lg">{user?.firstname}</AvatarFallback>
            </Avatar>
            <div>{`${user?.firstname} ${user?.lastname}`}</div>
        </Item>
    );
}

function Cell1WithPopover(props: { id: NixID }) {
    const {data: user, isLoading, error} = UserRequest.useGetUser(props.id)

    if (isLoading)
        return <div>
            <Skeleton className="h-8 w-8 rounded-lg"/>
        </div>

    if (error)
        return <div>{error.message}</div>


    return <Cell2WithPopOver user={user}/>;
}

function Cell2WithPopOver({user}: { user?: UserModel.User }) {
    // const auth = useAuthenticatedUser()
    // if (!auth.user?.orgID || !user)
    //     return <Cell2 user={user}/>

    return <Popover>
        <PopoverTrigger>
            <Cell2 user={user}/>
        </PopoverTrigger>
        <PopoverContent>
            <CellPopoverContent user={user}/>
        </PopoverContent>
    </Popover>
}

function CellPopoverContent({user}: { user?: UserModel.User }) {
    const {data: detailedUser, isLoading, error} = UserRequest.useGetDetailedUser(user?.id as any)
    if (error) return <Cell2 user={user}/>

    return isLoading ? <Skeleton className="h-8 w-full"/> :
        <PopoverHeader>
            <PopoverTitle>{detailedUser?.bio}</PopoverTitle>
            <PopoverDescription>{detailedUser?.bio}</PopoverDescription>
        </PopoverHeader>

}

const UserCell = {
    Cell1,
    Cell2,
    Cell1WithPopover,
    Cell2WithPopOver

}

export default UserCell;