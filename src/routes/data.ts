export const sidebars = {
    chat: [
        {
            title: "Channel",
            list: [{
                name: "random",
                type: 0, //enum public, private, protected
                href: "/chat/id1"
            },
            {
                name: "public",
                type: 0,
                href: "/chat/id2"
            },
            {
                name: "private",
                type: 1,
                href: "/chat/id3"
            },
            {
                name: "protected",
                type: 2,
                href: "/chat/id4"
            }
            ]
        },
        {
            title: "DM",
            list: [{
                name: "jayoon",
                avatar: "avatar_jayoon",
                href: "/chat/dm_id1"
            },
            {
                name: "gyepark",
                avatar: "avatar_gyepark",
                href: "/chat/dm_id2"
            }]
        },
        {
            title: "Friends",
        }
    ],
    game: {}
}