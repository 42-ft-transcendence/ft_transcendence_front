interface Channel {
    avatar: string;
    name: string;
    timestamp: Date;
    message: string;
}
export const channel: {title: string,total: number, channel: Channel[]} = {
    title: "Channel Name",
    total: 12,
    channel: [
        {
            avatar: "Jane_avatar",
            name: "Jane",
            timestamp: new Date("2023/07/18 20:12:1"),
            message: "I've been looking for a job for almost 3 months now."
        },
        {
            avatar: "Michael_avatar",
            name: "Michael",
            timestamp: new Date("2023/07/18 20:12:32"),
            message: "Hang in there. nill . you 'll find something."
        },
        {
            avatar: "Jane_avatar",
            name: "Jane",
            timestamp: new Date("2023/07/18 20:12:33"),
            message: "at this point, I think I'd just take any job."
        },
        {
            avatar: "Michael_avatar",
            name: "Michael",
            timestamp: new Date("2023/07/18 20:13:15"),
            message: "There's an opening at my office, but the pay is low."
        },
        {
            avatar: "Jane_avatar",
            name: "Jane",
            timestamp: new Date("2023/07/18 20:13:41"),
            message: "what sort of job is it?"
        },
        {
            avatar: "Michael_avatar",
            name: "Michael",
            timestamp: new Date("2023/07/18 20:25:22"),
            message: "Just a mailroom clerk. are you interested?"
        },
        {
            avatar: "Jane_avatar",
            name: "Jane",
            timestamp: new Date("2023/07/18 20:26:01"),
            message: "you bet, like i said, I'll do anything."
        },
        {
            avatar: "Michael_avatar",
            name: "Michael",
            timestamp: new Date("2023/07/18 20:25:22"),
            message: "ok. then let me talk to my boss about it."
        }
    ]
}